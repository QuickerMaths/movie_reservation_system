'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { IShowsSeats } from '@/types/shows';
import { useCreateReservation } from '@/hooks/reservations-query-hooks';
import { useShowsSeatsIdQuery } from '@/hooks/shows-query-hooks';
import { useCurrentUser } from '@/hooks/users-qurey-hooks';

export default function SeatPicker({ showId }: { showId: string }) {
  const { data: seats } = useShowsSeatsIdQuery({ showId });
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { mutate: reserve, isPending } = useCreateReservation();
  const [email, setEmail] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const rows = useMemo(() => {
    if (!seats) return [];
    return seats.reduce(
      (acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
      },
      {} as Record<string, IShowsSeats[]>,
    );
  }, [seats]);

  const maxSeatsInRow = useMemo(() => {
    return Math.max(...Object.values(rows).map((row) => row.length), 0);
  }, [rows]);

  const handleReserve = () => {
    if (selectedIds.length === 0) return;

    reserve({
      show_id: +showId,
      seat_ids: selectedIds,
      guest_email: email,
    });
  };

  return (
    <div className='flex flex-col gap-10 items-center w-full max-w-5xl mx-auto p-4'>
      {/* Visual Screen */}
      <div className='w-4/5 max-w-2xl text-center mb-4'>
        <div className='h-1.5 w-full bg-blue-500/30 shadow-[0_-4px_20px_rgba(59,130,246,0.6)] rounded-full mb-2' />
        <span className='text-[10px] uppercase tracking-[0.5em] text-slate-500 font-semibold'>
          Screen
        </span>
      </div>

      {/* Seats Grid */}
      <div className='flex flex-col gap-6 w-full overflow-x-auto pb-8 custom-scrollbar'>
        {Object.entries(rows).map(([label, rowSeats]) => (
          <div
            key={label}
            className='grid items-start gap-4'
            style={{
              // We keep the label columns fixed and let seats distribute
              gridTemplateColumns: `2rem repeat(${maxSeatsInRow}, minmax(2rem, 1fr)) 2rem`,
            }}
          >
            {/* Left Row Label */}
            <span className='text-xs font-bold text-slate-500 self-center text-center'>
              {label}
            </span>

            {/* The Seats */}
            {rowSeats.map((seat) => {
              const isSelected = selectedIds.includes(seat.id);
              const isVIP = seat.type === 'VIP';
              const isOccupied = seat.status === 'TAKEN';

              return (
                <div key={seat.id} className='flex flex-col items-center gap-1.5'>
                  <button
                    disabled={isOccupied}
                    onClick={() => {
                      setSelectedIds((prev) =>
                        isSelected ? prev.filter((id) => id !== seat.id) : [...prev, seat.id],
                      );
                      setTotalPrice((prev) => (isSelected ? prev - seat.price : prev + seat.price));
                    }}
                    className={cn(
                      'aspect-square w-full min-w-[2rem] max-w-[2.5rem] rounded-md transition-all duration-200 border flex items-center justify-center',
                      // Available
                      seat.status === 'AVAILABLE' &&
                        'bg-slate-800 border-slate-600 hover:border-primary cursor-pointer',
                      // Occupied (Taken or Held)
                      isOccupied && 'bg-slate-900 border-transparent opacity-30 cursor-not-allowed',
                      // VIP State
                      isVIP &&
                        seat.status === 'AVAILABLE' &&
                        !isSelected &&
                        'border-yellow-500/50 text-yellow-500',
                      // Selected State
                      isSelected &&
                        'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20',
                    )}
                  >
                    {/* Seat Icon - We can put a small icon or leave empty since number is below */}
                    <div
                      className={cn(
                        'w-1/2 h-1/2 rounded-sm border-t-2 opacity-20',
                        isSelected ? 'border-white' : 'border-slate-400',
                      )}
                    />
                  </button>

                  {/* Number Below the Seat */}
                  <span
                    className={cn(
                      'text-[10px] font-medium transition-colors',
                      isSelected ? 'text-primary font-bold' : 'text-white',
                    )}
                  >
                    {seat.seatNumber}
                  </span>
                </div>
              );
            })}

            {/* Right Row Label */}
            <span className='text-xs font-bold text-slate-500 self-center text-center'>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Section: Legend + Action */}
      <div className='w-full max-w-2xl flex flex-col gap-8 items-center border-t border-slate-800 pt-8'>
        {/* The Legend */}
        <div className='flex flex-wrap justify-center gap-6 text-xs text-slate-400'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-slate-800 border border-slate-600' />
            <span>Available</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-primary border border-primary shadow-sm' />
            <span>Selected</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-slate-900 opacity-30' />
            <span>Occupied</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded border border-yellow-500/50 bg-slate-800' />
            <span className='text-yellow-500/80'>VIP</span>
          </div>
        </div>

        {/* Reservation Action */}
        <div className='w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800'>
          {!user && !isUserLoading && (
            <div className='flex flex-col gap-2 w-full animate-in fade-in slide-in-from-top-2 duration-300'>
              <label
                htmlFor='email'
                className='text-xs font-semibold text-slate-400 uppercase tracking-widest'
              >
                Email for Ticket Delivery
              </label>
              <input
                id='email'
                type='email'
                placeholder='enter your email to continue...'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                required
              />
              <p className='text-[10px] text-slate-500 italic'>
                * Since you are not logged in, we need your email to send the booking confirmation.
              </p>
            </div>
          )}

          <div className='text-center sm:text-left'>
            <p className='text-slate-500 text-xs uppercase tracking-widest'>Total Price</p>
            <p className='text-2xl font-bold text-white'>${totalPrice.toFixed(2)}</p>
          </div>

          <button
            onClick={handleReserve}
            disabled={
              selectedIds.length === 0 || isPending || (!user && !email.includes('@')) // Basic validation
            }
            className='w-full sm:w-auto px-12 py-4 bg-primary hover:bg-primary/90 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2'
          >
            {isPending ? (
              <div className='h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            ) : (
              <>Reserve Now</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
