/**
 * Export analysis results as markdown, CSV, or JSON.
 */

export function exportAsMarkdown(palette, results) {
  const lines = [
    '# Palette Contrast Analysis',
    '',
    `**Date:** ${new Date().toISOString().split('T')[0]}`,
    `**Colors:** ${palette.length}`,
    `**Combinations:** ${results.length}`,
    '',
    '## Palette',
    '',
    '| Color | Hex |',
    '| --- | --- |',
  ];

  for (const c of palette) {
    lines.push(`| ${c.displayLabel} | ${c.hex} |`);
  }

  lines.push('', '## Results', '');
  lines.push('| Foreground | Background | Ratio | Normal Text | Large Text | Non-text UI |');
  lines.push('| --- | --- | --- | --- | --- | --- |');

  for (const r of results) {
    lines.push(
      `| ${r.foregroundLabel} (${r.foregroundHex}) | ${r.backgroundLabel} (${r.backgroundHex}) | ${r.contrastRatio}:1 | ${r.normalText} | ${r.largeText} | ${r.nonText} |`
    );
  }

  return lines.join('\n');
}

export function exportAsCsv(results) {
  const lines = [
    'foreground_hex,foreground_label,background_hex,background_label,contrast_ratio,normal_text,large_text,non_text',
  ];

  for (const r of results) {
    const fgLabel = r.foregroundLabel.includes(',')
      ? `"${r.foregroundLabel}"`
      : r.foregroundLabel;
    const bgLabel = r.backgroundLabel.includes(',')
      ? `"${r.backgroundLabel}"`
      : r.backgroundLabel;
    lines.push(
      `${r.foregroundHex},${fgLabel},${r.backgroundHex},${bgLabel},${r.contrastRatio},${r.normalText},${r.largeText},${r.nonText}`
    );
  }

  return lines.join('\n');
}

export function exportAsJson(palette, results) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      palette: palette.map((c) => ({
        hex: c.hex,
        displayLabel: c.displayLabel,
      })),
      results: results.map((r) => ({
        foregroundHex: r.foregroundHex,
        foregroundLabel: r.foregroundLabel,
        backgroundHex: r.backgroundHex,
        backgroundLabel: r.backgroundLabel,
        contrastRatio: r.contrastRatio,
        normalText: r.normalText,
        largeText: r.largeText,
        nonText: r.nonText,
        stateChecks: r.stateChecks,
      })),
    },
    null,
    2
  );
}
