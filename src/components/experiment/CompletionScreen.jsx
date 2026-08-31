import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { CheckCircle2, ShieldCheck, Download, RotateCcw } from 'lucide-react';

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

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-sm mx-auto mb-8 text-left">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Participant Verification</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-normal normal-case">
              Auto-Synced to Database
            </span>
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1">
            ID: {participantId || 'P0001'}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Your responses and response times have been automatically saved to the study database.
          </p>
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
