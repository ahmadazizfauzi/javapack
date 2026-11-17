/**
 * Typography scale tokens synced with FigCraft 01. Design Tokens (base_typography).
 */

export const baseTypography = {
  "3xl": "text-3xl font-bold tracking-tight",
  "2xl": "text-2xl font-bold tracking-tight",
  xl: "text-xl font-bold",
  lg: "text-lg font-semibold",
  md: "text-base font-medium",
  sm: "text-sm font-normal",
  xs: "text-xs font-medium",
} as const;

export type BaseTypographyScale = keyof typeof baseTypography;
