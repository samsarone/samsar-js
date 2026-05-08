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

// Remove branding/watermark
const cleaned = await samsar.removeBrandingFromImage({ image_url: 'https://example.com/photo.png' });

// Replace branding/watermark (original image, replacement logo/image)
const replaced = await samsar.replaceBrandingFromImage({
  image_urls: ['https://example.com/photo.png', 'https://example.com/new-logo.png'],
});

// Extend image set
const images = await samsar.extendImageList({
  image_urls: ['https://example.com/extra.jpg'],
  prompt: 'Create a cinematic travel header banner',
  num_images: 4,
  aspect_ratio: '16:9',
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

// Update an external user's existing outro by generating a new QR CTA outro
const externalOutroUpdate = await platform.updateExternalVideoOutroImage(externalUser, {
  request_id: externalRender.data.request_id,
  generate_outro_image: true,
  cta_url: 'https://example.com/shop',
  cta_text_top: 'Scan to shop',
  cta_text_bottom: 'Limited drop',
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

// The returned authToken can be used as the SDK apiKey for external-user routes
const externalClient = new SamsarClient({
  apiKey: verified.data.authToken!,
});
await externalClient.setExternalAssistantSystemPrompt({
  system_prompt: 'You are my personal launch assistant. Stay concise and actionable.',
});
const externalLibrary = await externalClient.listExternalUserRequests();
console.log(externalLibrary.data.requests.map((request) => request.request_id));
```

Video model support notes:
- `createVideoFromText` image model keys include: `GPTIMAGE2`, `IMAGEN4`, `SEEDREAM`, `NANOBANANA2`, `CUSTOM_TEXT_TO_IMAGE`.
- `createVideoFromText` supports these video models: `VEO3.1I2V`, `VEO3.1I2VFAST`, `SEEDANCEI2V` (Seedance 2.0), `KLINGIMGTOVID3PRO`, `RUNWAYML`, and `CUSTOM_IMAGE_TO_VIDEO`.
- `createVideoFromText` accepts either a provided outro (`outro_image_url`) or server-generated QR outro (`generate_outro_image: true` with `cta_url`). It can also render bottom CTA footer QR cards with `add_footer_animation` and `footer_metadata`; one footer item applies to every generated scene, while multiple items map by scene index.
- `createVideoFromImageList` supports `VEO3.1I2V`, `VEO3.1I2VFAST`, `SEEDANCEI2V`, `KLINGIMGTOVID3PRO`, `RUNWAYML`, and `CUSTOM_IMAGE_TO_VIDEO` via `video_model`; if omitted, it defaults to `VEO3.1I2V`. Use `aspect_ratio: '16:9'` or `'9:16'`; omitted or invalid values fall back to `16:9`.
- `createVideoFromImageList` accepts either a provided outro (`outro_image_url`) or server-generated QR outro (`generate_outro_image: true` with `cta_url`). Do not combine the two modes in a single request.
- `createVideoFromImageList` can render per-scene footer QR cards by setting `add_footer_animation: true` and providing one `footer_metadata` item per image scene.
- `createVideoFromImageList` accepts `limit_single_narrator: true` to keep all narration under one narrator identity. `add_narrator_avatar: true` automatically enables `limit_single_narrator`, generates an influencer-style human narrator avatar, and overlays it bottom-center or centered in the footer row when footer metadata is present.
- `updateVideoOutroImage` accepts either a replacement outro image URL (`outro_image_url`, `outroImageUrl`, `new_outro_image_url`) or a generated QR CTA outro (`generate_outro_image: true` with `cta_url`, or just `cta_url` when no outro image URL is supplied). Generated outro updates reuse the existing session image layers for tiling and only queue frame/video regeneration.
- `updateVideoFooterImage` updates the footer CTA on a cloned session with `cta_text`, `cta_logo`, and/or `cta_url`, or removes all scene footers with `remove_footer: true`. Footer updates queue only frame/video regeneration.
- `cloneVideo` creates a deep copy of a completed session and queues only the final video render so the clone receives a new rendered video path and URL. It does not charge credits.
- Main video methods and external-user methods accept the same generated outro and footer parameters. The API can resolve either internal session ids or external `extreq_...` ids on repeated video routes, so client code can keep using `translateVideo`, `joinVideos`, `addSubtitles`, `removeSubtitles`, `addVideoOutroImage`, `updateVideoOutroImage`, and `updateVideoFooterImage`; the explicit external variants are available when you want to call `/external_users/*` directly. Do not strip the `extreq_` prefix.
- Completed video status, latest-version, and completed-session list responses expose `has_subtitles` and `result_language` when the session metadata is available.
- `publishPublication`, `editPublication`, and `revokePublication` manage public feed publications for completed sessions through free `/publications/*` endpoints. They work with account API keys, customer sub-account API keys, and client auth tokens when the session belongs to the authenticated actor.
- Text-to-video and image-list video pricing use the same per-rendered-second rates for standard express models: `VEO3.1I2V` is 60 credits/sec, `VEO3.1I2VFAST` is 36 credits/sec, `SEEDANCEI2V` is 30 credits/sec, `KLINGIMGTOVID3PRO` is 36 credits/sec, and `RUNWAYML` is 30 credits/sec. Image-list narrator avatar generation adds 4 credits/sec when `add_narrator_avatar` is true.
- Standard express video models expose a per-second pricing distribution through `EXPRESS_VIDEO_PRICING_DISTRIBUTION_PER_SECOND_BY_MODEL`: pipeline 4, inference 4, image gen/edit 2, speech 2, music 2, effects and lipsync 2, and video as the model-specific remainder.

Upcoming `/v2` omni route adapters:
- `/v2` is additive; `/v1` is not deprecated.
- `createV2VideoFromText`, `createV2VideoFromImageList`, `translateV2Video`, `cloneV2Video`, `updateV2VideoOutroImage`, `updateV2VideoFooterImage`, `addV2VideoOutroImage`, `getV2Status`, `getV2Credits`, `listV2Requests`, and `createV2Session` call the new omni route surface.
- Step-controlled video helpers include `createV2StepVideoFromText`, `createV2StepTextToVideo`, `createV2StepVideoFromImage`, `createV2StepImageToVideo`, `getV2StepVideoStatus`, and `processNextV2StepVideo`.
- Programmatic user helpers include `createV2ExternalUser`, `createV2UserRechargeCredits`, `refreshV2UserToken`, `createV2UserAppKey`, `refreshV2UserAppKey`, `getV2UserCredits`, `getV2UserUsageLogs`, and `getV2UserPaymentStatus`.
- Omit `externalUser` for internal account billing, pass `externalUser` to scope an external user with the account API key, or authenticate the client directly with an external-user auth token/API key. V2 external users can be referenced by `unique_key`; if `unique_key` is omitted during creation, the server uses `external_user_id` as the key.

```ts
const v2Video = await platform.createV2VideoFromImageList({
  image_urls: ['https://cdn.example.com/a.png', 'https://cdn.example.com/b.png'],
  video_model: 'RUNWAYML',
  generate_outro_image: true,
  cta_url: 'https://example.com/book',
  cta_text_top: 'Scan to book',
});

const v2ExternalVideo = await platform.createV2VideoFromImageList(
  {
    image_urls: ['https://cdn.example.com/a.png', 'https://cdn.example.com/b.png'],
    video_model: 'KLINGIMGTOVID3PRO',
  },
  { externalUser },
);

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

const v2Status = await platform.getV2Status(v2Video.data.request_id!);
console.log(v2Status.data.status);
```

Step-controlled video generation pauses after each completed stage until you call `processNextV2StepVideo`:

```ts
const stepVideo = await platform.createV2StepVideoFromText({
  prompt: 'A 20 second launch teaser for a new travel app',
  image_model: 'GPTIMAGE2',
  video_model: 'RUNWAYML',
  duration: 20,
  aspect_ratio: '16:9',
  enable_subtitles: true,
});

let stepStatus = await platform.getV2StepVideoStatus(stepVideo.data.request_id);
if (stepStatus.data.step_status === 'COMPLETED') {
  console.log(stepStatus.data.current_step, stepStatus.data.current_step_resources);
  stepStatus = await platform.processNextV2StepVideo(stepVideo.data.request_id);
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
const userClient = new SamsarClient({ apiKey: authToken });
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

- Assistant completions are billed from actual request usage. Samsar measures the processed input and generated output, converts usage to credits using the standard `100 credits = $1` rule, and applies a `2.5x` assistant multiplier so text-only and multimodal sessions are priced consistently.
- Embedding endpoints (`createEmbedding`, `updateEmbedding`, `searchAgainstEmbedding`, `similarToEmbedding`) are billed by input tokens at $1 per million tokens. `deleteEmbeddings` does not consume tokens.
- URL-based embedding creation (`createEmbedding` with `urls`, or `createEmbeddingFromUrl`) supports `levels` 1-3, defaults to 2, caps total crawled pages at 50 per request, bills actual Firecrawl usage with a `2.5x` crawl multiplier, and then bills the embedding phase with a separate flat `2.5x` multiplier.
- Plain-text embedding creation (`generateEmbeddingsFromPlainText`, `generateExternalEmbeddingsFromPlainText`) skips crawling and charges only the embedding-token cost with a flat `2.5x` multiplier.
- Token-based routes scale with the amount of content processed. Larger prompts, longer responses, and richer inputs use more credits than short text-only requests.
- Receipt template creation (`createReceiptTemplate`) and template JSON lookup (`getReceiptTemplateJson`) are free; receipt template query (`queryReceiptTemplate`) costs 50 credits per request.

## Configuration

- `apiKey` (required): your Samsar API key; sent as `Authorization: Bearer <apiKey>`.
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

```bash
# publish current version
./deploy.sh

# bump version, then publish
./deploy.sh patch
./deploy.sh minor
./deploy.sh major
```
