// queries/getRecommendation.ts
import datoCMSClient from './datoCMSClient';
import { Recommendation } from '../types/types';

const GET_RECOMMENDATIONS = `
  query {
    allRecommendations {
      profilePicture {
        url
      }
      name
      title
      body
      date
      link
    }
  }
`;

export async function getRecommendations(): Promise<Recommendation[]> {
  const data = await datoCMSClient.request<{ allRecommendations: Recommendation[] }>(GET_RECOMMENDATIONS);
  return data.allRecommendations;
}