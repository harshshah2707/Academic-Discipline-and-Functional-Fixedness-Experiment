import React, { useState, useEffect, useRef } from 'react';
import { useExperiment, EXPERIMENT_STEPS } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { StimulusSvg } from '../../config/svgStimuli';
import { CONDITIONS } from '../../services/randomizationService';
import { CheckCircle2, Clock, Send, Plus, ArrowRight, HelpCircle } from 'lucide-react';

export const PracticeScreen = () => {
  const {
    currentStep,
    setCurrentStep,
    assignedModality,
    practiceObject,
    recordPracticeFirstResponseRender,
    submitPracticeFirstResponse,
    addPracticeAdditionalResponse,
    finishPractice,
    startMainExperimentalTrials
  } = useExperiment();

  const { settings } = useConfig();

  // Local Practice Sub-Phase: 'fixation' | 'stimulus' | 'conventional' | 'first_use' | 'additional' | 'complete'
  const [practicePhase, setPracticePhase] = useState('fixation');
  const [firstInput, setFirstInput] = useState('');
  const [additionalInput, setAdditionalInput] = useState('');
  const [localAdditionalList, setLocalAdditionalList] = useState([]);
  
  // Timer for additional uses countdown
  const [secondsRemaining, setSecondsRemaining] = useState(settings.practiceAdditionalDurationSec || 25);
  const timerRef = useRef(null);

  // Phase transition sequencing for Practice
  useEffect(() => {
    let timeoutId;

    if (practicePhase === 'fixation') {
      timeoutId = setTimeout(() => {
        setPracticePhase('stimulus');
      }, settings.fixationDurationMs || 500);
    } else if (practicePhase === 'stimulus') {
      timeoutId = setTimeout(() => {
        if (settings.showConventionalFunction) {
          setPracticePhase('conventional');
        } else {
          setPracticePhase('first_use');
          recordPracticeFirstResponseRender();
        }
      }, settings.stimulusDurationMs || 2000);
    } else if (practicePhase === 'conventional') {
      timeoutId = setTimeout(() => {
        setPracticePhase('first_use');
        recordPracticeFirstResponseRender();
      }, settings.conventionalDurationMs || 2500);
    }

    return () => clearTimeout(timeoutId);
  }, [practicePhase, settings]);

  // Countdown timer for practice additional phase
  useEffect(() => {
    if (practicePhase === 'additional') {
      setSecondsRemaining(settings.practiceAdditionalDurationSec || 25);

      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPracticePhase('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [practicePhase, settings.practiceAdditionalDurationSec]);

  // Handle First Alternative Use Submission
  const handleFirstSubmit = (e) => {
    e.preventDefault();
    if (!firstInput.trim()) return;
    submitPracticeFirstResponse(firstInput.trim(), false);
    setPracticePhase('additional');
  };

  const handleFirstSkip = () => {
    submitPracticeFirstResponse('', true);
    setPracticePhase('additional');
  };

  // Handle Additional Use Submission
  const handleAdditionalSubmit = (e) => {
    e.preventDefault();
    if (!additionalInput.trim()) return;
    const text = additionalInput.trim();
    setLocalAdditionalList(prev => [...prev, text]);
    addPracticeAdditionalResponse(text);
    setAdditionalInput('');
  };

  // 1. PRACTICE FIXATION SCREEN
  if (practicePhase === 'fixation') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-slate-100 text-slate-400 text-xs px-3 py-1 rounded w-fit mx-auto mb-8 font-medium">
          Practice Trial
        </div>
        <div className="stimulus-box flex items-center justify-center">
          <span className="fixation-cross">+</span>
        </div>
      </div>
    );
  }

  // 2. PRACTICE STIMULUS PRESENTATION
  if (practicePhase === 'stimulus') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-slate-100 text-slate-400 text-xs px-3 py-1 rounded w-fit mx-auto mb-8 font-medium">
          Practice Trial
        </div>
        <div className="stimulus-box flex flex-col items-center justify-center">
          {assignedModality === CONDITIONS.PICTURE ? (
            <StimulusSvg name="coin" className="w-56 h-56" />
          ) : (
            <div className="text-4xl sm:text-5xl font-bold tracking-widest text-slate-900 uppercase">
              COIN
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. PRACTICE CONVENTIONAL FUNCTION STATEMENT
  if (practicePhase === 'conventional') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-slate-100 text-slate-400 text-xs px-3 py-1 rounded w-fit mx-auto mb-8 font-medium">
          Practice Trial
        </div>
        <div className="stimulus-box flex flex-col items-center justify-center text-center p-8">
          <p className="text-xl sm:text-2xl font-medium text-slate-800 max-w-lg leading-relaxed">
            "{practiceObject.conventionalFunction}"
          </p>
        </div>
      </div>
    );
  }

  // 4. PRACTICE FIRST ALTERNATIVE USE
  if (practicePhase === 'first_use') {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="research-card-lg p-8 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
              Practice Trial: Phase 1
            </span>
            <span className="text-xs text-slate-500 font-mono">Object: COIN</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Think of a use for this object that is different from its usual use.
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Please type your <strong>FIRST alternative use</strong> and submit it as soon as you think of it.
          </p>

          <form onSubmit={handleFirstSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Type your first alternative use here..."
              value={firstInput}
              onChange={(e) => setFirstInput(e.target.value)}
              className="form-input text-base py-3"
              autoFocus
              required
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {settings.allowSkipFirstResponse && (
                <button
                  type="button"
                  onClick={handleFirstSkip}
                  className="text-xs text-slate-500 hover:text-slate-700 underline order-2 sm:order-1"
                >
                  I cannot think of another use
                </button>
              )}

              <button
                type="submit"
                disabled={!firstInput.trim()}
                className="btn-primary w-full sm:w-auto text-sm order-1 sm:order-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit First Use</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 5. PRACTICE ADDITIONAL USES PHASE
  if (practicePhase === 'additional') {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="research-card-lg p-8 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
              Practice Trial: Phase 2
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded font-mono text-sm font-bold">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{secondsRemaining}s</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Now think of as many other alternative uses as you can.
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Enter one alternative use at a time and click <strong>Add Use</strong>.
          </p>

          <form onSubmit={handleAdditionalSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Enter another alternative use..."
              value={additionalInput}
              onChange={(e) => setAdditionalInput(e.target.value)}
              className="form-input text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={!additionalInput.trim()}
              className="btn-primary text-sm shrink-0 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Use</span>
            </button>
          </form>

          {/* List of responses entered in this trial */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Responses entered for this object ({localAdditionalList.length + (firstInput ? 1 : 0)}):
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {firstInput && (
                <div className="text-xs p-2 rounded bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-2">
                  <span className="font-semibold text-amber-700">1.</span>
                  <span>{firstInput} (First use)</span>
                </div>
              )}
              {localAdditionalList.map((item, idx) => (
                <div key={idx} className="text-xs p-2 rounded bg-white border border-slate-200 text-slate-800 flex items-start gap-2">
                  <span className="font-semibold text-slate-500">{idx + (firstInput ? 2 : 1)}.</span>
                  <span>{item}</span>
                </div>
              ))}
              {!firstInput && localAdditionalList.length === 0 && (
                <p className="text-xs text-slate-400 italic">No alternative uses added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. PRACTICE COMPLETED
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="research-card-lg p-8 sm:p-10 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          You have completed the practice trial.
        </h2>
        <p className="text-slate-600 text-base mb-8 max-w-md mx-auto">
          The main experimental task will now begin. You will be presented with 6 everyday objects in the exact same format.
        </p>

        <div className="border-t border-slate-200 pt-6 flex justify-center">
          <button
            onClick={startMainExperimentalTrials}
            className="btn-primary text-base px-8 py-3"
          >
            <span>Start Main Task</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
