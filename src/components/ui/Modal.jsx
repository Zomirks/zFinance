import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const Modal = ({ children, title, onClose }) => {
	const [isClosing, setIsClosing] = useState(false);

	const handleClose = useCallback(() => {
		setIsClosing(true);
		setTimeout(() => {
			onClose?.();
		}, 200);
	}, [onClose]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') handleClose();
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [handleClose]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-end xs:items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			<div
				className={`absolute inset-0 bg-secondary-950/60 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : ''}`}
				onClick={handleClose}
				aria-hidden="true"
			/>

			<div
				className={`
					relative w-full xs:max-w-md
					max-h-[90dvh] overflow-y-auto
					bg-white/80 dark:bg-secondary-800/80
					backdrop-blur-xl
					border border-white/20 dark:border-secondary-700/30
					shadow-2xl shadow-secondary-900/20 dark:shadow-black/40
					rounded-t-3xl xs:rounded-2xl
					safe-area-bottom
					${isClosing ? 'animate-slide-down xs:animate-scale-out' : 'animate-slide-up xs:animate-scale-in'}
				`}
			>
				<div className="sticky top-0 z-10 flex items-center justify-between p-5 pb-0 bg-transparent">
					<div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-secondary-300 dark:bg-secondary-600 xs:hidden" />

					{title && (
						<h2
							id="modal-title"
							className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 pt-2 xs:pt-0"
						>
							{title}
						</h2>
					)}

					<button
						type="button"
						className="
							ml-auto p-2 -mr-2
							rounded-xl
							text-secondary-400 dark:text-secondary-500
							hover:text-secondary-600 dark:hover:text-secondary-300
							hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50
							transition-colors
							focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
						"
						aria-label="Fermer"
						onClick={handleClose}
					>
						<X size={20} />
					</button>
				</div>

				<div className="p-5 pt-4">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
