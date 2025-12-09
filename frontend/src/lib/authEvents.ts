export const AUTH_CHANGE_EVENT = '@sukatech:auth-change';

export const notifyAuthChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};
