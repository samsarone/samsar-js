const DEFAULT_BASE_URL = 'https://api.samsar.one/v1';
const DEBUG = (() => {
  const env = (globalThis as any)?.process?.env;
  return env?.SAMSAR_SDK_DEBUG === '1';
})();

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

export interface SamsarClientOptions {
  apiKey?: string;
  appKey?: string;
  appSecret?: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: FetchLike;
  defaultHeaders?: Record<string, string>;
  externalUserApiKey?: string;
}

export interface SamsarRequestOptions {
  idempotencyKey?: string;
  headers?: Record<string, string>;
  externalUserApiKey?: string;
  appKey?: string;
  appSecret?: string;
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
  add_subtitles?: boolean;
  addSubtitles?: boolean;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  outro_image_url?: string;
  outroImageUrl?: string;
  add_outro_animation?: boolean;
  addOutroAnimation?: boolean;
  add_outro_focus_area?: boolean;
  addOutroFocusArea?: boolean;
  outro_focust_area?: OutroFocusArea | null;
  outro_focus_area?: OutroFocusArea | null;
  outroFocustArea?: OutroFocusArea | null;
  outroFocusArea?: OutroFocusArea | null;
  generate_outro_image?: boolean;
  generateOutroImage?: boolean;
  cta_url?: string;
  ctaUrl?: string;
  cta_text_top?: string;
  ctaTextTop?: string;
  cta_text_bottom?: string;
  ctaTextBottom?: string;
  cta_logo?: string;
  ctaLogo?: string;
  add_footer_animation?: boolean;
  addFooterAnimation?: boolean;
  footer_metadata?: FooterMetadataItem[];
  footerMetadata?: FooterMetadataItem[];
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

export interface FooterMetadataItem {
  url: string;
  title?: string;
}

export type ImageListToVideoAspectRatio = '16:9' | '9:16';

export type ImageListToVideoModel =
  | 'VEO3.1I2V'
  | 'SEEDANCEI2V'
  | 'KLING3.0'
  | 'KLINGIMGTOVID3PRO'
  | 'RUNWAYML';

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
  source?: string;
  title?: string;
  image_title?: string;
  imageTitle?: string;
  image_text?: string;
  imageText?: string;
  activity_title?: string;
  activityTitle?: string;
  name?: string;
  label?: string;
  [key: string]: unknown;
}

export interface CreateVideoFromImageListInput {
  image_urls: Array<string | ImageListToVideoItem>;
  metadata?: Record<string, unknown>;
  prompt?: string;
  video_model?: ImageListToVideoModel;
  aspect_ratio?: ImageListToVideoAspectRatio;
  aspectRatio?: ImageListToVideoAspectRatio;
  language?: string;
  languageString?: string | null;
  font_key?: string;
  fontKey?: string;
  subtitle_font?: string;
  subtitleFont?: string;
  font?: FontOptions;
  enable_subtitles?: boolean;
  enableSubtitles?: boolean;
  add_subtitles?: boolean;
  addSubtitles?: boolean;
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  outro_image_url?: string;
  outroImageUrl?: string;
  add_outro_animation?: boolean;
  addOutroAnimation?: boolean;
  add_outro_focus_area?: boolean;
  addOutroFocusArea?: boolean;
  outro_focust_area?: OutroFocusArea | null;
  outro_focus_area?: OutroFocusArea | null;
  outroFocustArea?: OutroFocusArea | null;
  outroFocusArea?: OutroFocusArea | null;
  generate_outro_image?: boolean;
  generateOutroImage?: boolean;
  cta_url?: string;
  ctaUrl?: string;
  cta_text_top?: string;
  ctaTextTop?: string;
  cta_text_bottom?: string;
  ctaTextBottom?: string;
  cta_logo?: string;
  ctaLogo?: string;
  add_footer_animation?: boolean;
  addFooterAnimation?: boolean;
  footer_metadata?: FooterMetadataItem[];
  footerMetadata?: FooterMetadataItem[];
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
  source_request_id?: string;
  sourceRequestId?: string;
  external_request_id?: string;
  externalRequestId?: string;
  external_session_id?: string;
  externalSessionId?: string;
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
  generate_outro_image?: boolean;
  generateOutroImage?: boolean;
  cta_url?: string;
  ctaUrl?: string;
  cta_text_top?: string;
  ctaTextTop?: string;
  cta_text_bottom?: string;
  ctaTextBottom?: string;
  cta_logo?: string;
  ctaLogo?: string;
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
  source_request_id?: string;
  sourceRequestId?: string;
  external_request_id?: string;
  externalRequestId?: string;
  external_session_id?: string;
  externalSessionId?: string;
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

export interface AddSubtitlesInput extends RemoveSubtitlesInput {}

export interface AddSubtitlesResponse extends RemoveSubtitlesResponse {}

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
  has_subtitles?: boolean | null;
  result_language?: string | null;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export interface CompletedVideoSession {
  session_id: string;
  langauge: string;
  language?: string;
  result_language?: string;
  has_subtitles?: boolean | null;
  result_url: string;
  [key: string]: unknown;
}

export type ListCompletedVideoSessionsResponse = CompletedVideoSession[];

export interface SessionPublicationInput {
  session_id?: string;
  sessionId?: string;
  sessionID?: string;
  video_session_id?: string;
  videoSessionId?: string;
  videoSessionID?: string;
  id?: string;
  title?: string;
  description?: string;
  tags?: string[] | string;
  aspect_ratio?: string;
  aspectRatio?: string;
  creator_handle?: string;
  creatorHandle?: string;
  slug?: string;
  image_hash?: string;
  imageHash?: string;
  splash_image?: string;
  splashImage?: string;
  image_model?: string;
  imageModel?: string;
  video_model?: string;
  videoModel?: string;
  original_prompt?: string;
  originalPrompt?: string;
  prompt?: string;
  session_language?: string;
  sessionLanguage?: string;
  language?: string;
  language_code?: string;
  languageString?: string;
  language_string?: string;
  [key: string]: unknown;
}

export interface SessionPublicationSummary {
  id?: string | null;
  publication_id?: string | null;
  session_id?: string | null;
  sessionId?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
  title?: string | null;
  description?: string;
  tags?: string[];
  creator_handle?: string;
  creatorHandle?: string;
  slug?: string | null;
  image_hash?: string | null;
  imageHash?: string | null;
  splash_image?: string | null;
  splashImage?: string | null;
  image_model?: string | null;
  imageModel?: string | null;
  video_model?: string | null;
  videoModel?: string | null;
  original_prompt?: string;
  originalPrompt?: string;
  session_language?: string | null;
  sessionLanguage?: string | null;
  language_string?: string | null;
  languageString?: string | null;
  aspect_ratio?: string | null;
  aspectRatio?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface SessionPublicationSessionSummary {
  id?: string | null;
  session_id?: string | null;
  is_published?: boolean;
  published_publication_id?: string | null;
  published_video_url?: string | null;
  published_at?: string | null;
  [key: string]: unknown;
}

export interface SessionPublicationResponse {
  created?: boolean;
  revoked?: boolean;
  publication_id?: string | null;
  publication?: SessionPublicationSummary | null;
  session?: SessionPublicationSessionSummary | null;
  sessionId?: string;
  session_id?: string;
  ispublishedVideo?: boolean;
  [key: string]: unknown;
}

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
  maxwords?: number | string;
  maxWords?: number | string;
}

export interface EnhanceMessageResponse {
  content: string;
  [key: string]: unknown;
}

export type AssistantInputContentItem =
  | {
      type: 'input_text' | 'text';
      text: string;
      [key: string]: unknown;
    }
  | {
      type: 'input_image' | 'image_url' | 'image';
      image_url?: string;
      url?: string;
      [key: string]: unknown;
    }
  | Record<string, unknown>;

export interface AssistantInputMessage {
  role: 'user' | 'assistant' | 'developer' | 'system';
  content: string | AssistantInputContentItem[];
  [key: string]: unknown;
}

export interface AssistantReasoningConfig {
  effort?: 'low' | 'medium' | 'high' | string;
  [key: string]: unknown;
}

export interface AssistantImageGenerationTool {
  type: 'image_generation';
  size?: string;
  quality?: 'auto' | 'low' | 'medium' | 'high' | string;
  format?: 'png' | 'jpeg' | 'webp' | string;
  background?: 'auto' | 'transparent' | 'opaque' | string;
  compression?: number;
  partial_images?: number;
  action?: 'auto' | 'generate' | 'edit' | string;
  [key: string]: unknown;
}

export type AssistantToolDefinition = AssistantImageGenerationTool | Record<string, unknown>;

export type AssistantToolChoice =
  | 'auto'
  | 'none'
  | 'required'
  | {
      type?: string;
      [key: string]: unknown;
    }
  | Record<string, unknown>;

export interface AssistantSetSystemPromptRequest {
  system_prompt?: string | null;
  systemPrompt?: string | null;
  prompt?: string | null;
  value?: string | null;
}

export interface AssistantSetSystemPromptResponse {
  system_prompt: string | null;
  model?: string;
  selected_assistant_model?: string;
  [key: string]: unknown;
}

export interface AssistantCompletionRequest {
  session_id?: string;
  sessionId?: string;
  id?: string;
  previous_response_id?: string;
  previousResponseId?: string;
  input?: string | AssistantInputMessage | AssistantInputMessage[] | AssistantInputContentItem[];
  message?: string | AssistantInputMessage | AssistantInputMessage[] | AssistantInputContentItem[];
  messages?: AssistantInputMessage[];
  max_output_tokens?: number;
  maxOutputTokens?: number;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  metadata?: Record<string, unknown>;
  user?: string;
  text?: Record<string, unknown>;
  tools?: AssistantToolDefinition[];
  tool_choice?: AssistantToolChoice;
  parallel_tool_calls?: boolean;
  reasoning?: AssistantReasoningConfig;
  reasoning_effort?: 'low' | 'medium' | 'high' | string;
  [key: string]: unknown;
}

export interface AssistantResponseContentItem {
  type?: string;
  text?: string;
  annotations?: unknown[];
  [key: string]: unknown;
}

export interface AssistantResponseOutputItem {
  id?: string;
  type?: string;
  role?: string;
  content?: AssistantResponseContentItem[];
  status?: string;
  revised_prompt?: string;
  result?: string;
  [key: string]: unknown;
}

export interface AssistantCompletionResponse {
  id?: string;
  object?: string;
  created_at?: number;
  status?: string;
  model?: string;
  output_text?: string;
  output?: AssistantResponseOutputItem[];
  usage?: Record<string, unknown>;
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

export type EmbeddingUrlInput = string | string[];

export interface PlainTextEmbeddingEntry {
  plain_text?: string;
  plainText?: string;
  content?: string;
  text?: string;
  cleaned_text?: string;
  cleanedText?: string;
  markdown?: string;
  body?: string;
  url?: string;
  title?: string;
  description?: string;
  language?: string;
  [key: string]: unknown;
}

export type PlainTextEmbeddingInput =
  | string
  | PlainTextEmbeddingEntry
  | Array<string | PlainTextEmbeddingEntry>;

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

export interface EmbeddingUrlIssue {
  url?: string | null;
  message?: string;
  code?: string | null;
}

export interface CreateEmbeddingRequest {
  records?: Array<Record<string, unknown>>;
  urls?: EmbeddingUrlInput;
  url?: string;
  levels?: number;
  name?: string;
  embedding_name?: string;
  template_name?: string;
  field_options?: EmbeddingFieldOptionsInput;
  fieldOptions?: EmbeddingFieldOptionsInput;
  [key: string]: unknown;
}

export interface CreateEmbeddingFromUrlRequest {
  urls?: EmbeddingUrlInput;
  url?: string;
  levels?: number;
  name?: string;
  embedding_name?: string;
  template_name?: string;
  field_options?: EmbeddingFieldOptionsInput;
  fieldOptions?: EmbeddingFieldOptionsInput;
  [key: string]: unknown;
}

export interface GenerateEmbeddingsFromPlainTextRequest {
  plain_text?: PlainTextEmbeddingInput;
  plainText?: PlainTextEmbeddingInput;
  plain_texts?: PlainTextEmbeddingInput;
  plainTexts?: PlainTextEmbeddingInput;
  texts?: PlainTextEmbeddingInput;
  documents?: PlainTextEmbeddingInput;
  items?: PlainTextEmbeddingInput;
  entries?: PlainTextEmbeddingInput;
  content?: string;
  text?: string;
  cleaned_text?: string;
  cleanedText?: string;
  markdown?: string;
  body?: string;
  url?: string;
  title?: string;
  description?: string;
  language?: string;
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
  input_url_count?: number;
  processed_url_count?: number;
  firecrawl_credits_used?: number;
  crawl_levels?: number;
  max_links?: number;
  skipped_urls?: EmbeddingUrlIssue[];
  crawl_errors?: EmbeddingUrlIssue[];
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
  aspect_ratio?: string;
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
  aspect_ratio?: string;
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
  image_url?: string;
  imageUrl?: string;
  receipt_url?: string;
  receiptUrl?: string;
  template_url?: string;
  templateUrl?: string;
  template_name?: string;
  templateName?: string;
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
  image_url?: string;
  imageUrl?: string;
  receipt_url?: string;
  receiptUrl?: string;
  template_id?: string;
  templateId?: string;
  receipt_template_id?: string;
  receiptTemplateId?: string;
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

export interface GetReceiptTemplateJsonResponse {
  template_id: string;
  template_hash?: string;
  template_name?: string | null;
  source_image_url?: string | null;
  normalized_template?: ReceiptTemplateDefinition;
  template_json?: ReceiptTemplateDefinition;
  sample_receipt?: Record<string, unknown>;
  provider?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  has_subtitles?: boolean | null;
  result_language?: string | null;
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

export interface ExternalUserIdentity {
  provider: string;
  external_user_id?: string;
  externalUserId?: string;
  external_app_id?: string;
  externalAppId?: string;
  external_company_id?: string;
  externalCompanyId?: string;
  external_account_id?: string;
  externalAccountId?: string;
  email?: string;
  username?: string;
  display_name?: string;
  displayName?: string;
  avatar_url?: string;
  avatarUrl?: string;
  user_type?: string;
  userType?: string;
  browser_installation?: Record<string, unknown> | null;
  browserInstallation?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ExternalUserSummary {
  id?: string | null;
  provider?: string;
  external_user_id?: string;
  external_app_id?: string | null;
  external_company_id?: string | null;
  email?: string | null;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  user_type?: string | null;
  browser_installation?: Record<string, unknown> | null;
  generation_credits?: number;
  has_external_api_key?: boolean;
  external_api_key_created_at?: string | null;
  external_api_key_last_used_at?: string | null;
  total_requests?: number;
  total_credits_used?: number;
  total_credits_refunded?: number;
  total_credits_purchased?: number;
  last_request_at?: string | null;
  last_purchase_at?: string | null;
  last_activity_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface ExternalRequestResponse {
  request_id: string;
  session_id?: string;
  external_request_id?: string;
  external_session_id?: string;
  upstream_request_id?: string | null;
  upstream_session_id?: string | null;
  status_endpoint?: string;
  external_user?: ExternalUserSummary | null;
  creditsCharged?: number;
  creditsRefunded?: number;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface ExternalCreditsBalanceResponse extends CreditsBalanceResponse {
  externalUser?: ExternalUserSummary | null;
  external_user?: ExternalUserSummary | null;
}

export interface ExternalUserSessionResponse extends ExternalCreditsBalanceResponse {
  external_api_key?: string | null;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
}

export interface ExternalAssistantSessionResponse {
  session_id: string;
  request_id?: string;
  session_type?: string | null;
  session_name?: string | null;
  external_user?: ExternalUserSummary | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface ExternalCreditsGrantResponse {
  creditsGranted: number;
  remainingCredits: number;
  internalRemainingCredits?: number | null;
  externalUser?: ExternalUserSummary | null;
  external_user?: ExternalUserSummary | null;
  [key: string]: unknown;
}

export interface ExternalUtilityChargeRequest {
  utility_type?: string;
  utilityType?: string;
  type?: string;
  provider?: string;
  model?: string;
  model_id?: string;
  modelId?: string;
  text?: string;
  content?: string;
  characters?: number;
  character_count?: number;
  characterCount?: number;
  duration_ms?: number;
  durationMs?: number;
  duration_seconds?: number;
  durationSeconds?: number;
  duration_minutes?: number;
  durationMinutes?: number;
  duration_hours?: number;
  durationHours?: number;
  firecrawl_credits_used?: number;
  firecrawlCreditsUsed?: number;
  pricing_multiplier?: number;
  pricingMultiplier?: number;
  multiplier?: number;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ExternalUtilityChargeResponse {
  utilityType?: string;
  provider?: string | null;
  model?: string | null;
  creditsCharged?: number;
  remainingCredits?: number | null;
  pricing?: {
    costUsd?: number;
    pricingMultiplier?: number;
    creditsPerDollar?: number;
    units?: Record<string, unknown>;
    [key: string]: unknown;
  } | null;
  externalUser?: ExternalUserSummary | null;
  external_user?: ExternalUserSummary | null;
  [key: string]: unknown;
}

export interface ExternalCreditsRechargeResponse extends CreditsRechargeResponse {
  external_payment_id?: string;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
}

export interface ExternalPaymentStatusRequest extends PaymentStatusRequest {
  external_payment_id?: string;
  externalPaymentId?: string;
}

export interface ExternalPaymentStatusResponse extends PaymentStatusResponse {
  external_payment_id?: string;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
  remainingCredits?: number | null;
  lastTopUp?: CreditTopUpSummary | null;
}

export interface ExternalStatusResponse extends GlobalStatusResponse {
  external_request_id?: string;
  external_session_id?: string;
  upstream_request_id?: string | null;
  upstream_session_id?: string | null;
  external_user?: ExternalUserSummary | null;
  creditsRefunded?: number;
  remainingCredits?: number | null;
}

export interface ExternalRequestSummary {
  request_id?: string;
  external_request_id?: string;
  upstream_request_id?: string | null;
  upstream_session_id?: string | null;
  route_key?: string | null;
  status?: string | null;
  prompt?: string | null;
  video_url?: string | null;
  image_count?: number;
  credits_charged?: number;
  credits_refunded?: number;
  remaining_credits?: number | null;
  target_language?: string | null;
  source_request_ids?: string[];
  source_session_ids?: string[];
  created_at?: string | null;
  updated_at?: string | null;
  is_published?: boolean;
  published_title?: string | null;
  published_description?: string | null;
  published_tags?: string[];
  published_at?: string | null;
  published_video_url?: string | null;
  published_publication_id?: string | null;
  [key: string]: unknown;
}

export interface ExternalRequestsListResponse {
  requests: ExternalRequestSummary[];
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
  [key: string]: unknown;
}

export interface V2RequestOptions extends SamsarRequestOptions {
  externalUser?: ExternalUserIdentity | null;
  webhookUrl?: string;
}

export interface V2SessionResponse {
  account_type?: 'internal' | 'external' | string;
  auth_type?: string;
  user?: {
    id?: string;
    email?: string | null;
    displayName?: string | null;
    username?: string | null;
    pfpUrl?: string | null;
    preferredLanguage?: string | null;
    [key: string]: unknown;
  };
  external_api_key?: string | null;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
  remainingCredits?: number | null;
  [key: string]: unknown;
}

export interface V2RequestsListResponse {
  requests: Array<ExternalRequestSummary | Record<string, unknown>>;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
  [key: string]: unknown;
}

export interface V2UserRechargeCreditsRequest {
  amount: number;
  email: string;
  redirect_url?: string;
  redirectUrl?: string;
  [key: string]: unknown;
}

export interface V2UserRechargeCreditsResponse {
  url: string;
  checkoutSessionId?: string | null;
  paymentStatusEndpoint?: string;
  amount: number;
  amountCents: number;
  credits: number;
  currency: string;
  redirectUrl?: string;
  [key: string]: unknown;
}

export interface V2UserTokenRefreshRequest {
  refreshToken?: string;
  refresh_token?: string;
}

export interface V2UserTokenResponse {
  tokenType?: 'Bearer' | string;
  authToken: string;
  refreshToken: string;
  expiryDate: string;
  expiresInSeconds?: number;
  refreshTokenExpiresAt?: string;
  [key: string]: unknown;
}

export interface V2UserAppKeyRequest {
  secret?: string;
  appSecret?: string;
  app_secret?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface V2UserAppKeyRefreshRequest {
  appKey?: string;
  app_key?: string;
  secret?: string;
  appSecret?: string;
  app_secret?: string;
  [key: string]: unknown;
}

export interface V2UserAppKeyRecord {
  id?: string;
  userId?: string;
  appKeyPrefix?: string | null;
  appKeyLast4?: string | null;
  status?: 'active' | 'revoked' | string;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
  refreshedAt?: string | null;
  revokedAt?: string | null;
  rotationCount?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  authScheme?: string;
  authHeader?: string;
  secretHeader?: string;
  [key: string]: unknown;
}

export interface V2UserAppKeyResponse {
  app_key?: string;
  appKey?: string;
  token_type?: 'AppKey' | string;
  tokenType?: 'AppKey' | string;
  expires_at?: string;
  expiresAt?: string;
  app_key_record?: V2UserAppKeyRecord;
  appKeyRecord?: V2UserAppKeyRecord;
  [key: string]: unknown;
}

export interface UsageLogItem {
  id?: string;
  source?: string;
  credits?: number;
  balanceAfter?: number | null;
  metadata?: Record<string, unknown>;
  direction?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface UsageLogsResponse {
  items: UsageLogItem[];
  pagination?: {
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ExternalArchiveResponse {
  request?: ExternalRequestSummary | null;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
  [key: string]: unknown;
}

export interface ExternalPublishInput {
  title?: string;
  description?: string;
  tags?: string[] | string;
  aspectRatio?: string;
  sessionLanguage?: string;
  languageString?: string;
  [key: string]: unknown;
}

export interface ExternalPublishResponse extends ExternalArchiveResponse {
  publication?: Record<string, unknown> | null;
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

export interface ExternalCreateLoginTokenResponse extends CreateLoginTokenResponse {
  loginUrl?: string;
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
}

export interface ExternalAssistantSetSystemPromptResponse extends AssistantSetSystemPromptResponse {
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
}

export interface ExternalCreateEmbeddingResponse extends CreateEmbeddingResponse {
  external_user?: ExternalUserSummary | null;
  externalUser?: ExternalUserSummary | null;
}

export interface VerifyClientSessionInput {
  loginToken?: string;
  authToken?: string;
}

export interface VerifiedClientSessionResponse {
  authToken?: string;
  isExternalUser?: boolean;
  _id?: string | null;
  email?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  provider?: string | null;
  externalUserId?: string | null;
  externalAppId?: string | null;
  externalCompanyId?: string | null;
  generationCredits?: number;
  totalRequests?: number;
  totalCreditsUsed?: number;
  totalCreditsRefunded?: number;
  totalCreditsPurchased?: number;
  lastRequestAt?: string | null;
  lastPurchaseAt?: string | null;
  lastActivityAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
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

function resolveAliasedInputValue(
  raw: Record<string, unknown>,
  aliases: string[],
  canonicalName: string,
): unknown {
  let resolved: unknown;
  let hasResolved = false;

  for (const alias of aliases) {
    const value = raw[alias];
    if (value === undefined) {
      continue;
    }
    if (!hasResolved) {
      resolved = value;
      hasResolved = true;
      continue;
    }
    if (value !== resolved) {
      throw new Error(`${canonicalName} was provided with conflicting alias values.`);
    }
  }

  return hasResolved ? resolved : undefined;
}

function assertOptionalBoolean(
  value: unknown,
  fieldName: string,
  context = 'createVideoFromImageList',
): void {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new Error(`${fieldName} must be a boolean for ${context}`);
  }
}

function normalizeCreateVideoFromTextInput(input: CreateVideoFromTextInput): CreateVideoFromTextInput {
  const raw = input as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...input };
  const aliases: Array<[string, string[]]> = [
    ['session_id', ['session_id', 'sessionId', 'sessionID']],
    ['aspect_ratio', ['aspect_ratio', 'aspectRatio']],
    ['outro_image_url', ['outro_image_url', 'outroImageUrl']],
    ['add_outro_animation', ['add_outro_animation', 'addOutroAnimation']],
    ['add_outro_focus_area', ['add_outro_focus_area', 'addOutroFocusArea']],
    ['outro_focust_area', ['outro_focust_area', 'outro_focus_area', 'outroFocustArea', 'outroFocusArea']],
    ['generate_outro_image', ['generate_outro_image', 'generateOutroImage']],
    ['cta_url', ['cta_url', 'ctaUrl']],
    ['cta_text_top', ['cta_text_top', 'ctaTextTop']],
    ['cta_text_bottom', ['cta_text_bottom', 'ctaTextBottom']],
    ['cta_logo', ['cta_logo', 'ctaLogo']],
    ['add_footer_animation', ['add_footer_animation', 'addFooterAnimation']],
    ['footer_metadata', ['footer_metadata', 'footerMetadata']],
    ['enable_subtitles', ['enable_subtitles', 'enableSubtitles']],
    ['font_key', ['font_key', 'fontKey']],
  ];

  for (const [canonicalName, aliasList] of aliases) {
    const value = resolveAliasedInputValue(raw, aliasList, canonicalName);
    if (value !== undefined) {
      normalized[canonicalName] = value;
    }
  }

  assertOptionalBoolean(normalized.enable_subtitles, 'enable_subtitles', 'createVideoFromText');
  assertOptionalBoolean(normalized.add_outro_animation, 'add_outro_animation', 'createVideoFromText');
  assertOptionalBoolean(normalized.add_outro_focus_area, 'add_outro_focus_area', 'createVideoFromText');
  assertOptionalBoolean(normalized.generate_outro_image, 'generate_outro_image', 'createVideoFromText');
  assertOptionalBoolean(normalized.add_footer_animation, 'add_footer_animation', 'createVideoFromText');

  if (normalized.generate_outro_image === true) {
    const ctaUrl = typeof normalized.cta_url === 'string' ? normalized.cta_url.trim() : '';
    if (!ctaUrl) {
      throw new Error('cta_url is required when generate_outro_image is true for createVideoFromText');
    }
  } else if (normalized.add_outro_focus_area === true && normalized.add_outro_animation !== true) {
    throw new Error('add_outro_focus_area requires add_outro_animation to be true for createVideoFromText');
  }

  return normalized as CreateVideoFromTextInput;
}

function normalizeCreateVideoFromImageListInput(
  input: CreateVideoFromImageListInput,
): CreateVideoFromImageListInput {
  const raw = input as Record<string, unknown>;
  if (!Array.isArray(input.image_urls) || input.image_urls.length === 0) {
    throw new Error('image_urls must be a non-empty array for createVideoFromImageList');
  }

  const normalized: Record<string, unknown> = { ...input };
  const aliases: Array<[string, string[]]> = [
    ['session_id', ['session_id', 'sessionId', 'sessionID']],
    ['aspect_ratio', ['aspect_ratio', 'aspectRatio']],
    ['outro_image_url', ['outro_image_url', 'outroImageUrl']],
    ['add_outro_animation', ['add_outro_animation', 'addOutroAnimation']],
    ['add_outro_focus_area', ['add_outro_focus_area', 'addOutroFocusArea']],
    ['outro_focust_area', ['outro_focust_area', 'outro_focus_area', 'outroFocustArea', 'outroFocusArea']],
    ['generate_outro_image', ['generate_outro_image', 'generateOutroImage']],
    ['cta_url', ['cta_url', 'ctaUrl']],
    ['cta_text_top', ['cta_text_top', 'ctaTextTop']],
    ['cta_text_bottom', ['cta_text_bottom', 'ctaTextBottom']],
    ['cta_logo', ['cta_logo', 'ctaLogo']],
    ['add_footer_animation', ['add_footer_animation', 'addFooterAnimation']],
    ['footer_metadata', ['footer_metadata', 'footerMetadata']],
    ['enable_subtitles', ['enable_subtitles', 'enableSubtitles']],
    ['font_key', ['font_key', 'fontKey']],
  ];

  for (const [canonicalName, aliasList] of aliases) {
    const value = resolveAliasedInputValue(raw, aliasList, canonicalName);
    if (value !== undefined) {
      normalized[canonicalName] = value;
    }
  }

  assertOptionalBoolean(normalized.enable_subtitles, 'enable_subtitles');
  assertOptionalBoolean(normalized.add_outro_animation, 'add_outro_animation');
  assertOptionalBoolean(normalized.add_outro_focus_area, 'add_outro_focus_area');
  assertOptionalBoolean(normalized.generate_outro_image, 'generate_outro_image');
  assertOptionalBoolean(normalized.add_footer_animation, 'add_footer_animation');

  if (normalized.generate_outro_image === true) {
    const ctaUrl = typeof normalized.cta_url === 'string' ? normalized.cta_url.trim() : '';
    if (!ctaUrl) {
      throw new Error('cta_url is required when generate_outro_image is true for createVideoFromImageList');
    }
  } else if (normalized.add_outro_focus_area === true && normalized.add_outro_animation !== true) {
    throw new Error('add_outro_focus_area requires add_outro_animation to be true for createVideoFromImageList');
  }

  return normalized as CreateVideoFromImageListInput;
}

function normalizeUpdateVideoOutroImageInput(
  input: UpdateVideoOutroImageInput,
  context = 'updateVideoOutroImage',
): Record<string, unknown> {
  const raw = input as Record<string, unknown>;
  const videoSessionId =
    (raw.videoSessionId as string | undefined) ??
    (raw.video_session_id as string | undefined) ??
    (raw.videoSessionID as string | undefined) ??
    (raw.session_id as string | undefined) ??
    (raw.sessionId as string | undefined) ??
    (raw.sessionID as string | undefined) ??
    (raw.request_id as string | undefined) ??
    (raw.requestId as string | undefined) ??
    (raw.source_request_id as string | undefined) ??
    (raw.sourceRequestId as string | undefined) ??
    (raw.external_request_id as string | undefined) ??
    (raw.externalRequestId as string | undefined) ??
    (raw.external_session_id as string | undefined) ??
    (raw.externalSessionId as string | undefined);
  const outroImageUrl =
    (raw.outro_image_url as string | undefined) ??
    (raw.outroImageUrl as string | undefined) ??
    (raw.new_outro_image_url as string | undefined) ??
    (raw.newOutroImageUrl as string | undefined);
  const rawGenerateOutroImage =
    (raw.generate_outro_image as unknown) ??
    (raw.generateOutroImage as unknown);
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
  const ctaUrl =
    (raw.cta_url as string | undefined) ??
    (raw.ctaUrl as string | undefined);
  const ctaTextTop =
    (raw.cta_text_top as string | undefined) ??
    (raw.ctaTextTop as string | undefined);
  const ctaTextBottom =
    (raw.cta_text_bottom as string | undefined) ??
    (raw.ctaTextBottom as string | undefined);
  const ctaLogo =
    (raw.cta_logo as string | undefined) ??
    (raw.ctaLogo as string | undefined);
  const generateOutroImage =
    rawGenerateOutroImage === true ||
    (rawGenerateOutroImage === undefined && !outroImageUrl && Boolean(ctaUrl));

  if (!videoSessionId) {
    throw new Error(`videoSessionId is required for ${context}`);
  }
  if (rawGenerateOutroImage !== undefined && typeof rawGenerateOutroImage !== 'boolean') {
    throw new Error(`generate_outro_image must be a boolean for ${context}`);
  }
  if (rawAddOutroAnimation !== undefined && typeof rawAddOutroAnimation !== 'boolean') {
    throw new Error(`add_outro_animation must be a boolean for ${context}`);
  }
  if (rawAddOutroFocusArea !== undefined && typeof rawAddOutroFocusArea !== 'boolean') {
    throw new Error(`add_outro_focus_area must be a boolean for ${context}`);
  }
  if (generateOutroImage && outroImageUrl) {
    throw new Error(`Use either generate_outro_image with cta_url or outro_image_url for ${context}`);
  }
  if (!generateOutroImage && !outroImageUrl) {
    throw new Error(`outro_image_url is required for ${context} unless generate_outro_image is true`);
  }
  if (generateOutroImage) {
    if (!ctaUrl || !String(ctaUrl).trim()) {
      throw new Error(`cta_url is required when generate_outro_image is true for ${context}`);
    }
  } else if (rawAddOutroFocusArea === true && rawAddOutroAnimation !== true) {
    throw new Error(`add_outro_focus_area requires add_outro_animation to be true for ${context}`);
  }
  if (!generateOutroImage && rawAddOutroFocusArea === true) {
    if (!rawOutroFocusArea || typeof rawOutroFocusArea !== 'object' || Array.isArray(rawOutroFocusArea)) {
      throw new Error(`outro_focust_area must be an object with x, y, width, height for ${context}`);
    }
    const { x, y, width, height } = rawOutroFocusArea as Record<string, unknown>;
    const isInvalid = [x, y, width, height].some((value) => typeof value !== 'number' || !Number.isFinite(value));
    if (isInvalid) {
      throw new Error(`outro_focust_area x, y, width, height must be valid numbers for ${context}`);
    }
  }

  return {
    ...input,
    videoSessionId: String(videoSessionId),
    ...(outroImageUrl ? { outro_image_url: String(outroImageUrl) } : {}),
    generate_outro_image: generateOutroImage,
    ...(generateOutroImage ? { cta_url: String(ctaUrl).trim() } : {}),
    ...(ctaTextTop ? { cta_text_top: String(ctaTextTop) } : {}),
    ...(ctaTextBottom ? { cta_text_bottom: String(ctaTextBottom) } : {}),
    ...(ctaLogo ? { cta_logo: String(ctaLogo) } : {}),
    ...(rawAddOutroAnimation !== undefined ? { add_outro_animation: rawAddOutroAnimation === true } : {}),
    ...(rawAddOutroFocusArea !== undefined ? { add_outro_focus_area: rawAddOutroFocusArea === true } : {}),
    ...(rawOutroFocusArea !== undefined ? { outro_focust_area: rawOutroFocusArea } : {}),
  };
}

function normalizeSessionPublicationInput(
  input: string | SessionPublicationInput,
  context: string,
): Record<string, unknown> {
  if (typeof input !== 'string' && (!input || typeof input !== 'object' || Array.isArray(input))) {
    throw new Error(`input must be a session id or object for ${context}`);
  }

  const raw: Record<string, unknown> = typeof input === 'string' ? { session_id: input } : { ...input };
  const sessionId = resolveAliasedInputValue(
    raw,
    [
      'session_id',
      'sessionId',
      'sessionID',
      'video_session_id',
      'videoSessionId',
      'videoSessionID',
      'id',
    ],
    'session_id',
  );

  const normalizedSessionId = typeof sessionId === 'string' ? sessionId.trim() : '';
  if (!normalizedSessionId) {
    throw new Error(`session_id is required for ${context}`);
  }

  const normalized: Record<string, unknown> = {
    ...raw,
    session_id: normalizedSessionId,
  };

  const aliases: Array<[string, string[]]> = [
    ['aspect_ratio', ['aspect_ratio', 'aspectRatio']],
    ['creator_handle', ['creator_handle', 'creatorHandle']],
    ['image_hash', ['image_hash', 'imageHash']],
    ['splash_image', ['splash_image', 'splashImage']],
    ['image_model', ['image_model', 'imageModel']],
    ['video_model', ['video_model', 'videoModel']],
    ['original_prompt', ['original_prompt', 'originalPrompt', 'prompt']],
    ['session_language', ['session_language', 'sessionLanguage', 'language', 'language_code']],
    ['language_string', ['language_string', 'languageString']],
  ];

  for (const [canonicalName, aliasList] of aliases) {
    const value = resolveAliasedInputValue(raw, aliasList, canonicalName);
    if (value !== undefined) {
      normalized[canonicalName] = value;
    }
  }

  if (
    normalized.tags !== undefined &&
    !Array.isArray(normalized.tags) &&
    typeof normalized.tags !== 'string'
  ) {
    throw new Error(`tags must be a string or string array for ${context}`);
  }

  if (Array.isArray(normalized.tags)) {
    normalized.tags = normalized.tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return normalized;
}

export class SamsarClient {
  private readonly apiKey?: string;
  private readonly appKey?: string;
  private readonly appSecret?: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: FetchLike;
  private readonly defaultHeaders: Record<string, string>;
  private readonly externalUserApiKey?: string;

  constructor(options: SamsarClientOptions) {
    this.apiKey = options?.apiKey?.trim() || undefined;
    this.appKey = options?.appKey?.trim() || undefined;
    this.appSecret = options?.appSecret?.trim() || undefined;
    this.baseUrl = trimTrailingSlash(options.baseUrl ?? DEFAULT_BASE_URL);
    this.timeoutMs = options.timeoutMs ?? 30000;
    this.fetchFn = options.fetch ?? (globalThis.fetch as FetchLike);
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.externalUserApiKey = options.externalUserApiKey?.trim() || undefined;

    if (typeof this.fetchFn !== 'function') {
      throw new Error(
        'A fetch implementation is required. Provide one via the "fetch" option when running outside environments with global fetch.',
      );
    }
  }

  /**
   * Low-level POST adapter for the upcoming /v2 omni routes.
   * Pass options.externalUser to include an external_user payload; omit it for internal-account calls
   * or when authenticating directly with an external-user auth token/API key.
   */
  async postV2<T = Record<string, unknown>>(
    path: string,
    payload: Record<string, unknown> = {},
    options?: V2RequestOptions,
  ): Promise<SamsarResult<T>> {
    return this.post<T>(
      this.buildV2Url(path),
      this.withV2ExternalUser(payload, options),
      options,
    );
  }

  /**
   * Low-level GET adapter for the upcoming /v2 omni routes.
   */
  async getV2<T = Record<string, unknown>>(
    path: string,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<T>> {
    const query = {
      ...(options?.externalUser ? buildExternalUserQuery(options.externalUser) : {}),
      ...(options?.query ?? {}),
    };

    return this.get<T>(this.buildV2Url(path), { ...(options ?? {}), query });
  }

  async createV2Session(options?: V2RequestOptions): Promise<SamsarResult<V2SessionResponse>> {
    return this.postV2<V2SessionResponse>('session', {}, options);
  }

  async getV2Credits(options?: V2RequestOptions): Promise<SamsarResult<CreditsBalanceResponse | ExternalCreditsBalanceResponse>> {
    return this.getV2<CreditsBalanceResponse | ExternalCreditsBalanceResponse>('credits', options);
  }

  async getV2UserCredits(options?: V2RequestOptions): Promise<SamsarResult<CreditsBalanceResponse>> {
    return this.getV2<CreditsBalanceResponse>('user/credits', options);
  }

  async getV2UserUsageLogs(
    options?: V2RequestOptions & { page?: number; pageSize?: number; limit?: number },
  ): Promise<SamsarResult<UsageLogsResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };
    if (options?.page !== undefined) {
      query.page = options.page;
    }
    if (options?.pageSize !== undefined) {
      query.pageSize = options.pageSize;
    }
    if (options?.limit !== undefined) {
      query.limit = options.limit;
    }

    return this.getV2<UsageLogsResponse>('user/usage/logs', {
      ...(options ?? {}),
      query,
    });
  }

  async listV2Requests(options?: V2RequestOptions): Promise<SamsarResult<V2RequestsListResponse>> {
    return this.getV2<V2RequestsListResponse>('requests', options);
  }

  async createV2UserRechargeCredits(
    payload: V2UserRechargeCreditsRequest,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<V2UserRechargeCreditsResponse>> {
    const amount = Number(payload?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('amount must be a positive dollar amount');
    }
    if (!payload?.email || typeof payload.email !== 'string') {
      throw new Error('email is required');
    }
    const redirectUrl = payload.redirect_url ?? payload.redirectUrl;
    if (!redirectUrl || typeof redirectUrl !== 'string') {
      throw new Error('redirect_url is required');
    }

    return this.postV2<V2UserRechargeCreditsResponse>(
      'user/recharge_credits',
      {
        ...payload,
        amount,
        email: payload.email.trim(),
        redirect_url: redirectUrl.trim(),
      },
      options,
    );
  }

  async refreshV2UserToken(
    payload: string | V2UserTokenRefreshRequest,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<V2UserTokenResponse>> {
    const refreshToken =
      typeof payload === 'string'
        ? payload
        : (payload?.refreshToken ?? payload?.refresh_token);

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new Error('refreshToken is required');
    }

    return this.postV2<V2UserTokenResponse>(
      'user/refresh_token',
      { refreshToken: refreshToken.trim() },
      options,
    );
  }

  async refreshV2UserAuthToken(
    payload: string | V2UserTokenRefreshRequest,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<V2UserTokenResponse>> {
    return this.refreshV2UserToken(payload, options);
  }

  async createV2UserAppKey(
    payload: string | V2UserAppKeyRequest,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<V2UserAppKeyResponse>> {
    const input: V2UserAppKeyRequest = typeof payload === 'string' ? { secret: payload } : (payload ?? {});
    const secret = input.secret ?? input.appSecret ?? input.app_secret;
    if (!secret || typeof secret !== 'string') {
      throw new Error('secret is required');
    }
    if (secret.trim().length < 32) {
      throw new Error('secret must be at least 32 characters');
    }

    return this.postV2<V2UserAppKeyResponse>(
      'users/app_key',
      {
        ...input,
        secret: secret.trim(),
      },
      options,
    );
  }

  async getV2UserAppKey(options?: V2RequestOptions): Promise<SamsarResult<V2UserAppKeyResponse>> {
    return this.getV2<V2UserAppKeyResponse>('users/app_key', options);
  }

  async refreshV2UserAppKey(
    payload?: V2UserAppKeyRefreshRequest,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<V2UserAppKeyResponse>> {
    const input = payload ?? {};
    const appKey = input.appKey ?? input.app_key ?? options?.appKey ?? this.appKey;
    const secret = input.secret ?? input.appSecret ?? input.app_secret ?? options?.appSecret ?? this.appSecret;
    if (!appKey || typeof appKey !== 'string') {
      throw new Error('appKey is required');
    }
    if (!secret || typeof secret !== 'string') {
      throw new Error('secret is required');
    }
    if (secret.trim().length < 32) {
      throw new Error('secret must be at least 32 characters');
    }

    return this.postV2<V2UserAppKeyResponse>(
      'users/app_key/refresh',
      {
        app_key: appKey.trim(),
        secret: secret.trim(),
      },
      options,
    );
  }

  async revokeV2UserAppKey(options?: V2RequestOptions): Promise<SamsarResult<V2UserAppKeyResponse>> {
    return this.request<V2UserAppKeyResponse>(
      this.buildV2Url('users/app_key'),
      { ...(options ?? {}), method: 'DELETE' },
    );
  }

  async getV2UserPaymentStatus(
    payload: PaymentStatusRequest,
    options?: V2RequestOptions,
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

    return this.getV2<PaymentStatusResponse>('user/payment_status', {
      ...(options ?? {}),
      query,
    });
  }

  async createV2LoginToken(
    options?: V2RequestOptions & { redirect?: string },
  ): Promise<SamsarResult<CreateLoginTokenResponse | ExternalCreateLoginTokenResponse>> {
    const body = options?.redirect ? { redirect: options.redirect } : {};
    return this.postV2<CreateLoginTokenResponse | ExternalCreateLoginTokenResponse>(
      'create_login_token',
      body,
      options,
    );
  }

  async createV2VideoFromText(
    input: CreateVideoFromTextInput,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<CreateVideoResponse | ExternalRequestResponse>> {
    const normalizedInput = normalizeCreateVideoFromTextInput(input);
    return this.postV2<CreateVideoResponse | ExternalRequestResponse>(
      'text_to_video',
      {
        input: normalizedInput,
        webhookUrl: options?.webhookUrl,
      },
      options,
    );
  }

  async createV2VideoFromImageList(
    input: CreateVideoFromImageListInput,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<CreateVideoFromImageListResponse | ExternalRequestResponse>> {
    const normalizedInput = normalizeCreateVideoFromImageListInput(input);
    return this.postV2<CreateVideoFromImageListResponse | ExternalRequestResponse>(
      'image_list_to_video',
      {
        input: normalizedInput,
        webhookUrl: options?.webhookUrl,
      },
      options,
    );
  }

  async uploadV2ImageData(
    imageData: string[],
    options?: V2RequestOptions,
  ): Promise<SamsarResult<{ image_urls: string[] }>> {
    if (!Array.isArray(imageData) || imageData.length === 0) {
      throw new Error('imageData must be a non-empty array of data URLs');
    }

    return this.postV2<{ image_urls: string[] }>(
      'upload_image_data',
      {
        input: {
          image_data: imageData,
        },
      },
      options,
    );
  }

  async updateV2VideoOutroImage(
    input: UpdateVideoOutroImageInput,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<UpdateVideoOutroImageResponse | ExternalRequestResponse>> {
    const normalizedInput = normalizeUpdateVideoOutroImageInput(input, 'updateV2VideoOutroImage');
    return this.postV2<UpdateVideoOutroImageResponse | ExternalRequestResponse>(
      'update_outro_image',
      {
        input: normalizedInput,
        webhookUrl: options?.webhookUrl,
      },
      options,
    );
  }

  async addV2VideoOutroImage(
    input: AddVideoOutroImageInput,
    options?: V2RequestOptions,
  ): Promise<SamsarResult<AddVideoOutroImageResponse | ExternalRequestResponse>> {
    return this.postV2<AddVideoOutroImageResponse | ExternalRequestResponse>(
      'add_outro_image',
      {
        input,
        webhookUrl: options?.webhookUrl,
      },
      options,
    );
  }

  async getV2Status(
    requestId: string,
    options?: V2RequestOptions & { queryParams?: QueryParams },
  ): Promise<SamsarResult<GlobalStatusResponse | ExternalStatusResponse>> {
    const queryParams = {
      ...(options?.externalUser ? buildExternalUserQuery(options.externalUser) : {}),
      ...(options?.queryParams ?? {}),
    };

    return this.getStatus(requestId, {
      ...options,
      path: this.buildV2Url('status'),
      queryParams,
    }) as Promise<SamsarResult<GlobalStatusResponse | ExternalStatusResponse>>;
  }

  /**
   * Create a new video generation job from text.
   */
  async createVideoFromText(
    input: CreateVideoFromTextInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<CreateVideoResponse>> {
    const normalizedInput = normalizeCreateVideoFromTextInput(input);
    const body = {
      input: normalizedInput,
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
    const normalizedInput = normalizeCreateVideoFromImageListInput(input);
    const body = {
      input: normalizedInput,
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
   * Create a text-to-video request attributed to an external user while billing against the shared API key.
   */
  async createExternalVideoFromText(
    externalUser: ExternalUserIdentity,
    input: CreateVideoFromTextInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalRequestResponse>> {
    const normalizedInput = normalizeCreateVideoFromTextInput(input);
    const body = {
      external_user: normalizeExternalUserIdentity(externalUser),
      input: normalizedInput,
      webhookUrl: options?.webhookUrl,
    };

    return this.post<ExternalRequestResponse>('external_users/text_to_video', body, options);
  }

  /**
   * Upload image data URLs for an external user before calling createExternalVideoFromImageList.
   */
  async uploadExternalImageData(
    externalUser: ExternalUserIdentity,
    imageData: string[],
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<{ image_urls: string[] }>> {
    if (!Array.isArray(imageData) || imageData.length === 0) {
      throw new Error('imageData must be a non-empty array of data URLs');
    }

    const body = {
      external_user: normalizeExternalUserIdentity(externalUser),
      input: {
        image_data: imageData,
      },
    };

    return this.post<{ image_urls: string[] }>('external_users/upload_image_data', body, options);
  }

  /**
   * Create an image-list-to-video request attributed to an external user while billing against the shared API key.
   */
  async createExternalVideoFromImageList(
    externalUser: ExternalUserIdentity,
    input: CreateVideoFromImageListInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalRequestResponse>> {
    const normalizedInput = normalizeCreateVideoFromImageListInput(input);
    const body = {
      external_user: normalizeExternalUserIdentity(externalUser),
      input: normalizedInput,
      webhookUrl: options?.webhookUrl,
    };

    return this.post<ExternalRequestResponse>('external_users/image_list_to_video', body, options);
  }

  /**
   * Create or refresh an external-user session and receive that user’s dedicated external API key.
   */
  async createExternalUserSession(
    externalUser: ExternalUserIdentity,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalUserSessionResponse>> {
    const body = {
      external_user: normalizeExternalUserIdentity(externalUser),
    };

    return this.post<ExternalUserSessionResponse>('external_users/session', body, options);
  }

  /**
   * Create a blank assistant session for an external user.
   * The returned session_id can be reused for future external assistant completions.
   */
  async createExternalAssistantSession(
    externalUser?: ExternalUserIdentity | null,
    payload: {
      session_name?: string;
      sessionName?: string;
      metadata?: Record<string, unknown>;
    } = {},
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalAssistantSessionResponse>> {
    const body: Record<string, unknown> = {
      ...payload,
    };

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<ExternalAssistantSessionResponse>(
      'external_users/utils/assistant_session',
      body,
      options,
    );
  }

  /**
   * Charge an external user's credits for utility usage such as ElevenLabs TTS/STT or Firecrawl crawl costs.
   * This is useful when a proxy or integration incurs third-party usage outside the standard Samsar route billing flow.
   */
  async chargeExternalUserUtilityUsage(
    payload: ExternalUtilityChargeRequest,
    externalUser?: ExternalUserIdentity | null,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalUtilityChargeResponse>> {
    const body: Record<string, unknown> = {
      ...payload,
    };

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<ExternalUtilityChargeResponse>(
      'external_users/utils/usage_charge',
      body,
      options,
    );
  }

  /**
   * Create a short-lived external-user login token plus a ready-to-open client login URL.
   */
  async createExternalUserLoginToken(
    externalUser?: ExternalUserIdentity | null,
    options?: ({ redirect?: string } & SamsarRequestOptions),
  ): Promise<SamsarResult<ExternalCreateLoginTokenResponse>> {
    const body: Record<string, unknown> = {};

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }
    if (options?.redirect) {
      body.redirect = options.redirect;
    }

    return this.post<ExternalCreateLoginTokenResponse>('external_users/create_login_token', body, options);
  }

  /**
   * Store or clear the external user’s assistant system prompt.
   * When set, it overrides the owning account prompt for future assistant requests from that external user.
   */
  async setExternalAssistantSystemPrompt(
    payload: AssistantSetSystemPromptRequest,
    externalUser?: ExternalUserIdentity | null,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalAssistantSetSystemPromptResponse>> {
    const body: Record<string, unknown> = {
      ...payload,
    };

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<ExternalAssistantSetSystemPromptResponse>(
      'external_users/assistant/set_system_prompt',
      body,
      options,
    );
  }

  /**
   * Create an assistant completion scoped to an external user while billing that external user's credit balance.
   * The owning Samsar account's configured assistant model is used internally.
   */
  async createExternalAssistantCompletion(
    payload: AssistantCompletionRequest,
    externalUser?: ExternalUserIdentity | null,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<AssistantCompletionResponse>> {
    const body: Record<string, unknown> = {
      ...payload,
    };

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<AssistantCompletionResponse>(
      'external_users/assistant/completion',
      body,
      options,
    );
  }

  /**
   * Create a new embedding template for an external user from already cleaned plain text.
   * This skips crawling and bills the external user's credits only.
   */
  async generateExternalEmbeddingsFromPlainText(
    payload: GenerateEmbeddingsFromPlainTextRequest,
    externalUser?: ExternalUserIdentity | null,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalCreateEmbeddingResponse>> {
    const body: Record<string, unknown> = {
      ...payload,
    };

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<ExternalCreateEmbeddingResponse>(
      'external_users/generate_embeddings_from_plain_text',
      body,
      options,
    );
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
   * Add subtitle/transcript text overlays by cloning an existing session and re-running
   * transcription + frame + video generation on the new session.
   */
  async addSubtitles(
    input: AddSubtitlesInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<AddSubtitlesResponse>> {
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
      throw new Error('videoSessionId is required for addSubtitles');
    }

    const body = {
      input: {
        ...input,
        videoSessionId: String(videoSessionId),
      },
      webhookUrl: options?.webhookUrl,
    };

    const response = await this.post<AddSubtitlesResponse>('video/add_subtitles', body, options);

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

      const normalizedData: AddSubtitlesResponse = {
        ...(data as AddSubtitlesResponse),
        sessionID: (data as AddSubtitlesResponse).sessionID ?? normalizedSessionId ?? '',
        session_id: (data as AddSubtitlesResponse).session_id ?? normalizedSessionId,
        request_id: (data as AddSubtitlesResponse).request_id ?? normalizedSessionId,
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
    const normalizedInput = normalizeUpdateVideoOutroImageInput(input, 'updateVideoOutroImage');
    const body = {
      input: normalizedInput,
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
   * Update the outro image for an external-user video request by resolving the external request id
   * through /external_users/update_outro_image.
   */
  async updateExternalVideoOutroImage(
    externalUser: ExternalUserIdentity,
    input: UpdateVideoOutroImageInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalRequestResponse>> {
    const normalizedInput = normalizeUpdateVideoOutroImageInput(input, 'updateExternalVideoOutroImage');
    const body = {
      external_user: normalizeExternalUserIdentity(externalUser),
      input: normalizedInput,
      webhookUrl: options?.webhookUrl,
    };

    return this.post<ExternalRequestResponse>(
      'external_users/update_outro_image',
      body,
      options,
    );
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
   * Add or replace an outro image for an external-user video request by resolving the external request id.
   */
  async addExternalVideoOutroImage(
    externalUser: ExternalUserIdentity,
    input: AddVideoOutroImageInput,
    options?: { webhookUrl?: string } & SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalRequestResponse>> {
    const raw = input as Record<string, unknown>;
    const videoSessionId =
      (raw.videoSessionId as string | undefined) ??
      (raw.video_session_id as string | undefined) ??
      (raw.videoSessionID as string | undefined) ??
      (raw.session_id as string | undefined) ??
      (raw.sessionId as string | undefined) ??
      (raw.sessionID as string | undefined) ??
      (raw.request_id as string | undefined) ??
      (raw.requestId as string | undefined) ??
      (raw.source_request_id as string | undefined) ??
      (raw.sourceRequestId as string | undefined) ??
      (raw.external_request_id as string | undefined) ??
      (raw.externalRequestId as string | undefined) ??
      (raw.external_session_id as string | undefined) ??
      (raw.externalSessionId as string | undefined);
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
      throw new Error('videoSessionId is required for addExternalVideoOutroImage');
    }
    if (!outroImageUrl) {
      throw new Error('outro_image_url is required for addExternalVideoOutroImage');
    }
    if (rawAddOutroAnimation !== undefined && typeof rawAddOutroAnimation !== 'boolean') {
      throw new Error('add_outro_animation must be a boolean for addExternalVideoOutroImage');
    }
    if (rawAddOutroFocusArea !== undefined && typeof rawAddOutroFocusArea !== 'boolean') {
      throw new Error('add_outro_focus_area must be a boolean for addExternalVideoOutroImage');
    }
    if (rawAddOutroFocusArea === true && rawAddOutroAnimation !== true) {
      throw new Error('add_outro_focus_area requires add_outro_animation to be true for addExternalVideoOutroImage');
    }
    if (rawAddOutroFocusArea === true) {
      if (!rawOutroFocusArea || typeof rawOutroFocusArea !== 'object' || Array.isArray(rawOutroFocusArea)) {
        throw new Error('outro_focust_area must be an object with x, y, width, height for addExternalVideoOutroImage');
      }
      const { x, y, width, height } = rawOutroFocusArea as Record<string, unknown>;
      const isInvalid = [x, y, width, height].some((value) => typeof value !== 'number' || !Number.isFinite(value));
      if (isInvalid) {
        throw new Error('outro_focust_area x, y, width, height must be valid numbers for addExternalVideoOutroImage');
      }
    }

    const body = {
      external_user: normalizeExternalUserIdentity(externalUser),
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

    return this.post<ExternalRequestResponse>(
      'external_users/add_outro_image',
      body,
      options,
    );
  }

  /**
   * Fetch the latest available render URL for a given video session id.
   * Completed responses include result_url, has_subtitles, and result_language.
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
   * Each item includes result_url plus session metadata such as has_subtitles and result_language.
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
   * Publish a completed Samsar video session to the public publication feed.
   * This is a free endpoint. The session must belong to the authenticated API key/auth token.
   */
  async publishPublication(
    input: string | SessionPublicationInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SessionPublicationResponse>> {
    const payload = normalizeSessionPublicationInput(input, 'publishPublication');
    return this.post<SessionPublicationResponse>('publications/publish', payload, options);
  }

  /**
   * Alias for publishPublication, named around the underlying VideoSession resource.
   */
  async publishSessionPublication(
    input: string | SessionPublicationInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SessionPublicationResponse>> {
    return this.publishPublication(input, options);
  }

  /**
   * Edit an existing publication for a Samsar video session.
   * Omitted fields keep their current publication values.
   */
  async editPublication(
    input: SessionPublicationInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SessionPublicationResponse>> {
    const payload = normalizeSessionPublicationInput(input, 'editPublication');
    return this.post<SessionPublicationResponse>('publications/edit', payload, options);
  }

  /**
   * Alias for editPublication, named around the underlying VideoSession resource.
   */
  async editSessionPublication(
    input: SessionPublicationInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SessionPublicationResponse>> {
    return this.editPublication(input, options);
  }

  /**
   * Revoke a publication for a Samsar video session.
   * This deletes the publication record and clears published fields on the session.
   */
  async revokePublication(
    input: string | SessionPublicationInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SessionPublicationResponse>> {
    const payload = normalizeSessionPublicationInput(input, 'revokePublication');
    return this.post<SessionPublicationResponse>('publications/revoke', payload, options);
  }

  /**
   * Alias for revokePublication, named around the underlying VideoSession resource.
   */
  async revokeSessionPublication(
    input: string | SessionPublicationInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<SessionPublicationResponse>> {
    return this.revokePublication(input, options);
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
   * Pass `maxwords` (or `maxWords`) as a positive integer to override the default output limit.
   */
  async enhanceMessage(
    payload: EnhanceMessageRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<EnhanceMessageResponse>> {
    return this.post<EnhanceMessageResponse>('chat/enhance', payload, options);
  }

  /**
   * Store or clear the account-level system prompt used by assistant completions.
   * Pass `null` (for `system_prompt`) or an empty string to clear the custom prompt and revert to Samsar's default assistant prompt.
   */
  async setAssistantSystemPrompt(
    payload: AssistantSetSystemPromptRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<AssistantSetSystemPromptResponse>> {
    return this.post<AssistantSetSystemPromptResponse>('assistant/set_system_prompt', payload, options);
  }

  /**
   * Create an assistant completion for an existing session.
   * Returns an OpenAI Responses-style payload and includes credit headers when applicable.
   */
  async createAssistantCompletion(
    payload: AssistantCompletionRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<AssistantCompletionResponse>> {
    return this.post<AssistantCompletionResponse>('assistant/completion', payload, options);
  }

  /**
   * Create a new embedding template from either a JSON array (`records`) or a URL input (`urls`).
   * URL mode also accepts `levels` (1-3) to control crawl depth.
   */
  async createEmbedding(
    payload: CreateEmbeddingRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateEmbeddingResponse>> {
    return this.post<CreateEmbeddingResponse>('chat/create_embedding', payload, options);
  }

  /**
   * Create a new embedding template from one URL or a list of URLs.
   * Pass `levels` (1-3) to control crawl depth; the API defaults to 2.
   */
  async createEmbeddingFromUrl(
    payload: CreateEmbeddingFromUrlRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateEmbeddingResponse>> {
    return this.post<CreateEmbeddingResponse>('chat/create_embedding_from_url', payload, options);
  }

  /**
   * Create a new embedding template from already cleaned plain text.
   * This skips crawling and uses the same compatible template format as the JSON and URL routes.
   */
  async generateEmbeddingsFromPlainText(
    payload: GenerateEmbeddingsFromPlainTextRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<CreateEmbeddingResponse>> {
    return this.post<CreateEmbeddingResponse>('chat/generate_embeddings_from_plain_text', payload, options);
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
    const raw = payload as Record<string, unknown>;
    const imageUrl =
      (typeof raw.image_url === 'string' && raw.image_url.trim()) ||
      (typeof raw.imageUrl === 'string' && raw.imageUrl.trim()) ||
      (typeof raw.receipt_url === 'string' && raw.receipt_url.trim()) ||
      (typeof raw.receiptUrl === 'string' && raw.receiptUrl.trim()) ||
      (typeof raw.template_url === 'string' && raw.template_url.trim()) ||
      (typeof raw.templateUrl === 'string' && raw.templateUrl.trim()) ||
      null;
    if (!imageUrl) {
      throw new Error('image_url (or receipt_url/template_url) is required');
    }

    const templateName =
      (typeof raw.template_name === 'string' && raw.template_name.trim()) ||
      (typeof raw.templateName === 'string' && raw.templateName.trim()) ||
      undefined;

    const requestPayload: CreateReceiptTemplateRequest = {
      ...payload,
      image_url: imageUrl,
      receipt_url: imageUrl,
      template_url: imageUrl,
      ...(templateName ? { template_name: templateName } : {}),
    };

    return this.post<CreateReceiptTemplateResponse>('image/receipt_templates/create', requestPayload, options);
  }

  /**
   * Extract standardized receipt JSON by validating a receipt image against a saved template.
   * This endpoint charges 50 credits per request.
   */
  async queryReceiptTemplate(
    payload: QueryReceiptTemplateRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<QueryReceiptTemplateResponse>> {
    const raw = payload as Record<string, unknown>;
    const imageUrl =
      (typeof raw.image_url === 'string' && raw.image_url.trim()) ||
      (typeof raw.imageUrl === 'string' && raw.imageUrl.trim()) ||
      (typeof raw.receipt_url === 'string' && raw.receipt_url.trim()) ||
      (typeof raw.receiptUrl === 'string' && raw.receiptUrl.trim()) ||
      null;
    if (!imageUrl) {
      throw new Error('image_url (or receipt_url) is required');
    }

    const templateId =
      (typeof raw.template_id === 'string' && raw.template_id.trim()) ||
      (typeof raw.templateId === 'string' && raw.templateId.trim()) ||
      (typeof raw.receipt_template_id === 'string' && raw.receipt_template_id.trim()) ||
      (typeof raw.receiptTemplateId === 'string' && raw.receiptTemplateId.trim()) ||
      null;
    if (!templateId) {
      throw new Error('template_id is required');
    }

    const requestPayload: QueryReceiptTemplateRequest = {
      ...payload,
      image_url: imageUrl,
      receipt_url: imageUrl,
      template_id: templateId,
      receipt_template_id: templateId,
    };

    return this.post<QueryReceiptTemplateResponse>('image/receipt_templates/query', requestPayload, options);
  }

  /**
   * Fetch the structured template JSON for a template id that belongs to the authenticated API key.
   */
  async getReceiptTemplateJson(
    templateId: string,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<GetReceiptTemplateJsonResponse>> {
    const normalizedTemplateId = typeof templateId === 'string' ? templateId.trim() : '';
    if (!normalizedTemplateId) {
      throw new Error('templateId is required');
    }

    const query: QueryParams = {
      ...(options?.query ?? {}),
      template_id: normalizedTemplateId,
    };

    return this.get<GetReceiptTemplateJsonResponse>('image/template_json', {
      ...(options ?? {}),
      query,
    });
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
   * Fetch the shared credit balance plus attribution summary for a specific external user.
   */
  async getExternalCreditsBalance(
    externalUser: ExternalUserIdentity,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalCreditsBalanceResponse>> {
    return this.get<ExternalCreditsBalanceResponse>('external_users/credits', {
      ...(options ?? {}),
      query: {
        ...buildExternalUserQuery(externalUser),
        ...(options?.query ?? {}),
      },
    });
  }

  /**
   * Manually grant credits to a specific external user while also crediting the shared platform account.
   */
  async grantExternalUserCredits(
    externalUser: ExternalUserIdentity,
    credits: number,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalCreditsGrantResponse>> {
    if (!Number.isFinite(credits) || credits <= 0) {
      throw new Error('credits must be a positive number');
    }

    const payload = {
      external_user: normalizeExternalUserIdentity(externalUser),
      input: {
        credits: Math.round(credits),
      },
    };

    return this.post<ExternalCreditsGrantResponse>('external_users/credits/grant', payload, options);
  }

  /**
   * Fetch recent external-user-attributed requests for library or dashboard views.
   */
  async listExternalUserRequests(
    externalUser?: ExternalUserIdentity | null,
    options?: ({ limit?: number } & SamsarRequestOptions),
  ): Promise<SamsarResult<ExternalRequestsListResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };

    if (externalUser) {
      Object.assign(query, buildExternalUserQuery(externalUser));
    }
    if (options?.limit !== undefined) {
      query.limit = options.limit;
    }

    return this.get<ExternalRequestsListResponse>('external_users/requests', {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * Archive an external-user request so it no longer appears in the external library/feed.
   */
  async archiveExternalUserRequest(
    requestId: string,
    externalUser?: ExternalUserIdentity | null,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalArchiveResponse>> {
    if (!requestId || typeof requestId !== 'string') {
      throw new Error('requestId is required');
    }

    const payload: Record<string, unknown> = {
      request_id: requestId,
    };

    if (externalUser) {
      payload.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<ExternalArchiveResponse>('external_users/archive', payload, options);
  }

  /**
   * Publish a completed external-user request to the public library/feed.
   */
  async publishExternalUserRequest(
    requestId: string,
    payload: ExternalPublishInput = {},
    externalUser?: ExternalUserIdentity | null,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalPublishResponse>> {
    if (!requestId || typeof requestId !== 'string') {
      throw new Error('requestId is required');
    }

    const body: Record<string, unknown> = {
      request_id: requestId,
      ...payload,
    };

    if (externalUser) {
      body.external_user = normalizeExternalUserIdentity(externalUser);
    }

    return this.post<ExternalPublishResponse>('external_users/publish', body, options);
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
   * Create a shared-balance Stripe recharge attributed to an external user.
   */
  async createExternalCreditsRecharge(
    externalUser: ExternalUserIdentity,
    credits: number,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalCreditsRechargeResponse>> {
    if (!Number.isFinite(credits) || credits <= 0) {
      throw new Error('credits must be a positive number');
    }

    const payload = {
      external_user: normalizeExternalUserIdentity(externalUser),
      input: {
        credits: Math.round(credits),
      },
    };

    return this.post<ExternalCreditsRechargeResponse>('external_users/credits/recharge', payload, options);
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
   * Poll shared-balance payment status for an external user credit purchase.
   */
  async getExternalPaymentStatus(
    payload: ExternalPaymentStatusRequest,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<ExternalPaymentStatusResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };
    if (payload?.external_payment_id) {
      query.external_payment_id = payload.external_payment_id;
    }
    if (payload?.externalPaymentId) {
      query.external_payment_id = payload.externalPaymentId;
    }
    if (payload?.checkoutSessionId) {
      query.checkoutSessionId = payload.checkoutSessionId;
    }
    if (payload?.paymentIntentId) {
      query.paymentIntentId = payload.paymentIntentId;
    }
    if (payload?.setupIntentId) {
      query.setupIntentId = payload.setupIntentId;
    }

    return this.get<ExternalPaymentStatusResponse>('external_users/payment_status', {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * Exchange a login token or verify an auth token against /users/verify_token.
   */
  async verifyClientSession(
    payload: VerifyClientSessionInput,
    options?: SamsarRequestOptions,
  ): Promise<SamsarResult<VerifiedClientSessionResponse>> {
    const query: QueryParams = {
      ...(options?.query ?? {}),
    };

    if (payload?.loginToken) {
      query.loginToken = payload.loginToken;
    }
    if (payload?.authToken) {
      query.authToken = payload.authToken;
    }

    if (!query.loginToken && !query.authToken) {
      throw new Error('loginToken or authToken is required');
    }

    return this.get<VerifiedClientSessionResponse>(this.buildRootUrl('users/verify_token'), {
      ...(options ?? {}),
      query,
    });
  }

  /**
   * Retrieve the status of an asynchronous request by request_id.
   * Defaults to GET /status?request_id={requestId}, but the path can be overridden.
   * Normalizes the response to expose status/result_url for both image and video flows.
   * Completed video responses can also include has_subtitles and result_language.
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
   * Retrieve the status of an external-user-attributed asynchronous request by external request_id.
   */
  async getExternalStatus(
    requestId: string,
    options?: SamsarRequestOptions & { queryParams?: QueryParams },
  ): Promise<SamsarResult<ExternalStatusResponse>> {
    const response = await this.getStatus(requestId, {
      ...options,
      path: 'external_users/status',
    });

    return response as SamsarResult<ExternalStatusResponse>;
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
    const resolvedAppKey = options.appKey?.trim() || (!this.apiKey ? this.appKey : undefined);
    const resolvedAppSecret = options.appSecret?.trim() || this.appSecret;
    const headers: Record<string, string | undefined> = {
      Authorization: resolvedAppKey
        ? `AppKey ${resolvedAppKey}`
        : this.apiKey
          ? `Bearer ${this.apiKey}`
          : undefined,
      'Content-Type': options.body ? 'application/json' : undefined,
      'x-external-user-api-key': options.externalUserApiKey ?? this.externalUserApiKey,
      'x-app-secret': resolvedAppKey ? resolvedAppSecret : undefined,
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

  private buildRootUrl(path: string): string {
    const cleanedPath = path.replace(/^\/+/, '');
    const baseUrl = trimTrailingSlash(this.baseUrl);
    const rootUrl = baseUrl.endsWith('/v1') ? baseUrl.slice(0, -3) : baseUrl;
    return `${rootUrl}/${cleanedPath}`;
  }

  private withV2ExternalUser(
    body: Record<string, unknown>,
    options?: V2RequestOptions,
  ): Record<string, unknown> {
    if (!options?.externalUser) {
      return body;
    }

    return {
      ...body,
      external_user: normalizeExternalUserIdentity(options.externalUser),
    };
  }

  private buildV2Url(path: string): string {
    const cleanedPath = path.replace(/^\/+/, '');
    return this.buildRootUrl(`v2/${cleanedPath}`);
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

function normalizeExternalUserIdentity(externalUser: ExternalUserIdentity): Record<string, unknown> {
  const externalUserId =
    externalUser.external_user_id ??
    externalUser.externalUserId;

  if (!externalUser?.provider || !externalUserId) {
    throw new Error('externalUser.provider and externalUser.external_user_id are required');
  }

  return {
    provider: externalUser.provider,
    external_user_id: externalUserId,
    ...(externalUser.external_app_id || externalUser.externalAppId
      ? { external_app_id: externalUser.external_app_id ?? externalUser.externalAppId }
      : {}),
    ...(externalUser.external_company_id || externalUser.externalCompanyId
      ? { external_company_id: externalUser.external_company_id ?? externalUser.externalCompanyId }
      : {}),
    ...(externalUser.external_account_id || externalUser.externalAccountId
      ? { external_account_id: externalUser.external_account_id ?? externalUser.externalAccountId }
      : {}),
    ...(externalUser.email ? { email: externalUser.email } : {}),
    ...(externalUser.username ? { username: externalUser.username } : {}),
    ...(externalUser.display_name || externalUser.displayName
      ? { display_name: externalUser.display_name ?? externalUser.displayName }
      : {}),
    ...(externalUser.avatar_url || externalUser.avatarUrl
      ? { avatar_url: externalUser.avatar_url ?? externalUser.avatarUrl }
      : {}),
    ...(externalUser.user_type || externalUser.userType
      ? { user_type: externalUser.user_type ?? externalUser.userType }
      : {}),
    ...(externalUser.browser_installation || externalUser.browserInstallation
      ? {
          browser_installation:
            externalUser.browser_installation ?? externalUser.browserInstallation,
        }
      : {}),
    ...(externalUser.metadata ? { metadata: externalUser.metadata } : {}),
  };
}

function buildExternalUserQuery(externalUser: ExternalUserIdentity): QueryParams {
  const normalized = normalizeExternalUserIdentity(externalUser);
  return {
    provider: normalized.provider as string,
    external_user_id: normalized.external_user_id as string,
    external_app_id: (normalized.external_app_id as string | undefined) ?? undefined,
    external_company_id: (normalized.external_company_id as string | undefined) ?? undefined,
    external_account_id: (normalized.external_account_id as string | undefined) ?? undefined,
    email: (normalized.email as string | undefined) ?? undefined,
    username: (normalized.username as string | undefined) ?? undefined,
    display_name: (normalized.display_name as string | undefined) ?? undefined,
    avatar_url: (normalized.avatar_url as string | undefined) ?? undefined,
    user_type: (normalized.user_type as string | undefined) ?? undefined,
  };
}

export default SamsarClient;
