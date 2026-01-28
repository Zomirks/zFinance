import { Routes, Route } from 'react-router';

// Components - Layout
import Header from './components/layout/Header';

// Pages
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-900">
			<Header />

			<Routes>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/transactions" element={<TransactionsPage />} />
			</Routes>
		</div>
	);
}

export default App;
