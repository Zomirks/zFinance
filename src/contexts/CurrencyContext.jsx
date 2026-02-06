import { createContext, useContext } from 'react';
import useCurrencyHook from '../hooks/useCurrency';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
    const currencyData = useCurrencyHook();

    return (
        <CurrencyContext.Provider value={currencyData}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}