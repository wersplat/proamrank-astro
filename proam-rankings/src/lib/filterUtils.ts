/**
 * Build a query string from filter parameters
 * Useful for maintaining filters in pagination links
 */
export function buildFilterQuery(filters: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== 'all' && value !== '') {
      params.set(key, value);
    }
  }
  
  const query = params.toString();
  return query ? `&${query}` : '';
}

/**
 * Check if any filters are active (excluding defaults)
 */
export function hasActiveFilters(filters: Record<string, string | undefined>, defaults: Record<string, string> = {}): boolean {
  for (const [key, value] of Object.entries(filters)) {
    const defaultValue = defaults[key] || 'all';
    if (value && value !== defaultValue && value !== '') {
      return true;
    }
  }
  return false;
}

