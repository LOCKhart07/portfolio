// queries/getTimeline.ts
import datoCMSClient from './datoCMSClient';
import { Skill } from '../types/types';

const GET_SKILLS = `
{
  allSkills(first: 100, orderBy: order_ASC) {
    name
    category
    description
    icon
  }
}
`;

export async function getSkills(): Promise<Skill[]> {
  const data = await datoCMSClient.request<{ allSkills: Skill[] }>(GET_SKILLS);
  return data.allSkills;
}
