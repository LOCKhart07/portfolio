// Reading.tsx

import React from 'react';
import './Reading.css';
import atomicHabits from '../images/atomic_habits.jpg';
import richDadPoorDad from '../images/rich_dad_poor_dad.jpg';
import alchemist from '../images/alchemist.jpg';
import eatThatFrog from '../images/eat_that_frog.jpg';
import vijayanikiAidhuMetlu from '../images/vijayaniki_aidu_metlu.jpg';
import venneloAdapilla from '../images/vennelo_adapilla.jpeg';

const books = [
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    imgSrc: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1531891848i/11.jpg",
    description: "A comedic sci-fi journey through space after Earth's destruction.",
    url:"https://www.goodreads.com/book/show/11.The_Hitchhiker_s_Guide_to_the_Galaxy"
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    imgSrc: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1541428344i/17165596.jpg",
    description: "A story of friendship, betrayal, and redemption set in Afghanistan.",
    url:"https://www.goodreads.com/book/show/77203.The_Kite_Runner"
  },
  {
    title: "Strange Case of Dr Jekyll and Mr Hyde",
    author: "Robert Louis Stevenson",
    imgSrc: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1318116526i/51496.jpg",
    description: "A tale of dual identity and the struggle between good and evil.",
    url:"https://www.goodreads.com/book/show/51496.Dr_Jekyll_and_Mr_Hyde"
  }
];
const Reading: React.FC = () => {
  return (
    <div className="reading-container">
      <h2 className="reading-title">📚 Books That Shaped My Journey</h2>
      <p className="reading-intro">These books have influenced my perspectives, motivation, and self-growth.</p>
      <div className="books-grid">
        {books.map((book, index) => (
           
          <div key={book.title} className="book-card" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
            <a href={book.url} target="_blank" rel="noopener noreferrer">
              <img src={book.imgSrc} alt={book.title} className="book-cover" />

            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
                <h4 className="book-author">{book.author}</h4>
                <style>
                {`
                  a {
                  text-decoration: none;
                  }
                `}
                </style>
              <p className="book-description">{book.description}</p>
            </div>
            </a>
          </div>
          
        
        ))}
      </div>
    </div>
  );
};

export default Reading;
