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

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            try {
                const data = JSON.parse(chunk);
                if (data.message.content || data.message.is_final) {
                    onChunk(data);
                }
            } catch (e) {
                console.log("problem chunk", chunk);
                console.error('Error parsing streaming response:', e, chunk);
            }
        }
    } finally {
        reader.releaseLock();
    }
}; 