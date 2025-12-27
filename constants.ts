
import { AppState, FeeType, StepAction } from './types';

export const INITIAL_STATE: AppState = {
  globalAssets: [
    { id: '1', symbol: 'USDT' },
    { id: '3', symbol: 'RUB' },
    { id: '4', symbol: 'AZN' },
    { id: '2', symbol: 'BTC' },
    { id: '5', symbol: 'USD' },
  ],
  globalExchanges: [
    { id: 'e1', name: 'Binance', dailyLimit: 1000000, monthlyLimit: 50000000, currency: 'RUB' },
    { id: 'e2', name: 'Bybit', dailyLimit: 5000000, monthlyLimit: 20000000, currency: 'RUB' },
    { id: 'e3', name: 'Sberbank', dailyLimit: 1000000, monthlyLimit: 50000000, currency: 'RUB' },
    { id: 'e4', name: 'T-Bank', dailyLimit: 1000000, monthlyLimit: 50000000, currency: 'RUB' },
  ],
  globalTax: 0,
  initialCapital: {
    amount: 1000000,
    asset: 'RUB',
  },
  strategies: [
    { id: 's1', name: 'Chain A', steps: [] },
    { id: 's2', name: 'Chain B', steps: [] },
  ],
};
