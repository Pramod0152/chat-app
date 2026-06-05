import { useClientMutation } from '@/hooks/useClientMutation';
import useOnAuthSuccess from '@/hooks/useOnAuthSuccess';
import { getFcmToken } from '@/lib/firebase';
import type { AuthResponse, LoginPayload } from '@/types/auth.types';

function useLogin() {
  const onAuthSuccess = useOnAuthSuccess();

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
    onSuccess: onAuthSuccess,
  });
}

export default useLogin;
