'use client';

import { useGetCurrentUserProfile } from '@/hooks/users-qurey-hooks';
import { ProfileDispatcher } from '@/components/ProfileDispatcher';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: user, isLoading } = useGetCurrentUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className='flex h-[50vh] w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <ProfileDispatcher user={user} />
    </div>
  );
}
