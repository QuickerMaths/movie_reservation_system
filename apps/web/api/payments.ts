import { apiFetch } from '@/lib/utils';
import { TPaymentRequest } from '@/types/payments';
import { ReservationStatus } from '@/types/reservations';

export async function processPayment(data: TPaymentRequest): Promise<ReservationStatus> {
  return apiFetch<ReservationStatus>('/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
