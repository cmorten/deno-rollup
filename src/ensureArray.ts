/**
 * ensureArray
 * 
 * @param {any} items
 * @returns {any[]}
 * @private
 */
export function ensureArray<T>(
  items: (T | null | undefined)[] | T | null | undefined,
): T[] {
  if (Array.isArray(items)) {
    return items.filter(Boolean) as T[];
  } else if (items) {
    return [items];
  }

  return [];
}
