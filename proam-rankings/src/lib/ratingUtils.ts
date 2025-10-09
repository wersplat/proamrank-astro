// Utility functions for player global rating system

export type RatingTier = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' | 'Unranked';

/**
 * Get color classes for a rating tier
 */
export function getRatingTierColor(tier: RatingTier | string | null): string {
  switch (tier) {
    case 'S+':
      return 'bg-gold/20 text-gold border-gold/30';
    case 'S':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'A':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'B':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'C':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'D':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'Unranked':
    default:
      return 'bg-neutral-800 text-neutral-400 border-neutral-700';
  }
}

/**
 * Get label for a rating tier
 */
export function getRatingTierLabel(tier: RatingTier | string | null): string {
  switch (tier) {
    case 'S+':
      return 'Legendary';
    case 'S':
      return 'Elite';
    case 'A':
      return 'All-Star';
    case 'B':
      return 'Starter';
    case 'C':
      return 'Role Player';
    case 'D':
      return 'Bench';
    case 'Unranked':
    default:
      return 'Unranked';
  }
}

/**
 * Get rating range text for a tier
 */
export function getRatingTierRange(tier: RatingTier | string | null): string {
  switch (tier) {
    case 'S+':
      return '95+';
    case 'S':
      return '90-94';
    case 'A':
      return '85-89';
    case 'B':
      return '80-84';
    case 'C':
      return '75-79';
    case 'D':
      return '70-74';
    case 'Unranked':
    default:
      return '< 70';
  }
}

/**
 * Format days inactive to readable text
 */
export function formatDaysInactive(days: number | null): string {
  if (!days || days <= 0) return 'Active';
  if (days <= 30) return 'Active';
  if (days <= 60) return `${Math.round(days)} days ago`;
  if (days <= 90) return `${Math.round(days)} days ago`;
  if (days <= 180) return `${Math.round(days / 30)} months ago`;
  return `${Math.round(days / 30)} months ago`;
}

/**
 * Get activity status color
 */
export function getActivityStatusColor(days: number | null): string {
  if (!days || days <= 30) return 'text-green-400';
  if (days <= 60) return 'text-yellow-400';
  if (days <= 90) return 'text-orange-400';
  return 'text-red-400';
}

