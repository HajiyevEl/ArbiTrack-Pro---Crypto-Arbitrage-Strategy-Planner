
import { ChainStep, ChainResult, CalculatedStep, StepAction, FeeType, StrategyChain } from '../types';

export const calculateChain = (
  strategy: StrategyChain,
  initialAmount: number,
  globalTax: number,
  exchanges: Record<string, any>
): ChainResult => {
  const { steps, id, name } = strategy;
  let currentAmount = initialAmount;
  let totalFees = 0;
  let totalHold = 0;
  const calculatedSteps: CalculatedStep[] = [];
  
  for (const step of steps) {
    const inputAmount = currentAmount;
    let fee = 0;
    
    if (step.feeType === FeeType.PERCENT) {
      fee = inputAmount * (step.feeValue / 100);
    } else {
      fee = step.feeValue;
    }
    
    let outputAmount = 0;
    if (step.action === StepAction.BUY) {
      outputAmount = (inputAmount - fee) / step.rate;
    } else if (step.action === StepAction.SELL) {
      outputAmount = (inputAmount * step.rate) - fee;
    } else {
      outputAmount = inputAmount - fee;
    }

    const exchange = exchanges[step.exchangeId];
    const limitUsed = inputAmount;
    const limitWarning = exchange ? limitUsed > exchange.dailyLimit : false;

    totalHold += step.holdDays;
    totalFees += fee;
    
    calculatedSteps.push({
      step,
      inputAmount,
      outputAmount,
      feeAmount: fee,
      cumulativeHold: totalHold,
      limitWarning,
      limitUsed
    });

    currentAmount = outputAmount;
  }

  const finalGross = currentAmount;
  const netProfitBeforeTax = finalGross - initialAmount;
  const netProfitAfterTax = netProfitBeforeTax > 0 
    ? netProfitBeforeTax * (1 - globalTax / 100)
    : netProfitBeforeTax;
  
  const roi = initialAmount > 0 ? (netProfitAfterTax / initialAmount) * 100 : 0;
  const efficiency = totalHold > 0 ? netProfitAfterTax / totalHold : netProfitAfterTax;

  return {
    strategyId: id,
    strategyName: name,
    steps: calculatedSteps,
    totalFees,
    totalHold,
    finalGross,
    netProfitBeforeTax,
    netProfitAfterTax,
    roi,
    efficiency,
  };
};
