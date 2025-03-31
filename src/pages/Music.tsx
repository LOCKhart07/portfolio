import React, { useEffect, useState } from 'react';
import './Music.css';
import { getTimeline } from '../queries/getTimeline';
import { TopSpotifyTracks } from '../types';
import { getTopSpotifyTracks } from '../queries/getTopSpotifyTracks';

const favoriteGenres = ["Pop", "Indian Indie", "Alternative", "J-pop", "Classical"];
const favoriteSongs = [
  { title: "Too Sweet", artist: "Hozier", imgSrc: "https://cdn-images.dzcdn.net/images/cover/7a7c512b717a4aa7452f3c3e46675322/500x500-000000-80-0-0.jpg" },
  { title: "End of Beginning", artist: "Djo", imgSrc: "https://cdn-images.dzcdn.net/images/cover/f13749b2a226afa7f5f866ce2f4d3015/500x500-000000-80-0-0.jpg" },
  { title: "I love you So", artist: "The Walters", imgSrc: "https://cdn-images.dzcdn.net/images/cover/d6d18c1fa3adc35d95d31edc800d2df7/500x500-000000-80-0-0.jpg" },
];

const Music: React.FC = () => {


  const [topTracks, setTopTracks] = useState<TopSpotifyTracks[] | null>(null);

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
        <h3>Favorite Songs This Week</h3>
        <div className="songs">
          {favoriteSongs.map((song, index) => (
            <div key={index} className="song-card" style={{ animationDelay: `${index * 0.3}s` }} onClick={() => window.open('https://stats.fm/lockhart', '_blank')}>
              <img src={song.imgSrc} alt={song.title} className="song-image" />
              <div className="song-details">
                <h4>{song.title}</h4>
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
