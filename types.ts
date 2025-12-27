
export enum FeeType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
}

export enum StepAction {
  BUY = 'BUY',
  SELL = 'SELL',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
}

export interface Exchange {
  id: string;
  name: string;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string; // The fiat currency for limits (e.g., RUB, AZN)
}

export interface Asset {
  id: string;
  symbol: string;
}

export interface ChainStep {
  id: string;
  exchangeId: string;
  action: StepAction;
  fromAsset: string;
  toAsset: string;
  rate: number;
  feeType: FeeType;
  feeValue: number;
  holdDays: number; // 0, 1, 2
}

export interface StrategyChain {
  id: string;
  name: string;
  steps: ChainStep[];
}

export interface AppState {
  globalAssets: Asset[];
  globalExchanges: Exchange[];
  globalTax: number;
  initialCapital: {
    amount: number;
    asset: string;
  };
  strategies: StrategyChain[];
}

export interface CalculatedStep {
  step: ChainStep;
  inputAmount: number;
  outputAmount: number;
  feeAmount: number;
  cumulativeHold: number;
  limitWarning: boolean;
  limitUsed: number;
}

export interface ChainResult {
  strategyId: string;
  strategyName: string;
  steps: CalculatedStep[];
  totalFees: number;
  totalHold: number;
  finalGross: number;
  netProfitBeforeTax: number;
  netProfitAfterTax: number;
  roi: number;
  efficiency: number; // Profit per hold day
}
