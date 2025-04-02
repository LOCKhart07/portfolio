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
            // Dealing with buffer issues. Needs to be fixed properly.
            const jsonStrings = chunk.split(/\n(?={"message"|{)/).filter(str => str.trim());
            
            for (const jsonString of jsonStrings) {
                try {
                    const data = JSON.parse(jsonString);
                    if (data.message.content || data.message.is_final) {
                        onChunk(data);
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e, jsonString);
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}; 