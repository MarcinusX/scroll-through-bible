// Mk 5,21–24 — back on the Galilean shore a great crowd gathers round Jesus; Jairus, a leader of the
// synagogue, comes through the crowd, falls at His feet and begs for his dying little daughter;
// Jesus goes with him, and the whole crowd follows, pressing in on every side.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, sun, cloud, palm, olive, reeds, rock, grass } from '../../assets/nature.js';
import { boat, bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, synagogue, bubble, card, tag, sickGirlIcon, townsfolk } from './lib.js';

const PI = Math.PI;
const JX = 790, FEET = 716;

export default {
  id: 'm5-jairus',
  beats: [
    { v: 21, text: 'Gdy Jezus przeprawił się z powrotem w łodzi na drugi brzeg,' },
    { v: 21, cont: true, text: 'zebrał się wielki tłum wokół Niego, a On był jeszcze nad jeziorem.' },
    { v: 22, text: 'Wtedy przyszedł jeden z przełożonych synagogi, imieniem Jair.' },
    { v: 22, cont: true, text: 'Gdy Go ujrzał, upadł Mu do nóg i prosił usilnie:' },
    { v: 23 },
    { v: 24, text: 'Poszedł więc z nim,' },
    { v: 24, cont: true, text: 'a wielki tłum szedł za Nim i zewsząd na Niego napierał.' },
  ],
  cam: { x: [-80, 220], y: [-30, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SKY = ['#c6dcdb', '#eee6cc', '#f6e9cf'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1240, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 210), { x: 520, y: 150, len: 620 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1020, y: 215, len: 620 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 45, scale: 0.5 });

    /* ---------- far shore, the lake, Capernaum on its hill ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [14, 6, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
    const lake = S.layer({ par: 0.15, sh: 2 });
    lake.add(waterBand(c, { y: 430, color: C.lake, foamN: 26 }).markup);
    const hills = S.layer({ par: 0.25, sh: 3 });
    const hfn = (x) => 520 - Math.max(0, x - 700) * 0.1 + Math.sin(x / 160) * 8;
    const hp = [[560, 620], [620, 560]];
    for (let x = 640; x <= 2500; x += 14) hp.push([x, hfn(x) + c.rr(-1.2, 1.2)]);
    hp.push([2500, 1700], [560, 1700]);
    hills.add(sheet().p(c.cut(hp, 1, 10), C.hillMid).out());
    hills.add(town(c, { x: 930, y: hfn(930) + 14, n: 6, spread: 300, sc: 0.62 }) + town(c, { x: 1450, y: hfn(1450) + 14, n: 7, spread: 360, sc: 0.62 }));
    hills.add(synagogue(c, 1110, hfn(1180) + 16, 140, 70));
    hills.add(palm(c, 700, hfn(700) + 24, 140) + olive(c, 1300, hfn(1300) + 18, 0.6) + palm(c, 1640, hfn(1640) + 20, 130));

    /* ---------- the beach ---------- */
    const beach = S.layer({ par: 0.4, sh: 3 });
    const bfn = (x) => 610 + Math.max(0, 560 - x) * 0.7 + Math.sin(x / 150) * 4;
    beach.add(waterBand(c, { y: 640, x1: 800, color: C.lake2, foamN: 10, amp: 2 }).markup);
    const bp = [];
    for (let x = 60; x <= 2500; x += 14) bp.push([x, bfn(x) + c.rr(-1.2, 1.2)]);
    bp.push([2500, 1700], [60, 1700]);
    beach.add(sheet().p(c.poly(bp), C.sand).out());
    beach.add(grass(c, { x0: 700, x1: 2200, y: 610, fn: bfn, n: 18, h: 12, color: C.olive }) + reeds(c, 420, 690, 9, 90) + rock(c, 1500, 690, 90, 34, C.rock2));

    /* ---------- the crowd (back rows) ---------- */
    const crowdL = S.layer({ par: 0.45, sh: 3 });
    const back = crowd(S, crowdL, [
      { y: 640, s: 0.66, n: 10, x0: 560, x1: 1260 },
      { y: 662, s: 0.74, n: 7, x0: 520, x1: 1300 },
    ]).filter((m) => Math.abs(m.x - JX) > 50 || m.y < 650);
    back.forEach((m) => { m.from = m.x < JX ? c.rr(-300, 100) : c.rr(1500, 1900); m.d = c.rr(0, 0.5); });

    /* ---------- the boat ---------- */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const B = boat(c, {});
    const DIS = [CAST.andrew, CAST.james, CAST.john, CAST.peter];
    const boatG = boatL.add(`<g><g>${B.back}</g>${DIS.map((d, i) => `<g data-k="bd${i}">${person(c, { ...d })}</g>`).join('')}<g data-k="jb">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g></g>`);
    const dis = DIS.map((_, i) => ({ i, p: S.puppet(S.$('bd' + i).firstElementChild), seed: c.rr(0, 9) }));
    const jBoat = S.puppet(S.$('jb').firstElementChild);

    /* ---------- Jesus, Jairus, the front of the crowd ---------- */
    const pL = S.layer({ par: 0.5, sh: 5 });
    // Peter, James and John step out of the boat and stay close to Him
    const SHORE = [[CAST.james, 560], [CAST.peter, 630], [CAST.john, 690]].map(([cast, x], i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, { ...cast }))) }));
    const FRONT = [
      [440, 0.9], [1010, 0.96], [1100, 0.94], [1190, 0.9], [1270, 0.88],
    ].map(([x, s], i) => ({ i, x, s, y: FEET + 8 + (i % 2) * 6, from: x < JX ? -200 - i * 60 : 1700 + i * 50, seed: c.rr(0, 9), d: c.rr(0, 0.4), p: S.puppet(pL.add(person(c, townsfolk(c)))) }));
    const jairus = S.puppet(pL.add(person(c, { ...LOOK.jairus })));
    const jairusK = S.puppet(pL.add(person(c, { ...LOOK.jairus, pose: 'kneel' })));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const nameTag = hanging(pL, tag(c, tr('Jair', 'Jairus'), { size: 22 }), { x: 1000, y: -1000, len: 500 });

    /* ---------- the plea ---------- */
    const wL = S.layer({ par: 0.52, sh: 4 });
    const plea = wL.add(`<g>${bubble(c, [tr('Moja córeczka dogorywa…', 'My little daughter is dying…'), tr('Przyjdź, połóż na nią ręce!', 'Come and lay your hands on her!')], { size: P ? 16 : 19, dir: -1 })}</g>`);   // phone: a smaller plea that ends before the thread
    const pic = hanging(wL, card(c, `<g transform="scale(1.3)">${sickGirlIcon(c, LOOK.girl)}</g>`, { w: 170, h: 120 }), { x: P ? 600 : 1060, y: -1000, len: 600 });

    /* ---------- foreground ---------- */
    const w1 = S.layer({ par: 0.7, sh: 3, pad: 170 });
    w1.add(waveStrip(c, { y: 860, len: 170, amp: 9, color: C.lake2, x0: -1400, x1: 260 }));
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(reeds(c, 150, 950, 14, 220, C.moss) + rock(c, 1460, 960, 240, 90, C.rock2) + rock(c, 240, 985, 150, 56, C.rock));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#cfe1dc', '#f2e9cf', '#f8edd6'], seg(t, 0, 7));
      swing(sunEl, 1240, 130, T, 1.1, 0.7);
      swing(cl1, 520 + Math.sin(T * 0.1) * 26, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1020 + Math.sin(T * 0.13 + 2) * 26, 215, T, 1.4, 0.8, 2);
      birds(T, 1);

      const walkX = es(t, 5.1, 7.0, (u) => u);
      /* v21a — the boat crosses back and lands */
      const [bx, by] = kf(t, [[0, [-280, 744]], [0.7, [P ? 600 : 470, 752]]], ease.out);   // phone: it lands further in, so Andrew at the stern is not cut by the frame
      const afloat = 1 - es(t, 0.65, 0.8);
      pose(boatG, { x: bx, y: by + Math.sin(T * 1.3) * 2 * afloat, s: 0.9, r: Math.sin(T * 1.1) * 0.8 * afloat });
      const out = es(t, 0.8, 0.86);
      jBoat.set({ x: 120, y: -4, s: 1.02, o: 1 - out, armF: 14, armB: 6, blink: blinkAt(T) });
      dis.forEach((d) => d.p.set({ x: -130 + d.i * 52, y: 0, s: 0.92, o: d.i === 0 ? 1 : 1 - es(t, 1.0 + d.i * 0.1, 1.06 + d.i * 0.1), armF: 16 + bump(t, 0.6, 1.2) * 20, armB: 10, blink: blinkAt(T, d.seed) }));
      SHORE.forEach((d) => {
        const t0 = 1.03 + (3 - d.i) * 0.1;
        const on = es(t, t0, t0 + 0.06);
        const x = kf(t, [[t0, bx + 20], [t0 + 0.4, d.x]]) + walkX * 320;
        d.p.set({ x, y: FEET - 10 + d.i * 3, s: 0.92, o: on, walk: (t > t0 && t < t0 + 0.4) || (t > 5.1 && t < 7) ? x * 0.06 : undefined, armF: 10 + bump(t, 3.2, 4.8) * (d.i === 1 ? 40 : 0), armB: 6, head: -es(t, 3.1, 3.4) * 6 * (1 - walkX), blink: blinkAt(T, d.seed) });
      });

      // Jesus: out of the boat → centre of the beach → (v24) walks off with Jairus
      const jx = kf(t, [[0.8, bx + 108], [1.3, JX]]) + walkX * 330;
      const lift = es(t, 5.0, 5.3) * (1 - es(t, 5.5, 5.7));
      const listen = es(t, 3.1, 3.4) * (1 - es(t, 5.0, 5.2));
      jesus.set({
        x: jx, y: lerp(FEET - 20, FEET, es(t, 0.8, 1.0)) - bump(t, 0.8, 1.0) * 20, s: 1, o: out, flip: false,
        walk: (t > 0.9 && t < 1.3) || (t > 5.1 && t < 7) ? jx * 0.06 : undefined,
        armF: 14 + bump(t, 1.3, 2.0) * 40 + listen * 50 + lift * 60, armB: 8 + bump(t, 1.3, 2.0) * 30, head: listen * 10, blink: blinkAt(T),
      });

      /* v21b — the crowd gathers around Him */
      back.forEach((m, i) => {
        const pr = seg(t, 1.05 + m.d * 0.5, 1.6 + m.d * 0.5);
        const follow = walkX * 300 * (m.x < JX ? 1.1 : 0.9) + es(t, 6.0, 7.0) * (JX - m.x) * 0.25;
        const x = lerp(m.from, m.x, ease.out(pr)) + follow;
        m.p.set({
          x, y: m.y, s: m.s, flip: m.x > JX + walkX * 300 ? true : false,
          walk: (pr > 0 && pr < 1) || (t > 5.1 && t < 7) ? x * 0.05 : undefined,
          armF: bump(t, 2.1, 2.9) * (i % 4 === 0 ? 50 : 0), head: -es(t, 3.1, 3.5) * 6 * (1 - walkX), blink: blinkAt(T, m.seed),
        });
      });
      const part = es(t, 2.05, 2.4) * (1 - es(t, 4.9, 5.3));
      FRONT.forEach((f) => {
        const pr = seg(t, 1.05 + f.d, 1.65 + f.d);
        const gap = f.x > JX ? part * (f.x > 1060 ? 70 : -0) + part * (f.x < 1100 && f.x > 900 ? 60 : 0) : 0;
        const press = es(t, 6.0, 6.9) * (JX + walkX * 330 - f.x) * 0.2;
        const x = lerp(f.from, f.x, ease.out(pr)) + gap + walkX * 310 + press;
        f.p.set({
          x, y: f.y, s: f.s, flip: f.x > JX, walk: (pr > 0 && pr < 1) || (t > 5.1 && t < 7) ? x * 0.05 : undefined,
          armF: 10 + es(t, 6.2, 6.8) * 50, armB: 6 + es(t, 6.2, 6.8) * (f.i % 2 ? 60 : 0), lean: es(t, 6.2, 6.8) * (f.x > JX ? -6 : 6), blink: blinkAt(T, f.seed),
        });
      });

      /* v22 — Jairus comes through the crowd and falls at His feet */
      const jaX = kf(t, [[2.0, 1500], [2.8, 930]], (u) => u) + walkX * 330;
      const kneel = es(t, 3.05, 3.12) * (1 - es(t, 5.2, 5.27));
      jairus.set({ x: jaX, y: FEET + 4, s: 1, flip: t < 5.2, o: seg(t, 1.95, 2.05) * (1 - kneel), walk: (t > 2 && t < 2.8) || (t > 5.25 && t < 7) ? jaX * 0.06 : undefined, armF: 10 + bump(t, 2.6, 3.1) * 60 + es(t, 5.3, 5.6) * 20, armB: 6, head: 4, blink: blinkAt(T, 5) });
      const bow = es(t, 3.1, 3.6);
      const plead = es(t, 4.05, 4.3);
      jairusK.set({ x: 918, y: FEET + 4, s: 1, flip: true, o: kneel, armF: 60 + bow * 30 + plead * (20 + Math.sin(t * 14) * 8), armB: 50 + plead * 60, lean: 10 + bow * 18 - plead * 14, head: bow * 10 - plead * 16, blink: blinkAt(T, 5) });
      swing(nameTag, 1000, -1000 + es(t, 2.1, 2.5, ease.back) * 1260 - es(t, 3.0, 3.3) * 1260, T, 1.6, 0.9);
      const pk = es(t, 4.05, 4.25, ease.back) * (1 - es(t, 4.9, 5.05));
      pose(plea, { x: P ? 868 : 905, y: FEET - 172, s: pk, o: pk > 0.02 ? 1 : 0 });
      swing(pic, P ? 600 : 1080,   // phone: the dying girl's picture hangs over the left of the crowd
        -1000 + es(t, 4.15, 4.55, ease.back) * 1220 - es(t, 4.9, 5.2) * 1220, T, 1.4, 0.8, 1);

      /* camera follows them as they set off */
      S.cam.x = -60 + es(t, 0.3, 1.3) * 60 + walkX * 190;
      S.cam.y = 20 + es(t, 0.8, 1.6) * 10 + bump(t, 3, 5) * 20;
      S.cam.z = 1.02 + es(t, 0.8, 1.6) * 0.04 + bump(t, 3.0, 5.1) * 0.08;
    };
  },
};
