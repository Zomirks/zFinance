import { useState, useRef } from 'react';
import { v7 as uuidv7 } from 'uuid';
import { Calendar1, ArrowDownLeft, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Button, Modal } from '../ui';

const CATEGORIES = {
	income: ['Salaire', 'Freelance', 'Investissements', 'Autres'],
	expense: ['Courses', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres'],
};

function TransactionModal({ onSubmit, onClose, transaction = null }) {
	const dateInputRef = useRef(null);
	const isEditMode = !!transaction;

	const [formData, setFormData] = useState(() => {
		if (transaction) {
			return {
				amount: Math.abs(transaction.amount).toString(),
				type: transaction.amount >= 0 ? 'income' : 'expense',
				category: transaction.category || '',
				description: transaction.description || '',
				date: transaction.date || new Date().toISOString().split('T')[0],
			};
		}
		return {
			amount: '',
			type: 'expense',
			category: '',
			description: '',
			date: new Date().toISOString().split('T')[0],
		};
	});

	const [errors, setErrors] = useState({});

	const updateField = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: null }));
		}
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			newErrors.amount = 'Le montant doit être supérieur à 0';
		}
		if (!formData.category) {
			newErrors.category = 'Veuillez sélectionner une catégorie';
		}
		if (!formData.description.trim()) {
			newErrors.description = 'La description est requise';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const sanitizeString = (str) => {
		return str.trim().replace(/[<>]/g, '').slice(0, 200);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) return;

		const newTransaction = {
			...formData,
			id: transaction?.id || uuidv7(),
			description: sanitizeString(formData.description),
			amount: formData.type === 'expense'
				? -Math.abs(parseFloat(formData.amount))
				: Math.abs(parseFloat(formData.amount)),
			status: transaction?.status || 'completed',
		};

		onSubmit?.(newTransaction);

		if (!isEditMode) {
			setFormData({
				amount: '',
				type: 'expense',
				category: '',
				description: '',
				date: new Date().toISOString().split('T')[0],
			});
		}
	};

	const categories = CATEGORIES[formData.type];
	const isValid = formData.amount && formData.category && formData.description.trim();

	const inputStyles = `
		w-full px-4 py-3
		bg-white/50 dark:bg-secondary-800/50
		backdrop-blur-sm
		border border-secondary-200/50 dark:border-secondary-700/50
		rounded-xl
		text-secondary-900 dark:text-secondary-100
		placeholder-secondary-400 dark:placeholder-secondary-500
		focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
		transition-all
	`;

	return (
		<Modal title={isEditMode ? 'Modifier la transaction' : 'Nouvelle transaction'} onClose={onClose}>
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
							onChange={(e) => {
								updateField('type', e.target.value);
								updateField('category', '');
							}}
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
							onChange={(e) => {
								updateField('type', e.target.value);
								updateField('category', '');
							}}
						/>
						<ArrowUpRight size={18} />
						Revenu
					</label>
				</div>

				<div className="space-y-2">
					<label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
						Description
					</label>
					<input
						type="text"
						id="description"
						value={formData.description}
						onChange={(e) => updateField('description', e.target.value)}
						placeholder="Ex: Course au supermarché"
						className={inputStyles}
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
						<input
							type="number"
							id="amount"
							value={formData.amount}
							onChange={(e) => updateField('amount', e.target.value)}
							placeholder="0.00"
							min={0}
							step="0.01"
							inputMode="decimal"
							className={`${inputStyles} pl-9`}
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
						<input
							ref={dateInputRef}
							type="date"
							id="date"
							value={formData.date}
							onChange={(e) => updateField('date', e.target.value)}
							className={`flex-1 ${inputStyles}`}
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
				</div>

				<div className="space-y-2">
					<label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
						Catégorie
					</label>
					<div className="relative">
						<select
							name="category"
							id="category"
							value={formData.category}
							onChange={(e) => updateField('category', e.target.value)}
							className={`${inputStyles} cursor-pointer appearance-none pr-10`}
						>
							<option value="" disabled>Sélectionner une catégorie</option>
							{categories.map((label) => (
								<option key={label} value={label}>{label}</option>
							))}
						</select>
						<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
					</div>
					{errors.category && (
						<p className="text-red-500 dark:text-red-400 text-sm">{errors.category}</p>
					)}
				</div>

				<div className="pt-2">
					<Button
						type="submit"
						variant="primary"
						size="lg"
						className="w-full"
						disabled={!isValid}
					>
						{isEditMode ? 'Modifier' : 'Ajouter la transaction'}
					</Button>
				</div>
			</form>
		</Modal>
	);
}

export default TransactionModal;
