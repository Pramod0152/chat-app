import { useClientMutation } from '@/hooks/useClientMutation';
import useOnAuthSuccess from '@/hooks/useOnAuthSuccess';
import type { AuthResponse, RegisterPayload } from '@/types/auth.types';

function useRegister() {
  const onAuthSuccess = useOnAuthSuccess();

  return useClientMutation<AuthResponse, RegisterPayload>({
    request: {
      url: '/auth/register',
      method: 'POST',
    },
    onSuccess: onAuthSuccess,
  });
}

export default useRegister;
