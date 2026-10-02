// Mt 11,12–13 — a painted flat: a hill rises from the left to a golden wall with the gate of the Kingdom at its top,
// John standing by the gate. "The Kingdom suffers violence": a crowd surges up from the right, shoving, climbing
// ladders against the wall, beating on the doors till the gate shakes; "and the violent take it by force": the doors
// burst open, light floods out and they press in. "All the prophets and the Law prophesied until John": the view
// runs down the hill, where the prophets stand in a line from Moses and the tablets upward — a small flame is handed
// from one to the next up the hill, until the last one gives it to John at the gate.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, grass, rock } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { JOHN_B, MOSES, ISAIAH, L6, L9, kingdomGate, gateDoor, lawTablets, soulLight, throng, pose3, hand, headAt, kf, moving, KINGDOM, PI } from './lib.js';

const P = 0.6;
const GX = 1000, GYT = 560;                     // the gate (base)
const g = (x) => 776 - 216 * (1 / (1 + Math.exp(-(x - 640) / 130)));   // the hill's surface
const PR = [[300, MOSES, 'moses'], [470, ISAIAH, 'isaiah'], [640, null, 'prophet'], [800, null, 'elijah']];
const JX = 880;

/** a ladder (origin: its foot); leans to the left by default */
function ladder(c, h = 180) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [-30, -h]], 5) + c.ribbon([[30, 0], [0, -h]], 5), C.wood2);
  let r = '';
  for (let i = 1; i < 7; i++) { const k = i / 7; r += c.ribbon([[-30 * k, -h * k], [30 - 30 * k, -h * k]], 4); }
  s.p(r, C.wood3);
  return s.out();
}

export default {
  id: 'mt11-violence',
  enter: 'fly',
  beats: [
    { v: 12, text: 'A od czasu Jana Chrzciciela aż dotąd królestwo niebieskie doznaje gwałtu' },
    { v: 12, cont: true, text: 'i ludzie gwałtowni zdobywają je.' },
    { v: 13 },
  ],
  cam: { x: [-420, 480], y: [-40, 40], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const sk = sky(S, ['#c9d9d6', '#efe6cf', '#f6e5c4']);
    const sk2 = sky(S, KINGDOM, { name: 'sky2', rise: 0 }).layer;
    sk2.fade(0);
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    S.layer({ par: 0.25, sh: 3 }).add(hillsWith(c, { y: 560, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 18 }).markup);

    /* the light behind the gate, the golden wall and the gate */
    const glowL = S.layer({ par: P, sh: 0, flat: true, rise: 0 });
    const shine = glowL.add(`<g><circle r="380" fill="url(#warm-glow)"/><circle r="200" fill="url(#halo-glow)"/></g>`);
    const wallL = S.layer({ par: P, sh: 4 });
    const Wl = sheet();
    const gold = mix(C.sun, C.sand, 0.35);
    Wl.p(c.cut([[GX - 150, GYT + 6], [GX - 150, GYT - 150], [GX + 560, GYT - 150], [GX + 560, GYT + 30]], 0.8, 10), gold);
    let cren = '';
    for (let x = GX - 150; x < GX + 560; x += 34) cren += c.cut(c.rect(x, GYT - 170, 20, 24), 0.3, 4);
    Wl.p(cren, gold);
    let bl = '';
    for (let y = GYT - 140; y < GYT; y += 26) for (let x = GX - 146 + (Math.round(y / 26) % 2) * 22; x < GX + 550; x += 44) if (Math.abs(x + 18 - GX) > 110) bl += c.cut(c.rect(x, y, 38, 20), 0.4, 6);
    Wl.x(bl, shade(gold, 0.2), 'opacity=".6"');
    wallL.add(Wl.out());
    const G = kingdomGate(c, 160, 230);
    const light = wallL.add(`<g transform="translate(${GX} ${GYT})">${G.light}</g>`);
    wallL.add(`<g transform="translate(${GX} ${GYT})">${G.frame}</g>`);
    const doorL = wallL.add(`<g>${gateDoor(c, 80, 180)}</g>`);
    const doorR = wallL.add(`<g><g transform="scale(-1 1)">${gateDoor(c, 80, 180)}</g></g>`);

    /* the hill */
    const hillL = S.layer({ par: P, sh: 3 });
    const hs = sheet();
    hs.p(c.ridge((x) => g(x), -900, 2500, 1700, 12, 1.2), mix(C.hillNear, C.sage2, 0.4));
    hs.p(c.ribbon(Array.from({ length: 30 }, (_, i) => { const x = 180 + i * 28; return [x, g(x) + 10]; }), 24, 1.2), mix(C.sand, C.cream, 0.3));
    hillL.add(hs.out());
    hillL.add(grass(c, { x0: -800, x1: 2400, y: 700, fn: (x) => g(x) + 2, n: 60, h: 13, color: C.moss }) + rock(c, 150, g(150) + 30, 80, 26, C.rock2));

    /* the prophets on the path, and John by the gate */
    const act = S.layer({ par: P, sh: 5 });
    const tabl = `<g transform="translate(0 34) rotate(180) scale(.5)">${lawTablets(c, { w: 40, h: 56 })}</g>`;
    const looks = { moses: { ...MOSES, holdB: tabl }, isaiah: ISAIAH, prophet: L6.prophet, elijah: L9.elijah };
    const pro = PR.map(([x, , k], i) => ({ i, x, y: g(x) + 6, p: S.puppet(act.add(person(c, looks[k]))) }));
    const john = S.puppet(act.add(person(c, JOHN_B)));
    const flame = act.add(`<g>${soulLight(c, 12)}</g>`);

    /* the violent: groups surging up from the right, two on ladders, three at the doors */
    const mob = S.layer({ par: P, sh: 5 });
    const surge = [0, 1, 2].map((i) => ({ i, sp: mob.sprite(throng(makeCutter('mt11-vi' + i), 4, { s: 0.8, flip: true, rows: 2, spread: 40, arms: 90 }), 800, 600) }));
    const lad = (PH ? [GX + 200, GX + 310] : [GX + 250, GX + 420]).map((x, i) => ({ i, x, el: mob.add(`<g>${ladder(c, 190)}</g>`) }));
    const climbers = [0, 1].map((i) => ({ i, p: S.puppet(mob.add(person(c, { ...throngOpts(i), pose: 'stand' }))) }));
    const pushers = [0, 1, 2].map((i) => ({ i, p: S.puppet(mob.add(person(c, throngOpts(i + 2)))) }));

    function throngOpts(i) {
      const R = [C.dustyBlue, C.clayMantle, C.sageRobe, C.mauve, C.ochreRobe];
      return { robe: R[i % 5], mantle: i % 2 ? null : C.stone, hair: [C.hair, C.hair3, C.hair2][i % 3], hairStyle: ['short', 'curly', 'wrap'][i % 3], veil: C.linen2, beard: ['short', 'full', 'none'][i % 3], skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4], belt: C.leather };
    }

    return (t, time) => {
      const T = time;

      /* v12a — they press at the Kingdom: the gate shakes */
      const push = es(t, 0.1, 0.5);
      const shake = T ? Math.sin(T * 30) * 2.5 * bump(t, 0.4, 1.05) : 0;
      wallL.shift(shake, 0);
      surge.forEach((s) => {
        const k = es(t, 0.05 + s.i * 0.08, 0.6 + s.i * 0.08);
        const tx = PH ? GX + 190 + s.i * 80 : GX + 210 + s.i * 110;
        const x = lerp(1700 + s.i * 120, tx, k);
        const inside = es(t, 1.05 + s.i * 0.2, 1.45 + s.i * 0.35);
        const xx = lerp(x, GX + 20, inside);
        s.sp.set({ x: xx, y: g(xx) + 30 + s.i * 10 - Math.abs(Math.sin(xx * 0.04)) * 4 * (k < 1 || (inside > 0 && inside < 1)), s: 1 - inside * 0.25, o: 1 - seg(inside, 0.9, 1) });
      });
      lad.forEach((l) => pose(l.el, { x: l.x, y: GYT + 10, o: es(t, 0.3 + l.i * 0.1, 0.4 + l.i * 0.1) }));
      climbers.forEach((cl) => {
        const k = es(t, 0.45 + cl.i * 0.1, 0.95 + cl.i * 0.1);
        const over = es(t, 1.1 + cl.i * 0.1, 1.4 + cl.i * 0.1);
        const x = lad[cl.i].x + 10 - k * 24, y = GYT + 10 - k * 150 - over * 20;
        cl.p.set({ x: x - over * 40, y, s: 0.78, flip: true, armF: 140 + (T ? Math.sin(T * 6 + cl.i) * 14 : 0) * (k < 1 ? 1 : 0), armB: 160, head: -10, lean: -10, blink: blinkAt(T, cl.i), o: seg(t, 0.4, 0.45) * (1 - seg(t, 1.9, 1.96)) });
      });
      pushers.forEach((pu) => {
        const k = es(t, 0.2 + pu.i * 0.07, 0.55 + pu.i * 0.07);
        const x0 = GX + 70 + pu.i * 56;
        const inside = es(t, 1.05 + pu.i * 0.12, 1.4 + pu.i * 0.2);
        const x = lerp(lerp(1500 + pu.i * 60, x0, k), GX - 10 + pu.i * 10, inside);
        const beat = T ? Math.max(0, Math.sin(T * 7 + pu.i * 2)) : 0.5;
        pu.p.set({ x, y: g(x) + 8 + pu.i * 6, s: 0.86 * (1 - inside * 0.2), flip: true, walk: (k > 0 && k < 1) || (inside > 0 && inside < 1) ? x * 0.06 : undefined, armF: 80 + beat * 40 * (1 - inside), armB: 120, lean: -14 * (1 - inside), head: -6, blink: blinkAt(T, pu.i + 3), o: 1 - seg(inside, 0.9, 1) });
      });

      /* v12b — the doors burst open; light floods out */
      const burst = es(t, 1.0, 1.15, ease.out);
      pose(doorL, { x: GX - 80, y: GYT, sx: 1 - burst * 0.85 });
      pose(doorR, { x: GX + 80, y: GYT, sx: 1 - burst * 0.85 });
      pose(light, { x: GX, y: GYT, o: 0.3 + burst * 0.7 });
      pose(shine, { x: GX, y: GYT - 110, s: 0.5 + burst * 0.8, o: 0.3 + burst * 0.7 });
      sk2.fade(burst * 0.8);

      /* v13 — the prophets and the Law until John: a flame handed up the hill */
      const [jhx] = [JX];
      pro.forEach((pp) => {
        const has = es(t, 2.1 + pp.i * 0.12, 2.2 + pp.i * 0.12) * (1 - es(t, 2.2 + pp.i * 0.12, 2.3 + pp.i * 0.12));
        pp.p.set({ x: pp.x, y: pp.y, s: 0.82, armF: 30 + has * 60 + (pp.i === 0 ? 20 : 0), armB: pp.i === 0 ? 40 : 20, head: -6, blink: blinkAt(T, pp.i + 5) });
      });
      const give = es(t, 2.6, 2.7);
      john.set({ x: JX, y: g(JX) + 4, s: 0.9, flip: t > 2 && t < 2.8, armF: 20 + push * 70 * (1 - es(t, 1.9, 2.0)) + give * 60, armB: 20 + bump(t, 2.72, 2.95) * 110, head: -4, blink: blinkAt(T, 1) });
      // the flame's path: Moses' tablets → each hand → John
      const pts = pro.map((pp) => hand(pp.x, pp.y, 0.82, false, 80)).concat([hand(JX, g(JX) + 4, 0.9, true, 80)]);
      const u = seg(t, 2.02, 2.72) * (pts.length - 1);
      const k = Math.min(pts.length - 2, Math.floor(u)), f = u - k;
      const fx = lerp(pts[k][0], pts[k + 1][0], f), fy = lerp(pts[k][1], pts[k + 1][1], f) - Math.sin(f * PI) * 40;
      const fk = es(t, 2.0, 2.06);
      pose(flame, { x: fx, y: fy - 10, s: fk * (1 + es(t, 2.72, 2.9) * 0.6), o: fk });

      /* camera: the gate, then down the hill to the prophets */
      S.cam.x = kf(t, [[0, PH ? 480 : 330], [1.9, PH ? 480 : 330], [2.1, -380], [2.55, -80], [2.8, 60]]);
      S.cam.z = kf(t, [[0, 1.26], [1.0, 1.26], [1.3, 1.16], [2.0, 1.16], [2.1, 1.22], [2.8, 1.16]]);
      S.cam.y = kf(t, [[0, 0], [1.9, 0], [2.1, 30]]);
    };
  },
};
