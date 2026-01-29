import { useState } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

import useLocalStorage from '../hooks/useLocalStorage';
import { Card, Button } from '../components/ui';
import TransactionList from '../components/features/TransactionList';
import TransactionModal from '../components/features/TransactionModal';
import DeleteConfirmationModal from '../components/features/DeleteConfirmationModal';

function TransactionsPage() {
	const [transactions, setTransactions] = useLocalStorage('transactions', []);
	const [search, setSearch] = useState('');
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

	const filteredTransactions = transactions.filter(t =>
		t?.description?.toLowerCase().includes(search.toLowerCase()) ||
		t?.category?.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<main className="max-w-4xl mx-auto px-4 xs:px-6 py-6 xs:py-8 pb-24 space-y-6">
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
					<Search
						size={18}
						className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500"
					/>
					<input
						type="text"
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

			<div className="fixed bottom-6 right-4 xs:right-6 z-30 safe-area-bottom">
				<Button
					variant="primary"
					size="lg"
					onClick={() => setShowTransactionModal(true)}
					className="
						rounded-full shadow-2xl shadow-primary-500/30
						hover:shadow-primary-500/40 hover:scale-105
						active:scale-95
						w-14 h-14 xs:w-auto xs:h-auto xs:rounded-xl
						p-0 xs:px-6 xs:py-3
					"
					aria-label="Ajouter une transaction"
				>
					<Plus size={24} className="xs:hidden" />
					<span className="hidden xs:flex items-center gap-2">
						<Plus size={20} />
						Ajouter
					</span>
				</Button>
			</div>

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
