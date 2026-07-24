import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './ChatBot.css';
import { StreamingMessage, ChatHistory } from './types';
import { sendChatMessage, processStreamingResponse } from './queries';
import { FaExpand, FaCompress, FaPaperPlane } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { usePersona } from 'persona/PersonaContext';
import { chatSuggestedQuestions } from 'persona/personaConfig';

// Configure marked to use synchronous mode
marked.setOptions({ async: false });

const INITIAL_MESSAGE: StreamingMessage = {
    message_id: uuidv4(),
    text: "Hi, I'm JenAI. Curious about Jenslee's expertise? Just ask.",
    sender: 'assistant',
    timestamp: new Date()
};

const HIDDEN_ROUTES = ['/', '/browse'];

// Once the visitor opens the chat or dismisses the nudge we never nag again
const NUDGE_DISMISSED_KEY = 'jenai_nudge_dismissed';
const NUDGE_DELAY_MS = 4000;

const ChatBot: React.FC = () => {
    const location = useLocation();
    const { persona } = usePersona();
    const [isOpen, setIsOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [messages, setMessages] = useState<StreamingMessage[]>([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nudgeDismissed, setNudgeDismissed] = useState<boolean>(
        () => typeof window !== 'undefined' &&
            localStorage.getItem(NUDGE_DISMISSED_KEY) === 'true'
    );
    const [showNudge, setShowNudge] = useState(false);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Slide the label pill out after a short delay, unless the chat is open,
    // we're on a hidden route, or the visitor already dismissed/opened it.
    useEffect(() => {
        if (nudgeDismissed || isOpen || HIDDEN_ROUTES.includes(location.pathname)) {
            return;
        }
        const timer = setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [nudgeDismissed, isOpen, location.pathname]);

    const dismissNudge = () => {
        setShowNudge(false);
        setNudgeDismissed(true);
        localStorage.setItem(NUDGE_DISMISSED_KEY, 'true');
    };

    const handleToggle = () => {
        setIsOpen(prev => !prev);
        setShowNudge(false);
        if (!nudgeDismissed) {
            setNudgeDismissed(true);
            localStorage.setItem(NUDGE_DISMISSED_KEY, 'true');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
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

    const sendMessage = async (rawText: string) => {
        const text = rawText.trim();
        if (!text || isLoading) return;

        const userMessage: StreamingMessage = {
            message_id: uuidv4(),
            text,
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

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputText);
    };

    // Only a fresh conversation (just the greeting) offers starter prompts.
    const showSuggestions = messages.length === 1 && !isLoading;
    const isWaitingForReply = isLoading && messages[messages.length - 1]?.sender === 'user';

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
                className={`chatbot-toggle ${isOpen ? 'open' : ''} ${!isOpen && !nudgeDismissed ? 'pulse' : ''}`}
                onClick={handleToggle}
                aria-label="Open chat with JenAI assistant"
            >
                <span className="chatbot-toggle-icon">✦</span>
            </button>

            {showNudge && !isOpen && (
                <div
                    className="chatbot-nudge"
                    role="button"
                    tabIndex={0}
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggle();
                        }
                    }}
                >
                    <span className="chatbot-nudge-text">💬 Ask JenAI about Jenslee</span>
                    <button
                        className="chatbot-nudge-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            dismissNudge();
                        }}
                        aria-label="Dismiss"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {isOpen && (
                <div className={`chatbot-window ${isFullscreen ? 'fullscreen' : ''}`}>
                    <div className="chatbot-header">
                        <div className="chatbot-header-identity">
                            <span className="chatbot-avatar">✦</span>
                            <div>
                                <h3>JenAI</h3>
                                <p className="chatbot-status">Ask about Jenslee</p>
                            </div>
                        </div>
                        <div className="chatbot-controls">
                            <button
                                className="fullscreen-button"
                                onClick={toggleFullscreen}
                                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                                {isFullscreen ? <FaCompress /> : <FaExpand />}
                            </button>
                            <button className="close-button" onClick={() => setIsOpen(false)} aria-label="Close chat">
                                <FaTimes />
                            </button>
                        </div>
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

                        {isWaitingForReply && (
                            <div className="message assistant typing">
                                <div className="typing-indicator">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}

                        {showSuggestions && (
                            <div className="suggested-questions">
                                {chatSuggestedQuestions[persona].map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        className="suggested-question"
                                        onClick={() => sendMessage(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        )}

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
                        <button
                            type="submit"
                            className="send-button"
                            disabled={isLoading || !inputText.trim()}
                            aria-label="Send message"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot; 