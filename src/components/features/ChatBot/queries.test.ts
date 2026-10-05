// @vitest-environment node
import { describe, expect, test, vi } from 'vitest';
import { processStreamingResponse } from './queries';
import type { ChatResponse } from './types';

const line = (content: string, is_final = false) =>
  JSON.stringify({
    is_final,
    message: { message_id: 'm1', role: 'assistant', content, timestamp: '2026-10-05T00:00:00Z' },
    request_id: 'r1',
  }) + '\n';

/** A Response whose body arrives as exactly these byte chunks. */
const streamOf = (...chunks: Uint8Array[]) =>
  new Response(
    new ReadableStream({
      start(controller) {
        chunks.forEach((c) => controller.enqueue(c));
        controller.close();
      },
    }),
  );

const bytes = (s: string) => new TextEncoder().encode(s);

/** Cut the encoded payload at the given byte offsets. */
const splitAt = (payload: string, ...offsets: number[]) => {
  const all = bytes(payload);
  const cuts = [0, ...offsets, all.length];
  return cuts.slice(1).map((end, i) => all.slice(cuts[i], end));
};

const collect = async (response: Response) => {
  const got: ChatResponse[] = [];
  await processStreamingResponse(response, (d) => got.push(d));
  return got;
};

describe('processStreamingResponse', () => {
  test('a JSON line split across two network chunks is delivered once, intact', async () => {
    const payload = line('Hello ') + line('world');
    const got = await collect(streamOf(...splitAt(payload, 30)));

    expect(got.map((d) => d.message.content)).toEqual(['Hello ', 'world']);
  });

  test('a multi-byte character split mid-sequence is decoded correctly', async () => {
    const payload = line('ship it 🚀 done');
    const rocket = bytes(payload).indexOf(0xf0); // first byte of the 4-byte emoji
    const got = await collect(streamOf(...splitAt(payload, rocket + 2)));

    expect(got.map((d) => d.message.content)).toEqual(['ship it 🚀 done']);
  });

  test('a final line without a trailing newline is still delivered', async () => {
    const payload = line('first') + line('last').trimEnd();
    const got = await collect(streamOf(bytes(payload)));

    expect(got.map((d) => d.message.content)).toEqual(['first', 'last']);
  });

  test('an empty final chunk is delivered so streaming can end (top-level is_final)', async () => {
    const got = await collect(streamOf(bytes(line('answer') + line('', true))));

    expect(got).toHaveLength(2);
    expect(got[1].is_final).toBe(true);
  });

  test('empty non-final chunks are skipped and a malformed line does not stop the stream', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const got = await collect(streamOf(bytes(line('') + '{not json\n' + line('kept'))));

    expect(got.map((d) => d.message.content)).toEqual(['kept']);
  });
});
