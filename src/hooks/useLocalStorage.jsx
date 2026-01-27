import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const savedItem = window.localStorage.getItem(key);
            return savedItem ? JSON.parse(savedItem) : initialValue;
        } catch (error) {
            console.warn(`Erreur lecture localStorage "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function
                ? value(storedValue)
                : value;

            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn(`Erreur écriture localStorage "${key}":`, error);
        }
    }

    return [storedValue, setValue];
}

export default useLocalStorage;