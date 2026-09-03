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
      'gender',
      'academic_discipline',
      'discipline_specified',
      'year_of_study',
      'previous_visual_arts_training',
      'years_of_visual_arts_training',
      'assigned_modality',
      'eligibility_status',
      'familiarity_ratings',
      'cognitive_strategy',
      'instruction_understanding',
      'technical_problems',
      'technical_problems_details',
      'prior_knowledge_of_functional_fixedness',
      'external_help_used',
      'completion_status',
      'date_and_time',
      'completed_at'
    ];

    const rows = participants.map(p => {
      const famStr = typeof p.familiarity_ratings === 'object' ? JSON.stringify(p.familiarity_ratings) : (p.familiarity_ratings || '');
      return [
        escapeCsv(p.participant_id),
        escapeCsv(p.age),
        escapeCsv(p.gender || ''),
        escapeCsv(p.discipline || p.academic_discipline || ''),
        escapeCsv(p.discipline_specified || ''),
        escapeCsv(p.study_year || p.study_level || p.study_year_semester || ''),
        escapeCsv(p.visual_arts_training || p.previous_visual_arts_training || ''),
        escapeCsv(p.visual_arts_training_years || p.years_of_visual_arts_training || p.visual_arts_training_details || ''),
        escapeCsv(p.assigned_modality),
        escapeCsv(p.eligibility_status),
        escapeCsv(famStr),
        escapeCsv(p.cognitive_strategy || ''),
        escapeCsv(p.instruction_understanding || ''),
        escapeCsv(p.technical_problems || ''),
        escapeCsv(p.technical_problems_details || ''),
        escapeCsv(p.prior_knowledge_of_functional_fixedness || ''),
        escapeCsv(p.external_help_used || ''),
        escapeCsv(p.completion_status || 'Incomplete'),
        escapeCsv(p.created_at || ''),
        escapeCsv(p.completed_at || '')
      ].join(',');
    });

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
      'academic_discipline',
      'assigned_modality',
      'trial_number',
      'object_id',
      'object_name',
      'object_order',
      'first_response',
      'first_response_latency_ms',
      'first_response_latency_seconds',
      'all_additional_responses',
      'number_of_additional_responses',
      'total_number_of_responses',
      'trial_completion_time',
      'conventional_function_shown',
      // Qualitative Coding Columns (Initial empty for coders)
      'response_validity',
      'response_type',
      'canonical_related',
      'property_based',
      'novelty_rating',
      'coder_1',
      'coder_2'
    ];

    const responses = storageService.getResponses();

    const rows = trials.map(t => {
      const p = partMap.get(t.participant_id) || {};
      const latencyMs = t.first_response_latency_ms != null ? t.first_response_latency_ms : '';
      const latencySec = t.first_response_latency_seconds != null ? t.first_response_latency_seconds : (latencyMs !== '' ? (latencyMs / 1000).toFixed(3) : '');
      
      const trialResponses = responses.filter(r => r.participant_id === t.participant_id && r.trial_number === t.trial_number);
      const additionalResponses = trialResponses.filter(r => r.response_number > 1).map(r => r.response_text).join(' | ');
      const numAdditional = t.number_of_additional_uses != null ? t.number_of_additional_uses : trialResponses.filter(r => r.response_number > 1).length;
      const totalResponses = (t.first_response ? 1 : 0) + numAdditional;

      return [
        escapeCsv(t.participant_id),
        escapeCsv(t.discipline || p.discipline || p.academic_discipline || ''),
        escapeCsv(t.assigned_modality || p.assigned_modality || ''),
        escapeCsv(t.trial_number),
        escapeCsv(t.object_id),
        escapeCsv(t.object_name),
        escapeCsv(t.trial_number),
        escapeCsv(t.first_response || ''),
        escapeCsv(latencyMs),
        escapeCsv(latencySec),
        escapeCsv(additionalResponses),
        escapeCsv(numAdditional),
        escapeCsv(totalResponses),
        escapeCsv(t.completed_at || t.trial_completion_status || 'Completed'),
        escapeCsv(t.conventional_function_shown !== false ? 'Yes' : 'No'),
        // Coding columns left empty for independent coders
        '""', '""', '""', '""', '""', '""', '""'
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
      'response_time_from_trial_start',
      // Qualitative Coding Columns (Initial empty for coders)
      'response_validity',
      'canonical_related',
      'property_based',
      'novelty_rating',
      'coder_1',
      'coder_2'
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
      escapeCsv(r.response_time_from_trial_start),
      '""', '""', '""', '""', '""', '""'
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
