// Łk 15,6 — a village street at night, the moon up, a row of little houses with arched doors, all dark. "And he
// comes home": the shepherd walks in from the left with the sheep across his shoulders and the lantern in his hand,
// down the street to his own door. "He calls together his friends and neighbours": he knocks at the doors — one
// after another they light up, and out come the neighbours with their little lamps, a man, two women, a boy; they
// gather round him and the found sheep. "Rejoice with me, for I have found my sheep that was lost!" — they throw up
// their hands, a tambourine rattles, the boy reaches up to stroke the sheep, and the lamps glow warm in the doorways.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  villageStreet, VS, SHEPHERD, staff, lanternHeld, shoulderLamb, onShoulders, lampHold, lamp, say, tambourine, heart, glow,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';
import { childPerson } from '../matthew2/lib.js';

const GY = VS.GY;
const lantern = (c) => lanternHeld(c, 40).replace(/<circle class="glow"[^>]*\/>/, '');
const HOME = 700;   // where he stands, by his own door
const NB = [
  { h: 0, x: 470, o: { robe: C.dustyBlue, mantle: C.ochre, hair: C.greyHair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather }, t0: 1.2 },
  { h: 2, x: 836, o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.hair3, skin: C.skin3, beard: 'none', belt: C.ochre }, t0: 1.3, flip: true },
  { h: 3, x: 1000, o: { robe: C.sageRobe, mantle: C.wheatRobe, hairStyle: 'veil', veil: C.skyVeil, hair: C.hair2, skin: C.skin, beard: 'none' }, t0: 1.42, flip: true, tamb: true },
];

export default {
  id: 'lk15-home',
  parable: true,
  beats: [
    { v: 6, text: 'i wraca do domu;' },
    { v: 6, cont: true, text: 'sprasza przyjaciół i sąsiadów i mówi im: "Cieszcie się ze mną, bo znalazłem owcę, która mi zginęła".' },
  ],
  cam: { x: [-80, 60], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const V = villageStreet(S);
    const c = V.c;
    const L = V.people;

    const shepGlow = V.glowL.add(`<g>${glow(110, 0.7)}</g>`);
    const nGlows = NB.map(() => V.glowL.add(`<g opacity="0">${glow(90, 0.7)}</g>`));
    const neighbours = NB.map((n, i) => ({ ...n, i, p: S.puppet(L.add(person(c, { ...n.o, holdF: n.tamb ? `<g transform="translate(2 6)">${tambourine(c)}</g>` : lampHold(c) }))) }));
    const boy = S.puppet(L.add(childPerson(c, { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', skin: C.skin2, belt: C.rope })));
    const shep = S.puppet(L.add(onShoulders(person(c, { ...SHEPHERD, holdF: lantern(c), holdB: staff(c, 200, 30) }), shoulderLamb(c, C.linen))));
    const knock = V.fx.add(`<g opacity="0"><path d="${c.ribbon([[-14, -12], [-26, -20]], 3) + c.ribbon([[-14, 0], [-28, 0]], 3) + c.ribbon([[-14, 12], [-26, 20]], 3)}" fill="${C.cream}"/></g>`);
    const joyB = V.fx.add(`<g opacity="0">${say(c, [tr('Cieszcie się ze mną,', 'Rejoice with me,'), tr('znalazłem moją owcę!', 'I have found my sheep!')], { size: 20, side: 1 })}</g>`);
    const hearts = [0, 1, 2].map((i) => V.fx.add(`<g opacity="0">${heart(c, 10 + i * 2)}</g>`));

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v6a — home: he walks down the street to his own door, which lights up */
      const K = [[0.0, 120], [0.72, HOME]];
      const sx = kf(t, K, (x) => x);
      const turn = es(t, 1.02, 1.1) * (1 - es(t, 1.5, 1.6));
      const call = bump(t, 1.08, 1.5);
      const joy = es(t, 1.55, 1.7);
      shep.set({ x: sx, y: GY, s: 1.02, flip: turn > 0.5, walk: moving(t, K) ? sx * 0.05 : undefined, armF: 40 + call * 30, armB: 20 + joy * 120, head: -joy * 8, bob: -joy * Math.abs(Math.sin(t * PI * 5)) * 6, blink: blinkAt(T, 2) });
      const [lx, ly] = handP(sx, GY, 1.02, turn > 0.5, 40 + call * 30);
      pose(shepGlow, { x: lx, y: ly + 22, o: 1 });
      V.light(1, es(t, 0.66, 0.8));

      /* v6b — he calls them: the doors light one after another, out they come */
      pose(knock, { x: V.houses[0].door + 40, y: GY - 90, o: bump(t, 1.06, 1.22), s: 0.8 });
      neighbours.forEach((n) => {
        V.light(n.h, es(t, n.t0 - 0.12, n.t0));
        const door = V.houses[n.h].door;
        const NK = [[n.t0, door], [n.t0 + 0.2, n.x]];
        const x = kf(t, NK);
        const cheer = es(t, 1.55 + n.i * 0.05, 1.7 + n.i * 0.05);
        const armF = n.tamb ? 40 + cheer * 60 : 50;
        n.p.set({ x, y: GY, s: 0.94, flip: n.flip, o: es(t, n.t0 - 0.02, n.t0 + 0.04), walk: moving(t, NK) ? x * 0.06 : undefined, armF, armB: 10 + cheer * 140, head: -cheer * 8, bob: -cheer * Math.abs(Math.sin(t * PI * 6 + n.i)) * 5, blink: blinkAt(T, n.i + 3) });
        const [hx, hy] = handP(x, GY, 0.94, n.flip, armF);
        pose(nGlows[n.i], { x: hx, y: hy + 6, o: n.tamb ? 0 : es(t, n.t0 - 0.02, n.t0 + 0.06) });
      });
      const BK = [[1.34, V.houses[2].door], [1.56, 780]];
      const bx = kf(t, BK);
      boy.set({ x: bx, y: GY, s: 0.6, flip: true, o: es(t, 1.32, 1.36), walk: moving(t, BK) ? bx * 0.08 : undefined, armF: es(t, 1.6, 1.72) * 150, armB: 20, head: -es(t, 1.6, 1.72) * 12, blink: blinkAt(T, 7) });
      const jb = es(t, 1.46, 1.58, ease.back);
      const [jx, jy] = headP(HOME, GY, 1.02);
      pose(joyB, { x: jx + 26, y: jy - 34, s: Math.max(0.001, jb), o: jb > 0.01 ? 1 : 0 });
      hearts.forEach((h, i) => {
        const k = seg(t, 1.6 + i * 0.08, 1.98);
        pose(h, { x: HOME + (i - 1) * 60, y: 420 - k * 50, s: Math.sin(Math.min(1, k * 1.5) * PI * 0.5), o: k > 0 && k < 1 ? 1 - Math.max(0, k - 0.75) / 0.25 : 0 });
      });

      S.cam.x = kf(t, [[0, -60], [0.72, -10], [1.1, 0], [1.6, 20]]);
      S.cam.y = kf(t, [[0, 30], [1.6, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [0.72, 1.06], [1.1, 1.02], [1.6, 1.06]]);
    };
  },
};
