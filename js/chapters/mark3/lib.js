// Mark 3 — shared cut-outs for this chapter: the other apostles, Pharisees and scribes,
// name tags, cards, speech bubbles, stone hearts, doves, torn paper and a few more.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose } from '../kit.js';
import { tr } from '../../core/i18n.js';

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';
const DY = { stand: 0, kneel: 46, sit: 62 };

/* ---------- the cast of this chapter ---------- */
export const LOOK = {
  philip: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather },
  bartholomew: { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3 },
  jamesA: { robe: C.linen2, mantle: C.tealRobe, hair: C.hair, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin4 },
  thaddaeus: { robe: C.lavender, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin },
  simonZ: { robe: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.terracotta, beard: 'full', skin: C.skin4, belt: C.leather },
  judas: { robe: mix(C.dustyBlue, C.storm, 0.5), mantle: shade(C.wood3, -0.05), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  mary: { robe: C.linen2, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.dustyBlue, veil2: shade(C.dustyBlue, -0.12), skin: C.skin, hair: C.hair },
};

/** the Twelve in the order Mark names them */
export const TWELVE = [
  { k: 'peter', o: CAST.peter, name: () => tr('Szymon', 'Simon') },
  { k: 'james', o: CAST.james, name: () => tr('Jakub', 'James') },
  { k: 'john', o: CAST.john, name: () => tr('Jan', 'John') },
  { k: 'andrew', o: CAST.andrew, name: () => tr('Andrzej', 'Andrew') },
  { k: 'philip', o: LOOK.philip, name: () => tr('Filip', 'Philip') },
  { k: 'bartholomew', o: LOOK.bartholomew, name: () => tr('Bartłomiej', 'Bartholomew') },
  { k: 'matthew', o: CAST.matthew, name: () => tr('Mateusz', 'Matthew') },
  { k: 'thomas', o: CAST.thomas, name: () => tr('Tomasz', 'Thomas') },
  { k: 'jamesA', o: LOOK.jamesA, name: () => tr(['Jakub,', 'syn Alfeusza'], ['James,', 'son of Alphaeus']) },
  { k: 'thaddaeus', o: LOOK.thaddaeus, name: () => tr('Tadeusz', 'Thaddaeus') },
  { k: 'simonZ', o: LOOK.simonZ, name: () => tr(['Szymon', 'Gorliwy'], ['Simon', 'the Zealot']) },
  { k: 'judas', o: LOOK.judas, name: () => tr(['Judasz', 'Iskariota'], ['Judas', 'Iscariot']) },
];

/** a Pharisee: prayer-shawl head-wrap with a blue band, long beard, cream robes */
export function pharisee(c, i = 0) {
  const robes = [C.linen2, C.stone, C.linen, C.wheatRobe, C.stone2];
  const mantles = [C.dustyBlue, C.skyVeil, C.tealRobe, C.dustyBlue, C.lavender];
  return {
    robe: robes[i % robes.length], mantle: mantles[i % mantles.length], skin: [C.skin2, C.skin, C.skin3][i % 3],
    hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: [C.dustyBlue, C.tealRobe, C.indigo][i % 3],
    beard: i % 2 ? 'wild' : 'full', beardColor: [C.greyHair, C.hair3, C.hair][i % 3], belt: C.leather,
  };
}
/** a scribe from Jerusalem: rich robes, a scroll in hand */
export function scribe(c, i = 0) {
  return {
    robe: [C.plumRobe, C.tealRobe, C.mauve][i % 3], mantle: [C.linen2, C.stone, C.cream][i % 3], skin: [C.skin, C.skin2, C.skin3][i % 3],
    hair: C.hair3, hairStyle: 'wrap', veil: [C.linen2, C.stone, C.cream][i % 3], veil2: [C.plumRobe, C.teal2, C.mauve][i % 3],
    beard: 'full', beardColor: [C.greyHair, C.hair3, C.hair2][i % 3], belt: C.ochre, holdF: scrollRoll(c),
  };
}
/** a man of Herod's party: purple and gold */
export function herodian(c, i = 0) {
  return { robe: [C.plumRobe, C.indigo][i % 2], mantle: C.ochre, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'short' };
}
/** a man from the crowd (never veiled) */
export function man(c, extra = {}) {
  const o = crowdPerson(c, extra);
  if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; }
  return o;
}
export function woman(c, extra = {}) {
  return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra };
}
/** a paper silhouette of anybody (for shadow-play) */
export function silhouette(o, col = '#3b2a22') {
  return { ...o, robe: col, mantle: o.mantle ? shade(col, 0.06) : null, skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: o.belt ? shade(col, 0.1) : null, halo: false, holdF: '', holdB: '' };
}

/** a shadow-play cut-out of a person: one dark colour, no blush */
export function shadowPerson(c, o, col = '#3b2a22') {
  return person(c, { ...silhouette(o, col), holdF: '', holdB: '' }).split(`fill="${C.blush}"`).join(`fill="${col}"`);
}

/* ---------- walking along roads ---------- */
/** sample a polyline at u ∈ [0,1] → [x, y, dir] (dir: -1 heading left, 1 heading right) */
export function along(pts, u) {
  let total = 0;
  const segs = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); total += l; }
  let d = Math.max(0, Math.min(1, u)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = segs[i] ? Math.min(1, d / segs[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k, pts[i + 1][0] >= pts[i][0] ? 1 : -1];
    }
    d -= segs[i];
  }
  const n = pts.length - 1;
  return [pts[n][0], pts[n][1], 1];
}

/* ---------- where things are on a puppet ---------- */
export function headAt(x, y, s, flip, p = 'stand') { return [x + 2 * s * (flip ? -1 : 1), y + (-167 + DY[p]) * s]; }
/** approximate position of a puppet's front hand (arm angle a in degrees) */
export function handAt(x, y, s, flip, a, p = 'stand') {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + DY[p] - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s];
}
/** add extra paper bits to a puppet's head (drawn on top of the face; they turn with it) */
export function withFace(markup, extra) { return markup.replace('</g></g><g class="armF"', `${extra}</g></g><g class="armF"`); }
/** brows (angry / grieved) and a tear, hidden until needed: data-part="angry" | "sad" | "tear" */
export function faceBits(c) {
  const ink = C.inkSoft;
  const angry = c.ribbon([[-1.5, -10.5], [7.5, -6.2]], 2.8) + c.ribbon([[9.8, -6.4], [17, -10.2]], 2.6);
  const sad = c.ribbon([[-1, -6.6], [7.2, -10.4]], 2.5) + c.ribbon([[10, -10.4], [16.5, -6.8]], 2.4);
  const tear = c.cut([[13, 1], [16.2, 7], [15.4, 10.4], [12.8, 11], [11.2, 7.6], [12.2, 3]], 0.1, 2);
  return `<g data-part="angry" opacity="0"><path d="${angry}" fill="${ink}"/></g><g data-part="sad" opacity="0"><path d="${sad}" fill="${ink}"/></g><g data-part="tear" opacity="0"><path d="${tear}" fill="#bfe0ee"/><path d="${c.poly(c.circ(12.9, 5.4, 0.9, 6))}" fill="#fff"/></g>`;
}

/* ---------- small props ---------- */
export function scrollRoll(c) {
  return sheet().p(c.cut([[-15, -6], [15, -6], [15, 6], [-15, 6]], 0.3, 5), C.parchment)
    .p(c.cut(c.ell(-16, 0, 3.4, 8, 10), 0.2, 3) + c.cut(c.ell(16, 0, 3.4, 8, 10), 0.2, 3), C.wood2).out();
}
export function waxTablet(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-16, -12, 32, 24), 0.3, 5), C.wood2).p(c.cut(c.rect(-12, -8, 24, 16), 0.2, 5), C.soilDark);
  s.x(c.ribbon([[-8, -3], [6, -4]], 1) + c.ribbon([[-8, 2], [3, 1.5]], 1), C.wheat, 'opacity=".8"');
  return s.out();
}
/** a crutch, planted at its foot (0,0) */
export function crutch(c, h = 120) {
  return sheet().p(c.ribbon([[0, 0], [2, -h]], 5), C.wood3).p(c.ribbon([[-12, -h], [14, -h - 2]], 6), C.wood2).out();
}
/** a warm spark of light */
export function spark(c, r = 11) {
  const s = sheet();
  s.p(c.cut(c.star(0, 0, r, r * 0.36, 4, 0), 0.2, 3), C.halo);
  s.x(c.poly(c.circ(0, 0, r * 0.27, 8)), C.star);
  return `<circle r="${r * 3}" fill="url(#warm-glow)" opacity=".8"/>${s.out()}`;
}
export function sparkle(c, r = 16) {
  return `<path d="${c.poly(c.star(0, 0, r, r * 0.22, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(r * 0.9, -r * 0.8, r * 0.4, r * 0.1, 4, 0.4))}" fill="${C.star}"/>`;
}
/** a heart turned to stone: grey, cracked */
export function stoneHeart(c, r = 22) {
  const pts = [...c.arc(-r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI * 0.8, PI * 2, 10), ...c.arc(r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI, PI * 2.2, 10), [0, r * 0.95]];
  const s = sheet();
  s.p(c.cut(pts, 1.1, 5), C.rock2);
  s.x(c.cut([[-r * 0.55, -r * 0.45], [-r * 0.2, -r * 0.62], [-r * 0.05, -r * 0.3], [-r * 0.4, -r * 0.2]], 0.4, 4), shade(C.rock2, 0.35), 'opacity=".7"');
  s.x(c.ribbon([[r * 0.05, -r * 0.55], [-r * 0.08, -r * 0.2], [r * 0.14, r * 0.05], [0, r * 0.4]], 1.6) + c.ribbon([[r * 0.14, r * 0.05], [r * 0.42, r * 0.12]], 1.2), shade(C.rock3, -0.3));
  return s.out();
}
/** a warm, living heart */
export function heart(c, r = 22, color = C.jesusMantle) {
  const pts = [...c.arc(-r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI * 0.8, PI * 2, 10), ...c.arc(r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI, PI * 2.2, 10), [0, r * 0.95]];
  return sheet().p(c.cut(pts, 0.5, 5), color).x(c.cut(c.ell(-r * 0.45, -r * 0.35, r * 0.16, r * 0.1, 8, -0.6), 0.2, 3), shade(color, 0.45), 'opacity=".8"').out();
}
/** two strips of paper tape crossed over a mouth */
export function tapeX(c, w = 18) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -3], [w / 2, -6], [w / 2 + 1, -1], [-w / 2 + 1, 2]], 0.3, 4), C.cream);
  s.p(c.cut([[-w / 2, -5], [w / 2 - 1, -1], [w / 2 - 2, 3.5], [-w / 2 - 1, -0.5]], 0.3, 4), C.linen);
  return s.out();
}
/** two long strips of tape crossed over something (a speech bubble, a door) */
export function tapeCross(c, w, h, width = 14) {
  const s = sheet();
  s.p(c.ribbon([[-w / 2, -h / 2], [w / 2, h / 2]], width, 1.5), C.cream, 'opacity=".95"');
  s.p(c.ribbon([[-w / 2, h / 2], [w / 2, -h / 2]], width, 1.5), C.linen, 'opacity=".95"');
  return s.out();
}
/** a curl of dark smoke — an unclean spirit, a whisper of plotting */
export function wisp(c, sc = 1, col = '#4a3f52') {
  const pts = c.cbez([0, 0], [-14 * sc, -16 * sc], [16 * sc, -26 * sc], [2 * sc, -44 * sc], 14);
  const s = sheet();
  s.p(c.ribbon(pts, (t) => (1 - t) * 10 * sc + 1.5), col, 'opacity=".85"');
  s.x(c.poly(c.circ(-2 * sc, -12 * sc, 1.6 * sc, 6)) + c.poly(c.circ(4 * sc, -13 * sc, 1.6 * sc, 6)), C.cream);
  return s.out();
}
/** the dove of the Spirit, wings spread, facing down-left */
export function dove(c, { k } = {}) {
  const s = sheet();
  const body = [[-30, 4], [-14, -6], [8, -8], [24, -4], [34, 4], [24, 10], [6, 12], [-12, 10], [-26, 16], [-40, 22], [-34, 10]];
  s.p(c.cut(body, 0.4, 4), '#fffdf6');
  s.p(c.cut(c.circ(26, -4, 9, 12), 0.3, 3), '#fffdf6');
  s.x(c.poly([[34, -4], [42, -1], [34, 1]]), C.ochre);
  s.x(c.poly(c.circ(28, -6, 1.5, 6)), C.ink);
  const wing = (flip) => {
    const f = flip ? -1 : 1;
    return c.cut([[-4, -2], [-16, -30 * f], [-6, -48 * f], [8, -60 * f], [14, -44 * f], [18, -26 * f], [14, -6 * f]].map(([x, y]) => [x, y]), 0.4, 4);
  };
  return `<g${k ? ` data-k="${k}"` : ''}><g class="wingB"><path d="${wing(false)}" fill="#f2ecdd"/></g>${s.out()}<g class="wingF"><path d="${wing(false)}" fill="#fffaf0" transform="translate(4 2) scale(1 .92)"/></g></g>`;
}

/* ---------- paper words ---------- */
/** a luggage tag with a name (one line, or an array of two), hung from its hole at (0,0) */
export function nameTag(c, text, { size = 17, dark = false, w, back } = {}) {
  const lines = Array.isArray(text) ? text : [text];
  const longest = Math.max(...lines.map((l) => l.length));
  const ww = w || Math.max(58, size * (0.5 * longest + 1.7));
  const h0 = size * (0.75 + lines.length * 1.1);
  const h = h0 + size * 0.3;          // room under the words, so descenders stay on the paper
  const s = sheet();
  const fill = dark ? mix(C.storm, C.stone2, 0.25) : C.cream;
  const pts = [[-ww / 2 + 10, 6], [ww / 2 - 10, 6], [ww / 2, 16], [ww / 2, 6 + h], [-ww / 2, 6 + h], [-ww / 2, 16]];
  s.p(c.cut(pts, 0.5, 6), fill);
  s.p(c.cut([[-ww / 2 + 5, 20], [ww / 2 - 5, 20], [ww / 2 - 5, 2 + h], [-ww / 2 + 5, 2 + h]], 0.3, 6), dark ? mix(C.storm, C.stone2, 0.4) : C.parchment);
  s.x(c.poly(c.circ(0, 12, 3.2, 10)), dark ? C.storm2 : C.wood2);
  const ink = dark ? C.cream : C.ink;
  const y0 = 12 + (h0 - lines.length * size * 1.1) / 2 + size * 0.95;
  const txt = lines.map((l, i) => `<text x="0" y="${(y0 + i * size * 1.1).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  return `${s.out()}${txt}`;
}
/** a speech bubble with one or two lines of text; tail at (tx, ty) relative to the bubble's bottom centre */
export function bubble(c, lines, { size = 20, fill = C.cream, ink = C.ink, tail = -1, w, dark = false } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.6;
  const hh = lines.length * size * 1.15 + size * 0.9;
  const s = sheet();
  const pts = c.blob(0, -hh / 2 - 14, ww / 2, hh / 2, 18, 0.05);
  s.p(c.cut([...pts], 0.6, 6), fill);
  s.p(c.cut([[tail * 8 - 8, -18], [tail * 22, 2], [tail * 8 + 8, -20]], 0.4, 4), fill);
  const t0 = -hh / 2 - 14 - ((lines.length - 1) * size * 1.15) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="0" y="${(t0 + i * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** words on a small torn strip of paper (a label pinned to a map, a caption on a card) */
export function strip(c, text, { size = 16, fill = C.cream, ink = C.ink, w, italic = true } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.2;
  const hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}"${italic ? ' font-style="italic"' : ''} fill="${ink}">${text}</text>`;
}
/** a hand-cut "?" on a little paper speech bubble */
export function question(c, { fill = C.cream, ink = C.terracotta } = {}) {
  const s = sheet();
  s.p(c.cut([...c.blob(0, -4, 21, 24, 12, 0.07), [6, 20], [2, 30], [-5, 19]], 0.5, 5), fill);
  const hook = c.arc(0, -11, 8, 8, PI * 1.02, PI * 2.5, 12);
  hook.push([0, 1.5]);
  s.x(c.ribbon(hook, 4.6), ink);
  s.x(c.cut(c.circ(0, 9, 3.1, 8), 0.2, 2), ink);
  return s.out();
}
/** a picture card on a string: cream card, parchment face, icon, a word underneath */
export function card(c, icon, word, { w = 110, h = 128, face = C.parchment, ink = C.ink } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), C.cream);
  s.p(c.cut(c.rect(-w / 2 + 7, 7, w - 14, h - 14), 0.4, 8), face);
  return `${s.out()}<g transform="translate(0 ${h * 0.42})">${icon}</g><text x="0" y="${h - 16}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${ink}">${word}</text>`;
}

/* ---------- torn paper ---------- */
/**
 * Tear a picture in two along a jagged line.
 * inner: markup drawn in both halves; box: [x0, y0, x1, y1]; tearX: where the tear runs (roughly vertical).
 * Returns { left, right } markup, each clipped to its half. ids must be unique (use S.id()).
 */
export function tornPair(c, inner, [x0, y0, x1, y1], tearX, id) {
  const tear = [];
  const n = 14;
  for (let i = 0; i <= n; i++) tear.push([tearX + c.rr(-16, 16) + (i % 2 ? 8 : -8), y0 - 40 + ((y1 - y0 + 80) * i) / n]);
  const L = c.poly([[x0 - 400, y0 - 40], ...tear, [x0 - 400, y1 + 40]]);
  const R = c.poly([[x1 + 400, y0 - 40], ...tear, [x1 + 400, y1 + 40]]);
  const edge = c.ribbon(tear, 3.2);
  const defs = `<defs><clipPath id="${id}-l"><path d="${L}"/></clipPath><clipPath id="${id}-r"><path d="${R}"/></clipPath></defs>`;
  return {
    left: `${defs}<g clip-path="url(#${id}-l)">${inner}<path d="${edge}" fill="${C.cream}" opacity=".9"/></g>`,
    right: `<g clip-path="url(#${id}-r)">${inner}<path d="${edge}" fill="${C.cream}" opacity=".9"/></g>`,
  };
}

/* ---------- a withered hand (worn as the puppet's holdF, over the hand) ---------- */
export function witheredHand(c) {
  const grey = mix(C.skin2, C.rock3, 0.55);
  const w = sheet();
  // shrunken, curled fingers folded into the palm
  w.p(c.cut([[-6, -4], [4, -6], [8, -1], [8, 5], [5, 9], [0, 10], [-5, 8], [-8, 3]], 0.3, 3), grey);
  w.p(c.ribbon(c.arc(6, 5, 5, 5, -PI * 0.5, PI * 0.8, 8), 2.6) + c.ribbon(c.arc(2, 8, 4, 4, 0, PI * 1.1, 8), 2.2), shade(grey, -0.12));
  w.x(c.ribbon([[-4, 0], [3, -1]], 0.9) + c.ribbon([[-4, 4], [2, 4]], 0.9), shade(grey, -0.3), 'opacity=".7"');
  // the healed, open hand
  const h = sheet();
  const skin = C.skin2;
  h.p(c.cut(c.circ(0, 0, 7, 12), 0.2, 3), skin);
  let f = '';
  [[-0.9, 11], [-0.35, 13], [0.15, 13], [0.6, 11.5]].forEach(([a, l]) => { const b = PI / 2 + a * 0.55; f += c.ribbon([[Math.cos(b) * 4, Math.sin(b) * 4], [Math.cos(b) * l, Math.sin(b) * l]], 3.4); });
  f += c.ribbon([[5, -1], [11, -6]], 3.4);
  h.p(f, skin);
  return `<g transform="scale(1.45)"><g data-part="well" opacity="0"><circle r="30" fill="url(#warm-glow)"/>${h.out()}</g><g data-part="wither">${w.out()}</g></g>`;
}

/* ---------- a little thundercloud for the Sons of Thunder ---------- */
export function thunderCloud(c, w = 120) {
  const h = w * 0.34, s = sheet();
  const pts = [[-w / 2, 0]];
  for (let i = 0; i < 4; i++) { const cx = -w / 2 + (w * (i + 0.5)) / 4, rr = (w / 4) * c.rr(0.75, 1.1); pts.push(...c.arc(cx, -h * 0.25, rr, rr * 0.9, PI, 2 * PI, 8).map(([x, y]) => [x, Math.min(y, 0)])); }
  pts.push([w / 2, 0]);
  s.p(c.cut([[-w / 2 + 6, -2], [w / 2 - 6, -2], [w / 2 - 14, 12], [-w / 2 + 14, 12]], 0.5, 8), C.storm2);
  s.p(c.cut(pts, 0.8, 6), mix(C.storm, C.lavender, 0.35));
  const bolt = [[-6, 10], [12, 10], [2, 34], [16, 34], [-14, 84], [-4, 46], [-16, 46]];
  return `${s.out()}<g data-part="bolt" opacity="0"><path d="${c.cut(bolt, 0.3, 4)}" fill="${C.sun}"/></g>`;
}

/* ---------- a house cut open like a doll's house (used for 3,20–21 and 3,31–35) ---------- */
/**
 * houseSection(c, { x0, x1, floor, ceil }) → { back, front, stairs, door, win }
 * back: the inside back wall with an open door (left) and a window (right), holes cut through so the
 *       outside shows; front: the cut faces of the side walls, roof slab and floor; stairs: outside, right.
 */
export function houseSection(c, { x0 = 540, x1 = 1060, floor = 640, ceil = 330, doorX = 70, doorW = 80, doorH = 176 } = {}) {
  const door = [x0 + doorX, x0 + doorX + doorW, floor - doorH];
  const win = [x1 - 170, x1 - 96, ceil + 64, ceil + 146];
  const b = sheet();
  const doorPts = [[door[0], floor + 2], [door[0], door[2] + 36], ...c.arc((door[0] + door[1]) / 2, door[2] + 36, (door[1] - door[0]) / 2, 36, PI, 2 * PI, 10), [door[1], floor + 2]];
  const winPts = [[win[0], win[3]], [win[0], win[2] + 24], ...c.arc((win[0] + win[1]) / 2, win[2] + 24, (win[1] - win[0]) / 2, 24, PI, 2 * PI, 8), [win[1], win[3]]];
  b.p(c.cut([[x0, ceil], [x1, ceil], [x1, floor + 4], [x0, floor + 4]], 0.8, 12) + c.hole(doorPts, 0.5, 6) + c.hole(winPts, 0.5, 6), C.plaster);
  let patch = '';
  for (let i = 0; i < 9; i++) patch += c.cut(c.blob(c.rr(x0 + 30, x1 - 30), c.rr(ceil + 30, floor - 60), c.rr(20, 50), c.rr(10, 22), 10, 0.2), 0.6, 6);
  b.x(patch, C.plaster2, 'opacity=".6"');
  b.p(c.cut([[x0, floor - 44], [x1, floor - 44], [x1, floor + 4], [x0, floor + 4]], 0.6, 10), C.plaster2);
  // ceiling beams seen from inside
  let beams = '';
  for (let x = x0 + 30; x < x1; x += 70) beams += c.cut(c.rect(x - 7, ceil, 14, 12), 0.3, 4);
  b.p(beams, C.wood2);
  // door frame, window frame and bars
  b.p(c.ribbon([[door[0] - 4, floor + 2], [door[0] - 4, door[2] + 36]], 7) + c.ribbon([[door[1] + 4, floor + 2], [door[1] + 4, door[2] + 36]], 7) + c.ribbon(c.arc((door[0] + door[1]) / 2, door[2] + 36, (door[1] - door[0]) / 2 + 4, 40, PI, 2 * PI, 10), 7), C.wood2);
  b.p(c.ribbon([[win[0] - 4, win[3] + 3], [win[1] + 4, win[3] + 3]], 7) + c.ribbon([[(win[0] + win[1]) / 2, win[2] + 2], [(win[0] + win[1]) / 2, win[3]]], 4) + c.ribbon([[win[0], win[2] + 50], [win[1], win[2] + 50]], 4), C.wood2);
  // a shelf with jars, a lamp niche, herbs
  const sx = (door[1] + win[0]) / 2;
  b.p(c.cut([[sx - 80, ceil + 120], [sx + 80, ceil + 120], [sx + 80, ceil + 128], [sx - 80, ceil + 128]], 0.3, 6), C.wood2);
  b.p(c.cut([[sx - 64, ceil + 120], [sx - 70, ceil + 100], [sx - 60, ceil + 84], [sx - 44, ceil + 84], [sx - 34, ceil + 100], [sx - 40, ceil + 120]], 0.4, 5) + c.cut([[sx + 10, ceil + 120], [sx + 4, ceil + 96], [sx + 20, ceil + 90], [sx + 36, ceil + 96], [sx + 30, ceil + 120]], 0.4, 5), C.pot);
  b.p(c.cut(c.arc(sx - 4, ceil + 120, 20, 14, PI, 2 * PI, 8), 0.3, 4), C.clay);
  b.p(c.ribbon([[x1 - 40, ceil + 14], [x1 - 44, ceil + 110]], 3) + c.ribbon([[x1 - 24, ceil + 14], [x1 - 20, ceil + 96]], 3), C.moss);
  // the floor and a woven mat
  b.p(c.cut([[x0, floor], [x1, floor], [x1 + 10, floor + 30], [x0 - 10, floor + 30]], 0.6, 10), mix(C.sand2, C.stone2, 0.4));
  b.p(c.cut([[x0 + 150, floor + 4], [x1 - 150, floor + 4], [x1 - 136, floor + 26], [x0 + 136, floor + 26]], 0.5, 8), C.basket);
  let weave = '';
  for (let x = x0 + 160; x < x1 - 150; x += 18) weave += c.ribbon([[x, floor + 6], [x - 3, floor + 25]], 2);
  b.x(weave, shade(C.basket, -0.2), 'opacity=".6"');

  const f = sheet();
  const wallCol = C.stone;
  // side walls, cut through (thick edges with a stone hatch)
  f.p(c.cut([[x0 - 28, ceil - 34], [x0, ceil - 34], [x0, floor + 30], [x0 - 34, floor + 30]], 0.6, 10), wallCol);
  f.p(c.cut([[x1, ceil - 34], [x1 + 28, ceil - 34], [x1 + 34, floor + 30], [x1, floor + 30]], 0.6, 10), wallCol);
  // roof slab: beams, reeds and packed earth, with a low parapet
  f.p(c.cut([[x0 - 40, ceil - 34], [x1 + 40, ceil - 34], [x1 + 40, ceil + 2], [x0 - 40, ceil + 2]], 0.8, 10), mix(C.clay, C.sand2, 0.4));
  let ends = '';
  for (let x = x0 - 20; x < x1 + 30; x += 36) ends += c.cut(c.circ(x, ceil - 10, 6, 10), 0.3, 3);
  f.p(ends, C.wood3);
  f.p(c.cut([[x0 - 40, ceil - 58], [x0 - 4, ceil - 58], [x0 - 4, ceil - 34], [x0 - 40, ceil - 34]], 0.4, 6) + c.cut([[x1 + 4, ceil - 58], [x1 + 40, ceil - 58], [x1 + 40, ceil - 34], [x1 + 4, ceil - 34]], 0.4, 6), C.plaster2);
  let hatch = '';
  for (let y = ceil; y < floor + 20; y += 26) { hatch += c.ribbon([[x0 - 30, y], [x0 - 2, y + 2]], 1.2) + c.ribbon([[x1 + 2, y + 1], [x1 + 30, y]], 1.2); }
  f.x(hatch, shade(wallCol, -0.15), 'opacity=".7"');
  // the front edge of the floor
  f.p(c.cut([[x0 - 34, floor + 26], [x1 + 34, floor + 26], [x1 + 34, floor + 46], [x0 - 34, floor + 46]], 0.6, 10), C.stone2);

  // outside stairs up to the roof, on the right
  const st = sheet();
  const n = 8, sx0 = x1 + 34, sy0 = floor + 30, sx1 = x1 + 190, sy1 = ceil - 34;
  st.p(c.cut([[sx0, sy1], [sx0 + 30, sy1], [sx1, sy0], [sx0, sy0]], 0.6, 8), mix(C.stone, C.plaster2, 0.5));
  let steps = '';
  for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; const x = lerpN(sx1, sx0 + 30, u), y = lerpN(sy0, sy1, u); steps += c.cut([[x - 26, y], [x + 4, y], [x + 4, y + 5], [x - 26, y + 5]], 0.2, 4); }
  st.p(steps, C.stone2);
  return { back: b.out(), front: f.out(), stairs: st.out(), door, win, roofY: ceil - 34, stepAt: (u) => [lerpN(sx1 - 12, sx0 + 18, u), lerpN(sy0, sy1, u)] };
}
const lerpN = (a, b, t) => a + (b - a) * t;

/** a round loaf of bread */
export function loaf(c, r = 12) {
  return sheet().p(c.cut(c.ell(0, -r * 0.5, r, r * 0.6, 14), 0.4, 4), C.ochre).x(c.ribbon([[-r * 0.5, -r * 0.8], [-r * 0.2, -r * 0.2]], 1.4) + c.ribbon([[r * 0.1, -r * 0.9], [r * 0.4, -r * 0.3]], 1.4), shade(C.ochre, -0.25), 'opacity=".7"').out();
}
/** a hand-cut spiral — a head spinning */
export function spiral(c, r = 12, col = C.terracotta) {
  const pts = [];
  for (let i = 0; i <= 40; i++) { const a = i * 0.42, rr = (i / 40) * r; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  return `<path d="${c.ribbon(pts, 2.6)}" fill="${col}"/>`;
}
