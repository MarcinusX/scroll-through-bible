// Mk 16,19–20 — The end of the Gospel. On the hilltop Jesus blesses the Eleven and is lifted on the
// theatre's strings into the light; the clouds part; He sits on a throne at the right hand of the great
// radiance of God. Then the Eleven go out two by two on every road, down to the towns; beams of light from
// the Lord go with them and the towns light up, one by one. The curtains close gently: the end.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix, curtains } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, flowers, cloud, town, house } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { ELEVEN, glory, throne, along, headAt, sparkle, skyKeys, walledCity, kf, PI } from './lib.js';

const DAYP = [C.skyBlue, mix(C.skyBlue, C.cream, 0.5), C.cream];
const GLOWP = [mix(C.halo, C.skyBlue, 0.35), mix(C.cream, C.halo, 0.4), C.cream];
const EVEP = [mix(C.skyBlue, C.duskViolet, 0.3), mix(C.halo, C.dusk, 0.35), C.dawn];
const TOP = [800, 700];           // the hilltop where He stands
const FATHER = [880, 190];        // the radiance of God
const SEAT = [705, 320];          // the throne at His right hand

export default {
  id: 'm16-ascension',
  beats: [
    { v: 19, text: 'Po rozmowie z nimi Pan Jezus został wzięty do nieba' },
    { v: 19, cont: true, text: 'i zasiadł po prawicy Boga.' },
    { v: 20, text: 'Oni zaś poszli i głosili Ewangelię wszędzie,' },
    { v: 20, cont: true, text: 'a Pan współdziałał z nimi i potwierdził naukę znakami, które jej towarzyszyły.' },
  ],
  cam: { x: [-20, 20], y: [-200, 40], z: [0.94, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAYP);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 420, speed: 50, scale: 0.45 });
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 530, amps: [16, 7, 3], lens: [1000, 330, 120], color: C.hillFar });
    far.add(h1.markup + `<g>${walledCity(c, 140, h1.fn(140) + 6, 0.9)}</g>`);

    /* the land: hills with towns, the mount in the middle, roads going out */
    const land = S.layer({ par: 0.45, sh: 3 });
    const h2fn = c.wave(585, [14, 6], [700, 220]);
    const mount = (x) => h2fn(x) + 60 - Math.max(0, Math.cos(Math.min(1, Math.abs(x - 800) / 420) * PI / 2)) * 140;
    const ls = sheet();
    ls.p(c.ridge(h2fn, -1400, 2800, 1700, 12, 1), C.hillMid);
    ls.p(c.ridge((x) => Math.min(h2fn(x) + 70, mount(x)), -1400, 2800, 1700, 10, 1), C.hillNear);
    land.add(ls.out());
    const TOWNS = [[250, 590], [470, 614], [1130, 612], [1370, 588], [30, 790], [1580, 800]];
    const ROADS = TOWNS.map(([x, y], i) => {
      const sx = TOP[0] + (x < 800 ? -60 : 60), sy = TOP[1] + 30;
      return c.qbez([sx, sy], [lerp(sx, x, 0.5) + (i % 2 ? 60 : -60), lerp(sy, y, 0.5) + 60], [x, y + 14], 24);
    });
    land.add(sheet().p(ROADS.map((r, i) => c.ribbon(r, (u) => (i >= 4 ? 34 : 22) - u * (i >= 4 ? 4 : 14))).join(''), C.sand).out());
    land.add(grass(c, { x0: -1200, x1: 2600, y: 600, fn: (x) => Math.min(h2fn(x) + 70, mount(x)), n: 70, h: 14, color: C.moss }) + olive(c, 610, 640, 0.8) + olive(c, 1010, 650, 0.9) + cypress(c, 690, 600, 90) + flowers(c, { x0: 500, x1: 1100, y: 700, fn: () => c.rr(700, 800), n: 26, h: 16 }));
    const towns = TOWNS.map(([x, y], i) => {
      const sc = i >= 4 ? 0.8 : 0.5;
      land.add(town(c, { x, y: y + 8, n: 5, spread: 150 * sc / 0.5, sc }));
      const lit = land.add(`<g opacity="0"><circle cx="${x}" cy="${y - 20}" r="${110 * sc / 0.5}" fill="url(#warm-glow)" opacity=".7"/>${town(c, { x, y: y + 8, n: 5, spread: 150 * sc / 0.5, sc, lit: true })}</g>`);
      const sp = land.add(`<g>${sparkle(c, 14)}</g>`);
      return { x, y, i, lit, sp };
    });

    /* heaven: the radiance of God, the throne at His right hand, the clouds */
    const heaven = S.layer({ par: 0.45, sh: 4 });
    const fGlow = heaven.add(`<g opacity="0"><circle r="260" fill="url(#halo-glow)"/>${glory(c, 330, 30)}</g>`);
    const fThrone = heaven.add(`<g opacity="0">${throne(c).replace(/fill="#[0-9a-f]{6}"/g, (m) => 'fill="' + mix(m.slice(6, 13), '#fffaf0', 0.55) + '"')}</g>`);
    const fLight = heaven.add(`<g opacity="0">${sheet().p(c.cut(c.circ(0, 0, 70, 40), 0.4, 5), C.halo).p(c.cut(c.circ(0, 0, 48, 34), 0.3, 4), C.star).out()}</g>`);
    const thr = heaven.add(`<g opacity="0">${throne(c)}</g>`);
    const clouds = S.layer({ par: 0.45, sh: 5 });
    const cL = hanging(clouds, cloud(c, 380), { x: 0, y: 0, len: 900 });
    const cR = hanging(clouds, cloud(c, 360), { x: 0, y: 0, len: 900 });
    const cM = hanging(clouds, cloud(c, 260), { x: 0, y: 0, len: 900 });

    /* the Eleven and the Lord */
    const PL = S.layer({ par: 0.45, sh: 5 });
    const START = [[540, 732], [610, 718], [670, 706], [930, 706], [990, 718], [1060, 732], [480, 760], [580, 770], [1020, 770], [1120, 760], [720, 790]];
    const PAIR = [0, 0, 1, 2, 2, 3, 1, 4, 5, 3, 4]; // two by two (Peter walks with Andrew…)
    const M = ELEVEN.map((m, i) => ({ ...m, i, sx: START[i][0], sy: START[i][1], road: PAIR[i], seed: c.rr(0, 9), lag: (i % 2) * 0.05 + c.rr(0, 0.04) })).sort((a, b) => a.sy - b.sy);
    M.forEach((m) => { m.p = S.puppet(PL.add(person(c, { ...m.o }))); });
    const strings = PL.add(`<g><path d="M-9 -1800V-150M11 -1800V-150" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/></g>`);
    const jStand = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(PL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const beamL = S.layer({ par: 0.45, sh: 1, flat: true });
    const beams = M.map((m) => ({ m, el: beamL.add(`<path d="${c.poly([[-4, 0], [4, 0], [16, 1], [-16, 1]])}" fill="#fff1c4" opacity="0"/>`) }));

    const cur = curtains(S);

    return (t, time) => {
      skyKeys(sk, t, [[0.3, DAYP], [1.2, GLOWP], [2.4, GLOWP], [3.8, EVEP]]);
      birds(time, 1 - es(t, 0.3, 0.8));

      /* v19a: a blessing, then He is taken up on the strings; the clouds part */
      const bless = es(t, 0.05, 0.3);
      const up = es(t, 0.3, 1.0, ease.sine);
      const toSeat = es(t, 1.02, 1.3);
      const sit = es(t, 1.3, 1.37);
      const jx = lerp(lerp(TOP[0], 770, up), SEAT[0], toSeat);
      const jy = lerp(lerp(TOP[1], 400, up), SEAT[1], toSeat);
      const js = lerp(lerp(1.12, 0.78, up), 0.66, toSeat);
      jStand.set({ x: jx, y: jy, s: js, o: 1 - sit, armF: 30 + bless * 70, armB: 20 + bless * 130, head: -bless * 6, blink: blinkAt(time) });
      pose(strings, { x: jx, y: jy, s: js, o: (1 - sit) * seg(t, 0.25, 0.35) });
      const work = es(t, 2.95, 3.3);
      jSit.set({ x: SEAT[0], y: SEAT[1] + 4, s: 0.66, o: sit, armF: 40 + work * 60 + Math.sin(time * 1.2) * 3, armB: 20 + work * 50, head: work * 8, blink: blinkAt(time) });
      const part = es(t, 0.5, 1.0);
      const cy = 410 - es(t, 1.0, 1.6) * 40;
      swing(cL, lerp(690, 420, part), cy, time, 0.8, 0.5, 1);
      swing(cR, lerp(920, 1180, part), cy + 16, time, 0.8, 0.6, 2);
      swing(cM, lerp(800, 800, part), lerp(420, 560, part), time, 0.6, 0.5, 3);
      fade(cM, 1 - part);

      /* v19b: seated at the right hand of God */
      const heav = es(t, 0.6, 1.3);
      pose(fGlow, { x: FATHER[0], y: FATHER[1], s: 0.6 + heav * 0.5 - es(t, 1.9, 2.4) * 0.3, r: t * 4, o: heav * (0.9 - es(t, 1.9, 2.4) * 0.35) });
      pose(fThrone, { x: FATHER[0], y: FATHER[1] + 150, s: 1.05, o: heav * 0.9 });
      pose(fLight, { x: FATHER[0], y: FATHER[1] + 10, s: 0.8 + Math.sin(time * 1.3) * 0.03, o: heav });
      pose(thr, { x: SEAT[0], y: SEAT[1] + 10, s: 0.62, o: es(t, 1.1, 1.3) });

      /* v20a: they go out on every road, two by two */
      M.forEach((m) => {
        const r = ROADS[m.road];
        const look = es(t, 0.35, 0.7) * (1 - es(t, 1.9, 2.05));
        const u = es(t, 2.05 + m.lag, 3.0 + m.lag, ease.sine) * 0.55 + es(t, 3.0, 4.2) * 0.25;
        const lead = es(t, 2.0 + m.lag, 2.25 + m.lag);
        const [rx, ry] = along(r, Math.max(0, u - m.lag * 1.2));
        const x = lerp(m.sx, rx + (m.lag > 0.04 ? 12 : -12), lead), y = lerp(m.sy, ry, lead);
        const far = m.road < 4 ? Math.min(1, (TOP[1] + 60 - y) / 140) : 0;
        const s = lerp(0.95, 0.5, Math.max(0, far));
        const going = t > 2.0 && t < 4.2;
        const dir = r[r.length - 1][0] < 800;
        m.p.set({ x, y, s, flip: going ? dir : m.sx > TOP[0], walk: going ? x * 0.06 + m.i : undefined, armF: 20 + look * 60 + bump(t, 3.2 + m.i * 0.05, 3.9) * 50, armB: 10 + look * (m.i % 3 === 0 ? 130 : 40), head: -look * 22, blink: blinkAt(time, m.seed) });
        m.x = x; m.y = y; m.s = s;
      });
      /* v20b: the Lord works with them — beams of light, and the towns light up */
      beams.forEach((b, i) => {
        const on = es(t, 3.05 + i * 0.03, 3.3 + i * 0.03) * (1 - es(t, 3.9, 4.3) * 0.5);
        const [hx, hy] = headAt(b.m.x, b.m.y, b.m.s, false);
        const ox = SEAT[0] + 20, oy = SEAT[1] - 60;
        const dx = hx - ox, dy = hy - 30 - oy, len = Math.hypot(dx, dy);
        pose(b.el, { x: ox, y: oy, r: (Math.atan2(dy, dx) * 180) / PI - 90, sy: len, o: on * 0.55 });
      });
      towns.forEach((tw) => {
        const k = es(t, 3.2 + tw.i * 0.1, 3.45 + tw.i * 0.1);
        fade(tw.lit, k);
        const b = bump(t, 3.2 + tw.i * 0.1, 3.75 + tw.i * 0.1);
        pose(tw.sp, { x: tw.x, y: tw.y - 60, s: b * 1.3, r: time * 30, o: b });
      });

      /* the end: the curtains close */
      cur.set(1 - es(t, 3.72, 4.45), time);

      S.cam.y = 20 - es(t, 0.4, 1.3) * 150 * (1 - es(t, 1.9, 2.4)) + es(t, 1.9, 2.4) * 10;
      S.cam.z = 1.02 + es(t, 0.8, 1.4) * 0.04 * (1 - es(t, 1.9, 2.4)) - es(t, 1.9, 2.5) * 0.06;
      S.cam.x = 0;
    };
  },
};
