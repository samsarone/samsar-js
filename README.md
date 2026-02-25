# samsar-js

TypeScript/ESM client for the Samsar Processor public API (`https://api.samsar.one/v1`). It mirrors the OpenAI-style ergonomics for creating videos, enhancing chat messages, and managing image operations.

## Installation

```bash
npm install samsar-js
# or from a private registry
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
const enhanced = await samsar.enhanceMessage({ message: 'Please improve this caption.' });

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
  num_images: 4,
});

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

Video model support notes:
- `createVideoFromText` supports all express video models: `RUNWAYML`, `KLINGIMGTOVID3PRO`, `HAILUO`, `HAILUOPRO`, `SEEDANCEI2V`, `VEO3.1I2V`, `VEO3.1I2VFAST`, `SORA2`, `SORA2PRO`.
- `createVideoFromImageList` uses a fixed Veo2.1 pipeline model (`VEO3.1I2V`) and does not accept a `video_model` override.

Each method returns `{ data, status, headers, creditsCharged, creditsRemaining, raw }`. Non-2xx responses throw `SamsarRequestError` containing status, body, and credit headers (if present).

## Billing notes

- Embedding endpoints (`createEmbedding`, `updateEmbedding`, `searchAgainstEmbedding`, `similarToEmbedding`) are billed by input tokens at $1 per million tokens. `deleteEmbeddings` does not consume tokens.
- Token counts follow OpenAI tokenization for `text-embedding-3-large`. Credit deductions follow the existing 100 credits per USD rule.

## Configuration

- `apiKey` (required): your Samsar API key; sent as `Authorization: Bearer <apiKey>`.
- `baseUrl` (optional): defaults to `https://api.samsar.one/v1`. Override for self-hosted or staging.
- `timeoutMs` (optional): defaults to 30s.
- `fetch` (optional): supply a fetch implementation when not available globally (e.g., Node <18).
- `defaultHeaders` (optional): merged into every request.

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
