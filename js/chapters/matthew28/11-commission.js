// Mt 28,18–20 — The end of the Gospel. Jesus comes down from the knoll to them, and all of them are on their feet.
// "All authority in heaven and on earth has been given to me": the sky above turns to deep heaven, and the sun, the moon
// and the stars come down on their strings round Him; a crown of light over His head; the lake and the land shine.
// "Go and make disciples of all nations": the hills behind are drawn away like painted flats, and the whole curve of
// the earth rises behind the mountain with every people standing round it; roads of light run out to them, and the
// Eleven turn and point the way. "Baptising them in the name of the Father" — light pours down from above (never a
// figure) — "and of the Son" — He shines — "and of the Holy Spirit" — a dove comes down; two painted plates show a
// disciple pouring water over a kneeling stranger. "Teaching them to observe all I have commanded you": little hearts,
// loaves and lamps go out along the roads, and an open scroll lights up among each people. "And behold, I am with you
// always, to the end of the age": the Eleven set out along the roads to every side, golden threads still joining each
// of them to Him; He stands with open arms, and the sun and the moon go round and round the sky — all the days.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, mix, shade } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  ELEVEN, galileeMount, KX, RING, DOUBT, NATIONS, nationGroup, earthCurve, lightRoad, glory, lightCrown, radiance, dove, archPlate, threads,
  headAt, handAt, voiceRings, sparkle, heart, loaf, oilLamp, scrollOpen, flake, rays, PI,
} from './lib.js';
import { sun, moon } from '../../assets/nature.js';

const JY1 = 756;                      // where He comes to stand, in front of them
const ER = 1000, EC = [800, 410 + ER];  // the curve of the earth: centre and radius
const TH = [-40, -31, -22, -14, -7, 7, 14, 22, 31, 40];
const NAT = TH.map((d, i) => { const a = (d * PI) / 180; return { i, d, x: EC[0] + ER * Math.sin(a), y: EC[1] - ER * Math.cos(a) }; });

export default {
  id: 'mt28-commission',
  beats: [
    { v: 18, text: 'Wtedy Jezus podszedł do nich i przemówił tymi słowami:' },
    { v: 18, cont: true, text: '«Dana Mi jest wszelka władza w niebie i na ziemi.' },
    { v: 19, text: 'Idźcie więc i nauczajcie wszystkie narody,' },
    { v: 19, cont: true, text: 'udzielając im chrztu w imię Ojca i Syna, i Ducha Świętego.' },
    { v: 20, text: 'Uczcie je zachowywać wszystko, co wam przykazałem.' },
    { v: 20, cont: true, text: 'A oto Ja jestem z wami przez wszystkie dni, aż do skończenia świata».' },
  ],
  cam: { x: [-30, 30], y: [-80, 60], z: [0.84, 1.08] },
  build(S) {
    const c = S.c;
    const H = galileeMount(S);
    const { G, gfn } = H;
    const JY0 = gfn(KX) + 4;

    /* heaven: stars, the sun and the moon on their strings */
    const skyL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    skyL.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 330, n: 90 }));
    skyL.fade(0);
    const heavL = S.layer({ par: 0.05, sh: 4 });
    const sunH = heavL.add(`<g><circle r="90" fill="url(#warm-glow)"/>${sun(c, 44)}</g>`);
    const moonH = heavL.add(`<g><circle r="70" fill="url(#halo-glow)"/>${moon(c, 30)}</g>`);
    const lakeGlints = [[420, 430], [640, 440], [1000, 436], [1220, 428], [300, 500], [1330, 510]].map(([x, y]) => ({ x, y, el: H.lake.add(`<g>${sparkle(c, 12)}</g>`) }));
    const STARS = [[500, 230], [600, 110], [740, 70], [880, 80], [1010, 120], [1140, 180], [540, 270], [1080, 260]].map(([x, y], i) => ({ x, y, i, el: hanging(heavL, `<circle r="30" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, 13, 5, 5, -PI / 2), 0.3, 3), C.star).out()}`, { x: 0, y: -1500, len: 1200 }) }));
    /* the light of the Father: rays from above, never a figure */
    const fatherL = S.layer({ par: 0.05, sh: 0, flat: true, rise: 0 });
    const father = fatherL.add(`<g opacity="0"><g opacity=".7">${rays(c, { n: 16, r0: 30, r1: 1100, spread: 0.035, color: '#fff3cf' })}</g><circle r="260" fill="url(#halo-glow)"/></g>`);

    /* the whole earth, with every nation round it (behind the hills until they are drawn away) */
    const E = H.earthL;
    E.add(`<g transform="translate(${EC[0]} ${EC[1]})"><circle r="${ER + 140}" fill="url(#halo-glow)" opacity=".7"/>${earthCurve(c, ER)}</g>`);
    const roads = NAT.map((n) => {
      const x0 = KX + (n.x < KX ? -40 : 40), y0 = 560;
      const pts = c.qbez([x0, y0], [lerp(x0, n.x, 0.5), Math.min(y0, n.y) - 80 - Math.abs(n.d) * 2], [n.x, n.y - 6], 20);
      return { ...n, pts, el: E.add(lightRoad(pts, { w: 5, col: C.halo, o: 0.85 })) };
    });
    const nations = NAT.map((n) => ({ ...n, sp: E.sprite(`<g transform="rotate(${n.d}) scale(.36)">${nationGroup(c, n.i, { n: 3, flip: n.x > KX })}</g>`, n.x, n.y) }));
    const scrolls = NAT.map((n) => ({ ...n, el: E.add(`<g><circle r="34" fill="url(#halo-glow)"/><g transform="scale(.36)">${scrollOpen(c, 90, 58)}</g></g>`) }));
    E.fade(0);

    /* Jesus */
    const JL = S.layer({ par: 0.5, sh: 5 });
    const gl = JL.add(`<g>${glory(c, 330, 24)}</g>`);
    const son = JL.add(`<g><circle r="200" fill="url(#halo-glow)"/></g>`);   // behind Him: He stays fully coloured in the light
    const crown = JL.add(`<g>${lightCrown(c, 36)}</g>`);
    const jesus = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(JL, c, { n: 3, color: C.halo, r: 36, w: 5 });
    const doveEl = JL.add(`<g><circle r="60" fill="url(#halo-glow)"/>${dove(c)}</g>`);

    /* the Eleven */
    const PL = S.layer({ par: 0.52, sh: 5 });
    const setThread = threads(PL, 11, { color: C.haloRim, w: 2.4 });
    const M = ELEVEN.map((m, i) => {
      const [x, dy] = RING[i];
      // the road on his own side, out towards the people nearest him
      const aim = KX + (x - KX) * 1.3;
      const road = roads.reduce((b, r) => (Math.abs(r.x - aim) < Math.abs(b.x - aim) && (r.x < KX) === (x < KX) ? r : b), roads[x < KX ? 0 : roads.length - 1]);
      return { ...m, i, x, y: gfn(x) + dy, s: 0.9 + dy * 0.0014, flip: x > KX, seed: c.rr(0, 9), road, kneel: !DOUBT.includes(i) };
    }).sort((a, b) => a.y - b.y);
    M.forEach((m) => { m.st = S.puppet(PL.add(person(c, m.o))); m.kn = S.puppet(PL.add(person(c, { ...m.o, pose: 'kneel' }))); });

    /* the two baptism plates */
    const plL = S.layer({ par: 0.4, sh: 6 });
    const plate = (k, who, kneeler) => {
      const water = `<path d="${c.cut([[-105, 196], [105, 192], [105, 250], [-105, 250]], 0.5, 6)}" fill="${C.lake2}"/>`;
      // the disciple's front arm raised (baked into the cut-out), a shell in his hand, water pouring on the kneeling one's head
      const baptiser = person(c, { ...who }).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-118)">');
      const inner = `${water}<circle cx="24" cy="160" r="50" fill="url(#halo-glow)" opacity=".8"/><g transform="translate(-40 214) scale(.5)">${baptiser}</g><g transform="translate(30 224) scale(-.5 .5)">${person(c, { ...kneeler, pose: 'kneel' })}</g>`
        + `<path d="${c.ribbon([[-10, 132], [0, 136], [10, 144], [20, 156]], (u) => 5 - u * 2.4)}" fill="${C.lake}" opacity=".9"/>${[0, 1, 2].map((j) => `<path d="${c.cut(c.ell(22 + j * 7, 168 + j * 9, 2.4, 4, 8), 0.2, 2)}" fill="${C.lake}"/>`).join('')}`
        + `<path d="${c.cut([[-22, 128], ...c.arc(-12, 128, 11, 8, 0, PI, 8), [-2, 128]], 0.3, 3)}" fill="#f1e4d0"/>`;
      return hanging(plL, archPlate(S, inner, { w: 210, h: 250, fill: mix(C.skyBlue, C.cream, 0.4), k }), { x: 0, y: -1500, len: 0 });
    };
    const plA = plate('bapA', CAST.peter, NATIONS[0]);
    const plB = plate('bapB', CAST.john, NATIONS[3]);

    /* what He commanded, going out along the roads */
    const fx = S.layer({ par: 0.12, sh: 3 });
    const gifts = Array.from({ length: 10 }, (_, i) => {
      const m = i % 3 === 0 ? heart(c, 12, C.jesusMantle) : i % 3 === 1 ? `<g transform="scale(.6)">${loaf(c, 18)}</g>` : `<g transform="translate(-4 8) scale(.42)">${oilLamp(c)}</g>`;
      return { i, el: fx.add(`<g>${m}</g>`), road: roads[i] };
    });
    const twinkle = [0, 1, 2, 3, 4, 5].map(() => heavL.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      H.update(time, { o: 1 - es(t, 1.05, 1.4) });
      /* the backdrop: heaven over the sky; the hills drawn away; the earth rises; a golden glory at the end */
      const heav = es(t, 1.05, 1.4) * (1 - es(t, 4.9, 5.4) * 0.7);
      const clear = es(t, 2.05, 2.5);
      H.heaven.fade(heav * (1 - clear));
      skyL.fade(heav * (1 - clear));
      H.glorySky.fade(clear);
      const away = es(t, 2.05, 2.5, ease.in);
      H.back.forEach((Ly, k) => { Ly.shift(0, away * (380 + k * 60)); Ly.fade(1 - away); });
      const rise = es(t, 2.1, 2.55, ease.out);
      E.shift(0, (1 - rise) * 420);
      E.fade(rise);

      /* v18a: He comes to them; they get up */
      const come = es(t, 0.05, 0.6, ease.io);
      const jy = lerp(JY0, JY1, come);
      const bless = es(t, 5.05, 5.35);
      const send = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const arms = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.2));
      jesus.set({
        x: KX, y: jy, s: lerp(1.12, 1.16, come), walk: come > 0 && come < 1 ? jy * 0.12 : undefined, amt: 0.7,
        armF: 20 + arms * 60 + send * 70 + es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1)) * 30 + es(t, 4.05, 4.3) * (1 - bless) * 40 + bless * 44,
        armB: 12 + arms * 130 + send * 30 + bless * 116,
        head: -arms * 8 - es(t, 3.05, 3.3) * (1 - es(t, 3.5, 3.7)) * 14, blink: blinkAt(time),
      });
      const [jhx, jhy] = headAt(KX, jy, 1.16, false);
      voice(jhx, jhy, es(t, 0.5, 0.8) * (1 - es(t, 5.0, 5.3)) * 0.8, time, { spread: 2.2 });
      pose(gl, { x: KX, y: jy - 120, s: 0.6 + arms * 0.3 + bump(t, 3.3, 3.8) * 0.3 + bless * 0.4, r: t * 5, o: 0.5 + arms * 0.3 + bless * 0.2 });
      const ck = es(t, 1.2, 1.45, ease.back);
      pose(crown, { x: jhx, y: jhy - 56, s: ck * 0.9, o: ck > 0.01 ? 1 - es(t, 2.0, 2.3) * 0.6 : 0 });

      /* v18b: all authority in heaven — sun, moon and stars come down — and on earth */
      const hk = es(t, 1.1, 1.5, ease.back);
      // v20b: the sun and the moon go round and round the sky (all the days)
      // day after day: the sun crosses the sky from horizon to horizon, then the moon, then the sun again…
      const cyc = 0.35 + seg(t, 5.1, 5.95) * 2.6;
      const k = Math.floor(cyc), f = cyc - k;
      const a = PI + f * PI, rx = 610, ry = 420, oc = [800, 560];
      const arc = [oc[0] + Math.cos(a) * rx, oc[1] + Math.sin(a) * ry];
      const edge = Math.min(1, f * 7, (1 - f) * 7);
      const SUN0 = [1180, 150], MOON0 = [480, 260];
      const blend = es(t, 5.02, 5.25);
      const up = Math.min(hk, 1);
      const sunOn = k % 2 === 0 ? edge : 0, moonOn = k % 2 === 1 ? edge : 0;
      pose(sunH, { x: lerp(SUN0[0], arc[0], blend), y: lerp(-300, lerp(SUN0[1], arc[1], blend), up), r: time ? Math.sin(time * 0.6) * 2 : 0, o: lerp(1, sunOn, blend) });
      pose(moonH, { x: lerp(MOON0[0], arc[0], blend), y: lerp(-300, lerp(MOON0[1], arc[1], blend), up), o: lerp(1, moonOn, blend) });
      lakeGlints.forEach((g, i) => { const b = bump(t, 1.3 + i * 0.07, 1.95); pose(g.el, { x: g.x, y: g.y, s: b, r: time * 30, o: b }); });
      STARS.forEach((st) => {
        const k = es(t, 1.15 + st.i * 0.04, 1.5 + st.i * 0.04, ease.back) * (1 - es(t, 2.0, 2.3, ease.in));
        swing(st.el, st.x, lerp(-1100, st.y, k), k > 0.001 ? time : 0, 1.2, 0.8, st.i);
      });
      twinkle.forEach((el, i) => {
        const b = bump(t, 1.3 + i * 0.08, 1.95) + bump(t, 5.1 + i * 0.12, 5.9);
        const [x, y] = i < 3 ? [KX - 260 + i * 260, 640 - (i % 2) * 30] : [[330, 360, 1270][i - 3], [300, 80, 330][i - 3]];
        pose(el, { x, y, s: Math.min(1, b), r: time * 30, o: Math.min(1, b) });
      });

      /* v19a: go and make disciples of all nations — roads of light out to every people */
      roads.forEach((r) => attr(r.el, 'stroke-dashoffset', (1 - es(t, 2.35 + Math.abs(r.d) * 0.004, 2.8 + Math.abs(r.d) * 0.004)).toFixed(3)));
      nations.forEach((n) => { const k = es(t, 2.45 + Math.abs(n.d) * 0.006, 2.75 + Math.abs(n.d) * 0.006); n.sp.set({ x: n.x, y: n.y, s: 1, o: k }); });

      /* v19b: baptising in the name of the Father (light from above), the Son (He shines), the Holy Spirit (a dove) */
      const fa = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.2));
      pose(father, { x: KX, y: -260, s: 0.8 + fa * 0.3, o: fa });
      const sb = bump(t, 3.3, 3.95);
      pose(son, { x: KX, y: jy - 110, s: 0.6 + sb * 0.8, o: sb });
      const dv = es(t, 3.45, 3.75, ease.out) * (1 - es(t, 3.95, 4.2));
      pose(doveEl, { x: KX + 6, y: lerp(60, jhy - 150, dv), r: 18, s: 0.9, o: dv > 0.01 ? Math.min(1, dv * 3) * (1 - es(t, 3.95, 4.2)) : 0 });
      const pk = es(t, 3.05, 3.35, ease.back) * (1 - es(t, 3.95, 4.2, ease.in));
      swing(plA, S.portrait ? 540 : 420, lerp(-1200, S.portrait ? 120 : 250, pk), time, 0.8, 0.6, 1);
      swing(plB, S.portrait ? 1060 : 1180, lerp(-1200, S.portrait ? 120 : 250, pk), time, 0.8, 0.6, 2);

      /* v20a: teaching them — what He commanded goes out along the roads; a scroll lights up among each people */
      gifts.forEach((g) => {
        const u = es(t, 4.05 + g.i * 0.03, 4.6 + g.i * 0.03, ease.io);
        let px = 0, py = 0;
        { const pts = g.road.pts; const f = u * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(f)), w = f - k; px = lerp(pts[k][0], pts[k + 1][0], w); py = lerp(pts[k][1], pts[k + 1][1], w); }
        pose(g.el, { x: px, y: py - 16, s: 0.8 + Math.sin(u * PI) * 0.5, o: u > 0 && u < 1 ? 1 : 0 });
      });
      scrolls.forEach((s) => { const k = es(t, 4.45 + Math.abs(s.d) * 0.006, 4.7 + Math.abs(s.d) * 0.006); pose(s.el, { x: s.x + Math.sin((s.d * PI) / 180) * 12, y: s.y - 90 * Math.cos((s.d * PI) / 180), r: s.d, s: k, o: k > 0.01 ? 1 : 0 }); });

      /* the Eleven: they rise; turn out and point; go out along the roads, joined to Him by threads of light */
      const rise2 = seg(t, 0.3, 0.37);
      const go = es(t, 5.08, 5.9, ease.io);
      M.forEach((m) => {
        const turn = es(t, 2.1, 2.3);
        const pts = m.road.pts;
        const u = 0.12 + go * 0.24;
        const f = u * (pts.length - 1), k = Math.floor(f), w = f - k;
        const rx2 = lerp(pts[k][0], pts[k + 1][0], w), ry2 = lerp(pts[k][1], pts[k + 1][1], w) + 150;
        const x = lerp(m.x, lerp(m.x, rx2, 0.45) + (m.x < KX ? -40 : 40), go), y = lerp(m.y, m.y - 50, go);
        const s = lerp(m.s, m.s * 0.8, go);
        const outward = m.x < KX;
        const flip = turn > 0.5 ? outward : m.flip;
        const point = es(t, 2.2, 2.45) * (1 - es(t, 3.0, 3.2)) * (m.i % 2 ? 1 : 0.5);
        const kn = m.kneel ? 1 - rise2 : 0;
        const walking = go > 0 && go < 1;
        m.st.set({ x, y: y - (walking ? Math.abs(Math.sin(x * 0.07)) * 4 : 0), s, flip, o: 1 - kn, armF: 18 + point * 80 + es(t, 1.2, 1.5) * (1 - turn) * 40, armB: 10 + es(t, 1.2, 1.5) * (1 - turn) * 30 + (go > 0 ? 10 : 0), head: -es(t, 1.1, 1.4) * (1 - turn) * 14, blink: blinkAt(time, m.seed) });
        m.kn.set({ x, y, s, flip: m.flip, o: kn, armF: 80, armB: 60, head: 26, lean: 16, blink: 1 });
        const [hx, hy] = headAt(x, y, s, flip);
        const th = es(t, 5.1, 5.4) * 0.9;
        setThread(m.i, jhx + (hx < KX ? -14 : 14), jhy + 30, lerp(jhx, hx, Math.min(1, th * 1.4)), lerp(jhy + 30, hy + 20, Math.min(1, th * 1.4)), th);
      });

      S.cam.x = 0;
      S.cam.y = 30 - es(t, 1.05, 1.4) * 60 * (1 - es(t, 2.0, 2.4)) - es(t, 2.1, 2.5) * 30 + es(t, 5.0, 5.3) * 30;
      S.cam.z = (1.02 - es(t, 2.1, 2.5) * 0.06) * (S.portrait ? 1 - es(t, 2.1, 2.5) * 0.12 : 1);
    };
  },
};
