import { describe, it, expect } from 'vitest';
import { exportAsMarkdown, exportAsCsv, exportAsJson } from '../../js/lib/export-analysis.js';

const palette = [
  { hex: '#000000', displayLabel: 'black' },
  { hex: '#ffffff', displayLabel: 'white' },
];

const results = [
  {
    foregroundHex: '#000000',
    foregroundLabel: 'black',
    backgroundHex: '#ffffff',
    backgroundLabel: 'white',
    contrastRatio: 21,
    normalText: 'AAA',
    largeText: 'AAA',
    nonText: 'AA',
    stateChecks: { hover: {}, focus: {}, active: {}, disabled: {} },
  },
  {
    foregroundHex: '#ffffff',
    foregroundLabel: 'white',
    backgroundHex: '#000000',
    backgroundLabel: 'black',
    contrastRatio: 21,
    normalText: 'AAA',
    largeText: 'AAA',
    nonText: 'AA',
    stateChecks: { hover: {}, focus: {}, active: {}, disabled: {} },
  },
];

describe('exportAsMarkdown', () => {
  it('produces valid markdown', () => {
    const md = exportAsMarkdown(palette, results);
    expect(md).toContain('# Palette Contrast Analysis');
    expect(md).toContain('**Colors:** 2');
    expect(md).toContain('**Combinations:** 2');
    expect(md).toContain('black');
    expect(md).toContain('21:1');
  });
});

describe('exportAsCsv', () => {
  it('produces CSV with header', () => {
    const csv = exportAsCsv(results);
    const lines = csv.split('\n');
    expect(lines[0]).toContain('foreground_hex');
    expect(lines).toHaveLength(3);
  });
});

describe('exportAsJson', () => {
  it('produces valid JSON', () => {
    const json = exportAsJson(palette, results);
    const parsed = JSON.parse(json);
    expect(parsed.palette).toHaveLength(2);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.exportedAt).toBeTruthy();
  });
});
