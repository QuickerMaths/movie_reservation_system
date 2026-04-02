import { ReservationStatus } from '@/types/reservations';

export type TPaymentRouteStatus = 'paid' | 'pending' | 'cancelled';

export interface TPaymentRequest {
  reservation_id: number;
  result: ReservationStatus;
  amount: number;
}
