import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Cloud, CloudRain, Thermometer, Droplets, ShieldAlert, Search, 
  RefreshCw, Key, Info, MapPin, Sparkles, Calendar, CheckCircle2, XCircle, X, Bot 
} from 'lucide-react';
import { fetchCurrentWeather, fetchWeatherByCoords } from '../services/weatherAdvisoryService';

export default function WeatherAdvisoryCard({ onWeatherUpdate }) {
  const [city, setCity] = useState('New Delhi');
  const [searchCity, setSearchCity] = useState('New Delhi');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  // Gemini 7-Day Spray Schedule State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedDisease, setSelectedDisease] = useState('Early Blight');
  const [sprayPlan, setSprayPlan] = useState(null);

  const loadWeather = async (targetCity, keyToUse) => {
    setLoading(true);
    try {
      const data = await fetchCurrentWeather(targetCity, keyToUse);
      setWeather(data);
      if (onWeatherUpdate) {
        onWeatherUpdate(data);
      }
    } catch (err) {
      console.error('Error in WeatherAdvisoryCard load:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherCoords = async (lat, lon, keyToUse) => {
    setLoading(true);
    try {
      const data = await fetchWeatherByCoords(lat, lon, keyToUse);
      setWeather(data);
      if (data && data.city) {
        setCity(data.city);
        setSearchCity(data.city);
      }
      if (onWeatherUpdate) {
        onWeatherUpdate(data);
      }
    } catch (err) {
      console.error('Error loading coordinate weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        loadWeatherCoords(position.coords.latitude, position.coords.longitude, apiKey);
      },
      (error) => {
        setLocating(false);
        console.error('Error fetching GPS coordinates:', error);
        alert('Could not retrieve your exact location. Falling back to default city search.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeatherCoords(position.coords.latitude, position.coords.longitude, apiKey);
        },
        () => {
          loadWeather(city, apiKey);
        }
      );
    } else {
      loadWeather(city, apiKey);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      loadWeather(searchCity.trim(), apiKey);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    loadWeather(city, apiKey);
    setShowKeyInput(false);
  };

  const handleGenerateSprayPlan = async () => {
    setShowPlanModal(true);
    setPlanLoading(true);
    try {
      const response = await axios.post('/api/gemini/weather-plan', {
        crop_name: selectedCrop,
        disease_name: selectedDisease,
        weather_data: {
          temp: `${weather?.temp || 28}°C`,
          humidity: `${weather?.humidity || 75}%`,
          condition: weather?.condition || 'Clear',
          forecast: weather?.advisory || 'Normal weather conditions'
        }
      });
      setSprayPlan(response.data);
    } catch (err) {
      console.error('Error fetching spray plan:', err);
    } finally {
      setPlanLoading(false);
    }
  };

  if (loading && !weather) {
    return (
      <div className="glass-panel border border-emerald-500/20 rounded-3xl p-6 md:p-8 animate-pulse flex items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-3 text-emerald-400 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" /> Fetching Live Weather & Crop Risk Telemetry...
        </div>
      </div>
    );
  }

  const risk = weather?.risk || { level: 'Medium Risk', badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };

  return (
    <div className="glass-panel border border-emerald-500/20 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden bg-gradient-to-br from-emerald-950/20 via-[#0a0f18] to-teal-950/20 shadow-xl">
      {/* Header & City Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-850 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-wider">Smart Farm Weather Telemetry</span>
            {weather?.isMock && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Demo Advisor Mode
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            {weather?.city}{weather?.country ? `, ${weather.country}` : ''}
          </h3>
        </div>

        {/* Location Input Box & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <label htmlFor="city-input" className="block text-[11px] text-gray-400 font-semibold mb-1">
              Select/Type Your City:
            </label>
            <div className="relative">
              <input
                id="city-input"
                type="text"
                placeholder="Enter city name..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-[#0f141f] border border-gray-800 focus:border-emerald-500/60 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3.5 pointer-events-none" />
              <button type="submit" className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-white">
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : '→'}
              </button>
            </div>
          </form>

          <div className="flex gap-2 self-end sm:self-center mt-4 sm:mt-0">
            <button
              onClick={handleDetectLocation}
              disabled={locating}
              type="button"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-emerald-400 border border-gray-800 transition-all text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Detect Exact Location via GPS"
            >
              {locating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span className="sm:hidden lg:inline">Locate</span>
            </button>

            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              type="button"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-emerald-400 border border-gray-800 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="Configure OpenWeatherMap API Key"
            >
              <Key className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Key Modal/Collapsible */}
      {showKeyInput && (
        <form onSubmit={handleSaveApiKey} className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3 animate-fade-in-up">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" /> OpenWeatherMap API Key
            </span>
            <span className="text-gray-400 font-mono text-[11px]">Free Tier Key</span>
          </div>
          <input
            type="password"
            placeholder="Paste OpenWeather API Key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-[#080c14] border border-gray-800 focus:border-emerald-500 rounded-xl text-xs text-white focus:outline-none"
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowKeyInput(false)}
              className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              Apply Key
            </button>
          </div>
        </form>
      )}

      {/* Main Weather Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">Temperature</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{weather?.temp}°C</h4>
            <p className="text-[11px] text-gray-500">Current Temp</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">Relative Humidity</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{weather?.humidity}%</h4>
            <p className="text-[11px] text-gray-500">Air Moisture</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">Condition</p>
            <h4 className="text-2xl font-black text-white mt-0.5 capitalize">{weather?.condition}</h4>
            <p className="text-[11px] text-gray-500">Sky State</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            risk.color === 'red' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
            risk.color === 'yellow' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
            'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">Disease Risk</p>
            <h4 className={`text-2xl font-black mt-0.5 ${
              risk.color === 'red' ? 'text-red-400' :
              risk.color === 'yellow' ? 'text-yellow-400' :
              'text-emerald-400'
            }`}>{risk.level}</h4>
            <p className="text-[11px] text-gray-500">Microclimate Index</p>
          </div>
        </div>
      </div>

      {/* Dynamic Weather Advisory Message + Gemini Action Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/25">
        <div className="flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Real-Time Agro-Advisory</span>
            <p className="text-gray-300 font-light leading-relaxed">
              {weather?.advisory}
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateSprayPlan}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI 7-Day Spray Plan</span>
        </button>
      </div>

      {/* Gemini 7-Day Spray Schedule Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    7-Day Weather-Smart Spray Plan
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold rounded border border-emerald-500/30">
                      Smart AI Precision
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">Personalized for {city} ({weather?.temp}°C, {weather?.humidity}% humidity)</p>
                </div>
              </div>

              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Crop/Disease Selection Bar */}
            <div className="px-6 py-3 bg-slate-950/70 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Crop:</span>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="bg-slate-900 border border-gray-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Pepper Bell">Pepper Bell</option>
                  <option value="Apple">Apple</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Target Disease:</span>
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="bg-slate-900 border border-gray-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Early Blight">Early Blight</option>
                  <option value="Late Blight">Late Blight</option>
                  <option value="Bacterial Spot">Bacterial Spot</option>
                  <option value="Leaf Mold">Leaf Mold</option>
                  <option value="General Prevention">General Prevention (Healthy)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateSprayPlan}
                disabled={planLoading}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {planLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Regenerate</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
              {planLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-10 h-10 rounded-full border-4 border-emerald-500/25 border-t-emerald-400 animate-spin" />
                  <p className="text-sm font-semibold text-white">Analyzing temperature, dew point, and humidity forecasts...</p>
                  <p className="text-xs text-gray-400">Generating precision chemical & organic spray calendar.</p>
                </div>
              )}

              {!planLoading && sprayPlan && (
                <>
                  {/* Summary Callout */}
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Urgency Assessment</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded">
                        {sprayPlan.spray_urgency || 'Normal'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-light">
                      {sprayPlan.risk_assessment}
                    </p>
                  </div>

                  {/* 7-Day Day Cards */}
                  <div className="space-y-2.5">
                    {sprayPlan.schedule?.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-2xl border transition-all ${
                          item.can_spray 
                            ? 'bg-slate-850/80 border-emerald-500/25 hover:border-emerald-500/40' 
                            : 'bg-slate-900/60 border-rose-500/20 hover:border-rose-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {item.day}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            item.can_spray 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {item.can_spray ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {item.can_spray ? 'Safe to Spray' : 'Do Not Spray'}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-100">{item.action}</p>
                        <p className="text-[11px] text-gray-400 mt-1 leading-normal">{item.reason}</p>
                        {item.caution && (
                          <p className="text-[10px] text-amber-300/80 mt-1 flex items-center gap-1 font-mono">
                            ⚠️ {item.caution}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Golden Rule Note */}
                  {sprayPlan.key_takeaway && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-gray-800 text-xs text-gray-300 flex items-start gap-2">
                      <Bot className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Key Rule for this week:</strong> {sprayPlan.key_takeaway}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
