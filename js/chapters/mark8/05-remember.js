// Mk 8,17–21 — "Do you not yet understand?" In the boat at golden hour: little fog clouds over dull minds,
// an eye and an ear on strings, then two sepia memory cards of the feedings are let down —
// five loaves for five thousand (twelve baskets), seven for four thousand (seven baskets).
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, sun, cloud } from '../../assets/nature.js';
import { ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { loaf, speech, GLYPH, spark, basket, crewBoat, memoryCard, say, tag, hand, headAt, FONT, PI } from './lib.js';

const BXc = 800, BYc = 745, BS = 1.5;

export default {
  id: 'm8-remember',
  beats: [
    { v: 17, text: 'Jezus zauważył to i rzekł im: «Czemu rozprawiacie o tym, że nie macie chleba?' },
    { v: 17, cont: true, text: 'Jeszcze nie pojmujecie i nie rozumiecie, tak otępiały macie umysł?' },
    { v: 18, text: 'Macie oczy, a nie widzicie; macie uszy, a nie słyszycie?' },
    { v: 18, cont: true, text: 'Nie pamiętacie, ile zebraliście koszów pełnych ułomków,' },
    { v: 19, text: 'kiedy połamałem pięć chlebów dla pięciu tysięcy?»' },
    { v: 19, cont: true, text: 'Odpowiedzieli Mu: «Dwanaście».' },
    { v: 20, text: '«A kiedy połamałem siedem chlebów dla czterech tysięcy, ile zebraliście koszów pełnych ułomków?»' },
    { v: 20, cont: true, text: 'Odpowiedzieli: «Siedem».' },
    { v: 21 },
  ],
  cam: { x: [-20, 20], y: [-60, 90], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const SKY = ['#b9a3c4', '#eab596', '#f5d4ac'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 1240, y: 380, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 190, '#f3d7c3', '#e5bca5'), { x: 380, y: 170, len: 700 });

    /* ---------- the eye and the ear ---------- */
    const eyeM = (() => {
      const s = sheet();
      s.p(c.cut(c.circ(0, 0, 58, 30), 0.5, 5), C.ochre).p(c.cut(c.circ(0, 0, 52, 30), 0.5, 5), C.cream);
      s.p(c.cut([...c.arc(0, 18, 40, 34, PI * 1.15, PI * 1.85, 12), ...c.arc(0, -18, 40, 34, PI * 0.15, PI * 0.85, 12)], 0.4, 4), C.linen);
      s.p(c.cut(c.circ(0, 0, 13, 16), 0.3, 3), C.teal2).x(c.poly(c.circ(0, 0, 6, 10)), C.ink).x(c.poly(c.circ(-4, -4, 2.4, 6)), '#fff');
      return s.out();
    })();
    const lid = sheet().p(c.cut([...c.arc(0, 18, 41, 35, PI * 1.12, PI * 1.88, 12), [36, 1], [-36, 1]], 0.4, 4), C.skin2).x(c.ribbon(c.arc(0, 0, 36, 5, 0, PI, 10), 2), C.inkSoft).out();
    const earM = sheet().p(c.cut(c.circ(0, 0, 58, 30), 0.5, 5), C.ochre).p(c.cut(c.circ(0, 0, 52, 30), 0.5, 5), C.cream).out() + `<g transform="scale(.95)">${ear(c, C.skin2)}</g>`;
    const EX = S.portrait ? [610, 990] : [560, 1040];   // phone: the eye and the ear clear of the edge and the thread
    const eyeEl = hanging(hangL, `${eyeM}<g class="lid">${lid}</g>`, { x: EX[0], y: 230, len: 900 });
    const earEl = hanging(hangL, `${earM}<g class="plug"><path d="${c.cut(c.blob(4, -2, 10, 12, 9, 0.2), 0.4, 3)}" fill="${C.wood3}"/></g>`, { x: EX[1], y: 230, len: 900 });
    const lidEl = eyeEl.querySelector('.lid'), plugEl = earEl.querySelector('.plug');

    /* ---------- two memory cards ---------- */
    const cardL = S.layer({ par: 0.07, sh: 7 });
    const CW = 330, CH = 230;
    const mkCard = (nLoaves, crowdN, label, nBaskets) => {
      let crowdM = '';
      for (let i = 0; i < crowdN; i++) {
        const row = i % 3, x = -CW / 2 + 16 + ((i * 37) % (CW - 30)), y = 124 + row * 16;
        crowdM += `<g transform="translate(${x} ${y}) scale(${(0.17 + row * 0.02) * (x > 0 ? -1 : 1)} ${0.17 + row * 0.02})">${person(c, { ...crowdPerson(c), pose: 'sit' })}</g>`;
      }
      const hill = sheet().p(c.ridge(c.wave(104, [6, 2], [240, 80]), -CW / 2, CW / 2, CH, 10, 0.6), mix(C.sand, C.hillMid, 0.4)).out();
      const loaves = Array.from({ length: nLoaves }, (_, i) => `<g class="lf" data-i="${i}">${loaf(c, 11)}</g>`).join('');
      const bks = Array.from({ length: nBaskets }, (_, i) => `<g class="bk" data-i="${i}">${basket(c, { w: 22, h: 16, full: true })}</g>`).join('');
      const clip = S.id('mc' + nLoaves);
      return `${memoryCard(c, CW, CH)}<defs><clipPath id="${clip}"><rect x="${-CW / 2}" y="0" width="${CW}" height="${CH}"/></clipPath></defs><g clip-path="url(#${clip})" opacity=".85">${hill}${crowdM}</g>${loaves}${bks}<g transform="translate(${CW / 2 - 50} 12)">${tag(c, label, { size: 18, w: 76, fill: C.parchment })}</g>`;
    };
    // phone: both cards a little smaller and closer together, so neither is sliced by the frame or the thread
    const CX = S.portrait ? [618, 958] : [560, 1040];
    const card = (m) => (S.portrait ? `<g transform="scale(.84)">${m}</g>` : m);
    const cards = [
      { x: CX[0], n: 5, el: hanging(cardL, card(mkCard(5, 30, '5000', 12)), { x: CX[0], y: 150, len: 900 }) },
      { x: CX[1], n: 7, el: hanging(cardL, card(mkCard(7, 24, '4000', 7)), { x: CX[1], y: 150, len: 900 }) },
    ];
    cards.forEach((cd, j) => {
      cd.lf = Array.from(cd.el.querySelectorAll('.lf'));
      cd.bk = Array.from(cd.el.querySelectorAll('.bk'));
      cd.j = j;
    });

    /* ---------- the lake at golden hour ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 500, amps: [14, 6, 3], lens: [1100, 380, 140], color: '#c9a9b4' }).markup);
    S.layer({ par: 0.14, sh: 2 }).add(hillsWith(c, { y: 522, amps: [10, 5, 2], lens: [900, 300, 110], color: '#b8b09a', trees: 12, treeColor: '#8f9a78', treeH: 18 }).markup);
    S.layer({ par: 0.2, sh: 2 }).add(waterBand(c, { y: 545, color: '#a9b9b4', foamN: 26, foam: '#fbe3c4' }).markup);
    const glitter = S.layer({ par: 0.22, sh: 1 });
    glitter.add(`<g>${Array.from({ length: 16 }, (_, i) => `<path d="${c.cut([[-26, 0], [0, -2], [26, 0], [0, 1.6]], 0.2, 6)}" fill="#ffe7bf" transform="translate(${1200 + c.rr(-40, 40)} ${560 + i * 14})"/>`).join('')}</g>`);
    const w0 = S.layer({ par: 0.3, sh: 3, pad: 160 });
    w0.add(waveStrip(c, { y: 640, len: 150, amp: 8, color: '#93aaa8' }));

    /* ---------- the boat ---------- */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const { g: boatG, crew, jesus } = crewBoat(S, boatL);
    const fx = S.layer({ par: 0.5, sh: 3 });
    const fogs = crew.map((d, i) => ({ d, el: fx.add(`<g>${cloud(c, 58, '#9f978f', '#857d75')}</g>`), i }));
    const oneLoaf = fx.add(`<g>${spark(c, 22)}<g transform="translate(0 12)">${loaf(c, 22)}</g></g>`);
    const qs = [0, 1, 2].map((i) => fx.add(`<g>${speech(c, GLYPH.q(c), { w: 38, h: 38, flip: i === 1 })}</g>`));
    const ans12 = fx.add(`<g>${say(c, tr('Dwanaście', 'Twelve'), { size: 24, side: 1 })}</g>`);
    const ans7 = fx.add(`<g>${say(c, tr('Siedem', 'Seven'), { size: 24, side: -1 })}</g>`);
    const w1 = S.layer({ par: 0.75, sh: 4, pad: 180 });
    w1.add(waveStrip(c, { y: 800, len: 170, amp: 12, color: '#8aa3a3' }));
    const w2 = S.layer({ par: 0.88, sh: 4, pad: 200 });
    w2.add(waveStrip(c, { y: 880, len: 200, amp: 14, color: '#6f8f94' }));

    const X = (d) => BXc + d.x * BS;
    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#8f86ad', '#e3a58e', '#f3c79e'], es(t, 0, 9));
      swing(sunEl, 1240, 380 + es(t, 0, 9) * 90, T, 1, 0.6);
      swing(cl1, 380 + Math.sin(T * 0.1) * 26, 170, T, 1.4, 0.6, 1);
      w0.shift(((T * 12) % 150) - 75); w1.shift(((T * 18) % 170) - 85); w2.shift(100 - ((T * 14) % 200));
      const bob = Math.sin(T * 1.2) * 3;
      pose(boatG, { x: BXc, y: BYc + bob, s: BS, r: Math.sin(T * 1.0) * 0.9 });

      /* eye & ear (v18a) */
      const ee = es(t, 2.02, 2.35, ease.back) * (1 - es(t, 2.95, 3.3));
      swing(eyeEl, EX[0], 230 - (1 - ee) * (S.portrait ? 900 : 600), T, 1.2, 0.9, 1);
      swing(earEl, EX[1], 230 - (1 - ee) * (S.portrait ? 900 : 600), T, 1.2, 0.9, 2);
      const shut = es(t, 2.3, 2.5) * (1 - es(t, 2.75, 2.9)) ;
      pose(lidEl, { x: 0, y: 0, sy: 0.05 + shut * 0.95, o: shut > 0.02 ? 1 : 0 });
      pose(plugEl, { x: -2, y: -4, s: es(t, 2.55, 2.7) });

      /* memory cards (v18b – v20) */
      cards.forEach((cd) => {
        const down = es(t, 3.1 + cd.j * 0.15, 3.5 + cd.j * 0.15, ease.back) * (1 - es(t, 8.05, 8.4));
        const focus = cd.j === 0 ? es(t, 4, 4.3) * (1 - es(t, 6, 6.3)) : es(t, 6, 6.3) * (1 - es(t, 8, 8.2));
        swing(cd.el, cd.x, 150 - (1 - down) * (S.portrait ? 900 : 680) + focus * 16, T, 1, 0.7, cd.j);
        const t0 = cd.j === 0 ? 4.05 : 6.05, tb = cd.j === 0 ? 5.05 : 7.05;
        cd.lf.forEach((l, i) => {
          const k = es(t, t0 + i * 0.07, t0 + 0.14 + i * 0.07, ease.back);
          pose(l, { x: (i - (cd.n - 1) / 2) * 30, y: 76, s: k * (1 + bump(t, t0 + 0.6, t0 + 0.9) * 0.15) });
        });
        const nB = cd.bk.length;
        cd.bk.forEach((b, i) => {
          const k = es(t, tb + i * (0.5 / nB), tb + 0.1 + i * (0.5 / nB), ease.back);
          const row = cd.j === 0 ? Math.floor(i / 6) : 0, col = cd.j === 0 ? i % 6 : i;
          const per = cd.j === 0 ? 6 : 7;
          pose(b, { x: (col - (per - 1) / 2) * 34, y: 200 + row * 22 - (cd.j === 0 ? 11 : 0), s: k });
        });
      });

      /* Jesus turns to them; at the end He holds the one loaf */
      const speak = es(t, 0.05, 0.3);
      const head_ = bump(t, 1.1, 1.9);
      const eyes = bump(t, 2.05, 2.95);
      const last = es(t, 8.05, 8.35);
      const aF = 16 + speak * 22 - last * 4;
      jesus.set({ x: 0, y: -2, s: 0.9, flip: false, armF: aF, armB: 8 + speak * 40 + head_ * 110 + eyes * 90 + last * 20, head: -eyes * 6 + last * 10, blink: blinkAt(T) });
      const [lx, ly] = hand(BXc, BYc - 2 * BS, 0.9 * BS, false, aF);
      pose(oneLoaf, { x: lx - 14, y: ly + bob - 10, s: last * (1 + Math.sin(T * 3) * 0.04), o: last > 0.02 ? 1 : 0 });

      /* the disciples: argue, fall silent, look up at the cards, answer */
      crew.forEach((d) => {
        const hush = es(t, 0.1, 0.4);
        const argue = (1 - hush) * (Math.sin(T * 4 + d.seed) * 0.5 + 0.5);
        const up = es(t, 3.2, 3.5) * (1 - es(t, 8.05, 8.3));
        const peterA = d.k === 'peter' ? bump(t, 5.0, 5.95) : 0;
        const johnA = d.k === 'john' ? bump(t, 7.0, 7.95) : 0;
        const toJ = es(t, 0.1, 0.35);
        d.p.set({ x: d.x, y: 2, s: 0.8, flip: toJ > 0.5 ? d.x > 0 : d.x < 0 && d.k !== 'andrew', armF: 20 + argue * 50 + peterA * 60 + johnA * 60 + es(t, 8.3, 8.6) * 10, armB: 10 + argue * 20, head: -up * 20 + es(t, 8.3, 8.6) * 10 * (d.x > 0 ? 1 : -1) + bump(t, 1.05, 2) * 10, blink: blinkAt(T, d.seed) });
      });
      fogs.forEach((f) => {
        const on = es(t, 1.1 + f.i * 0.05, 1.3 + f.i * 0.05) * (1 - es(t, 3.2 + f.i * 0.05, 3.6 + f.i * 0.05));
        const [hx, hy] = headAt(X(f.d), BYc + 2 * BS, 0.8 * BS, f.d.x > 0);
        pose(f.el, { x: hx + Math.sin(T * 0.9 + f.i) * 5, y: hy - 50 + bob, s: on * 0.9, o: on > 0.02 ? on : 0 });
      });
      const pt = crew.find((d) => d.k === 'peter'), jn = crew.find((d) => d.k === 'john');
      const a12 = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.95, 6.05));
      const [px, py] = headAt(X(pt), BYc, 0.8 * BS, true);
      pose(ans12, { x: px + 10, y: py - 34 + bob, s: a12, o: a12 > 0.02 ? 1 : 0 });
      const a7 = es(t, 7.1, 7.3, ease.back) * (1 - es(t, 7.95, 8.05));
      const [jx, jy] = headAt(X(jn), BYc, 0.8 * BS, false);
      pose(ans7, { x: jx - 10, y: jy - 34 + bob, s: a7, o: a7 > 0.02 ? 1 : 0 });
      qs.forEach((q, i) => {
        const k = es(t, 8.3 + i * 0.1, 8.45 + i * 0.1, ease.back);
        const d = crew[[1, 4, 3][i]];
        const [hx, hy] = headAt(X(d), BYc, 0.8 * BS, d.x > 0);
        pose(q, { x: hx, y: hy - 40 + bob, s: k * 0.9, r: Math.sin(T * 2 + i) * 5, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.12 + es(t, 0.9, 1.3) * 0.08 - es(t, 1.9, 2.2) * 0.12 - es(t, 2.9, 3.3) * 0.04 + es(t, 8.0, 8.5) * 0.14;
      S.cam.y = 60 + es(t, 0.9, 1.3) * 20 - es(t, 1.9, 2.2) * 60 - es(t, 2.9, 3.3) * 20 + es(t, 8.0, 8.5) * 70;
    };
  },
};
