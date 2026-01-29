import { createContext, useContext, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);
ThemeContext.displayName = 'ThemeContext';

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useLocalStorage('theme', 'light');

	const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

	// Apply dark mode class to document
	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}, [theme]);

	const value = useMemo(() => ({
		theme,
		setTheme,
		toggleTheme,
	}), [theme]);

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
}

// Hook pour utiliser le thème facilement
export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme doit être utilisé dans un ThemeProvider');
	}
	return context;
}