import { isBrowser, safeGetItem, safeRemoveItem, safeSetItem } from './safeStorage';

export interface UserSession {
  firstName: string;
  lastName: string;
  phone: string;
  loggedIn: boolean;
}

export const getLoggedInUser = (): UserSession | null => {
  const user = safeGetItem('user_session');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setUserSession = (user: Omit<UserSession, 'loggedIn'>) => {
  safeSetItem(
    'user_session',
    JSON.stringify({
      ...user,
      loggedIn: true,
    })
  );
};

export const removeUserSession = () => {
  safeRemoveItem('user_session');
  if (isBrowser()) {
    window.dispatchEvent(new Event('storage')); // Trigger storage event for other tabs
  }
};

export const isAuthenticated = (): boolean => {
  const user = getLoggedInUser();
  return !!user?.loggedIn;
};
