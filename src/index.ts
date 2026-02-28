const DEFAULT_BASE_URL = 'https://api.samsar.one/v1';
const DEBUG = (() => {
  const env = (globalThis as any)?.process?.env;
  return env?.SAMSAR_SDK_DEBUG === '1';
})();

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

export interface SamsarClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: FetchLike;
  defaultHeaders?: Record<string, string>;
}

export interface SamsarRequestOptions {
  idempotencyKey?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  query?: QueryParams;
}

export interface SamsarResult<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  creditsCharged?: number;
  creditsRemaining?: number;
  raw: Response;
}

export interface FontOptions {
  key?: string;
  font_key?: string;
  language?: string;
  family?: string;
}

export interface CreateVideoFromTextInput {
  prompt: string;
  image_model: string;
  video_model: string;
  duration: number;
  tone?: string;
  aspect_ratio?: string;
  video_model_sub_type?: string;
  font_key?: string;
  fontKey?: string;
  subtitle_font?: string;
  subtitleFont?: string;
  font?: FontOptions;
  language?: string;
  languageString?: string | null;
  enable_subtitles?: boolean;
  enableSubtitles?: boolean;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  [key: string]: unknown;
}

export interface CreateVideoResponse {
  request_id: string;
  session_id?: string;
  sessionID?: string;
  [key: string]: unknown;
}

export interface OutroFocusArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageListToVideoItem {
  image_url?: string;
  imageUrl?: string;
  url?: string;
  src?: string;
  enhanced_url?: string;
  enhancedUrl?: string;
  use_enhanced?: boolean;
  useEnhanced?: boolean;
  is_enhanced?: boolean;
  isEnhanced?: boolean;
  from_enhanced_list?: boolean;
  fromEnhancedList?: boolean;
  skip_enhancement?: boolean;
  skipEnhancement?: boolean;
  [key: string]: unknown;
}

export interface CreateVideoFromImageListInput {
  image_urls: Array<string | ImageListToVideoItem>;
  metadata?: Record<string, unknown>;
  prompt?: string;
  language?: string;
  languageString?: string | null;
  font_key?: string;
  fontKey?: string;
  subtitle_font?: string;
  subtitleFont?: string;
  font?: FontOptions;
  enable_subtitles?: boolean;
  enableSubtitles?: boolean;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  outro_image_url?: string;
  add_outro_animation?: boolean;
  add_outro_focus_area?: boolean;
  outro_focust_area?: OutroFocusArea | null;
  [key: string]: unknown;
}

export interface TranscriptBuilderPayload {
  prompt?: string;
  imageDescriptionList?: unknown[];
  metadata?: Record<string, unknown>;
  imageList?: string[];
  language?: string;
  languageString?: string | null;
  [key: string]: unknown;
}

export interface CreateVideoFromImageListResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  status?: string;
  case_type?: string;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface TranslateVideoInput {
  videoSessionId?: string;
  video_session_id?: string;
  videoSessionID?: string;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  request_id?: string;
  requestId?: string;
  language?: string;
  languageString?: string | null;
  language_code?: string;
  languageCode?: string;
  langauge?: string;
  langauge_code?: string;
  langaugeCode?: string;
  outro_image_url?: string;
  outroImageUrl?: string;
  new_outro_image_url?: string;
  newOutroImageUrl?: string;
  [key: string]: unknown;
}

export interface TranslateVideoResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface UpdateVideoOutroImageInput {
  videoSessionId?: string;
  video_session_id?: string;
  videoSessionID?: string;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  request_id?: string;
  requestId?: string;
  outro_image_url?: string;
  outroImageUrl?: string;
  new_outro_image_url?: string;
  newOutroImageUrl?: string;
  [key: string]: unknown;
}

export interface UpdateVideoOutroImageResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface AddVideoOutroImageInput {
  videoSessionId?: string;
  video_session_id?: string;
  videoSessionID?: string;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  request_id?: string;
  requestId?: string;
  outro_image_url?: string;
  outroImageUrl?: string;
  new_outro_image_url?: string;
  newOutroImageUrl?: string;
  add_outro_animation?: boolean;
  addOutroAnimation?: boolean;
  add_outro_focus_area?: boolean;
  addOutroFocusArea?: boolean;
  outro_focust_area?: OutroFocusArea | null;
  outro_focus_area?: OutroFocusArea | null;
  outroFocustArea?: OutroFocusArea | null;
  outroFocusArea?: OutroFocusArea | null;
  [key: string]: unknown;
}

export interface AddVideoOutroImageResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface JoinVideosInput {
  session_ids?: string[];
  sessionIds?: string[];
  video_session_ids?: string[];
  videoSessionIds?: string[];
  blend_scenes?: boolean;
  blendScenes?: boolean;
  [key: string]: unknown;
}

export interface JoinVideosResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface RemoveSubtitlesInput {
  videoSessionId?: string;
  video_session_id?: string;
  videoSessionID?: string;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  request_id?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface RemoveSubtitlesResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface CancelRenderInput {
  videoSessionId?: string;
  video_session_id?: string;
  videoSessionID?: string;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  request_id?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface CancelRenderResponse {
  request_id?: string;
  session_id?: string;
  sessionID?: string;
  status?: string;
  cancelled?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface FetchLatestVideoVersionResponse {
  session_id: string;
  result_url?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export interface CompletedVideoSession {
  session_id: string;
  langauge: string;
  language?: string;
  result_url: string;
  [key: string]: unknown;
}

export type ListCompletedVideoSessionsResponse = CompletedVideoSession[];

export interface SupportedTextToVideoModelsResponse {
  IMAGE_MODELS: SupportedTextToVideoModelOption[];
  VIDEO_MODELS: SupportedTextToVideoModelOption[];
  [key: string]: unknown;
}

export interface SupportedTextToVideoModelOption {
  label: string;
  value: string;
  basePrice: number | null;
  [key: string]: unknown;
}

export interface EnhanceMessageRequest {
  message: string;
  metadata?: Record<string, unknown>;
  language?: string;
}

export interface EnhanceMessageResponse {
  content: string;
  [key: string]: unknown;
}

export interface EmbeddingStructuredField {
  key: string;
  type: string;
  sampleValues?: unknown[];
  stats?: Record<string, unknown>;
}

export interface EmbeddingFieldOptions {
  searchable?: boolean;
  filterable?: boolean;
  retrievable?: boolean;
}

export type EmbeddingFieldOptionsInput =
  | Record<string, EmbeddingFieldOptions>
  | Array<
      EmbeddingFieldOptions & {
        key?: string;
        field?: string;
        name?: string;
        path?: string;
        column_name?: string;
        columnName?: string;
      }
    >;

export interface CreateEmbeddingRequest {
  records: Array<Record<string, unknown>>;
  name?: string;
  embedding_name?: string;
  template_name?: string;
  field_options?: EmbeddingFieldOptionsInput;
  fieldOptions?: EmbeddingFieldOptionsInput;
  [key: string]: unknown;
}

export interface CreateEmbeddingResponse {
  template_id: string;
  template_hash?: string;
  hash_link?: string;
  record_count?: number;
  structured_fields?: EmbeddingStructuredField[];
  unstructured_fields?: string[];
  [key: string]: unknown;
}

export interface UpdateEmbeddingRequest {
  template_id: string;
  records: Array<Record<string, unknown>>;
  field_options?: EmbeddingFieldOptionsInput;
  fieldOptions?: EmbeddingFieldOptionsInput;
  [key: string]: unknown;
}

export interface UpdateEmbeddingResponse {
  template_id: string;
  template_hash?: string;
  record_count?: number;
  structured_fields?: EmbeddingStructuredField[];
  unstructured_fields?: string[];
  [key: string]: unknown;
}

export interface DeleteEmbeddingsRequest {
  template_id: string;
  [key: string]: unknown;
}

export interface DeleteEmbeddingsResponse {
  template_id: string;
  deleted_count?: number;
  record_count?: number;
  status?: string;
  [key: string]: unknown;
}

export interface DeleteEmbeddingRequest {
  template_id: string;
  source_id?: string;
  sourceId?: string;
  source_ids?: string[];
  sourceIds?: string[];
  id?: string;
  ids?: string[];
  record_id?: string;
  recordId?: string;
  record_ids?: string[];
  recordIds?: string[];
  [key: string]: unknown;
}

export type DeleteEmbeddingResponse = DeleteEmbeddingsResponse;

export interface SearchAgainstEmbeddingRequest {
  template_id: string;
  search_term: string;
  search_date?: string;
  searchDate?: string;
  structured_filters?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  search_params?: Record<string, unknown>;
  searchParams?: Record<string, unknown>;
  limit?: number;
  num_candidates?: number;
  rerank?: boolean;
  include_raw?: boolean;
  [key: string]: unknown;
}

export interface EmbeddingSearchResult {
  id: string;
  score?: number;
  structured_filters?: Record<string, unknown>;
  record?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SearchAgainstEmbeddingResponse {
  template_id: string;
  template_name?: string | null;
  structured_filters?: Record<string, unknown>;
  results?: EmbeddingSearchResult[];
  [key: string]: unknown;
}

export interface SimilarToEmbeddingRequest {
  template_id: string;
  search_term?: string;
  search_date?: string;
  searchDate?: string;
  search_json?: Record<string, unknown>;
  search_record?: Record<string, unknown>;
  searchJson?: Record<string, unknown>;
  searchRecord?: Record<string, unknown>;
  structured_filters?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  search_params?: Record<string, unknown>;
  searchParams?: Record<string, unknown>;
  limit?: number;
  min_results?: number;
  minResults?: number;
  num_candidates?: number;
  [key: string]: unknown;
}

export interface SimilarToEmbeddingResponse {
  template_id: string;
  structured_filters?: Record<string, unknown>;
  matches?: Array<{ id: string; score?: number }>;
  [key: string]: unknown;
}

export interface EmbeddingTemplateSummary {
  template_id: string;
  name?: string | null;
  template_hash?: string | null;
  hash_link?: string | null;
  record_count?: number;
  structured_fields?: EmbeddingStructuredField[];
  unstructured_fields?: string[];
  embedding_model?: string;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface ListEmbeddingTemplatesResponse {
  templates: EmbeddingTemplateSummary[];
  pagination?: {
    total?: number;
    limit?: number;
    offset?: number;
    has_more?: boolean;
  };
  [key: string]: unknown;
}

export interface EmbeddingStatusResponse {
  template_id: string;
  has_embeddings: boolean;
  record_count?: number;
  status?: string;
  [key: string]: unknown;
}

export interface RemoveBrandingFromImageRequest {
  image_url: string;
}

export interface RemoveBrandingFromImageResponse {
  status?: string;
  message?: string;
  request_id?: string;
  session_id?: string;
  global_status_id?: string;
  case_type?: string;
  image_url: string;
  userId?: string;
  creditsCharged?: number;
  remainingCredits?: number;
  [key: string]: unknown;
}

export interface ReplaceBrandingFromImageRequest {
  image_urls: string[];
}

export interface ReplaceBrandingFromImageResponse {
  status?: string;
  message?: string;
  request_id?: string;
  session_id?: string;
  global_status_id?: string;
  case_type?: string;
  image_urls: string[];
  userId?: string;
  creditsCharged?: number;
  remainingCredits?: number;
  [key: string]: unknown;
}

export interface EnhanceImageRequest {
  image_url: string;
  resolution?: '1k' | '2k' | '3k' | '4k';
  aspect_ratio?: string;
}

export interface EnhanceImageResponse {
  status?: string;
  message?: string;
  request_id?: string;
  session_id?: string;
  global_status_id?: string;
  case_type?: string;
  image_url: string;
  resolution?: string;
  aspect_ratio?: string;
  userId?: string;
  creditsCharged?: number;
  remainingCredits?: number;
  [key: string]: unknown;
}

export interface ExtendImageListRequest {
  image_urls: string[];
  num_images: number;
  prompt?: string;
  metadata?: Record<string, unknown>;
}

export interface ExtendImageListResponse {
  status?: string;
  message?: string;
  request_id?: string;
  session_id?: string;
  global_status_id?: string;
  case_type?: string;
  image_urls: string[];
  metadata?: Record<string, unknown>;
  prompt?: string;
  num_images?: number;
  userId?: string;
  creditsCharged?: number;
  remainingCredits?: number;
  [key: string]: unknown;
}

export interface ReceiptTemplateRoi {
  id: string;
  label: string;
  purpose?: string | null;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ReceiptTemplateField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  roi_id?: string | null;
  description?: string | null;
}

export interface ReceiptTemplateDefinition {
  schema_version?: string;
  merchant_hint?: string | null;
  language_hint?: string | null;
  currency_hint?: string | null;
  rois?: ReceiptTemplateRoi[];
  fields?: ReceiptTemplateField[];
  validation_rules?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CreateReceiptTemplateRequest {
  image_url: string;
  template_name?: string;
}

export interface CreateReceiptTemplateResponse {
  template_id: string;
  template_hash?: string;
  template_name?: string | null;
  normalized_template?: ReceiptTemplateDefinition;
  sample_receipt?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
}

export interface QueryReceiptTemplateRequest {
  image_url: string;
  template_id: string;
}

export interface QueryReceiptTemplateResponse {
  template_id: string;
  template_hash?: string;
  template_name?: string | null;
  normalized_template?: ReceiptTemplateDefinition;
  receipt_json?: Record<string, unknown>;
  standardized_receipt?: Record<string, unknown>;
  items?: Array<Record<string, unknown>>;
  unreadable_fields?: string[];
  confidence?: number;
  validation?: {
    is_valid?: boolean;
    issues?: string[];
    missing_required_fields?: string[];
    type_mismatch_fields?: string[];
    arithmetic?: Record<string, unknown>;
    [key: string]: unknown;
  };
  attempts?: number;
  creditsCharged?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface RollupBannerOverlay {
  footer?: string | null;
  bottom?: string | null;
  bottom_text?: string | null;
  text?: string | null;
  title?: string | null;
  top_left?: string | null;
  top_right?: string | null;
  topLeft?: string | null;
  topRight?: string | null;
  image_category?: string | null;
}

export interface RollupBannerImageItem {
  image_url?: string;
  imageUrl?: string;
  url?: string;
  src?: string;
  overlay?: RollupBannerOverlay | null;
  image_text?: string | null;
  image_title?: string | null;
  title?: string | null;
  name?: string | null;
  image_category?: string | null;
  category?: string | null;
  image_duration?: number | string | null;
  duration?: number | string | null;
  duration_text?: string | null;
  durationText?: string | null;
  activity_id?: number | null;
  enhanced_url?: string | null;
  enhancedUrl?: string | null;
  [key: string]: unknown;
}

export type RollupBannerImageInput = string | RollupBannerImageItem;

export interface RollupBannerFontOptions {
  key?: string;
  language?: string;
  family?: string;
}

export interface RollupBannerImageTilingPosition {
  font_key?: string;
  font_family?: string;
  font?: RollupBannerFontOptions;
  top_left?: {
    margin_min?: number;
    margin_ratio?: number;
    diameter_min?: number;
    diameter_max?: number;
    diameter_ratio?: number;
    inner_padding_min?: number;
    inner_padding_ratio?: number;
  };
  top_right?: {
    margin_min?: number;
    margin_ratio?: number;
    max_width_floor?: number;
    min_width?: number;
    padding_left?: number;
    padding_right?: number;
    padding_top?: number;
    padding_bottom?: number;
    overlay_height_min?: number;
  };
  bottom?: {
    inset_min?: number;
    inset_ratio?: number;
    offset_min?: number;
    offset_ratio?: number;
    container_margin_min?: number;
    container_margin_ratio?: number;
    text_inset_min?: number;
    text_inset_ratio?: number;
    overlay_height_min?: number;
  };
}

export interface CreateRollupBannerRequest {
  images?: RollupBannerImageInput[];
  image_list?: RollupBannerImageInput[];
  image_urls?: RollupBannerImageInput[];
  logo_url?: string | null;
  header_image_url?: string | null;
  header_text?: string | null;
  header_cta?: string[] | null;
  footer_text?: string | null;
  footer_image_url?: string | null;
  footer_logo_url?: string | null;
  image_tiling_position?: RollupBannerImageTilingPosition;
  max_tiles?: number;
  columns?: number;
}

export interface CreateRollupBannerResponse {
  status?: string;
  message?: string;
  session_id?: string;
  request_id?: string;
  result_url?: string | null;
  thumbnail_url?: string | null;
  result_urls?: string[];
  creditsCharged?: number;
  remainingCredits?: number;
  [key: string]: unknown;
}

export interface EnhanceAndGenerateRollupBannerRequest extends CreateRollupBannerRequest {}

export interface EnhanceAndGenerateRollupBannerResponse extends CreateRollupBannerResponse {
  case_type?: string;
  rollup_session_id?: string;
  rollup_request_id?: string;
  input_image_urls?: string[];
}

export interface GlobalStatusResponse {
  session_id: string | null;
  request_id: string | null;
  status: string;
  type?: 'image' | 'video' | string;
  provider?: string | null;
  result_url?: string | null;
  thumbnail_url?: string | null;
  result_urls?: string[];
  videoLink?: string | null;
  remoteURL?: string | null;
  expressGenerationStatus?: unknown;
  expressGenerationError?: string | null;
  request_type?: string | null;
  case_type?: string | null;
  message?: string | null;
  [key: string]: unknown;
}

export interface CreditTopUpSummary {
  id?: string;
  amountPaidCents?: number;
  currency?: string;
  paymentType?: string;
  paymentStatus?: string;
  billingReason?: string;
  creditsApplied?: number;
  paymentDate?: string;
  stripeInvoiceId?: string;
  stripeInvoiceNumber?: string;
  invoicePdfUrl?: string;
  hostedInvoiceUrl?: string;
  receiptUrl?: string | null;
  receiptAvailable?: boolean;
  productSummary?: string;
  [key: string]: unknown;
}

export interface CreditsBalanceResponse {
  remainingCredits: number;
  lastTopUp?: CreditTopUpSummary | null;
  [key: string]: unknown;
}

export interface CreateLoginTokenResponse {
  loginToken: string;
  expiresInSeconds?: number;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface CreditsRechargeResponse {
  url: string;
  checkoutSessionId?: string | null;
  paymentIntentId?: string | null;
  paymentStatusEndpoint?: string;
  credits: number;
  amountUsd: number;
  amountCents: number;
  currency: string;
  [key: string]: unknown;
}

export interface EnableAutoRechargeRequest {
  thresholdCredits?: number;
  amountUsd?: number;
  maxMonthlyUsd?: number;
  requestSetupSession?: boolean;
  paymentMethodId?: string;
  enabled?: boolean;
  [key: string]: unknown;
}

export interface AutoRechargeRunSummary {
  status?: string;
  reason?: string;
  invoiceId?: string;
  hostedInvoiceUrl?: string;
  creditsToAdd?: number;
  maxMonthlyUsd?: number;
  monthlyTotalUsd?: number;
  [key: string]: unknown;
}

export interface EnableAutoRechargeResponse {
  autoRechargeEnabled?: boolean;
  autoRechargeAmountUsd?: number;
  autoRechargeThreshold?: number;
  autoRechargeMaxMonthlyUsd?: number;
  stripeCustomerId?: string;
  setupSessionUrl?: string | null;
  setupSessionId?: string | null;
  setupIntentId?: string | null;
  checkoutSessionId?: string | null;
  paymentStatusEndpoint?: string;
  url?: string | null;
  hasPaymentMethod?: boolean;
  autoRechargeRun?: AutoRechargeRunSummary | null;
  [key: string]: unknown;
}

export interface PaymentStatusRequest {
  checkoutSessionId?: string;
  paymentIntentId?: string;
  setupIntentId?: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'succeeded' | 'failed';
  mode?: 'payment' | 'setup' | string | null;
  checkoutSessionId?: string | null;
  sessionStatus?: string | null;
  paymentStatus?: string | null;
  paymentIntentId?: string | null;
  paymentIntentStatus?: string | null;
  setupIntentId?: string | null;
  setupIntentStatus?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  [key: string]: unknown;
}

export interface UpdateAutoRechargeThresholdRequest {
  thresholdCredits: number;
  [key: string]: unknown;
}

export interface UpdateAutoRechargeThresholdResponse {
  autoRechargeEnabled?: boolean;
  autoRechargeThreshold?: number;
  autoRechargeAmountUsd?: number;
  autoRechargeMaxMonthlyUsd?: number;
  [key: string]: unknown;
}

export interface SamsarErrorInit {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
  url: string;
  creditsCharged?: number;
  creditsRemaining?: number;
}

export class SamsarRequestError extends Error {
  status?: number;
  body?: unknown;
  headers: Record<string, string>;
  url: string;
  creditsCharged?: number;
  creditsRemaining?: number;

  constructor(message: string, init: SamsarErrorInit) {
    super(message);
    this.name = 'SamsarRequestError';
    this.status = init.status;
    this.body = init.body;
    this.headers = init.headers ?? {};
    this.url = init.url;
    this.creditsCharged = init.creditsCharged;
    this.creditsRemaining = init.creditsRemaining;
  }
}

export class SamsarClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: FetchLike;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: SamsarClientOptions) {
    if (!options?.apiKey) {
      throw new Error('apiKey is required to initialize SamsarClient');
    }

    this.apiKey = options.apiKey;
    this.baseUrl = trimTrailingSlash(options.baseUrl ?? DEFAULT_BASE_URL);
    this.timeoutMs = options.timeoutMs ?? 30000;
    this.fetchFn = options.fetch ?? (globalThis.fetch as FetchLike);
    this.defaultHeaders = options.defaultHeaders ?? {};

    if (typeof this.fetchFn !== 'function') {
      throw new Error(
        'A fetch implementation is required. Provide one via the "fetch" option when running outside environments with global fetch.',
      );
    }
  }

  /**
   * Create a new video generation job from text.
   */
  async createVideoFromText(
    input: CreateVideoFromTextInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<CreateVideoResponse>> {
    const body = {
      input,
      webhookUrl: options?.webhookUrl,
    };

    return this.post<CreateVideoResponse>('video/create', body, options);
  }

  /**
   * Create a video from a list of image URLs with optional prompt/metadata via the image_list_to_video route.
   */
  async createVideoFromImageList(
    input: CreateVideoFromImageListInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<CreateVideoFromImageListResponse>> {
    const body = {
      input,
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<CreateVideoFromImageListResponse>(
      'video/image_list_to_video',
      body,
      options,
    );

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof data.sessionID === 'string'
          ? data.sessionID
          : typeof data.session_id === 'string'
            ? data.session_id
            : typeof data.request_id === 'string'
              ? data.request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: CreateVideoFromImageListResponse = {
        ...(data as CreateVideoFromImageListResponse),
        sessionID: (data as CreateVideoFromImageListResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as CreateVideoFromImageListResponse).session_id ?? normalizedSessionId,
        request_id: (data as CreateVideoFromImageListResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Translate an existing video session into a new language.
   * Creates a new session_id and queues generation steps for lip sync + transcription + video render.
   */
  async translateVideo(
    input: TranslateVideoInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<TranslateVideoResponse>> {
    const raw = input as Record<string, unknown>;
    const videoSessionId =
      (raw.videoSessionId as string | undefined) ??
      (raw.video_session_id as string | undefined) ??
      (raw.videoSessionID as string | undefined) ??
      (raw.session_id as string | undefined) ??
      (raw.sessionId as string | undefined) ??
      (raw.sessionID as string | undefined) ??
      (raw.request_id as string | undefined) ??
      (raw.requestId as string | undefined);
    const language =
      (raw.language as string | undefined) ??
      (raw.language_code as string | undefined) ??
      (raw.languageCode as string | undefined) ??
      (raw.langauge as string | undefined) ??
      (raw.langauge_code as string | undefined) ??
      (raw.langaugeCode as string | undefined) ??
      (raw.languageString as string | undefined);

    if (!videoSessionId) {
      throw new Error('videoSessionId is required for translateVideo');
    }
    if (!language) {
      throw new Error('language is required for translateVideo');
    }

    const body = {
      input: {
        ...input,
        videoSessionId: String(videoSessionId),
        language: String(language),
      },
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<TranslateVideoResponse>('video/translate_video', body, options);

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof (data as any).sessionID === 'string'
          ? (data as any).sessionID
          : typeof (data as any).session_id === 'string'
            ? (data as any).session_id
            : typeof (data as any).request_id === 'string'
              ? (data as any).request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: TranslateVideoResponse = {
        ...(data as TranslateVideoResponse),
        sessionID: (data as TranslateVideoResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as TranslateVideoResponse).session_id ?? normalizedSessionId,
        request_id: (data as TranslateVideoResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Join multiple existing video sessions into a single session by appending their timelines.
   * Creates a new session_id and queues transcription + frame + video generation.
   */
  async joinVideos(
    input: JoinVideosInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<JoinVideosResponse>> {
    const raw = input as Record<string, unknown>;
    const rawSessionIds =
      (raw.session_ids as unknown) ??
      (raw.sessionIds as unknown) ??
      (raw.video_session_ids as unknown) ??
      (raw.videoSessionIds as unknown);
    const rawBlendScenes =
      (raw.blend_scenes as unknown) ??
      (raw.blendScenes as unknown);

    if (!Array.isArray(rawSessionIds) || rawSessionIds.length < 2) {
      throw new Error('session_ids must be an array of at least 2 session ids for joinVideos');
    }

    const normalizedSessionIds = rawSessionIds
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter(Boolean);

    if (normalizedSessionIds.length < 2) {
      throw new Error('session_ids must contain at least 2 non-empty strings for joinVideos');
    }

    if (rawBlendScenes !== undefined && typeof rawBlendScenes !== 'boolean') {
      throw new Error('blend_scenes must be a boolean for joinVideos');
    }

    const blendScenes = rawBlendScenes === true;

    const body = {
      input: {
        ...input,
        session_ids: normalizedSessionIds,
        ...(rawBlendScenes !== undefined ? { blend_scenes: blendScenes } : {}),
      },
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<JoinVideosResponse>('video/join_videos', body, options);

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof (data as any).sessionID === 'string'
          ? (data as any).sessionID
          : typeof (data as any).session_id === 'string'
            ? (data as any).session_id
            : typeof (data as any).request_id === 'string'
              ? (data as any).request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: JoinVideosResponse = {
        ...(data as JoinVideosResponse),
        sessionID: (data as JoinVideosResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as JoinVideosResponse).session_id ?? normalizedSessionId,
        request_id: (data as JoinVideosResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Remove subtitle/transcript text overlays by cloning an existing session and re-running
   * only frame + video generation on the new session.
   */
  async removeSubtitles(
    input: RemoveSubtitlesInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<RemoveSubtitlesResponse>> {
    const raw = input as Record<string, unknown>;
    const videoSessionId =
      (raw.videoSessionId as string | undefined) ??
      (raw.video_session_id as string | undefined) ??
      (raw.videoSessionID as string | undefined) ??
      (raw.session_id as string | undefined) ??
      (raw.sessionId as string | undefined) ??
      (raw.sessionID as string | undefined) ??
      (raw.request_id as string | undefined) ??
      (raw.requestId as string | undefined);

    if (!videoSessionId) {
      throw new Error('videoSessionId is required for removeSubtitles');
    }

    const body = {
      input: {
        ...input,
        videoSessionId: String(videoSessionId),
      },
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<RemoveSubtitlesResponse>('video/remove_subtitles', body, options);

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof (data as any).sessionID === 'string'
          ? (data as any).sessionID
          : typeof (data as any).session_id === 'string'
            ? (data as any).session_id
            : typeof (data as any).request_id === 'string'
              ? (data as any).request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: RemoveSubtitlesResponse = {
        ...(data as RemoveSubtitlesResponse),
        sessionID: (data as RemoveSubtitlesResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as RemoveSubtitlesResponse).session_id ?? normalizedSessionId,
        request_id: (data as RemoveSubtitlesResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Cancel an in-progress render for an existing video session.
   */
  async cancelRender(
    input: CancelRenderInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CancelRenderResponse>> {
    const raw = input as Record<string, unknown>;
    const videoSessionId =
      (raw.videoSessionId as string | undefined) ??
      (raw.video_session_id as string | undefined) ??
      (raw.videoSessionID as string | undefined) ??
      (raw.session_id as string | undefined) ??
      (raw.sessionId as string | undefined) ??
      (raw.sessionID as string | undefined) ??
      (raw.request_id as string | undefined) ??
      (raw.requestId as string | undefined);

    if (!videoSessionId) {
      throw new Error('videoSessionId is required for cancelRender');
    }

    const body = {
      input: {
        ...input,
        videoSessionId: String(videoSessionId),
      },
    };

    const response = await this.post<CancelRenderResponse>('video/cancel_render', body, options);

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof (data as any).sessionID === 'string'
          ? (data as any).sessionID
          : typeof (data as any).session_id === 'string'
            ? (data as any).session_id
            : typeof (data as any).request_id === 'string'
              ? (data as any).request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: CancelRenderResponse = {
        ...(data as CancelRenderResponse),
        sessionID: (data as CancelRenderResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as CancelRenderResponse).session_id ?? normalizedSessionId,
        request_id: (data as CancelRenderResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Update the outro image for an existing video session by cloning it into a new session and re-running
   * only the final video render step.
   */
  async updateVideoOutroImage(
    input: UpdateVideoOutroImageInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<UpdateVideoOutroImageResponse>> {
    const raw = input as Record<string, unknown>;
    const videoSessionId =
      (raw.videoSessionId as string | undefined) ??
      (raw.video_session_id as string | undefined) ??
      (raw.videoSessionID as string | undefined) ??
      (raw.session_id as string | undefined) ??
      (raw.sessionId as string | undefined) ??
      (raw.sessionID as string | undefined) ??
      (raw.request_id as string | undefined) ??
      (raw.requestId as string | undefined);
    const outroImageUrl =
      (raw.outro_image_url as string | undefined) ??
      (raw.outroImageUrl as string | undefined) ??
      (raw.new_outro_image_url as string | undefined) ??
      (raw.newOutroImageUrl as string | undefined);

    if (!videoSessionId) {
      throw new Error('videoSessionId is required for updateVideoOutroImage');
    }
    if (!outroImageUrl) {
      throw new Error('outro_image_url is required for updateVideoOutroImage');
    }

    const body = {
      input: {
        ...input,
        videoSessionId: String(videoSessionId),
        outro_image_url: String(outroImageUrl),
      },
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<UpdateVideoOutroImageResponse>(
      'video/update_outro_image',
      body,
      options,
    );

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof (data as any).sessionID === 'string'
          ? (data as any).sessionID
          : typeof (data as any).session_id === 'string'
            ? (data as any).session_id
            : typeof (data as any).request_id === 'string'
              ? (data as any).request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: UpdateVideoOutroImageResponse = {
        ...(data as UpdateVideoOutroImageResponse),
        sessionID: (data as UpdateVideoOutroImageResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as UpdateVideoOutroImageResponse).session_id ?? normalizedSessionId,
        request_id: (data as UpdateVideoOutroImageResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Add or replace the outro image for an existing video session by cloning it into a new session and
   * re-running frame/video generation.
   */
  async addVideoOutroImage(
    input: AddVideoOutroImageInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<AddVideoOutroImageResponse>> {
    const raw = input as Record<string, unknown>;
    const videoSessionId =
      (raw.videoSessionId as string | undefined) ??
      (raw.video_session_id as string | undefined) ??
      (raw.videoSessionID as string | undefined) ??
      (raw.session_id as string | undefined) ??
      (raw.sessionId as string | undefined) ??
      (raw.sessionID as string | undefined) ??
      (raw.request_id as string | undefined) ??
      (raw.requestId as string | undefined);
    const outroImageUrl =
      (raw.outro_image_url as string | undefined) ??
      (raw.outroImageUrl as string | undefined) ??
      (raw.new_outro_image_url as string | undefined) ??
      (raw.newOutroImageUrl as string | undefined);
    const rawAddOutroAnimation =
      (raw.add_outro_animation as unknown) ??
      (raw.addOutroAnimation as unknown);
    const rawAddOutroFocusArea =
      (raw.add_outro_focus_area as unknown) ??
      (raw.addOutroFocusArea as unknown);
    const rawOutroFocusArea =
      (raw.outro_focust_area as unknown) ??
      (raw.outro_focus_area as unknown) ??
      (raw.outroFocustArea as unknown) ??
      (raw.outroFocusArea as unknown);

    if (!videoSessionId) {
      throw new Error('videoSessionId is required for addVideoOutroImage');
    }
    if (!outroImageUrl) {
      throw new Error('outro_image_url is required for addVideoOutroImage');
    }
    if (rawAddOutroAnimation !== undefined && typeof rawAddOutroAnimation !== 'boolean') {
      throw new Error('add_outro_animation must be a boolean for addVideoOutroImage');
    }
    if (rawAddOutroFocusArea !== undefined && typeof rawAddOutroFocusArea !== 'boolean') {
      throw new Error('add_outro_focus_area must be a boolean for addVideoOutroImage');
    }
    if (rawAddOutroFocusArea === true && rawAddOutroAnimation !== true) {
      throw new Error('add_outro_focus_area requires add_outro_animation to be true for addVideoOutroImage');
    }
    if (rawAddOutroFocusArea === true) {
      if (!rawOutroFocusArea || typeof rawOutroFocusArea !== 'object' || Array.isArray(rawOutroFocusArea)) {
        throw new Error('outro_focust_area must be an object with x, y, width, height for addVideoOutroImage');
      }
      const { x, y, width, height } = rawOutroFocusArea as Record<string, unknown>;
      const isInvalid = [x, y, width, height].some((value) => typeof value !== 'number' || !Number.isFinite(value));
      if (isInvalid) {
        throw new Error('outro_focust_area x, y, width, height must be valid numbers for addVideoOutroImage');
      }
    }

    const body = {
      input: {
        ...input,
        videoSessionId: String(videoSessionId),
        outro_image_url: String(outroImageUrl),
        ...(rawAddOutroAnimation !== undefined ? { add_outro_animation: rawAddOutroAnimation === true } : {}),
        ...(rawAddOutroFocusArea !== undefined ? { add_outro_focus_area: rawAddOutroFocusArea === true } : {}),
        ...(rawOutroFocusArea !== undefined ? { outro_focust_area: rawOutroFocusArea } : {}),
      },
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<AddVideoOutroImageResponse>(
      'video/add_outro_image',
      body,
      options,
    );

    const data = response.data as Record<string, unknown> | null;
    if (data && typeof data === 'object') {
      const sessionId =
        typeof (data as any).sessionID === 'string'
          ? (data as any).sessionID
          : typeof (data as any).session_id === 'string'
            ? (data as any).session_id
            : typeof (data as any).request_id === 'string'
              ? (data as any).request_id
              : undefined;
      const normalizedSessionId = sessionId ? String(sessionId) : undefined;

      const normalizedData: AddVideoOutroImageResponse = {
        ...(data as AddVideoOutroImageResponse),
        sessionID: (data as AddVideoOutroImageResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as AddVideoOutroImageResponse).session_id ?? normalizedSessionId,
        request_id: (data as AddVideoOutroImageResponse).request_id ?? normalizedSessionId,
      };

      return { ...response, data: normalizedData };
    }

    return response;
  }

  /**
   * Fetch the latest available render URL for a given video session id.
   * Maps to GET /video/fetch_latest_version?session_id={sessionId}.
   */
  async fetchLatestVideoVersion(
    sessionId: string,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<FetchLatestVideoVersionResponse>> {
    if (!sessionId) {
      throw new Error('sessionId is required for fetchLatestVideoVersion');
    }

    const query: QueryParams = {
      session_id: sessionId,
      ...(options?.query ?? {}),
    };

    return this.get<FetchLatestVideoVersionResponse>('video/fetch_latest_version', {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * List completed video sessions for the authenticated API key.
   * Maps to GET /video/list_completed_video_sessions.
   */
  async listCompletedVideoSessions(
    options?: SamsarRequestOptions & { limit?: number },
  ): Promise<SamsarResult<ListCompletedVideoSessionsResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };
    if (options?.limit !== undefined) {
      query.limit = options.limit;
    }

    const response = await this.get<ListCompletedVideoSessionsResponse>('video/list_completed_video_sessions', {
      ...(options ?? {}),
      query,
    });

    if (!Array.isArray(response.data)) {
      return response;
    }

    const normalizedData: ListCompletedVideoSessionsResponse = response.data
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }

        const rawItem = item as Record<string, unknown>;
        const sessionId =
          typeof rawItem.session_id === 'string'
            ? rawItem.session_id.trim()
            : typeof rawItem.sessionID === 'string'
              ? rawItem.sessionID.trim()
              : '';
        const resultUrl =
          typeof rawItem.result_url === 'string'
            ? rawItem.result_url.trim()
            : typeof rawItem.resultUrl === 'string'
              ? rawItem.resultUrl.trim()
              : '';
        const language =
          typeof rawItem.langauge === 'string' && rawItem.langauge.trim()
            ? rawItem.langauge.trim().toLowerCase()
            : typeof rawItem.language === 'string' && rawItem.language.trim()
              ? rawItem.language.trim().toLowerCase()
              : 'en';

        if (!sessionId || !resultUrl) {
          return null;
        }

        const normalizedItem: CompletedVideoSession = {
          ...(rawItem as CompletedVideoSession),
          session_id: sessionId,
          langauge: language,
          language,
          result_url: resultUrl,
        };

        return normalizedItem;
      })
      .filter((item): item is CompletedVideoSession => Boolean(item));

    return {
      ...response,
      data: normalizedData,
    };
  }

  /**
   * Fetch the supported image/video model keys for the text_to_video route.
   * Maps to GET /video/supported_models.
   */
  async getSupportedTextToVideoModels(
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SupportedTextToVideoModelsResponse>> {
    return this.get<SupportedTextToVideoModelsResponse>('video/supported_models', options);
  }

  /**
   * Enhance or rewrite text using the chat enhancement endpoint.
   * Optionally pass `language` (code or name) to enforce the output language.
   */
  async enhanceMessage(
    payload: EnhanceMessageRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<EnhanceMessageResponse>> {
    return this.post<EnhanceMessageResponse>('chat/enhance', payload, options);
  }

  /**
   * Create a new embedding template and store embeddings for a JSON array.
   */
  async createEmbedding(
    payload: CreateEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateEmbeddingResponse>> {
    return this.post<CreateEmbeddingResponse>('chat/create_embedding', payload, options);
  }

  /**
   * Update an existing embedding template with additional records.
   */
  async updateEmbedding(
    payload: UpdateEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<UpdateEmbeddingResponse>> {
    return this.post<UpdateEmbeddingResponse>('chat/update_embedding', payload, options);
  }

  /**
   * Delete all embeddings for a template.
   */
  async deleteEmbeddings(
    payload: DeleteEmbeddingsRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<DeleteEmbeddingsResponse>> {
    return this.post<DeleteEmbeddingsResponse>('chat/delete_embeddings', payload, options);
  }

  /**
   * Delete one or more embeddings from a template by record id.
   */
  async deleteEmbedding(
    payload: DeleteEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<DeleteEmbeddingResponse>> {
    return this.post<DeleteEmbeddingResponse>('chat/delete_embedding', payload, options);
  }

  /**
   * Search against an embedding template using a natural language query.
   */
  async searchAgainstEmbedding(
    payload: SearchAgainstEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SearchAgainstEmbeddingResponse>> {
    return this.post<SearchAgainstEmbeddingResponse>('chat/search_against_embedding', payload, options);
  }

  /**
   * Search against an embedding template using the pluralized endpoint.
   */
  async searchAgainstEmbeddings(
    payload: SearchAgainstEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SearchAgainstEmbeddingResponse>> {
    return this.post<SearchAgainstEmbeddingResponse>('chat/search_against_embeddings', payload, options);
  }

  /**
   * Find similar records to a query within an embedding template.
   */
  async similarToEmbedding(
    payload: SimilarToEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SimilarToEmbeddingResponse>> {
    return this.post<SimilarToEmbeddingResponse>('chat/similar_to_embedding', payload, options);
  }

  /**
   * List all embedding templates for the API key.
   */
  async listEmbeddingTemplates(
    options?: SamsarRequestOptions & { limit?: number; offset?: number },
  ): Promise<SamsarResult<ListEmbeddingTemplatesResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };
    if (options?.limit !== undefined) {
      query.limit = options.limit;
    }
    if (options?.offset !== undefined) {
      query.offset = options.offset;
    }
    return this.get<ListEmbeddingTemplatesResponse>('chat/embedding_templates', {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * Check whether embeddings exist for a template id.
   */
  async getEmbeddingStatus(
    templateId: string,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<EmbeddingStatusResponse>> {
    if (!templateId) {
      throw new Error('templateId is required');
    }
    const query: QueryParams = {
      ...(options?.query ?? {}),
      template_id: templateId,
    };
    return this.get<EmbeddingStatusResponse>('chat/embedding_status', {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * Remove branding/watermark from an image by URL.
   */
  async removeBrandingFromImage(
    payload: RemoveBrandingFromImageRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<RemoveBrandingFromImageResponse>> {
    return this.post<RemoveBrandingFromImageResponse>('image/remove_branding', payload, options);
  }

  /**
   * Replace branding/watermark on an image by providing the original and replacement image URLs.
   */
  async replaceBrandingFromImage(
    payload: ReplaceBrandingFromImageRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ReplaceBrandingFromImageResponse>> {
    return this.post<ReplaceBrandingFromImageResponse>('image/replace_branding', payload, options);
  }

  /**
   * Enhance an image by upscaling it with the specified resolution.
   */
  async enhanceImage(
    payload: EnhanceImageRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<EnhanceImageResponse>> {
    return this.post<EnhanceImageResponse>('image/enhance', payload, options);
  }

  /**
   * Add or extend a saved image list for the authenticated API key.
   */
  async extendImageList(
    payload: ExtendImageListRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExtendImageListResponse>> {
    return this.post<ExtendImageListResponse>('image/add_image_set', payload, options);
  }

  /**
   * Create and save a reusable receipt extraction template from a sample receipt image.
   * This endpoint is free and does not deduct credits.
   */
  async createReceiptTemplate(
    payload: CreateReceiptTemplateRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateReceiptTemplateResponse>> {
    return this.post<CreateReceiptTemplateResponse>('image/receipt_templates/create', payload, options);
  }

  /**
   * Extract standardized receipt JSON by validating a receipt image against a saved template.
   * This endpoint charges 50 credits per request.
   */
  async queryReceiptTemplate(
    payload: QueryReceiptTemplateRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<QueryReceiptTemplateResponse>> {
    return this.post<QueryReceiptTemplateResponse>('image/receipt_templates/query', payload, options);
  }

  /**
   * Create a roll-up banner from preprocessed (already enhanced) images.
   */
  async createRollupBanner(
    payload: CreateRollupBannerRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateRollupBannerResponse>> {
    return this.post<CreateRollupBannerResponse>('image/create_rollup_banner', payload, options);
  }

  /**
   * Enhance low-resolution images (if needed) and generate a roll-up banner.
   */
  async enhanceAndGenerateRollupBanner(
    payload: EnhanceAndGenerateRollupBannerRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<EnhanceAndGenerateRollupBannerResponse>> {
    return this.post<EnhanceAndGenerateRollupBannerResponse>(
      'image/enhance_and_generate_rollup_banner',
      payload,
      options,
    );
  }

  /**
   * Fetch the remaining credits and last credit top-up for the API key.
   */
  async getCreditsBalance(
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreditsBalanceResponse>> {
    return this.get<CreditsBalanceResponse>('credits', options);
  }

  /**
   * Create a short-lived login token that can be exchanged for an auth token in the client app.
   */
  async createLoginToken(
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateLoginTokenResponse>> {
    return this.post<CreateLoginTokenResponse>('create_login_token', {}, options);
  }

  /**
   * Create a Stripe checkout link to recharge a specific number of credits.
   * Business rule: 1 USD = 100 credits.
   */
  async createCreditsRecharge(
    credits: number,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreditsRechargeResponse>> {
    if (!Number.isFinite(credits) || credits <= 0) {
      throw new Error('credits must be a positive number');
    }

    const payload = {
      credits: Math.round(credits),
    };

    return this.post<CreditsRechargeResponse>('credits/recharge', payload, options);
  }

  /**
   * Enable or update auto-recharge settings for the API key.
   * Returns a Stripe setup URL when a payment method is required.
   */
  async enableAutoRecharge(
    payload: EnableAutoRechargeRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<EnableAutoRechargeResponse>> {
    return this.post<EnableAutoRechargeResponse>('enable_autorecharge', payload, options);
  }

  /**
   * Update the auto-recharge threshold for an enabled account.
   */
  async updateAutoRechargeThreshold(
    payload: UpdateAutoRechargeThresholdRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<UpdateAutoRechargeThresholdResponse>> {
    return this.post<UpdateAutoRechargeThresholdResponse>('auto_recharge/threshold', payload, options);
  }

  /**
   * Poll for checkout/payment/setup status using IDs returned by credit recharge or auto-recharge setup.
   */
  async getPaymentStatus(
    payload: PaymentStatusRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<PaymentStatusResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };
    if (payload?.checkoutSessionId) {
      query.checkoutSessionId = payload.checkoutSessionId;
    }
    if (payload?.paymentIntentId) {
      query.paymentIntentId = payload.paymentIntentId;
    }
    if (payload?.setupIntentId) {
      query.setupIntentId = payload.setupIntentId;
    }
    return this.get<PaymentStatusResponse>('payment_status', {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * Retrieve the status of an asynchronous request by request_id.
   * Defaults to GET /status?request_id={requestId}, but the path can be overridden.
   * Normalizes the response to expose status/result_url for both image and video flows.
   */
  async getStatus(
    requestId: string,
    options?: SamsarRequestOptions & { path?: string; queryParams?: QueryParams },
  ): Promise<SamsarResult<GlobalStatusResponse>> {
    if (!requestId) {
      throw new Error('requestId is required for getStatus');
    }

    const path = options?.path ?? 'status';
    const query: QueryParams = {
      request_id: requestId,
      session_id: requestId,
      ...(options?.queryParams ?? {}),
      ...(options?.query ?? {}),
    };

    const response = await this.get<GlobalStatusResponse>(path, { ...options, query });
    const data = response.data as Record<string, unknown> | null;

    if (!data || typeof data !== 'object') {
      return response;
    }

    const resultUrls = Array.isArray((data as any).result_urls)
      ? (data as any).result_urls
          .map((url: unknown) => (typeof url === 'string' ? url.trim() : ''))
          .filter(Boolean)
      : [];

    const normalizedResultUrl =
      (typeof (data as any).result_url === 'string' && (data as any).result_url) ||
      resultUrls[0] ||
      (typeof (data as any).remoteURL === 'string' && (data as any).remoteURL) ||
      (typeof (data as any).videoLink === 'string' && (data as any).videoLink) ||
      null;

    const rawSessionId = (data as any).session_id ?? (data as any).sessionID;
    const rawRequestId = (data as any).request_id ?? (data as any).global_status_id;
    const normalizedSessionId = rawSessionId ? String(rawSessionId) : String(requestId);
    const normalizedRequestId = rawRequestId ? String(rawRequestId) : normalizedSessionId;

    const normalizedData: GlobalStatusResponse = {
      ...(data as GlobalStatusResponse),
      request_id: normalizedRequestId,
      session_id: normalizedSessionId,
      result_url: normalizedResultUrl,
      result_urls: resultUrls.length ? resultUrls : (data as any).result_urls,
      status: (data as any).status || 'PENDING',
    };

    return { ...response, data: normalizedData };
  }

  /**
   * Retrieve the status of an image request (maps to GET /image/status).
   */
  async getImageStatus(
    requestId: string,
    options?: SamsarRequestOptions & { queryParams?: QueryParams },
  ): Promise<SamsarResult<GlobalStatusResponse>> {
    return this.getStatus(requestId, { ...options, path: 'image/status' });
  }

  private async get<T>(path: string, options?: SamsarRequestOptions): Promise<SamsarResult<T>> {
    return this.request<T>(path, { ...(options ?? {}), method: 'GET' });
  }

  private async post<T>(
    path: string,
    body: unknown,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<T>> {
    return this.request<T>(path, {
      ...(options ?? {}),
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async request<T>(
    path: string,
    options: SamsarRequestOptions & { method: string; body?: BodyInit | null },
  ): Promise<SamsarResult<T>> {
    const url = this.buildUrl(path, options.query);
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (options.signal) {
      if (options.signal.aborted) {
        throw new SamsarRequestError('Request aborted before start', {
          url,
          headers: {},
        });
      }

      options.signal.addEventListener(
        'abort',
        () => controller.abort(options.signal?.reason ?? new Error('Aborted')),
        { once: true },
      );
    }

    if (this.timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(new Error('Request timed out')), this.timeoutMs);
    }

    const headers = this.buildHeaders(options);
    let response: Response;

    if (DEBUG) {
      console.info('[SamsarClient] Request', {
        url,
        method: options.method,
        hasBody: Boolean(options.body),
        query: options.query,
      });
    }

    try {
      response = await this.fetchFn(url, {
        method: options.method,
        body: options.body,
        headers,
        signal: controller.signal,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown fetch error';
      throw new SamsarRequestError(`Request failed: ${message}`, {
        url,
        headers: {},
      });
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    const responseText = await response.text();
    const parsedBody = responseText ? parseMaybeJson(responseText) : null;
    const headerRecord = headersToObject(response.headers);
    const creditsCharged = parseNumber(headerRecord['x-credits-charged']);
    const creditsRemaining = parseNumber(headerRecord['x-credits-remaining']);

    if (!response.ok) {
      if (DEBUG) {
        console.error('[SamsarClient] Request failed', {
          url,
          status: response.status,
          body: parsedBody,
        });
      }
      throw new SamsarRequestError(
        `Request to ${url} failed with status ${response.status}`,
        {
          status: response.status,
          body: parsedBody,
          headers: headerRecord,
          url,
          creditsCharged,
          creditsRemaining,
        },
      );
    }

    return {
      data: parsedBody as T,
      status: response.status,
      headers: headerRecord,
      creditsCharged,
      creditsRemaining,
      raw: response,
    };
  }

  private buildHeaders(options: SamsarRequestOptions & { method: string; body?: BodyInit | null }) {
    const headers: Record<string, string | undefined> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': options.body ? 'application/json' : undefined,
      ...this.defaultHeaders,
      ...(options.headers ?? {}),
    };

    if (options.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    return removeEmptyHeaders(headers);
  }

  private buildUrl(path: string, query?: QueryParams): string {
    const cleanedPath = path.replace(/^\/+/, '');
    const base = path.startsWith('http') ? path : `${this.baseUrl}/${cleanedPath}`;
    const url = new URL(base);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function parseMaybeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function headersToObject(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

function parseNumber(value?: string): number | undefined {
  const num = value !== undefined ? Number(value) : NaN;
  return Number.isFinite(num) ? num : undefined;
}

function removeEmptyHeaders(headers: Record<string, string | undefined | null>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined || value === null) continue;
    normalized[key] = value;
  }
  return normalized;
}

export default SamsarClient;
