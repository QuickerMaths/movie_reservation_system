export interface IReservation {
  reservation_id: number;
  reservation_date: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  user_id: number | undefined;
  guest_email: string | undefined;
  cancellation_token: string;
  show_id: number;
}
