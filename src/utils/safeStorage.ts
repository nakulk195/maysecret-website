const APP_STORAGE_KEYS = [
  'guest_cart',
  'redirect_after_login',
  'shipping_address',
  'maysecret_cart',
  'maysecret_wishlist',
  'maysecret_recently_viewed',
  'maysecret_orders',
  'maysecret_profile',
  'user_session',
];

export const isBrowser = () => typeof window !== 'undefined';

export const safeGetItem = (key: string): string | null => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetItem = (key: string, value: string) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore private-mode/storage quota failures.
  }
};

export const safeRemoveItem = (key: string) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
};

export const clearAuthRelatedStorage = () => {
  if (!isBrowser()) return;

  try {
    APP_STORAGE_KEYS.forEach(key => window.localStorage.removeItem(key));
    Object.keys(window.localStorage)
      .filter(key => key.startsWith('sb-') || key.includes('supabase'))
      .forEach(key => window.localStorage.removeItem(key));
  } catch {
    // Ignore storage failures.
  }

  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore storage failures.
  }
};
