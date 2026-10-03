// Łk 2,44–45 — thinking He is somewhere in the caravan, they walk a whole day's journey: the sun goes over and down,
// the sky turns to dusk. At the evening camp, among the tents and the fires, Mary and Joseph go from one group of
// relatives and friends to the next, asking — a question over them, shaken heads, a crossed-out picture of the boy.
// He is not there. By night, with a lantern, they turn back up the road to Jerusalem, looking for Him.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix, crowdPerson } from '../kit.js';
import {
  roadSet, RY, DUSK, NIGHT, JOSEPH, MARY, BOY, kid, staff, pilgrims, tent, fireStones, fireFlames, lantern, question, bubble,
  jerusalem, glowDisc, hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { crossX } from '../mark6/lib.js';

const JK0 = [[0, 1260], [0.9, 980], [1.05, 980], [1.3, 760], [1.6, 760], [1.8, 540], [2.05, 540], [2.95, 1380]];
// phone: the parents stay inside the screen — Joseph in from the right, Mary in from the left, and still on the road back at 2.75
const JKP = [[0, 1160], [0.9, 920], [1.05, 920], [1.3, 760], [1.6, 760], [1.8, 590], [2.05, 590], [2.95, 1000]];

/** a family of relatives sitting by their tent (one still cut-out, for a sprite) */
function sitters(c, n = 3) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const o = crowdPerson(c);
    const k = 0.8 * c.rr(0.92, 1.05);
    out += `<g transform="translate(${i * 64} ${c.rr(-3, 3).toFixed(1)}) scale(${(i % 2 ? -k : k).toFixed(3)} ${k.toFixed(3)})">${person(c, { ...o, pose: 'sit', holdF: '', holdB: '' })}</g>`;
  }
  return `<g>${out}</g>`;
}

export default {
  id: 'lk2-search',
  beats: [
    { v: 44, text: 'Przypuszczając, że jest w towarzystwie pątników, uszli dzień drogi' },
    { v: 44, cont: true, text: 'i szukali Go wśród krewnych i znajomych.' },
    { v: 45 },
  ],
  cam: { x: [-60, 120], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const JK = PH ? JKP : JK0, CTX = PH ? 1060 : 1500;   // (and Jerusalem on the horizon, where they go back)
    const R = roadSet(S, { sky2: [DUSK, NIGHT], sunAt: [1300, 140], clouds: false });
    const cityL = S.layer({ par: 0.1, sh: 3 });
    const tglow = cityL.add(`<g>${glowDisc(140, 'halo-glow', 1)}</g>`);
    cityL.add(`<g transform="translate(${CTX} 540) scale(.3)">${jerusalem(c, 1)}</g>`);
    // the camp
    const camp = S.layer({ par: 0.36, sh: 4 });
    const tents = [[440, 1], [690, 0.85]].map(([x, s], i) => camp.add(`<g transform="translate(${x} ${RY - 30}) scale(${s})">${tent(c, { col: [C.wheatRobe, C.sageRobe][i], stripe: [C.terracotta, C.tealRobe][i] })}</g>`));
    const fireEl = camp.add(`<g transform="translate(600 ${RY + 20})">${fireStones(c, 80)}</g>`);
    const flames = camp.add(`<g>${fireFlames(c, 46)}</g>`);
    const W = S.layer({ par: 0.38, sh: 5 });
    const walkers = [0, 1].map((i) => ({ i, sp: W.sprite(pilgrims(c, 4, { s: 0.82, flip: true }), 800, RY + 2) }));
    const groups = [[500, 3], [760, 3]].map(([x, n], i) => ({ x, i, sp: W.sprite(sitters(c, n), x, RY + 14) }));
    const P = S.layer({ par: 0.4, sh: 5 });
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30), holdF: `<g transform="rotate(-50)">${lantern(c, { col: C.apricot })}</g>` })));
    const lanternOff = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const X = S.layer({ par: 0.36, sh: 5 });
    const ask = [0, 1].map(() => X.add(`<g>${question(c)}</g>`));
    const noPic = [0, 1].map(() => X.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 32, 20), 0.3, 4), C.haloRim).p(c.cut(c.circ(0, 0, 28, 20), 0.3, 4), C.cream).out()}<g transform="translate(-2 26) scale(.26)">${kid(c, { ...BOY, holdF: '', holdB: '' }, 1.1)}</g><g transform="scale(.8)">${crossX(c, 26)}</g></g>`));

    return (t, time) => {
      const T = time;
      /* v44a — a day's journey: the sun goes over and down */
      const day = es(t, 0, 0.95);
      const dusk = es(t, 0.5, 1.1) * (1 - es(t, 2.0, 2.4));
      const night = es(t, 2.0, 2.4);
      R.skies[0].layer.fade(dusk);
      R.skies[1].layer.fade(night);
      R.starL.fade(es(t, 1.2, 2.3));
      pose(R.sunEl, { x: PH ? lerp(1000, 600, day) : lerp(1300, 380, day), y: 140 + Math.sin(day * PI) * -30 + es(t, 0.6, 1.3) * 520, r: 0 });   // phone: the sun crosses and sets inside the screen
      hangAt(R.moonEl, 1200, 150, T, es(t, 2.0, 2.4), 1, 0.5, 1);
      pose(tglow, { x: CTX + 84, y: 540 - 60, o: 0.4 + night * 0.5 });
      walkers.forEach((w) => {
        const x = lerp(1400 + w.i * 380, 180 + w.i * 380, es(t, -0.3, 1.2, (u) => u));
        w.sp.set({ x, y: RY + 2, o: 1 - es(t, 1.1, 1.3) });
      });
      tents.forEach((te, i) => pose(te, { x: [440, 690][i], y: RY - 30, o: 1 }));
      const campK = es(t, 0.9, 1.2);
      groups.forEach((g) => g.sp.set({ x: g.x, y: RY + 14, o: campK }));
      pose(flames, { x: 600, y: RY + 16, sy: campK * (1 + (T ? Math.sin(T * 8) * 0.06 : 0)), sx: campK, o: campK > 0.01 ? 1 : 0 });

      /* v44b — they look for Him among relatives and friends */
      const jx = kf(t, JK, ease.sine);
      const walking = moving(t, JK, 0.3);
      const back = t > 2.0;
      const asking = bump(t, 1.05, 1.3) + bump(t, 1.6, 1.85);
      mary.set({ x: jx - (back ? -70 : 40), y: RY + 4, s: 0.94, flip: !back, walk: walking ? jx * 0.07 : undefined, amt: back ? 1.3 : 1, armF: 30 + asking * 60, armB: 20, head: asking * 6, blink: blinkAt(T, 1) });
      const lit = es(t, 2.0, 2.1);
      const jo = { x: jx + (back ? -20 : 60), y: RY + 6, s: 0.94, flip: !back, walk: walking ? jx * 0.07 + 1 : undefined, amt: back ? 1.3 : 1, armB: 30, head: 0, blink: blinkAt(T, 2) };
      lanternOff.set({ ...jo, o: 1 - lit, armF: 30 + asking * 30 });
      jos.set({ ...jo, o: lit, armF: 50 });
      ask.forEach((q, i) => {
        const k = es(t, 1.08 + i * 0.55, 1.2 + i * 0.55, ease.back) * (1 - es(t, 1.45 + i * 0.55, 1.55 + i * 0.55));
        vpose(q, { x: [760, 540][i] + 80, y: RY - 220, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
        const kn = es(t, 1.2 + i * 0.55, 1.32 + i * 0.55, ease.back) * (1 - es(t, 1.9 + i * 0.1, 2.05 + i * 0.1));
        vpose(noPic[i], { x: [760, 500][i] + 60, y: RY - 170, s: Math.max(0.001, kn), o: kn > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 90], [1.0, 20], [1.8, -40], [2.3, 0], [2.95, 110]], ease.sine);
      S.cam.y = 10;
      S.cam.z = 1.03;
    };
  },
};
