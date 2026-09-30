// Łk 2,1–2 — the curtains open on Rome: Caesar Augustus on his curule seat between the eagle and the red banner.
// The decree comes down on its rod and unrolls — the enrollment — he lifts his hand and the red seal is pressed on it;
// two messengers run out with sealed copies, and on the round map of the world red seals spring up from Spain to
// Egypt: the whole empire. Then the scroll rolls up; a copy travels across the map to Syria, whose governor comes
// down on his medallion — Quirinius — with the numeral of the first census.
import { C, person, blinkAt, pose, lerp, curtains, hanging, sheet, shade, mix } from '../kit.js';
import {
  romeSet, caesar, CLERK, MESSENGER, scrollParts, sealedScroll, centurion, bustMedal, placeTag,
  hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

/** the round map of the world (origin centre): the sea, the lands around it, dots for the cities */
const CITIES = [[-18, -14], [-120, -2], [-74, -44], [18, -34], [96, -6], [86, 22], [58, 58], [-60, 58]];   // Rome, Spain, Gaul, Greece, Syria, Judea, Egypt, Africa
function orbis(c, r = 110) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 44), 0.5, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 44), 0.5, 5), mix(C.parchment, C.sand, 0.3));
  // the sea in the middle of the lands
  s.p(c.cut([[-128, 10], [-96, 0], [-60, 10], [-30, 2], [-12, 20], [4, 8], [30, 6], [56, 14], [84, 8], [92, 24], [70, 40], [30, 34], [-10, 44], [-40, 32], [-80, 36], [-118, 30]], 0.8, 6), mix(C.lake, C.skyBlue, 0.3));
  // Italy, Greece poking into it
  s.p(c.cut([[-26, -22], [-10, -18], [6, 6], [2, 14], [-6, 8], [-18, -6]], 0.4, 4) + c.cut([[14, -26], [30, -24], [34, 4], [22, 10], [16, -6]], 0.4, 4), mix(C.parchment, C.sand2, 0.55));
  s.x(c.ribbon(c.arc(0, 0, r - 12, r - 12, 0, PI * 2, 40), 1), C.wood3, 'opacity=".35"');
  const txt = `<text x="0" y="${-r + 28}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="16" font-style="italic" fill="${C.terracotta}">${tr('całe państwo', 'all the world')}</text>`;
  return s.out() + txt;
}
const seal = (c, r = 9) => sheet().p(c.cut(c.blob(0, 0, r, r, 9, 0.15), 0.3, 3), shade(C.terracotta, -0.05)).x(c.poly(c.star(0, 0, r * 0.55, r * 0.25, 6, 0)), shade(C.terracotta, 0.3)).out();

export default {
  id: 'lk2-decree',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-30, 40], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = romeSet(S);
    const { charL: P, fxL: X, SEAT } = R;

    /* Caesar, his clerk, two messengers */
    const cz = S.puppet(P.add(caesar(c, { pose: 'sit', holdF: `<g class="sc" transform="translate(0 8) rotate(90)">${sealedScroll(c, 50)}</g>` })));
    const clerk = S.puppet(P.add(person(c, { ...CLERK, holdF: `<g transform="translate(0 6) rotate(-80)">${sealedScroll(c, 44)}</g>` })));
    const mess = [0, 1].map((i) => ({ i, p: S.puppet(P.add(person(c, { ...MESSENGER, robe: i ? mix(C.dustyBlue, C.stone, 0.3) : MESSENGER.robe, hair: i ? C.hair3 : C.hair2, holdF: `<g transform="translate(0 8) rotate(-60)">${sealedScroll(c, 40)}</g>` }))) }));

    /* the decree on its rod, the seal */
    const SX = 560, SY = 226;
    const sp = scrollParts(c, { w: 270, h: 180, title: tr('Spis ludności', 'Enrollment'), lines: 5 });
    const rod = hanging(X, sp.rod, { x: 0, y: 0, len: 600 });
    const sheetEl = X.add(`<g>${sp.sheet}</g>`);
    const rod2 = X.add(`<g>${sp.rod}</g>`);
    const sealEl = X.add(`<g>${seal(c, 16)}</g>`);

    /* the map of the world, its seals; the copy that travels to Syria */
    const MX = 1060, MY = 300;
    const map = hanging(X, orbis(c, 112), { x: 0, y: 0, len: 700 });
    const dots = CITIES.map(([x, y], i) => ({ i, x, y, el: X.add(`<g>${seal(c, i === 0 ? 8 : 6.5)}</g>`) }));
    const copy = X.add(`<g transform="scale(.5)">${sealedScroll(c, 40)}</g>`);
    const syr = X.add(`<g><circle r="30" fill="url(#warm-glow)"/></g>`);

    /* Quirinius, governor of Syria; the first census */
    const quir = hanging(X, bustMedal(c, S.id('quir'), centurion(c, { helmet: false }), { r: 56, face: mix(C.parchment, C.peach, 0.35), rim: C.curtain2, label: tr('Kwiryniusz, namiestnik Syrii', 'Quirinius, governor of Syria'), size: 15 }), { x: 0, y: 0, len: 700 });
    const first = hanging(X, placeTag(c, tr('pierwszy spis', 'the first enrollment'), 19), { x: 0, y: 0, len: 600 });
    const syrName = X.add(`<g>${placeTag(c, tr('Syria', 'Syria'), 15)}</g>`);
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* v1 — the decree goes out from Caesar Augustus */
      const give = es(t, 1.05, 1.3);             // he holds out the sealed decree
      const stamp = bump(t, 1.3, 1.5);
      const after = es(t, 1.55, 1.8);
      cz.set({ x: SEAT[0] - 10, y: SEAT[1] - 34, s: 1.05, armF: 20 + give * 60 - after * 50 + stamp * 20, armB: 10 + es(t, 2.1, 2.4) * 20, head: -2 - give * 4, blink: blinkAt(T, 1) });
      const ck = es(t, 1.0, 1.25);
      clerk.set({ x: 1000, y: 700, s: 0.94, flip: true, armF: 30 + ck * 40 - es(t, 1.6, 1.8) * 40, armB: 10, head: 6, blink: blinkAt(T, 3) });
      // the scroll comes down and unrolls
      const dk = es(t, 1.0, 1.25, ease.out) * (1 - es(t, 2.05, 2.35, ease.in));
      const un = es(t, 1.15, 1.45) * (1 - es(t, 1.95, 2.1));
      hangAt(rod, SX, lerp(-520, SY, dk), T, dk > 0.001 ? 1 : 0, 0.8, 0.8, 1);
      const ry = lerp(-520, SY, dk);
      vpose(sheetEl, { x: SX, y: ry, sy: Math.max(0.01, un), o: dk > 0.001 && un > 0.01 ? 1 : 0 });
      vpose(rod2, { x: SX, y: ry + 180 * un, o: dk > 0.001 && un > 0.01 ? 1 : 0 });
      const sk = es(t, 1.36, 1.5, ease.back) * (un > 0.9 ? 1 : 0);
      vpose(sealEl, { x: SX + 92, y: ry + 150, s: Math.max(0.001, sk), r: -12, o: sk > 0.01 ? 1 : 0 });
      // the messengers run out, one each way
      mess.forEach((m) => {
        const d = m.i ? 1 : -1;
        const run = es(t, 1.45, 2.4, (u) => u);
        const x = lerp(m.i ? 960 : 640, m.i ? 1660 : -60, run);
        const kneel = 1 - es(t, 1.3, 1.42);
        m.p.set({ x, y: 712, s: 0.9, flip: d < 0, walk: run > 0.01 && run < 0.99 ? x * 0.09 : undefined, amt: 1.5, armF: 50 + kneel * 20, armB: 20, head: 0, lean: run > 0.01 ? 6 : 0, o: t > 1.02 && run < 0.99 ? es(t, 1.02, 1.15) : 0, blink: blinkAt(T, 4 + m.i) });
      });
      // the whole world: seals spring up on the map
      const mk = es(t, 1.2, 1.45, ease.out);
      hangAt(map, MX, lerp(-520, MY, mk), T, mk > 0.001 ? 1 : 0, 0.8, 0.7, 2);
      dots.forEach((d) => {
        const k = es(t, 1.45 + d.i * 0.05, 1.6 + d.i * 0.05, ease.back);
        const hi = d.i === 4 ? es(t, 2.4, 2.6) : 0;
        vpose(d.el, { x: MX + d.x, y: MY + d.y + 12, s: Math.max(0.001, k * (1 + hi * 0.6)), o: mk > 0.9 && k > 0.01 ? 1 : 0 });
      });

      /* v2 — the first census, when Quirinius governed Syria: a copy travels to Syria */
      const trav = es(t, 2.05, 2.45);
      const [ax, ay] = CITIES[0], [bx, by] = CITIES[4];
      vpose(copy, { x: MX + lerp(ax, bx, trav), y: MY + 12 + lerp(ay, by, trav) - Math.sin(trav * PI) * 30, r: -10, o: trav > 0.01 && trav < 0.99 ? 1 : 0 });
      vpose(syr, { x: MX + bx, y: MY + by + 12, s: 0.6 + es(t, 2.4, 2.6) * 0.8, o: es(t, 2.4, 2.6) });
      const qk = es(t, 2.2, 2.5, ease.out);
      hangAt(quir, 560, lerp(-540, 290, qk), T, qk > 0.001 ? 1 : 0, 1, 0.8, 3);
      const fk = es(t, 2.3, 2.6, ease.out);
      hangAt(first, 800, lerp(-520, 200, fk), T, fk > 0.001 ? 1 : 0, 1, 0.8, 5);
      const sn = es(t, 2.45, 2.6, ease.back);
      vpose(syrName, { x: MX + bx - 10, y: MY + by - 22, s: Math.max(0.001, sn), o: sn > 0.01 ? 1 : 0 });
      sparks.forEach((spk, i) => {
        const k = seg(t, 2.45 + i * 0.05, 2.85 + i * 0.05), a = (i / 4) * PI * 2 + 0.4;
        vpose(spk, { x: MX + bx + Math.cos(a) * (20 + k * 50), y: MY + by + 12 + Math.sin(a) * (20 + k * 40), s: 0.8 - k * 0.4, r: t * 80, o: bump(t, 2.45 + i * 0.05, 2.85 + i * 0.05) });
      });

      S.cam.z = 1 + es(t, 0.4, 1.2) * 0.04 + es(t, 2.1, 2.5) * 0.03;
      S.cam.y = es(t, 0.4, 1.2) * 20 - es(t, 2.1, 2.5) * 20;
      S.cam.x = 0;
    };
  },
};
