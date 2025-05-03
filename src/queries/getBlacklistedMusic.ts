// queries/getBlacklistedMusic.ts
import datoCMSClient from './datoCMSClient';
import { BlacklistedMusic as BlacklistedMusics } from '../types/types';

const GET_BLACKLISTED_MUSIC = `
  query {
    allBlacklistedMusics {
    name
    }
  }
`;

export async function getBlacklistedMusic(): Promise<BlacklistedMusics[]> {
  const data = await datoCMSClient.request<{ allBlacklistedMusics: BlacklistedMusics[] }>(GET_BLACKLISTED_MUSIC);
  return data.allBlacklistedMusics;
}
