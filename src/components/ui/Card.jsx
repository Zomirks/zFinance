const Card = ({
	title,
	children,
	rightElement = false,
	className = '',
}) => {
	return (
		<div
			className={`
				rounded-2xl
				bg-white/70 dark:bg-secondary-800/70
				backdrop-blur-xl
				border border-white/20 dark:border-secondary-700/30
				shadow-lg shadow-secondary-900/5 dark:shadow-black/20
				p-5 xs:p-6
				animate-fade-in
				${className}
			`}
		>
			{(title || rightElement) && (
				<div className="flex items-start justify-between mb-2">
					{title && (
						<h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-4">
							{title}
						</h3>
					)}
					{rightElement}
				</div>
			)}

			{children}
		</div>
	);
};

export default Card;
