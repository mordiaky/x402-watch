const CHAR_WIDTH = 6.5;
const PAD = 10;

function textWidth(text) {
  return Math.round(text.length * CHAR_WIDTH) + PAD * 2;
}

/** Minimal shields.io-style flat badge. No dependencies, no external font metrics service. */
export function renderBadgeSvg(label, message, color) {
  const labelWidth = textWidth(label);
  const messageWidth = textWidth(message);
  const totalWidth = labelWidth + messageWidth;
  const labelX = labelWidth / 2;
  const messageX = labelWidth + messageWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${message}">
<title>${label}: ${message}</title>
<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
<clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${labelWidth}" height="20" fill="#555"/>
<rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
<rect width="${totalWidth}" height="20" fill="url(#s)"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
<text x="${labelX}" y="14">${label}</text>
<text x="${messageX}" y="14">${message}</text>
</g>
</svg>`;
}
