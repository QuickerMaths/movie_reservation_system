import { RegisterForm } from '@/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | CinemaPlus',
  description: 'Join CinemaPlus to book tickets and get exclusive offers.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
