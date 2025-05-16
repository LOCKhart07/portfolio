// queries/getRecommendation.ts
import datoCMSClient from './datoCMSClient';
import { Recommendation } from '../types/types';



const GET_RECOMMENDATION = `
  query {
    recommendation {
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



export async function getRecommendation(): Promise<Recommendation> {
  const data = await datoCMSClient.request<{ recommendation: Recommendation }>(GET_RECOMMENDATION);
  return data.recommendation;
}