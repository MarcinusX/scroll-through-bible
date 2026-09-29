// Łk 11,11–13 — a painted flat flies in: a family courtyard in the warm afternoon, a vine over the wall, the doorway
// of the house. The father sits on his bench with the day's food in a basket beside him; his little son runs up and
// asks. "If your son asks for bread, will you give him a stone?": a grey stone like a loaf swings down on a string in
// front of the father — a question — it is struck through and snatched away, and the father gives the boy a warm
// loaf. "Or for a fish, a snake instead of a fish?": a coiled snake swings down, is struck out, and the boy gets a
// fish. "Or for an egg, a scorpion?": the same — and the boy has his egg. "How much more will the heavenly Father give
// the Holy Spirit to those who ask him!": father and son and the mother in the doorway kneel and lift their hands;
// the sky over the courtyard opens into light (never a figure) and the dove comes down to them.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, cloud } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { FATHER, SON, WIFE, breadLoaf, stoneLoaf, snake, smallFish, egg, scorpion, basket, crossX, qMark, speech, dove, flapWings, fatherLight, rayBurst, glow, handAt, headP, kf, moving, PI, HEAVEN } from './lib.js';

const GY = 700;
const FX = 930;          // the father's bench
const BX = 660;          // where the boy stands to ask
const WALL = 470;

export default {
  id: 'lk11-gifts',
  enter: 'fly',
  beats: [
    { v: 11, text: 'Jeżeli którego z was, ojców, syn poprosi o chleb, czy poda mu kamień?' },
    { v: 11, cont: true, text: 'Albo o rybę, czy zamiast ryby poda mu węża?' },
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-20, 30], y: [-40, 130], z: [1, 1.52] },
  build(S) {
    const c = S.c;
    sky(S, ['#cddcd4', '#f3e0bc', '#f8e6c6']);
    const gold = sky(S, HEAVEN, { name: 'gold', rise: 0 }).layer;
    gold.fade(0);
    const raysL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    raysL.add(`<g transform="translate(800 120)">${rayBurst(c, { n: 28, r0: 50, r1: 480, spread: 0.035, color: '#fff3cf', o: 0.45 })}</g>`);
    raysL.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 3, rise: 0 });
    const light = hangL.add(`<g opacity="0">${fatherLight(c, 54)}</g>`);
    const cl1 = hanging(hangL, cloud(c, 200), { x: 0, y: -1500, len: 900 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 0, y: -1500, len: 900 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.sand, 0.2) }).markup);

    /* the courtyard wall with the doorway of the house, a vine; the ground */
    const wallL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plaster, C.peach, 0.2);
    const ws = sheet();
    const dw = [[380, GY], [380, 520], ...c.arc(430, 520, 50, 40, PI, 2 * PI, 10), [480, GY]];
    ws.p(c.cut([[-900, WALL], [2500, WALL - 4], [2500, GY + 4], [-900, GY + 4]], 0.8, 16) + c.hole(dw, 0.4, 6), wcol);
    ws.p(c.cut([[-900, WALL - 16], [2500, WALL - 20], [2500, WALL + 2], [-900, WALL + 4]], 0.5, 12), shade(wcol, -0.1));
    ws.p(c.ribbon(dw.slice(1, -1), 10), C.wood2);
    ws.p(c.ribbon([[1180, GY], [1170, 560], [1150, 480], [1100, 440], [1000, 430], [900, 440]], 6), C.wood2);
    let lv = '';
    for (let i = 0; i < 16; i++) lv += c.cut(c.blob(c.rr(880, 1200), c.rr(420, 480), c.rr(14, 22), c.rr(10, 14), 8, 0.2), 0.6, 4);
    ws.p(lv, C.leaf);
    let gr = '';
    for (let i = 0; i < 4; i++) { const x = 940 + i * 60, y = 488; for (let k = 0; k < 6; k++) gr += c.cut(c.circ(x + (k % 3) * 7 - 7, y + Math.floor(k / 3) * 8, 4.5, 8), 0.2, 3); }
    ws.p(gr, C.plumRobe);
    wallL.add(`<path d="${c.poly(dw)}" fill="${mix(C.soilDark, C.plumRobe, 0.3)}"/>` + ws.out());
    const G = S.layer({ par: 0.36, sh: 3 });
    const gs = sheet().p(c.cut([[-900, GY - 6], [2500, GY - 8], [2500, 1800], [-900, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.35));
    let tl = '';
    for (let i = 0; i < 40; i++) tl += c.cut(c.blob(c.rr(-300, 1900), c.rr(GY + 20, 1000), c.rr(14, 26), c.rr(5, 9), 8, 0.2), 0.3, 4);
    gs.x(tl, C.stone2, 'opacity=".5"');
    G.add(gs.out());

    /* the light round the dove sits behind the people */
    const dvGlow = S.layer({ par: 0.42, sh: 0, flat: true });
    const spirit = dvGlow.add(`<g opacity="0">${glow(170, 0.9, 'halo-glow')}</g>`);
    /* the people */
    const P = S.layer({ par: 0.42, sh: 5 });
    P.add(sheet().p(c.cut([[FX - 60, GY - 54], [FX + 70, GY - 54], [FX + 70, GY - 42], [FX - 60, GY - 42]], 0.4, 6), C.wood).p(c.cut(c.rect(FX - 54, GY - 44, 12, 44), 0.3, 4) + c.cut(c.rect(FX + 52, GY - 44, 12, 44), 0.3, 4), C.wood2).out());
    P.add(`<g transform="translate(${FX + 120} ${GY + 4}) scale(1.25)">${basket(c, { w: 70, h: 40, full: true })}</g>`);
    const mother = S.puppet(P.add(person(c, WIFE)));
    const motherK = S.puppet(P.add(person(c, { ...WIFE, pose: 'kneel' })));
    const father = S.puppet(P.add(person(c, { ...FATHER, pose: 'sit' })));
    const fatherK = S.puppet(P.add(person(c, { ...FATHER, pose: 'kneel' })));
    const son = S.puppet(P.add(person(c, SON)));
    const sonK = S.puppet(P.add(person(c, { ...SON, pose: 'kneel' })));
    /* the good gifts (given) and where they are laid at the boy's feet */
    const GOOD = [breadLoaf(c, 18), `<g transform="scale(1.1)">${smallFish(c, { col: C.lake3 })}</g>`, egg(c, 10)].map((m) => P.add(`<g opacity="0">${m}</g>`));
    /* the bad gifts on their strings, the question, the strike */
    const FX_ = S.layer({ par: 0.44, sh: 5 });
    const BAD = [stoneLoaf(c, 34), `<g transform="scale(1.3)">${snake(c)}</g>`, `<g transform="scale(1.5)">${scorpion(c)}</g>`].map((m) => hanging(FX_, `<circle r="60" fill="${C.stone}" opacity="0"/>${m}`, { x: 0, y: -1500, len: 900 }));
    const qm = FX_.add(`<g opacity="0">${qMark(c, 54)}</g>`);
    const strike = FX_.add(`<g opacity="0">${crossX(c, 26)}</g>`);
    const want = [breadLoaf(c, 14), smallFish(c, { col: C.lake3 }), egg(c, 9)].map((m) => FX_.add(`<g opacity="0">${speech(c, `<g transform="translate(0 8)">${m}</g>`, { w: 60, h: 46 })}</g>`));
    const dv = FX_.add(`<g opacity="0">${dove(c)}</g>`);

    return (t, time) => {
      const T = time;
      pose(cl1, { x: 470 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 200, r: T ? Math.sin(T * 0.6) : 0 });
      pose(cl2, { x: 1150, y: 170, r: T ? Math.sin(T * 0.6 + 1) : 0 });
      const kneel = es(t, 3.08, 3.14);

      /* the boy asks, three times; the bad thing swings in and is struck out; the father gives the good thing */
      const b = Math.min(2, Math.max(0, Math.floor(t)));
      const u = t - b;
      const run = kf(t, [[-0.4, 560], [0.1, BX]]);
      const ask = t < 3 ? bump(u, 0.02, 0.5) : 0;
      const got = t < 3 ? es(u, 0.66, 0.76) * (1 - es(u, 0.92, 1.0)) : 0;
      son.set({ x: run, y: GY + 4, s: 0.86, o: 1 - kneel, walk: moving(t, [[-0.4, 560], [0.1, BX]]) ? run * 0.08 : undefined, armF: 30 + ask * 60 + got * 40, armB: 10 + ask * 40 + got * 60, head: -10 - ask * 6, blink: blinkAt(T, 2) });
      const give = t < 3 ? bump(u, 0.5, 0.86) : 0;
      father.set({ x: FX, y: GY, s: 1.3, flip: true, o: 1 - kneel, armF: 20 + give * 60 + bump(u, 0.2, 0.5) * 20, armB: 10 + bump(u, 0.45, 0.6) * 50, head: 6 - give * 4 - bump(u, 0.3, 0.55) * 6, blink: blinkAt(T, 1) });
      want.forEach((w, i) => {
        const k = b === i && t < 3 ? es(u, 0.03, 0.12, ease.back) * (1 - es(u, 0.4, 0.48)) : 0;
        const [hx, hy] = headP(BX, GY + 4, 0.86);
        pose(w, { x: hx + 10, y: hy - 14, s: k * 1.3, o: k > 0.01 ? 1 : 0 });
      });
      BAD.forEach((el, i) => {
        const on = b === i && t < 3;
        const down = on ? es(u, 0.1, 0.28, ease.out) * (1 - es(u, 0.86, 0.98, ease.in)) : 0;
        pose(el, { x: 812, y: lerp(-400, 440, down), r: T ? Math.sin(T * 1.4) * 5 : 0, o: down > 0.004 ? 1 : 0 });
      });
      const qk = t < 3 ? es(u, 0.24, 0.32, ease.back) * (1 - es(u, 0.86, 0.94)) : 0;
      pose(qm, { x: 870, y: 380, s: qk, o: qk > 0.01 ? 1 : 0 });
      const sk = t < 3 ? es(u, 0.42, 0.5, ease.back) * (1 - es(u, 0.86, 0.94)) : 0;
      pose(strike, { x: 850, y: 462, s: sk, o: sk > 0.01 ? 1 : 0 });
      const [fhx, fhy] = handAt(FX, GY, 1.3, true, 80, 'sit');
      const [shx, shy] = handAt(BX, GY + 4, 0.86, false, 90);
      GOOD.forEach((el, i) => {
        if (t < i + 0.52) { pose(el, { o: 0 }); return; }
        const pass = es(t, i + 0.52, i + 0.7);
        const lay = es(t, i + 0.92, i + 1.05);
        const fx = lerp(fhx, shx + 8, pass), fy = lerp(fhy - 4, shy - 4, pass) - Math.sin(pass * PI) * 30;
        const lx = BX - 70 + i * 36, ly = GY + 18;
        const x = lerp(fx, lx, lay), y = lerp(fy, ly, lay);
        pose(el, { x, y, o: 1 });
      });

      /* v13 — the heavenly Father gives the Holy Spirit to those who ask */
      const open = es(t, 3.05, 3.4);
      gold.fade(open * 0.8);
      raysL.fade(es(t, 3.3, 3.6));
      pose(light, { x: 800, y: 120, s: 0.5 + open * 0.5, o: open });
      mother.set({ x: 440, y: GY + 2, s: 1.2, o: es(t, 2.9, 3.0) * (1 - kneel), armF: 20, armB: 10, head: 4, blink: blinkAt(T, 3) });
      const lift = es(t, 3.15, 3.35);
      motherK.set({ x: 560, y: GY + 6, s: 1.2, o: kneel, armF: 40 + lift * 40, armB: 30 + lift * 90, head: -10 - lift * 8, blink: blinkAt(T, 3) });
      sonK.set({ x: BX, y: GY + 8, s: 0.86, o: kneel, armF: 40 + lift * 40, armB: 30 + lift * 100, head: -12 - lift * 6, blink: blinkAt(T, 2) });
      fatherK.set({ x: FX - 60, y: GY + 4, s: 1.24, flip: true, o: kneel, armF: 40 + lift * 40, armB: 30 + lift * 100, head: -12 - lift * 6, blink: blinkAt(T, 1) });
      const dk = es(t, 3.3, 3.75, ease.out);
      pose(dv, { x: lerp(800, 780, dk), y: lerp(160, 470, dk), s: 1.1, o: dk > 0.01 ? 1 : 0 });
      if (dk > 0) flapWings(dv, T, 30, 7);
      pose(spirit, { x: 780, y: 560, s: 0.6 + dk * 0.6, o: dk });

      S.cam.y = kf(t, [[0, 90], [3.0, 90], [3.4, -30]]);
      S.cam.z = kf(t, [[0, 1.3], [3.0, 1.3], [3.4, 1.06]]);
      S.cam.x = kf(t, [[0, 10], [3.0, 10], [3.4, 0]]);
    };
  },
};
