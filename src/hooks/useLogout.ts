import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { disconnectSocket } from '@/api/socket';
import { useAuthStore } from '@/store/auth.store';

function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    clearAuth();
    queryClient.removeQueries({ queryKey: ['conversations'] });
    disconnectSocket();
    navigate('/login');
  };
}

export default useLogout;
