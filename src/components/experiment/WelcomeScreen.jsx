import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { DeviceNotice } from '../common/DeviceNotice';
import { ArrowRight, Clock, Shield } from 'lucide-react';

export const WelcomeScreen = () => {
  const { startExperiment } = useExperiment();
  const { settings } = useConfig();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Research Study
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-2 tracking-tight">
            {settings.participantFacingTitle || 'Thinking About Everyday Objects'}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mt-2">
            You are invited to participate in a study examining how people think about familiar everyday objects and generate alternative ideas.
          </p>
        </div>

        <DeviceNotice />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="font-semibold block text-slate-900">Duration</span>
              <span>Approximately {settings.estimatedTimeMin || '15–20'} minutes</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="font-semibold block text-slate-900">Privacy</span>
              <span>Anonymous participant data</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-end">
          <button
            onClick={startExperiment}
            className="btn-primary w-full sm:w-auto text-base"
          >
            <span>Begin Study</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
