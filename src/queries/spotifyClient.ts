import axios from 'axios';
import { getSpotifyToken } from './getSpotifyToken';


const SPOTIFY_STATS_BASE_URL = process.env.REACT_APP_SPOTIFY_STATS_API_BASE_URL ?? '';

// const SPOTIFY_STATS_BASE_URL = 'http://localhost:9000/spotify-stats/api';
const SPOTIFY_STATS_API_KEY = getSpotifyToken();

const spotifyStatsClient = axios.create({
    baseURL: SPOTIFY_STATS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SPOTIFY_STATS_API_KEY}`,
        'Accept': 'application/json',
    },
});

export default spotifyStatsClient;
