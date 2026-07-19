import assert from 'node:assert/strict';
import test from 'node:test';

import SamsarClient from '../dist/index.js';

const PUBLICATION_ID = '507f1f77bcf86cd799439012';
const SESSION_ID = '507f1f77bcf86cd799439011';

const interactivePublication = {
  id: PUBLICATION_ID,
  type: 'InteractiveVideo',
  schema: 'interactive_publication.v1',
  title: 'Fork in the road',
  description: 'Pick a direction.',
  tags: ['interactive'],
  creatorHandle: 'samsar',
  datePublished: '2026-07-19T08:00:00.000Z',
  mainVideoUrl: 'https://static.samsar.one/root-1.mp4',
  mainThumbnailUrl: 'https://static.samsar.one/main.png',
  duration: 12,
  thumbnailUrl: 'https://static.samsar.one/main.png',
  aspectRatio: '16:9',
  inLanguage: 'en',
  hasSubtitles: true,
  manifest: {
    schema: 'interactive_video_manifest.v1',
    default_path_id: 'root.1',
    timing: { origin: 'media', unit: 'seconds' },
    tree: {
      root_node_id: 'root',
      choice_points: [{
        branch_point_id: 'choice-root',
        parent_node_id: 'root',
        level: 1,
        divergence_scene_index: 2,
        switch_at_seconds: 6,
        options: [
          {
            child_node_id: 'root.1',
            branch_ordinal: 1,
            branching_hint: 'Enter the forest',
            description: 'Follow the lanterns beneath the trees.',
            leaf_path_ids: ['root.1'],
          },
          {
            child_node_id: 'root.2',
            branch_ordinal: 2,
            branching_hint: 'Stay on the road',
            description: 'Continue toward the distant town.',
            leaf_path_ids: ['root.2'],
          },
        ],
      }],
    },
    outputs: {
      paths: [{
        path_id: 'root.1',
        leaf_node_id: 'root.1',
        ordinal: 0,
        branch_point_id: 'choice-root',
        divergence_scene_index: 2,
        switch_at_seconds: 6,
        branching_hint: 'Enter the forest',
        description: 'Follow the lanterns beneath the trees.',
        contentUrl: 'https://static.samsar.one/root-1.mp4',
        thumbnailUrl: 'https://static.samsar.one/root-1.png',
        encodingFormat: 'video/mp4',
        duration: 12,
        is_default: true,
      }, {
        path_id: 'root.2',
        contentUrl: 'https://static.samsar.one/root-2.mp4',
        thumbnailUrl: 'https://static.samsar.one/root-2.png',
        encodingFormat: 'video/mp4',
        duration: 13,
        is_default: false,
      }],
    },
  },
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

test('listInteractivePublications reads the unauthenticated cursor-paginated public route', async () => {
  const calls = [];
  const client = new SamsarClient({
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({
        items: [interactivePublication],
        nextCursor: PUBLICATION_ID,
        hasMore: true,
        totalCount: 2,
      });
    },
  });

  const response = await client.listInteractivePublications({
    limit: 1,
    cursor: '507f1f77bcf86cd799439013',
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.items[0].manifest.outputs.paths[1].contentUrl,
    'https://static.samsar.one/root-2.mp4');
  assert.equal(response.data.items[0].mainThumbnailUrl,
    'https://static.samsar.one/main.png');
  assert.equal(response.data.nextCursor, PUBLICATION_ID);
  assert.equal(
    calls[0].input,
    'https://processor.example/v1/interactive_publications?limit=1&cursor=507f1f77bcf86cd799439013',
  );
  assert.equal(calls[0].init.method, 'GET');
  assert.equal(calls[0].init.headers.Authorization, undefined);
});

test('getInteractivePublication returns the optimized public render manifest', async () => {
  const calls = [];
  const client = new SamsarClient({
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({ publication: interactivePublication });
    },
  });

  const response = await client.getInteractivePublication(`  ${PUBLICATION_ID}  `);

  assert.deepEqual(response.data.publication, interactivePublication);
  assert.equal(
    calls[0].input,
    `https://processor.example/v1/interactive_publications/${PUBLICATION_ID}`,
  );
  assert.equal(calls[0].init.headers.Authorization, undefined);
});

test('branched publish response retains the InteractivePublication discriminant and manifest', async () => {
  const calls = [];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({
        created: true,
        publication: interactivePublication,
        session: {
          id: SESSION_ID,
          session_id: SESSION_ID,
          is_published: true,
          published_publication_id: PUBLICATION_ID,
          published_video_url: interactivePublication.manifest.outputs.paths[0].contentUrl,
          published_at: '2026-07-19T08:00:00.000Z',
        },
      }, 201);
    },
  });

  const response = await client.publishPublication({
    sessionId: SESSION_ID,
    title: 'Fork in the road',
  });

  assert.equal(response.status, 201);
  assert.equal(response.data.publication.type, 'InteractiveVideo');
  assert.equal(response.data.publication.manifest.schema, 'interactive_video_manifest.v1');
  assert.equal(response.data.publication.mainVideoUrl,
    response.data.publication.manifest.outputs.paths[0].contentUrl);
  assert.equal(calls[0].input, 'https://processor.example/v1/publications/publish');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    sessionId: SESSION_ID,
    title: 'Fork in the road',
    session_id: SESSION_ID,
  });
});

test('getInteractivePublication rejects an empty ID before making a request', async () => {
  let calls = 0;
  const client = new SamsarClient({
    fetch: async () => {
      calls += 1;
      return jsonResponse({});
    },
  });

  await assert.rejects(
    () => client.getInteractivePublication('   '),
    /publicationId is required/,
  );
  assert.equal(calls, 0);
});
