// Mk 13,35–37 — night at the house: the doorkeeper at the gate with his lamp, the road empty. Four round
// plates come down — evening, midnight, cockcrow, morning — each lighting in turn (the rooster on the
// roof crows); the lamp keeps burning. The servants nod off… the master is suddenly on the road — the
// doorkeeper lifts his lamp, they start up awake. Then the house flies out: it is night on the Mount of
// Olives, Jesus with the four and a great crowd all round — "What I say to you, I say to all:" — he
// lifts his lamp, and little lights kindle in every hand. "Keep awake!"
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix, crowd } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { olivesSet, houseSet, HOUSE, STATIONS, MASTER, SERVANTS, DOORKEEPER, SKIES, FOUR, JX, tint, roundel, rooster, zzz, handLamp, broom, keyProp, bowl, question, along, voiceRings, flame, PI } from './lib.js';

const F = HOUSE.FLOOR;
const NIGHTC = mix(C.night, C.indigo, 0.4);

/** the four watches, as round plates: evening, midnight, cockcrow, morning */
function watchPlate(c, kind) {
  const faces = { eve: mix(C.dusk, C.peach, 0.4), mid: mix(C.night, C.indigo, 0.3), cock: mix(C.duskViolet, C.stone, 0.3), morn: mix(C.dawn, C.skyBlue, 0.3) };
  let inner = '';
  if (kind === 'eve') inner = `<path d="${c.cut([[-40, 14], ...c.arc(0, 14, 24, 24, PI, 2 * PI, 12), [40, 14], [40, 42], [-40, 42]], 0.3, 4)}" fill="${C.sunDeep}"/><path d="${c.cut([[-46, 14], [46, 14], [46, 46], [-46, 46]], 0.4, 6)}" fill="${mix(C.hillMid, C.dusk, 0.4)}"/>`;
  if (kind === 'mid') inner = `<g transform="translate(6 -6)">${sheet().p(c.cut(c.circ(0, 0, 18, 20), 0.3, 4), C.moon).out()}</g><path d="${c.poly(c.star(-24, 12, 5, 2, 4, 0)) + c.poly(c.star(22, 20, 4, 1.6, 4, 0)) + c.poly(c.star(-12, -24, 3.6, 1.4, 4, 0))}" fill="${C.star}"/>`;
  if (kind === 'cock') inner = `<g transform="translate(-4 30) scale(.9)">${rooster(c)}</g>`;
  if (kind === 'morn') inner = `<path d="${c.cut([[-40, 20], ...c.arc(0, 20, 22, 22, PI, 2 * PI, 12), [40, 20], [40, 42], [-40, 42]], 0.3, 4)}" fill="${C.sun}"/><path d="${c.poly(c.star(0, 20, 40, 26, 12, 0))}" fill="${C.sun}" opacity=".4"/><path d="${c.cut([[-46, 20], [46, 20], [46, 46], [-46, 46]], 0.4, 6)}" fill="${C.hillMid}"/>`;
  return `<circle class="lit" r="90" fill="url(#halo-glow)" opacity="0"/><path d="M0 -1500V-58" stroke="rgba(230,210,180,.5)" stroke-width="1.2"/>${roundel(c, 48, { face: faces[kind] })}<g clip-path="url(#m13-watch-clip)">${inner}</g>`;
}

export default {
  id: 'm13-watch',
  beats: [
    { v: 35, text: 'Czuwajcie więc, bo nie wiecie, kiedy pan domu przyjdzie:' },
    { v: 35, cont: true, text: 'z wieczora czy o północy, czy o pianiu kogutów, czy rankiem.' },
    { v: 36 },
    { v: 37, text: 'Lecz co wam mówię, mówię wszystkim:' },
    { v: 37, cont: true, text: 'Czuwajcie!».' },
  ],
  cam: { x: [-30, 40], y: [-60, 40], z: [0.97, 1.08] },
  build(S) {
    const c = S.c;
    // phone: the doorkeeper a step nearer the gate (as in the scene before), the four plates closer
    // together, the road's question over the gate (the road itself runs off the screen)
    const PH = S.portrait;
    S.defs(`<clipPath id="m13-watch-clip"><circle r="47"/></clipPath>`);
    /* behind everything: the Mount of Olives at night (revealed at the end) */
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: 0.45, moonXY: [1210, 130], templeGlow: 0.2 });
    const mount = S.layer({ par: 0.5, sh: 5 });
    const allPeople = [];
    [
      { y: 610, s: 0.5, n: 14, x0: 260, x1: 1340 },
      { y: 640, s: 0.6, n: 10, x0: 240, x1: 1360 },
      { y: 676, s: 0.72, n: 6, x0: 200, x1: 560 },
      { y: 676, s: 0.72, n: 6, x0: 1040, x1: 1400 },
    ].forEach((row) => { for (let i = 0; i < row.n; i++) allPeople.push({ x: ((x) => (PH ? 800 + (x - 800) * 0.5 : x))(lerp(row.x0, row.x1, (i + c.rr(0.15, 0.85)) / row.n)), y: row.y + c.rr(-4, 4), s: row.s * c.rr(0.9, 1.08) }); });
    allPeople.sort((a, b) => a.y - b.y).forEach((m) => { m.seed = c.rr(0, 9); m.p = S.puppet(mount.add(tint(person(c, crowdPerson(c)), NIGHTC, 0.3))); m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, o: 0 }); });
    allPeople.forEach((m) => { m.fl = mount.add(`<g>${flame(c, 16)}</g><g><circle r="26" fill="url(#warm-glow)"/></g>`); m.glow = m.fl.nextElementSibling || m.fl; });
    const fourPos = [590, 660, 940, 1010];
    const four = FOUR.map((f, i) => ({ ...f, i, x: fourPos[i], seed: c.rr(0, 9), p: S.puppet(mount.add(tint(person(c, { ...f.o, pose: 'sit' }), NIGHTC, 0.15))) }));
    const J = S.puppet(mount.add(person(c, { ...CAST.jesus, holdB: `<g class="jlamp" transform="translate(-6 0)">${handLamp(c, { glowR: 240 })}</g>` })));
    const jLamp = J.el.querySelector('.jlamp');
    const jLampFlame = J.el.querySelector('.flame'), jLampGlow = J.el.querySelector('.glow');
    const voice = voiceRings(mount, c, { n: 3, r: 28, w: 4.4, color: shade(C.ochre, 0.4) });
    const raysL = S.layer({ par: 0.5, sh: 1, flat: true });
    raysL.add(`<g transform="translate(${JX - 8} ${690 - 240})">${Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * PI * 2; return `<path d="${c.poly([[Math.cos(a - 0.03) * 40, Math.sin(a - 0.03) * 40], [Math.cos(a - 0.07) * 900, Math.sin(a - 0.07) * 900], [Math.cos(a + 0.07) * 900, Math.sin(a + 0.07) * 900], [Math.cos(a + 0.03) * 40, Math.sin(a + 0.03) * 40]])}" fill="#fff3cf" opacity=".15"/>`; }).join('')}</g>`);

    /* the house at night, in front */
    const H = houseSet(S, { tintCol: NIGHTC, tintK: 0.5 });
    const P = S.layer({ par: 0.45, sh: 5 });
    const T5 = (m) => tint(m, NIGHTC, 0.4);
    const HOLD = [
      `<g transform="translate(-10 0)"><path d="${c.cut([[-9, 0], [9, 0], [7, 16], [-7, 16]], 0.3, 3)}" fill="${C.wood3}"/></g>`,
      `<g transform="translate(0 -2)">${bowl(c, { w: 28, food: 'bread' })}</g>`,
      `<g transform="rotate(-20)">${broom(c)}</g>`,
      `<g transform="translate(0 2) rotate(80)">${keyProp(c)}</g>`,
    ];
    const serv = SERVANTS.map((o, i) => ({ i, seed: c.rr(0, 9), x: [STATIONS.well - 66, STATIONS.oven - 72, STATIONS.broom + 10, STATIONS.chest - 56][i], p: S.puppet(P.add(T5(person(c, { ...o, holdF: HOLD[i] })))), z: P.add(`<g>${zzz(c)}</g>`) }));
    const master = S.puppet(P.add(T5(person(c, { ...MASTER, holdB: `<path d="M-2 30L2 30L3 -120L-1 -120Z" fill="${C.wood2}"/>` }))));
    const dk = S.puppet(P.add(T5(person(c, { ...DOORKEEPER, holdF: `<g transform="translate(-4 4)">${handLamp(c, { glowR: 150 })}</g>` }))));
    const dkFlame = dk.el.querySelector('.flame'), dkGlow = dk.el.querySelector('.glow');
    const cock = P.add(`<g>${tint(rooster(c), NIGHTC, 0.3)}</g>`);
    const cockHead = cock.querySelector('.head');
    const crow = P.add(`<g>${[0, 1, 2].map((k) => `<path d="${c.ribbon(c.arc(0, 0, 14 + k * 10, 14 + k * 10, -0.6, 0.6, 8), 3)}" fill="${C.cream}"/>`).join('')}</g>`);
    const roadQ = P.add(`<g>${question(c)}</g>`);

    /* the four watches */
    const fx = S.layer({ par: 0.2, sh: 6 });
    const WATCH = ['eve', 'mid', 'cock', 'morn'].map((k, i) => ({ k, i, x: PH ? 590 + i * 145 : 560 + i * 160, el: fx.add(`<g>${watchPlate(c, k)}</g>`) }));
    WATCH.forEach((w) => { w.lit = w.el.querySelector('.lit'); });
    const SKYW = [['#6d5a86', '#d88d78', '#f0b98e'], SKIES.deep, ['#4e4a74', '#8e7c9a', '#c7a6a4'], ['#8fa3b8', '#e9c9a8', '#f7e2bf']];

    return (t, time) => {
      const T = time;
      /* the sky: evening → the four watches → deep night */
      const wIdx = t < 1.02 ? -1 : Math.min(3, Math.floor((t - 1.02) / 0.22));
      let skyK = 0, skyW = SKYW[0];
      WATCH.forEach((w) => {
        const a = 1.02 + w.i * 0.22;
        const k = bump(t, a - 0.02, a + 0.3);
        if (k > 0.01 && wIdx === w.i) { skyK = k * 0.9; skyW = SKYW[w.i]; }
        const drop = es(t, 0.9 + w.i * 0.05, 1.15 + w.i * 0.05, ease.back) * (1 - es(t, 2.9, 3.1));
        pose(w.el, { x: w.x, y: lerp(-300, 168, drop), r: (1 - drop) * 6 + Math.sin(w.i * 2) * 1.5, s: 1 + k * 0.12, o: drop > 0.01 ? 1 : 0 });
        fade(w.lit, k);
      });
      set.sk.blend(SKIES.night, skyW, skyK);
      set.update(t, T, { sun: 700, sunO: 0, moon: 130, moonO: 1, glow: 0.2, starsO: 1 });

      /* the house flies out (beat 3) */
      const fly = es(t, 2.95, 3.45, ease.in);
      H.layers.forEach((L, i) => { L.shift(0, -fly * (1100 + i * 60)); L.fade(1 - es(t, 3.3, 3.5)); });
      P.shift(0, -fly * 1300); P.fade(1 - es(t, 3.3, 3.5));
      fx.shift(0, -fly * 900);

      /* the doorkeeper keeps his lamp burning all night; lifts it when the master comes */
      const alarm = es(t, 2.3, 2.45) * (1 - es(t, 2.85, 3));
      dk.set({ x: PH ? 1062 : 1116, y: F, s: 0.96, flip: true, armF: 60 + alarm * 45, armB: 10 + alarm * 60, head: -2 - alarm * 6, blink: blinkAt(T, 7) });
      pose(dkFlame, { x: 27, y: -12, sy: 1 + Math.sin(T * 7) * 0.1, sx: 1 + Math.sin(T * 5) * 0.06 });
      fade(dkGlow, 0.8 + alarm * 0.2 + Math.sin(T * 3) * 0.05);
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.35 + Math.sin(T * 3) * 0.08 });

      /* the servants: at their work; nod off (1.6–2.3); start up awake at the alarm */
      serv.forEach((s) => {
        const doze = es(t, 1.55 + s.i * 0.08, 1.85 + s.i * 0.08) * (1 - es(t, 2.38 + s.i * 0.03, 2.5 + s.i * 0.03));
        const jolt = bump(t, 2.38, 2.6);
        s.p.set({ x: s.x, y: F + (s.i % 2) * 4 - jolt * 8, s: 0.95, flip: s.i === 2, armF: 30 * (1 - doze) + jolt * 40, head: doze * 26, lean: doze * 6 * (s.i === 2 ? -1 : 1), blink: doze > 0.3 ? 1 : blinkAt(T, s.seed) });
        const zk = T ? (T * 0.5 + s.i * 0.3) % 1 : 0.5;
        pose(s.z, { x: s.x + 16, y: F - 200 - zk * 20, s: 0.7 + zk * 0.3, o: doze * (1 - zk * 0.6) });
      });

      /* the rooster on the roof crows at cockcrow */
      const ck = bump(t, 1.44, 1.76);
      pose(cock, { x: 900, y: HOUSE.ROOF - 50, s: 1.1 });
      pose(cockHead, { x: 0, y: 0, r: -ck * 30, ox: 12, oy: -30 });
      pose(crow, { x: 940, y: HOUSE.ROOF - 110, s: 0.7 + ck * 0.5, r: -30, o: ck });

      /* the road: empty, a question (beat 0); the master comes suddenly (beat 2) */
      const q = es(t, 0.2, 0.45, ease.back) * (1 - es(t, 2.1, 2.2));
      pose(roadQ, { x: PH ? 1050 : 1470, y: (PH ? 380 : 470) + Math.sin(T * 1.2) * 4, s: q, o: q > 0.01 ? 1 : 0 });
      const come = seg(t, 2.12, 2.6);
      const [mx, my] = along(HOUSE.ROAD, 1 - come);
      const step = es(t, 2.6, 2.78);
      const MX = PH ? 935 : 985;   // phone: he steps past the doorkeeper, not onto him
      master.set({ x: come >= 1 ? lerp(1052, MX, step) : mx, y: my, s: 1 - (1 - come) * 0.5, flip: true, o: come > 0 ? 1 : 0, walk: (come > 0 && come < 1) || (step > 0 && step < 1) ? (come < 1 ? mx : 1052 - step * (1052 - MX)) * 0.08 : undefined, amt: 1.3, armB: 30, armF: es(t, 2.6, 2.8) * 70, head: -2, blink: blinkAt(T, 3) });

      /* the Mount: Jesus lifts his lamp over everyone; lights kindle in every hand */
      const all = es(t, 3.2, 3.6);
      const lift = es(t, 4.02, 4.3);
      const aB = 20 + lift * 150;
      pose(jLamp, { x: -6, y: 0, r: aB });
      J.set({ x: JX, y: 690, s: 1.08, o: 1, armB: aB, armF: 30 + es(t, 3.4, 3.7) * 40, head: -lift * 6, blink: blinkAt(T, 2) });
      pose(jLampFlame, { x: 27, y: -12, sy: 1 + Math.sin(T * 7) * 0.1 + lift * 0.3, sx: 1 + Math.sin(T * 5) * 0.06 });
      fade(jLampGlow, 0.7 + lift * 0.3);
      voice(JX + 6, 690 - 180, es(t, 3.2, 3.4) * (1 - es(t, 3.9, 4.0)) + lift, T, { s0: 0.8 });
      raysL.fade(lift * 0.9);
      four.forEach((m) => m.p.set({ x: m.x, y: 716 - (m.i % 2 ? 0 : 20), s: 0.9, flip: m.x > 800, head: -6 - lift * 8, armF: lift * 70, blink: blinkAt(T, m.seed) }));
      allPeople.forEach((m) => {
        const d = Math.abs(m.x - 800) / 700;
        const on = es(t, 4.1 + d * 0.45, 4.25 + d * 0.45);
        if (all > 0 || m.shown) { m.shown = all > 0; m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, o: all, head: -6 - on * 4, armF: on * 70, blink: all > 0.99 ? blinkAt(T, m.seed) : 0 }); }
        const hx = m.x + (m.x > 800 ? -1 : 1) * 60 * m.s, hy = m.y - 150 * m.s;
        pose(m.fl, { x: hx, y: hy, s: on * m.s * 1.6 * (1 + Math.sin(T * 8 + m.seed) * 0.08), o: on });
        pose(m.glow, { x: hx, y: hy - 6 * m.s, s: m.s * 2 * on, o: on * 0.9 });
      });

      S.cam.x = -es(t, 0.1, 0.8) * 0 + es(t, 2.05, 2.4) * 30 * (1 - es(t, 2.9, 3.2));
      S.cam.z = 1 + es(t, 2.05, 2.4) * 0.04 * (1 - es(t, 2.9, 3.2)) - es(t, 4.0, 4.6) * 0.03;
      S.cam.y = -es(t, 0.8, 1.2) * 40 * (1 - es(t, 1.95, 2.2)) - es(t, 4.0, 4.6) * 20;
    };
  },
};
