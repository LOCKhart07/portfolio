// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import handler, { PROTOCOL_VERSIONS } from './edge-functions/mcp';

// The Server Card is static, so it can silently drift from the edge
// function it describes. Clients act on it before connecting.
const card = JSON.parse(readFileSync('public/mcp/server-card', 'utf8'));

const initialize = async () => {
  const response = await handler(
    new Request('https://portfolio.lockhart.in/mcp', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { protocolVersion: 'unknown', capabilities: {}, clientInfo: { name: 't', version: '0' } },
      }),
    }),
  );
  return (await response.json()).result;
};

describe('MCP Server Card', () => {
  test('advertises exactly the protocol versions the server negotiates', () => {
    expect(card.remotes[0].supportedProtocolVersions).toEqual(PROTOCOL_VERSIONS);
  });

  test('points at the /mcp edge function over streamable HTTP', () => {
    expect(card.remotes).toEqual([
      expect.objectContaining({ type: 'streamable-http', url: 'https://portfolio.lockhart.in/mcp' }),
    ]);
  });

  test('version matches the serverInfo the server reports', async () => {
    const result = await initialize();
    expect(card.version).toBe(result.serverInfo.version);
    expect(result.protocolVersion).toBe(PROTOCOL_VERSIONS[0]);
  });
});
