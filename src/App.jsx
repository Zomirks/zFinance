import Button from './components/ui/Button';
import Card from './components/ui/Card';
import TransactionList from './components/features/TransactionList';
import Header from './components/layout/Header';
import SummaryCards from './components/features/SummaryCards';
import mockTransactions from './data/mockTransactions';

function App() {
	function handleClick(e) {}

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-900">
			<Header />

			<main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
				<SummaryCards transactions={mockTransactions} previousMonthBalance={2600} />

				<Card title='Dernières Transactions'>
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
