import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelReservationByToken,
  createReservation,
  getReservationById,
  getReservationByToken,
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
      queryClient.invalidateQueries({ queryKey: ['showsSeats', variables.show_id] });

      console.log(reservation);
      //TODO: push to payment section
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
    onSuccess: (_, token) => {
      queryClient.invalidateQueries({ queryKey: ['reservationByToken', token] });
    },
  });
};

