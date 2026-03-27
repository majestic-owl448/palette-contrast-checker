import { describe, it, expect } from 'vitest';
import { findDuplicate, findDuplicateGroups } from '../../js/lib/duplicates.js';

describe('findDuplicate', () => {
  const palette = [
    { id: '1', hex: '#ff0000', displayLabel: 'red' },
    { id: '2', hex: '#00ff00', displayLabel: 'green' },
  ];

  it('detects a duplicate', () => {
    expect(findDuplicate('#ff0000', palette)).toEqual({
      isDuplicate: true,
      existingId: '1',
    });
  });

  it('is case insensitive', () => {
    expect(findDuplicate('#FF0000', palette)).toEqual({
      isDuplicate: true,
      existingId: '1',
    });
  });

  it('returns not duplicate for new color', () => {
    expect(findDuplicate('#0000ff', palette)).toEqual({
      isDuplicate: false,
      existingId: null,
    });
  });
});

describe('findDuplicateGroups', () => {
  it('returns empty when no duplicates', () => {
    const palette = [
      { id: '1', hex: '#ff0000', displayLabel: 'red' },
      { id: '2', hex: '#00ff00', displayLabel: 'green' },
    ];
    expect(findDuplicateGroups(palette)).toEqual([]);
  });

  it('groups duplicates together', () => {
    const palette = [
      { id: '1', hex: '#ff0000', displayLabel: 'red' },
      { id: '2', hex: '#FF0000', displayLabel: 'rgb(255,0,0)' },
      { id: '3', hex: '#00ff00', displayLabel: 'green' },
    ];
    const groups = findDuplicateGroups(palette);
    expect(groups).toHaveLength(1);
    expect(groups[0].hex).toBe('#ff0000');
    expect(groups[0].entries).toHaveLength(2);
  });
});
