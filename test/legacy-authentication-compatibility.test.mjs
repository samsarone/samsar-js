import assert from 'node:assert/strict';
import test from 'node:test';

import SamsarClient from '../dist/index.js';

const SESSION_ID = '507f1f77bcf86cd799439011';

function jsonResponse(body = { status: 'PROCESSING' }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function recordingClient(options) {
  const calls = [];
  const client = new SamsarClient({
    baseUrl: 'https://processor.example/v1',
    ...options,
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse();
    },
  });
  return { calls, client };
}

test('legacy apiKey authentication remains a Bearer credential', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-api-key-or-user-token',
  });

  await client.getV2StatusDetailed(SESSION_ID);

  assert.equal(calls[0].init.headers.Authorization, 'Bearer legacy-api-key-or-user-token');
  assert.equal(calls[0].init.headers['x-app-secret'], undefined);
});

test('legacy user tokens supplied through apiKey support header-only session verification', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-user-auth-token',
  });

  await client.verifyClientSession();

  const url = new URL(calls[0].input);
  assert.equal(`${url.origin}${url.pathname}`, 'https://processor.example/users/verify_token');
  assert.equal(url.searchParams.has('loginToken'), false);
  assert.equal(url.searchParams.has('authToken'), false);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer legacy-user-auth-token');
});

test('constructor AppKey authentication and app secret remain intact', async () => {
  const { calls, client } = recordingClient({
    appKey: 'legacy-app-key',
    appSecret: 'legacy-app-secret',
  });

  await client.getV2StatusDetailed(SESSION_ID);

  assert.equal(calls[0].init.headers.Authorization, 'AppKey legacy-app-key');
  assert.equal(calls[0].init.headers['x-app-secret'], 'legacy-app-secret');
});

test('legacy apiKey still takes precedence over constructor AppKey credentials', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-bearer-key',
    appKey: 'constructor-app-key',
    appSecret: 'constructor-app-secret',
  });

  await client.getV2StatusDetailed(SESSION_ID);

  assert.equal(calls[0].init.headers.Authorization, 'Bearer legacy-bearer-key');
  assert.equal(calls[0].init.headers['x-app-secret'], undefined);
});

test('per-request AppKey credentials still override configured Bearer credentials', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-bearer-key',
    authToken: 'new-user-auth-token',
    appSecret: 'constructor-app-secret',
  });

  await client.getV2StatusDetailed(SESSION_ID, {
    appKey: 'request-app-key',
    appSecret: 'request-app-secret',
  });

  assert.equal(calls[0].init.headers.Authorization, 'AppKey request-app-key');
  assert.equal(calls[0].init.headers['x-app-secret'], 'request-app-secret');
});

test('explicit request Authorization headers retain final precedence', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-bearer-key',
    authToken: 'new-user-auth-token',
  });

  await client.getV2StatusDetailed(SESSION_ID, {
    headers: { Authorization: 'Bearer explicit-request-token' },
  });

  assert.equal(calls[0].init.headers.Authorization, 'Bearer explicit-request-token');
});

test('default Authorization headers retain precedence over generated credentials', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-bearer-key',
    authToken: 'new-user-auth-token',
    defaultHeaders: { Authorization: 'Bearer default-header-token' },
  });

  await client.getV2StatusDetailed(SESSION_ID);

  assert.equal(calls[0].init.headers.Authorization, 'Bearer default-header-token');
});

test('legacy loginToken and authToken payload query behavior is preserved', async () => {
  const loginCalls = [];
  const loginClient = new SamsarClient({
    apiKey: 'legacy-bearer-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      loginCalls.push({ input: String(input), init });
      return jsonResponse();
    },
  });
  await loginClient.verifyClientSession({ loginToken: 'one-time-login-token' });
  const loginUrl = new URL(loginCalls[0].input);
  assert.equal(loginUrl.searchParams.get('loginToken'), 'one-time-login-token');
  assert.equal(loginCalls[0].init.headers.Authorization, 'Bearer legacy-bearer-key');

  const authCalls = [];
  const authClient = new SamsarClient({
    apiKey: 'legacy-bearer-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      authCalls.push({ input: String(input), init });
      return jsonResponse();
    },
  });
  await authClient.verifyClientSession({ authToken: 'payload-user-token' });
  const authUrl = new URL(authCalls[0].input);
  assert.equal(authUrl.searchParams.get('authToken'), 'payload-user-token');
  assert.equal(authCalls[0].init.headers.Authorization, 'Bearer legacy-bearer-key');
});

test('explicit API-key validation and external-user headers are unchanged', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'configured-bearer-key',
    externalUserApiKey: 'external-user-key',
  });

  await client.validateSamsarApiKey('explicit-validation-key');

  assert.equal(calls[0].init.headers.Authorization, 'Bearer explicit-validation-key');
  assert.equal(calls[0].init.headers['x-external-user-api-key'], 'external-user-key');
});

test('blank authToken falls back to the existing apiKey path', async () => {
  const { calls, client } = recordingClient({
    apiKey: 'legacy-bearer-key',
    authToken: '   ',
  });

  await client.getV2StatusDetailed(SESSION_ID);

  assert.equal(calls[0].init.headers.Authorization, 'Bearer legacy-bearer-key');
});
