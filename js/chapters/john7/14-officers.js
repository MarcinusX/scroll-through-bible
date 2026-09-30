// J 7,45–49 — dusk in the chief priests' chamber. The officers come back through the door — empty-handed, the
// rope still coiled. "Why didn't you bring him?" They lower their spears and bow their heads; a golden plate of
// living water hangs among them, an echo of what they heard: "No one ever spoke like this man!" The Pharisees
// flare up: "Are you led astray too?" "Has any of the rulers or Pharisees believed in him?" — each of them folds his
// arms, stone hearts above. Through the window the crowd of pilgrims appears in the lamplit streets: "This crowd,
// which does not know the Law, is accursed."
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { bubble as bubble5 } from '../mark5/lib.js';
import { cord } from '../mark14/lib.js';
import {
  councilSet, COUNCIL, officerOpts, spear, headAt, hand, say, strip, nameTag, roundel, stoneHeart, thought, scrollRolled,
  waterChunks, waterGlowDef, LIVING, hangAt, vpose, tr, PI,
} from './lib.js';

const OXW = [1040, 1120, 1200];

export default {
  id: 'j7-officers',
  beats: [
    { v: 45, text: 'Wrócili więc strażnicy do arcykapłanów i faryzeuszów,' },
    { v: 45, cont: true, text: 'a ci rzekli do nich: «Czemuście Go nie pojmali?»' },
    { v: 46 },
    { v: 47 },
    { v: 48 },
    { v: 49 },
  ],
  cam: { x: [-290, 120], y: [-60, 40], z: [0.8, 1.2] },
  build(S) {
    const c = S.c;
    const ph = (wide, phone) => (S.portrait ? phone : wide);
    const OX = ph(OXW, [1020, 1090, 1160]);   // phone: the officers stand closer to the table
    const K = councilSet(S);
    const F = K.F;
    const gid = waterGlowDef(S);

    /* the officers */
    const O = S.layer({ par: 0.56, sh: 5 });
    const offs = OX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(O.add(person(c, { ...officerOpts(i), holdB: i === 0 ? `<g transform="translate(0 4)">${cord(c)}</g>` : '' }))), sp: O.add(`<g>${spear(c, 230)}</g>`) }));

    /* words and plates */
    const X = S.layer({ par: 0.56, sh: 6 });
    const whyB = X.add(`<g>${bubble5(c, tr(['Czemuście Go', 'nie pojmali?'], ['Why didn’t you', 'bring him?']), { size: 20, dir: -1 })}</g>`);
    const echoIn = (() => {
      const s = waterChunks(c, [[-90, -30], [-40, -10], [0, 10], [50, 20], [100, 40]], 1, [10, 18], gid);
      const s2 = waterChunks(c, [[-90, 20], [-30, 36], [20, 50], [100, 62]], 1, [8, 14], gid);
      return `<rect x="-110" y="-110" width="220" height="220" fill="${mix(C.night, C.indigo, 0.3)}"/><circle r="80" fill="url(#${gid})"/>${s.chunks[0].markup}${s2.chunks[0].markup}<circle cx="-50" cy="-40" r="30" fill="url(#halo-glow)"/>`;
    })();
    const echo = hanging(X, roundel(c, echoIn, { r: 74, face: C.night, rim: C.haloRim, id: S.id('echo') }), { x: ph(1110, 1080), y: 300, len: 600 });
    const neverB = X.add(`<g>${bubble5(c, tr(['Nikt jeszcze tak', 'nie przemawiał!'], ['No man ever', 'spoke like this man!']), { size: 19, dir: 1 })}</g>`);
    const astrayB = X.add(`<g>${bubble5(c, tr(['Czyż i wy daliście', 'się zwieść?'], ['Are you also', 'led astray?']), { size: 19, dir: -1, jag: true, fill: '#4a3f52', ink: C.cream })}</g>`);
    const anyB = X.add(`<g>${bubble5(c, tr(['Czy ktoś ze zwierzchników', 'uwierzył w Niego?'], ['Has any of the rulers', 'believed in him?']), { size: 18, dir: 1 })}</g>`);
    const stones = [0, 1, 2, 3].map(() => X.add(`<g>${thought(c, `<g transform="scale(.8)">${stoneHeart(c, 16)}</g>`, { w: 54, h: 44 })}</g>`));
    const cursedB = X.add(`<g>${bubble5(c, tr(['A ten tłum, który nie zna', 'Prawa, jest przeklęty!'], ['This multitude that doesn’t', 'know the law is accursed!']), { size: 18, dir: -1, jag: true, fill: '#4a3f52', ink: C.cream })}</g>`);
    const lawScroll = X.add(`<g>${scrollRolled(c, 50)}</g>`);

    return (t, time) => {
      const T = time;
      K.update(t, T);

      /* v45a — the officers come back through the door */
      const come = es(t, 0.0, 0.7, ease.sine);
      const bow = es(t, 2.1, 2.4) * (1 - es(t, 3.2, 3.5) * 0.5);
      const lower = es(t, 2.05, 2.4);
      offs.forEach((m) => {
        const x = lerp(1265 + m.i * 20, m.x, come);
        const y = F + 8 + (m.i % 2) * 6;
        const mv = come > 0 && come < 1;
        m.p.set({ x, y, s: 0.98, flip: true, walk: mv ? x * 0.05 + m.i : undefined, armF: 40 - lower * 10, armB: m.i === 0 ? 10 + bump(t, 1.1, 1.9) * 50 : 10, head: bow * 12, lean: bow * 4, blink: blinkAt(T, m.seed), o: x < 1255 ? 1 : 0 });
        const [shx, shy] = hand(x, y, 0.98, true, 40 - lower * 10, bow * 4);
        vpose(m.sp, { x: shx, y: shy, s: 0.98, r: -4 + lower * 28, o: x < 1255 ? 1 : 0 });
      });

      /* the council */
      const speak = (a, b) => bump(t, a, b);
      K.hp.set({ x: COUNCIL.HPX, y: F - 26, s: 0.98, armF: 20 + speak(1.05, 1.95) * 70, armB: 10, head: speak(1.05, 1.95) * -6 + es(t, 4.1, 4.3) * 10, blink: blinkAt(T, 1) });
      K.pr.set({ x: COUNCIL.PRX, y: F - 26, s: 0.94, armF: 20 + es(t, 4.1, 4.3) * 30, armB: 10 + es(t, 4.1, 4.3) * 30, head: es(t, 4.1, 4.3) * -8, blink: blinkAt(T, 2) });
      const angry = speak(3.05, 3.95);
      const point = es(t, 5.1, 5.35);
      K.phA.set({ x: COUNCIL.PHA, y: F + 8, s: 1, armF: 20 + speak(4.05, 4.95) * 60 + point * 90, armB: 10 + es(t, 5.05, 5.2) * 40, head: -point * 10, blink: blinkAt(T, 3) });
      K.phB.set({ x: COUNCIL.PHB, y: F + 8, s: 1, armF: 20 + angry * 80, armB: 10 + angry * 40, lean: angry * 5, head: -angry * 6 + es(t, 4.1, 4.3) * 8, blink: blinkAt(T, 4) });
      K.nico.set({ x: COUNCIL.NX, y: F - 10, s: 0.94, armF: 16, armB: 10, head: bump(t, 2.1, 3.0) * -6 + 4, blink: blinkAt(T, 5) });

      /* v45b — why didn't you bring him? */
      const [hx, hy] = headAt(COUNCIL.HPX, F - 26, 0.98, false);
      vpose(whyB, { x: hx + 22, y: hy - 16, s: es(t, 1.1, 1.3, ease.back), o: seg(t, 1.1, 1.15) * (1 - es(t, 1.9, 2.0)) });

      /* v46 — no one ever spoke like this man */
      const ek = es(t, 2.1, 2.45, ease.out), eu = es(t, 2.95, 3.1, ease.in);
      hangAt(echo, ph(1110, 1080), lerp(-300, 330, ek) - eu * 700, T, ek > 0 && eu < 1 ? 1 : 0, 1.2, 0.8, 1);
      const [ox, oy] = headAt(OX[0], F + 8, 0.98, true);
      vpose(neverB, { x: ox - 150, y: oy - 22, s: es(t, 2.2, 2.4, ease.back), o: seg(t, 2.2, 2.25) * (1 - es(t, 2.95, 3.05)) });

      /* v47 — are you led astray too? */
      const [bx, by] = headAt(COUNCIL.PHB, F + 8, 1, false);
      vpose(astrayB, { x: bx + 18, y: by - 16, s: es(t, 3.1, 3.3, ease.back), o: seg(t, 3.1, 3.15) * (1 - es(t, 3.95, 4.05)) });

      /* v48 — has any of the rulers believed? — stone hearts */
      const [ax, ay] = headAt(COUNCIL.PHA, F + 8, 1, false);
      vpose(anyB, { x: ax + 16, y: ay - 16, s: es(t, 4.1, 4.3, ease.back), o: seg(t, 4.1, 4.15) * (1 - es(t, 4.95, 5.05)) });
      [[COUNCIL.HPX, F - 26, 0.98], [COUNCIL.PRX, F - 26, 0.94], [COUNCIL.PHB, F + 8, 1], [COUNCIL.PHA, F + 8, 1]].forEach(([x, y, s], i) => {
        const [sx, sy] = headAt(x, y, s, false);
        const k = es(t, 4.35 + i * 0.07, 4.55 + i * 0.07, ease.back);
        vpose(stones[i], { x: sx + 4, y: sy - (i === 3 ? 70 : 24), s: k * 0.85, o: seg(t, 4.35 + i * 0.07, 4.4 + i * 0.07) * (1 - es(t, 4.95, 5.05)) });
      });

      /* v49 — the crowd through the window: "accursed" */
      K.R.crowd.fade(es(t, 5.0, 5.3));
      vpose(cursedB, { x: ax - 20, y: ay - 16, s: es(t, 5.2, 5.4, ease.back), o: seg(t, 5.2, 5.25) });
      vpose(lawScroll, { x: COUNCIL.PHA - 20, y: F - 90, r: -20, o: es(t, 5.05, 5.2) });

      // phone: the camera follows the talk — the officers and the high priest first, then the Pharisees on the left
      S.cam.x = S.portrait ? 110 - es(t, 3.9, 4.25) * 390 : 30 - es(t, 2.9, 3.3) * 60 + es(t, 4.9, 5.3) * 10;
      S.cam.y = 10;
      S.cam.z = S.portrait ? 0.84 : 1.1;   // phone: a wider view of the chamber
    };
  },
};
