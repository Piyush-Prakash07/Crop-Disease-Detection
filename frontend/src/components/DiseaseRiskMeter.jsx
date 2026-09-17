import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getDiseaseRisk } from '../services/weatherAdvisoryService';

export default function DiseaseRiskMeter({ weatherData }) {
  const humidity = weatherData?.humidity ?? 72;
  const temp = weatherData?.temp ?? 28;
  const risk = weatherData?.risk || getDiseaseRisk(humidity);

  // Calculate needle angle for semi-circle gauge (0° to 180°)
  // score is 0 to 100
  const angle = Math.min(180, Math.max(0, (risk.score / 100) * 180));

  return (
    <div className="glass-panel border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Epidemic Risk Telemetry</span>
          <h3 className="text-lg font-black text-white">Disease Risk Meter</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.badgeClass}`}>
          {risk.level}
        </span>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg viewBox="0 0 200 110" className="w-56 h-32 overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />   {/* Green Low */}
              <stop offset="50%" stopColor="#eab308" />  {/* Yellow Medium */}
              <stop offset="100%" stopColor="#ef4444" /> {/* Red High */}
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1f2937"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Color Gradient Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Needle Indicator */}
          <g transform={`rotate(${angle - 90}, 100, 100)`} className="transition-transform duration-1000 ease-out">
            <line x1="100" y1="100" x2="100" y2="32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="100" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Arc Labels */}
          <text x="18" y="112" fill="#10b981" fontSize="9" fontWeight="bold">LOW</text>
          <text x="92" y="16" fill="#eab308" fontSize="9" fontWeight="bold">MED</text>
          <text x="168" y="112" fill="#ef4444" fontSize="9" fontWeight="bold">HIGH</text>
        </svg>

        {/* Score & Risk Output */}
        <div className="text-center -mt-4">
          <span className="text-3xl font-black text-white font-mono">{risk.score}%</span>
          <p className="text-xs text-gray-400 font-medium">Spore Germination Index</p>
        </div>
      </div>

      {/* Risk Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <span className="text-gray-400 text-[11px] block">Relative Humidity</span>
          <span className="font-bold text-white font-mono">{humidity}%</span>
          <span className="text-[10px] text-gray-500 block">
            {humidity > 80 ? '>80% (High Fungus)' : humidity >= 60 ? '60-80% (Moderate)' : '<60% (Dry)'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <span className="text-gray-400 text-[11px] block">Thermal Index</span>
          <span className="font-bold text-white font-mono">{temp}°C</span>
          <span className="text-[10px] text-gray-500 block">
            {temp > 25 ? 'Favors Pathogens' : 'Cool Conditions'}
          </span>
        </div>
      </div>
    </div>
  );
}
