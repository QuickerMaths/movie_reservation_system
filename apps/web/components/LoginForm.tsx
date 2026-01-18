'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/users-qurey-hooks';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  return (
    <div className='mx-auto w-full max-w-sm space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-bold'>Welcome back</h1>
        <p className='text-gray-500'>Enter your credentials to sign in</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Email Field */}
        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium leading-none'>
            Email
          </label>
          <input
            {...register('email')}
            id='email'
            type='email'
            placeholder='m@example.com'
            className='flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
          {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <label htmlFor='password' className='text-sm font-medium leading-none'>
            Password
          </label>
          <input
            {...register('password')}
            id='password'
            type='password'
            className='flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
          {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
        </div>

        {/* Global API Error */}
        {error && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-500'>{error.message}</div>
        )}

        <Button type='submit' className='w-full bg-red-600 hover:bg-red-700' disabled={isPending}>
          {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Sign In
        </Button>
      </form>

      <div className='text-center text-sm text-gray-500'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/register' className='font-semibold text-red-600 hover:underline'>
          Sign up
        </Link>
      </div>
    </div>
  );
}
