// Mt 5,14 — evening falls on the mountain. "You are the light of the world": a small flame kindles from Jesus'
// light in the hands of each of the four, and then little lights spread over the whole crowd on the slope, down
// towards the dark lake. "A city set on a hill cannot be hidden": across the water, on its high hill, a town
// lights its windows one by one; a bank of mist drifts in to hide it, but the town shines above it.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { house, stars } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, SKY, JX, JY, JS, teach, hand, smallFlame, tint, DY, PI } from './lib.js';

const CITY = [1030, 360];

export default {
  id: 'mt5-city',
  beats: [
    { v: 14, text: 'Wy jesteście światłem świata.' },
    { v: 14, cont: true, text: 'Nie może się ukryć miasto położone na górze.' },
  ],
  cam: { x: [-10, 60], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = mountSet(S, { skyCols: SKY.dusk, sky2Cols: SKY.night, tintCol: C.indigo, tintK: 0.1, sunXY: [1300, 470], starsN: 110 });
    const starL = set.starL;

    /* the city on its hill, across the water */
    const cityL = S.layer({ par: 0.12, sh: 3 });
    const hill = sheet().p(c.cut([[CITY[0] - 300, 438], [CITY[0] - 150, 420], [CITY[0] - 70, 382], [CITY[0] + 40, 372], [CITY[0] + 120, 392], [CITY[0] + 220, 424], [CITY[0] + 330, 438]], 1, 8), tint(mix(C.hillFar, C.duskViolet, 0.12), C.indigo, 0.32)).out();
    let hs = '';
    [[-110, 392, 50, 36], [-66, 380, 44, 42], [-20, 372, 56, 48], [36, 370, 50, 40], [82, 384, 46, 34], [-150, 410, 40, 30], [124, 400, 42, 30]].forEach(([dx, y, w, h]) => { hs += house(c, CITY[0] + dx, y + 6, w, h, { stairs: false, wall: mix(C.plaster, C.indigo, 0.3), shadow: mix(C.plaster2, C.indigo, 0.4), win: mix(C.soilDark, C.indigo, 0.3) }); });
    // a wall around the town
    const wall = sheet().p(c.cut([[CITY[0] - 170, 412], [CITY[0] + 160, 404], [CITY[0] + 162, 418], [CITY[0] - 172, 426]], 0.4, 8), mix(C.stone2, C.indigo, 0.35)).out();
    cityL.add(hill + hs + wall);
    const cityGlow = cityL.add(`<g><circle r="170" fill="url(#warm-glow)"/></g>`);
    let wins = '';
    [[-100, 368], [-56, 356], [-10, 346], [4, 352], [48, 350], [92, 366], [-140, 394], [132, 384], [-30, 390], [70, 388]].forEach(([dx, y]) => { wins += c.poly(c.rect(CITY[0] + dx, y, 8, 8)); });
    const lit = cityL.add(`<g><path d="${wins}" fill="${C.lampFlame}"/></g>`);
    const rays = cityL.add(`<g>${(() => { let d = ''; for (let i = 0; i < 12; i++) { const a = PI + (i + 0.5) / 12 * PI, w = 0.05; d += c.poly([[Math.cos(a - w) * 60, Math.sin(a - w) * 30], [Math.cos(a) * 220, Math.sin(a) * 150], [Math.cos(a + w) * 60, Math.sin(a + w) * 30]]); } return `<path d="${d}" fill="#fff0c0" opacity=".5"/>`; })()}</g>`);
    // the bank of mist that tries to hide it (slides as a whole sheet)
    const mistL = S.layer({ par: 0.14, sh: 2, pad: 320 });
    let mist = '';
    for (let i = 0; i < 7; i++) mist += `<path d="${c.cut(c.blob(CITY[0] - 240 + i * 80, 420 + (i % 2) * 10, 90, 26, 12, 0.2), 1, 8)}" fill="${mix(C.lavender, C.indigo, 0.25)}" opacity=".9"/>`;
    mistL.add(`<g>${mist}</g>`);

    /* the crowd's lights (one still sheet, faded in) */
    const lightsL = S.layer({ par: 0.3, sh: 1 });
    const crowdLit = lightsL.sprite(set.lights(), 800, 560);

    /* Jesus and the four, with their little flames */
    const { jesus, four, jGlow } = set.circle({ glow: true });
    const flames = four.map((f) => set.L.add(`<g>${smallFlame(c, 18)}</g>`));
    set.front();

    return (t, time) => {
      const T = time;
      const night = es(t, 0, 1.2);
      set.sk2.layer.fade(night);
      starL.fade(0.2 + night * 0.8);
      set.wash.fade(0.1 + night * 0.26);
      set.update(T, { sunY: 470 + night * 200, sunO: 1 - night });

      /* beat 0 — the light of the world */
      const shine = es(t, 0.05, 0.35);
      teach(jesus, T, { armF: 20 + shine * 30, armB: 30 + shine * 60, head: -4, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 110, s: 0.7 + shine * 0.5, o: 0.35 + shine * 0.5 });
      four.forEach((f, i) => {
        const k = es(t, 0.28 + i * 0.07, 0.42 + i * 0.07, ease.back);
        const a = 60 + k * 10;
        f.p.set({ x: f.x, y: f.y, s: f.s, flip: f.flip, lean: f.dir * 2, armF: a, armB: 20 + k * 30, head: -4 + k * 6 - es(t, 1.2, 1.5) * 12, blink: blinkAt(T, f.seed) });
        const [hx, hy] = hand(f.x, f.y, f.s, f.flip, a, f.dir * 2, DY.sit);
        pose(flames[i], { x: hx, y: hy - 4, s: k * (1 + Math.sin(T * 7 + i) * 0.06), o: k > 0.01 ? 1 : 0 });
      });
      crowdLit.set({ o: es(t, 0.55, 0.8) });

      /* beat 1 — the city on the hill: its windows light, the mist comes and cannot hide it */
      const wk = es(t, 1.08, 1.4);
      pose(lit, { o: wk });
      pose(cityGlow, { x: CITY[0], y: 380, s: 0.6 + wk * 0.5, o: wk * 0.9 });
      const mk = es(t, 1.3, 1.62);
      mistL.shift(lerp(-300, 0, mk), 0);
      mistL.fade(mk);
      pose(rays, { x: CITY[0], y: 360, s: 0.6 + es(t, 1.45, 1.7) * 0.5, o: es(t, 1.45, 1.7) * 0.9 });

      S.cam.x = es(t, 1.0, 1.5) * 50;
      S.cam.y = -20 - es(t, 1.0, 1.5) * 16;
      S.cam.z = 1.02 + es(t, 1.0, 1.5) * 0.08;
    };
  },
};
