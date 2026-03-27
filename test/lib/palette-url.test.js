import { describe, it, expect } from 'vitest';
import { encodePaletteToHash, decodePaletteFromHash } from '../../js/lib/palette-url.js';

describe('encodePaletteToHash', () => {
  it('encodes palette to hash', () => {
    const hash = encodePaletteToHash([
      { hex: '#ff0080', displayLabel: '#ff0080' },
      { hex: '#0a0a23', displayLabel: '#0a0a23' },
    ]);
    expect(hash).toBe('#p=ff0080,0a0a23');
  });

  it('returns empty string for empty palette', () => {
    expect(encodePaletteToHash([])).toBe('');
  });

  it('returns empty string for null', () => {
    expect(encodePaletteToHash(null)).toBe('');
  });
});

describe('decodePaletteFromHash', () => {
  it('decodes valid hash', () => {
    const colors = decodePaletteFromHash('#p=ff0080,0a0a23');
    expect(colors).toHaveLength(2);
    expect(colors[0].hex).toBe('#ff0080');
    expect(colors[1].hex).toBe('#0a0a23');
  });

  it('returns null for empty hash', () => {
    expect(decodePaletteFromHash('')).toBeNull();
  });

  it('returns null for missing prefix', () => {
    expect(decodePaletteFromHash('#ff0080,0a0a23')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(decodePaletteFromHash(null)).toBeNull();
  });

  it('skips invalid hex entries', () => {
    const colors = decodePaletteFromHash('#p=ff0080,gggggg,0a0a23');
    expect(colors).toHaveLength(2);
  });

  it('round-trips with encode', () => {
    const original = [
      { hex: '#ff0080', displayLabel: '#ff0080' },
      { hex: '#0a0a23', displayLabel: '#0a0a23' },
    ];
    const hash = encodePaletteToHash(original);
    const decoded = decodePaletteFromHash(hash);
    expect(decoded).toHaveLength(2);
    expect(decoded[0].hex).toBe('#ff0080');
    expect(decoded[1].hex).toBe('#0a0a23');
  });
});
