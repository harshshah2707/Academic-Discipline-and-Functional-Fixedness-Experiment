import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const DemographicsScreen = () => {
  const { submitDemographics } = useExperiment();

  const [formData, setFormData] = useState({
    age: '',
    discipline: '',
    discipline_specified: '',
    study_level: '',
    study_year_semester: '',
    visual_arts_training: '',
    visual_arts_training_details: '',
    creative_activity_frequency: ''
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

    // 1. Age Validation
    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 110) {
      setError('You must be at least 18 years old to participate in this study.');
      return;
    }

    // 2. Discipline Validation
    if (!formData.discipline) {
      setError('Please select your current academic discipline.');
      return;
    }
    if (formData.discipline === 'Other' && !formData.discipline_specified.trim()) {
      setError('Please specify your academic discipline in the text field.');
      return;
    }

    // 3. Study Level Validation
    if (!formData.study_level) {
      setError('Please select your current level of study.');
      return;
    }

    // 4. Visual Arts Training Validation
    if (!formData.visual_arts_training) {
      setError('Please indicate whether you have received formal visual arts training.');
      return;
    }
    if (formData.visual_arts_training === 'Yes' && !formData.visual_arts_training_details.trim()) {
      setError('Please briefly describe your visual arts training.');
      return;
    }

    // 5. Creative Activity Frequency Validation
    if (!formData.creative_activity_frequency) {
      setError('Please select your creative activity frequency.');
      return;
    }

    submitDemographics(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4" />
          <span>Section 1 of 3</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Demographic Questionnaire
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Please answer the following background questions accurately.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Question 1: Age */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label htmlFor="age_input" className="block font-semibold text-slate-900 mb-1.5">
              1. Age (in years): <span className="text-red-500">*</span>
            </label>
            <input
              id="age_input"
              type="number"
              min="18"
              max="120"
              placeholder="e.g. 21"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="form-input max-w-xs"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Participants must be at least 18 years old.</p>
          </div>

          {/* Question 2: Academic Discipline */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              2. Current Academic Discipline / Major: <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className={`form-radio-label ${formData.discipline === 'Fine Arts / Visual Arts' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="discipline"
                  value="Fine Arts / Visual Arts"
                  checked={formData.discipline === 'Fine Arts / Visual Arts'}
                  onChange={(e) => handleChange('discipline', e.target.value)}
                  className="mr-3"
                />
                <span>Fine Arts / Visual Arts</span>
              </label>

              <label className={`form-radio-label ${formData.discipline === 'History' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="discipline"
                  value="History"
                  checked={formData.discipline === 'History'}
                  onChange={(e) => handleChange('discipline', e.target.value)}
                  className="mr-3"
                />
                <span>History</span>
              </label>

              <label className={`form-radio-label ${formData.discipline === 'Other' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="discipline"
                  value="Other"
                  checked={formData.discipline === 'Other'}
                  onChange={(e) => handleChange('discipline', e.target.value)}
                  className="mr-3"
                />
                <span>Other</span>
              </label>
            </div>

            {formData.discipline === 'Other' && (
              <div className="mt-3 pl-2">
                <label htmlFor="other_discipline" className="block text-xs font-medium text-slate-700 mb-1">
                  Please specify your academic discipline: <span className="text-red-500">*</span>
                </label>
                <input
                  id="other_discipline"
                  type="text"
                  placeholder="e.g. Psychology, Biology, Literature..."
                  value={formData.discipline_specified}
                  onChange={(e) => handleChange('discipline_specified', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>

          {/* Question 3: Study Level */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              3. Level of Study: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {['Undergraduate', 'Postgraduate', 'Other'].map((lvl) => (
                <label key={lvl} className={`form-radio-label ${formData.study_level === lvl ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="study_level"
                    value={lvl}
                    checked={formData.study_level === lvl}
                    onChange={(e) => handleChange('study_level', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{lvl}</span>
                </label>
              ))}
            </div>

            <div>
              <label htmlFor="study_year" className="block text-xs font-medium text-slate-700 mb-1">
                Which year or semester of your programme are you currently studying in? (Optional)
              </label>
              <input
                id="study_year"
                type="text"
                placeholder="e.g. Year 2, Semester 1, Final Year"
                value={formData.study_year_semester}
                onChange={(e) => handleChange('study_year_semester', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Question 4: Formal Visual Arts Training */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              4. Have you received formal training in visual arts outside your current academic programme? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {['Yes', 'No'].map((ans) => (
                <label key={ans} className={`form-radio-label ${formData.visual_arts_training === ans ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="visual_arts_training"
                    value={ans}
                    checked={formData.visual_arts_training === ans}
                    onChange={(e) => handleChange('visual_arts_training', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>

            {formData.visual_arts_training === 'Yes' && (
              <div className="mt-2 pl-2">
                <label htmlFor="arts_training_details" className="block text-xs font-medium text-slate-700 mb-1">
                  Please briefly describe the training: <span className="text-red-500">*</span>
                </label>
                <input
                  id="arts_training_details"
                  type="text"
                  placeholder="e.g. 2 years of formal painting instruction, certificate in graphic design..."
                  value={formData.visual_arts_training_details}
                  onChange={(e) => handleChange('visual_arts_training_details', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>

          {/* Question 5: Creative Activity Frequency */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              5. How frequently do you engage in activities such as drawing, painting, design, sculpture, photography, or other visual creative activities? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1.5">
              {['Never', 'Rarely', 'Occasionally', 'Often', 'Very Often'].map((freq) => (
                <label key={freq} className={`form-radio-label ${formData.creative_activity_frequency === freq ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="creative_activity_frequency"
                    value={freq}
                    checked={formData.creative_activity_frequency === freq}
                    onChange={(e) => handleChange('creative_activity_frequency', e.target.value)}
                    className="mr-3"
                  />
                  <span>{freq}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
            >
              <span>Continue to Consent Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
