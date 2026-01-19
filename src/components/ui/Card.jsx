const Card = ({ title, children, className = '' }) => {
	return (
		<div
			className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm ${className}`}
		>
			{title && (
				<h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
					{title}
				</h3>
			)}
			{children}
		</div>
	);
};

export default Card;
