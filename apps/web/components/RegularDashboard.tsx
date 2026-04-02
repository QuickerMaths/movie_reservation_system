import { IUserProfile } from '@/types/users';
import { Ticket, User as UserIcon } from 'lucide-react';
import UsersReservations from './UsersReservations';

interface RegularDashboardProps {
  user: IUserProfile;
}

export function RegularDashboard({ user }: RegularDashboardProps) {
  return (
    <div className='space-y-8'>
      {/* Welcome Banner */}
      <div className='flex items-center justify-between rounded-lg bg-gray-900 p-8 text-white shadow-lg'>
        <div>
          <h1 className='text-3xl font-bold'>Hello, {user.firstName}!</h1>
          <p className='mt-2 text-gray-300'>
            Member since {new Date(user.createdAt).getFullYear()}
          </p>
        </div>
        <div className='hidden h-20 w-20 items-center justify-center rounded-full bg-gray-800 md:flex'>
          <span className='text-2xl font-bold text-red-500'>
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </span>
        </div>
      </div>

      <div className='grid gap-8 md:grid-cols-3'>
        {/* Left Column: Personal Info */}
        <div className='md:col-span-1 space-y-6'>
          <div className='rounded-xl border bg-card p-6 shadow-sm'>
            <h3 className='mb-4 flex items-center gap-2 font-semibold'>
              <UserIcon className='h-4 w-4' /> My Details
            </h3>
            <div className='space-y-4 text-sm'>
              <div>
                <label className='text-xs text-muted-foreground'>Full Name</label>
                <p className='font-medium'>
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className='text-xs text-muted-foreground'>Email</label>
                <p className='font-medium'>{user.email}</p>
              </div>
              <div>
                <label className='text-xs text-muted-foreground'>Phone</label>
                <p className='font-medium'>{user.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className='text-xs text-muted-foreground'>Newsletter</label>
                <p className='font-medium'>
                  {user.newsletterOptIn ? 'Subscribed ✅' : 'Not subscribed'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reservations & History */}
        <div className='md:col-span-2 space-y-6'>
          {/* Active Reservations */}
          <div className='rounded-xl border bg-card p-6 shadow-sm'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='flex items-center gap-2 font-semibold'>
                <Ticket className='h-4 w-4' /> My Reservations
              </h3>
            </div>
            <UsersReservations userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
