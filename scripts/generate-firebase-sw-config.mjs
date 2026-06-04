import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'public', 'firebase-sw-config.js');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const index = trimmed.indexOf('=');
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnv(envPath);
const config = {
  apiKey: env.VITE_APP_API_KEY ?? '',
  authDomain: env.VITE_APP_AUTH_DOMAIN ?? '',
  projectId: env.VITE_APP_PROJECT_ID ?? '',
  storageBucket: env.VITE_APP_STORAGE_BUCKET ?? '',
  messagingSenderId: env.VITE_APP_MESSAGING_SENDER_ID ?? '',
  appId: env.VITE_APP_APP_ID ?? '',
};

fs.writeFileSync(
  outPath,
  `const FIREBASE_SW_CONFIG=${JSON.stringify(config)};\n`,
  'utf8',
);

console.log(`Wrote ${outPath}`);
