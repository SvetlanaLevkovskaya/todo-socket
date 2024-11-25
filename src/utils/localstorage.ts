export const saveToLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export const readFromLocalStorage = (key: string, fallback: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || fallback
  }
  return fallback
}
