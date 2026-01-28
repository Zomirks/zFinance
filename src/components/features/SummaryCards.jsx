import {Card} from '../ui';
import { formatCurrency, formatDate } from '../../utils/formatters';

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

	return (
		<>
			<Card className="bg-linear-to-br from-emerald-600 to-emerald-700 border-0 relative overflow-hidden p-8">
				<div className="absolute bottom-0 right-4 flex items-end opacity-25 pointer-events-none">
					<div className="flex flex-col items-center text-white leading-none">
						<span className="font-black text-8xl">{formatDate(new Date(), '', {day: 'numeric'})}</span>
						<span className="font-bold text-3xl tracking-widest">
							{formatDate(new Date(),'', { month: 'short' }).toUpperCase()}
						</span>
					</div>
				</div>

				<div className='text-center xs:text-start'>
					<p className="text-emerald-100 text-sm font-medium uppercase tracking-wide mb-2">
						Solde actuel{" "}
						<span className={evolution > 0 ? "text-green-500" : "text-red-500"}>{Number(evolution.toFixed(2))} %</span>
					</p>
					<p className={`text-3xl xs:text-5xl font-bold text-white`}>
						{formatCurrency(balance)}
					</p>
				</div>
			</Card>

			<div className='grid grid-cols-2 gap-4'>
				<Card title='Revenus' className='text-right'>
					<span className='text-2xl sm:text-4xl font-semibold text-slate-800 dark:text-slate-200'>{formatCurrency(income)}</span>
				</Card>

				<Card title='Dépenses' className='text-right'>
					<span className='text-2xl sm:text-4xl font-semibold text-slate-800 dark:text-slate-200'>{formatCurrency(expense)}</span>
				</Card>
			</div>
		</>
	)
}
export default SummaryCards