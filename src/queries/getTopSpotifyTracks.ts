import spotifyStatsClient from './spotifyClient';

export const getTopSpotifyTracks = async (): Promise<any> => {
    const response = await spotifyStatsClient.get('/top-tracks', { 
        params: { limit: 3, page: 1, period: "7day" } 
    });
    return response.data;
};
