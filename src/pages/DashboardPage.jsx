import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, ArrowRight } from 'lucide-react';

import TransactionList from '../components/features/TransactionList';
import SummaryCards from '../components/features/SummaryCards';
import TransactionModal from '../components/features/TransactionModal';
import DeleteConfirmationModal from '../components/features/DeleteConfirmationModal';
import { Button, Card } from '../components/ui';
import useLocalStorage from '../hooks/useLocalStorage';

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
				<div className="flex items-center justify-between mb-4">
					<Link to="/transactions">
						<Button variant="ghost" size="sm" className="gap-1 -ml-2">
							Voir tout
							<ArrowRight size={16} />
						</Button>
					</Link>
				</div>

				<TransactionList
					transactions={transactions}
					limit={RECENT_TRANSACTIONS_LIMIT}
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

export default DashboardPage;
