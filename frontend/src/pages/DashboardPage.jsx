import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Upload, ScanLine, ArrowUpRight, Calendar, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';

// Advisory Components
import WeatherAdvisoryCard from '../components/WeatherAdvisoryCard';
import DiseaseRiskMeter from '../components/DiseaseRiskMeter';
import AdvisoryFeed from '../components/AdvisoryFeed';
import FarmAnalytics from '../components/FarmAnalytics';

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/api/history/${user.id}`);
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to fetch user prediction history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?.id]);

  // Handle Drag & Drop Upload Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file.', 'error');
      return;
    }
    navigate('/predict', { state: { selectedFile: file } });
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatLabel = (label) => {
    return label.replace(/___/g, ' - ').replace(/_/g, ' ');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in-up">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-950/30 to-emerald-950/40 border border-emerald-500/20 p-6 md:p-8">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout className="w-3.5 h-3.5" /> Smart Agriculture Advisory Center
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {user?.name}!</h2>
            <p className="text-gray-300 max-w-xl text-sm font-light">
              Real-time weather monitoring, disease outbreak prediction meters, smart advisories, and diagnostic analytics for optimal crop yields.
            </p>
          </div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
            <ScanLine className="w-44 h-44 text-emerald-400" />
          </div>
        </div>

        {/* 1. WEATHER ADVISORY SECTION */}
        <WeatherAdvisoryCard onWeatherUpdate={setCurrentWeather} />

        {/* 4 & 5. DISEASE RISK METER + ADVISORY FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DISEASE RISK METER */}
          <DiseaseRiskMeter weatherData={currentWeather} />

          {/* ADVISORY FEED */}
          <AdvisoryFeed weatherData={currentWeather} />
        </div>

        {/* 3. FARM ANALYTICS DASHBOARD */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full" /> Farm Analytics Dashboard
          </h3>
          <FarmAnalytics history={history} />
        </div>

        {/* Drag and Drop Zone */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full" /> Automated Leaf Health Diagnosis
          </h3>
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass-panel border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-4 transition-all ${
              dragActive 
                ? 'border-emerald-400 bg-emerald-950/20 scale-[0.99]' 
                : 'border-gray-800 hover:border-emerald-500/30'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Drag and drop crop leaf photo here</h3>
              <p className="text-xs text-gray-400 font-light max-w-sm mx-auto">
                Supports Tomato, Potato, and Pepper Bell leaves (JPEG, PNG, WEBP). Evaluated instantly with plant pathology AI.
              </p>
            </div>
            <div>
              <label className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950/20 cursor-pointer inline-block">
                Browse Leaf File
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-black/10">
            <h3 className="font-bold text-white text-md">Recent Diagnostic Logs</h3>
            <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-all">
              View All Logs <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading recent history...</div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center text-gray-500 space-y-2">
                <p>No diagnostics ran yet.</p>
                <Link to="/predict" className="text-emerald-400 hover:underline text-sm font-semibold">Analyze your first plant leaf</Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-xs font-semibold uppercase">
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Crop / Condition Name</th>
                    <th className="px-6 py-3.5 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-sm">
                  {history.slice(0, 5).map((log) => {
                    const isHealthy = log.disease_name.toLowerCase().includes('healthy');
                    return (
                      <tr key={log.id} className="hover:bg-white/5 transition-all">
                        <td className="px-6 py-4 text-gray-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4 opacity-60" /> {formatDate(log.date)}
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${isHealthy ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {formatLabel(log.disease_name)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-emerald-400 font-semibold">
                          {log.confidence.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
