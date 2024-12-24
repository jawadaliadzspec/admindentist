import { storage } from '@awal/storage';
import { ACCESS_TOKEN } from '@/constants/auth';

/** Get token */
export function getToken() {
  return storage.get(ACCESS_TOKEN) || '';
}

/** Clear auth storage */
export function clearAuthStorage() {
  storage.remove(ACCESS_TOKEN);
}
