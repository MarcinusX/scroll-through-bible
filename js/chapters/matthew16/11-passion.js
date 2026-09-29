// Mt 16,21 — "From that time Jesus began to show His disciples…": at dusk they sit round Him in a circle, and a lit
// paper screen is let down for a shadow play. The Son of Man walks the long road up to Jerusalem; the elders, the chief
// priests and the scribes step out of the gate and turn Him away, and He goes on bowed; "be killed": a small cross
// stands on the hill, the screen darkens, a cloth is lowered and the candle beside it is snuffed; "and on the third
// day be raised": three marks for three days, the cloth rises, the sun comes up — and on the hill He stands again in
// light, the cross empty behind Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, stars, grass } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { candle, shadowPerson, walledCity, hangAt, LEADERS, DUSK, tr, PI } from './lib.js';

const GY = 676, JX = 800;
const SW = 560, SH = 250;          // the shadow screen
const INK = '#3b2a22';
const DIS = [
  { o: CAST.john, x: 545 }, { o: CAST.andrew, x: 615 }, { o: CAST.james, x: 680 },
  { o: CAST.peter, x: 925 }, { o: CAST.matthew, x: 1000 }, { o: CAST.thomas, x: 1070 },
];

export default {
  id: 'mt16-passion',
  beats: [
    { v: 21, text: 'Odtąd zaczął Jezus wskazywać swoim uczniom na to, że musi iść do Jerozolimy' },
    { v: 21, cont: true, text: 'i wiele cierpieć od starszych i arcykapłanów, i uczonych w Piśmie;' },
    { v: 21, cont: true, text: 'że będzie zabity' },
    { v: 21, cont: true, text: 'i trzeciego dnia zmartwychwstanie.' },
  ],
  cam: { x: [-20, 20], y: [-40, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DUSK);
    const nightL = sky(S, ['#433f6b', '#8b6f8a', '#c79a8e'], { name: 'night', rise: 0 }).layer;
    nightL.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 70 }));

    /* ---------- the land at dusk ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 460, amps: [18, 8, 3], lens: [1100, 380, 140], color: '#b7a3b4' }).markup);
    S.layer({ par: 0.16, sh: 2 }).add(hillsWith(c, { y: 510, amps: [12, 6, 2], lens: [900, 300, 110], color: '#a9b096', trees: 16, treeColor: '#7f8d6c', treeH: 22 }).markup);
    const groundL = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(GY - 70, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dusk, 0.18)).out());
    groundL.add(grass(c, { x0: -600, x1: 2200, y: GY - 70, fn: gfn, n: 30, h: 12, color: C.olive }) + olive(c, 330, GY - 66, 1) + cypress(c, 1290, GY - 64, 180) + cypress(c, 1340, GY - 60, 140));

    /* ---------- the shadow screen ---------- */
    const scrL = S.layer({ par: 0.08, sh: 7 });
    const clip = S.id('scr');
    const frame = sheet().p(c.cut(c.rect(-SW / 2 - 12, -12, SW + 24, SH + 24), 0.6, 8), C.wood2).out();
    const paper = `<rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="#f7e6c4"/><circle cx="0" cy="${SH * 0.55}" r="${SW * 0.6}" fill="url(#warm-glow)" opacity=".7"/>`;
    const hill = sheet().p(c.cut([[-SW / 2 - 10, SH], [-SW / 2 - 10, 206], [-140, 198], [-20, 186], [60, 168], [120, 150], [170, 146], [SW / 2 + 10, 150], [SW / 2 + 10, SH]], 1, 10), INK).out(false);
    const road = `<path d="${c.ribbon(c.qbez([-SW / 2, 230], [-40, 222], [150, 150], 12), (u) => 10 - u * 7)}" fill="#6b5240"/>`;
    const city = `<g>${walledCity(c, 210, 150, 0.62, { wall: INK, wall2: INK, temple: INK }).split('#d9a45b').join(INK).split(C.sun).join(INK).split(C.soilDark).join('#f7e6c4').split(C.plaster).join(INK)}</g>`;
    const label = `<g data-k="slabel"><text x="210" y="70" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" font-style="italic" fill="${INK}">${tr('Jerozolima', 'Jerusalem')}</text></g>`;
    const jSil = `<g data-k="sj">${shadowPerson(c, CAST.jesus, INK)}</g>`;
    const risen = `<g data-k="srisen"><circle cy="-80" r="80" fill="url(#halo-glow)"/>${shadowPerson(c, CAST.jesus, INK)}</g>`;
    const leaders = LEADERS.map((o, i) => `<g data-k="sl${i}">${shadowPerson(c, o, INK)}</g>`).join('');
    const crossM = `<g data-k="scross">${sheet().p(c.cut([[-3, -60], [3, -60], [3, 0], [-3, 0]], 0.2, 4) + c.cut([[-18, -46], [18, -46], [18, -40], [-18, -40]], 0.2, 4), INK).out(false)}</g>`;
    const ticks = [0, 1, 2].map((i) => `<g data-k="st${i}"><path d="${c.ribbon([[0, -14], [1, 14]], 5)}" fill="${INK}"/></g>`).join('');
    const sunM = `<g data-k="ssun"><path d="${c.poly(c.star(0, 0, 70, 44, 16, 0))}" fill="#f5c35c" opacity=".7"/><path d="${c.cut(c.circ(0, 0, 38, 30), 0.4, 4)}" fill="${C.sun}"/></g>`;
    const dark = `<rect data-k="sdark" x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="#2a2030" opacity="0"/>`;
    const clothM = (() => {
      const pts = [[-SW / 2 - 6, -SH], [SW / 2 + 6, -SH], [SW / 2 + 6, 0]];
      for (let x = SW / 2 + 6; x > -SW / 2 - 6; x -= 40) pts.push(...c.arc(x - 20, 0, 20, 14, 0, PI, 5));
      return `<g data-k="scloth">${sheet().p(c.cut(pts, 0.8, 8), shade(C.plumRobe, -0.3)).x(Array.from({ length: 7 }, (_, i) => c.ribbon([[-SW / 2 + 40 + i * 80, -SH], [-SW / 2 + 44 + i * 80, -4]], 8)).join(''), shade(C.plumRobe, -0.45), 'opacity=".5"').out()}</g>`;
    })();
    const scr = scrL.add(`<g><path d="M${-SW / 2 + 30} -12V-1500M${SW / 2 - 30} -12V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${frame}<defs><clipPath id="${clip}"><rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}"/></clipPath></defs><g clip-path="url(#${clip})">${paper}${sunM}${hill}${road}${city}${label}${crossM}${leaders}${jSil}${risen}${ticks}${dark}${clothM}</g><g transform="translate(${-SW / 2 - 44} ${SH + 6})">${candle(c, 44)}</g></g>`);
    const sj = S.puppet(S.$('sj').firstElementChild);
    const sr = S.puppet(S.$('srisen').lastElementChild);
    const srG = S.$('srisen');
    const sl = [0, 1, 2].map((i) => S.puppet(S.$('sl' + i).firstElementChild));
    const sCross = S.$('scross'), sDark = S.$('sdark'), sCloth = S.$('scloth'), sSun = S.$('ssun'), sLabel = S.$('slabel');
    const sTicks = [0, 1, 2].map((i) => S.$('st' + i));
    const flame = scr.querySelector('.flame'), cglow = scr.querySelector('.glow');

    /* ---------- the circle of disciples round Jesus ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    P.add(rock(c, JX, GY + 6, 110, 40, C.rock2));
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, { ...d.o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 120, 900, 220, '#8fa58a', C.moss) + rock(c, 1480, 920, 240, 90, C.rock2) + bush(c, 1640, 900, 170, C.moss));

    return (t, time) => {
      const T = time;
      const dim = es(t, 2.0, 2.4) * (1 - es(t, 3.05, 3.6));
      nightL.fade(dim * 0.7 + es(t, 0, 4) * 0.25);
      starL.fade(dim * 0.8 + 0.15);
      sk.set(...DUSK);

      /* the screen comes down */
      const down = es(t, -0.25, 0.2, ease.back);
      hangAt(scr, JX, 150 - (1 - down) * 700, T, 0.6, 0.6, 1);
      pose(sLabel, { o: 1 - es(t, 1.8, 2.0) });
      // v21a — He walks the long road up to the city
      const walkU = seg(t, 0.08, 0.95);
      const sx = lerp(-250, 90, walkU), sy = lerp(226, 170, walkU);
      // v21b — the leaders come out of the gate and turn Him away; He goes on, bowed
      const pushed = bump(t, 1.2, 1.8);
      const bowed = es(t, 1.3, 1.6);
      sj.set({ x: sx - pushed * 34, y: sy + pushed * 4, s: 0.36, flip: false, walk: t < 0.95 ? sx * 0.25 : undefined, lean: 4 + bowed * 14, head: 10 + bowed * 12, o: 1 - es(t, 2.0, 2.15) });
      sl.forEach((p, i) => {
        const on = es(t, 1.05 + i * 0.08, 1.3 + i * 0.08);
        p.set({ x: 150 + i * 36 - on * 20, y: 166 - i * 4, s: 0.36, flip: true, o: on * (1 - es(t, 1.95, 2.1)), armF: on * (70 + i * 20), armB: on * (i === 1 ? 150 : 30), head: -6 });
      });
      // v21c — killed: the cross on the hill, the dark, the cloth, the candle snuffed
      pose(sCross, { x: 30, y: 180, s: es(t, 2.05, 2.25), o: t > 2.05 ? 1 : 0 });
      pose(sDark, { o: es(t, 2.1, 2.45) * 0.75 * (1 - es(t, 3.0, 3.2)) });
      const clothK = es(t, 2.2, 2.65) * (1 - es(t, 3.25, 3.55));
      pose(sCloth, { x: 0, y: clothK * SH * 0.62 });
      const snuff = es(t, 2.3, 2.45) * (1 - es(t, 3.35, 3.45));
      pose(flame, { x: 0, y: -64, sy: (1 - snuff) * (T ? 1 + Math.sin(T * 9) * 0.06 : 1), sx: 1 - snuff * 0.6 });
      pose(cglow, { o: 1 - snuff });
      // v21d — three days; the sun rises; He stands again on the hill in light
      sTicks.forEach((tk, i) => {
        const k = es(t, 3.05 + i * 0.1, 3.14 + i * 0.1, ease.back);
        pose(tk, { x: -SW / 2 + 40 + i * 22, y: 40, s: k, r: 8, o: k > 0.02 ? 1 : 0 });
      });
      const rise = es(t, 3.35, 3.7);
      pose(sSun, { x: 110, y: 216 - rise * 150, s: 0.6 + rise * 0.5, r: T * 8, o: rise > 0.01 ? 1 : 0 });
      const up = es(t, 3.5, 3.7);
      pose(srG, { x: 58, y: 184 - (1 - up) * 20, s: 0.4, o: up });
      sr.set({ armF: 60, armB: 150, head: -8 });

      /* the circle */
      jesus.set({ x: JX, y: GY - 2, s: 0.95, flip: false, armF: 30 + bump(t, 0.1, 0.9) * 40 + bump(t, 1.1, 1.9) * 20 + bump(t, 3.1, 3.9) * 50, armB: 20 + bump(t, 0.1, 0.9) * 60 + bump(t, 3.1, 3.9) * 90, head: -6 + bump(t, 2.1, 2.9) * 12, blink: blinkAt(T) });
      dis.forEach((d) => {
        const listen = es(t, 0.1, 0.4);
        const shock = bump(t, 2.05, 3.0);
        const joy = bump(t, 3.35, 4.1);
        d.p.set({ x: d.x, y: GY + 2 + (d.i % 3 === 2 ? 0 : 6), s: 0.86, flip: d.x > JX, armF: 30 + shock * 40 + joy * 40, armB: 10 + shock * 60, head: -listen * 8 + shock * 14 - joy * 12, blink: blinkAt(T, d.seed) });
      });

      S.cam.z = 1.04 + es(t, 0.2, 0.8) * 0.02;
      S.cam.y = -10 + es(t, 0.2, 0.8) * 10;
    };
  },
};
