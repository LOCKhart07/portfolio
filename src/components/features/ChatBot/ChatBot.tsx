import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './ChatBot.css';
import { StreamingMessage, ChatHistory } from './types';
import { sendChatMessage, processStreamingResponse } from './queries';

// Configure marked to use synchronous mode
marked.setOptions({ async: false });

const INITIAL_MESSAGE: StreamingMessage = {
    message_id: uuidv4(),
    text: "Hi, I'm JenAI. Curious about Jenslee's expertise? Just ask.",
    sender: 'assistant',
    timestamp: new Date()
};

const HIDDEN_ROUTES = ['/', '/browse'];

const ChatBot: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<StreamingMessage[]>([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleStreamingResponse = async (response: Response) => {
        await processStreamingResponse(response, (data) => {

            setMessages(prev => {
                const newMessages = [...prev];
                const messageId = data.message.message_id;

                // Find existing streaming message with matching ID
                const existingMessageIndex = newMessages.findIndex(
                    msg => msg.message_id === messageId && msg.isStreaming
                );

                if (existingMessageIndex !== -1) {
                    // Update existing streaming message
                    newMessages[existingMessageIndex] = {
                        ...newMessages[existingMessageIndex],
                        text: newMessages[existingMessageIndex].text + data.message.content,
                        isStreaming: !data.is_final
                    };
                } else {
                    // Create new message
                    newMessages.push({
                        message_id: messageId,
                        text: data.message.content || '',
                        sender: 'assistant',
                        timestamp: new Date(),
                        isStreaming: !data.is_final
                    });
                }
                return newMessages;
            });
        });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMessage: StreamingMessage = {
            message_id: uuidv4(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const history: ChatHistory = {
                messages: messages.map(msg => ({
                    message_id: msg.message_id,
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text,
                    timestamp: msg.timestamp.toISOString()
                }))
            };

            const response = await sendChatMessage(userMessage.text, history, userMessage.message_id);


            if (!response.ok) {
                throw new Error('Failed to get response from API');
            }

            await handleStreamingResponse(response);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                message_id: uuidv4(),
                text: "I apologize, but I encountered an error. Please try again later.",
                sender: 'assistant',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Hide chatbot on specified routes
    if (HIDDEN_ROUTES.includes(location.pathname)) {
        return null;
    }

    function markdownToHTML(text: string) {
        return DOMPurify.sanitize(marked(text, { breaks: true }) as string);
    }

    return (
        <div className="chatbot-container">
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="chatbot-toggle-icon">✦</span>
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>JenAI Assistant</h3>
                        <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender === 'assistant' ? 'assistant' : 'user'}`}
                            >
                                <div className="message-content">
                                    <div dangerouslySetInnerHTML={{ __html: markdownToHTML(message.text) }} />
                                    {message.isStreaming && <span className="streaming-dot">...</span>}
                                </div>
                                <div className="message-timestamp">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="input-container">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
                            className="message-input"
                            disabled={isLoading}
                        />
                        <button type="submit" className="send-button" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot; 