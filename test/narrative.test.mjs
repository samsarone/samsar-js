import assert from 'node:assert/strict';
import test from 'node:test';

import SamsarClient, { SamsarRequestError } from '../dist/index.js';

const REQUEST_ID = '507f1f77bcf86cd799439011';
const CREATED_AT = '2026-07-18T04:00:00.000Z';
const UPDATED_AT = '2026-07-18T04:01:00.000Z';

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function narrativeBase(status, overrides = {}) {
  return {
    request_id: REQUEST_ID,
    requestId: REQUEST_ID,
    request_type: 'create_single',
    narrative_type: 'singular',
    status,
    poll_url: `/v2/external/narrative/status?request_id=${REQUEST_ID}`,
    prompt: 'A grounded city story',
    duration: 60,
    inference_model: 'gemini-3.1-pro',
    video_model: 'RUNWAYML',
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,
    ...overrides,
  };
}

function branchingNarrativeBase(status, overrides = {}) {
  return narrativeBase(status, {
    request_type: 'create_branching',
    narrative_type: 'branched',
    source_narrative_request_id: '507f1f77bcf86cd799439010',
    num_levels: 1,
    ...overrides,
  });
}

function completedNarrative() {
  return narrativeBase('COMPLETED', {
    themeJson: { style: ['documentary'] },
    narrativeJson: { scenes: [{ visual: 'Raw scene' }], sounds: [] },
    movieResourceList: { scenes: [{ visual: 'Enriched scene' }], sounds: [] },
    billing: {
      pricing_multiplier: 1.5,
      underlying_cost_usd: 0.02,
      underlying_credits: 2,
      credits_charged: 3,
      remaining_credits: -1,
      usage: {
        inputTokens: 100,
        outputTokens: 20,
        cachedInputTokens: 10,
        reasoningTokens: 5,
      },
    },
    creditsCharged: 3,
    remainingCredits: -1,
    completed_at: UPDATED_AT,
  });
}

function completedBranchingNarrative() {
  const paths = [
    {
      childNodeId: 'root.1',
      path_name: 'Follow the river',
      path_description: 'The story follows the river toward the waking city.',
    },
    {
      childNodeId: 'root.2',
      path_name: 'Stay in the soi',
      path_description: 'The story remains with the neighborhood morning ritual.',
    },
  ];
  const branchPoint = {
    branchPointId: 'branch-point:root',
    parentNodeId: 'root',
    level: 1,
    divergenceSceneIndex: 1,
    status: 'COMPLETED',
    divergencePaths: paths,
  };
  const resourceList = (visual) => ({
    scenes: [
      { visual: 'Shared opening' },
      { visual: 'Shared choice scene' },
      { visual },
    ],
    sounds: [
      { audio: 'Opening' },
      { audio: 'The choice approaches' },
      { audio: visual },
    ],
  });
  const movieResourceList = {
    structureType: 'branched',
    schemaVersion: 1,
    rootNodeId: 'root',
    numLevels: 1,
    branchingFactor: 2,
    branchSceneIndices: [1],
    nodes: [
      {
        nodeId: 'root',
        parentNodeId: null,
        childNodeIds: ['root.1', 'root.2'],
        level: 0,
        childIndex: null,
        branchOrdinal: null,
        divergence: null,
        ...resourceList('Original ending'),
      },
      {
        nodeId: 'root.1',
        parentNodeId: 'root',
        childNodeIds: [],
        level: 1,
        childIndex: 0,
        branchOrdinal: 1,
        divergence: {
          divergenceSceneIndex: 1,
          path_name: paths[0].path_name,
          path_description: paths[0].path_description,
        },
        ...resourceList('River ending'),
      },
      {
        nodeId: 'root.2',
        parentNodeId: 'root',
        childNodeIds: [],
        level: 1,
        childIndex: 1,
        branchOrdinal: 2,
        divergence: {
          divergenceSceneIndex: 1,
          path_name: paths[1].path_name,
          path_description: paths[1].path_description,
        },
        ...resourceList('Soi ending'),
      },
    ],
    branchPoints: [branchPoint],
  };
  return branchingNarrativeBase('COMPLETED', {
    themeJson: { style: ['documentary'] },
    narrativeJson: resourceList('Original ending'),
    movieResourceList,
    branchingMeta: {
      schemaVersion: 1,
      numLevels: 1,
      branchingFactor: 2,
      rootNodeId: 'root',
      branchSceneIndices: [1],
      branchPoints: [branchPoint],
      leafNodeIds: ['root.1', 'root.2'],
      nodeCount: 3,
    },
    billing: {
      pricing_multiplier: 1.5,
      underlying_cost_usd: 0.04,
      underlying_credits: 4,
      credits_charged: 6,
      remaining_credits: 12,
      usage: {
        inputTokens: 300,
        outputTokens: 100,
        cachedInputTokens: 20,
        reasoningTokens: 30,
      },
    },
    creditsCharged: 6,
    remainingCredits: 12,
    completed_at: UPDATED_AT,
  });
}

test('create_single sends the canonical route, payload, auth, and preserves model defaults', async () => {
  const calls = [];
  const responses = [
    jsonResponse(narrativeBase('PENDING', {
      video_model: 'COSMOS3SUPERI2V',
    }), 202),
    jsonResponse(narrativeBase('PENDING', {
      inference_model: 'gpt-5.6-sol',
      prompt: 'Use my default',
    }), 202),
  ];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return responses.shift();
    },
  });

  const explicit = await client.createExternalSingleNarrative({
    prompt: '  A grounded city story  ',
    duration: 60,
    inferenceModel: 'GEMINI3.1',
    videoModel: 'COSMOS3SUPERI2V',
  });
  const accountDefault = await client.createV2ExternalSingleNarrative({
    prompt: 'Use my default',
    duration: 30,
  });

  assert.equal(explicit.status, 202);
  assert.equal(explicit.data.status, 'PENDING');
  assert.equal(
    calls[0].input,
    'https://processor.example/v2/external/narrative/create_single',
  );
  assert.equal(calls[0].init.headers.Authorization, 'Bearer sdk-test-key');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    prompt: 'A grounded city story',
    duration: 60,
    inference_model: 'gemini-3.1-pro',
    video_model: 'COSMOS3SUPERI2V',
  });
  assert.deepEqual(JSON.parse(calls[1].init.body), {
    prompt: 'Use my default',
    duration: 30,
  });
  assert.equal(accountDefault.data.inference_model, 'gpt-5.6-sol');
  assert.equal(accountDefault.data.video_model, 'RUNWAYML');
});

test('status polling tolerates PENDING before returning completed artifacts and billing', async () => {
  const calls = [];
  const responses = [
    jsonResponse(narrativeBase('PENDING')),
    jsonResponse(completedNarrative(), 200, {
      'x-credits-charged': '3',
      'x-credits-remaining': '-1',
    }),
  ];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return responses.shift();
    },
  });

  const result = await client.pollV2ExternalNarrative(REQUEST_ID, {
    pollIntervalMs: 250,
    pollTimeoutMs: 5_000,
  });

  assert.equal(calls.length, 2);
  assert.ok(calls.every(({ input }) => (
    input === `https://processor.example/v2/external/narrative/status?request_id=${REQUEST_ID}`
  )));
  assert.equal(result.data.status, 'COMPLETED');
  assert.deepEqual(result.data.narrativeJson.scenes, [{ visual: 'Raw scene' }]);
  assert.deepEqual(result.data.movieResourceList.scenes, [{ visual: 'Enriched scene' }]);
  assert.equal(result.data.billing.pricing_multiplier, 1.5);
  assert.equal(result.data.remainingCredits, -1);
  assert.equal(result.creditsCharged, 3);
  assert.equal(result.creditsRemaining, -1);
});

test('combined create-and-poll uses the returned request id', async () => {
  const calls = [];
  const responses = [
    jsonResponse(narrativeBase('PENDING', { inference_model: 'QWEN3.7' }), 202),
    jsonResponse(completedNarrative()),
  ];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return responses.shift();
    },
  });

  const result = await client.createV2ExternalSingleNarrativeAndPoll({
    prompt: 'A grounded city story',
    duration: 60,
    inference_model: 'QWEN3.7',
    video_model: 'VEO3.1I2VFAST',
  });

  assert.equal(result.data.status, 'COMPLETED');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    prompt: 'A grounded city story',
    duration: 60,
    inference_model: 'QWEN3.7',
    video_model: 'VEO3.1I2VFAST',
  });
  assert.match(calls[1].input, new RegExp(`request_id=${REQUEST_ID}$`));
});

test('create_branching sends the canonical route and normalizes camel-case input', async () => {
  const calls = [];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse(branchingNarrativeBase('PENDING'), 202);
    },
  });

  const queued = await client.createExternalBranchingNarrative({
    narrativeRequestId: `  ${REQUEST_ID}  `,
    numLevels: 1,
    videoModel: 'RUNWAYML',
  });

  assert.equal(queued.status, 202);
  assert.equal(queued.data.request_type, 'create_branching');
  assert.equal(
    calls[0].input,
    'https://processor.example/v2/external/narrative/create_branching',
  );
  assert.equal(calls[0].init.headers.Authorization, 'Bearer sdk-test-key');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    narrative_request_id: REQUEST_ID,
    num_levels: 1,
    video_model: 'RUNWAYML',
  });
});

test('create_branching-and-poll returns the complete typed tree and cumulative billing', async () => {
  const calls = [];
  const responses = [
    jsonResponse(branchingNarrativeBase('PENDING'), 202),
    jsonResponse(branchingNarrativeBase('PROCESSING')),
    jsonResponse(completedBranchingNarrative(), 200, {
      'x-credits-charged': '6',
      'x-credits-remaining': '12',
    }),
  ];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return responses.shift();
    },
  });

  const completed = await client.createV2ExternalBranchingNarrativeAndPoll({
    narrative_request_id: REQUEST_ID,
    num_levels: 1,
  }, {
    pollIntervalMs: 250,
    pollTimeoutMs: 5_000,
  });

  assert.equal(completed.data.status, 'COMPLETED');
  assert.equal(completed.data.narrative_type, 'branched');
  assert.equal(completed.data.video_model, 'RUNWAYML');
  assert.equal(completed.data.movieResourceList.structureType, 'branched');
  assert.deepEqual(completed.data.movieResourceList.nodes.map(({ nodeId }) => nodeId), [
    'root',
    'root.1',
    'root.2',
  ]);
  assert.deepEqual(completed.data.branchingMeta.leafNodeIds, ['root.1', 'root.2']);
  assert.equal(completed.data.billing.pricing_multiplier, 1.5);
  assert.equal(completed.data.billing.underlying_credits, 4);
  assert.equal(completed.data.billing.credits_charged, 6);
  assert.equal(completed.creditsCharged, 6);
  assert.equal(calls.length, 3);
});

test('terminal failures throw SamsarRequestError with body and credit settlement', async () => {
  const failed = narrativeBase('FAILED', {
    error: {
      message: 'Narrative validation failed',
      code: 'NARRATIVE_VALIDATION_FAILED',
      status: 502,
    },
    billing: {
      pricing_multiplier: 1.5,
      underlying_cost_usd: 0.01,
      underlying_credits: 1,
      credits_charged: 1.5,
      remaining_credits: 8.5,
      usage: {
        inputTokens: 50,
        outputTokens: 10,
        cachedInputTokens: 0,
        reasoningTokens: 2,
      },
    },
    creditsCharged: 1.5,
    remainingCredits: 8.5,
    failed_at: UPDATED_AT,
  });
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async () => jsonResponse(failed, 200, {
      'x-credits-charged': '1.5',
      'x-credits-remaining': '8.5',
    }),
  });

  await assert.rejects(
    () => client.pollExternalNarrative(REQUEST_ID),
    (error) => {
      assert.ok(error instanceof SamsarRequestError);
      assert.equal(error.status, 502);
      assert.equal(error.body.status, 'FAILED');
      assert.equal(error.creditsCharged, 1.5);
      assert.equal(error.creditsRemaining, 8.5);
      return true;
    },
  );
});

test('aborting between narrative status reads throws SamsarRequestError', async () => {
  const controller = new AbortController();
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    fetch: async () => jsonResponse(narrativeBase('PENDING')),
  });

  setTimeout(() => controller.abort(), 10);
  await assert.rejects(
    () => client.pollV2ExternalNarrative(REQUEST_ID, {
      pollIntervalMs: 250,
      pollTimeoutMs: 5_000,
      signal: controller.signal,
    }),
    (error) => {
      assert.ok(error instanceof SamsarRequestError);
      assert.match(error.message, /polling was aborted/i);
      return true;
    },
  );
});

test('create_single validates prompt, duration, model, and conflicting aliases before fetch', async () => {
  let fetchCalls = 0;
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    fetch: async () => {
      fetchCalls += 1;
      return jsonResponse({});
    },
  });

  await assert.rejects(
    () => client.createExternalSingleNarrative({ prompt: ' ', duration: 30 }),
    /prompt is required/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({ prompt: 'Story', duration: 241 }),
    /between 10 and 240/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({ prompt: 'x'.repeat(4001), duration: 30 }),
    /must not exceed 4000/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({
      prompt: 'Story',
      duration: 30,
      inference_model: 'GPT5.6',
      inferenceModel: 'GEMINI3.1',
    }),
    /conflicting alias values/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({
      prompt: 'Story',
      duration: 30,
      inference_model: 'unsupported-model',
    }),
    /must be one of/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({
      prompt: 'Story',
      duration: 30,
      video_model: 'RUNWAYML',
      videoModel: 'COSMOS3SUPERI2V',
    }),
    /video_model was provided with conflicting alias values/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({
      prompt: 'Story',
      duration: 30,
      video_model: 'not-a-video-model',
    }),
    /video_model must be one of/,
  );
  await assert.rejects(
    () => client.createExternalSingleNarrative({
      prompt: 'Story',
      duration: 30,
      videoModel: '   ',
    }),
    /video_model must be a non-empty string/,
  );
  assert.equal(fetchCalls, 0);
});

test('create_branching validates source id, levels, and conflicting aliases before fetch', async () => {
  let fetchCalls = 0;
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    fetch: async () => {
      fetchCalls += 1;
      return jsonResponse({});
    },
  });

  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: 'not-an-object-id',
      num_levels: 1,
    }),
    /valid 24-character narrative_request_id/,
  );
  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: REQUEST_ID,
      num_levels: 0,
    }),
    /integer between 1 and 6/,
  );
  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: REQUEST_ID,
      num_levels: 1.5,
    }),
    /integer between 1 and 6/,
  );
  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: REQUEST_ID,
      narrativeRequestId: '507f1f77bcf86cd799439099',
      num_levels: 1,
    }),
    /conflicting alias values/,
  );
  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: REQUEST_ID,
      num_levels: 1,
      numLevels: 2,
    }),
    /conflicting alias values/,
  );
  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: REQUEST_ID,
      num_levels: 1,
      video_model: 'RUNWAYML',
      videoModel: 'VEO3.1I2V',
    }),
    /video_model was provided with conflicting alias values/,
  );
  await assert.rejects(
    () => client.createExternalBranchingNarrative({
      narrative_request_id: REQUEST_ID,
      num_levels: 1,
      video_model: 'unsupported',
    }),
    /video_model must be one of/,
  );
  assert.equal(fetchCalls, 0);
});
