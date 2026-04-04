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
    image_model: 'GPTIMAGE1',
    video_model: 'RUNWAYML',
    duration: 30,
    font_key: 'Poppins',
    enable_subtitles: false,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Create a video from an image list
const videoFromImages = await samsar.createVideoFromImageList(
  {
    image_urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
    prompt: 'Cinematic sequence with smooth transitions',
    metadata: { project: 'demo' },
    language: 'en',
    font_key: 'Poppins',
    enable_subtitles: false,
  },
  { webhookUrl: 'https://example.com/webhook' },
);

// Translate an existing video session into another language
const translated = await samsar.translateVideo(
  {
    videoSessionId: videoFromImages.data.session_id ?? videoFromImages.data.request_id!,
    language: 'es',
    // Optional: override the outro image in the translated session
    outro_image_url: 'https://cdn.example.com/outro.png',
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

// Cancel an in-progress render
const cancelled = await samsar.cancelRender({
  videoSessionId: noSubtitles.data.session_id ?? noSubtitles.data.request_id!,
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

// Fetch the latest render URL for a session (when available)
const latest = await samsar.fetchLatestVideoVersion(video.data.session_id ?? video.data.request_id);
console.log(latest.data.result_url ?? latest.data.status);

// List completed video sessions for this API key
const completedSessions = await samsar.listCompletedVideoSessions();
completedSessions.data.forEach((session) => {
  console.log(session.session_id, session.langauge, session.result_url);
});

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
  image_model: 'GPTIMAGE1',
  video_model: 'RUNWAYML',
  duration: 10,
  enable_subtitles: true,
});

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
- `createVideoFromText` image model keys include: `GPTIMAGE1`, `IMAGEN4`, `SEEDREAM`, `HUNYUAN`, `NANOBANANA2`.
- `createVideoFromText` supports all express video models: `RUNWAYML`, `KLINGIMGTOVID3PRO`, `HAILUO`, `HAILUOPRO`, `SEEDANCEI2V`, `VEO3.1I2V`, `VEO3.1I2VFAST`, `SORA2`, `SORA2PRO`.
- `createVideoFromImageList` uses a fixed Veo2.1 pipeline model (`VEO3.1I2V`) and does not accept a `video_model` override.

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
