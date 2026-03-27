import { describe, it, expect } from 'vitest';
import { rgbToHex, hexToRgb, rgbToHsl, hslToRgb } from '../../js/lib/color-convert.js';

describe('rgbToHex', () => {
  it('converts black', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });

  it('converts white', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('converts a typical color', () => {
    expect(rgbToHex(255, 0, 128)).toBe('#ff0080');
  });

  it('clamps values above 255', () => {
    expect(rgbToHex(300, 0, 0)).toBe('#ff0000');
  });

  it('clamps negative values to 0', () => {
    expect(rgbToHex(-10, 0, 0)).toBe('#000000');
  });
});

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#ff0080')).toEqual({ r: 255, g: 0, b: 128 });
  });

  it('parses 3-digit hex', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses without # prefix', () => {
    expect(hexToRgb('ff0080')).toEqual({ r: 255, g: 0, b: 128 });
  });

  it('parses 8-digit hex (ignores alpha)', () => {
    expect(hexToRgb('#ff008080')).toEqual({ r: 255, g: 0, b: 128 });
  });

  it('parses 4-digit hex (ignores alpha)', () => {
    expect(hexToRgb('#f00a')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('is case insensitive', () => {
    expect(hexToRgb('#FF0080')).toEqual({ r: 255, g: 0, b: 128 });
  });

  it('returns null for invalid hex', () => {
    expect(hexToRgb('#gggggg')).toBeNull();
  });

  it('returns null for wrong length', () => {
    expect(hexToRgb('#12345')).toBeNull();
  });
});

describe('rgbToHsl', () => {
  it('converts black', () => {
    expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
  });

  it('converts white', () => {
    expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
  });

  it('converts pure red', () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('converts pure green', () => {
    expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
  });

  it('converts pure blue', () => {
    expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
  });
});

describe('hslToRgb', () => {
  it('converts black', () => {
    expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts white', () => {
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts pure red', () => {
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts pure green', () => {
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('converts pure blue', () => {
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('handles hue wrapping', () => {
    expect(hslToRgb(360, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe('round-trip rgb -> hsl -> rgb', () => {
  const cases = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [128, 64, 192],
    [10, 10, 35],
  ];

  for (const [r, g, b] of cases) {
    it(`round-trips (${r}, ${g}, ${b})`, () => {
      const hsl = rgbToHsl(r, g, b);
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      // Allow ±1 for rounding
      expect(Math.abs(rgb.r - r)).toBeLessThanOrEqual(1);
      expect(Math.abs(rgb.g - g)).toBeLessThanOrEqual(1);
      expect(Math.abs(rgb.b - b)).toBeLessThanOrEqual(1);
    });
  }
});
