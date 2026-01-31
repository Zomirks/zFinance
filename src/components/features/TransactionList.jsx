import { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import TransactionItem from './TransactionItem';
import { Button } from '../ui';
import { ArrowRight, ArrowRightLeft } from 'lucide-react';

import { Link } from 'react-router';

const FILTER_BUTTONS = [
	{ key: 'all', label: 'Toutes' },
	{ key: 'income', label: 'Revenus' },
	{ key: 'expense', label: 'Dépenses' },
];

const TransactionList = ({ transactions = [], limit = null, onRequestDelete, onEdit }) => {
	const [filter, setFilter] = useState('all');

	const filtered = useMemo(() => {
		switch (filter) {
			case 'income':
				return transactions.filter(t => (t?.amount ?? 0) > 0);
			case 'expense':
				return transactions.filter(t => (t?.amount ?? 0) < 0);
			default:
				return transactions;
		}
	}, [filter, transactions]);

	const filteredTotal = useMemo(
		() => formatCurrency(filtered.reduce((sum, t) => sum + (t?.amount ?? 0), 0)),
		[filtered]
	);

	let lastTransactions = filtered.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	if (limit) {
		lastTransactions = lastTransactions.slice(0, limit);
	}

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
					<Link to="/transactions">
						<Button variant="ghost" size="sm" className="gap-1 -ml-2">
							<span className='hidden xs:block'>Voir tout</span>
							<ArrowRight size={16} />
						</Button>
					</Link>
				)}
			</div>

			{lastTransactions.length > 0 ? (
				<>
					<div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400 px-1">
						<p>{lastTransactions.length} transaction{lastTransactions.length > 1 ? 's' : ''}</p>
						<p className="font-medium">Total : {filteredTotal}</p>
					</div>

					<ul className="space-y-2">
						{lastTransactions.map((t, index) => (
							<TransactionItem
								key={t.id}
								{...t}
								onRequestDelete={onRequestDelete}
								onEdit={onEdit}
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
		</div>
	);
};

export default TransactionList;
