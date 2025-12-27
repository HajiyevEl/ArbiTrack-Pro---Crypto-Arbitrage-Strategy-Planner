
import { AppState, FeeType, StepAction } from './types';

export const INITIAL_STATE: AppState = {
  globalAssets: [
    { id: '1', symbol: 'USDT' },
    { id: '2', symbol: 'BTC' },
    { id: '3', symbol: 'RUB' },
    { id: '4', symbol: 'AZN' },
    { id: '5', symbol: 'USD' },
  ],
  globalExchanges: [
    { id: 'e1', name: 'Binance', dailyLimit: 1000000, monthlyLimit: 5000000, currency: 'RUB' },
    { id: 'e2', name: 'Bybit', dailyLimit: 500000, monthlyLimit: 2000000, currency: 'RUB' },
    { id: 'e3', name: 'Sberbank', dailyLimit: 100000, monthlyLimit: 500000, currency: 'RUB' },
  ],
  globalTax: 13,
  initialCapital: {
    amount: 100000,
    asset: 'RUB',
  },
  strategies: [
    { id: 's1', name: 'Alpha Chain', steps: [] },
    { id: 's2', name: 'Beta Chain', steps: [] },
  ],
};
