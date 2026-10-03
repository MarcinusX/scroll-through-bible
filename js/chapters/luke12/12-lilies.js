// Łk 12,27–28 — Jesus on the green rise of the plain with the disciples sitting in the grass round Him. "Consider the
// lilies, how they grow": all over the slope in front of them lilies shoot up and open, red, white and gold; beside them a
// spindle and a distaff lie in the grass untouched — "they neither toil nor spin". "Even Solomon in all his glory was not
// arrayed like one of these": a round painted plate comes down with Solomon on his golden throne, and next to it on its
// own string one lily, taller, glowing brighter than all his gold. "If God so clothes the grass of the field, which is
// here today and tomorrow is thrown into the oven": the day-discs hang, "today" and "tomorrow"; a woman gathers an armful
// of dry grass and throws it into her bread-oven, which flares; "how much more will He clothe you, O you of little
// faith?": a new mantle comes down on its string and settles, glowing, on Thomas's shoulders.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { throne, crown } from '../mark6/lib.js';
import { addToHead } from '../mark2/lib.js';
import { plainSet, RISE, DAY, seatDisciples, poseSeated, lily, spindle, newMantle, SOLOMON, dayDisc, oven, figure, onString, halo, warm, headAt, hand, womanO, voiceRings, tr, PI } from './lib.js';

const JX = 800;
const LIL = [[330, 640], [420, 662], [560, 650], [1040, 652], [1180, 648], [1270, 668], [470, 690], [1120, 690], [440, 728], [500, 736], [585, 730], [760, 734], [846, 738], [1015, 732], [1100, 736], [1160, 726]];
const OVX0 = 1112, WX0 = 1040;

function solomonPlate(c, id) {
  const s = sheet().p(c.cut(c.circ(0, 0, 84, 48), 0.5, 6), C.sun).p(c.cut(c.circ(0, 0, 76, 48), 0.5, 6), mix(C.parchment, C.halo, 0.4)).out();
  const king = addToHead(person(c, { ...SOLOMON, pose: 'sit' }), `<g transform="translate(0 -14)">${crown(c)}</g>`);
  return `${s}<defs><clipPath id="${id}"><circle r="76"/></clipPath></defs><g clip-path="url(#${id})"><rect x="-80" y="30" width="160" height="60" fill="${mix(C.plumRobe, C.terracotta, 0.3)}"/><g transform="translate(6 62) scale(.62)">${throne(c)}</g><g transform="translate(0 64) scale(.6)">${king}</g></g>`;
}

export default {
  id: 'lk12-lilies',
  beats: [
    { v: 27, text: 'Przypatrzcie się liliom, jak rosną: nie pracują i nie przędą.' },
    { v: 27, cont: true, text: 'A powiadam wam: Nawet Salomon w całym swym przepychu nie był tak ubrany jak jedna z nich.' },
    { v: 28 },
  ],
  cam: { x: [-30, 60], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    // phone: the woman and her oven step in from under the thread, and the camera stays a little to the right
    const PO = S.portrait, OVX = PO ? 1052 : OVX0, WX = PO ? 996 : WX0;
    const P = plainSet(S, { skyCols: DAY, crowd: false, near: false });
    const c = S.c;
    const dis = seatDisciples(S, P);
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    /* the lilies and the idle spindle */
    const lilyL = S.layer({ par: 0.5, sh: 4 });
    const lilies = LIL.map(([x, y], i) => ({ i, x, y, el: lilyL.add(`<g>${lily(c, (i < 6 ? 40 : i < 8 ? 52 : 66) + (i % 3) * 8, [C.roseRobe, C.linen, C.jesusMantle, C.ochreRobe][i % 4])}</g>`) }));
    const spin = lilyL.add(`<g>${spindle(c)}</g>`);
    /* the woman, the dry grass, the oven */
    const ovenEl = P.act.add(`<g>${oven(c)}</g>`);
    const ovenGlow = ovenEl.querySelector('.glow');
    const woman = S.puppet(P.act.add(person(c, womanO(c, { robe: C.ochreRobe, veil: C.linen2 }))));
    const grassBundle = P.act.add(`<g opacity="0">${sheet().p([0, 1, 2, 3, 4, 5, 6].map((i) => c.ribbon([[-4 + i * 2, 10], [-18 + i * 6, -30 - (i % 3) * 6]], 2.2)).join(''), mix(C.wheat2, C.soil, 0.2)).out()}</g>`);
    const flare = P.fx.add(`<g opacity="0">${warm(80, 1)}<path d="${c.cut([[-16, 0], [-10, -30], [-2, -16], [4, -44], [10, -18], [16, 0]], 0.3, 3)}" fill="${C.lampFlame}"/></g>`);
    /* the flies: Solomon, the great lily, the days, the mantle */
    const fl = P.hangL;
    const sol = fl.add(`<g transform="translate(0 -1500)">${onString(solomonPlate(c, S.id('sol')), 84)}</g>`);
    const big = fl.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-150" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${halo(130, 1)}<g transform="translate(0 50) scale(1.6)">${lily(c, 70, C.linen, { big: true })}</g></g>`);
    const days = [tr('dziś', 'today'), tr('jutro', 'tomorrow')].map((w, i) => ({ i, el: fl.add(`<g transform="translate(0 -1500)">${onString(dayDisc(c, w, 30), 34)}</g>`) }));
    const mant = P.fx.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="scale(.62)">${newMantle(c)}</g></g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      const teach = bump(t, 0.05, 0.6) + bump(t, 1.1, 1.7) * 0.7 + bump(t, 2.05, 2.5) * 0.6;
      const point = es(t, 2.6, 2.8);
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, flip: point > 0.5, armF: 16 + teach * 40 + point * 50, armB: 8 + teach * 50, head: -teach * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, RISE, P.J.s, false);
      voice(hx, hy, Math.min(1, teach), T, { spread: 2 });
      /* v27a — how they grow; they neither toil nor spin */
      lilies.forEach((l) => {
        const k = es(t, 0.08 + (l.i % 7) * 0.05, 0.4 + (l.i % 7) * 0.05, ease.back);
        pose(l.el, { x: l.x, y: l.y, s: 0.3 + k * 0.9, sy: 0.2 + k * 0.8, o: seg(t, 0.06, 0.1) });
      });
      pose(spin, { x: 640, y: 740, r: -6, s: 0.8, o: 1 });
      const mantleOn = es(t, 2.72, 2.85);
      poseSeated(dis, T, (d) => ({ o: d.i === 5 ? 0 : 1, head: -6 - es(t, 0.2, 0.5) * 8 * (d.i % 2) - es(t, 1.1, 1.4) * 10, armF: d.i === 0 ? 22 + bump(t, 2.3, 2.7) * 30 : 22 }));

      /* v27b — Solomon in all his glory */
      const sk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      pose(sol, { x: 600, y: lerp(-1500, 280, sk), r: time ? Math.sin(T * 0.7) * 1.2 : 0, oy: 0, o: sk > 0.01 ? 1 : 0 });
      const bk = es(t, 1.25, 1.55, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      pose(big, { x: 990, y: lerp(-1500, 300, bk), s: 1 + bump(t, 1.5, 1.95) * 0.08, r: time ? Math.sin(T * 0.6 + 1) * 1.5 : 0, oy: 0, o: bk > 0.01 ? 1 : 0 });

      /* v28 — today in the field, tomorrow in the oven; how much more you */
      days.forEach((d) => {
        const k = es(t, 2.05 + d.i * 0.08, 2.3 + d.i * 0.08, ease.out);
        pose(d.el, { x: 560 + d.i * 150, y: lerp(-1500, 300, k), r: time ? Math.sin(T * 0.8 + d.i) * 2 : 0, oy: 0, o: k > 0.01 ? 1 : 0 });
        const lit = d.i ? es(t, 2.35, 2.45) : es(t, 2.1, 2.2) * (1 - es(t, 2.35, 2.45));
        pose(d.el.querySelector('.lit'), { o: lit });
        pose(d.el.querySelector('.off'), { o: 1 - lit });
      });
      const gather = es(t, 2.05, 2.25), toss = es(t, 2.35, 2.5);
      woman.set({ x: WX, y: 712, s: 0.94, armF: 20 + gather * 50 + toss * 40, armB: 10 + gather * 40, head: 10 - toss * 8, lean: gather * (1 - toss) * 14, blink: blinkAt(T, 3) });
      pose(ovenEl, { x: OVX, y: 718, s: 0.9 });
      pose(ovenGlow, { o: 0.3 + es(t, 2.45, 2.55) * 0.7 });
      const [wx, wy] = hand(WX, 712, 0.94, false, 70 + toss * 40);
      pose(grassBundle, { x: lerp(wx, OVX, toss), y: lerp(wy, 690, toss) - Math.sin(toss * PI) * 40, r: toss * 70, s: 1 - toss * 0.5, o: gather > 0.02 && toss < 0.98 ? 1 : 0 });
      pose(flare, { x: OVX, y: 700, s: bump(t, 2.45, 2.95) * 1.2, o: bump(t, 2.45, 2.95) });
      const th = dis[0];
      const [thx, thy] = headAt(th.x, th.y, 0.92, false, 62);
      const mk = es(t, 2.5, 2.8, ease.out);
      pose(mant, { x: thx - 2, y: lerp(-1500, thy + 14, mk), o: mk > 0.01 ? 1 : 0 });

      S.cam.x = PO ? lerp(0, 60, es(t, 2.0, 2.3)) - es(t, 2.55, 2.75) * 20 : lerp(0, 40, es(t, 2.0, 2.3)) - es(t, 2.55, 2.75) * 40;
      S.cam.y = 50 - es(t, 1.0, 1.3) * 80 + es(t, 2.0, 2.3) * 60;
      S.cam.z = 1.06 - es(t, 1.0, 1.3) * 0.04 + es(t, 2.0, 2.3) * 0.02;
    };
  },
};
