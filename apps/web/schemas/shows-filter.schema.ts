import { z } from 'zod';

export const showsFilterSchema = z.object({
  date: z.date({
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'Date is required';
      }
      return 'Invalid date';
    },
  }),
});

export type ShowsFilterValues = z.infer<typeof showsFilterSchema>;
