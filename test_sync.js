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
      // Follow 302 / 301 redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        const redirectUrl = res.headers.location;
        console.log('Redirecting to:', redirectUrl);
        // Note: Google Apps Script redirect for POST changes to GET or requires GET to the redirect URL
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

async function testSync() {
  const testPayload = {
    action: 'sync_all',
    participants: [
      {
        participant_id: 'P0001_TEST',
        age: 21,
        discipline: 'Fine Arts / Visual Arts',
        discipline_specified: '',
        study_level: 'Undergraduate',
        study_year_semester: 'Year 3',
        visual_arts_training: 'Yes',
        visual_arts_training_details: 'Studio oil painting',
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
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      },
      {
        participant_id: 'P0002_TEST',
        age: 22,
        discipline: 'History',
        discipline_specified: '',
        study_level: 'Undergraduate',
        study_year_semester: 'Year 4',
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
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      },
      {
        participant_id: 'P0003_TEST',
        age: 20,
        discipline: 'Other',
        discipline_specified: 'Cognitive Science',
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
        prior_knowledge_of_functional_fixedness: 'No',
        external_help_used: 'No',
        completion_status: 'Completed',
        is_excluded_by_researcher: false,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      }
    ],
    trials: [
      {
        participant_id: 'P0001_TEST',
        discipline: 'Fine Arts / Visual Arts',
        assigned_modality: 'Picture Condition',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        first_response: 'Emergency SIM card ejector',
        first_response_latency_ms: 3120,
        first_response_latency_seconds: '3.120',
        no_response_flag: false,
        number_of_additional_uses: 3,
        trial_completion_status: 'Completed',
        conventional_function_shown: true
      },
      {
        participant_id: 'P0002_TEST',
        discipline: 'History',
        assigned_modality: 'Word Condition',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        first_response: 'Pick a small mechanical padlock',
        first_response_latency_ms: 4850,
        first_response_latency_seconds: '4.850',
        no_response_flag: false,
        number_of_additional_uses: 2,
        trial_completion_status: 'Completed',
        conventional_function_shown: true
      },
      {
        participant_id: 'P0003_TEST',
        discipline: 'Other',
        assigned_modality: 'Picture Condition',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        first_response: 'Bend into miniature phone stand',
        first_response_latency_ms: 3940,
        first_response_latency_seconds: '3.940',
        no_response_flag: false,
        number_of_additional_uses: 2,
        trial_completion_status: 'Completed',
        conventional_function_shown: true
      }
    ],
    responses: [
      {
        participant_id: 'P0001_TEST',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        response_number: 1,
        response_type: 'First response',
        response_text: 'Emergency SIM card ejector',
        response_timestamp: new Date().toISOString(),
        response_time_from_trial_start: '3.12s'
      },
      {
        participant_id: 'P0001_TEST',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        response_number: 2,
        response_type: 'Additional response',
        response_text: 'Hairpin replacement',
        response_timestamp: new Date().toISOString(),
        response_time_from_trial_start: '12.4s'
      },
      {
        participant_id: 'P0002_TEST',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        response_number: 1,
        response_type: 'First response',
        response_text: 'Pick a small mechanical padlock',
        response_timestamp: new Date().toISOString(),
        response_time_from_trial_start: '4.85s'
      },
      {
        participant_id: 'P0003_TEST',
        trial_number: 1,
        object_id: 'obj_01',
        object_name: 'PAPERCLIP',
        response_number: 1,
        response_type: 'First response',
        response_text: 'Bend into miniature phone stand',
        response_timestamp: new Date().toISOString(),
        response_time_from_trial_start: '3.94s'
      }
    ]
  };

  console.log('Sending test data to Google Sheets Webhook...');
  try {
    const res = await postData(webhookUrl, testPayload);
    console.log('Result Status:', res.statusCode);
    console.log('Result Body:', res.body);
  } catch (err) {
    console.error('Error during post:', err);
  }
}

testSync();
