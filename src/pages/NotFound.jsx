import { Link } from 'react-router';
import { WalletCards } from 'lucide-react';
import { Button } from '../components/ui';

const NotFound = () => {
	return (
		<main className="max-w-4xl mx-auto px-4 xs:px-6 py-12 xs:py-16 flex flex-col items-center justify-center min-h-[70vh]">
			<div className="text-center animate-fade-in">
				<div className="relative inline-block mb-8">
					<div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-secondary-100 dark:bg-secondary-800">
						<WalletCards className="w-12 h-12 text-secondary-400 dark:text-secondary-500" />
					</div>

					<div className="absolute -top-2 -right-2 bg-danger text-white text-sm font-bold px-2 py-1 rounded-full shadow-lg">
						404
					</div>
				</div>

				<h1 className="text-2xl xs:text-3xl font-bold text-secondary-800 dark:text-secondary-100 mb-3">
					Budget insuffisant !
				</h1>

				<p className="text-secondary-500 dark:text-secondary-400 text-base xs:text-lg mb-2 max-w-md mx-auto">
					La page que vous recherchez n'existe pas.
				</p>
				<p className="text-secondary-400 dark:text-secondary-500 text-sm mb-8 max-w-sm mx-auto">
					Pas de panique, vos vraies finances sont en sécurité !
				</p>

				<Link to="/">
					<Button variant="primary" size="md">
						Retour au tableau de bord
					</Button>
				</Link>
			</div>
		</main>
	);
};

export default NotFound;
