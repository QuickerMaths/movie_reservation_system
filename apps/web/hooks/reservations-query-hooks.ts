import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelReservationByToken,
  createReservation,
  getReservationById,
  getReservationByToken,
  getReservationsByUserId,
  cancelReservationLoggedUser,
} from '@/api/reservations';
import { ReservationsSchema } from '@/schemas/reservations.schema';
import { useRouter } from 'next/navigation';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ReservationsSchema) => {
      return await createReservation(payload);
    },
    onSuccess: (reservation, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userReservations'] });
      queryClient.invalidateQueries({ queryKey: ['showsSeats', variables.show_id] });

      router.push(`/reservation/${reservation.id}/payment`);
    },
  });
};

export const useGetReservationByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => getReservationById(id),
    staleTime: 60 * 1000,
  });
};

export const useGetReservationByTokenQuery = (token: string) => {
  return useQuery({
    queryKey: ['reservationByToken', token],
    queryFn: () => getReservationByToken(token),
    staleTime: 60 * 1000,
    enabled: Boolean(token),
  });
};

export const useCancelReservationByToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => cancelReservationByToken(token),
    onSuccess: (reservation, token) => {
      queryClient.invalidateQueries({ queryKey: ['reservationByToken', token] });
      queryClient.invalidateQueries({ queryKey: ['showsSeats', reservation.showId] });
    },
  });
};

export const useGetReservationsByUserIdQuery = (userId?: number, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['userReservations', userId, page, limit],
    queryFn: () => getReservationsByUserId(userId as number, page, limit),
    staleTime: 60 * 1000,
    enabled: Boolean(userId),
  });
};

export const useCancelReservationLoggedUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: number) => cancelReservationLoggedUser(reservationId),
    onSuccess: (reservation, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ['userReservations'] });
      queryClient.invalidateQueries({ queryKey: ['showsSeats', reservation.showId] });
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId.toString()] });
    },
  });
};
