// Mk 8,1–4 — a great crowd in a deserted place, three days with nothing to eat.
// Days and nights swing past on the fly-lines; a little "what if" picture hangs down
// (people fainting on the way home); a dotted trail shows how far some have come.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, moon, cloud, stars, rock, grass, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, heart, speech, GLYPH, loaf, man, traveller, emptyBowl, desert, shrub, basket, tag, PI } from './lib.js';

const GY = 548;          // where the crowd stands
const FY = 668;          // Jesus and the disciples
const DIS = [
  { o: CAST.peter, x: 905, from: 1500 }, { o: CAST.andrew, x: 690, from: 150 }, { o: CAST.james, x: 975, from: 1560 },
  { o: CAST.john, x: 625, from: 90 }, { o: CAST.matthew, x: 1040, from: 1620 }, { o: CAST.thomas, x: 560, from: 40 },
];

export default {
  id: 'm8-hungry',
  beats: [
    { cover: true },
    { v: 1, text: 'W owym czasie, gdy znowu wielki tłum był z Nim i nie mieli co jeść,' },
    { v: 1, cont: true, text: 'przywołał do siebie uczniów i rzekł im:' },
    { v: 2 },
    { v: 3, text: 'A jeśli ich puszczę zgłodniałych do domu, zasłabną w drodze;' },
    { v: 3, cont: true, text: 'bo niektórzy z nich przyszli z daleka».' },
    { v: 4 },
  ],
  cam: { x: [-130, 60], y: [-90, 90], z: [0.94, 1.2] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SUNX = P ? 1010 : 1180;   // phone: the resting sun clear of the thread
    const DAY = ['#d6e2d8', '#f1e7cc', '#f5e2c1'];
    const sk = sky(S, DAY);
    const nightL = sky(S, ['#1d2349', '#2f3768', '#6a5f84'], { name: 'night' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 110 }));

    /* ---------- the fly system: sun, moon, clouds, three day-tags ---------- */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: SUNX, y: 170, len: 800 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 300, y: -300, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 480, y: 160, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1000, y: 230, len: 700 });
    const days = [0, 1, 2].map((i) => hanging(hangL, `${sun(c, 16)}<g transform="translate(0 24)">${tag(c, tr(`dzień ${i + 1}`, `day ${i + 1}`), { size: 15, w: 70 })}</g>`, { x: (P ? 600 : 690) + i * 110, y: 150, len: 700 }));

    /* ---------- the deserted place ---------- */
    const land = desert(S, { farY: 410, midY: 468 });
    // a far town on the horizon (where some came from) and the road winding down
    const farL = S.layer({ par: 0.1, sh: 2 });
    const TX = 610, TY = 404;
    farL.add(house(c, TX - 40, TY + 2, 30, 20, { stairs: false }) + house(c, TX - 6, TY - 4, 26, 24, { stairs: false }) + house(c, TX + 24, TY + 4, 34, 18, { stairs: false }));

    const groundL = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(GY - 24, [5, 2], [700, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out());
    // the road home, off to the right
    const road = [];
    for (let i = 0; i <= 20; i++) { const u = i / 20; road.push([lerp(1600, 1150, u) + Math.sin(u * 5) * 30, lerp(GY - 20, GY - 26, u)]); }
    groundL.add(shrub(c, 250, GY - 14, 46) + shrub(c, 1420, GY - 16, 40) + shrub(c, 1180, GY - 20, 30) + rock(c, 470, GY - 12, 60, 24, C.rock2) + rock(c, 1300, GY - 18, 44, 18));
    groundL.add(grass(c, { x0: -600, x1: 2200, y: GY - 22, fn: gfn, n: 26, h: 10, color: C.olive }));
    // the long dotted trail from the far town down to the travellers
    // phone: the trail stays inside the screen and ends at the travellers
    const trailPts = P
      ? [...c.qbez([TX, TY + 6], [760, 420], [560, 436], 10), ...c.qbez([540, 437], [420, 440], [455, 452], 8).slice(1), ...c.qbez([455, 452], [490, 470], [485, 590], 12).slice(1)]
      : [...c.qbez([TX, TY + 6], [760, 420], [560, 436], 10), ...c.qbez([540, 437], [330, 440], [380, 452], 8).slice(1), ...c.qbez([380, 452], [430, 470], [455, 590], 12).slice(1)];

    /* ---------- the great crowd ---------- */
    const crowdL = S.layer({ par: 0.34, sh: 3 });
    const people = crowd(S, crowdL, [
      { y: GY - 22, s: 0.34, n: 26, x0: 60, x1: 1540 },
      { y: GY - 6, s: 0.4, n: 20, x0: 100, x1: 1500 },
      { y: GY + 12, s: 0.47, n: 16, x0: 150, x1: 1460 },
    ]).filter((m) => !(m.y > GY + 4 && m.x > 440 && m.x < 560));
    // hungry ones holding up empty bowls; travellers who came from far
    const hungryL = S.layer({ par: 0.36, sh: 4 });
    const hungry = [[640, 0.5], [760, 0.52], [870, 0.5], [1010, 0.52], [1140, 0.5]].map(([x, s], i) => {
      const el = hungryL.add(person(c, { ...man(c), holdF: `<g class="bowl" transform="translate(0 8)">${emptyBowl(c, 44)}</g>` }));
      return { p: S.puppet(el), bowl: el.querySelector('.bowl'), x, s, i, y: GY + 20 + (i % 2) * 6, seed: c.rr(0, 9) };
    });

    const trailL = S.layer({ par: 0.3, sh: 2 });
    const dots = trailPts.map(([x, y], i) => trailL.add(`<path d="${c.cut(c.circ(x, y, 3 + i * 0.08, 8), 0.2, 2)}" fill="${C.terracotta}" opacity="0"/>`));
    /* ---------- the "what if" picture: people fainting on the way home ---------- */
    const visL = S.layer({ par: 0.12, sh: 6 });
    const vid = S.id('vclip');
    const VW = 340, VH = 200;
    const frame = sheet().p(c.cut(c.rect(-VW / 2 - 9, -9, VW + 18, VH + 18), 0.5, 8), C.ochre).p(c.cut(c.rect(-VW / 2, 0, VW, VH), 0.5, 8), '#efe3c8').out();
    const vRoad = sheet().p(c.cut([[-VW / 2, 164], [VW / 2, 140], [VW / 2, 156], [-VW / 2, 184]], 0.6, 8), C.sand2).out();
    const vHill = sheet().p(c.ridge(c.wave(116, [8, 3], [200, 70]), -VW / 2 - 10, VW / 2 + 10, VH, 10, 0.8), mix(C.sand, C.hillMid, 0.3)).out();
    const vSun = sheet().p(c.cut(c.circ(100, 44, 18, 20), 0.3, 3), C.sunDeep).out();
    const walkers = [0, 1, 2].map((i) => ({ i, stand: `<g data-k="vw${i}">${person(c, man(c))}</g>`, kneel: `<g data-k="vk${i}">${person(c, { ...man(c), pose: 'kneel' })}</g>` }));
    const vis = hanging(visL, `<defs><clipPath id="${vid}"><rect x="${-VW / 2}" y="0" width="${VW}" height="${VH}"/></clipPath></defs>${frame}<g clip-path="url(#${vid})">${vHill}${vSun}${vRoad}${walkers.map((w) => w.stand + w.kneel).join('')}</g><g transform="translate(0 ${VH + 10})">${tag(c, tr('w drodze…', 'on the way…'), { size: 16, w: 110 })}</g>`, { x: S.portrait ? 870 : 1050, y: 190, len: 900 });
    walkers.forEach((w) => { w.p = S.puppet(S.$('vw' + w.i).firstElementChild); w.k = S.puppet(S.$('vk' + w.i).firstElementChild); });

    /* ---------- Jesus and the disciples ---------- */
    const frontL = S.layer({ par: 0.55, sh: 5 });
    const travs = (P ? [[455, 0.66], [505, 0.7]] : [[430, 0.66], [482, 0.7]]).map(([x, s], i) => ({ p: S.puppet(frontL.add(person(c, traveller(c)))), x, s, i, y: FY - 30 + i * 12, seed: c.rr(0, 9) }));
    const dis = DIS.map((d, i) => ({ ...d, x: P ? 800 + (d.x - 800) * 0.82 : d.x, i, p: S.puppet(frontL.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(frontL.add(person(c, { ...CAST.jesus })));
    const heartEl = frontL.add(`<g>${heart(c, 13)}</g>`);
    const bubL = S.layer({ par: 0.55, sh: 4 });
    const qBread = bubL.add(`<g>${speech(c, `<g transform="translate(-12 10)">${loaf(c, 14)}</g><g transform="translate(18 -2)">${GLYPH.q(c)}</g>`, { w: 84, h: 54 })}</g>`);
    const qBread2 = bubL.add(`<g>${speech(c, GLYPH.q(c), { w: 40, h: 40, flip: true })}</g>`);
    const emptyB = bubL.add(`<g>${basket(c, { w: 40, h: 28 })}</g>`);
    // a dry tumbleweed rolls through the empty land
    const tumble = bubL.add(`<g>${sheet().p(Array.from({ length: 10 }, () => c.ribbon(c.arc(0, 0, c.rr(10, 22), c.rr(10, 22), c.rr(0, 6), c.rr(2, 8), 8), 2)).join(''), C.wood3).out()}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 170, 900, 260, 110, C.rock2) + rock(c, 1440, 910, 240, 100, C.rock) + shrub(c, 320, 880, 90, C.olive) + shrub(c, 1290, 890, 80, C.moss));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* three days and nights swing by during v2 */
      const cyc = seg(t, 3.02, 3.8) * 3;
      const ph = cyc % 1, n = Math.min(2, Math.floor(cyc));
      const cycling = t > 3.02 && t < 3.8;
      const night = cycling ? Math.max(0, Math.sin(ph * PI * 2 - PI / 2)) * 0.9 : 0;
      nightL.fade(night);
      starL.fade(night);
      sk.blend(DAY, ['#dcd9cf', '#f3dcbc', '#f4d8b4'], es(t, 4, 6));
      const sx = cycling ? lerp(260, P ? 1120 : 1340, ph) : SUNX, sy = cycling ? 380 - Math.sin(ph * PI) * 260 : 170;
      swing(sunEl, sx, cycling ? sy : 170, T, 1.1, 0.7);
      const mph = (ph + 0.5) % 1;
      swing(moonEl, lerp(260, 1340, mph), cycling ? 380 - Math.sin(mph * PI) * 240 : -400, T, 0.8, 0.5, 1);
      swing(cl1, 480 + Math.sin(T * 0.1) * 26, 160 - bump(t, 3, 3.9) * 400, T, 1.4, 0.6, 1);
      swing(cl2, 1000 + Math.sin(T * 0.13 + 2) * 26, 230 - bump(t, 3, 3.9) * 400, T, 1.4, 0.8, 2);
      days.forEach((d, i) => {
        const on = es(t, 3.05 + i * 0.26, 3.3 + i * 0.26, ease.back) * (1 - es(t, 4.1, 4.5));
        swing(d, (P ? 600 : 690) + i * 110, 150 - (1 - on) * (P ? 760 : 420), T, 1.5, 0.9, i);   // phone: parked out of sight
      });

      /* the crowd: quiet, weary; some hold up empty bowls (v1) */
      const weary = es(t, 1, 1.5);
      people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: 6 * weary * ((m.i % 3) - 1), blink: blinkAt(T, m.seed) }));
      hungry.forEach((h) => {
        const up = bump(t, 1.08 + h.i * 0.07, 1.95 + h.i * 0.04) + bump(t, 3.5, 3.98) * 0.7;
        const shake = Math.sin(T * 9 + h.i) * 10 * up;
        h.p.set({ x: h.x, y: h.y, s: h.s, flip: h.x > 800, armF: 10 + up * 150 + shake * 0.4, head: -up * 14 + weary * 6, blink: blinkAt(T, h.seed) });
        pose(h.bowl, { x: 0, y: 8, r: -up * 185 + shake });
      });
      travs.forEach((m) => {
        const hi = bump(t, 5.2 + m.i * 0.08, 6.0);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, armF: 16 + hi * 40, armB: 10 + hi * 20, head: -hi * 8, blink: blinkAt(T, m.seed) });
      });
      dots.forEach((d, i) => fade(d, seg(t, 5.05 + i * 0.022, 5.12 + i * 0.022) * (1 - es(t, 6.2, 6.5)) * 0.9));

      /* the vision of the road home (v3a) */
      const vOn = es(t, 4.0, 4.35) * (1 - es(t, 5.0, 5.35));
      swing(vis, S.portrait ? 870 : 1050, (S.portrait ? 230 : 190) - (1 - vOn) * (S.portrait ? 1000 : 700), T, 0.8, 0.7, 3);
      walkers.forEach((w) => {
        const x = -130 + w.i * 60 + seg(t, 4.2, 4.95) * 140;
        const faint = w.i === 1 ? es(t, 4.6, 4.66) : 0;
        const sag = w.i === 2 ? es(t, 4.5, 4.9) : 0;
        w.p.set({ x, y: 172 - w.i * 8, s: 0.52, o: 1 - faint, walk: t > 4.2 && t < 4.95 ? x * 0.08 : undefined, lean: sag * 14, head: sag * 20 });
        w.k.set({ x: -130 + 60 + seg(t, 4.2, 4.6) * 140 * 0.53, y: 172 - 8, s: 0.52, o: faint, lean: 8 + es(t, 4.66, 4.9) * 16, head: 26, armF: 50 + es(t, 4.66, 4.9) * 30 });
      });

      /* v1b — Jesus calls the disciples; they come from both sides */
      dis.forEach((d) => {
        const keys = [[2.0 + d.i * 0.06, d.from], [2.62 + d.i * 0.06, d.x]];
        const x = kf(t, keys, ease.out);
        const go = moving(t, keys, 1);
        const shrug = bump(t, 6.08 + (d.i % 3) * 0.05, 6.95);
        const listen = es(t, 2.7, 3);
        d.p.set({
          x, y: FY + (d.i % 2) * 8, s: 0.86, flip: t < 2.7 ? d.from > 800 : d.x > 800,
          walk: go ? x * 0.05 : undefined,
          armF: shrug * (70 + (d.i % 2) * 20) + bump(t, 4.1, 4.9) * (d.i === 0 ? 30 : 0), armB: shrug * 110,
          head: listen * -6 + shrug * 8, blink: blinkAt(T, d.seed),
        });
      });
      const beckon = bump(t, 1.95, 2.75);
      const compassion = es(t, 3.0, 3.25) * (1 - es(t, 3.9, 4.1));
      const point = bump(t, 4.02, 4.95);
      const farPoint = bump(t, 5.0, 5.95);
      jesus.set({
        x: 800, y: FY + 4, s: 0.96, flip: t < 1.9 || (t > 4.9 && t < 5.95),
        armF: 12 + beckon * (70 + Math.sin(T * 6) * 16) + compassion * 50 + point * 80 + farPoint * 95 + es(t, 6.1, 6.4) * 20,
        armB: 8 + compassion * 20 + beckon * 20,
        head: -es(t, 1, 1.4) * 6 * (1 - beckon) + compassion * 10 - farPoint * 10, blink: blinkAt(T),
      });
      const hb = 1 + Math.sin(T * 3) * 0.06;
      pose(heartEl, { x: 812, y: FY - 118, s: compassion * hb * 0.95, o: compassion > 0.02 ? 1 : 0 });

      /* v4 — "from where…?" */
      const q = es(t, 6.1, 6.3, ease.back) * (1 - es(t, 6.95, 7.1));
      pose(qBread, { x: 928, y: FY - 196, s: q, o: q > 0.02 ? 1 : 0, r: Math.sin(T * 2) * 3 });
      pose(qBread2, { x: 660, y: FY - 190, s: es(t, 6.25, 6.45, ease.back) * (1 - es(t, 6.95, 7.1)) * 0.9, o: t > 6.2 && t < 7.1 ? 1 : 0 });
      const tip = es(t, 6.2, 6.5);
      pose(emptyB, { x: 1050, y: FY - 60 + tip * 10, r: tip * 150, s: 0.9, o: t > 6.05 ? es(t, 6.05, 6.2) : 0 });
      const roll = seg(t, 6.1, 7.0);
      pose(tumble, { x: lerp(-100, 1700, roll), y: 700 - Math.abs(Math.sin(roll * 14)) * 22, r: roll * 900, o: roll > 0 && roll < 1 ? 1 : 0 });

      /* camera */
      S.cam.z = 1 + es(t, 0.6, 1.8) * 0.16 - es(t, 2.9, 3.1) * 0.16 + es(t, 3.85, 4.2) * 0.04 + es(t, 6, 6.6) * 0.04;
      S.cam.y = es(t, 0.6, 1.8) * 70 - es(t, 2.9, 3.1) * 130 + es(t, 3.85, 4.2) * 110;
      S.cam.x = es(t, 4.8, 5.3) * (P ? -125 : -60) * (1 - es(t, 5.9, 6.3));   // phone: further, to see who came from far
    };
  },
};
