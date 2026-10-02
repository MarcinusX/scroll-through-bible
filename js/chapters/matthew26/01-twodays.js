// Mt 26,1–2 — evening on the Mount of Olives, Jerusalem across the valley under a great low sun. He has finished all
// these words: He rises from the rock where He sat teaching, and the Twelve look up. "In two days the Passover": a
// plate with the lamb and the unleavened bread comes down. "…and the Son of Man will be handed over to be
// crucified": on the far hill beside the city a small dark cross stands against the reddening sun, and it sinks.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, rock, grass, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { walledCity } from '../mark1/lib.js';
import { twoSkies, SUNSET, NIGHTFALL, TW, withFace, faceBits, discPlate, lamb, matzahRound, wordTag, bigSun, hillCross, tr, vis, kf, PI } from './lib.js';

const GY = 716, JX = 800;
const SUN = [1060, 392];

export default {
  id: 'mt26-twodays',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: '«Wiecie, że po dwóch dniach jest Pascha,' },
    { v: 2, cont: true, text: 'i Syn Człowieczy będzie wydany na ukrzyżowanie».' },
  ],
  cam: { x: [-40, 80], y: [-40, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const K = twoSkies(S, SUNSET, ['#4b4a7e', '#a7738a', '#d99a86']);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 60 }));
    starL.fade(0);
    const sunL = S.layer({ par: 0.06, sh: 1, flat: true });
    const sunEl = sunL.add(`<g>${bigSun(S, 150)}</g>`);
    const redEl = sunL.add(`<g><circle r="140" fill="${C.sunRay}" opacity=".6"/></g>`);

    // Jerusalem on its ridge; the hill of the cross beside it
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = band(c, { y: 452, amps: [6, 3, 1], lens: [900, 300, 120], color: mix(C.hillFar, C.dusk, 0.3) });
    const crossEl = far.add(`<g>${hillCross(c, '#3a2c3c')}</g>`);
    far.add(fb.markup);
    far.add(`<g><circle cx="880" cy="400" r="120" fill="url(#halo-glow)" opacity=".4"/></g>` + walledCity(c, 880, fb.fn(880) + 8, 0.72, { wall: mix(C.stone, C.dusk, 0.25), wall2: mix(C.stone2, C.dusk, 0.3), temple: mix(C.cream, C.dusk, 0.12) }));
    const mid = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dusk, 0.3), trees: 16, treeColor: mix(C.olive, C.dusk, 0.25), treeH: 22 });
    mid.add(h2.markup + cypress(c, 1320, h2.fn(1320) + 8, 110, mix(C.moss2, C.dusk, 0.3)));
    const ground = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(GY - 70, [4, 2], [600, 160]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage, C.dusk, 0.25)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: GY - 70, fn: gfn, n: 36, h: 12, color: mix(C.olive, C.dusk, 0.2) }) + olive(c, 180, gfn(180) + 30, 1.2, { trunk: C.wood2, leaf: mix(C.olive, C.dusk, 0.2), leaf2: mix(C.sage, C.dusk, 0.2) }) + olive(c, 1440, gfn(1440) + 30, 1.3, { trunk: C.wood2, leaf: mix(C.olive, C.dusk, 0.2), leaf2: mix(C.sage, C.dusk, 0.2) }));
    const dimL = S.layer({ par: 0.4, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".3"/>`);
    dimL.fade(0);

    // the feast, announced
    const plL = S.layer({ par: 0.42, sh: 5 });
    const plLamb = hanging(plL, discPlate(c, `<g transform="translate(-4 22) scale(.95)">${lamb(c)}</g>`, { r: 50, rim: C.ochre }), { x: 700, y: -1500, len: 600 });
    const plBread = hanging(plL, discPlate(c, matzahRound(c, 30), { r: 50, rim: C.ochre }), { x: 900, y: -1500, len: 600 });
    const plDays = hanging(plL, wordTag(c, tr('za dwa dni — Pascha', 'in two days — the Passover'), { size: 20 }), { x: 800, y: -1500, len: 600 });

    // the Twelve sitting round Him; He sits on a rock, then rises
    const P = S.layer({ par: 0.5, sh: 5 });
    P.add(rock(c, JX + 4, GY + 18, 120, 40, mix(C.rock2, C.dusk, 0.2)));
    const RING = [
      ['john', 690, 8], ['peter', 620, 0], ['andrew', 548, 10], ['james', 478, -4], ['thomas', 408, 8], ['philip', 1188, 8],
      ['matthew', 910, 8], ['judas', 980, 0], ['bartholomew', 1052, 10], ['jamesA', 1120, -4],
    ];
    const DIS = RING.map(([k, x, dy], i) => {
      const el = P.add(withFace(person(c, { ...TW[k], pose: 'sit' }), faceBits(c)));
      if (S.portrait) x = JX + (x - JX) * 0.7;   // phone: they sit closer round Him, so the whole ring is on screen
      return { k, x, y: GY + dy, i, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), seed: c.rr(0, 9), flip: x > JX };
    });
    const jSit = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jEl = P.add(withFace(person(c, CAST.jesus), faceBits(c)));
    const jesus = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* the light: the sun sinks and reddens at "crucified" */
      const red = es(t, 3.05, 3.5);
      const sink = es(t, 0.6, 3.9);
      K.sky2.fade(es(t, 2.9, 3.9));
      starL.fade(es(t, 3.3, 3.9) * 0.7);
      dimL.fade(es(t, 3.0, 3.8));
      pose(sunEl, { x: SUN[0], y: SUN[1] + sink * 70, s: 1 });
      pose(redEl, { x: SUN[0], y: SUN[1] + sink * 70, o: red });
      const cr = es(t, 3.15, 3.45);
      pose(crossEl, { x: 1150, y: fb.fn(1150) + 4 + (1 - cr) * 40, s: 0.62, o: cr });

      /* v1 — He finishes all these words and rises */
      const rise = es(t, 1.05, 1.12);
      const end = es(t, 0.9, 1.3);
      jSit.set({ x: JX + 4, y: GY - 4, s: 1.04, flip: false, o: 1 - rise, armF: 40 + bump(t, 0.1, 0.9) * 50, armB: 20 + bump(t, 0.2, 0.9) * 60, head: -4, blink: blinkAt(T) });
      const speak = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.05));
      const grave = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: GY, s: 1.04, flip: false, o: rise, armF: 20 + bump(t, 1.2, 1.9) * 40 + speak * 60 + grave * 20, armB: 10 + speak * 50, head: -bump(t, 1.2, 1.9) * 4 + grave * 12, blink: blinkAt(T) });
      fade(jSad, grave * 0.8);

      /* the disciples: they listen, look up as He rises, grow sad */
      DIS.forEach((d) => {
        const look = es(t, 1.1 + d.i * 0.02, 1.35 + d.i * 0.02);
        d.p.set({ x: d.x, y: d.y, s: 0.9, flip: d.flip, armF: 34 + look * 10 + (d.k === 'peter' ? bump(t, 2.3, 3.0) * 30 : 0), armB: 12, head: 6 - look * 12 + grave * 16, blink: blinkAt(T, d.seed) });
        fade(d.sad, grave * (d.k === 'judas' ? 0 : 1));
      });

      /* v2a — the plates of the feast */
      const pin = es(t, 2.02, 2.45, ease.out) * (1 - es(t, 2.95, 3.25, ease.in));
      const tin = es(t, 2.15, 2.55, ease.out) * (1 - es(t, 2.95, 3.25, ease.in));
      vis(plLamb, { x: 690, y: 330 - (1 - pin) * 700, r: Math.sin(T * 0.9) * 2, o: pin > 0.01 ? 1 : 0 });
      vis(plBread, { x: 910, y: 330 - (1 - pin) * 700, r: Math.sin(T * 0.9 + 2) * 2, o: pin > 0.01 ? 1 : 0 });
      vis(plDays, { x: 800, y: 214 - (1 - tin) * 700, r: Math.sin(T * 1.1 + 1) * 3, o: tin > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 0], [1.0, 0], [2.0, 0], [3.0, 40], [3.9, 60]]) * (S.portrait ? 0.4 : 1) + (S.portrait ? 24 : 0);   // phone: the ring stays centred in the space left of the thread
      S.cam.y = kf(t, [[-0.5, 30], [1.0, 40], [2.0, -10], [3.0, -20], [3.9, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.0], [1.0, 1.06], [2.0, 1.04], [3.0, 1.1], [3.9, 1.12]]);
    };
  },
};

