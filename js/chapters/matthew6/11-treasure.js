// Mt 6,19–21 — a rich man's storeroom, cut open, at dusk: his iron-bound chest of coins, a fine purple robe on its
// peg, a bronze pot. "Where moth and rust consume": moths flutter in and the robe is eaten full of holes, rust creeps
// over the iron bands and the pot; "where thieves break through and steal": a thief digs through the mud-brick wall
// and drags the chest out through the hole. Above, among the clouds, heaven's treasury stands open in the light: the
// quiet man's gold stars (the rewards of his secret giving, praying and fasting) rise into it, and a moth that flies up
// after them turns back. "Where your treasure is, there your heart will be also": a heart rises from him up to it.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { GOLDEN, HEAVEN, QUIET, casket, coin, heart, rewardStar, fatherLight, rayBurst, headAt, handAt, tr, PI } from './lib.js';

const GY = 706;
const RX0 = 470, RX1 = 1050, RT = 440;     // the storeroom
const CHX = 800;                            // the chest
const HX = 800, HY = 250;                   // heaven's treasury
const RUST = mix(C.clay, C.soil, 0.35);

function chest(c) {
  const s = sheet();
  s.p(c.cut([[-70, 0], [-70, -70], [70, -70], [70, 0]], 0.4, 6), C.wood);
  s.p(c.cut([[-74, -70], [-70, -96], ...c.arc(0, -96, 70, 16, PI, 2 * PI, 12), [70, -96], [74, -70]], 0.4, 6), shade(C.wood, -0.06));
  const iron = mix(C.rock3, C.storm, 0.3);
  s.p(c.cut(c.rect(-54, -112, 12, 112), 0.2, 5) + c.cut(c.rect(42, -112, 12, 112), 0.2, 5) + c.cut(c.rect(-72, -74, 144, 8), 0.2, 6), iron);
  s.p(c.cut(c.rect(-10, -80, 20, 22), 0.2, 4), iron);
  let coins = '';
  for (let i = 0; i < 9; i++) coins += c.cut(c.circ(c.rr(-56, 56), -104 - c.rr(0, 16), c.rr(6, 8), 10), 0.2, 3);
  return `<path d="${coins}" fill="${C.sun}"/>` + s.out();
}
function robeOnPeg(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-6, -8, 12, 12), 0.2, 3), C.wood2);
  s.p(c.cut([[-40, 6], [40, 6], [52, 30], [44, 170], [-44, 170], [-52, 30]], 0.8, 7), C.plumRobe);
  s.x(c.ribbon([[-30, 20], [-34, 160]], 3) + c.ribbon([[20, 20], [26, 160]], 3), shade(C.plumRobe, -0.2), 'opacity=".5"');
  s.p(c.ribbon([[-44, 150], [44, 150]], 8), C.sun);
  return s.out();
}
function moth(c) {
  const col = mix(C.wood3, C.stone2, 0.4);
  const wing = `<path d="${c.cut([[0, 0], [-10, -12], [-16, -4], [-10, 6]], 0.2, 3)}" fill="${col}"/>`;
  return `<g><g class="wingB">${wing}</g><path d="${c.cut(c.ell(0, 0, 7, 2.6, 8), 0.2, 2)}" fill="${shade(col, -0.3)}"/><g class="wingF" transform="scale(-1 1)">${wing}</g></g>`;
}
function bronzePot(c) {
  const col = mix(C.ochre, C.clay, 0.3);
  return sheet().p(c.cut([[-30, 0], [-38, -24], [-30, -46], [-20, -52], [20, -52], [30, -46], [38, -24], [30, 0]], 0.4, 5), col).p(c.cut(c.rect(-24, -58, 48, 8), 0.2, 4), shade(col, -0.2)).out();
}

export default {
  id: 'mt6-treasure',
  enter: 'fly',
  beats: [
    { v: 19 },
    { v: 20 },
    { v: 21 },
  ],
  cam: { x: [-30, 30], y: [-160, 60], z: [0.94, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, GOLDEN);
    const gold = sky(S, HEAVEN, { name: 'gold', rise: 0 }).layer;
    gold.fade(0);
    const raysL = S.layer({ par: 0.05, sh: 1, flat: true, rise: 0 });
    raysL.add(`<g transform="translate(${HX} ${HY})">${rayBurst(c, { n: 26, r0: 60, r1: 1000, spread: 0.03, color: '#fff3cf', o: 0.5 })}</g>`);
    raysL.fade(0);

    /* heaven's treasury among the clouds */
    const heavenL = S.layer({ par: 0.1, sh: 3, rise: 0 });
    heavenL.fade(0);
    const light = heavenL.add(`<g>${fatherLight(c, 40)}</g>`);
    heavenL.add(`<g transform="translate(${HX - 190} ${HY + 90})">${cloud(c, 260, C.cream, '#eadcc0')}</g><g transform="translate(${HX + 200} ${HY + 96})">${cloud(c, 240, C.cream, '#eadcc0')}</g>`);
    const K = casket(c, { w: 110, h: 60, col: C.sun });
    const hChest = heavenL.add(`<g><circle cy="-30" r="110" fill="url(#halo-glow)"/>${K.base}<g transform="translate(-55 -60) rotate(-60)">${K.lid}</g></g>`);
    heavenL.add(`<g transform="translate(${HX} ${HY + 108})">${cloud(c, 300, C.cream, '#eadcc0')}</g>`);

    /* the land and the storeroom */
    S.layer({ par: 0.2, sh: 2 }).add(band(c, { y: 520, amps: [14, 6, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.dusk, 0.2) }).markup);
    const yard = S.layer({ par: 0.4, sh: 3 });
    yard.add(sheet().p(c.cut([[-1100, GY - 16], [2700, GY - 16], [2700, 1900], [-1100, 1900]], 0.5, 20), mix(C.sand, C.stone, 0.4)).out());
    const room = S.layer({ par: 0.4, sh: 4 });
    const wall = mix(C.plaster2, C.clay, 0.2);
    const rs = sheet();
    rs.p(c.cut([[RX0, RT], [RX1, RT], [RX1, GY - 16], [RX0, GY - 16]], 0.5, 10), wall);
    let bricks = '';
    for (let y = RT + 10; y < GY - 30; y += 28) for (let x = RX0 + ((y / 28) % 2 ? 24 : 4); x < RX1 - 40; x += 58) bricks += c.cut(c.rect(x, y, 50, 22), 0.4, 6);
    rs.x(bricks, shade(wall, -0.08), 'opacity=".6"');
    rs.p(c.cut([[RX0 - 20, RT - 24], [RX1 + 20, RT - 24], [RX1 + 20, RT], [RX0 - 20, RT]], 0.4, 10), C.roof);
    rs.p(c.cut(c.rect(RX0 + 40, RT + 120, 130, 8), 0.3, 5), C.wood);
    room.add(rs.out());
    const hole = room.add(`<g><path d="${c.cut(c.blob(0, 0, 70, 58, 14, 0.2), 1.6, 6)}" fill="${mix(C.soilDark, C.night, 0.4)}"/></g>`);
    const robe = room.add(`<g>${robeOnPeg(c)}</g>`);
    const HOLES = Array.from({ length: 7 }, (_, i) => ({ i, x: 902 + c.rr(-34, 34), y: 500 + c.rr(10, 140), r: c.rr(5, 9), el: room.add(`<path d="${c.cut(c.blob(0, 0, 1, 0.8, 8, 0.3), 0.1, 2)}" fill="${wall}"/>`) }));
    const potEl = room.add(`<g transform="translate(${RX0 + 105} ${RT + 120})">${bronzePot(c)}</g>`);
    const PRUST = Array.from({ length: 5 }, (_, i) => ({ i, x: RX0 + 105 + c.rr(-24, 24), y: RT + 120 - c.rr(8, 44), el: room.add(`<path d="${c.cut(c.blob(0, 0, 9, 7, 9, 0.4), 0.5, 3)}" fill="${RUST}"/>`) }));
    const chestEl = room.add(`<g>${chest(c)}</g>`);
    const CRUST = [[-48, -60], [48, -40], [-48, -20], [0, -70], [48, -90], [-20, -72]].map(([x, y], i) => ({ i, x, y, el: room.add(`<path d="${c.cut(c.blob(0, 0, 8, 6, 9, 0.4), 0.5, 3)}" fill="${RUST}"/>`) }));
    const MOTHS = [0, 1, 2].map((i) => ({ i, el: room.add(moth(c)) }));
    const brick = [0, 1, 2, 3].map(() => room.add(`<path d="${c.cut(c.rect(-12, -5, 24, 10), 0.3, 3)}" fill="${shade(wall, -0.1)}"/>`));

    /* the rich man, the thief, the quiet man */
    const act = S.layer({ par: 0.4, sh: 5 });
    const rich = S.puppet(act.add(person(c, { robe: C.plumRobe, mantle: C.ochre, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full', belt: C.sun })));
    const thief = S.puppet(act.add(person(c, { robe: mix(C.night, C.storm, 0.4), mantle: null, skin: C.skin3, hair: C.hair3, hairStyle: 'wrap', veil: mix(C.night, C.storm, 0.2), beard: 'none', belt: C.rope })));
    const quiet = S.puppet(act.add(person(c, QUIET)));
    const STARS = [0, 1, 2].map((i) => ({ i, el: act.add(`<g>${rewardStar(c, 13)}</g>`) }));
    const up = act.add(moth(c));
    const heartEl = act.add(`<g>${heart(c, 18)}</g>`);
    // the front of the storeroom (walls left & right of the cutaway)
    const edge = S.layer({ par: 0.4, sh: 6 });
    edge.add(sheet().p(c.cut([[RX0 - 30, RT - 30], [RX0, RT - 30], [RX0, GY - 10], [RX0 - 30, GY - 10]], 0.4, 8) + c.cut([[RX1, RT - 30], [RX1 + 34, RT - 30], [RX1 + 34, GY - 10], [RX1, GY - 10]], 0.4, 8), mix(C.plaster, C.clay, 0.12)).p(c.cut([[RX0 - 40, GY - 18], [RX1 + 40, GY - 18], [RX1 + 40, GY - 4], [RX0 - 40, GY - 4]], 0.4, 10), C.stone2).out());

    return (t, time) => {
      const T = time;
      /* v19 — moth, rust, thief */
      rich.set({ x: 640, y: GY - 10, s: 1.0, armF: 30 + bump(t, 0.05, 0.3) * 40, armB: 10, head: -bump(t, 0.05, 0.3) * 6 + es(t, 0.5, 0.7) * 10, blink: blinkAt(T, 1), o: 1 - es(t, 1.0, 1.15) });
      pose(robe, { x: 900, y: 490 });
      MOTHS.forEach((m) => {
        const k = es(t, 0.02 + m.i * 0.04, 0.3 + m.i * 0.04);
        const a = T * 3 + m.i * 2;
        pose(m.el, { x: lerp(1200 + m.i * 60, 900 + Math.cos(a) * 50, k), y: lerp(380, 540 + m.i * 40 + Math.sin(a) * 30, k), s: 1.7, o: (k > 0 ? 1 : 0) * (1 - es(t, 0.95, 1.1)) });
        const f = T ? Math.sin(T * 14 + m.i) * 40 : 20;
        pose(m.el.querySelector('.wingF'), { sx: -1, r: f }); pose(m.el.querySelector('.wingB'), { r: -f });
      });
      HOLES.forEach((h) => { const k = es(t, 0.15 + h.i * 0.035, 0.3 + h.i * 0.035); pose(h.el, { x: h.x, y: h.y, s: h.r * k, o: k > 0.02 ? 1 : 0 }); });
      PRUST.forEach((r) => { const k = es(t, 0.3 + r.i * 0.03, 0.5 + r.i * 0.03); pose(r.el, { x: r.x, y: r.y, s: k, o: k > 0.02 ? 1 : 0 }); });
      const dig = es(t, 0.45, 0.62);
      pose(hole, { x: RX1 - 70, y: GY - 76, s: Math.max(0.01, dig), o: dig > 0.01 ? 1 : 0 });
      brick.forEach((b, i) => { const k = seg(t, 0.48 + i * 0.03, 0.66 + i * 0.03); pose(b, { x: RX1 - 90 + i * 14 - k * 30, y: GY - 90 + k * 70, r: k * 200, o: k > 0 && k < 1 ? 1 : 0 }); });
      const take = es(t, 0.64, 0.85);
      const cx = lerp(CHX, RX1 - 60, take);
      pose(chestEl, { x: cx, y: GY - 12, s: 1 - take * 0.2, o: 1 - es(t, 0.82, 0.9) });
      CRUST.forEach((r) => { const k = es(t, 0.3 + r.i * 0.03, 0.52 + r.i * 0.03); pose(r.el, { x: cx + r.x * (1 - take * 0.2), y: GY - 12 + r.y * (1 - take * 0.2), s: k * (1 - take * 0.2), o: k > 0.02 ? 1 - es(t, 0.82, 0.9) : 0 }); });
      const dg = T ? Math.sin(T * 8) : 0;
      thief.set({ x: RX1 + 70, y: GY - 6, s: 0.96, flip: true, armF: 70 + (dig < 1 ? dg * 20 : 0) + take * 20, armB: 60 + (dig < 1 ? -dg * 20 : 0), lean: -10 * (1 - take) + take * 8, head: 6, o: seg(t, 0.4, 0.45) * (1 - es(t, 0.9, 1.0)) });

      /* v20 — heaven's treasury; his stars rise into it; a moth turns back */
      const hk = es(t, 1.02, 1.4);
      gold.fade(hk * 0.8);
      heavenL.fade(es(t, 0.98, 1.25));
      raysL.fade(hk);
      pose(light, { x: HX, y: HY - 40, s: 0.7 + hk * 0.3, o: hk });
      pose(hChest, { x: HX, y: HY + 90 });
      quiet.set({ x: 360, y: GY + 10, s: 1.0, armF: 20 + es(t, 1.2, 1.4) * 60, armB: 10 + es(t, 1.2, 1.4) * 140, head: -es(t, 1.2, 1.5) * 30, blink: blinkAt(T, 2), o: seg(t, 1.0, 1.05) });
      const [qx, qy] = handAt(360, GY + 10, 1.0, false, 100);
      STARS.forEach((st) => {
        const k = es(t, 1.2 + st.i * 0.12, 1.65 + st.i * 0.12, ease.io);
        const x = lerp(qx + st.i * 16, HX - 20 + st.i * 20, k), y = lerp(qy - st.i * 20, HY + 60, k) - Math.sin(k * PI) * 80;
        pose(st.el, { x, y, s: 1 - k * 0.3, r: T * 30, o: k > 0 && k < 0.98 ? 1 : 0 });
      });
      const mk = seg(t, 1.3, 1.9);
      const mx = lerp(1150, 900, Math.min(1, mk * 1.6)) + (mk > 0.62 ? (mk - 0.62) * 900 : 0), my = lerp(560, 400, Math.min(1, mk * 1.6)) + (mk > 0.62 ? (mk - 0.62) * 400 : 0);
      pose(up, { x: mx, y: my, s: 1.6, o: mk > 0 && mk < 1 ? 1 : 0, sx: mk > 0.62 ? -1 : 1 });
      const f = T ? Math.sin(T * 14) * 40 : 20;
      pose(up.querySelector('.wingF'), { sx: -1, r: f }); pose(up.querySelector('.wingB'), { r: -f });

      /* v21 — his heart goes where his treasure is */
      const hr = es(t, 2.1, 2.6, ease.io);
      const [hx0, hy0] = headAt(360, GY + 10, 1.0, false);
      pose(heartEl, { x: lerp(hx0 + 4, HX, hr), y: lerp(hy0 + 60, HY + 30, hr) - Math.sin(hr * PI) * 60, s: 0.8 + hr * 0.4 + (T ? Math.sin(T * 3) * 0.05 : 0), o: seg(t, 2.02, 2.1) });

      S.cam.z = 1.12 - es(t, 0.95, 1.4) * 0.16;
      S.cam.y = 40 - es(t, 0.95, 1.4) * 170;
      S.cam.x = 10 - es(t, 0.95, 1.4) * 20;
    };
  },
};
