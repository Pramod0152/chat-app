import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse } from '@/types/auth.types';

function useOnAuthSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return (response: AuthResponse) => {
    setAuth(
      response.data.user,
      response.data.access_token,
      response.data.refresh_token,
    );
    void queryClient.invalidateQueries({ queryKey: ['conversations'] });
    navigate('/chat');
  };
}

export default useOnAuthSuccess;
