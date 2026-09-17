import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BarChart3, Database, Trash2, Edit, Plus, X, Search, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminPanelPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [diseasesList, setDiseasesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'diseases'

  // Modal control states
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDiseaseId, setCurrentDiseaseId] = useState(null);

  // Form states for disease add/edit
  const [diseaseName, setDiseaseName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [causes, setCauses] = useState('');
  const [prevention, setPrevention] = useState('');
  const [treatment, setTreatment] = useState('');
  const [cropType, setCropType] = useState('');

  // Searches
  const [userSearch, setUserSearch] = useState('');
  const [diseaseSearch, setDiseaseSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, diseasesRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/disease/all').catch(() => axios.get('/api/admin/stats')) // Fallback if list endpoint varies
      ]);
      
      setStats(statsRes.data);
      setUsersList(usersRes.data);
      
      // Let's get diseases directly from stats or fetch them
      // Since we don't have a direct GET /api/disease endpoint that returns a list,
      // let's fetch all diseases. Wait, we did not specify a GET /api/disease/all endpoint in requirements.
      // But we can fetch it, or query the disease endpoint individually, or list from backend database using a general endpoint.
      // Wait, is there a GET endpoint for all diseases in the API specs?
      // The API specs list:
      // GET  /api/disease/{disease_name}
      // Let's check! If we don't have a GET /api/disease/all, we can create one in the backend or implement it.
      // Ah! We did define CRUD methods in `crud.py` for `get_all_diseases`!
      // In `main.py`, did we create an endpoint to GET all diseases?
      // Let's check `main.py`. In `main.py` we did not define a `GET /api/disease` or `GET /api/disease/all` endpoint!
      // Wait! We can easily add one if needed, or check if we can list diseases.
      // Oh! In `main.py` we didn't add the `GET /api/disease` endpoint.
      // Wait, let's verify if we need `GET /api/disease` or `GET /api/admin/disease`?
      // In the backend main.py we can easily add a `GET /api/disease` endpoint.
      // Let's add it! It will return `crud.get_all_diseases(db)`.
      // Let's inspect `main.py` again. In `main.py` we didn't define it. We should update `main.py` to add `GET /api/admin/diseases` or `GET /api/disease`.
      // Let's make sure our AdminPanelPage can call it. Let's call `/api/disease` or `/api/admin/diseases`.
      // Let's write the code for AdminPanelPage first, assuming `/api/admin/stats` and `/api/admin/users` and `/api/admin/diseases` are available. We will update `main.py` to add the diseases list endpoint!

    } catch (err) {
      console.error(err);
      addToast('Error fetching dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      // We will make a call to a new endpoint `/api/admin/diseases` we'll add
      const loadAllData = async () => {
        setLoading(true);
        try {
          const statsRes = await axios.get('/api/admin/stats');
          setStats(statsRes.data);
          const usersRes = await axios.get('/api/admin/users');
          setUsersList(usersRes.data);
          const diseasesRes = await axios.get('/api/admin/diseases');
          setDiseasesList(diseasesRes.data);
        } catch (err) {
          addToast('Error loading administrative data.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadAllData();
    }
  }, [user]);

  // Handle User Deletion
  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      addToast('You cannot delete your own admin account!', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user? All their prediction history will be deleted.')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      addToast('User deleted successfully.', 'success');
      setUsersList(usersList.filter(u => u.id !== userId));
      // Refresh stats
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      addToast('Failed to delete user.', 'error');
    }
  };

  // Handle Disease Deletion
  const handleDeleteDisease = async (diseaseId) => {
    if (!window.confirm('Are you sure you want to delete this disease definition?')) return;

    try {
      await axios.delete(`/api/admin/disease/${diseaseId}`);
      addToast('Disease definition deleted.', 'success');
      setDiseasesList(diseasesList.filter(d => d.id !== diseaseId));
    } catch (err) {
      addToast('Failed to delete disease definition.', 'error');
    }
  };

  // Open Add/Edit Modal
  const openModal = (mode, disease = null) => {
    setModalMode(mode);
    if (mode === 'edit' && disease) {
      setCurrentDiseaseId(disease.id);
      setDiseaseName(disease.disease_name);
      setSymptoms(disease.symptoms || '');
      setCauses(disease.causes || '');
      setPrevention(disease.prevention || '');
      setTreatment(disease.treatment || '');
      setCropType(disease.crop_type);
    } else {
      setCurrentDiseaseId(null);
      setDiseaseName('');
      setSymptoms('');
      setCauses('');
      setPrevention('');
      setTreatment('');
      setCropType('');
    }
    setShowDiseaseModal(true);
  };

  // Handle Disease Save
  const handleSaveDisease = async (e) => {
    e.preventDefault();
    if (!diseaseName || !cropType) {
      addToast('Name and Crop Type are required.', 'error');
      return;
    }

    const payload = {
      disease_name: diseaseName,
      symptoms,
      causes,
      prevention,
      treatment,
      crop_type: cropType
    };

    try {
      if (modalMode === 'add') {
        const res = await axios.post('/api/admin/disease', payload);
        setDiseasesList([...diseasesList, res.data]);
        addToast('Disease definition registered!', 'success');
      } else {
        const res = await axios.put(`/api/admin/disease/${currentDiseaseId}`, payload);
        setDiseasesList(diseasesList.map(d => d.id === currentDiseaseId ? res.data : d));
        addToast('Disease definition updated!', 'success');
      }
      setShowDiseaseModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to save disease definition.';
      addToast(errorMsg, 'error');
    }
  };

  const formatLabel = (label) => {
    return label.replace(/___/g, ' - ').replace(/_/g, ' ');
  };

  // SVG Bar Chart Calculations
  const renderSVGChart = () => {
    if (!stats?.disease_frequency) return null;
    const frequencies = stats.disease_frequency;
    const data = Object.entries(frequencies).map(([name, count]) => ({
      name: formatLabel(name),
      count
    })).sort((a, b) => b.count - a.count);

    if (data.length === 0) {
      return (
        <div className="py-12 text-center text-gray-500 text-sm">
          No prediction logs collected yet to display frequency metrics.
        </div>
      );
    }

    const maxCount = Math.max(...data.map(d => d.count), 1);
    
    // SVG Settings
    const width = 600;
    const height = 280;
    const paddingLeft = 140;
    const paddingRight = 40;
    const paddingTop = 20;
    const paddingBottom = 20;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const rowHeight = chartHeight / data.length;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]">
          {data.map((item, index) => {
            const barWidth = (item.count / maxCount) * chartWidth;
            const y = paddingTop + index * rowHeight;
            const barHeight = Math.min(rowHeight - 6, 20);

            return (
              <g key={index} className="group">
                {/* Y Axis Labels (Disease Names) */}
                <text
                  x={paddingLeft - 12}
                  y={y + barHeight / 2 + 4}
                  className="fill-gray-400 text-[10px] font-semibold text-right"
                  textAnchor="end"
                >
                  {item.name.length > 22 ? item.name.substring(0, 20) + '...' : item.name}
                  <title>{item.name}</title>
                </text>

                {/* Bars */}
                <rect
                  x={paddingLeft}
                  y={y}
                  width={Math.max(barWidth, 2)}
                  height={barHeight}
                  rx={4}
                  className="fill-emerald-500 hover:fill-teal-400 transition-all duration-350 cursor-pointer"
                />

                {/* X Axis Values (Counts) */}
                <text
                  x={paddingLeft + barWidth + 8}
                  y={y + barHeight / 2 + 4}
                  className="fill-emerald-300 font-mono text-[10px] font-bold"
                >
                  {item.count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Filtering users
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtering diseases
  const filteredDiseases = diseasesList.filter(d => 
    d.disease_name.toLowerCase().includes(diseaseSearch.toLowerCase()) || 
    d.crop_type.toLowerCase().includes(diseaseSearch.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="glass-panel border border-red-500/20 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-gray-400 font-light">
            You require administrator authorization privileges to access these options.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in-up">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider font-mono">System Registered Users</p>
              <h3 className="text-3xl font-extrabold text-white">{stats?.total_users || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider font-mono">Accumulated Plant Diagnostics</p>
              <h3 className="text-3xl font-extrabold text-teal-400">{stats?.total_predictions || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider font-mono">Registered Conditions</p>
              <h3 className="text-3xl font-extrabold text-emerald-400">{diseasesList.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts & Diagnostics Insights */}
        <div className="glass-card border border-gray-800 rounded-3xl p-6">
          <div className="pb-4 mb-6 border-b border-gray-800">
            <h3 className="font-bold text-white text-md">Crop Pathology Frequencies</h3>
            <p className="text-xs text-gray-500 mt-1">Real-time scan quantities classified by crop disease class.</p>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading chart calculations...</div>
          ) : (
            renderSVGChart()
          )}
        </div>

        {/* Tab Switcher */}
        <div className="border-b border-gray-800 flex gap-6 text-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'users' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            User Database Directory
          </button>
          <button
            onClick={() => setActiveTab('diseases')}
            className={`pb-3 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'diseases' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Crop Disease Pathology Registry
          </button>
        </div>

        {/* Directory Tables */}
        {activeTab === 'users' ? (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search users name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white placeholder-gray-600 transition-all text-xs"
              />
            </div>

            <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 font-semibold uppercase bg-black/10">
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-all text-gray-300">
                      <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-emerald-500/10 text-emerald-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative max-w-sm flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search diseases or crops..."
                  value={diseaseSearch}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white placeholder-gray-600 transition-all text-xs"
                />
              </div>
              <button
                onClick={() => openModal('add')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Register Disease
              </button>
            </div>

            <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 font-semibold uppercase bg-black/10">
                    <th className="px-6 py-3.5">Condition Name</th>
                    <th className="px-6 py-3.5">Crop</th>
                    <th className="px-6 py-3.5">Symptoms Sheet Preview</th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {filteredDiseases.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-all text-gray-300">
                      <td className="px-6 py-4 font-bold text-white">{formatLabel(d.disease_name)}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">{d.crop_type}</td>
                      <td className="px-6 py-4 text-gray-400 truncate max-w-xs">{d.symptoms}</td>
                      <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal('edit', d)}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-gray-500 hover:text-emerald-400 transition-all cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDisease(d.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Remove Definition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Disease Modal */}
        {showDiseaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
            <form 
              onSubmit={handleSaveDisease}
              className="glass-panel border border-gray-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-5 relative animate-fade-in-up max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowDiseaseModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {modalMode === 'add' ? 'Register New Pathology Condition' : 'Modify Crop Pathology Sheet'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Configure symptoms descriptions and treatment charts.</p>
              </div>

              <div className="space-y-4 text-xs md:text-sm">
                {/* Disease Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Disease Class Code (Dataset name)</label>
                  <input
                    type="text"
                    placeholder="Tomato_Early_blight"
                    value={diseaseName}
                    onChange={(e) => setDiseaseName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f131a] border border-gray-800 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-xs"
                    disabled={modalMode === 'edit'}
                    required
                  />
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Crop Family</label>
                  <input
                    type="text"
                    placeholder="Tomato"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f131a] border border-gray-800 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-xs"
                    required
                  />
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pathology Symptoms</label>
                  <textarea
                    rows={3}
                    placeholder="Describe leaves spots patterns or textures..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f131a] border border-gray-800 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-xs"
                  />
                </div>

                {/* Causes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Etiology & Causes</label>
                  <textarea
                    rows={2}
                    placeholder="Bacteria or fungus details..."
                    value={causes}
                    onChange={(e) => setCauses(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f131a] border border-gray-800 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-xs"
                  />
                </div>

                {/* Prevention */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Proactive Prevention</label>
                  <textarea
                    rows={2}
                    placeholder="Crop rotation, spacing, leaf mulching..."
                    value={prevention}
                    onChange={(e) => setPrevention(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f131a] border border-gray-800 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-xs"
                  />
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Treatment & Remedies</label>
                  <textarea
                    rows={3}
                    placeholder="Fungicides application schedule, leaf pruning..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f131a] border border-gray-800 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white transition-all text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDiseaseModal(false)}
                  className="flex-1 py-3 bg-[#0f131a] hover:bg-white/5 border border-gray-800 text-gray-400 hover:text-white font-semibold rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/20 hover:brightness-105 transition-all cursor-pointer text-center"
                >
                  Save Sheet
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
