import { formatCurrency } from './utils/formatters';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import TransactionList from './components/features/TransactionList';
import Header from './components/layout/Header';

function App() {
	function handleClick(e) {}

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
			<Header />

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
					<TransactionList transactions={mockTransactions} />
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
