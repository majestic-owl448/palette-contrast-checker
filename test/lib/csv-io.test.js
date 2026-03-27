import { describe, it, expect } from 'vitest';
import { serializePaletteCsv, parsePaletteCsv } from '../../js/lib/csv-io.js';

describe('serializePaletteCsv', () => {
  it('produces header + rows', () => {
    const csv = serializePaletteCsv([
      { hex: '#ff0000', displayLabel: 'red' },
      { hex: '#00ff00', displayLabel: 'green' },
    ]);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('hex,label');
    expect(lines[1]).toBe('#ff0000,red');
    expect(lines[2]).toBe('#00ff00,green');
  });

  it('quotes labels containing commas', () => {
    const csv = serializePaletteCsv([
      { hex: '#ff0000', displayLabel: 'rgb(255, 0, 0)' },
    ]);
    expect(csv).toContain('"rgb(255, 0, 0)"');
  });
});

describe('parsePaletteCsv', () => {
  it('parses valid CSV with header', () => {
    const csv = 'hex,label\n#ff0000,red\n#00ff00,green';
    const { colors, errors } = parsePaletteCsv(csv);
    expect(colors).toHaveLength(2);
    expect(errors).toHaveLength(0);
    expect(colors[0].hex).toBe('#ff0000');
    expect(colors[0].displayLabel).toBe('red');
  });

  it('parses without header', () => {
    const csv = '#ff0000,red\n#00ff00,green';
    const { colors, errors } = parsePaletteCsv(csv);
    expect(colors).toHaveLength(2);
  });

  it('uses hex as label when label is missing', () => {
    const csv = 'hex,label\n#ff0000,\n#00ff00';
    const { colors } = parsePaletteCsv(csv);
    expect(colors[0].displayLabel).toBe('#ff0000');
  });

  it('reports invalid hex rows as errors', () => {
    const csv = 'hex,label\n#ff0000,red\nnot-a-color,bad';
    const { colors, errors } = parsePaletteCsv(csv);
    expect(colors).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('invalid color');
  });

  it('reports duplicate hex rows', () => {
    const csv = 'hex,label\n#ff0000,red\n#ff0000,also red';
    const { colors, errors } = parsePaletteCsv(csv);
    expect(colors).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('duplicate');
  });

  it('handles empty CSV', () => {
    const { colors, errors } = parsePaletteCsv('');
    expect(colors).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('round-trips with serialize', () => {
    const original = [
      { hex: '#ff0000', displayLabel: 'red' },
      { hex: '#00ff00', displayLabel: 'green' },
    ];
    const csv = serializePaletteCsv(original);
    const { colors } = parsePaletteCsv(csv);
    expect(colors).toEqual(original);
  });
});
