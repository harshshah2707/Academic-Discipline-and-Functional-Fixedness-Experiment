import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { BookOpen, ArrowRight, Lightbulb, Zap, Clock } from 'lucide-react';

export const InstructionsScreen = () => {
  const { startPractice, assignedModality } = useExperiment();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Task Instructions</span>
          </div>
          {assignedModality && (
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-100 normal-case">
              Format: {assignedModality}
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
          Standardised Task Instructions
        </h2>

        <div className="space-y-4 text-slate-800 text-base leading-relaxed mb-8">
          <div className="bg-slate-50 border-l-4 border-slate-700 p-4 rounded-r-md">
            <p className="font-medium text-slate-900 mb-1">
              You will be shown several familiar everyday objects.
            </p>
            <p className="text-slate-600 text-sm">
              For each object, think of a use that is <strong>different from its usual or conventional use</strong>.
              For example, if an object is usually used for one particular purpose, try to think of another possible purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 font-semibold text-blue-900 text-sm mb-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Phase 1: First Alternative Use</span>
              </div>
              <p className="text-xs text-blue-950/80 leading-normal">
                When you think of your <strong>FIRST alternative use</strong>, type it into the response box and submit it <strong>as soon as possible</strong>. Try not to overthink your first response.
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-4">
              <div className="flex items-center gap-2 font-semibold text-amber-900 text-sm mb-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Phase 2: Additional Uses</span>
              </div>
              <p className="text-xs text-amber-950/80 leading-normal">
                After submitting your first response, you will have an additional opportunity to think of and enter more alternative uses during a timed period.
              </p>
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 text-xs text-slate-700 space-y-1 mt-2">
            <p>• <strong>No right or wrong answers:</strong> Please respond with the first alternative use that genuinely comes to mind.</p>
            <p>• We will begin with <strong>one quick practice trial</strong> so you can become familiar with the format before the main task begins.</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-end">
          <button
            onClick={startPractice}
            className="btn-primary w-full sm:w-auto"
          >
            <span>Continue to Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
