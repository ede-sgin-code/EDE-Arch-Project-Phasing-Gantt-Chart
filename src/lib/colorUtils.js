// Returns whichever of black or white gives better contrast against the
// given "#rrggbb" background color, so labels stay legible on any bar color.
export function getContrastTextColor(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return '#1f2937';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1f2937' : '#ffffff';
}
