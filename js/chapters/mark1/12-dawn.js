// Mk 1,35–39 — before dawn Jesus slips out of the sleeping town and prays alone on a hill under the stars;
// Simon comes hurrying with a lamp and the others: "Everyone is looking for you!"; He points to the villages
// on the far hills as the sun comes up, and a map of Galilee shows the road He then walked, town by town.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, moon, stars, house, olive, bush, grass, rock } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { headAt, voiceRings, handLamp, bubble, galileeMap, hang2, shadowShards } from './lib.js';

const PI = Math.PI;
const P = 0.5;
const TOP = 612;            // the hilltop where He prays
const JX = 800;
const hillY = (x) => 730 - 118 * Math.exp(-(((x - JX) / 420) ** 2));

export default {
  id: 'm1-dawn',
  beats: [
    { v: 35, text: 'Nad ranem, gdy jeszcze było ciemno, wstał, wyszedł' },
    { v: 35, cont: true, text: 'i udał się na miejsce pustynne, i tam się modlił.' },
    { v: 36 },
    { v: 37 },
    { v: 38, text: 'Lecz On rzekł do nich: «Pójdźmy gdzie indziej, do sąsiednich miejscowości,' },
    { v: 38, cont: true, text: 'abym i tam mógł nauczać, bo na to wyszedłem».' },
    { v: 39 },
  ],
  cam: { x: [-40, 60], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the disciples, their words, the rising sun and the map come inside the screen
    const SUNX = PH ? 530 : 420;
    sky(S, [C.night2, C.night, '#40477e']);
    const pre = sky(S, ['#3a3f76', '#8a7fae', '#d7a9a4'], { name: 'pre' }).layer;
    const dawn = sky(S, ['#b9cfd6', '#f3d7b4', '#f9e2bf'], { name: 'dawn' }).layer;
    pre.fade(0); dawn.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 480, n: 170 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 30)}`, { x: 1180, y: 160, len: 900 });
    const sunGlow = hangL.add(`<circle r="300" fill="url(#warm-glow)" opacity="0"/>`);
    const sunRays = hangL.add(`<g opacity="0">${rays(c, { n: 18, r0: 60, r1: 900, spread: 0.045, color: '#fff3cf' })}</g>`);
    const sunEl = hanging(hangL, sun(c, 52), { x: SUNX, y: 620, len: 900 });

    /* ---------- far hills with villages that light up at "let us go elsewhere" ---------- */
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = band(c, { y: 470, amps: [22, 9, 3], lens: [900, 300, 110], color: '#6f6a92' });
    far.add(fb.markup);
    const villages = [[330, 0.5], [520, 0.45], [1030, 0.45], [1260, 0.5], [120, 0.4]].map(([x, sc], i) => {
      const r = makeCutter('m1-dawn-v' + i);
      let dark = '', lit = '';
      for (let k = 0; k < 4; k++) { const hx = x + (k - 2) * 26 * sc * 2, w = r.rr(26, 40) * sc * 2, h = r.rr(18, 28) * sc * 2, y = fb.fn(hx) + 8; dark += house(makeCutter('m1-dv' + i + k), hx, y, w, h, { stairs: false, wall: '#8b86a8', shadow: '#77729a', roofEdge: '#5f5a82' }); lit += house(makeCutter('m1-dv' + i + k), hx, y, w, h, { stairs: false, wall: '#8b86a8', shadow: '#77729a', roofEdge: '#5f5a82', lit: true }); }
      far.add(dark);
      return { el: far.add(`<g opacity="0">${lit}</g>`), x, i };
    });
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(band(c, { y: 560, amps: [16, 7, 3], lens: [800, 260, 100], color: '#57607f' }).markup);

    /* ---------- the hill, the sleeping town ---------- */
    const G = S.layer({ par: P, sh: 3 });
    const hillPts = [];
    for (let x = -900; x <= 2500; x += 12) {
      hillPts.push([x, hillY(x) + Math.sin(x / 90) * 2]);
    }
    hillPts.push([2500, 1700], [-900, 1700]);
    G.add(sheet().p(c.cut(hillPts, 0.8, 12), '#5f6c5a').x(c.ribbon([[1320, 740], [1100, 700], [960, 650], [860, 618]], (u) => 30 - u * 18, 1), '#7e7a68', 'opacity=".7"').out());
    G.add(rock(c, 760, TOP + 6, 70, 26, '#8d8a8c') + bush(c, 600, 690, 60, '#4d5a4b') + olive(c, 1000, 690, 0.8, { trunk: '#4a3a33', leaf: '#56654f', leaf2: '#6b7a62' }));
    const townR = makeCutter('m1-dawn-town');
    const spec = Array.from({ length: 6 }, (_, i) => ({ x: 1180 + i * 60 + townR.rr(-10, 10), w: townR.rr(46, 70), h: townR.rr(34, 50), dy: townR.rr(0, 20), i }));
    G.add(spec.map((h) => house(makeCutter('m1-dt' + h.i), h.x, 760 - h.dy, h.w, h.h, { stairs: false, wall: '#9b97b0', shadow: '#86819f', roofEdge: '#6f6a8e', lit: h.i % 2 === 0 })).join(''));
    const searchers = [0, 1, 2].map((i) => ({ el: G.add(`<g opacity="0">${bubble('?', { size: 20, w: 30 })}</g>`), x: 1210 + i * 90, y: 640 - (i % 2) * 20, i }));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1b2046"/>`);

    /* ---------- people ---------- */
    const L = S.layer({ par: P, sh: 5 });
    const glow = L.add(`<circle r="130" fill="url(#halo-glow)" opacity="0"/>`);
    const jWalk = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jPray = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'kneel', eyes: 'closed' })));
    const jStand = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const lampM = `<g transform="translate(0 4)">${handLamp(c)}</g>`;
    const party = [
      { cast: { ...CAST.peter, holdB: lampM }, x: PH ? 868 : 930, d: 0 },
      { cast: CAST.andrew, x: PH ? 913 : 1030, d: 0.08 },
      { cast: CAST.james, x: PH ? 958 : 1120, d: 0.14 },
      { cast: CAST.john, x: PH ? 1002 : 1200, d: 0.2 },
    ].map((q, i) => ({ ...q, p: S.puppet(L.add(person(c, q.cast))), i }));
    const said = L.add(`<g opacity="0">${bubble(tr('Wszyscy Cię szukają!', 'Everyone is looking for you!'), { size: 21, flip: true })}</g>`);
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 38, w: 5 });

    /* ---------- the journeys: the map with the road drawn town to town ---------- */
    const mapL = S.layer({ par: 0.3, sh: 8, pad: 1400 });
    const map = galileeMap(c);
    const MS = PH ? 0.74 : 0.95, MCX = 800, MCY = 430;
    mapL.add(`<g transform="translate(${MCX} ${MCY}) scale(${MS})">${hang2(map.markup, 300, 800)}</g>`);
    const T = Object.fromEntries(map.towns.map((tw) => [tw.k, tw]));
    const route = ['kaf', 'kor', 'kan', 'naz', 'nai', 'tyb', 'mag', 'kaf'].map((k) => T[k]);
    const pts = [];
    route.forEach((tw, i) => {
      if (!i) return;
      const a = route[i - 1], n = Math.max(4, Math.round(Math.hypot(tw.x - a.x, tw.y - a.y) / 16));
      for (let k = 0; k < n; k++) { const u = k / n; pts.push([lerp(a.x, tw.x, u) + Math.sin(u * PI) * 16 * (i % 2 ? 1 : -1), lerp(a.y, tw.y, u) - 6]); }
    });
    const dots = pts.map(([x, y]) => mapL.add(`<circle cx="${MCX + x * MS}" cy="${MCY + y * MS}" r="3.4" fill="${C.terracotta}" opacity="0"/>`));
    const token = mapL.add(`<g opacity="0"><circle r="16" fill="url(#halo-glow)"/><circle r="9" fill="${C.halo}" stroke="${C.haloRim}" stroke-width="2.5"/></g>`);
    const stops = route.slice(1, -1).map((tw, i) => ({ tw, el: mapL.add(`<g opacity="0"><path d="${c.poly([[-11, 0], [-11, -12], [0, -20], [11, -12], [11, 0]])}" fill="${C.cream}" stroke="${C.clay}" stroke-width="1.6"/><path d="${c.poly(c.star(0, -9, 4, 1.6, 6, 0))}" fill="${C.sun}"/></g>`), wisp: mapL.add(`<g opacity="0">${shadowShards(c, { n: 5, r: 10 }).map((sh) => sh.m).join('')}</g>`), i }));

    return (t, time) => {
      /* the sky: deep night → a little lighter while He prays → sunrise at "let us go" */
      const preK = es(t, 1.2, 2.6), dawnK = es(t, 4.1, 5.2);
      pre.fade(preK); dawn.fade(dawnK);
      starL.fade(1 - preK * 0.5 - dawnK * 0.5);
      tint.fade(0.35 * (1 - preK * 0.5) * (1 - dawnK));
      swing(moonEl, 1180 + seg(t, 0, 5) * 80, 160 + seg(t, 0, 5) * 200, time, 0.8, 0.5, 1);
      const sy = lerp(640, 420, es(t, 4.4, 5.6));
      swing(sunEl, SUNX, sy, time, 0.8, 0.5);
      fade(sunEl, seg(t, 4.1, 4.3));
      pose(sunGlow, { x: SUNX, y: sy, s: 0.5 + dawnK, o: dawnK * 0.9 });
      pose(sunRays, { x: SUNX, y: sy, s: 0.4 + dawnK * 0.8, r: t * 4, o: es(t, 4.8, 5.4) * 0.35 });
      villages.forEach((v) => fade(v.el, es(t, 4.2 + v.i * 0.12, 4.4 + v.i * 0.12)));

      /* v35: He goes out in the dark and prays on the hill */
      const w = es(t, 0.05, 0.95);
      const wx = lerp(1250, JX, w);
      const wy = hillY(wx) + 2;
      const kneel = es(t, 1.08, 1.14) * (1 - es(t, 4.02, 4.08));
      const stand = es(t, 4.02, 4.08);
      jWalk.set({ x: wx, y: wy, s: 1.0, flip: true, o: 1 - Math.max(kneel, stand), walk: w > 0 && w < 1 ? wx * 0.05 : undefined, armF: 10, head: 4, blink: blinkAt(time) });
      jPray.set({ x: JX, y: TOP, s: 1.0, flip: true, o: kneel, armF: 60 + Math.sin(time * 0.8) * 2, armB: 50, head: 10 - es(t, 3.05, 3.3) * 10, blink: 0 });
      const point = es(t, 4.15, 4.4) * (1 - es(t, 5.1, 5.4));
      const open = es(t, 5.1, 5.4);
      jStand.set({ x: JX, y: TOP, s: 1.0, flip: true, o: stand, armF: 20 + point * 80 + open * 40, armB: 10 + open * 120, head: -point * 6, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(JX, TOP, 1.0, true, kneel > 0.5 ? 46 : 0);
      const [ghx, ghy] = w < 1 ? headAt(wx, wy, 1.0, true) : [jhx, jhy];
      pose(glow, { x: ghx, y: ghy + 30, s: 0.8 + Math.sin(time * 1.2) * 0.05, o: 0.35 + kneel * es(t, 1.2, 1.6) * 0.5 });
      jVoice(jhx, jhy, point + open * 0.6, time, { dir: -1, spread: 2.4 });

      /* v36–37: Simon and the others come hurrying with a lamp and find Him */
      party.forEach((q) => {
        const k = es(t, 2.02 + q.d, (PH ? 2.62 : 2.85) + q.d);   // phone: the last one has arrived by the still moment
        const x = lerp(1500 + q.i * 90, q.x, k);
        const y = hillY(x) + 4 + q.i * 3;
        const talking = q.i === 0 ? es(t, 3.05, 3.25) * (1 - es(t, 3.9, 4.05)) : 0;
        const face = t < 4.1;
        q.p.set({ x, y, s: 0.98, flip: face, o: seg(t, 1.98, 2.05), walk: k > 0 && k < 1 ? x * 0.07 : undefined, amt: 1.3, lean: k > 0 && k < 1 ? 6 : 0,
          armF: 16 + talking * 40 + (q.i === 0 ? 0 : es(t, 4.3, 4.6) * 20), armB: q.i === 0 ? 60 - talking * 30 : 10, head: q.i ? -es(t, 4.2, 4.5) * 6 : -talking * 4, blink: blinkAt(time, q.i + 1) });
      });
      const sb = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      pose(said, { x: PH ? 910 : 1010, y: 420, s: sb, o: sb > 0 ? 1 : 0 });
      searchers.forEach((s) => { const k = es(t, 3.2 + s.i * 0.08, 3.35 + s.i * 0.08, ease.back) * (1 - es(t, 4.0, 4.2)); pose(s.el, { x: s.x, y: s.y + Math.sin(time * 2 + s.i) * 3, s: k, o: k > 0 ? 1 : 0 }); });

      /* v39: throughout Galilee — the road on the map */
      const mIn = es(t, 6.0, 6.3, ease.out);
      mapL.shift(0, -(1 - mIn) * 1300);
      mapL.fade(seg(t, 5.95, 6.0));
      const prog = seg(t, 6.25, 6.95);
      const shown = prog * dots.length;
      dots.forEach((d, i) => fade(d, i < shown ? 0.85 : 0));
      const idx = Math.min(pts.length - 1, Math.floor(shown));
      const pt = pts[idx] || pts[0];
      pose(token, { x: MCX + pt[0] * MS, y: MCY + pt[1] * MS, s: 1 + Math.sin(time * 4) * 0.08, o: mIn > 0.9 ? 1 : 0 });
      let acc = 0;
      stops.forEach((st, i) => {
        const a = route[i], b = route[i + 1];
        acc += Math.max(4, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 16));
        const reached = shown >= acc;
        const k = reached ? es(shown, acc, acc + 3) : 0;
        pose(st.el, { x: MCX + st.tw.x * MS, y: MCY + (st.tw.y - 16) * MS, s: k * 1.2, o: k > 0 ? 1 : 0 });
        const fly = reached ? seg(shown, acc + 1, acc + 8) : 0;
        pose(st.wisp, { x: MCX + st.tw.x * MS + fly * 30, y: MCY + (st.tw.y - 30) * MS - fly * 60, s: 1.2, r: fly * 90, o: fly > 0 ? 1 - fly : 0 });
      });

      S.cam.z = 1.04 + es(t, 1.0, 1.5) * 0.05 - es(t, 1.9, 2.3) * 0.05;
      S.cam.x = PH ? 0 : es(t, 1.9, 2.4) * 40 * (1 - es(t, 4.0, 4.5)) - es(t, 4.1, 4.6) * 30;
      S.cam.y = 30;
    };
  },
};
