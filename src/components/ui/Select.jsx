import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
	children,
	className = '',
	error = false,
	...props
}, ref) => {
	const baseStyles = `
		w-full px-4 py-3
		bg-white/50 dark:bg-secondary-800/50
		backdrop-blur-sm
		border border-secondary-200/50 dark:border-secondary-700/50
		rounded-xl
		text-secondary-900 dark:text-secondary-100
		focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
		transition-all
		cursor-pointer appearance-none pr-10
	`;

	const errorStyles = error
		? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
		: '';

	return (
		<div className="relative">
			<select
				ref={ref}
				className={`${baseStyles} ${errorStyles} ${className}`}
				{...props}
			>
				{children}
			</select>
			<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
		</div>
	);
});

Select.displayName = 'Select';

export default Select;
