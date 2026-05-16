// queries/getProfileBanner.ts
import datoCMSClient from './datoCMSClient';
import { ProfileBanner } from '../types/types';

const GET_PROFILE_BANNER = `
 {
  profilebanner {
    backgroundImage {
      url
    }
    headline
    resumeLink {
      url
    }
    linkedinLink
    profileSummary
  }
}
`;

export async function getProfileBanner(): Promise<ProfileBanner> {
  const data = await datoCMSClient.request<{ profilebanner: ProfileBanner }>(GET_PROFILE_BANNER);
  return data.profilebanner;
}
