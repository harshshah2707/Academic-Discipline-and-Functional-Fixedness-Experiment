/**
 * Default experimental parameters, phase durations, and researcher configuration settings.
 */
export const DEFAULT_EXPERIMENT_SETTINGS = {
  // Phase Durations (in milliseconds or seconds)
  fixationDurationMs: 500,               // Phase 1: Cross fixation duration
  stimulusDurationMs: 2000,              // Phase 2: Stimulus image or word duration
  conventionalDurationMs: 2500,          // Phase 3: Conventional function duration
  additionalUsesDurationSec: 60,         // Phase 5: Additional uses fluency countdown in seconds
  practiceAdditionalDurationSec: 25,     // Practice additional uses duration in seconds

  // Experimental Controls & Toggles
  showConventionalFunction: true,        // Toggle conventional function statement display
  showTimerOnFirstUse: false,            // Toggle whether countdown/timer is visible on first use screen (default: false as required)
  allowSkipFirstResponse: true,          // Shows "I cannot think of another use" button
  requireMinChars: 2,                    // Minimum characters for valid input entry

  // Admin & Security
  adminPassword: 'researcher2026',

  // Institution / Study metadata
  studyTitle: 'Academic Discipline, Stimulus Modality, and Functional Fixedness',
  participantFacingTitle: 'Thinking About Everyday Objects',
  estimatedTimeMin: '15–20',
  contactEmail: 'research.cognition@university.edu'
};
