import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Users, EyeOff, Eye, Trash2, Search, Filter, AlertCircle } from 'lucide-react';

export const ParticipantTable = ({ participants = [], onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('ALL');
  const [filterModality, setFilterModality] = useState('ALL');

  const handleToggleExclude = (participantId) => {
    storageService.toggleExcludeParticipant(participantId);
    if (onDataChange) onDataChange();
  };

  const handleDelete = (participantId) => {
    if (window.confirm(`Are you sure you want to permanently delete participant ${participantId} and all their trial responses?`)) {
      storageService.deleteParticipant(participantId);
      if (onDataChange) onDataChange();
    }
  };

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (p.participant_id || '').toLowerCase().includes(term) ||
      (p.discipline || '').toLowerCase().includes(term) ||
      (p.discipline_specified || '').toLowerCase().includes(term);

    const matchesDisc =
      filterDiscipline === 'ALL' ||
      (filterDiscipline === 'FINE_ARTS' && ((p.discipline || '').toLowerCase().includes('fine') || (p.discipline || '').toLowerCase().includes('art'))) ||
      (filterDiscipline === 'HISTORY' && (p.discipline || '').toLowerCase().includes('history')) ||
      (filterDiscipline === 'OTHER' && !(p.discipline || '').toLowerCase().includes('fine') && !(p.discipline || '').toLowerCase().includes('art') && !(p.discipline || '').toLowerCase().includes('history'));

    const matchesMod =
      filterModality === 'ALL' ||
      (filterModality === 'PICTURE' && (p.assigned_modality || '').includes('Picture')) ||
      (filterModality === 'WORD' && (p.assigned_modality || '').includes('Word'));

    return matchesSearch && matchesDisc && matchesMod;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-base">
            Enrolled Participants ({participants.length})
          </h3>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID / major..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input text-xs pl-8 py-1.5"
            />
          </div>

          <select
            value={filterDiscipline}
            onChange={(e) => setFilterDiscipline(e.target.value)}
            className="form-input text-xs py-1.5 w-auto"
          >
            <option value="ALL">All Disciplines</option>
            <option value="FINE_ARTS">Fine Arts</option>
            <option value="HISTORY">History</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={filterModality}
            onChange={(e) => setFilterModality(e.target.value)}
            className="form-input text-xs py-1.5 w-auto"
          >
            <option value="ALL">All Modalities</option>
            <option value="PICTURE">Picture Condition</option>
            <option value="WORD">Word Condition</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <th className="p-2.5 font-semibold">Participant ID</th>
              <th className="p-2.5 font-semibold">Age</th>
              <th className="p-2.5 font-semibold">Discipline</th>
              <th className="p-2.5 font-semibold">Study Level</th>
              <th className="p-2.5 font-semibold">Modality</th>
              <th className="p-2.5 font-semibold">Creative Freq.</th>
              <th className="p-2.5 font-semibold">Eligibility Status</th>
              <th className="p-2.5 font-semibold">Status</th>
              <th className="p-2.5 font-semibold text-center">Exclude</th>
              <th className="p-2.5 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredParticipants.map((p) => (
              <tr
                key={p.participant_id}
                className={`hover:bg-slate-50 transition-colors ${
                  p.is_excluded_by_researcher ? 'opacity-50 bg-slate-100/50' : ''
                }`}
              >
                <td className="p-2.5 font-mono font-bold text-slate-900">
                  {p.participant_id}
                </td>
                <td className="p-2.5">{p.age || '—'}</td>
                <td className="p-2.5">
                  <span className="font-medium text-slate-800">{p.discipline || '—'}</span>
                  {p.discipline_specified && (
                    <span className="block text-[11px] text-slate-500">({p.discipline_specified})</span>
                  )}
                </td>
                <td className="p-2.5">{p.study_level || '—'}</td>
                <td className="p-2.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-medium ${
                      (p.assigned_modality || '').includes('Picture')
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {p.assigned_modality || '—'}
                  </span>
                </td>
                <td className="p-2.5">{p.creative_activity_frequency || '—'}</td>
                <td className="p-2.5">
                  <span
                    className={`inline-block text-[11px] px-1.5 py-0.5 rounded ${
                      (p.eligibility_status || '').includes('Eligible for primary')
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {p.eligibility_status || '—'}
                  </span>
                </td>
                <td className="p-2.5">
                  <span
                    className={`inline-block text-[11px] px-1.5 py-0.5 rounded font-medium ${
                      p.completion_status === 'Completed'
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-amber-700 bg-amber-50'
                    }`}
                  >
                    {p.completion_status || 'In Progress'}
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <button
                    onClick={() => handleToggleExclude(p.participant_id)}
                    className={`px-2 py-1 rounded text-[11px] transition-colors ${
                      p.is_excluded_by_researcher
                        ? 'bg-red-100 text-red-700 font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={p.is_excluded_by_researcher ? 'Include in analysis' : 'Mark for exclusion from analysis'}
                  >
                    {p.is_excluded_by_researcher ? 'Excluded' : 'Active'}
                  </button>
                </td>
                <td className="p-2.5 text-center">
                  <button
                    onClick={() => handleDelete(p.participant_id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Delete participant data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {filteredParticipants.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-slate-400">
                  No participants matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
