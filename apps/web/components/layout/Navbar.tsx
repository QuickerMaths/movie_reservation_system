'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Clapperboard, Home, User, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useCurrentUser, useLogout } from '@/hooks/users-qurey-hooks';

const routes = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/movies',
    label: 'Movies',
    icon: Clapperboard,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center gap-2'>
            <Clapperboard className='h-6 w-6 text-red-600' />
            <span className='text-xl font-bold text-white tracking-tight'>
              Cinema<span className='text-red-600'>Plus</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-6'>
          {routes.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-red-500 ${
                pathname === route.href ? 'text-white' : 'text-gray-400'
              }`}
            >
              {route.label}
            </Link>
          ))}

          {/* Auth Section */}
          <div className='ml-4 flex gap-2'>
            {isLoading ? (
              // Loading State Skeleton
              <Button variant='ghost' disabled>
                <Loader2 className='h-4 w-4 animate-spin' />
              </Button>
            ) : user ? (
              // 2. Logged In View
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='relative h-8 w-8 rounded-full bg-gray-800'>
                    <span className='text-xs font-bold text-red-500'>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href='/profile'>
                    <DropdownMenuItem className='cursor-pointer'>
                      <User className='mr-2 h-4 w-4' />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='cursor-pointer text-red-600 focus:text-red-600'
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // 3. Guest View
              <>
                <Button
                  variant='outline'
                  className='border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                  asChild
                >
                  <Link href='/auth/login'>Log in</Link>
                </Button>

                <Button className='bg-red-600 text-white hover:bg-red-700' asChild>
                  <Link href='/auth/register'>Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation (Hamburger) */}
        <div className='md:hidden'>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='bg-gray-950 border-gray-800 text-white'>
              <SheetTitle className='text-white sr-only'>Navigation Menu</SheetTitle>
              {/* ... (Keep existing mobile logic, but update Auth buttons similarly) ... */}
              <div className='flex flex-col gap-6 mt-6'>
                {/* ... routes ... */}
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Link key={route.href} href={route.href} onClick={() => setIsOpen(false)}>
                      <Button variant='ghost' className='w-full justify-start gap-2'>
                        {Icon && <Icon className='h-4 w-4' />}
                        <span>{route.label}</span>
                      </Button>
                    </Link>
                  );
                })}
                {/* Mobile Auth Buttons */}
                <div className='mt-auto flex flex-col gap-3'>
                  {user ? (
                    <>
                      <div className='flex items-center gap-3 px-2 py-4 border-b border-gray-800'>
                        <div className='h-10 w-10 rounded-full bg-red-600 flex items-center justify-center font-bold'>
                          {user.firstName}
                        </div>
                        <div>
                          <p className='font-medium'>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className='text-sm text-gray-400'>{user.email}</p>
                        </div>
                      </div>
                      <Link href='/profile' onClick={() => setIsOpen(false)}>
                        <Button variant='outline' className='w-full justify-start gap-2'>
                          <User className='h-4 w-4' /> Profile
                        </Button>
                      </Link>
                      <Button
                        variant='destructive'
                        className='w-full justify-start gap-2'
                        onClick={() => {
                          logoutMutation.mutate();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className='h-4 w-4' /> Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href='/auth/login' onClick={() => setIsOpen(false)}>
                        <Button variant='outline' className='w-full'>
                          Log in
                        </Button>
                      </Link>
                      <Link href='/auth/register' onClick={() => setIsOpen(false)}>
                        <Button className='w-full bg-red-600'>Sign up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
