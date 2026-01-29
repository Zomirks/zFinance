import { Plus } from 'lucide-react';
import { Button } from '../ui';

function AddTransactionButton({ onClick }) {
	return (
		<div className="fixed bottom-6 right-4 xs:right-6 z-30 safe-area-bottom">
			<Button
				variant="primary"
				size="lg"
				onClick={onClick}
				className="
					rounded-full shadow-2xl shadow-primary-500/30
					hover:shadow-primary-500/40 hover:scale-105
					active:scale-95
					w-14 h-14 xs:w-auto xs:h-auto xs:rounded-xl
					p-0! xs:px-6! xs:py-3!
				"
				aria-label="Ajouter une transaction"
			>
				<Plus size={24} className="xs:hidden" />
				<span className="hidden xs:flex items-center gap-2">
					<Plus size={20} />
					Ajouter
				</span>
			</Button>
		</div>
	);
}

export default AddTransactionButton;
