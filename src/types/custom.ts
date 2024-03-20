export type UserId = string | number;

export interface fundingParams {
  amount: number;
  email: string;
  metadata: { [key: string]: string };
}

export interface TransferParams {
  amount: number;
  recipientId: number;
  senderId: number;
}
