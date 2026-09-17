import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Calendar, Search, Filter, Info, X, FileSpreadsheet, FileText, 
  Download, Sprout, ShieldAlert, ShieldCheck, AlertTriangle, 
  Zap, Droplet, Sparkles, CheckCircle2, ChevronRight, Activity,
  Layers, Stethoscope, Clock, Maximize2, Minimize2, ExternalLink,
  Trash2
} from 'lucide-react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';
import { getFertilizerRecommendation, getDiseaseMedicalData } from '../data/fertilizerData';

export default function HistoryPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('all'); // 'all', 'fertilizer', 'medical'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('All');

  // Delete Handlers
  const handleDeleteRecord = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scan record from your history?')) return;
    
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedLog?.id === id) setSelectedLog(null);
      addToast('Scan record deleted successfully.', 'success');
    } catch (err) {
      addToast('Failed to delete scan record.', 'error');
    }
  };

  const handleClearAllHistory = async () => {
    if (!user?.id) return;
    if (history.length === 0) {
      addToast('Scan history is already empty.', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete ALL scan records? This action is permanent.')) return;
    
    try {
      await axios.delete(`/api/history/clear/${user.id}`);
      setHistory([]);
      setSelectedLog(null);
      addToast('All scan history cleared successfully.', 'success');
    } catch (err) {
      addToast('Failed to clear scan history.', 'error');
    }
  };

  // Fetch History
  useEffect(() => {
    if (!user?.id) return;
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/api/history/${user.id}`);
        setHistory(response.data);
      } catch (err) {
        addToast('Failed to load scan history.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?.id]);

  // Helper to infer Crop from class name with universal agricultural recognition
  const inferCrop = (diseaseName = '') => {
    if (!diseaseName) return 'Crop Plant';
    const clean = diseaseName.replace(/___/g, ' ').replace(/__/g, ' ').replace(/_/g, ' ').trim();
    const lower = clean.toLowerCase();

    const knownCrops = [
      'Cucumber', 'Tomato', 'Potato', 'Pepper Bell', 'Pepper', 'Corn', 'Maize', 
      'Apple', 'Grape', 'Rice', 'Wheat', 'Citrus', 'Orange', 'Lemon', 
      'Strawberry', 'Soybean', 'Cotton', 'Sugarcane', 'Banana', 'Coffee', 
      'Cabbage', 'Cauliflower', 'Eggplant', 'Brinjal', 'Squash', 'Watermelon', 
      'Onion', 'Garlic', 'Bean', 'Pea', 'Lettuce', 'Spinach', 'Mango', 'Papaya'
    ];

    for (const crop of knownCrops) {
      if (lower.startsWith(crop.toLowerCase()) || lower.includes(crop.toLowerCase())) {
        return crop === 'Pepper' ? 'Pepper Bell' : crop;
      }
    }

    // Fallback: take first word if capitalized
    const firstWord = clean.split(' ')[0];
    if (firstWord && firstWord.length > 2) {
      return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    }

    return 'Crop Plant';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatLabel = (label = '') => {
    return label.replace(/___/g, ' - ').replace(/__/g, ' - ').replace(/_/g, ' ');
  };

  // Handle Log Selection for Modal
  const handleViewDetails = async (log) => {
    setSelectedLog(log);
    setActiveModalTab('all');
    setIsFullscreen(false);
    
    // Instant fallback population
    const localMedical = getDiseaseMedicalData(log.disease_name);
    setDiseaseDetails(localMedical);
    setDetailsLoading(true);

    try {
      const response = await axios.get(`/api/disease/${encodeURIComponent(log.disease_name)}`);
      if (response.data && response.data.symptoms) {
        setDiseaseDetails(response.data);
      }
    } catch (err) {
      console.log('Using local robust agricultural database.');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Single Record PDF Download from modal
  const handleDownloadSinglePDF = (log) => {
    if (!log) return;
    const fert = getFertilizerRecommendation(log.disease_name);
    const med = diseaseDetails || getDiseaseMedicalData(log.disease_name);

    try {
      const doc = new jsPDF('portrait', 'pt', 'a4');

      // Header Banner
      doc.setFillColor(8, 12, 20);
      doc.rect(0, 0, 595, 80, 'F');

      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text('CROP DIAGNOSTIC PASSPORT & PRESCRIPTION', 40, 42);

      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      doc.text(`Farmer: ${user?.name || 'Valued Farmer'} | Date: ${formatDate(log.date)}`, 40, 62);

      // Section 1: Overview
      doc.setFontSize(14);
      doc.setTextColor(20, 20, 20);
      doc.text('1. Diagnostic Summary', 40, 110);

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Identified Condition: ${formatLabel(log.disease_name)}`, 40, 130);
      doc.text(`Crop Species: ${inferCrop(log.disease_name)}`, 40, 146);
      doc.text(`Diagnostic Confidence: ${log.confidence.toFixed(1)}%`, 40, 162);

      // Section 2: Fertilizer & Chemical Rx
      doc.setFontSize(14);
      doc.setTextColor(20, 20, 20);
      doc.text('2. Prescribed Nutrient & Chemical Regimen', 40, 195);

      const fertData = [
        ['Prescribed Formula', fert.recommendedFormula],
        ['Primary Fertilizer', fert.primaryFertilizer],
        ['Protective Fungicide/Spray', fert.fungicide],
        ['Dosage Instructions', fert.dosageNote],
        ['Application Method', fert.applicationMethod],
        ['Nitrogen Guideline', fert.nitrogenGuideline],
        ['Organic Alternative', fert.organicAlternative || 'Neem oil or bio-compost spray']
      ];

      autoTable(doc, {
        startY: 205,
        head: [['Parameter', 'Prescription Specification']],
        body: fertData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { fontSize: 9, cellPadding: 5 },
        columnStyles: { 0: { cellWidth: 140, fontStyle: 'bold' }, 1: { cellWidth: 375 } },
        margin: { left: 40, right: 40 }
      });

      // Section 3: Clinical Symptoms & Action
      const endY = doc.lastAutoTable.finalY + 25;
      doc.setFontSize(14);
      doc.setTextColor(20, 20, 20);
      doc.text('3. Clinical Pathology & Prevention Guide', 40, endY);

      const medData = [
        ['Symptoms', med.symptoms],
        ['Causes & Pathogen', med.causes],
        ['Prevention Guide', med.prevention],
        ['Treatment Protocol', med.treatment]
      ];

      autoTable(doc, {
        startY: endY + 10,
        head: [['Clinical Aspect', 'Pathology & Action Notes']],
        body: medData,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { fontSize: 9, cellPadding: 6 },
        columnStyles: { 0: { cellWidth: 140, fontStyle: 'bold' }, 1: { cellWidth: 375 } },
        margin: { left: 40, right: 40 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Smart Farm Diagnostics System`, 40, 820);
      }

      doc.save(`diagnostic_prescription_${log.id}_${Date.now()}.pdf`);
      addToast('Prescription PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Could not generate single prescription PDF.', 'error');
    }
  };

  // Bulk FARM REPORT PDF DOWNLOAD
  const handleDownloadPDF = () => {
    if (filteredHistory.length === 0) {
      addToast('No prediction history available to generate PDF report.', 'error');
      return;
    }

    try {
      const doc = new jsPDF('portrait', 'pt', 'a4');

      // Title Banner
      doc.setFillColor(8, 12, 20);
      doc.rect(0, 0, 595, 80, 'F');

      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text('SMART FARM DIAGNOSTICS & ADVISORY REPORT', 40, 45);

      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text(`Farmer: ${user?.name || 'Valued Farmer'} | Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 40, 65);

      // Summary Info Box
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(`Total Records: ${filteredHistory.length}`, 40, 105);
      
      const totalHealthy = filteredHistory.filter(h => h.disease_name.toLowerCase().includes('healthy')).length;
      doc.text(`Healthy Crops: ${totalHealthy} | Diseases Detected: ${filteredHistory.length - totalHealthy}`, 180, 105);

      const tableColumns = [
        { header: 'Date', dataKey: 'date' },
        { header: 'Crop', dataKey: 'crop' },
        { header: 'Disease / Condition', dataKey: 'disease' },
        { header: 'Confidence', dataKey: 'confidence' },
        { header: 'Treatment & Fertilizer Formula', dataKey: 'treatment' }
      ];

      const tableRows = filteredHistory.map(log => {
        const fert = getFertilizerRecommendation(log.disease_name);
        return {
          date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          crop: inferCrop(log.disease_name),
          disease: formatLabel(log.disease_name),
          confidence: `${log.confidence.toFixed(1)}%`,
          treatment: fert.recommendedFormula
        };
      });

      autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 120,
        theme: 'striped',
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 6
        },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 60 },
          2: { cellWidth: 120 },
          3: { cellWidth: 65 },
          4: { cellWidth: 200 }
        },
        margin: { left: 40, right: 40 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Smart Farm Crop Disease Detection System`, 40, 820);
      }

      doc.save(`farm_disease_report_${Date.now()}.pdf`);
      addToast('Farm PDF Report generated and downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
      addToast('Failed to generate PDF report.', 'error');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (history.length === 0) {
      addToast('No data to export.', 'error');
      return;
    }
    const headers = ['Date', 'Disease Class', 'Crop', 'Confidence', 'Recommended Fertilizer', 'Dosage'];
    const rows = filteredHistory.map(log => {
      const fert = getFertilizerRecommendation(log.disease_name);
      return [
        new Date(log.date).toISOString().split('T')[0],
        log.disease_name,
        inferCrop(log.disease_name),
        `${log.confidence.toFixed(1)}%`,
        `"${fert.recommendedFormula}"`,
        `"${fert.dosageNote}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agri_diagnostics_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Report downloaded successfully!', 'success');
  };

  // Filter Logic
  const filteredHistory = history.filter((log) => {
    const displayLabel = formatLabel(log.disease_name).toLowerCase();
    const matchesSearch = displayLabel.includes(searchTerm.toLowerCase());
    const matchesCrop = cropFilter === 'All' || inferCrop(log.disease_name) === cropFilter;
    const matchesDate = !dateFilter || new Date(log.date).toISOString().split('T')[0] === dateFilter;

    return matchesSearch && matchesCrop && matchesDate;
  });

  const selectedFert = selectedLog ? getFertilizerRecommendation(selectedLog.disease_name) : null;
  const isHealthyCrop = selectedLog ? selectedLog.disease_name.toLowerCase().includes('healthy') : false;

  // Available crops list derived dynamically from current history
  const uniqueCrops = Array.from(new Set(history.map(log => inferCrop(log.disease_name)).filter(Boolean)));
  const baseCrops = ['Tomato', 'Potato', 'Pepper Bell', 'Cucumber'];
  const allAvailableCrops = ['All', ...Array.from(new Set([...baseCrops, ...uniqueCrops]))];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Filters Header */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-1 flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by crop or disease name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white placeholder-gray-600 transition-all text-sm"
              />
            </div>

            {/* Crop Type Filter */}
            <div className="relative min-w-[160px]">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Filter className="w-4 h-4" />
              </span>
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-sm cursor-pointer appearance-none"
              >
                {allAvailableCrops.map(crop => (
                  <option key={crop} value={crop}>
                    {crop === 'All' ? 'All Crops' : crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker Filter */}
            <div className="relative min-w-[160px]">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons: PDF Report, CSV Export & Clear All */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold transition-all text-sm shadow-md shadow-emerald-950/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Download PDF Report
            </button>

            <button
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold border border-gray-800 transition-all text-sm cursor-pointer"
              title="Export Raw Data to CSV"
            >
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </button>

            <button
              onClick={handleClearAllHistory}
              disabled={history.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold border border-red-500/25 transition-all text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Clear entire scan history"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-gray-500 animate-pulse">Loading diagnostic scan history...</div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                <p className="font-medium text-md text-white mb-2">No scan records available</p>
                <p className="text-xs text-gray-500">Upload a crop photo on the Diagnostics page to generate new diagnoses.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-xs font-semibold uppercase bg-black/20">
                    <th className="px-6 py-4">Scan Date</th>
                    <th className="px-6 py-4">Crop Type</th>
                    <th className="px-6 py-4">Identified Condition</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4">Prescribed Fertilizer</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40 text-sm">
                  {filteredHistory.map((log) => {
                    const isHealthy = log.disease_name.toLowerCase().includes('healthy');
                    const fert = getFertilizerRecommendation(log.disease_name);
                    return (
                      <tr key={log.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                          {formatDate(log.date)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-300">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                            <Sprout className="w-3.5 h-3.5" />
                            {inferCrop(log.disease_name)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'}`} />
                            <span>{formatLabel(log.disease_name)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                          {log.confidence.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-300 max-w-[220px]">
                          <span className="truncate block" title={fert.recommendedFormula}>
                            {fert.recommendedFormula}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(log)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-semibold text-xs cursor-pointer shadow-sm hover:scale-105"
                              title="Open Full Disease & Fertilizer Passport"
                            >
                              <Info className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={(e) => handleDeleteRecord(log.id, e)}
                              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer hover:scale-105"
                              title="Delete this record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Portal-Mounted Comprehensive Details Modal */}
        {selectedLog && createPortal(
          <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center items-start">
            <div className="relative w-full max-w-4xl my-auto sm:my-8 bg-[#0c1018] border border-gray-700/80 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* TOP HEADER */}
              <div className="px-6 py-4 border-b border-gray-800 bg-[#090d14] flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-2xl shrink-0 ${isHealthyCrop ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                    {isHealthyCrop ? <ShieldCheck className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Diagnostic & Treatment Passport</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-300">ID #{selectedLog.id}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                      {formatLabel(selectedLog.disease_name)}
                    </h2>
                  </div>
                </div>

                {/* Modal Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadSinglePDF(selectedLog)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Export Single Prescription PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export PDF</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteRecord(selectedLog.id, e)}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Delete this record"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>

                  <button
                    onClick={() => setSelectedLog(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-gray-700 transition-all cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* TABS SELECTOR */}
              <div className="px-6 pt-3 border-b border-gray-800 bg-[#0e131d] flex gap-4 text-sm overflow-x-auto">
                <button
                  onClick={() => setActiveModalTab('all')}
                  className={`pb-3 font-semibold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                    activeModalTab === 'all' 
                      ? 'text-emerald-400 border-emerald-400' 
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  Complete Overview & Details
                </button>
                <button
                  onClick={() => setActiveModalTab('fertilizer')}
                  className={`pb-3 font-semibold transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                    activeModalTab === 'fertilizer' 
                      ? 'text-emerald-400 border-emerald-400' 
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5" /> Fertilizers & Fungicides
                </button>
                <button
                  onClick={() => setActiveModalTab('medical')}
                  className={`pb-3 font-semibold transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                    activeModalTab === 'medical' 
                      ? 'text-emerald-400 border-emerald-400' 
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Symptoms & Pathology
                </button>
              </div>

              {/* MODAL MAIN CONTENT */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Horizontal Snapshot Card */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-gray-800 flex flex-col md:flex-row items-center gap-5">
                  <div className="relative w-full md:w-36 h-36 rounded-2xl overflow-hidden border border-gray-700 shrink-0 bg-black/40">
                    <img
                      src={`${API_BASE_URL}/${selectedLog.image_path}`}
                      alt="Diagnosed Leaf"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300/10b981/ffffff?text=Crop+Scan';
                      }}
                    />
                    <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                      {selectedLog.confidence.toFixed(1)}% Match
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                    <div className="p-3 rounded-xl bg-[#090d14] border border-gray-800/80">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Target Crop</span>
                      <span className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Sprout className="w-4 h-4 text-emerald-400" />
                        {inferCrop(selectedLog.disease_name)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#090d14] border border-gray-800/80">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">AI Confidence</span>
                      <span className="text-base font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <Activity className="w-4 h-4 text-teal-400" />
                        {selectedLog.confidence.toFixed(1)}%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#090d14] border border-gray-800/80 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Scan Date</span>
                      <span className="text-xs font-medium text-gray-300 block mt-1">
                        {formatDate(selectedLog.date)}
                      </span>
                    </div>

                    <div className={`col-span-2 sm:col-span-3 p-3 rounded-xl border flex items-center justify-between gap-2 ${
                      isHealthyCrop 
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                        : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                    }`}>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                        {isHealthyCrop ? <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                        <span>Action Priority: {selectedFert.actionPriority || (isHealthyCrop ? 'Standard Care' : 'Action Required')}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/40 border border-white/10 whitespace-nowrap">
                        {isHealthyCrop ? 'Health: Optimal' : 'Active Treatment'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FERTILIZER & CHEMICAL PRESCRIPTION */}
                {(activeModalTab === 'all' || activeModalTab === 'fertilizer') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <h3 className="flex items-center gap-2 text-emerald-400 font-bold text-base uppercase tracking-wider">
                        <Droplet className="w-5 h-5 text-emerald-400" /> 
                        Prescribed Fertilizer & Nutrient Protocols
                      </h3>
                      <span className="text-xs text-gray-500">Agronomic Prescription</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Prescribed Formula */}
                      <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Recommended Formula Blend</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Priority Blend</span>
                        </div>
                        <p className="text-base font-bold text-white leading-snug">
                          {selectedFert.recommendedFormula}
                        </p>
                        <p className="text-xs text-gray-300 font-light leading-relaxed pt-1">
                          {selectedFert.applicationMethod}
                        </p>
                      </div>

                      {/* Primary Fertilizer & Exact Dosage */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800 space-y-2">
                        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                          Primary Fertilizer & Exact Dosage
                        </span>
                        <p className="text-sm font-semibold text-white">
                          {selectedFert.primaryFertilizer}
                        </p>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-gray-800 text-xs text-gray-300 font-mono">
                          <strong className="text-teal-400">Dosage:</strong> {selectedFert.dosageNote}
                        </div>
                      </div>

                      {/* Fungicide & Protective Chemicals */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800 space-y-2">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                          Fungicide / Bactericide Prescription
                        </span>
                        <p className="text-sm font-semibold text-white">
                          {selectedFert.fungicide}
                        </p>
                        <div className="text-xs text-gray-400 bg-white/[0.02] p-2.5 rounded-xl border border-gray-800/80">
                          🌱 <strong className="text-gray-300">Organic Alternative:</strong> {selectedFert.organicAlternative || 'Cold-pressed Neem seed oil + compost tea drench.'}
                        </div>
                      </div>

                      {/* Nitrogen Management Warning */}
                      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Nitrogen Management Guideline
                        </span>
                        <p className="text-xs text-gray-300 leading-relaxed font-light">
                          {selectedFert.nitrogenGuideline}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CLINICAL MEDICAL & SYMPTOMS SHEET */}
                {(activeModalTab === 'all' || activeModalTab === 'medical') && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <h3 className="flex items-center gap-2 text-cyan-400 font-bold text-base uppercase tracking-wider">
                        <Stethoscope className="w-5 h-5 text-cyan-400" /> 
                        Clinical Symptoms & Pathology Dossier
                      </h3>
                      <span className="text-xs text-gray-500">Disease Diagnostics</span>
                    </div>

                    {detailsLoading ? (
                      <div className="py-12 text-center text-gray-500 animate-pulse text-sm">
                        Loading detailed disease medical sheets...
                      </div>
                    ) : diseaseDetails ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Symptoms */}
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800 space-y-2">
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" /> Observed Clinical Symptoms
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                            {diseaseDetails.symptoms}
                          </p>
                        </div>

                        {/* Causes */}
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800 space-y-2">
                          <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-4 h-4" /> Pathogen & Environmental Triggers
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                            {diseaseDetails.causes}
                          </p>
                        </div>

                        {/* Prevention */}
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800 space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" /> Agronomic Prevention Practices
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                            {diseaseDetails.prevention}
                          </p>
                        </div>

                        {/* Treatment */}
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800 space-y-2">
                          <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Zap className="w-4 h-4" /> Curative Treatment & Action Protocol
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                            {diseaseDetails.treatment}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-xs bg-white/[0.02] rounded-2xl border border-gray-800">
                        Maintain standard cultural practices, monitor soil moisture, and avoid overhead sprinkler splash.
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* BOTTOM FOOTER */}
              <div className="px-6 py-4 border-t border-gray-800 bg-[#090d14] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Smart Farm Diagnostics Engine &bull; AI Plant Pathology v2.0</span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownloadSinglePDF(selectedLog)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
                  >
                    <FileText className="w-4 h-4" /> Download Diagnostic PDF
                  </button>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>,
          document.body
        )}
      </div>
    </DashboardLayout>
  );
}
