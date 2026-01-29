import { useState } from 'react';

// Components - Features
import AddTransactionButton from '../components/features/AddTransactionButton';
import DeleteConfirmationModal from '../components/features/DeleteConfirmationModal';
import SummaryCards from '../components/features/SummaryCards';
import TransactionList from '../components/features/TransactionList';
import TransactionModal from '../components/features/TransactionModal';

// Components - UI
import { Button, Card } from '../components/ui';

// Hooks
import useLocalStorage from '../hooks/useLocalStorage';

// Variables
const RECENT_TRANSACTIONS_LIMIT = 5;
const PREVIOUS_MONTH_BALANCE = 2600;

function DashboardPage() {
	const [transactions, setTransactions] = useLocalStorage('transactions', []);
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [editingTransaction, setEditingTransaction] = useState(null);
	const [deletingTransaction, setDeletingTransaction] = useState(null);

	const handleAddTransaction = (newTransaction) => {
		setTransactions(prev => [...prev, newTransaction]);
		setShowTransactionModal(false);
	};

	const handleDeleteTransaction = (id) => {
		setTransactions(prev => prev.filter(t => t.id !== id));
		setDeletingTransaction(null);
	};

	const handleEditTransaction = (id) => {
		const transaction = transactions.find(t => t.id === id);
		if (transaction) {
			setEditingTransaction(transaction);
		}
	};

	const handleUpdateTransaction = (updatedTransaction) => {
		setTransactions(prev => prev.map(t =>
			t.id === updatedTransaction.id ? updatedTransaction : t
		));
		setEditingTransaction(null);
	};

	return (
		<main className="max-w-4xl mx-auto px-4 xs:px-6 py-6 xs:py-8 pb-24 space-y-6">
			<SummaryCards
				transactions={transactions}
				previousMonthBalance={PREVIOUS_MONTH_BALANCE}
			/>

			<Card title="Dernières transactions">
				<TransactionList
					transactions={transactions}
					limit={RECENT_TRANSACTIONS_LIMIT}
					onRequestDelete={setDeletingTransaction}
					onEdit={handleEditTransaction}
				/>
			</Card>

			<AddTransactionButton onClick={() => setShowTransactionModal(true)} />

			{showTransactionModal && (
				<TransactionModal
					onSubmit={handleAddTransaction}
					onClose={() => setShowTransactionModal(false)}
				/>
			)}

			{editingTransaction && (
				<TransactionModal
					transaction={editingTransaction}
					onSubmit={handleUpdateTransaction}
					onClose={() => setEditingTransaction(null)}
				/>
			)}

			{deletingTransaction && (
				<DeleteConfirmationModal
					transaction={deletingTransaction}
					onConfirm={handleDeleteTransaction}
					onClose={() => setDeletingTransaction(null)}
				/>
			)}
		</main>
	);
}

export default DashboardPage;
