// Quotes.tsx

import React from 'react';
import './Quotes.css';

const quotes = [
    {
        text: "Don't sabotage your future peace because familiar chaos is comfortable.",
        author: "Anonymous"
    },
    {
        text: "Be the person you would like to meet.",
        author: "Anonymous"
    },
    {
        text: "During the gold rush, the real money is made from selling shovels.",
        author: "Mark Twain"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
    },
    {
        text: "You don't have to be good at something, you just have to be dependable. Eventually you'll get good.",
        author: "Anonymous"
    },
    {
        text: "Emotions and reactions are different, just because you feel angry doesn't mean you need to react with rage.",
        author: "Anonymous"
    },
    {
        text: "Instead of counting the years, I made sure to make my years count.",
        author: "Anonymous"
    },
    {
        text: "The world is full of beautiful and kind people. If you can't find one, be one.",
        author: "Anonymous"
    },
    {
        text: "Many die at 25, but are buried at 70.",
        author: "Benjamin Franklin"
    },
    {
        text: "What you're not changing, you're choosing.",
        author: "Anonymous"
    }
];

const Quotes: React.FC = () => {
    return (
        <div className="quotes-container">
            <h2 className="quotes-title">💭 Words That Stuck</h2>
            <p className="quotes-intro">A collection of quotes that have shaped my professional journey and personal growth.</p>
            <div className="quotes-grid">
                {quotes.map((quote, index) => (
                    <div key={quote.text} className="quote-card" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
                        <div className="quote-content">
                            <p className="quote-text">"{quote.text}"</p>
                            <div className="quote-info">
                                <h3 className="quote-author">— {quote.author}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quotes; 