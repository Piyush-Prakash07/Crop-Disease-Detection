import React, { useState, useEffect } from 'react';
import { Lightbulb, Calendar, AlertOctagon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const DAILY_TIPS = [
  {
    id: 1,
    title: 'Morning Drip Irrigation',
    category: 'Water Management',
    text: 'Water crops early in the morning (6 AM - 8 AM) so foliage dries rapidly in sunshine, preventing fungal spore germination.'
  },
  {
    id: 2,
    title: 'Mulching Base Protection',
    category: 'Soil Health',
    text: 'Apply 2-3 inches of straw mulch around Solanaceous crop bases to prevent rainwater from splashing soil-borne fungi onto lower leaves.'
  },
  {
    id: 3,
    title: 'Lower Leaf Pruning',
    category: 'Canopy Care',
    text: 'Prune leaves within 12 inches of the soil level once tomato plants reach 3 feet in height to enhance air circulation.'
  },
  {
    id: 4,
    title: 'Crop Rotation Cycle',
    category: 'Disease Control',
    text: 'Avoid planting tomatoes, potatoes, or peppers in the same bed for more than 2 consecutive seasons to break bacterial life cycles.'
  },
  {
    id: 5,
    title: 'Tool Disinfection Standard',
    category: 'Hygiene Protocol',
    text: 'Sanitize pruning shears with 70% isopropyl alcohol between plants when working near foliage affected by mosaic virus or leaf spots.'
  }
];

const MONTHLY_ADVICE = {
  0: 'January (Winter Peak): Protect young potato shoots from frost. Apply light irrigation before cold nights.',
  1: 'February (Late Winter): Prepare soil for spring tomato nursery. Incorporate well-rotted organic manure.',
  2: 'March (Spring Sowing): Transplant tomato seedlings. Apply protective trichoderma bio-fungicide to roots.',
  3: 'April (Early Summer): Monitor crops for aphid and whitefly vectors as temperature begins to rise.',
  4: 'May (Summer Peak): High heat alert! Install shade nets and maintain regular moisture to prevent blossom end rot.',
  5: 'June (Pre-Monsoon): Clean drainage channels around fields to prepare for heavy monsoon runoff.',
  6: 'July (Monsoon Peak): Severe Blight Risk! Check leaf undersides daily and apply copper-based protective sprays.',
  7: 'August (Late Monsoon): Maintain soil drainage. Remove waterlogged weeds which host spider mites and leaf mold.',
  8: 'September (Post-Monsoon): Inspect maturing fruit for bacterial spots. Harvest ripe fruit promptly.',
  9: 'October (Autumn Crop): Begin autumn potato tuber planting. Use certified disease-free seed tubers.',
  10: 'November (Early Winter): Monitor tomato plants for late blight as night humidity rises.',
  11: 'December (Winter Growth): Earthing up potato rows to cover growing tubers from sun scalding and pest exposure.'
};

export default function AdvisoryFeed({ weatherData }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto rotate tips every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + DAILY_TIPS.length) % DAILY_TIPS.length);
  };

  const currentMonthIndex = new Date().getMonth();
  const currentMonthAdvice = MONTHLY_ADVICE[currentMonthIndex] || MONTHLY_ADVICE[6];

  const tip = DAILY_TIPS[currentTipIndex];
  const isHighHumidity = (weatherData?.humidity ?? 75) > 80;

  return (
    <div className="glass-panel border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-850 pb-4">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Agronomic Intelligence</span>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Smart Advisory Feed
          </h3>
        </div>

        {/* Tip Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevTip}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Previous Tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-400 px-1">
            {currentTipIndex + 1}/{DAILY_TIPS.length}
          </span>
          <button
            onClick={handleNextTip}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Next Tip"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rotating Daily Tip Card */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
            {tip.category}
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
            <Lightbulb className="w-3 h-3 text-amber-400" /> Daily Tip
          </span>
        </div>
        <h4 className="text-sm font-bold text-white">{tip.title}</h4>
        <p className="text-xs text-gray-300 font-light leading-relaxed">
          {tip.text}
        </p>
      </div>

      {/* Seasonal Monthly Advice Card */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-teal-400 font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" /> Seasonal Guidelines
        </div>
        <p className="text-xs text-gray-300 font-light leading-relaxed">
          {currentMonthAdvice}
        </p>
      </div>

      {/* Disease Outbreak Warning Banner */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
        isHighHumidity 
          ? 'bg-red-500/10 border-red-500/30 text-red-300' 
          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      }`}>
        <AlertOctagon className={`w-5 h-5 shrink-0 mt-0.5 ${isHighHumidity ? 'text-red-400' : 'text-amber-400'}`} />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider block">
            {isHighHumidity ? 'CRITICAL OUTBREAK WARNING' : 'OUTBREAK ALERT MONITOR'}
          </span>
          <p className="font-light leading-relaxed text-[11px]">
            {isHighHumidity
              ? 'Humidity >80% elevates Phytophthora infestans (Late Blight) and Alternaria solani spore dispersion. Inspect crop stems immediately!'
              : 'Keep watchful eye on lower leaf undersides for early spots. Early detection saves up to 90% crop yield.'}
          </p>
        </div>
      </div>
    </div>
  );
}
