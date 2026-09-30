// J 7,40–44 — the crowd argues over Him. Some: "Truly this is the Prophet!" (a hanging scroll of the prophets);
// others: "This is the Christ!" (a crown and the horn of anointing). But the scribes: "Does the Christ come from
// Galilee?" — a map of the land comes down, Galilee and Nazareth lit. "Has not Scripture said: from David's line,
// from Bethlehem, David's town?" — Bethlehem glows under David's crown. A division arises because of Him: the
// paving cracks between them and the two sides step apart. Some want to seize Him — their hands stop at the
// ring of light; no one lays a hand on Him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { oilHorn } from '../mark8/lib.js';
import { bubble as bubble5 } from '../mark5/lib.js';
import { scrollParts } from '../mark1/lib.js';
import {
  feastCourt, PH, councilScribe, pilgrim, townMan, townWoman, headAt, strip, nameTag, crown, landMap, LANDMAP, roundel,
  hangAt, vpose, GREAT, tr, PI,
} from './lib.js';

const JX = 800;
const AXW = [380, 452];          // "the Prophet"
const BXW = [540, 612];          // "the Christ"
const DXW = [1000, 1080, 1160];  // the doubters
const MAPS = 0.5, MXW = 600, MY = 336;

export default {
  id: 'j7-division',
  beats: [
    { v: 40 },
    { v: 41, text: 'Inni mówili: «To jest Mesjasz».' },
    { v: 41, cont: true, text: '«Ale - mówili drudzy - czyż Mesjasz przyjdzie z Galilei?' },
    { v: 42 },
    { v: 43 },
    { v: 44 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [0.85, 1.16] },
  build(S) {
    const c = S.c;
    const ph = (wide, phone) => (S.portrait ? phone : wide);   // phone: plates and people at the sides come inward
    const AX = ph(AXW, [452, 514]), BX = ph(BXW, [580, 644]), DX = ph(DXW, [990, 1058, 1126]), MX = ph(MXW, 630), AP = ph(1, 0.5);
    const set = feastCourt(S, { skyCols: GREAT, lit: 0.3 });
    const F = set.F + 20;

    /* the crack in the paving (between the two sides) */
    const CL = S.layer({ par: 0.49, sh: 0, flat: true });
    const crackPts = [];
    for (let i = 0; i <= 12; i++) crackPts.push([900 + (i % 2 ? 16 : -16) + c.rr(-6, 6) - i * 6, 600 + i * 34]);
    const crack = CL.add(`<g><path d="${c.ribbon(crackPts.map(([x, y]) => [x + 4, y + 3]), (u) => 8 + u * 22)}" fill="${mix(C.stone2, C.stone, 0.3)}"/><path d="${c.ribbon(crackPts, (u) => 6 + u * 18)}" fill="${mix(C.soilDark, C.stone2, 0.25)}"/><path d="${c.ribbon(crackPts.map(([x, y]) => [x + 3, y]), (u) => 1 + u * 3)}" fill="${C.cream}" opacity=".6"/></g>`);
    const ring = CL.add(`<g><ellipse cx="0" cy="0" rx="120" ry="24" fill="none" stroke="${C.sun}" stroke-width="5" opacity=".9"/><ellipse cx="0" cy="0" rx="120" ry="24" fill="#fff3cf" opacity=".35"/><path d="M-120 0C-120 -260 120 -260 120 0" fill="url(#halo-glow)" opacity=".6"/></g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const A = AX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(i ? person(c, townWoman(c)) : pilgrim(c, 1, { lulavA: 60 }))) }));
    const B = BX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, i ? townMan(c) : townWoman(c)))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const D = DX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(i === 1 ? councilScribe(c, 2, {}) : person(c, PH(c, i + 3)))) }));
    set.front();

    /* words and plates */
    const X = S.layer({ par: 0.5, sh: 6 });
    const sp = scrollParts(c, { w: 150, h: 90, lines: 4 });
    const prophetP = hanging(X, `${sp.rod}<g>${sp.sheet}</g><g transform="translate(0 90)">${sp.rod}</g><g transform="translate(0 120)">${strip(c, tr('Prorok', 'the Prophet'), { size: 18 })}</g>`, { x: ph(470, 580), y: 290, len: 600 });
    const prophetB = X.add(`<g>${bubble5(c, tr(['Ten prawdziwie', 'jest prorokiem!'], ['This is truly', 'the prophet!']), { size: 19, dir: -1 })}</g>`);
    const christP = hanging(X, `${roundel(c, `<rect x="-80" y="-80" width="160" height="160" fill="${mix(C.parchment, C.halo, 0.4)}"/><circle r="60" fill="url(#halo-glow)"/><g transform="translate(0 70) scale(2.2)">${crown(c)}</g><g transform="translate(-34 -6) scale(1.1)">${oilHorn(c)}</g>`, { r: 62, face: C.parchment, id: S.id('christ') })}<g transform="translate(0 82)">${strip(c, tr('Mesjasz', 'the Christ'), { size: 18 })}</g>`, { x: 700, y: 310, len: 600 });
    const christB = X.add(`<g>${bubble5(c, tr('To jest Mesjasz!', 'This is the Christ!'), { size: 20, dir: -1 })}</g>`);
    const galB = X.add(`<g>${bubble5(c, tr(['Czyż Mesjasz przyjdzie', 'z Galilei?'], ['Does the Christ', 'come out of Galilee?']), { size: 18, dir: 1 })}</g>`);
    const mapEl = hanging(X, `<g transform="scale(${MAPS})">${landMap(c)}</g>`, { x: MX, y: MY, len: 700 });
    const at = ([x, y], my) => [MX + x * MAPS, my + y * MAPS];
    const nazGlow = X.add(`<g><circle r="46" fill="url(#warm-glow)"/><circle r="16" fill="none" stroke="${C.terracotta}" stroke-width="3"/></g>`);
    const qNaz = X.add(`<g><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="34" font-style="italic" fill="${C.terracotta}">?</text></g>`);
    const bethGlow = X.add(`<g><circle r="60" fill="url(#halo-glow)"/><circle r="16" fill="none" stroke="${C.sun}" stroke-width="3"/></g>`);
    const davidCrown = X.add(`<g transform="scale(1.3)">${crown(c)}</g>`);
    const davidT = X.add(`<g>${strip(c, tr('z rodu Dawida — z Betlejem', 'of David — from Bethlehem'), { size: 15 })}</g>`);
    const splitT = hanging(X, nameTag(c, tr(['rozdwojenie', 'z Jego powodu'], ['a division', 'because of Him']), { size: 18 }), { x: 900, y: 320, len: 600 });

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.3 });

      /* the sides step apart in v43; some reach out in v44 */
      const apart = es(t, 4.1, 4.5) * AP;
      const reach = es(t, 5.1, 5.4) * (1 - es(t, 5.75, 5.95));
      const stop = es(t, 5.35, 5.5);
      jesus.set({ x: JX, y: F, s: 1.04, flip: t > 1.9 && t < 4, armF: 20 + bump(t, 0.1, 0.9) * 20, armB: 10, head: bump(t, 4.1, 4.9) * 8, blink: blinkAt(T, 1) });
      A.forEach((m) => m.p.set({ x: m.x - apart * 40, y: F + 6 + m.i * 6, s: 0.94, armF: (m.i ? 16 : 60) + bump(t, 0.1, 0.9) * (m.i ? 70 : 20), armB: 10 + bump(t, 0.1, 0.9) * 30, head: -bump(t, 0.1, 0.9) * 6 - apart * 4, blink: blinkAt(T, m.seed) }));
      B.forEach((m) => m.p.set({ x: m.x - apart * 30, y: F + 6 + m.i * 6, s: 0.94, flip: false, armF: 16 + bump(t, 1.1, 1.9) * (m.i ? 30 : 80), armB: 10 + bump(t, 1.1, 1.9) * 40, head: -bump(t, 1.1, 1.9) * 6, blink: blinkAt(T, m.seed) }));
      D.forEach((m) => m.p.set({ x: m.x + apart * 40 - reach * (m.i === 0 ? 80 : 40) + stop * reach * 20, y: F + (m.i % 2) * 6, s: 0.98, flip: true, armF: 20 + bump(t, 2.1, 3.9) * (m.i === 1 ? 50 : 20) + reach * 70, armB: 10 + bump(t, 2.1, 2.9) * 40 * (m.i === 0 ? 1 : 0), head: bump(t, 2.1, 2.9) * 8 - reach * 4, lean: -reach * 6 + stop * reach * 6, blink: blinkAt(T, m.seed) }));

      /* v40 — the Prophet */
      const [ax, ay] = headAt(AX[1], F + 12, 0.94, false);
      vpose(prophetB, { x: ax + 10, y: ay - 18, s: es(t, 0.1, 0.3, ease.back), o: seg(t, 0.1, 0.15) * (1 - es(t, 0.9, 1.0)) });
      const pk = es(t, 0.3, 0.6, ease.out), pu = es(t, 0.95, 1.1, ease.in);
      hangAt(prophetP, ph(470, 580), lerp(-300, ph(290, 250), pk) - pu * 700, T, pk > 0 && pu < 1 ? 1 : 0, 1.2, 0.9, 1);

      /* v41a — the Christ */
      const [bx, by] = headAt(BX[0], F + 6, 0.94, false);
      vpose(christB, { x: bx + 10, y: by - 18, s: es(t, 1.1, 1.3, ease.back), o: seg(t, 1.1, 1.15) * (1 - es(t, 1.9, 2.0)) });
      const ck = es(t, 1.3, 1.6, ease.out), cu = es(t, 1.95, 2.1, ease.in);
      hangAt(christP, 700, lerp(-300, 300, ck) - cu * 700, T, ck > 0 && cu < 1 ? 1 : 0, 1.2, 0.9, 2);

      /* v41b — from Galilee? The map */
      const [dx, dy] = headAt(DX[0], F, 0.98, true);
      vpose(galB, { x: dx - 10, y: dy - 18, s: es(t, 2.1, 2.3, ease.back), o: seg(t, 2.1, 2.15) * (1 - es(t, 2.95, 3.05)) });
      const mk = es(t, 2.2, 2.55, ease.out), mu = es(t, 3.95, 4.1, ease.in);
      const my = lerp(-400, MY, mk) - mu * 800;
      const mOn = mk > 0 && mu < 1;
      hangAt(mapEl, MX, my, T, mOn ? 1 : 0, 0.6, 0.7, 3);
      const [nx, ny] = at(LANDMAP.naz, my);
      vpose(nazGlow, { x: nx, y: ny, o: mOn ? es(t, 2.5, 2.65) * (1 - es(t, 3.2, 3.4) * 0.6) : 0 });
      vpose(qNaz, { x: nx + 22, y: ny - 14, s: es(t, 2.55, 2.7, ease.back), o: mOn ? seg(t, 2.55, 2.6) : 0 });

      /* v42 — David's line, Bethlehem */
      const [ex, ey] = at(LANDMAP.beth, my);
      const bk = es(t, 3.1, 3.3);
      vpose(bethGlow, { x: ex, y: ey, s: 0.8 + bk * 0.3, o: mOn ? bk : 0 });
      vpose(davidCrown, { x: ex + 2, y: ey - 14 - bk * 8, s: 1.3 * es(t, 3.15, 3.35, ease.back), o: mOn ? seg(t, 3.15, 3.2) : 0 });
      vpose(davidT, { x: MX, y: my + 190, o: mOn ? es(t, 3.3, 3.45) : 0 });

      /* v43 — a division because of Him */
      const ck2 = es(t, 4.05, 4.35);
      if (ck2 > 0) pose(crack, { y: 600, sy: Math.max(0.02, ck2), oy: 600, o: 1 }); else fade(crack, 0);
      const sk = es(t, 4.3, 4.55, ease.out);
      hangAt(splitT, 900, lerp(-300, 330, sk), T, sk > 0 ? 1 : 0, 1.2, 0.9, 4);

      /* v44 — no one lays a hand on Him */
      const rg = es(t, 5.3, 5.5);
      vpose(ring, { x: JX, y: F + 4, s: 0.7 + rg * 0.3, o: rg });

      S.cam.y = 30 - bump(t, 2.0, 4.0) * 30;
      S.cam.z = (1.12 - bump(t, 2.0, 4.0) * 0.03) * (S.portrait ? 0.85 : 1);   // phone: a wider view, so the plates and the people at the sides fit
    };
  },
};
