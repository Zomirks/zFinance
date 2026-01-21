import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from './utils/formatters';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import TransactionItem from './components/features/TransactionItem';

function App() {
	const [darkMode, setDarkMode] = useState(() => {
		const saved = localStorage.getItem('darkMode');
		return saved ? JSON.parse(saved) : false;
	});

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('darkMode', JSON.stringify(darkMode));
	}, [darkMode]);

	function handleClick(e) {

	}

	const mockTransactions = [
		{ id: '1', amount: 2500, description: 'Salaire Janvier', category: 'Salaire', date: '2024-01-01', status: 'completed' },
		{ id: '2', amount: -45.99, description: 'Carrefour', category: 'Courses', date: '2024-01-05', status: 'completed' },
		{ id: '3', amount: -29.99, description: 'Netflix', category: 'Abonnements', date: '2024-01-05', status: 'completed' },
		{ id: '4', amount: -65.00, description: 'Essence', category: 'Transport', date: '2024-01-08', status: 'pending' },
		{ id: '5', amount: 150, description: 'Remboursement', category: 'Autres', date: '2024-01-10', status: 'completed' },
	];

	const balance = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-900">
			<header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
				<div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
					<h1 className="text-xl font-bold text-emerald-600 tracking-tight">
						zFinance
					</h1>
					<button
						onClick={() => setDarkMode(!darkMode)}
						className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
						aria-label="Toggle dark mode"
					>
						{darkMode ? (
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
							</svg>
						)}
					</button>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
				<Card className="bg-linear-to-br from-emerald-600 to-emerald-700 border-0 relative overflow-hidden p-8">
					<div className="absolute bottom-0 right-4 flex items-end opacity-25 pointer-events-none">
						<div className="flex flex-col items-center text-white leading-none">
							<span className="font-black text-8xl">{new Date().getDate()}</span>
							<span className="font-bold text-3xl tracking-widest">
								{new Date().toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
							</span>
						</div>
					</div>

					<div className='text-center xs:text-start'>
						<p className="text-emerald-100 text-sm font-medium uppercase tracking-wide mb-2">
							Solde actuel
						</p>
						<p className={`text-3xl xs:text-5xl font-bold text-white`}>
							{formatCurrency(balance)}
						</p>
					</div>
				</Card>

				<Card title="Transactions récentes">
					<ul className="divide-y divide-slate-100 dark:divide-slate-700">
						{mockTransactions.map((t) => (
							<TransactionItem id={t.id} amount={t.amount} description={t.description} category={t.category} date={t.date} status={t.status} />
						))}
					</ul>
				</Card>

				<div className="flex justify-center">
					<Button variant="primary" size="lg" onClick={handleClick}>
						Ajouter
					</Button>
				</div>
			</main>
		</div>
	);
}

export default App;
