// Mt 16,18 — "You are Peter [that is, Rock]": Peter rises, the tag with his old name turns over to PETER, and a great
// rock heaves up out of the ground behind him, ROCK carved in its face. "On this rock I will build my Church": Jesus
// lifts His hand and the Church is laid on the rock stone by stone — three foundation blocks, the aisles, the nave with
// its door, the roof, the golden dome and its cross — its windows light up and little people gather at its door.
// "The gates of Hades will not prevail against it": the day darkens, the iron gates in the grotto of the old shrine
// swing open on a red glow, dark surges lunge out at the Church — and break into splinters on the light round it,
// falling away; the gates bang shut and the day comes back.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { headAt, nameTag, greatRock, churchParts, gateLeaf, darkSurge, shard, dust, mob, glowDisc, caesareaSet, caesareaFront, CZ, DIS16, tr, PI } from './lib.js';

const GY = CZ.GROUND, JX = 740, PX = 890;
const RX = 840, RY = 650, RW = 450, RH = 250;         // the great rock: base centre; its flat top is at RY - RH
const CS = 0.8, CY = RY - RH + 6;                     // the Church: scale, foundation line
const GW = 150, GH = 150;                             // the grotto's opening
// dark surges: from the grotto to a point on the Church's light
const SURGE = [[1120, 540, 985, 300], [1150, 560, 1035, 420], [1110, 520, 940, 215], [1160, 570, 1060, 505], [1135, 530, 1005, 350]];

export default {
  id: 'mt16-rock',
  beats: [
    { v: 18, text: 'Otóż i Ja tobie powiadam: Ty jesteś Piotr [czyli Skała],' },
    { v: 18, cont: true, text: 'i na tej Skale zbuduję Kościół mój,' },
    { v: 18, cont: true, text: 'a bramy piekielne go nie przemogą.' },
  ],
  cam: { x: [-20, 40], y: [-90, 50], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    const P = {};
    const Z = caesareaSet(S, {
      between(S2) {
        // the gates of Hades in the grotto
        P.gateL = S2.layer({ par: 0.26, sh: 3 });
        S2.defs(`<radialGradient id="${S2.id('pit')}"><stop offset="0" stop-color="${C.terracotta}" stop-opacity=".85"/><stop offset=".6" stop-color="${C.sunRay}" stop-opacity=".35"/><stop offset="1" stop-color="${C.sunRay}" stop-opacity="0"/></radialGradient>`);
        P.pit = P.gateL.add(`<circle r="90" fill="url(#${S2.id('pit')})"/>`);
        P.leafL = P.gateL.add(`<g>${gateLeaf(c, -1, { gw: GW, gh: GH })}</g>`);
        P.leafR = P.gateL.add(`<g>${gateLeaf(c, 1, { gw: GW, gh: GH })}</g>`);
        // gloom over the land (not over the rock, the Church and the people)
        P.gloom = S2.layer({ par: 0, sh: 1, flat: true, rise: 0 });
        P.gloom.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".55"/>`);
        P.gloom.fade(0);
        // the rock and the Church
        P.rockL = S2.layer({ par: 0.36, sh: 5 });
        P.cGlow = P.rockL.add(`<g>${glowDisc(300, 'warm-glow', 1)}</g>`);
        P.rock = P.rockL.add(`<g>${greatRock(c, tr('Skała', 'Rock'), { w: RW, h: RH })}</g>`);
        const ch = churchParts(c);
        P.parts = ch.parts.map((m) => P.rockL.add(`<g>${m}</g>`));
        P.lit = P.rockL.add(`<g>${ch.glow}</g>`);
        P.folkL = P.rockL.sprite(mob(makeCutter('mt16-church-folk'), 5, { s: 0.3, spread: 22, rows: 1, flip: true }), 800, 500);
        P.folkR = P.rockL.sprite(mob(makeCutter('mt16-church-folk2'), 5, { s: 0.3, spread: 22, rows: 1 }), 800, 500);
        P.dustL = [0, 1, 2, 3].map(() => P.rockL.add(`<g>${dust(c, 40, C.sand2)}</g>`));
        // the surges and their splinters, in front of the Church
        P.surgeL = S2.layer({ par: 0.36, sh: 4 });
        P.shield = P.surgeL.add(`<g><circle r="210" fill="url(#halo-glow)" opacity=".5"/><circle r="206" fill="none" stroke="${C.halo}" stroke-width="7" opacity=".9"/><circle r="196" fill="none" stroke="#fff8e2" stroke-width="3"/></g>`);
        P.surges = SURGE.map(([x0, y0, x1, y1], i) => {
          const len = Math.hypot(x1 - x0, y1 - y0);
          return { i, x0, y0, x1, y1, len, a: (Math.atan2(y1 - y0, x1 - x0) * 180) / PI + 180, el: P.surgeL.add(`<g>${darkSurge(c, len, 64)}</g>`), flash: P.surgeL.add(`<g><circle r="46" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 30, 9, 8, 0.2))}" fill="#fff8e2"/></g>`), shards: [0, 1, 2, 3, 4, 5].map(() => P.surgeL.add(`<g>${shard(c, 16)}</g>`)) };
        });
      },
    });

    /* ---------- people ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS16.filter((d) => d.k !== 'peter').map((d, i) => ({ ...d, x: d.x < 800 ? d.x - 30 : d.x + 60, i, p: S.puppet(L.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const peterK = S.puppet(L.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const peter = S.puppet(L.add(person(c, { ...CAST.peter })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const tagOld = fx.add(`<g><path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, [tr('Szymon,', 'Simon,'), tr('syn Jony', 'Bar Jonah')], { size: 20 })}</g>`);
    const tagNew = fx.add(`<g><path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, [tr('Piotr', 'Peter'), tr('[czyli Skała]', '(Rock)')], { size: 22 })}</g>`);
    caesareaFront(S);

    return (t, time) => {
      const T = time;
      Z.update(T, { gold: 0.25 * (1 - es(t, 0, 0.5)) });

      /* v18a — Peter rises; his name turns over; the rock heaves up behind him */
      const rise = es(t, 0.06, 0.12);
      peterK.set({ x: PX - 18, y: GY + 6, s: 0.9, flip: true, o: 1 - rise, armF: 70, armB: 30, head: 4, blink: blinkAt(T, 1) });
      const awe = es(t, 0.5, 0.8);
      const turnUp = es(t, 1.05, 1.3);
      const fear = bump(t, 2.1, 2.6);
      peter.set({ x: PX, y: GY + 6, s: 0.92, flip: true, o: rise, armF: 20 + awe * 30 + fear * 40, armB: 10 + awe * 20 + turnUp * 60 + fear * 30, head: -awe * 6 - turnUp * 16, lean: fear * 5, blink: blinkAt(T, 1) });
      const flip = es(t, 0.2, 0.36);
      const [phx, phy] = headAt(PX, GY + 6, 0.92, true);
      const tagY = lerp(phy - 190, 150, es(t, 1.0, 1.3));
      const tagUp = es(t, 1.0, 1.3);
      pose(tagOld, { x: PX + 4, y: tagY, sx: Math.max(0.001, 1 - flip * 2), r: T ? Math.sin(T * 1.3) * 1.5 : 0, o: flip < 0.5 && t < 1.2 ? 1 : 0 });
      pose(tagNew, { x: PX + 4, y: tagY - tagUp * 20, sx: Math.max(0.001, flip * 2 - 1), r: T ? Math.sin(T * 1.3) * 1.5 : 0, o: flip >= 0.5 ? 1 - tagUp : 0 });
      const rk = es(t, 0.3, 0.72, ease.out);
      pose(P.rock, { x: RX, y: RY + (1 - rk) * 300 + (rk > 0 && rk < 1 ? Math.sin(t * 90) * 2 : 0) });
      P.dustL.forEach((d, i) => {
        const k = seg(t, 0.36 + i * 0.04, 0.9 + i * 0.04);
        pose(d, { x: RX + (i - 1.5) * 130 + (i < 2 ? -1 : 1) * k * 40, y: RY - 20 - k * 30, s: 0.5 + k * 0.8, o: Math.sin(k * PI) * 0.9 });
      });

      /* v18b — the Church laid on the rock, stone by stone */
      const T0 = [1.05, 1.1, 1.15, 1.25, 1.3, 1.38, 1.48, 1.58];
      P.parts.forEach((p, i) => {
        const k = es(t, T0[i], T0[i] + 0.14, ease.back);
        pose(p, { x: RX, y: CY - (1 - k) * 420, s: CS, o: k > 0.01 ? 1 : 0 });
      });
      const lit = es(t, 1.68, 1.85);
      const shine = lit * (1 + bump(t, 2.3, 2.7) * 0.5);
      pose(P.lit, { x: RX, y: CY, s: CS, o: lit });
      pose(P.cGlow, { x: RX, y: CY - 130, s: 0.6 + shine * 0.5, o: Math.min(1, shine) });
      const folk = es(t, 1.72, 1.9);
      P.folkL.set({ x: RX - 62 - (1 - folk) * 40, y: CY, o: folk });
      P.folkR.set({ x: RX + 62 + (1 - folk) * 40, y: CY, o: folk });

      /* v18c — the gates of Hades open; their surges break on the light */
      const open = es(t, 2.04, 2.18) * (1 - es(t, 2.82, 2.96));
      const gloom = es(t, 2.02, 2.22) * (1 - es(t, 2.78, 2.98));
      P.gloom.fade(gloom);
      const gates = es(t, 1.9, 2.04);          // the iron gates appear in the grotto, then swing open
      pose(P.leafL, { x: CZ.GX - GW / 2, y: CZ.GY, sx: 1 - open * 0.85, o: gates });
      pose(P.leafR, { x: CZ.GX + GW / 2, y: CZ.GY, sx: 1 - open * 0.85, o: gates });
      pose(P.pit, { x: CZ.GX, y: CZ.GY - 50, s: 0.6 + open * 0.6, o: open });
      let flare = 0;
      P.surges.forEach((sg) => {
        const t0 = 2.12 + sg.i * 0.08;
        const reach = es(t, t0, t0 + 0.2, ease.in);
        const back = es(t, t0 + 0.24, t0 + 0.42);
        const k = reach * (1 - back);
        pose(sg.el, { x: sg.x0, y: sg.y0, r: sg.a, sx: 0.06 + k * 0.94, sy: 0.6 + k * 0.4, o: reach > 0.01 && back < 0.98 ? 1 : 0 });
        const fl = bump(t, t0 + 0.17, t0 + 0.36);
        flare = Math.max(flare, fl);
        pose(sg.flash, { x: sg.x1, y: sg.y1, s: 0.4 + fl * 0.8, r: t * 60, o: fl });
        sg.shards.forEach((sh, j) => {
          const f = seg(t, t0 + 0.2, t0 + 0.62);
          const a = ((sg.a + 180) * PI) / 180 + PI + (j - 2.5) * 0.55;
          pose(sh, { x: sg.x1 + Math.cos(a) * f * 110, y: sg.y1 + Math.sin(a) * f * 70 + f * f * 200, r: f * 320 * (j % 2 ? 1 : -1), s: 1 - f * 0.4, o: f > 0 && f < 1 ? 1 - f * 0.5 : 0 });
        });
      });
      pose(P.shield, { x: RX, y: CY - 120, s: 0.9 + flare * 0.12, o: Math.min(1, flare * 1.4) * gloom });

      /* Jesus: speaks to Peter, builds with a raised hand, stands firm against the dark */
      const speak = es(t, 0.05, 0.3);
      const build = es(t, 1.02, 1.2);
      const firm = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: 16 + speak * 50 - build * 20 + firm * 20, armB: 8 + build * 140, head: -build * 10, blink: blinkAt(T) });
      dis.forEach((d) => {
        const up = es(t, 1.1, 1.4);
        d.p.set({ x: d.x, y: GY + 4 + (d.i % 2) * 8, s: 0.86, flip: d.x > JX, armF: 18 + awe * 20 + fear * 50, armB: 10 + up * 40 + fear * 60, head: -up * 14 + fear * 6, lean: (d.x > JX ? 1 : -1) * fear * 4, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = es(t, 1.0, 1.4) * 30;
      S.cam.z = 1.08 - es(t, 1.0, 1.4) * 0.1;
      S.cam.y = 30 - es(t, 1.0, 1.4) * 110;
    };
  },
};
