import spotifyStatsClient from './spotifyClient';

export const getTopSpotifyArtists = async (): Promise<any> => {
    const response = await spotifyStatsClient.get('/top-artists', { 
        params: { limit: 3, page: 1, period: "7day" } 
    });
    return response.data;
};
