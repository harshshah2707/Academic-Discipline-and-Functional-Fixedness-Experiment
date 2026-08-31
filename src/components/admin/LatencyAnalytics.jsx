import React from 'react';
import { CONDITIONS } from '../../services/randomizationService';
import { Timer, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export const LatencyAnalytics = ({ trials = [], participants = [] }) => {
  const partMap = new Map(participants.map(p => [p.participant_id, p]));

  // Filter out excluded participants
  const validTrials = trials.filter(t => {
    const p = partMap.get(t.participant_id);
    return p && !p.is_excluded_by_researcher;
  });

  // Calculate cell statistics
  const calculateCellStats = (discFilter, modality) => {
    const matching = validTrials.filter(t => {
      const p = partMap.get(t.participant_id);
      const disc = ((p && p.discipline) || t.discipline || '').toLowerCase();
      const matchDisc = discFilter(disc);
      const matchMod = (t.assigned_modality || (p && p.assigned_modality)) === modality;
      return matchDisc && matchMod && t.first_response_latency_ms != null && !t.no_response_flag;
    });

    if (matching.length === 0) {
      return { count: 0, meanLatencyMs: 0, meanLatencySec: 0, meanFluency: 0 };
    }

    const totalLatency = matching.reduce((sum, t) => sum + (t.first_response_latency_ms || 0), 0);
    const totalFluency = matching.reduce((sum, t) => sum + (t.number_of_additional_uses || 0), 0);

    const meanMs = Math.round(totalLatency / matching.length);
    const meanSec = (meanMs / 1000).toFixed(2);
    const meanFlu = (totalFluency / matching.length).toFixed(1);

    return {
      count: matching.length,
      meanLatencyMs: meanMs,
      meanLatencySec: parseFloat(meanSec),
      meanFluency: parseFloat(meanFlu)
    };
  };

  const isFineArts = (d) => d.includes('fine') || d.includes('art');
  const isHistory = (d) => d.includes('history');

  const faPic = calculateCellStats(isFineArts, CONDITIONS.PICTURE);
  const faWord = calculateCellStats(isFineArts, CONDITIONS.WORD);
  const histPic = calculateCellStats(isHistory, CONDITIONS.PICTURE);
  const histWord = calculateCellStats(isHistory, CONDITIONS.WORD);

  // Maximum latency for relative bar scaling
  const maxLatency = Math.max(
    faPic.meanLatencySec,
    faWord.meanLatencySec,
    histPic.meanLatencySec,
    histWord.meanLatencySec,
    8.0
  );

  return (
    <div className="space-y-6">
      {/* 2x2 Mean Latency Cards */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Primary Dependent Variable: Response Latency (Functional Fixedness)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Recorded via performance.now()
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-6">
          Mean latency to submit the first valid alternative use. Shorter latencies indicate faster overcoming of conventional functional representations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fine Arts Group */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>Fine Arts / Visual Arts</span>
              <span className="text-xs text-slate-500 font-normal">Discipline Group 1</span>
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Picture Condition</span>
                  <span className="font-bold text-slate-900">
                    {faPic.meanLatencySec}s ({faPic.meanLatencyMs} ms) [N={faPic.count}]
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(faPic.meanLatencySec / maxLatency) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Word Condition</span>
                  <span className="font-bold text-slate-900">
                    {faWord.meanLatencySec}s ({faWord.meanLatencyMs} ms) [N={faWord.count}]
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(faWord.meanLatencySec / maxLatency) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* History Group */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>History</span>
              <span className="text-xs text-slate-500 font-normal">Discipline Group 2</span>
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Picture Condition</span>
                  <span className="font-bold text-slate-900">
                    {histPic.meanLatencySec}s ({histPic.meanLatencyMs} ms) [N={histPic.count}]
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(histPic.meanLatencySec / maxLatency) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Word Condition</span>
                  <span className="font-bold text-slate-900">
                    {histWord.meanLatencySec}s ({histWord.meanLatencyMs} ms) [N={histWord.count}]
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(histWord.meanLatencySec / maxLatency) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative-Use Fluency Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Additional Measure: Alternative-Use Fluency
            </h3>
          </div>
          <span className="text-xs text-slate-500">60-second timed fluency task</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs text-slate-500 block">Fine Arts × Picture</span>
            <span className="text-xl font-bold text-slate-900">{faPic.meanFluency}</span>
            <span className="text-[10px] text-slate-400 block">uses / trial</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs text-slate-500 block">Fine Arts × Word</span>
            <span className="text-xl font-bold text-slate-900">{faWord.meanFluency}</span>
            <span className="text-[10px] text-slate-400 block">uses / trial</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs text-slate-500 block">History × Picture</span>
            <span className="text-xl font-bold text-slate-900">{histPic.meanFluency}</span>
            <span className="text-[10px] text-slate-400 block">uses / trial</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs text-slate-500 block">History × Word</span>
            <span className="text-xl font-bold text-slate-900">{histWord.meanFluency}</span>
            <span className="text-[10px] text-slate-400 block">uses / trial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
