// React
import { useState, useMemo } from 'react';
import { Link } from 'react-router';

// Components - Features
import TransactionItem from './TransactionItem';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// Components - UI
import { Button } from '../ui';

// Context
import { useTransactions } from '../../contexts/TransactionsContext';

// Icons
import { ArrowRight, ArrowRightLeft } from 'lucide-react';

// Utils - Formatters
import { formatCurrency } from '../../utils/formatters';

const FILTER_BUTTONS = [
	{ key: 'all', label: 'Toutes' },
	{ key: 'income', label: 'Revenus' },
	{ key: 'expense', label: 'Dépenses' },
];

const TransactionList = ({ transactions = [], limit = null }) => {
	const [filter, setFilter] = useState('all');
	const {
		openForm,
		deleteTransaction,
		isDeleteConfirmOpen,
		transactionToDelete,
		openDeleteConfirm,
		closeDeleteConfirm,
	} = useTransactions();

	const filtered = useMemo(() => {
		let result;

		switch (filter) {
			case 'income':
				result = transactions.filter(t => (t?.amount ?? 0) > 0);
				break;
			case 'expense':
				result = transactions.filter(t => (t?.amount ?? 0) < 0);
				break;
			default:
				result = [...transactions];
		}

		result.sort((a, b) => new Date(b.date) - new Date(a.date));
		return limit ? result.slice(0, limit) : result;
	}, [filter, transactions, limit]);

	const filteredTotal = useMemo(
		() => formatCurrency(filtered.reduce((sum, t) => sum + (t?.amount ?? 0), 0)),
		[filtered]
	);

	const handleConfirmDelete = async (id) => {
		await deleteTransaction(id);
		closeDeleteConfirm();
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex gap-2 scrollbar-hide">
					{FILTER_BUTTONS.map(({ key, label }) => (
						<Button
							key={key}
							variant={filter === key ? 'primary' : 'secondary'}
							size="sm"
							onClick={() => setFilter(key)}
							className="shrink-0"
						>
							{label}
						</Button>
					))}
				</div>

				{limit && (
					<Link to="/transactions" className='
					text-secondary-500 dark:text-secondary-400
					hover:text-secondary-700 dark:hover:text-secondary-200
					flex items-center justify-end gap-1.5 text-sm
					transition-colors duration-200'>
						<span className='hidden xs:block'>Voir tout</span>
						<ArrowRight size={14} />
					</Link>
				)}
			</div>

			{filtered.length > 0 ? (
				<>
					<div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400 px-1">
						<p>{filtered.length} transaction{filtered.length > 1 ? 's' : ''}</p>
						<p className="font-medium">Total : {filteredTotal}</p>
					</div>

					<ul className="space-y-2">
						{filtered.map((transaction, index) => (
							<TransactionItem
								key={transaction.id}
								transaction={transaction}
								onEdit={() => openForm(transaction)}
								onDelete={() => openDeleteConfirm(transaction)}
								style={{ animationDelay: `${index * 50}ms` }}
							/>
						))}
					</ul>
				</>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="w-20 h-20 mb-4 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
						<ArrowRightLeft
							size={32}
							strokeWidth={1.5}
							className="text-secondary-400 dark:text-secondary-500"
						/>
					</div>
					<p className="text-secondary-700 dark:text-secondary-300 font-medium mb-1">
						Aucune transaction
					</p>
					<p className="text-sm text-secondary-400 dark:text-secondary-500">
						Vos transactions apparaîtront ici
					</p>
				</div>
			)}

			{isDeleteConfirmOpen && (
				<DeleteConfirmationModal
					transaction={transactionToDelete}
					onConfirm={handleConfirmDelete}
					onClose={closeDeleteConfirm}
				/>
			)}
		</div>
	);
};

export default TransactionList;
