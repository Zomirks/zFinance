import { useState, useRef } from 'react';
import { Calendar1 } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

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
			id: transaction?.id || crypto.randomUUID(),
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

	return (
		<Modal title={isEditMode ? 'Modifier la Transaction' : 'Nouvelle Transaction'} onClose={onClose}>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
					<label
						className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all text-center cursor-pointer ${formData.type === 'expense'
							? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 shadow-sm ring-1 ring-inset ring-red-600/20 dark:ring-red-500/30'
							: 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
							}`}
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
						Dépense
					</label>
					<label
						className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all text-center cursor-pointer ${formData.type === 'income'
							? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/30'
							: 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
							}`}
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
						Revenu
					</label>
				</div>

				<div className="space-y-1.5">
					<label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
						Description
					</label>
					<input
						type="text"
						id="description"
						value={formData.description}
						onChange={(e) => updateField('description', e.target.value)}
						placeholder="Ex: Course au supermarché"
						className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
					/>
					{errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
				</div>

				<div className="space-y-1.5">
					<label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
						Montant
					</label>
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium">€</span>
						<input
							type="number"
							id="amount"
							value={formData.amount}
							onChange={(e) => updateField('amount', e.target.value)}
							placeholder="0.00"
							min={0}
							step="0.01"
							className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
						/>
						{errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
					</div>
				</div>

				<div className="space-y-1.5">
					<label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
						Date
					</label>
					<div className="flex gap-2">
						<input
							ref={dateInputRef}
							type="date"
							id="date"
							value={formData.date}
							onChange={(e) => updateField('date', e.target.value)}
							className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow [&::-webkit-calendar-picker-indicator]:hidden"
						/>
						<button
							type="button"
							onClick={() => dateInputRef.current?.showPicker()}
							className="px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
							aria-label="Ouvrir le calendrier"
						>
							<Calendar1 className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="space-y-1.5">
					<label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
						Catégorie
					</label>
					<select
						name="category"
						id="category"
						value={formData.category}
						onChange={(e) => updateField('category', e.target.value)}
						className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow appearance-none cursor-pointer"
					>
						<option value="" disabled>Sélectionner une catégorie</option>
						{categories.map((label) => (
							<option key={label} value={label}>{label}</option>
						))}
					</select>
					{errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
				</div>

				<div className="flex flex-col pt-2 text-center">
					<Button
						type="submit"
						variant="primary"
						size="lg"
						className="flex-1"
						disabled={!isValid}
					>
						{isEditMode ? 'Modifier' : 'Ajouter'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}
export default TransactionModal