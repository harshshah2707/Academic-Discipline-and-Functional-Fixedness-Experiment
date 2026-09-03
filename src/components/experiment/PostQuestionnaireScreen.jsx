import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { useConfig } from '../../context/ConfigContext';
import { HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const PostQuestionnaireScreen = () => {
  const { submitPostQuestions } = useExperiment();
  const { experimentalObjects } = useConfig();

  const [formData, setFormData] = useState({
    familiarity_ratings: {
      obj_01: 5, // Paperclip
      obj_02: 5, // Brick
      obj_03: 5, // Newspaper
      obj_04: 5, // Spoon
      obj_05: 5, // Cup
      obj_06: 5  // Rubber Band
    },
    cognitive_strategy: '',
    technical_problems: 'No',
    technical_problems_details: '',
    instruction_understanding: 'Yes',
    prior_knowledge_of_functional_fixedness: 'No',
    external_help_used: 'No'
  });

  const [error, setError] = useState('');

  const handleFamiliarityChange = (objId, rating) => {
    setFormData(prev => ({
      ...prev,
      familiarity_ratings: {
        ...prev.familiarity_ratings,
        [objId]: Number(rating)
      }
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.technical_problems) {
      setError('Please answer Question 3 regarding technical problems.');
      return;
    }

    submitPostQuestions(formData);
  };

  const familiarityLabels = [
    { value: 1, label: '1 - Not at all familiar' },
    { value: 2, label: '2 - Slightly familiar' },
    { value: 3, label: '3 - Moderately familiar' },
    { value: 4, label: '4 - Very familiar' },
    { value: 5, label: '5 - Extremely familiar' }
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Final Questionnaire</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Post-Experiment Questionnaire
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Please answer these final questions about the objects and your experience during the study.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Section 1: Object Familiarity Ratings */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-base mb-1">
              1. Object Familiarity Ratings
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              How familiar were you with each object before participating in this study? (1 = Not at all familiar, 5 = Extremely familiar)
            </p>

            <div className="space-y-3">
              {experimentalObjects.map((obj) => (
                <div key={obj.id} className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-medium text-slate-800 text-sm">
                    {obj.displayName || obj.name}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const currentVal = formData.familiarity_ratings[obj.id] || 5;
                      const isSelected = currentVal === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleFamiliarityChange(obj.id, val)}
                          className={`w-9 h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs scale-105'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          title={familiarityLabels[val - 1].label}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Cognitive Strategy Question */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label htmlFor="strategy_input" className="block font-semibold text-slate-900 mb-1">
              2. Cognitive Strategy: <span className="text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              While thinking of alternative uses, did you use any particular strategy (e.g., focusing on material, shape, size, decomposing parts)?
            </p>
            <textarea
              id="strategy_input"
              rows={3}
              placeholder="Describe any strategy or thought process you used..."
              value={formData.cognitive_strategy}
              onChange={(e) => handleChange('cognitive_strategy', e.target.value)}
              className="form-input text-sm resize-none"
            />
          </div>

          {/* Section 3: Technical Problems */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              3. Did you experience any technical problems during the experiment? <span className="text-red-500">*</span>
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
                  Please briefly describe the problem:
                </label>
                <input
                  id="tech_problem_desc"
                  type="text"
                  placeholder="e.g. page lagged, image didn't display immediately..."
                  value={formData.technical_problems_details}
                  onChange={(e) => handleChange('technical_problems_details', e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>

          {/* Section 4: Instruction Understanding & Integrity */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              4. Did you understand all task instructions clearly?
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

          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-base py-2.5 px-6"
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
