import { Card } from '../ui';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SummaryCards = ({ transactions = [], previousMonthBalance = 0 }) => {
	const balance = transactions.reduce((sum, t) => sum + (t?.amount ?? 0), 0);
	const income = transactions
		.filter(t => (t?.amount ?? 0) > 0)
		.reduce((sum, t) => sum + (t?.amount ?? 0), 0);
	const expense = transactions
		.filter(t => (t?.amount ?? 0) < 0)
		.reduce((sum, t) => sum + (t?.amount ?? 0), 0);

	const evolution = previousMonthBalance !== 0
		? (balance * 100 / previousMonthBalance - 100)
		: 0;

	const isPositiveEvolution = evolution >= 0;

	return (
		<div className="space-y-4">
			<div
				className="
					relative overflow-hidden
					bg-linear-to-br from-primary-500 via-primary-600 to-primary-700
					dark:from-primary-600 dark:via-primary-700 dark:to-primary-800
					rounded-3xl p-6 xs:p-8
					shadow-xl shadow-primary-500/20 dark:shadow-primary-900/30
				"
			>
				<div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
				<div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-400/20 rounded-full blur-xl" />

				<div className="absolute bottom-4 right-4 xs:bottom-6 xs:right-6 flex flex-col items-center text-white/30 pointer-events-none">
					<span className="font-black text-5xl xs:text-8xl leading-none">
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
							Solde actuel
						</p>
					</div>

					<p className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white mb-3">
						{formatCurrency(balance)}
					</p>

					<div
						className={`
							inline-flex items-center gap-1.5 px-3 py-1.5
							rounded-full text-sm font-medium
							${isPositiveEvolution
								? 'bg-white/20 text-white'
								: 'bg-red-500/30 text-red-100'
							}
						`}
					>
						{isPositiveEvolution ? (
							<TrendingUp size={16} />
						) : (
							<TrendingDown size={16} />
						)}
						<span>{isPositiveEvolution ? '+' : ''}{evolution.toFixed(1)}%</span>
						<span className="text-white/60 text-xs">vs mois dernier</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 xs:gap-4">
				<Card className="p-4! xs:p-5!" animate={true}>
					<div className="flex items-start justify-between mb-2">
						<span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
							Revenus
						</span>
						<div className="p-1.5 rounded-lg bg-primary-100/80 dark:bg-primary-900/30">
							<ArrowUpRight size={14} className="text-primary-600 dark:text-primary-400" />
						</div>
					</div>
					<p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
						{formatCurrency(income)}
					</p>
				</Card>

				<Card className="p-4! xs:p-5!" animate={true}>
					<div className="flex items-start justify-between mb-2">
						<span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
							Dépenses
						</span>
						<div className="p-1.5 rounded-lg bg-danger-light/80 dark:bg-red-900/30">
							<ArrowDownRight size={14} className="text-red-600 dark:text-red-400" />
						</div>
					</div>
					<p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
						{formatCurrency(Math.abs(expense))}
					</p>
				</Card>
			</div>
		</div>
	);
};

export default SummaryCards;
