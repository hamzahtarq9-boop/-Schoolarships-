import { useCallback, useEffect, useState } from 'react';

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

/** useState that persists to localStorage. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));
  useEffect(() => writeStorage(key, value), [key, value]);
  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, setValue, reset];
}
