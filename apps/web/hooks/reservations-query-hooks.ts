import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from '@/api/reservations';
import { ReservationsSchema } from '@/schemas/reservations.schema';
import { useRouter } from 'next/navigation';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ReservationsSchema) => {
      return await createReservation(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['showsSeats', variables.show_id] });
      //TODO: push to payment section
      router.push('/');
    },
  });
};
