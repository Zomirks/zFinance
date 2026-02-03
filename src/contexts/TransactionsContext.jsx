import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { transactionsApi, migrateData } from '../services/fakeApi';

const initialState = {
	transactions:  [],
	loading: false,
	error: null,
	filters: {
		type: 'all',
		category: 'all',
		search: '',
		dateRange: {
			start: '',
			end: '',
		},
	},
	sort: {
		by: 'date',
		order: 'desc',
	},
	isFormOpen: false,
	editingTransaction: null,
	isDeleteConfirmOpen: false,
	transactionToDelete: null,
}

const ActionTypes = {
	FETCH_START: 'FETCH_START',
	FETCH_SUCCESS: 'FETCH_SUCCESS',
	FETCH_ERROR: 'FETCH_ERROR',
	ADD_TRANSACTION: 'ADD_TRANSACTION',
	UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
	DELETE_TRANSACTION: 'DELETE_TRANSACTION',
	SET_FILTER: 'SET_FILTER',
	SET_DATE_RANGE: 'SET_DATE_RANGE',
	RESET_FILTERS: 'RESET_FILTERS',
	SET_SORT: 'SET_SORT',
	OPEN_FORM: 'OPEN_FORM',
	CLOSE_FORM: 'CLOSE_FORM',
	SET_EDITING: 'SET_EDITING',
	CLEAR_ERROR: 'CLEAR_ERROR',
	OPEN_DELETE_CONFIRM: 'OPEN_DELETE_CONFIRM',
	CLOSE_DELETE_CONFIRM: 'CLOSE_DELETE_CONFIRM',
}

function transactionsReducer(state, action) {
	switch (action.type) {
		case ActionTypes.FETCH_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case ActionTypes.FETCH_SUCCESS:
			return {
				...state,
				loading: false,
				transactions: action.payload,
				error: null,
			};

		case ActionTypes.FETCH_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		case ActionTypes.ADD_TRANSACTION:
			return {
				...state,
				transactions: [action.payload, ...state.transactions],
				isFormOpen: false,
				editingTransaction: null,
			};

		case ActionTypes.UPDATE_TRANSACTION:
			return {
				...state,
				transactions: state.transactions.map(t =>
					t.id === action.payload.id ? action.payload : t
				),
				isFormOpen: false,
				editingTransaction: null,
			};

		case ActionTypes.DELETE_TRANSACTION:
			return {
				...state,
				transactions: state.transactions.filter(t => t.id !== action.payload),
			};

		case ActionTypes.SET_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					[action.payload.key]: action.payload.value,
				},
			};

		case ActionTypes.SET_DATE_RANGE:
			return {
				...state,
				filters: {
					...state.filters,
					dateRange: action.payload,
				},
			};

		case ActionTypes.RESET_FILTERS:
			return {
				...state,
				filters: initialState.filters,
			};

		case ActionTypes.SET_SORT:
			return {
				...state,
				sort: {
					by: action.payload.by,
					order: action.payload.order,
				},
			};

		case ActionTypes.OPEN_FORM:
			return {
				...state,
				isFormOpen: true,
				editingTransaction: action.payload || null,
			};

		case ActionTypes.CLOSE_FORM:
			return {
				...state,
				isFormOpen: false,
				editingTransaction: null,
			};

		case ActionTypes.SET_EDITING:
			return {
				...state,
				editingTransaction: action.payload,
				isFormOpen: true,
			};

		case ActionTypes.CLEAR_ERROR:
			return {
				...state,
				error: null,
			};

		case ActionTypes.OPEN_DELETE_CONFIRM:
			return {
				...state,
				isDeleteConfirmOpen: true,
				transactionToDelete: action.payload,
			};

		case ActionTypes.CLOSE_DELETE_CONFIRM:
			return {
				...state,
				isDeleteConfirmOpen: false,
				transactionToDelete: null,
			};

		default:
			console.warn(`[TransactionsReducer] Action non gérée: ${action.type}`);
			return state;
	}
}

const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(transactionsReducer, initialState);

	useEffect(() => {
		migrateData();

		loadTransactions();
	}, []);

	const loadTransactions = useCallback(async () => {
		dispatch({ type: ActionTypes.FETCH_START });

		try {
			const data = await transactionsApi.getAll();
			dispatch({
				type: ActionTypes.FETCH_SUCCESS,
				payload: data
			});
		} catch (error) {
			dispatch({
				type: ActionTypes.FETCH_ERROR,
				payload: error.message
			});
		}
	}, []);

	const addTransaction = useCallback(async (transactionData) => {
		try {
			const newTransaction = await transactionsApi.create(transactionData);
			dispatch({
				type: ActionTypes.ADD_TRANSACTION,
				payload: newTransaction
			});
			return { success: true, data: newTransaction };
		} catch (error) {
			dispatch({ type: ActionTypes.FETCH_ERROR, payload: error.message });
			return { success: false, error: error.message };
		}
	}, []);

	const updateTransaction = useCallback(async (id, updates) => {
		try {
			const updatedTransaction = await transactionsApi.update(id, updates);
			dispatch({
				type: ActionTypes.UPDATE_TRANSACTION,
				payload: updatedTransaction
			});
			return { success: true, data: updatedTransaction };
		} catch (error) {
			dispatch({
				type: ActionTypes.FETCH_ERROR,
				payload: error.message
			});
			return { success: false, error: error.message };
		}
	}, []);

	const deleteTransaction = useCallback(async (id) => {
		try {
			await transactionsApi.delete(id);
			dispatch({
				type: ActionTypes.DELETE_TRANSACTION,
				payload: id
			});
			return { success: true };
		} catch (error) {
			dispatch({
				type: ActionTypes.FETCH_ERROR,
				payload: error.message
			});
			return { success: false, error: error.message };
		}
	}, []);

	const actions = useMemo(() => ({
		setFilter: (key, value) => {
			dispatch({ type: ActionTypes.SET_FILTER, payload: { key, value } });
		},
		setDateRange: (start, end) => {
			dispatch({ type: ActionTypes.SET_DATE_RANGE, payload: { start, end } });
		},
		resetFilters: () => {
			dispatch({ type: ActionTypes.RESET_FILTERS });
		},
		setSort: (by, order) => {
			dispatch({ type: ActionTypes.SET_SORT, payload: { by, order } });
		},
		toggleSort: (by) => {
			const newOrder = state.sort.by === by && state.sort.order === 'desc' ? 'asc' : 'desc';
			dispatch({ type: ActionTypes.SET_SORT, payload: { by, order: newOrder } });
		},
		openForm: (transaction = null) => {
			dispatch({ type: ActionTypes.OPEN_FORM, payload: transaction });
		},
		closeForm: () => {
			dispatch({ type: ActionTypes.CLOSE_FORM });
		},
		clearError: () => {
			dispatch({ type: ActionTypes.CLEAR_ERROR });
		},
		openDeleteConfirm: (transaction) => {
			dispatch({ type: ActionTypes.OPEN_DELETE_CONFIRM, payload: transaction });
		},
		closeDeleteConfirm: () => {
			dispatch({ type: ActionTypes.CLOSE_DELETE_CONFIRM });
		},
	}), [state.sort.by, state.sort.order]);

	const derived = useMemo(() => {
		const { transactions, filters, sort } = state;

		let filtered = transactions.filter(t => {
			if (filters.type !== 'all') {
				const isIncome = t.amount > 0;
				if (filters.type === 'income' && !isIncome) return false;
				if (filters.type === 'expense' && isIncome) return false;
			}

			if (filters.category !== 'all' && t.category !== filters.category) {
				return false;
			}

			if (filters.search) {
				const query = filters.search.toLowerCase();
				const matchesDescription = t.description?.toLowerCase().includes(query);
				const matchesCategory = t.category?.toLowerCase().includes(query);
				if (!matchesDescription && !matchesCategory) return false;
			}

			if (filters.dateRange.start) {
				if (new Date(t.date) < new Date(filters.dateRange.start)) return false;
			}

			if (filters.dateRange.end) {
				if (new Date(t.date) > new Date(filters.dateRange.end)) return false;
			}

			return true;
		});

		filtered = [...filtered].sort((a, b) => {
			const multiplier = sort.order === 'asc' ? 1 : -1;

			switch (sort.by) {
				case 'date':
					return multiplier * (new Date(a.date) - new Date(b.date));
				case 'amount':
					return multiplier * (a.amount - b.amount);
				case 'category':
					return multiplier * (a.category || '').localeCompare(b.category || '');
				case 'description':
					return multiplier * (a.description || '').localeCompare(b.description || '');
				default:
					return 0;
			}
		});

		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const isCurrentMonth = (date) => {
			const d = new Date(date);
			return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
		};

		const isLastMonth = (date) => {
			const d = new Date(date);
			const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
			const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
			return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
		};

		const incomeTransactions = transactions.filter(t => t.amount > 0);
		const expenseTransactions = transactions.filter(t => t.amount < 0);

		const stats = {
			balance: transactions.reduce((sum, t) => sum + t.amount, 0),
			income: {
				total: incomeTransactions.reduce((sum, t) => sum + t.amount, 0),
				currentMonth: incomeTransactions
					.filter(t => isCurrentMonth(t.date))
					.reduce((sum, t) => sum + t.amount, 0),
				lastMonth: incomeTransactions
					.filter(t => isLastMonth(t.date))
					.reduce((sum, t) => sum + t.amount, 0),
			},
			expense: {
				total: expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
				currentMonth: expenseTransactions
					.filter(t => isCurrentMonth(t.date))
					.reduce((sum, t) => sum + Math.abs(t.amount), 0),
				lastMonth: expenseTransactions
					.filter(t => isLastMonth(t.date))
					.reduce((sum, t) => sum + Math.abs(t.amount), 0),
			},
			count: transactions.length,
			currentMonthBalance: 0,
		};

		stats.currentMonthBalance = stats.income.currentMonth - stats.expense.currentMonth;

		const filteredStats = {
			total: filtered.reduce((sum, t) => sum + t.amount, 0),
			income: filtered
				.filter(t => t.amount > 0)
				.reduce((sum, t) => sum + t.amount, 0),
			expenses: filtered
				.filter(t => t.amount < 0)
				.reduce((sum, t) => sum + Math.abs(t.amount), 0),
			count: filtered.length,
		};

		const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))].sort();

		return {
			filteredTransactions: filtered,
			stats,
			filteredStats,
			categories,
			hasActiveFilters:
				filters.type !== 'all' ||
				filters.category !== 'all' ||
				filters.search !== '' ||
				filters.dateRange.start !== '' ||
				filters.dateRange.end !== '',
		};
	}, [state.transactions, state.filters, state.sort]);

	const value = useMemo(() => ({
		transactions: state.transactions,
		loading: state.loading,
		error: state.error,
		filters: state.filters,
		sort: state.sort,
		isFormOpen: state.isFormOpen,
		editingTransaction: state.editingTransaction,
		isDeleteConfirmOpen: state.isDeleteConfirmOpen,
		transactionToDelete: state.transactionToDelete,
		...derived,
		loadTransactions,
		addTransaction,
		updateTransaction,
		deleteTransaction,
		...actions,
	}), [state, derived, loadTransactions, addTransaction, updateTransaction, deleteTransaction, actions]);

	return (
		<TransactionsContext.Provider value={value}>
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