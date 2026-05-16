// WebMCP — expose this site's real actions to in-browser AI agents.
//
// https://webmachinelearning.github.io/webmcp/
// Registered via navigator.modelContext.registerTool(); each tool is
// scoped to an AbortController so it is unregistered on cleanup. The API
// is experimental (Chrome origin trial), so every call is feature-gated:
// in a browser without WebMCP this module is an inert no-op.
//
// The two tools below are honest wrappers over functionality that already
// exists on the site — the JenAI assistant backend and the canonical
// route list — not stubs.

import { v4 as uuidv4 } from 'uuid';
import { sendChatMessage, processStreamingResponse } from './components/features/ChatBot/queries';
import { ChatHistory } from './components/features/ChatBot/types';

interface McpToolResult {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<McpToolResult>;
}

interface ModelContext {
  registerTool?: (tool: McpToolDefinition, options?: { signal?: AbortSignal }) => unknown;
  provideContext?: (context: { tools: McpToolDefinition[] }) => unknown;
}

declare global {
  // eslint-disable-next-line no-var
  interface Navigator {
    modelContext?: ModelContext;
  }
}

const SITE = 'https://portfolio.lockhart.in';

const SECTIONS: { title: string; url: string }[] = [
  { title: 'Profile landing', url: `${SITE}/profile/recruiter` },
  { title: 'Work Experience', url: `${SITE}/profile/recruiter/work-experience` },
  { title: 'Projects', url: `${SITE}/profile/recruiter/projects` },
  { title: 'Skills', url: `${SITE}/profile/recruiter/skills` },
  { title: 'Certifications', url: `${SITE}/profile/recruiter/certifications` },
  { title: 'Recommendations', url: `${SITE}/profile/recruiter/recommendations` },
  { title: 'Awards', url: `${SITE}/profile/recruiter/awards` },
  { title: 'Contact', url: `${SITE}/profile/recruiter/contact-me` },
  { title: 'Music', url: `${SITE}/profile/recruiter/music` },
  { title: 'Quotes', url: `${SITE}/profile/recruiter/quotes` },
];

const text = (value: string, isError = false): McpToolResult => ({
  content: [{ type: 'text', text: value }],
  isError,
});

const TOOLS: McpToolDefinition[] = [
  {
    name: 'ask_jenai',
    description:
      "Ask JenAI — the portfolio's assistant — a natural-language question " +
      'about Jenslee Dsouza (experience, skills, projects, certifications, ' +
      'how to get in touch) and get a grounded answer.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'The question to ask about Jenslee.',
        },
      },
      required: ['question'],
    },
    execute: async (args) => {
      const question = typeof args.question === 'string' ? args.question.trim() : '';
      if (!question) {
        return text('Provide a non-empty "question".', true);
      }
      try {
        const history: ChatHistory = { messages: [] };
        const response = await sendChatMessage(question, history, uuidv4());
        if (!response.ok) {
          return text(`JenAI backend returned HTTP ${response.status}.`, true);
        }
        let answer = '';
        await processStreamingResponse(response, (data) => {
          answer += data.message.content ?? '';
        });
        return text(answer.trim() || 'JenAI returned an empty response.', !answer.trim());
      } catch (error) {
        return text(
          `Failed to reach JenAI: ${error instanceof Error ? error.message : String(error)}`,
          true,
        );
      }
    },
  },
  {
    name: 'list_portfolio_sections',
    description:
      "List the canonical, fully-rendered pages of Jenslee Dsouza's " +
      'portfolio (recruiter persona) with their URLs.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () =>
      text(SECTIONS.map((s) => `- ${s.title}: ${s.url}`).join('\n')),
  },
];

/**
 * Register the WebMCP tools. Safe to call when the API is absent (no-op).
 * Returns a cleanup function that unregisters the tools.
 */
export function registerWebMcpTools(): () => void {
  const mc = typeof navigator !== 'undefined' ? navigator.modelContext : undefined;
  if (!mc) {
    return () => {};
  }

  const controller = new AbortController();

  try {
    if (typeof mc.registerTool === 'function') {
      for (const tool of TOOLS) {
        mc.registerTool(tool, { signal: controller.signal });
      }
    } else if (typeof mc.provideContext === 'function') {
      // Older draft surface — register the whole tool set at once.
      mc.provideContext({ tools: TOOLS });
    }
  } catch {
    // A non-conforming experimental implementation must never break the app.
    return () => {};
  }

  return () => controller.abort();
}
