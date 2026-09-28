// Mt 2,12 — the Magi sleep in their camp by a fork in the road. A light falls on them from above and a dream shows
// the road back to Herod's palace crossed out. At dawn they ride away by the other road, east, towards the sunrise
// and their own country.
import { C, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, stars, sun, grass, rock, palm } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  NIGHT, DAWN, dim, magus, camelRider, walkCamel, sleeper, tent, forkSign, dreamCloud, crossX, crown, jerusalem, hillTown,
  beamGrad, lightBeam, placeTag, hangAt, vpose, kf, sparkle, tr, PI,
} from './lib.js';

const Y = 700;
const FX = 760;                       // the fork
const SX = [560, 760, 960];            // sleepers

export default {
  id: 'mt2-otherway',
  beats: [
    { v: 12, text: 'A otrzymawszy we śnie nakaz, żeby nie wracali do Heroda,' },
    { v: 12, cont: true, text: 'inną drogą udali się do swojej ojczyzny.' },
  ],
  cam: { x: [-40, 80], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const dawn = sky(S, DAWN, { name: 'dawn' });
    const starL = S.layer({ par: 0.03, sh: 4 });
    starL.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -900, y1: 430, n: 170 })}</g>`);
    const sunL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = sunL.add(`<g>${sun(c, 46, { rays: C.apricot, disc: mix(C.sun, C.peach, 0.3), inner: C.dawn })}</g>`);

    /* the land: Jerusalem far to the left, the eastern hills to the right */
    const far = S.layer({ par: 0.07, sh: 2 });
    far.add(band(c, { y: 470, amps: [22, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup);
    far.add(`<g transform="translate(340 500)">${jerusalem(c, 0.34, { tglow: false })}</g>`);
    const G = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(560, [8, 3], [700, 200]);
    const g = sheet();
    g.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.hillMid, 0.4));
    g.p(c.ribbon(c.qbez([FX, 900], [FX - 60, 640], [380, gfn(380) + 6], 16), (u) => 70 - u * 60), mix(C.sand, C.cream, 0.3));
    g.p(c.ribbon(c.qbez([FX, 900], [FX + 200, 640], [1400, gfn(1400) + 4], 16), (u) => 70 - u * 60), mix(C.sand, C.cream, 0.3));
    G.add(g.out());
    G.add(palm(c, 1520, gfn(1520) + 30, 180) + palm(c, 90, gfn(90) + 40, 200) + rock(c, 1260, 640, 90, 30, C.rock2) + grass(c, { x0: -800, x1: 2400, y: 600, fn: (x) => gfn(x) + 30, n: 30, h: 12, color: C.olive }));

    /* the camp */
    const camp = S.layer({ par: 0.45, sh: 4 });
    camp.add(`<g transform="translate(360 ${Y - 40})">${tent(c, { w: 240, h: 150 })}</g>`);
    const resting = [0, 1, 2].map((i) => camp.add(camelRider(c, i, { rider: false })));
    const campNight = S.layer({ par: 0.45, sh: 0, flat: true });
    campNight.add(`<rect x="-3000" y="380" width="8000" height="2000" fill="${C.night}" opacity=".5"/>`);
    const signL = S.layer({ par: 0.45, sh: 5 });
    signL.add(`<g transform="translate(${FX + 20} ${Y - 30})">${forkSign(c, tr('Jerozolima', 'Jerusalem'), tr('Wschód', 'the East'))}</g>`);
    const xEl = signL.add(`<g>${crossX(c, 26)}</g>`);

    const P = S.layer({ par: 0.5, sh: 5 });
    const sleepers = SX.map((x, i) => ({ i, x, el: P.add(`<g>${sleeper(c, null, { markup: magus(c, i, { eyes: 'closed' }), w: 190, s: 0.72, blanket: [C.terracotta, mix(C.indigo, C.dustyBlue, 0.4), C.plumRobe][i] })}</g>`) }));
    const riders = [0, 1, 2].map((i) => ({ i, el: P.add(camelRider(c, i)) }));

    /* the warning in the dream */
    const X = S.layer({ par: 0.4, sh: 5 });
    const bid = beamGrad(S, 'beam');
    const beam = X.add(`<g>${lightBeam(bid, 30, 380, 560)}</g>`);
    const palace = `<g transform="translate(-10 40)">${sheet().p(c.cut([[-70, 0], [-70, -60], [-50, -60], [-50, -90], [-30, -90], [-30, -60], [30, -60], [30, -90], [50, -90], [50, -60], [70, -60], [70, 0]], 0.5, 6), mix(C.stone, C.plumRobe, 0.3)).p(c.cut([[-12, 0], [-12, -30], [12, -30], [12, 0]], 0.3, 4), C.soilDark).p(c.ribbon([[-130, 30], [-70, 4]], 14) + c.ribbon([[70, 4], [130, 30]], 14), mix(C.sand, C.cream, 0.2)).out()}<g transform="translate(0 -104) scale(1.3)">${crown(c)}</g></g>`;
    const dream = X.add(`<g>${dreamCloud(c, `${palace}<g data-k="dx" transform="scale(0)">${crossX(c, 62)}</g>`, { w: 330, h: 210, dx: 150, dy: -170 })}</g>`);
    const dX = S.$('dx');
    const tagH = hanging(X, placeTag(c, tr('nie wracajcie do Heroda', 'do not return to Herod'), 18), { x: 0, y: 0, len: 600 });
    const tagO = hanging(X, placeTag(c, tr('inną drogą — do swojej ojczyzny', 'another way — to their own country'), 18), { x: 0, y: 0, len: 600 });
    const glints = [0, 1, 2].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      const day = es(t, 1.0, 1.5);
      dawn.layer.fade(day);
      starL.fade(1 - day);
      campNight.fade(1 - day);
      pose(sunEl, { x: 1260, y: lerp(560, 330, es(t, 1.05, 1.8)), r: T * 2, o: day });

      /* v12a — asleep; the light and the dream: not back to Herod */
      const up = es(t, 1.02, 1.12);
      sleepers.forEach((sl) => pose(sl.el, { x: sl.x, y: Y + 4 + sl.i * 4, o: 1 - up }));
      vpose(beam, { x: 760, y: 150, sx: 0.4 + es(t, 0.05, 0.35) * 0.6, o: es(t, 0.05, 0.35) * 0.7 * (1 - es(t, 0.95, 1.1)) });
      const dk = es(t, 0.15, 0.4, ease.back) * (1 - es(t, 1.0, 1.1));
      vpose(dream, { x: 700, y: Y - 60, s: dk, o: dk > 0.01 ? 1 : 0 });
      pose(dX, { x: 0, y: 0, s: es(t, 0.45, 0.6, ease.back), r: -8 });
      const hk = es(t, 0.5, 0.75, ease.out) * (1 - es(t, 1.0, 1.15, ease.in));
      hangAt(tagH, 980, lerp(-500, 240, hk), T, hk > 0.001 ? 1 : 0, 1.2, 0.9, 2);
      glints.forEach((gl, i) => {
        const k = bump(t, 0.3 + i * 0.1, 0.95), a = T + i * 2.1;
        vpose(gl, { x: 850 + Math.cos(a) * 170, y: 470 + Math.sin(a) * 90, s: k * 0.8, r: T * 30, o: k });
      });

      /* v12b — at dawn they ride away by the other road, towards the East */
      const xk = es(t, 1.15, 1.3, ease.back);
      vpose(xEl, { x: FX + 20 - 70, y: Y - 30 - 131, s: xk * 0.8, o: xk > 0.01 ? 1 : 0 });
      resting.forEach((el, i) => pose(el, { x: 1080 + i * 120, y: Y - 26 + i * 4, s: 0.6, o: 1 - up }));
      riders.forEach((m) => {
        const k = es(t, 1.1 + m.i * 0.08, 1.95, ease.io);
        const x = lerp(900 - m.i * 130, 1200 - m.i * 60, k), y = lerp(Y + 6, gfn(1200 - m.i * 60) + 40, k), s = lerp(0.72, 0.36, k);
        pose(m.el, { x, y, s, o: up });
        walkCamel(m.el, k > 0 && k < 1 ? x * 0.06 + m.i : 0, k > 0 && k < 1 ? 1 : 0);
      });
      const ok = es(t, 1.3, 1.55, ease.out);
      hangAt(tagO, 960, lerp(-500, 250, ok), T, ok > 0.001 ? 1 : 0, 1.2, 0.9, 4);

      S.cam.x = lerp(-10, 60, es(t, 1.0, 1.7));
      S.cam.y = 30;
      S.cam.z = 1.02 + es(t, 0.1, 0.5) * 0.05 * (1 - es(t, 1.0, 1.4));
    };
  },
};
