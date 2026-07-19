import assert from 'node:assert/strict';
import test from 'node:test';

import SamsarClient from '../dist/index.js';

const SESSION_ID = '507f1f77bcf86cd799439011';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

test('authToken is trimmed, takes precedence over apiKey, and authenticates interactive-video creation', async () => {
  const calls = [];
  const client = new SamsarClient({
    authToken: '  logged-in-user-token  ',
    apiKey: 'account-api-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({ request_id: SESSION_ID, status: 'PENDING' }, 202);
    },
  });

  await client.createV2TextToInteractiveVideo({
    prompt: 'A branching journey',
    duration: 30,
    image_model: 'SEEDREAM',
    video_model: 'RUNWAYML',
    num_levels: 1,
  });

  assert.equal(calls[0].input, 'https://processor.example/v2/text_to_interactive_video');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer logged-in-user-token');
});

test('authToken authenticates detailed status polling without an apiKey', async () => {
  const calls = [];
  const client = new SamsarClient({
    authToken: 'logged-in-user-token',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({ request_id: SESSION_ID, session_id: SESSION_ID, status: 'PROCESSING' });
    },
  });

  await client.getV2StatusDetailed(SESSION_ID);

  const url = new URL(calls[0].input);
  assert.equal(`${url.origin}${url.pathname}`, 'https://processor.example/v2/status_detailed');
  assert.equal(url.searchParams.get('request_id'), SESSION_ID);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer logged-in-user-token');
});

test('authToken authenticates token verification without an apiKey', async () => {
  const calls = [];
  const client = new SamsarClient({
    authToken: 'logged-in-user-token',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({ valid: true, authToken: 'logged-in-user-token' });
    },
  });

  await client.verifyClientSession({ authToken: 'logged-in-user-token' });

  const url = new URL(calls[0].input);
  assert.equal(`${url.origin}${url.pathname}`, 'https://processor.example/users/verify_token');
  assert.equal(url.searchParams.get('authToken'), 'logged-in-user-token');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer logged-in-user-token');
});

test('verifyClientSession uses the configured authToken without duplicating it in the query string', async () => {
  const calls = [];
  const client = new SamsarClient({
    authToken: 'logged-in-user-token',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({ valid: true, authToken: 'logged-in-user-token' });
    },
  });

  await client.verifyClientSession();

  const url = new URL(calls[0].input);
  assert.equal(`${url.origin}${url.pathname}`, 'https://processor.example/users/verify_token');
  assert.equal(url.searchParams.has('authToken'), false);
  assert.equal(url.searchParams.has('loginToken'), false);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer logged-in-user-token');
});

test('authToken authenticates publication without an apiKey', async () => {
  const calls = [];
  const client = new SamsarClient({
    authToken: 'logged-in-user-token',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({ created: true, session: { session_id: SESSION_ID } }, 201);
    },
  });

  await client.publishPublication({
    sessionId: SESSION_ID,
    title: 'A branching journey',
    description: 'Choose a path.',
  });

  assert.equal(calls[0].input, 'https://processor.example/v1/publications/publish');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer logged-in-user-token');
});
