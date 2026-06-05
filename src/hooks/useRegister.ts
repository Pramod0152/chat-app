import { useNavigate } from 'react-router-dom';

import { useClientMutation } from '@/hooks/useClientMutation';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, RegisterPayload } from '@/types/auth.types';

function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useClientMutation<AuthResponse, RegisterPayload>({
    request: {
      url: '/auth/register',
      method: 'POST',
    },
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      navigate('/chat');
    },
  });
}

export default useRegister;
