import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Card } from '../components/ui';
import TransactionList from '../components/features/TransactionList';
import TransactionModal from '../components/features/TransactionModal';

function TransactionsPage() {
    const [transactions, setTransactions] = useLocalStorage('transactions', []);
    const [search, setSearch] = useState('');
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const handleAddTransaction = (newTransaction) => {
        setTransactions(prev => [...prev, newTransaction]);
        setShowTransactionModal(false);
    }

    const handleDeleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }

    const handleEditTransaction = (id) => {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            setEditingTransaction(transaction);
        }
    }

    const handleUpdateTransaction = (updatedTransaction) => {
        setTransactions(prev => prev.map(t =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        ));
        setEditingTransaction(null);
    }

    const filteredTransactions = transactions.filter(t =>
        t?.description?.toLowerCase().includes(search.toLowerCase()) ||
        t?.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            <Card title='Transactions'>
                <input
                    type="text"
                    placeholder="Rechercher une transaction..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                />
                <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            </Card>

            {showTransactionModal && (
                <TransactionModal onSubmit={handleAddTransaction} onClose={() => setShowTransactionModal(false)} />
            )}

            {editingTransaction && (
                <TransactionModal
                    transaction={editingTransaction}
                    onSubmit={handleUpdateTransaction}
                    onClose={() => setEditingTransaction(null)}
                />
            )}
        </main>
    )
}
export default TransactionsPage;