import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const EvolutionBadge = ({ evoPourcent, evoAmount, isBetter }) => {
	const [showPourcentage, setShowPourcentage] = useState(true);

	if (evoPourcent === 0 && evoAmount === 0) {
		return null;
	}

	return (
		<div
			className={`
				inline-flex items-center gap-1.5 px-3 py-1.5
				rounded-full text-sm font-medium cursor-pointer select-none
				${isBetter
					? 'bg-primary-500/30 text-primary-500 dark:text-primary-100 hover:bg-primary-500/40'
					: 'bg-red-500/30 text-red-500 dark:text-red-100 hover:bg-red-500/40'
				}
			`}
			onClick={() => setShowPourcentage(!showPourcentage)}
		>
			{isBetter ? (
				<TrendingUp size={16} />
			) : (
				<TrendingDown size={16} />
			)}
			<span>
				{evoAmount >= 0 ? '+' : ''}
				{showPourcentage ? (
					`${evoPourcent.toFixed(1)}%`
				) : (
					formatCurrency(evoAmount)
				)}
			</span>
			<span className="text-slate-950/60 dark:text-white/60 text-xs">vs mois dernier</span>
		</div>
	);
};

export default EvolutionBadge;
