// Remote MCP server — https://portfolio.lockhart.in/mcp
//
// The server-side twin of src/webmcp.ts: the same two tools (ask JenAI,
// list the portfolio sections), reachable by any MCP client over the
// Streamable HTTP transport instead of only by in-browser agents.
//
// Stateless by design: every POST carries one JSON-RPC message and gets a
// plain application/json reply, so there is no session id and no SSE
// stream (both optional in the spec). GET (the server→client stream) is
// answered 405, which the spec allows for servers that never push.
//
// https://modelcontextprotocol.io/specification/2025-11-25/basic/transports

import { SECTIONS } from '../../src/persona/personas.ts';

const SITE = 'https://portfolio.lockhart.in';

// Newest first; a client asking for any of these gets it echoed back,
// anything else is offered the newest (per the lifecycle negotiation rules).
export const PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26'];

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, mcp-protocol-version, mcp-session-id',
};

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface ToolResult {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

const text = (value: string, isError = false): ToolResult => ({
  content: [{ type: 'text', text: value }],
  isError,
});

const sectionTitle = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Ask the JenAI backend one question and collect its NDJSON stream into a
// single answer. Buffers on newlines, so an object split across network
// chunks is reassembled instead of dropped.
async function askJenai(question: string): Promise<ToolResult> {
  const base = Deno.env.get('REACT_APP_ASSISTANT_API_BASE_URL');
  if (!base) {
    return text('JenAI backend is not configured on this deployment.', true);
  }

  const response = await fetch(`${base}/chat/stream`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: question,
      history: { messages: [] },
      message_id: crypto.randomUUID(),
    }),
  });
  if (!response.ok || !response.body) {
    return text(`JenAI backend returned HTTP ${response.status}.`, true);
  }

  let answer = '';
  let buffer = '';
  const collect = (line: string) => {
    if (!line.trim()) return;
    try {
      answer += JSON.parse(line)?.message?.content ?? '';
    } catch {
      // Skip a malformed line rather than failing the whole answer.
    }
  };

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    lines.forEach(collect);
  }
  collect(buffer);

  answer = answer.trim();
  return answer ? text(answer) : text('JenAI returned an empty response.', true);
}

const TOOLS = [
  {
    name: 'ask_jenai',
    description:
      "Ask JenAI — the portfolio's assistant — a natural-language question " +
      'about Jenslee Dsouza (experience, skills, projects, certifications, ' +
      'how to get in touch) and get a grounded answer.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'The question to ask about Jenslee.' },
      },
      required: ['question'],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    call: async (args: Record<string, unknown>) => {
      const question = typeof args.question === 'string' ? args.question.trim() : '';
      if (!question) return text('Provide a non-empty "question".', true);
      try {
        return await askJenai(question);
      } catch (error) {
        return text(`Failed to reach JenAI: ${error instanceof Error ? error.message : String(error)}`, true);
      }
    },
  },
  {
    name: 'list_portfolio_sections',
    description:
      "List the canonical, fully-rendered pages of Jenslee Dsouza's " +
      'portfolio (recruiter persona) with their URLs.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true, openWorldHint: false },
    call: async () =>
      text(
        [
          `- Profile landing: ${SITE}/profile/recruiter`,
          ...SECTIONS.map((s) => `- ${sectionTitle(s)}: ${SITE}/profile/recruiter/${s}`),
        ].join('\n'),
      ),
  },
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  });

const rpcResult = (id: JsonRpcRequest['id'], result: unknown) =>
  json({ jsonrpc: '2.0', id, result });

const rpcError = (id: JsonRpcRequest['id'], code: number, message: string, status = 200) =>
  json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } }, status);

async function handle(msg: JsonRpcRequest): Promise<Response> {
  // Notifications (no id) get no JSON-RPC reply.
  if (msg.id === undefined || msg.id === null) {
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  switch (msg.method) {
    case 'initialize': {
      const requested = msg.params?.protocolVersion;
      const protocolVersion =
        typeof requested === 'string' && PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : PROTOCOL_VERSIONS[0];
      return rpcResult(msg.id, {
        protocolVersion,
        capabilities: { tools: {} },
        serverInfo: { name: 'jenai-portfolio', title: 'JenAI — Jenslee Dsouza', version: '1.0.0' },
        instructions:
          "Answers questions about Jenslee Dsouza's work. Use ask_jenai for " +
          'specific questions and list_portfolio_sections for page links.',
      });
    }
    case 'ping':
      return rpcResult(msg.id, {});
    case 'tools/list':
      return rpcResult(msg.id, {
        tools: TOOLS.map(({ call: _call, ...tool }) => tool),
      });
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === msg.params?.name);
      if (!tool) return rpcError(msg.id, -32602, `Unknown tool: ${String(msg.params?.name)}`);
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      return rpcResult(msg.id, await tool.call(args));
    }
    default:
      return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

export default async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method !== 'POST') {
    return new Response('This MCP server only accepts POST (Streamable HTTP, stateless).', {
      status: 405,
      headers: { allow: 'POST, OPTIONS', ...CORS_HEADERS },
    });
  }

  let msg: JsonRpcRequest;
  try {
    msg = await request.json();
  } catch {
    return rpcError(null, -32700, 'Parse error', 400);
  }
  if (msg && typeof msg === 'object' && ('result' in msg || 'error' in msg)) {
    // A client's reply to a server request; this server never sends any.
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }
  if (!msg || typeof msg !== 'object' || Array.isArray(msg) || typeof msg.method !== 'string') {
    // Batches were removed from the protocol in 2025-06-18.
    return rpcError(null, -32600, 'Invalid Request: send one JSON-RPC message per POST', 400);
  }

  return handle(msg);
};
