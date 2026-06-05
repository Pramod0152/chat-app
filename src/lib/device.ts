const DEVICE_ID_KEY = 'device_id';
const APP_VERSION = '0.0.0';

export function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);

  if (existing) {
    return existing;
  }

  const deviceId = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

export function getDeviceType(): string {
  const userAgent = navigator.userAgent;

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'ios';
  }

  return 'web';
}

export function getAppVersion(): string {
  return APP_VERSION;
}
