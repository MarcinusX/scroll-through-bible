// J 4,35–38 — out in the fields below Sychar. "Four months more, and then the harvest": four month-cards hang in a
// row, a seedling growing from card to card, and the field is still young and green. "Lift up your eyes and see
// the fields white for harvest!" — the green sheet falls away, the field stands ripe and pale, and through it come
// the people of Sychar in white, like ears of grain. The reaper gets his wages (coins glint) and gathers sheaves
// that shine for eternal life; the sower comes and they rejoice together. "One sows, another reaps" — two plates.
// "I sent you to reap" — the disciples go into the field with sickles; "others laboured" — faint shadows of those
// who worked before (a prophet, John the Baptist, a sower) stand in the rows and fade as the disciples step in.
import { C, person, CAST, blinkAt, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, grass, sun, cloud, olive, cypress } from '../../assets/nature.js';
import { sprout, sickle, sheaf, wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DISC, AFTER, samaritan, gerizim, sychar, shadowPerson, JOHN_B, sparkle, heart, plate, strip, vis, kf, PI } from './lib.js';
import { wheatField } from '../mark2/lib.js';

const FLOOR = 712;
const GOLD = ['#e5d9b0', '#f5e7c4', '#f9eed6'];

export default {
  id: 'j4-harvest',
  beats: [
    { v: 35, text: 'Czyż nie mówicie: "Jeszcze cztery miesiące, a nadejdą żniwa?"' },
    { v: 35, cont: true, text: 'Oto powiadam wam: Podnieście oczy i popatrzcie na pola, jak bieleją na żniwo.' },
    { v: 36, text: 'Żniwiarz otrzymuje już zapłatę i zbiera plon na życie wieczne,' },
    { v: 36, cont: true, text: 'tak iż siewca cieszy się razem ze żniwiarzem.' },
    { v: 37 },
    { v: 38, text: 'Ja was wysłałem żąć to, nad czym wyście się nie natrudzili.' },
    { v: 38, cont: true, text: 'Inni się natrudzili, a w ich trud wyście weszli».' },
  ],
  cam: { x: [-80, 120], y: [-100, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const sk = sky(S, AFTER);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1180, y: 170, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 480, y: 150, len: 600 });
    const farL = S.layer({ par: 0.1, sh: 2 });
    farL.add(band(c, { y: 470, amps: [16, 8, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    farL.add(`<g transform="translate(420 478)">${gerizim(c, 520, 160, mix(C.hillFar, C.sage2, 0.25))}</g>`);
    const midL = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 525, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    midL.add(h2.markup + `<g transform="translate(1320 ${h2.fn(1320) + 6})">${sychar(c, 0.6)}</g>`);
    // the field: young and green, then white for harvest
    const ripeL = S.layer({ par: 0.32, sh: 3 });
    ripeL.add(sheet().p(c.ridge(c.wave(560, [6, 3], [700, 160]), -900, 2500, 1700, 12, 1), mix(C.wheat, C.cream, 0.45)).out());
    ripeL.add(wheatField(c, { y: 598, h: 44, n: 420, color: mix(C.wheat2, C.cream, 0.3), ear: mix(C.wheat, C.cream, 0.6) }));
    // the white-robed people of Sychar coming through the field
    const walkL = S.layer({ par: 0.35, sh: 3 });
    const white = Array.from({ length: 11 }, (_, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(walkL.add(person(c, samaritan(c, i + 80, { white: true })))), x: 980 + i * 70 + c.rr(-20, 20), y: 616 + (i % 3) * 7, d: c.rr(0, 0.3) }));
    // those who laboured before (faint shadows in the rows)
    const olds = [{ o: { ...JOHN_B }, x: 330 }, { o: { robe: C.dustyBlue, mantle: C.linen2, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full' }, x: 560 }, { o: samaritan(c, 5), x: 1090 }, { o: samaritan(c, 6), x: 1300 }]
      .map((d, i) => ({ ...d, i, p: S.puppet(walkL.add(shadowPerson(c, d.o, '#5a4a3c'))) }));
    walkL.add(wheatField(c, { y: 640, h: 40, n: 360, color: mix(C.wheat2, C.cream, 0.3), ear: mix(C.wheat, C.cream, 0.6) }));
    const greenL = S.layer({ par: 0.36, sh: 3 });
    greenL.add(sheet().p(c.ridge(c.wave(528, [6, 3], [700, 160]), -900, 2500, 1700, 12, 1), mix(C.wheatGreen, C.sage2, 0.35)).out());
    let rows = '';
    for (let i = 0; i < 11; i++) { const y = 546 + i * 11; rows += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4 + i * 0.3); }
    greenL.add(sheet().x(rows, shade(C.wheatGreen, -0.18), 'opacity=".55"').out());
    greenL.add(grass(c, { x0: -800, x1: 2400, y: 580, n: 120, h: 12, color: C.leaf }));
    // near ground: a rise where Jesus stands, a strip of ripe wheat on the right for the reapers
    const nearL = S.layer({ par: 0.55, sh: 4 });
    const nfn = c.wave(690, [6, 3], [600, 160]);
    nearL.add(sheet().p(c.ridge(nfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage2, 0.45)).out());
    nearL.add(grass(c, { x0: -600, x1: 2200, y: 690, fn: nfn, n: 40, h: 14, color: C.olive }) + olive(c, 180, nfn(180) + 8, 0.9) + cypress(c, 1560, nfn(1560) + 6, 130));
    const jesus = S.puppet(nearL.add(person(c, CAST.jesus)));
    const scy = `<g transform="translate(2 10) rotate(80) scale(.62)">${sickle(c)}</g>`;
    const disc = DISC.map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(nearL.add(person(c, { ...o, holdF: i >= 1 && i <= 3 ? scy : '' }))), x: [610, 680, 930, 1000, 1070][i] }));
    const sower = S.puppet(nearL.add(person(c, { robe: C.ochreRobe, belt: C.leather, hairStyle: 'wrap', veil: C.linen2, hair: C.hair2, beard: 'short', skin: C.skin2, holdB: `<g transform="translate(2 4)">${sheet().p(c.cut([[-14, -6], [14, -6], [18, 20], [0, 26], [-18, 20]], 0.6, 5), C.basket).out()}</g>` })));
    const fx = nearL;
    const sheaves = [0, 1, 2].map((i) => fx.add(`<g><circle cy="-70" r="60" fill="url(#halo-glow)" class="sg"/>${sheaf(c, 90)}</g>`));
    const coins = [0, 1, 2].map(() => fx.add(`<circle r="7" fill="${C.sun}" stroke="${shade(C.sun, -0.3)}" stroke-width="1.6"/>`));
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    const hearts = [0, 1].map(() => fx.add(`<g>${heart(c, 12)}</g>`));
    // the four month-cards
    const cards = [0, 1, 2, 3].map((i) => {
      const s = sheet().p(c.cut(c.rect(-40, 0, 80, 96), 0.5, 6), C.cream).p(c.cut(c.rect(-34, 6, 68, 84), 0.4, 6), C.parchment);
      const plant = i < 3 ? `<g transform="translate(0 72) scale(${0.8 + i * 0.35})">${sprout(c, { h: 18 + i * 8 })}</g>` : `<g transform="translate(0 80) scale(.42)">${wheatStalk(c, { h: 110 })}</g>`;
      const el = hanging(fx, `<g transform="scale(1.3)">${s.out()}${plant}<text x="0" y="28" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" font-style="italic" fill="${C.terracotta}">${i + 1}</text></g>`, { x: 620 + i * 130, y: 200, len: 600 });
      return { el, i };
    });
    const plates = [
      { icon: `<g transform="translate(0 30) scale(.3)">${person(c, { robe: C.ochreRobe, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin2 })}</g>`, text: tr('jeden sieje', 'one sows'), x: 660 },
      { icon: `<g transform="translate(4 0) scale(.7) rotate(20)">${sickle(c)}</g>`, text: tr('drugi zbiera', 'another reaps'), x: 940 },
    ].map((p) => ({ ...p, el: hanging(fx, `${plate(c, p.icon, { r: 58 })}<g transform="translate(0 86)">${strip(c, p.text, { size: 18 })}</g>`, { x: p.x, y: 280, len: 600 }) }));

    const nearWheat = S.layer({ par: 0.6, sh: 4 });
    nearWheat.add(wheatField(c, { x0: 1120, x1: 1700, y: 760, h: 110, n: 150, color: C.wheat2, ear: mix(C.wheat, C.cream, 0.3) }));

    return (t, time) => {
      const T = time;
      const lift = es(t, 1.05, 1.5);
      sk.blend(AFTER, GOLD, lift);
      swing(sunEl, 1180, 170, T, 1.1, 0.6);
      swing(cl, 480 + Math.sin(T * 0.1) * 24, 150, T, 1.3, 0.7, 1);
      /* v35a — four more months */
      cards.forEach((cd) => {
        const k = es(t, 0.1 + cd.i * 0.12, 0.4 + cd.i * 0.12, ease.out) * (1 - es(t, 1.0, 1.3, ease.in));
        swing(cd.el, 620 + cd.i * 130, 200 - (1 - k) * 600, k > 0.001 ? T : 0, 1.4, 0.8, cd.i);
        fade(cd.el, k > 0.001 ? 1 : 0);
      });
      /* v35b — the fields are white */
      greenL.fade(1 - lift * 0.6);
      greenL.shift(0, ease.in(lift) * 1400);
      const ripe = es(t, 0.95, 1.2);
      ripeL.fade(ripe);
      walkL.fade(ripe);
      nearWheat.fade(lift);
      white.forEach((w) => {
        const k = seg(t, 1.35 + w.d, 3.2 + w.d);
        const x = w.x - k * 330;
        w.p.set({ x, y: w.y, s: 0.42, flip: true, o: es(t, 1.3 + w.d, 1.45 + w.d) * (1 - es(t, 5.5, 5.9) * 0), walk: k > 0 && k < 1 ? x * 0.08 : undefined, head: -2, blink: blinkAt(T, w.seed) });
      });
      /* people */
      const point = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.2));
      const send = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      jesus.set({ x: 800, y: FLOOR, s: 1.08, flip: false, armF: 20 + point * 50 + bump(t, 0.2, 0.9) * 30 + send * 70, armB: 12 + point * 140, head: -point * 12, blink: blinkAt(T) });
      const reap = es(t, 2.05, 2.25) * (1 - es(t, 4.9, 5.05));
      const go = es(t, 5.1, 5.9, ease.io);
      disc.forEach((d) => {
        let x = d.x, flip = d.x < 800;
        const reaper = d.i >= 2 && d.i <= 3;
        if (reaper) x = lerp(d.x, 1180 + (d.i - 2) * 90, reap);
        if (d.i >= 1 && d.i <= 3) x = lerp(x, 1330 + d.i * 50, go);
        const swingK = reaper ? Math.max(0, Math.sin(t * 28 + d.i)) * reap * seg(t, 2.25, 2.95) : 0;
        d.p.set({ x, y: FLOOR + 4 + (d.i % 2) * 6, s: 1.0, flip: reaper && reap > 0.5 ? false : flip && go < 0.5, walk: (reap > 0 && reap < 1 && reaper) || (go > 0 && go < 1 && d.i >= 1 && d.i <= 3) ? x * 0.05 : undefined, armF: 20 + swingK * 60 + point * 10 + (d.i === 0 ? bump(t, 0.2, 0.9) * 50 : 0), armB: 12, head: -point * 10 + (d.i === 0 ? bump(t, 0.2, 0.9) * 8 : 0) + swingK * 10, lean: swingK * 10, blink: blinkAt(T, d.seed) });
      });
      /* v36a — wages and sheaves for eternal life */
      sheaves.forEach((sh, i) => {
        const k = es(t, 2.3 + i * 0.18, 2.45 + i * 0.18, ease.back);
        vis(sh, { x: 1000 + i * 60, y: FLOOR + 24, s: k, o: k > 0.01 ? 1 - go * 0 : 0 });
        fade(sh.querySelector('.sg'), es(t, 2.7, 2.95) * 0.9);
      });
      coins.forEach((cn, i) => {
        const k = seg(t, 2.5 + i * 0.1, 2.9 + i * 0.1);
        vis(cn, { x: 1200 + i * 40, y: 470 + k * 60 - Math.sin(k * PI) * 50, sx: Math.cos(k * 14), o: k > 0 && k < 1 ? 1 : 0 });
      });
      sparks.forEach((sp, i) => {
        const k = ((T * 0.4 + i / 5) % 1);
        vis(sp, { x: 990 + i * 30, y: FLOOR - 60 - k * 90, s: 0.5 + (1 - k) * 0.5, o: es(t, 2.7, 2.95) * (1 - es(t, 3.9, 4.1)) * Math.sin(k * PI) });
      });
      /* v36b — sower and reaper rejoice together */
      const sw = es(t, 3.05, 3.5, ease.out) * (1 - es(t, 5.0, 5.4));
      const sx = lerp(1720, 1300, sw);
      const joy = es(t, 3.45, 3.6) * (1 - es(t, 4.1, 4.3));
      const hop = Math.abs(Math.sin(T * 5)) * 8 * joy;
      sower.set({ x: sx, y: FLOOR + 6 - hop, s: 1.0, flip: true, walk: sw > 0 && sw < 1 ? sx * 0.05 : undefined, armF: 20 + joy * 110, armB: 20 + joy * 40, o: sw > 0.01 ? 1 : 0, blink: blinkAt(T, 7) });
      hearts.forEach((h, i) => {
        const k = es(t, 3.55 + i * 0.1, 3.75 + i * 0.1, ease.back) * (1 - es(t, 4.1, 4.3));
        vis(h, { x: 1250 + i * 50, y: 470 - k * 20 + Math.sin(T * 2 + i) * 4, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v37 — one sows, another reaps */
      plates.forEach((p, i) => {
        const k = es(t, 4.05 + i * 0.15, 4.35 + i * 0.15, ease.out) * (1 - es(t, 4.9, 5.2, ease.in));
        swing(p.el, p.x, 280 - (1 - k) * 700, k > 0.001 ? T : 0, 1.3, 0.8, i);
        fade(p.el, k > 0.001 ? 1 : 0);
      });
      /* v38b — those who laboured before */
      const ghost = es(t, 6.05, 6.35) * (1 - es(t, 6.55, 6.9) * 0.85);
      olds.forEach((o) => o.p.set({ x: o.x, y: 640, s: 0.5, flip: o.x > 800, o: ghost * 0.85, armF: 60 + (ghost > 0.01 ? Math.sin(T + o.i) * 10 : 0), lean: 16, head: 10 }));

      S.cam.y = kf(t, [[-0.5, 20], [0.5, -40], [1.05, -40], [1.5, -80], [2.0, 20], [3.0, 20], [4.0, -40], [5.0, 0], [6.0, -20]]);
      S.cam.x = kf(t, [[-0.5, 0], [1.5, 40], [2.0, 110], [3.5, 110], [4.0, 0], [5.0, 60], [6.0, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.5, 1.02], [1.5, 1.06], [2.0, 1.18], [3.5, 1.18], [4.0, 1.04], [6.0, 1.04]]);
    };
  },
};
