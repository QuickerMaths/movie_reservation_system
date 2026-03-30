import { useMutation } from '@tanstack/react-query';
import { processPayment } from '@/api/payments';
import { TPaymentRequest } from '@/types/payments';
import { useRouter } from 'next/navigation';

export const useProcessPayment = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TPaymentRequest) => processPayment(data),
    onSuccess: (status, variables) => {
      if (status === 'PAID') {
        router.push(`/reservations/${variables.reservation_id}/success`);
      } else {
        // TODO: handle the CANCELED and PENDING states
        router.push('/profile');
      }
    },
  });
};
