import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { storageService } from '../../services/storageService';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const { settings } = useConfig();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = settings.adminPassword || 'researcher2026';

    if (password === correctPassword) {
      storageService.setAdminAuth(true);
      onLoginSuccess();
    } else {
      setError('Incorrect researcher password. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-800">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-1">
          Researcher Administration
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Access study data, group balance monitors, stimulus configuration, and exports.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin_pass" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Researcher Password
            </label>
            <input
              id="admin_pass"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input text-sm"
              autoFocus
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Default password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">researcher2026</code>
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary text-xs w-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Experiment</span>
            </button>

            <button
              type="submit"
              className="btn-primary text-xs w-full"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authenticate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
