// Mt 18,21–22 — back in the house at Capernaum. Peter gets up and comes to Jesus: how often must I forgive my
// brother? — a question mark and the broken jar in his bubble. "Seven times?" He counts it off on his fingers, and
// seven chalk strokes appear one by one on the wall over them; he stands a little taller at his own generosity.
// Jesus shakes His head and lifts His hand: not seven — seventy-seven. Row after row of strokes sweeps across the
// wall, far more than anyone could count, a number tag drops from the flies, and the whole tally begins to glow.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { capHouse, SEATS, FLOOR, TWELVE, speech, GLYPH, strip, hungWords, kf, headAt, hanging, tr, PI } from './lib.js';
import { swing } from '../kit.js';

const JX = 800, JY = 628;
const MX0 = 566, MY0 = 316;            // the tally on the back wall
const ST = 13, GAP = 16, ROWH = 22;

function strokeD(c, x, h = 18) { return c.ribbon([[x + c.rr(-1, 1), 0], [x + c.rr(-1, 1), h]], 3); }
function slashD(c, x0, x1, h = 18) { return c.ribbon([[x0, h * 0.85], [x1, h * 0.15]], 3); }
/** a row of ten strokes (two groups of five) starting at x = 0; origin: top-left */
function rowOfTen(c) {
  let d = '', x = 0;
  for (let g = 0; g < 2; g++) {
    const x0 = x;
    for (let i = 0; i < 4; i++) { d += strokeD(c, x); x += ST; }
    d += slashD(c, x0 - 4, x - ST + 5);
    x += GAP;
  }
  return d;
}

export default {
  id: 'mt18-seventy',
  beats: [
    { v: 21, text: 'Wtedy Piotr zbliżył się do Niego i zapytał: «Panie, ile razy mam przebaczyć, jeśli mój brat wykroczy przeciwko mnie?' },
    { v: 21, cont: true, text: 'Czy aż siedem razy?»' },
    { v: 22 },
  ],
  cam: { x: [-40, 20], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const H = capHouse(S);
    const c = S.c;
    const ink = mix(C.ink, C.plaster2, 0.25);

    /* the tally: the first seven strokes one by one, then seven rows of ten */
    const tallyL = S.layer({ par: H.P, sh: 1, flat: true });
    const glowT = tallyL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="260" ry="120" fill="url(#halo-glow)"/></g>`);
    const first = [];
    { let x = 0; for (let i = 0; i < 7; i++) { const d = i === 4 ? slashD(c, -4, 4 * ST - ST + 5) : strokeD(c, x); first.push(tallyL.add(`<g opacity="0"><path d="${d}" fill="${ink}"/></g>`)); if (i !== 4) x += ST; else x += GAP; } }
    const rows = Array.from({ length: 7 }, (_, r) => ({ r, el: tallyL.add(`<g opacity="0"><path d="${rowOfTen(c)}" fill="${ink}"/></g>`) }));

    /* the disciples, sitting round; Peter; Jesus */
    const inL = S.layer({ par: H.P, sh: 5 });
    const sitters = TWELVE.slice(1, 10).map((d, i) => { const seat = [0, 1, 2, 3, 5, 6, 7, 8, 9][i]; const [x, s] = SEATS[seat]; return { x, s, flip: x > JX, seed: c.rr(0, 9), p: S.puppet(inL.add(person(c, { ...d.o, pose: 'sit' }))) }; });
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const peter = S.puppet(inL.add(person(c, CAST.peter)));
    const fx = S.layer({ par: H.P, sh: 4 });
    const shards = sheet().p(c.cut([[-26, 0], [-20, -16], [-8, -20], [-4, -6], [-12, 0]], 0.3, 3) + c.cut([[2, 0], [6, -14], [18, -18], [24, -4], [16, 0]], 0.3, 3), C.pot).out();
    const ask = fx.add(`<g opacity="0">${speech(c, `<g transform="translate(-14 12) scale(.7)">${shards}</g><g transform="translate(16 0) scale(.75)">${GLYPH.q(c)}</g>`, { w: 80, h: 54 })}</g>`);
    const seven = fx.add(`<g opacity="0">${speech(c, `<text x="0" y="10" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">7?</text>`, { w: 60, h: 46 })}</g>`);
    const answer = fx.add(`<g opacity="0">${speech(c, `<text x="0" y="11" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">${tr('77 razy', '70 × 7')}</text>`, { w: 124, h: 52 })}</g>`);
    H.front();

    return (t, time) => {
      const T = time;
      H.update(T);

      /* v21a — Peter comes and asks */
      const pw = es(t, 0.0, 0.35);
      const px = lerp(H.door, 690, pw);
      const askK = bump(t, 0.35, 1.0);
      const count = es(t, 1.05, 1.55);
      const proud = es(t, 1.55, 1.75) * (1 - es(t, 2.05, 2.2));
      const aghast = es(t, 2.2, 2.45);
      peter.set({ x: px, y: lerp(FLOOR - 4, 646, pw), s: lerp(0.72, 0.9, pw), flip: false, walk: pw > 0 && pw < 1 ? px * 0.06 : undefined, armF: 20 + askK * 50 + count * 30 * (1 - aghast) + aghast * 40, armB: 10 + bump(t, 1.05, 1.6) * 90 + aghast * 110, head: -askK * 4 - proud * 8 - aghast * 16, lean: -proud * 4 - aghast * 10, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(690, 646, 0.9, false);
      pose(ask, { x: phx + 14, y: phy - 14, s: es(t, 0.35, 0.47, ease.back), o: askK > 0.05 ? 1 : 0 });
      const sk = bump(t, 1.2, 1.98);
      pose(seven, { x: phx + 12, y: phy - 14, s: es(t, 1.2, 1.32, ease.back), o: sk > 0.05 ? 1 : 0 });

      /* v21b — seven strokes, one by one */
      first.forEach((el, i) => { const a = 1.08 + i * 0.07; pose(el, { x: MX0, y: MY0, s: 1, o: es(t, a, a + 0.05) }); });
      /* v22 — seventy-seven: the rows sweep across */
      rows.forEach(({ r, el }) => { const a = 2.12 + r * 0.07; const k = es(t, a, a + 0.12); const slot = r + 1; pose(el, { x: MX0 + (slot % 4) * 145, y: MY0 + Math.floor(slot / 4) * ROWH * 1.3, sx: k, o: k > 0.01 ? 1 : 0 }); });
      const gl = es(t, 2.55, 2.85);
      pose(glowT, { x: MX0 + 290, y: MY0 + 20, s: 0.8 + gl * 0.4, o: gl * 0.9 });
      const [jhx, jhy] = headAt(JX, JY, 0.94, false, 62);
      pose(answer, { x: jhx + 18, y: jhy - 16, s: es(t, 2.25, 2.4, ease.back), o: t > 2.25 ? 1 : 0 });

      const shake = bump(t, 2.02, 2.4);
      jesus.set({ x: JX, y: JY, s: 0.94, armF: 20 + bump(t, 0.4, 1.0) * 20 + es(t, 2.1, 2.3) * 60, armB: 10 + es(t, 2.2, 2.45) * 120, head: Math.sin(t * 30) * 6 * shake - es(t, 2.3, 2.6) * 6, blink: blinkAt(T, 1) });
      sitters.forEach((d) => d.p.set({ x: d.x, y: 648, s: d.s, flip: d.flip, head: -es(t, 1.1, 1.4) * 10 - es(t, 2.2, 2.5) * 10, armF: 20 + es(t, 2.3, 2.6) * 30, blink: blinkAt(T, d.seed) }));

      S.cam.x = kf(t, [[0, -30], [0.4, -20], [1.0, -10], [2.0, 0]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 20], [2.0, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [2.0, 1.04]]);
    };
  },
};
