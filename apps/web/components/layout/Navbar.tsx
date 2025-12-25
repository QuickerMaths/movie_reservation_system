'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Clapperboard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';

const routes = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/', // We can change this to /movies later
    label: 'Movies',
    icon: Clapperboard,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <Link href='/apps/web/public' className='flex items-center gap-2'>
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
          <div className='ml-4 flex gap-2'>
            <Button
              variant='outline'
              className='border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
            >
              Log in
            </Button>
            <Button className='bg-red-600 text-white hover:bg-red-700'>Sign up</Button>
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
              <div className='flex flex-col gap-6 mt-6'>
                <div className='flex items-center gap-2 mb-6'>
                  <Clapperboard className='h-6 w-6 text-red-600' />
                  <span className='text-xl font-bold'>CinemaPlus</span>
                </div>

                <div className='flex flex-col gap-4'>
                  {routes.map((route) => (
                    <Link
                      key={route.label}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className='flex items-center gap-4 text-lg font-medium text-gray-400 hover:text-red-500 transition-colors'
                    >
                      <route.icon className='h-5 w-5' />
                      {route.label}
                    </Link>
                  ))}
                </div>

                <div className='mt-auto flex flex-col gap-3'>
                  <Button
                    variant='outline'
                    className='w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                  >
                    Log in
                  </Button>
                  <Button className='w-full bg-red-600 text-white hover:bg-red-700'>Sign up</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
