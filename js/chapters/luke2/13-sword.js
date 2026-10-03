// Łk 2,33–35 — Simeon gives the Child back to His mother; Joseph and Mary wonder at what is said of Him. Simeon lifts
// his hand over them in blessing and speaks to Mary. "This Child is set for the fall and the rising of many in Israel"
// — on a hung panel little paper people tip over while others get up from the ground; "and for a sign that will be
// spoken against" — a round sign with a star, and dark hands pushing against it from both sides. "And a sword will
// pierce your own soul" — close on Mary, eyes lowered over the Child, a thin sword of pale light comes down over her
// heart (nothing more is shown). "So that the thoughts of many hearts may be revealed" — a row of little windows open
// on many hearts: bright ones, clouded ones, faint ones.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix, crowdPerson } from '../kit.js';
import {
  templeSet, TFLOOR, JOSEPH, MARY, SIMEON, inArms, staff, glowDisc, rayBurst, lightSword, swordGlow, bigStar, placeTag,
  shadowHand, heartWindow, openWindow, hangAt, vpose, kf, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const FL = TFLOOR;
const MX = 720, JX = 590, SX = 960;
const HEART = [MX + 8, FL - 116];
const PX = 800, PY = 250;          // the panel of falling and rising
const KINDS = ['bright', 'cloud', 'faint', 'bright', 'cloud', 'bright', 'faint'];

/** the panel: a long parchment plate on two strings (origin centre) */
function panel(c, w = 520, h = 170) {
  const s = sheet().p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12), 0.5, 6), C.haloRim).p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 6), C.parchment);
  s.x(c.ribbon([[-w / 2 + 16, h / 2 - 24], [w / 2 - 16, h / 2 - 24]], 2), C.wood3, 'opacity=".5"');
  s.x(c.ribbon([[0, -h / 2 + 12], [0, h / 2 - 12]], 1.4), C.terracotta, 'opacity=".4"');
  return `<g class="hang"><path d="M${-w * 0.35} -1600V${-h / 2}M${w * 0.35} -1600V${-h / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${s.out()}<text x="${-w / 4}" y="${-h / 2 + 30}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.terracotta}">${tr('upadek', 'falling')}</text><text x="${w / 4}" y="${-h / 2 + 30}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.terracotta}">${tr('powstanie', 'rising')}</text></g></g>`;
}

export default {
  id: 'lk2-sword',
  beats: [
    { v: 33 },
    { v: 34, text: 'Symeon zaś błogosławił Ich i rzekł do Maryi, Matki Jego:' },
    { v: 34, cont: true, text: '«Oto Ten przeznaczony jest na upadek i na powstanie wielu w Izraelu,' },
    { v: 34, cont: true, text: 'i na znak, któremu sprzeciwiać się będą.' },
    { v: 35, text: 'A Twoją duszę miecz przeniknie,' },
    { v: 35, cont: true, text: 'aby na jaw wyszły zamysły serc wielu».' },
  ],
  cam: { x: [-110, 20], y: [-40, 120], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const TS = templeSet(S, {});
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const bless = glowL.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const sGlow = glowL.add(`<g>${swordGlow(260)}</g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const jos = S.puppet(P.add(person(c, { ...JOSEPH })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const mHold = S.puppet(P.add(person(c, { ...MARY, holdF: inArms(c) })));
    const mGrief = S.puppet(P.add(person(c, { ...MARY, holdF: inArms(c), eyes: 'closed' })));
    const simH = S.puppet(P.add(person(c, { ...SIMEON, holdF: inArms(c) })));
    const sim = S.puppet(P.add(person(c, { ...SIMEON })));
    const sword = P.add(`<g>${lightSword(c, 260)}</g>`);

    const X = S.layer({ par: 0.3, sh: 5 });
    const pan = X.add(panel(c));
    const figs = [0, 1, 2, 3, 4, 5].map((i) => ({ i, rise: i >= 3, el: X.add(`<g>${person(c, { ...crowdPerson(c), holdF: '', holdB: '' })}</g>`) }));
    const sign = hanging(X, `${sheet().p(c.cut(c.circ(0, 0, 64, 30), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 57, 30), 0.5, 5), C.cream).out()}${bigStar(c, 26, { glow: false })}<g transform="translate(0 88)">${placeTag(c, tr('znak', 'a sign'), 20)}</g>`, { x: 0, y: 0, len: 700 });
    const hands = [-1, 1].map((d) => X.add(`<g><g transform="scale(${-d} 1)"><path d="${c.ribbon([[-300, 24], [-60, 6]], (u) => 10 + u * 24)}" fill="${mix(C.storm2, C.plumRobe, 0.3)}"/><g transform="translate(-40 6) rotate(90)">${shadowHand(c, mix(C.storm2, C.plumRobe, 0.3), 2)}</g></g></g>`));
    const hearts = KINDS.map((k, i) => ({ i, el: X.add(`<g>${heartWindow(c, k, 24)}</g>`) }));
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      /* v33 — the Child back in His mother's arms; they marvel */
      const back = es(t, 0.05, 0.14);
      const wonder = es(t, 0.3, 0.6) * (1 - es(t, 1.1, 1.4));
      simH.set({ x: SX - 30, y: FL, s: 0.96, flip: true, o: 1 - back, armF: 80, armB: 30, head: 6, blink: blinkAt(T, 3) });
      const raise = es(t, 1.05, 1.35) * (1 - es(t, 1.9, 2.2));
      sim.set({ x: SX - 30, y: FL, s: 0.96, flip: true, o: back, armF: 20 + raise * 40 + bump(t, 2.1, 5.9) * 20, armB: 30 + raise * 120, head: 6 - raise * 4, blink: blinkAt(T, 3) });
      const grief = es(t, 4.1, 4.2) * (1 - es(t, 5.3, 5.4));
      mary.set({ x: MX, y: FL, s: 0.95, o: 0, armF: 60 });
      mHold.set({ x: MX, y: FL, s: 0.95, o: back * (1 - grief), armF: 70, armB: 30 + wonder * 50, head: 6 - wonder * 10, blink: blinkAt(T, 1) });
      mGrief.set({ x: MX, y: FL, s: 0.95, o: grief, armF: 74, armB: 44, head: 14 });
      jos.set({ x: JX, y: FL + 4, s: 0.95, armF: 30 + wonder * 50, armB: 20 + wonder * 90, head: -wonder * 8, blink: blinkAt(T, 2) });
      sparks.forEach((sp, i) => {
        const k = seg(t, 0.3 + i * 0.06, 0.8 + i * 0.06), a = PI * (1.2 + i * 0.2);
        vpose(sp, { x: 660 + Math.cos(a) * (60 + k * 70), y: FL - 220 + Math.sin(a) * (30 + k * 40), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 0.3 + i * 0.06, 0.8 + i * 0.06) });
      });

      /* v34a — he blesses them and speaks to Mary */
      pose(bless, { x: 700, y: FL - 170, s: 0.8 + raise * 0.3, o: 0.3 + raise * 0.6 });

      /* v34b — the fall and rising of many */
      const pk = es(t, 2.05, 2.3, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      const py = lerp(-560, PY, pk);
      pose(pan, { x: PX, y: py, r: Math.sin(T * 0.7) * 0.6, o: pk > 0.001 ? 1 : 0 });
      figs.forEach((f) => {
        const k = es(t, 2.3 + (f.i % 3) * 0.08, 2.6 + (f.i % 3) * 0.08);
        const x = PX + (f.rise ? 60 + (f.i - 3) * 70 : -200 + f.i * 70);
        const r = f.rise ? lerp(-86, 0, k) : lerp(0, 82, k);
        vpose(f.el, { x, y: py + 66, s: 0.36, r, o: pk > 0.001 ? 1 : 0 });
      });

      /* v34c — a sign spoken against */
      const sk = es(t, 3.05, 3.3, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      hangAt(sign, 800, lerp(-560, 260, sk), T, sk > 0.001 ? 1 : 0, 1, 0.8, 2);
      const push = es(t, 3.3, 3.6);
      hands.forEach((h, i) => {
        const d = i ? 1 : -1;
        vpose(h, { x: 800 + d * lerp(640, 120, push) + (push > 0.99 && T ? Math.sin(T * 6 + i) * 3 : 0), y: 262, o: sk > 0.01 && push > 0.001 ? 1 : 0 });
      });

      /* v35a — a sword will pierce your own soul */
      const sw = es(t, 4.15, 4.6, ease.out) * (1 - es(t, 5.0, 5.25));
      vpose(sword, { x: HEART[0] + 6, y: lerp(HEART[1] - 700, HEART[1] - 105, sw), s: 0.8, o: sw > 0.001 ? 1 : 0 });
      pose(sGlow, { x: HEART[0] + 6, y: HEART[1] - 105, s: 0.8, o: sw * 0.9 });

      /* v35b — the thoughts of many hearts revealed */
      hearts.forEach((h) => {
        const k = es(t, 5.05 + h.i * 0.05, 5.25 + h.i * 0.05, ease.back);
        const x = S.portrait ? 520 + h.i * 88 : 500 + h.i * 100, y = 250 + (h.i % 2) * 40;   // phone: the row inside the screen
        vpose(h.el, { x, y, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
        if (k > 0.01) openWindow(h.el, es(t, 5.3 + h.i * 0.05, 5.5 + h.i * 0.05), 24);
      });

      S.cam.x = kf(t, [[0, 0], [3.9, 0], [4.25, -100], [4.95, -100], [5.3, 0]], ease.sine);
      S.cam.z = kf(t, [[0, 1.02], [3.9, 1.04], [4.25, 1.45], [4.95, 1.45], [5.3, 1.02]], ease.sine);
      S.cam.y = kf(t, [[0, 10], [3.9, 10], [4.25, 110], [4.95, 110], [5.3, 0]], ease.sine);
    };
  },
};
