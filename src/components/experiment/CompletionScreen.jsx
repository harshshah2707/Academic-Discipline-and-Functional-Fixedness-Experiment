import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { exportService } from '../../services/exportService';
import { CheckCircle2, ShieldCheck, Download, RotateCcw, FileSpreadsheet } from 'lucide-react';

export const CompletionScreen = () => {
  const { participantId, restartNewSession } = useExperiment();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="research-card-lg p-8 sm:p-10 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Study Complete
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
          Thank you for your valuable time and participation. Your experimental data has been successfully recorded.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-sm mx-auto mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Participant Verification</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-normal normal-case">
              Recorded in Database
            </span>
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1">
            ID: {participantId || 'P0001'}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Your responses and response times have been safely logged.
          </p>
        </div>

        {/* Data Download / Export Section */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-8 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Researcher Data Export (CSV)</span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Download the structured experimental datasets for this session:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportService.exportDataset1ParticipantsCsv()}
              className="text-xs px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>participant_data.csv</span>
            </button>
            <button
              onClick={() => exportService.exportDataset2TrialsCsv()}
              className="text-xs px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>trial_data.csv</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={restartNewSession}
            className="btn-secondary text-sm w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Participant Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
