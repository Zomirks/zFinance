const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	disabled = false,
	onClick,
	type = 'button',
	className = '',
}) => {
	const baseStyles = 'font-medium rounded-lg ring-1 ring-inset transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
	
	const variants = {
		primary: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-emerald-600/20 dark:ring-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 focus:ring-emerald-500',
		secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 ring-slate-600/20 dark:ring-slate-500/30 hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-slate-500',
		danger: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-500/30 hover:bg-red-200 dark:hover:bg-red-900/70 focus:ring-red-500',
	};

	const sizes = {
		sm: 'px-2.5 py-1.5 text-xs',
		md: 'px-3 py-2 text-sm',
		lg: 'px-4 py-2.5 text-base',
	};

	const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
		>
			{children}
		</button>
	);
};

export default Button;