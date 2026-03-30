'use client';

import { useProcessPayment } from '@/hooks/payment-query-hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CreditCard, AlertCircle, Clock, CircleDollarSignIcon } from 'lucide-react';
import { TPaymentStatus } from '@/types/payments';

interface PaymentSimulationProps {
  reservationId: string;
}

export default function PaymentSimulation({ reservationId }: PaymentSimulationProps) {
  const id = parseInt(reservationId);
  const { mutate, isPending } = useProcessPayment();

  const handlePayment = (result: TPaymentStatus) => {
    mutate({ reservation_id: id, result, amount: 1 });
  };

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
          <CreditCard className='h-6 w-6 text-blue-600' />
        </div>
        <CardTitle className='text-2xl'>Payment Simulator</CardTitle>
        <CardDescription>
          {`Choose how you want this mock transaction to resolve for Reservation ${reservationId}`}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <Button
          onClick={() => handlePayment('PAID')}
          disabled={isPending}
          className='w-full bg-green-600 hover:bg-green-500 h-12 cursor-pointer'
        >
          <CircleDollarSignIcon className='mr-2 h-4 w-4' />
          {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
          Simulate Success (PAID)
        </Button>

        <Button
          onClick={() => handlePayment('PENDING')}
          disabled={isPending}
          variant='outline'
          className='w-full border-orange-200 text-white bg-orange-500 hover:bg-orange-400 hover:text-white h-12 cursor-pointer'
        >
          <Clock className='mr-2 h-4 w-4' />
          Simulate Delay (PENDING)
        </Button>

        <Button
          onClick={() => handlePayment('CANCELLED')}
          disabled={isPending}
          variant='destructive'
          className='w-full h-12 cursor-pointer'
        >
          <AlertCircle className='mr-2 h-4 w-4' />
          Simulate Failure (CANCELLED)
        </Button>

        {isPending && (
          <p className='text-center text-sm text-gray-500 animate-pulse mt-4'>
            Communicating with bank... (2s delay)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
