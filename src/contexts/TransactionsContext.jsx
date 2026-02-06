import { createContext, useContext } from "react";
import useTransactionsHook from '../hooks/useTransactions';

const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
	const transactionsData = useTransactionsHook();

	return (
		<TransactionsContext.Provider value={transactionsData}>
			{children}
		</TransactionsContext.Provider>
	);
};

export const useTransactions = () => {
	const context = useContext(TransactionsContext);

	if (!context) {
		throw new Error(
			'useTransactions doit être utilisé à l\'intérieur d\'un <TransactionsProvider>'
		);
	}

	return context;
};
