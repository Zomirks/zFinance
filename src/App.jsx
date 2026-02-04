import { Routes, Route } from 'react-router';

// Components - Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import NotFound from './pages/NotFound';

function App() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
			<Header />

			<div className="flex-1">
				<Routes>
					<Route path="/" element={<DashboardPage />} />
					<Route path="/transactions" element={<TransactionsPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>

			<Footer />
		</div>
	);
}

export default App;
