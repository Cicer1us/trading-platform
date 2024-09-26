export class GetSwapPriceDto {
  srcToken: string;
  destToken: string;
  amount: string;
  srcDecimals: string;
  destDecimals: string;
  side: string;
  includeContractMethods?: string;
  excludeDirectContractMethods?: string;
  network: string;
}
