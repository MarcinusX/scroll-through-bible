// J 3,3–4 — On the roof by the lamp. "Unless one is born anew / from above": a round plate comes down;
// a beam of light from above falls on a closed bud, it opens and a small light rises — and only then
// the Kingdom (a crown of light) can be seen. Nicodemus puzzles: an old man with a cane inspects
// a cradle… and tries to climb into it, legs sticking out.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  roofSet, ROOF, ROOFCAM, flicker, nicodemus, roundel, bud, beamGrad, lightBeam, lightCrown, question, voiceRings, headAt,
  cradle, cane, OLDMAN, word, tr, PI,
  hangAt,
  vpose,
} from './lib.js';

const F = ROOF.FLOOR, JX = ROOF.JX, NX = ROOF.NX;
const PX = 1000, PY = 405;        // the plate of "born from above"
const TX = 545, TY = 398;         // Nicodemus' thought cloud

export default {
  id: 'j3-born',
  beats: [
    { v: 3, text: 'W odpowiedzi rzekł do niego Jezus:' },
    { v: 3, cont: true, text: '«Zaprawdę, zaprawdę, powiadam ci, jeśli się ktoś nie narodzi powtórnie, nie może ujrzeć królestwa Bożego».' },
    { v: 4, text: 'Nikodem powiedział do Niego:' },
    { v: 4, cont: true, text: '«Jakżeż może się człowiek narodzić będąc starcem?' },
    { v: 4, cont: true, text: 'Czyż może powtórnie wejść do łona swej matki i narodzić się?»' },
  ],
  cam: { x: [-60, 60], y: [100, 180], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const R = roofSet(S);
    const P = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const nico = S.puppet(P.add(nicodemus(c, { pose: 'sit' })));
    const voice = voiceRings(P, c, { n: 3, color: C.halo, r: 34, w: 5, both: false });

    /* ---------- the plate: born from above ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const soil = `<path d="${c.cut([[-110, 40], [110, 36], [110, 120], [-110, 120]], 0.8, 8)}" fill="${C.soil}"/><path d="${c.cut([[-110, 44], [110, 40], [110, 52], [-110, 56]], 0.6, 8)}" fill="${C.soilDark}" opacity=".6"/>`;
    const sky2 = `<path d="${c.poly(c.rect(-120, -120, 240, 170))}" fill="${mix(C.night, C.indigo, 0.4)}"/>`;
    const plateEl = hanging(X, roundel(c, sky2 + soil, { r: 92, face: C.parchment, id: S.id('pl') }), { x: PX, y: PY, len: 700 });
    const bid = beamGrad(S, 'beam');
    const beamEl = X.add(`<g>${lightBeam(bid, 14, 70, 120)}</g>`);
    const budEl = X.add(`<g>${bud(c, { h: 70 })}</g>`);
    const petL = budEl.querySelector('.petL'), petR = budEl.querySelector('.petR'), core = budEl.querySelector('.core');
    const crownEl = X.add(`<g>${lightCrown(c, 22)}</g>`);
    const kTag = X.add(`<g>${word(c, tr('królestwo Boże', 'God’s Kingdom'), { size: 16 })}</g>`);
    const upTag = X.add(`<g>${word(c, tr('z wysoka', 'from above'), { size: 16 })}</g>`);

    /* ---------- Nicodemus puzzles: an old man and a cradle ---------- */
    const Q = S.layer({ par: 0.5, sh: 5 });
    const cl = sheet();
    let blobs = '';
    [[-110, 10, 70, 60], [-40, -30, 80, 70], [50, -20, 80, 66], [120, 14, 64, 56], [0, 40, 140, 56]].forEach(([x, y, rx, ry]) => { blobs += c.cut(c.blob(x, y, rx, ry, 14, 0.06), 0.5, 5); });
    cl.p(blobs, C.cream);
    cl.p(c.cut(c.circ(110, 118, 12, 12), 0.3, 3) + c.cut(c.circ(126, 150, 8, 10), 0.3, 3), C.cream);
    const cloudEl = Q.add(`<g>${cl.out()}</g>`);
    const cradleEl = Q.add(`<g>${cradle(c, 80)}</g>`);
    const old = S.puppet(Q.add(person(c, { ...OLDMAN, holdF: cane(c) })));
    const qs = [0, 1, 2].map((i) => Q.add(`<g>${question(c)}</g>`));
    const nq = X.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      swing(R.moon, 1210, 150, T, 1, 0.5);
      flicker(R.lamp, T);

      /* Jesus answers */
      const speak = es(t, 0.1, 0.4) * (1 - es(t, 1.9, 2.1));
      jesus.set({ x: JX, y: F + 2, s: 1.05, flip: true, armF: 24 + speak * 40 + bump(t, 1.2, 1.8) * 50, armB: 10 + bump(t, 1.2, 1.8) * 90, head: -3 + Math.sin(T * 0.8) * 1.5 * speak, blink: blinkAt(T, 4) });
      const [hx, hy] = headAt(JX, F + 2, 1.05, true, 62);
      voice(hx - 26, hy + 4, speak * (1 - es(t, 1.2, 1.4)), T, { spread: 1.6, dir: -1 });

      /* the plate of the new birth */
      const pk = es(t, 0.9, 1.25, ease.out);
      const pUp = es(t, 2.9, 3.2, ease.in);
      const py = lerp(-400, PY, pk) - pUp * 800;
      const sw = Math.sin(T * 0.8) * 1.2;
      hangAt(plateEl, PX, py, T, pk > 0 && pUp < 1 ? 1 : 0, 1.2, 0.8);
      const on = pk > 0 && pUp < 1 ? 1 : 0;
      const bm = es(t, 1.25, 1.5);
      vpose(beamEl, { x: PX, y: py - 92, sx: 0.3 + bm * 0.7, o: on * bm });
      const open = es(t, 1.45, 1.75, ease.back);
      vpose(budEl, { x: PX, y: py + 40, o: on });
      vpose(petL, { r: -open * 55 }); vpose(petR, { r: open * 55 });
      vpose(core, { y: -open * 14, o: open });
      const ck = es(t, 1.65, 1.95, ease.back);
      vpose(crownEl, { x: PX, y: py - 58, s: ck * 0.9, r: sw, o: on * ck });
      vpose(kTag, { x: PX, y: py + 122, s: es(t, 1.7, 1.9, ease.back), o: on * es(t, 1.7, 1.8) });
      vpose(upTag, { x: PX + 120, y: py - 80, r: 8, s: es(t, 1.3, 1.5, ease.back), o: on * es(t, 1.3, 1.4) });

      /* Nicodemus: "How?" */
      const puzzle = es(t, 2.05, 2.3);
      nico.set({ x: NX, y: F + 2, s: 1.02, armF: 30 + puzzle * 30 + bump(t, 3.1, 3.9) * 30 + bump(t, 4.1, 4.9) * 40, armB: 10 + puzzle * 140 * (1 - es(t, 2.9, 3.1)), head: puzzle * 10 - bump(t, 4.2, 4.9) * 6, blink: blinkAt(T, 1) });
      const [nx, ny] = headAt(NX, F + 2, 1.02, false, 62);
      vpose(nq, { x: nx + 30, y: ny - 50, s: es(t, 2.1, 2.3, ease.back) * 1.1, r: Math.sin(T * 2) * 6, o: es(t, 2.1, 2.2) * (1 - es(t, 2.85, 2.95)) });

      /* the thought: an old man and a cradle */
      const ck2 = es(t, 2.85, 3.15, ease.back);
      vpose(cloudEl, { x: TX, y: TY, s: ck2, o: seg(t, 2.85, 2.95) });
      const qo = seg(t, 2.95, 3.1);
      const rock = Math.sin(T * 3) * 6 * es(t, 4.35, 4.5);
      vpose(cradleEl, { x: TX + 60, y: TY + 68, s: 0.8 * ck2, r: rock, o: qo });
      // he hobbles up, peers in, then climbs in: legs out over the edge
      const hob = es(t, 3.0, 3.5);
      const climb = es(t, 4.1, 4.4);
      const ox = lerp(TX - 120, TX - 40, hob) + climb * 50, oy = TY + 64 - climb * 40;
      old.set({ x: ox, y: oy, s: 0.52 * ck2, o: qo, r: climb * 84 + rock * climb, walk: hob > 0 && hob < 1 ? ox * 0.2 : undefined, armF: 40 + bump(t, 3.5, 3.9) * 20 + climb * 30, armB: bump(t, 3.55, 4) * 150 + climb * 60, head: 10 + bump(t, 3.5, 4) * 12 - climb * 10, lean: hob > 0.99 ? 12 * (1 - climb) : 0, blink: blinkAt(T, 6) });
      qs.forEach((q, i) => {
        const k = es(t, 3.6 + i * 0.5 - (i ? 0.1 : 0), 3.8 + i * 0.5, ease.back);
        const ang = -0.9 + i * 0.9;
        vpose(q, { x: TX + 20 + Math.cos(ang) * 110, y: TY - 30 + Math.sin(ang) * 40 - (i === 1 ? 30 : 0), s: k * (0.7 + i * 0.1), r: Math.sin(T * 2 + i) * 10, o: qo * seg(t, 3.6 + i * 0.4, 3.7 + i * 0.4) });
      });

      S.cam.x = -es(t, 2.6, 3.2) * 50 + es(t, 0.8, 1.3) * 50 * (1 - es(t, 2.6, 3.2));
      S.cam.y = ROOFCAM.y;
      S.cam.z = ROOFCAM.z;
    };
  },
};
