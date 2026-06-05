import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { ssoLoginApi } from '@/api/auth.api';
import { getAppVersion, getDeviceId, getDeviceType } from '@/lib/device';
import { auth, getFcmToken } from '@/lib/firebase';
import type { AuthResponse } from '@/types/auth.types';

export async function oauthLogin(): Promise<AuthResponse> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  const sso_token = await result.user.getIdToken();
  const fcm_token = await getFcmToken();

  return ssoLoginApi({
    sso_token,
    ...(fcm_token ? { fcm_token } : {}),
    device_id: getDeviceId(),
    device_type: getDeviceType(),
    version: getAppVersion(),
  });
}
