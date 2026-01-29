import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router';
import { Button } from '../ui';

const Header = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<header
			className="
				sticky top-0 z-40
				bg-white/70 dark:bg-secondary-900/70
				backdrop-blur-xl
				border-b border-white/20 dark:border-secondary-800/50
				safe-area-top
			"
		>
			<div className="max-w-4xl mx-auto px-4 xs:px-6 py-3 xs:py-4 flex items-center justify-between">
				<Link
					className="
						text-xl xs:text-2xl font-bold
						bg-linear-to-r from-primary-500 to-accent-500
						bg-clip-text text-transparent
						tracking-tight
						hover:from-primary-400 hover:to-accent-400
						transition-all
					"
					to="/"
				>
					zFinance
				</Link>

				<nav className="flex items-center gap-1 xs:gap-2">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Paramètres"
					>
						<Settings size={20} />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
					>
						{theme === 'dark' ? (
							<Sun size={20} className="text-amber-400" />
						) : (
							<Moon size={20} />
						)}
					</Button>
				</nav>
			</div>
		</header>
	);
};

export default Header;
