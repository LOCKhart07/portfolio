// queries/getAwards.ts
import datoCMSClient from './datoCMSClient';
import { Award } from '../types/types';

const GET_AWARDS = `
  query {
    allAwards(orderBy: order_ASC) {
      title
      issuer
      date
      description
      icon
    }
  }
`;

export async function getAwards(): Promise<Award[]> {
  const data = await datoCMSClient.request<{ allAwards: Award[] }>(GET_AWARDS);
  return data.allAwards;
} 