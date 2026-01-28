import { useState } from 'react';
import { Link } from 'react-router';

// Components - Features
import TransactionList from '../components/features/TransactionList';
import SummaryCards from '../components/features/SummaryCards';
import TransactionModal from '../components/features/TransactionModal';

// Components - UI
import { Button, Card } from '../components/ui';

// Hooks
import useLocalStorage from '../hooks/useLocalStorage';

// Variables
const RECENT_TRANSACTIONS_LIMIT = 5;
const PREVIOUS_MONTH_BALANCE = 2600;

function DashboardPage() {
    const [transactions, setTransactions] = useLocalStorage('transactions', []);
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

    return (
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            <SummaryCards transactions={transactions} previousMonthBalance={PREVIOUS_MONTH_BALANCE} />

            <Card title='Dernières Transactions'>
                <Link to="/transactions" className='dark:text-white'>Voir les transactions</Link>
                <TransactionList transactions={transactions} limit={RECENT_TRANSACTIONS_LIMIT} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            </Card>

            <div className="flex justify-center">
                <Button variant="primary" size="lg" onClick={() => setShowTransactionModal(true)}>
                    Ajouter
                </Button>
            </div>

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
    );
}

export default DashboardPage;
