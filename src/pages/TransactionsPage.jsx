import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

// Components - Features
import AddTransactionButton from '../components/features/AddTransactionButton';
import DeleteConfirmationModal from '../components/features/DeleteConfirmationModal';
import TransactionList from '../components/features/TransactionList';
import TransactionModal from '../components/features/TransactionModal';

// Components - UI
import { Card, Button } from '../components/ui';

// Hooks
import { useTransactions } from '../hooks/useTransactions';

function TransactionsPage() {
	const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
	const [search, setSearch] = useState('');
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

	const filteredTransactions = transactions.filter(t =>
		t?.description?.toLowerCase().includes(search.toLowerCase()) ||
		t?.category?.toLowerCase().includes(search.toLowerCase())
	);

	if (loading) {
		return (
			<main className="max-w-4xl mx-auto px-4 xs:px-6 py-6 xs:py-8 space-y-6">
				<div className="h-10 w-48 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-xl animate-pulse" />
				<div className="h-96 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-2xl animate-pulse" />
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

			<div className="flex items-center gap-3">
				<Link to="/">
					<Button variant="ghost" size="icon" aria-label="Retour">
						<ArrowLeft size={20} />
					</Button>
				</Link>
				<h1 className="text-xl xs:text-2xl font-bold text-secondary-900 dark:text-white">
					Transactions
				</h1>
			</div>

			<Card>
				<div className="relative mb-5">
					<label htmlFor="transaction-search" className="sr-only">
						Rechercher une transaction
					</label>
					<Search
						size={18}
						className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500"
						aria-hidden="true"
					/>
					<input
						type="text"
						id="transaction-search"
						placeholder="Rechercher une transaction..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="
							w-full pl-11 pr-4 py-3
							bg-white/50 dark:bg-secondary-800/50
							backdrop-blur-sm
							border border-secondary-200/50 dark:border-secondary-700/50
							rounded-xl
							text-secondary-900 dark:text-secondary-100
							placeholder-secondary-400 dark:placeholder-secondary-500
							focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
							transition-all
						"
					/>
				</div>

				<TransactionList
					transactions={filteredTransactions}
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

export default TransactionsPage;
