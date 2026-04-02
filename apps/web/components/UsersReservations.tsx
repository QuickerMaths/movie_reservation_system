'use client';

import { useMemo, useState } from 'react';
import { Calendar, Clock, Loader2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useCancelReservationLoggedUser,
  useGetReservationsByUserIdQuery,
} from '@/hooks/reservations-query-hooks';
import { ReservationStatus } from '@/types/reservations';
import Link from 'next/link';
import { mapPaymentStatusToRouteStatus } from '@/helpers/payments';

interface MyReservationsProps {
  userId: number;
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

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function formatDate(value: Date | string): string {
  return dateFormatter.format(toDate(value));
}

function formatTime(value: Date | string): string {
  return timeFormatter.format(toDate(value));
}

export default function UsersReservations({ userId }: MyReservationsProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, error, isFetching } = useGetReservationsByUserIdQuery(
    userId,
    page,
    limit,
  );

  const {
    mutate: cancelReservation,
    isPending: isCancelling,
    error: cancelError,
  } = useCancelReservationLoggedUser();

  const reservations = data?.data ?? [];
  const meta = data?.meta;

  const canGoPrev = useMemo(() => page > 1, [page]);
  const canGoNext = useMemo(() => Boolean(meta && page < meta.totalPages), [meta, page]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center gap-2 py-12 text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span>Loading your reservations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
        {error instanceof Error ? error.message : 'Could not load your reservations.'}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center text-muted-foreground'>
        <Ticket className='mb-4 h-10 w-10 opacity-20' />
        <p>You have no reservations yet.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {cancelError instanceof Error ? (
        <p className='rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
          {cancelError.message}
        </p>
      ) : null}

      <div className='space-y-3'>
        {reservations.map((reservation) => {
          const canCancel =
            reservation.status === ReservationStatus.PENDING ||
            reservation.status === ReservationStatus.PAID;

          return (
            <div
              key={reservation.id}
              className='rounded-lg border p-4 transition-colors hover:bg-muted/30'
            >
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Reservation #{reservation.id}</p>
                  <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                    <span className='inline-flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5' />
                      {formatDate(reservation.date)}
                    </span>
                    <span className='inline-flex items-center gap-1'>
                      <Clock className='h-3.5 w-3.5' />
                      {formatTime(reservation.date)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        reservation.status === ReservationStatus.PAID
                          ? 'bg-emerald-500/10 text-emerald-700'
                          : reservation.status === ReservationStatus.PENDING
                            ? 'bg-amber-500/10 text-amber-700'
                            : 'bg-rose-500/10 text-rose-700'
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                </div>
                <div className={`flex flex-col items-stretch gap-2 sm:flex-row sm:items-center`}>
                  <Button variant='outline' className='w-full sm:w-auto'>
                    <Link
                      href={`/reservation/${reservation.id}/payment/${mapPaymentStatusToRouteStatus(reservation.status)}`}
                    >
                      View details
                    </Link>
                  </Button>

                  <Button
                    variant='outline'
                    disabled={!canCancel || isCancelling}
                    onClick={() => cancelReservation(reservation.id)}
                    className='w-full sm:w-auto'
                  >
                    {isCancelling
                      ? 'Cancelling...'
                      : canCancel
                        ? 'Cancel reservation'
                        : 'Cancelled'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex flex-col items-center justify-between gap-2 pt-2 text-sm sm:flex-row'>
        <p className='text-muted-foreground'>
          Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
          {meta ? ` • ${meta.total} total` : ''}
        </p>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={!canGoPrev || isFetching}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled={!canGoNext || isFetching}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
