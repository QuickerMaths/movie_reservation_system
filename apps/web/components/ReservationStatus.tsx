'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleX,
  Clock,
  Film,
  Hourglass,
  Loader2,
  Mail,
  MapPin,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetReservationByIdQuery } from '@/hooks/reservations-query-hooks';
import { useRouter } from 'next/navigation';
import { ReservationStatus as TReservationStatus } from '@/types/reservations';

interface ReservationSuccessProps {
  reservationId: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
});

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

function getStatusClasses(status: string) {
  if (status === 'CONFIRMED') {
    return 'bg-green-500/10 text-green-700 dark:text-green-300';
  }

  if (status === 'CANCELED') {
    return 'bg-destructive/10 text-destructive';
  }

  return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
}

function getStatusIcon(status: string) {
  if (status === TReservationStatus.PENDING) {
    return {
      Icon: Hourglass,
      wrapperClassName: 'bg-amber-500/10',
      iconClassName: 'text-amber-600',
    };
  }

  if (status === TReservationStatus.CANCELLED) {
    return {
      Icon: CircleX,
      wrapperClassName: 'bg-destructive/10',
      iconClassName: 'text-destructive',
    };
  }

  return {
    Icon: CheckCircle2,
    wrapperClassName: 'bg-green-500/10',
    iconClassName: 'text-green-600',
  };
}

export default function ReservationStatus({ reservationId }: ReservationSuccessProps) {
  const router = useRouter();
  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useGetReservationByIdQuery(reservationId);

  if (isLoading) {
    return (
      <section className='w-full max-w-3xl'>
        <Card className='border-gray-300 bg-gray-100'>
          <CardContent className='flex items-center justify-center gap-2 py-10 text-muted-foreground'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Loading reservation details...</span>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError || !reservation) {
    return (
      <section className='w-full max-w-3xl'>
        <Card className='border-gray-300 bg-gray-100'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
              <AlertCircle className='h-6 w-6 text-destructive' />
            </div>
            <CardTitle>Could not load reservation</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardFooter className='justify-center gap-3'>
            <Button asChild variant='outline'>
              <Link href='/movies'>Back to movies</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    );
  }

  const seatsLabel = reservation.tickets
    .map((ticket) => `${ticket.seat.row}${ticket.seat.number}`)
    .join(', ');
  const isPendingReservation = reservation.status === TReservationStatus.PENDING;
  const isCanceledReservation = reservation.status === TReservationStatus.CANCELLED;
  const canShowCancellationSection =
    reservation.status === TReservationStatus.PENDING ||
    reservation.status === TReservationStatus.PAID;
  const { Icon: StatusIcon, wrapperClassName, iconClassName } = getStatusIcon(reservation.status);

  const handlePayNow = () => {
    router.push(`/reservation/${reservationId}/payment`);
  };

  return (
    <section className='w-full max-w-3xl space-y-4'>
      <Card className='border-gray-300 bg-gray-200'>
        <CardHeader className='items-center text-center'>
          <div
            className={`mb-2 inline-flex mx-auto h-14 w-14 items-center justify-center rounded-full ${wrapperClassName}`}
          >
            <StatusIcon className={`h-7 w-7 ${iconClassName}`} />
          </div>
          <CardTitle className='text-2xl'>
            {isPendingReservation
              ? 'Reservation pending payment'
              : isCanceledReservation
                ? 'Reservation cancelled'
                : 'Reservation completed'}
          </CardTitle>
          <CardDescription>
            {isPendingReservation
              ? `Your reservation #${reservation.id} is held for a limited time. Complete payment to confirm your tickets.`
              : isCanceledReservation
                ? `Reservation #${reservation.id} was canceled and the tickets are no longer active.`
                : `Your tickets have been sent to your email. Reservation #${reservation.id}`}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className='border-gray-300 bg-gray-100'>
        <CardContent className='grid gap-6 py-6 md:grid-cols-[220px_1fr]'>
          <div className='relative h-72 overflow-hidden rounded-lg border bg-gray-200'>
            <Image
              src={reservation.posterImageUrl || '/image_placeholder.png'}
              alt={reservation.movieTitle}
              fill
              className='object-cover'
            />
          </div>

          <div className='space-y-5'>
            <div className='space-y-2'>
              <div className='inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700'>
                <Film className='mr-1 h-3.5 w-3.5' />
                Digital ticket
              </div>
              <h2 className='text-2xl font-semibold tracking-tight'>{reservation.movieTitle}</h2>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(reservation.status)}`}
              >
                {reservation.status}
              </span>
              {isCanceledReservation && (
                <p className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
                  This reservation has been canceled. Create a new reservation to book these seats
                  again.
                </p>
              )}
            </div>

            <div className='grid gap-3 text-sm'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Calendar className='h-4 w-4 text-primary' />
                <span>{formatDate(reservation.startTime)}</span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Clock className='h-4 w-4 text-primary' />
                <span>{formatTime(reservation.startTime)}</span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <MapPin className='h-4 w-4 text-primary' />
                <span>Room {reservation.roomNumber}</span>
              </div>
              {reservation.email && (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Mail className='h-4 w-4 text-primary' />
                  <span>{reservation.email}</span>
                </div>
              )}
            </div>

            <div className='grid gap-2 rounded-lg border bg-gray-200 p-4 text-sm'>
              <div className='flex items-center justify-between gap-4'>
                <span className='text-muted-foreground'>Seats</span>
                <span className='font-medium text-right'>{seatsLabel || '-'}</span>
              </div>
              <div className='flex items-center justify-between gap-4'>
                <span className='text-muted-foreground'>Tickets</span>
                <span className='font-medium'>{reservation.tickets.length}</span>
              </div>
              <div className='flex items-center justify-between gap-4'>
                <span className='text-muted-foreground'>Total</span>
                <span className='text-base font-semibold'>
                  {priceFormatter.format(reservation.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='justify-between gap-2 text-xs text-muted-foreground'>
          <span>Reserved on {formatDate(reservation.reservationDate)}</span>
          <span>{formatTime(reservation.reservationDate)}</span>
        </CardFooter>
      </Card>

      <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-center'>
        {isPendingReservation && (
          <Button className='w-full sm:w-auto' onClick={handlePayNow}>
            Pay now
          </Button>
        )}
        {canShowCancellationSection && (
          <Button asChild variant='outline' className='w-full sm:w-fit'>
            <Link href={`/reservation/cancel/${reservation.cancellationToken}`}>
              Cancel reservation
            </Link>
          </Button>
        )}
        <Button asChild variant='outline' className='w-full sm:w-auto'>
          <Link href='/movies'>
            <ArrowLeft className='h-4 w-4' />
            {isCanceledReservation ? 'Book new reservation' : 'Browse movies'}
          </Link>
        </Button>
        <Button asChild className='w-full sm:w-auto'>
          <Link href='/profile'>
            <Ticket className='h-4 w-4' />
            Go to profile
          </Link>
        </Button>
      </div>
    </section>
  );
}
