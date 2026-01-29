const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	disabled = false,
	onClick,
	type = 'button',
	className = '',
	icon = null,
}) => {
	const baseStyles = `
		inline-flex items-center justify-center gap-2
		font-medium rounded-xl
		backdrop-blur-sm
		transition-all duration-200 ease-out
		focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
		dark:focus-visible:ring-offset-secondary-900
		active:scale-[0.98]
		select-none
	`;

	const variants = {
		primary: `
			bg-primary-500/90 dark:bg-primary-600/90
			text-white
			shadow-lg shadow-primary-500/25 dark:shadow-primary-900/30
			hover:bg-primary-600 dark:hover:bg-primary-500
			hover:shadow-xl hover:shadow-primary-500/30
			focus-visible:ring-primary-500
		`,
		secondary: `
			bg-white/70 dark:bg-secondary-800/70
			text-secondary-700 dark:text-secondary-200
			border border-secondary-200/50 dark:border-secondary-700/50
			shadow-sm
			hover:bg-white dark:hover:bg-secondary-700/70
			hover:border-secondary-300 dark:hover:border-secondary-600
			focus-visible:ring-secondary-400
		`,
		danger: `
			bg-danger/90 dark:bg-danger/80
			text-white
			shadow-lg shadow-danger/25 dark:shadow-danger/20
			hover:bg-red-600 dark:hover:bg-red-500
			hover:shadow-xl hover:shadow-danger/30
			focus-visible:ring-danger
		`,
		ghost: `
			bg-transparent
			text-secondary-600 dark:text-secondary-300
			hover:bg-secondary-100/80 dark:hover:bg-secondary-800/50
			focus-visible:ring-secondary-400
		`,
	};

	const sizes = {
		sm: 'px-3 py-2 text-xs min-h-[36px]',
		md: 'px-4 py-2.5 text-sm min-h-[44px]',
		lg: 'px-6 py-3 text-base min-h-[52px]',
		icon: 'p-2.5 min-h-[44px] min-w-[44px]',
	};

	const disabledStyles = disabled
		? 'opacity-50 cursor-not-allowed pointer-events-none'
		: 'cursor-pointer';

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
		>
			{icon && <span className="shrink-0">{icon}</span>}
			{children}
		</button>
	);
};

export default Button;
