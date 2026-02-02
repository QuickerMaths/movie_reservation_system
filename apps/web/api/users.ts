import { IUser, IUserProfile } from '@/types/users';
import { apiFetch } from '@/lib/utils';
import { RegisterSchema } from '@/schemas/auth.schema';

export async function getCurrentUser(): Promise<IUser> {
  return apiFetch<IUser>('/auth/me', {
    credentials: 'include',
  });
}

export async function logoutUser(): Promise<void> {
  return apiFetch(`/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function loginUser(data: { email: string; password: string }): Promise<IUser> {
  return apiFetch<IUser>(`/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export async function registerUser(data: RegisterSchema): Promise<IUser> {
  return apiFetch<IUser>(`/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export async function getCurrentUserProfile(): Promise<IUserProfile> {
  return apiFetch<IUserProfile>('/users/profile', {
    credentials: 'include',
  });
}
