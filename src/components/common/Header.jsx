import React from 'react';
import { useExperiment, EXPERIMENT_STEPS } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { ShieldCheck, UserCheck, Settings, Sparkles } from 'lucide-react';

export const Header = ({ onOpenAdmin, isAdminView = false, onToggleDemo, isDemoOpen = false }) => {
  const { participantId, currentStep } = useExperiment();
  const { settings } = useConfig();

  const isExperimentActive = currentStep !== EXPERIMENT_STEPS.WELCOME && currentStep !== EXPERIMENT_STEPS.COMPLETION;

  return (
    <header className="w-full bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
            Ψ
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">
              {settings.participantFacingTitle || 'Thinking About Everyday Objects'}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Cognitive Psychology Research Study
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {participantId && isExperimentActive && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>ID: <strong>{participantId}</strong></span>
            </div>
          )}

          {/* Demo Mode Switcher Button */}
          <button
            onClick={onToggleDemo}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
              isDemoOpen
                ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
            title="Toggle Demo Mode & Section Switcher for Mentor Presentation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isDemoOpen ? 'Hide Demo Nav' : 'Demo Mode'}</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className={`text-xs px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
              isAdminView
                ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Researcher Administration Panel"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isAdminView ? 'Exit Panel' : 'Researcher Access'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
