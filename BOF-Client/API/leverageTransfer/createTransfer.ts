import { LeverageTransfer } from './LeverageTransfer.interfaces';

export default async function createTransfer(leverageTransfer: LeverageTransfer): Promise<LeverageTransfer | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/leverage-transfer`, {
    method: 'post',
    body: JSON.stringify(leverageTransfer),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status === 201) {
    return response.json();
  }
  return null;
}
