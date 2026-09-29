// Mt 9,15 — a painted night wedding flies down: under a garlanded canopy the bridegroom in his wreath raises his
// cup, lanterns glow and the friends of the bridegroom dance round him with a tambourine — who could mourn now?
// Then a cloud slides over the moon and two shadow figures lead the bridegroom away; the lanterns go out one by
// one, and the guests sit on the ground with their bowls turned over: then they will fast.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, town, moon, stars, cloud, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { canopy, garland, lantern, wreath, tambourine, cup, bowl, loaf, grapes, addToHead, shadowPerson, pose3, townsfolk, kf, moving, PI } from './lib.js';
import { emptyBowl } from '../mark8/lib.js';

const FLOOR = 700, CX = 800;
const GROOM = { robe: C.linen, mantle: C.ochre, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun };

export default {
  id: 'mt9-wedding',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 15, text: 'Jezus im rzekł: «Czy goście weselni mogą się smucić, dopóki pan młody jest z nimi?' },
    { v: 15, cont: true, text: 'Lecz przyjdzie czas, kiedy zabiorą im pana młodego,' },
    { v: 15, cont: true, text: 'a wtedy będą pościć.' },
  ],
  cam: { x: [-60, 40], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#3a3f78', '#7a6495', '#c9949a'], { name: 'feast', rise: 0 });
    const dark = sky(S, [C.night2, C.night, mix(C.indigo, C.night, 0.3)], { name: 'dark', rise: 0 }).layer;
    const hangL = S.layer({ par: 0.04, sh: 3 });
    hangL.add(stars(c, { x0: -600, x1: 2200, y0: -300, y1: 380, n: 90 }));
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 40)}`, { x: 1180, y: 150, len: 700 });
    const cloudEl = hanging(hangL, cloud(c, 230, mix(C.storm, C.duskViolet, 0.4), mix(C.storm2, C.duskViolet, 0.3)), { x: 1600, y: 170, len: 700 });

    /* the village at night, the courtyard floor */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 480, amps: [16, 7, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.night, 0.45) });
    const nightWall = mix(C.plaster, C.duskViolet, 0.45), nightShadow = mix(C.plaster2, C.night, 0.4);
    far.add(h1.markup + town(c, { x: 240, y: h1.fn(240) + 14, n: 8, spread: 420, sc: 0.6, wall: nightWall, shadow: nightShadow, lit: true }) + town(c, { x: 1400, y: h1.fn(1400) + 14, n: 7, spread: 380, sc: 0.58, wall: nightWall, shadow: nightShadow, lit: true }));
    far.add(cypress(c, 520, h1.fn(520) + 6, 110, mix(C.moss2, C.night, 0.4)) + cypress(c, 1090, h1.fn(1090) + 6, 120, mix(C.moss2, C.night, 0.4)));
    const court = S.layer({ par: 0.3, sh: 3 });
    const floor = sheet();
    floor.p(c.cut([[-900, 610], [2500, 610], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.duskViolet, 0.3));
    let tiles = '';
    for (let r = 0; r < 6; r++) tiles += c.ribbon([[-900, 622 + r * r * 8 + r * 14], [2500, 622 + r * r * 8 + r * 14]], 1.4);
    floor.x(tiles, mix(C.stone2, C.night, 0.35), 'opacity=".5"');
    court.add(floor.out());

    /* the canopy on four poles, garlands and lanterns */
    const setL = S.layer({ par: 0.5, sh: 4 });
    const cs = sheet();
    [CX - 200, CX + 200].forEach((x) => cs.p(c.cut(c.rect(x - 6, 330, 12, FLOOR - 330), 0.3, 8), C.wood2));
    setL.add(cs.out() + `<g transform="translate(${CX} 322)">${canopy(c, 440, 46)}</g>`);
    setL.add(`<g transform="translate(-200 250)">${garland(c, 800, 60)}</g><g transform="translate(1000 250)">${garland(c, 800, 60)}</g>`);
    const LAMPS = [[CX - 130, 380], [CX + 130, 380], [360, 290], [1240, 290], [560, 300], [1040, 300]];
    const lamps = LAMPS.map(([x, y], i) => {
      const el = setL.add(`<g><path d="M0 -600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lantern(c, { col: [C.apricot, C.roseRobe, C.halo][i % 3] })}</g>`);
      const off = setL.add(`<g>${lantern(c, { col: mix([C.apricot, C.roseRobe, C.halo][i % 3], C.night, 0.55) }).replace('class="glow"', 'opacity="0"')}</g>`);
      return { i, x, y, el, off };
    });
    // the low table of the feast
    const table = sheet();
    table.p(c.cut([[CX - 150, FLOOR - 34], [CX + 150, FLOOR - 34], [CX + 150, FLOOR - 24], [CX - 150, FLOOR - 24]], 0.4, 8), C.wood);
    table.p(c.cut(c.rect(CX - 140, FLOOR - 24, 10, 24), 0.3, 5) + c.cut(c.rect(CX + 130, FLOOR - 24, 10, 24), 0.3, 5), C.wood2);
    setL.add(table.out());
    const food = setL.add(`<g><g transform="translate(${CX - 100} ${FLOOR - 34})">${bowl(c, { food: 'fruit' })}</g><g transform="translate(${CX - 40} ${FLOOR - 34})">${loaf(c, 16)}</g><g transform="translate(${CX + 40} ${FLOOR - 34})">${grapes(c)}</g><g transform="translate(${CX + 100} ${FLOOR - 34})">${bowl(c, { food: 'stew' })}</g></g>`);

    /* the bridegroom and the two who take him */
    const act = S.layer({ par: 0.5, sh: 5 });
    const groom = S.puppet(act.add(addToHead(person(c, { ...GROOM, holdF: `<g transform="translate(1 10)">${cup(c, C.sun)}</g>` }), wreath(c))));
    const shades = [0, 1].map((i) => ({ i, p: S.puppet(act.add(shadowPerson(c, { hairStyle: 'wrap', beard: 'full', robe: '', mantle: i ? '' : null }, '#2a2238'))) }));

    /* the friends of the bridegroom: two dancing rings (as whole cut-outs) and the same people sitting */
    const guests = S.layer({ par: 0.56, sh: 5 });
    const G = Array.from({ length: 8 }, (_, i) => ({ i, o: townsfolk(c, { man: i % 3 !== 1 }) }));
    const dancer = (g, i) => pose3(c, [{ x: 0, y: 0, s: 0.92, flip: i % 2 === 1, armF: 120, armB: 140, head: -6, o: { ...g.o, holdF: i === 2 ? `<g transform="translate(0 6)">${tambourine(c)}</g>` : '' } }]);
    const mourner = (g, i) => pose3(c, [{ x: 0, y: 0, s: 0.92, flip: i < 4, armF: 16, armB: 8, head: 14, o: g.o }]);
    const sitter = (g, i) => pose3(c, [{ x: 0, y: 0, s: 0.92, flip: i % 2 === 1, armF: 20, armB: 10, head: 16, o: { ...g.o, pose: 'sit' } }]);
    const POS = [340, 440, 560, 660, 940, 1040, 1160, 1260];
    G.forEach((g) => {
      g.x = POS[g.i];
      g.dance = guests.add(`<g>${dancer(g, g.i)}</g>`);
      g.sad = guests.add(`<g>${mourner(g, g.i)}</g>`);
      g.sit = guests.add(`<g>${sitter(g, g.i)}<g transform="translate(${g.i % 2 ? -40 : 40} 0)">${`<g transform="rotate(180) translate(0 14)">${emptyBowl(c, 26)}</g>`}</g></g>`);
    });

    return (t, time) => {
      const T = time;
      /* v15a — the wedding: the bridegroom is with them */
      const take = es(t, 1.1, 1.9);
      const fast = es(t, 2.05, 2.4);
      dark.fade(es(t, 1.2, 2.2) * 0.9);
      swing(moonEl, 1180, 150, T, 1, 0.6);
      swing(cloudEl, lerp(1600, 1190, es(t, 1.05, 1.5)), 170, T, 1, 0.7, 1);
      lamps.forEach((l) => {
        const out = es(t, 1.5 + l.i * 0.12, 1.62 + l.i * 0.12);
        pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.9 + l.i) * 2, o: 1 - out });
        pose(l.off, { x: l.x, y: l.y, r: Math.sin(T * 0.9 + l.i) * 2, o: out });
      });

      G.forEach((g) => {
        const hop = T ? Math.abs(Math.sin(T * 3 + g.i)) * 10 : 0;
        const ring = T ? Math.sin(T * 0.8 + g.i) * 12 : 0;
        const stop = es(t, 1.0, 1.3);
        const still = es(t, 1.15, 1.25);
        pose(g.dance, { x: g.x + ring * (1 - stop), y: FLOOR + 10 + (g.i % 2) * 8 - hop * (1 - stop), o: 1 - still });
        pose(g.sad, { x: g.x, y: FLOOR + 10 + (g.i % 2) * 8, o: still * (1 - fast) });
        pose(g.sit, { x: g.x, y: FLOOR + 10 + (g.i % 2) * 8, o: fast });
      });
      pose(food, { o: 1 - es(t, 2.05, 2.3) });

      /* v15b — the bridegroom is taken away by two shadows */
      const GK = [[1.25, 0], [1.95, 1]];
      const gu = kf(t, GK, (u) => u);
      const gx = CX - gu * 60, gy = FLOOR - 6 - gu * 70, gs = 1.02 - gu * 0.42;
      groom.set({ x: gx, y: gy, s: gs, flip: t > 1.2, walk: moving(t, GK, 0.01) ? gu * 30 : undefined, armF: 70 * (1 - es(t, 1.0, 1.2)) + 20, armB: 30 * (1 - es(t, 1.0, 1.2)) + 10, head: -6 * (1 - es(t, 1.0, 1.2)) + es(t, 1.2, 1.4) * 8, o: 1 - es(t, 1.85, 1.95), blink: blinkAt(T) });
      shades.forEach((s) => {
        const come = es(t, 1.0, 1.25);
        const x = t < 1.25 ? lerp(CX - 520 + s.i * 1040, CX + (s.i ? 90 : -90), come) : gx + (s.i ? 90 : -90) * gs;
        s.p.set({ x, y: t < 1.25 ? FLOOR - 4 : gy + 2, s: t < 1.25 ? 1.02 : gs, flip: t < 1.25 ? s.i === 1 : t > 1.3 && false, o: come * (1 - es(t, 1.85, 1.95)), walk: (t > 1.0 && t < 1.95) ? t * 30 + s.i : undefined, armF: 60, armB: 20 });
      });

      S.cam.z = 1.02 + es(t, 0.1, 0.8) * 0.06 - es(t, 1.9, 2.4) * 0.04;
      S.cam.x = -es(t, 1.2, 1.9) * 50 + es(t, 1.95, 2.4) * 50;
      S.cam.y = 10 - es(t, 1.0, 1.5) * 20 + es(t, 2.0, 2.5) * 20;
    };
  },
};
