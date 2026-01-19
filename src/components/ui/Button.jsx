const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	disabled = false,
	onClick,
	type = 'button',
	className = '',
}) => {
	const baseStyles = 'font-medium rounded-lg ring-1 ring-inset  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
	
	const variants = {
		primary: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20 hover:bg-emerald-200 focus:ring-emerald-500',
		secondary: 'bg-slate-100 text-slate-700 ring-slate-600/20 hover:bg-slate-200 focus:ring-slate-500',
		danger: 'bg-red-100 text-red-700 ring-red-600/20 hover:bg-red-200 focus:ring-red-500',
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