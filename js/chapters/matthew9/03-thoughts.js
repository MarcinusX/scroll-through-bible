// Mt 9,3–5 — on the bench the scribes lean together and think "He blasphemes" (a dark thought cloud rises over
// them). Jesus knows their thoughts: He turns, and His light falls on the cloud; "Why do you think evil in your
// hearts?" — the dark sinks into little knots at their breasts. Then a balance comes down from the flies:
// "Your sins are forgiven" on one pan, "Get up and walk!" on the other — which is easier to say?
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { courtSet, courtCast, CT, WP, FRIENDS, matWithMan, pose3, thinkBubble, darkKnot, balance, slip, bubble, GLYPH, speech, hangAt, tr, PI, DAY } from './lib.js';

const JX = 790, BEDX = 1000;

export default {
  id: 'mt9-thoughts',
  beats: [
    { v: 3 },
    { v: 4, text: 'A Jezus, znając ich myśli, rzekł:' },
    { v: 4, cont: true, text: '«Dlaczego złe myśli nurtują w waszych sercach?' },
    { v: 5 },
  ],
  cam: { x: [-280, 20], y: [-40, 50], z: [1, 1.16] },
  build(S) {
    const set = courtSet(S, { skyCols: DAY });
    const c = S.c;
    const cast = courtCast(S, set, { awe: false });
    const { jesus, scribes, dis, crowd } = cast;

    /* the four friends round the bed (still), the man on it */
    const L = S.layer({ par: WP, sh: 5 });
    const F = (i, x, y) => ({ x, y, s: 0.9, flip: true, armF: 20, armB: 12, head: -4, o: FRIENDS[i] });
    L.add(`<g>${pose3(c, [F(0, 868, CT.FEET - 6), F(1, 1090, CT.FEET - 6)])}</g>`);
    L.add(`<g transform="translate(${BEDX} ${CT.FEET - 14})">${matWithMan(c)}</g>`);
    L.add(`<g>${pose3(c, [F(2, 1150, CT.FEET + 6), F(3, 1210, CT.FEET + 6)])}</g>`);

    /* the dark thought, the knots at their hearts, the beam of His knowing */
    const fx = S.layer({ par: WP, sh: 4 });
    const beam = fx.add(`<g opacity="0"><path d="${c.poly([[0, -16], [0, 16], [-300, 70], [-300, -70]])}" fill="#fff3cf" opacity=".5"/><path d="${c.poly([[0, -8], [0, 8], [-300, 34], [-300, -34]])}" fill="#fff3cf" opacity=".5"/></g>`);
    const cloud = fx.add(`<g opacity="0">${thinkBubble(c, [tr('On bluźni!', 'He blasphemes!')], { size: 28, fill: mix(C.storm2, C.night2, 0.25), ink: C.cream, dir: 1 })}</g>`);
    const knots = scribes.map((s) => ({ s, el: fx.add(`<g>${darkKnot(c, 13)}</g>`) }));
    const why = fx.add(`<g opacity="0">${speech(c, GLYPH.q(c), { w: 48, h: 44, flip: true })}</g>`);

    /* the balance: which is easier to say? */
    const bL = S.layer({ par: WP, sh: 6 });
    const B = balance(c, { arm: 170, drop: 96 });
    const str = bL.add(`<path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>`);
    const beamEl = bL.add(`<g>${B.beam}</g>`);
    const pans = [-1, 1].map((d) => ({ d, el: bL.add(`<g>${B.pan}<g transform="translate(0 ${B.drop - 22})">${slip(c, d < 0 ? tr('Odpuszczają ci się grzechy', 'Your sins are forgiven') : tr('Wstań i chodź!', 'Get up, and walk!'), { size: 17 })}</g></g>`) }));

    return (t, time) => {
      const T = time;
      set.update(T);
      crowd.forEach((g) => g.calm.set({ x: g.x, y: g.y }));

      /* v3 — they think it */
      const lean = es(t, 0.1, 0.35);
      const hurt = es(t, 1.9, 2.3);
      scribes.forEach((s) => s.p.set({
        x: s.x, y: s.y, s: 0.9, armF: 30 + (s.i === 1 ? lean * 40 : 0), armB: 18,
        head: (s.i % 2 ? -1 : 1) * lean * 8 * (1 - es(t, 1.1, 1.3)) + es(t, 1.1, 1.3) * -4 + hurt * 8, lean: (s.i < 2 ? 1 : -1) * lean * 4 * (1 - es(t, 1.1, 1.3)), blink: blinkAt(T, s.seed),
      }));
      const ck = es(t, 0.25, 0.55, ease.back) * (1 - es(t, 1.95, 2.3));
      const sink = es(t, 1.95, 2.3);
      pose(cloud, { x: 500 + Math.sin(T * 1.1) * 3 * (1 - bump(t, 1.2, 1.9)), y: CT.FEET - 190 + sink * 60, s: ck * (1 - sink * 0.6), o: ck > 0.02 ? 1 - sink : 0, r: bump(t, 1.2, 1.9) * Math.sin(T * 14) * 2 });

      /* v4 — He knows: turns to them; His light falls on the thought */
      const turn = es(t, 1.02, 1.1);
      const point = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const weigh = es(t, 3.2, 3.5);
      jesus.set({ x: JX, y: CT.FEET, s: 1.04, flip: turn > 0.5, armF: 16 + point * 60 + weigh * 70, armB: 10 + weigh * 70 + es(t, 1.1, 1.3) * 10 * (1 - weigh), head: turn * 3, blink: blinkAt(T) });
      pose(beam, { x: JX - 8, y: CT.FEET - 176, r: -10, s: 1, o: es(t, 1.15, 1.45) * (1 - es(t, 1.95, 2.2)) });
      knots.forEach((k) => {
        const kk = es(t, 2.15 + k.s.i * 0.06, 2.4 + k.s.i * 0.06, ease.back) * (1 - es(t, 3.05, 3.3));
        pose(k.el, { x: k.s.x + 8, y: k.s.y - 64 + Math.sin(T * 2 + k.s.i) * 1.5, s: kk * (1 + Math.sin(T * 5 + k.s.i) * 0.05), o: kk > 0.02 ? 1 : 0 });
      });
      const wk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(why, { x: JX - 40, y: CT.FEET - 230, s: wk, o: wk > 0.02 ? 1 : 0 });

      /* v5 — the balance: which is easier? */
      const down = es(t, 3.05, 3.4, ease.out);
      const by = lerp(-560, 250, down);
      const tip = (Math.sin(T * 1.6) * 7 + Math.sin(T * 0.7) * 3) * es(t, 3.35, 3.6) + (T ? 0 : 6 * es(t, 3.35, 3.6));
      pose(str, { x: 700, y: by, o: down > 0.01 ? 1 : 0 });
      pose(beamEl, { x: 700, y: by, r: tip, o: down > 0.01 ? 1 : 0 });
      pans.forEach((p) => {
        const a = (tip * PI) / 180;
        pose(p.el, { x: 700 + p.d * 170 * Math.cos(a), y: by + p.d * 170 * Math.sin(a), o: down > 0.01 ? 1 : 0 });
      });

      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.86, flip: true, armF: 10, head: -3 + bump(t, 0.3, 1.2) * 4, blink: blinkAt(T, d.seed) }));

      /* camera: over to the bench, then up to the balance */
      S.cam.x = -60 - es(t, 0.05, 0.5) * 180 + es(t, 3.0, 3.5) * 120;
      S.cam.z = 1.04 + es(t, 0.05, 0.5) * 0.1 - es(t, 3.0, 3.5) * 0.12;
      S.cam.y = 20 + es(t, 0.05, 0.5) * 20 - es(t, 3.0, 3.5) * 70;
    };
  },
};
