import { AlertTriangle } from 'lucide-react';

import { useCurrency } from '../../contexts/CurrencyContext';
import { formatDate } from '../../utils/formatters';
import { Button, Modal } from '../ui';

const DeleteConfirmationModal = ({ transaction, onConfirm, onClose }) => {
	const { formatAmount } = useCurrency();
	if (!transaction) return null;

	const { id, amount, description, date } = transaction;
	const isIncome = amount >= 0;

	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col items-center text-center">
				<div className="w-14 h-14 rounded-2xl bg-danger-light dark:bg-red-900/30 flex items-center justify-center mb-4">
					<AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
				</div>

				<h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
					Supprimer cette transaction ?
				</h3>

				<p className="text-secondary-500 dark:text-secondary-400 mb-4">
					Cette action est irréversible.
				</p>

				<div className="w-full p-4 rounded-xl bg-secondary-100/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50">
					<p className="font-medium text-secondary-900 dark:text-white mb-1">
						{description}
					</p>
					<div className="flex items-center justify-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
						<span>{formatDate(date, '', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
						<span>•</span>
						<span className={isIncome ? 'text-primary-600 dark:text-primary-400' : 'text-red-600 dark:text-red-400'}>
							{isIncome ? '+' : ''}{formatAmount(amount)}
						</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 mt-6">
				<Button
					variant="secondary"
					onClick={onClose}
				>
					Annuler
				</Button>

				<Button
					variant="danger"
					onClick={() => {
						onConfirm(id);
						onClose();
					}}
				>
					Supprimer
				</Button>
			</div>
		</Modal>
	);
};

export default DeleteConfirmationModal;
