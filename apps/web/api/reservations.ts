import { ReservationsSchema } from '@/schemas/reservations.schema';
import { IReservation } from '@/types/reservations';
import { apiFetch } from '@/lib/utils';

export async function createReservation(data: ReservationsSchema): Promise<IReservation> {
  return apiFetch<IReservation>(`/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
