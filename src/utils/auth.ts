export interface UserSession {
  firstName: string;
  lastName: string;
  phone: string;
  loggedIn: boolean;
}

export const getLoggedInUser = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user_session');
  return user ? JSON.parse(user) : null;
};

export const setUserSession = (user: Omit<UserSession, 'loggedIn'>) => {
  localStorage.setItem(
    'user_session',
    JSON.stringify({
      ...user,
      loggedIn: true,
    })
  );
};

export const removeUserSession = () => {
  localStorage.removeItem('user_session');
  window.dispatchEvent(new Event('storage')); // Trigger storage event for other tabs
};

export const isAuthenticated = (): boolean => {
  const user = getLoggedInUser();
  return !!user?.loggedIn;
};
