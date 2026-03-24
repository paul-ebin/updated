import { createContext, useContext, useState, useEffect } from 'react';

const rates = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.12 };
const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatPrice = (usdPrice) => {
    const converted = usdPrice * rates[currency];
    return `${symbols[currency]}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: Object.keys(rates) }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
