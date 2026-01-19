import { formatCurrency, formatDate } from './utils/formatters';
import Badge from './components/ui/Badge';
import Card from './components/ui/Card';

function App() {
	const transactions = [
		{ id: 1, amount: 2500, type: 'income', category: 'Salaire', date: '2024-01-01' },
		{ id: 2, amount: -800, type: 'expense', category: 'Loyer', date: '2024-01-02' },
		{ id: 3, amount: -150, type: 'expense', category: 'Courses', date: '2024-01-05' },
	];

	const balance = transactions.reduce((sum, t) => sum + t.amount, 0);

	return (
		<div className="min-h-screen bg-slate-50">
			<header className="bg-white border-b border-slate-200">
				<div className="max-w-4xl mx-auto px-6 py-4">
					<h1 className="text-xl font-bold text-emerald-600 tracking-tight">
						zFinance
					</h1>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
				<Card className="bg-linear-to-br from-emerald-600 to-emerald-700 border-0">
					<p className="text-emerald-100 text-sm font-medium uppercase tracking-wide mb-2">
						Solde actuel
					</p>
					<p className={`text-4xl font-bold text-white`}>
						{formatCurrency(balance)}
					</p>
					<div className="flex gap-2 mt-4">
						<Badge label="Complété" variant="success" />
						<Badge label="En attente" variant="warning" />
						<Badge label="Scam" variant="danger" />
						<Badge label="Info" />
					</div>
				</Card>

				<Card title="Transactions récentes">
					<ul className="divide-y divide-slate-100">
						{transactions.map((t) => (
							<li key={t.id} className="py-4 first:pt-0 last:pb-0">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-slate-900">{t.category}</p>
										<p className="text-sm text-slate-500">
											{formatDate(t.date, '', {
												weekday: 'long',
												day: 'numeric',
												month: 'long',
											})}
										</p>
									</div>
									<span
										className={`text-lg font-semibold ${
											t.amount >= 0 ? 'text-emerald-600' : 'text-slate-900'
										}`}
									>
										{t.amount >= 0 ? '+' : ''}
										{formatCurrency(t.amount)}
									</span>
								</div>
							</li>
						))}
					</ul>
				</Card>
			</main>
		</div>
	);
}

export default App;
