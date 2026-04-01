export enum ReservationStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export interface IReservation {
  id: number;
  date: Date;
  status: ReservationStatus;
  userId: number | undefined;
  guest_emial: string | undefined;
  token: string;
  showId: number;
}

export interface IReservationDetail {
  id: number;
  reservationDate: string;
  status: ReservationStatus;
  email: string | undefined;
  movieTitle: string;
  posterImageUrl: string | null;
  roomNumber: string;
  startTime: string;
  durationMinutes: number;
  tickets: Array<{
    ticketId: number;
    soldPrice: number;
    seat: {
      row: string;
      number: number;
      type: string;
    };
  }>;
  totalPrice: number;
}
