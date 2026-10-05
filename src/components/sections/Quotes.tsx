// Quotes.tsx
import React from 'react';
import './Quotes.css';
import type { Quote } from '../../types/types';

// Rendered at build time from DatoCMS data; ships no JS.
const Quotes: React.FC<{ quotes: Quote[] }> = ({ quotes }) => {
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