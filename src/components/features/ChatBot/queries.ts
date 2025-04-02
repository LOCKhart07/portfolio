// import { Message } from './types';
import { ChatHistory, ChatResponse } from './types';

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

export const processStreamingResponse = async (
    response: Response,
    onChunk: (data: ChatResponse) => void
): Promise<void> => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const data = JSON.parse(line);
                        if (data.message.content || data.message.is_final) {
                            onChunk(data);
                        }
                    } catch (e) {
                        console.log("problem line", line);
                        console.error('Error parsing streaming response:', e, line);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}; 