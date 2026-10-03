// Mk 2,19b–20 — a wedding at night: while the bridegroom is with them, the guests dance and feast.
// Then the strings come down and the bridegroom is lifted away; the lanterns go out; they fast.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, town, moon, stars, cloud, cypress, hang } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, headAt, townsfolk, addToHead, wreath, canopy, garland, lantern, bowl, loaf, cup, grapes, tambourine, spark } from './lib.js';

const PI = Math.PI;
const FLOOR = 684;

export default {
  id: 'm2-wedding',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 19, cont: true, text: 'Nie mogą pościć, jak długo pana młodego mają u siebie.' },
    { v: 20, text: 'Lecz przyjdzie czas, kiedy zabiorą im pana młodego,' },
    { v: 20, cont: true, text: 'a wtedy, w ów dzień, będą pościć.' },
  ],
  cam: { x: [-20, 20], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#3a3f78', '#7a6495', '#c9949a'], { name: 'feast' });
    const dark = sky(S, [C.night2, C.night, mix(C.indigo, C.night, 0.3)], { name: 'dark' }).layer;
    const hangL = S.layer({ par: 0.04, sh: 3 });
    hangL.add(stars(c, { x0: -600, x1: 2200, y0: -300, y1: 380, n: 90 }));
    const MOONX = S.portrait ? 1000 : 1160;   // phone: not under the progress thread
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 40)}`, { x: MOONX, y: 150, len: 700 });
    const cloudEl = hanging(hangL, cloud(c, 230, mix(C.storm, C.duskViolet, 0.4), mix(C.storm2, C.duskViolet, 0.3)), { x: 1500, y: 160, len: 700 });

    /* the village at night */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.night, 0.45) });
    const nightWall = mix(C.plaster, C.duskViolet, 0.45), nightShadow = mix(C.plaster2, C.night, 0.4);
    far.add(h1.markup + town(c, { x: 260, y: h1.fn(260) + 14, n: 8, spread: 420, sc: 0.62, wall: nightWall, shadow: nightShadow, lit: true }) + town(c, { x: 1370, y: h1.fn(1370) + 14, n: 7, spread: 380, sc: 0.6, wall: nightWall, shadow: nightShadow, lit: true }));
    far.add(cypress(c, 560, h1.fn(560) + 6, 110, mix(C.moss2, C.night, 0.4)) + cypress(c, 1050, h1.fn(1050) + 6, 120, mix(C.moss2, C.night, 0.4)));
    const court = S.layer({ par: 0.3, sh: 3 });
    const floor = sheet();
    floor.p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.duskViolet, 0.3));
    let tiles = '';
    for (let r = 0; r < 6; r++) tiles += c.ribbon([[-900, 612 + r * r * 8 + r * 14], [2500, 612 + r * r * 8 + r * 14]], 1.4);
    floor.x(tiles, mix(C.stone2, C.night, 0.3), 'opacity=".5"');
    court.add(floor.out());
    const pool = court.add(`<ellipse cx="800" cy="690" rx="560" ry="150" fill="url(#warm-glow)" opacity=".5"/>`);

    /* lantern strings and garlands */
    const flyL = S.layer({ par: 0.4, sh: 4 });
    const G = [[240, 330], [570, 460], [1030, 330]].map(([x, w], i) => ({ x, w, i, el: flyL.add(`<g><path d="M0 -1600V0M${w} -1600V0" stroke="rgba(240,220,190,.4)" stroke-width="1.1" fill="none"/>${garland(c, w, 46)}</g>`) }));
    const LAN = [330, 440, 640, 800, 960, 1140, 1260].map((x, i) => {
      const el = hanging(flyL, lantern(c, { col: [C.apricot, C.roseRobe, C.wheat][i % 3] }), { x, y: 300, len: 800 });
      return { x, i, el, glow: el.querySelector('.glow'), y: 290 + (i % 2) * 22 };
    });

    /* the canopy */
    const canL = S.layer({ par: 0.5, sh: 5 });
    const cp = sheet();
    cp.p(c.cut(c.rect(612, 376, 10, FLOOR - 376), 0.4, 8) + c.cut(c.rect(978, 376, 10, FLOOR - 376), 0.4, 8), C.wood3);
    canL.add(cp.out() + `<g transform="translate(800 368)">${canopy(c, 420, 44)}</g>`);
    const ribbons = canL.add(`<g>${sheet().p(c.ribbon(c.qbez([618, 380], [590, 470], [606, 560], 10), 5) + c.ribbon(c.qbez([984, 380], [1012, 470], [996, 560], 10), 5), C.jesusMantle).out()}</g>`);

    /* the bridegroom, and the strings that take him away */
    const groomL = S.layer({ par: 0.52, sh: 6 });
    const strings = groomL.add(`<path d="M-14 -2000V0M20 -2000V0" stroke="rgba(255,240,210,.75)" stroke-width="1.4" fill="none"/>`);
    const groom = S.puppet(groomL.add(addToHead(person(c, { robe: C.linen, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.terracotta }), wreath(c))));
    const glowG = groomL.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);

    /* the guests: dancing, then reaching, then sitting in the dark */
    const guestL = S.layer({ par: 0.56, sh: 5 });
    const SPEC = [
      { x: 470, hold: 'tamb' }, { x: 548 }, { x: 626, hold: 'cup' },
      { x: 976, hold: 'cup' }, { x: 1054 }, { x: 1132, hold: 'tamb' },
    ].map((g, i) => (S.portrait ? { ...g, x: [506, 566, 628, 974, 1030, 1080][i] } : g))   // phone: the outer dancers inside the screen
      .map((g, i) => {
      const o = townsfolk(c, { mantle: null });
      const holdF = g.hold === 'tamb' ? `<g transform="translate(0 6)">${tambourine(c)}</g>` : g.hold === 'cup' ? `<g transform="translate(0 -4) rotate(180)">${cup(c, C.clay)}</g>` : '';
      return { ...g, i, o, flip: g.x > 800, ph: c.rr(0, 6), seed: c.rr(0, 9), st: S.puppet(guestL.add(person(c, { ...o, holdF }))), sit: S.puppet(guestL.add(person(c, { ...o, pose: 'kneel' }))) };
    });
    // supper on a cloth in front
    const cloth = sheet();
    cloth.p(c.cut([[500, FLOOR + 6], [1100, FLOOR + 4], [1120, FLOOR + 34], [480, FLOOR + 36]], 0.8, 10), C.cream);
    let pat = '';
    for (let x = 510; x < 1100; x += 30) pat += c.cut(c.star(x, FLOOR + 20, 5, 2.2, 4, 0), 0.2, 3);
    cloth.x(pat, C.terracotta, 'opacity=".6"');
    guestL.add(cloth.out());
    const DISH = [[560, 'bread'], [680, 'fruit'], [920, 'stew'], [1040, 'bread']].map(([x, food], i) => ({
      x, i, full: guestL.add(`<g>${bowl(c, { food, color: i % 2 ? C.skyVeil : C.pot })}</g>`), empty: guestL.add(`<g>${bowl(c, { food: null, color: i % 2 ? C.skyVeil : C.pot })}</g>`),
    }));
    guestL.add([[620, loaf(c, 16)], [860, grapes(c)], [760, cup(c)], [990, loaf(c, 14)]].map(([x, m]) => `<g transform="translate(${x} ${FLOOR + 20})">${m}</g>`).join(''));

    /* night falls over everything */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);
    const joyL = S.layer({ par: 0.6, sh: 4 });
    const confetti = Array.from({ length: 12 }, (_, i) => ({ i, el: joyL.add(`<g>${spark(c, c.rr(6, 10), i % 2 ? C.halo : C.blushVeil)}</g>`), x: lerp(420, 1180, i / 11) + c.rr(-20, 20), y: c.rr(330, 470), ph: c.rr(0, 6) }));

    return (t, time) => {
      const T = time;
      const gone = es(t, 1.35, 1.95, ease.in);           // the bridegroom is lifted away
      const night = es(t, 1.05, 2.3);
      dark.fade(night);
      tint.fade(night * 0.32);
      fade(pool, 0.5 * (1 - night * 0.8));
      swing(moonEl, MOONX, 150, T, 0.8, 0.5);
      swing(cloudEl, lerp(1500, MOONX + 10, es(t, 1.0, 1.6)), 160, T, 1, 0.6, 1);

      /* lanterns glow, then go out one by one (one stays, faint) */
      LAN.forEach((l) => {
        const out = es(t, 1.05 + l.i * 0.08, 1.3 + l.i * 0.08) * (l.i === 3 ? 0.7 : 1);
        fade(l.glow, (0.85 + Math.sin(T * 3 + l.i) * 0.08) * (1 - out));
        pose(l.el, { x: l.x, y: l.y + es(t, 2.05, 2.5) * (l.i % 2 ? 30 : 16), r: Math.sin(T * 1.1 + l.i) * 3 * (1 - night * 0.6) });
      });
      G.forEach((g) => pose(g.el, { x: g.x, y: 230 + es(t, 2.05, 2.6) * 34, r: es(t, 2.05, 2.6) * (g.i - 1) * 4 + Math.sin(T * 0.6 + g.i) * 0.6 }));

      /* the bridegroom */
      const dance = 1 - es(t, 0.95, 1.15);
      const lookUp = es(t, 1.15, 1.35);
      const gy = FLOOR - gone * 900;
      groom.set({ x: 800, y: gy, s: 1.08, armF: 60 * dance + Math.sin(t * 9) * 30 * dance + lookUp * 40, armB: 120 * dance + Math.sin(t * 9 + 2) * 20 * dance + lookUp * 60, head: -lookUp * 14, bob: -Math.abs(Math.sin(t * 9)) * 6 * dance, blink: blinkAt(T, 1) });
      const sd = es(t, 1.12, 1.35, ease.out);
      pose(strings, { x: 800, y: lerp(-1200, gy - 150, sd), o: sd > 0.01 ? 1 - es(t, 1.9, 2.0) : 0 });
      pose(glowG, { x: 800, y: gy - 120, s: 1 + Math.sin(T * 1.5) * 0.04, o: (0.7 - night * 0.3) * (1 - gone) });
      fade(ribbons, 1 - es(t, 2.05, 2.4) * 0.6);

      /* the guests */
      const reach = bump(t, 1.2, 2.1);
      const sitK = es(t, 2.05, 2.12);
      SPEC.forEach((g) => {
        const step = Math.sin(t * 8 + g.ph);
        const toC = (g.flip ? -1 : 1) * reach * 26;
        g.st.set({
          x: g.x + step * 10 * dance + toC, y: FLOOR - Math.abs(step) * 8 * dance, s: 0.96, flip: g.flip, o: 1 - sitK,
          armF: dance * (g.hold ? 150 + step * 10 : 60 + step * 40) + reach * 90, armB: dance * (100 + step * 40) + reach * 150,
          head: dance * step * 6 - reach * 18, lean: dance * step * 5, blink: blinkAt(T, g.seed),
        });
        g.sit.set({ x: g.x + (g.flip ? -1 : 1) * 10, y: FLOOR + 2, s: 0.96, flip: g.flip, o: sitK, armF: 30, armB: 20, head: 16, blink: 0.7 });
      });
      DISH.forEach((d) => {
        const e = es(t, 2.2 + d.i * 0.06, 2.45 + d.i * 0.06);
        pose(d.full, { x: d.x, y: FLOOR + 22, o: 1 - e });
        pose(d.empty, { x: d.x, y: FLOOR + 22 - e * 11, r: e * 180, o: e });
      });
      confetti.forEach((f) => {
        const k = (T * 0.25 + f.ph / 6) % 1;
        pose(f.el, { x: f.x + Math.sin(T + f.ph) * 20, y: f.y - 60 + k * 120, r: T * 50 + f.ph * 40, s: 0.9, o: dance * es(t, -0.3, 0.2) * Math.sin(k * PI) });
      });

      S.cam.y = kf(t, [[-0.5, 0], [0.5, 10], [1.2, -50], [1.9, -50], [2.3, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.6, 1.06], [1.2, 1.02], [2.3, 1.08]]);
    };
  },
};
