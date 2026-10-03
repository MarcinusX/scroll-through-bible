// Łk 19,12–13 — the parable comes down as a painted flat: a nobleman's house on the shore of his own land, the road
// running down to the harbour, and far across the sea, on the horizon, a gleaming palace — the far country, where a
// kingdom is given. He comes out of his gate in a travelling mantle, staff in hand, and looks across: a little golden
// crown shimmers over that far palace, and a path of dots runs out to it — and back again. First he calls ten of his
// servants: they line up before him and, one by one, a silver mina flies from his hand into each open palm. "Engage
// in business with these until I come": he lifts his hand, the servants turn away to their work, and he walks off
// down the road to the ship.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, cloud, sun, palm, olive, cypress, grass } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { NOBLE, SERV, SEA, still, mina, crown, staff, say, storyFrame, walledCityM, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix, shade, sheet, STRING } from './lib.js';

const FL = 716, NX = 500;
const ROW0 = Array.from({ length: 10 }, (_, i) => 640 + i * 66);
const FAR0 = [1170, 452];

export default {
  id: 'lk19-nobleman',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 12 },
    { v: 13, text: 'Przywołał więc dziesięciu sług swoich, dał im dziesięć min' },
    { v: 13, cont: true, text: 'i rzekł do nich: "Zarabiajcie nimi, aż wrócę".' },
  ],
  cam: { x: [-40, 120], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the far country and the ten servants inside the narrow screen
    const ROW = S.portrait ? Array.from({ length: 10 }, (_, i) => 590 + i * 50) : ROW0;
    const FAR = S.portrait ? [1020, 452] : FAR0;
    sky(S, SEA, { rise: 0 });
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 36), { x: 1180, y: 150, len: 800 });
    const cls = [[520, 140, 170], [860, 100, 120]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    /* the far country across the sea */
    const farL = S.layer({ par: 0.08, sh: 2 });
    farL.add(band(c, { y: 456, amps: [8, 4, 2], lens: [700, 260, 100], color: mix(C.hillFar, C.lavender, 0.3), x0: S.portrait ? 880 : 1000, x1: 2600 }).markup);
    const glowL = S.layer({ par: 0.08, sh: 0, flat: true });
    const farGlow = glowL.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const palL = S.layer({ par: 0.08, sh: 2 });
    palL.add(`<g transform="translate(${FAR[0]} ${FAR[1] + 4})">${walledCityM(c, 0, 0, 0.55, { wall: mix(C.cream, C.stone, 0.2), wall2: mix(C.stone, C.lavender, 0.3), temple: C.halo })}</g>`);
    const farCrown = palL.add(`<g><path d="M0 -1800V-30" stroke="${STRING}" stroke-width="1.2"/><g transform="scale(1.3)">${crown(c)}</g></g>`);
    const seaL = S.layer({ par: 0.14, sh: 2 });
    seaL.add(waterBand(c, { y: 470, color: C.lake2, amp: 2, len: 160, foamN: 20 }).markup);
    const Bt = boat(c, { mast: true });
    const ship = seaL.add(`<g>${Bt.back}${Bt.front}</g>`);
    // dots of the journey there and back
    const PATH_OUT = [], PATH_BACK = [];
    for (let i = 0; i <= 14; i++) { const u = i / 14; PATH_OUT.push([lerp(NX + 90, FAR[0] - 30, u), lerp(610, FAR[1] + 6, u) - Math.sin(u * PI) * 70]); PATH_BACK.push([lerp(FAR[0] - 30, NX + 90, u), lerp(FAR[1] + 6, 610, u) + Math.sin(u * PI) * 40]); }
    const dotL = S.layer({ par: 0.2, sh: 2 });
    const dots = [...PATH_OUT.map((p, i) => ({ p, i, back: 0 })), ...PATH_BACK.map((p, i) => ({ p, i, back: 1 }))].map((d) => ({ ...d, el: dotL.add(`<g><path d="${c.cut(c.circ(0, 0, d.back ? 4.5 : 5.5, 8), 0.2, 3)}" fill="${d.back ? C.sun : C.terracotta}"/></g>`) }));
    /* his own land: hills, the shore road, his house on the left */
    const landL = S.layer({ par: 0.2, sh: 3 });
    const lfn = (x) => 540 + Math.sin(x / 140) * 6 + Math.max(0, x - 640) * 0.45;
    landL.add(sheet().p(c.ridge(lfn, -900, 1300, 1700, 12, 1), mix(C.hillMid, C.sage2, 0.4)).out() + olive(c, 470, 556, 0.6) + cypress(c, 580, 552, 90));
    const groundL = S.layer({ par: 0.36, sh: 3 });
    const g = sheet().p(c.ridge(c.wave(FL - 30, [4, 2], [600, 200]), -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.35));
    g.p(c.ribbon([[NX + 40, FL + 40], [900, FL + 10], [1300, FL - 20], [1700, FL - 30]], 60), mix(C.sand2, C.stone, 0.3));
    groundL.add(g.out() + grass(c, { x0: -600, x1: 2200, y: FL + 70, n: 30, h: 12, color: C.olive }));
    const houseL = S.layer({ par: 0.36, sh: 4 });
    houseL.add(nobleHouse(c, 300, FL - 26) + palm(c, 120, FL - 20, 230));

    /* the nobleman, the ten servants */
    const act = S.layer({ par: 0.4, sh: 5 });
    const noble = S.puppet(act.add(person(c, { ...NOBLE, mantle: mix(C.indigo, C.plumRobe, 0.45), holdB: `<g transform="translate(0 -6)">${staff(c)}</g>` })));
    const main = [0, 1, 2].map((i) => S.puppet(act.add(person(c, SERV[i]))));
    const rest = act.sprite(still(c, [3, 4, 5, 6, 7, 8, 9].map((k, j) => ({ x: ROW[3 + j] - ROW[6], y: (j % 2) * 6, s: 0.86, flip: true, armF: 70, o: SERV[k] }))), ROW[6], FL + 8);
    const coins = ROW.map(() => act.add(`<g>${mina(c, 10)}</g>`));
    const fx = S.layer({ par: 0.4, sh: 6 });
    const bub = fx.add(`<g>${say(c, tr(['Zarabiajcie nimi,', 'aż wrócę!'], ['Engage in business', 'until I come!']), { size: 20, side: 1 })}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1180, 150, T, 1, 0.6);
      cls.forEach((k) => swing(k.el, k.x + (T ? Math.sin(T * 0.1 + k.i) * 16 : 0), k.y, T, 1.1, 0.6, k.i));
      pose(ship, { x: 900 - es(t, 2.5, 3.0) * 40, y: 486 + (T ? Math.sin(T * 1.2) * 2 : 0), s: 0.5, r: T ? Math.sin(T * 0.9) * 1.5 : 0 });

      /* v12 — a nobleman goes to a far country, to receive a kingdom, and to return */
      const out = es(t, -0.2, 0.35);
      const leave = 0;
      const nx = lerp(NX - 120, NX, out) + leave * 520;
      const give = t > 1.05 && t < 1.95;
      const gi = Math.min(9, Math.max(0, Math.floor((t - 1.1) / 0.075)));
      const lift = es(t, 2.05, 2.2);
      noble.set({ x: nx, y: lerp(FL - 6, FL + 10 - leave * 30, leave), s: 1.0 - leave * 0.18, flip: false, walk: (out > 0 && out < 1) || (leave > 0 && leave < 1) ? nx * 0.05 : undefined, armF: 14 + es(t, 0.35, 0.5) * (1 - es(t, 0.95, 1.05)) * 70 + (give ? 50 + Math.sin((t - 1.1) * PI / 0.075) * 10 : 0) + lift * 90, armB: 20, head: -es(t, 0.35, 0.5) * 6 * (1 - es(t, 0.95, 1.05)), blink: blinkAt(T) });
      const glow = es(t, 0.3, 0.6);
      pose(farGlow, { x: FAR[0], y: FAR[1] - 30, s: 0.7 + glow * 0.4, o: 0.2 + glow * 0.7 });
      const ck = es(t, 0.4, 0.7, ease.back);
      pose(farCrown, { x: FAR[0], y: lerp(-1200, FAR[1] - 84, ck) + (T ? Math.sin(T * 0.8) * 3 : 0), r: T ? Math.sin(T * 0.7) * 2 : 0, o: ck > 0.001 ? 1 : 0 });
      dots.forEach((d) => {
        const a = d.back ? 0.66 + d.i * 0.018 : 0.35 + d.i * 0.018;
        const k = es(t, a, a + 0.06) * (1 - es(t, 1.0, 1.1));
        pose(d.el, { x: d.p[0], y: d.p[1], s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v13a — ten servants, ten minas */
      const [hx, hy] = hand(nx, FL - 6, 1.0, false, 60);
      ROW.forEach((x, i) => {
        const a = 1.1 + i * 0.075;
        const k = es(t, a, a + 0.12);
        const y = FL + 8 + (i >= 3 ? ((i - 3) % 2) * 6 : 0);
        const [sx, sy] = hand(x, y, 0.86, true, 70);
        const gone = es(t, 2.4, 3.0);
        pose(coins[i], { x: lerp(hx, sx, k) + (i < 3 ? 0 : gone * 420), y: lerp(hy, sy - 10, k) - Math.sin(k * PI) * 50, s: 1, o: k > 0.01 && t > a && (i >= 3 || gone < 0.05) ? 1 : 0 });
      });
      rest.set({ x: ROW[6] + es(t, 2.4, 3.0) * 420, y: FL + 8, o: seg(t, 0.9, 1.05) });
      main.forEach((p, i) => {
        const inK = es(t, 0.9 + i * 0.03, 1.05 + i * 0.03);
        const go = es(t, 2.4, 3.0);
        const x = ROW[i] + (1 - inK) * 200 + go * (i === 0 ? 420 : i === 1 ? 420 : 420);
        p.set({ x, y: FL + 8, s: 0.86, flip: go < 0.02, o: inK, walk: go > 0 && go < 1 ? x * 0.06 : undefined, armF: 70 * (1 - go) + 10, head: 4, blink: blinkAt(T, i + 3) });
      });

      /* v13b — "Engage in business until I come" */
      const [bhx, bhy] = headAt(nx, FL - 6, 1.0, false);
      const bk = es(t, 2.05, 2.2, ease.back) * (1 - es(t, 2.92, 3.0));
      pose(bub, { x: bhx + 12, y: bhy - 30, s: bk, o: bk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 40], [0.4, 80], [1.0, 60], [2.4, 40], [2.9, 90]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 0], [1.0, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.5, 1.04], [1.0, 1.1]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -200], [0.95, -160], [1.2, -75], [1.9, -75], [2.2, -120]]); S.cam.z = 1.0; }
    };
  },
};
/** the nobleman's house: a white front with a gateway and a stair (origin: its foot, left edge) */
function nobleHouse(c, x, y) {
  const s = sheet();
  const wall = mix(C.plaster, C.parchment, 0.4);
  s.p(c.cut([[x - 240, y], [x - 240, y - 250], [x + 150, y - 250], [x + 150, y]], 0.6, 12), wall);
  s.p(c.cut([[x - 252, y - 262], [x + 162, y - 262], [x + 162, y - 246], [x - 252, y - 246]], 0.4, 10), C.roof);
  s.p(c.cut([[x + 20, y + 2], [x + 20, y - 110], ...c.arc(x + 60, y - 110, 40, 40, PI, 2 * PI, 12), [x + 100, y - 110], [x + 100, y + 2]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
  s.p(c.ribbon([[x + 12, y], [x + 12, y - 110]], 10) + c.ribbon([[x + 108, y], [x + 108, y - 110]], 10) + c.ribbon(c.arc(x + 60, y - 110, 48, 48, PI, 2 * PI, 14), 10), C.stone2);
  [x - 180, x - 90].forEach((wx) => { s.p(c.cut(c.rect(wx - 20, y - 200, 40, 56), 0.3, 5), mix(C.soilDark, C.wood2, 0.3)); s.p(c.cut(c.rect(wx - 26, y - 206, 12, 66), 0.3, 4) + c.cut(c.rect(wx + 14, y - 206, 12, 66), 0.3, 4), C.teal2); });
  s.p(c.cut(c.rect(x - 250, y - 8, 420, 14), 0.4, 10), C.stone);
  return s.out();
}
