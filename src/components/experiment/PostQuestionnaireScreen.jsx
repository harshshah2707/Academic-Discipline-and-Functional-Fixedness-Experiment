import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const PostQuestionnaireScreen = () => {
  const { submitPostQuestions } = useExperiment();

  const [formData, setFormData] = useState({
    instruction_understanding: '',
    technical_problems: '',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: '',
    external_help_used: ''
  });

  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.instruction_understanding) {
      setError('Please answer Question 1 regarding the instructions.');
      return;
    }

    if (!formData.technical_problems) {
      setError('Please answer Question 2 regarding technical problems.');
      return;
    }
    if (formData.technical_problems === 'Yes' && !formData.technical_problems_details.trim()) {
      setError('Please briefly describe the technical problem encountered.');
      return;
    }

    if (!formData.prior_knowledge_of_functional_fixedness) {
      setError('Please answer Question 3 regarding your prior familiarity with research on functional fixedness.');
      return;
    }

    if (!formData.external_help_used) {
      setError('Please answer Question 4 regarding external help.');
      return;
    }

    submitPostQuestions(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Section 3 of 3</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Post-Experiment Questions
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Please answer these brief final questions honestly. Your answers help ensure research integrity.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Question 1: Instruction Understanding */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              1. Did you understand the instructions? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Yes', 'Mostly', 'No'].map((opt) => (
                <label key={opt} className={`form-radio-label ${formData.instruction_understanding === opt ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="instruction_understanding"
                    value={opt}
                    checked={formData.instruction_understanding === opt}
                    onChange={(e) => handleChange('instruction_understanding', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Technical Problems */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              2. Did you experience any technical problems during the study? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {['No', 'Yes'].map((opt) => (
                <label key={opt} className={`form-radio-label ${formData.technical_problems === opt ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="technical_problems"
                    value={opt}
                    checked={formData.technical_problems === opt}
                    onChange={(e) => handleChange('technical_problems', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {formData.technical_problems === 'Yes' && (
              <div className="mt-2 pl-2">
                <label htmlFor="tech_problem_desc" className="block text-xs font-medium text-slate-700 mb-1">
                  Please briefly describe the problem: <span className="text-red-500">*</span>
                </label>
                <input
                  id="tech_problem_desc"
                  type="text"
                  placeholder="e.g. page lagged, image didn't display immediately..."
                  value={formData.technical_problems_details}
                  onChange={(e) => handleChange('technical_problems_details', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>

          {/* Question 3: Prior Knowledge of Functional Fixedness */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              3. Before participating in this study, were you familiar with the purpose of research on functional fixedness or alternative uses of objects? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Yes', 'No', 'Not sure'].map((opt) => (
                <label key={opt} className={`form-radio-label ${formData.prior_knowledge_of_functional_fixedness === opt ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="prior_knowledge_of_functional_fixedness"
                    value={opt}
                    checked={formData.prior_knowledge_of_functional_fixedness === opt}
                    onChange={(e) => handleChange('prior_knowledge_of_functional_fixedness', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4: External / AI Help */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              4. Did you use any external help, internet searches, or AI tools while completing the task? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Please answer honestly; this is solely used as a data control variable.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['No', 'Yes'].map((opt) => (
                <label key={opt} className={`form-radio-label ${formData.external_help_used === opt ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="external_help_used"
                    value={opt}
                    checked={formData.external_help_used === opt}
                    onChange={(e) => handleChange('external_help_used', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
            >
              <span>Continue to Debriefing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
