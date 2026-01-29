const Badge = ({ label, variant = 'default', capitalize = false, size = 'md', dot = false }) => {
	const variants = {
		success: `
			bg-success-light/80 dark:bg-primary-900/50
			text-primary-700 dark:text-primary-300
			border-primary-200 dark:border-primary-700/50
		`,
		danger: `
			bg-danger-light/80 dark:bg-red-900/50
			text-red-700 dark:text-red-300
			border-red-200 dark:border-red-700/50
		`,
		warning: `
			bg-warning-light/80 dark:bg-amber-900/50
			text-amber-700 dark:text-amber-300
			border-amber-200 dark:border-amber-700/50
		`,
		info: `
			bg-info-light/80 dark:bg-sky-900/50
			text-sky-700 dark:text-sky-300
			border-sky-200 dark:border-sky-700/50
		`,
		default: `
			bg-secondary-100/80 dark:bg-secondary-700/50
			text-secondary-600 dark:text-secondary-300
			border-secondary-200 dark:border-secondary-600/50
		`,
	};

	const sizes = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2.5 py-1 text-xs',
		lg: 'px-3 py-1.5 text-sm',
	};

	const dotColors = {
		success: 'bg-primary-500',
		danger: 'bg-red-500',
		warning: 'bg-amber-500',
		info: 'bg-sky-500',
		default: 'bg-secondary-400',
	};

	return (
		<span
			className={`
				${variants[variant] || variants.default}
				${sizes[size]}
				inline-flex items-center gap-1.5 shrink-0
				font-medium rounded-full
				border backdrop-blur-sm
				${capitalize ? 'capitalize' : ''}
			`}
		>
			{dot && (
				<span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
			)}
			{label}
		</span>
	);
};

export default Badge;
