import { useState } from 'react';
import { Moon, Sun, Download, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions } from '../../contexts/TransactionsContext';
import { Link } from 'react-router';
import { Button } from '../ui';
import { exportTransactions, getExportFilename, downloadFile } from '../../services/dataTransfer';
import ImportModal from '../features/ImportModal';

const Header = () => {
	const { theme, toggleTheme } = useTheme();
	const { refresh } = useTransactions();
	const [showImportModal, setShowImportModal] = useState(false);

	const handleExport = () => {
		const blob = exportTransactions();
		const filename = getExportFilename();
		downloadFile(blob, filename);
	};

	const handleImportComplete = () => {
		refresh();
	};

	return (
		<>
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
							onClick={handleExport}
							aria-label="Exporter les données"
						>
							<Download size={20} />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowImportModal(true)}
							aria-label="Importer des données"
						>
							<Upload size={20} />
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

			{showImportModal && (
				<ImportModal
					onClose={() => setShowImportModal(false)}
					onImportComplete={handleImportComplete}
				/>
			)}
		</>
	);
};

export default Header;
