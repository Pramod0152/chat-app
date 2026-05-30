import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { registerApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, RegisterPayload } from '@/types/auth.types';

function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: registerApi,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      navigate('/chat');
    },
  });
}

export default useRegister;
