'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/users-qurey-hooks';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: createUser, isPending, error } = useRegister();

  const onSubmit = (data: RegisterSchema) => {
    createUser(data);
  };

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-bold'>Create an account</h1>
        <p className='text-gray-500'>Join CinemaPlus for exclusive perks</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Name Fields Row */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label htmlFor='firstName' className='text-sm font-medium'>
              First name
            </label>
            <input
              {...register('firstName')}
              id='firstName'
              className='flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600'
            />
            {errors.firstName && <p className='text-xs text-red-500'>{errors.firstName.message}</p>}
          </div>
          <div className='space-y-2'>
            <label htmlFor='lastName' className='text-sm font-medium'>
              Last name
            </label>
            <input
              {...register('lastName')}
              id='lastName'
              className='flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600'
            />
            {errors.lastName && <p className='text-xs text-red-500'>{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium'>
            Email
          </label>
          <input
            {...register('email')}
            id='email'
            type='email'
            className='flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600'
          />
          {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className='space-y-2'>
          <label htmlFor='password' className='text-sm font-medium'>
            Password
          </label>
          <input
            {...register('password')}
            id='password'
            type='password'
            className='flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600'
          />
          {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
        </div>

        {/* Optional Phone */}
        <div className='space-y-2'>
          <label htmlFor='phone' className='text-sm font-medium'>
            Phone Number (Optional)
          </label>
          <input
            {...register('phoneNumber')}
            id='phone'
            className='flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600'
          />
        </div>

        {/* Newsletter Checkbox */}
        <div className='flex items-center space-x-2'>
          <input
            {...register('newsletterOptIn')}
            type='checkbox'
            id='newsletter'
            className='h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600'
          />
          <label htmlFor='newsletter' className='text-sm text-gray-500'>
            I agree to receive newsletters and updates
          </label>
        </div>

        {/* API Error */}
        {error && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-500'>{error.message}</div>
        )}

        <Button type='submit' className='w-full bg-red-600 hover:bg-red-700' disabled={isPending}>
          {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Create Account
        </Button>
      </form>

      <div className='text-center text-sm text-gray-500'>
        Already have an account?{' '}
        <Link href='/auth/login' className='font-semibold text-red-600 hover:underline'>
          Sign in
        </Link>
      </div>
    </div>
  );
}
