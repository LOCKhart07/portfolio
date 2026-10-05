// queries/getCertifications.ts
import datoCMSClient from './datoCMSClient';
import type { Certification } from '../types/types';

const GET_CERTIFICATIONS = `
  query {
    allCertifications {
      title
      issuer
      issuedDate
      link
      iconName
    }
  }
`;

export async function getCertifications(): Promise<Certification[]> {
  const data = await datoCMSClient.request<{ allCertifications: Certification[] }>(GET_CERTIFICATIONS);
  return data.allCertifications;
}
