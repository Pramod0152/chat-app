import { useNavigate } from 'react-router-dom';

import { useClientMutation } from '@/hooks/useClientMutation';
import { getFcmToken } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, LoginPayload } from '@/types/auth.types';

function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useClientMutation<AuthResponse, LoginPayload>({
    request: {
      url: '/auth/login',
      method: 'POST',
    },
    prepareBody: async (payload) => {
      const fcm_token = await getFcmToken();
      return {
        ...payload,
        ...(fcm_token ? { fcm_token } : {}),
      };
    },
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      navigate('/chat');
    },
  });
}

export default useLogin;
