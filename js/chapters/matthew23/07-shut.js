// Mt 23,13 — the first woe. In the court Jesus turns towards the stairs; a dark tag "Woe · I" drops from the flies.
// At the top of the stairs a golden gate of the Kingdom stands open, full of light, and people climb towards it — a
// mother with her child, an old man. The Pharisee and the scribe, standing in the gateway, swing its doors shut in
// their faces and turn the big key: "you shut the Kingdom of Heaven against people". Then the two stand with their
// backs to the closed gate, arms spread across the stairs — they go in no more than anyone else — and the climbers
// turn and go down again, heads bowed, while the light leaks out through the crack between the doors.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, voiceRings, pose3, folk, child, vain, PH, SC, kingdomGate, gateDoor, bigKey, woeDrop, TWELVE } from './lib.js';

const JX = 560;
const GX = 800, GT = 412;                  // the gate on the top landing of the stairs
/** the stair-step surface at a height u (0 = top landing, 1 = court floor) */
const stepY = (u) => lerp(GT, 600, u);

export default {
  id: 'mt23-shut',
  beats: [
    { v: 13, text: 'Biada wam, uczeni w Piśmie i faryzeusze, obłudnicy, bo zamykacie królestwo niebieskie przed ludźmi.' },
    { v: 13, cont: true, text: 'Wy sami nie wchodzicie i nie pozwalacie wejść tym, którzy do niego idą.' },
  ],
  cam: { x: [0, 20], y: [-30, 0], z: [1, 1.05] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    /* the gate of the Kingdom on the top landing, and the people on the stairs (same depth as the stairs) */
    const far = S.layer({ par: 0.28, sh: 4 });
    const G = kingdomGate(c, 130, 190);
    const light = far.add(`<g><circle cy="-100" r="260" fill="url(#halo-glow)"/>${G.light}</g>`);
    const doorL = far.add(`<g>${gateDoor(c, 65, 142)}</g>`);
    const doorR = far.add(`<g>${gateDoor(c, 65, 142)}</g>`);
    const crack = far.add(`<g><path d="M-3 -142H3V0H-3Z" fill="#fff4d2"/><ellipse cy="4" rx="60" ry="10" fill="url(#halo-glow)"/></g>`);
    far.add(`<g transform="translate(${GX} ${GT})">${G.frame}</g>`);
    const MUM = folk(c, false, { robe: C.tealRobe, mantle: C.wheatRobe });
    const climbers = [
      { o: MUM, u0: 0.95, u1: 0.5, dx: -40, s: 0.7 },
      { o: child(c, true), u0: 1.0, u1: 0.55, dx: -8, s: 0.5 },
      { o: { robe: C.stone2, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope }, u0: 1.0, u1: 0.6, dx: 60, s: 0.72 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(far.add(person(c, m.o))) }));
    const pair = [PH, SC].map((o, i) => ({ i, p: S.puppet(far.add(vain(c, o, i === 1 ? { holdF: `<g transform="translate(2 4) rotate(80)">${bigKey(c)}</g>` } : {}))) }));

    /* Jesus, a few disciples and the crowd in the court */
    const stepL = S.layer({ par: 0.45, sh: 4 });
    stepL.sprite(pose3(c, Array.from({ length: 5 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: true, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 1010, 604);
    const P = S.layer({ par: 0.5, sh: 5 });
    P.sprite(pose3(c, [TWELVE[2].o, TWELVE[0].o, TWELVE[3].o].map((o, i) => ({ x: -i * 62, y: (i % 2) * 10, s: 0.92, flip: false, head: -6, o }))), 430, F + 10);
    P.sprite(pose3(c, Array.from({ length: 4 }, (_, i) => ({ x: i * 58 + c.rr(-6, 6), y: (i % 2) * 10, s: 0.88, flip: true, head: -4, armF: c.rr(0, 20), o: folk(c) }))), 1150, F + 10);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 5, color: C.clay });
    const woe = woeDrop(P, c, 1, { x: 1210, y: 170 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      woe(es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.85, 2.0)), T);

      /* the doors swing shut (0.45–0.58) and stay shut; light only through the crack */
      const shut = es(t, 0.45, 0.58, ease.in);
      pose(doorL, { x: GX - 65, y: GT, sx: lerp(0.14, 1, shut), o: 1 });
      pose(doorR, { x: GX + 65, y: GT, sx: -lerp(0.14, 1, shut), o: 1 });
      pose(light, { x: GX, y: GT, o: 1 - shut * 0.85 });
      pose(crack, { x: GX, y: GT, o: shut * (0.7 + (T ? Math.sin(T * 2) * 0.2 : 0)) });

      /* the climbers go up (0–0.45), stop at the slam, turn and go down (1.1–1.8) */
      climbers.forEach((m) => {
        const up = es(t, 0.0 + m.i * 0.05, 0.46);
        const back = es(t, 1.1 + m.i * 0.06, 1.75 + m.i * 0.04);
        const u = lerp(lerp(m.u0, m.u1, up), m.u0 + 0.05, back);
        const x = GX + m.dx + (1 - u) * -10 + back * (m.i === 2 ? 60 : -60);
        const recoil = bump(t, 0.52, 0.9);
        const s = m.s * lerp(0.86, 1.06, u);
        const going = (up > 0.02 && up < 0.98) || (back > 0.02 && back < 0.98);
        m.p.set({
          x, y: stepY(u), s, flip: back > 0.02 ? m.i !== 2 : m.i === 2, walk: going ? t * 30 + m.i : undefined, amt: 0.7,
          head: -8 * (1 - back) - recoil * 6 + back * 16, lean: -recoil * 8 + back * 6, armF: 30 + recoil * 60 * (1 - back) + (m.i === 0 ? 30 : 0), armB: recoil * 40, blink: blinkAt(T, m.seed),
        });
      });

      /* the Pharisee and the scribe: shut the doors, turn the key; then bar the stairs with their arms */
      const bar = es(t, 1.05, 1.3);
      pair.forEach((p) => {
        const side = p.i ? 1 : -1;
        const push = bump(t, 0.4, 0.62);
        const key = p.i === 1 ? bump(t, 0.6, 0.95) : 0;
        const x = GX + side * lerp(92, 52, bar);
        p.p.set({
          x, y: GT + 4 + bar * 12, s: 0.6, flip: bar > 0.5 ? side < 0 : side > 0,
          armF: 20 + push * 80 + key * 50 + bar * 70, armB: 10 + push * 40 + bar * 60, head: -bar * 12 - (1 - bar) * 4, lean: -bar * 4,
          blink: blinkAt(T, p.i + 4),
        });
      });

      /* Jesus pronounces the woe */
      jesus.set({ x: JX, y: F, s: 1.04, armF: 40 + es(t, 0.05, 0.3) * 40 * (1 - bump(t, 1.1, 1.9) * 0.3), armB: 20 + bump(t, 0.05, 0.9) * 40, head: -6, blink: blinkAt(T) });
      voice(JX + 28, F - 180, bump(t, 0.02, 0.9) + bump(t, 1.02, 1.8) * 0.7, T, { dir: 1 });

      S.cam.x = 10;
      S.cam.y = -es(t, 0.0, 0.5) * 20;
      S.cam.z = 1.02;
    };
  },
};
