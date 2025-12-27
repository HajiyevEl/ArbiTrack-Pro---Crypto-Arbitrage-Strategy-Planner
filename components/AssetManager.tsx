
import React, { useState } from 'react';
import { Plus, Trash2, Coins } from 'lucide-react';
import { Asset } from '../types';

interface AssetManagerProps {
  assets: Asset[];
  onUpdate: (assets: Asset[]) => void;
}

const AssetManager: React.FC<AssetManagerProps> = ({ assets, onUpdate }) => {
  const [newSymbol, setNewSymbol] = useState('');

  const addAsset = () => {
    if (!newSymbol) return;
    onUpdate([...assets, { id: crypto.randomUUID(), symbol: newSymbol.toUpperCase() }]);
    setNewSymbol('');
  };

  const removeAsset = (id: string) => {
    onUpdate(assets.filter(a => a.id !== id));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 mb-2">
        <Coins size={18} />
        <h3 className="font-semibold text-sm uppercase tracking-wider">Global Assets</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="e.g. USDT"
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={addAsset}
          className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-white transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-xs font-medium text-slate-300"
          >
            {asset.symbol}
            <button onClick={() => removeAsset(asset.id)} className="hover:text-rose-500">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetManager;
