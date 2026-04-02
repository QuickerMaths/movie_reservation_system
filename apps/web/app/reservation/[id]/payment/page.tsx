import PaymentSimulation from '@/components/PaymentSimulation';
import { getReservationById } from '@/api/reservations';
import { ReservationStatus } from '@/types/reservations';
import { mapPaymentStatusToRouteStatus } from '@/helpers/payments';
import { notFound, redirect } from 'next/navigation';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const reservation = await getReservationById(id).catch(() => notFound());

  if (reservation.status !== ReservationStatus.PENDING) {
    const status = mapPaymentStatusToRouteStatus(reservation.status);
    redirect(`/reservation/${id}/payment/${status}`);
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-950 text-white p-4'>
      <PaymentSimulation reservationId={id} />
    </main>
  );
}
