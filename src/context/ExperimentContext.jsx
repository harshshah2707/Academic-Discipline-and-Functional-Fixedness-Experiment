import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useConfig } from './ConfigContext';
import { storageService } from '../services/storageService';
import { generateParticipantId, assignConditionForDiscipline, shuffleObjects, CONDITIONS } from '../services/randomizationService';
import { googleSheetsService } from '../services/googleSheetsService';

const ExperimentContext = createContext(null);

export const EXPERIMENT_STEPS = {
  WELCOME: 'welcome',
  CONSENT: 'consent',
  DEMOGRAPHICS: 'demographics',
  MODALITY_SELECTION: 'modality_selection',
  INSTRUCTIONS: 'instructions',
  PRACTICE_INTRO: 'practice_intro',
  PRACTICE_FIXATION: 'practice_fixation',
  PRACTICE_STIMULUS: 'practice_stimulus',
  PRACTICE_CONVENTIONAL: 'practice_conventional',
  PRACTICE_FIRST_USE: 'practice_first_use',
  PRACTICE_ADDITIONAL: 'practice_additional',
  PRACTICE_COMPLETE: 'practice_complete',
  TRIAL_FIXATION: 'trial_fixation',
  TRIAL_STIMULUS: 'trial_stimulus',
  TRIAL_CONVENTIONAL: 'trial_conventional',
  TRIAL_FIRST_USE: 'trial_first_use',
  TRIAL_ADDITIONAL: 'trial_additional',
  BREAK: 'break',
  POST_QUESTIONS: 'post_questions',
  DEBRIEF: 'debrief',
  COMPLETION: 'completion'
};

export const ExperimentProvider = ({ children }) => {
  const { experimentalObjects, practiceObject, settings } = useConfig();

  // Navigation & Experiment Flow State
  const [currentStep, setCurrentStep] = useState(EXPERIMENT_STEPS.WELCOME);
  
  // Participant State
  const [participantId, setParticipantId] = useState('');
  const [demographics, setDemographics] = useState({
    age: '',
    discipline: '',
    discipline_specified: '',
    study_level: '',
    study_year_semester: '',
    visual_arts_training: '',
    visual_arts_training_details: '',
    creative_activity_frequency: ''
  });

  const [assignedModality, setAssignedModality] = useState(null); // 'Picture Condition' | 'Word Condition'
  const [eligibilityStatus, setEligibilityStatus] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [completedTime, setCompletedTime] = useState(null);

  // Trials Order & Execution State
  const [trialOrder, setTrialOrder] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0); // 0-indexed (0 to objects.length - 1)

  // In-trial timing & response states
  const [firstResponseText, setFirstResponseText] = useState('');
  const [additionalResponses, setAdditionalResponses] = useState([]);
  const [trialResults, setTrialResults] = useState([]);

  // High precision timing refs
  const firstUseRenderPerfTimeRef = useRef(null);
  const firstUseRenderDateRef = useRef(null);
  const additionalPhaseStartPerfTimeRef = useRef(null);

  // Practice state
  const [practiceFirstResponse, setPracticeFirstResponse] = useState('');
  const [practiceAdditionalResponses, setPracticeAdditionalResponses] = useState([]);

  // Post-experiment questionnaire
  const [postQuestions, setPostQuestions] = useState({
    instruction_understanding: '',
    technical_problems: '',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: '',
    external_help_used: ''
  });

  // Check for active resumable session on mount
  useEffect(() => {
    const active = storageService.getActiveSession();
    if (active && active.participantId && active.currentStep && active.currentStep !== EXPERIMENT_STEPS.COMPLETION) {
      setParticipantId(active.participantId);
      setDemographics(active.demographics || {});
      setAssignedModality(active.assignedModality);
      setEligibilityStatus(active.eligibilityStatus);
      setConsentGiven(active.consentGiven);
      setTrialOrder(active.trialOrder || []);
      setCurrentTrialIndex(active.currentTrialIndex || 0);
      setTrialResults(active.trialResults || []);
      setStartTime(active.startTime);
      setCurrentStep(active.currentStep);
    }
  }, []);

  // Save active session for crash resilience
  const persistSession = (updatedFields = {}) => {
    const session = {
      participantId: updatedFields.participantId || participantId,
      demographics: updatedFields.demographics || demographics,
      assignedModality: updatedFields.assignedModality || assignedModality,
      eligibilityStatus: updatedFields.eligibilityStatus || eligibilityStatus,
      consentGiven: updatedFields.consentGiven !== undefined ? updatedFields.consentGiven : consentGiven,
      trialOrder: updatedFields.trialOrder || trialOrder,
      currentTrialIndex: updatedFields.currentTrialIndex !== undefined ? updatedFields.currentTrialIndex : currentTrialIndex,
      trialResults: updatedFields.trialResults || trialResults,
      startTime: updatedFields.startTime || startTime,
      currentStep: updatedFields.currentStep || currentStep
    };
    storageService.saveActiveSession(session);
  };

  // --- Step 1: Start Experiment from Welcome -> Demographics Form ---
  const startExperiment = () => {
    const newId = generateParticipantId();
    const now = new Date().toISOString();
    setParticipantId(newId);
    setStartTime(now);
    setCurrentStep(EXPERIMENT_STEPS.DEMOGRAPHICS);
    persistSession({ participantId: newId, startTime: now, currentStep: EXPERIMENT_STEPS.DEMOGRAPHICS });
  };

  // --- Step 2: Demographics (Personal Details) -> Move to Consent Form ---
  const submitDemographics = (demoData) => {
    setDemographics(demoData);

    // Determine eligibility for primary analysis
    const disc = (demoData.discipline || '').toLowerCase();
    const isPrimaryEligible = disc.includes('fine') || disc.includes('art') || disc.includes('history');
    const eligStatus = isPrimaryEligible ? 'Eligible for primary analysis' : 'Not eligible for primary analysis';
    setEligibilityStatus(eligStatus);

    // Initial default condition allocation (participant will confirm or select on modality screen)
    const assignedCondition = assignConditionForDiscipline(demoData.discipline);
    setAssignedModality(assignedCondition);

    // Persist participant preliminary record
    const pData = {
      participant_id: participantId,
      age: demoData.age,
      discipline: demoData.discipline,
      discipline_specified: demoData.discipline_specified || '',
      study_level: demoData.study_level,
      study_year_semester: demoData.study_year_semester || '',
      visual_arts_training: demoData.visual_arts_training,
      visual_arts_training_details: demoData.visual_arts_training_details || '',
      creative_activity_frequency: demoData.creative_activity_frequency,
      assigned_modality: assignedCondition,
      eligibility_status: eligStatus,
      completion_status: 'In Progress'
    };
    storageService.saveParticipant(pData);
    googleSheetsService.syncToGoogleSheets({ type: 'participant', payload: pData }).catch(() => {});

    setCurrentStep(EXPERIMENT_STEPS.CONSENT);
    persistSession({
      demographics: demoData,
      eligibilityStatus: eligStatus,
      assignedModality: assignedCondition,
      currentStep: EXPERIMENT_STEPS.CONSENT
    });
  };

  // --- Step 3: Consent Decision -> Move to Presentation Format Selection ---
  const submitConsent = (agreed) => {
    if (!agreed) {
      setConsentGiven(false);
      // Ineligible due to lack of consent
      const pData = {
        participant_id: participantId,
        age: demographics.age,
        discipline: demographics.discipline,
        discipline_specified: demographics.discipline_specified || '',
        study_level: demographics.study_level,
        study_year_semester: demographics.study_year_semester || '',
        visual_arts_training: demographics.visual_arts_training,
        visual_arts_training_details: demographics.visual_arts_training_details || '',
        creative_activity_frequency: demographics.creative_activity_frequency,
        assigned_modality: assignedModality || 'Unassigned',
        eligibility_status: 'Ineligible - Consent declined',
        completion_status: 'Declined Consent'
      };
      storageService.saveParticipant(pData);
      googleSheetsService.syncToGoogleSheets({ type: 'participant', payload: pData }).catch(() => {});
      return false;
    }

    setConsentGiven(true);
    setCurrentStep(EXPERIMENT_STEPS.MODALITY_SELECTION);
    persistSession({ consentGiven: true, currentStep: EXPERIMENT_STEPS.MODALITY_SELECTION });
    return true;
  };

  // --- Step 4: Modality Format Selection (Word or Picture) ---
  const selectModality = (chosenModality) => {
    setAssignedModality(chosenModality);

    // Randomize experimental objects trial presentation order
    const randomisedObjects = shuffleObjects(experimentalObjects);
    setTrialOrder(randomisedObjects);

    // Update participant record with confirmed presentation modality
    const pData = {
      participant_id: participantId,
      age: demographics.age,
      discipline: demographics.discipline,
      discipline_specified: demographics.discipline_specified || '',
      study_level: demographics.study_level,
      study_year_semester: demographics.study_year_semester || '',
      visual_arts_training: demographics.visual_arts_training,
      visual_arts_training_details: demographics.visual_arts_training_details || '',
      creative_activity_frequency: demographics.creative_activity_frequency,
      assigned_modality: chosenModality,
      eligibility_status: eligibilityStatus,
      completion_status: 'In Progress'
    };
    storageService.saveParticipant(pData);
    googleSheetsService.syncToGoogleSheets({ type: 'participant', payload: pData }).catch(() => {});

    setCurrentStep(EXPERIMENT_STEPS.INSTRUCTIONS);
    persistSession({
      assignedModality: chosenModality,
      trialOrder: randomisedObjects,
      currentStep: EXPERIMENT_STEPS.INSTRUCTIONS
    });
  };

  // --- Practice Flow Handlers ---
  const startPractice = () => {
    setPracticeFirstResponse('');
    setPracticeAdditionalResponses([]);
    setCurrentStep(EXPERIMENT_STEPS.PRACTICE_FIXATION);
  };

  const recordPracticeFirstResponseRender = () => {
    firstUseRenderPerfTimeRef.current = performance.now();
    firstUseRenderDateRef.current = new Date().toISOString();
  };

  const submitPracticeFirstResponse = (text, skipped = false) => {
    setPracticeFirstResponse(skipped ? '[No alternative use generated]' : text);
    additionalPhaseStartPerfTimeRef.current = performance.now();
    setCurrentStep(EXPERIMENT_STEPS.PRACTICE_ADDITIONAL);
  };

  const addPracticeAdditionalResponse = (text) => {
    if (!text.trim()) return;
    setPracticeAdditionalResponses(prev => [
      ...prev,
      {
        text: text.trim(),
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const finishPractice = () => {
    setCurrentStep(EXPERIMENT_STEPS.PRACTICE_COMPLETE);
  };

  const startMainExperimentalTrials = () => {
    setCurrentTrialIndex(0);
    setFirstResponseText('');
    setAdditionalResponses([]);
    setCurrentStep(EXPERIMENT_STEPS.TRIAL_FIXATION);
    persistSession({ currentTrialIndex: 0, currentStep: EXPERIMENT_STEPS.TRIAL_FIXATION });
  };

  // --- Main Trial Flow Handlers ---
  const getCurrentTrialObject = () => {
    if (!trialOrder || trialOrder.length === 0) {
      return experimentalObjects[0];
    }
    return trialOrder[currentTrialIndex] || trialOrder[0];
  };

  // Called when the First Alternative Use screen is mounted / displayed
  const recordFirstResponseScreenRender = () => {
    firstUseRenderPerfTimeRef.current = performance.now();
    firstUseRenderDateRef.current = new Date().toISOString();
  };

  // Called when participant submits their first alternative use
  const submitFirstAlternativeUse = (responseStr, isSkipped = false) => {
    const submitPerfTime = performance.now();
    const renderPerfTime = firstUseRenderPerfTimeRef.current || submitPerfTime;
    const latencyMs = Math.round(submitPerfTime - renderPerfTime);
    const latencySec = (latencyMs / 1000).toFixed(3);

    const cleanText = isSkipped ? '' : responseStr.trim();
    const currentObj = getCurrentTrialObject();
    const trialNum = currentTrialIndex + 1;

    setFirstResponseText(cleanText);

    const responseData = {
      participant_id: participantId,
      trial_number: trialNum,
      object_id: currentObj.id,
      object_name: currentObj.name,
      response_number: 1,
      response_type: 'First response',
      response_text: isSkipped ? '[No alternative use generated]' : cleanText,
      response_timestamp: new Date().toISOString(),
      response_time_from_trial_start: `${latencySec}s`
    };

    // Record response #1 in response storage
    storageService.saveResponse(responseData);
    googleSheetsService.syncToGoogleSheets({ type: 'response', payload: responseData }).catch(() => {});

    // Start additional uses phase timing
    additionalPhaseStartPerfTimeRef.current = performance.now();
    setAdditionalResponses([]);
    setCurrentStep(EXPERIMENT_STEPS.TRIAL_ADDITIONAL);
  };

  // Called when participant enters an additional alternative use in Phase 5
  const addAdditionalAlternativeUse = (responseStr) => {
    if (!responseStr || !responseStr.trim()) return;
    const cleanText = responseStr.trim();
    const currentObj = getCurrentTrialObject();
    const trialNum = currentTrialIndex + 1;
    const currentAddList = additionalResponses;
    const responseNum = currentAddList.length + 2; // Response 1 is first use

    const nowPerf = performance.now();
    const phaseStartPerf = additionalPhaseStartPerfTimeRef.current || nowPerf;
    const timeSincePhaseStartSec = ((nowPerf - phaseStartPerf) / 1000).toFixed(1);

    const newEntry = {
      text: cleanText,
      timestamp: new Date().toISOString(),
      timeSincePhaseStartSec: `${timeSincePhaseStartSec}s`,
      number: responseNum
    };

    setAdditionalResponses(prev => [...prev, newEntry]);

    const addRespData = {
      participant_id: participantId,
      trial_number: trialNum,
      object_id: currentObj.id,
      object_name: currentObj.name,
      response_number: responseNum,
      response_type: 'Additional response',
      response_text: cleanText,
      response_timestamp: newEntry.timestamp,
      response_time_from_trial_start: newEntry.timeSincePhaseStartSec
    };

    // Save response to DB immediately
    storageService.saveResponse(addRespData);
    googleSheetsService.syncToGoogleSheets({ type: 'response', payload: addRespData }).catch(() => {});
  };

  // Called when the 60-second additional uses phase completes
  const completeCurrentTrial = (isSkippedFirst = false) => {
    const currentObj = getCurrentTrialObject();
    const trialNum = currentTrialIndex + 1;

    const renderPerf = firstUseRenderPerfTimeRef.current;
    const latencyMs = renderPerf ? Math.round(performance.now() - renderPerf) : 0;
    const latencySec = (latencyMs / 1000).toFixed(3);

    const trialRecord = {
      participant_id: participantId,
      discipline: demographics.discipline,
      assigned_modality: assignedModality,
      trial_number: trialNum,
      object_id: currentObj.id,
      object_name: currentObj.name,
      first_response: isSkippedFirst ? '' : firstResponseText,
      first_response_latency_ms: isSkippedFirst ? null : latencyMs,
      first_response_latency_seconds: isSkippedFirst ? null : latencySec,
      no_response_flag: isSkippedFirst,
      number_of_additional_uses: additionalResponses.length,
      trial_completion_status: 'Completed',
      conventional_function_shown: settings.showConventionalFunction
    };

    // Save trial to storage
    storageService.saveTrial(trialRecord);
    googleSheetsService.syncToGoogleSheets({ type: 'trial', payload: trialRecord }).catch(() => {});
    const updatedTrialResults = [...trialResults, trialRecord];
    setTrialResults(updatedTrialResults);

    // Determine next step: Break screen, Next trial, or Post-Questionnaire
    const totalTrials = trialOrder.length;
    const nextTrialIdx = currentTrialIndex + 1;
    const halfwayIndex = Math.floor(totalTrials / 2);

    // Check if halfway break should be shown
    if (nextTrialIdx === halfwayIndex && nextTrialIdx < totalTrials) {
      setCurrentTrialIndex(nextTrialIdx);
      setFirstResponseText('');
      setAdditionalResponses([]);
      setCurrentStep(EXPERIMENT_STEPS.BREAK);
      persistSession({
        currentTrialIndex: nextTrialIdx,
        trialResults: updatedTrialResults,
        currentStep: EXPERIMENT_STEPS.BREAK
      });
    } else if (nextTrialIdx < totalTrials) {
      // Proceed to next experimental trial
      setCurrentTrialIndex(nextTrialIdx);
      setFirstResponseText('');
      setAdditionalResponses([]);
      setCurrentStep(EXPERIMENT_STEPS.TRIAL_FIXATION);
      persistSession({
        currentTrialIndex: nextTrialIdx,
        trialResults: updatedTrialResults,
        currentStep: EXPERIMENT_STEPS.TRIAL_FIXATION
      });
    } else {
      // All trials complete -> Post-experiment questionnaire
      setCurrentStep(EXPERIMENT_STEPS.POST_QUESTIONS);
      persistSession({
        trialResults: updatedTrialResults,
        currentStep: EXPERIMENT_STEPS.POST_QUESTIONS
      });
    }
  };

  // Continue from Halfway Break Screen
  const resumeFromBreak = () => {
    setFirstResponseText('');
    setAdditionalResponses([]);
    setCurrentStep(EXPERIMENT_STEPS.TRIAL_FIXATION);
    persistSession({ currentStep: EXPERIMENT_STEPS.TRIAL_FIXATION });
  };

  // Submit Post Questionnaire
  const submitPostQuestions = (questionsData) => {
    setPostQuestions(questionsData);
    setCurrentStep(EXPERIMENT_STEPS.DEBRIEF);
    persistSession({ currentStep: EXPERIMENT_STEPS.DEBRIEF });
  };

  // Finish Study from Debrief
  const finishStudy = () => {
    const endTimestamp = new Date().toISOString();
    setCompletedTime(endTimestamp);

    // Finalize participant record
    const finalParticipant = {
      participant_id: participantId,
      age: demographics.age,
      gender: demographics.gender || '',
      gender_self_describe: demographics.gender_self_describe || '',
      academic_discipline: demographics.discipline,
      discipline: demographics.discipline,
      discipline_specified: demographics.discipline_specified || '',
      year_of_study: demographics.study_year || demographics.study_level || '',
      study_level: demographics.study_level || '',
      study_year_semester: demographics.study_year_semester || demographics.study_year || '',
      previous_visual_arts_training: demographics.visual_arts_training,
      visual_arts_training: demographics.visual_arts_training,
      years_of_visual_arts_training: demographics.visual_arts_training_years || demographics.visual_arts_training_details || '',
      visual_arts_training_details: demographics.visual_arts_training_details || demographics.visual_arts_training_years || '',
      creative_activity_frequency: demographics.creative_activity_frequency || '',
      assigned_modality: assignedModality,
      eligibility_status: eligibilityStatus,
      familiarity_ratings: postQuestions.familiarity_ratings || {},
      cognitive_strategy: postQuestions.cognitive_strategy || '',
      instruction_understanding: postQuestions.instruction_understanding || '',
      technical_problems: postQuestions.technical_problems || '',
      technical_problems_details: postQuestions.technical_problems_details || '',
      prior_knowledge_of_functional_fixedness: postQuestions.prior_knowledge_of_functional_fixedness || '',
      external_help_used: postQuestions.external_help_used || '',
      completion_status: 'Completed',
      date_and_time: startTime || new Date().toISOString(),
      created_at: startTime || new Date().toISOString(),
      completed_at: endTimestamp
    };

    storageService.saveParticipant(finalParticipant);

    // 1. Send final participant record
    googleSheetsService.syncToGoogleSheets({ type: 'participant', payload: finalParticipant }).catch(() => {});

    // 2. Automatically sync all session trials, responses, and participants in the background
    googleSheetsService.syncAllLocalData(
      storageService.getParticipants(),
      storageService.getTrials(),
      storageService.getResponses()
    ).catch(() => {});

    storageService.clearActiveSession();
    setCurrentStep(EXPERIMENT_STEPS.COMPLETION);
  };

  // Demo Mode Navigation Helper
  const jumpToStep = (targetStep, trialIdx = 0) => {
    // If no participant ID exists yet, create one for preview
    if (!participantId) {
      const demoId = generateParticipantId();
      setParticipantId(demoId);
      setStartTime(new Date().toISOString());
    }

    // If modality not yet assigned, default to Picture Condition
    if (!assignedModality) {
      setAssignedModality(CONDITIONS.PICTURE);
    }

    // If trial order not yet generated, generate standard randomized order
    if (!trialOrder || trialOrder.length === 0) {
      setTrialOrder(experimentalObjects);
    }

    if (trialIdx !== undefined) {
      setCurrentTrialIndex(trialIdx);
    }

    setCurrentStep(targetStep);
  };

  // Demo Mode Fill Sample Data Helper
  const fillSampleData = (disciplineType = 'Fine Arts', modalityType = CONDITIONS.PICTURE) => {
    const demoId = participantId || generateParticipantId();
    setParticipantId(demoId);
    setStartTime(new Date().toISOString());

    const sampleDemo = {
      age: '21',
      gender: 'Woman',
      discipline: disciplineType,
      discipline_specified: '',
      study_year: 'Second Year',
      study_level: 'Undergraduate',
      visual_arts_training: disciplineType === 'Fine Arts' ? 'Yes' : 'No',
      visual_arts_training_years: disciplineType === 'Fine Arts' ? '3 years' : '',
      visual_arts_training_details: disciplineType === 'Fine Arts' ? 'Formal studio arts & drawing training' : '',
      creative_activity_frequency: disciplineType === 'Fine Arts' ? 'Often' : 'Occasionally'
    };

    setDemographics(sampleDemo);
    setAssignedModality(modalityType);
    setConsentGiven(true);
    setTrialOrder(experimentalObjects);
    setCurrentTrialIndex(0);

    const eligStatus = disciplineType === 'Fine Arts' || disciplineType === 'Commerce'
      ? 'Eligible for primary analysis'
      : 'Not eligible for primary analysis';
    setEligibilityStatus(eligStatus);
  };

  // Restart clean session
  const restartNewSession = () => {
    storageService.clearActiveSession();
    setParticipantId('');
    setDemographics({
      age: '',
      gender: '',
      gender_self_describe: '',
      discipline: '',
      discipline_specified: '',
      study_level: '',
      study_year: 'First Year',
      visual_arts_training: '',
      visual_arts_training_years: '',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Occasionally'
    });
    setAssignedModality(null);
    setEligibilityStatus('');
    setConsentGiven(false);
    setTrialOrder([]);
    setCurrentTrialIndex(0);
    setTrialResults([]);
    setFirstResponseText('');
    setAdditionalResponses([]);
    setCurrentStep(EXPERIMENT_STEPS.WELCOME);
  };

  return (
    <ExperimentContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        participantId,
        demographics,
        assignedModality,
        setAssignedModality,
        eligibilityStatus,
        consentGiven,
        startTime,
        completedTime,
        trialOrder,
        currentTrialIndex,
        setCurrentTrialIndex,
        getCurrentTrialObject,
        firstResponseText,
        additionalResponses,
        trialResults,
        postQuestions,
        practiceObject,
        practiceFirstResponse,
        practiceAdditionalResponses,
        // Actions
        startExperiment,
        submitConsent,
        submitDemographics,
        selectModality,
        startPractice,
        recordPracticeFirstResponseRender,
        submitPracticeFirstResponse,
        addPracticeAdditionalResponse,
        finishPractice,
        startMainExperimentalTrials,
        recordFirstResponseScreenRender,
        submitFirstAlternativeUse,
        addAdditionalAlternativeUse,
        completeCurrentTrial,
        resumeFromBreak,
        submitPostQuestions,
        finishStudy,
        restartNewSession,
        // Demo Mode Actions
        jumpToStep,
        fillSampleData
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
};
