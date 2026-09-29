// Mt 27,24–26 — the square, under a clouding sky. Pilate sees it is no use: the cries only grow, and he puts a
// hand to his brow. A servant brings a bronze basin and an ewer; before all the crowd Pilate holds out his hands
// and the water runs over them — "I am innocent of the blood of this righteous man" — then he shakes the drops
// off and turns his palms to them: "You see to it." The crowd answers with one cry, and a shadow passes over them.
// Then the barred door swings open and Barabbas walks free, his chains falling; and the soldiers take Jesus:
// a dark curtain is lowered over Him, and only the shadow of a column shows on it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, hand, headAt, bubble, cry, hanging, swing, squareSet, squareCast, PLAT, basin, ewer, drop, SKIES, tr, PI } from './lib.js';

const JX = 780;
const PX = 950;

export default {
  id: 'mt27-wash',
  beats: [
    { v: 24, text: 'Piłat widząc, że nic nie osiąga, a wzburzenie raczej wzrasta,' },
    { v: 24, cont: true, text: 'wziął wodę i umył ręce wobec tłumu, mówiąc: «Nie jestem winny krwi tego Sprawiedliwego.' },
    { v: 24, cont: true, text: 'To wasza rzecz».' },
    { v: 25 },
    { v: 26, text: 'Wówczas uwolnił im Barabasza,' },
    { v: 26, cont: true, text: 'a Jezusa kazał ubiczować i wydał na ukrzyżowanie.' },
  ],
  cam: { x: [-40, 170], y: [-60, 100], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const H = squareSet(S, { pal: SKIES.grey });
    const K = squareCast(S, H);
    const { CELL } = H;
    const P = H.charL;
    const bas = P.add(`<g>${basin(c, 70, 64)}</g>`);
    const servant = S.puppet(P.add(person(c, { robe: C.linen2, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin4, belt: C.terracotta, holdF: `<g transform="translate(0 4) rotate(-100)">${ewer(c, 46)}</g>` })));

    /* the curtain lowered over the platform, with a column's shadow on it */
    const curL = S.layer({ par: 0.32, sh: 6 });
    const CW = 430, CH = 300;
    const cs = sheet();
    const pts = [[-CW / 2, 0], [CW / 2, 0], [CW / 2, CH]];
    for (let x = CW / 2; x > -CW / 2; x -= 36) pts.push(...c.arc(x - 18, CH, 18, 12, 0, PI, 5));
    cs.p(c.cut(pts, 0.8, 8), mix(C.plumRobe, C.storm2, 0.55));
    let folds = '';
    for (let x = -CW / 2 + 30; x < CW / 2; x += 46) folds += c.ribbon([[x, 4], [x + c.rr(-4, 4), CH - 6]], c.rr(6, 12));
    cs.x(folds, shade(mix(C.plumRobe, C.storm2, 0.55), -0.25), 'opacity=".5"');
    cs.p(c.ribbon([[-CW / 2 - 8, 2], [CW / 2 + 8, 2]], 8), C.wood2);
    const colSh = `<path d="${c.poly([[-22, 30], [22, 30], [26, 44], [18, 44], [18, CH - 30], [26, CH - 24], [-26, CH - 24], [-18, CH - 30], [-18, 44], [-26, 44]])}" fill="#2a2030" opacity=".45"/>`;
    const curtainEl = hanging(curL, `${cs.out()}<g transform="translate(40 0)">${colSh}</g>`, { x: JX, y: -1500, len: 900 });

    const fx = H.fxL;
    const drops = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g>${drop(c, 3.4)}</g>`) }));
    const flick = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${drop(c, 3)}</g>`), dx: c.rr(-160, -40), dy: c.rr(-40, 60) }));
    const innocent = fx.add(`<g>${bubble(c, tr(['Nie jestem winny krwi', 'tego Sprawiedliwego'], ['I am innocent of the blood', 'of this righteous person']), { size: 18, dir: 1 })}</g>`);
    const yours = fx.add(`<g>${bubble(c, tr('To wasza rzecz!', 'You see to it!'), { size: 19, dir: 1 })}</g>`);
    const uproar = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${cry(c, tr('Na krzyż!', 'Crucify!'), { size: 16, dir: i % 2 ? 1 : -1 })}</g>`), m: [2, 8, 14, 20, 26, 5][i], seed: c.rr(0, 6) }));
    const oath = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${cry(c, i % 2 ? tr('…i na dzieci nasze!', '…and on our children!') : tr('Krew Jego na nas!', 'His blood be on us!'), { size: 18, dir: i % 2 ? 1 : -1 })}</g>`), m: [4, 11, 17, 23, 9][i] }));
    const chains = [0, 1].map(() => fx.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [8, 10], [18, 4], 8), 3)}" fill="${C.rock3}"/></g>`));
    const shadeL = S.layer({ par: 0.55, sh: 1, flat: true });
    const gid = S.id('shade');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2238" stop-opacity="0"/><stop offset=".25" stop-color="#2a2238" stop-opacity=".55"/><stop offset="1" stop-color="#2a2238" stop-opacity=".7"/></linearGradient>`);
    shadeL.add(`<rect x="-900" y="560" width="3400" height="1200" fill="url(#${gid})"/>`);

    return (t, time) => {
      const T = time;
      const gloom = es(t, 0, 1) * 0.3 + es(t, 3.0, 3.6) * 0.4 + es(t, 5.0, 5.8) * 0.3;
      H.sk.blend(SKIES.morning, SKIES.grey, 0.5 + gloom * 0.5);
      swing(H.sunEl, 1230, 180 + gloom * 60, T * 0.5, 1, 0.6);
      swing(H.cl1, 540 + Math.sin(T * 0.1) * 30, 170, T, 1.2, 0.6, 1);
      swing(H.cl2, 1140 + Math.sin(T * 0.12 + 2) * 30, 140, T, 1.2, 0.8, 2);
      shadeL.fade(es(t, 3.1, 3.6) * 0.45 * (1 - es(t, 4.0, 4.6) * 0.5));
      K.rebels.forEach((r) => r.set({ o: 0 }));

      /* v24a — no use: the uproar grows */
      const roar = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.3) * 0.7);
      const oathK = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.3) * 0.7);
      const part = es(t, 4.2, 4.55);
      K.people.forEach((m) => {
        const up = m.shout ? Math.min(1, roar + oathK) : (roar + oathK) * 0.3;
        const near = Math.abs(m.x - (CELL.x + 40)) < 130 ? (m.x < CELL.x + 40 ? -1 : 1) : 0;
        m.p.set({ x: m.x + near * part * 150, y: m.y, s: m.s, flip: m.flip, armF: 20 + up * 80, armB: 10 + up * 110, head: -6 - up * 8, blink: blinkAt(T, m.seed) });
      });
      K.pr.forEach((m, i) => m.p.set({ x: m.x + [180, 320][i], y: m.y, s: 0.96, flip: i === 1, armF: 30 + (roar + oathK) * 70, armB: 12 + (roar + oathK) * 80, head: -6, blink: blinkAt(T, 7 + i) }));
      uproar.forEach((cr) => {
        const k = seg(t, 0.08 + cr.i * 0.1, 0.9 + cr.i * 0.08);
        const m = K.people[cr.m % K.people.length];
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        pose(cr.el, { x: hx + Math.sin(k * 3 + cr.seed) * 20, y: hy - 20 - k * 150, s: 0.6 + 0.4 * ease.out(Math.min(1, k * 3)), o: k > 0 && k < 1 ? Math.min(1, k * 6) * (1 - Math.max(0, k - 0.6) / 0.4) : 0 });
      });
      oath.forEach((cr) => {
        const m = K.people[cr.m % K.people.length];
        const k = es(t, 3.08 + cr.i * 0.08, 3.3 + cr.i * 0.08, ease.back) * (1 - es(t, 3.95, 4.05));
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        pose(cr.el, { x: hx + (cr.i % 2 ? -8 : 8), y: hy - 20 - (cr.i % 2) * 30, s: k * 0.95, r: cr.i % 2 ? 4 : -4, o: k > 0.02 ? 1 : 0 });
      });

      /* Pilate: the brow; the washing; palms to the crowd */
      const brow = es(t, 0.2, 0.45) * (1 - es(t, 0.95, 1.1));
      const wash = es(t, 1.05, 1.25) * (1 - es(t, 1.95, 2.05));
      const palms = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const away = es(t, 5.3, 5.5);
      const faceR = wash > 0.5;
      K.pil.set({ x: PX + away * 40, y: PLAT + 2, s: 0.88, flip: !faceR, armF: 20 + brow * 20 + wash * 50 + palms * 80, armB: 10 + brow * 150 + wash * 45 + palms * 80, head: brow * 10 + wash * 14 - palms * 4 + away * 10, lean: brow * 3, blink: blinkAt(T, 2) });
      const sK = [[0.9, [1250, PLAT]], [1.15, [1085, PLAT]], [2.0, [1085, PLAT]], [2.4, [1260, PLAT]]];
      const [sx, sy] = kf(t, sK);
      const tilt = es(t, 1.15, 1.3) * (1 - es(t, 1.9, 2.0));
      servant.set({ x: sx, y: sy, s: 0.82, flip: t < 2.05, walk: moving(t, sK) ? sx * 0.07 : undefined, armF: 30 + tilt * 50, armB: 10, head: tilt * 10, o: es(t, 0.9, 1.0) * (1 - es(t, 2.3, 2.4)), blink: blinkAt(T, 6) });
      pose(bas, { x: 1016, y: PLAT, o: es(t, 1.0, 1.1) * (1 - es(t, 2.3, 2.4)) });
      const [ex, ey] = hand(sx, sy, 0.82, true, 30 + tilt * 50);
      drops.forEach((d) => {
        const k = ((T * 1.6 + d.i / drops.length) % 1);
        pose(d.el, { x: ex - 18 + Math.sin(d.i) * 3, y: ey + 10 + k * (PLAT - 64 - ey - 10), o: tilt > 0.5 ? 1 : 0 });
      });
      const [pax, pay] = hand(PX, PLAT + 2, 0.88, true, 20 + palms * 80);
      flick.forEach((f) => {
        const k = seg(t, 2.05 + f.i * 0.03, 2.4 + f.i * 0.03);
        pose(f.el, { x: pax + f.dx * k, y: pay + f.dy * k + k * k * 40, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const [phx, phy] = headAt(PX, PLAT + 2, 0.88, !faceR);
      const b1 = es(t, 1.35, 1.6, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(innocent, { x: phx - 10, y: phy - 20, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const b2 = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(yours, { x: phx - 10, y: phy - 20, s: b2, o: b2 > 0.02 ? 1 : 0 });

      /* the soldiers and Jesus */
      const take = es(t, 5.05, 5.35);
      K.sols[0].set({ x: 620 + take * 100, y: PLAT, s: 0.84, flip: false, walk: take > 0 && take < 1 ? take * 12 : undefined, armF: 34 + take * 20, armB: 8 + take * 50, blink: blinkAt(T, 4) });
      K.sols[1].set({ x: 1150 - take * 260, y: PLAT, s: 0.84, flip: true, walk: take > 0 && take < 1 ? take * 12 : undefined, armF: 34, armB: 8 + take * 60, blink: blinkAt(T, 5) });
      K.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4 + es(t, 3.0, 3.3) * 4 + take * 4, blink: blinkAt(T) });

      /* v26a — Barabbas goes free */
      const opened = es(t, 4.1, 4.35);
      pose(H.door, { x: CELL.x - CELL.w / 2, y: 0, sx: 1 - opened * 0.8, ox: CELL.x - CELL.w / 2 });
      const bK = [[4.3, [CELL.x + 2, CELL.y - 2]], [4.85, [CELL.x + 40, CELL.y + 90]]];
      const [bx, by] = kf(t, bK);
      const free = es(t, 4.75, 4.95);
      K.bar.set({ x: bx, y: by, s: 0.66 + es(t, 4.3, 4.85) * 0.2, flip: false, walk: moving(t, bK) ? bx * 0.08 : undefined, armF: 24 + free * 90, armB: 14 + free * 120, head: -free * 10, blink: blinkAt(T, 8) });
      chains.forEach((ch, i) => {
        const k = es(t, 4.75, 5.0, ease.in);
        pose(ch, { x: bx + 20 + i * 14, y: by - 70 + k * 64, r: k * (i ? 80 : -60), o: free > 0.02 ? 1 - es(t, 5.4, 5.6) : 0 });
      });
      /* v26b — the curtain comes down over Him */
      const down = es(t, 5.25, 5.75, ease.out);
      swing(curtainEl, JX, 160 - (1 - down) * 520, T * down, 0.4, 0.5);

      S.cam.x = 40 * es(t, 0.9, 1.3) * (1 - es(t, 2.9, 3.2)) + es(t, 4.0, 4.4) * 160 * (1 - es(t, 4.95, 5.3));
      S.cam.y = -20 - es(t, 0.9, 1.3) * 30 * (1 - es(t, 2.9, 3.2)) + es(t, 3.0, 3.4) * 50 * (1 - es(t, 3.9, 4.2)) + es(t, 4.0, 4.4) * 80 * (1 - es(t, 4.95, 5.3)) - es(t, 5.1, 5.6) * 30;
      S.cam.z = 1.02 + es(t, 0.9, 1.3) * 0.1 * (1 - es(t, 2.9, 3.2)) + es(t, 4.0, 4.4) * 0.16 * (1 - es(t, 4.95, 5.3)) + es(t, 5.1, 5.7) * 0.08;
    };
  },
};
