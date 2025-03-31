import spotifyStatsClient from './spotifyClient';

export const getTopSpotifyTracks = async (): Promise<any> => {
    const response = await spotifyStatsClient.get('/top-tracks', { 
        params: { limit: 3, page: 1, time_range: "short_term" } 
    });
    return response.data;
};
