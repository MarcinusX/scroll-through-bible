// Łk 9,30–32 — night on the summit, and He shines. "Two men were talking with Him": two pillars of light open on either
// side and two figures stand in them, turned to Him; "Moses and Elijah": their name tags come down — the tablets for the
// one, the wheel of fire for the other. "They appeared in glory and spoke of His departure, which He was about to
// accomplish at Jerusalem": the glory spreads over the sky and a painted flat comes down between them — a road through
// the parted sea, going up to Jerusalem on its hill, a small cross beside the city and the sun rising behind it. "Peter
// and those with him were heavy with sleep": in front, the three nod and slump, their eyes shut. "When they were fully
// awake, they saw His glory and the two men who stood with Him": they start up, shielding their eyes against the light.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { summitSet, SUM, TW9, JESUS_WHITE, MOSES, ELIJAH, tablets, fireWheel, nameTag, halo, rayBurst, flat, flatSky, flyTo, labelTag, jerusalem, kf, headAt, tr, PI } from './lib.js';

const THREE = [{ k: 'james', x: 470, y: SUM.LEDGE }, { k: 'peter', x: 580, y: SUM.LEDGE + 6 }, { k: 'john', x: 1070, y: SUM.LEDGE }];
const W = 380, H = 200, FX = 800, FY = 262;

export default {
  id: 'lk9-exodus',
  beats: [
    { v: 30, text: 'A oto dwóch mężów rozmawiało z Nim.' },
    { v: 30, cont: true, text: 'Byli to Mojżesz i Eliasz.' },
    { v: 31 },
    { v: 32, text: 'Tymczasem Piotr i towarzysze snem byli zmorzeni.' },
    { v: 32, cont: true, text: 'Gdy się ocknęli, ujrzeli Jego chwałę i obydwóch mężów, stojących przy Nim.' },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const M = summitSet(S);
    const c = S.c;

    /* pillars, the glory */
    const glowL = S.layer({ par: 0.4, sh: 1, flat: true });
    const pillar = (x) => glowL.add(`<g opacity="0"><path d="${c.cut([[x - 60, SUM.SIDE + 6], [x - 30, -400], [x + 30, -400], [x + 60, SUM.SIDE + 6]], 0.5, 20)}" fill="#fff4d6" opacity=".45"/><ellipse cx="${x}" cy="${SUM.SIDE}" rx="90" ry="18" fill="url(#halo-glow)"/></g>`);
    const pilM = pillar(SUM.MX), pilE = pillar(SUM.EX);
    const glory = glowL.add(`<g>${rayBurst(c, { n: 26, r0: 40, r1: 210, spread: 0.026, color: '#ffeec2', o: 0.5 })}${halo(200, 1)}</g>`);

    /* the flat of the departure */
    const flatL = S.layer({ par: 0.3, sh: 6 });
    // the parted sea: two tall walls of water either side of the road, crested with foam
    const wall = (dir) => {
      const inner = (y) => dir * (8 + (y + 4) * 0.2);        // the road's edge (the road widens towards us)
      const outer = dir * (W / 2 + 6);
      const top = [];
      for (let i = 0; i <= 10; i++) { const x = lerp(inner(-4), outer, i / 10); top.push([x, -4 - Math.sin(i * 1.3) * 6 - i * 1.5]); }
      const pts = [[inner(H / 2 + 6), H / 2 + 6], ...top.slice().reverse().map(([x, y]) => [x, y]), [outer, H / 2 + 6]];
      const ws = sheet().p(c.cut(dir < 0 ? pts : pts.slice().reverse(), 0.6, 6), C.lake2);
      let crest = '';
      for (let i = 0; i < 10; i++) { const [x, y] = top[i]; crest += c.cut(c.blob(x + dir * 8, y + 2, 12, 5, 8, 0.2), 0.3, 3); }
      ws.p(crest, C.foam);
      let ln = '';
      for (let k = 1; k < 4; k++) ln += c.ribbon([[inner(k * 26), k * 26], [outer, k * 26 - 10]], 2.4);
      ws.x(ln, mix(C.lake2, C.foam, 0.5), 'opacity=".6"');
      return ws.out();
    };
    const inner = flatSky(S, W, H, ['#e9cf95', '#fbeed0'])
      + `<circle cx="44" cy="-50" r="70" fill="url(#halo-glow)"/><path d="${c.poly(c.star(44, -50, 44, 30, 14, 0))}" fill="#f5c35c" opacity=".7"/><path d="${c.cut(c.circ(44, -50, 22, 20), 0.3, 4)}" fill="${C.sun}"/>`
      + sheet().p(c.cut([[-W / 2 - 4, -24], [-90, -34], [-40, -40], [0, -48], [90, -34], [W / 2 + 4, -26], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.8, 8), mix(C.hillMid, C.sand, 0.35)).out()
      + `<g transform="translate(40 -30) scale(.12)">${jerusalem(c, 1)}</g>`
      + `<g transform="translate(-56 -38)">${sheet().p(c.cut([[-3, -34], [3, -34], [3, 0], [-3, 0]], 0.2, 3) + c.cut([[-11, -26], [11, -26], [11, -21], [-11, -21]], 0.2, 3), C.wood2).out()}</g>`
      + sheet().p(c.cut([[-40, H / 2 + 6], [40, H / 2 + 6], [10, -4], [-8, -4]], 0.6, 6), mix(C.sand, C.cream, 0.4)).out()
      + wall(-1) + wall(1);
    const f1 = flatL.add(flat(S, inner, { w: W, h: H }));
    const cap = flatL.add(`<g opacity="0">${labelTag(tr('odejście — w Jerozolimie', 'his departure — at Jerusalem'), 17)}</g>`);

    /* people */
    const act = S.layer({ par: 0.4, sh: 5 });
    const moses = S.puppet(act.add(person(c, { ...MOSES, holdF: `<g transform="translate(8 -4)">${tablets(c, { w: 18, h: 30 })}</g>` })));
    const elijah = S.puppet(act.add(person(c, ELIJAH)));
    const jesus = S.puppet(act.add(person(c, JESUS_WHITE)));
    const D = THREE.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), a: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))), z: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit', eyes: 'closed' }))) }));
    M.front();
    const tags = S.layer({ par: 0.4, sh: 5 });
    const tagM = hanging(tags, `${nameTag(c, tr('Mojżesz', 'Moses'), { size: 19 })}<g transform="translate(0 78) scale(.9)">${tablets(c, { w: 20, h: 32 })}</g>`, { x: 0, y: -1500, len: 900 });
    const tagE = hanging(tags, `${nameTag(c, tr('Eliasz', 'Elijah'), { size: 19 })}<g transform="translate(0 86) scale(.5)">${fireWheel(c, 34)}</g>`, { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const T = time;
      const gK = 0.35 + es(t, 2.05, 2.4) * 0.35 + bump(t, 4.1, 4.9) * 0.2;
      M.set(T, { k: 1, g: gK, moonK: 1 });
      pose(glory, { x: SUM.JX, y: SUM.TOP - 120, s: 0.8 + gK * 0.5 + bump(t, 4.1, 4.6) * 0.2, r: T * 3, o: 0.8 });

      /* v30 — two men talking with Him; Moses and Elijah */
      const mIn = es(t, 0.15, 0.45), eIn = es(t, 0.25, 0.55);
      pose(pilM, { o: bump(t, 0.05, 1.0) * 0.9 + mIn * 0.3 });
      pose(pilE, { o: bump(t, 0.15, 1.1) * 0.9 + eIn * 0.3 });
      const talk = (k, s) => Math.max(0, Math.sin(T * 1.6 + s)) * k;
      moses.set({ x: SUM.MX, y: SUM.SIDE - (1 - mIn) * 30, s: 1.0, o: mIn, armF: 30 + talk(1, 0) * 20, armB: 10 + bump(t, 2.1, 2.9) * 70, head: -3, blink: blinkAt(T, 3) });
      elijah.set({ x: SUM.EX, y: SUM.SIDE - (1 - eIn) * 30, s: 1.0, flip: true, o: eIn, armF: 20 + talk(1, 2) * 40 + bump(t, 2.2, 2.95) * 50, armB: 20, head: -3, blink: blinkAt(T, 5) });
      const toE = t > 0.6 && Math.sin(T * 0.5) > 0.2;
      jesus.set({ x: SUM.JX, y: SUM.TOP, s: 1.06, flip: toE, armF: 20 + talk(1, 1) * 30, armB: 12 + 30 * es(t, 2.05, 2.4), head: -2, blink: blinkAt(T, 1) });
      const tk = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 2.0, 2.25));
      pose(tagM, { x: SUM.MX - 20, y: lerp(-1500, 250, tk), r: Math.sin(T * 0.8) * 2, oy: 0, o: tk > 0.002 ? 1 : 0 });
      const tk2 = es(t, 1.2, 1.5, ease.back) * (1 - es(t, 2.0, 2.25));
      pose(tagE, { x: SUM.EX + 20, y: lerp(-1500, 250, tk2), r: Math.sin(T * 0.8 + 1) * 2, oy: 0, o: tk2 > 0.002 ? 1 : 0 });

      /* v31 — His departure, which He was to accomplish at Jerusalem */
      const fk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      flyTo(f1, fk, FX, FY, T, 0);
      pose(cap, { x: FX, y: lerp(-1500, FY, fk) + H / 2 + 26, o: fk > 0.01 ? 1 : 0 });

      /* v32 — heavy with sleep; then awake, they see His glory */
      const sleep = es(t, 3.05, 3.4) * (1 - es(t, 4.02, 4.08));
      const wake = es(t, 4.05, 4.3);
      D.forEach((d) => {
        const nod = sleep * (0.8 + Math.sin(T * 0.9 + d.seed) * 0.2);
        const shield = wake * (1 - es(t, 4.8, 5.0) * 0.4);
        const flip = d.x > SUM.JX;
        const zz = es(t, 3.2, 3.26) * (1 - es(t, 4.02, 4.08));
        d.a.set({ x: d.x, y: d.y, s: 0.98, flip, o: 1 - zz, armF: 30 + shield * 30, armB: 10 + shield * 150, head: -shield * 14 + (1 - wake) * 4, lean: -wake * 8, blink: blinkAt(T, d.seed) });
        d.z.set({ x: d.x, y: d.y, s: 0.98, flip, o: zz, armF: 20, armB: 10, head: 16 + nod * 20, lean: 8 + nod * 6, blink: 0 });
      });

      S.cam.z = kf(t, [[0, 1.1], [1.9, 1.08], [2.2, 1.02], [2.95, 1.02], [3.3, 1.12], [4.0, 1.14], [4.4, 1.08]]);
      S.cam.y = kf(t, [[0, 40], [1.9, 30], [2.2, 10], [2.95, 10], [3.3, 50], [4.0, 50], [4.4, 40]]);
    };
  },
};
