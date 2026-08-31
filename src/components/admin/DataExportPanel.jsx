import React, { useState } from 'react';
import { exportService } from '../../services/exportService';
import { storageService } from '../../services/storageService';
import { seedSampleResearchData } from '../../services/seedDataService';
import { Download, FileText, Database, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';

export const DataExportPanel = ({ onDataChange }) => {
  const [seedNotice, setSeedNotice] = useState('');

  const handleSeedData = () => {
    if (window.confirm('Generate realistic pilot data (10 participants, 60 trials, ~200 responses) to test analytics and exports?')) {
      const stats = seedSampleResearchData();
      setSeedNotice(`Generated ${stats.participantsCount} participants, ${stats.trialsCount} trials, and ${stats.responsesCount} responses!`);
      if (onDataChange) onDataChange();
      setTimeout(() => setSeedNotice(''), 4000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('WARNING: Are you sure you want to delete ALL stored experimental data? This cannot be undone.')) {
      if (window.confirm('Please confirm once more: Erase all participant, trial, and response data?')) {
        storageService.clearAllData();
        if (onDataChange) onDataChange();
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-base">
            Data Export & Statistical Datasets
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Export your experimental data in standardized CSV formats conforming precisely to the study specification.
        </p>
      </div>

      {seedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{seedNotice}</span>
        </div>
      )}

      {/* CSV Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dataset 1 */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Dataset 1: Participant Level
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              One row per participant containing demographics, assigned modality, eligibility flag, and post-questionnaire responses.
            </p>
          </div>
          <button
            onClick={() => exportService.exportDataset1ParticipantsCsv()}
            className="btn-primary text-xs w-full py-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dataset 1 (CSV)</span>
          </button>
        </div>

        {/* Dataset 2 */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Dataset 2: Trial Level
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              One row per object trial containing high-precision first-response latency (ms and seconds), first response text, and total fluency count.
            </p>
          </div>
          <button
            onClick={() => exportService.exportDataset2TrialsCsv()}
            className="btn-primary text-xs w-full py-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dataset 2 (CSV)</span>
          </button>
        </div>

        {/* Dataset 3 */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Dataset 3: Response Level
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              One row per individual alternative use generated, with exact raw text, submission order, and timing since trial start.
            </p>
          </div>
          <button
            onClick={() => exportService.exportDataset3ResponsesCsv()}
            className="btn-primary text-xs w-full py-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dataset 3 (CSV)</span>
          </button>
        </div>
      </div>

      {/* Backup & Pilot Seeder */}
      <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportService.exportAllDataJson()}
            className="btn-secondary text-xs w-full sm:w-auto"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Export Full JSON Archive</span>
          </button>

          <button
            onClick={handleSeedData}
            className="btn-secondary text-xs w-full sm:w-auto text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Sample Pilot Data</span>
          </button>
        </div>

        <button
          onClick={handleClearAll}
          className="btn-danger text-xs w-full sm:w-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Erase All Database Records</span>
        </button>
      </div>
    </div>
  );
};
