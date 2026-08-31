/**
 * Storage Service
 * Handles persistence for participants, trials, individual responses, experimental configuration,
 * and active session states using localStorage with fallback handling.
 */

const STORAGE_KEYS = {
  PARTICIPANTS: 'psych_exp_participants',
  TRIALS: 'psych_exp_trials',
  RESPONSES: 'psych_exp_responses',
  CONFIG_OBJECTS: 'psych_exp_objects_config',
  CONFIG_SETTINGS: 'psych_exp_settings_config',
  ACTIVE_SESSION: 'psych_exp_active_session',
  ADMIN_AUTH: 'psych_exp_admin_authenticated'
};

const safeJsonParse = (str, fallback) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('Storage JSON parse error:', e);
    return fallback;
  }
};

export const storageService = {
  // --- Participants ---
  getParticipants: () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.PARTICIPANTS), []);
  },

  saveParticipant: (participantData) => {
    const list = storageService.getParticipants();
    const existingIdx = list.findIndex(p => p.participant_id === participantData.participant_id);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...participantData, updated_at: new Date().toISOString() };
    } else {
      list.push({ ...participantData, created_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
    return participantData;
  },

  deleteParticipant: (participantId) => {
    const list = storageService.getParticipants().filter(p => p.participant_id !== participantId);
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));

    // Also remove associated trials and responses
    const trials = storageService.getTrials().filter(t => t.participant_id !== participantId);
    localStorage.setItem(STORAGE_KEYS.TRIALS, JSON.stringify(trials));

    const responses = storageService.getResponses().filter(r => r.participant_id !== participantId);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  },

  toggleExcludeParticipant: (participantId) => {
    const list = storageService.getParticipants();
    const target = list.find(p => p.participant_id === participantId);
    if (target) {
      target.is_excluded_by_researcher = !target.is_excluded_by_researcher;
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
    }
  },

  // --- Trials ---
  getTrials: () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.TRIALS), []);
  },

  saveTrial: (trialData) => {
    const list = storageService.getTrials();
    const existingIdx = list.findIndex(
      t => t.participant_id === trialData.participant_id && t.trial_number === trialData.trial_number
    );
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...trialData };
    } else {
      list.push(trialData);
    }
    localStorage.setItem(STORAGE_KEYS.TRIALS, JSON.stringify(list));
    return trialData;
  },

  // --- Responses ---
  getResponses: () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.RESPONSES), []);
  },

  saveResponse: (responseData) => {
    const list = storageService.getResponses();
    list.push({
      ...responseData,
      saved_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(list));
    return responseData;
  },

  // --- Configuration ---
  getObjectsConfig: () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.CONFIG_OBJECTS), null);
  },

  saveObjectsConfig: (objectsList) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG_OBJECTS, JSON.stringify(objectsList));
  },

  getSettingsConfig: () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.CONFIG_SETTINGS), null);
  },

  saveSettingsConfig: (settings) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG_SETTINGS, JSON.stringify(settings));
  },

  // --- Active In-Progress Session (Crash recovery) ---
  getActiveSession: () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION), null);
  },

  saveActiveSession: (sessionState) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(sessionState));
  },

  clearActiveSession: () => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  },

  // --- Admin Authentication Cache ---
  getAdminAuth: () => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuth: (isAuth) => {
    if (isAuth) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  // --- Clear / Reset Database ---
  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
    localStorage.removeItem(STORAGE_KEYS.TRIALS);
    localStorage.removeItem(STORAGE_KEYS.RESPONSES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }
};
