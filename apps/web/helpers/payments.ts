import { ReservationStatus } from '@/types/reservations';
import { TPaymentRouteStatus } from '@/types/payments';

export function mapPaymentStatusToRouteStatus(status: ReservationStatus): TPaymentRouteStatus {
  if (status === ReservationStatus.PAID) {
    return 'paid';
  }

  if (status === ReservationStatus.PENDING) {
    return 'pending';
  }

  return 'cancelled';
}

export function isPaymentRouteStatus(status: string): status is TPaymentRouteStatus {
  return status === 'paid' || status === 'pending' || status === 'cancelled';
}
