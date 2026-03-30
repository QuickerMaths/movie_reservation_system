import { apiFetch } from '@/lib/utils';
import { TPaymentStatus, TPaymentRequest } from '@/types/payments';

export async function processPayment(data: TPaymentRequest): Promise<TPaymentStatus> {
  return apiFetch<TPaymentStatus>('/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
