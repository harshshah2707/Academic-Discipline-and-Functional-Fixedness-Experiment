import React from 'react';
import { CONDITIONS } from '../../services/randomizationService';
import { Users, Scale, CheckCircle, AlertTriangle } from 'lucide-react';

export const GroupBalanceMatrix = ({ participants = [] }) => {
  // Count participants per cell
  const validParticipants = participants.filter(p => !p.is_excluded_by_researcher);

  const getCount = (disciplineKey, modality) => {
    return validParticipants.filter(p => {
      const disc = (p.discipline || '').toLowerCase();
      let matchDisc = false;
      if (disciplineKey === 'fine_arts') {
        matchDisc = disc.includes('fine') || disc.includes('art');
      } else if (disciplineKey === 'history') {
        matchDisc = disc.includes('history');
      } else {
        matchDisc = !disc.includes('fine') && !disc.includes('art') && !disc.includes('history');
      }

      return matchDisc && p.assigned_modality === modality;
    }).length;
  };

  const fineArtsPic = getCount('fine_arts', CONDITIONS.PICTURE);
  const fineArtsWord = getCount('fine_arts', CONDITIONS.WORD);
  const fineArtsTotal = fineArtsPic + fineArtsWord;

  const historyPic = getCount('history', CONDITIONS.PICTURE);
  const historyWord = getCount('history', CONDITIONS.WORD);
  const historyTotal = historyPic + historyWord;

  const otherPic = getCount('other', CONDITIONS.PICTURE);
  const otherWord = getCount('other', CONDITIONS.WORD);
  const otherTotal = otherPic + otherWord;

  const totalParticipants = validParticipants.length;
  const completedCount = validParticipants.filter(p => p.completion_status === 'Completed').length;

  const isBalanced = (a, b) => {
    if (a === 0 && b === 0) return true;
    return Math.abs(a - b) <= 1;
  };

  return (
    <div className="space-y-6">
      {/* Top summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Total Enrolled
          </span>
          <span className="text-2xl font-bold text-slate-900">{participants.length}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Participants</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Completed Sessions
          </span>
          <span className="text-2xl font-bold text-emerald-600">{completedCount}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {participants.length > 0 ? Math.round((completedCount / participants.length) * 100) : 0}% completion rate
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Primary 2×2 Eligible
          </span>
          <span className="text-2xl font-bold text-blue-600">{fineArtsTotal + historyTotal}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Fine Arts & History</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Other Disciplines
          </span>
          <span className="text-2xl font-bold text-slate-700">{otherTotal}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Secondary exploratory</span>
        </div>
      </div>

      {/* 2x2 Factorial Matrix Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">
              2 × 2 Factorial Design Allocation Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Real-time Stratified Assignment Monitor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-3 font-semibold text-slate-700">Academic Discipline (IV 1)</th>
                <th className="p-3 font-semibold text-slate-700 text-center">
                  Picture Condition (IV 2: A)
                </th>
                <th className="p-3 font-semibold text-slate-700 text-center">
                  Word Condition (IV 2: B)
                </th>
                <th className="p-3 font-semibold text-slate-700 text-center">Group Total</th>
                <th className="p-3 font-semibold text-slate-700 text-center">Balance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Row 1: Fine Arts */}
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-medium text-slate-900">
                  <span>Fine Arts / Visual Arts</span>
                  <span className="block text-xs text-slate-500 font-normal">Primary Study Group</span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 font-bold rounded-md text-base">
                    {fineArtsPic}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {fineArtsTotal > 0 ? Math.round((fineArtsPic / fineArtsTotal) * 100) : 0}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 font-bold rounded-md text-base">
                    {fineArtsWord}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {fineArtsTotal > 0 ? Math.round((fineArtsWord / fineArtsTotal) * 100) : 0}%
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-slate-900">
                  {fineArtsTotal}
                </td>
                <td className="p-3 text-center">
                  {isBalanced(fineArtsPic, fineArtsWord) ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      <CheckCircle className="w-3 h-3" /> Balanced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                      <AlertTriangle className="w-3 h-3" /> Slight Tilt ({fineArtsPic}:{fineArtsWord})
                    </span>
                  )}
                </td>
              </tr>

              {/* Row 2: History */}
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-medium text-slate-900">
                  <span>History</span>
                  <span className="block text-xs text-slate-500 font-normal">Primary Study Group</span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 font-bold rounded-md text-base">
                    {historyPic}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {historyTotal > 0 ? Math.round((historyPic / historyTotal) * 100) : 0}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 font-bold rounded-md text-base">
                    {historyWord}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {historyTotal > 0 ? Math.round((historyWord / historyTotal) * 100) : 0}%
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-slate-900">
                  {historyTotal}
                </td>
                <td className="p-3 text-center">
                  {isBalanced(historyPic, historyWord) ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      <CheckCircle className="w-3 h-3" /> Balanced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                      <AlertTriangle className="w-3 h-3" /> Slight Tilt ({historyPic}:{historyWord})
                    </span>
                  )}
                </td>
              </tr>

              {/* Row 3: Other Disciplines */}
              <tr className="hover:bg-slate-50/60 bg-slate-50/30">
                <td className="p-3 font-medium text-slate-600">
                  <span>Other Disciplines</span>
                  <span className="block text-xs text-slate-400 font-normal">Exploratory / Non-Primary</span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-md text-base">
                    {otherPic}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {otherTotal > 0 ? Math.round((otherPic / otherTotal) * 100) : 0}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-md text-base">
                    {otherWord}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {otherTotal > 0 ? Math.round((otherWord / otherTotal) * 100) : 0}%
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-slate-600">
                  {otherTotal}
                </td>
                <td className="p-3 text-center">
                  <span className="text-xs text-slate-500">—</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/70 font-semibold text-slate-900 border-t-2 border-slate-300">
                <td className="p-3">Total Condition Sums</td>
                <td className="p-3 text-center text-blue-900">{fineArtsPic + historyPic + otherPic}</td>
                <td className="p-3 text-center text-amber-900">{fineArtsWord + historyWord + otherWord}</td>
                <td className="p-3 text-center font-bold">{totalParticipants}</td>
                <td className="p-3 text-center text-xs text-slate-600 font-normal">
                  Target: 50% / 50% split
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
