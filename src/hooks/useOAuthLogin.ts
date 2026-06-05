import { useMutation } from '@tanstack/react-query';

import { oauthLogin } from '@/api/oauth-login';
import useOnAuthSuccess from '@/hooks/useOnAuthSuccess';
import type { AuthResponse } from '@/types/auth.types';

function useOAuthLogin() {
  const onAuthSuccess = useOnAuthSuccess();

  return useMutation<AuthResponse, Error, void>({
    mutationFn: oauthLogin,
    onSuccess: onAuthSuccess,
  });
}

export default useOAuthLogin;
