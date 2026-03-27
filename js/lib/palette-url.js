/**
 * Encode/decode palette state to/from URL hash.
 * Format: #p=ff0080,0a0a23,acd157 (hex without # prefix, comma-separated)
 */

export function encodePaletteToHash(colors) {
  if (!colors || colors.length === 0) return '';
  const hexList = colors.map((c) => c.hex.replace(/^#/, '')).join(',');
  return `#p=${hexList}`;
}

export function decodePaletteFromHash(hash) {
  if (!hash || typeof hash !== 'string') return null;
  const match = hash.match(/^#p=(.+)$/);
  if (!match) return null;

  const parts = match[1].split(',').filter(Boolean);
  if (parts.length === 0) return null;

  const colors = [];
  for (const part of parts) {
    const cleaned = part.trim().toLowerCase();
    if (!/^[0-9a-f]{6}$/.test(cleaned)) continue;
    const hex = `#${cleaned}`;
    colors.push({ hex, displayLabel: hex });
  }

  return colors.length > 0 ? colors : null;
}
