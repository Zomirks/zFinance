// React
import { useState, memo } from 'react';

// Components - UI
import { Badge, Button } from '../ui';

// Icons
import { Check, SquarePen, Trash2, MoreHorizontal } from 'lucide-react';

// Context
import { useCurrency } from '../../contexts/CurrencyContext';

// Utils - Formatters
import { formatDate } from '../../utils/formatters';

const TransactionItem = memo(function TransactionItem({ transaction, onEdit, onDelete, style }) {
	const { formatAmount } = useCurrency();
	const { amount, description, category, date, status } = transaction;
	const isPending = status === 'pending';
	const [showActions, setShowActions] = useState(false);

	const isIncome = amount >= 0;

	return (
		<li
			className="
				animate-fade-in
				bg-white/60 dark:bg-secondary-800/60
				backdrop-blur-sm
				border border-white/20 dark:border-secondary-700/30
				rounded-2xl
				overflow-hidden
				transition-all duration-200
				hover:shadow-md hover:shadow-secondary-900/5 dark:hover:shadow-black/20
			"
			style={style}
		>
			<div className="p-4 flex items-center gap-3 cursor-pointer"
				onClick={() => setShowActions(!showActions)}
			>
				<div
					className={`
						shrink-0 size-8 xs:size-12 rounded-xl
						flex items-center justify-center
						${isIncome
							? 'bg-primary-100/80 dark:bg-primary-900/30'
							: 'bg-danger-light/80 dark:bg-red-900/30'
						}
					`}
				>
					<span
						className={`
							text-sm xs:text-lg font-bold
							${isIncome
								? 'text-primary-600 dark:text-primary-400'
								: 'text-red-600 dark:text-red-400'
							}
						`}
					>
						{isIncome ? '+' : '-'}
					</span>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<p className="font-medium text-secondary-900 dark:text-secondary-100 truncate select-none">
							{description}
						</p>
						{isPending ? (
							<Badge label="En attente" variant="warning" size="sm" dot />
						) : (
							<Check
								size={14}
								strokeWidth={2.5}
								className="shrink-0 text-primary-500 dark:text-primary-400"
							/>
						)}
					</div>
					<div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
						<span className="select-none truncate">{category}</span>
						<span className="select-none text-secondary-300 dark:text-secondary-600">•</span>
						<span>
							{formatDate(date, '', {
								day: 'numeric',
								month: 'short',
							})}
						</span>
					</div>
				</div>

				<div className="shrink-0 text-right">
					<p
						className={`
							text-base font-semibold
							${isIncome
								? 'text-primary-600 dark:text-primary-400'
								: 'text-red-600 dark:text-red-400'
							}
						`}
					>
						{formatAmount(Math.abs(amount))}
					</p>
				</div>

				<button
					type="button"
					className="
						shrink-0 p-2 -mr-2 rounded-xl
						text-secondary-400 dark:text-secondary-500
						hover:text-secondary-600 dark:hover:text-secondary-300
						hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50
						transition-colors
						active:scale-95 cursor-pointer
						hidden xs:block
					"
					aria-label="Plus d'actions"
					aria-expanded={showActions}
				>
					<MoreHorizontal size={18} />
				</button>
			</div>

			{showActions && (
				<div className="px-4 pb-4 pt-0 flex gap-2 animate-fade-in">
					<Button
						variant="secondary"
						size="sm"
						className="flex-1"
						onClick={() => {
							onEdit?.(transaction);
							setShowActions(false);
						}}
						icon={<SquarePen size={16} />}
					>
						Modifier
					</Button>
					<Button
						variant="danger"
						size="sm"
						className="flex-1"
						onClick={() => onDelete?.(transaction)}
						icon={<Trash2 size={16} />}
					>
						Supprimer
					</Button>
				</div>
			)}
		</li>
	);
});

export default TransactionItem;
