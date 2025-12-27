
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, 
  Settings, 
  Download, 
  Upload, 
  RefreshCcw, 
  LayoutDashboard,
  Percent,
  CircleDollarSign,
  PlusCircle,
  X,
  ChevronLeft,
  Layers
} from 'lucide-react';
import { INITIAL_STATE } from './constants';
import { AppState, ChainStep, ChainResult, Exchange, StrategyChain } from './types';
import AssetManager from './components/AssetManager';
import ExchangeManager from './components/ExchangeManager';
import ChainBuilder from './components/ChainBuilder';
import ComparisonDashboard from './components/ComparisonDashboard';
import { calculateChain } from './services/calculator';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSettings(true);
      } else {
        setShowSettings(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const exchangeMap = useMemo(() => {
    return state.globalExchanges.reduce((acc, ex) => {
      acc[ex.id] = ex;
      return acc;
    }, {} as Record<string, Exchange>);
  }, [state.globalExchanges]);

  const results = useMemo(() => 
    state.strategies.map(strategy => 
      calculateChain(strategy, state.initialCapital.amount, state.globalTax, exchangeMap)
    ),
    [state.strategies, state.initialCapital, state.globalTax, exchangeMap]
  );

  const handleUpdate = (field: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const addStrategy = () => {
    const newStrategy: StrategyChain = {
      id: crypto.randomUUID(),
      name: `Chain ${state.strategies.length + 1}`,
      steps: []
    };
    setState(prev => ({
      ...prev,
      strategies: [...prev.strategies, newStrategy]
    }));
  };

  const removeStrategy = (id: string) => {
    if (state.strategies.length <= 1) return;
    setState(prev => ({
      ...prev,
      strategies: prev.strategies.filter(s => s.id !== id)
    }));
  };

  const renameStrategy = (id: string, newName: string) => {
    setState(prev => ({
      ...prev,
      strategies: prev.strategies.map(s => s.id === id ? { ...s, name: newName } : s)
    }));
  };

  const updateStrategySteps = (id: string, steps: ChainStep[]) => {
    setState(prev => ({
      ...prev,
      strategies: prev.strategies.map(s => s.id === id ? { ...s, steps } : s)
    }));
  };

  const saveSession = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arbitrack-session-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const loadSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setState(data);
      } catch (err) {
        alert("Invalid session file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setShowSettings(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-5 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${showSettings ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">ArbiTrack <span className="text-indigo-400">Pro</span></h1>
              <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-500">v1.3.0 Dynamic</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(false)}
            className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-6 overflow-y-auto h-[calc(100vh-140px)] pr-1 custom-scrollbar">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <CircleDollarSign size={16} />
              <h3 className="font-semibold text-[10px] uppercase tracking-wider">Initial Capital</h3>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="number"
                value={state.initialCapital.amount}
                onChange={(e) => handleUpdate('initialCapital', { ...state.initialCapital, amount: Number(e.target.value) })}
                className="col-span-2 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
              />
              <select
                value={state.initialCapital.asset}
                onChange={(e) => handleUpdate('initialCapital', { ...state.initialCapital, asset: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded px-1 py-1 text-[10px] text-slate-300"
              >
                {state.globalAssets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
              </select>
            </div>
          </div>

          <AssetManager assets={state.globalAssets} onUpdate={(val) => handleUpdate('globalAssets', val)} />
          <ExchangeManager exchanges={state.globalExchanges} onUpdate={(val) => handleUpdate('globalExchanges', val)} />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Percent size={16} />
              <h3 className="font-semibold text-[10px] uppercase tracking-wider">Global Tax (%)</h3>
            </div>
            <input
              type="number"
              value={state.globalTax}
              onChange={(e) => handleUpdate('globalTax', Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button onClick={saveSession} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 rounded-lg text-xs font-semibold transition-all">
              <Download size={14} /> Save
            </button>
            <label className="w-full flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/30 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer">
              <Upload size={14} /> Load
              <input type="file" hidden onChange={loadSession} accept=".json" />
            </label>
          </div>
        </nav>
      </aside>

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${showSettings ? 'lg:ml-72' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-indigo-400"
            >
              {showSettings ? <ChevronLeft size={18} /> : <Settings size={18} />}
            </button>
            <div className="flex items-center gap-2 text-slate-500">
              <LayoutDashboard size={14} className="hidden sm:block" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em]">Multi-Chain Analyzer</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={addStrategy}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-lg shadow-indigo-500/10"
            >
              <PlusCircle size={14} /> New Strategy
            </button>
            <button 
              onClick={() => setState(INITIAL_STATE)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-rose-400 text-[10px] font-bold uppercase transition-colors"
            >
              <RefreshCcw size={12} /> <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-5 overflow-x-hidden">
          <ComparisonDashboard results={results} />

          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Execution Workspace</h3>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar">
            {state.strategies.map((strategy, idx) => (
              <div key={strategy.id} className="snap-start min-w-[320px] max-w-[400px]">
                <ChainBuilder
                  strategyId={strategy.id}
                  name={strategy.name}
                  chain={strategy.steps}
                  result={results[idx]}
                  appState={state}
                  onUpdateSteps={(steps) => updateStrategySteps(strategy.id, steps)}
                  onRename={(newName) => renameStrategy(strategy.id, newName)}
                  onRemove={() => removeStrategy(strategy.id)}
                />
              </div>
            ))}
            
            <button 
              onClick={addStrategy}
              className="flex flex-col items-center justify-center min-w-[200px] border-2 border-dashed border-slate-800/50 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-slate-600 hover:text-indigo-400 gap-2 group"
            >
              <PlusCircle size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Add Chain</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
