// getSpotifyToken.ts

export const getSpotifyToken = (): string => {
  return process.env.REACT_APP_SPOTIFY_STATS_API_KEY ?? '';
};


