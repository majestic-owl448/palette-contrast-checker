/**
 * Palette CSV import/export.
 * Format: hex,label (one row per color, with header).
 */

import { parseColor, canonicalize } from './color-parse.js';

export function serializePaletteCsv(colors) {
  const lines = ['hex,label'];
  for (const c of colors) {
    const label = c.displayLabel.includes(',')
      ? `"${c.displayLabel.replace(/"/g, '""')}"`
      : c.displayLabel;
    lines.push(`${c.hex},${label}`);
  }
  return lines.join('\n');
}

export function parsePaletteCsv(csvText) {
  const colors = [];
  const errors = [];
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length === 0) {
    errors.push('Empty CSV file.');
    return { colors, errors };
  }

  // Check for header
  const firstLine = lines[0].trim().toLowerCase();
  const startIdx = firstLine.startsWith('hex') ? 1 : 0;

  const seenHexes = new Set();

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCsvLine(line);
    const rawHex = parts[0]?.trim();
    const rawLabel = parts[1]?.trim() || '';

    if (!rawHex) {
      errors.push(`Row ${i + 1}: empty hex value.`);
      continue;
    }

    const hex = canonicalize(rawHex);
    if (!hex) {
      errors.push(`Row ${i + 1}: invalid color "${rawHex}".`);
      continue;
    }

    if (seenHexes.has(hex)) {
      errors.push(`Row ${i + 1}: duplicate color ${hex} (skipped).`);
      continue;
    }

    seenHexes.add(hex);
    colors.push({
      hex,
      displayLabel: rawLabel || hex,
    });
  }

  return { colors, errors };
}

function parseCsvLine(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        parts.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  parts.push(current);
  return parts;
}
