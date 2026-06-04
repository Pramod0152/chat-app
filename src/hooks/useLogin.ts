import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { loginApi } from '@/api/auth.api';
import { getFcmToken } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, LoginPayload } from '@/types/auth.types';

function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const fcm_token = await getFcmToken();
      return loginApi({
        ...payload,
        ...(fcm_token ? { fcm_token } : {}),
      });
    },
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      navigate('/chat');
    },
  });
}

export default useLogin;
