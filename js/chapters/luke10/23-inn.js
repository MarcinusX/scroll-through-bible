// Łk 10,34b–35 — further down the road, at dusk, an inn with a lit doorway. "Then he set him on his own animal,
// brought him to an inn and took care of him": the Samaritan comes leading his donkey by the halter, the bandaged man
// slumped over its neck; at the inn the wall opens like a doll's house — night, a lamp in the niche, the man on a mat,
// and the Samaritan kneeling by him, holding a cup to his lips. "The next day he took out two denarii, gave them to
// the innkeeper and said": dawn comes in at the window; the Samaritan stands, takes two silver coins from his purse
// and puts them in the innkeeper's hand. "Take care of him, and whatever more you spend, I will repay you when I come
// back": the innkeeper lays his hand on his heart and nods; the Samaritan goes out to his donkey and waves from the road,
// and the innkeeper kneels by the man with a bowl.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { oilLamp } from '../../assets/things.js';
import { jerichoSet, ROAD, lying, samaritan, samDonkey, coltRig, glow, bowl, cup, coin, purse, headBandage, addToHead, kf, moving, handAt, headAt, NIGHT, INNKEEPER, STRIPPED, es, ease, bump, seg, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const DAWN = ['#e9cfae', '#f5dcb8', '#fae9cc'];
const R0 = 860, R1 = 1380, TOP = 430, FL = ROAD.NEAR;       // the inn's room
const DOOR = [900, 990];
const MAT = [1250, FL - 6];                                   // the man's feet on the mat (his head to the left)

export default {
  id: 'lk10-inn',
  parable: true,
  beats: [
    { v: 34, text: 'potem wsadził go na swoje bydlę, zawiózł do gospody i pielęgnował go.' },
    { v: 35, text: 'Następnego zaś dnia wyjął dwa denary, dał gospodarzowi i rzekł:' },
    { v: 35, cont: true, text: '"Miej o nim staranie, a jeśli co więcej wydasz, ja oddam tobie, gdy będę wracał".' },
  ],
  cam: { x: [-40, 680], y: [-20, 50], z: [1, 1.12] },
  build(S) {
    const V = jerichoSet(S, { skyCols: DAWN, sky2: NIGHT, sunAt: [1260, 700], robbersRocks: false });
    const c = S.c;
    const ic = makeCutter('lk10-inn');

    /* the inn: the room inside, and its front wall (which opens) */
    const inside = S.layer({ par: 0.43, sh: 3 });
    const room = sheet();
    room.p(ic.cut([[R0, TOP], [R1, TOP], [R1, FL + 10], [R0, FL + 10]], 0.6, 10), mix(C.plaster2, C.clay, 0.25));
    room.p(ic.cut([[R0, FL - 30], [R1, FL - 30], [R1, FL + 10], [R0, FL + 10]], 0.4, 10), mix(C.sand2, C.wood3, 0.3));
    room.p(ic.cut(ic.rect(1180, 500, 70, 60), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    room.p(ic.cut([[1030, 540], [1090, 540], [1090, 580], [1030, 580]], 0.3, 5), shade(C.plaster2, -0.15));
    room.p(ic.cut([[MAT[0] - 230, FL - 4], [MAT[0] + 20, FL - 6], [MAT[0] + 24, FL + 6], [MAT[0] - 234, FL + 8]], 0.4, 8), C.basket);
    inside.add(room.out());
    const winDawn = inside.add(`<g><path d="${ic.poly(ic.rect(1184, 504, 62, 52))}" fill="${C.dawn}"/>${glow(80, 0.7)}</g>`);
    const lamp = inside.add(`<g>${glow(180, 1, 'warm-glow')}<g transform="scale(.7)">${oilLamp(ic)}</g></g>`);
    const PI_ = S.layer({ par: 0.43, sh: 5 });
    const man = PI_.add(`<g>${lying(addToHead(person(ic, { ...STRIPPED, eyes: 'closed' }), headBandage(ic)), 0.9)}</g>`);
    const kneel = S.puppet(PI_.add(samaritan(ic, { pose: 'kneel' })));
    const samIn = S.puppet(PI_.add(samaritan(ic, { holdF: '' })));
    const host = S.puppet(PI_.add(person(ic, INNKEEPER)));
    const hostK = S.puppet(PI_.add(person(ic, { ...INNKEEPER, pose: 'kneel', holdF: `<g transform="rotate(60)">${bowl(ic, { w: 30 })}</g>` })));
    const fxIn = S.layer({ par: 0.44, sh: 4 });
    const cupEl = fxIn.add(`<g>${cup(ic, C.pot)}</g>`);
    const purseEl = fxIn.add(`<g transform="scale(.8)">${purse(ic)}</g>`);
    const coins = [0, 1].map(() => fxIn.add(`<g>${coin(ic, 8)}</g>`));
    const heartGlow = fxIn.add(`<g>${glow(40, 0.9, 'warm-glow')}</g>`);

    const facade = S.layer({ par: 0.43, sh: 5 });
    const f = sheet();
    const door = [[DOOR[0], FL + 4], [DOOR[0], TOP + 120], ...ic.arc((DOOR[0] + DOOR[1]) / 2, TOP + 120, (DOOR[1] - DOOR[0]) / 2, 30, PI, 2 * PI, 10), [DOOR[1], FL + 4]];
    f.p(ic.cut([[R0 - 10, TOP - 10], [R1 + 10, TOP - 10], [R1 + 14, FL + 12], [R0 - 14, FL + 12]], 0.8, 10) + ic.hole(door, 0.4, 6), mix(C.plaster, C.sand, 0.3));
    f.p(ic.cut([[R0 - 24, TOP - 30], [R1 + 24, TOP - 30], [R1 + 24, TOP - 6], [R0 - 24, TOP - 6]], 0.5, 10), C.roof);
    f.p(ic.cut(ic.rect(1184, 504, 62, 52), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    f.p(ic.ribbon([[1180, 560], [1250, 560]], 5), C.wood2);
    facade.add(f.out());
    facade.add(`<g><path d="${ic.poly(door)}" fill="${C.lampGlow}" opacity=".9"/></g>`);
    const sign = facade.add(`<g transform="translate(1110 ${TOP + 40})">${sheet().p(ic.cut(ic.rect(-40, -16, 80, 32), 0.3, 5), C.wood3).out()}<path d="${ic.cut(ic.ell(-12, 0, 8, 6, 10), 0.2, 3) + ic.cut([[4, 8], [16, 8], [14, -8], [6, -8]], 0.2, 3)}" fill="${C.pot}"/></g>`);

    /* the road: the Samaritan leading the donkey with the man on it; later leaving */
    const P = S.layer({ par: 0.45, sh: 5 });
    const donkeyM = coltRig(P.add(samDonkey(c, 'man')));
    const donkeyE = coltRig(P.add(samDonkey(c, '')));
    const samOut = S.puppet(P.add(samaritan(c)));
    V.front();

    return (t, time) => {
      const T = time;
      const night = es(t, 0.1, 0.55) * (1 - es(t, 1.0, 1.35));
      V.sk2.layer.fade(night);
      V.starL.fade(night);
      V.update(T, { sunY: 700 - es(t, 1.05, 1.6) * 200, sunX: 1260 });

      /* v34b — led to the inn; the wall opens; he tends him through the night */
      const lead = [[0.0, 120], [0.42, 820]];
      const lx = kf(t, lead, (x) => x);
      const leading = moving(t, lead);
      const arrived = es(t, 0.44, 0.5);
      donkeyM.set({ x: lx - 120, y: ROAD.MID, s: 0.92, flip: false, walk: leading ? lx * 0.05 : undefined, nod: leading ? 0 : 2, o: 1 - arrived });
      const openK = es(t, 0.46, 0.58);
      facade.fade(1 - openK);
      const leave = [[2.4, DOOR[0] - 40], [2.75, 560]];
      const outX = kf(t, leave);
      const inX = t < 2.3 ? 1 : 0;
      samOut.set({ x: t < 1 ? lx + 10 : outX, y: ROAD.MID + 6, s: 0.98, flip: t >= 2.3, walk: leading || moving(t, leave) ? (t < 1 ? lx : outX) * 0.06 : undefined, armF: t < 1 ? 50 : 20 + es(t, 2.78, 2.9) * 110, armB: 20, head: t < 1 ? -4 : 0, o: t < 0.5 ? 1 - arrived : seg(t, 2.36, 2.42), blink: blinkAt(T, 3) });
      donkeyE.set({ x: 700, y: ROAD.MID, s: 0.92, flip: t > 2.3, o: t < 0.5 ? arrived : (t < 2.3 ? 1 : 1), nod: T ? Math.sin(T * 0.8) * 3 : 0 });
      pose(man, { x: MAT[0], y: MAT[1], o: openK });
      pose(lamp, { x: 1060, y: 540, s: 0.9 + (T ? Math.sin(T * 5) * 0.02 : 0), o: openK * (1 - es(t, 1.2, 1.5) * 0.6) });
      pose(winDawn, { o: es(t, 1.05, 1.4) });
      const tend = es(t, 0.58, 0.64) * (1 - es(t, 1.08, 1.14));
      kneel.set({ x: 960, y: FL + 2, s: 0.96, flip: false, armF: 60 + bump(t, 0.6, 1.0) * 20, armB: 20, head: 14, o: tend, blink: blinkAt(T, 3) });
      const [chx, chy] = handAt(960, FL + 2, 0.96, false, 60 + bump(t, 0.6, 1.0) * 20, 'kneel');
      pose(cupEl, { x: chx + 4, y: chy + 8, r: 30, o: tend });
      pose(heartGlow, { x: 972, y: FL - 110, o: tend * 0.8 });

      /* v35a — morning: two denarii into the innkeeper's hand */
      const up = es(t, 1.1, 1.16);
      const give = es(t, 1.4, 1.62);
      samIn.set({ x: 1010, y: FL + 2, s: 0.98, flip: false, armF: 20 + es(t, 1.2, 1.4) * 60, armB: 10, head: -2, o: up * (1 - seg(t, 2.3, 2.36)), blink: blinkAt(T, 3) });
      host.set({ x: 1200, y: FL + 2, s: 0.96, flip: true, armF: 20 + es(t, 1.4, 1.55) * 60 * (1 - es(t, 2.05, 2.2)) + es(t, 2.05, 2.2) * 40, armB: 10, head: 4 + bump(t, 2.15, 2.5) * 12, o: es(t, 1.05, 1.2) * (1 - es(t, 2.6, 2.66)), blink: blinkAt(T, 5) });
      hostK.set({ x: 1130, y: FL + 2, s: 0.96, flip: true, armF: 60, armB: 20, head: 14, o: es(t, 2.6, 2.66), blink: blinkAt(T, 5) });
      const [shx, shy] = handAt(1010, FL + 2, 0.98, false, 20 + es(t, 1.2, 1.4) * 60);
      const [ihx, ihy] = handAt(1200, FL + 2, 0.96, true, 80);
      pose(purseEl, { x: shx + 2, y: shy + 6, o: es(t, 1.15, 1.2) * (1 - es(t, 1.9, 2.0)) });
      coins.forEach((co, i) => {
        const k = es(t, 1.38 + i * 0.1, 1.6 + i * 0.1);
        pose(co, { x: lerp(shx + 6, ihx - 4 + i * 8, k), y: lerp(shy - 10, ihy - 6, k) - Math.sin(k * PI) * 40, r: k * 360, s: 1.2, o: es(t, 1.3 + i * 0.1, 1.34 + i * 0.1) * (1 - es(t, 2.4, 2.5)) });
      });

      S.cam.x = kf(t, [[0, 0], [0.45, 560], [1, 560], [2.3, 560], [2.8, 400], [3, 400]]);
      S.cam.y = kf(t, [[0, 20], [0.5, 30], [3, 30]]);
      S.cam.z = kf(t, [[0, 1.02], [0.5, 1.06], [2.3, 1.08], [3, 1.04]]);
    };
  },
};
