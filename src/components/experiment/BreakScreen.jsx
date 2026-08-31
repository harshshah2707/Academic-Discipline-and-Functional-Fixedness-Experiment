import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { Coffee, ArrowRight } from 'lucide-react';

export const BreakScreen = () => {
  const { resumeFromBreak, currentTrialIndex, trialOrder } = useExperiment();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="research-card-lg p-8 sm:p-10 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
          <Coffee className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          You are halfway through the task.
        </h2>
        <p className="text-slate-600 text-base mb-2">
          Take a short moment to rest your eyes and relax.
        </p>
        <p className="text-xs text-slate-500 mb-8">
          Completed {currentTrialIndex} of {trialOrder.length} objects.
        </p>

        <div className="border-t border-slate-200 pt-6 flex justify-center">
          <button
            onClick={resumeFromBreak}
            className="btn-primary text-base px-8 py-3"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
