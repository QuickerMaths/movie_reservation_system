export interface IShows {
  id: number;
  showDay: string;
  showTime: string;
}

export interface IShowsSeats {
  id: number;
  row: string;
  seatNumber: number;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'HELD' | 'TAKEN';
}
