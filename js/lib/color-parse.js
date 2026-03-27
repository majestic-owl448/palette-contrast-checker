/**
 * Parse any supported CSS color string into {r, g, b}.
 * Supported formats: hex, rgb(), hsl(), CSS named colors.
 * Alpha channels are accepted but ignored.
 */

import { hexToRgb, hslToRgb, rgbToHex } from './color-convert.js';
import { namedColorToHex } from './color-names.js';

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_RE =
  /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i;
const HSL_RE =
  /^hsla?\(\s*(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i;

export function parseColor(input) {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try hex
  const hexMatch = trimmed.match(HEX_RE);
  if (hexMatch) {
    return hexToRgb(hexMatch[1]);
  }

  // Try rgb/rgba
  const rgbMatch = trimmed.match(RGB_RE);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r > 255 || g > 255 || b > 255) return null;
    return { r, g, b };
  }

  // Try hsl/hsla
  const hslMatch = trimmed.match(HSL_RE);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    if (h > 360 || s > 100 || l > 100) return null;
    return hslToRgb(h, s, l);
  }

  // Try named color
  const hex = namedColorToHex(trimmed);
  if (hex) {
    return hexToRgb(hex);
  }

  return null;
}

export function identifyFormat(input) {
  if (typeof input !== 'string') return { format: null, normalized: null };
  const trimmed = input.trim();
  if (!trimmed) return { format: null, normalized: null };

  if (HEX_RE.test(trimmed)) return { format: 'hex', normalized: trimmed };
  if (RGB_RE.test(trimmed)) return { format: 'rgb', normalized: trimmed };
  if (HSL_RE.test(trimmed)) return { format: 'hsl', normalized: trimmed };
  if (namedColorToHex(trimmed)) return { format: 'named', normalized: trimmed };

  return { format: null, normalized: null };
}

export function canonicalize(input) {
  const rgb = parseColor(input);
  if (!rgb) return null;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
