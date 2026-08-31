import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { BookMarked, CheckCircle2, ShieldCheck } from 'lucide-react';

export const DebriefingScreen = () => {
  const { finishStudy } = useExperiment();
  const { settings } = useConfig();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookMarked className="w-4 h-4" />
          <span>Study Debriefing</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
          Participant Debriefing Statement
        </h2>

        <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed mb-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
          <p>
            Thank you for participating in this research study!
          </p>

          <p>
            This study examines how people <strong>move beyond the conventional functions</strong> of familiar everyday objects (a phenomenon known in cognitive psychology as <em>functional fixedness</em>).
          </p>

          <p>
            Specifically, the study investigates whether the <strong>modality in which an object is presented</strong> (as a visual picture vs. as a written word) influences how rapidly and flexibly individuals can generate alternative uses.
          </p>

          <p>
            It also explores whether individuals from different academic backgrounds (such as visual arts or history) differ in how they mentally represent and process physical objects.
          </p>

          <div className="bg-white border border-slate-200 rounded p-4 text-xs sm:text-sm text-slate-800 font-medium">
            <strong>Important Note:</strong> The study does not assume or imply that one academic discipline is inherently more creative or intelligent than another. Academic discipline is examined as a naturalistic context for habitual ways of perceiving objects and forms.
          </div>

          <p>
            Your responses will contribute to our understanding of the relationship between object representation, problem-solving, and cognitive flexibility.
          </p>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
            For further information about this study or its eventual findings, you may contact the research team at {settings.contactEmail}.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-end">
          <button
            onClick={finishStudy}
            className="btn-primary w-full sm:w-auto text-base"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish Study</span>
          </button>
        </div>
      </div>
    </div>
  );
};
