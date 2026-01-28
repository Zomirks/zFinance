import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router';
import { Button } from '../ui';

const Header = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
			<div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
				<Link
					className="text-xl font-bold text-emerald-600 tracking-tight"
					to="/"
				>
					zFinance
				</Link>

				<div className='flex gap-2'>
					<Button variant='secondary'>
						<Settings />
					</Button>

					<Button variant='secondary'
						onClick={toggleTheme}
						aria-label="Toggle dark mode"
					>
						{theme === 'dark' ? (
							<Sun />
						) : (
							<Moon />
						)}
					</Button>
				</div>
			</div>
		</header>
	)
}
export default Header