import { SwapSettings } from '@/interfaces/SwapSettings.interface';

export default async function getSwapSettings(): Promise<SwapSettings> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/swap/settings`;
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  return {};
}
