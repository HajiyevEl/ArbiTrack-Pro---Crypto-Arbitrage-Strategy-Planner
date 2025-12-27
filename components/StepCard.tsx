
import React from 'react';
import { Trash2, ArrowRightLeft, MoveRight, Wallet, Clock, AlertTriangle } from 'lucide-react';
import { ChainStep, StepAction, FeeType, CalculatedStep, Exchange, Asset } from '../types';

interface StepCardProps {
  step: CalculatedStep;
  exchanges: Exchange[];
  assets: Asset[];
  onUpdate: (updated: ChainStep) => void;
  onRemove: () => void;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, exchanges, assets, onUpdate, onRemove, index }) => {
  const { step: s, inputAmount, outputAmount, feeAmount, limitWarning } = step;

  const handleChange = (field: keyof ChainStep, value: any) => {
    onUpdate({ ...s, [field]: value });
  };

  const getActionIcon = () => {
    switch (s.action) {
      case StepAction.BUY: return <ArrowRightLeft className="text-emerald-400" size={14} />;
      case StepAction.SELL: return <ArrowRightLeft className="text-rose-400" size={14} />;
      case StepAction.TRANSFER: return <MoveRight className="text-blue-400" size={14} />;
      case StepAction.WITHDRAW: return <Wallet className="text-amber-400" size={14} />;
    }
  };

  return (
    <div className={`relative bg-slate-900 border ${limitWarning ? 'border-rose-500/50 shadow-lg shadow-rose-900/10' : 'border-slate-800'} rounded-lg p-3 transition-all hover:border-slate-700`}>
      {limitWarning && (
        <div className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5" title="Limit Exceeded">
          <AlertTriangle size={10} />
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-600 w-4">{index + 1}.</span>
        <div className="bg-slate-800 p-1 rounded">
          {getActionIcon()}
        </div>
        <select
          value={s.action}
          onChange={(e) => handleChange('action', e.target.value)}
          className="bg-transparent text-xs font-bold border-none focus:ring-0 p-0 text-slate-200 cursor-pointer hover:text-indigo-400 transition-colors"
        >
          {Object.values(StepAction).map(a => <option key={a} value={a} className="bg-slate-900">{a}</option>)}
        </select>
        <div className="flex-1"></div>
        <button onClick={onRemove} className="text-slate-600 hover:text-rose-500 transition-colors">
          <Trash2 size={12} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-2 mb-2">
        {/* Row 1: Platform & Rate */}
        <div className="col-span-7">
          <select
            value={s.exchangeId}
            onChange={(e) => handleChange('exchangeId', e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded px-1.5 py-1 text-[11px] text-slate-300"
          >
            <option value="">Platform...</option>
            {exchanges.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>
        <div className="col-span-5 relative">
          <input
            type="number"
            value={s.rate}
            onChange={(e) => handleChange('rate', Number(e.target.value))}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded px-1.5 py-1 text-[11px] text-slate-200 font-mono"
            placeholder="Rate"
          />
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-slate-600 font-bold uppercase">Rate</span>
        </div>

        {/* Row 2: Assets */}
        <div className="col-span-5">
          <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded overflow-hidden">
             <select
              value={s.fromAsset}
              onChange={(e) => handleChange('fromAsset', e.target.value)}
              className="w-full bg-transparent border-none text-[10px] py-1 pl-1 text-slate-400"
            >
              {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
            </select>
            <MoveRight size={10} className="text-slate-600 mx-1 shrink-0" />
            <select
              value={s.toAsset}
              onChange={(e) => handleChange('toAsset', e.target.value)}
              className="w-full bg-transparent border-none text-[10px] py-1 pr-1 text-emerald-400 font-semibold"
            >
              {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Fee & Hold */}
        <div className="col-span-4">
           <div className="flex bg-slate-800/50 border border-slate-700/50 rounded items-center">
             <input
              type="number"
              value={s.feeValue}
              onChange={(e) => handleChange('feeValue', Number(e.target.value))}
              className="w-full bg-transparent border-none p-1 text-[10px] text-slate-300 font-mono"
            />
            <button 
              onClick={() => handleChange('feeType', s.feeType === FeeType.PERCENT ? FeeType.FIXED : FeeType.PERCENT)}
              className="px-1 text-[8px] font-bold text-indigo-400 hover:text-white"
            >
              {s.feeType === FeeType.PERCENT ? '%' : '$'}
            </button>
           </div>
        </div>
        <div className="col-span-3">
          <div className="flex bg-slate-800/50 border border-slate-700/50 rounded items-center justify-around h-full">
            {[0, 1, 2].map(days => (
              <button
                key={days}
                onClick={() => handleChange('holdDays', days)}
                className={`flex-1 h-full text-[9px] font-bold transition-colors ${s.holdDays === days ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
              >
                T{days === 0 ? '' : `+${days}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-[10px] font-mono border-t border-slate-800/50 pt-2">
        <span className="text-slate-600">In: {inputAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
        <span className="text-emerald-500 font-bold">Out: {outputAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
      </div>
    </div>
  );
};

export default StepCard;
