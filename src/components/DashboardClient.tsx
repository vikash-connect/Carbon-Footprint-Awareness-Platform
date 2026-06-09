'use client';

import React, { useState, useMemo } from 'react';
import { calculateCarbonScore, generateTips, FootprintData } from '@/lib/utils/calculations';

// Small Reusable UI Component
const CarbonCard = ({ title, value, unit }: { title: string, value: number, unit: string }) => (
  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
    <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">{title}</h3>
    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-4xl font-black text-emerald-900">{value.toFixed(1)}</span>
      <span className="text-emerald-700 font-medium">{unit}</span>
    </div>
  </div>
);

// Small Reusable UI Component
const TipList = ({ tips }: { tips: string[] }) => (
  <section aria-labelledby="action-center-title" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
    <h2 id="action-center-title" className="text-xl font-bold text-slate-800 mb-4">Action Center</h2>
    <ul className="space-y-4">
      {tips.map((tip, idx) => (
        <li key={idx} className="flex gap-3">
          <span aria-hidden="true" className="text-xl">💡</span>
          <p className="text-slate-700 leading-relaxed">{tip}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default function DashboardClient({ userId }: { userId: string }) {
  const [formData, setFormData] = useState<FootprintData>({ travel: 0, foodType: 'omnivore', energyUse: 0 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Resource Optimization: useMemo prevents recalculating score/tips unless formData specifically changes
  const currentScore = useMemo(() => calculateCarbonScore(formData), [formData]);
  const personalizedTips = useMemo(() => generateTips(formData), [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/footprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Form Panel */}
      <section className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Daily Tracker</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="travel" className="block text-sm font-semibold text-slate-700 mb-2">Travel (Kilometers)</label>
            <input
              id="travel" type="number" min="0" aria-label="Distance traveled today in km" required
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
              value={formData.travel || ''}
              onChange={(e) => setFormData(p => ({ ...p, travel: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label htmlFor="foodType" className="block text-sm font-semibold text-slate-700 mb-2">Primary Diet</label>
            <select
              id="foodType" aria-label="Select your dietary focus for today"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.foodType}
              onChange={(e) => setFormData(p => ({ ...p, foodType: e.target.value as FootprintData['foodType'] }))}
            >
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="omnivore">Omnivore</option>
              <option value="meat-heavy">Meat-Heavy</option>
            </select>
          </div>

          <div>
            <label htmlFor="energy" className="block text-sm font-semibold text-slate-700 mb-2">Home Energy (kWh)</label>
            <input
              id="energy" type="number" min="0" aria-label="Estimated home energy usage in kWh" required
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
              value={formData.energyUse || ''}
              onChange={(e) => setFormData(p => ({ ...p, energyUse: Number(e.target.value) }))}
            />
          </div>

          <button
            type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Saving Impact...' : 'Log Daily Footprint'}
          </button>

          {/* Accessible Form Status Announcement */}
          {status === 'success' && <p role="alert" className="text-emerald-600 text-sm font-medium">Successfully logged!</p>}
          {status === 'error' && <p role="alert" className="text-red-600 text-sm font-medium">Failed to save data. Try again.</p>}
        </form>
      </section>

      {/* Right Dashboard & Insight Panel */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <CarbonCard title="Calculated Daily Emissions" value={currentScore} unit="kg CO₂e" />
        
        {/* Simple visual bar chart calculation derived efficiently via CSS logic */}
        <section aria-label="Emissions Breakdown Chart" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Breakdown Estimate</h3>
           <div className="w-full h-6 bg-slate-100 rounded-full flex overflow-hidden">
             <div className="bg-sky-500 transition-all" style={{ width: `${(formData.travel * 0.21 / (currentScore || 1)) * 100}%` }} title="Travel Segment" />
             <div className="bg-amber-400 transition-all" style={{ width: `${(formData.energyUse * 0.233 / (currentScore || 1)) * 100}%` }} title="Energy Segment" />
             <div className="bg-emerald-500 transition-all" style={{ flexGrow: 1 }} title="Food Segment" />
           </div>
           <div className="flex justify-between text-xs font-medium text-slate-600 mt-3 px-1">
             <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Travel</span>
             <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Energy</span>
             <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Food</span>
           </div>
        </section>

        <TipList tips={personalizedTips} />
      </div>
    </div>
  );
}
