// queries/getQuotes.ts
import datoCMSClient from './datoCMSClient';
import { Quote } from '../types';

const GET_QUOTES = `
  query {
    allQuotes(orderBy: order_ASC) {
      text
      author
    }
  }
`;

export async function getQuotes(): Promise<Quote[]> {
  const data = await datoCMSClient.request<{ allQuotes: Quote[] }>(GET_QUOTES);
  return data.allQuotes;
} 