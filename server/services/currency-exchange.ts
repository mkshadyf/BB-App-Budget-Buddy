// Simple currency exchange service with fallback rates
// In production, you would use a real API like exchangerate-api.com

interface ExchangeRates {
  [key: string]: number;
}

// Static fallback rates relative to USD (as of 2024)
const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.35,
  AUD: 1.45,
  CHF: 0.88,
  CNY: 7.2,
  INR: 75.0,
  BRL: 5.2,
};

export class CurrencyExchangeService {
  private rates: ExchangeRates = FALLBACK_RATES;
  private lastUpdate: Date = new Date();

  async getExchangeRate(from: string, to: string = 'USD'): Promise<number> {
    if (from === to) return 1;
    
    const fromRate = this.rates[from];
    const toRate = this.rates[to];
    
    if (!fromRate || !toRate) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }
    
    // Convert through USD: from -> USD -> to
    return (1 / fromRate) * toRate;
  }

  async convertToUSD(amount: number, fromCurrency: string): Promise<number> {
    if (fromCurrency === 'USD') return amount;
    
    const rate = await this.getExchangeRate(fromCurrency, 'USD');
    return amount * rate;
  }

  async convertFromUSD(amount: number, toCurrency: string): Promise<number> {
    if (toCurrency === 'USD') return amount;
    
    const rate = await this.getExchangeRate('USD', toCurrency);
    return amount * rate;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(this.rates);
  }

  getLastUpdateTime(): Date {
    return this.lastUpdate;
  }
}

export const currencyService = new CurrencyExchangeService();