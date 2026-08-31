import { storageService } from './storageService';
import { DEFAULT_EXPERIMENTAL_OBJECTS } from '../config/defaultObjects';

/**
 * Generates rich, realistic synthetic research data for pilot testing,
 * statistical script verification, and dashboard analytics validation.
 */
export const seedSampleResearchData = () => {
  const sampleParticipants = [
    // --- Fine Arts Participants ---
    {
      id: 'P0001',
      age: 21,
      discipline: 'Fine Arts / Visual Arts',
      discipline_specified: '',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 3',
      visual_arts_training: 'Yes',
      visual_arts_training_details: 'Studio sculpture and oil painting at summer academy',
      creative_activity_frequency: 'Very Often',
      assigned_modality: 'Picture Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 3 + 1200000).toISOString()
    },
    {
      id: 'P0002',
      age: 22,
      discipline: 'Fine Arts / Visual Arts',
      discipline_specified: '',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 4',
      visual_arts_training: 'Yes',
      visual_arts_training_details: 'Ceramics workshop and printmaking course',
      creative_activity_frequency: 'Often',
      assigned_modality: 'Word Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 2.8).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 2.8 + 1150000).toISOString()
    },
    {
      id: 'P0003',
      age: 24,
      discipline: 'Fine Arts / Visual Arts',
      discipline_specified: '',
      study_level: 'Postgraduate',
      study_year_semester: 'MFA Year 1',
      visual_arts_training: 'Yes',
      visual_arts_training_details: 'BFA in Contemporary Installation Art',
      creative_activity_frequency: 'Very Often',
      assigned_modality: 'Picture Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'Not sure',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 2.5).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 2.5 + 1300000).toISOString()
    },
    {
      id: 'P0004',
      age: 20,
      discipline: 'Fine Arts / Visual Arts',
      discipline_specified: '',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 2',
      visual_arts_training: 'No',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Often',
      assigned_modality: 'Word Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 2.1).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 2.1 + 1100000).toISOString()
    },

    // --- History Participants ---
    {
      id: 'P0005',
      age: 21,
      discipline: 'History',
      discipline_specified: '',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 3',
      visual_arts_training: 'No',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Rarely',
      assigned_modality: 'Picture Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 2.0).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 2.0 + 1250000).toISOString()
    },
    {
      id: 'P0006',
      age: 23,
      discipline: 'History',
      discipline_specified: '',
      study_level: 'Postgraduate',
      study_year_semester: 'MA Modern History',
      visual_arts_training: 'No',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Rarely',
      assigned_modality: 'Word Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 1.8).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 1.8 + 1190000).toISOString()
    },
    {
      id: 'P0007',
      age: 19,
      discipline: 'History',
      discipline_specified: '',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 1',
      visual_arts_training: 'No',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Never',
      assigned_modality: 'Picture Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 1.5).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 1.5 + 1310000).toISOString()
    },
    {
      id: 'P0008',
      age: 22,
      discipline: 'History',
      discipline_specified: '',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 4',
      visual_arts_training: 'Yes',
      visual_arts_training_details: 'High school elective in charcoal drawing',
      creative_activity_frequency: 'Occasionally',
      assigned_modality: 'Word Condition',
      eligibility_status: 'Eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'Yes',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 1.2).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 1.2 + 1090000).toISOString()
    },

    // --- Other Discipline Participants (Non-eligible for primary analysis) ---
    {
      id: 'P0009',
      age: 20,
      discipline: 'Other',
      discipline_specified: 'Mechanical Engineering',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 2',
      visual_arts_training: 'No',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Rarely',
      assigned_modality: 'Picture Condition',
      eligibility_status: 'Not eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 0.9).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 0.9 + 1150000).toISOString()
    },
    {
      id: 'P0010',
      age: 22,
      discipline: 'Other',
      discipline_specified: 'Computer Science',
      study_level: 'Undergraduate',
      study_year_semester: 'Year 3',
      visual_arts_training: 'No',
      visual_arts_training_details: '',
      creative_activity_frequency: 'Occasionally',
      assigned_modality: 'Word Condition',
      eligibility_status: 'Not eligible for primary analysis',
      instruction_understanding: 'Yes',
      technical_problems: 'No',
      technical_problems_details: '',
      prior_knowledge_of_functional_fixedness: 'No',
      external_help_used: 'No',
      completion_status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 24 * 0.5).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 24 * 0.5 + 1180000).toISOString()
    }
  ];

  // Responses pool for simulated trials
  const responsesPool = {
    PAPERCLIP: {
      first: [
        'Unbend it to pick a small mechanical lock',
        'Use as an emergency SIM card ejector tool for phones',
        'Bend into a hook to hang miniature holiday ornaments',
        'Use the wire tip to clean lint from charging ports',
        'Form into a tiny wire armature for a clay sculpture'
      ],
      additional: [
        'Bend into a makeshift hairpin',
        'Use as a conductive jumper wire in a circuit test',
        'Twist into a ring for measuring wire gauges',
        'Tape to a magnet as a metal detector test'
      ]
    },
    BRICK: {
      first: [
        'Carve into a rustic bookend for a heavy shelf',
        'Crush into red pigment powder for natural watercolor paint',
        'Heat in an oven and wrap in towel for a traditional foot warmer',
        'Use as a counterweight on a garden sun umbrella',
        'Stand vertically as a heavy doorstop in high wind'
      ],
      additional: [
        'Use rough surface as an abrasive knife sharpener',
        'Anchor a swimming pool tarp down during winter',
        'Place under a tire as a car wheel chock'
      ]
    },
    NEWSPAPER: {
      first: [
        'Shred and soak into papier-mache pulp for sculpting bowls',
        'Line gardening beds to prevent weed growth organically',
        'Crumple tightly to polish glass mirrors without streaks',
        'Stuff into damp leather boots to absorb moisture and preserve shape',
        'Layer underneath floorboards as acoustic insulation'
      ],
      additional: [
        'Wrap fragile glassware during house moving',
        'Fold into an origami sun hat for gardening',
        'Light fireplace as quick kindling'
      ]
    },
    SPOON: {
      first: [
        'Reflect candlelight as a focused light reflector',
        'Use the polished metal edge to burnish gold leaf on wood',
        'Press chilled bowl against tired eyes to reduce puffiness',
        'Pry open stuck paint can lids using lever principle',
        'Bend bowl backward to create a drawer pull handle'
      ],
      additional: [
        'Tap rhythmically as a percussion folk instrument',
        'Use as a small shoehorn when putting on tight shoes',
        'Trace curved bowl shape as a drawing stencil'
      ]
    },
    CUP: {
      first: [
        'Invert on a wooden door to listen through walls as a sound amplifier',
        'Cut drainage holes in base to make a seedling planter pot',
        'Press rim into rolled biscuit dough to cut round cookies',
        'Use as a desktop pencil and pen holder',
        'Invert as a protective dome over small garden sprouts'
      ],
      additional: [
        'Trace circular base for drafting circles',
        'Trap a house spider safely against a wall'
      ]
    },
    RUBBER_BAND: {
      first: [
        'Wrap around a stuck jar lid to provide high-friction grip',
        'Stretch across a box opening to make a simple plucked string instrument',
        'Loop around paint can opening to wipe excess paint off brush without rim mess',
        'Wrap on ends of clothes hangers to prevent silk garments from slipping',
        'Bundle loose cables behind a desk together neatly'
      ],
      additional: [
        'Use as an impromptu bookmark around whole paperback',
        'Make an eraser for light pencil marks',
        'Wrap on sliced apples to keep them fresh in lunchbox'
      ]
    }
  };

  const storedParticipants = [];
  const storedTrials = [];
  const storedResponses = [];

  sampleParticipants.forEach(p => {
    const partData = {
      participant_id: p.id,
      age: p.age,
      discipline: p.discipline,
      discipline_specified: p.discipline_specified,
      study_level: p.study_level,
      study_year_semester: p.study_year_semester,
      visual_arts_training: p.visual_arts_training,
      visual_arts_training_details: p.visual_arts_training_details,
      creative_activity_frequency: p.creative_activity_frequency,
      assigned_modality: p.assigned_modality,
      eligibility_status: p.eligibility_status,
      instruction_understanding: p.instruction_understanding,
      technical_problems: p.technical_problems,
      technical_problems_details: p.technical_problems_details,
      prior_knowledge_of_functional_fixedness: p.prior_knowledge_of_functional_fixedness,
      external_help_used: p.external_help_used,
      completion_status: p.completion_status,
      is_excluded_by_researcher: false,
      created_at: p.created_at,
      completed_at: p.completed_at
    };
    storedParticipants.push(partData);

    // Generate 6 trials per participant
    DEFAULT_EXPERIMENTAL_OBJECTS.forEach((obj, idx) => {
      const trialNum = idx + 1;
      const pool = responsesPool[obj.name] || responsesPool.PAPERCLIP;
      
      // Determine realistic simulated latency
      // (e.g. Fine Arts in Picture condition might access perceptual uses faster)
      let baseLatency = 4500;
      if (p.discipline.includes('Fine Arts') && p.assigned_modality.includes('Picture')) {
        baseLatency = 3400 + Math.floor(Math.random() * 1800);
      } else if (p.discipline.includes('Fine Arts')) {
        baseLatency = 4200 + Math.floor(Math.random() * 2200);
      } else if (p.assigned_modality.includes('Picture')) {
        baseLatency = 5400 + Math.floor(Math.random() * 3200);
      } else {
        baseLatency = 4900 + Math.floor(Math.random() * 2800);
      }

      const firstResponseText = pool.first[idx % pool.first.length];
      const additionalCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 additional uses

      const trialData = {
        participant_id: p.id,
        discipline: p.discipline,
        assigned_modality: p.assigned_modality,
        trial_number: trialNum,
        object_id: obj.id,
        object_name: obj.name,
        first_response: firstResponseText,
        first_response_latency_ms: baseLatency,
        first_response_latency_seconds: (baseLatency / 1000).toFixed(3),
        no_response_flag: false,
        number_of_additional_uses: additionalCount,
        trial_completion_status: 'Completed',
        conventional_function_shown: true
      };
      storedTrials.push(trialData);

      // Record first response
      storedResponses.push({
        participant_id: p.id,
        trial_number: trialNum,
        object_id: obj.id,
        object_name: obj.name,
        response_number: 1,
        response_type: 'First response',
        response_text: firstResponseText,
        response_timestamp: new Date(Date.parse(p.created_at) + (trialNum * 90000) + baseLatency).toISOString(),
        response_time_from_trial_start: (baseLatency / 1000).toFixed(2) + 's'
      });

      // Record additional responses
      for (let a = 0; a < additionalCount; a++) {
        const addText = pool.additional[a % pool.additional.length] || `Alternative use #${a + 2}`;
        const addLatencySec = 10 + (a * 12) + Math.floor(Math.random() * 6);
        storedResponses.push({
          participant_id: p.id,
          trial_number: trialNum,
          object_id: obj.id,
          object_name: obj.name,
          response_number: a + 2,
          response_type: 'Additional response',
          response_text: addText,
          response_timestamp: new Date(Date.parse(p.created_at) + (trialNum * 90000) + (addLatencySec * 1000)).toISOString(),
          response_time_from_trial_start: (addLatencySec).toFixed(1) + 's'
        });
      }
    });
  });

  // Save to localStorage
  localStorage.setItem('psych_exp_participants', JSON.stringify(storedParticipants));
  localStorage.setItem('psych_exp_trials', JSON.stringify(storedTrials));
  localStorage.setItem('psych_exp_responses', JSON.stringify(storedResponses));

  return {
    participantsCount: storedParticipants.length,
    trialsCount: storedTrials.length,
    responsesCount: storedResponses.length
  };
};
