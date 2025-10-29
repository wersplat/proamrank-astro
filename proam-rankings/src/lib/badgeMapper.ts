import badgesManifest from '../data/badges_manifest.json';

interface BadgeItem {
  id: string;
  name: string;
  slug: string;
  rarity: string;
  category: string;
  file: string;
}

interface BadgesManifest {
  items: BadgeItem[];
}

const manifest = badgesManifest as BadgesManifest;

// Create a map of badge names to slugs for quick lookup
const nameToSlugMap = new Map<string, string>();
manifest.items.forEach((item) => {
  nameToSlugMap.set(item.name.toLowerCase(), item.slug);
});

/**
 * Normalizes a badge title to match potential variations in the manifest
 */
function normalizeBadgeTitle(title: string): string {
  return title.trim().toLowerCase();
}

/**
 * Maps an achievement rule name to a badge slug from the manifest
 * Returns null if no matching badge is found
 */
export function getBadgeSlug(badgeTitle: string): string | null {
  const normalized = normalizeBadgeTitle(badgeTitle);
  
  // Direct lookup
  const slug = nameToSlugMap.get(normalized);
  if (slug) {
    return slug;
  }
  
  // Handle variations and edge cases
  // Remove periods from numbers (e.g., "2.5K" -> "25k")
  const withoutPeriods = normalized.replace(/\./g, '');
  const slugWithoutPeriods = nameToSlugMap.get(withoutPeriods);
  if (slugWithoutPeriods) {
    return slugWithoutPeriods;
  }
  
  // Try with common substitutions
  const variations = [
    normalized.replace(/\s+/g, '-'), // "Triple Double" -> "triple-double"
    normalized.replace(/\s*-\s*/g, '-'), // Normalize hyphens
  ];
  
  for (const variation of variations) {
    const foundSlug = nameToSlugMap.get(variation);
    if (foundSlug) {
      return foundSlug;
    }
  }
  
  return null;
}

/**
 * Gets the full badge URL from R2 CDN
 * Returns null if badge is not found or r2BaseUrl is not provided
 */
export function getBadgeUrl(badgeTitle: string, r2BaseUrl: string | undefined): string | null {
  if (!r2BaseUrl) {
    return null;
  }
  
  const slug = getBadgeSlug(badgeTitle);
  if (!slug) {
    return null;
  }
  
  // Ensure r2BaseUrl doesn't have trailing slash
  const baseUrl = r2BaseUrl.replace(/\/$/, '');
  
  return `${baseUrl}/badges_full_set/${slug}.svg`;
}

