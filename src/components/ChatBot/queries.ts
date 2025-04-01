// import { Message } from './types';

const API_BASE_URL = process.env.REACT_APP_ASSISTANT_API_BASE_URL ;

export interface ChatHistory {
    messages: {
        role: 'user' | 'assistant';
        content: string;
    }[];
}

export interface ChatResponse {
    chunk?: string;
    is_final: boolean;
}

export const sendChatMessage = async (
    query: string,
    history: ChatHistory
): Promise<Response> => {
    return fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            history
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
                console.log("chunk", chunk)
                const data = JSON.parse(chunk);
                if (data.chunk || data.is_final) {
                    onChunk(data);
                }
            } catch (e) {
                console.error('Error parsing streaming response:', e, chunk);
            }
        }
    } finally {
        reader.releaseLock();
    }
}; 