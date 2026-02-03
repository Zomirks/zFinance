// Components - Features
import AddTransactionButton from '../components/features/AddTransactionButton';
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
	const { openForm, filteredTransactions, error, loading } = useTransactions();

	if (loading) {
		return (
			<main className="max-w-4xl mx-auto px-4 xs:px-6 py-6 xs:py-8 space-y-6">
				<div className="h-46 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-2xl animate-pulse" />
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
					{[...Array(4)].map((_, i) => (
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
					transactions={filteredTransactions}
					limit={RECENT_TRANSACTIONS_LIMIT}
				/>
			</Card>

			<AddTransactionButton onClick={() => openForm()} />

			<TransactionModal />
		</main>
	);
}

export default DashboardPage;
