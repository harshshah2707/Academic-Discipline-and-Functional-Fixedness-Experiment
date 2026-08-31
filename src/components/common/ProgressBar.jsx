import React from 'react';
import { useExperiment, EXPERIMENT_STEPS } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';

export const ProgressBar = () => {
  const { currentStep, currentTrialIndex, trialOrder } = useExperiment();
  const { experimentalObjects } = useConfig();

  const totalTrials = trialOrder.length || experimentalObjects.length || 6;

  // Compute progress percentage
  let stageLabel = '';
  let progressPercent = 0;

  switch (currentStep) {
    case EXPERIMENT_STEPS.WELCOME:
      stageLabel = 'Overview';
      progressPercent = 5;
      break;
    case EXPERIMENT_STEPS.DEMOGRAPHICS:
      stageLabel = 'Personal Background Information';
      progressPercent = 14;
      break;
    case EXPERIMENT_STEPS.CONSENT:
      stageLabel = 'Informed Consent';
      progressPercent = 22;
      break;
    case EXPERIMENT_STEPS.MODALITY_SELECTION:
      stageLabel = 'Select Presentation Format';
      progressPercent = 30;
      break;
    case EXPERIMENT_STEPS.INSTRUCTIONS:
      stageLabel = 'Task Instructions';
      progressPercent = 36;
      break;
    case EXPERIMENT_STEPS.PRACTICE_INTRO:
    case EXPERIMENT_STEPS.PRACTICE_FIXATION:
    case EXPERIMENT_STEPS.PRACTICE_STIMULUS:
    case EXPERIMENT_STEPS.PRACTICE_CONVENTIONAL:
    case EXPERIMENT_STEPS.PRACTICE_FIRST_USE:
    case EXPERIMENT_STEPS.PRACTICE_ADDITIONAL:
      stageLabel = 'Practice Trial';
      progressPercent = 35;
      break;
    case EXPERIMENT_STEPS.PRACTICE_COMPLETE:
      stageLabel = 'Practice Completed';
      progressPercent = 40;
      break;
    case EXPERIMENT_STEPS.TRIAL_FIXATION:
    case EXPERIMENT_STEPS.TRIAL_STIMULUS:
    case EXPERIMENT_STEPS.TRIAL_CONVENTIONAL:
    case EXPERIMENT_STEPS.TRIAL_FIRST_USE:
    case EXPERIMENT_STEPS.TRIAL_ADDITIONAL:
      const trialNum = currentTrialIndex + 1;
      stageLabel = `Main Task: Object ${trialNum} of ${totalTrials}`;
      // Range 40% to 85%
      progressPercent = 40 + Math.round((trialNum / totalTrials) * 45);
      break;
    case EXPERIMENT_STEPS.BREAK:
      stageLabel = 'Mid-Task Rest';
      progressPercent = 65;
      break;
    case EXPERIMENT_STEPS.POST_QUESTIONS:
      stageLabel = 'Post-Experiment Questions';
      progressPercent = 90;
      break;
    case EXPERIMENT_STEPS.DEBRIEF:
      stageLabel = 'Study Debriefing';
      progressPercent = 96;
      break;
    case EXPERIMENT_STEPS.COMPLETION:
      stageLabel = 'Completed';
      progressPercent = 100;
      break;
    default:
      stageLabel = 'Study Session';
      progressPercent = 50;
  }

  // Don't show during fixation or stimulus to keep screen purely distraction-free
  const isMinimalPhase = currentStep === EXPERIMENT_STEPS.TRIAL_FIXATION ||
    currentStep === EXPERIMENT_STEPS.TRIAL_STIMULUS ||
    currentStep === EXPERIMENT_STEPS.PRACTICE_FIXATION ||
    currentStep === EXPERIMENT_STEPS.PRACTICE_STIMULUS;

  if (isMinimalPhase) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-4">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
        <span>{stageLabel}</span>
        <span>{progressPercent}%</span>
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-slate-800 h-full rounded-full progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
