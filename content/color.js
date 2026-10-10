/* ColorGuide classification — personal continuation of the original team project.
 * Human-readable color families are heuristics, not measurements of physical fabric.
 * Keep this file identical in the extension and any standalone demo.
 */
(function (root) {
  'use strict';
  function channels(r, g, b) {
    if (![r, g, b].every(v => typeof v === 'number' && Number.isFinite(v))) {
      throw new TypeError('RGB channels must be finite numbers.');
    }
    return [r, g, b].map(v => Math.max(0, Math.min(255, v)));
  }
  function rgbToHsl(r, g, b) {
    [r, g, b] = channels(r, g, b).map(v => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const l = (max + min) / 2;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h = (h * 60 + 360) % 360;
    }
    return [h, d === 0 ? 0 : 100 * d / (1 - Math.abs(2 * l - 1)), l * 100];
  }
  function colorNameTranslate(r, g, b) {
    [r, g, b] = channels(r, g, b);
    const [h, saturation, lightness] = rgbToHsl(r, g, b);
    const s = saturation / 100, l = lightness / 100;
    const spread = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    // Resolve neutrals first, so tiny channel differences cannot create a hue label.
    if (l <= .055 || (l <= .10 && s < .15)) return 'Black';
    if (l >= .965 || (l >= .92 && spread < .035)) return 'White';
    if (s < .10 || spread < .025) return l < .32 ? 'Dark Gray' : l > .72 ? 'Light Gray' : 'Gray';
    // Brown/tan are warm hues at lower chroma/lightness, not just very dark orange.
    if (h >= 10 && h < 48 && (l < .43 || (s < .55 && l < .78))) {
      return l < .23 ? 'Dark Brown' : l >= .58 ? 'Light Brown' : 'Brown';
    }
    // Avoid calling khaki/olive tones bright yellow or orange.
    if (h >= 48 && h < 75 && (l < .43 || (s < .48 && l < .68))) {
      return l < .23 ? 'Dark Olive' : l >= .55 ? 'Light Olive' : 'Olive';
    }
    let family;
    if (h < 15 || h >= 345) family = l >= .70 ? 'Pink' : 'Red';
    else if (h < 45) family = 'Orange';
    else if (h < 65) family = 'Yellow';
    else if (h < 165) family = 'Green';
    else if (h < 200) family = 'Teal';
    else if (h < 255) family = 'Blue';
    else if (h < 295) family = 'Purple';
    else family = 'Pink';
    const prefix = l < .30 ? 'Dark ' : l >= .72 ? 'Light ' : '';
    return prefix + family;
  }
  function classifyHex(hex) {
    if (typeof hex !== 'string' || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
      throw new TypeError('Use a three- or six-digit hex color.');
    }
    let value = hex.slice(1);
    if (value.length === 3) value = [...value].map(c => c + c).join('');
    return colorNameTranslate(...[0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16)));
  }
  function rgbToHex(r, g, b) {
    return '#' + channels(r, g, b).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function sampleColor(context, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new TypeError('Pixel coordinates must be finite.');
    const w = context.canvas.width, h = context.canvas.height;
    if (!w || !h) return 'Unknown';
    const cx = Math.max(0, Math.min(w - 1, Math.round(x)));
    const cy = Math.max(0, Math.min(h - 1, Math.round(y)));
    const left = Math.max(0, cx - 2), top = Math.max(0, cy - 2);
    const width = Math.min(w - 1, cx + 2) - left + 1;
    const height = Math.min(h - 1, cy + 2) - top + 1;
    const pixels = context.getImageData(left, top, width, height).data;
    const counts = new Map();
    let centerName;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) continue;
      const name = colorNameTranslate(pixels[i], pixels[i + 1], pixels[i + 2]);
      counts.set(name, (counts.get(name) || 0) + 1);
      if (i / 4 === (cy - top) * width + cx - left) centerName = name;
    }
    if (!counts.size) return 'Unknown';
    const max = Math.max(...counts.values());
    // On an equal vote, prefer the clicked pixel; otherwise use a stable name order.
    if (counts.get(centerName) === max) return centerName;
    return [...counts.keys()].filter(name => counts.get(name) === max).sort()[0];
  }
  const api = {colorNameTranslate, classifyHex, rgbToHsl, rgbToHex, sampleColor};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.ColorGuide = api; Object.assign(root, {colorNameTranslate, rgbToHsl, rgbToHex}); }
})(typeof globalThis !== 'undefined' ? globalThis : this);

// Adapter for the original extension's shared screenshot canvas.
function getColor(x, y) { return ColorGuide.sampleColor(tempContext, x, y); }
