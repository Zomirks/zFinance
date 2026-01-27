import Card from "./Card";
import { X } from 'lucide-react';

const Modal = ({ children, title, onClose }) => {
	return (
		<div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex justify-center items-center p-4">
			<Card className="w-full max-w-md relative" title={title}>
				<button
					type="button"
					className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
					aria-label="Fermer"
					onClick={onClose}
				>
					<X />
				</button>

				{children}
			</Card>
		</div>
	)
}
export default Modal