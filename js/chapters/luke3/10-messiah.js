// Łk 3,15–16 — at the river the people wait, tense: over each head a thought with a crown and a question, and a
// paper crown hangs trembling over John — is he the Christ? John pushes the crown away and pours water over a
// kneeling man: "I baptise you with water". "One mightier than I is coming": a great sandal comes down before
// him, its strap knotted; he reaches for the knot, stops, and bows his head — not worthy to untie it. "He will
// baptise you with the Holy Spirit and fire": the sky turns gold, the dove glides over the river, and small
// tongues of flame settle on the heads of the people one after another.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  JOHN_B, headAt, hand, jordanSet, shell, drops, voiceRings, thought, paperCrown, question, folk, group, sandalBig, dove,
  flapWings, flame, rays, JORDAN_DAY, KINGDOM, es, ease, bump, seg, fade, PI,
} from './lib.js';

const JX = 760, WADE = 702, BANK = 776;

export default {
  id: 'lk3-messiah',
  beats: [
    { v: 15 },
    { v: 16, text: 'on tak przemówił do wszystkich: «Ja was chrzczę wodą;' },
    { v: 16, cont: true, text: 'lecz idzie mocniejszy ode mnie, któremu nie jestem godzien rozwiązać rzemyka u sandałów.' },
    { v: 16, cont: true, text: 'On chrzcić was będzie Duchem Świętym i ogniem.' },
  ],
  cam: { x: [-30, 40], y: [0, 80], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: JORDAN_DAY, sunAt: [1250, 150], city: false, path: false });
    const gid = S.id('gold');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="620"><stop offset="0" stop-color="${KINGDOM[0]}" stop-opacity=".95"/><stop offset=".75" stop-color="${KINGDOM[1]}" stop-opacity=".6"/><stop offset="1" stop-color="${KINGDOM[2]}" stop-opacity="0"/></linearGradient>`);
    const gold = S.layer({ par: 0.02, sh: 1, flat: true });
    gold.add(`<rect x="-3000" y="-3000" width="8000" height="3620" fill="url(#${gid})"/><g transform="translate(800 -40)">${rays(c, { n: 16, r0: 40, r1: 1100, spread: 0.045, color: '#fff3cf' })}</g>`);
    gold.fade(0);
    const { fbFn, far } = J;
    [[260, 3], [480, 2], [1120, 3], [1330, 3]].forEach(([x, n]) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > JX, o: folk(c) }));
      far.sprite(`<g transform="scale(.42)">${group(c, mem)}</g>`, x, fbFn(x) + 8);
    });

    /* the river: John, a kneeling man */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g data-k="m-shell" transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const shellEl = S.$('m-shell');
    const johnK = S.puppet(R.add(person(c, { ...JOHN_B, pose: 'kneel' })));
    const man = S.puppet(R.add(person(c, { robe: C.ochreRobe, hairStyle: 'curly', hair: C.hair3, beard: 'short', skin: C.skin3, pose: 'kneel' })));
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    J.waterFront(R);
    const voice = voiceRings(R, c, { n: 3, color: C.clay, r: 40, w: 6, both: true });

    /* the near bank: the people who wonder */
    const { N } = J.nearBank();
    const LIS = (S.portrait   // phone: all five who wonder stand on screen, their thoughts clear of the thread
      ? [[512, false, 0.9], [582, false, 0.86], [915, true, 0.88], [970, true, 0.92], [1025, true, 0.86]]
      : [[380, false, 0.9], [490, false, 0.86], [1040, true, 0.88], [1150, true, 0.92], [1260, true, 0.86]]).map(([x, flip, s], i) => ({ x, flip, s, i, p: S.puppet(N.add(person(c, folk(c)))), seed: c.rr(0, 9) }));
    J.foreground();

    /* thoughts, the crown, the sandal, the dove, the flames */
    const fx = S.layer({ par: 0.45, sh: 6 });
    const THO = LIS.map((l, i) => fx.add(`<g>${thought(c, `<g transform="translate(-10 4) scale(.3)">${paperCrown(c, 120)}</g><g transform="translate(14 -2) scale(.5)">${question(c)}</g>`, { w: 70, h: 52 })}</g>`));
    const crownEl = fx.add(`<g>${paperCrown(c, 90)}</g>`);
    const sGlow = fx.add(`<ellipse rx="150" ry="170" fill="url(#halo-glow)"/>`);
    const sandal = fx.add(`<g><path d="M-40 -1600V-150M40 -1600V-150" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="scale(.62)">${sandalBig(c, 380)}</g></g>`);
    const doveEl = fx.add(dove(c));
    const FL = LIS.map(() => fx.add(`<g>${flame(c, 30)}</g>`));
    const jFlame = fx.add(`<g>${flame(c, 30)}</g>`);

    return (t, time) => {
      J.update(t, time);

      /* v15 — the people wonder in their hearts: is he the Christ? */
      const wonder = es(t, 0.1, 0.4);
      const push = es(t, 1.05, 1.25);
      THO.forEach((th, i) => {
        const l = LIS[i];
        const [hx, hy] = headAt(l.x, BANK, l.s, l.flip);
        const k = es(t, 0.15 + i * 0.06, 0.32 + i * 0.06, ease.back) * (1 - es(t, 1.05, 1.2));
        pose(th, { x: hx + (l.flip ? -8 : 8), y: hy - 18, s: k * 0.9, sx: (l.flip ? -0.9 : 0.9) * k, o: k > 0.01 ? 1 : 0 });
      });
      const [jhx, jhy] = headAt(JX, WADE, 1.05);
      const ck = es(t, 0.3, 0.6, ease.out);
      pose(crownEl, { x: jhx + push * 260, y: lerp(-300, jhy - 70, ck) - push * 200 + Math.sin(time * 2.4) * 3 * (1 - push), r: Math.sin(time * 1.6) * 5 + push * 40, o: ck > 0.01 && push < 1 ? 1 - push : 0 });

      /* v16a — "I baptise you with water" */
      const pour = es(t, 1.3, 1.45) * (1 - es(t, 1.8, 1.92));
      const reach = es(t, 2.35, 2.5) * (1 - es(t, 2.55, 2.66));
      const kneel = es(t, 2.64, 2.7) * (1 - es(t, 3.4, 3.46));
      const spirit = es(t, 3.05, 3.35);
      john.set({
        x: JX, y: WADE, s: 1.05, o: 1 - kneel,
        armF: 24 + push * 60 * (1 - es(t, 1.25, 1.35)) + pour * 84 + es(t, 2.05, 2.2) * 30 * (1 - reach) + reach * 70 + spirit * 60, armB: 10 + push * 20 + spirit * 140,
        head: -wonder * 4 + pour * 8 - spirit * 16, blink: blinkAt(time),
      });
      fade(shellEl, 1 - es(t, 2.0, 2.1));
      johnK.set({ x: JX - 4, y: WADE + 8, s: 1.05, o: kneel, armF: 40, armB: 20, head: 20, lean: 8, blink: blinkAt(time, 2) });
      man.set({ x: 870, y: WADE, s: 1, flip: true, o: es(t, 1.05, 1.15) * (1 - es(t, 2.0, 2.1)), head: 12, armF: 60, armB: 40, blink: blinkAt(time, 4) });
      const [px, py] = hand(JX, WADE, 1.05, false, 24 + pour * 84);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 1.38, 1.44) * (1 - seg(t, 1.78, 1.84)) });
      voice(jhx + 14, jhy, Math.max(es(t, 1.03, 1.2) * (1 - es(t, 1.4, 1.5)), es(t, 2.03, 2.2) * (1 - es(t, 2.3, 2.4)), spirit * (1 - es(t, 3.9, 4.0))), time, { spread: 2.8, dir: 0 });

      /* v16b — the mightier one's sandal: he reaches for the strap, stops, kneels */
      const sk = es(t, 2.05, 2.35, ease.out), sUp = es(t, 3.0, 3.25, ease.in);
      pose(sandal, { x: 930, y: lerp(-500, 470, sk) - sUp * 900, r: Math.sin(time * 0.8) * 0.8 });
      pose(sGlow, { x: 930, y: 400, o: sk * (1 - sUp) * 0.8 });

      /* v16c — the Holy Spirit and fire */
      gold.fade(spirit * 0.8);
      const dv = seg(t, 3.1, 3.95);
      pose(doveEl, { x: S.portrait ? lerp(380, 1200, dv) : lerp(260, 1340, dv), y: 300 - Math.sin(dv * PI) * 80, s: 0.95, o: dv > 0 && dv < 1 ? 1 : 0 });
      flapWings(doveEl, time, 30, 7);
      LIS.forEach((l) => {
        l.p.set({ x: l.x, y: BANK + (l.i % 2) * 6, s: l.s, flip: l.flip, armF: 20 + wonder * 20 * (1 - push) + spirit * (l.i % 2 ? 90 : 40), armB: spirit * (l.i % 2 ? 30 : 130), head: -wonder * 6 + push * 4 - spirit * 12, blink: blinkAt(time, l.seed) });
      });
      FL.forEach((f, i) => {
        const l = LIS[i];
        const k = es(t, 3.3 + i * 0.07, 3.45 + i * 0.07, ease.back);
        const [fx2, fy2] = headAt(l.x, BANK + (l.i % 2) * 6, l.s, l.flip);
        const fl = time ? 1 + Math.sin(time * 11 + i) * 0.08 : 1;
        pose(f, { x: fx2, y: fy2 - 30, sx: k / fl, sy: k * fl, o: k > 0 ? 1 : 0 });
      });
      const kj = es(t, 3.55, 3.7, ease.back);
      pose(jFlame, { x: jhx, y: jhy - 30, sx: kj, sy: kj * (time ? 1 + Math.sin(time * 10) * 0.08 : 1), o: kj > 0 && kneel < 0.5 ? 1 : 0 });

      S.cam.x = es(t, 2.0, 2.3) * 30 * (1 - spirit);
      S.cam.z = 1.02 + es(t, 0.1, 0.5) * 0.05 + es(t, 2.0, 2.3) * 0.04 * (1 - spirit);
      S.cam.y = 40 - spirit * 20;
    };
  },
};
