import React, { useEffect, useState } from 'react';
import './Music.css';
import { Song } from '../types';
import { getTopSpotifyTracks } from '../queries/getTopSpotifyTracks';
const favoriteGenres = ["Pop", "Indian Indie", "Alternative", "J-pop", "Classical"];
// const favoriteSongs = [
//   { title: "Too Sweet", artist: "Hozier", imgSrc: "https://cdn-images.dzcdn.net/images/cover/7a7c512b717a4aa7452f3c3e46675322/500x500-000000-80-0-0.jpg" },
//   { title: "End of Beginning", artist: "Djo", imgSrc: "https://cdn-images.dzcdn.net/images/cover/f13749b2a226afa7f5f866ce2f4d3015/500x500-000000-80-0-0.jpg" },
//   { title: "I love you So", artist: "The Walters", imgSrc: "https://cdn-images.dzcdn.net/images/cover/d6d18c1fa3adc35d95d31edc800d2df7/500x500-000000-80-0-0.jpg" },
// ];

const Music: React.FC = () => {
  const [topTracks, setTopTracks] = useState<Song[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchTopTracks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTopSpotifyTracks();
      setTopTracks(data);
    } catch (err) {
      setError('Failed to fetch top tracks. Please try again later.');
      console.error('Error fetching top tracks:', err);

      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopTracks();
  }, [retryCount]);

  if (isLoading) {
    return (
      <div className="music-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your favorite tracks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="music-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          {retryCount < MAX_RETRIES ? (
            <p className="retry-message">Retrying in {2 * (retryCount + 1)} seconds...</p>
          ) : (
            <button
              className="retry-button"
              onClick={() => {
                setRetryCount(0);
                fetchTopTracks();
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="music-page">
      <div className="quote">
        <p>“La Vie en rose” 🌺</p>
      </div>

      <div className="genre-section">
        <h3>Explore by Genre</h3>
        <div className="genres">
          {favoriteGenres.map((genre, index) => (
            <div
              key={index}
              className="genre-card"
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => window.open('https://stats.fm/lockhart', '_blank')}
            >
              <p>{genre}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="songs-section">
        <h3>Favorite Songs This Month</h3>
        <div className="songs">
          {topTracks && topTracks.length > 0 ? (
            topTracks.map((song, index) => (
              <div
                key={index}
                className="song-card"
                style={{ animationDelay: `${index * 0.3}s` }}
                onClick={() => window.open(song.url, '_blank')}
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="song-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                <div className="song-details">
                  <h4>{song.name}</h4>
                  <p>by {song.artist}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No favorite songs available this month.</p>
          )}
        </div>
      </div>



    </div>
  );
};

export default Music;
