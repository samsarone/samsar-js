# samsar-js

TypeScript/ESM client for the Samsar Processor public API (`https://api.samsar.one/v1`). It mirrors OpenAI-style ergonomics for creating videos, enhancing copy, running assistant completions, and managing image operations.

## Installation

Requires Node.js `>=18`.

```bash
npm install samsar-js
```

```bash
yarn add samsar-js
```

```bash
pnpm add samsar-js
```

```bash
# optional: install from a private registry mirror
npm install samsar-js --registry <your-registry-url>
```

## Usage

```ts
import SamsarClient from 'samsar-js';

const samsar = new SamsarClient({ apiKey: process.env.SAMSAR_API_KEY! });

// Create a video from text prompt
const video = await samsar.createVideoFromText(
  {
    prompt: 'A drone shot of a beach at sunrise',
    image_model: 'GPTIMAGE2',
    video_model: 'RUNWAYML',
    duration: 30,
    backingtrack_model: 'LYRIA3',
    tts_model: 'OPENAI',
    speakerOptions: { openAISpeakers: ['nova'] },
    inference_model: 'gpt-5.5',
    font_key: 'Poppins',
    enable_subtitles: true,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Create a text video with a generated QR outro and bottom CTA footer
await samsar.createVideoFromText({
  prompt: 'A boutique hotel launch reel with cinematic room details',
  image_model: 'GPTIMAGE2',
  video_model: 'RUNWAYML',
  duration: 20,
  aspect_ratio: '9:16',
  generate_outro_image: true,
  cta_url: 'https://example.com/book',
  cta_text_top: 'Scan to book',
  cta_text_bottom: 'Opening offers',
  add_footer_animation: true,
  footer_metadata: [{ url: 'https://example.com/book', title: 'Book your stay' }],
});

// Create a video from an image list
const videoFromImages = await samsar.createVideoFromImageList(
  {
    image_urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
    prompt: 'Cinematic sequence with smooth transitions',
    metadata: { project: 'demo' },
    video_model: 'RUNWAYML',
    aspect_ratio: '16:9',
    language: 'en',
    backingtrack_model: 'ELEVENLABS_MUSIC',
    tts_model: 'ELEVENLABS',
    speakerOptions: { elevenLabsSpeakers: ['EXAVITQu4vr4xnSDxMaL'] },
    inference_model: 'gemini-3.1-pro',
    font_key: 'Poppins',
    enable_subtitles: true,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Create a video with a provided outro image
await samsar.createVideoFromImageList({
  image_urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
  prompt: 'Product launch teaser with a clean final CTA',
  video_model: 'KLINGIMGTOVID3PRO',
  aspect_ratio: '16:9',
  outro_image_url: 'https://cdn.example.com/outro.png',
  add_outro_animation: true,
  add_outro_focus_area: true,
  outro_focust_area: { x: 680, y: 296, width: 432, height: 432 },
});

// Create a video and generate the QR outro server-side from the input images
await samsar.createVideoFromImageList({
  image_urls: [
    { image_url: 'https://example.com/a.jpg', title: 'Blue Lagoon Tour' },
    { image_url: 'https://example.com/b.jpg', title: 'Sunset Dinner' },
  ],
  prompt: 'Travel offer reel with a scannable booking outro',
  video_model: 'RUNWAYML',
  aspect_ratio: '9:16',
  add_narrator_avatar: true,
  generate_outro_image: true,
  cta_url: 'https://example.com/book',
  cta_text_top: 'Scan to book',
  cta_text_bottom: 'Limited availability',
  cta_logo: 'https://cdn.example.com/logo-white.png',
  add_footer_animation: true,
  footer_metadata: [
    { url: 'https://example.com/blue-lagoon', title: 'Blue Lagoon Tour' },
    { url: 'https://example.com/sunset-dinner', title: 'Sunset Dinner' },
  ],
});

// Create a video and generate the outro with a center logo/CTA image instead of a QR code
await samsar.createVideoFromImageList({
  image_urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
  prompt: 'Product launch teaser with a branded CTA outro',
  video_model: 'RUNWAYML',
  aspect_ratio: '9:16',
  generate_outro_image: true,
  outro_cta_image: {
    top_text: 'Shop the drop',
    middle_image: { url: 'https://cdn.example.com/drop-logo.png' },
    bottom_text: 'Limited availability',
  },
});

// Create the same generated QR outro and per-scene footer CTAs from one CTA link
await samsar.createVideoFromImageList({
  image_urls: [
    { image_url: 'https://example.com/a.jpg', title: 'Blue Lagoon Tour' },
    { image_url: 'https://example.com/b.jpg', title: 'Sunset Dinner' },
  ],
  prompt: 'Travel offer reel with concise scene CTAs',
  metadata: { brand: 'Guidestination', offer: 'Bookable Bangkok experiences' },
  video_model: 'RUNWAYML',
  aspect_ratio: '9:16',
  express_cta_generation: true,
  cta_url: 'https://example.com/book',
});

// Update an existing outro with a new provided outro image URL
await samsar.updateVideoOutroImage(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
    outro_image_url: 'https://cdn.example.com/outro-v2.png',
    add_outro_animation: true,
    add_outro_focus_area: true,
    outro_focust_area: { x: 680, y: 296, width: 432, height: 432 },
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Update an existing outro by generating a new QR CTA outro server-side
await samsar.updateVideoOutroImage(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
    generate_outro_image: true,
    cta_url: 'https://example.com/book',
    cta_text_top: 'Scan to book',
    cta_text_bottom: 'Limited availability',
    add_outro_animation: true,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Update an existing outro by generating a new CTA outro with a center logo/CTA image
await samsar.updateVideoOutroImage(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
    generate_outro_image: true,
    outro_cta_image: {
      top_text: 'Shop the drop',
      middle_image: { url: 'https://cdn.example.com/drop-logo.png' },
      bottom_text: 'Limited availability',
    },
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Update the footer CTA on an existing video session
await samsar.updateVideoFooterImage(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
    cta_text: 'Scan to book',
    cta_logo: 'https://cdn.example.com/logo-white.png',
    cta_url: 'https://example.com/book',
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Remove the footer from a cloned rerender
await samsar.updateVideoFooterImage({
  videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
  remove_footer: true,
});

// Translate an existing video session into another language
const translated = await samsar.translateVideo(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
    language: 'es',
    enable_subtitles: false,
    translate_outro: true,
    translate_footer: true,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Deep-clone an existing completed session and render a new final video URL
const cloned = await samsar.cloneVideo(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Join multiple completed sessions into a single appended video
const joined = await samsar.joinVideos(
  {
    session_ids: [
      videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
      translated.data.session_id ?? translated.data.request_id!,
    ],
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Clone a session and remove subtitle/transcript text overlays
const noSubtitles = await samsar.removeSubtitles(
  {
    videoSessionId: joined.data.session_id ?? joined.data.request_id!,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Clone a session and add subtitle/transcript text overlays
const withSubtitles = await samsar.addSubtitles(
  {
    videoSessionId: noSubtitles.data.session_id ?? noSubtitles.data.request_id!,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Cancel an in-progress render
const cancelled = await samsar.cancelRender({
  videoSessionId: withSubtitles.data.session_id ?? withSubtitles.data.request_id!,
});
console.log(cancelled.data.status, cancelled.data.cancelled);

// Enhance chat message
const enhanced = await samsar.enhanceMessage({
  message: 'Please improve this caption.',
  maxwords: 450,
});

// Set an account-level assistant system prompt
await samsar.setAssistantSystemPrompt({
  system_prompt: 'You are the brand assistant for Acme. Keep answers concise and commercially practical.',
});

// Create an assistant completion for an existing session
const assistant = await samsar.createAssistantCompletion({
  session_id: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
  input: [
    {
      role: 'user',
      content: [
        { type: 'input_text', text: 'Write a launch caption for this session.' },
      ],
    },
  ],
  max_output_tokens: 300,
});
console.log(assistant.data.output_text);

// Generate an image in the assistant response using the OpenAI-compatible image_generation tool
const assistantImage = await samsar.createAssistantCompletion({
  session_id: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
  input: 'Create a clean launch poster image for this session.',
  tools: [{ type: 'image_generation', size: '1024x1024', quality: 'high' }],
  tool_choice: { type: 'image_generation' },
});
const generatedImage = assistantImage.data.output?.find(
  (item) => item.type === 'image_generation_call' && typeof item.result === 'string',
);
console.log(generatedImage?.result); // base64 image payload

// Continue the same multimodal assistant thread by reusing the same session_id.
// Samsar preserves the underlying OpenAI response chain for follow-up image edits.

// Create embeddings from a JSON array
const embedding = await samsar.createEmbedding({
  name: 'listings',
  records: [
    { id: '1', city: 'Austin', price: 1800, description: 'Modern 1BR close to downtown.' },
    { id: '2', city: 'Dallas', price: 2200, description: 'Spacious 2BR with a balcony.' },
  ],
  field_options: {
    description: { searchable: true },
    internal_notes: { searchable: false, retrievable: false },
    price: { filterable: true },
  },
});

// field_options controls which fields are embedded, used for structured filters, and returned in raw results.
// Use dot-notated paths (e.g. owner.email) or inline wrappers like { value, searchable, filterable, retrievable }.

// Create embeddings from one URL or a URL list
const websiteEmbedding = await samsar.createEmbeddingFromUrl({
  name: 'product-docs',
  levels: 2,
  urls: [
    'https://example.com/docs/getting-started',
    'https://example.com/docs/pricing',
  ],
});

// `levels` controls crawl depth for URL mode: 1 = only listed URLs, 2 = one link hop, 3 = two link hops.
// The API defaults to 2 levels and caps total crawled pages at 50 per request.

// Create embeddings from already cleaned plain text without crawling
const cleanTextEmbedding = await samsar.generateEmbeddingsFromPlainText({
  name: 'product-docs-clean',
  plain_text: [
    {
      url: 'https://example.com/docs/getting-started',
      title: 'Getting Started',
      content: 'Cleaned plain text content from the page.',
    },
  ],
});

// The generic createEmbedding wrapper also accepts `urls` plus `levels` on the same route if you prefer one entrypoint.

// Search against an embedding template
const search = await samsar.searchAgainstEmbedding({
  template_id: embedding.data.template_id,
  search_term: '2 bedroom apartment in Dallas under 2500',
  search_params: { city: 'Dallas', price: { max: 2500 } },
  rerank: true,
});

// Find similar results (natural language or JSON search)
const similar = await samsar.similarToEmbedding({
  template_id: embedding.data.template_id,
  search_json: { city: 'Austin', price: 2000, description: 'modern downtown apartment' },
  search_params: { city: 'Austin' },
});

// Optional search_params prefilters by structured fields before vector search.
// Unrecognized keys are ignored, and structured_filters can still be used to force filters.

// Delete all embeddings for a template
await samsar.deleteEmbeddings({
  template_id: embedding.data.template_id,
});

// Delete a single embedding by record id (source id)
await samsar.deleteEmbedding({
  template_id: embedding.data.template_id,
  source_id: '2',
});

// Remove visible text
const cleaned = await samsar.removeBrandingFromImage({ image_url: 'https://example.com/photo.png' });

// Extend image set
const images = await samsar.extendImageList({
  image_urls: ['https://example.com/extra.jpg'],
  prompt: 'Create a cinematic travel header banner',
  num_images: 4,
  aspect_ratio: '16:9',
});

// Assign a short SEO-friendly image title
const imageTitle = await samsar.assignImageTitle({
  image_url: 'https://example.com/product-photo.png',
  metadata: {
    product: 'linen travel shirt',
    collection: 'spring essentials',
  },
});
console.log(imageTitle.data.content); // "Linen Travel Shirt"

// Binary uploads are also supported in browser/Node 18+ runtimes
const fileTitle = await samsar.assignImageTitle({
  image: fileOrBlob,
  fileName: 'product-photo.png',
  mimeType: 'image/png',
  metadata: { product: 'linen travel shirt' },
});

// Create a reusable receipt template from one sample receipt image (free endpoint)
const receiptTemplate = await samsar.createReceiptTemplate({
  image_url: 'https://example.com/receipt-template.png',
  template_name: 'kbank-transfer-template',
});

// Fetch the structured template JSON for a saved template (free endpoint)
const receiptTemplateJson = await samsar.getReceiptTemplateJson(receiptTemplate.data.template_id);
console.log(receiptTemplateJson.data.template_json);

// Query a new receipt against the saved template (50 credits/request)
const receiptResult = await samsar.queryReceiptTemplate({
  image_url: 'https://example.com/receipt-instance.png',
  template_id: receiptTemplate.data.template_id,
});
console.log(receiptResult.data.receipt_json, receiptResult.creditsCharged);

// Enhance low-res images (if needed) and generate a roll-up banner
const rollup = await samsar.enhanceAndGenerateRollupBanner({
  images: [
    {
      image_url: 'https://example.com/tile-1.png',
      image_text: 'Rooftop Bar',
      image_category: 'Social',
      overlay: { top_left: '2 hours', top_right: 'City', footer: 'Rooftop Bar' },
    },
  ],
  header_image_url: 'https://example.com/header.png',
  footer_image_url: 'https://example.com/footer.png',
});
// rollup.data.thumbnail_url includes a downscaled banner preview when available.

// Check status by request_id (defaults to /v1/status)
const status = await samsar.getStatus(video.data.request_id);
if (status.data.status === 'COMPLETED') {
  console.log(status.data.result_url, status.data.has_subtitles, status.data.result_language);
}

// Fetch the latest render URL for a session (when available)
const latest = await samsar.fetchLatestVideoVersion(video.data.session_id ?? video.data.request_id);
console.log(latest.data.result_url ?? latest.data.status, latest.data.has_subtitles, latest.data.result_language);

// List completed video sessions for this API key
const completedSessions = await samsar.listCompletedVideoSessions();
completedSessions.data.forEach((session) => {
  console.log(session.session_id, session.result_language ?? session.langauge, session.has_subtitles, session.result_url);
});

// Publish, edit, or revoke a completed session in the public publication feed (free endpoints)
const publication = await samsar.publishPublication({
  session_id: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
  title: 'Running shoe teaser',
  description: 'Launch-day vertical cut',
  tags: ['launch', 'footwear'],
  creator_handle: 'acme',
});
console.log(publication.data.publication?.publication_id);

await samsar.editPublication({
  session_id: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
  title: 'Running shoe teaser - updated',
  tags: ['launch', 'footwear', 'campaign'],
});

await samsar.revokePublication(videoFromImages.data.session_id ?? videoFromImages.data.request_id!);

// Search and recommend from the dedicated Samsar Gallery semantic index
const gallerySearch = await samsar.searchGallery({
  query: 'cinematic science documentary',
  format: 'landscape',
  limit: 12,
});

const related = await samsar.getGalleryRecommendations({
  publication_id: gallerySearch.data.items[0]?.id,
  limit: 10,
});

// Server-side service accounts can record watch metadata and run incremental indexing
await samsar.recordGalleryView({
  publication_id: related.data.items[0]?.id,
  viewer_id: 'signed-or-hashed-viewer-id',
  event_type: 'complete',
  watch_time_ms: 42000,
  duration_ms: 42000,
});

await samsar.syncGalleryEmbeddings();

// Request-driven refresh: the processor runs an incremental diff only when the
// publication index has been stale for at least one hour.
await samsar.updateGalleryPublicationEmbeddings({ force: false });

// Image-specific status endpoint
const rollupStatus = await samsar.getImageStatus(rollup.data.session_id);

// Enable auto-recharge (returns a Stripe setup URL if no payment method is saved)
const autoRecharge = await samsar.enableAutoRecharge({
  thresholdCredits: 1000,
  amountUsd: 50,
  maxMonthlyUsd: 200,
});
if (autoRecharge.data.url) {
  console.log('Complete setup:', autoRecharge.data.url);
}

// Update auto-recharge threshold (account must already be enabled)
await samsar.updateAutoRechargeThreshold({ thresholdCredits: 1500 });

// Poll payment/setup status using the returned session or intent IDs
const topup = await samsar.createCreditsRecharge(2500);
const paymentStatus = await samsar.getPaymentStatus({
  checkoutSessionId: topup.data.checkoutSessionId,
});
console.log(paymentStatus.data.status);
```

## Unified text-to-interactive video

`createTextToInteractiveVideo` starts singular narrative generation, binary branching, and the
branched video render through one metered API request. It posts to
`/v2/text_to_interactive_video`; `createV2TextToInteractiveVideo` is the V2-explicit method name.
Browser applications can authenticate a logged-in Samsar user directly; an API key is not required:

```ts
const samsar = new SamsarClient({ authToken: user.authToken });
const session = await samsar.verifyClientSession(); // Bearer token stays out of the URL
```

Existing integrations that pass a user token through `apiKey` remain supported,
including header-only `verifyClientSession()` calls. `authToken` is the clearer
option for new logged-in-user integrations.

Creator applications can reserve a non-billable branched `VideoSession` before
the user enters generation settings, then submit into that same session:

```ts
const draft = await samsar.createTextToInteractiveVideoDraftSession();

const queued = await samsar.createTextToInteractiveVideo({
  session_id: draft.data.session_id,
  prompt: 'A signal wakes beneath a silent orbital city',
  duration: 30,
  image_model: 'NANOBANANA2',
  video_model: 'COSMOS3SUPERI2V',
  num_levels: 2,
});
```

`session_id`, `sessionId`, `sessionID`, `request_id`, `requestId`, and
`requestID` are equivalent aliases. The API verifies that the draft belongs to
the authenticated user, merges omitted render settings from its saved defaults,
validates the combined input, and promotes that same session into the workflow.

```ts
const queuedInteractiveVideo = await samsar.createTextToInteractiveVideo({
  prompt: 'A midnight train arrives and the viewer chooses which stranger to follow',
  duration: 60,
  inference_model: 'QWEN3.7',
  image_model: 'SEEDREAM',
  video_model: 'COSMOS3SUPERI2V',
  num_levels: 2,
}, {
  idempotencyKey: 'midnight-train-interactive-v1',
  webhookUrl: 'https://example.com/webhooks/video',
});

console.log(queuedInteractiveVideo.status); // 202
console.log(queuedInteractiveVideo.data.workflow_stage); // SINGULAR_NARRATIVE

// request_id is the final branched VideoSession ID, not the workflow-record ID.
const detailed = await samsar.getV2StatusDetailed(
  queuedInteractiveVideo.data.request_id,
);
console.log(
  detailed.data.status,
  detailed.data.branching ?? detailed.data.session?.branching,
);
```

The image and video models are required. Supported image keys are `GPTIMAGE2`, `NANOBANANA2`,
`NANOBANANAPRO`, `SEEDREAM`, and `WAN2.7PRO`. Supported video keys are `RUNWAYML`, `VEO3.1I2V`,
`VEO3.1I2VFAST`, `COSMOS3SUPERI2V`, `SEEDANCEI2V`, `KLINGIMGTOVID3PRO`,
`KLINGIMGTOVIDTURBO`, and `HAPPYHORSEI2V`. The selected video model is used while constructing
speech text, so each scene's speech fits that model's supported clip duration. `num_levels` must be
an integer from 1 through 6 (and cannot exceed the generated narrative's available branch points).

This unified workflow does not charge separate singular or branching narrative fees. It is billed
at the selected video model's full express-video credits-per-second rate over cumulative unique
branch duration: shared layers count once, while each distinct post-branch layer is included once.
The HTTP request returns after the workflow is accepted; use the normal v2 status or detailed-status
methods with `request_id` until every branch output is ready.

## External narrative generation

The external narrative API performs narrative inference only. It creates no video session and generates no image, audio, or video media. A completed singular response contains validated `themeJson`, raw validated `narrativeJson`, and a linear `movieResourceList` compatible with the corresponding VideoSession field. A completed branching response returns a node-based narrative tree that can later be rendered with `createExternalVideoFromNarrative`. Supply the intended render `video_model` during singular generation so the generated scene speech respects that model's duration limits.

`createExternalSingleNarrative` returns HTTP 202 with a request ID. Use the status helper directly or let the SDK poll the short-lived status requests for you:

```ts
const queuedNarrative = await samsar.createExternalSingleNarrative({
  prompt: 'A grounded documentary about Bangkok waking before sunrise',
  duration: 60,
  inference_model: 'GEMINI3.1',
  video_model: 'COSMOS3SUPERI2V',
});

console.log(queuedNarrative.status); // 202
console.log(queuedNarrative.data.request_id);

const narrative = await samsar.pollExternalNarrative(
  queuedNarrative.data.request_id,
  { pollIntervalMs: 2_000, pollTimeoutMs: 30 * 60 * 1_000 },
);

console.log(narrative.data.themeJson);
console.log(narrative.data.narrativeJson);
console.log(narrative.data.movieResourceList);
console.log(narrative.data.billing.credits_charged);
```

The combined helper queues and polls the same request:

```ts
const narrative = await samsar.createExternalSingleNarrativeAndPoll({
  prompt: 'A concise product origin story told across cinematic workshop scenes',
  duration: 30,
  inference_model: 'GPT5.6',
  video_model: 'RUNWAYML',
});
```

### Branching narratives

Create a binary, choice-driven narrative tree from a completed singular request with
`createExternalBranchingNarrative`. The source must belong to the authenticated user and must be a
successful `create_single` NarrativeRequest. The branch request clones the source narrative data;
it does not modify the source or create a VideoSession or any image, audio, or video media.

```ts
const branched = await samsar.createExternalBranchingNarrativeAndPoll({
  narrative_request_id: narrative.data.request_id,
  num_levels: 1,
  // Optional. When supplied, it must match the singular source model.
  video_model: narrative.data.video_model,
});

console.log(branched.data.source_narrative_request_id);
console.log(branched.data.movieResourceList.rootNodeId); // root
console.log(branched.data.branchingMeta.leafNodeIds); // ['root.1', 'root.2']

for (const node of branched.data.movieResourceList.nodes) {
  console.log(node.nodeId, node.scenes, node.sounds);
}
```

The non-blocking form returns HTTP 202 and uses the same status polling helpers:

```ts
const queuedBranch = await samsar.createV2ExternalBranchingNarrative({
  narrativeRequestId: narrative.data.request_id,
  numLevels: 2,
  videoModel: narrative.data.video_model,
});

const branched = await samsar.pollV2ExternalNarrative(
  queuedBranch.data.request_id,
);
```

Each node contains a complete `scenes` and `sounds` resource list. `root` is the unchanged source;
the binary children use deterministic path IDs (`root.1`, `root.2`, `root.1.1`, and so on).
`branchSceneIndices` contains zero-based divergence scene indexes, and `branchPoints` contains the
two path names and descriptions selected at each choice. Narrow a generic polling response with
`narrative_type === 'branched'` before accessing the tree-specific fields in TypeScript.

Render either a completed singular or branched request without rerunning prompt generation:

```ts
const queuedVideo = await samsar.createExternalVideoFromNarrative({
  narrative_request_id: branched.data.request_id,
  image_model: 'GPTIMAGE2',
  video_model: branched.data.video_model,
});

const videoStatus = await samsar.getV2ExternalVideoStatus(
  queuedVideo.data.request_id,
);

const branching = videoStatus.data.branching;
if (branching && !branching.outputs.ready) {
  console.log(branching.summary?.progress_percent);
  for (const path of branching.paths ?? []) {
    console.log(path.path_id, path.stages.frame_generation, path.stages.video_generation);
  }
}

// Final URLs are published atomically only after every required path succeeds.
if (branching?.outputs.ready) {
  console.log(branching.timing); // { origin: 'media', unit: 'seconds' }
  console.log(branching.outputs.default_url);
  for (const output of branching.outputs.paths) {
    console.log(output.path_id, output.url, output.duration, output.is_default);
  }
}

// Usage is carried in standard response headers, outside the JSON body.
console.log(videoStatus.creditsCharged, videoStatus.creditsRemaining);
```

For a branched source, shared media assets are generated once and every leaf gets its own frames
and final video. While generation is pending or failed, `branching.summary` and `branching.paths`
expose aggregate and per-path diagnostics. Once every required path completes, the response switches
to a compact interactive-media manifest: `result_url` is the default-path convenience URL and
`branching.outputs.paths` is the sole path-aware video list. Completed branched responses omit the
duplicate `result_urls` and `branch_results` fields. Choice-point `switch_at_seconds` values and path
durations share the media-relative seconds time base declared by `branching.timing`.

Branched `/status` and `/status_detailed` response bodies do not contain billing or credit details.
Read `creditsCharged` and `creditsRemaining` from `SamsarResult`; the SDK parses them from the
`x-credits-charged` and `x-credits-remaining` headers.

Detailed polling adds path timing without duplicating the canonical media assets:

```ts
const detailed = await samsar.getV2ExternalVideoStatusDetailed(
  queuedVideo.data.request_id,
);

const session = detailed.data.session;
const branchStatus = session?.branching;
const defaultPath = branchStatus?.paths?.find((path) => path.is_default);

if (session && defaultPath) {
  const layersById = new Map((session.layers ?? []).map((layer) => [layer.id, layer]));
  const playableLayers = (defaultPath.timeline ?? []).flatMap((item) => {
    const layer = layersById.get(item.layer_id);
    return layer ? [{ ...layer, startTime: item.start_time, endTime: item.end_time }] : [];
  });
  console.log(playableLayers);
}
```

Before completion, `session.layers` and `session.audioLayers` are deduplicated canonical asset pools
for branched sessions. Reconstruct a preview branch in `sequence_index` order using
`session.branching.paths[].timeline` and `audio_timeline`; do not play the canonical pools in array
order. After completion, `/status_detailed` uses the same top-level compact `branching` manifest as
`/status` and a small `session` envelope; it omits duplicate `session.branching`, generation layers,
and diagnostic timelines. At a choice point, `tree.choice_points[].options[].leaf_path_ids` maps an
option to compatible final output paths, while `switch_at_seconds` identifies the media seek time.
`prompt` and `duration` cannot be supplied to this route because both are inherited from the source
`NarrativeRequest`. The image model can be selected at render time. An explicitly supplied
`video_model` must match the model stored by the source narrative; omit it to inherit that model.

- `duration` must be between 10 and 240 seconds.
- Supported model aliases are `GPT5.6`, `GEMINI3.1`, and `QWEN3.7`; the SDK sends their canonical API names. Omit `inference_model` to use the authenticated user's configured default.
- Standalone singular requests accept the express video model keys listed above and default to `RUNWAYML` when omitted. A branching request inherits the singular source's model; if `video_model` or `videoModel` is present, the API rejects it unless it matches the source.
- `num_levels` must be an integer from 1 through 6. A deployment can configure a lower maximum, and it must also be less than the source scene count.
- The V2-explicit method names are `createV2ExternalSingleNarrative`, `createV2ExternalBranchingNarrative`, `getV2ExternalNarrativeStatus`, `pollV2ExternalNarrative`, `createV2ExternalSingleNarrativeAndPoll`, and `createV2ExternalBranchingNarrativeAndPoll`.
- Polling accepts both `PENDING` and `PROCESSING`. The default timeout is 30 minutes and can be raised to two hours with `pollTimeoutMs`. A terminal `FAILED` response throws `SamsarRequestError` and retains the response body and credit details.
- Only one metered narrative request runs for a user at a time. Accepted usage is settled in full, so `remainingCredits` can be negative when final inference usage exceeds the starting balance.

## External users

Use the external-user surface when many platform users share one central Samsar account and API key.

```ts
import SamsarClient from 'samsar-js';

const platform = new SamsarClient({
  apiKey: process.env.SAMSAR_PLATFORM_API_KEY!,
});

const externalUser = {
  provider: 'whop',
  unique_key: 'whop:usr_123',
  external_user_id: 'usr_123',
  external_app_id: 'app_abc',
  username: 'roy24x7',
};

// Bootstrap or refresh the external user
const externalSession = await platform.createExternalUserSession(externalUser);
console.log(externalSession.data.remainingCredits, externalSession.data.external_api_key);

// Store an external-user-specific assistant prompt
await platform.setExternalAssistantSystemPrompt(
  {
    system_prompt: 'You are the storefront assistant for this creator. Keep answers short, commercial, and visually aware.',
  },
  externalUser,
);

// Create a render attributed to that external user
const externalRender = await platform.createExternalVideoFromText(externalUser, {
  prompt: 'A sleek teaser for a futuristic running shoe',
  image_model: 'GPTIMAGE2',
  video_model: 'RUNWAYML',
  duration: 10,
  enable_subtitles: true,
});

// Update an external user's existing outro by generating a center logo/CTA image outro
const externalOutroUpdate = await platform.updateExternalVideoOutroImage(externalUser, {
  request_id: externalRender.data.request_id,
  generate_outro_image: true,
  outro_cta_image: {
    top_text: 'Shop the drop',
    middle_image: { url: 'https://cdn.example.com/drop-logo.png' },
    bottom_text: 'Limited availability',
  },
  add_outro_animation: true,
});
console.log(externalOutroUpdate.data.request_id);

// Update or remove an external user's existing footer CTA.
const externalFooterUpdate = await platform.updateExternalVideoFooterImage(externalUser, {
  request_id: externalRender.data.request_id,
  cta_text: 'Scan to shop',
  cta_logo: 'https://cdn.example.com/logo-white.png',
  cta_url: 'https://example.com/shop',
});
console.log(externalFooterUpdate.data.request_id);

// Repeated video routes accept the returned extreq_ id or the normalized external id.
// The API resolves ownership through external request mappings and GlobalSession records.

// Run an assistant completion against one of that external user's sessions.
// Credits are deducted from the external user, while the owning Samsar account model config is used internally.
const externalAssistant = await platform.createExternalAssistantCompletion(
  {
    session_id: externalRender.data.request_id,
    input: 'Write a product caption for this video and suggest a headline.',
    max_output_tokens: 250,
  },
  externalUser,
);
console.log(externalAssistant.data.output_text);

// Build embeddings for that external user from already cleaned plain text
const externalEmbedding = await platform.generateExternalEmbeddingsFromPlainText(
  {
    name: 'creator-docs-clean',
    plain_text: [
      {
        url: 'https://example.com/creator/faq',
        title: 'Creator FAQ',
        content: 'Cleaned plain text content for this external user.',
      },
    ],
  },
  externalUser,
);
console.log(externalEmbedding.data.template_id);

// Docker provider fallback can request raw vectors from the deployed processor.
// The deployed instance uses its internal OPENAI_API_KEY.
const rawVectors = await platform.createExternalEmbeddings({
  input: ['gallery publication text', 'viewer search query'],
});
console.log(rawVectors.data.data[0].embedding);

// Fetch their external library
const library = await platform.listExternalUserRequests(externalUser, { limit: 12 });
console.log(library.data.requests.length);

// Publish or archive a render
await platform.publishExternalUserRequest(externalRender.data.request_id, {
  title: 'Running shoe teaser',
}, externalUser);
await platform.archiveExternalUserRequest(externalRender.data.request_id, externalUser);

// Create a short-lived login URL for the external Studio dashboard
const login = await platform.createExternalUserLoginToken(externalUser, {
  redirect: '/external/studio',
});
console.log(login.data.loginUrl);

// Exchange the login token for a client auth token
const verified = await platform.verifyClientSession({
  loginToken: login.data.loginToken,
});

// The returned authToken can be used explicitly for external-user routes
const externalClient = new SamsarClient({
  authToken: verified.data.authToken!,
});
await externalClient.setExternalAssistantSystemPrompt({
  system_prompt: 'You are my personal launch assistant. Stay concise and actionable.',
});
const externalLibrary = await externalClient.listExternalUserRequests();
console.log(externalLibrary.data.requests.map((request) => request.request_id));
```

Video model support notes:
- `createVideoFromText` image model keys include: `GPTIMAGE2`, `IMAGEN4`, `SEEDREAM`, `NANOBANANA2`, `NANOBANANAPRO`, `CUSTOM_TEXT_TO_IMAGE`.
- `createVideoFromText` supports these video models: `RUNWAYML`, `VEO3.1I2V`, `VEO3.1I2VFAST`, `COSMOS3SUPERI2V`, `SEEDANCEI2V` (Seedance 1.5), `KLINGIMGTOVID3PRO`, `KLINGIMGTOVIDTURBO`, and `HAPPYHORSEI2V`.
- `createVideoFromText` accepts either a provided outro (`outro_image_url`) or a server-generated CTA outro (`generate_outro_image: true` with `cta_url` for a QR center image, or `outro_cta_image` for a supplied center logo/CTA image). It can also render bottom CTA footer QR cards with `add_footer_animation` and `footer_metadata`; one footer item applies to every generated scene, while multiple items map by scene index.
- `createVideoFromImageList` supports `RUNWAYML`, `VEO3.1I2V`, `VEO3.1I2VFAST`, `COSMOS3SUPERI2V`, `SEEDANCEI2V`, `KLINGIMGTOVID3PRO`, `KLINGIMGTOVIDTURBO`, and `HAPPYHORSEI2V` via `video_model`; if omitted, it defaults to `RUNWAYML`. It also accepts the same `image_model` keys as text-to-video. Use `aspect_ratio: '16:9'` or `'9:16'`; omitted or invalid values fall back to `16:9`.
- Text and image-list video creation both accept optional `backingtrack_model` / `backing_track_model` / `backingTrackModel` / `music_provider` / `musicProvider`, `tts_model` / `ttsModel` / `tts_provider` / `ttsProvider`, `speakerOptions` / `speaker_options`, and `inference_model` / `inferenceModel`. The adapter normalizes these to `backingtrack_model`, `tts_model`, `speakerOptions`, and `inference_model` in the request payload. Omit `inference_model` to use the account default; supported request values are `gpt-5.5` and `gemini-3.1-pro`. When `tts_model` is set, Samsar limits assignment to the matching speaker list (`openAISpeakers`, `elevenLabsSpeakers`, or `googleSpeakers`; Google TTS requests should include `googleSpeakerDetails`).
- `video_model_sub_type` is no longer used by the API and is stripped from text and image-list payloads before sending.
- `createVideoFromImageList` accepts either a provided outro (`outro_image_url`) or a server-generated CTA outro (`generate_outro_image: true` with `cta_url` for a QR center image, or `outro_cta_image` for a supplied center logo/CTA image). Do not combine the two modes in a single request.
- `outro_cta_image` uses the structured shape `{ top_text, middle_image, bottom_text }`. `middle_image` accepts a public image URL (`{ url }`, `{ image_url }`) or image data (`{ data_url }`, `{ image_data, mime_type }`) and is resized into the same center area used by QR outros without changing aspect ratio.
- `createVideoFromImageList` can render per-scene footer QR cards by setting `add_footer_animation: true` and providing one `footer_metadata` item per image scene.
- `createVideoFromImageList` can also generate QR outro CTA text and each scene footer CTA from a single link by setting `express_cta_generation: true` with `cta_url`. CamelCase `expressCtaGeneration` and compatibility aliases `auto_generate_cta_text` / `generate_cta_texts` are normalized to the same API field.
- `createVideoFromImageList` accepts `limit_single_narrator: true` to keep all narration under one narrator identity. `add_narrator_avatar: true` automatically enables `limit_single_narrator`, generates an influencer-style human narrator avatar, and overlays it bottom-center or centered in the footer row when footer metadata is present.
- `updateVideoOutroImage` accepts either a replacement outro image URL (`outro_image_url`, `outroImageUrl`, `new_outro_image_url`) or a generated CTA outro (`generate_outro_image: true` with `cta_url` or `outro_cta_image`, or just `cta_url` / `outro_cta_image` when no outro image URL is supplied). Generated outro updates reuse the existing session image layers for tiling and only queue frame/video regeneration.
- `updateVideoFooterImage` updates the footer CTA on a cloned session with `cta_text`, `cta_logo`, and/or `cta_url`, or removes all scene footers with `remove_footer: true`. Footer updates queue only frame/video regeneration.
- `cloneVideo` creates a deep copy of a completed session and queues only the final video render so the clone receives a new rendered video path and URL. It does not charge credits.
- Main video methods and external-user methods accept the same generated outro and footer parameters. The API can resolve either internal session ids or external `extreq_...` ids on repeated video routes, so client code can keep using `translateVideo`, `joinVideos`, `addSubtitles`, `removeSubtitles`, `addVideoOutroImage`, `updateVideoOutroImage`, and `updateVideoFooterImage`; the explicit external variants are available when you want to call `/external_users/*` directly. Do not strip the `extreq_` prefix.
- Completed video status, latest-version, and completed-session list responses expose `has_subtitles` and `result_language` when the session metadata is available.
- `publishPublication`, `editPublication`, and `revokePublication` manage public feed publications for completed sessions through free `/publications/*` endpoints. They work with account API keys, customer sub-account API keys, and client auth tokens when the session belongs to the authenticated actor.
- Branched sessions return an `InteractivePublication` from those management methods. It exposes `mainVideoUrl` and the session-level `mainThumbnailUrl`, while every manifest path includes its public video URL, divergence thumbnail, branch hint/description, and media-relative switch timing. `listInteractivePublications` and `getInteractivePublication` read the unauthenticated public catalog and its compact render graph.
- Text-to-video and image-list video pricing use the same per-rendered-second rates for standard express models: `VEO3.1I2V` is 60 credits/sec, `VEO3.1I2VFAST` is 36 credits/sec, `COSMOS3SUPERI2V` is 20 credits/sec, `SEEDANCEI2V` is 30 credits/sec, `KLINGIMGTOVID3PRO` is 36 credits/sec, `KLINGIMGTOVIDTURBO` is 36 credits/sec, `HAPPYHORSEI2V` is 36 credits/sec, and `RUNWAYML` is 30 credits/sec. Image-list narrator avatar generation adds 4 credits/sec when `add_narrator_avatar` is true; express CTA generation adds 1 credit/sec when `express_cta_generation` is true.
- Standard express video models expose a per-second pricing distribution through `EXPRESS_VIDEO_PRICING_DISTRIBUTION_PER_SECOND_BY_MODEL`: pipeline 4, inference 4, image gen/edit 2, speech 2, music 2, effects and lipsync 2, video as the model-specific remainder, and `optionalAddons.express_cta_generation` at 1 credit/sec.

Upcoming `/v2` omni route adapters:
- `/v2` is additive; `/v1` is not deprecated.
- `createV2VideoFromText`, `createV2VideoFromImageList`, `assignV2ImageTitle`, `translateV2Video`, `cloneV2Video`, `regenerateV2VideoAvatar`, `updateV2VideoOutroImage`, `updateV2VideoFooterImage`, `addV2VideoOutroImage`, `getV2Status`, `getV2StatusDetailed`, `getV2Credits`, `listV2Requests`, and `createV2Session` call the new omni route surface.
- Step-controlled video helpers include `createV2StepVideoFromText`, `createV2StepTextToVideo`, `createV2StepVideoFromImage`, `createV2StepImageToVideo`, `getV2StepVideoStatus`, `getV2StepVideoStatusDetailed`, and `processNextV2StepVideo`. They default to 1-step express rendering by sending `auto_render_full_video: true` and `manual_step_stages: []`; pass `{ stepMode: 'two_step' }` or `manual_step_stages: ['ai_video_generation']` to require an explicit second-step approval before image-to-video generation.
- External inference helpers include `createV2ExternalChatCompletion` for synchronous billed chat/vision inference and `createV2ExternalChatCompletionAsync` plus `getV2ExternalChatCompletionStatus`, `pollV2ExternalChatCompletion`, or `createV2ExternalChatCompletionAndPoll` for long-running polling requests. The assistant-named aliases are `createV2ExternalAssistantCompletionAsync`, `getV2ExternalAssistantCompletionStatus`, `pollV2ExternalAssistantCompletion`, and `createV2ExternalAssistantCompletionAndPoll`. Narrative helpers are `createV2ExternalSingleNarrative`, `createV2ExternalBranchingNarrative`, `getV2ExternalNarrativeStatus`, `pollV2ExternalNarrative`, `createV2ExternalSingleNarrativeAndPoll`, and `createV2ExternalBranchingNarrativeAndPoll`; `createV2TextToInteractiveVideo` runs narrative generation, branching, and rendering as one workflow. Synchronous helpers reject async polling controls at compile time; use the dedicated async helpers instead. `createV2ExternalModeration` performs no-charge API-key moderation checks, and `listV2ExternalAudioVoices` reads no-charge provider voice catalogs.
- Programmatic user helpers include `createV2ExternalUser`, `createV2UserRechargeCredits`, `refreshV2UserToken`, `createV2UserAppKey`, `refreshV2UserAppKey`, `getV2UserCredits`, `getV2UserUsageLogs`, and `getV2UserPaymentStatus`.
- Omit `externalUser` for internal account billing, pass `externalUser` to scope an external user with the account API key, or authenticate the client directly with an external-user auth token/API key. V2 external users can be referenced by `unique_key`; if `unique_key` is omitted during creation, the server uses `external_user_id` as the key.
- Before completion, detailed status adapters return the normal status payload plus a normalized `session` preview shape with `layers`, `audioLayers`, `globalAudioLayers`, and `globalVideos`. Layer timing uses `startTime` and `endTime` so clients can preview generated images, scene clips, and speech. Completed branched sessions switch to `interactive_video_manifest.v1` with a compact session envelope and top-level `branching.outputs.paths`.

```ts
const queuedAssistant = await platform.createV2ExternalAssistantCompletionAsync({
  model: 'gpt-5.6-sol',
  messages: [{ role: 'user', content: 'Generate a launch theme.' }],
});

const completedAssistant = await platform.pollV2ExternalAssistantCompletion(
  queuedAssistant.data.request_id,
  { pollIntervalMs: 2_000, pollTimeoutMs: 10 * 60 * 1_000 },
);

console.log(completedAssistant.data.response?.choices);
```

```ts
const v2Video = await platform.createV2VideoFromImageList({
  image_urls: ['https://cdn.example.com/a.png', 'https://cdn.example.com/b.png'],
  video_model: 'RUNWAYML',
  express_cta_generation: true,
  cta_url: 'https://example.com/book',
});

const v2ExternalVideo = await platform.createV2VideoFromImageList(
  {
    image_urls: ['https://cdn.example.com/a.png', 'https://cdn.example.com/b.png'],
    video_model: 'KLINGIMGTOVID3PRO',
  },
  { externalUser },
);

const v2ImageTitle = await platform.assignV2ImageTitle({
  image_url: 'https://cdn.example.com/product-frame.png',
  metadata: { product: 'travel shirt', channel: 'marketplace' },
});
console.log(v2ImageTitle.data.content);

const v2Translated = await platform.translateV2Video({
  videoSessionId: v2Video.data.request_id!,
  language: 'es',
  enable_subtitles: false,
  translate_outro: true,
  translate_footer: true,
});

const v2Clone = await platform.cloneV2Video({
  videoSessionId: v2Video.data.request_id!,
});

const v2AvatarRerender = await platform.regenerateV2VideoAvatar({
  videoSessionId: v2Video.data.request_id!,
});

const v2Status = await platform.getV2Status(v2Video.data.request_id!);
console.log(v2Status.data.status);

const v2Detailed = await platform.getV2StatusDetailed(v2Video.data.request_id!);
console.log(v2Detailed.data.session?.previewStage, v2Detailed.data.session?.layers?.[0]?.preview?.url);
```

Step video generation defaults to a 1-step express render, so it does not pause before image-to-video generation:

```ts
const stepVideo = await platform.createV2StepVideoFromText({
  prompt: 'A 20 second launch teaser for a new travel app',
  image_model: 'GPTIMAGE2',
  video_model: 'RUNWAYML',
  duration: 20,
  aspect_ratio: '16:9',
  enable_subtitles: true,
});

const stepDetailed = await platform.getV2StepVideoStatusDetailed(stepVideo.data.request_id);
console.log(stepDetailed.data.session?.previewStage, stepDetailed.data.session?.layers?.[0]?.preview?.url);
```

Use 2-step mode only when you want to review generated image/audio assets before starting the image-to-video stage:

```ts
const twoStepVideo = await platform.createV2StepVideoFromText(
  {
    prompt: 'A 20 second launch teaser for a new travel app',
    image_model: 'GPTIMAGE2',
    video_model: 'RUNWAYML',
    duration: 20,
    aspect_ratio: '16:9',
    enable_subtitles: true,
  },
  { stepMode: 'two_step' },
);

let stepStatus = await platform.getV2StepVideoStatus(twoStepVideo.data.request_id);
if (stepStatus.data.waiting_for_process_next || stepStatus.data.can_process_next) {
  stepStatus = await platform.processNextV2StepVideo(twoStepVideo.data.request_id);
}

const stepImageVideo = await platform.createV2StepVideoFromImage({
  image_url: 'https://cdn.example.com/product-frame.png',
  prompt: 'Turn this product frame into a cinematic ad',
  video_model: 'KLINGIMGTOVID3PRO',
  aspect_ratio: '16:9',
});
console.log(stepImageVideo.data.step?.current_step);
```

Create and reference a V2 external user:

```ts
const createdExternalUser = await platform.createV2ExternalUser({
  unique_key: 'wallet:0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  email: 'member@example.com',
  display_name: 'Member Name',
});

const v2RegisteredExternalVideo = await platform.createV2VideoFromImageList(
  {
    image_urls: ['https://cdn.example.com/a.png', 'https://cdn.example.com/b.png'],
    video_model: 'RUNWAYML',
  },
  {
    externalUser: {
      unique_key: createdExternalUser.data.unique_key!,
    },
  },
);
console.log(v2RegisteredExternalVideo.data.request_id);
```

Programmatic user recharge and OAuth-style refresh token rotation:

```ts
const publicClient = new SamsarClient({});

const checkout = await publicClient.createV2UserRechargeCredits({
  amount: 25,
  email: 'customer@example.com',
  redirect_url: 'https://example.com/samsar/callback',
});

// After the Stripe webhook calls your redirect_url with authToken, refreshToken, and expiryDate:
const userClient = new SamsarClient({ authToken });
const refreshed = await userClient.refreshV2UserToken(refreshToken);

localStorage.setItem('authToken', refreshed.data.authToken);
localStorage.setItem('refreshToken', refreshed.data.refreshToken);
localStorage.setItem('expiryDate', refreshed.data.expiryDate);
```

Long-running app credentials:

```ts
const secret = crypto.randomUUID() + crypto.randomUUID();
const created = await userClient.createV2UserAppKey({ secret });

const appClient = new SamsarClient({
  appKey: created.data.appKey ?? created.data.app_key,
  appSecret: secret,
});

const credits = await appClient.getV2UserCredits();
const rotated = await appClient.refreshV2UserAppKey();
```

Each method returns `{ data, status, headers, creditsCharged, creditsRemaining, raw }`. Non-2xx responses throw `SamsarRequestError` containing status, body, and credit headers (if present).

## Billing notes

- Unified `text_to_interactive_video` requests include singular and branching narrative inference without separate narrative charges. The workflow charges the chosen video model's full express-video rate over cumulative unique branch-layer duration, counting shared layers once.
- External narrative requests bill 1.5x cumulative underlying inference spend. `create_single` includes theme generation, narrative generation, validation retries, and stage-one enrichment. `create_branching` includes every divergence-planning call, child-tree generation call, and validation retry across all providers and tree levels. Status polling itself is not billed.
- Assistant completions are billed from actual request usage. Samsar measures the processed input and generated output, converts usage to credits using the standard `100 credits = $1` rule, and applies a `2.5x` assistant multiplier so text-only and multimodal sessions are priced consistently.
- Embedding endpoints (`createEmbedding`, `updateEmbedding`, `searchAgainstEmbedding`, `similarToEmbedding`) are billed by input tokens at $1 per million tokens. `deleteEmbeddings` does not consume tokens.
- URL-based embedding creation (`createEmbedding` with `urls`, or `createEmbeddingFromUrl`) supports `levels` 1-3, defaults to 2, caps total crawled pages at 50 per request, bills actual Firecrawl usage with a `2.5x` crawl multiplier, and then bills the embedding phase with a separate flat `2.5x` multiplier.
- Plain-text embedding creation (`generateEmbeddingsFromPlainText`, `generateExternalEmbeddingsFromPlainText`) skips crawling and charges only the embedding-token cost with a flat `2.5x` multiplier.
- Token-based routes scale with the amount of content processed. Larger prompts, longer responses, and richer inputs use more credits than short text-only requests.
- Receipt template creation (`createReceiptTemplate`) and template JSON lookup (`getReceiptTemplateJson`) are free; receipt template query (`queryReceiptTemplate`) costs 50 credits per request.

## Configuration

- `apiKey` (optional): the existing Bearer credential, sent as `Authorization: Bearer <apiKey>`. It remains compatible with both Samsar API keys and legacy integrations that supplied a user auth token through this field.
- `authToken` (optional): a logged-in user's auth token sent as `Authorization: Bearer <authToken>`; it is trimmed and takes precedence when both `authToken` and `apiKey` are provided.
- Provide `authToken`, `apiKey`, AppKey credentials, or no credential for routes that are explicitly public.
- `baseUrl` (optional): defaults to `https://api.samsar.one/v1`. Override for self-hosted or staging.
- `timeoutMs` (optional): defaults to 30s.
- `fetch` (optional): supply a fetch implementation when not available globally (e.g., Node <18).
- `defaultHeaders` (optional): merged into every request.
- `externalUserApiKey` (optional): default `x-external-user-api-key` header for external-user scoped requests.

## Build

```bash
npm install
npm run build   # emits dist/
```

## Publish

```bash
# to npm public
npm publish --access public

# to a private registry
npm publish --registry <your-registry-url>
```

Ensure `package.json` name/version are set as desired before publishing.

## Maintainer Deploy Script

`deploy.sh` publishes the current package to npm using `NPM_TOKEN` from env (or `.env`).
Commit SDK source changes first: the script requires a clean SDK checkout so the
npm artifact is reproducible from GitHub.

```bash
# retry an unpublished version already recorded in package.json
./deploy.sh

# bump version, then publish
./deploy.sh patch
./deploy.sh minor
./deploy.sh major
```

Before npm publication, the script verifies every target Git ref, commits the
version metadata, and pushes the same release commit to the current SDK branch
and `main`. If either push is unsafe, npm is not changed.

After npm confirms the new version, the script updates the exact `samsar-js`
version in the six registry-based Samsar service sources (processor, generator,
audio generator, AI-video layer generator, express-video listener, and
assistant-query processor), commits only their dependency files, and pushes
their current branches. It then updates the monorepo setup wizard, runs the
canonical source sync, and promotes the resulting monorepo commit to both
`develop` and `main`. The monorepo phase does not build Docker images.

Re-running a partially completed release never creates another version by
default. Use `RESUME_PUBLISHED_VERSION=1 ./deploy.sh` to finish Git and consumer
propagation for the version already present on npm.

Standalone Gallery propagation is opt-in because its GitHub push triggers the
normal Vercel deployment. When enabled, the sibling Gallery checkout is used if
available; otherwise the script temporarily clones
`https://github.com/samsarone/Gallery.git`.

Optional release controls:

```bash
RESUME_PUBLISHED_VERSION=1      # resume an already-published exact version
SYNC_SAMSAR_GALLERY=1           # opt in to Gallery dependency update/deployment
GIT_PUSH_SAMSAR_GALLERY=0       # update locally without committing or pushing
SAMSAR_GALLERY_ROOT=/path/to/samsar-gallery
SAMSAR_GALLERY_REPOSITORY=https://github.com/samsarone/Gallery.git
SYNC_SAMSAR_MONOREPO=0          # disable monorepo sync/promotion
GIT_PUSH_SAMSAR_MONOREPO=0      # sync locally without pushing develop/main
```
