import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import './index.css'

import App from './App.jsx'

// Contexts
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TransactionsProvider } from './contexts/TransactionsContext';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<CurrencyProvider>
					<TransactionsProvider>
						<App />
					</TransactionsProvider>
				</CurrencyProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
)
