import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
			<div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
				<h1 className="text-xl font-bold text-emerald-600 tracking-tight">
					zFinance
				</h1>
				<button
					onClick={toggleTheme}
					className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
					aria-label="Toggle dark mode"
				>
					{theme === 'dark' ? (
						<Sun />
					) : (
						<Moon />
					)}
				</button>
			</div>
		</header>
	)
}
export default Header