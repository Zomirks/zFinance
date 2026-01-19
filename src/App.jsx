import { useState } from 'react';
import { formatCurrency, formatDate } from './utils/formatters';
import './App.css'

function App() {
	const transactions = [
		{ id: 1, amount: 2500, type: 'income', category: 'Salaire', date: '2024-01-01' },
		{ id: 2, amount: -800, type: 'expense', category: 'Loyer', date: '2024-01-02' },
		{ id: 3, amount: -150, type: 'expense', category: 'Courses', date: '2024-01-05' },
	];

	return (
		<>
			<h1 className="font-bold text-2xl mb-3">zFinance</h1>

			<h3 className="font-semibold">Transactions</h3>
			{transactions.map((t) => (
				<li key={t.id}>
					<strong>{t.category}</strong> : {formatCurrency(t.amount)} ({t.type}) - {formatDate(t.date, '', {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</li>
			))}
		</>
	)
}

export default App
