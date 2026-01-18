import { IUserProfile } from '@/types/users';
import { ShieldCheck, Film, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminDashboardProps {
  user: IUserProfile;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className='space-y-8'>
      {/* Admin Header */}
      <div className='rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20'>
        <div className='flex items-center gap-4'>
          <div className='rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/40 dark:text-red-400'>
            <ShieldCheck className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-red-900 dark:text-red-100'>Admin Dashboard</h1>
            <p className='text-red-700 dark:text-red-300'>
              Welcome back, {user.firstName}. You have full system access.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Actions Grid (Placeholders) */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Manage Movies */}
        <div className='rounded-xl border bg-card p-6 shadow-sm'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <Film className='h-5 w-5' />
          </div>
          <h3 className='mb-2 font-semibold'>Manage Movies</h3>
          <p className='mb-4 text-sm text-muted-foreground'>
            Add new movies, edit details, or update posters.
          </p>
          <Button className='w-full' variant='outline' disabled>
            Coming Soon
          </Button>
        </div>

        {/* Manage Showtimes */}
        <div className='rounded-xl border bg-card p-6 shadow-sm'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <Calendar className='h-5 w-5' />
          </div>
          <h3 className='mb-2 font-semibold'>Manage Showtimes</h3>
          <p className='mb-4 text-sm text-muted-foreground'>
            Schedule screenings and manage theater availability.
          </p>
          <Button className='w-full' variant='outline' disabled>
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
}
