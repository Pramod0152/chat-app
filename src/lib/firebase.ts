import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

import { firebaseConfig } from './firebase.config';

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js',
    { scope: '/' },
  );
  await navigator.serviceWorker.ready;
  return registration;
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported || !('Notification' in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const serviceWorkerRegistration = await registerMessagingServiceWorker();
    if (!serviceWorkerRegistration) {
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
      serviceWorkerRegistration,
    });

    return token || null;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}
