// Mt 8,1–4 — the curtains open on the green mountain of the Sermon. Jesus comes down the winding path and great
// crowds stream down after Him. At the foot of the mountain, on the road, a leper comes ringing his bell and falls on
// his knees: "Lord, if you will, you can make me clean." Jesus stretches out His hand, touches him — "I will; be
// clean" — the grey blotches peel away like paper flakes and he stands up clean. "Tell no one", and a plate comes
// down: the priest at the Temple and the offering Moses commanded; the man sets off on the road towards it.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { mountSet, PATH, MP, along, hangAt, pathS, mob, LEPER, LEPER_HEALED, bell, leperSpots, priestPlate, headAt, voiceRings, bubble, sparkle, tr, PI } from './lib.js';

const FEET = 758, JX = 742, KX = 888;

export default {
  id: 'mt8-leper',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'A oto zbliżył się trędowaty, upadł przed Nim' },
    { v: 2, cont: true, text: 'i prosił Go: «Panie, jeśli chcesz, możesz mnie oczyścić».' },
    { v: 3, text: '[Jezus] wyciągnął rękę, dotknął go i rzekł: «Chcę, bądź oczyszczony!».' },
    { v: 3, cont: true, text: 'I natychmiast został oczyszczony z trądu.' },
    { v: 4, text: 'A Jezus rzekł do niego: «Uważaj, nie mów nikomu,' },
    { v: 4, cont: true, text: 'ale idź, pokaż się kapłanowi i złóż ofiarę, którą przepisał Mojżesz, na świadectwo dla nich».' },
  ],
  cam: { x: [-300, 70], y: [-20, 60], z: [1, 1.2] },
  build(S) {
    const M = mountSet(S);
    const c = M.c;
    const P = S.portrait;
    const pc = makeCutter('mt8-leper-crowd');

    /* ---------- the crowds (sprites: one facing right, one facing left, swapped at the turns) ---------- */
    const crowdL = S.layer({ par: MP, sh: 4 });
    const N = 7;
    const GROUPS = [];
    for (let i = N - 1; i >= 0; i--) {
      const n = 2 + (i % 2);
      const mr = mob(makeCutter('mt8-g' + i), n, { s: 1, spread: 40, rows: 1 });
      const ml = mob(makeCutter('mt8-g' + i), n, { s: 1, spread: 40, rows: 1, flip: true });
      const hx = P ? 420 + ((i * 131) % 440) * 0.8 : 330 + ((i * 131) % 440), hy = M.mfn(hx) + 26 + (i % 3) * 8;
      GROUPS[i] = { i, n, hx, hy, R: crowdL.sprite(mr, 800, 500), Lf: crowdL.sprite(ml, 800, 500), u: 0.84 - i * 0.1, d: i * 0.04 };
    }
    // where the lower groups settle once Jesus has reached the road
    const REST = P ? [[604, 704], [530, 700], [460, 702]] : [[600, 704], [480, 700], [360, 702]];

    /* ---------- people ---------- */
    const L = S.layer({ par: MP, sh: 5 });
    const HOME = [[492, 412], [630, 424], [446, 426], [672, 436]];
    const DIS = [CAST.peter, CAST.andrew, CAST.john, CAST.james].map((o, i) => ({ i, p: S.puppet(L.add(person(c, o))), rest: P ? 664 - i * 54 : 650 - i * 72, home: HOME[i], seed: c.rr(0, 9) }));
    const heart = L.add(`<g opacity="0"><circle r="70" fill="url(#warm-glow)"/><path d="M0 8C-14 -2 -16 -12 -8 -16C-4 -18 -1 -15 0 -12C1 -15 4 -18 8 -16C16 -12 14 -2 0 8Z" fill="${C.jesusMantle}"/></g>`);
    const glow = L.add(`<circle r="170" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 40, w: 6 });
    const leper = S.puppet(L.add(person(c, { ...LEPER, holdF: `<g data-k="bell">${bell(c)}</g>` })));
    const bellEl = S.$('bell');
    const leperK = S.puppet(L.add(person(c, { ...LEPER, pose: 'kneel' })));
    const cleanK = S.puppet(L.add(person(c, { ...LEPER_HEALED, pose: 'kneel' })));
    const clean = S.puppet(L.add(person(c, LEPER_HEALED)));
    const spotsS = leperSpots(c, false).map((sp) => ({ ...sp, el: L.add(`<g>${sp.m}</g>`) }));
    const spotsK = leperSpots(c, true).map((sp, i) => ({ ...sp, el: L.add(`<g opacity="0">${sp.m}</g>`), i, dx: c.rr(-1, 1), spin: c.rr(200, 500) }));
    const sparks = [0, 1, 2, 3, 4].map((i) => L.add(`<g opacity="0">${sparkle(c, 12 + (i % 3) * 5)}</g>`));

    /* ---------- words and the plate ---------- */
    const W = S.layer({ par: MP + 0.02, sh: 3 });
    const plea = W.add(`<g opacity="0">${bubble(c, [tr('Panie, jeśli chcesz,', 'Lord, if you want to,'), tr('możesz mnie oczyścić', 'you can make me clean')], { size: 21, dir: -1 })}</g>`);
    const will = W.add(`<g opacity="0">${bubble(c, tr('Chcę, bądź oczyszczony!', 'I want to. Be made clean.'), { size: 23, fill: C.halo, dir: -1 })}</g>`);
    const hush = W.add(`<g opacity="0">${bubble(c, tr('Uważaj, nie mów nikomu…', 'See that you tell nobody…'), { size: 21, fill: C.halo, dir: -1 })}</g>`);
    const hangL = S.layer({ par: 0.2, sh: 6 });
    const plate = hanging(hangL, priestPlate(c), { x: 1000, y: -600, len: 900 });

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      M.update(T);
      cur.set(es(t, 0.05, 0.85), T);

      /* v1 — He comes down the mountain; the crowds follow Him */
      const uJ = es(t, 1.0, 1.78, (u) => u);
      const [jpx, jpy, jdir] = along(PATH, uJ);
      const onPath = t < 1.8;
      // at the foot He steps a little to the right and turns to the road
      const reach = es(t, 4.1, 4.45) * (1 - es(t, 5.5, 5.8));
      const jx = onPath ? jpx : JX + reach * 44;
      const jy = onPath ? jpy : FEET;
      const js = pathS(jy) * 1.03;
      const walkingJ = t > 1.0 && t < 1.78;
      const speak = es(t, 4.25, 4.4) * (1 - es(t, 4.9, 5.05));
      const warn = es(t, 6.05, 6.25) * (1 - es(t, 6.9, 7.1));
      const send = es(t, 7.1, 7.35);
      jesus.set({
        x: jx, y: jy, s: js, flip: walkingJ && jdir < 0, walk: walkingJ ? uJ * 90 : undefined, amt: 0.8,
        armF: 14 + bump(t, 0.2, 0.95) * 40 + reach * 58 + warn * 30 + send * 70, armB: 10 + bump(t, 0.2, 0.95) * 30 + speak * 40 + warn * 120,
        lean: reach * 8, head: reach * 8 - send * 4, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const u = es(t, 1.0 + d.i * 0.02, 1.9 + d.i * 0.03, (x) => x) - (d.i + 1) * 0.07;
        let [px, py, dir] = along(PATH, Math.max(0, u));
        const join = es(t, 1.02 + d.i * 0.03, 1.2 + d.i * 0.04);
        px = lerp(d.home[0], px, join); py = lerp(d.home[1], py, join);
        const off = es(t, 1.85 + d.i * 0.03, 2.2 + d.i * 0.03);
        const x = lerp(px, d.rest, off), y = lerp(py, FEET + (d.i % 2) * 6, off);
        const moving_ = (t > 1.0 && t < 1.9 + d.i * 0.03) || (off > 0 && off < 1);
        const recoil = es(t, 2.2, 2.55) * (1 - es(t, 5.2, 5.6));
        const marvel = es(t, 5.3, 5.6);
        d.p.set({
          x: x - recoil * 26, y, s: pathS(y) * 0.98, flip: moving_ && off < 0.5 ? dir < 0 : false,
          walk: moving_ ? x * 0.06 : undefined, amt: 0.8,
          armF: 12 + recoil * 40 + marvel * (d.i % 2 ? 30 : 60), armB: recoil * (d.i % 2 ? 70 : 20) + marvel * (d.i % 2 ? 120 : 30),
          lean: -recoil * 8, head: -marvel * 6, blink: blinkAt(T, d.seed),
        });
      });
      GROUPS.forEach((g) => {
        const k = es(t, 1.05 + g.d, 1.9 + g.d * 0.6, (x) => x);
        const u = g.u * k;
        let [x, y, dir] = along(PATH, u);
        const join = es(t, 1.0 + g.d, 1.25 + g.d);
        x = lerp(g.hx, x, join); y = lerp(g.hy, y, join);
        if (g.i < REST.length) {
          const r = es(t, 1.9 + g.i * 0.05, 2.3 + g.i * 0.05);
          x = lerp(x, REST[g.i][0], r); y = lerp(y, REST[g.i][1], r);
          if (r > 0 && r < 1) dir = -1;
          if (r >= 1) dir = 1;
        }
        const walking = (k > 0 && k < 1) || (join > 0 && join < 1);
        const bob = walking ? Math.abs(Math.sin(x * 0.05 + g.i)) * 3 : 0;
        const recoil = g.i < REST.length ? es(t, 2.2, 2.55) * (1 - es(t, 5.2, 5.6)) * 20 : 0;
        const s = pathS(y) * (g.i < REST.length ? lerp(0.8, 0.7, es(t, 1.9, 2.3)) : 0.8);
        const right = walking ? dir >= 0 : true;
        g.R.set({ x: x - recoil, y: y - bob, s, o: right ? 1 : 0 });
        g.Lf.set({ x: x - recoil, y: y - bob, s, o: right ? 0 : 1 });
      });

      /* v2a — the leper comes ringing his bell and falls on his knees */
      const come = es(t, 2.02, 2.52);
      const lx = lerp(1460, KX, come);
      const kneel = es(t, 2.56, 2.62);
      const walking = come > 0 && come < 1;
      leper.set({ x: lx, y: FEET, s: 1, flip: true, o: (t > 2 ? 1 : 0) * (1 - kneel), walk: walking ? lx * 0.04 : undefined, amt: 0.7, armF: 50, armB: 10, head: 10, lean: 6, blink: blinkAt(T, 3) });
      pose(bellEl, { r: T ? Math.sin(T * 11) * (walking ? 24 : 8) : 0 });
      spotsS.forEach((sp) => pose(sp.el, { x: lx - sp.x, y: FEET + sp.y, s: 1, o: (t > 2 ? 1 : 0) * (1 - kneel) }));

      /* v2b — he pleads */
      const beg = es(t, 2.62, 2.9);
      const healed = es(t, 5.04, 5.1);
      const rise = es(t, 5.46, 5.52);
      leperK.set({ x: KX, y: FEET, s: 1, flip: true, o: kneel * (1 - healed), armF: 30 + beg * 70 - es(t, 4.1, 4.35) * 30, armB: 20 + beg * 100 - es(t, 4.1, 4.35) * 60, head: -beg * 12 + es(t, 4.1, 4.35) * 16, lean: 4, blink: blinkAt(T, 3) });
      const pb = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.92, 4.02));
      pose(plea, { x: KX + (P ? -40 : 10), y: FEET - 150, s: pb, o: pb > 0.02 ? 1 : 0 });

      /* v3a — compassion: He stretches out His hand and touches him */
      const pity = bump(t, 3.7, 4.5);
      const [hx, hy] = headAt(jx, FEET, js);
      pose(heart, { x: jx + 6, y: FEET - 120 * js, s: 0.6 + pity * 0.6 + (T ? Math.sin(T * 5) * 0.04 * pity : 0), o: t > 3 ? pity : 0 });
      pose(glow, { x: hx, y: hy + 40, s: 0.8 + speak * 0.6 + healed * 0.4, o: t > 2 ? 0.2 + speak * 0.5 + bump(t, 5.0, 5.9) * 0.4 : 0 });
      jVoice(hx, hy, speak + warn * 0.7, T, { dir: 1, spread: 2.2 });
      const wb = es(t, 4.28, 4.48, ease.back) * (1 - es(t, 4.95, 5.05));
      pose(will, { x: hx + 24, y: hy - 70, s: wb, o: wb > 0.02 ? 1 : 0 });

      /* v3b — the leprosy leaves him: flakes of grey paper peel off */
      spotsK.forEach((sp) => {
        const k = seg(t, 5.06 + sp.i * 0.02, 5.8 + sp.i * 0.02);
        const x = KX - sp.x + k * (60 + sp.dx * 90) + Math.sin(k * 9 + sp.i) * 14 * k, y = FEET + sp.y - Math.sin(k * PI) * 80 + k * k * 120;
        pose(sp.el, { x, y, sx: Math.cos((k * sp.spin) / 30), r: k * sp.spin, s: 1 + k * 0.6, o: kneel * (1 - es(t, 5.6, 5.9 + sp.i * 0.02)) });
      });
      cleanK.set({ x: KX, y: FEET, s: 1, flip: true, o: healed * (1 - rise), armF: 40, armB: 30, head: -6, blink: blinkAt(T, 3) });
      const joy = es(t, 5.52, 5.8) * (1 - es(t, 6.05, 6.3));
      const nod = bump(t, 6.5, 6.95);
      const go = es(t, 7.35, 7.95);
      const cx = lerp(KX, P ? 1010 : 1070, go);
      clean.set({ x: cx, y: FEET, s: 1, flip: go > 0.02 ? false : true, o: rise, walk: go > 0 && go < 1 ? cx * 0.05 : undefined, armF: 30 + joy * 60 + (1 - go) * es(t, 6.1, 6.3) * 20, armB: 20 + joy * 130, head: -joy * 10 + nod * 14, blink: blinkAt(T, 3) });
      sparks.forEach((sp, i) => { const k = bump(t, 5.1 + i * 0.06, 5.8 + i * 0.06); pose(sp, { x: KX - 40 + i * 22, y: FEET - 60 - (i % 3) * 50, s: k, r: T * 50 + i * 20, o: k }); });

      /* v4a — "tell no one" */
      const hb = es(t, 6.12, 6.32, ease.back) * (1 - es(t, 6.92, 7.02));
      pose(hush, { x: hx + 24, y: hy - 70, s: hb, o: hb > 0.02 ? 1 : 0 });

      /* v4b — go, show yourself to the priest: the plate of the Temple comes down */
      hangAt(plate, P ? 880 : 1000, lerp(-700, 270, es(t, 7.05, 7.4, ease.out)), T, 1, 0.7);

      /* camera: the whole mountain, then down to the road */
      const down = es(t, 1.6, 2.4);
      S.cam.z = 1 + down * 0.16 - es(t, 7.0, 7.4) * 0.06;
      S.cam.x = P ? lerp(-300, 20, down) : down * 50;   // phone: the whole mountain top at the start
      S.cam.y = -10 + down * 60 - es(t, 7.0, 7.4) * 30;
    };
  },
};
