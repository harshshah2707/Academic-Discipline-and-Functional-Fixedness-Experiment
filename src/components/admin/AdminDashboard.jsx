import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useConfig } from '../../context/ConfigContext';
import { GroupBalanceMatrix } from './GroupBalanceMatrix';
import { LatencyAnalytics } from './LatencyAnalytics';
import { ParticipantTable } from './ParticipantTable';
import { TrialDataTable } from './TrialDataTable';
import { ResponseDataTable } from './ResponseDataTable';
import { ObjectConfigEditor } from './ObjectConfigEditor';
import { TimingConfigEditor } from './TimingConfigEditor';
import { GoogleSheetsSyncPanel } from './GoogleSheetsSyncPanel';
import { DataExportPanel } from './DataExportPanel';
import {
  Scale,
  BarChart3,
  Users,
  Layers,
  MessageSquare,
  Package,
  Sliders,
  FileSpreadsheet,
  Download,
  LogOut,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = ({ onExit }) => {
  const { experimentalObjects } = useConfig();
  const [activeTab, setActiveTab] = useState('overview');

  const [participants, setParticipants] = useState([]);
  const [trials, setTrials] = useState([]);
  const [responses, setResponses] = useState([]);

  const refreshData = () => {
    setParticipants(storageService.getParticipants());
    setTrials(storageService.getTrials());
    setResponses(storageService.getResponses());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    storageService.setAdminAuth(false);
    onExit();
  };

  const navItems = [
    { id: 'overview', label: '2×2 Allocation Matrix', icon: Scale },
    { id: 'analytics', label: 'Latency Analytics', icon: BarChart3 },
    { id: 'participants', label: `Participants (${participants.length})`, icon: Users },
    { id: 'trials', label: `Trial Logs (${trials.length})`, icon: Layers },
    { id: 'responses', label: `Raw Responses (${responses.length})`, icon: MessageSquare },
    { id: 'stimuli', label: 'Stimuli Objects', icon: Package },
    { id: 'timing', label: 'Timing & Controls', icon: Sliders },
    { id: 'sheets', label: 'Google Sheets Sync', icon: FileSpreadsheet },
    { id: 'export', label: 'Export Datasets', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-xl shadow-md">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded">
            Research Administration Portal
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-2 tracking-tight">
            Academic Discipline, Stimulus Modality, and Functional Fixedness
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            2 × 2 Factorial Cognitive Psychology Experiment Control Center
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary text-xs py-2 px-4 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Panel</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white text-slate-900 border-t-2 border-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'overview' && (
          <GroupBalanceMatrix participants={participants} />
        )}

        {activeTab === 'analytics' && (
          <LatencyAnalytics trials={trials} participants={participants} />
        )}

        {activeTab === 'participants' && (
          <ParticipantTable participants={participants} onDataChange={refreshData} />
        )}

        {activeTab === 'trials' && (
          <TrialDataTable trials={trials} />
        )}

        {activeTab === 'responses' && (
          <ResponseDataTable responses={responses} objects={experimentalObjects} />
        )}

        {activeTab === 'stimuli' && (
          <ObjectConfigEditor />
        )}

        {activeTab === 'timing' && (
          <TimingConfigEditor />
        )}

        {activeTab === 'sheets' && (
          <GoogleSheetsSyncPanel />
        )}

        {activeTab === 'export' && (
          <DataExportPanel onDataChange={refreshData} />
        )}
      </div>
    </div>
  );
};
