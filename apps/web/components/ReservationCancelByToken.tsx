'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Loader2, CircleX, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
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
  useCancelReservationByToken,
  useGetReservationByTokenQuery,
} from '@/hooks/reservations-query-hooks';
import { ReservationStatus } from '@/types/reservations';

interface ReservationCancelByTokenProps {
  token: string;
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

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

export default function ReservationCancelByToken({ token }: ReservationCancelByTokenProps) {
  const { data: reservation, isLoading, isError, error } = useGetReservationByTokenQuery(token);
  const {
    mutate: cancelReservation,
    isPending: isCancelling,
    error: cancelError,
  } = useCancelReservationByToken();

  const canCancelByTime = useMemo(() => {
    if (!reservation) {
      return false;
    }

    const startAt = new Date(reservation.startTime).getTime();
    const now = Date.now();

    return now <= startAt - 24 * 60 * 60 * 1000;
  }, [reservation]);

  if (isLoading) {
    return (
      <Card className='w-full max-w-2xl'>
        <CardContent className='flex items-center justify-center gap-2 py-10 text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span>Loading reservation...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError || !reservation) {
    return (
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Could not load reservation</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : 'Please try again later.'}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant='outline'>
            <Link href='/movies'>Back to movies</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const isCancelled = reservation.status === ReservationStatus.CANCELLED;
  const isPaidOrPending =
    reservation.status === ReservationStatus.PENDING ||
    reservation.status === ReservationStatus.PAID;
  const cancellationDisabled = isCancelled || !isPaidOrPending || !canCancelByTime || isCancelling;

  const seatsLabel = reservation.tickets
    .map((ticket) => `${ticket.seat.row}${ticket.seat.number}`)
    .join(', ');

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <div className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
          <CircleX className='h-4 w-4' />
          Guest cancellation
        </div>
        <CardTitle>Cancel reservation #{reservation.id}</CardTitle>
        <CardDescription>
          Use this page to cancel your reservation. Cancellation is allowed only at least 24 hours
          before the show start.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 text-sm'>
        <div className='grid gap-2'>
          <div className='flex items-center gap-2'>
            <Ticket className='h-4 w-4 text-primary' />
            <span>{reservation.movieTitle}</span>
          </div>
          <div className='flex items-center gap-2'>
            <MapPin className='h-4 w-4 text-primary' />
            <span>{reservation.roomNumber}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4 text-primary' />
            <span>{formatDate(reservation.startTime)}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-primary' />
            <span>{formatTime(reservation.startTime)}</span>
          </div>
          <div>Seats: {seatsLabel || '-'}</div>
          <div>Status: {reservation.status}</div>
        </div>

        {!canCancelByTime && !isCancelled ? (
          <p className='rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive'>
            This reservation can no longer be cancelled because less than 24 hours remain before the
            show starts.
          </p>
        ) : null}

        {cancelError instanceof Error ? (
          <p className='rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive'>
            {cancelError.message}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        <Button asChild variant='outline' className='w-full sm:w-auto'>
          <Link href='/movies'>Back to movies</Link>
        </Button>
        <Button
          className='w-full sm:w-auto'
          disabled={cancellationDisabled}
          onClick={() => cancelReservation(token)}
        >
          {isCancelling ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Cancelling...
            </>
          ) : isCancelled ? (
            'Already cancelled'
          ) : (
            'Cancel reservation'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
