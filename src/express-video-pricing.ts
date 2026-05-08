export const EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND = {
  pipeline: 4,
  inference: 4,
  image_gen_edit: 2,
  speech: 2,
  music: 2,
  effects_and_lipsync: 2,
} as const;

export type ExpressVideoPricingDistribution = typeof EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND & {
  video: number;
  total: number;
};

export const EXPRESS_VIDEO_FIXED_COMPONENTS_TOTAL_PER_SECOND = Object.values(
  EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND,
).reduce((total, value) => total + value, 0);

export const EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL = {
  'VEO3.1I2V': 60,
  'VEO3.1I2VFAST': 36,
  SEEDANCEI2V: 30,
  KLINGIMGTOVID3PRO: 36,
  KLINGIMGTOVIDTURBO: 36,
  RUNWAYML: 30,
} as const;

export const EXPRESS_VIDEO_PRICING_DISTRIBUTION_PER_SECOND_BY_MODEL = Object.fromEntries(
  Object.entries(EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL)
    .map(([model, total]) => [
      model,
      {
        ...EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND,
        video: total - EXPRESS_VIDEO_FIXED_COMPONENTS_TOTAL_PER_SECOND,
        total,
      },
    ]),
) as Record<string, ExpressVideoPricingDistribution>;

export function getExpressVideoCreditsPerSecond(model: string | null | undefined) {
  const modelKey = typeof model === 'string' ? model.trim().toUpperCase() : '';
  return EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL[
    modelKey as keyof typeof EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL
  ] ?? null;
}

export function getExpressVideoPricingDistributionPerSecond(model: string | null | undefined) {
  const modelKey = typeof model === 'string' ? model.trim().toUpperCase() : '';
  return EXPRESS_VIDEO_PRICING_DISTRIBUTION_PER_SECOND_BY_MODEL[modelKey] ?? null;
}
