import ReservationCancelByToken from '@/components/ReservationCancelByToken';

export default async function CancelReservationByTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = await params;

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-950 p-4 text-white'>
      <ReservationCancelByToken token={token} />
    </main>
  );
}

