
import React from 'react';
import { TrendingUp, Clock, DollarSign, Zap, AlertCircle } from 'lucide-react';
import { ChainResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface ComparisonDashboardProps {
  results: ChainResult[];
}

const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({ results }) => {
  if (results.length === 0) return null;

  // Find the best ROI strategy
  const bestRoiResult = [...results].sort((a, b) => b.roi - a.roi)[0];
  const hasAnyLimitWarning = results.some(r => r.steps.some(s => s.limitWarning));

  const chartData = results.map(r => ({
    name: r.strategyName,
    ROI: Number(r.roi.toFixed(2)),
    Profit: Math.round(r.netProfitAfterTax),
  }));

  const StatMini = ({ icon: Icon, label, results, valueKey, suffix = '', isBetterHigh = true }: any) => {
    const sorted = [...results].sort((a, b) => isBetterHigh ? b[valueKey] - a[valueKey] : a[valueKey] - b[valueKey]);
    const best = sorted[0];
    const second = sorted[1];

    return (
      <div className="flex flex-col justify-center px-4 border-r border-slate-800 last:border-r-0 py-1 min-w-[140px]">
        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
          <Icon size={12} />
          <span className="text-[9px] uppercase font-bold tracking-wider">{label}</span>
        </div>
        <div className="flex flex-col">
          <div className="text-xs font-mono font-semibold text-emerald-400 flex justify-between items-center gap-2">
            <span className="truncate max-w-[60px] text-[8px] text-slate-500">{best.strategyName}</span>
            <span>{best[valueKey].toLocaleString()}{suffix}</span>
          </div>
          {second && (
            <div className="text-[10px] font-mono text-slate-500 flex justify-between items-center gap-2">
              <span className="truncate max-w-[60px] text-[8px] text-slate-600">{second.strategyName}</span>
              <span>{second[valueKey].toLocaleString()}{suffix}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col xl:flex-row gap-3">
        {/* Main Stats Strip */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex overflow-x-auto py-3 shadow-sm custom-scrollbar">
          <StatMini
            icon={TrendingUp}
            label="Top ROI"
            results={results}
            valueKey="roi"
            suffix="%"
            isBetterHigh={true}
          />
          <StatMini
            icon={DollarSign}
            label="Top Profit"
            results={results}
            valueKey="netProfitAfterTax"
            isBetterHigh={true}
          />
          <StatMini
            icon={Clock}
            label="Min Hold"
            results={results}
            valueKey="totalHold"
            suffix="d"
            isBetterHigh={false}
          />
          <StatMini
            icon={Zap}
            label="Efficiency"
            results={results}
            valueKey="efficiency"
            isBetterHigh={true}
          />
        </div>

        {/* Comparison Chart */}
        <div className="xl:w-80 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col shadow-sm">
          <div className="text-[8px] uppercase font-bold text-slate-500 mb-2 tracking-widest">ROI Distribution</div>
          <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px' }}
                />
                <Bar dataKey="ROI" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.ROI > 0 ? '#6366f1' : '#f43f5e'} opacity={entry.ROI === bestRoiResult.roi ? 1 : 0.4} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {hasAnyLimitWarning && (
        <div className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded-lg text-rose-400 text-[11px]">
          <AlertCircle size={14} />
          <span>Notice: One or more strategies exceed platform liquidity/daily limits. Check individual nodes.</span>
        </div>
      )}
    </div>
  );
};

export default ComparisonDashboard;
