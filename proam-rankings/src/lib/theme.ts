/**
 * Theme utility functions for generating CSS variables from theme colors
 */

export interface ThemeColors {
  color_primary?: string | null;
  color_secondary?: string | null;
  color_accent?: string | null;
}

/**
 * Generates CSS variable declarations from theme colors with a prefix
 * @param colors - Theme color object with color_primary, color_secondary, color_accent
 * @param prefix - Prefix for CSS variables (e.g., 'league' or 'team')
 * @returns String of CSS variable declarations or empty string if no colors
 */
export function generateThemeCSSVars(
  colors: ThemeColors | null | undefined,
  prefix: string
): string {
  if (!colors) {
    return '';
  }

  const vars: string[] = [];

  if (colors.color_primary) {
    vars.push(`--${prefix}-primary: ${colors.color_primary};`);
  }

  if (colors.color_secondary) {
    vars.push(`--${prefix}-secondary: ${colors.color_secondary};`);
  }

  if (colors.color_accent) {
    vars.push(`--${prefix}-accent: ${colors.color_accent};`);
  }

  return vars.join(' ');
}

