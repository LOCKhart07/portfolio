export interface Message {
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export interface StreamingMessage extends Message {
    isStreaming?: boolean;
} 