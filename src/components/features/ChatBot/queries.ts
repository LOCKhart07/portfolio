// import { Message } from './types';
import type { ChatHistory, ChatResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_ASSISTANT_API_BASE_URL;


export const sendChatMessage = async (
    query: string,
    history: ChatHistory,
    message_id: string
): Promise<Response> => {
    return fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            history,
            message_id
        })
    });
};

/**
 * Reads the backend's newline-delimited JSON stream and hands each complete
 * line to onChunk. Network chunks don't line up with JSON lines (a line can
 * arrive in two pieces) or with UTF-8 characters (an emoji's bytes can be
 * split), so bytes are decoded in streaming mode into a buffer and only whole
 * lines are parsed; the remainder is flushed when the stream ends. Same
 * approach as netlify/edge-functions/mcp.ts.
 */
export const processStreamingResponse = async (
    response: Response,
    onChunk: (data: ChatResponse) => void
): Promise<void> => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    const handleLine = (line: string) => {
        if (!line.trim()) return;
        let data: ChatResponse;
        try {
            data = JSON.parse(line);
        } catch (e) {
            console.error('Error parsing JSON:', e, line);
            return;
        }
        // is_final lives at the top level (see ChatResponse). An empty final
        // chunk must still be delivered: it is what ends the streaming state.
        if (data.message?.content || data.is_final) {
            onChunk(data);
        }
    };

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            lines.forEach(handleLine);
        }
        buffer += decoder.decode();
        handleLine(buffer);
    } finally {
        reader.releaseLock();
    }
};
