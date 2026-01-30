import { v7 as uuidv7 } from 'uuid';

const CONFIG = {
    DELAY_MIN: 300,
    DELAY_MAX: 800,
    STORAGE_KEY: 'zfi_transactions',
    SIMULATE_ERRORS: false,
    ERROR_RATE: 0.1,
};

const simulateNetworkDelay = () => {
    const delay = Math.random() * (CONFIG.DELAY_MAX - CONFIG.DELAY_MIN) + CONFIG.DELAY_MIN;
    return new Promise(resolve => setTimeout(resolve, delay));
};

const maybeThrowError = () => {
    if (CONFIG.SIMULATE_ERRORS && Math.random() < CONFIG.ERROR_RATE) {
        const errors = [
            'Erreur réseau : impossible de joindre le serveur',
            'Timeout : le serveur ne répond pas',
            'Erreur 500 : erreur interne du serveur',
            'Erreur 503 : service temporairement indisponible',
        ];
        throw new Error(errors[Math.floor(Math.random() * errors.length)]);
    }
};

const generateId = () => uuidv7();

const getFromStorage = () => {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erreur lecture localStorage:', error);
        return [];
    }
};

const saveToStorage = (transactions) => {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Erreur écriture localStorage:', error);
        throw new Error('Impossible de sauvegarder les données');
    }
};

export const transactionsApi = {
    async getAll(options = {}) {
        await simulateNetworkDelay();
        maybeThrowError();

        let transactions = getFromStorage();
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (options.type && options.type !== 'all') {
            transactions = transactions.filter(t => {
                if (options.type === 'income') return t.amount > 0;
                if (options.type === 'expense') return t.amount < 0;
                return true;
            });
        }

        if (options.category && options.category !== 'all') {
            transactions = transactions.filter(t => t.category === options.category);
        }

        if (options.startDate) {
            transactions = transactions.filter(t => new Date(t.date) >= new Date(options.startDate));
        }

        if (options.endDate) {
            transactions = transactions.filter(t => new Date(t.date) <= new Date(options.endDate));
        }

        if (options.limit) {
            const offset = options.offset || 0;
            transactions = transactions.slice(offset, offset + options.limit);
        }

        console.log(`[FakeAPI] GET /transactions - ${transactions.length} résultats`);
        return transactions;
    },

    async getById(id) {
        await simulateNetworkDelay();
        maybeThrowError();

        const transactions = getFromStorage();
        const transaction = transactions.find(t => t.id === id);

        if (!transaction) {
            throw new Error(`Transaction non trouvée: ${id}`);
        }

        console.log(`[FakeAPI] GET /transactions/${id}`);
        return transaction;
    },

    async create(data) {
        await simulateNetworkDelay();
        maybeThrowError();

        if (!data.amount || isNaN(data.amount)) {
            throw new Error('Montant invalide');
        }
        if (!data.description || data.description.trim() === '') {
            throw new Error('Description requise');
        }
        if (!data.category) {
            throw new Error('Catégorie requise');
        }

        const transactions = getFromStorage();

        const newTransaction = {
            id: generateId(),
            amount: Number(data.amount),
            description: data.description.trim(),
            category: data.category,
            date: data.date || new Date().toISOString().split('T')[0],
            status: data.status || 'completed',
            type: data.type || (Number(data.amount) >= 0 ? 'income' : 'expense'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        transactions.unshift(newTransaction);
        saveToStorage(transactions);

        console.log(`[FakeAPI] POST /transactions - Créé:`, newTransaction.id);
        return newTransaction;
    },

    async update(id, updates) {
        await simulateNetworkDelay();
        maybeThrowError();

        const transactions = getFromStorage();
        const index = transactions.findIndex(t => t.id === id);

        if (index === -1) {
            throw new Error(`Transaction non trouvée: ${id}`);
        }

        const amount = updates.amount ?? transactions[index].amount;
        const updatedTransaction = {
            ...transactions[index],
            ...updates,
            type: updates.type || transactions[index].type || (Number(amount) >= 0 ? 'income' : 'expense'),
            id: transactions[index].id,
            createdAt: transactions[index].createdAt,
            updatedAt: new Date().toISOString(),
        };

        transactions[index] = updatedTransaction;
        saveToStorage(transactions);

        console.log(`[FakeAPI] PUT /transactions/${id} - Mis à jour`);
        return updatedTransaction;
    },

    async delete(id) {
        await simulateNetworkDelay();
        maybeThrowError();

        const transactions = getFromStorage();
        const index = transactions.findIndex(t => t.id === id);

        if (index === -1) {
            throw new Error(`Transaction non trouvée: ${id}`);
        }

        transactions.splice(index, 1);
        saveToStorage(transactions);

        console.log(`[FakeAPI] DELETE /transactions/${id} - Supprimé`);
        return { success: true, id };
    },
};

export const migrateData = () => {
    const OLD_STORAGE_KEY = 'transactions';
    let needsMigration = false;

    // Migration depuis l'ancienne clé localStorage
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldData) {
        try {
            const oldTransactions = JSON.parse(oldData);
            const currentTransactions = getFromStorage();

            // Fusionner en évitant les doublons (par ID)
            const existingIds = new Set(currentTransactions.map(t => t.id));
            const newTransactions = oldTransactions.filter(t => !existingIds.has(t.id));

            if (newTransactions.length > 0) {
                const merged = [...currentTransactions, ...newTransactions];
                saveToStorage(merged);
                console.log(`[FakeAPI] Migration: ${newTransactions.length} transactions importées depuis '${OLD_STORAGE_KEY}'`);
            }

            // Supprimer l'ancienne clé
            localStorage.removeItem(OLD_STORAGE_KEY);
            console.log(`[FakeAPI] Ancienne clé '${OLD_STORAGE_KEY}' supprimée`);
            needsMigration = true;
        } catch (error) {
            console.error('Erreur migration ancienne clé:', error);
        }
    }

    const transactions = getFromStorage();

    const migrated = transactions.map(t => {
        if (!t.id) {
            needsMigration = true;
            t.id = generateId();
        }
        if (!t.createdAt) {
            needsMigration = true;
            t.createdAt = t.date ? new Date(t.date).toISOString() : new Date().toISOString();
        }
        if (!t.updatedAt) {
            needsMigration = true;
            t.updatedAt = t.createdAt;
        }
        if (!t.status) {
            needsMigration = true;
            t.status = 'completed';
        }
        return t;
    });

    if (needsMigration) {
        saveToStorage(migrated);
        console.log('[FakeAPI] Migration effectuée');
    }

    return migrated;
};

export { CONFIG as apiConfig };