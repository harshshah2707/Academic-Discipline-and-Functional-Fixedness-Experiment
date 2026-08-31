import React, { useState, useEffect } from 'react';
import { googleSheetsService, DEFAULT_SHEET_ID, DEFAULT_SHEET_URL } from '../../services/googleSheetsService';
import { storageService } from '../../services/storageService';
import { FileSpreadsheet, ExternalLink, RefreshCw, Copy, Check, AlertCircle, CheckCircle2, Code } from 'lucide-react';

export const GoogleSheetsSyncPanel = () => {
  const [webhookUrl, setWebhookUrl] = useState(googleSheetsService.getWebhookUrl());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { success: boolean, message: string }
  const [copiedCode, setCopiedCode] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  const handleSaveWebhook = (e) => {
    e.preventDefault();
    googleSheetsService.setWebhookUrl(webhookUrl);
    setSyncStatus({ success: true, message: 'Google Sheets Webhook URL saved successfully.' });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleTestConnection = async () => {
    if (!webhookUrl) {
      setSyncStatus({
        success: false,
        message: 'Please paste your Google Apps Script Web App URL first.'
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    const testPayload = {
      action: 'sync_all',
      participants: [{
        participant_id: 'TEST_PING_' + Math.floor(Math.random() * 9000 + 1000),
        age: 25,
        discipline: 'Fine Arts / Visual Arts',
        discipline_specified: '',
        study_level: 'Undergraduate',
        study_year_semester: 'Test Run',
        visual_arts_training: 'Yes',
        visual_arts_training_details: 'System Connectivity Verification Test',
        creative_activity_frequency: 'Often',
        assigned_modality: 'Picture Condition',
        eligibility_status: 'Eligible for primary analysis',
        instruction_understanding: 'Yes',
        technical_problems: 'No',
        technical_problems_details: '',
        prior_knowledge_of_functional_fixedness: 'No',
        external_help_used: 'No',
        completion_status: 'Completed (Test Ping)',
        is_excluded_by_researcher: true,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      }],
      trials: [{
        participant_id: 'TEST_PING_001',
        discipline: 'Fine Arts / Visual Arts',
        assigned_modality: 'Picture Condition',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        first_response: 'Test connection alternative use',
        first_response_latency_ms: 3200,
        first_response_latency_seconds: '3.200',
        no_response_flag: false,
        number_of_additional_uses: 1,
        trial_completion_status: 'Completed',
        conventional_function_shown: true
      }],
      responses: [{
        participant_id: 'TEST_PING_001',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        response_number: 1,
        response_type: 'First response',
        response_text: 'Test connection alternative use',
        response_timestamp: new Date().toISOString(),
        response_time_from_trial_start: '3.2s'
      }]
    };

    try {
      await googleSheetsService.syncToGoogleSheets(testPayload);
      setSyncStatus({
        success: true,
        message: 'Connection Successful! A test verification row was dispatched to your Google Sheet.'
      });
    } catch (err) {
      setSyncStatus({
        success: false,
        message: `Connection test failed: ${err.message}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAll = async () => {
    if (!webhookUrl) {
      setSyncStatus({
        success: false,
        message: 'Please paste your Google Apps Script Web App URL first before syncing.'
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    const participants = storageService.getParticipants();
    const trials = storageService.getTrials();
    const responses = storageService.getResponses();

    try {
      await googleSheetsService.syncAllLocalData(participants, trials, responses);
      setSyncStatus({
        success: true,
        message: `Successfully synchronized ${participants.length} participants, ${trials.length} trials, and ${responses.length} responses to Google Sheets!`
      });
    } catch (err) {
      setSyncStatus({
        success: false,
        message: `Sync failed: ${err.message || 'Check Web App deployment permissions'}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const appsScriptCode = googleSheetsService.getAppsScriptCode(DEFAULT_SHEET_ID);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Google Sheets Live Data Synchronization
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct real-time streaming and batch archival to your study spreadsheet.
          </p>
        </div>

        <a
          href={DEFAULT_SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
        >
          <span>Open Google Sheet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Target Sheet Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">Target Spreadsheet:</span>
          <code className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
            ID: {DEFAULT_SHEET_ID}
          </code>
        </div>
        <div className="text-slate-500 text-[11px]">
          Includes separate tabs for <strong>Participants</strong>, <strong>Trials</strong>, and <strong>Responses</strong>.
        </div>
      </div>

      {/* Webhook Configuration Form */}
      <form onSubmit={handleSaveWebhook} className="space-y-4">
        <div>
          <label htmlFor="webhook_input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Google Apps Script Web App Endpoint URL
          </label>
          <div className="flex gap-2">
            <input
              id="webhook_input"
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="form-input text-xs"
            />
            <button
              type="submit"
              className="btn-secondary text-xs shrink-0 px-4"
            >
              Save URL
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Deploy the script in your Google Sheet (Extensions &gt; Apps Script) as a Web App to get this URL.
          </p>
        </div>
      </form>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div
          className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
            syncStatus.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {syncStatus.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{syncStatus.message}</span>
        </div>
      )}

      {/* Sync Trigger & Script Helper */}
      <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => setShowScriptModal(!showScriptModal)}
          className="btn-secondary text-xs w-full sm:w-auto"
        >
          <Code className="w-4 h-4" />
          <span>{showScriptModal ? 'Hide Setup Script' : 'View Google Apps Script Code & Setup'}</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleTestConnection}
            disabled={isSyncing}
            className="btn-secondary text-xs w-full sm:w-auto text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
            title="Send a single test ping to verify Google Sheet connectivity"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test Connection</span>
          </button>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="btn-primary text-xs w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 border-emerald-800"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing to Sheets...' : 'Sync All Stored Data to Google Sheet Now'}</span>
          </button>
        </div>
      </div>

      {/* Instructions & Script Viewer */}
      {showScriptModal && (
        <div className="bg-slate-900 text-slate-100 rounded-lg p-5 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">
              Google Apps Script for Sheet ({DEFAULT_SHEET_ID})
            </h4>
            <button
              onClick={handleCopyScript}
              className="btn-secondary text-xs py-1 px-3 bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-normal bg-slate-800/80 p-3.5 rounded">
            <li>Open your Google Sheet: <a href={DEFAULT_SHEET_URL} target="_blank" rel="noreferrer" className="text-blue-400 underline">docs.google.com/spreadsheets/d/{DEFAULT_SHEET_ID}</a></li>
            <li>Click <strong>Extensions &gt; Apps Script</strong> in the top menu.</li>
            <li>Paste this code into the editor and click the <strong>Save (Disk)</strong> icon.</li>
            <li>Click <strong>Deploy &gt; New deployment</strong> (top right).</li>
            <li>Select type <strong>Web app</strong> (gear icon).</li>
            <li>Set <em>Execute as:</em> <strong>Me</strong> and <em>Who has access:</em> <strong>Anyone</strong>.</li>
            <li>Click <strong>Deploy</strong>, authorize permissions, and copy the <strong>Web App URL</strong> into the field above!</li>
          </ol>

          <pre className="bg-slate-950 p-4 rounded text-[11px] font-mono overflow-x-auto max-h-64 text-emerald-300 border border-slate-800">
            {appsScriptCode}
          </pre>
        </div>
      )}
    </div>
  );
};
