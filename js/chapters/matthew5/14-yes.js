// Mt 5,36–37 — a painted flat by a courtyard wall. A young man lays his hand on his head to swear by it; a lens
// comes down and shows one of his dark hairs — a little brush paints it white, but the white will not stay: he
// cannot make one hair white or black (beside him an old man strokes the white beard the years have given him).
// "Let your speech be Yes, yes; No, no": two plain tags come down. "Anything more comes from the evil one": out of
// his mouth tumbles a tangle of curly, flourished word-slips, and behind them a dark shadow of a serpent coils.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SKY, LOOK, hairLens, tagWord, wordCard, man, tr, PI } from './lib.js';

const G = 684;
const YX = 640, OX = 1030;

function brush(c) {
  return sheet().p(c.ribbon([[0, 0], [0, -70]], 5), C.wood).p(c.cut([[-5, 0], [5, 0], [4, 12], [0, 20], [-4, 12]], 0.2, 3), C.linen).p(c.cut(c.rect(-5, -4, 10, 6), 0.2, 3), C.stone2).out();
}
/** a tangle of extra words: flourished slips; origin: its left end */
function tangle(c) {
  let out = '';
  for (let i = 0; i < 6; i++) {
    const x = i * 34 + c.rr(-6, 6), y = c.rr(-50, 20), r = c.rr(-40, 40), w = c.rr(40, 60);
    const s = sheet().p(c.cut([[-w / 2, -11], [w / 2, -12], [w / 2 + 2, 11], [-w / 2 - 1, 12]], 0.6, 5), mix(C.cream, C.stone, 0.2 + (i % 3) * 0.1));
    let sc = '';
    const pts = [];
    for (let k = 0; k <= 12; k++) pts.push([-w / 2 + 6 + (k / 12) * (w - 12), Math.sin(k * 1.6) * 5]);
    sc += c.ribbon(pts, 1.6);
    s.x(sc, C.inkSoft, 'opacity=".7"');
    s.x(c.ribbon(c.arc(w / 2 - 2, -14, 8, 8, PI * 0.5, PI * 2.2, 10), 1.4), C.ochre, 'opacity=".8"');
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)})">${s.out()}</g>`;
  }
  return out;
}
/** the dark shadow of a serpent, coiling; origin: its head */
function serpent(c, col) {
  const pts = [];
  for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([u * 300 - 20, Math.sin(u * PI * 2.6) * 40 * (0.4 + u * 0.6) + u * 30]); }
  const s = sheet().p(c.ribbon(pts, (u) => 18 - u * 14), col);
  s.p(c.cut([[-40, -2], [-18, -16], [4, -10], [6, 8], [-18, 12]], 0.5, 4), col);
  s.x(c.poly(c.circ(-16, -4, 2.4, 6)), C.sunRay);
  s.x(c.ribbon([[-40, 0], [-54, -4], [-60, 2]], 1.4) + c.ribbon([[-54, -4], [-60, -8]], 1.2), C.sunRay, 'opacity=".8"');
  return s.out();
}

export default {
  id: 'mt5-yes',
  enter: 'fly',
  beats: [
    { v: 36 },
    { v: 37, text: 'Niech wasza mowa będzie: Tak, tak; nie, nie.' },
    { v: 37, cont: true, text: 'A co nadto jest, od Złego pochodzi.' },
  ],
  cam: { x: [-20, 30], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.day);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.2), x0: -1400, x1: 3000 }).markup);
    const wallL = S.layer({ par: 0.26, sh: 3 });
    const w = sheet();
    w.p(c.cut([[-1400, 440], [3000, 430], [3000, G], [-1400, G]], 0.8, 14), C.plaster);
    let patch = '';
    for (let i = 0; i < 12; i++) patch += c.cut(c.blob(c.rr(-300, 1900), c.rr(470, 640), c.rr(30, 80), c.rr(14, 30), 10, 0.2), 0.8, 6);
    w.x(patch, C.plaster2, 'opacity=".55"');
    w.p(c.cut([[-1400, 424], [3000, 414], [3000, 440], [-1400, 450]], 0.5, 12), mix(C.clay, C.sand2, 0.4));
    w.p(c.cut([[1150, 600], [1150, 520], ...c.arc(1190, 520, 40, 34, PI, 2 * PI, 8), [1230, 600]], 0.4, 5), mix(C.soilDark, C.wood2, 0.3));
    w.p(c.cut([[-1400, G - 2], [3000, G - 6], [3000, 1800], [-1400, 1800]], 0.8, 14), mix(C.sand, C.stone, 0.35));
    wallL.add(w.out());
    wallL.add(`<g transform="translate(${OX} ${G})">${sheet().p(c.cut(c.rect(-70, -40, 140, 14), 0.4, 6), C.wood).p(c.cut(c.rect(-62, -26, 10, 26), 0.3, 4) + c.cut(c.rect(52, -26, 10, 26), 0.3, 4), C.wood2).out()}</g>`);

    /* the two men */
    const P = S.layer({ par: 0.34, sh: 5 });
    const old = S.puppet(P.add(person(c, { robe: C.linen2, mantle: C.tealRobe, hair: C.linen, hairStyle: 'short', beard: 'full', beardColor: C.linen, skin: C.skin2, belt: C.leather, pose: 'sit' })));
    const serpL = S.layer({ par: 0.34, sh: 3 });
    const snake = serpL.add(`<g>${serpent(c, mix(C.storm2, C.ink, 0.35))}</g>`);
    const P2 = S.layer({ par: 0.34, sh: 5 });
    const young = S.puppet(P2.add(person(c, { ...man(c, { robe: C.dustyBlue, mantle: C.wheatRobe }), hair: C.hair3, hairStyle: 'curly', beard: 'none' })));
    const tng = P2.add(`<g>${tangle(c)}</g>`);

    /* from the flies: the lens with one hair, the brush; the two tags */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const lens = fly.add(`<g><path d="M0 -2400V-78" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${hairLens(c, 70)}</g>`);
    const hairW = lens.querySelector('.hairW');
    const br = fly.add(`<g>${brush(c)}</g>`);
    const drips = fly.add(`<g>${[0, 1, 2].map((i) => `<path d="${c.cut(c.ell(i * 14 - 14, 0, 3, 5, 8), 0.1, 2)}" fill="${C.linen}"/>`).join('')}</g>`);
    const yes = fly.add(`<g>${tagWord(c, tr('Tak, tak', '‘Yes’ be ‘Yes’'), { size: 26 })}</g>`);
    const no = fly.add(`<g>${tagWord(c, tr('Nie, nie', '‘No’ be ‘No’'), { size: 26 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v36 — by his head: the hair cannot be made white */
      const swear = es(t, 0.05, 0.22) * (1 - es(t, 0.8, 0.95));
      const lk = es(t, 0.1, 0.34, ease.out) * (1 - es(t, 1.0, 1.22));
      const ly = lerp(-400, 260, lk) - es(t, 1.0, 1.22) * 300;
      pose(lens, { x: 800, y: ly, r: Math.sin(T * 0.8) * 1.5, o: lk > 0.01 ? 1 : 0 });
      const paint = es(t, 0.34, 0.46), peel = es(t, 0.5, 0.64);
      fade(hairW, paint * (1 - peel));
      const bk = es(t, 0.28, 0.36) * (1 - es(t, 0.5, 0.58));
      pose(br, { x: 800 + lerp(60, -30, paint), y: ly - 20 + Math.sin(paint * PI * 3) * 8, r: -40, o: bk });
      pose(drips, { x: 800, y: ly + 20 + peel * 90, o: bump(t, 0.52, 0.76) });
      const shrug = bump(t, 0.6, 0.95);

      /* v37a — Yes, yes; No, no */
      const yk = es(t, 1.06, 1.3, ease.back), nk = es(t, 1.2, 1.44, ease.back);
      pose(yes, { x: 690, y: lerp(-300, 240, yk), r: Math.sin(T * 1.1) * 1.5, o: yk > 0.01 ? 1 : 0 });
      pose(no, { x: 930, y: lerp(-300, 240, nk), r: Math.sin(T * 1.2 + 1) * 1.5, o: nk > 0.01 ? 1 : 0 });
      const nod = bump(t, 1.3, 1.5) - bump(t, 1.5, 1.7);

      /* v37b — anything more: a tangle of words, and the serpent's shadow behind */
      const tg = es(t, 2.1, 2.4, ease.out);
      const talk = bump(t, 2.05, 2.5);
      pose(tng, { x: YX + 60, y: G - 220 + (1 - tg) * 40, s: 0.3 + tg * 0.7, r: -6 + Math.sin(T * 1.5) * 3 * tg, o: tg > 0.01 ? 1 : 0 });
      const sk = es(t, 2.3, 2.62);
      pose(snake, { x: lerp(1300, YX + 100, sk), y: G - 300, s: 1.2, o: sk * 0.9 });

      young.set({ x: YX, y: G + 6, s: 1.04, armB: swear * 128, armF: 20 + shrug * 50 + talk * 50, head: -swear * 8 + nod * 8 - shrug * 4 + talk * -4, lean: talk * 4, blink: blinkAt(T, 1) });
      old.set({ x: OX, y: G, s: 1.0, flip: true, armF: 30 + bump(t, 0.5, 1.0) * 70, head: 6, blink: blinkAt(T, 2) });

      S.cam.z = 1.02 + es(t, 0.1, 0.4) * 0.04 * (1 - es(t, 1, 1.3));
      S.cam.y = -12;
    };
  },
};
