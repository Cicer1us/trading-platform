export enum TransferOperation {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface LeverageTransfer {
  operation: TransferOperation;
  amount: number;
}
