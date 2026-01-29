const Card = ({
	title,
	children,
	className = '',
	variant = 'default',
	padding = 'default',
	animate = true,
}) => {
	const variants = {
		default: `
			bg-white/70 dark:bg-secondary-800/70
			backdrop-blur-xl
			border border-white/20 dark:border-secondary-700/30
			shadow-lg shadow-secondary-900/5 dark:shadow-black/20
		`,
		solid: `
			bg-white dark:bg-secondary-800
			border border-secondary-200 dark:border-secondary-700
			shadow-sm
		`,
		elevated: `
			bg-white/80 dark:bg-secondary-800/80
			backdrop-blur-xl
			border border-white/30 dark:border-secondary-700/30
			shadow-xl shadow-secondary-900/10 dark:shadow-black/30
		`,
	};

	const paddings = {
		none: '',
		sm: 'p-4',
		default: 'p-5 xs:p-6',
		lg: 'p-6 xs:p-8',
	};

	return (
		<div
			className={`
				rounded-2xl
				${variants[variant]}
				${paddings[padding]}
				${animate ? 'animate-fade-in' : ''}
				${className}
			`}
		>
			{title && (
				<h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider text-center xs:text-start mb-4">
					{title}
				</h3>
			)}
			{children}
		</div>
	);
};

export default Card;
