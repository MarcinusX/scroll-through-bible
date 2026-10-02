// Mt 14,22–23 — at once He makes the disciples get into the boat and go ahead to the other side, while He sends
// the crowds home with a blessing. Then He climbs the mountain alone to pray. Evening falls, the stars come out:
// the boat is a speck far out on the lake, and He is there alone, kneeling in a small light.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, waveStrip, palm, reeds, rock, grass, sun, moon, stars, olive, cypress } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, labelTag, mob, EVENING, NIGHT2, tr, PI } from './lib.js';

const Y = 706;
const MX = -130;   // the mountain moved left so phones see the peak
const PEAK = [1110 + MX, 346];
const PATH = [[850, 640], [910, 604], [1000, 578], [950, 522], [1030, 472], [990, 422], [1080, 382]].map(([x, y]) => [x + MX, y]).concat([PEAK]);

function alongPath(u) {
  let tot = 0; const seg_ = [];
  for (let i = 1; i < PATH.length; i++) { const l = Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]); seg_.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < seg_.length; i++) {
    if (d <= seg_[i] || i === seg_.length - 1) { const k = Math.min(1, d / seg_[i]); return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * k, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * k, PATH[i + 1][0] >= PATH[i][0]]; }
    d -= seg_[i];
  }
  return [...PEAK, true];
}

export default {
  id: 'mt14-mountain',
  beats: [
    { v: 22 },
    { v: 23, text: 'Gdy to uczynił, wyszedł sam jeden na górę, aby się modlić.' },
    { v: 23, cont: true, text: 'Wieczór zapadł, a On sam tam przebywał.' },
  ],
  cam: { x: [-180, 120], y: [-80, 60], z: [0.96, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, EVENING, { name: 'dusk' });
    const night = sky(S, NIGHT2, { name: 'night' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -400, y1: 420, n: 150 }));
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 380, y: 360, len: 900 });
    const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".55"/>${moon(c, 40)}`, { x: 520, y: 170, len: 900 });
    const sign = hanging(hangL, labelTag(tr('← na drugi brzeg', '← to the other side'), 22), { x: 0, y: 0, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [14, 7, 3], lens: [1100, 380, 140], color: '#b9a7b4' }).markup);
    const lake = S.layer({ par: 0.3, sh: 2 });
    lake.add(waterBand(c, { y: 490, color: C.lake2, foamN: 30 }).markup);
    const farBoat = lake.add(`<g>${(() => { const b = boat(c, { mast: true }); return b.back + b.front; })()}</g>`);
    const moonPath = lake.add(`<g>${Array.from({ length: 10 }, (_, i) => `<path d="${c.cut([[-34, 0], [0, -2], [34, 0], [0, 1.6]], 0.2, 8)}" fill="#f5ecd6" transform="translate(${c.rr(-16, 16)} ${i * 20}) scale(${1 - i * 0.05} 1)"/>`).join('')}</g>`);

    /* the mountain */
    const mtn = S.layer({ par: 0.38, sh: 3 });
    const mp = [[740, 700], [820, 620], [900, 560], [970, 470], [1040, 390], [1110, 342], [1180, 380], [1260, 440], [1380, 520], [1500, 560], [2500, 600], [2500, 1700], [740, 1700]].map(([x, y]) => [x + MX, y]);
    mtn.add(sheet().p(c.cut(mp, 1.6, 10), mix(C.hillMid, C.duskViolet, 0.2)).out());
    mtn.add(sheet().p(c.ribbon(PATH.map(([x, y]) => [x, y + 2]), 7), mix(C.sand, C.dune, 0.4)).out());
    mtn.add(cypress(c, 1170 + MX, 392, 60) + olive(c, 1320 + MX, 500, 0.5) + rock(c, PEAK[0] + 34, PEAK[1] + 6, 40, 20, C.rock2));
    const jClimb = S.puppet(mtn.add(person(c, { ...CAST.jesus })));
    const jPray = S.puppet(mtn.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const prayGlow = mtn.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`);

    /* the shore */
    const shore = S.layer({ par: 0.5, sh: 3 });
    const sfn = c.wave(660, [5, 2], [700, 180]);
    const sp = [];
    for (let x = 300; x <= 2500; x += 14) sp.push([x, sfn(x) + (x < 520 ? (520 - x) * 0.5 : 0)]);
    sp.push([2500, 1700], [200, 1700]);
    shore.add(sheet().p(c.cut(sp, 0.8, 10), C.sand).out());
    shore.add(reeds(c, 380, 690, 10, 70) + palm(c, 1470, 670, 240) + grass(c, { x0: 600, x1: 2000, y: 664, fn: sfn, n: 30, h: 12, color: C.olive }));
    // the crowd going home: three still groups that walk off on the compositor
    const crowdL = S.layer({ par: 0.52, sh: 4 });
    const GROUPS = [[930, 690, 0], [1110, 684, 0.08], [1290, 694, 0.16]].map(([x, y, d], i) => ({ x, y, d, i, sp: crowdL.sprite(mob(c, 4, { s: 0.72, spread: 40, rows: 1, flip: true, arms: 20 }), x, y), go: crowdL.sprite(mob(c, 4, { s: 0.72, spread: 40, rows: 1, flip: false, arms: 10 }), x, y) }));

    /* the boat at the water's edge, and Jesus */
    const act = S.layer({ par: 0.55, sh: 5 });
    const B = boat(c, { mast: true });
    const ONB = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((o, i) => ({ o, i, x: -90 + i * 56 }));
    const boatG = act.add(`<g><g>${B.back}</g>${ONB.map((d) => `<g data-k="ob${d.i}">${person(c, d.o)}</g>`).join('')}<g>${B.front}</g></g>`);
    const onb = ONB.map((d) => ({ ...d, p: S.puppet(S.$('ob' + d.i).firstElementChild) }));
    const walkers = ONB.map((d) => ({ ...d, p: S.puppet(act.add(person(c, d.o))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    const wv = S.layer({ par: 0.75, sh: 4, pad: 200 });
    wv.add(waveStrip(c, { y: 820, len: 170, amp: 10, color: C.lake3, x0: -1400, x1: 1000 }));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2250"/>`);

    return (t, time) => {
      const T = time;
      const nightK = es(t, 1.4, 2.4);
      night.fade(nightK);
      starL.fade(es(t, 1.8, 2.5));
      tint.fade(0.06 + nightK * 0.3);
      swing(sunEl, 380, 360 + es(t, 0, 1.6) * 320, T, 1, 0.6);
      swing(moonEl, 560, 170 + (1 - es(t, 1.9, 2.45)) * 600, T, 0.8, 0.5, 1);
      fade(moonPath, es(t, 2.1, 2.5));
      pose(moonPath, { x: 560 + S.cam.x * 0.3, y: 500 });
      wv.shift(((T * 16) % 170) - 85);

      /* v22 — He makes them board and go ahead, while He sends the crowds away */
      const board = (i) => es(t, 0.05 + i * 0.07, 0.3 + i * 0.07);
      walkers.forEach((w) => {
        const k = board(w.i);
        const x = lerp(760 - w.i * 40, 560 + w.x * 0.8, k);
        w.p.set({ x, y: Y + 6 - k * 10, s: 0.9, flip: true, o: 1 - es(t, 0.28 + w.i * 0.07, 0.32 + w.i * 0.07), walk: k > 0 && k < 1 ? x * 0.05 + w.i : undefined, blink: blinkAt(T, w.i) });
      });
      onb.forEach((d) => d.p.set({ x: d.x, y: 4, s: 0.94, o: es(t, 0.28 + d.i * 0.07, 0.32 + d.i * 0.07), flip: true, armF: 30 + bump(t, 0.6, 1.0) * 80, blink: blinkAt(T, d.i + 3) }));
      const sail = es(t, 0.5, 1.25);
      const bob = Math.sin(T * 1.4) * 2.5;
      pose(boatG, { x: lerp(560, S.portrait ? 300 : 150, sail), y: lerp(Y + 20, 610, sail) + bob, s: lerp(0.8, 0.4, sail), r: Math.sin(T * 1.1) * 0.8, o: 1 - es(t, 1.2, 1.28) });
      const sg = es(t, 0.2, 0.45, ease.back) * (1 - es(t, 1.0, 1.15));
      pose(sign, { x: 640, y: lerp(-400, 290, sg), r: Math.sin(T * 1.2) * 3, o: sg > 0.01 ? 1 : 0 });
      const far = es(t, 1.2, 2.3);
      pose(farBoat, { x: lerp(190, 560, far), y: lerp(600, 540, far) + bob * 0.3, s: lerp(0.5, 0.26, far), r: Math.sin(T * 1.1) * 1.2, o: es(t, 1.2, 1.28) });

      const bless = bump(t, 0.4, 0.98);
      jesus.set({ x: 800 - es(t, 1.0, 1.1) * 70, y: Y, s: 1.0, flip: t < 0.4 || t > 1.0, o: 1 - es(t, 1.08, 1.12), walk: t > 1.0 && t < 1.1 ? t * 60 : undefined, armF: 20 + bump(t, 0.05, 0.4) * 40, armB: 10 + bless * 150 + bump(t, 0.05, 0.4) * 90, blink: blinkAt(T) });
      GROUPS.forEach((g) => {
        const turn = es(t, 0.6 + g.d, 0.66 + g.d);
        const go = es(t, 0.62 + g.d, 1.3 + g.d);
        g.sp.set({ x: g.x, y: g.y, o: 1 - turn });
        g.go.set({ x: g.x + go * 520, y: g.y - go * 30 - (go > 0 && go < 1 ? Math.abs(Math.sin(go * 30 + g.i)) * 3 : 0), o: turn * (1 - es(t, 1.15 + g.d, 1.3 + g.d)) });
      });

      /* v23a — up the mountain alone to pray */
      const climb = es(t, 1.1, 1.7, (u) => u);
      const [cx, cy, right] = alongPath(climb);
      const kneel = es(t, 1.68, 1.74);
      jClimb.set({ x: cx, y: cy, s: lerp(0.55, 0.36, climb), flip: !right, o: es(t, 1.08, 1.12) * (1 - kneel), walk: climb > 0 && climb < 1 ? climb * 90 : undefined, blink: blinkAt(T) });
      jPray.set({ x: PEAK[0] - 4, y: PEAK[1] + 2, s: 0.36, flip: true, o: kneel, armF: 60, armB: 150, head: -16, blink: 0 });
      pose(prayGlow, { x: PEAK[0] - 6, y: PEAK[1] - 50, s: 0.6 + es(t, 2.1, 2.5) * 0.4, o: kneel * 0.8 });

      // phone: further left while the boat pulls away, so it stays in the picture
      S.cam.x = kf(t, S.portrait ? [[0, -170], [1.0, -170], [1.4, 60], [2.1, 60], [2.6, 20]] : [[0, -40], [1.0, -40], [1.4, 60], [2.1, 60], [2.6, 20]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 30], [1.5, -60], [2.1, -60], [2.6, -10]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.04], [1.5, 1.18], [2.1, 1.18], [2.6, 1.0]]);
    };
  },
};
