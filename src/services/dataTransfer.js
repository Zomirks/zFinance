const STORAGE_KEY = 'zfi_transactions';
const EXPORT_VERSION = 1;

const TRANSACTION_SCHEMA = {
    id: 'string',
    amount: 'number',
    description: 'string',
    category: 'string',
    date: 'string',
    status: 'string',
    type: 'string',
    createdAt: 'string',
    updatedAt: 'string',
};

const VALID_STATUSES = ['completed', 'pending', 'failed'];
const VALID_TYPES = ['income', 'expense'];
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB max

const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, MAX_DESCRIPTION_LENGTH);
};


const isValidDateFormat = (dateStr) => {
    if (typeof dateStr !== 'string') return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

const isValidISODate = (dateStr) => {
    if (typeof dateStr !== 'string') return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

const validateTransaction = (transaction, index) => {
    const errors = [];

    if (!transaction || typeof transaction !== 'object') {
        return { valid: false, errors: [`Transaction ${index}: format invalide`], sanitized: null };
    }

    for (const [field, type] of Object.entries(TRANSACTION_SCHEMA)) {
        if (!(field in transaction)) {
            errors.push(`Transaction ${index}: champ "${field}" manquant`);
        } else if (typeof transaction[field] !== type) {
            errors.push(`Transaction ${index}: "${field}" doit être de type ${type}`);
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors, sanitized: null };
    }

    if (!isValidDateFormat(transaction.date)) {
        errors.push(`Transaction ${index}: date invalide (format attendu: YYYY-MM-DD)`);
    }

    if (!isValidISODate(transaction.createdAt)) {
        errors.push(`Transaction ${index}: createdAt invalide`);
    }

    if (!isValidISODate(transaction.updatedAt)) {
        errors.push(`Transaction ${index}: updatedAt invalide`);
    }

    if (!VALID_STATUSES.includes(transaction.status)) {
        errors.push(`Transaction ${index}: status invalide`);
    }

    if (!VALID_TYPES.includes(transaction.type)) {
        errors.push(`Transaction ${index}: type invalide`);
    }

    if (isNaN(transaction.amount) || !isFinite(transaction.amount)) {
        errors.push(`Transaction ${index}: montant invalide`);
    }

    if (errors.length > 0) {
        return { valid: false, errors, sanitized: null };
    }

    const sanitized = {
        id: String(transaction.id).slice(0, 50),
        amount: Number(transaction.amount),
        description: sanitizeString(transaction.description),
        category: sanitizeString(transaction.category),
        date: transaction.date,
        status: transaction.status,
        type: transaction.type,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
    };

    return { valid: true, errors: [], sanitized };
};

export const exportTransactions = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const transactions = data ? JSON.parse(data) : [];

    const exportData = {
        version: EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        app: 'zFinance',
        count: transactions.length,
        transactions,
    };

    const jsonString = JSON.stringify(exportData);
    return new Blob([jsonString], { type: 'application/json' });
};

export const getExportFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    return `zfinance-export-${date}.json`;
};

export const validateImportData = (jsonString) => {
    const errors = [];

    if (jsonString.length > MAX_FILE_SIZE) {
        return { valid: false, errors: ['Fichier trop volumineux (max 10 MB)'], data: null };
    }

    let parsed;
    try {
        parsed = JSON.parse(jsonString);
    } catch {
        return { valid: false, errors: ['Format JSON invalide'], data: null };
    }

    if (!parsed || typeof parsed !== 'object') {
        return { valid: false, errors: ['Structure de données invalide'], data: null };
    }

    if (parsed.app !== 'zFinance') {
        errors.push('Ce fichier ne provient pas de zFinance');
    }

    if (!Array.isArray(parsed.transactions)) {
        return { valid: false, errors: ['Aucune transaction trouvée dans le fichier'], data: null };
    }

    const validatedTransactions = [];
    for (let i = 0; i < parsed.transactions.length; i++) {
        const result = validateTransaction(parsed.transactions[i], i + 1);
        if (!result.valid) {
            errors.push(...result.errors);
        } else {
            validatedTransactions.push(result.sanitized);
        }
    }

    const displayErrors = errors.slice(0, 10);
    if (errors.length > 10) {
        displayErrors.push(`... et ${errors.length - 10} autres erreurs`);
    }

    return {
        valid: errors.length === 0,
        errors: displayErrors,
        data: errors.length === 0 ? { ...parsed, transactions: validatedTransactions } : null,
        stats: {
            total: parsed.transactions.length,
            valid: validatedTransactions.length,
            invalid: parsed.transactions.length - validatedTransactions.length,
        },
    };
};

export const importTransactions = (transactions, mode) => {
    if (!Array.isArray(transactions)) {
        throw new Error('Données invalides');
    }

    let result = { success: true, imported: 0, skipped: 0 };

    if (mode === 'replace') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        result.imported = transactions.length;
    } else if (mode === 'merge') {
        const existingData = localStorage.getItem(STORAGE_KEY);
        const existing = existingData ? JSON.parse(existingData) : [];
        const existingIds = new Set(existing.map(t => t.id));

        const newTransactions = [];
        for (const t of transactions) {
            if (existingIds.has(t.id)) {
                result.skipped++;
            } else {
                newTransactions.push(t);
                result.imported++;
            }
        }

        const merged = [...existing, ...newTransactions];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } else {
        throw new Error('Mode d\'import invalide');
    }

    return result;
};

export const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
