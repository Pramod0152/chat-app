import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { loginApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, LoginPayload } from '@/types/auth.types';

function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      navigate('/chat');
    },
  });
}

export default useLogin;
