// J 11,41–46 — the seventh sign. The stone lies aside; the doorway is dark. Jesus lifts His eyes: high above, the
// Father's light (never a figure) opens and a golden thread runs down to His raised hands — "I knew that You always
// hear Me". He opens His arms to the people and a small star comes down the thread to Him: "that they may believe
// that You sent Me". Then He steps toward the tomb and cries with a loud voice: great rings of His voice roll into
// the dark, and the cave fills with light. A white-wrapped figure comes out, hopping into the light, bound hand and
// foot, his face wrapped in a cloth — the crowd lifts its hands in wonder. "Unbind him, and let him go": the bands
// unwind and fly off like paper ribbons, the cloth lifts away, Lazarus smiles, and his sisters run to hold him. The
// sign-medallion No. 7 comes down. Many believe — little hearts light over them — but two slip away up the road to
// tell the Pharisees.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  tombSet, DOOR, EVENING, DUSK, DISC, LAZ_LINEN, mournerOpts, martha, mary, lazarus, wrapped, bandCurl, radiance, rayBurst, spark, heart,
  signBadge, caveIcon, signpost, faceBits, withFace, hang2, vis, kf, moving, hand, headAt, pose, attr, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = 706;
const LX = 985;           // where Lazarus stands, freed

export default {
  id: 'j11-lazarus',
  beats: [
    { v: 41 },
    { v: 42, text: 'Ja wiedziałem, że mnie zawsze wysłuchujesz.' },
    { v: 42, cont: true, text: 'Ale ze względu na otaczający Mnie lud to powiedziałem, aby uwierzyli, żeś Ty Mnie posłał».' },
    { v: 43, text: 'To powiedziawszy zawołał donośnym głosem:' },
    { v: 43, cont: true, text: '«Łazarzu, wyjdź na zewnątrz!»' },
    { v: 44, text: 'I wyszedł zmarły, mając nogi i ręce powiązane opaskami, a twarz jego była zawinięta chustą.' },
    { v: 44, cont: true, text: 'Rzekł do nich Jezus:' },
    { v: 44, cont: true, text: '«Rozwiążcie go i pozwólcie mu chodzić!».' },
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [-440, 160], y: [-110, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = tombSet(S, { skyCols: EVENING, sunAt: [540, 400] });
    const skyL = S.layer({ par: 0.06, sh: 1 });
    const lightF = skyL.add(`<g><circle r="300" fill="url(#halo-glow)"/>${rayBurst(c, { n: 18, r0: 70, r1: 700, spread: 0.035, o: 0.26 })}${radiance(c, 70)}</g>`);
    pose(set.stone, { x: DOOR.x + 175, y: DOOR.y - 76, r: 150 });
    // Lazarus: inside the cave (behind the rock), then outside
    const W = wrapped(c);
    const inside = set.caveL.add(`<g>${W.body}${W.cloth}</g>`);
    const freedGlow = set.stoneL.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);   // behind the figure
    const outBody = set.stoneL.add(`<g>${W.body}</g>`);
    const outCloth = set.stoneL.add(`<g>${W.cloth}</g>`);
    const freed = S.puppet(set.stoneL.add(lazarus(c, { robe: C.linen, mantle: null, belt: C.rope })));

    const thrL = S.layer({ par: 0.5, sh: 1 });
    const thread = thrL.add(`<g><path d="" fill="${C.haloRim}"/></g>`);
    const threadP = thread.querySelector('path');
    const star = thrL.add(`<g>${spark(c, 14)}</g>`);
    const A = S.layer({ par: 0.52, sh: 5 });
    const MO = [300, 360, 420, 480, 540].map((x, i) => ({ i, x, y: F + 4 + (i % 2) * 12, p: S.puppet(A.add(withFace(person(c, mournerOpts(i)), faceBits(c)))) }));
    MO.forEach((m) => { m.angry = m.p.el.querySelector('[data-part="angry"]'); });
    const DP = [[600, F + 14], [655, F + 2], [560, F + 22], [710, F + 16]];
    const disc = [DISC[0], DISC[3], DISC[1], DISC[5]].map((o, i) => ({ i, x: DP[i][0], y: DP[i][1], p: S.puppet(A.add(person(c, o))) }));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const mt = S.puppet(A.add(martha(c)));
    const my = S.puppet(A.add(mary(c)));
    set.front();

    const X = S.layer({ par: 0.56, sh: 6 });
    const RINGS = [0, 1, 2, 3, 4].map((i) => ({ i, el: X.add(`<g><path d="${c.ribbon(c.arc(0, 0, 50, 50, -0.62, 0.62, 12), 7)}" fill="${shade(C.halo, -0.05)}"/></g>`) }));
    const bands = Array.from({ length: 9 }, (_, i) => ({ i, el: X.add(`<g>${bandCurl(c, 60 + (i % 3) * 16, i % 2 ? 1 : -1)}</g>`) }));
    const hearts = MO.concat(disc.map((d) => ({ ...d, i: d.i + 10 }))).map((m, j) => ({ m, j, el: X.add(`<g>${heart(c, 11, C.jesusMantle)}</g>`) }));
    const badgeIcon = `<g transform="translate(-24 12) scale(.42)">${caveIcon(c, { open: true })}</g>`;
    const badge = X.add(`<g>${hang2(`${signBadge(c, 7, { r: 58, icon: 'cave' })}${badgeIcon}`, 0.01, 300)}</g>`);
    const post = X.add(`<g>${signpost(c, tr('do faryzeuszów', 'to the Pharisees'), { size: 18, dir: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      /* evening deepens a little; the Father's light above */
      set.sk.blend(EVENING, DUSK, es(t, 0, 10) * 0.6);
      pose(set.sunEl, { x: 540, y: 400 + es(t, 0, 10) * 40, r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 900 + Math.sin(T * 0.1) * 20, y: 150, r: 0 });
      const lk = es(t, 0.1, 0.5) * (1 - es(t, 2.9, 3.2));
      vis(lightF, { x: 800, y: 110, s: 0.8 + lk * 0.3, r: T * 2, o: lk });

      /* v41–42 — prayer: eyes lifted, the thread of light */
      const pray = es(t, 0.1, 0.4) * (1 - es(t, 1.9, 2.1));
      const open = es(t, 2.05, 2.35) * (1 - es(t, 2.9, 3.05));
      const step = es(t, 3.1, 3.5);
      const cry = es(t, 4.0, 4.15) * (1 - es(t, 4.9, 5.1));
      const turn = es(t, 6.05, 6.3) * (1 - es(t, 7.7, 7.9));
      const jx = 800 + step * 30;
      jesus.set({ x: jx, y: F + 12, s: 1.04, flip: turn > 0.5, armF: 16 + pray * 50 + open * 40 + step * 60 * (1 - turn) + cry * 20 + turn * 60, armB: 10 + pray * 140 + open * 60 + turn * 40, head: -pray * 16 + cry * -6, bob: -cry * 3, blink: pray > 0.5 ? 0 : blinkAt(T, 1) });
      const [hx, hy] = hand(jx, F + 12, 1.04, false, 10 + pray * 140);
      const tk = es(t, 0.3, 0.7) * (1 - es(t, 2.9, 3.1));
      if (tk > 0.01) threadP.setAttribute('d', c.ribbon([[hx - 20, hy - 16], [lerp(hx - 20, 800, 0.5) + Math.sin(T) * 4, lerp(hy, 160, 0.5)], [lerp(hx - 20, 800, Math.min(1, tk * 1.2)), lerp(hy, 160, Math.min(1, tk * 1.2))]], 2.4));
      pose(thread, { o: tk });
      const sd = es(t, 2.2, 2.75, ease.in);
      vis(star, { x: lerp(800, jx + 2, sd), y: lerp(160, F + 12 - 175, sd), s: 1 + (1 - sd) * 0.5, r: T * 40, o: sd > 0.01 && sd < 0.99 ? 1 : 0 });

      /* the crowd: look up; wonder; hearts; two slip away */
      const up = es(t, 2.2, 2.5) * (1 - es(t, 3.0, 3.2));
      const wonder = es(t, 5.2, 5.5) * (1 - es(t, 7.0, 7.4));
      MO.forEach((m) => {
        const leave = m.i < 2 ? es(t, 9.1 + m.i * 0.06, 9.95, ease.in) : 0;
        const x = m.x - leave * (S.portrait ? 130 : 420);
        const walking = leave > 0 && leave < 1;
        m.p.set({ x, y: m.y, s: 0.9, flip: m.i < 2 && t > 9.05, walk: walking ? x * 0.1 : undefined, armF: 12 + wonder * 60 + (m.i < 2 ? 0 : es(t, 8.1, 8.4) * 30), armB: 8 + wonder * (m.i % 2 ? 130 : 80), head: 6 - up * 16 - wonder * 8 + (m.i < 2 && t > 9 ? 6 : 0), blink: blinkAt(T, m.i + 6) });
        if (m.angry) attr(m.angry, 'opacity', m.i < 2 ? es(t, 9.0, 9.2) : 0);
      });
      disc.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.92, armF: 10 + wonder * 50, armB: 6 + wonder * 90, head: -up * 14 - wonder * 6, blink: blinkAt(T, d.i + 4) }));

      /* v43b — the loud voice rolls into the tomb; light fills it */
      const [mx0, my0] = headAt(jx, F + 12, 1.04, false);
      RINGS.forEach((r) => {
        const on = cry;
        const k = T ? ((T * 0.55 + r.i / 5) % 1) : (r.i + 0.5) / 5;
        const kk = on > 0.01 ? k : 0;
        vis(r.el, { x: lerp(mx0 + 24, DOOR.x - 10, kk), y: lerp(my0 + 6, DOOR.y - 90, kk), s: 0.5 + kk * 1.4, o: on * (1 - kk * 0.8) * (kk > 0.02 ? 1 : 0) });
      });
      attr(set.caveGlow, 'opacity', es(t, 4.35, 4.9) * (1 - es(t, 8.5, 9.5) * 0.6));

      /* v44a — he comes out, bound, into the light */
      const walkOut = es(t, 5.05, 5.45, ease.io);
      const swap = seg(t, 5.42, 5.47);
      const hopIn = Math.abs(Math.sin(walkOut * PI * 3)) * 5;
      pose(inside, { x: DOOR.x, y: lerp(DOOR.y - 26, DOOR.y, walkOut) - hopIn, s: lerp(0.72, 0.9, walkOut), o: (t > 5.0 ? 1 : 0) * (1 - swap) });
      const come = es(t, 5.45, 5.9, ease.out);
      const hop = Math.abs(Math.sin(come * PI * 3)) * 7 * (1 - come * 0.3);
      const bx = lerp(DOOR.x, LX, come), by = lerp(DOOR.y, F + 6, come) - hop;
      const unbind = es(t, 7.2, 7.7);
      const freeK = seg(t, 7.62, 7.7);
      pose(outBody, { x: bx, y: by, s: 0.95, r: Math.sin(come * PI * 6) * 2 * (1 - come), o: swap * (1 - freeK) });
      const clothUp = es(t, 7.25, 7.8, ease.out);
      pose(outCloth, { x: bx + clothUp * 60, y: by - clothUp * 150, s: 0.95, r: clothUp * 40, o: swap * (1 - es(t, 7.7, 7.95)) });
      vis(freedGlow, { x: LX, y: F - 90, s: 0.8 + come * 0.3, o: swap * (0.8 - freeK * 0.3) * (1 - es(t, 9, 10) * 0.5) });
      const smile = es(t, 7.7, 8.0);
      freed.set({ x: LX, y: F + 6, s: 0.95, flip: true, armF: 20 + smile * 40, armB: 10 + smile * 60, head: -smile * 6, blink: blinkAt(T, 9), o: freeK });
      bands.forEach((b) => {
        const k = es(t, 7.2 + b.i * 0.04, 7.75 + b.i * 0.04, ease.out);
        const a = (b.i / 9) * PI * 2 + 0.4;
        vis(b.el, { x: LX + Math.cos(a) * (10 + k * 110), y: F - 20 - b.i * 14 + Math.sin(a) * k * 70 - k * 50, r: k * 200 * (b.i % 2 ? 1 : -1), s: 0.8 + k * 0.3, o: k > 0.01 && k < 0.99 ? 1 - k * 0.6 : 0 });
      });

      /* the sisters: hold back, then run to him */
      const run = es(t, 7.35, 7.85);
      const hug = es(t, 7.8, 8.1);
      const mtx = lerp(700, LX - 62, run), myx = lerp(640, LX + 62, run);
      mt.set({ x: mtx, y: F + 10, s: 0.98, flip: false, walk: run > 0 && run < 1 ? mtx * 0.12 : undefined, armF: 20 + wonder * 40 + hug * 70, armB: 10 + hug * 50, head: -wonder * 6 + hug * 4, lean: hug * 6, blink: blinkAt(T, 2) });
      my.set({ x: myx, y: F + 14, s: 0.96, flip: run > 0.85, walk: run > 0 && run < 1 ? myx * 0.12 : undefined, armF: 30 + wonder * 30 + hug * 60, armB: 20 + hug * 50, head: 8 - wonder * 10, lean: hug * 6, blink: blinkAt(T, 4) });

      /* the seventh sign */
      const bk = es(t, 8.0, 8.4, ease.back) * (1 - es(t, 9.1, 9.4));
      vis(badge, { x: 880, y: 250 - (1 - bk) * 480, r: Math.sin(T * 0.7) * 1.5, o: bk > 0.01 ? 1 : 0 });

      /* v45 — many believed */
      hearts.forEach((h) => {
        const k = es(t, 8.15 + h.j * 0.07, 8.4 + h.j * 0.07, ease.back) * (h.m.i < 2 ? 0 : 1);
        const x = h.m.x, y = (h.m.y || F) - 225;
        vis(h.el, { x, y: y + Math.sin(T * 2 + h.j) * 3, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v46 — some went to the Pharisees */
      const pk = es(t, 9.05, 9.35, ease.back);
      vis(post, { x: S.portrait ? 430 : 330, y: 560 - (1 - pk) * 520, r: Math.sin(T * 0.8) * 1.2, o: pk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, -20], [3, 40], [4, 90], [5, 120], [6, 110], [7, 60], [8, 80], [9, 40], [10, S.portrait ? -420 : -60]]);   // phone: follow the two who slip away
      S.cam.y = kf(t, [[0, -60], [1, -90], [2, -40], [3, -20], [4, -30], [5, -10], [6, 0], [7, 0], [8, -50], [9, -20], [10, -10]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.0], [3, 1.06], [4, 1.1], [5, 1.14], [6, 1.08], [7, 1.12], [8, 1.04], [9, 1.02], [10, 1.02]]);
    };
  },
};
