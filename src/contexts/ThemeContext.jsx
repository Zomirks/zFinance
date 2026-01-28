import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useLocalStorage('theme', 'light');

	const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

	const value = {
		theme,
		setTheme,
		toggleTheme,
	};

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