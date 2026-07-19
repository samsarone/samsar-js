import assert from 'node:assert/strict';
import test from 'node:test';

import SamsarClient from '../dist/index.js';

const SESSION_ID = '507f1f77bcf86cd799439011';
const WORKFLOW_ID = '507f1f77bcf86cd799439012';

function jsonResponse(body, status = 202) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function queuedResponse(overrides = {}) {
  return {
    request_id: SESSION_ID,
    session_id: SESSION_ID,
    status: 'PENDING',
    narrative_type: 'branched',
    interactive_video_request_id: WORKFLOW_ID,
    workflow_status: 'PENDING',
    workflow_stage: 'SINGULAR_NARRATIVE',
    status_url: `/v2/status_detailed?request_id=${SESSION_ID}`,
    ...overrides,
  };
}

test('text-to-interactive-video normalizes aliases and targets the root v2 route', async () => {
  const calls = [];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse(queuedResponse());
    },
  });

  const result = await client.createTextToInteractiveVideo({
    prompt: '  A city wakes and the viewer chooses where to go  ',
    duration: 60,
    inferenceModel: 'GEMINI3.1',
    imageModel: 'SEEDREAM',
    videoModel: 'COSMOS3SUPERI2V',
    numLevels: 2,
  }, {
    webhookUrl: 'https://example.com/webhooks/interactive-video',
    idempotencyKey: 'interactive-video-example-1',
  });

  assert.equal(result.status, 202);
  assert.equal(result.data.request_id, SESSION_ID);
  assert.equal(result.data.interactive_video_request_id, WORKFLOW_ID);
  assert.equal(result.data.workflow_stage, 'SINGULAR_NARRATIVE');
  assert.equal(calls[0].input, 'https://processor.example/v2/text_to_interactive_video');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer sdk-test-key');
  assert.equal(calls[0].init.headers['Idempotency-Key'], 'interactive-video-example-1');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    input: {
      prompt: 'A city wakes and the viewer chooses where to go',
      duration: 60,
      inference_model: 'gemini-3.1-pro',
      video_model: 'COSMOS3SUPERI2V',
      image_model: 'SEEDREAM',
      num_levels: 2,
    },
    webhookUrl: 'https://example.com/webhooks/interactive-video',
  });
});

test('v2-explicit interactive-video method accepts canonical snake-case input', async () => {
  const calls = [];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse(queuedResponse({ workflow_status: 'PROCESSING' }));
    },
  });

  const result = await client.createV2TextToInteractiveVideo({
    prompt: 'A branching workshop documentary',
    duration: 30,
    image_model: 'GPTIMAGE2',
    video_model: 'RUNWAYML',
    num_levels: 1,
  });

  assert.equal(result.data.workflow_status, 'PROCESSING');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    input: {
      prompt: 'A branching workshop documentary',
      duration: 30,
      image_model: 'GPTIMAGE2',
      video_model: 'RUNWAYML',
      num_levels: 1,
    },
  });
});

test('text-to-interactive-video validates required models, levels, and aliases locally', async () => {
  let fetchCalls = 0;
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    fetch: async () => {
      fetchCalls += 1;
      return jsonResponse({});
    },
  });
  const base = {
    prompt: 'A branching story',
    duration: 30,
    image_model: 'SEEDREAM',
    video_model: 'RUNWAYML',
    num_levels: 1,
  };

  await assert.rejects(
    () => client.createTextToInteractiveVideo({ ...base, video_model: undefined }),
    /video_model must be a non-empty string/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({ ...base, image_model: undefined }),
    /image_model must be a non-empty string/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({ ...base, image_model: 'DALLE3' }),
    /image_model must be one of/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({ ...base, video_model: 'VEO3.1' }),
    /video_model must be one of/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({
      ...base,
      videoModel: 'COSMOS3SUPERI2V',
    }),
    /video_model was provided with conflicting alias values/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({
      ...base,
      imageModel: 'GPTIMAGE2',
    }),
    /image_model was provided with conflicting alias values/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({ ...base, numLevels: 2 }),
    /num_levels was provided with conflicting alias values/,
  );
  await assert.rejects(
    () => client.createTextToInteractiveVideo({ ...base, num_levels: 7 }),
    /num_levels must be an integer between 1 and 6/,
  );

  assert.equal(fetchCalls, 0);
});
