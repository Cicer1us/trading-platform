import { GetSwapPriceDto } from '@/interfaces/GetSwapPriceDto.interface';
import { SwapPriceResponseDto } from '@/interfaces/SwapPriceResponse.interface';

export default async function getSwapPrice(dto: GetSwapPriceDto, partner?: string): Promise<SwapPriceResponseDto> {
  const url = new URL(`https://api.paraswap.io/prices`);
  url.search = new URLSearchParams(Object.entries({ ...dto, ...(partner ? { partner } : {}) })).toString();

  const response = await fetch(url.toString());
  return response.json();
}
