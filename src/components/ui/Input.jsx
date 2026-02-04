import { forwardRef } from 'react';

const Input = forwardRef(({
	type = 'text',
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
		placeholder-secondary-400 dark:placeholder-secondary-500
		focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
		transition-all
	`;

	const errorStyles = error
		? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
		: '';

	return (
		<input
			ref={ref}
			type={type}
			className={`${baseStyles} ${errorStyles} ${className}`}
			{...props}
		/>
	);
});

Input.displayName = 'Input';

export default Input;
