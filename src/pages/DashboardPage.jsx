import { useState } from 'react';

// Components - Features
import AddTransactionButton from '../components/features/AddTransactionButton';
import DeleteConfirmationModal from '../components/features/DeleteConfirmationModal';
import SummaryCards from '../components/features/SummaryCards';
import TransactionList from '../components/features/TransactionList';
import TransactionModal from '../components/features/TransactionModal';

// Components - UI
import { Card } from '../components/ui';

// Hooks
import { useTransactions } from '../hooks/useTransactions';

// Variables
const RECENT_TRANSACTIONS_LIMIT = 5;

function DashboardPage() {
	const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [editingTransaction, setEditingTransaction] = useState(null);
	const [deletingTransaction, setDeletingTransaction] = useState(null);

	const handleAddTransaction = async (newTransaction) => {
		const result = await addTransaction(newTransaction);
		if(result) setShowTransactionModal(false);
	};

	const handleDeleteTransaction = async (id) => {
		const result = await deleteTransaction(id);
		if (result) setDeletingTransaction(null);
	};

	const handleEditTransaction = (id) => {
		const transaction = transactions.find(t => t.id === id);
		if (transaction) {
			setEditingTransaction(transaction);
		}
	};

	const handleUpdateTransaction = async (updatedTransaction) => {
		const result = await updateTransaction(updatedTransaction);
		if (result) setEditingTransaction(null);
	};

	if (loading) {
		return (
			<main className="max-w-4xl mx-auto px-4 xs:px-6 py-6 xs:py-8 space-y-6">
				<div className="h-46 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-2xl animate-pulse" />
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="h-28 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-2xl animate-pulse" />
					))}
				</div>
				<div className='h-96 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-2xl animate-pulse'/>
			</main>
		);
	}

	return (
		<main className="max-w-4xl mx-auto px-4 xs:px-6 py-6 xs:py-8 pb-24 space-y-6">
			{error && (
				<div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
					<p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
				</div>
			)}

			<SummaryCards />

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
