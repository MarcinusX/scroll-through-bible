// J 2,17–20 — the disciples remember the psalm (a scroll unrolls: "Zeal for your house will eat me up").
// The leaders ask for a sign. "Destroy this temple" — a paper Temple hanging in the air comes apart block
// by block — "and in three days I will raise it up": three day-suns light, the blocks fly home and it
// shines. "Forty-six years to build!" — a great balance: forty-six years of stones against three days.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, DISC, priest, elder, verseScroll, signBadge, iconBubble, templeBlocks, templeOutline, dayDisc, bigBalance, stonePile, strip, dust, sparkle, tr, PI } from './lib.js';

const FLOOR = 684;
const MX = 680, MY = 450;           // the paper Temple (base centre)

export default {
  id: 'j2-sign',
  beats: [
    { v: 17 },
    { v: 18 },
    { v: 19, text: 'Jezus dał im taką odpowiedź: «Zburzcie tę świątynię,' },
    { v: 19, cont: true, text: 'a Ja w trzech dniach wzniosę ją na nowo».' },
    { v: 20, text: 'Powiedzieli do Niego Żydzi: «Czterdzieści sześć lat budowano tę świątynię,' },
    { v: 20, cont: true, text: 'a Ty ją wzniesiesz w przeciągu trzech dni?»' },
  ],
  cam: { x: [-40, 40], y: [-30, 30], z: [0.98, 1.12] },
  build(S) {
    const c = S.c;
    const { sk, sunEl, cl1 } = templeCourt(S, { skyCols: ['#d3dfd6', '#f2e2c4', '#f6dcbc'], floorY: FLOOR + 40, sanctX: 1130, sunAt: [420, 150] });

    /* the scroll of the psalm */
    const flyL = S.layer({ par: 0.2, sh: 6 });
    const V = verseScroll(c, tr(['Gorliwość o dom Twój', 'pochłonie Mnie'], ['Zeal for your house', 'will eat me up']), { w: 360, size: 26, title: tr('PSALM 69', 'PSALM 69') });
    const scrollSheet = flyL.add(`<g>${V.sheet}</g>`);
    const rodTop = hanging(flyL, V.rodTop, { x: 0, y: 0, len: 700 });
    const rodBot = flyL.add(`<g>${V.rodBottom}</g>`);

    /* the balance of years and days */
    const B = bigBalance(c, 170);
    const balStand = hanging(flyL, B.stand, { x: 0, y: 0, len: 700 });
    const beam = flyL.add(`<g>${B.beam}</g>`);
    const pans = [-1, 1].map((d) => ({ d, el: flyL.add(`<g>${B.pan}</g>`) }));
    const pile = flyL.add(`<g>${stonePile(c, 12)}</g>`);
    const stones = Array.from(pile.querySelectorAll('.st'));
    const yearsTag = flyL.add(`<g>${strip(c, '', { size: 24, w: 110 })}</g>`);
    const yearsText = yearsTag.querySelector('text');
    const daysTag = flyL.add(`<g>${strip(c, tr('3 dni', '3 days'), { size: 24, w: 110 })}</g>`);
    const suns3 = [0, 1, 2].map((i) => flyL.add(`<g>${dayDisc(c, ['I', 'II', 'III'][i], 13).replace('class="lit" opacity="0"', 'class="lit"')}</g>`));

    /* the paper Temple that falls and rises; three days above it */
    const modelL = S.layer({ par: 0.34, sh: 6 });
    const days = ['I', 'II', 'III'].map((n, i) => {
      const el = hanging(modelL, dayDisc(c, n, 22), { x: 0, y: 0, len: 700 });
      return { el, lit: el.querySelector('.lit'), i };
    });
    const mGlow = modelL.add(`<g><circle r="200" fill="url(#halo-glow)"/></g>`);
    const blocks = templeBlocks(c, 1.2).map((b, i) => ({ ...b, i, el: modelL.add(`<g>${b.markup}</g>`), fx: c.rr(-200, 30), fr: c.rr(-120, 120), fy: FLOOR - 30 + c.rr(-10, 20) - MY }));
    const outline = modelL.add(`<g>${templeOutline(c, 1.2, C.sun, 4)}</g>`);
    const puffs = [0, 1, 2].map(() => modelL.add(`<g>${dust(c, 40, mix(C.stone, C.cream, 0.4))}</g>`));

    /* the disciples, Jesus, the leaders */
    const L = S.layer({ par: 0.52, sh: 6 });
    const dis = [DISC[1], DISC[0], DISC[2]].map((o, i) => ({ i, x: [420, 505, 590][i], seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))) }));
    const lead = [
      { m: priest(c, 0), x: 1010 }, { m: elder(c, 1), x: 1095 }, { m: priest(c, 2), x: 1180 },
    ].map((l, i) => ({ ...l, i, seed: c.rr(0, 9), p: S.puppet(L.add(l.m)) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const qBubble = L.add(`<g>${iconBubble(c, `<g transform="scale(.46)">${signBadge(c, '?', { r: 60, icon: '' })}</g>`, { w: 110, h: 100, side: -1 })}</g>`);
    const laughs = [0, 1].map(() => L.add(`<g>${strip(c, tr('ha!', 'ha!'), { size: 20, w: 50 })}</g>`));

    return (t, time) => {
      const T = time;
      swing(sunEl, 420, 150 + es(t, 0, 6) * 60, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v17 — the scroll unrolls over the disciples */
      const sc = es(t, 0.1, 0.35, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      const un = es(t, 0.3, 0.7);
      const sy = 190 - (1 - sc) * 560;
      pose(rodTop, { x: 600, y: sy, r: Math.sin(T * 0.7) * 0.8 });
      pose(scrollSheet, { x: 600, y: sy, sy: Math.max(0.01, un), o: sc > 0.05 ? 1 : 0 });
      pose(rodBot, { x: 600, y: sy + un * V.h, o: sc > 0.05 ? 1 : 0 });
      dis.forEach((d) => {
        const up = bump(t, 0.25, 1.1);
        const react = es(t, 2.1, 2.4) * (1 - es(t, 3.9, 4.2));
        d.p.set({ x: d.x, y: FLOOR + 6 - d.i * 8, s: 1, flip: false, armF: 20 + up * 50 + react * 30, armB: 10 + (d.i === 1 ? up * 80 : 0), head: -up * 16 + react * 6, blink: blinkAt(T, d.seed) });
      });

      /* v18 — the leaders ask for a sign */
      const ask = bump(t, 1.05, 2.05);
      lead.forEach((l) => {
        const step = es(t, 1.0, 1.3) * 30;
        const scoff = bump(t, 5.1, 6.1);
        const toTemple = bump(t, 4.05, 5.0);
        l.p.set({ x: l.x - step, y: FLOOR + 4 - (l.i % 2) * 8, s: 1, flip: !(toTemple > 0.5 && l.i === 1), armF: 20 + (l.i === 0 ? ask * 70 : ask * 20) + toTemple * (l.i === 1 ? 110 : 30) + scoff * 40, armB: 10 + scoff * (l.i % 2 ? 120 : 60), head: scoff * -14 + ask * 6, lean: scoff * 4, blink: blinkAt(T, l.seed) });
      });
      const qb = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(qBubble, { x: 1000, y: FLOOR - 190, s: 0.3 + 0.7 * qb, o: qb });

      /* v19 — Jesus speaks; the paper Temple comes apart; three days; it rises again */
      const speak = bump(t, 2.0, 4.0);
      jesus.set({ x: 800, y: FLOOR + 16, s: 1.06, armF: 20 + speak * 60 + es(t, 3.2, 3.5) * 30 * (1 - es(t, 3.9, 4.1)), armB: 10 + es(t, 2.1, 2.4) * 110 * (1 - es(t, 2.9, 3.1)) + es(t, 3.3, 3.6) * 130 * (1 - es(t, 3.95, 4.1)), head: -speak * 5, blink: blinkAt(T, 2) });
      const show = es(t, 1.9, 2.15, ease.out) * (1 - es(t, 4.0, 4.25, ease.in));
      const fallK = es(t, 2.3, 2.85, ease.in) * (1 - es(t, 3.3, 3.9, ease.io));
      const lift = (1 - show) * -520;
      blocks.forEach((b) => {
        const f = Math.min(1, Math.max(0, fallK * 1.3 - (b.y / -200) * 0.3));
        pose(b.el, { x: MX + b.x + b.fx * f, y: MY + b.y + lift + (b.fy - b.y) * f - Math.sin(f * PI) * 30, r: b.fr * f, o: show > 0.02 ? 1 : 0 });
      });
      puffs.forEach((p, i) => {
        const k = seg(t, 2.6 + i * 0.06, 3.0 + i * 0.06);
        pose(p, { x: MX + (i - 1) * 120, y: FLOOR - 40 - k * 30, s: 0.5 + k * 1.3, o: bump(t, 2.6 + i * 0.06, 3.0 + i * 0.06) * 0.8 });
      });
      days.forEach((d) => {
        const on = es(t, 3.05 + d.i * 0.14, 3.18 + d.i * 0.14);
        fade(d.lit, on);
        pose(d.el, { x: MX - 120 + d.i * 120, y: 190 - (1 - es(t, 2.95, 3.15, ease.out) * (1 - es(t, 3.95, 4.2))) * 460, r: Math.sin(T + d.i) * 2 });
      });
      const shine = es(t, 3.75, 3.95) * show;
      pose(outline, { x: MX, y: MY + lift, o: shine, s: 1 + shine * 0.02 });
      pose(mGlow, { x: MX, y: MY - 100 + lift, s: 0.6 + shine * 0.6, o: shine });

      /* v20 — the balance: forty-six years of stones against three days */
      const bal = es(t, 4.05, 4.35, ease.out);
      const BX = 800, BY = 180 - (1 - bal) * 560;
      const nS = Math.floor(es(t, 4.3, 4.7) * 12.99);
      const tilt = es(t, 4.4, 4.9) * 14 - es(t, 5.3, 5.6) * 0; // years weigh it down; three days stay light
      pose(balStand, { x: BX, y: BY });
      pose(beam, { x: BX, y: BY + 44, r: -tilt, o: 1 });
      const a = (-tilt * PI) / 180;
      pans.forEach((p) => {
        const px = BX + Math.cos(a) * 170 * p.d, py = BY + 44 + Math.sin(a) * 170 * p.d;
        p.x = px; p.y = py;
        pose(p.el, { x: px, y: py });
      });
      stones.forEach((st, i) => fade(st, i < nS ? 1 : 0));
      pose(pile, { x: pans[0].x, y: pans[0].y + 86, s: 1 });
      const yt = `${Math.round(es(t, 4.3, 4.7) * 46)} ${tr('lat', 'years')}`;
      if (yearsText.textContent !== yt) yearsText.textContent = yt;
      pose(yearsTag, { x: pans[0].x, y: pans[0].y + 124, o: es(t, 4.25, 4.4) });
      suns3.forEach((sn, i) => {
        const k = es(t, 5.1 + i * 0.12, 5.3 + i * 0.12, ease.back);
        pose(sn, { x: pans[1].x - 26 + i * 26, y: lerp(pans[1].y - 60, pans[1].y + 74, k), s: 0.9, o: k });
      });
      pose(daysTag, { x: pans[1].x, y: pans[1].y + 124, o: es(t, 5.3, 5.45) });
      laughs.forEach((l, i) => {
        const k = bump(t, 5.45 + i * 0.12, 6.0);
        pose(l, { x: 1060 + i * 90, y: FLOOR - 230 - k * 20 - i * 16, r: (i ? 8 : -8), s: 0.6 + k * 0.4, o: k });
      });

      S.cam.x = -30 * bump(t, 0, 1.2) + es(t, 1, 1.3) * 20 * (1 - es(t, 1.9, 2.2));
      S.cam.y = 20 - es(t, 1.9, 2.2) * 20 + es(t, 4.0, 4.3) * -20;
      S.cam.z = 1.04 + es(t, 1, 1.3) * 0.04 * (1 - es(t, 1.9, 2.1));
    };
  },
};
