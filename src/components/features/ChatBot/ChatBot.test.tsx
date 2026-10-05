import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ChatResponse } from './types';

vi.mock('./queries', () => ({
  sendChatMessage: vi.fn(),
  processStreamingResponse: vi.fn(),
}));

import { processStreamingResponse, sendChatMessage } from './queries';
import ChatBot from './ChatBot';

const chunk = (content: string, is_final: boolean): ChatResponse => ({
  is_final,
  message: { message_id: 'reply-1', role: 'assistant', content, timestamp: '2026-10-05T00:00:00Z' },
  request_id: 'r1',
});

beforeEach(() => {
  // jsdom implements neither of these; the chat calls both.
  Element.prototype.scrollIntoView = vi.fn();
  vi.mocked(sendChatMessage).mockResolvedValue({ ok: true } as Response);
});

afterEach(() => {
  vi.mocked(processStreamingResponse).mockReset();
});

const ask = (question: string) => {
  fireEvent.click(screen.getByRole('button', { name: 'Open chat with JenAI assistant' }));
  fireEvent.change(screen.getByPlaceholderText('Type your message...'), { target: { value: question } });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
};

describe('ChatBot', () => {
  test('the "..." indicator clears when the stream ends without an is_final chunk', async () => {
    vi.mocked(processStreamingResponse).mockImplementation(async (_res, onChunk) => {
      onChunk(chunk('Partial answer', false)); // backend never sends is_final
    });
    const { container } = render(<ChatBot persona="recruiter" />);

    ask('What does Jenslee do?');

    expect(await screen.findByText('Partial answer')).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('.streaming-dot')).toBeNull());
  });

  test('still renders and works when localStorage throws (blocked storage)', () => {
    const blocked = () => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);

    render(<ChatBot persona="recruiter" />);
    // Opening the chat writes the "nudge dismissed" flag to storage.
    fireEvent.click(screen.getByRole('button', { name: 'Open chat with JenAI assistant' }));

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });
});
