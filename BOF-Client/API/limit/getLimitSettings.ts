import { LimitSettings } from '@/interfaces/LimitSettings.interface';

export default async function getLimitSettings(): Promise<LimitSettings> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/limit-order/settings`;
  const response = await fetch(url);
  return response.json();
}
