const Badge = ({ label, variant = 'default', capitalize = false }) => {
	const styles = {
		success: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-emerald-600/20 dark:ring-emerald-500/30',
		danger: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-500/30',
		warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-500/30',
		default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ring-slate-600/20 dark:ring-slate-500/30',
	};

	return (
		<span
			className={`${styles[variant] || styles.default} inline-flex items-center shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${capitalize ? 'capitalize' : ''}`}
		>
			{label}
		</span>
	);
};

export default Badge;
