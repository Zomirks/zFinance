import { useState, useEffect } from 'react';

import Button from './components/ui/Button';
import Card from './components/ui/Card';
import TransactionList from './components/features/TransactionList';
import Header from './components/layout/Header';
import SummaryCards from './components/features/SummaryCards';
import mockTransactions from './data/mockTransactions';
import TransactionModal from './components/features/TransactionModal';

function App() {
	const [transactions, setTransactions] = useState([]);
	const [showTransactionModal, setShowTransactionModal] = useState(false);

	const handleAddTransaction = (newTransaction) => {
		setTransactions(prev => [...prev, newTransaction]);
		setShowTransactionModal(false);
	}

	useEffect(() => {
		setTransactions(mockTransactions);
	}, []);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-900">
			<Header />

			<main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
				<SummaryCards transactions={transactions} previousMonthBalance={2600} />

				<Card title='Dernières Transactions'>
					<TransactionList transactions={transactions} />
				</Card>

				<div className="flex justify-center">
					<Button variant="primary" size="lg" onClick={(e) => setShowTransactionModal(true)}>
						Ajouter
					</Button>
				</div>
			</main>

			{showTransactionModal && (
				<TransactionModal onSubmit={handleAddTransaction} onClose={() => setShowTransactionModal(false)} />
			)}
		</div>
	);
}

export default App;
