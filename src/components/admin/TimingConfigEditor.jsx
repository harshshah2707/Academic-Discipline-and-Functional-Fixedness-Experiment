import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';

export const TimingConfigEditor = () => {
  const { settings, updateSettings } = useConfig();
  const [savedNotice, setSavedNotice] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    fixationDurationMs: settings.fixationDurationMs || 500,
    stimulusDurationMs: settings.stimulusDurationMs || 2000,
    conventionalDurationMs: settings.conventionalDurationMs || 2500,
    additionalUsesDurationSec: settings.additionalUsesDurationSec || 60,
    showConventionalFunction: settings.showConventionalFunction !== false,
    showTimerOnFirstUse: settings.showTimerOnFirstUse || false,
    adminPassword: settings.adminPassword || 'researcher2026'
  });

  const handleChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ...localSettings,
      fixationDurationMs: parseInt(localSettings.fixationDurationMs, 10),
      stimulusDurationMs: parseInt(localSettings.stimulusDurationMs, 10),
      conventionalDurationMs: parseInt(localSettings.conventionalDurationMs, 10),
      additionalUsesDurationSec: parseInt(localSettings.additionalUsesDurationSec, 10)
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-base">
            Experimental Timing & Control Parameters
          </h3>
        </div>
        {savedNotice && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-medium border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings saved successfully</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-sm">
        {/* Phase Timings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label htmlFor="fixation_dur" className="block text-xs font-semibold text-slate-800 mb-1">
              Phase 1: Fixation Cross (+) Duration (ms)
            </label>
            <input
              id="fixation_dur"
              type="number"
              min="100"
              max="5000"
              step="50"
              value={localSettings.fixationDurationMs}
              onChange={(e) => handleChange('fixationDurationMs', e.target.value)}
              className="form-input text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Default: 500 ms (0.5 seconds)</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label htmlFor="stimulus_dur" className="block text-xs font-semibold text-slate-800 mb-1">
              Phase 2: Stimulus (Picture/Word) Duration (ms)
            </label>
            <input
              id="stimulus_dur"
              type="number"
              min="500"
              max="10000"
              step="100"
              value={localSettings.stimulusDurationMs}
              onChange={(e) => handleChange('stimulusDurationMs', e.target.value)}
              className="form-input text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Default: 2000 ms (2.0 seconds)</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label htmlFor="conv_dur" className="block text-xs font-semibold text-slate-800 mb-1">
              Phase 3: Conventional Function Duration (ms)
            </label>
            <input
              id="conv_dur"
              type="number"
              min="500"
              max="10000"
              step="100"
              value={localSettings.conventionalDurationMs}
              onChange={(e) => handleChange('conventionalDurationMs', e.target.value)}
              className="form-input text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Default: 2500 ms (2.5 seconds)</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label htmlFor="fluency_dur" className="block text-xs font-semibold text-slate-800 mb-1">
              Phase 5: Additional Uses Fluency Duration (Seconds)
            </label>
            <input
              id="fluency_dur"
              type="number"
              min="10"
              max="300"
              step="5"
              value={localSettings.additionalUsesDurationSec}
              onChange={(e) => handleChange('additionalUsesDurationSec', e.target.value)}
              className="form-input text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Default: 60 seconds</p>
          </div>
        </div>

        {/* Toggles & Controls */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Experimental Controls & Display Toggles
          </h4>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800 block text-xs">
                Display Conventional Function Statement (Phase 3)
              </span>
              <span className="text-[11px] text-slate-500">
                Shows the standard function (e.g. "A paperclip is commonly used to hold sheets of paper together")
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.showConventionalFunction}
                onChange={(e) => handleChange('showConventionalFunction', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div>
              <span className="font-medium text-slate-800 block text-xs">
                Show Visible Timer on First Response Screen
              </span>
              <span className="text-[11px] text-slate-500">
                Standard methodology leaves this hidden to avoid pressure (Default: Off)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.showTimerOnFirstUse}
                onChange={(e) => handleChange('showTimerOnFirstUse', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
          </div>
        </div>

        {/* Security / Password */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <label htmlFor="admin_pass_config" className="block text-xs font-semibold text-slate-800 mb-1">
            Researcher Access Password
          </label>
          <input
            id="admin_pass_config"
            type="text"
            value={localSettings.adminPassword}
            onChange={(e) => handleChange('adminPassword', e.target.value)}
            className="form-input text-xs max-w-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-primary text-xs py-2 px-5">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
