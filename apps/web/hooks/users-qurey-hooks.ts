import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logoutUser, getCurrentUserProfile } from '@/api/users';
import { useRouter } from 'next/navigation';
import { LoginSchema, RegisterSchema } from '@/schemas/auth.schema';
import { loginUser, registerUser } from '@/api/users';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginSchema) => loginUser(data),
    onSuccess: (user) => {
      queryClient.setQueryData(['current-user'], user);
      router.push('/');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterSchema) => registerUser(data),
    onSuccess: (user) => {
      queryClient.setQueryData(['current-user'], user);
      router.push('/');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['current-user'], null);
      router.push('/');
    },
  });
}

export function useGetCurrentUserProfile() {
  return useQuery({
    queryKey: ['current-user-profile'],
    queryFn: () => getCurrentUserProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
