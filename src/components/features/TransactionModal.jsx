// React
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// Components - UI
import { Button, Input, Modal, Select } from '../ui';

// Icons
import { Calendar1, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

// Utils - formatters
import { useTransactions } from '../../contexts/TransactionsContext';

const CATEGORIES = {
	income: ['Salaire', 'Freelance', 'Investissements', 'Remboursements', 'Autres'],
	expense: ['Courses', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres'],
};

/**
 * Sanitize user input to prevent XSS attacks
 * Removes HTML tags, entities, and dangerous characters
 */
const sanitizeString = (str) => {
	return str
		.trim()
		.replace(/[<>]/g, '')                    // Remove HTML brackets
		.replace(/&[#\w]+;/gi, '')               // Remove HTML entities (&lt; &#60; etc.)
		.replace(/javascript:/gi, '')            // Remove javascript: protocol
		.replace(/on\w+\s*=/gi, '')              // Remove event handlers (onclick=, etc.)
		.slice(0, 200);
};

function TransactionModal() {
	const {
		isFormOpen,
		editingTransaction,
		closeForm,
		addTransaction,
		updateTransaction,
	} = useTransactions();
	const dateInputRef = useRef(null);

	const [formData, setFormData] = useState({
		type: 'expense',
		amount: '',
		description: '',
		category: '',
		date: new Date().toISOString().split('T')[0],
	});

	const categories = useMemo(() => CATEGORIES[formData.type], [formData.type]);

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (editingTransaction) {
			setFormData({
				type: editingTransaction.amount > 0 ? 'income' : 'expense',
				amount: Math.abs(editingTransaction.amount).toString(),
				description: editingTransaction.description,
				category: editingTransaction.category,
				date: editingTransaction.date,
			});
		} else {
			setFormData({
				type: 'expense',
				amount: '',
				description: '',
				category: '',
				date: new Date().toISOString().split('T')[0],
			});
		}
		setErrors({});
	}, [editingTransaction, isFormOpen]);

	const handleChange = useCallback((field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: null }));
	}, []);

	const validate = useCallback(() => {
		const newErrors = {};

		if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
			newErrors.amount = 'Montant invalide';
		}
		if (!formData.category) {
			newErrors.category = 'Veuillez sélectionner une catégorie';
		}
		if (!formData.description.trim()) {
			newErrors.description = 'La description est requise';
		}
		if (!formData.date) {
			newErrors.date = 'La date est requise';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSubmitting(true);

		const amount = formData.type === 'expense'
			? -Math.abs(Number(formData.amount))
			: Math.abs(Number(formData.amount));

		const transactionData = {
			amount,
			description: sanitizeString(formData.description),
			category: formData.category,
			date: formData.date,
		};

		try {
			if (editingTransaction) {
				await updateTransaction(editingTransaction.id, transactionData);
			} else {
				await addTransaction(transactionData);
			}
		} catch (error) {
			console.error('Erreur:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isFormOpen) return null;

	return (
		<Modal title={editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'} onClose={closeForm}>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-2 gap-2 p-1.5 bg-secondary-100/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl">
					<label
						className={`
							flex items-center justify-center gap-2
							py-3 px-4 rounded-lg
							text-sm font-medium
							transition-all cursor-pointer
							${formData.type === 'expense'
								? 'bg-white dark:bg-secondary-700 text-red-600 dark:text-red-400 shadow-sm'
								: 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200'
							}
						`}
					>
						<input
							type="radio"
							name="type"
							value="expense"
							className="sr-only"
							checked={formData.type === 'expense'}
							onChange={(e) => handleChange('type', e.target.value)}
						/>
						<ArrowDownLeft size={18} />
						Dépense
					</label>
					<label
						className={`
							flex items-center justify-center gap-2
							py-3 px-4 rounded-lg
							text-sm font-medium
							transition-all cursor-pointer
							${formData.type === 'income'
								? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm'
								: 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200'
							}
						`}
					>
						<input
							type="radio"
							name="type"
							value="income"
							className="sr-only"
							checked={formData.type === 'income'}
							onChange={(e) => handleChange('type', e.target.value)}
						/>
						<ArrowUpRight size={18} />
						Revenu
					</label>
				</div>

				<div className="space-y-2">
					<label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
						Description
					</label>
					<Input
						id="description"
						value={formData.description}
						onChange={(e) => handleChange('description', e.target.value)}
						placeholder="Ex: Course au supermarché"
						error={!!errors.description}
					/>
					{errors.description && (
						<p className="text-red-500 dark:text-red-400 text-sm">{errors.description}</p>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="amount" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
						Montant
					</label>
					<div className="relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-700 dark:text-secondary-500 font-medium z-1">
							€
						</span>
						<Input
							type="number"
							id="amount"
							value={formData.amount}
							onChange={(e) => handleChange('amount', e.target.value)}
							placeholder="0.00"
							min={0}
							step="0.01"
							inputMode="decimal"
							className="pl-9"
							error={!!errors.amount}
						/>
					</div>
					{errors.amount && (
						<p className="text-red-500 dark:text-red-400 text-sm">{errors.amount}</p>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="date" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
						Date
					</label>
					<div className="flex gap-2">
						<Input
							ref={dateInputRef}
							type="date"
							id="date"
							value={formData.date}
							onChange={(e) => handleChange('date', e.target.value)}
							className="flex-1"
							error={!!errors.date}
						/>
						<button
							type="button"
							onClick={() => dateInputRef.current?.showPicker()}
							className="
								px-4 py-3
								bg-white/50 dark:bg-secondary-800/50
								backdrop-blur-sm
								border border-secondary-200/50 dark:border-secondary-700/50
								rounded-xl
								text-secondary-400 dark:text-secondary-500
								hover:text-secondary-600 dark:hover:text-secondary-300
								hover:border-secondary-300 dark:hover:border-secondary-600
								focus:outline-none focus:ring-2 focus:ring-primary-500/50
								transition-all
							"
							aria-label="Ouvrir le calendrier"
						>
							<Calendar1 size={20} />
						</button>
					</div>
					{errors.date && (
						<p className="text-red-500 dark:text-red-400 text-sm">{errors.date}</p>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
						Catégorie
					</label>
					<Select
						name="category"
						id="category"
						value={formData.category}
						onChange={(e) => handleChange('category', e.target.value)}
						error={!!errors.category}
					>
						<option value="" disabled>Sélectionner une catégorie</option>
						{categories.map((label) => (
							<option key={label} value={label}>{label}</option>
						))}
					</Select>
					{errors.category && (
						<p className="text-red-500 dark:text-red-400 text-sm">{errors.category}</p>
					)}
				</div>

				<label
					htmlFor="status-toggle"
					className="
						flex items-center justify-between gap-3
						p-4
						bg-white/50 dark:bg-secondary-800/50
						backdrop-blur-sm
						border border-secondary-200/50 dark:border-secondary-700/50
						rounded-xl
						cursor-pointer
						transition-all
						hover:border-secondary-300 dark:hover:border-secondary-600
					"
				>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
							Transaction en attente
						</span>
						<span className="text-xs text-secondary-400 dark:text-secondary-500">
							{formData.status === 'pending' ? 'À valider ultérieurement' : 'Transaction validée'}
						</span>
					</div>
					<div className="relative">
						<input
							type="checkbox"
							id="status-toggle"
							checked={formData.status === 'pending'}
							onChange={(e) => handleChange('status', e.target.checked ? 'pending' : 'completed')}
							className="sr-only peer"
						/>
						<div className="
							w-11 h-6
							bg-secondary-200 dark:bg-secondary-700
							peer-checked:bg-amber-500 dark:peer-checked:bg-amber-500
							rounded-full
							transition-colors
							peer-focus:ring-2 peer-focus:ring-primary-500/50
						" />
						<div className="
							absolute top-0.5 left-0.5
							w-5 h-5
							bg-white
							rounded-full
							shadow-sm
							transition-transform
							peer-checked:translate-x-5
						" />
					</div>
				</label>

				<div className="pt-2">
					<Button
						type="submit"
						variant="primary"
						size="lg"
						className="w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Enregistrement...' : editingTransaction ? 'Modifier' : 'Ajouter une transaction'}
					</Button>
				</div>
			</form>
		</Modal>
	);
}

export default TransactionModal;
