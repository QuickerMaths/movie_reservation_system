import { useMutation } from '@tanstack/react-query';
import { processPayment } from '@/api/payments';
import { TPaymentRequest } from '@/types/payments';
import { useRouter } from 'next/navigation';
import { mapPaymentStatusToRouteStatus } from '@/helpers/payments';

export const useProcessPayment = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TPaymentRequest) => processPayment(data),
    onSuccess: (status, variables) => {
      const routeStatus = mapPaymentStatusToRouteStatus(status);

      router.push(`/reservation/${variables.reservation_id}/payment/${routeStatus}`);
    },
  });
};
