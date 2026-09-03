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

// Generate 3 fresh randomized test instances
const randomSuffix = Math.floor(Math.random() * 900 + 100);

const participants = [
  {
    participant_id: `P${randomSuffix}_1`,
    age: 22,
    discipline: 'Fine Arts / Visual Arts',
    discipline_specified: '',
    study_level: 'Undergraduate',
    study_year_semester: 'Year 4, Semester 2',
    visual_arts_training: 'Yes',
    visual_arts_training_details: '4 years formal studio drawing and sculpture',
    creative_activity_frequency: 'Very Often',
    assigned_modality: 'Picture Condition', // Selected on Step 4
    eligibility_status: 'Eligible for primary analysis',
    instruction_understanding: 'Yes',
    technical_problems: 'No',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: 'No',
    external_help_used: 'No',
    completion_status: 'Completed',
    is_excluded_by_researcher: false,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    participant_id: `P${randomSuffix}_2`,
    age: 24,
    discipline: 'History',
    discipline_specified: '',
    study_level: 'Postgraduate',
    study_year_semester: 'MA History of Science',
    visual_arts_training: 'No',
    visual_arts_training_details: '',
    creative_activity_frequency: 'Rarely',
    assigned_modality: 'Word Condition', // Selected on Step 4
    eligibility_status: 'Eligible for primary analysis',
    instruction_understanding: 'Yes',
    technical_problems: 'No',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: 'No',
    external_help_used: 'No',
    completion_status: 'Completed',
    is_excluded_by_researcher: false,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    participant_id: `P${randomSuffix}_3`,
    age: 20,
    discipline: 'Fine Arts / Visual Arts',
    discipline_specified: '',
    study_level: 'Undergraduate',
    study_year_semester: 'Year 2',
    visual_arts_training: 'Yes',
    visual_arts_training_details: 'Digital illustration & ceramics diploma',
    creative_activity_frequency: 'Often',
    assigned_modality: 'Word Condition', // Selected on Step 4
    eligibility_status: 'Eligible for primary analysis',
    instruction_understanding: 'Yes',
    technical_problems: 'No',
    technical_problems_details: '',
    prior_knowledge_of_functional_fixedness: 'No',
    external_help_used: 'No',
    completion_status: 'Completed',
    is_excluded_by_researcher: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    completed_at: new Date().toISOString()
  }
];

const objects = [
  { id: 'obj_01', name: 'PAPERCLIP' },
  { id: 'obj_02', name: 'BRICK' },
  { id: 'obj_03', name: 'NEWSPAPER' },
  { id: 'obj_04', name: 'SPOON' },
  { id: 'obj_05', name: 'CUP' },
  { id: 'obj_06', name: 'RUBBER_BAND' }
];

const responsesLookup = {
  [`P${randomSuffix}_1`]: {
    PAPERCLIP: { first: 'Bend into delicate wire armature for small clay figurine', lat: 2640, add: ['Engraving stylus on wax', 'Earring hook replacement', 'Book page marker'] },
    BRICK: { first: 'Grind down to make textured terracotta pigment for oil glazes', lat: 2890, add: ['Outdoor canvas easel weight', 'Rustic photography prop', 'Thermal heatsink for kiln'] },
    NEWSPAPER: { first: 'Pulp with water and starch to create papier-mache sculpture', lat: 2750, add: ['Origami geometric plant pot', 'Studio floor drop cloth', 'Window streak cleaner'] },
    SPOON: { first: 'Concave surface for burnishing drypoint etching plates', lat: 3100, add: ['Color mixing palette spoon', 'Clay sculpting loop tool', 'Chilled swelling reducer'] },
    CUP: { first: 'Use rim as perfect circle stencil on drafting paper', lat: 2920, add: ['Desktop paintbrush washer', 'Mini terrarium dome', 'Pencil holder organizer'] },
    RUBBER_BAND: { first: 'Stretched elastic strings for sound sculpture instrument', lat: 2710, add: ['Wrap on wooden bobbins', 'Non-slip grip on ruler', 'Palette knife binder'] }
  },
  [`P${randomSuffix}_2`]: {
    PAPERCLIP: { first: 'Reset mechanism pin for electronic digital scanner', lat: 4820, add: ['Emergency binder for loose archive folios', 'Unclog dried fountain pen nib'] },
    BRICK: { first: 'Heavy paperweight across large historical manuscript maps', lat: 5100, add: ['Door stop for archive reading room', 'Elevate reference book stand'] },
    NEWSPAPER: { first: 'Acid-free packing cushion during historic relic transit', lat: 4670, add: ['Kindling for hearth fire', 'Absorb moisture from leather binding'] },
    SPOON: { first: 'Gentle lever to pry open stuck vintage brass seal tins', lat: 4950, add: ['Reflect directional desk lamp light', 'Measure dry chemical compounds'] },
    CUP: { first: 'Protective receptacle for delicate quill pens and magnifier', lat: 4400, add: ['Hold water for stamp damping', 'Sort ancient catalog tokens'] },
    RUBBER_BAND: { first: 'Secure rolled 19th-century parchment blueprints safely', lat: 4790, add: ['Bundle research index cards', 'Bookmark wrapped vertically over folio'] }
  },
  [`P${randomSuffix}_3`]: {
    PAPERCLIP: { first: 'Makeshift zipper slider pull on coat', lat: 3420, add: ['SIM card eject tool', 'Key ring fastener', 'Hang lightweight calendar'] },
    BRICK: { first: 'Level an uneven wooden workbench table leg', lat: 3850, add: ['Garden bed edging border', 'Exercise calisthenics block'] },
    NEWSPAPER: { first: 'Wrap fragile ceramic pottery for gift delivery', lat: 3600, add: ['Compost bin carbon bedding', 'Table protector for ink tasks'] },
    SPOON: { first: 'Smooth out uneven cake frosting edges', lat: 3780, add: ['Acoustic rhythm spoons percussion', 'Shoehorn emergency slip'] },
    CUP: { first: 'Invert over open food to protect from dust', lat: 3510, add: ['Catch dripping wax from candle', 'Cut circular biscuit dough'] },
    RUBBER_BAND: { first: 'Wrap tightly around slippery jar lid for twist grip', lat: 3340, add: ['Color-code cable wires', 'Keep wallet cards bundled tightly'] }
  }
};

const allTrials = [];
const allResponses = [];

participants.forEach(p => {
  objects.forEach((obj, idx) => {
    const trialNum = idx + 1;
    const itemData = responsesLookup[p.participant_id][obj.name];

    allTrials.push({
      participant_id: p.participant_id,
      discipline: p.discipline,
      assigned_modality: p.assigned_modality,
      trial_number: trialNum,
      object_id: obj.id,
      object_name: obj.name,
      first_response: itemData.first,
      first_response_latency_ms: itemData.lat,
      first_response_latency_seconds: (itemData.lat / 1000).toFixed(3),
      no_response_flag: false,
      number_of_additional_uses: itemData.add.length,
      trial_completion_status: 'Completed',
      conventional_function_shown: true
    });

    // 1st Response
    allResponses.push({
      participant_id: p.participant_id,
      trial_number: trialNum,
      object_id: obj.id,
      object_name: obj.name,
      response_number: 1,
      response_type: 'First response',
      response_text: itemData.first,
      response_timestamp: new Date(Date.parse(p.created_at) + (trialNum * 60000) + itemData.lat).toISOString(),
      response_time_from_trial_start: (itemData.lat / 1000).toFixed(2) + 's'
    });

    // Additional responses
    itemData.add.forEach((addTxt, aIdx) => {
      const addLat = 8 + (aIdx * 12);
      allResponses.push({
        participant_id: p.participant_id,
        trial_number: trialNum,
        object_id: obj.id,
        object_name: obj.name,
        response_number: aIdx + 2,
        response_type: 'Additional response',
        response_text: addTxt,
        response_timestamp: new Date(Date.parse(p.created_at) + (trialNum * 60000) + (addLat * 1000)).toISOString(),
        response_time_from_trial_start: addLat.toFixed(1) + 's'
      });
    });
  });
});

async function run() {
  console.log(`Sending 3 randomized test instances:`);
  console.log(`- Participants: ${participants.map(p => `${p.participant_id} (${p.discipline} / ${p.assigned_modality})`).join(', ')}`);
  console.log(`- Total Trials: ${allTrials.length}`);
  console.log(`- Total Qualitative Responses: ${allResponses.length}`);

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
