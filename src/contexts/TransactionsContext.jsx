import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { transactionsApi } from '../services/fakeApi';

const TransactionsContext = createContext(null);

export const useTransactions = () => {
	const context = useContext(TransactionsContext);

	if (context === null) {
		throw new Error(
			"useTransactions must be used within TransactionsProvider"
		);
	}

	return context;
};

export const TransactionsProvider = ({ children }) => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadTransactions = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await transactionsApi.getAll();
			setTransactions(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const addTransaction = useCallback(async (transactionData) => {
		try {
			setError(null);
			const newTransaction = await transactionsApi.create(transactionData);
			setTransactions(prev => [newTransaction, ...prev]);
			return newTransaction;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}, []);

	const updateTransaction = useCallback(async (transactionData) => {
		try {
			setError(null);
			const updatedTransaction = await transactionsApi.update(transactionData.id, transactionData);
			setTransactions(prev => prev.map(t =>
				t.id === updatedTransaction.id ? updatedTransaction : t
			));
			return updatedTransaction;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}, []);

	const deleteTransaction = useCallback(async (id) => {
		try {
			setError(null);
			const deletedTransaction = await transactionsApi.delete(id);
			setTransactions(prev => prev.filter(t => t.id !== id));
			return deletedTransaction.id;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}, []);

	useEffect(() => {
		loadTransactions();
	}, [loadTransactions]);

	const value = useMemo(() => ({
		transactions,
		loading,
		error,
		addTransaction,
		updateTransaction,
		deleteTransaction,
		refresh: loadTransactions,
	}), [transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, loadTransactions]);

	return (
		<TransactionsContext.Provider value={value}>
			{children}
		</TransactionsContext.Provider>
	);
};