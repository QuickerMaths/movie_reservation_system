import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReservation, getReservationById } from '@/api/reservations';
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
