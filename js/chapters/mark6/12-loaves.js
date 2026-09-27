// Mk 6,39–44 — the crowd sits down in green garden-bed rows, by hundreds and by fifties; Jesus looks up,
// blesses, breaks; bread and fish fly from hand to hand, everyone eats, twelve baskets are left over.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, rock, sun, cloud, grass, flowers, bush, olive } from '../../assets/nature.js';
import { bird, paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, spark, heart, loaf, fishCut, basket, crumb, labelTag, man, woman, LOOK, DY } from './lib.js';

const PI = Math.PI;
const Y = 720;
const JX = 800;

function group(c, members) {
  return members.map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${person(c, m.o)}</g>`).join('');
}

export default {
  id: 'm6-loaves',
  beats: [
    { v: 39 },
    { v: 40 },
    { v: 41, text: 'A wziąwszy pięć chlebów i dwie ryby, spojrzał w niebo, odmówił błogosławieństwo,' },
    { v: 41, cont: true, text: 'połamał chleby i dawał uczniom, by kładli przed nimi;' },
    { v: 41, cont: true, text: 'także dwie ryby rozdzielił między wszystkich.' },
    { v: 42 },
    { v: 43 },
    { v: 44 },
  ],
  cam: { x: [-40, 40], y: [-40, 80], z: [0.94, 1.16] },
  build(S) {
    const c = S.c;
    const SKY = ['#c7a9bd', '#efbf94', '#f6d9ae'];
    const GOLD = ['#b99ab8', '#f0b384', '#f7d6a4'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: 1180, y: 390, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 200, C.cream, C.peach), { x: 480, y: 150, len: 600 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 30, scale: 0.5 });
    const heaven = hangL.add(`<g>${rays(c, { n: 12, r0: 10, r1: 700, spread: 0.035, color: '#fff3cf' })}</g>`);

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    S.layer({ par: 0.1, sh: 1 }).add(waterBand(c, { y: 430, color: mix(C.lake, C.peach, 0.2), foamN: 16, bottom: 900 }).markup);
    const farL = S.layer({ par: 0.18, sh: 3 });
    const fh = hillsWith(c, { y: 470, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 20 });
    farL.add(fh.markup);
    // far groups — only noticed when the camera pulls back at the end
    const farPeople = [];
    for (let i = 0; i < 40; i++) { const x = c.rr(-200, 1800); farPeople.push({ x, y: fh.fn(x) + c.rr(8, 30), s: 0.2, flip: x > 800, o: { ...(c.chance(0.5) ? man(c) : woman(c)), pose: 'sit' } }); }
    farPeople.sort((a, b) => a.y - b.y);
    const farCrowd = farL.add(`<g>${group(c, farPeople)}</g>`);

    /* ---------- the hillside with its green beds ---------- */
    const hill = S.layer({ par: 0.35, sh: 3 });
    const hfn = c.wave(540, [8, 4], [700, 220]);
    hill.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.3)).out());
    const BEDS = [];
    [[572, 0.34, [300, 470, 640, 960, 1130, 1300]], [620, 0.42, [360, 560, 1040, 1240]], [672, 0.5, [300, 470, 1130, 1300]]].forEach(([y, s, xs], row) => {
      xs.forEach((x) => BEDS.push({ x, y, s, row, w: 140 + row * 20, i: BEDS.length }));
    });
    BEDS.forEach((b) => {
      b.bed = hill.add(`<g>${sheet().p(c.cut(c.blob(b.x, b.y + 2, b.w / 2, 12 + b.row * 3, 16, 0.06), 0.6, 8), mix(C.leaf, C.moss, 0.3)).x(c.ribbon([[b.x - b.w * 0.42, b.y - 1], [b.x + b.w * 0.42, b.y - 2]], 2), C.wheatGreen, 'opacity=".6"').out()}</g>`);
      const n = 5 + b.row;
      const mem = [];
      for (let k = 0; k < n; k++) mem.push({ x: b.x + ((k + 0.5) / n - 0.5) * b.w * 0.86 + c.rr(-4, 4), y: b.y + (k % 2) * 5, s: b.s * c.rr(0.92, 1.05), flip: b.x > JX, o: { ...(c.chance(0.5) ? man(c) : woman(c)), pose: 'sit' } });
      b.people = hill.add(`<g>${group(c, mem)}</g>`);
    });
    // the standing crowd before they sit down
    const standers = [];
    for (let i = 0; i < 30; i++) { const x = c.rr(260, 1340); standers.push({ x, y: hfn(x) + c.rr(20, 140), s: 0.4, flip: x > JX, o: c.chance(0.5) ? man(c) : woman(c) }); }
    standers.forEach((m) => { m.s = 0.3 + (m.y - 540) * 0.0025; });
    standers.sort((a, b) => a.y - b.y);
    const standing = hill.add(`<g>${group(c, standers)}</g>`);
    hill.add(olive(c, 140, 600, 0.8) + olive(c, 1480, 610, 0.9));
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#e79a5f"/>`);

    /* ---------- the foreground: Jesus, the disciples, the baskets ---------- */
    const ground = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(690, [4, 2], [700, 180]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 690, fn: gfn, n: 40, h: 14, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 700, n: 14, fn: gfn }));
    const act = S.layer({ par: 0.55, sh: 5 });
    // a few people close by, who eat
    const NEAR = [[560, 0], [630, 1], [970, 2], [1040, 3]].map(([x, i]) => ({ x, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...(i % 2 ? woman(c) : man(c)), pose: 'sit' }))) }));
    const DIS = [
      { o: CAST.peter, side: -1, bed: 1 }, { o: CAST.andrew, side: 1, bed: 4 }, { o: CAST.john, side: -1, bed: 7 }, { o: CAST.james, side: 1, bed: 8 },
    ].map((d, i) => {
      const el = act.add(person(c, { ...d.o, holdF: `<g transform="rotate(70)"><g transform="translate(0 22)">${basket(c, { w: 40, h: 22, full: true })}</g></g>` }));
      return { ...d, i, p: S.puppet(el), hold: el.querySelector('.hold'), seed: c.rr(0, 6) };
    });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const held = act.add(`<g>${[-30, -15, 0, 15, 30].map((x, i) => `<g transform="translate(${x} ${-Math.abs(x) * 0.3 - (i % 2) * 6})">${loaf(c, 13)}</g>`).join('')}<g transform="translate(-14 -30) rotate(-12) scale(.8)">${fishCut(c, { color: C.teal2 })}</g><g transform="translate(18 -32) rotate(10) scale(.8)">${fishCut(c)}</g></g>`);
    const glowEl = act.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);
    const BASK = Array.from({ length: 12 }, (_, i) => {
      const side = i < 6 ? -1 : 1, k = i % 6;
      return { i, x: side < 0 ? 470 + k * 42 : 900 + k * 42, y: 738 + (k % 2) * 6, el: act.add(basket(c, { w: 40, h: 24, full: true })) };
    });

    /* ---------- the flying bread and fish, tags, joy ---------- */
    const fx = S.layer({ par: 0.6, sh: 4 });
    const crumbs = Array.from({ length: 16 }, (_, i) => ({ i, el: fx.add(`<g>${crumb(c, 9)}</g>`), bed: BEDS[i % BEDS.length], seed: c.rr(0, 1) }));
    const fishBits = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${fishCut(c, { color: i % 2 ? C.lake3 : C.teal2, r: 0.55 })}</g>`), bed: BEDS[(i * 3 + 1) % BEDS.length], seed: c.rr(0, 1) }));
    const tags = BEDS.map((b, i) => hanging(fx, labelTag(i % 2 ? '50' : '100', 15 + b.row * 2), { x: 0, y: 0, len: 600 }));
    const joys = BEDS.map((b, i) => fx.add(`<g>${i % 3 ? spark(c, 9) : heart(c, 9)}</g>`));
    const t12 = hanging(fx, paperLabel('12', { size: 30 }), { x: 0, y: 0, len: 600 });
    const t5000 = hanging(fx, `<g transform="scale(1.3)">${labelTag(tr('5000 mężczyzn', '5000 men'), 26)}</g>`, { x: 0, y: 0, len: 600 });

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 60, 900, 240, C.sage, C.moss) + bush(c, 1560, 900, 240, C.moss, C.sage) + rock(c, 1300, 920, 130, 50, C.rock2));

    return (t, time) => {
      const T = time;
      const gold = es(t, 4, 7.5);
      sk.blend(SKY, GOLD, gold);
      warm.fade(0.1 + gold * 0.06);
      swing(sunEl, 1180, 390 + gold * 40, T, 1, 0.6);
      swing(cl1, 480 + Math.sin(T * 0.1) * 30, 150, T, 1.4, 0.6, 1);
      birds(T, 1);

      /* v39 — sit down in groups on the green grass; v40 — by hundreds and by fifties */
      pose(standing, { o: 1 - es(t, 0.3, 0.8) });
      BEDS.forEach((b, i) => {
        const green = es(t, 0.05 + i * 0.03, 0.3 + i * 0.03);
        const sit = es(t, 0.35 + i * 0.04, 0.6 + i * 0.04);
        pose(b.bed, { o: green });
        pose(b.people, { o: sit, y: (1 - sit) * -6 });
        const k = es(t, 1.1 + i * 0.05, 1.3 + i * 0.05, ease.back) * (1 - es(t, 1.95, 2.1));
        pose(tags[i], { x: b.x, y: lerp(-400, b.y - 90 * b.s * 2.2, k), r: Math.sin(T * 1.3 + i) * 3, o: k > 0.01 ? 1 : 0 });
        const j = bump(t, 5.05 + (i % 5) * 0.08, 5.95);
        pose(joys[i], { x: b.x + Math.sin(T * 2 + i) * 10, y: b.y - 90 * b.s * 1.6 - j * 20, s: j * (0.7 + b.row * 0.15), o: j > 0.02 ? 1 : 0 });
      });

      /* v41a — he takes the loaves and fish, looks up to heaven, blesses */
      const lift = es(t, 2.05, 2.35) * (1 - es(t, 3.0, 3.1));
      const bless = bump(t, 2.3, 3.0);
      const breakK = bump(t, 3.05, 3.95);
      const fishK = bump(t, 4.05, 4.95);
      jesus.set({ x: JX, y: Y, s: 1.02, armF: 20 + lift * 60 + breakK * (50 + Math.sin(T * 5) * 20) + fishK * 60 + bump(t, 0.05, 0.9) * 70, armB: 10 + lift * 150 + breakK * 60 + fishK * 90 + bump(t, 0.05, 0.9) * 60, head: -lift * 22 + bump(t, 5.1, 5.9) * 4, blink: blinkAt(T) });
      pose(held, { x: JX + lerp(40, 10, lift), y: lerp(Y - 110, Y - 222, lift), s: 1.2 + lift * 0.2, o: es(t, 1.9, 2.1) * (1 - es(t, 3.05, 3.2)) });
      pose(glowEl, { x: JX + 10, y: Y - 236, s: 0.4 + bless, o: bless * 0.9 });
      pose(heaven, { x: JX, y: -200, r: T * 2, o: bless * 0.5 });

      /* v41b — broken, given to the disciples, set before the people */
      DIS.forEach((d) => {
        const b = BEDS[d.bed];
        const go = es(t, 3.2 + d.i * 0.05, 3.55 + d.i * 0.05) * (1 - es(t, 5.0, 5.3));
        const x0 = JX + d.side * (90 + d.i * 22);
        const x = lerp(x0, b.x + d.side * -30, go * 0.55);
        const carry = es(t, 6.05, 6.3) * (1 - es(t, 6.8, 7.0));
        d.p.set({ x: x + carry * d.side * 30, y: Y + 8 + (d.i % 2) * 6, s: 0.9, flip: d.side < 0 ? go < 0.02 || go > 0.98 ? false : true : go < 0.02 || go > 0.98 ? true : false, walk: (go > 0.02 && go < 0.98) ? x * 0.05 + d.i : undefined, armF: 70 + breakK * 10, armB: bump(t, 3.6, 4.0) * 60, blink: blinkAt(T, d.seed) });
        if (d.hold) d.hold.setAttribute('opacity', String(es(t, 3.05, 3.2) * (1 - es(t, 6.0, 6.1))));
      });
      crumbs.forEach((cb) => {
        const on = es(t, 3.1, 3.3) * (1 - es(t, 4.9, 5.1));
        const k = ((T * 0.45 + cb.i / 16) % 1);
        const from = [JX + 20, Y - 140], to = [cb.bed.x, cb.bed.y - 20];
        pose(cb.el, { x: lerp(from[0], to[0], k), y: lerp(from[1], to[1], k) - Math.sin(k * PI) * 120, r: k * 300, s: 0.7 + (1 - k) * 0.4, o: on * Math.min(1, k * 6) * (1 - Math.max(0, k - 0.85) * 6) });
      });
      /* v41c — the two fish shared among all */
      fishBits.forEach((f) => {
        const on = es(t, 4.1, 4.3) * (1 - es(t, 4.95, 5.1));
        const k = ((T * 0.4 + f.i / 10) % 1);
        const from = [JX + 20, Y - 150], to = [f.bed.x, f.bed.y - 20];
        pose(f.el, { x: lerp(from[0], to[0], k), y: lerp(from[1], to[1], k) - Math.sin(k * PI) * 140, r: (to[0] > from[0] ? 1 : -1) * (-20 + k * 40), sx: to[0] > from[0] ? 1 : -1, o: on * Math.min(1, k * 6) * (1 - Math.max(0, k - 0.85) * 6) });
      });

      /* v42 — they all ate and were filled */
      NEAR.forEach((m) => {
        const eat = es(t, 5.05, 5.2) * (1 - es(t, 5.9, 6.0));
        const chew = eat * (Math.sin(T * 4 + m.i) * 0.5 + 0.5);
        m.p.set({ x: m.x, y: Y - 2 + (m.i % 2) * 6, s: 0.8, flip: m.x > JX, armF: 20 + bump(t, 3.3, 3.9) * 60 + eat * (100 + chew * 30), head: -eat * 4, blink: blinkAt(T, m.seed) });
      });

      /* v43 — twelve baskets full of broken pieces */
      BASK.forEach((b) => {
        const k = es(t, 6.1 + b.i * 0.04, 6.3 + b.i * 0.04, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const k12 = es(t, 6.55, 6.8, ease.back) * (1 - es(t, 7.0, 7.2));
      pose(t12, { x: JX, y: lerp(-400, 380, k12), r: Math.sin(T * 1.2) * 3, o: k12 > 0.01 ? 1 : 0 });

      /* v44 — five thousand men */
      const k5 = es(t, 7.1, 7.4, ease.back);
      pose(t5000, { x: JX, y: lerp(-500, 330, k5), r: Math.sin(T * 1.1) * 2, o: k5 > 0.01 ? 1 : 0 });
      pose(farCrowd, { o: es(t, 7.05, 7.4) });

      S.cam.z = kf(t, [[0, 1.02], [1.9, 1.02], [2.3, 1.12], [3.0, 1.1], [3.3, 1.04], [6.0, 1.06], [7.0, 1.08], [7.6, 0.94]]);
      S.cam.y = kf(t, [[0, 30], [1.9, 30], [2.3, 40], [3.3, 30], [7.0, 50], [7.6, -30]]);
    };
  },
};
