import React, { useState } from 'react';
import { useExperiment, EXPERIMENT_STEPS } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { CONDITIONS } from '../../services/randomizationService';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  RotateCcw,
  Zap,
  Image,
  Type,
  CheckCircle,
  Settings,
  HelpCircle,
  FileText,
  UserCheck,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const DemoModeBar = ({ isOpen, onToggle, onOpenAdmin }) => {
  const {
    currentStep,
    jumpToStep,
    assignedModality,
    setAssignedModality,
    currentTrialIndex,
    setCurrentTrialIndex,
    fillSampleData,
    restartNewSession,
    submitFirstAlternativeUse,
    addAdditionalAlternativeUse,
    getCurrentTrialObject
  } = useExperiment();

  const { experimentalObjects } = useConfig();
  const [selectedDiscipline, setSelectedDiscipline] = useState('Fine Arts');
  const [selectedModality, setSelectedModality] = useState(CONDITIONS.PICTURE);

  if (!isOpen) return null;

  const currentObj = getCurrentTrialObject();

  const handleFillAndJump = (discipline, modality, step = EXPERIMENT_STEPS.TRIAL_FIXATION, trialIdx = 0) => {
    fillSampleData(discipline, modality);
    jumpToStep(step, trialIdx);
  };

  const handleAddSampleResponses = () => {
    if (currentStep === EXPERIMENT_STEPS.TRIAL_FIRST_USE || currentStep === EXPERIMENT_STEPS.TRIAL_ADDITIONAL) {
      submitFirstAlternativeUse('Use it as a miniature structural wedge', false);
      setTimeout(() => {
        addAdditionalAlternativeUse('Use it as a weight counterbalance in a kinetic sculpture');
        addAdditionalAlternativeUse('Use it as a stencil guide for geometric drawing');
      }, 100);
    }
  };

  const stages = [
    { step: EXPERIMENT_STEPS.WELCOME, label: '1. Welcome', icon: BookOpen },
    { step: EXPERIMENT_STEPS.DEMOGRAPHICS, label: '2. Demographics', icon: UserCheck },
    { step: EXPERIMENT_STEPS.CONSENT, label: '3. Consent Form', icon: FileText },
    { step: EXPERIMENT_STEPS.MODALITY_SELECTION, label: '4. Format Select', icon: Layers },
    { step: EXPERIMENT_STEPS.INSTRUCTIONS, label: '5. Instructions', icon: HelpCircle },
    { step: EXPERIMENT_STEPS.PRACTICE_FIXATION, label: '6. Practice Trial', icon: Play },
    { step: EXPERIMENT_STEPS.TRIAL_FIXATION, label: '7. Main Trials', icon: Zap },
    { step: EXPERIMENT_STEPS.BREAK, label: '8. Mid Break', icon: RotateCcw },
    { step: EXPERIMENT_STEPS.POST_QUESTIONS, label: '9. Final Questions', icon: HelpCircle },
    { step: EXPERIMENT_STEPS.DEBRIEF, label: '10. Debriefing', icon: CheckCircle },
    { step: EXPERIMENT_STEPS.COMPLETION, label: '11. Data Export', icon: CheckCircle }
  ];

  return (
    <div className="bg-slate-900 text-white border-b-2 border-indigo-500 shadow-2xl sticky top-0 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* Top bar header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-md uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Mentor Demo Mode
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              Interactive Section Switcher & Showcase Tools
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Modality Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setAssignedModality(CONDITIONS.PICTURE)}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                  assignedModality === CONDITIONS.PICTURE
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Picture condition on the fly"
              >
                <Image className="w-3.5 h-3.5" />
                <span>Picture</span>
              </button>
              <button
                onClick={() => setAssignedModality(CONDITIONS.WORD)}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                  assignedModality === CONDITIONS.WORD
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Word condition on the fly"
              >
                <Type className="w-3.5 h-3.5" />
                <span>Word</span>
              </button>
            </div>

            {/* Quick Fill Sample Data */}
            <button
              onClick={() => handleFillAndJump('Fine Arts', CONDITIONS.PICTURE, EXPERIMENT_STEPS.TRIAL_FIXATION, 0)}
              className="text-xs px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium rounded flex items-center gap-1 transition-colors"
              title="Populate sample participant data (Fine Arts + Picture) and jump directly into Trial 1"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Fill & Run Trial</span>
            </button>

            {/* Close Demo Mode */}
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              title="Hide Demo Navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Jumper Navigation Buttons */}
        <div className="pt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mr-1">
            Jump To Section:
          </span>

          {stages.map((stage) => {
            const Icon = stage.icon;
            const isCurrent = currentStep === stage.step;
            return (
              <button
                key={stage.step}
                onClick={() => jumpToStep(stage.step)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-indigo-500 text-white font-bold ring-2 ring-indigo-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3 h-3 opacity-70" />
                <span>{stage.label}</span>
              </button>
            );
          })}

          {/* Quick Jump to Specific Object Trial (1-6) */}
          <div className="flex items-center gap-1 ml-auto bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Trial Object:</span>
            {experimentalObjects.map((obj, idx) => (
              <button
                key={obj.id}
                onClick={() => jumpToStep(EXPERIMENT_STEPS.TRIAL_FIXATION, idx)}
                className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                  currentTrialIndex === idx && (currentStep.startsWith('trial_'))
                    ? 'bg-amber-500 text-slate-900 font-extrabold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                title={`Trial ${idx + 1}: ${obj.displayName || obj.name}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* In-Trial Quick Helpers (Only visible during trial steps) */}
        {(currentStep.startsWith('trial_') || currentStep.startsWith('practice_')) && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-amber-400">Current Stimulus:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-white">
                {currentObj ? (currentObj.displayName || currentObj.name) : 'BUTTON'}
              </span>
              <span className="text-slate-500">|</span>
              <span className="font-semibold text-indigo-400">Modality:</span>
              <span className="text-slate-200">{assignedModality || 'Picture Condition'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddSampleResponses}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded text-xs flex items-center gap-1 font-medium"
                title="Populate test alternative uses"
              >
                <span>+ Insert Demo Uses</span>
              </button>
              <button
                onClick={() => jumpToStep(EXPERIMENT_STEPS.POST_QUESTIONS)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs flex items-center gap-1"
                title="Skip to Questionnaire"
              >
                <span>Skip to Questionnaire</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
