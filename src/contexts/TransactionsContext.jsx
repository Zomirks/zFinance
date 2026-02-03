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
			const { id, ...updates } = transactionData;
			const updatedTransaction = await transactionsApi.update(id, updates);
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

	const stats = useMemo(() => {
		const now = new Date();
		const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

		let balance = 0;
		let currentMonthBalance = 0;
		let expenseLastMonth = 0;
		let expenseCurrentMonth = 0;
		let expenseTotal = 0;
		let incomeLastMonth = 0;
		let incomeCurrentMonth = 0;
		let incomeTotal = 0;

		for (const t of transactions) {
			const amount = t?.amount ?? 0;
			const absAmount = Math.abs(amount);
			balance += amount;

			const transactionDate = new Date(t.date);
			const isLastMonth = transactionDate >= startOfLastMonth && transactionDate <= endOfLastMonth;
			const isCurrentMonth = transactionDate >= startOfCurrentMonth && transactionDate <= endOfCurrentMonth;

			if (t.type === 'expense') {
				expenseTotal += absAmount;
				if (isLastMonth) expenseLastMonth += absAmount;
				if (isCurrentMonth) expenseCurrentMonth += absAmount;
			} else if (t.type === 'income') {
				incomeTotal += absAmount;
				if (isLastMonth) incomeLastMonth += absAmount;
				if (isCurrentMonth) incomeCurrentMonth += absAmount;
			}
		}

		currentMonthBalance = incomeCurrentMonth - expenseCurrentMonth;

		return {
			balance,
			currentMonthBalance,
			count: transactions.length,
			expense: {
				lastMonth: expenseLastMonth,
				currentMonth: expenseCurrentMonth,
				total: expenseTotal
			},
			income: {
				lastMonth: incomeLastMonth,
				currentMonth: incomeCurrentMonth,
				total: incomeTotal
			}
		};
	}, [transactions]);

	useEffect(() => {
		loadTransactions();
	}, [loadTransactions]);

	const value = useMemo(() => ({
		transactions,
		loading,
		error,
		stats,
		addTransaction,
		updateTransaction,
		deleteTransaction,
		refresh: loadTransactions,
	}), [transactions, loading, error, stats, addTransaction, updateTransaction, deleteTransaction, loadTransactions]);

	return (
		<TransactionsContext.Provider value={value}>
			{children}
		</TransactionsContext.Provider>
	);
};