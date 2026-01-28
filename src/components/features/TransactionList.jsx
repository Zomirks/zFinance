import { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import TransactionItem from './TransactionItem';
import { Button } from '../ui';

import { ArrowRightLeft } from 'lucide-react';

const FILTER_BUTTONS = [
	{ key: 'all', label: 'Toutes' },
	{ key: 'income', label: 'Revenus' },
	{ key: 'expense', label: 'Dépenses' },
];

const TransactionList = ({ transactions = [], limit = null, onDelete, onEdit }) => {
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

	let lastTransactions = filtered
		.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});
	

	if (limit) {
		lastTransactions = lastTransactions.slice(0, limit);
	}

	return (
		<>
			<div className="flex justify-center gap-x-2 mb-4">
				{FILTER_BUTTONS.map(({ key, label }) => (
					<Button
						key={key}
						variant={filter === key ? 'primary' : 'secondary'}
						onClick={() => setFilter(key)}
					>
						{label}
					</Button>
				))}
			</div>

			{lastTransactions.length > 0 ? (
				<>
					<div className='text-slate-600 dark:text-slate-300 text-sm pb-3 flex justify-between'>
						<p className=''>{lastTransactions.length} transaction(s)</p>
						<p>Total : {filteredTotal}</p>
					</div>
					<ul className="divide-y divide-slate-100 dark:divide-slate-700">
						{lastTransactions.map((t) => (
							<TransactionItem key={t.id} {...t} onDelete={onDelete} onEdit={onEdit} />
						))}
					</ul>
				</>
			) : (
				<>
					<div className='text-center py-8'>
						<ArrowRightLeft size={96} strokeWidth={1} className='dark:text-white mx-auto mb-6'/>
						<p className='dark:text-white'>Aucune transaction à afficher</p>
						<p className='text-sm text-slate-400 mt-2'>Vos transactions apparaîtront ici</p>
					</div>
				</>
			)}
		</>
	)
}
export default TransactionList