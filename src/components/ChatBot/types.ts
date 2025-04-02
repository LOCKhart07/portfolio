export interface Message {
    message_id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export interface StreamingMessage extends Message {
    isStreaming?: boolean;
}

export interface ChatHistory {
    messages: {
        message_id: string;
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
    }[];
}

export interface ChatResponse {
    is_final: boolean;
    message: {
        message_id: string;
        role: string;
        content: string;
        timestamp: string;
    };
    request_id: string;
} 