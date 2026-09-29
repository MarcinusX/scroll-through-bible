// Mt 15,32–33 — still on the mountain, the crowd all round Him on the slopes. Jesus calls His disciples; they come
// from both sides. "I have compassion on the multitude" — a warm heart over Him as He looks at them. "They have been with
// me three days and have nothing to eat": the sun and the moon swing across three times, night and day, three little
// day-tags come down, and people hold up their empty bowls. "I don't want to send them away hungry, or they might faint
// on the way" — a hanging picture of the road home, where people sink down with weariness. The disciples: "Where are
// we to get so much bread in a deserted place?" — they shrug, a basket is tipped up empty, a dry tumbleweed rolls by.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillSet, crowdGroup, manOf, emptyBowl, basket, loaf, speech, GLYPH, heart, tag, headAt, kf, moving, tr, PI } from './lib.js';

const JX = 800;
const DIS = [
  { o: CAST.peter, x: 905, from: 1500 }, { o: CAST.andrew, x: 690, from: 150 }, { o: CAST.james, x: 975, from: 1560 },
  { o: CAST.john, x: 625, from: 90 }, { o: CAST.matthew, x: 1045, from: 1620 }, { o: CAST.thomas, x: 555, from: 40 },
];

export default {
  id: 'mt15-compassion',
  beats: [
    { v: 32, text: 'Lecz Jezus przywołał swoich uczniów i rzekł:' },
    { v: 32, cont: true, text: '«Żal Mi tego tłumu!' },
    { v: 32, cont: true, text: 'Już trzy dni trwają przy Mnie, a nie mają co jeść.' },
    { v: 32, cont: true, text: 'Nie chcę ich puścić zgłodniałych, żeby kto nie zasłabł w drodze».' },
    { v: 33 },
  ],
  cam: { x: [-80, 60], y: [-90, 60], z: [0.96, 1.16] },
  build(S) {
    const H = hillSet(S, { skyCols: ['#d6e2d8', '#f1e7cc', '#f5e2c1'], sky2: ['#1d2349', '#2f3768', '#6a5f84'], meadow: mix(C.hillNear, C.wheat, 0.25) });
    const c = S.c;
    const { sfn, gfn } = H;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 400, n: 110 }));
    starL.fade(0);
    const moonEl = hanging(H.hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: 300, y: -300, len: 900 });
    const days = [0, 1, 2].map((i) => hanging(H.hangL, `<g transform="translate(0 24)">${tag(c, tr(`dzień ${i + 1}`, `day ${i + 1}`), { size: 20, w: 92 })}</g>`, { x: 670 + i * 130, y: 150, len: 800 }));

    /* ---------- the crowd on the slopes (weary, still) ---------- */
    const GR = [[260, 30, 6], [470, 18, 6], [680, 8, 4], [920, 8, 4], [1130, 18, 6], [1340, 30, 6]].map(([x, dy, n], i) => H.slopeL.sprite(crowdGroup('mt15-cp-' + i, n, { s: 0.44, flip: x > 800, spread: 32, rows: 2 }), x, sfn(x) + dy));
    const hungryL = S.layer({ par: 0.4, sh: 4 });
    const hungry = [[430, 0], [560, 1], [1040, 2], [1170, 3]].map(([x, i]) => {
      const el = hungryL.add(person(c, { ...manOf(c), holdF: `<g class="bowl" transform="translate(0 8)">${emptyBowl(c, 40)}</g>` }));
      return { x, i, p: S.puppet(el), bowl: el.querySelector('.bowl'), y: sfn(x) + 70 + (i % 2) * 8, seed: c.rr(0, 9) };
    });

    /* ---------- the "what if" picture: the road home ---------- */
    const vid = S.id('vclip');
    const VW = 340, VH = 200;
    const frame = sheet().p(c.cut(c.rect(-VW / 2 - 9, -9, VW + 18, VH + 18), 0.5, 8), C.ochre).p(c.cut(c.rect(-VW / 2, 0, VW, VH), 0.5, 8), '#efe3c8').out();
    const vRoad = sheet().p(c.cut([[-VW / 2, 164], [VW / 2, 140], [VW / 2, 156], [-VW / 2, 184]], 0.6, 8), C.sand2).out();
    const vHill = sheet().p(c.ridge(c.wave(116, [8, 3], [200, 70]), -VW / 2 - 10, VW / 2 + 10, VH, 10, 0.8), mix(C.sand, C.hillMid, 0.3)).out();
    const vSun = sheet().p(c.cut(c.circ(100, 44, 18, 20), 0.3, 3), C.sunDeep).out();
    const walkers = [0, 1, 2].map((i) => ({ i, stand: `<g data-k="vw${i}">${person(c, manOf(c))}</g>`, kneel: `<g data-k="vk${i}">${person(c, { ...manOf(c), pose: 'kneel' })}</g>` }));
    const vis = hanging(H.hangL, `<defs><clipPath id="${vid}"><rect x="${-VW / 2}" y="0" width="${VW}" height="${VH}"/></clipPath></defs>${frame}<g clip-path="url(#${vid})">${vHill}${vSun}${vRoad}${walkers.map((w) => w.stand + w.kneel).join('')}</g><g transform="translate(0 ${VH + 10})">${tag(c, tr('w drodze…', 'on the way…'), { size: 16, w: 110 })}</g>`, { x: 1000, y: 150, len: 900 });
    walkers.forEach((w) => { w.p = S.puppet(S.$('vw' + w.i).firstElementChild); w.k = S.puppet(S.$('vk' + w.i).firstElementChild); });

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const JY = gfn(JX) + 4;
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(L.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const heartEl = L.add(`<g><circle r="46" fill="url(#warm-glow)"/>${heart(c, 16)}</g>`);
    const fx = S.layer({ par: 0.5, sh: 5 });
    const qBread = fx.add(`<g>${speech(c, `<g transform="translate(-12 10)">${loaf(c, 14)}</g><g transform="translate(18 -2)">${GLYPH.q(c)}</g>`, { w: 84, h: 54 })}</g>`);
    const qBread2 = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 40, h: 40, flip: true })}</g>`);
    const emptyB = fx.add(`<g>${basket(c, { w: 40, h: 28 })}</g>`);
    const tumble = fx.add(`<g>${sheet().p(Array.from({ length: 10 }, () => c.ribbon(c.arc(0, 0, c.rr(10, 22), c.rr(10, 22), c.rr(0, 6), c.rr(2, 8), 8), 2)).join(''), C.wood3).out()}</g>`);

    return (t, time) => {
      const T = time;

      /* three days and nights swing by (v32c) */
      const cyc = seg(t, 2.05, 2.75) * 3;
      const ph = cyc % 1;
      const cycling = t > 2.05 && t < 2.75;
      const night = cycling ? Math.max(0, Math.sin(ph * PI * 2 - PI / 2)) * 0.9 : 0;
      H.sky2.fade(night);
      starL.fade(night);
      const sx = cycling ? lerp(260, 1340, ph) : 1200, sy = cycling ? 380 - Math.sin(ph * PI) * 260 : 150;
      H.update(T, { sunX: sx, sunY: sy });
      const mph = (ph + 0.5) % 1;
      swing(moonEl, lerp(260, 1340, mph), cycling ? 380 - Math.sin(mph * PI) * 240 : -400, T, 0.8, 0.5, 1);
      days.forEach((d, i) => {
        const on = es(t, 2.08 + i * 0.22, 2.3 + i * 0.22, ease.back) * (1 - es(t, 3.0, 3.3));
        swing(d, 670 + i * 130, 150 - (1 - on) * 700, T, 1.5, 0.9, i);
      });
      hungry.forEach((h) => {
        const up = bump(t, 2.3 + h.i * 0.06, 2.98) + bump(t, 1.2 + h.i * 0.05, 1.95) * 0.5;
        h.p.set({ x: h.x, y: h.y, s: 0.66, flip: h.x > 800, armF: 10 + up * 150, head: -up * 14 + 6, blink: blinkAt(T, h.seed) });
        pose(h.bowl, { x: 0, y: 8, r: -up * 185 });
      });

      /* v32d — the vision of the road home */
      const vOn = es(t, 3.02, 3.3) * (1 - es(t, 3.95, 4.2));
      swing(vis, S.portrait ? 870 : 1010, (S.portrait ? 200 : 160) - (1 - vOn) * 700, T, 0.8, 0.7, 3);
      walkers.forEach((w) => {
        const x = -130 + w.i * 60 + seg(t, 3.1, 3.8) * 140;
        const faint = w.i === 1 ? es(t, 3.5, 3.56) : 0;
        const sag = w.i === 2 ? es(t, 3.4, 3.8) : 0;
        w.p.set({ x, y: 172 - w.i * 8, s: 0.52, o: 1 - faint, walk: t > 3.1 && t < 3.8 ? x * 0.08 : undefined, lean: sag * 14, head: sag * 20 });
        w.k.set({ x: -130 + 60 + seg(t, 3.1, 3.5) * 140 * 0.57, y: 172 - 8, s: 0.52, o: faint, lean: 8 + es(t, 3.56, 3.8) * 16, head: 26, armF: 50 + es(t, 3.56, 3.8) * 30 });
      });

      /* v32a — the disciples come from both sides */
      dis.forEach((d) => {
        const keys = [[0.1 + d.i * 0.05, d.from], [0.75 + d.i * 0.04, d.x]];
        const x = kf(t, keys, ease.out);
        const go = moving(t, keys, 1);
        const shrug = bump(t, 4.08 + (d.i % 3) * 0.05, 4.95);
        const listen = es(t, 0.9, 1.1);
        d.p.set({
          x, y: gfn(d.x) + 18 + (d.i % 2) * 8, s: 0.88, flip: t < 0.9 ? d.from > 800 : d.x > 800, walk: go ? x * 0.05 : undefined,
          armF: shrug * (70 + (d.i % 2) * 20) + bump(t, 3.1, 3.9) * (d.i === 0 ? 30 : 0), armB: shrug * 110, head: listen * -4 + shrug * 8, blink: blinkAt(T, d.seed),
        });
      });
      const beckon = bump(t, 0.05, 0.9);
      const comp = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.1));
      const point = bump(t, 2.05, 2.95);
      const farPoint = bump(t, 3.02, 3.95);
      jesus.set({
        x: JX, y: JY, s: 0.98, flip: t < 0.5 || (t > 3 && t < 3.95),
        armF: 12 + beckon * (70 + Math.sin(t * 36) * 16) + comp * 50 + point * 70 + farPoint * 95 + es(t, 4.1, 4.4) * 20,
        armB: 8 + comp * 30 + beckon * 20, head: comp * 10 - farPoint * 10, blink: blinkAt(T),
      });
      const hb = 1 + (T ? Math.sin(T * 3) * 0.06 : 0);
      pose(heartEl, { x: JX + 12, y: JY - 210, s: comp * hb * 1.1, o: comp > 0.02 ? 1 : 0 });

      /* v33 — "Where would we get so much bread in the wilderness?" */
      const q = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.95, 5.1));
      pose(qBread, { x: 928, y: JY - 200, s: q, o: q > 0.02 ? 1 : 0, r: T ? Math.sin(T * 2) * 3 : 0 });
      pose(qBread2, { x: 660, y: JY - 190, s: es(t, 4.25, 4.45, ease.back) * (1 - es(t, 4.95, 5.1)) * 0.9, o: t > 4.2 && t < 5.1 ? 1 : 0 });
      const tip = es(t, 4.2, 4.5);
      pose(emptyB, { x: 1080, y: JY - 70 + tip * 10, r: tip * 150, s: 0.9, o: t > 4.05 ? es(t, 4.05, 4.2) : 0 });
      const roll = seg(t, 4.1, 5.0);
      pose(tumble, { x: lerp(-100, 1700, roll), y: JY + 40 - Math.abs(Math.sin(roll * 14)) * 22, r: roll * 900, o: roll > 0 && roll < 1 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.8, 1.4) * 0.1 - es(t, 1.9, 2.1) * 0.12 + es(t, 4, 4.5) * 0.06;
      S.cam.y = es(t, 0.8, 1.4) * 40 - es(t, 1.9, 2.1) * 90 + es(t, 3.9, 4.3) * 50;
      S.cam.x = es(t, 2.9, 3.2) * 40 * (1 - es(t, 3.9, 4.2));
    };
  },
};
