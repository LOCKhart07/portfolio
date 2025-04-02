// queries/getProjects.ts
import datoCMSClient from './datoCMSClient';
import { Project } from '../types/types';

const GET_PROJECTS = `
  query {
    allProjects(orderBy: order_ASC) {
      title
      description
      techUsed
      image {
        url
      }
      link
    }
  }
`;

export async function getProjects(): Promise<Project[]> {
  const data = await datoCMSClient.request<{ allProjects: Project[] }>(GET_PROJECTS);
  return data.allProjects;
}
