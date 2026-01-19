const Badge = ({ label, variant = 'default' }) => {
	const styles = {
		success: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
		danger: 'bg-red-100 text-red-700 ring-red-600/20',
		warning: 'bg-amber-100 text-amber-700 ring-amber-600/20',
		default: 'bg-slate-100 text-slate-700 ring-slate-600/20',
	};

	return (
		<span
			className={`${styles[variant] || styles.default} inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset`}
		>
			{label}
		</span>
	);
};

export default Badge;
