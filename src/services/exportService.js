import { storageService } from './storageService';

/**
 * CSV / JSON Export Service
 * Generates properly formatted CSVs conforming precisely to the 3 dataset specifications in Section 22.
 */

// Helper to escape CSV values safely
const escapeCsv = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // Replace double quotes with escaped double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
};

// Trigger browser download for text content
const downloadFile = (filename, content, mimeType = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportService = {
  /**
   * DATASET 1: PARTICIPANT LEVEL
   * One row per participant
   */
  exportDataset1ParticipantsCsv: () => {
    const participants = storageService.getParticipants();
    const headers = [
      'participant_id',
      'age',
      'discipline',
      'discipline_specified',
      'study_level',
      'study_year_semester',
      'visual_arts_training',
      'visual_arts_training_details',
      'creative_activity_frequency',
      'assigned_modality',
      'eligibility_status',
      'instruction_understanding',
      'technical_problems',
      'technical_problems_details',
      'prior_knowledge_of_functional_fixedness',
      'external_help_used',
      'completion_status',
      'is_excluded_by_researcher',
      'session_start_time',
      'session_end_time'
    ];

    const rows = participants.map(p => [
      escapeCsv(p.participant_id),
      escapeCsv(p.age),
      escapeCsv(p.discipline),
      escapeCsv(p.discipline_specified || ''),
      escapeCsv(p.study_level),
      escapeCsv(p.study_year_semester || ''),
      escapeCsv(p.visual_arts_training),
      escapeCsv(p.visual_arts_training_details || ''),
      escapeCsv(p.creative_activity_frequency),
      escapeCsv(p.assigned_modality),
      escapeCsv(p.eligibility_status),
      escapeCsv(p.instruction_understanding || ''),
      escapeCsv(p.technical_problems || ''),
      escapeCsv(p.technical_problems_details || ''),
      escapeCsv(p.prior_knowledge_of_functional_fixedness || ''),
      escapeCsv(p.external_help_used || ''),
      escapeCsv(p.completion_status || 'Incomplete'),
      escapeCsv(p.is_excluded_by_researcher ? 'Yes' : 'No'),
      escapeCsv(p.created_at || ''),
      escapeCsv(p.completed_at || '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(`dataset_1_participant_level_${timestamp}.csv`, csvContent);
  },

  /**
   * DATASET 2: TRIAL LEVEL
   * One row per object trial
   */
  exportDataset2TrialsCsv: () => {
    const trials = storageService.getTrials();
    const participants = storageService.getParticipants();
    const partMap = new Map(participants.map(p => [p.participant_id, p]));

    const headers = [
      'participant_id',
      'discipline',
      'assigned_modality',
      'trial_number',
      'object_id',
      'object_name',
      'first_response',
      'first_response_latency_ms',
      'first_response_latency_seconds',
      'no_response_flag',
      'number_of_additional_uses',
      'trial_completion_status',
      'conventional_function_shown'
    ];

    const rows = trials.map(t => {
      const p = partMap.get(t.participant_id) || {};
      const latencyMs = t.first_response_latency_ms != null ? t.first_response_latency_ms : '';
      const latencySec = t.first_response_latency_seconds != null ? t.first_response_latency_seconds : (latencyMs !== '' ? (latencyMs / 1000).toFixed(3) : '');

      return [
        escapeCsv(t.participant_id),
        escapeCsv(t.discipline || p.discipline || ''),
        escapeCsv(t.assigned_modality || p.assigned_modality || ''),
        escapeCsv(t.trial_number),
        escapeCsv(t.object_id),
        escapeCsv(t.object_name),
        escapeCsv(t.first_response || ''),
        escapeCsv(latencyMs),
        escapeCsv(latencySec),
        escapeCsv(t.no_response_flag ? 'True' : 'False'),
        escapeCsv(t.number_of_additional_uses || 0),
        escapeCsv(t.trial_completion_status || 'Completed'),
        escapeCsv(t.conventional_function_shown !== false ? 'Yes' : 'No')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(`dataset_2_trial_level_${timestamp}.csv`, csvContent);
  },

  /**
   * DATASET 3: RESPONSE LEVEL
   * One row for every individual response
   */
  exportDataset3ResponsesCsv: () => {
    const responses = storageService.getResponses();
    const headers = [
      'participant_id',
      'trial_number',
      'object_id',
      'object_name',
      'response_number',
      'response_type',
      'response_text',
      'response_timestamp',
      'response_time_from_trial_start'
    ];

    const rows = responses.map(r => [
      escapeCsv(r.participant_id),
      escapeCsv(r.trial_number),
      escapeCsv(r.object_id),
      escapeCsv(r.object_name || ''),
      escapeCsv(r.response_number),
      escapeCsv(r.response_type),
      escapeCsv(r.response_text),
      escapeCsv(r.response_timestamp),
      escapeCsv(r.response_time_from_trial_start)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(`dataset_3_response_level_${timestamp}.csv`, csvContent);
  },

  /**
   * Full Database JSON Export
   */
  exportAllDataJson: () => {
    const data = {
      exported_at: new Date().toISOString(),
      participants: storageService.getParticipants(),
      trials: storageService.getTrials(),
      responses: storageService.getResponses(),
      objects_config: storageService.getObjectsConfig(),
      settings_config: storageService.getSettingsConfig()
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(`experiment_complete_backup_${timestamp}.json`, jsonStr, 'application/json;charset=utf-8;');
  }
};
