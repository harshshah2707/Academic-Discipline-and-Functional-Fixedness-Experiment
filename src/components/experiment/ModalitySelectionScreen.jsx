import React, { useState } from 'react';
import { useExperiment, EXPERIMENT_STEPS } from '../../context/ExperimentContext';
import { CONDITIONS } from '../../services/randomizationService';
import { Image, Type, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { StimulusSvg } from '../../config/svgStimuli';

export const ModalitySelectionScreen = () => {
  const { assignedModality, selectModality } = useExperiment();
  const [selectedFormat, setSelectedFormat] = useState(assignedModality || null);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedFormat) return;
    selectModality(selectedFormat);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 animate-fade-in">
      <div className="research-card-lg p-8 sm:p-10">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-indigo-50 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded border border-indigo-200">
            Study Protocol • Modality Selection
          </span>
          <span className="text-xs text-slate-400 font-medium">Step 3 of 6</span>
        </div>

        {/* Screen Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Select Stimulus Presentation Format
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed">
          During the experimental tasks, familiar everyday objects (e.g., coin, brick, paperclip, spoon) will be presented to you one at a time. Please select the format in which you would like objects to appear:
        </p>

        {/* 2 Factorial Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* OPTION 1: PICTURE CONDITION (VISUAL IMAGES) */}
          <div
            onClick={() => setSelectedFormat(CONDITIONS.PICTURE)}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all relative flex flex-col justify-between ${
              selectedFormat === CONDITIONS.PICTURE
                ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  selectedFormat === CONDITIONS.PICTURE ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Image className="w-6 h-6" />
                </div>
                {selectedFormat === CONDITIONS.PICTURE && (
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1.5">
                Visual Images (Picture Format)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Objects will be presented as clear visual drawings / illustrations without written words.
              </p>
            </div>

            {/* Preview Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                <StimulusSvg name="coin" className="w-9 h-9" />
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                <StimulusSvg name="brick" className="w-9 h-9" />
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                <StimulusSvg name="paperclip" className="w-9 h-9" />
              </div>
            </div>
          </div>

          {/* OPTION 2: WORD CONDITION (TEXT NAMES) */}
          <div
            onClick={() => setSelectedFormat(CONDITIONS.WORD)}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all relative flex flex-col justify-between ${
              selectedFormat === CONDITIONS.WORD
                ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  selectedFormat === CONDITIONS.WORD ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Type className="w-6 h-6" />
                </div>
                {selectedFormat === CONDITIONS.WORD && (
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1.5">
                Written Words (Text Format)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Objects will be presented as large, clean written word labels without visual images.
              </p>
            </div>

            {/* Preview Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-center gap-2">
              <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-slate-800">
                COIN
              </span>
              <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-slate-800">
                BRICK
              </span>
              <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-slate-800">
                PAPERCLIP
              </span>
            </div>
          </div>

        </div>

        {/* Confirmation Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {selectedFormat ? (
              <span>Your selected format: <strong className="text-slate-900">{selectedFormat}</strong></span>
            ) : (
              <span>Please click one of the options above to proceed.</span>
            )}
          </p>

          <button
            onClick={handleConfirm}
            disabled={!selectedFormat}
            className={`btn-primary text-sm py-2.5 px-6 flex items-center gap-2 ${
              !selectedFormat ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Confirm Format & Continue to Instructions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
