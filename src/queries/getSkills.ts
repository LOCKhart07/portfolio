// queries/getTimeline.ts
import datoCMSClient from './datoCMSClient';
import { Skill } from '../types';

const GET_SKILLS = `
{
  allSkills(first: 100, orderBy: category_ASC) {
    name
    category
    description
    icon
  }
}
`;

export async function getSkills(): Promise<Skill[]> {
  const data = await datoCMSClient.request<{ allSkills: Skill[] }>(GET_SKILLS);
  console.log("data", data.allSkills)
  return data.allSkills;
}
