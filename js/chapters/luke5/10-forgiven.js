// Łk 5,20–21 — inside, close: the man lies on his bed on the floor in front of Jesus; up in the torn roof his four
// friends peer down. Jesus looks up at them — little hearts glow over their heads: their faith — then bends over the
// man: "Man, your sins are forgiven you", and dark scraps lift off him one by one and turn into sparks. On the bench
// the scribes and Pharisees frown and put their heads together; storm-clouds of thought gather over them: "Who is
// this who speaks blasphemies?" (one points at Him) — "Who can forgive sins but God alone?" (their clouds show the
// light of heaven, and they lift their eyes).
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  houseSet, houseCast, HS, JH, BED, matWithMan, FRIENDS, heart, scrap, sparkle, thought, GLYPH, radiance, headAt, kf,
  DAY, es, ease, bump, seg, fade, PI,
} from './lib.js';

const AT_HOLE = [HS.HOLE0 - 34, HS.HOLE1 + 34, HS.HOLE0 - 74, HS.HOLE1 + 74];
const ROOFY = HS.ROOF - 2;

export default {
  id: 'lk5-forgiven',
  beats: [
    { v: 20 },
    { v: 21, text: 'Na to uczeni w Piśmie i faryzeusze poczęli się zastanawiać i mówić.' },
    { v: 21, cont: true, text: '«Któż On jest, że śmie mówić bluźnierstwa?' },
    { v: 21, cont: true, text: 'Któż może odpuszczać grzechy prócz samego Boga?»' },
  ],
  cam: { x: [-400, 120], y: [-120, 120], z: [1, 1.34] },
  build(S) {
    const c = S.c;
    const H = houseSet(S, { skyCols: DAY });
    H.tiles.forEach((tl) => pose(tl.el, { o: 0 }));
    H.laths.forEach((l) => pose(l.el, { o: 0 }));
    const P = houseCast(S, H);
    const shaft = H.glowL.add(`<path d="M${HS.HOLE0 + 10} ${HS.CEIL}L${HS.HOLE1 - 10} ${HS.CEIL}L${HS.HOLE1 + 60} ${HS.FLOOR}L${HS.HOLE0 - 40} ${HS.FLOOR}Z" fill="#fff3cf" opacity=".45"/>`);
    const bed = H.lowL.add(`<g>${matWithMan(c, { w: 170 })}</g>`);
    pose(bed, { x: BED.x, y: BED.y, s: 0.8 });
    const frL = S.layer({ par: 0.5, sh: 5 });
    const fr = FRIENDS.map((o, i) => ({ i, p: S.puppet(frL.add(person(c, o))), seed: c.rr(0, 9) }));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const hearts = fr.map(() => fx.add(`<g>${heart(c, 11)}</g>`));
    const scraps = Array.from({ length: 7 }, (_, i) => ({ i, x: BED.x - 50 + i * 16 + c.rr(-6, 6), y: BED.y - 20 - c.rr(0, 16), el: fx.add(`<g>${scrap(c, 10 + (i % 3) * 3)}</g>`), sp: fx.add(`<g>${sparkle(c, 10)}</g>`), dx: c.rr(-40, 40) }));
    const clouds = [0, 1].map((i) => ({
      i,
      storm: fx.add(`<g>${thought(c, `<g transform="scale(1.2)">${GLYPH.storm(c)}</g>`, { w: 80, h: 60 })}</g>`),
      q: fx.add(`<g>${thought(c, `<g transform="translate(-12 0)">${GLYPH.q(c)}</g><g transform="translate(12 0) scale(.9)">${GLYPH.bang(c)}</g>`, { w: 84, h: 60 })}</g>`),
      god: fx.add(`<g>${thought(c, `<circle r="26" fill="url(#halo-glow)"/><g transform="scale(.16)">${radiance(c, 150)}</g>`, { w: 84, h: 64 })}</g>`),
    }));

    return (t, time) => {
      const T = time;
      H.idle(T);
      P.crowd(0, 1);
      pose(shaft, { o: 0.8 });

      /* the four friends peering down through the hole */
      fr.forEach((f) => {
        const x = AT_HOLE[f.i], flip = x > (HS.HOLE0 + HS.HOLE1) / 2;
        f.p.set({ x, y: ROOFY, s: 0.64, flip, armF: 40, armB: 30, lean: (flip ? 1 : -1) * -14, head: 22, blink: blinkAt(T, f.seed) });
      });

      /* v20 — seeing their faith; "your sins are forgiven you" */
      const lookUp = es(t, 0.02, 0.2) * (1 - es(t, 0.35, 0.5));
      const bless = es(t, 0.4, 0.6) * (1 - es(t, 1.0, 1.2) * 0.7);
      const [jhx, jhy] = headAt(JH.x, HS.FLOOR, JH.s, true);
      P.jesus.set({ x: JH.x, y: HS.FLOOR, s: JH.s, flip: true, armF: 20 + bless * 60, armB: 10 + lookUp * 40, lean: bless * 8, head: -lookUp * 22 + bless * 14, blink: blinkAt(T) });
      hearts.forEach((h, i) => {
        const k = es(t, 0.08 + i * 0.04, 0.25 + i * 0.04, ease.back) * (1 - es(t, 0.9, 1.05));
        const x = AT_HOLE[i], [hx, hy] = headAt(x, ROOFY, 0.64, x > 790);
        pose(h, { x: hx, y: hy - 34, s: k, o: k > 0.01 ? 1 : 0 });
      });
      scraps.forEach((sc) => {
        const k = es(t, 0.5 + sc.i * 0.04, 0.85 + sc.i * 0.04);
        pose(sc.el, { x: sc.x + sc.dx * k, y: sc.y - k * 120, r: k * 90, s: 1 - k * 0.5, o: seg(t, 0.45, 0.5) * (1 - k) });
        const b = bump(t, 0.75 + sc.i * 0.04, 1.0 + sc.i * 0.04);
        pose(sc.sp, { x: sc.x + sc.dx, y: sc.y - 120, s: b, r: T * 60, o: b });
      });

      /* v21 — the scribes reason: frowns, heads together, storm-clouds of thought */
      const frown = es(t, 1.05, 1.3);
      const pointK = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.05));
      const lift = es(t, 3.05, 3.3);
      P.scribes.forEach((m) => {
        const toward = m.i < 2 ? 1 : -1;
        m.p.set({
          x: m.x + toward * frown * 6, y: m.y, s: 0.8, flip: m.i === 1 ? frown > 0.5 && t < 2.0 : false,
          armF: 24 + (m.i === 3 ? pointK * 70 : 0) + lift * (m.i % 2 ? 40 : 10), armB: 14 + lift * (m.i === 0 ? 120 : 0), lean: frown * toward * 4, head: frown * (m.i % 2 ? 8 : -6) - lift * 16, blink: blinkAt(T, m.seed),
        });
        fade(m.angry, frown);
      });
      clouds.forEach((cl) => {
        const x = cl.i ? P.scribes[3].x + 10 : P.scribes[0].x + 20, y = P.scribes[0].y - 120;
        const st = es(t, 1.15 + cl.i * 0.1, 1.35 + cl.i * 0.1, ease.back) * (1 - es(t, 1.95, 2.05));
        const q = es(t, 2.05 + cl.i * 0.08, 2.25 + cl.i * 0.08, ease.back) * (1 - es(t, 2.95, 3.05));
        const g = es(t, 3.05 + cl.i * 0.08, 3.25 + cl.i * 0.08, ease.back);
        pose(cl.storm, { x, y, s: st, o: st > 0.01 ? 1 : 0 });
        pose(cl.q, { x, y, s: q, o: q > 0.01 ? 1 : 0 });
        pose(cl.god, { x, y, s: g, o: g > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [0.3, 0], [0.6, 70], [1.0, 40], [1.3, -330], [3, -340], [4, -320]]);
      S.cam.y = kf(t, [[0, -100], [0.3, -90], [0.6, 90], [1.0, 80], [1.3, -10], [3, -10], [4, -20]]);
      S.cam.z = kf(t, [[0, 1.06], [0.3, 1.08], [0.6, 1.3], [1.0, 1.28], [1.3, 1.3], [4, 1.32]]);
    };
  },
};
