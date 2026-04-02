import { ReservationsSchema } from '@/schemas/reservations.schema';
import { IPaginatedReservations, IReservation, IReservationDetail } from '@/types/reservations';
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

export async function getReservationById(id: string): Promise<IReservationDetail> {
  return apiFetch<IReservationDetail>(`/reservations/${id}`, {
    credentials: 'include',
  });
}

export async function getReservationByToken(token: string): Promise<IReservationDetail> {
  return apiFetch<IReservationDetail>(`/reservations/cancel/${token}`, {
    credentials: 'include',
  });
}

export async function cancelReservationByToken(token: string): Promise<IReservation> {
  return apiFetch<IReservation>(`/reservations/cancel/${token}`, {
    method: 'PATCH',
    credentials: 'include',
  });
}

export async function getReservationsByUserId(
  userId: number,
  page = 1,
  limit = 10,
): Promise<IPaginatedReservations> {
  return apiFetch<IPaginatedReservations>(
    `/reservations/user/${userId}?page=${page}&limit=${limit}`,
    {
      credentials: 'include',
    },
  );
}

export async function cancelReservationLoggedUser(reservationId: number): Promise<IReservation> {
  return apiFetch<IReservation>(`/reservations/${reservationId}/cancel/me`, {
    method: 'PATCH',
    credentials: 'include',
  });
}
