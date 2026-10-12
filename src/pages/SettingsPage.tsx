import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import {
  Settings as SettingsIcon,
  Server,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { student, setStudent, isDemoMode, setDemoMode, showToast } = useApp();
  const [apiUrl, setApiUrl] = useState(apiClient.getBaseUrl());
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: student.name,
    email: student.email,
    department: student.department,
    semester: student.semester,
  });

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent(prev => ({
      ...prev,
      name: studentForm.name,
      email: studentForm.email,
      department: studentForm.department,
      semester: Number(studentForm.semester),
    }));
    showToast('Profile Updated', 'Student profile details refreshed.', 'success');
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient.setBaseUrl(apiUrl.trim());
    showToast('API URL Saved', `Base URL set to ${apiUrl.trim()}`, 'success');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      // Simulate pinging configured base URL
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(`${apiUrl}/health`, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        setTestStatus('Connection Healthy: Backend responded with 200 OK.');
        showToast('Connection Succeeded', 'Backend endpoint responded successfully.', 'success');
      } else {
        setTestStatus(`No live backend detected at "${apiUrl}". Running safely in DEMO MODE.`);
        showToast('Backend Offline', 'No service detected at this endpoint. Continue using local Demo Mode.', 'info');
      }
    } catch {
      setTestStatus(`Endpoint unreachable. Check that your local backend is running at ${apiUrl}.`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('st2_projects_state');
    localStorage.removeItem('st2_coding_problems_state');
    localStorage.removeItem('st2_startup_ideas_state');
    localStorage.removeItem('st2_st_point_insights');
    localStorage.removeItem('st2_notifications');
    localStorage.removeItem('bytexl_projects_state');
    localStorage.removeItem('bytexl_coding_problems_state');
    localStorage.removeItem('bytexl_startup_ideas_state');
    localStorage.removeItem('bytexl_st_point_insights');
    localStorage.removeItem('bytexl_notifications');
    showToast('Demo Data Reset', 'All local storage demo modifications have been restored to initial state.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Hub Settings & Backend Architecture
            </h1>
            <Badge variant="orange">Configuration Layer</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Toggle between offline demo simulation and future REST backend integration
          </p>
        </div>
      </div>

      {/* Backend Integration & Demo Mode Panel */}
      <GlassCard variant="default" className="p-6 border-l-2 border-l-[#FF7A18]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">
              Runtime Mode: {isDemoMode ? 'Demo Mode (Offline Simulated Data)' : 'API Mode (REST Backend Connected)'}
            </h3>
          </div>

          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDemoMode
                ? 'bg-[#FF7A18]/20 text-[#FF8C32] border border-[rgba(255,122,24,0.4)] shadow-[0_0_12px_rgba(255,122,24,0.25)]'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            Switch to {isDemoMode ? 'API Mode' : 'Demo Mode'}
          </button>
        </div>

        <p className="text-xs text-[#8F8176] leading-relaxed mb-6">
          {isDemoMode
            ? 'Currently utilizing local mock data services and browser localStorage. No unnecessary network calls are dispatched, and all interactive features function completely standalone.'
            : 'API Mode is active. Data queries will attempt to dispatch through the configured VITE_API_BASE_URL below.'}
        </p>

        {/* API Base URL Configuration Form */}
        <form onSubmit={handleSaveApiUrl} className="space-y-3 p-4 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.15)]">
          <label className="block text-xs font-semibold text-[#FFF8F0]">
            Backend REST Base URL (Configurable via <code className="text-[#FF8C32] font-mono">VITE_API_BASE_URL</code>)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:5000/api"
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs font-mono focus:outline-none focus:border-[#FF8C32] shadow-inner"
            />
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleTestConnection} isLoading={isTesting}>
                Ping Endpoint
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save URL
              </Button>
            </div>
          </div>

          {testStatus && (
            <p className="text-xs text-[#8F8176] pt-2 border-t border-[rgba(255,122,24,0.12)] font-mono">
              {testStatus}
            </p>
          )}
        </form>
      </GlassCard>

      {/* Student Profile Settings */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#FF8C32]" />
          <h3 className="text-base font-bold text-[#FFF8F0] font-display">
            Student Profile Information
          </h3>
        </div>

        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">Full Name</label>
              <input
                type="text"
                value={studentForm.name}
                onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF8C32] shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">Campus Email</label>
              <input
                type="email"
                value={studentForm.email}
                onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF8C32] shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">Department / School</label>
              <input
                type="text"
                value={studentForm.department}
                onChange={(e) => setStudentForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF8C32] shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">Current Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                value={studentForm.semester}
                onChange={(e) => setStudentForm(prev => ({ ...prev, semester: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF8C32] shadow-inner"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Update Profile
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Reset Demo Data & Platform Specs */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#FFF8F0] font-display flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset Demo LocalStorage State
            </h3>
            <p className="text-xs text-[#8F8176] mt-1">
              Clear all locally submitted startup ideas, completed project milestones, and solved problem flags.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={handleResetDemoData}
            icon={<RotateCcw size={14} />}
          >
            Reset All Demo Data
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
