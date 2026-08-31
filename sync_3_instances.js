import https from 'https';

const webhookUrl = 'https://script.google.com/macros/s/AKfycbwelfd9_51-coBy8Sv6HIlMg_29b483gAJu35hjK838FXHbqJuSaix20PampK7RNI2m8g/exec';

function postData(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postBody = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(postBody)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        const redirectUrl = res.headers.location;
        https.get(redirectUrl, (getRes) => {
          let getBody = '';
          getRes.on('data', chunk => getBody += chunk);
          getRes.on('end', () => resolve({ statusCode: getRes.statusCode, body: getBody }));
        }).on('error', reject);
        return;
      }

      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: responseBody }));
    });

    req.on('error', reject);
    req.write(postBody);
    req.end();
  });
}

// 3 Complete Test Instances conforming to Study Design
const participants = [
  // Test Instance 1: Fine Arts / Visual Arts in Picture Condition
  {
    participant_id: 'P0001',
    age: 21,
    discipline: 'Fine Arts / Visual Arts',
    discipline_specified: '',
    study_level: 'Undergraduate',
    study_year_semester: 'Year 3, Semester 1',
    visual_arts_training: 'Yes',
    visual_arts_training_details: 'Studio sculpture and oil painting academy',
    creative_activity_frequency: 'Very Often',
    assigned_modality: 'Picture Condition',
    eligibility_status: 'Eligible for primary analysis',
    instruction_understanding: 'Yes',
    technical_problems: 'No',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: 'No',
    external_help_used: 'No',
    completion_status: 'Completed',
    is_excluded_by_researcher: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 1.7).toISOString()
  },
  // Test Instance 2: History in Word Condition
  {
    participant_id: 'P0002',
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
    is_excluded_by_researcher: false,
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 1.2).toISOString()
  },
  // Test Instance 3: Other Discipline (Psychology) in Picture Condition
  {
    participant_id: 'P0003',
    age: 20,
    discipline: 'Other',
    discipline_specified: 'Psychology',
    study_level: 'Undergraduate',
    study_year_semester: 'Year 2',
    visual_arts_training: 'No',
    visual_arts_training_details: '',
    creative_activity_frequency: 'Occasionally',
    assigned_modality: 'Picture Condition',
    eligibility_status: 'Not eligible for primary analysis',
    instruction_understanding: 'Yes',
    technical_problems: 'No',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: 'Yes',
    external_help_used: 'No',
    completion_status: 'Completed',
    is_excluded_by_researcher: false,
    created_at: new Date(Date.now() - 3600000 * 0.9).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 0.6).toISOString()
  }
];

const objects = [
  { id: 'obj_01', name: 'PAPERCLIP', conv: 'A paperclip is commonly used to hold sheets of paper together.' },
  { id: 'obj_02', name: 'BRICK', conv: 'A brick is commonly used to construct walls, pavements, and buildings.' },
  { id: 'obj_03', name: 'NEWSPAPER', conv: 'A newspaper is commonly used to read current news, articles, and announcements.' },
  { id: 'obj_04', name: 'SPOON', conv: 'A spoon is commonly used to eat soups and liquids or stir beverages.' },
  { id: 'obj_05', name: 'CUP', conv: 'A cup is commonly used to hold and drink liquid beverages.' },
  { id: 'obj_06', name: 'RUBBER_BAND', conv: 'A rubber band is commonly used to bind or hold multiple loose items together.' }
];

const responsesData = {
  P0001: {
    PAPERCLIP: { first: 'Unbend to use as miniature lockpick tool', latency: 2840, add: ['SIM card tray ejector', 'Makeshift hairpin', 'Wire armature core for clay'] },
    BRICK: { first: 'Crush into red mineral pigment powder for paint', latency: 3150, add: ['Outdoor umbrella counterweight', 'Heavy rustic doorstop', 'Abrasive tool sharpener'] },
    NEWSPAPER: { first: 'Soak into papier-mache pulp for sculpting', latency: 2980, add: ['Weed barrier liner for garden beds', 'Glass mirror polishing cloth', 'Stuff into wet shoes'] },
    SPOON: { first: 'Polished bowl edge for burnishing gold leaf', latency: 3420, add: ['Curved drawing stencil', 'Chilled compress for tired eyes', 'Rhythmic percussion folk instrument'] },
    CUP: { first: 'Invert as protective cloche dome over seedlings', latency: 3100, add: ['Biscuit dough circle cutter', 'Acoustic amplifier against wall', 'Desk pen organizer'] },
    RUBBER_BAND: { first: 'Wrap on jar lid for high-friction grip', latency: 2900, add: ['Stretched string instrument on box', 'Paintbrush wiper across can', 'Non-slip grip on clothes hanger'] }
  },
  P0002: {
    PAPERCLIP: { first: 'Emergency reset pin for router electronics', latency: 4950, add: ['Zipper pull replacement', 'Clean lint from phone port'] },
    BRICK: { first: 'Heavy paperweight on open reference desk maps', latency: 5400, add: ['Fire pit perimeter boundary', 'Vehicle wheel chock'] },
    NEWSPAPER: { first: 'Fireplace kindling and fire starter', latency: 4780, add: ['Wrapping delicate porcelain during moving', 'Origami sun hat'] },
    SPOON: { first: 'Pry open stuck archive metal tin lids', latency: 5120, add: ['Reflect candlelight in dark area', 'Shoehorn in emergency'] },
    CUP: { first: 'Desk holder for dip pens and magnifying glass', latency: 4600, add: ['Small indoor planter pot', 'Measure liquid volumes'] },
    RUBBER_BAND: { first: 'Bundle rolled archive parchment scrolls', latency: 4890, add: ['Bookmark wrapped around volume', 'Eraser for light pencil marks'] }
  },
  P0003: {
    PAPERCLIP: { first: 'Bend into customized bookmark clip', latency: 3820, add: ['Phone stand prop', 'Key ring organizer'] },
    BRICK: { first: 'Elevate laptop monitor to ergonomic height', latency: 4100, add: ['Garden stepping stone', 'Bench press counterweight'] },
    NEWSPAPER: { first: 'Table protector during messy experiments', latency: 3950, add: ['Biodegradable compost layer', 'Pet cage lining'] },
    SPOON: { first: 'Measure exact powder doses in lab', latency: 4250, add: ['Tap for auditory reaction task', 'Lever for stuck caps'] },
    CUP: { first: 'Trap house spider safely against wall', latency: 3750, add: ['Dice shaker cup', 'Sand timer base'] },
    RUBBER_BAND: { first: 'Tension band for finger rehabilitation', latency: 3650, add: ['Cable management bundle', 'Keep apple slices together'] }
  }
};

const allTrials = [];
const allResponses = [];

participants.forEach(p => {
  objects.forEach((obj, idx) => {
    const trialNum = idx + 1;
    const itemData = responsesData[p.participant_id][obj.name];
    
    allTrials.push({
      participant_id: p.participant_id,
      discipline: p.discipline,
      assigned_modality: p.assigned_modality,
      trial_number: trialNum,
      object_id: obj.id,
      object_name: obj.name,
      first_response: itemData.first,
      first_response_latency_ms: itemData.latency,
      first_response_latency_seconds: (itemData.latency / 1000).toFixed(3),
      no_response_flag: false,
      number_of_additional_uses: itemData.add.length,
      trial_completion_status: 'Completed',
      conventional_function_shown: true
    });

    // Response 1 (First response)
    allResponses.push({
      participant_id: p.participant_id,
      trial_number: trialNum,
      object_id: obj.id,
      object_name: obj.name,
      response_number: 1,
      response_type: 'First response',
      response_text: itemData.first,
      response_timestamp: new Date(Date.parse(p.created_at) + (trialNum * 90000) + itemData.latency).toISOString(),
      response_time_from_trial_start: (itemData.latency / 1000).toFixed(2) + 's'
    });

    // Additional responses
    itemData.add.forEach((addText, aIdx) => {
      const addLatencySec = 10 + (aIdx * 14);
      allResponses.push({
        participant_id: p.participant_id,
        trial_number: trialNum,
        object_id: obj.id,
        object_name: obj.name,
        response_number: aIdx + 2,
        response_type: 'Additional response',
        response_text: addText,
        response_timestamp: new Date(Date.parse(p.created_at) + (trialNum * 90000) + (addLatencySec * 1000)).toISOString(),
        response_time_from_trial_start: addLatencySec.toFixed(1) + 's'
      });
    });
  });
});

async function run() {
  console.log(`Starting synchronization of 3 test instances:`);
  console.log(`- ${participants.length} Participants (Fine Arts, History, Other)`);
  console.log(`- ${allTrials.length} Trial records`);
  console.log(`- ${allResponses.length} Qualitative responses`);

  const payload = {
    action: 'sync_all',
    timestamp: new Date().toISOString(),
    participants,
    trials: allTrials,
    responses: allResponses
  };

  const res = await postData(webhookUrl, payload);
  console.log('Sync Response Status:', res.statusCode);
  console.log('Sync Response Body:', res.body);
}

run();
