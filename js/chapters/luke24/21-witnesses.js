// Łk 24,47–49 — "Repentance and forgiveness of sins will be proclaimed in His name to all the nations, beginning from
// Jerusalem": an old map of the lands round the Great Sea comes down, and from Jerusalem roads of light run out, and
// little lamps are lit in city after city, near and far. "You are witnesses of these things": the map rises, and a lamp
// burns in the hands of each of them. "I am sending the promise of my Father upon you": high above the room, a ring of
// light with a dove in it, waiting. "But stay in the city until you are clothed with power from on high": a painted flat
// of Jerusalem's walls and the house with the upper room, the ring of light hanging over it — not yet come down.
import { C, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade, attr } from './lib.js';
import {
  gatherRoom, MID, headAt, handAt, nationsMap, nationRoads, NATIONS, mapLamp, flame, dove, flapWings, flat, flatSky, flatHills, walledCity, house,
  sparkle, hangK, STRING, tr,
} from './lib.js';

const MX = 800, MY = 300, MS = 0.8;

export default {
  id: 'lk24-witnesses',
  beats: [
    { v: 47 },
    { v: 48 },
    { v: 49, text: 'Oto Ja ześlę na was obietnicę mojego Ojca.' },
    { v: 49, cont: true, text: 'Wy zaś pozostańcie w mieście, aż będziecie przyobleczeni mocą z wysoka».' },
  ],
  cam: { x: [-40, 60], y: [-20, 60], z: [0.9, 1.2] },
  build(S) {
    const c = S.c;
    const G = gatherRoom(S);
    /* the map */
    const ML = S.layer({ par: 0.4, sh: 7 });
    const map = ML.add(`<g><path d="M-250 -1600V-200M250 -1600V-200" stroke="${STRING}" stroke-width="1.4" fill="none"/>${nationsMap(c)}${nationRoads(c)}</g>`);
    const roads = Array.from(map.querySelectorAll('.road'));
    const [jx, jy] = NATIONS[0];
    const order = NATIONS.slice(1).map(([x, y], i) => ({ i, d: Math.hypot(x - jx, y - jy) })).sort((a, b) => a.d - b.d);
    const cityLamps = NATIONS.map(() => ML.add(`<g>${mapLamp(c)}</g>`));
    /* the witnesses' lamps */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const held = G.crew.map(() => fx.add(`<g><circle cy="-10" r="18" fill="url(#warm-glow)" opacity=".6"/>${flame(c, 18)}</g>`));
    /* the promise: a ring of light with the dove, high above */
    const hi = S.layer({ par: 0.3, sh: 4 });
    let ring = '';
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; ring += c.poly([[Math.cos(a - 0.05) * 60, Math.sin(a - 0.05) * 60], [Math.cos(a) * 86, Math.sin(a) * 86], [Math.cos(a + 0.05) * 60, Math.sin(a + 0.05) * 60]]); }
    const promise = hi.add(`<g><path d="M0 -1600V-90" stroke="${STRING}" stroke-width="1.2" fill="none"/><circle r="110" fill="url(#halo-glow)"/><path d="${ring}" fill="${C.halo}" opacity=".9"/><path d="${c.ribbon(c.arc(0, 0, 58, 58, 0, Math.PI * 2, 40), 4)}" fill="${C.haloRim}"/></g>`);
    const dv = hi.add(`<g>${dove(c)}</g>`);
    /* the city where they are to wait */
    const FW = 420, FH = 220;
    const inner = flatSky(S, FW, FH, ['#2a3060', '#6f6a96'])
      + flatHills(c, FW, 70, mix(C.hillMid, C.night, 0.55), 8)
      + `<g transform="translate(0 76)">${walledCity(c, 0, 0, 1.3, { wall: mix(C.stone, C.night, 0.35), wall2: mix(C.stone2, C.night, 0.35), temple: mix(C.cream, C.night, 0.3) })}</g>`
      + `<g transform="translate(-160 -30)">${house(c, 70, 108, 70, 56, { wall: mix(C.plaster, C.night, 0.3), shadow: mix(C.plaster2, C.night, 0.4), lit: true, stairs: false })}</g>`;
    const cityF = hi.add(flat(S, inner, { w: FW, h: FH }));
    const cityGlow = hi.add(`<g><circle r="60" fill="url(#warm-glow)"/></g>`);
    const waitSpk = [0, 1, 2].map(() => hi.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, T) => {
      G.RR.R.update(T, 1);
      G.RR.door.set(0); G.RR.door.bolt(1);
      pose(G.glow, { x: MID.x, y: MID.y, s: 1, o: 0.8 });
      const point = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.1));
      const toThem = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const up = es(t, 2.05, 2.3);
      G.jesus.set({ x: MID.x, y: MID.y, s: MID.s, armF: 24 + point * 40 + toThem * 60 + up * 20, armB: 12 + point * 140 + toThem * 40 + up * 140, head: -point * 10 + toThem * 4 - up * 12, blink: blinkAt(T) });

      /* v47: to all the nations, beginning from Jerusalem */
      const mk = es(t, 0.02, 0.3, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      const my = lerp(-1400, MY, mk);
      pose(map, { x: MX, y: my, s: MS, r: T ? Math.sin(T * 0.6) * 0.4 : 0, o: mk > 0.002 ? 1 : 0 });
      const L0 = es(t, 0.3, 0.45, ease.back);
      pose(cityLamps[0], { x: MX + jx * MS, y: my + (jy - 10) * MS, s: L0, o: mk > 0.002 && L0 > 0.01 ? 1 : 0 });
      order.forEach((o, n) => {
        const a = 0.35 + n * 0.035;
        attr(roads[o.i], 'stroke-dashoffset', (1 - es(t, a, a + 0.18)).toFixed(3));
        const lk = es(t, a + 0.15, a + 0.25, ease.back);
        const [x, y] = NATIONS[o.i + 1];
        pose(cityLamps[o.i + 1], { x: MX + x * MS, y: my + (y - 4) * MS, s: lk * 0.8, o: mk > 0.002 && lk > 0.01 ? 1 : 0 });
      });

      /* v48: you are witnesses — a lamp in their hands */
      G.crew.forEach((m, i) => {
        const hold = es(t, 1.1 + (i % 5) * 0.05, 1.3 + (i % 5) * 0.05);
        const look = es(t, 2.1, 2.4);
        const aF = 22 + hold * 46;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > MID.x, armF: aF, armB: 10 + look * 30, head: -look * 14 + hold * 4 * (1 - look), blink: blinkAt(T, m.seed) });
        fade(m.sad, 0);
        const [hx, hy] = handAt(m.x, m.y, m.s, m.x > MID.x, aF);
        pose(held[i], { x: hx, y: hy - 2, s: hold * m.s * (1 + (T ? Math.sin(T * 6 + i) * 0.06 : 0)), o: hold > 0.01 ? 1 : 0 });
      });

      /* v49a: the promise of the Father, waiting above */
      const pk = es(t, 2.05, 2.35, ease.back);
      const py = lerp(-900, 250 - es(t, 3.0, 3.2) * 40, pk);
      pose(promise, { x: MX, y: py, s: 1 - es(t, 3.0, 3.2) * 0.3, r: T ? Math.sin(T * 0.5) * 3 : 0, o: pk > 0.002 ? 1 : 0 });
      pose(dv, { x: MX + 6, y: py + 6 + (T ? Math.sin(T * 1.5) * 3 : 0), s: 0.8 - es(t, 3.0, 3.2) * 0.25, o: pk > 0.002 ? 1 : 0 });
      if (T) flapWings(dv, T, 20, 7);
      /* v49b: stay in the city */
      const ck = es(t, 3.05, 3.35, ease.out);
      hangK(cityF, ck, MX, 404, 0, 0);
      const cy = lerp(-1500, 404, ck);
      pose(cityGlow, { x: MX - 55, y: cy + 50, s: 1, o: ck > 0.99 ? es(t, 3.3, 3.5) : 0 });
      waitSpk.forEach((el, i) => {
        const b = bump(t, 3.4 + i * 0.12, 3.95);
        pose(el, { x: MX - 130 + i * 130, y: 280 + (i % 2) * 16, s: b, r: T * 30, o: b });
      });

      S.cam.x = 0;
      S.cam.y = 30 - mk * 20 - es(t, 2.0, 2.3) * 16;
      S.cam.z = S.portrait ? 0.92 : 1.02;
      void seg; void headAt; void tr;
    };
  },
};
