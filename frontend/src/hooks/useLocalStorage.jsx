import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      if (newValue === null || newValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  };

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue ? JSON.parse(e.newValue) : null);
      } catch {
        setValue(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);
  return [value, setStoredValue];

}
