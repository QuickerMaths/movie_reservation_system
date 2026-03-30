export type TPaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export interface TPaymentRequest {
  reservation_id: number;
  result: TPaymentStatus;
  amount: number;
}
