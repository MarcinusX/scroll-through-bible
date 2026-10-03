// Mk 8,31–33 — the first prediction of the passion, told as a shadow play on a lit paper screen:
// the road to the city, the leaders who reject Him, the dark (a cloth lowered, a candle snuffed),
// three moons and the rising sun. Then Peter takes Him aside; He turns, looks at the disciples, rebukes Peter.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, moon, sun, stars, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, speech, GLYPH, wordSlip, candle, shadowPerson, walledCity, smallCross, crown, coin, tag, LEADERS, PI } from './lib.js';

const GY = 676, JX = 800;
const SW = 540, SH = 250;          // the shadow screen
const INK = '#3b2a22';
const DIS = [
  { o: CAST.john, x: 545 }, { o: CAST.andrew, x: 615 }, { o: CAST.james, x: 680 },
  { o: CAST.peter, x: 925, k: 'peter' }, { o: CAST.matthew, x: 1050 }, { o: CAST.thomas, x: 1115 },
];

export default {
  id: 'm8-passion',
  beats: [
    { v: 31, text: 'I zaczął ich pouczać, że Syn Człowieczy musi wiele cierpieć,' },
    { v: 31, cont: true, text: 'że będzie odrzucony przez starszych, arcykapłanów i uczonych w Piśmie;' },
    { v: 31, cont: true, text: 'że będzie zabity,' },
    { v: 31, cont: true, text: 'ale po trzech dniach zmartwychwstanie.' },
    { v: 32, text: 'A mówił zupełnie otwarcie te słowa.' },
    { v: 32, cont: true, text: 'Wtedy Piotr wziął Go na bok i zaczął Go upominać.' },
    { v: 33, text: 'Lecz On obrócił się i patrząc na swych uczniów, zgromił Piotra słowami:' },
    { v: 33, cont: true, text: '«Zejdź Mi z oczu, szatanie, bo nie myślisz o tym, co Boże, ale o tym, co ludzkie».' },
  ],
  cam: { x: [-60, 40], y: [-60, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#8f86ad', '#d9a592', '#f0c9a2'];
    const sk = sky(S, SKY);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 70 }));

    /* ---------- the land at dusk ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 460, amps: [18, 8, 3], lens: [1100, 380, 140], color: '#b7a3b4' }).markup);
    const hills = S.layer({ par: 0.16, sh: 2 });
    hills.add(hillsWith(c, { y: 510, amps: [12, 6, 2], lens: [900, 300, 110], color: '#a9b096', trees: 16, treeColor: '#7f8d6c', treeH: 22 }).markup);
    const groundL = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(GY - 70, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dusk, 0.18)).out());
    groundL.add(grass(c, { x0: -600, x1: 2200, y: GY - 70, fn: gfn, n: 30, h: 12, color: C.olive }) + olive(c, 330, GY - 66, 1) + cypress(c, 1290, GY - 64, 180) + cypress(c, 1340, GY - 60, 140));

    /* ---------- the shadow screen ---------- */
    const scrL = S.layer({ par: 0.08, sh: 7 });
    const clip = S.id('scr');
    const frame = sheet().p(c.cut(c.rect(-SW / 2 - 12, -12, SW + 24, SH + 24), 0.6, 8), C.wood2).out();
    const paper = `<rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="#f7e6c4"/><circle cx="0" cy="${SH * 0.55}" r="${SW * 0.6}" fill="url(#warm-glow)" opacity=".7"/>`;
    const hill = sheet().p(c.cut([[-SW / 2 - 10, SH], [-SW / 2 - 10, 200], [-120, 192], [60, 182], [150, 156], [210, 148], [SW / 2 + 10, 154], [SW / 2 + 10, SH]], 1, 10), INK).out(false);
    const road = `<path d="${c.ribbon(c.qbez([-SW / 2, 226], [0, 218], [150, 162], 12), (u) => 10 - u * 7)}" fill="#6b5240"/>`;
    const city = `<g>${walledCity(c, 214, 154, 0.62, { wall: INK, wall2: INK, temple: INK }).split('#d9a45b').join(INK).split(C.sun).join(INK).split(C.soilDark).join('#f7e6c4').split(C.plaster).join(INK)}</g>`;
    const jSil = `<g data-k="sj">${shadowPerson(c, CAST.jesus, INK)}</g>`;
    const leaders = LEADERS.map((o, i) => `<g data-k="sl${i}">${shadowPerson(c, o, INK)}</g>`).join('');
    const crossM = `<g data-k="scross">${sheet().p(c.cut([[-3, -60], [3, -60], [3, 0], [-3, 0]], 0.2, 4) + c.cut([[-18, -46], [18, -46], [18, -40], [-18, -40]], 0.2, 4), INK).out(false)}</g>`;
    const moonsM = [0, 1, 2].map((i) => `<g data-k="sm${i}"><path d="${c.cut(c.circ(0, 0, 14, 16), 0.3, 3)}" fill="#fff8e6"/><path d="${c.cut(c.circ(6, -3, 12, 16), 0.3, 3)}" fill="#e9dcc0"/></g>`).join('');
    const sunM = `<g data-k="ssun"><path d="${c.poly(c.star(0, 0, 70, 44, 16, 0))}" fill="#f5c35c" opacity=".7"/><path d="${c.cut(c.circ(0, 0, 38, 30), 0.4, 4)}" fill="${C.sun}"/></g>`;
    const dark = `<rect data-k="sdark" x="${-SW / 2}" y="0" width="${SW}" height="${SH}" fill="#2a2030" opacity="0"/>`;
    const clothM = (() => {
      const pts = [[-SW / 2 - 6, -SH], [SW / 2 + 6, -SH], [SW / 2 + 6, 0]];
      for (let x = SW / 2 + 6; x > -SW / 2 - 6; x -= 40) pts.push(...c.arc(x - 20, 0, 20, 14, 0, PI, 5));
      return `<g data-k="scloth">${sheet().p(c.cut(pts, 0.8, 8), shade(C.plumRobe, -0.3)).x(Array.from({ length: 7 }, (_, i) => c.ribbon([[-SW / 2 + 40 + i * 80, -SH], [-SW / 2 + 44 + i * 80, -4]], 8)).join(''), shade(C.plumRobe, -0.45), 'opacity=".5"').out()}</g>`;
    })();
    const scr = hanging(scrL, `${frame}<defs><clipPath id="${clip}"><rect x="${-SW / 2}" y="0" width="${SW}" height="${SH}"/></clipPath></defs><g clip-path="url(#${clip})">${paper}${sunM}${moonsM}${hill}${road}${city}${crossM}${leaders}${jSil}${dark}${clothM}</g><g transform="translate(${-SW / 2 - 40} ${SH + 6})">${candle(c, 44)}</g>`, { x: JX, y: 150, len: 900 });
    const sj = S.puppet(S.$('sj').firstElementChild);
    const sl = [0, 1, 2].map((i) => S.puppet(S.$('sl' + i).firstElementChild));
    const sCross = S.$('scross'), sDark = S.$('sdark'), sCloth = S.$('scloth'), sSun = S.$('ssun');
    const sMoons = [0, 1, 2].map((i) => S.$('sm' + i));
    const flame = scr.querySelector('.flame'), cglow = scr.querySelector('.glow');

    /* ---------- the circle of disciples; Jesus ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    P.add(rock(c, JX, GY + 6, 110, 40, C.rock2));
    // phone: the circle drawn in, so the last disciple is not under the thread
    const DX = S.portrait ? [560, 625, 690, 920, 995, 1060] : DIS.map((d) => d.x);
    const dis = DIS.map((d, i) => ({ ...d, x: DX[i], i, p: S.puppet(P.add(person(c, { ...d.o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    const jSit = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jSt = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const pSt = S.puppet(P.add(person(c, CAST.peter)));
    const fx = S.layer({ par: 0.55, sh: 4 });
    const words = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(26, 36))) }));
    const bang = fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40, flip: true })}</g>`);
    const godT = fx.add(`<g><circle r="46" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 26, 16, 12, 0))}" fill="${C.sun}"/><path d="${c.cut(c.circ(0, 0, 14, 16), 0.3, 3)}" fill="${C.halo}"/><g transform="translate(0 26)">${tag(c, tr('co Boże', 'things of God'), { size: 16, w: 118 })}</g></g>`);
    const manT = fx.add(`<g><g transform="translate(0 6)">${crown(c, 38)}</g><g transform="translate(-24 12)">${coin(c, 8)}</g><g transform="translate(24 12)">${coin(c, 8)}</g><g transform="translate(0 26)">${tag(c, tr('co ludzkie', 'things of men'), { size: 16, w: 118, fill: C.stone })}</g></g>`);

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 120, 900, 220, '#8fa58a', C.moss) + rock(c, 1480, 920, 240, 90, C.rock2) + bush(c, 1640, 900, 170, C.moss));

    return (t, time) => {
      const T = time;
      const dim = es(t, 2.0, 2.5) * (1 - es(t, 3.0, 3.6));
      sk.blend(SKY, ['#433f6b', '#8b6f8a', '#c79a8e'], dim * 0.7 + es(t, 5, 8) * 0.3);
      starL.fade(dim * 0.8 + es(t, 5, 8) * 0.4);

      /* the screen: down for v31, flown out after */
      const down = es(t, -0.2, 0.25, ease.back) * (1 - es(t, 4.1, 4.5));
      swing(scr, JX, 150 - (1 - down) * (S.portrait ? 950 : 600), T, 0.6, 0.6, 1);
      // v31a — the Son of Man walks the road, burdened
      const walkU = seg(t, 0.05, 1.8);
      const sx = lerp(-230, 40, walkU), sy = lerp(222, 192, walkU);
      const pushed = bump(t, 1.3, 2.0);
      sj.set({ x: sx - pushed * 40, y: sy + pushed * 4, s: 0.36, flip: false, walk: t < 1.8 ? sx * 0.25 : undefined, lean: 8 + bump(t, 0.3, 1) * 8, head: 12, o: 1 - es(t, 1.9, 2.1) });
      // v31b — elders, chief priests, scribes turn Him away
      sl.forEach((p, i) => {
        const on = es(t, 1.05 + i * 0.08, 1.3 + i * 0.08);
        p.set({ x: 96 + i * 40, y: 180 - i * 6, s: 0.38, flip: true, o: on * (1 - es(t, 1.95, 2.1)), armF: on * (70 + i * 20), armB: on * (i === 1 ? 150 : 30), head: -6 });
      });
      // v31c — killed: a small cross on the hill, the screen darkens, a cloth is lowered, the candle snuffed
      pose(sCross, { x: 60, y: 184, s: es(t, 2.05, 2.3), o: t > 2.05 ? 1 : 0 });
      fade(sDark, es(t, 2.1, 2.5) * 0.75 * (1 - es(t, 3.0, 3.2)));
      const clothK = es(t, 2.2, 2.7) * (1 - es(t, 3.55, 3.85));
      pose(sCloth, { x: 0, y: clothK * SH * 0.62 });
      const snuff = es(t, 2.3, 2.45) * (1 - es(t, 3.5, 3.6));
      pose(flame, { x: 0, y: -64, sy: (1 - snuff) * (1 + Math.sin(T * 9) * 0.06), sx: 1 - snuff * 0.6 });
      fade(cglow, 1 - snuff);
      // v31d — three moons pass; the sun rises
      sMoons.forEach((m, i) => {
        const k = seg(t, 3.02 + i * 0.12, 3.26 + i * 0.12);
        pose(m, { x: lerp(-SW / 2 - 20, SW / 2 + 20, k), y: 90 - Math.sin(k * PI) * 50, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const rise = es(t, 3.4, 3.8);
      pose(sSun, { x: 60, y: 216 - rise * 140, s: 0.6 + rise * 0.5, r: T * 8, o: rise > 0.01 ? 1 : 0 });

      /* the circle */
      const openly = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.05));
      const standK = es(t, 5.05, 5.12);
      jSit.set({ x: JX, y: GY - 2, s: 0.95, flip: false, o: 1 - standK, armF: 30 + openly * 50 + Math.sin(T * 1.5) * 6 * (t < 4.1 ? 1 : 0), armB: 20 + openly * 70 + bump(t, 1.1, 1.9) * 40, head: -6 + bump(t, 2.1, 2.9) * 12, blink: blinkAt(T) });
      // Peter takes Him aside; He turns to the disciples and rebukes Peter
      const AY = GY + 44;
      const jK = [[5.1, [JX, GY]], [5.6, [880, AY]]];
      const [jx, jy] = kf(t, jK);
      const jw = moving(t, jK, 1);
      const turn = es(t, 6.02, 6.1);
      const rebuke = es(t, 6.2, 6.45);
      const behind = es(t, 7.05, 7.3);
      jSt.set({ x: jx, y: jy, s: 1.02, o: standK, flip: turn > 0.5, walk: jw ? jx * 0.05 : undefined, armF: 14 + rebuke * (40 + behind * 20), armB: 8 - behind * 70 + rebuke * 10, head: turn * 4 - bump(t, 5.6, 6) * 6, blink: blinkAt(T) });
      const pK = [[5.05, [925, GY + 4]], [5.3, [950, GY + 24]], [5.6, [975, AY + 4]], [7.05, [975, AY + 4]], [7.6, [1010, AY + 4]]];
      const [px, py] = kf(t, pK);
      const pw = moving(t, pK, 1);
      const scold = es(t, 5.55, 5.7) * (1 - es(t, 6.0, 6.1));
      const bow = es(t, 6.3, 6.6);
      pSt.set({ x: px, y: py, s: 0.98, o: standK, flip: true, walk: pw ? px * 0.05 : undefined, armF: 30 + scold * (70 + Math.sin(T * 8) * 18) + (t < 5.6 ? 40 : 0), armB: scold * 40, head: bow * 22 - scold * 6, lean: bow * 8, blink: blinkAt(T, 2) });
      dis.forEach((d) => {
        const listen = es(t, 0.1, 0.4);
        const shock = bump(t, 2.05, 3.0);
        const joy = bump(t, 3.4, 4.2);
        const gone = d.k === 'peter' ? standK : 0;
        const look = es(t, 6.1, 6.4);
        d.p.set({ x: d.x, y: GY + 2 + (d.i % 3 === 2 ? 0 : 6), s: 0.86, flip: d.x > JX, o: 1 - gone, armF: 30 + shock * 40 + joy * 50, armB: 10 + shock * 60, head: -listen * 8 + shock * 14 - joy * 12 - look * 6, blink: blinkAt(T, d.seed) });
      });

      /* v32a — He speaks openly: words fly clearly to everyone */
      words.forEach((w) => {
        const k = ((T * 0.3 + w.i / words.length) % 1);
        const to = DX[w.i % 6];
        pose(w.el, { x: lerp(JX, to, k), y: GY - 150 - Math.sin(k * PI) * 70, r: Math.sin(T * 2 + w.i) * 10, s: 0.8, o: openly * Math.min(1, k * 5) * (1 - k * 0.6) });
      });
      const bk = es(t, 5.6, 5.75, ease.back) * (1 - es(t, 5.98, 6.05));
      const [phx, phy] = headAt(px, py, 0.98, true);
      pose(bang, { x: phx + 6, y: phy - 30, s: bk, o: bk > 0.02 ? 1 : 0 });
      const [jhx, jhy] = headAt(880, AY, 1.02, true);
      const gt = es(t, 7.1, 7.35, ease.back);
      pose(godT, { x: jhx - 10, y: jhy - 110, s: gt, o: gt > 0.02 ? 1 : 0, r: Math.sin(T * 1.2) * 3 });
      const mt = es(t, 7.35, 7.55, ease.back);
      pose(manT, { x: phx + (S.portrait ? 0 : 60), y: phy - 90 + es(t, 7.7, 8) * 20, s: mt * (1 - es(t, 7.8, 8) * 0.2), o: mt > 0.02 ? 1 - es(t, 7.75, 8) * 0.5 : 0, r: -6 });

      S.cam.x = es(t, 5.1, 5.7) * 40;
      S.cam.z = 1.04 - es(t, 4.0, 4.4) * 0.02 + es(t, 5.0, 5.6) * 0.1;
      S.cam.y = -10 + es(t, 4.0, 4.4) * 60 + es(t, 5.0, 5.6) * 30;
    };
  },
};
