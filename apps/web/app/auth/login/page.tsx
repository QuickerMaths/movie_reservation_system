import { LoginForm } from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | CinemaPlus',
  description: 'Log in to your account to manage reservations and view your profile.',
};

export default function LoginPage() {
  return <LoginForm />;
}
