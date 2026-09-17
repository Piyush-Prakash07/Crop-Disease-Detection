import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Upload, Cpu, Save, RefreshCw, Sparkles, Check, ArrowLeft, Sprout, 
  AlertTriangle, ShieldCheck, Zap, Bot, FileText, CheckCircle2, 
  HelpCircle, Eye, Activity, ShieldAlert, HeartHandshake, Download
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';
import AgriChatbot from '../components/AgriChatbot';
import { getFertilizerRecommendation } from '../data/fertilizerData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function PredictionPage() {
  const { addToast } = useToast();
  const location = useLocation();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // New Gemini controls
  const [diagnosisMode, setDiagnosisMode] = useState('hybrid'); // 'hybrid', 'gemini', 'local'
  const [cropHint, setCropHint] = useState('');
  const [activeTab, setActiveTab] = useState('organic'); // 'organic', 'chemical', 'prevention'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);

  // Load file passed from Dashboard redirect
  useEffect(() => {
    if (location.state?.selectedFile) {
      const selectedFile = location.state.selectedFile;
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setSaved(false);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      addToast('Please upload or browse a crop leaf photo first.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);
    setSaved(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', diagnosisMode);
    if (cropHint) formData.append('crop_hint', cropHint);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      
      // Setup context for AgriDoctor AI
      if (response.data?.gemini_analysis) {
        setChatContext(response.data.gemini_analysis);
      } else {
        setChatContext({
          crop_name: response.data.disease_details?.crop_type || 'Crop',
          disease_detected: response.data.disease_name,
          confidence_score: response.data.confidence
        });
      }

      addToast('Diagnosis completed with AI Precision Analysis!', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Diagnosis failed. Try a clearer image.';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!result) return;

    setSaveLoading(true);
    try {
      await axios.post('/api/history', {
        image_path: result.image_path,
        disease_name: result.disease_name,
        confidence: result.confidence
      });
      setSaved(true);
      addToast('Diagnosis saved to history successfully!', 'success');
    } catch (err) {
      addToast('Failed to save to history.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Download Comprehensive Prescription PDF
  const handleDownloadPrescription = () => {
    if (!result) return;

    const doc = new jsPDF();
    const gAnalysis = result.gemini_analysis;

    // Header
    doc.setFillColor(16, 185, 129); // Emerald
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('🌱 CROP DISEASE DIAGNOSIS & PRESCRIPTION REPORT', 14, 15);

    // Metadata
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Diagnosed Crop: ${gAnalysis?.crop_name || result.disease_details?.crop_type || 'Plant Leaf'}`, 14, 38);
    doc.text(`Condition / Disease: ${gAnalysis?.disease_detected || formatLabel(result.disease_name)}`, 14, 44);
    doc.text(`Confidence: ${result.confidence?.toFixed(1) || 95}%`, 130, 32);
    doc.text(`Severity: ${gAnalysis?.severity || 'Moderate'}`, 130, 38);
    doc.text(`Stage: ${gAnalysis?.stage || 'Active'}`, 130, 44);

    let currentY = 52;

    // Agronomist Note
    if (gAnalysis?.agronomist_doctor_note) {
      doc.setFillColor(240, 253, 244);
      doc.rect(14, currentY, 182, 18, 'F');
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const lines = doc.splitTextToSize(`Agronomist Note: "${gAnalysis.agronomist_doctor_note}"`, 175);
      doc.text(lines, 18, currentY + 6);
      currentY += 24;
    }

    // Organic Treatments Table
    if (gAnalysis?.organic_treatments && gAnalysis.organic_treatments.length > 0) {
      doc.autoTable({
        startY: currentY,
        head: [['🌿 Organic & Biological Remedies']],
        body: gAnalysis.organic_treatments.map(item => [item]),
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 }
      });
      currentY = doc.lastAutoTable.finalY + 8;
    }

    // Chemical Treatments Table
    if (gAnalysis?.chemical_treatments && gAnalysis.chemical_treatments.length > 0) {
      doc.autoTable({
        startY: currentY,
        head: [['💊 Chemical Fungicide / Protective Protocol']],
        body: gAnalysis.chemical_treatments.map(item => [item]),
        headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 }
      });
      currentY = doc.lastAutoTable.finalY + 8;
    }

    // Prevention Table
    if (gAnalysis?.preventive_measures && gAnalysis.preventive_measures.length > 0) {
      doc.autoTable({
        startY: currentY,
        head: [['🛡️ Preventive Farm Management Tips']],
        body: gAnalysis.preventive_measures.map(item => [item]),
        headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 }
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by Crop Disease Detection & Agro-Advisory System powered by Smart Multimodal AI', 14, 285);

    doc.save(`Crop_Diagnosis_Prescription_${Date.now()}.pdf`);
    addToast('Prescription PDF downloaded successfully!', 'success');
  };

  const formatLabel = (label) => {
    if (!label) return '';
    return label.replace(/___/g, ' - ').replace(/_/g, ' ');
  };

  const fertilizerRec = result ? getFertilizerRecommendation(result.disease_name) : null;
  const gAnalysis = result?.gemini_analysis;

  // Severity color badge helper
  const getSeverityBadge = (severity) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('none') || s.includes('healthy')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">🌿 Healthy Plant</span>;
    }
    if (s.includes('mild') || s.includes('early')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">⚠️ Mild Severity</span>;
    }
    if (s.includes('moderate') || s.includes('mid')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">⚡ Moderate Outbreak</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">🚨 Severe / Urgent</span>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-16">
        {/* Header Back Link & Actions */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-sm font-semibold text-gray-400 hover:text-emerald-400 flex items-center gap-1.5 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AgriDoctor AI</span>
          </button>
        </div>

        {/* Mode Selector Card */}
        <div className="glass-panel border border-gray-800 rounded-2xl p-4 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-teal-950/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-white">AI Diagnostic Engine</h4>
              <p className="text-xs text-gray-400">Choose precision vision mode for image analysis</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDiagnosisMode('hybrid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                diagnosisMode === 'hybrid'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-900/30 border border-emerald-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-gray-800'
              }`}
            >
              🔬 Hybrid Mode (Local + Smart AI)
            </button>
            <button
              onClick={() => setDiagnosisMode('gemini')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                diagnosisMode === 'gemini'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-900/30 border border-teal-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-gray-800'
              }`}
            >
              🌟 Smart Vision AI Only
            </button>
            <button
              onClick={() => setDiagnosisMode('local')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                diagnosisMode === 'local'
                  ? 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-md border border-gray-500'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-gray-800'
              }`}
            >
              ⚡ Local CNN Model
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Upload and Settings (5 cols) */}
          <div className="md:col-span-5 glass-panel border border-gray-800 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-white text-lg flex items-center justify-between">
              <span>Leaf Photo Upload</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                HD Vision Scan
              </span>
            </h3>

            {/* Optional Crop Hint */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center justify-between">
                <span>Crop Type (Optional)</span>
                <span className="text-[10px] text-gray-500">Improves accuracy</span>
              </label>
              <select
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Auto-Detect (Any Plant / Crop)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Pepper Bell">Pepper Bell / Capsicum (शिमला मिर्च)</option>
                <option value="Apple">Apple (सेब)</option>
                <option value="Corn">Corn / Maize (मक्का)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Rice">Rice / Paddy (धान)</option>
                <option value="Cotton">Cotton (कपास)</option>
              </select>
            </div>

            {/* Preview Box */}
            <div className="relative aspect-square w-full rounded-2xl border border-gray-850 bg-black/20 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              {preview ? (
                <>
                  <img src={preview} alt="Leaf Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-emerald-400 font-semibold border border-emerald-500/30">
                    Photo Loaded
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">No Leaf Photo Selected</p>
                    <p className="text-xs text-gray-500 max-w-[200px] mx-auto leading-normal">
                      Click browse below to upload a crop leaf picture.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-800 hover:border-emerald-500/30 text-gray-300 font-semibold text-xs transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-center">
                Browse Photo
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                onClick={handlePredict}
                disabled={loading || !file}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-950/20 hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" /> Run AI Scan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Diagnosis Result Details (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            {/* Loading Placeholder */}
            {loading && (
              <div className="glass-panel border border-gray-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-500/25 border-t-emerald-400 animate-spin" />
                <div>
                  <h4 className="font-bold text-white text-md">Consulting Smart Multimodal Pathology Engine</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[280px] leading-normal mx-auto">
                    Analyzing leaf discoloration, lesion geometry, fungal mycelium, and pathogen signature...
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !result && (
              <div className="glass-panel border border-gray-850 rounded-3xl p-12 text-center text-gray-500 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-500/10 border border-gray-500/20 flex items-center justify-center text-gray-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-md">Diagnostics Terminal</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[260px] mx-auto leading-normal">
                    Select a leaf picture and run a diagnostic scan to see AI-graded pathology and cure prescriptions.
                  </p>
                </div>
              </div>
            )}

            {/* Prediction Result Display */}
            {!loading && result && (
              <div className="space-y-6">
                {/* 1. Main Diagnosis Header Banner */}
                <div className="glass-panel border border-emerald-500/30 rounded-3xl p-6 bg-gradient-to-br from-emerald-950/25 via-[#0b0f19] to-teal-950/20 space-y-4 shadow-xl shadow-emerald-950/10">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                          {gAnalysis?.crop_name ? `${gAnalysis.crop_name} Diagnosis` : 'Classification Result'}
                        </span>
                        {gAnalysis?.severity && getSeverityBadge(gAnalysis.severity)}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white mt-1.5 tracking-tight">
                        {gAnalysis?.disease_detected || formatLabel(result.disease_name)}
                      </h3>
                      {gAnalysis?.stage && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-teal-400" />
                          Stage: <strong className="text-white">{gAnalysis.stage}</strong>
                          {gAnalysis.affected_part && ` • Affected Part: ${gAnalysis.affected_part}`}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadPrescription}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer"
                        title="Download PDF Prescription"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>

                      <button
                        onClick={handleSaveToHistory}
                        disabled={saved || saveLoading}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          saved 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default' 
                            : 'bg-white/5 border-gray-800 hover:border-emerald-500/30 text-gray-300 hover:text-white cursor-pointer active:translate-y-[1px]'
                        }`}
                      >
                        {saveLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : saved ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Save Log
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Diagnostic Certainty Score</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {(gAnalysis?.confidence_score || result.confidence || 95).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-gray-900">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000"
                        style={{ width: `${gAnalysis?.confidence_score || result.confidence || 95}%` }}
                      />
                    </div>
                  </div>

                  {/* Agronomist Doctor Quote Banner */}
                  {gAnalysis?.agronomist_doctor_note && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/25 flex items-start gap-3">
                      <Bot className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                          Doctor's Executive Summary
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-light">
                          "{gAnalysis.agronomist_doctor_note}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Visual Symptoms Observed */}
                {gAnalysis?.symptoms_observed && gAnalysis.symptoms_observed.length > 0 && (
                  <div className="glass-panel border border-gray-800 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-400" />
                      Pathological Symptoms Identified
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {gAnalysis.symptoms_observed.map((sym, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <span>{sym}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Tabbed Treatment Prescription (Organic / Chemical / Prevention) */}
                {gAnalysis && (
                  <div className="glass-panel border border-teal-500/30 rounded-3xl p-6 space-y-5 bg-gradient-to-br from-teal-950/15 via-[#0a0e17] to-emerald-950/20">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('organic')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === 'organic'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          🌿 Organic Remedies ({gAnalysis.organic_treatments?.length || 0})
                        </button>
                        <button
                          onClick={() => setActiveTab('chemical')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === 'chemical'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          💊 Chemical Guide ({gAnalysis.chemical_treatments?.length || 0})
                        </button>
                        <button
                          onClick={() => setActiveTab('prevention')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === 'prevention'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          🛡️ Prevention ({gAnalysis.preventive_measures?.length || 0})
                        </button>
                      </div>

                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <Bot className="w-3.5 h-3.5" /> Ask AI Clarifications →
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-3">
                      {activeTab === 'organic' && (
                        <div className="space-y-2.5">
                          <p className="text-[11px] text-emerald-300/80 font-medium">
                            Eco-friendly, biological, and zero-residue management treatments:
                          </p>
                          {gAnalysis.organic_treatments?.map((item, idx) => (
                            <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <p className="leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'chemical' && (
                        <div className="space-y-2.5">
                          <p className="text-[11px] text-teal-300/80 font-medium">
                            Targeted active ingredients and protective spraying protocol:
                          </p>
                          {gAnalysis.chemical_treatments?.map((item, idx) => (
                            <div key={idx} className="p-3 bg-teal-950/20 border border-teal-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-slate-200">
                              <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                              <p className="leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'prevention' && (
                        <div className="space-y-2.5">
                          <p className="text-[11px] text-cyan-300/80 font-medium">
                            Long-term agronomic practices to avoid recurrence:
                          </p>
                          {gAnalysis.preventive_measures?.map((item, idx) => (
                            <div key={idx} className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-slate-200">
                              <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <p className="leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Fallback / Database Knowledge Card (if Gemini unavailable or local mode) */}
                {!gAnalysis && result.disease_details && (
                  <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-5">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-emerald-500 rounded-full" /> Symptoms
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">
                        {result.disease_details.symptoms}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-teal-500 rounded-full" /> Recommended Treatment
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">
                        {result.disease_details.treatment}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded / Global AgriDoctor AI Chatbot */}
      <AgriChatbot 
        currentContext={chatContext} 
        isOpenDefault={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </DashboardLayout>
  );
}
