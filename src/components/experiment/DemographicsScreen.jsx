import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const DemographicsScreen = () => {
  const { submitDemographics } = useExperiment();

  const [formData, setFormData] = useState({
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

    // 3. Year of Study Validation
    if (!formData.study_year) {
      setError('Please select your current year of study.');
      return;
    }

    // 4. Visual Arts Training Validation
    if (!formData.visual_arts_training) {
      setError('Please indicate whether you have received formal visual arts training.');
      return;
    }
    if (formData.visual_arts_training === 'Yes' && !formData.visual_arts_training_years.trim() && !formData.visual_arts_training_details.trim()) {
      setError('Please indicate approximately how many years of formal visual arts training you received.');
      return;
    }

    submitDemographics(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="research-card-lg p-8 sm:p-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4" />
          <span>Demographic Information</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Demographic Questionnaire
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Please provide your background information. All data is anonymous.
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
            <p className="text-xs text-slate-500 mt-1">Numeric input (18+).</p>
          </div>

          {/* Question 2: Gender (Optional) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              2. Gender: <span className="text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Prefer to self-describe'].map((g) => (
                <label key={g} className={`form-radio-label ${formData.gender === g ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="mr-2.5"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>

            {formData.gender === 'Prefer to self-describe' && (
              <div className="mt-2 pl-2">
                <input
                  type="text"
                  placeholder="Please specify..."
                  value={formData.gender_self_describe}
                  onChange={(e) => handleChange('gender_self_describe', e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>

          {/* Question 3: Academic Discipline (Factorial Variable 1) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-semibold text-slate-900">
                3. Academic Discipline / Programme: <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Required
              </span>
            </div>
            <div className="space-y-2">
              <label className={`form-radio-label ${formData.discipline === 'Fine Arts' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="discipline"
                  value="Fine Arts"
                  checked={formData.discipline === 'Fine Arts'}
                  onChange={(e) => handleChange('discipline', e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium text-slate-900">Fine Arts</span>
              </label>

              <label className={`form-radio-label ${formData.discipline === 'Commerce' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="discipline"
                  value="Commerce"
                  checked={formData.discipline === 'Commerce'}
                  onChange={(e) => handleChange('discipline', e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium text-slate-900">Commerce</span>
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
                  Please specify your discipline / major: <span className="text-red-500">*</span>
                </label>
                <input
                  id="other_discipline"
                  type="text"
                  placeholder="e.g. Science, Engineering, Humanities..."
                  value={formData.discipline_specified}
                  onChange={(e) => handleChange('discipline_specified', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>

          {/* Question 4: Year of Study */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              4. Year of Study: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Postgraduate', 'Other'].map((yr) => (
                <label key={yr} className={`form-radio-label ${formData.study_year === yr ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="study_year"
                    value={yr}
                    checked={formData.study_year === yr}
                    onChange={(e) => handleChange('study_year', e.target.value)}
                    className="mr-2"
                  />
                  <span>{yr}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 5: Formal Visual Arts Training */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="block font-semibold text-slate-900 mb-2">
              5. Have you received formal training in visual arts outside your current academic programme? <span className="text-red-500">*</span>
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
              <div className="mt-2 pl-2 space-y-2">
                <div>
                  <label htmlFor="arts_training_years" className="block text-xs font-medium text-slate-700 mb-1">
                    Approximately how many years of formal visual arts training have you received? <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="arts_training_years"
                    type="text"
                    placeholder="e.g. 2 years"
                    value={formData.visual_arts_training_years}
                    onChange={(e) => handleChange('visual_arts_training_years', e.target.value)}
                    className="form-input max-w-xs"
                    required
                  />
                </div>
              </div>
            )}
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
