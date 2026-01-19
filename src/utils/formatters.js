/**
 * Formats an amount in a specific currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (EUR, USD, etc.)
 * @param {string} locale - The locale (fr-FR, en-US...) or undefined to use the env variable
 * @returns {string} The formatted amount with the correct convention and currency
 */
export const formatCurrency = (amount, currency = 'EUR', locale) => {
    const resolvedLocale = locale || import.meta.env.VITE_DEFAULT_LOCALE;

    if (!resolvedLocale) {
        throw new Error(
            'No locale defined: pass a locale or set VITE_DEFAULT_LOCALE in .env'
        );
    }

    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new Error('Amount must be a valid number');
    }

    return new Intl.NumberFormat(resolvedLocale, {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * Formats a date according to a specific locale
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale (fr-FR, en-US...) or undefined to use the env variable
 * @returns {string} The formatted date
 */
export const formatDate = (date, locale, options = {}) => {
    const resolvedLocale = locale || import.meta.env.VITE_DEFAULT_LOCALE;

    if (!resolvedLocale) {
        throw new Error(
            'No locale defined: pass a locale or set VITE_DEFAULT_LOCALE in .env'
        );
    }

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date provided');
    }

    return new Intl.DateTimeFormat(resolvedLocale, options).format(parsedDate);
};