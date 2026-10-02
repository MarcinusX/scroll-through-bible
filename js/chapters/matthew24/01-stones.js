// Mt 24,1–2 — leaving the Temple by the great gate in the retaining wall (Mark 13's wall of huge drafted stones,
// the gleaming sanctuary above). Jesus walks out and on; the disciples hurry up round Him to show Him the buildings,
// pointing up at the stones. "Do you see all these things?" — He lifts His hand to it all, the gold
// glints. "Not one stone will be left here upon another" — a plate comes down: the stones of a little Temple lift
// apart and tumble; the disciples' hands sink.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, mix, crowdPerson } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { bigSanctuary, sparkle, voiceRings, ashlar, plate, dust, templeWall, templeStreet, templeBlocks, blockCut, TW, AFTERNOON, LATE } from './lib.js';

const { GY, WT, GATE } = TW;
const GX = (GATE[0] + GATE[1]) / 2;

export default {
  id: 'mt24-stones',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Lecz On rzekł do nich: «Widzicie to wszystko?' },
    { v: 2, cont: true, text: 'Zaprawdę, powiadam wam, nie zostanie tu kamień na kamieniu, który by nie był zwalony».' },
  ],
  cam: { x: [-30, 30], y: [-90, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, AFTERNOON);
    const sk2 = sky(S, LATE, { name: 'sky2' });
    sk2.layer.fade(0);

    /* heavens */
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: -1500, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 430, y: -1500, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1050, y: -1500, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 36, scale: 0.42 });

    /* the sanctuary rising behind the wall */
    const sanL = S.layer({ par: 0.12, sh: 4 });
    sanL.add(`<circle cx="800" cy="230" r="330" fill="url(#halo-glow)" opacity=".55"/>`);
    sanL.add(`<g transform="translate(800 ${WT - 30}) scale(.8) translate(-800 -410)">${bigSanctuary(c)}</g>`);
    const glints = [[662, 160], [800, 150], [940, 158], [712, 220], [890, 236]].map(([x, y], i) => ({ x, y, i, el: sanL.add(`<g>${sparkle(c, 14)}</g>`) }));

    /* the wall of huge stones, the gate, the street */
    const wallL = S.layer({ par: 0.3, sh: 5 });
    wallL.add(templeWall(c, ashlar));
    const sheen = wallL.add(`<g><ellipse rx="260" ry="150" fill="url(#warm-glow)"/></g>`);
    const streetL = S.layer({ par: 0.42, sh: 3 });
    streetL.add(templeStreet(c));

    /* pilgrims on the far right, going up to the Temple */
    const people = S.layer({ par: 0.5, sh: 5 });
    const pil = [{ x: 1250, s: 0.84 }, { x: 1318, s: 0.9 }, { x: 1384, s: 0.82 }].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(people.add(person(c, crowdPerson(c)))) }));

    /* Jesus walks out first; the disciples follow and come round Him */
    const PO = S.portrait;   // phone: the three on the right stay clear of the thread
    const DIS = [
      { o: CAST.peter, from: GX - 40, to: PO ? 934 : 948, s: 0.95, show: 1 },
      { o: CAST.john, from: GX - 90, to: PO ? 992 : 1030, s: 0.93, show: 1 },
      { o: CAST.andrew, from: GX - 140, to: PO ? 1048 : 1108, s: 0.93, show: 0.6 },
      { o: CAST.james, from: GX - 190, to: 668, s: 0.94, show: 0.8 },
      { o: CAST.thomas, from: GX - 240, to: 594, s: 0.92, show: 0 },
      { o: CAST.matthew, from: GX - 290, to: 522, s: 0.9, show: 0.5 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), t0: 1.05 + i * 0.07, y: GY + (i % 2) * 6 }));
    [...DIS].reverse().forEach((m) => { m.p = S.puppet(people.add(person(c, m.o))); });
    const J = S.puppet(people.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(people, c, { n: 3, r: 26, w: 4 });

    /* the plate: a little Temple whose stones come apart */
    const plL = S.layer({ par: 0.36, sh: 6 });
    const PW = 390, PH = 236, PX = 800, PY = 132;
    const plEl = plL.add(`<g transform="translate(0 -1500)">${plate(c, PW, PH, { face: mix(C.parchment, C.duskViolet, 0.22) })}</g>`);
    const blocks = templeBlocks(c).map((b, i) => ({ ...b, i, el: plL.add(`<g transform="translate(0 -1500)">${blockCut(c, b)}</g>`) }));
    const NB = blocks.length;
    const puffs = [0, 1, 2, 3].map(() => plL.add(`<g transform="translate(0 -1500)">${dust(c, 22)}</g>`));
    const GROUND = PH - 26;

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const eve = es(t, 2.2, 3.8);
      sk2.layer.fade(eve * 0.85);
      swing(sunEl, 1230, 170 + eve * 50, T, 1, 0.7);
      swing(cl1, 430 + Math.sin(T * 0.1) * 24, 150, T, 1.3, 0.6, 1);
      swing(cl2, 1050 + Math.sin(T * 0.12 + 2) * 24, 110, T, 1.3, 0.8, 2);
      birds(T, 1);

      /* v1 — out of the gate and on; the disciples come round Him and point up at the buildings */
      const jk = seg(t, 1.0, 1.55);
      const jx = lerp(GX, 800, ease.out(jk));
      const show = es(t, 1.5, 1.8) * (1 - es(t, 2.05, 2.3) * 0.55) * (1 - es(t, 3.2, 3.5));
      /* v2a — "Do you see all these things?": He lifts His hand to it all */
      const see = es(t, 2.05, 2.35) * (1 - es(t, 2.95, 3.15));
      const sad = es(t, 3.25, 3.7);
      J.set({ x: jx, y: GY + 2, s: 1, flip: false, o: seg(t, 0.98, 1.05), walk: jk > 0 && jk < 1 ? jx * 0.05 : undefined, armB: see * 160 + es(t, 3.05, 3.3) * 40 * (1 - sad * 0.5), armF: 10 + see * 30 + es(t, 3.05, 3.3) * 70, head: -see * 12 + sad * 6, blink: blinkAt(T) });
      voice(jx + 6, GY - 172, es(t, 2.05, 2.2) * (1 - es(t, 3.8, 4)), T, { dir: 1, off: 8 });

      DIS.forEach((m) => {
        const k = seg(t, m.t0, m.t0 + 0.55);
        const x = lerp(m.from, m.to, ease.out(k));
        const walking = k > 0 && k < 1;
        const flip = m.to > 800 ? k >= 1 : false;
        const pt = show * m.show;
        const look = es(t, 2.1, 2.4) * (1 - sad);
        m.p.set({
          x, y: m.y, s: m.s, flip, o: seg(t, m.t0 - 0.02, m.t0 + 0.06), walk: walking ? x * 0.05 : undefined,
          armB: pt * 160, armF: pt * 40 + sad * 10, head: -pt * 14 - look * 8 + sad * 12, blink: blinkAt(T, m.seed),
        });
      });
      pil.forEach((m) => m.p.set({ x: m.x, y: GY + 4 + m.i * 3, s: m.s, flip: true, head: -10 - show * 4, armF: m.i === 1 ? 30 + show * 40 : 0, blink: blinkAt(T, m.seed) }));

      /* the stones glint; a warm sheen runs along the wall */
      const shine = Math.max(show, see);
      glints.forEach((g) => {
        const tw = T ? 0.5 + 0.5 * Math.sin(T * 2.2 + g.i * 1.7) : 0.7;
        pose(g.el, { x: g.x, y: g.y, s: (0.4 + shine * 0.8) * (0.7 + tw * 0.4), r: T * 20 + g.i * 30, o: (0.3 + shine * 0.7 * tw) * (1 - sad * 0.7) });
      });
      pose(sheen, { x: lerp(200, 1300, seg(t, 1.45, 2.5)), y: 520, o: bump(t, 1.45, 2.5) * 0.9 });

      /* v2b — the plate drops; its stones lift apart and fall */
      const down = es(t, 3.0, 3.35, ease.back);
      const py = lerp(-460, PY, down);
      const on = down > 0.001 ? 1 : 0;
      pose(plEl, { x: PX, y: py, r: Math.sin(T * 0.8) * 0.6 * down, o: on });
      const gy = py + GROUND;
      blocks.forEach((bk) => {
        const order = (NB - 1 - bk.i) / NB;
        const a = 3.3 + order * 0.25;
        const lift = es(t, a, a + 0.12);
        const fall = es(t, a + 0.08, a + 0.3, ease.in);
        const bx0 = PX + bk.x + bk.w / 2, by0 = gy + bk.y + bk.h / 2;
        const spread = lift * (bk.x + bk.w / 2) * 0.12;
        const x = bx0 + spread + fall * (bk.ex - (bk.x + bk.w / 2)) * 0.8;
        const restY = gy - bk.h * 0.35 - (bk.i % 4) * 7 * (1 - Math.abs(bk.ex) / 170);
        const y = lerp(by0 - lift * 12, restY, fall);
        pose(bk.el, { x, y, r: (lift * bk.r0 * 0.2 + fall * bk.rot) * (bk.w > 100 ? 0.12 : 1), o: on });
      });
      puffs.forEach((p, i) => {
        const k = seg(t, 3.5 + i * 0.1, 4.0 + i * 0.1);
        pose(p, { x: PX - 110 + i * 70, y: gy - 10 - k * 26, s: 0.6 + k * 1.1, o: bump(t, 3.5 + i * 0.1, 4.0 + i * 0.1) * 0.8 });
      });

      S.cam.y = -es(t, 1.4, 2.0) * 70 * (1 - es(t, 2.9, 3.4)) + es(t, 0.5, 1.2) * 20 - es(t, 2.95, 3.4) * 50;
      S.cam.z = 1 + es(t, 1.4, 2.0) * 0.05 * (1 - es(t, 2.9, 3.4)) + es(t, 2.95, 3.4) * 0.04;
    };
  },
};
