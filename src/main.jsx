import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import './index.css'

import App from './App.jsx'

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { TransactionsProvider } from './contexts/TransactionsContext';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<TransactionsProvider>
					<App />
				</TransactionsProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
)
