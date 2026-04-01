import ReservationSuccessPage from '@/components/ReservationSuccess';
import { getQueryClient } from '@/providers/get-query-client';
import { getReservationById } from '@/api/reservations';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound, redirect } from 'next/navigation';
import { mapPaymentStatusToRouteStatus, isPaymentRouteStatus } from '@/helpers/payments';

export default async function PaymentStatusPage({
  params,
}: {
  params: { id: string; status: string };
}) {
  const { id, status } = await params;

  if (!isPaymentRouteStatus(status)) {
    notFound();
  }

  const queryClient = getQueryClient();

  const reservation = await queryClient.fetchQuery({
    queryKey: ['reservation', id],
    queryFn: async () => getReservationById(id),
  });

  const canonicalStatus = mapPaymentStatusToRouteStatus(reservation.status);

  if (status !== canonicalStatus) {
    redirect(`/reservation/${id}/payment/${canonicalStatus}`);
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-700 p-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReservationSuccessPage reservationId={id} />
      </HydrationBoundary>
    </main>
  );
}
