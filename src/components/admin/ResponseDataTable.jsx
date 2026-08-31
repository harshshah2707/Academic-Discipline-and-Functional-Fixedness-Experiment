import React, { useState } from 'react';
import { MessageSquare, Search, Flag, Check, AlertTriangle } from 'lucide-react';

export const ResponseDataTable = ({ responses = [], objects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // Map object IDs/names to conventional functions for flagging checks
  const objMap = new Map(objects.map(o => [o.name.toUpperCase(), o.conventionalFunction || '']));

  // Intelligent Flagging System (Section 15)
  const evaluateFlags = (resp) => {
    const flags = [];
    const text = (resp.response_text || '').trim();

    if (!text || text === '[No alternative use generated]') {
      flags.push({ label: 'Empty / Skipped', level: 'warning' });
      return flags;
    }

    if (text.length < 3) {
      flags.push({ label: 'Very Short (< 3 chars)', level: 'warning' });
    }

    // Check if identical or very close to conventional function
    const convFunc = objMap.get((resp.object_name || '').toUpperCase()) || '';
    if (convFunc) {
      const normResp = text.toLowerCase();
      const normConv = convFunc.toLowerCase();
      if (normConv.includes(normResp) && normResp.length > 8) {
        flags.push({ label: 'Matches Conventional Function', level: 'danger' });
      }
    }

    return flags;
  };

  const filteredResponses = responses.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.participant_id || '').toLowerCase().includes(term) ||
      (r.object_name || '').toLowerCase().includes(term) ||
      (r.response_text || '').toLowerCase().includes(term);

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'FIRST' && r.response_type === 'First response') ||
      (filterType === 'ADDITIONAL' && r.response_type === 'Additional response');

    const flags = evaluateFlags(r);
    const matchesFlag = !onlyFlagged || flags.length > 0;

    return matchesSearch && matchesType && matchesFlag;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-base">
            Raw Qualitative Responses & Flagging Inspector ({responses.length} responses)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search response text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input text-xs pl-8 py-1.5"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input text-xs py-1.5 w-auto"
          >
            <option value="ALL">All Response Types</option>
            <option value="FIRST">First Responses Only</option>
            <option value="ADDITIONAL">Additional Uses Only</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyFlagged}
              onChange={(e) => setOnlyFlagged(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="font-medium">Flagged for Review</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <th className="p-2.5 font-semibold">Participant</th>
              <th className="p-2.5 font-semibold">Trial #</th>
              <th className="p-2.5 font-semibold">Object</th>
              <th className="p-2.5 font-semibold">Type</th>
              <th className="p-2.5 font-semibold">#</th>
              <th className="p-2.5 font-semibold">Raw Participant Response (Exact)</th>
              <th className="p-2.5 font-semibold text-right">Time from Start</th>
              <th className="p-2.5 font-semibold">Researcher Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredResponses.map((r, idx) => {
              const flags = evaluateFlags(r);

              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-slate-900">
                    {r.participant_id}
                  </td>
                  <td className="p-2.5 text-slate-600 font-medium">#{r.trial_number}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{r.object_name}</td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        r.response_type === 'First response'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.response_type}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-500 font-bold">{r.response_number}</td>
                  <td className="p-2.5 font-medium text-slate-900 max-w-md">
                    {r.response_text}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600">
                    {r.response_time_from_trial_start || '—'}
                  </td>
                  <td className="p-2.5">
                    {flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {flags.map((f, fIdx) => (
                          <span
                            key={fIdx}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              f.level === 'danger'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <Flag className="w-2.5 h-2.5" />
                            <span>{f.label}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Valid</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredResponses.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  No responses found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
