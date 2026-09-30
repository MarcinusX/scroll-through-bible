// J 2,12–13 — the roads on a parchment map, walked by little cut-out figures: from Cana down to
// Capernaum by the lake — Jesus, His mother, His brothers and His disciples — where a small house
// sees a few days go by (sun, moon, sun…). Then the Passover lamb hangs over the map, and Jesus sets
// out along the long road south, up to Jerusalem, where the Temple glows.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { sun, moon } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { LOOK, DISC, landMap, MAP, ROAD1, ROAD2, along, roadDashes, mapHouse, lamb, wordTag, strip, tr, PI } from './lib.js';
import { templeMini } from '../mark14/lib.js';

const OX = 800, OY = 470;                 // map centre in the world
const P = 0.9;                            // parallax of the map and the walkers
const camTo = (my) => (OY + my - 470) / P + 60;

export default {
  id: 'j2-journey',
  beats: [
    { v: 12, text: 'Następnie On, Jego Matka, bracia i uczniowie Jego udali się do Kafarnaum,' },
    { v: 12, cont: true, text: 'gdzie pozostali kilka dni.' },
    { v: 13 },
  ],
  cam: { x: [-120, 80], y: [-440, 440], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    // a wooden table under the map
    const table = S.layer({ par: 0, sky: true });
    table.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.wood, C.wood2, 0.5)}"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".9"/>`);
    const planks = S.layer({ par: 0, sh: 1, flat: true });
    let pl = '';
    for (let y = -2000; y < 3000; y += 90) pl += `<path d="${c.ribbon([[-3000, y], [5000, y + c.rr(-4, 4)]], 2.4)}" fill="${shade(C.wood2, -0.2)}" opacity=".45"/>`;
    planks.add(pl);

    const mapL = S.layer({ par: P, sh: 6 });
    mapL.add(`<g transform="translate(${OX} ${OY})">${landMap(c)}</g>`);
    // the roads, in chunks that appear as they are walked
    const chunks = (pts, n) => {
      const d = roadDashes(c, pts, 20);
      return Array.from({ length: n }, (_, k) => ({ k, u: (k + 1) / n, el: mapL.add(`<g transform="translate(${OX} ${OY})">${d.filter((x) => x.u >= k / n && x.u < (k + 1) / n).map((x) => x.markup).join('')}</g>`) }));
    };
    const road1 = chunks(ROAD1, 5), road2 = chunks(ROAD2, 10);
    const house = mapL.add(`<g>${mapHouse(c)}</g>`);
    const temple = mapL.add(`<g><circle cx="0" cy="-40" r="90" fill="url(#halo-glow)"/>${templeMini(c, 0.7)}</g>`);

    /* the walkers */
    const walkL = S.layer({ par: P, sh: 4 });
    const GROUP = [
      { o: CAST.jesus, k: 'jesus' }, { o: LOOK.mary, k: 'mary', stay: true }, { o: DISC[0], k: 'd' }, { o: LOOK.bJames, k: 'b', stay: true },
      { o: DISC[1], k: 'd' }, { o: LOOK.bJoses, k: 'b', stay: true }, { o: DISC[2], k: 'd' }, { o: DISC[3], k: 'd' }, { o: LOOK.bSimon, k: 'b', stay: true },
    ].map((g, i) => ({ ...g, i, seed: c.rr(0, 9), p: S.puppet(walkL.add(person(c, g.o))) }));
    const nameT = walkL.add(`<g>${wordTag(c, tr('Matka, bracia, uczniowie', 'mother, brothers, disciples'), { size: 15, w: 230 })}</g>`);

    /* days at Capernaum: sun and moon on strings; the Passover tag */
    const skyL = S.layer({ par: P, sh: 5 });
    const sunEl = hanging(skyL, sun(c, 30), { x: 0, y: 0, len: 900 });
    const moonEl = hanging(skyL, `<circle r="70" fill="url(#halo-glow)" opacity=".6"/>${moon(c, 26)}`, { x: 0, y: 0, len: 900 });
    const daysTag = skyL.add(`<g>${strip(c, tr('kilka dni', 'a few days'), { size: 20 })}</g>`);
    const pascha = hanging(skyL, `${sheet().p(c.cut(c.circ(0, 0, 58, 30), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, 52, 30), 0.4, 5), C.cream).out()}<g transform="translate(-4 20) scale(.95)">${lamb(c)}</g><g transform="translate(0 84)">${strip(c, tr('Pascha', 'Passover'), { size: 22 })}</g>`, { x: 0, y: 0, len: 900 });
    const night = S.layer({ par: 0, sh: 1, flat: true });
    night.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2250"/>`);

    const at = (pt) => [OX + pt[0], OY + pt[1]];
    const plen = (pts) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
    const LEN1 = plen(ROAD1), LEN2 = plen(ROAD2), GAP = 20;
    const DIR1 = (() => { const dx = ROAD1[1][0] - ROAD1[0][0], dy = ROAD1[1][1] - ROAD1[0][1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; })();
    const RING = [[-86, 62], [-116, 52], [-56, 76], [-146, 40], [-86, 92], [-128, 80], [-40, 104], [-166, 66], [-110, 106]];
    const RANK = { 0: 0, 2: 1, 4: 2, 6: 3, 7: 4 };
    return (t, time) => {
      const T = time;
      /* v12a — Cana → Capernaum */
      const u1 = es(t, 0.15, 0.95);
      /* v13 — Capernaum → Jerusalem (Jesus and the disciples) */
      const u2 = es(t, 2.3, 2.95, ease.sine);
      road1.forEach((r) => fade(r.el, es(u1, r.u - 0.2, r.u)));
      road2.forEach((r) => fade(r.el, es(u2, r.u - 0.1, r.u)));
      const hk = es(t, 0.95, 1.2, ease.back);
      const [hx, hy] = at(MAP.caph);
      pose(house, { x: hx - 16, y: hy + 44, s: hk * 1.5, o: hk });
      const tk = es(t, 2.6, 2.95, ease.back);
      const [jx, jy] = at(MAP.jer);
      pose(temple, { x: jx, y: jy - 16, s: 0.3 + tk * 0.9, o: tk });

      let lead = [0, 0];
      const settle = es(t, 1.0, 1.3);
      const lead2 = es(t, 2.2, 2.35);
      GROUP.forEach((g) => {
        // v12a: a queue walking the road, GAP apart
        const d1 = u1 * (LEN1 + GROUP.length * GAP) - g.i * GAP;
        let x, y, walking = false, flip = false;
        if (d1 <= 0) { const [ux, uy] = DIR1; x = ROAD1[0][0] + ux * d1 * 0.8 - 10 + (g.i % 2) * 6; y = ROAD1[0][1] + uy * d1 * 0.8 + (g.i % 3) * 4; }
        else [x, y] = along(ROAD1, Math.min(1, d1 / LEN1));
        walking = u1 > 0 && d1 > 0 && d1 < LEN1 && u1 < 1;
        // settle round the house at Capernaum
        const ring = RING[g.i];
        const st = Math.max(settle, es(d1, LEN1, LEN1 + 70));
        x = lerp(x, MAP.caph[0] + ring[0], st); y = lerp(y, MAP.caph[1] + ring[1], st);
        if (st > 0.5) flip = ring[0] > -40;
        // v13: Jesus and the disciples set out for Jerusalem
        if (!g.stay && t > 2.2) {
          const r = RANK[g.i];
          const d2 = u2 * (LEN2 + 4 * GAP) - r * GAP;
          const [rx, ry, ang] = along(ROAD2, Math.max(0, Math.min(1, d2 / LEN2)));
          x = lerp(x, rx, lead2); y = lerp(y, ry, lead2);
          walking = u2 > 0 && u2 < 1 && d2 > 0 && d2 < LEN2;
          flip = Math.cos(ang) < -0.2;
        }
        if (g.stay && t > 2.2) flip = false;
        const [wx, wy] = at([x, y]);
        if (g.i === 0) lead = [x, y];
        g.p.set({ x: wx, y: wy, s: 0.36, flip, walk: walking ? (wx + wy) * 0.25 : undefined, armF: g.stay && t > 2.3 ? bump(t, 2.3, 3) * 120 : g.i === 0 && t > 2.1 && t < 2.3 ? 60 : 0, blink: blinkAt(T, g.seed) });
      });
      const [lx, ly] = at(lead);
      const nk = bump(t, 0.2, 1.0);
      pose(nameT, { x: lx - 40, y: ly - 120, s: 0.9, o: nk });

      /* v12b — a few days: sun, moon, sun, moon, sun over the house; night tints between */
      const dd = seg(t, 1.15, 1.95) * 2.5;
      const ph = dd % 1, isDay = Math.floor(dd) % 2 === 0;
      const on = es(t, 1.1, 1.2) * (1 - es(t, 1.95, 2.05));
      const arc = Math.sin(ph * PI);
      pose(sunEl, { x: hx - 110 + ph * 200, y: hy - 60 - arc * 90, o: on * (isDay ? Math.min(1, arc * 2) : 0) });
      pose(moonEl, { x: hx - 110 + ph * 200, y: hy - 60 - arc * 90, o: on * (isDay ? 0 : Math.min(1, arc * 2)) });
      night.fade(on * (isDay ? 0 : arc * 0.3));
      const dk = es(t, 1.2, 1.4) * (1 - es(t, 2.0, 2.15));
      pose(daysTag, { x: hx - 80, y: hy + 150, o: dk, s: 0.8 + dk * 0.2 });
      const pk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.85, 3.1));
      // the camera follows the walkers (phone: the Passover plate hangs in view all the way south)
      const fy = t < 2.2 ? lead[1] : lerp(MAP.caph[1], lead[1], es(t, 2.2, 2.5));
      const camX = lead[0] * 0.5 - 20;
      const px = S.portrait ? OX + camX * P + 150 : hx + 190, py = S.portrait ? OY + fy - 250 : hy + 60;
      pose(pascha, { x: px, y: py + (1 - pk) * (S.portrait ? -1500 : -600), r: Math.sin(T * 0.8) * 2, o: 1 });

      S.cam.y = camTo(t < 1 ? lerp(MAP.cana[1], MAP.caph[1], u1) : fy);
      S.cam.x = camX;
      S.cam.z = 1.32 - bump(t, 2.3, 3.0) * 0.18;
    };
  },
};
