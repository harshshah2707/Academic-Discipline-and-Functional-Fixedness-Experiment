/**
 * Google Sheets Synchronization Service
 * 
 * Target Google Sheet ID: 1JUt6AaxLhY6FtC_vcFSEGnoswqp7KL_YH47vQf-oGQU
 * Sheet URL: https://docs.google.com/spreadsheets/d/1JUt6AaxLhY6FtC_vcFSEGnoswqp7KL_YH47vQf-oGQU/edit
 * 
 * Supports automated real-time pushing of Participant, Trial, and Response datasets
 * to Google Sheets via Google Apps Script Web App Endpoint.
 */

const GOOGLE_SHEET_STORAGE_KEY = 'psych_exp_google_sheets_webhook_url';
export const DEFAULT_SHEET_ID = '1JUt6AaxLhY6FtC_vcFSEGnoswqp7KL_YH47vQf-oGQU';
export const DEFAULT_SHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/edit`;

export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwelfd9_51-coBy8Sv6HIlMg_29b483gAJu35hjK838FXHbqJuSaix20PampK7RNI2m8g/exec';

export const googleSheetsService = {
  getWebhookUrl: () => {
    return localStorage.getItem(GOOGLE_SHEET_STORAGE_KEY) || DEFAULT_WEBHOOK_URL;
  },

  setWebhookUrl: (url) => {
    localStorage.setItem(GOOGLE_SHEET_STORAGE_KEY, (url || '').trim());
  },

  /**
   * Syncs a payload (single trial, response, participant, or batch) to the Google Apps Script Webhook
   */
  syncToGoogleSheets: async (payload) => {
    const webhookUrl = googleSheetsService.getWebhookUrl();
    if (!webhookUrl) {
      return { success: false, reason: 'Webhook URL not configured' };
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Error syncing data to Google Sheets:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Batch syncs all local participants, trials, and responses to the configured Google Sheet
   */
  syncAllLocalData: async (participants, trials, responses) => {
    const webhookUrl = googleSheetsService.getWebhookUrl();
    if (!webhookUrl) {
      throw new Error('Please enter your Google Apps Script Web App URL first.');
    }

    const payload = {
      action: 'sync_all',
      timestamp: new Date().toISOString(),
      participants,
      trials,
      responses
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });
      return { success: true };
    } catch (err) {
      console.error('Batch sync failed:', err);
      throw err;
    }
  },

  /**
   * Returns the exact, ready-to-paste Google Apps Script code for the user's Google Sheet
   */
  getAppsScriptCode: (sheetId = DEFAULT_SHEET_ID) => {
    return `/**
 * Google Apps Script for Cognitive Psychology Experiment Data Sync
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/${sheetId}/edit
 */

var SPREADSHEET_ID = "${sheetId}";

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000); // 30 second timeout

    var ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch(err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    if (!ss) {
      throw new Error("Could not access spreadsheet with ID " + SPREADSHEET_ID);
    }

    initSheets(ss);

    var data = JSON.parse(e.postData.contents);

    if (data.action === 'sync_all') {
      // Batch sync
      if (data.participants && data.participants.length > 0) {
        var partSheet = ss.getSheetByName('Participants');
        data.participants.forEach(function(p) {
          partSheet.appendRow([
            p.participant_id,
            p.age,
            p.discipline,
            p.discipline_specified || '',
            p.study_level,
            p.study_year_semester || '',
            p.visual_arts_training,
            p.visual_arts_training_details || '',
            p.creative_activity_frequency,
            p.assigned_modality,
            p.eligibility_status,
            p.instruction_understanding || '',
            p.technical_problems || '',
            p.technical_problems_details || '',
            p.prior_knowledge_of_functional_fixedness || '',
            p.external_help_used || '',
            p.completion_status || 'Completed',
            p.is_excluded_by_researcher ? 'Yes' : 'No',
            p.created_at || new Date().toISOString(),
            p.completed_at || ''
          ]);
        });
      }

      if (data.trials && data.trials.length > 0) {
        var trialSheet = ss.getSheetByName('Trials');
        data.trials.forEach(function(t) {
          trialSheet.appendRow([
            t.participant_id,
            t.discipline || '',
            t.assigned_modality || '',
            t.trial_number,
            t.object_id,
            t.object_name,
            t.first_response || '',
            t.first_response_latency_ms || '',
            t.first_response_latency_seconds || '',
            t.no_response_flag ? 'True' : 'False',
            t.number_of_additional_uses || 0,
            t.trial_completion_status || 'Completed',
            t.conventional_function_shown ? 'Yes' : 'No'
          ]);
        });
      }

      if (data.responses && data.responses.length > 0) {
        var respSheet = ss.getSheetByName('Responses');
        data.responses.forEach(function(r) {
          respSheet.appendRow([
            r.participant_id,
            r.trial_number,
            r.object_id,
            r.object_name || '',
            r.response_number,
            r.response_type,
            r.response_text,
            r.response_timestamp || new Date().toISOString(),
            r.response_time_from_trial_start || ''
          ]);
        });
      }
    } else if (data.type === 'participant') {
      var p = data.payload;
      var partSheet = ss.getSheetByName('Participants');
      partSheet.appendRow([
        p.participant_id,
        p.age,
        p.discipline,
        p.discipline_specified || '',
        p.study_level,
        p.study_year_semester || '',
        p.visual_arts_training,
        p.visual_arts_training_details || '',
        p.creative_activity_frequency,
        p.assigned_modality,
        p.eligibility_status,
        p.instruction_understanding || '',
        p.technical_problems || '',
        p.technical_problems_details || '',
        p.prior_knowledge_of_functional_fixedness || '',
        p.external_help_used || '',
        p.completion_status || 'Completed',
        p.is_excluded_by_researcher ? 'Yes' : 'No',
        p.created_at || new Date().toISOString(),
        p.completed_at || ''
      ]);
    } else if (data.type === 'trial') {
      var t = data.payload;
      var trialSheet = ss.getSheetByName('Trials');
      trialSheet.appendRow([
        t.participant_id,
        t.discipline || '',
        t.assigned_modality || '',
        t.trial_number,
        t.object_id,
        t.object_name,
        t.first_response || '',
        t.first_response_latency_ms || '',
        t.first_response_latency_seconds || '',
        t.no_response_flag ? 'True' : 'False',
        t.number_of_additional_uses || 0,
        t.trial_completion_status || 'Completed',
        t.conventional_function_shown ? 'Yes' : 'No'
      ]);
    } else if (data.type === 'response') {
      var r = data.payload;
      var respSheet = ss.getSheetByName('Responses');
      respSheet.appendRow([
        r.participant_id,
        r.trial_number,
        r.object_id,
        r.object_name || '',
        r.response_number,
        r.response_type,
        r.response_text,
        r.response_timestamp || new Date().toISOString(),
        r.response_time_from_trial_start || ''
      ]);
    }

    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function initSheets(ss) {
  // Update Sheet1 if it exists to point users to the tabs
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && sheet1.getLastRow() === 0) {
    sheet1.getRange('A1:B1').setValues([['Cognitive Psychology Study Data', 'See tabs below: Participants, Trials, Responses']]);
    sheet1.getRange('A1:B1').setFontWeight('bold').setBackground('#E2E8F0');
  }

  // 1. Participants Sheet
  var pSheet = ss.getSheetByName('Participants');
  if (!pSheet) {
    pSheet = ss.insertSheet('Participants');
    pSheet.appendRow([
      'participant_id', 'age', 'discipline', 'discipline_specified', 'study_level',
      'study_year_semester', 'visual_arts_training', 'visual_arts_training_details',
      'creative_activity_frequency', 'assigned_modality', 'eligibility_status',
      'instruction_understanding', 'technical_problems', 'technical_problems_details',
      'prior_knowledge_of_functional_fixedness', 'external_help_used', 'completion_status',
      'is_excluded_by_researcher', 'session_start_time', 'session_end_time'
    ]);
    pSheet.getRange(1, 1, 1, 20).setFontWeight('bold').setBackground('#E2E8F0');
  }

  // 2. Trials Sheet
  var tSheet = ss.getSheetByName('Trials');
  if (!tSheet) {
    tSheet = ss.insertSheet('Trials');
    tSheet.appendRow([
      'participant_id', 'discipline', 'assigned_modality', 'trial_number',
      'object_id', 'object_name', 'first_response', 'first_response_latency_ms',
      'first_response_latency_seconds', 'no_response_flag', 'number_of_additional_uses',
      'trial_completion_status', 'conventional_function_shown'
    ]);
    tSheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#E2E8F0');
  }

  // 3. Responses Sheet
  var rSheet = ss.getSheetByName('Responses');
  if (!rSheet) {
    rSheet = ss.insertSheet('Responses');
    rSheet.appendRow([
      'participant_id', 'trial_number', 'object_id', 'object_name',
      'response_number', 'response_type', 'response_text',
      'response_timestamp', 'response_time_from_trial_start'
    ]);
    rSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#E2E8F0');
  }
}`;
  }
};
