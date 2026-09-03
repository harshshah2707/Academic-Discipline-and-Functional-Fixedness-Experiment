import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { CheckCircle2, XCircle, FileText, AlertTriangle } from 'lucide-react';

export const ConsentScreen = () => {
  const { submitConsent } = useExperiment();
  const { settings } = useConfig();
  const [declined, setDeclined] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    isAdult: false,
    isVoluntary: false,
    canStop: false,
    givesConsent: false
  });

  const allChecked = checkboxes.isAdult && checkboxes.isVoluntary && checkboxes.canStop && checkboxes.givesConsent;

  const handleCheckboxChange = (field) => {
    setCheckboxes(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAgree = () => {
    if (!allChecked) return;
    submitConsent(true);
  };

  const handleDecline = () => {
    submitConsent(false);
    setDeclined(true);
  };

  if (declined) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="research-card-lg p-8 sm:p-10 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
            <XCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Participation Declined</h2>
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            You have chosen not to participate in this study. No data has been recorded. You may safely close this browser window.
          </p>
          <button
            onClick={() => setDeclined(false)}
            className="text-xs text-blue-600 hover:underline"
          >
            Reconsider and review consent form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Participant Information & Consent</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          Informed Consent Form
        </h2>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed mb-6 bg-slate-50 border border-slate-200 rounded-lg p-6 max-h-[300px] overflow-y-auto">
          <p>
            Please read the following information carefully before deciding whether to take part in this research project:
          </p>
          
          <div className="space-y-3 pl-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">•</span>
              <p><strong>Voluntary Participation:</strong> Your participation in this study is entirely voluntary. You may withdraw or stop participating at any time before submitting your responses without penalty.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">•</span>
              <p><strong>Anonymous Data Collection:</strong> Responses are collected anonymously and recorded under a participant ID. There are no right or wrong answers.</p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">•</span>
              <p><strong>Independent Responses:</strong> Please work independently and do not search for ideas online or ask others for suggestions during the study.</p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">•</span>
              <p><strong>Time Commitment:</strong> The study should take approximately <strong>{settings.estimatedTimeMin || '10–15'} minutes</strong> to complete.</p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">•</span>
              <p><strong>Eligibility:</strong> Participants must be at least 18 years old.</p>
            </div>
          </div>

          <p className="pt-2 text-xs text-slate-500 border-t border-slate-200">
            If you have questions regarding this research, you may contact the research team at {settings.contactEmail}.
          </p>
        </div>

        {/* Mandatory Consent Checkboxes */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-4 mb-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Consent Declarations (All required to continue):
          </h4>

          <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-800">
            <input
              type="checkbox"
              checked={checkboxes.isAdult}
              onChange={() => handleCheckboxChange('isAdult')}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>I am at least 18 years old.</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-800">
            <input
              type="checkbox"
              checked={checkboxes.isVoluntary}
              onChange={() => handleCheckboxChange('isVoluntary')}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>I understand that my participation is voluntary.</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-800">
            <input
              type="checkbox"
              checked={checkboxes.canStop}
              onChange={() => handleCheckboxChange('canStop')}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>I understand that I may stop participating before submitting my responses.</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-800 font-medium">
            <input
              type="checkbox"
              checked={checkboxes.givesConsent}
              onChange={() => handleCheckboxChange('givesConsent')}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>I consent to participate in this study.</span>
          </label>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleDecline}
            className="btn-secondary w-full sm:w-auto text-sm order-2 sm:order-1"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>I Do Not Consent</span>
          </button>

          <button
            onClick={handleAgree}
            disabled={!allChecked}
            className={`btn-primary w-full sm:w-auto text-sm order-1 sm:order-2 ${
              !allChecked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
