import PaymentSimulation from '@/components/PaymentSimulation';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-950 text-white p-4'>
      <PaymentSimulation reservationId={id} />
    </main>
  );
}
