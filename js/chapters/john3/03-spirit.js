// J 3,5–7 — "Born of water and the Spirit": a hanging board with a tiny traveller who walks under a
// stream of water, through a swirl of light, and the golden gate of the Kingdom opens to let him in.
// Flesh from flesh (a clay doll and a little clay doll), spirit from Spirit (a flame lights a flame).
// "Don't marvel…": Nicodemus' "!" melts, and along the parapet little buds open into lights — "you all".
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { doll } from '../mark10/lib.js';
import {
  roofSet, ROOF, ROOFCAM, roofX, flicker, nicodemus, roundel, bud, voiceRings, headAt, hang2, kingdomGate, gateDoor,
  soulLight, spark, bang, word, tr, PI, hangAt,
  vpose,
} from './lib.js';

const F = ROOF.FLOOR, JX = ROOF.JX, NX = ROOF.NX;
const BY = 318, BW = 350, BH = 220;   // the hanging board (top-centre at BX, BY)

export default {
  id: 'j3-spirit',
  beats: [
    { v: 5, text: 'Jezus odpowiedział:' },
    { v: 5, cont: true, text: '«Zaprawdę, zaprawdę, powiadam ci, jeśli się ktoś nie narodzi z wody i z Ducha, nie może wejść do królestwa Bożego.' },
    { v: 6, text: 'To, co się z ciała narodziło, jest ciałem,' },
    { v: 6, cont: true, text: 'a to, co się z Ducha narodziło, jest duchem.' },
    { v: 7 },
  ],
  cam: { x: [-100, 60], y: [100, 180], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the board and the two plates hang further in
    const BX = PH ? 850 : 935, FX = PH ? 650 : 700, SX = PH ? 930 : 1000, MX = PH ? 760 : 820;
    const R = roofSet(S);

    /* ---------- buds along the parapet (v7) ---------- */
    const B = S.layer({ par: 0.5, sh: 3 });
    const buds = (PH ? [250, 390, 530, 720, 950, 1015, 1300] : [250, 390, 520, 980, 1080, 1180, 1300]).map((x, i) => {
      const el = B.add(`<g>${bud(c, { h: 34, col: i % 2 ? C.roseRobe : C.peach, col2: shade(i % 2 ? C.roseRobe : C.peach, -0.1) })}</g>`);
      return { el, x, i, pl: el.querySelector('.petL'), pr: el.querySelector('.petR'), core: el.querySelector('.core') };
    });

    const P = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const nico = S.puppet(P.add(nicodemus(c, { pose: 'sit' })));
    const voice = voiceRings(P, c, { n: 3, color: C.halo, r: 34, w: 5, both: false });

    /* ---------- the board: water, Spirit, the gate ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const bd = sheet();
    bd.p(c.cut(c.rect(-BW / 2, 0, BW, BH), 0.6, 10), C.cream);
    bd.p(c.cut(c.rect(-BW / 2 + 8, 8, BW - 16, BH - 16), 0.4, 10), mix(C.skyBlue, C.parchment, 0.4));
    bd.p(c.cut([[-BW / 2 + 8, BH - 50], [BW / 2 - 8, BH - 54], [BW / 2 - 8, BH - 8], [-BW / 2 + 8, BH - 8]], 0.5, 8), mix(C.sand, C.sage3, 0.4));
    // the pool under the waterfall
    bd.p(c.cut(c.ell(-95, BH - 44, 46, 9, 16), 0.3, 5), C.lake);
    const board = hanging(X, `<g>${bd.out()}</g>`, { x: BX, y: BY, len: 700 });
    const gate = kingdomGate(c, 70, 118);
    const gateL = X.add(`<g>${gate.light}<circle cy="-50" r="70" fill="url(#halo-glow)"/></g>`);
    const doorA = X.add(`<g>${gateDoor(c, 35, 84)}</g>`);
    const doorB = X.add(`<g>${gateDoor(c, 35, 84)}</g>`);
    const gateF = X.add(`<g>${gate.frame}</g>`);
    const gTag = X.add(`<g>${word(c, tr('królestwo Boże', 'God’s Kingdom'), { size: 14 })}</g>`);
    // the stream of water pouring from above, and ripples
    const water = X.add(`<g>${sheet().p(c.ribbon([[0, 0], [2, 60], [-2, 120], [0, 170]], (u) => 10 + u * 8), C.lake).x(c.ribbon([[-2, 0], [0, 60], [-4, 120], [-2, 170]], 2.4), C.foam, 'opacity=".8"').out()}</g>`);
    const wTag = X.add(`<g>${word(c, tr('woda', 'water'), { size: 14 })}</g>`);
    // the swirl of the Spirit
    const swirlPts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40, a = u * PI * 4.2, r = 6 + u * 34; swirlPts.push([Math.cos(a) * r, Math.sin(a) * r * 0.7 - u * 40]); }
    const swirl = X.add(`<g><circle cy="-20" r="60" fill="url(#warm-glow)" opacity=".6"/><path d="${c.ribbon(swirlPts, (u) => 1 + u * 5)}" fill="${C.halo}"/></g>`);
    const sTag = X.add(`<g>${word(c, tr('Duch', 'Spirit'), { size: 14 })}</g>`);
    const traveller = S.puppet(X.add(person(c, { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather })));

    /* ---------- flesh and spirit ---------- */
    const clay = mix(C.clay, C.pot, 0.5);
    const fleshP = hanging(X, roundel(c, '', { r: 70, face: mix(C.parchment, C.sand2, 0.4) }), { x: FX, y: 380, len: 700 });
    const bigDoll = X.add(`<g>${doll(c, clay, { woman: true, h: 70, skin: shade(clay, 0.25) })}</g>`);
    const smallDoll = X.add(`<g>${doll(c, shade(clay, 0.1), { h: 40, skin: shade(clay, 0.3) })}</g>`);
    const fTag = X.add(`<g>${word(c, tr('ciało', 'flesh'), { size: 15 })}</g>`);
    const spiritP = hanging(X, roundel(c, '', { r: 70, face: mix(C.night, C.indigo, 0.4), rim: C.haloRim }), { x: SX, y: 380, len: 700 });
    const bigLight = X.add(`<g>${soulLight(c, 20)}</g>`);
    const smallLight = X.add(`<g>${soulLight(c, 13)}</g>`);
    const jump = X.add(`<g>${spark(c, 8)}</g>`);
    const dTag = X.add(`<g>${word(c, tr('duch', 'spirit'), { size: 15 })}</g>`);

    /* ---------- v7 ---------- */
    const bangEl = X.add(`<g>${bang(c, 22)}</g>`);
    const must = X.add(`<g>${word(c, tr('Trzeba wam się powtórnie narodzić', 'You must be born anew'), { size: 17 })}</g>`);

    return (t, time) => {
      const T = time;
      swing(R.moon, 1210, 150, T, 1, 0.5);
      flicker(R.lamp, T);

      const speak = es(t, 0.05, 0.3);
      jesus.set({ x: JX, y: F + 2, s: 1.05, flip: true, armF: 24 + speak * 30 + bump(t, 0.1, 0.9) * 40 + bump(t, 2.1, 2.9) * 40 + bump(t, 3.1, 3.9) * 60 + es(t, 4.35, 4.6) * 40, armB: 10 + bump(t, 1.2, 1.9) * 60, head: -3, blink: blinkAt(T, 4) });
      const [hx, hy] = headAt(JX, F + 2, 1.05, true, 62);
      voice(hx - 26, hy + 4, bump(t, 0.05, 1.1), T, { spread: 1.6, dir: -1 });
      const startle = es(t, 4.0, 4.15), calm = es(t, 4.4, 4.7);
      nico.set({ x: NX, y: F + 2, s: 1.02, armF: 30 + startle * 50 * (1 - calm) + calm * 20, armB: 10 + startle * 60 * (1 - calm), head: -startle * 8 * (1 - calm) - calm * 6 + bump(t, 1.4, 2) * 4, lean: -startle * 5 * (1 - calm), blink: blinkAt(T, 1) });

      /* v5 — the board */
      const bk = es(t, 0.35, 0.8, ease.out), bUp = es(t, 1.9, 2.15, ease.in);
      const by = lerp(-500, BY, bk) - bUp * 900;
      const bon = bk > 0 && bUp < 1 ? 1 : 0;
      vpose(board, { x: BX, y: by, o: bon });
      const ground = by + BH - 40;
      const wx = BX - 95, sx = BX + 5, gx = BX + 110;
      vpose(water, { x: wx, y: by + 12, sy: 0.4 + 0.6 * es(t, 0.8, 1.0) + Math.sin(T * 8) * 0.02, o: bon * es(t, 0.8, 0.9) });
      vpose(wTag, { x: wx - 20, y: by + 36, r: -6, o: bon * es(t, 0.9, 1.0) });
      vpose(swirl, { x: sx, y: ground - 30, r: T * 90 * 0 + Math.sin(T * 2) * 8, s: 0.8 + Math.sin(T * 3) * 0.05, o: bon * es(t, 0.95, 1.1) });
      vpose(sTag, { x: sx, y: by + 36, r: 4, o: bon * es(t, 1.0, 1.1) });
      // the traveller walks: under the water, into the swirl, through the gate
      const u = seg(t, 1.05, 1.8);
      const tx = lerp(BX - 170, gx, u);
      const wet = bump(t, 1.1, 1.35), lit = bump(t, 1.35, 1.6);
      traveller.set({ x: tx, y: ground, s: 0.33, walk: u > 0 && u < 1 ? tx * 0.25 : undefined, armF: wet * 120 + lit * 40, armB: lit * 150, o: bon * (1 - seg(t, 1.72, 1.82)) });
      const doors = es(t, 1.5, 1.72);
      vpose(gateL, { x: gx, y: ground, o: bon * (0.5 + doors * 0.5) });
      vpose(doorA, { x: gx - 35, y: ground, sx: 1 - doors * 0.85, o: bon });
      vpose(doorB, { x: gx + 35, y: ground, sx: -(1 - doors * 0.85), o: bon });
      vpose(gateF, { x: gx, y: ground, o: bon });
      vpose(gTag, { x: gx, y: by + 30, o: bon });

      /* v6 — flesh and spirit */
      const fk = es(t, 1.95, 2.3, ease.out), sk = es(t, 2.05, 2.4, ease.out), up2 = es(t, 3.85, 4.1, ease.in);
      const fy = lerp(-400, 380, fk) - up2 * 900, sy = lerp(-400, 380, sk) - up2 * 900;
      const fo = fk > 0 && up2 < 1 ? 1 : 0, so = sk > 0 && up2 < 1 ? 1 : 0;
      hangAt(fleshP, FX, fy, T, fo, 1.2, 0.8, 1);
      hangAt(spiritP, SX, sy, T, so, 1.2, 0.8, 2);
      vpose(bigDoll, { x: FX - 20, y: fy + 42, o: fo });
      const kid = es(t, 2.4, 2.7, ease.back);
      vpose(smallDoll, { x: FX + 25, y: fy + 42, s: kid, o: fo * seg(t, 2.4, 2.45) });
      vpose(fTag, { x: FX, y: fy + 92, o: fo });
      vpose(bigLight, { x: SX - 25, y: sy + 2, s: 1 + Math.sin(T * 5) * 0.05, o: so });
      const jk = seg(t, 3.25, 3.55);
      vpose(jump, { x: lerp(SX - 25, SX + 30, jk), y: sy - 10 - Math.sin(jk * PI) * 34, o: so * bump(t, 3.22, 3.58) });
      const lk = es(t, 3.5, 3.75, ease.back);
      vpose(smallLight, { x: SX + 30, y: sy + 16, s: lk * (1 + Math.sin(T * 6 + 1) * 0.06), o: so * seg(t, 3.5, 3.55) });
      vpose(dTag, { x: SX, y: sy + 92, o: so });

      /* v7 — don't marvel; you all must be born anew */
      const [nx, ny] = headAt(NX, F + 2, 1.02, false, 62);
      vpose(bangEl, { x: nx + 20, y: ny - 56, s: startle * (1 - calm) * 1.2, r: Math.sin(T * 9) * 6, o: startle * (1 - calm) });
      const mk = es(t, 4.35, 4.6, ease.out);
      vpose(must, { x: MX, y: lerp(160, 405, mk), r: Math.sin(T * 0.9) * 1.2, o: mk });
      buds.forEach((b) => {
        const k = es(t, 4.45 + b.i * 0.05, 4.7 + b.i * 0.05, ease.back);
        vpose(b.el, { x: b.x, y: F - 124, s: 0.55 * seg(t, 4.3 + b.i * 0.03, 4.4 + b.i * 0.03), o: seg(t, 4.3, 4.4) });
        vpose(b.pl, { r: -k * 55 }); vpose(b.pr, { r: k * 55 });
        vpose(b.core, { y: -k * 8, o: k });
      });

      S.cam.x = roofX(S) + 30 * es(t, 0.3, 0.8) * (1 - es(t, 1.9, 2.3)) * (PH ? 0.4 : 1);
      S.cam.y = ROOFCAM.y;
      S.cam.z = ROOFCAM.z;
    };
  },
};
