import React, { useState } from 'react';
import { Layers, Search, Clock } from 'lucide-react';

export const TrialDataTable = ({ trials = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrials = trials.filter(t => {
    const term = searchQuery.toLowerCase();
    return (
      (t.participant_id || '').toLowerCase().includes(term) ||
      (t.object_name || '').toLowerCase().includes(term) ||
      (t.first_response || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-base">
            Trial-Level Experimental Logs ({trials.length} trials)
          </h3>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, object, response..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input text-xs pl-8 py-1.5"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <th className="p-2.5 font-semibold">Participant</th>
              <th className="p-2.5 font-semibold">Trial #</th>
              <th className="p-2.5 font-semibold">Object</th>
              <th className="p-2.5 font-semibold">Modality</th>
              <th className="p-2.5 font-semibold">First Alternative Use</th>
              <th className="p-2.5 font-semibold text-right">Latency (ms)</th>
              <th className="p-2.5 font-semibold text-right">Latency (s)</th>
              <th className="p-2.5 font-semibold text-center">Fluency Count</th>
              <th className="p-2.5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredTrials.map((t, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 font-mono font-bold text-slate-900">
                  {t.participant_id}
                </td>
                <td className="p-2.5 text-slate-600 font-medium">#{t.trial_number}</td>
                <td className="p-2.5 font-semibold text-slate-800">{t.object_name}</td>
                <td className="p-2.5">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium ${
                      (t.assigned_modality || '').includes('Picture')
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {t.assigned_modality || '—'}
                  </span>
                </td>
                <td className="p-2.5 max-w-xs truncate text-slate-800" title={t.first_response}>
                  {t.no_response_flag ? (
                    <span className="italic text-slate-400">[No response provided]</span>
                  ) : (
                    t.first_response || '—'
                  )}
                </td>
                <td className="p-2.5 text-right font-mono font-medium text-slate-900">
                  {t.first_response_latency_ms != null ? `${t.first_response_latency_ms} ms` : '—'}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {t.first_response_latency_seconds != null ? `${t.first_response_latency_seconds}s` : '—'}
                </td>
                <td className="p-2.5 text-center font-bold text-slate-900">
                  {t.number_of_additional_uses || 0}
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                    {t.trial_completion_status || 'Completed'}
                  </span>
                </td>
              </tr>
            ))}

            {filteredTrials.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-400">
                  No trial records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
