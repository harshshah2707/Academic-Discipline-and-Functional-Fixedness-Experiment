import React, { useState } from 'react';
import { ConfigProvider } from './context/ConfigContext';
import { ExperimentProvider, useExperiment, EXPERIMENT_STEPS } from './context/ExperimentContext';
import { storageService } from './services/storageService';
import { Header } from './components/common/Header';
import { ProgressBar } from './components/common/ProgressBar';
import { DemoModeBar } from './components/common/DemoModeBar';
import { WelcomeScreen } from './components/experiment/WelcomeScreen';
import { ConsentScreen } from './components/experiment/ConsentScreen';
import { DemographicsScreen } from './components/experiment/DemographicsScreen';
import { ModalitySelectionScreen } from './components/experiment/ModalitySelectionScreen';
import { InstructionsScreen } from './components/experiment/InstructionsScreen';
import { PracticeScreen } from './components/experiment/PracticeScreen';
import { TrialRunner } from './components/experiment/TrialRunner';
import { BreakScreen } from './components/experiment/BreakScreen';
import { PostQuestionnaireScreen } from './components/experiment/PostQuestionnaireScreen';
import { DebriefingScreen } from './components/experiment/DebriefingScreen';
import { CompletionScreen } from './components/experiment/CompletionScreen';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const ExperimentRouter = ({ onOpenAdmin, isAdminView, isDemoOpen, onToggleDemo }) => {
  const { currentStep } = useExperiment();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoModeBar
        isOpen={isDemoOpen}
        onToggle={onToggleDemo}
        onOpenAdmin={onOpenAdmin}
      />

      <Header
        onOpenAdmin={onOpenAdmin}
        isAdminView={isAdminView}
        isDemoOpen={isDemoOpen}
        onToggleDemo={onToggleDemo}
      />

      <main className="flex-1 py-4 sm:py-8">
        <ProgressBar />

        {/* Experiment Step Routing */}
        {currentStep === EXPERIMENT_STEPS.WELCOME && <WelcomeScreen />}
        {currentStep === EXPERIMENT_STEPS.CONSENT && <ConsentScreen />}
        {currentStep === EXPERIMENT_STEPS.DEMOGRAPHICS && <DemographicsScreen />}
        {currentStep === EXPERIMENT_STEPS.MODALITY_SELECTION && <ModalitySelectionScreen />}
        {currentStep === EXPERIMENT_STEPS.INSTRUCTIONS && <InstructionsScreen />}

        {/* Practice Stages */}
        {(currentStep === EXPERIMENT_STEPS.PRACTICE_INTRO ||
          currentStep === EXPERIMENT_STEPS.PRACTICE_FIXATION ||
          currentStep === EXPERIMENT_STEPS.PRACTICE_STIMULUS ||
          currentStep === EXPERIMENT_STEPS.PRACTICE_CONVENTIONAL ||
          currentStep === EXPERIMENT_STEPS.PRACTICE_FIRST_USE ||
          currentStep === EXPERIMENT_STEPS.PRACTICE_ADDITIONAL ||
          currentStep === EXPERIMENT_STEPS.PRACTICE_COMPLETE) && <PracticeScreen />}

        {/* Experimental Trials */}
        {(currentStep === EXPERIMENT_STEPS.TRIAL_FIXATION ||
          currentStep === EXPERIMENT_STEPS.TRIAL_STIMULUS ||
          currentStep === EXPERIMENT_STEPS.TRIAL_CONVENTIONAL ||
          currentStep === EXPERIMENT_STEPS.TRIAL_FIRST_USE ||
          currentStep === EXPERIMENT_STEPS.TRIAL_ADDITIONAL) && <TrialRunner />}

        {/* Mid-Task Rest Break */}
        {currentStep === EXPERIMENT_STEPS.BREAK && <BreakScreen />}

        {/* Post-Experiment Questionnaire */}
        {currentStep === EXPERIMENT_STEPS.POST_QUESTIONS && <PostQuestionnaireScreen />}

        {/* Study Debriefing */}
        {currentStep === EXPERIMENT_STEPS.DEBRIEF && <DebriefingScreen />}

        {/* Final Completion Screen */}
        {currentStep === EXPERIMENT_STEPS.COMPLETION && <CompletionScreen />}
      </main>

      {/* Discrete research footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <span>Cognitive Flexibility & Object Representation Laboratory • Anonymous Study Platform</span>
      </footer>
    </div>
  );
};

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleOpenAdmin = () => {
    if (isAdminOpen) {
      setIsAdminOpen(false);
      return;
    }

    const isAuth = storageService.getAdminAuth();
    if (isAuth) {
      setIsAdminOpen(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAdminOpen(true);
  };

  return (
    <ConfigProvider>
      <ExperimentProvider>
        {isAdminOpen ? (
          <div className="min-h-screen bg-slate-100">
            <Header
              onOpenAdmin={() => setIsAdminOpen(false)}
              isAdminView={true}
              isDemoOpen={isDemoOpen}
              onToggleDemo={() => setIsDemoOpen(prev => !prev)}
            />
            <AdminDashboard onExit={() => setIsAdminOpen(false)} />
          </div>
        ) : (
          <ExperimentRouter
            onOpenAdmin={handleOpenAdmin}
            isAdminView={false}
            isDemoOpen={isDemoOpen}
            onToggleDemo={() => setIsDemoOpen(prev => !prev)}
          />
        )}

        {showLoginModal && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setShowLoginModal(false)}
          />
        )}
      </ExperimentProvider>
    </ConfigProvider>
  );
}
