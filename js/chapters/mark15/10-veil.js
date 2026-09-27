// Mk 15,38 — in the Temple, the great veil before the Holy of Holies, blue and purple and scarlet, woven
// with golden cherubim. It tears from the top: a bright seam runs down it, the two halves lean apart like a
// torn paper curtain… and at the bottom they fall open, and the light that was hidden pours out.
import { C, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { menorah, tornPair, glory, wisp, column, PI } from './lib.js';

const X0 = 500, X1 = 1100, Y0 = 124, Y1 = 690, TX = 800;

export default {
  id: 'm15-veil',
  beats: [
    { v: 38, text: 'A zasłona przybytku rozdarła się na dwoje,' },
    { v: 38, cont: true, text: 'z góry na dół.' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [0.97, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#4a3a30', '#7a5c42', '#a07a50']);
    /* the Holy of Holies: light behind the veil */
    const lightL = S.layer({ par: 0.2, sh: 1, flat: true });
    const lc = S.id('lclip');
    lightL.add(`<defs><clipPath id="${lc}"><rect x="${X0 - 200}" y="${Y0}" width="${X1 - X0 + 400}" height="${Y1 - Y0}"/></clipPath></defs><g clip-path="url(#${lc})"><rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#fff1c9"/><g transform="translate(${TX} 400)">${glory(c, 520, 26)}</g><circle cx="${TX}" cy="400" r="260" fill="url(#halo-glow)"/></g>`);
    /* the sanctuary walls: cedar and gold */
    const wall = S.layer({ par: 0.22, sh: 4 });
    const W = sheet();
    W.p(c.cut([[-900, -1400], [2500, -1400], [2500, 700], [-900, 700]], 0.5, 20) + c.hole(c.rect(X0 - 4, Y0 - 4, X1 - X0 + 8, Y1 - Y0 + 8), 0.3, 8), mix(C.wood3, C.ochre, 0.35));
    let panels = '';
    for (let x = -880; x < 2500; x += 120) if (x + 110 < X0 - 60 || x > X1 + 60) { panels += c.cut(c.rect(x + 10, 170, 100, 220), 0.4, 6) + c.cut(c.rect(x + 10, 420, 100, 240), 0.4, 6); }
    W.x(panels, shade(C.wood3, -0.12), 'opacity=".55"');
    let palms = '';
    for (let x = -820; x < 2500; x += 120) if (x + 50 < X0 - 60 || x - 50 > X1 + 60) palms += c.ribbon([[x, 380], [x, 200]], 3) + c.poly([[x, 200], [x - 22, 226], [x, 214], [x + 22, 226]]) + c.poly([[x, 230], [x - 20, 256], [x, 244], [x + 20, 256]]);
    W.x(palms, C.sun, 'opacity=".7"');
    wall.add(W.out());
    /* the veil in two halves */
    const V = sheet();
    const bands = [mix(C.indigo, C.dustyBlue, 0.3), mix(C.plumRobe, C.indigo, 0.4), shade(C.curtain2, -0.1), mix(C.indigo, C.dustyBlue, 0.3)];
    for (let i = 0; i < 12; i++) V.p(c.cut(c.rect(X0 + i * 50, Y0, 51, Y1 - Y0), 0.3, 12), bands[i % 4]);
    let folds = '';
    for (let x = X0 + 25; x < X1; x += 50) folds += c.ribbon([[x, Y0 + 6], [x + c.rr(-3, 3), Y1 - 6]], 5);
    V.x(folds, '#1a1430', 'opacity=".18"');
    let cher = '';
    for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) {
      const x = X0 + 60 + k * 120 + (r % 2) * 60, y = Y0 + 80 + r * 140;
      if (x > X1 - 30) continue;
      cher += c.poly([[x, y], [x - 30, y - 30], [x - 22, y - 6], [x - 34, y - 8], [x - 8, y + 10]]) + c.poly([[x, y], [x + 30, y - 30], [x + 22, y - 6], [x + 34, y - 8], [x + 8, y + 10]]) + c.poly(c.circ(x, y - 12, 6, 10)) + c.poly([[x - 6, y], [x + 6, y], [x + 4, y + 24], [x - 4, y + 24]]);
    }
    V.x(cher, C.sun, 'opacity=".8"');
    V.p(c.cut(c.rect(X0, Y1 - 22, X1 - X0, 22), 0.3, 10), C.sun);
    const inner = V.out();
    const halves = tornPair(c, inner, [X0, Y0, X1, Y1], TX, S.id('veil'));
    const LL = S.layer({ par: 0.25, sh: 6 }), RL = S.layer({ par: 0.25, sh: 6 });
    const hideEdge = (m) => m.split(`fill="${C.cream}" opacity=".9"`).join(`class="tedge" fill="${C.cream}" opacity="0"`);
    const left = LL.add(`<g>${hideEdge(halves.left)}</g>`), right = RL.add(`<g>${hideEdge(halves.right)}</g>`);
    const edges = [...left.querySelectorAll('.tedge'), ...right.querySelectorAll('.tedge')];
    const seamL = S.layer({ par: 0.25, sh: 1, flat: true });
    const seam = seamL.add(`<g><path d="${c.ribbon([[TX, Y0], [TX + 6, Y0 + 140], [TX - 8, Y0 + 280], [TX + 5, Y0 + 420], [TX - 3, Y1]], 5)}" fill="#fff6d8"/></g>`);
    const spark = seamL.add(`<g><circle r="40" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 14, 4, 4, 0))}" fill="#fffbe8"/></g>`);
    /* rod, pillars, lampstand, altar of incense, floor */
    const front = S.layer({ par: 0.3, sh: 6 });
    front.add(sheet().p(c.ribbon([[X0 - 60, Y0 - 4], [X1 + 60, Y0 - 4]], 10), C.sun).p(c.cut(c.circ(X0 - 64, Y0 - 4, 11, 12), 0.3, 3) + c.cut(c.circ(X1 + 64, Y0 - 4, 11, 12), 0.3, 3), shade(C.sun, -0.1)).out());
    front.add(column(c, X0 - 40, 700, 610, 50, C.sun) + column(c, X1 + 40, 700, 610, 50, C.sun));
    const floorL = S.layer({ par: 0.35, sh: 2 });
    floorL.add(sheet().p(c.cut([[-900, 690], [2500, 690], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.wood3, C.sand2, 0.4)).out());
    const pour = floorL.add(`<path d="${c.poly([[TX - 40, 690], [TX + 40, 690], [TX + 380, 1000], [TX - 380, 1000]])}" fill="#fff1c9" opacity="0"/>`);
    const props = S.layer({ par: 0.45, sh: 5 });
    const men = props.add(`<g transform="translate(360 716) scale(1.4)">${menorah(c, 130)}</g>`);
    props.add(`<g transform="translate(1250 716)">${sheet().p(c.cut([[-40, 0], [-34, -90], [34, -90], [40, 0]], 0.4, 6), C.sun).p(c.cut(c.rect(-46, -100, 92, 14), 0.3, 5), shade(C.sun, -0.12)).x(c.poly([[-40, -100], [-46, -114], [-32, -100]]) + c.poly([[40, -100], [46, -114], [32, -100]]), C.sun).out()}</g>`);
    const smokes = [0, 1, 2].map((i) => props.add(`<g>${wisp(c, 1.4, '#d9cbb4')}</g>`));

    return (t, time) => {
      const T = time;
      /* the tear runs down from the top */
      const run = es(t, 0.1, 1.45, ease.sine);
      const sy = Y0 + run * (Y1 - Y0);
      pose(spark, { x: TX + Math.sin(run * 14) * 5, y: sy, s: 1 + Math.sin(T * 8) * 0.1, o: run > 0 && run < 0.99 ? 1 : 0 });
      pose(seam, { x: TX, y: Y0, sy: Math.max(0.001, run), oy: Y0, o: run > 0 ? 1 - es(t, 1.4, 1.7) : 0 });
      // halves lean apart from the top (a V), then fall open at the bottom
      const lean = es(t, 0.2, 1.1) * 2.5 + es(t, 1.2, 1.7) * 3;
      const open = es(t, 1.35, 1.8, ease.out);
      edges.forEach((e) => fade(e, es(t, 1.3, 1.45) * 0.9));
      pose(left, { x: TX - open * 150, y: Y1, r: -lean - open * 5, ox: TX, oy: Y1 });
      pose(right, { x: TX + open * 150, y: Y1, r: lean + open * 5, ox: TX, oy: Y1 });
      
      fade(pour, open * 0.4);
      smokes.forEach((sm, i) => { const k = ((T * 0.25 + i / 3) % 1); pose(sm, { x: 1250 + Math.sin(k * 6 + i) * 8, y: 610 - k * 120, s: 0.6 + k * 0.6, o: Math.sin(k * PI) * 0.6 }); });
      S.cam.z = 1.0 - es(t, 1.3, 1.9) * 0.03;
      S.cam.y = -20 + es(t, 0, 1.2) * 30;
    };
  },
};
