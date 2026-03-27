/**
 * Duplicate color detection.
 * All functions are pure — no DOM access.
 */

export function findDuplicate(newHex, palette) {
  const normalized = newHex.toLowerCase();
  const match = palette.find((c) => c.hex.toLowerCase() === normalized);
  return match
    ? { isDuplicate: true, existingId: match.id }
    : { isDuplicate: false, existingId: null };
}

export function findDuplicateGroups(palette) {
  const groups = new Map();

  for (const color of palette) {
    const hex = color.hex.toLowerCase();
    if (!groups.has(hex)) {
      groups.set(hex, []);
    }
    groups.get(hex).push({ id: color.id, displayLabel: color.displayLabel });
  }

  return Array.from(groups.entries())
    .filter(([, entries]) => entries.length > 1)
    .map(([hex, entries]) => ({ hex, entries }));
}
