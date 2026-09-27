// Paper geometry: seeded randomness + "hand-cut" polygons, colour helpers and the shared paper grain.

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const q = (n) => Math.round(n * 10) / 10;
export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

function area(p) {
  let a = 0;
  for (let i = 0; i < p.length; i++) { const u = p[i], v = p[(i + 1) % p.length]; a += u[0] * v[1] - v[0] * u[1]; }
  return a;
}
const orient = (p) => (area(p) < 0 ? p.slice().reverse() : p);

/**
 * A "cutter" is a seeded pair of scissors. Every shape it produces has slightly
 * irregular edges, and the same seed always yields the same cut.
 */
export function makeCutter(seed) {
  const R = mulberry32(typeof seed === 'string' ? hashStr(seed) : seed);
  const r = () => R();
  const rr = (a, b) => a + (b - a) * R();
  const ri = (a, b) => Math.floor(rr(a, b + 1));
  const pick = (arr) => arr[Math.floor(R() * arr.length)];
  const chance = (p) => R() < p;

  // Walk a polygon, subdividing each edge and nudging points sideways so the edge looks scissor-cut.
  function trace(p, j, step) {
    let s = '';
    const n = p.length;
    for (let i = 0; i < n; i++) {
      const a = p[i], b = p[(i + 1) % n];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      const k = Math.max(1, Math.round(L / step)), nx = -dy / L, ny = dx / L;
      for (let t = 0; t < k; t++) {
        let x = a[0] + (dx * t) / k, y = a[1] + (dy * t) / k;
        if (t > 0) { const o = (R() - 0.5) * 2 * j; x += nx * o; y += ny * o; }
        s += (s ? 'L' : 'M') + q(x) + ' ' + q(y);
      }
    }
    return s + 'Z';
  }
  const cut = (p, j = 0.8, step = 8) => trace(orient(p), j, step);
  const hole = (p, j = 0.8, step = 8) => trace(orient(p).slice().reverse(), j, step);
  const poly = (p) => {
    p = orient(p);
    let s = 'M' + q(p[0][0]) + ' ' + q(p[0][1]);
    for (let i = 1; i < p.length; i++) s += 'L' + q(p[i][0]) + ' ' + q(p[i][1]);
    return s + 'Z';
  };
  const line = (p) => p.map((pt, i) => (i ? 'L' : 'M') + q(pt[0]) + ' ' + q(pt[1])).join('');

  const circ = (cx, cy, rad, n) => {
    const p = []; n = n || Math.max(8, Math.round(rad * 1.2));
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; p.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
    return p;
  };
  const ell = (cx, cy, rx, ry, n = 24, rot = 0) => {
    const p = [], cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      p.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return p;
  };
  // irregular ellipse — rocks, bushes, clouds
  const blob = (cx, cy, rx, ry, n = 14, irr = 0.14) => {
    const p = [], ph = R() * 6.28;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ph, k = 1 + (R() - 0.5) * 2 * irr;
      p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return p;
  };
  const arc = (cx, cy, rx, ry, a0, a1, n = 12) => {
    const p = [];
    for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return p;
  };
  const wave = (base, amps, lens) => {
    const ph = amps.map(() => R() * Math.PI * 2);
    return (x) => { let y = base; for (let i = 0; i < amps.length; i++) y += amps[i] * Math.sin((x / lens[i]) * Math.PI * 2 + ph[i]); return y; };
  };
  // A band of land: top edge follows fn(x) from x0 to x1, then drops to `bottom`.
  const ridge = (fn, x0, x1, bottom, step = 12, j = 1) => {
    const p = [];
    for (let x = x0; x <= x1 + step; x += step) p.push([x, fn(x) + (R() - 0.5) * 2 * j]);
    p.push([x1 + step, bottom], [x0, bottom]);
    return poly(p);
  };
  // quadratic / cubic sampling
  const qbez = (a, b, c, n = 16) => {
    const p = [];
    for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; p.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]); }
    return p;
  };
  const cbez = (a, b, c, d, n = 20) => {
    const p = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      p.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
    }
    return p;
  };
  // Thick ribbon along a polyline; width may be a number or fn(t 0..1).
  const ribbon = (pts, width, jit = 0) => {
    const L = [], Rt = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      const w = (typeof width === 'function' ? width(i / (n - 1)) : width) / 2;
      const o = jit ? (R() - 0.5) * jit : 0;
      const nx = -dy / len, ny = dx / len;
      L.push([pts[i][0] + nx * (w + o), pts[i][1] + ny * (w + o)]);
      Rt.push([pts[i][0] - nx * (w - o), pts[i][1] - ny * (w - o)]);
    }
    return poly(L.concat(Rt.reverse()));
  };
  const star = (cx, cy, r1, r2, n = 5, rot = -Math.PI / 2) => {
    const p = [];
    for (let i = 0; i < n * 2; i++) { const a = rot + (i / (n * 2)) * Math.PI * 2, rad = i % 2 ? r2 : r1; p.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
    return p;
  };
  const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const tr = (p, dx, dy, s = 1) => p.map(([x, y]) => [x * s + dx, y * s + dy]);

  return { r, rr, ri, pick, chance, cut, hole, poly, line, circ, ell, blob, arc, wave, ridge, qbez, cbez, ribbon, star, rect, tr, q };
}

/* ---------- a sheet: collects coloured paper pieces and lays grain over all of them ---------- */
export function sheet() {
  const parts = [], ds = [];
  const api = {
    p(d, fill, attrs = '') { parts.push(`<path d="${d}" fill="${fill}"${attrs ? ' ' + attrs : ''}/>`); ds.push(d); return api; },
    // piece without grain (e.g. tiny details, glows)
    x(d, fill, attrs = '') { parts.push(`<path d="${d}" fill="${fill}"${attrs ? ' ' + attrs : ''}/>`); return api; },
    raw(s) { parts.push(s); return api; },
    out(grain = true) {
      const all = ds.join('');
      // geometric shadow: two offset silhouettes, only shown when the piece moves (see .live in css)
      const sh = all ? `<path class="gsh" d="${all}" transform="translate(0 2.2)"/><path class="gsh g2" d="${all}" transform="translate(.5 4.6)"/>` : '';
      return sh + parts.join('') + (grain && all ? `<path class="grain" d="${all}"/>` : '');
    },
  };
  return api;
}

/* ---------- colour ---------- */
function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
export function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return toHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
export const shade = (c, t) => (t < 0 ? mix(c, '#2a1d12', -t) : mix(c, '#fffaf0', t));

/* ---------- paper grain, generated once from noise ---------- */
export function makeGrain(size = 180) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d'), id = g.createImageData(size, size), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = Math.random();
    if (n < 0.5) { d[i] = 74; d[i + 1] = 52; d[i + 2] = 30; d[i + 3] = (0.5 - n) * 44; }
    else { d[i] = 255; d[i + 1] = 251; d[i + 2] = 240; d[i + 3] = (n - 0.5) * 38; }
  }
  g.putImageData(id, 0, 0);
  for (let k = 0; k < 110; k++) {
    g.strokeStyle = k % 3 ? 'rgba(255,252,242,.2)' : 'rgba(96,66,36,.12)';
    g.lineWidth = 0.6;
    g.beginPath();
    const x = Math.random() * size, y = Math.random() * size, a = Math.random() * 6.28, l = 4 + Math.random() * 16;
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  return cv.toDataURL();
}
