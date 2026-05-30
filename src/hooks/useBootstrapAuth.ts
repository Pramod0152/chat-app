import { useEffect } from 'react';

import { getMeApi } from '@/api/user.api';
import { getToken } from '@/lib/token';
import { useAuthStore } from '@/store/auth.store';

function useBootstrapAuth(): void {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setBootstrapping(false);
      return;
    }

    async function bootstrap(currentToken: string): Promise<void> {
      try {
        const { data } = await getMeApi();
        setAuth(data, currentToken);
      } catch {
        clearAuth();
      } finally {
        setBootstrapping(false);
      }
    }

    void bootstrap(token);
  }, [setAuth, clearAuth, setBootstrapping]);
}

export default useBootstrapAuth;
