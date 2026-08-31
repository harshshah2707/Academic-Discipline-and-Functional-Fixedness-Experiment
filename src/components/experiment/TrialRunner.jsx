import React, { useState, useEffect, useRef } from 'react';
import { useExperiment, EXPERIMENT_STEPS } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { StimulusSvg } from '../../config/svgStimuli';
import { CONDITIONS } from '../../services/randomizationService';
import { googleSheetsService } from '../../services/googleSheetsService';
import { Clock, Send, Plus, ArrowRight, AlertTriangle } from 'lucide-react';

export const TrialRunner = () => {
  const {
    currentStep,
    setCurrentStep,
    currentTrialIndex,
    trialOrder,
    getCurrentTrialObject,
    assignedModality,
    participantId,
    recordFirstResponseScreenRender,
    submitFirstAlternativeUse,
    addAdditionalAlternativeUse,
    completeCurrentTrial
  } = useExperiment();

  const { settings } = useConfig();
  const currentObject = getCurrentTrialObject();
  const totalTrials = trialOrder.length;
  const trialNumber = currentTrialIndex + 1;

  // In-trial phase state: 'fixation' | 'stimulus' | 'conventional' | 'first_use' | 'additional'
  const [localPhase, setLocalPhase] = useState('fixation');

  // Input states
  const [firstInputText, setFirstInputText] = useState('');
  const [additionalInputText, setAdditionalInputText] = useState('');
  const [trialResponsesList, setTrialResponsesList] = useState([]);

  // Additional uses countdown timer state
  const [secondsLeft, setSecondsLeft] = useState(settings.additionalUsesDurationSec || 60);
  const countdownIntervalRef = useRef(null);

  // Synchronize local phase with global step on trial change
  useEffect(() => {
    setLocalPhase('fixation');
    setFirstInputText('');
    setAdditionalInputText('');
    setTrialResponsesList([]);
  }, [currentTrialIndex]);

  // Phase transition timer
  useEffect(() => {
    let timerId;

    if (localPhase === 'fixation') {
      timerId = setTimeout(() => {
        setLocalPhase('stimulus');
        setCurrentStep(EXPERIMENT_STEPS.TRIAL_STIMULUS);
      }, settings.fixationDurationMs || 500);
    } else if (localPhase === 'stimulus') {
      timerId = setTimeout(() => {
        if (settings.showConventionalFunction) {
          setLocalPhase('conventional');
          setCurrentStep(EXPERIMENT_STEPS.TRIAL_CONVENTIONAL);
        } else {
          setLocalPhase('first_use');
          setCurrentStep(EXPERIMENT_STEPS.TRIAL_FIRST_USE);
          recordFirstResponseScreenRender();
        }
      }, settings.stimulusDurationMs || 2000);
    } else if (localPhase === 'conventional') {
      timerId = setTimeout(() => {
        setLocalPhase('first_use');
        setCurrentStep(EXPERIMENT_STEPS.TRIAL_FIRST_USE);
        recordFirstResponseScreenRender();
      }, settings.conventionalDurationMs || 2500);
    }

    return () => clearTimeout(timerId);
  }, [localPhase, settings, currentTrialIndex]);

  // Countdown timer for Phase 5 (Additional Uses)
  useEffect(() => {
    if (localPhase === 'additional') {
      setSecondsLeft(settings.additionalUsesDurationSec || 60);

      countdownIntervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            // 60s completed -> proceed to next trial
            completeCurrentTrial(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [localPhase, settings.additionalUsesDurationSec]);

  // Handle First Alternative Use Submission
  const handleFirstSubmit = (e) => {
    e.preventDefault();
    if (!firstInputText.trim()) return;

    const trimmed = firstInputText.trim();
    submitFirstAlternativeUse(trimmed, false);
    setTrialResponsesList([{ text: trimmed, isFirst: true }]);
    setLocalPhase('additional');
    setCurrentStep(EXPERIMENT_STEPS.TRIAL_ADDITIONAL);
  };

  // Handle "I cannot think of another use" skip button
  const handleFirstSkip = () => {
    submitFirstAlternativeUse('', true);
    setTrialResponsesList([]);
    setLocalPhase('additional');
    setCurrentStep(EXPERIMENT_STEPS.TRIAL_ADDITIONAL);
  };

  // Handle Additional Alternative Use Submission
  const handleAddResponse = (e) => {
    e.preventDefault();
    if (!additionalInputText.trim()) return;

    const trimmed = additionalInputText.trim();
    addAdditionalAlternativeUse(trimmed);
    setTrialResponsesList(prev => [...prev, { text: trimmed, isFirst: false }]);
    setAdditionalInputText('');
  };

  // Helper to render stimulus image (supports SVG, custom URL, or fallback)
  const renderStimulusImage = () => {
    if (currentObject.imageUrl) {
      return (
        <img
          src={currentObject.imageUrl}
          alt={currentObject.name}
          className="max-h-64 max-w-xs object-contain mx-auto"
        />
      );
    }
    return <StimulusSvg name={currentObject.name} className="w-64 h-64 mx-auto" />;
  };

  // ==========================================
  // PHASE 1: FIXATION SCREEN (+)
  // ==========================================
  if (localPhase === 'fixation') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="stimulus-box flex items-center justify-center">
          <span className="fixation-cross">+</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 2: STIMULUS PRESENTATION
  // ==========================================
  if (localPhase === 'stimulus') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="stimulus-box flex flex-col items-center justify-center">
          {assignedModality === CONDITIONS.PICTURE ? (
            // Picture Condition: Image ONLY, NO text
            <div className="animate-fade-in">{renderStimulusImage()}</div>
          ) : (
            // Word Condition: Large text ONLY, NO image
            <div className="text-4xl sm:text-5xl font-bold tracking-widest text-slate-900 uppercase">
              {currentObject.name}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 3: CONVENTIONAL FUNCTION STATEMENT
  // ==========================================
  if (localPhase === 'conventional') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="stimulus-box flex flex-col items-center justify-center text-center p-8">
          <p className="text-xl sm:text-2xl font-medium text-slate-800 max-w-lg leading-relaxed">
            "{currentObject.conventionalFunction}"
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PHASE 4: FIRST ALTERNATIVE USE
  // ==========================================
  if (localPhase === 'first_use') {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="research-card-lg p-8 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
              Object {trialNumber} of {totalTrials}
            </span>
            {settings.showTimerOnFirstUse && (
              <span className="text-xs text-slate-400 font-mono">Timer active</span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
            Think of a use for this object that is different from its usual use.
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Please type your <strong>FIRST alternative use</strong> and submit it as soon as you think of it.
          </p>

          <form onSubmit={handleFirstSubmit} className="space-y-4">
            <input
              type="text"
              id="first_alternative_use_input"
              placeholder="Type your first alternative use here..."
              value={firstInputText}
              onChange={(e) => setFirstInputText(e.target.value)}
              className="form-input text-base py-3"
              autoFocus
              autoComplete="off"
              required
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {settings.allowSkipFirstResponse && (
                <button
                  type="button"
                  onClick={handleFirstSkip}
                  className="text-xs text-slate-500 hover:text-slate-800 underline order-2 sm:order-1"
                >
                  I cannot think of another use
                </button>
              )}

              <button
                type="submit"
                disabled={!firstInputText.trim()}
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

  // ==========================================
  // PHASE 5: ADDITIONAL USES FLUENCY PHASE (60s)
  // ==========================================
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
            Object {trialNumber} of {totalTrials}: Additional Uses
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded font-mono text-sm font-bold shadow-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{secondsLeft}s remaining</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
          Now think of as many other alternative uses as you can.
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Type one alternative use at a time and click <strong>Add Use</strong> or press Enter.
        </p>

        <form onSubmit={handleAddResponse} className="flex gap-2 mb-6">
          <input
            type="text"
            id="additional_alternative_use_input"
            placeholder="Type another alternative use..."
            value={additionalInputText}
            onChange={(e) => setAdditionalInputText(e.target.value)}
            className="form-input text-sm"
            autoFocus
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!additionalInputText.trim()}
            className="btn-primary text-sm shrink-0 px-5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Use</span>
          </button>
        </form>

        {/* Live List of entered responses for this trial */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
            Your recorded responses for this object ({trialResponsesList.length}):
          </h4>
          
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {trialResponsesList.map((resp, idx) => (
              <div
                key={idx}
                className={`text-xs p-2.5 rounded border flex items-start gap-2.5 ${
                  resp.isFirst
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950 font-medium'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <span className={`font-semibold shrink-0 ${resp.isFirst ? 'text-amber-700' : 'text-slate-400'}`}>
                  {idx + 1}.
                </span>
                <span className="flex-1">{resp.text}</span>
                {resp.isFirst && (
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    First Use
                  </span>
                )}
              </div>
            ))}

            {trialResponsesList.length === 0 && (
              <p className="text-xs text-slate-400 italic">No alternative uses entered yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
