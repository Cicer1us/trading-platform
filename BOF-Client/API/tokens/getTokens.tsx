import { Token } from '@/interfaces/Tokens.interface';
export type TokensList = Record<string, Token[]>;

export async function getTokens(): Promise<TokensList> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/chain-config`;
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  return {};
}
