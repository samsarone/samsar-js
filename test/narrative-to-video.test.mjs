import assert from 'node:assert/strict';
import test from 'node:test';

import SamsarClient from '../dist/index.js';

const NARRATIVE_REQUEST_ID = '507f1f77bcf86cd799439011';
const VIDEO_SESSION_ID = '507f1f77bcf86cd799439012';

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function completedBranchingManifest() {
  return {
    schema: 'branched_video_status.v1',
    status: 'COMPLETED',
    completed_at: '2026-07-19T10:00:00.000Z',
    default_path_id: 'root.1',
    timing: { origin: 'media', unit: 'seconds' },
    tree: {
      root_node_id: 'root',
      choice_points: [{
        branch_point_id: 'branch-point:root',
        parent_node_id: 'root',
        switch_at_seconds: 12,
        options: [
          {
            child_node_id: 'root.1',
            path_name: 'Follow the river',
            leaf_path_ids: ['root.1'],
          },
          {
            child_node_id: 'root.2',
            path_name: 'Stay in the city',
            leaf_path_ids: ['root.2'],
          },
        ],
      }],
    },
    outputs: {
      ready: true,
      default_path_id: 'root.1',
      default_url: 'https://cdn.example/root.1.mp4',
      paths: [
        {
          path_id: 'root.1',
          url: 'https://cdn.example/root.1.mp4',
          duration: 24,
          is_default: true,
        },
        {
          path_id: 'root.2',
          url: 'https://cdn.example/root.2.mp4',
          duration: 26,
          is_default: false,
        },
      ],
    },
  };
}

test('narrative-to-video sends only the source id and optional media model overrides', async () => {
  const calls = [];
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return jsonResponse({
        request_id: VIDEO_SESSION_ID,
        session_id: VIDEO_SESSION_ID,
        source_narrative_request_id: NARRATIVE_REQUEST_ID,
        status: 'PENDING',
      }, 202);
    },
  });

  const response = await client.createExternalVideoFromNarrative({
    narrativeRequestId: ` ${NARRATIVE_REQUEST_ID} `,
    imageModel: 'GPTIMAGE2',
    video_model: 'VEO3.1I2VFAST',
  }, { webhookUrl: 'https://example.com/webhooks/video' });

  assert.equal(response.status, 202);
  assert.equal(calls[0].input, 'https://processor.example/v2/external/video/narrative_to_video');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    input: {
      narrative_request_id: NARRATIVE_REQUEST_ID,
      image_model: 'GPTIMAGE2',
      video_model: 'VEO3.1I2VFAST',
    },
    webhookUrl: 'https://example.com/webhooks/video',
  });
});

test('narrative-to-video rejects source narrative overrides and conflicting ids locally', async () => {
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    fetch: async () => {
      throw new Error('fetch must not be called');
    },
  });

  await assert.rejects(
    () => client.createExternalVideoFromNarrative({
      narrative_request_id: NARRATIVE_REQUEST_ID,
      prompt: 'not allowed',
    }),
    /prompt and duration cannot be provided/,
  );
  await assert.rejects(
    () => client.createV2ExternalVideoFromNarrative({
      narrative_request_id: NARRATIVE_REQUEST_ID,
      requestId: '507f1f77bcf86cd799439099',
    }),
    /conflicting values/,
  );
  await assert.rejects(
    () => client.createV2ExternalVideoFromNarrative({
      narrative_request_id: NARRATIVE_REQUEST_ID,
      requestId: '   ',
    }),
    /must be non-empty strings/,
  );
});

test('completed status accepts the compact interactive manifest and header usage', async () => {
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async () => jsonResponse({
      request_id: VIDEO_SESSION_ID,
      session_id: VIDEO_SESSION_ID,
      status: 'COMPLETED',
      type: 'video',
      narrative_type: 'branched',
      default_path_id: 'root.1',
      result_url: 'https://cdn.example/root.1.mp4',
      branching: completedBranchingManifest(),
    }, 200, {
      'x-credits-charged': '42',
      'x-credits-remaining': '158.5',
    }),
  });

  const status = await client.getV2ExternalVideoStatus(VIDEO_SESSION_ID);

  assert.equal(status.creditsCharged, 42);
  assert.equal(status.creditsRemaining, 158.5);
  assert.equal(Object.hasOwn(status.data, 'creditsCharged'), false);
  assert.equal(Object.hasOwn(status.data, 'billing'), false);
  assert.equal(Object.hasOwn(status.data, 'branch_results'), false);
  assert.equal(Object.hasOwn(status.data, 'result_urls'), false);
  assert.equal(status.data.branching?.schema, 'branched_video_status.v1');
  assert.equal(status.data.branching?.summary, undefined);
  assert.equal(status.data.branching?.paths, undefined);
  assert.deepEqual(status.data.branching?.timing, { origin: 'media', unit: 'seconds' });
  assert.equal(status.data.branching?.outputs.ready, true);
  assert.deepEqual(
    status.data.branching?.outputs.ready
      ? status.data.branching.outputs.paths.map((output) => [output.path_id, output.url, output.duration])
      : [],
    [
      ['root.1', 'https://cdn.example/root.1.mp4', 24],
      ['root.2', 'https://cdn.example/root.2.mp4', 26],
    ],
  );
});

test('completed detailed status keeps branching top-level and the session envelope compact', async () => {
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async () => jsonResponse({
      request_id: VIDEO_SESSION_ID,
      session_id: VIDEO_SESSION_ID,
      status: 'COMPLETED',
      type: 'video',
      narrative_type: 'branched',
      default_path_id: 'root.1',
      result_url: 'https://cdn.example/root.1.mp4',
      status_detail_schema: 'interactive_video_manifest.v1',
      branching: completedBranchingManifest(),
      session: {
        id: VIDEO_SESSION_ID,
        requestId: VIDEO_SESSION_ID,
        type: 'video',
        routeType: 'express',
        aspectRatio: '16:9',
        framesPerSecond: 24,
        duration: 26,
        narrativeType: 'branched',
        defaultBranchPathId: 'root.1',
        result: {
          url: 'https://cdn.example/root.1.mp4',
          hasSubtitles: true,
          language: 'en',
        },
      },
    }, 200, { 'x-credits-charged': '42' }),
  });

  const detailed = await client.getV2ExternalVideoStatusDetailed(VIDEO_SESSION_ID);

  assert.equal(detailed.status, 200);
  assert.equal(detailed.creditsCharged, 42);
  assert.equal(detailed.data.status_detail_schema, 'interactive_video_manifest.v1');
  assert.equal(detailed.data.branching?.outputs.ready, true);
  assert.equal(detailed.data.session?.result?.url, 'https://cdn.example/root.1.mp4');
  assert.equal(Object.hasOwn(detailed.data, 'result_urls'), false);
  assert.equal(Object.hasOwn(detailed.data, 'branch_results'), false);
  assert.equal(Object.hasOwn(detailed.data.session ?? {}, 'branching'), false);
  assert.equal(Object.hasOwn(detailed.data.session ?? {}, 'layers'), false);
  assert.equal(Object.hasOwn(detailed.data.session ?? {}, 'audioLayers'), false);
});

test('linear completed status keeps its existing result list and body fields', async () => {
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    fetch: async () => jsonResponse({
      request_id: VIDEO_SESSION_ID,
      session_id: VIDEO_SESSION_ID,
      status: 'COMPLETED',
      type: 'video',
      narrative_type: 'singular',
      result_url: 'https://cdn.example/linear.mp4',
      result_urls: ['https://cdn.example/linear.mp4'],
      creditsCharged: 9,
      session: { layers: [{ id: 'linear-layer' }] },
    }),
  });

  const status = await client.getV2ExternalVideoStatus(VIDEO_SESSION_ID);

  assert.deepEqual(status.data.result_urls, ['https://cdn.example/linear.mp4']);
  assert.equal(status.data.creditsCharged, 9);
  assert.deepEqual(status.data.session.layers, [{ id: 'linear-layer' }]);
});

test('pending detailed status still exposes path diagnostics and preview timing', async () => {
  const calls = [];
  const pendingBranching = {
    schema: 'branched_video_status.v1',
    status: 'PENDING',
    is_complete: false,
    finalized: false,
    render_plan_version: 1,
    default_path_id: 'root.1',
    summary: {
      total_paths: 2,
      completed_paths: 0,
      pending_paths: 2,
      failed_paths: 0,
      cancelled_paths: 0,
      frame_paths_completed: 1,
      video_paths_completed: 0,
      progress_percent: 25,
    },
    tree: {
      root_node_id: 'root',
      num_levels: 1,
      branching_factor: 2,
      node_count: 3,
      leaf_node_ids: ['root.1', 'root.2'],
      branch_scene_indices: [1],
      choice_points: [],
    },
    paths: [{
      path_id: 'root.1',
      leaf_node_id: 'root.1',
      ordinal: 0,
      is_default: true,
      node_ids: ['root', 'root.1'],
      duration: 12,
      status: 'PENDING',
      current_stage: 'video_generation',
      stages: { frame_generation: 'COMPLETED', video_generation: 'PENDING' },
      stage_details: {
        frame_generation: {
          status: 'COMPLETED',
          pending: false,
          completed_items: 2,
          total_items: 2,
        },
        video_generation: { status: 'PENDING', pending: true },
      },
      selection_trail: [{
        branch_point_id: 'branch-point:root',
        node_id: 'root.1',
        parent_node_id: 'root',
        level: 1,
        branch_ordinal: 1,
        divergence_scene_index: 1,
        switch_at_seconds: 6,
        path_name: 'Follow the river',
      }],
      timeline: [
        {
          sequence_index: 0,
          scene_index: 0,
          layer_id: 'layer-shared',
          start_time: 0,
          end_time: 6,
          duration: 6,
          frame_generation: { status: 'COMPLETED', pending: false },
        },
        {
          sequence_index: 1,
          scene_index: 1,
          layer_id: 'layer-root-1',
          start_time: 6,
          end_time: 12,
          duration: 6,
          frame_generation: { status: 'COMPLETED', pending: false },
        },
      ],
      audio_timeline: [{
        sequence_index: 0,
        scene_index: 0,
        audio_layer_id: 'audio-shared',
        connected_layer_id: 'layer-shared',
        start_time: 0,
        end_time: 6,
        duration: 6,
      }],
    }],
    outputs: { ready: false, default_path_id: 'root.1' },
  };
  const client = new SamsarClient({
    apiKey: 'sdk-test-key',
    baseUrl: 'https://processor.example/v1',
    fetch: async (input) => {
      calls.push(String(input));
      return jsonResponse({
        request_id: VIDEO_SESSION_ID,
        session_id: VIDEO_SESSION_ID,
        status: 'PENDING',
        type: 'video',
        narrative_type: 'branched',
        branching: pendingBranching,
        status_detail_schema: 'video_session_preview.v1',
        session: {
          id: VIDEO_SESSION_ID,
          narrativeType: 'branched',
          layers: [
            { id: 'layer-shared', index: 0, startTime: 0, duration: 6 },
            { id: 'layer-root-1', index: 1, startTime: 6, duration: 6 },
          ],
          audioLayers: [
            { id: 'audio-shared', index: 0, type: 'speech', startTime: 0, duration: 6 },
          ],
          branching: pendingBranching,
        },
      });
    },
  });

  const detailed = await client.getV2ExternalVideoStatusDetailed(VIDEO_SESSION_ID);

  assert.match(calls[0], /\/v2\/external\/video\/status_detailed\?/);
  assert.equal(detailed.data.status_detail_schema, 'video_session_preview.v1');
  assert.equal(detailed.data.branching?.outputs.ready, false);
  assert.equal(detailed.data.branching?.outputs.default_url, undefined);
  assert.equal(detailed.data.session?.branching?.paths[0].timeline?.[0].layer_id, 'layer-shared');
  assert.equal(detailed.data.session?.branching?.paths[0].audio_timeline?.[0].audio_layer_id, 'audio-shared');
  assert.equal(detailed.data.session?.branching?.paths[0].selection_trail[0].switch_at_seconds, 6);
});
