import { LimitRaw } from '@/interfaces/Limit.interface';

export default async function getRawLimitDeals(clientAddress: string): Promise<LimitRaw[]> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/limit-order?address=${clientAddress}`;
  const response = await fetch(url);
  return response.json();
}
