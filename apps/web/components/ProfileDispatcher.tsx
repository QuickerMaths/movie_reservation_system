'use client';

import { IUserProfile } from '@/types/users';
import { AdminDashboard } from './AdminDashboard';
import { RegularDashboard } from './RegularDashboard';

interface ProfileDispatcherProps {
  user: IUserProfile;
}

export function ProfileDispatcher({ user }: ProfileDispatcherProps) {
  const isAdmin = user.role === 'ADMIN';

  if (isAdmin) {
    return <AdminDashboard user={user} />;
  }

  return <RegularDashboard user={user} />;
}
