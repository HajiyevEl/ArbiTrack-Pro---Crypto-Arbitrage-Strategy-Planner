
import React, { useState } from 'react';
import { Plus, Trash2, Landmark, ShieldAlert } from 'lucide-react';
import { Exchange } from '../types';

interface ExchangeManagerProps {
  exchanges: Exchange[];
  onUpdate: (exchanges: Exchange[]) => void;
}

const ExchangeManager: React.FC<ExchangeManagerProps> = ({ exchanges, onUpdate }) => {
  const [formData, setFormData] = useState({ name: '', dailyLimit: 100000, monthlyLimit: 1000000, currency: 'RUB' });

  const addExchange = () => {
    if (!formData.name) return;
    onUpdate([...exchanges, { ...formData, id: crypto.randomUUID() }]);
    setFormData({ name: '', dailyLimit: 100000, monthlyLimit: 1000000, currency: 'RUB' });
  };

  const removeExchange = (id: string) => {
    onUpdate(exchanges.filter(e => e.id !== id));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 mb-2">
        <Landmark size={18} />
        <h3 className="font-semibold text-sm uppercase tracking-wider">Exchanges & Limits</h3>
      </div>
      
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Exchange/Bank Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Daily Limit</label>
            <input
              type="number"
              value={formData.dailyLimit}
              onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Monthly Limit</label>
            <input
              type="number"
              value={formData.monthlyLimit}
              onChange={(e) => setFormData({ ...formData, monthlyLimit: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={addExchange}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Platform
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {exchanges.map((ex) => (
          <div key={ex.id} className="bg-slate-800/50 border border-slate-700 rounded p-3 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-200">{ex.name}</span>
              <button onClick={() => removeExchange(ex.id)} className="text-slate-500 hover:text-rose-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex gap-4 text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldAlert size={12} className="text-amber-500" />
                D: {ex.dailyLimit.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <ShieldAlert size={12} className="text-amber-500" />
                M: {ex.monthlyLimit.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeManager;
