// Quotes.tsx
import React, { useEffect, useState } from 'react';
import './Quotes.css';
import { Quote } from '../types/types';
import { getQuotes } from '../queries/getQuotes';

const Quotes: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQuotes() {
            try {
                const data = await getQuotes();
                setQuotes(data);
            } catch (err) {
                setError('Failed to fetch quotes');
                console.error('Error fetching quotes:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchQuotes();
    }, []);

    if (loading) {
        return (
            <div className="quotes-container">
                <h2 className="quotes-title">💭 Words That Stuck</h2>
                <p className="quotes-intro">Loading quotes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quotes-container">
                <h2 className="quotes-title">💭 Words That Stuck</h2>
                <p className="quotes-intro">Error: {error}</p>
            </div>
        );
    }

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