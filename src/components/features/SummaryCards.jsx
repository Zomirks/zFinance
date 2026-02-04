// Components - UI
import { Card, EvolutionBadge } from '../ui';

// Hooks
import { useTransactions } from '../../hooks/useTransactions';

// Icons
import { Wallet, BanknoteArrowDown, BanknoteArrowUpIcon } from 'lucide-react';

// Utils - Formatters
import { formatCurrency, formatDate } from '../../utils/formatters';

const SummaryCards = () => {
	const { stats } = useTransactions();
	const balance = stats.balance;
	const income = stats.income.currentMonth;
	const expense = stats.expense.currentMonth;

	const expenseEvoPourcent = stats.expense.lastMonth !== 0
		? (stats.expense.currentMonth * 100 / stats.expense.lastMonth - 100)
		: 0;

	const expenseEvoAmount = stats.expense.lastMonth !== 0
		? (stats.expense.currentMonth - stats.expense.lastMonth)
		: 0;

	const incomeEvoPourcent = stats.income.lastMonth !== 0
		? (stats.income.currentMonth * 100 / stats.income.lastMonth - 100)
		: 0;

	const incomeEvoAmount = stats.income.lastMonth !== 0
		? (stats.income.currentMonth - stats.income.lastMonth)
		: 0;

	const isBetterExpense = expenseEvoAmount <= 0;
	const isBetterIncome = incomeEvoAmount >= 0;

	const expenseIcon =
		<div className="p-1.5 rounded-lg bg-danger-light/80 dark:bg-red-900/30">
			<BanknoteArrowDown className="text-red-600 dark:text-red-400 size-6" />
		</div>

	const incomeIcon =
		<div className="p-1.5 rounded-lg bg-primary-100/80 dark:bg-primary-900/30">
			<BanknoteArrowUpIcon className="text-primary-600 dark:text-primary-400 size-6" />
		</div>

	return (
		<div className="space-y-6">
			<div
				className="
					relative overflow-hidden
					bg-linear-to-br from-primary-500 via-primary-600 to-primary-700
					dark:from-primary-600 dark:via-primary-700 dark:to-primary-800
					rounded-3xl p-8 xs:p-10
					shadow-xl shadow-primary-500/20 dark:shadow-primary-900/30
				"
			>
				<div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
				<div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-400/20 rounded-full blur-xl" />

				<div className="absolute top-1/2 -translate-y-1/2 right-4 xs:right-8 flex flex-col items-center text-white/30 pointer-events-none">
					<span className="font-black text-7xl xs:text-8xl leading-none">
						{formatDate(new Date(), '', { day: 'numeric' })}
					</span>
					<span className="font-bold text-lg xs:text-2xl tracking-widest uppercase">
						{formatDate(new Date(), '', { month: 'short' })}
					</span>
				</div>

				<div className="relative z-10 text-center xs:text-start">
					<div className="flex items-center justify-center xs:justify-start gap-2 mb-2">
						<Wallet size={18} className="text-primary-200" />
						<p className="text-primary-100 text-sm font-medium uppercase tracking-wide">
							Solde actuel total
						</p>
					</div>

					<p className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white">
						{formatCurrency(balance)}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 xs:gap-4">
				<Card title='Revenus du mois' className='col-span-2 xs:col-span-1' rightElement={incomeIcon}>
					<div className="flex items-center justify-between flex-wrap gap-2">
						<p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
							{formatCurrency(income)}
						</p>
						
						<EvolutionBadge
							evoPourcent={incomeEvoPourcent}
							evoAmount={incomeEvoAmount}
							isBetter={isBetterIncome}
							/>
					</div>
				</Card>

				<Card title='Dépenses du mois' className='col-span-2 xs:col-span-1' rightElement={expenseIcon}>
					<div className="flex items-center justify-between flex-wrap gap-2">
						<p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
							{formatCurrency(expense)}
						</p>

						<EvolutionBadge
							evoPourcent={expenseEvoPourcent}
							evoAmount={expenseEvoAmount}
							isBetter={isBetterExpense}
							/>
					</div>
				</Card>

				<Card title='Bilan mensuel'>
					<p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
						{formatCurrency(stats.currentMonthBalance)}
					</p>
				</Card>

				<Card title='Bilan mois précédent'>
					<p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
						{formatCurrency(stats.income.lastMonth - stats.expense.lastMonth)}
					</p>
				</Card>
			</div>
		</div>
	);
};

export default SummaryCards;
