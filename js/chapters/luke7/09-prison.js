// Łk 7,18–19 — John in Herod's prison: a stone cell lit by one barred window high up, John on the bench with a chain
// on his ankle. His disciples have come in to him and tell him about all these things: a cloud of pictures rises
// from them — the centurion's servant on his feet, the young man of Nain sitting up on his bier. John lifts his head;
// he calls two of them to him. Then he sends them to the Lord with his question — "Are you the one who is to come,
// or shall we look for another?" — and the two go out through the door with the question going before them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { JOHN_B, JD, SERVANT, YOUTH, figure, carriedBier, bubble, question, sparkle, headAt, voiceRings, kf, moving, tr, PI } from './lib.js';

const FLOOR = 700, JX = 980, WX = 1060, DOOR = 380;
const J3 = { robe: mix(C.dune, C.stone2, 0.4), fur: true, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };

export default {
  id: 'lk7-prison',
  beats: [
    { v: 18 },
    { v: 19 },
  ],
  cam: { x: [-60, 40], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const skyL = S.layer({ par: 0, sky: true });
    skyL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.duskViolet, C.dusk, 0.4)}"/>`);
    /* the cell: stone walls, a high barred window, a door on the left */
    const wallL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.stone2, C.clay, 0.25);
    const w = sheet();
    const win = c.rect(WX - 60, 200, 120, 110);
    const door = [[DOOR - 70, FLOOR + 4], [DOOR - 70, 470], ...c.arc(DOOR, 470, 70, 60, PI, 2 * PI, 12), [DOOR + 70, FLOOR + 4]];
    wallL.add(sheet().p(c.cut(c.rect(WX - 70, 190, 140, 130), 0.3, 5), mix(C.dusk, C.apricot, 0.5)).p(c.cut(c.rect(DOOR - 80, 400, 160, 330), 0.3, 5), mix(C.soilDark, C.plumRobe, 0.3)).out());
    w.p(c.cut([[-900, -1400], [2500, -1400], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.4, 5) + c.hole(door, 0.4, 6), wcol);
    let blk = '';
    for (let y = 60; y < FLOOR - 10; y += 44) for (let x = -900 + (Math.round(y / 44) % 2) * 40; x < 2500; x += 96) {
      if (x + 88 > WX - 70 && x < WX + 70 && y + 36 > 190 && y < 320) continue;
      if (x + 88 > DOOR - 80 && x < DOOR + 80 && y + 36 > 400) continue;
      blk += c.cut(c.rect(x, y, 88, 36), 0.6, 8);
    }
    w.x(blk, shade(wcol, -0.08), 'opacity=".6"');
    w.p(c.ribbon(door.slice(1, -1), 12), shade(C.wood2, -0.1));
    let bars = '';
    for (let x = WX - 42; x <= WX + 42; x += 21) bars += c.ribbon([[x, 196], [x, 316]], 6);
    w.p(bars + c.ribbon([[WX - 64, 254], [WX + 64, 254]], 6), mix(C.rock3, C.soilDark, 0.3));
    // the chain ring in the wall
    w.p(c.cut(c.circ(1140, 600, 10, 12), 0.3, 3) + c.hole(c.circ(1140, 600, 5, 10), 0.2, 3), C.rock3);
    wallL.add(w.out());
    const floorL = S.layer({ par: 0.4, sh: 3 });
    const f = sheet().p(c.cut([[-900, FLOOR - 4], [2500, FLOOR - 4], [2500, 1700], [-900, 1700]], 1, 30), mix(C.rock2, C.soil, 0.2));
    let straw = '';
    for (let i = 0; i < 40; i++) { const x = c.rr(820, 1260), y = c.rr(FLOOR + 6, FLOOR + 40); straw += c.ribbon([[x, y], [x + c.rr(-14, 14), y + c.rr(-3, 3)]], 1.6); }
    f.x(straw, C.wheat2, 'opacity=".8"');
    floorL.add(f.out());
    // the light falling through the window (behind the people)
    const lightL = S.layer({ par: 0.4, sh: 0, flat: true });
    const shaft = lightL.add(`<g><path d="${c.poly([[WX - 56, 250], [WX + 56, 250], [WX - 20, FLOOR + 30], [WX - 250, FLOOR + 30]])}" fill="#fbe3b0" opacity=".32"/></g>`);
    const hope = lightL.add(`<circle r="130" fill="url(#warm-glow)" opacity="0"/>`);
    /* the bench, John, the chain */
    const P = S.layer({ par: 0.4, sh: 5 });
    P.add(sheet().p(c.cut([[880, FLOOR], [880, 666], [1120, 664], [1120, FLOOR]], 0.5, 6), mix(C.stone2, C.rock2, 0.4)).p(c.cut(c.rect(870, 656, 260, 14), 0.4, 6), shade(C.stone2, 0.08)).out());
    const john = S.puppet(P.add(person(c, { ...JOHN_B, pose: 'sit' })));
    const johnUp = S.puppet(P.add(person(c, JOHN_B)));
    let ch = '';
    for (let i = 0; i < 18; i++) { const u = i / 17, x = lerp(1140, 950, u), y = lerp(604, FLOOR - 8, u) + Math.sin(u * PI) * 40; ch += c.cut(c.ell(x, y, 8, 5, 8, -0.6 + u + (i % 2) * 1.2), 0.2, 2) + c.hole(c.ell(x, y, 4.4, 2, 6, -0.6 + u + (i % 2) * 1.2), 0.2, 2); }
    P.add(`<path d="${ch}" fill="${C.rock3}"/>`);
    /* his disciples */
    const dis = [JD[0], JD[1], J3].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const talk = voiceRings(P, c, { n: 2, color: C.clay, r: 26, w: 4 });
    const jv = voiceRings(P, c, { n: 3, color: C.clay, r: 30, w: 4 });
    /* the news: a cloud of pictures */
    const fx = S.layer({ par: 0.42, sh: 4 });
    const cloudPts = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; cloudPts.push(...c.arc(Math.cos(a) * 130, Math.sin(a) * 70, 36, 32, a - 1.1, a + 1.1, 5)); }
    const cl = sheet().p(c.cut(cloudPts, 0.6, 6), C.cream).p(c.cut(c.circ(-60, 96, 12, 12), 0.3, 4) + c.cut(c.circ(-86, 120, 7, 10), 0.3, 3), C.cream).out();
    const servant = figure(c, SERVANT, { x: -74, y: 50, s: 0.5, armF: 150, armB: 160, head: -10 });
    const youth = `<g transform="translate(44 26) scale(.6)">${carriedBier(c, 150)}</g>` + figure(c, { ...YOUTH, robe: C.linen, pose: 'sit' }, { x: 32, y: 26, s: 0.5, flip: true, armF: 60, armB: 120, head: -8 });
    const news = fx.add(`<g opacity="0">${cl}${servant}${youth}<g transform="translate(96 -30)">${sparkle(c, 16, C.halo)}</g></g>`);
    const ask = fx.add(`<g opacity="0">${bubble(c, [tr('Czy Ty jesteś Tym, który ma przyjść,', 'Are you the one who is coming,'), tr('czy też innego mamy oczekiwać?', 'or should we look for another?')], { size: 20, dir: 1 })}</g>`);
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      /* v18 — his disciples tell him all these things; he calls two of them */
      const tell = bump(t, 0.05, 0.55);
      const hear = es(t, 0.25, 0.45);
      const call = es(t, 0.6, 0.75) * (1 - es(t, 1.2, 1.3));
      const up = es(t, 1.04, 1.1);
      john.set({ x: JX, y: FLOOR, s: 1.08, flip: true, o: 1 - up, armF: 20 + hear * 30 + call * 60, armB: 10 + call * 20, head: 18 - hear * 26, lean: -hear * 4, blink: blinkAt(T, 2) });
      const send = es(t, 1.1, 1.25) * (1 - es(t, 1.8, 1.95) * 0.5);
      johnUp.set({ x: JX - 10, y: FLOOR, s: 1.08, flip: true, o: up, armF: 30 + send * 60, armB: 10 + send * 30, head: -4, blink: blinkAt(T, 2) });
      pose(hope, { x: JX - 20, y: FLOOR - 170, s: 0.8 + hear * 0.4, o: hear * 0.7 });
      pose(shaft, { o: 0.7 + hear * 0.3 });
      dis.forEach((d) => {
        const base = [640, 740, 540][d.i];
        const K = d.i < 2 ? [[0, base], [0.7, base], [0.82, base + 60], [1.5, base + 60], [1.98, DOOR + 10 - d.i * 50]] : [[0, base]];
        const x = kf(t, K);
        const leaving = d.i < 2 && t > 1.5;
        d.p.set({ x, y: FLOOR + 4 + (d.i % 2) * 6, s: 1.02, flip: leaving, o: d.i < 2 ? 1 - seg(t, 1.93 + d.i * 0.02, 1.99) : 1, walk: moving(t, K) ? x * 0.05 + d.i : undefined, armF: 14 + tell * (d.i === 0 ? 70 : 30), armB: 10 + tell * (d.i === 0 ? 100 : 20) + bump(t, 1.3, 1.5) * 40, head: bump(t, 1.28, 1.48) * 18, lean: bump(t, 1.28, 1.48) * 10, blink: blinkAt(T, d.seed) });
      });
      const [dhx, dhy] = headAt(640, FLOOR + 4, 1.02);
      talk(dhx, dhy, tell, T, { dir: 1, spread: 1.6 });
      const nk = es(t, 0.12, 0.35, ease.out) * (1 - es(t, 0.85, 0.98));
      pose(news, { x: 800, y: lerp(540, 340, nk), s: 0.4 + nk * 0.75, r: T ? Math.sin(T * 1.2) * 2 : 0, o: nk > 0.02 ? 1 : 0 });

      /* v19 — he sends them to the Lord with his question */
      const [jhx, jhy] = headAt(JX - 10, FLOOR, 1.08, true);
      jv(jhx, jhy, es(t, 1.15, 1.25) * (1 - es(t, 1.8, 1.9)), T, { dir: -1, spread: 1.8 });
      const ab = es(t, 1.16, 1.28, ease.back) * (1 - es(t, 1.88, 1.94));
      pose(ask, { x: jhx - 36, y: jhy - 40, s: ab, o: ab > 0.02 ? 1 : 0 });
      const qk = es(t, 1.86, 1.94, ease.back);
      const qx = kf(t, [[1.5, 740], [1.98, DOOR]]);
      pose(q, { x: qx + 20, y: 470 + (T ? Math.sin(T * 2) * 6 : 0), s: qk * 1.1, r: T ? Math.sin(T * 2) * 8 : 0, o: qk > 0.02 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.12], [0.5, 1.14], [1.1, 1.18], [1.6, 1.12]]);
      S.cam.x = kf(t, [[0, 0], [0.5, 10], [1.1, 20], [1.8, -30]]);
      S.cam.y = kf(t, [[0, 30], [0.5, 0], [1.2, 40]]);
    };
  },
};
