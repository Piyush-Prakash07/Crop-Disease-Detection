import React from 'react';
import { PieChart, BarChart3, TrendingUp, CheckCircle, AlertTriangle, ListTodo, CalendarDays } from 'lucide-react';

export default function FarmAnalytics({ history = [] }) {
  // 1. Basic Cards Metrics
  const totalScans = history.length;
  const healthyPlants = history.filter(h => h.disease_name.toLowerCase().includes('healthy')).length;
  const diseasesFound = totalScans - healthyPlants;

  // This Week Scans (Past 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekScans = history.filter(h => new Date(h.date) >= sevenDaysAgo).length;

  // 2. Pie Chart Data: Healthy vs Diseased Ratio
  const healthyPercent = totalScans > 0 ? Math.round((healthyPlants / totalScans) * 100) : 0;
  const diseasedPercent = totalScans > 0 ? 100 - healthyPercent : 0;

  // 3. Bar Chart Data: Top 5 Most Detected Diseases
  const diseaseCounts = {};
  history.forEach(item => {
    const name = item.disease_name.replace(/___/g, ' - ').replace(/_/g, ' ');
    diseaseCounts[name] = (diseaseCounts[name] || 0) + 1;
  });

  const sortedDiseases = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxDiseaseCount = sortedDiseases.length > 0 ? Math.max(...sortedDiseases.map(d => d[1])) : 1;

  // 4. Line Chart Data: Weekly Scans Trend (Last 6 Weeks)
  const getWeeklyData = () => {
    const weeks = [];
    for (let i = 5; i >= 0; i--) {
      const wStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const wEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const count = history.filter(h => {
        const d = new Date(h.date);
        return d >= wStart && d < wEnd;
      }).length;

      const label = `W${6 - i}`;
      weeks.push({ label, count });
    }
    return weeks;
  };

  const weeklyTrend = getWeeklyData();
  const maxWeeklyCount = Math.max(1, ...weeklyTrend.map(w => w.count));

  // Compute SVG coordinates for Line Chart
  const svgWidth = 320;
  const svgHeight = 120;
  const padding = 25;
  const plotWidth = svgWidth - padding * 2;
  const plotHeight = svgHeight - padding * 2;

  const linePoints = weeklyTrend.map((item, index) => {
    const x = padding + (index / (weeklyTrend.length - 1 || 1)) * plotWidth;
    const y = svgHeight - padding - (item.count / maxWeeklyCount) * plotHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Scans */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-gray-800">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Scans</p>
            <h3 className="text-3xl font-black text-white">{totalScans}</h3>
            <p className="text-[11px] text-gray-500">Cumulative Diagnostics</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ListTodo className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Diseases Found */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-gray-800">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Diseases Found</p>
            <h3 className="text-3xl font-black text-red-400">{diseasesFound}</h3>
            <p className="text-[11px] text-gray-500">Pathogens Identified</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Healthy Plants */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-gray-800">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Healthy Plants</p>
            <h3 className="text-3xl font-black text-emerald-400">{healthyPlants}</h3>
            <p className="text-[11px] text-gray-500">Optimal Leaf Condition</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: This Week Scans */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-gray-800">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">This Week Scans</p>
            <h3 className="text-3xl font-black text-teal-300">{thisWeekScans}</h3>
            <p className="text-[11px] text-gray-500">Past 7 Days Scans</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Pie Chart - Healthy vs Diseased Ratio */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" /> Healthy vs Diseased
            </h4>
            <span className="text-xs text-gray-400 font-mono">Ratio</span>
          </div>

          <div className="flex items-center justify-center my-4 relative">
            <svg viewBox="0 0 120 120" className="w-36 h-36">
              {/* Pie Circle Background (Diseased/Red) */}
              <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="18" opacity="0.85" />

              {/* Healthy Segment (Emerald Green) */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="18"
                strokeDasharray={`${(healthyPercent / 100) * 282.7} 282.7`}
                strokeDashoffset="0"
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-black text-white font-mono">{healthyPercent}%</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Healthy</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-850">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-gray-300 font-medium">Healthy ({healthyPlants})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <span className="text-gray-300 font-medium">Diseased ({diseasesFound})</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Bar Chart - Top 5 Most Detected Diseases */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Top 5 Detected Conditions
            </h4>
            <span className="text-xs text-gray-400 font-mono">Frequency</span>
          </div>

          <div className="space-y-3 my-2">
            {sortedDiseases.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">No diagnostics recorded yet.</p>
            ) : (
              sortedDiseases.map(([diseaseName, count], idx) => {
                const percentage = Math.round((count / maxDiseaseCount) * 100);
                const isHealthy = diseaseName.toLowerCase().includes('healthy');
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-300 truncate max-w-[190px]" title={diseaseName}>
                        {diseaseName}
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">{count}</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden border border-gray-850">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isHealthy ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-[11px] text-gray-500 border-t border-gray-850 pt-2">
            Ranked by occurrence count across all user diagnostic logs.
          </div>
        </div>

        {/* Chart 3: Line Chart - Scans Per Week */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Weekly Scans Activity
            </h4>
            <span className="text-xs text-gray-400 font-mono">6 Weeks Trend</span>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-32 overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1f2937" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#1f2937" strokeWidth="1" />

              {/* Smooth Trend Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />

              {/* Data points dots */}
              {weeklyTrend.map((item, idx) => {
                const x = padding + (idx / (weeklyTrend.length - 1 || 1)) * plotWidth;
                const y = svgHeight - padding - (item.count / maxWeeklyCount) * plotHeight;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="4" fill="#10b981" stroke="#080c14" strokeWidth="2" />
                    <text x={x} y={svgHeight - 6} fill="#6b7280" fontSize="9" textAnchor="middle">{item.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] text-gray-500 border-t border-gray-850 pt-2 flex justify-between">
            <span>Weekly throughput</span>
            <span className="text-emerald-400 font-semibold font-mono">Avg: {(totalScans / 6).toFixed(1)} scans/wk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
