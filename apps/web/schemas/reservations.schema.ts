import { z } from 'zod';

export const createReservationSchema = z.object({
  show_id: z.number({
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'Show ID is required';
      }
      return 'Show ID must be a number';
    },
  }),
  seat_ids: z.array(z.number(), {
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'Seat IDs must be an array of numbers';
      }
      return 'Seat IDs are required';
    },
  }),
  guest_email: z.string().email('Invalid email address').optional(),
});

export type ReservationsSchema = z.infer<typeof createReservationSchema>;
