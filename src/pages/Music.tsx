import React, { useEffect, useState } from 'react';
import './Music.css';
import { Song } from '../types';
import { getTopSpotifyTracks } from '../queries/getTopSpotifyTracks';
const favoriteGenres = ["Pop", "Indian Indie", "Alternative", "J-pop", "Classical"];


const Music: React.FC = () => {


  const [topTracks, setTopTracks] = useState<Song[] | null>(null);

  useEffect(() => {
    async function fetchTopTracks() {
      const data = await getTopSpotifyTracks();
      setTopTracks(data);
    }
    fetchTopTracks();
  }, []);
  console.log("🚀 ~ topTracks:", topTracks)


  if (!topTracks) return <div>Loading...</div>;
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
          {topTracks.map((song, index) => (
            <div key={index} className="song-card" style={{ animationDelay: `${index * 0.3}s` }} onClick={() => window.open(song.url, '_blank')}>
              <img src={song.image} alt={song.name} className="song-image" />
              <div className="song-details">
                <h4>{song.name}</h4>
                <p>by {song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
};

export default Music;
