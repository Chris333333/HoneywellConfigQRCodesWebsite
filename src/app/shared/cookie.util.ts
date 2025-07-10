export function setSession(name: string, value: string) {
  sessionStorage.setItem(name, value);
}

export function getSession(name: string): string | null {
  return sessionStorage.getItem(name);
}

export function deleteSession(name: string) {
  sessionStorage.removeItem(name);
}
