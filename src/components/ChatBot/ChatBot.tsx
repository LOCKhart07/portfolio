import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

interface Message {
    text: string;
    sender: 'user' | 'bot';  // Make sender type more strict
    timestamp: Date;
}

const INITIAL_MESSAGE = {
    text: "Hi! I'm an AI assistant. Ask me anything about the portfolio owner!",
    sender: 'bot' as const,
    timestamp: new Date()
};

const WIP_MESSAGE: Message = {
    text: "WIP, will not work",
    sender: 'bot',
    timestamp: new Date()
};


// Add your personal information here
const KNOWLEDGE_BASE = {
    "who are you": "I'm an AI assistant created to help answer questions about the portfolio owner.",
    "what do you do": "I can answer questions about the portfolio owner's skills, experience, and projects.",
    "hi": "Hello! How can I help you today?",
    // Add more Q&A pairs about yourself here
};

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE, WIP_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generateResponse = (input: string): string => {
        const lowercaseInput = input.toLowerCase();

        // Search through knowledge base for matching response
        for (const [question, answer] of Object.entries(KNOWLEDGE_BASE)) {
            if (lowercaseInput.includes(question)) {
                return answer;
            }
        }

        return "I'm not sure about that. Try asking about my creator's skills, experience, or projects!";
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: Message = {
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Simulate bot thinking
        setTimeout(() => {
            const botMessage: Message = {
                text: generateResponse(inputText),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

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
                        <h3>AI Assistant</h3>
                        <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
                            >
                                <div className="message-content">{message.text}</div>
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
                        />
                        <button type="submit" className="send-button">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot; 