
import React, { useState } from 'react';
import { Plus, Play, Trash2, Edit2, Check } from 'lucide-react';
import { ChainStep, AppState, StepAction, FeeType, ChainResult } from '../types';
import StepCard from './StepCard';

interface ChainBuilderProps {
  strategyId: string;
  name: string;
  chain: ChainStep[];
  result: ChainResult;
  appState: AppState;
  onUpdateSteps: (steps: ChainStep[]) => void;
  onRename: (newName: string) => void;
  onRemove: () => void;
}

const ChainBuilder: React.FC<ChainBuilderProps> = ({ 
  name, 
  chain, 
  result, 
  appState, 
  onUpdateSteps, 
  onRename, 
  onRemove 
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  const addStep = () => {
    const lastStep = chain[chain.length - 1];
    const newStep: ChainStep = {
      id: crypto.randomUUID(),
      exchangeId: lastStep?.exchangeId || appState.globalExchanges[0]?.id || '',
      action: StepAction.BUY,
      fromAsset: lastStep?.toAsset || appState.initialCapital.asset,
      toAsset: appState.globalAssets[0]?.symbol || 'USDT',
      rate: 1,
      feeType: FeeType.PERCENT,
      feeValue: 0.1,
      holdDays: 0,
    };
    onUpdateSteps([...chain, newStep]);
  };

  const removeStep = (id: string) => {
    onUpdateSteps(chain.filter(s => s.id !== id));
  };

  const updateStep = (index: number, updated: ChainStep) => {
    const newChain = [...chain];
    newChain[index] = updated;
    onUpdateSteps(newChain);
  };

  const handleRenameSubmit = () => {
    onRename(tempName);
    setIsEditingName(false);
  };

  return (
    <div className="flex-1 min-w-[300px] bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="w-1 h-4 bg-indigo-500 rounded-full shrink-0"></div>
          {isEditingName ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                autoFocus
                className="bg-slate-800 text-xs border border-slate-700 rounded px-1.5 py-0.5 text-white w-full"
              />
              <button onClick={handleRenameSubmit} className="text-emerald-500 p-1"><Check size={14} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-hidden group">
              <h2 className="text-sm font-bold tracking-tight text-slate-100 truncate">{name}</h2>
              <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-all">
                <Edit2 size={10} />
              </button>
            </div>
          )}
          <span className="text-[10px] text-slate-600 font-mono shrink-0">({chain.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addStep}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase transition-all shadow-sm"
          >
            <Plus size={12} /> Add Node
          </button>
          <button 
            onClick={onRemove}
            className="p-1 text-slate-600 hover:text-rose-500 transition-colors"
            title="Remove Strategy"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2 pr-1 max-h-[calc(100vh-280px)] overflow-y-auto scroll-smooth custom-scrollbar">
        {result.steps.length === 0 ? (
          <div className="h-40 border border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-600 gap-2">
            <Play size={24} className="opacity-10" />
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">Chain Empty</p>
          </div>
        ) : (
          result.steps.map((calculated, idx) => (
            <StepCard
              key={calculated.step.id}
              index={idx}
              step={calculated}
              assets={appState.globalAssets}
              exchanges={appState.globalExchanges}
              onUpdate={(updated) => updateStep(idx, updated)}
              onRemove={() => removeStep(calculated.step.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChainBuilder;
