import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { formatCurrency } from '../utils/formatters';

const ONE_HOUR = 60 * 60 * 1000;
const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'GBP'];

function useCurrency(defaultCurrency = 'EUR') {
	const [currencyRaw, setCurrencyRaw] = useLocalStorage('currency', defaultCurrency);
	
	const setCurrency = useCallback((newCurrency) => {
		if (!SUPPORTED_CURRENCIES.includes(newCurrency)) {
			console.warn(`Unsupported currency: ${newCurrency}`);
			return;
		}
		setCurrencyRaw(newCurrency);
	}, [setCurrencyRaw]);
	
	const currency = currencyRaw;

	const [cache, setCache] = useLocalStorage('currencyCache', null);
	const [rates, setRates] = useState(cache?.rates ?? null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRates = async () => {
			const cacheIsValid = cache
				&& cache.base === currency
				&& (Date.now() - cache.timestamp) < ONE_HOUR;

			if (cacheIsValid) {
				setRates(cache.rates);
				return;
			}
			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);

				if (!response.ok) {
					throw new Error(`API Error: ${response.status}`);
				}

				const data = await response.json();
				setRates(data.rates);

				setCache({
					base: currency,
					rates: data.rates,
					timestamp: Date.now(),
				});
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}

		fetchRates();
	}, [currency]);

	const formatAmount = useCallback((amount) => {
		return formatCurrency(amount, currency);
	}, [currency]);

	const convert = useCallback((amount, from, to) => {
		if (!rates) return null;
		if (!rates[from] || !rates[to]) return null;

		return amount * rates[to] / rates[from];
	}, [rates]);
	
	return {
		currency,
		setCurrency,
		rates,
		formatAmount,
		convert,
		isLoading,
		error
	};
}

export default useCurrency