const Card = ({ title, children, className = '' }) => {
	return (
		<div
			className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm ${className}`}
		>
			{title && (
				<h3 className="text-md font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center xs:text-start mb-4">
					{title}
				</h3>
			)}
			{children}
		</div>
	);
};

export default Card;
