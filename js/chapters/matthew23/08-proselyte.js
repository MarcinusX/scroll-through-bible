// Mt 23,15 — the second woe, a painted flat: sea on the left, hills on the right. The Pharisee and the scribe cross
// the sea in a little boat and tramp over the hills, a dotted trail behind them all the way, to one man standing by
// his house in a far land — they hand him the scroll, and he is won. Then he stands between them, dressed up just like
// them — only more: his phylactery twice as big, his fringes twice as long. The sun sinks behind them and throws their
// shadows onto the white wall of his house — theirs the size of a man, his twice as big — and the wall's foot glows
// dull red like the valley of Gehenna: "twice as much a son of Gehenna as yourselves".
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, hillsWith, sun, cloud, grass, olive, cypress, rock } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, parts, PH, SC, woeDrop, shadowPerson, scrollOpen, GLOOM, PI } from './lib.js';

const SHORE = 700;
const GY = 620;
const HX = 1100;                 // the convert's house
const CONVERT = { robe: C.ochreRobe, mantle: C.terracotta, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.leather, veil2: C.terracotta };

export default {
  id: 'mt23-proselyte',
  enter: 'fly',
  beats: [
    { v: 15, text: 'Biada wam, uczeni w Piśmie i faryzeusze, obłudnicy, bo obchodzicie morze i ziemię, żeby pozyskać jednego współwyznawcę.' },
    { v: 15, cont: true, text: 'A gdy się nim stanie, czynicie go dwakroć bardziej winnym piekła niż wy sami.' },
  ],
  cam: { x: [-40, 120], y: [-40, 20], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, ['#c9dcd9', '#efe6cd', '#f6e2c2']);
    const gloom = sky(S, ['#8c7a95', '#d69a7e', '#f0c08c'], { name: 'dusk', rise: 0 }).layer;
    gloom.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 520, y: 160, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 980, y: 150, len: 800 });
    // the far coast, the sea on the left, the land rising on the right
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    const seaL = S.layer({ par: 0.14, sh: 2 });
    seaL.add(waterBand(c, { y: 470, color: mix(C.lake, C.skyBlue, 0.2), foamN: 30, bottom: 1200 }).markup);
    const landL = S.layer({ par: 0.2, sh: 3 });
    const gfn = (x) => (x < SHORE ? 900 : GY - Math.min(1, (x - SHORE) / 160) * 20 + Math.sin(x * 0.012) * 8);
    const land = sheet();
    const lp = [[SHORE - 170, 1700], [SHORE - 170, GY + 90], [SHORE - 110, GY + 52], [SHORE - 50, GY + 26], [SHORE, GY + 10]];
    for (let x = SHORE; x <= 2500; x += 20) lp.push([x, gfn(x)]);
    lp.push([2500, 1700]);
    land.p(c.cut(lp, 1, 10), mix(C.hillNear, C.sand, 0.35));
    landL.add(sheet().p(c.cut(c.blob(1250, 600, 520, 110, 16, 0.12), 1, 10), C.hillMid).out());
    landL.add(land.out());
    landL.add(olive(c, 880, GY - 8, 0.7) + cypress(c, 1390, GY - 6, 130) + rock(c, 960, GY + 6, 60, 20, C.rock2) + grass(c, { x0: SHORE, x1: 2400, y: GY, fn: gfn, n: 30, h: 12, color: C.olive }));
    // the convert's house with its white wall
    const houseL = S.layer({ par: 0.2, sh: 4 });
    const hs = sheet();
    hs.p(c.cut([[HX - 160, GY + 2], [HX - 160, 330], [HX + 160, 326], [HX + 160, GY + 2]], 0.6, 10), mix(C.plaster, C.cream, 0.4));
    hs.p(c.cut([[HX - 170, 332], [HX + 170, 328], [HX + 170, 316], [HX - 170, 320]], 0.4, 8), C.roof);
    hs.p(c.cut([[HX + 170, GY + 2], [HX + 170, 330], [HX + 215, 346], [HX + 215, GY + 4]], 0.5, 8), C.plaster2);
    hs.p(c.cut([[HX + 180, GY + 3], [HX + 180, 520], ...c.arc(HX + 196, 522, 16, 18, PI, 2 * PI, 8), [HX + 212, GY + 4]], 0.4, 6), C.wood2);
    houseL.add(hs.out());
    const gid = S.id('gehenna');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.terracotta}" stop-opacity="0"/><stop offset=".6" stop-color="${mix(C.terracotta, C.curtain2, 0.5)}" stop-opacity=".28"/><stop offset="1" stop-color="${C.curtain2}" stop-opacity=".62"/></linearGradient>`);
    const redFoot = houseL.add(`<g><rect x="-160" y="-170" width="320" height="172" fill="url(#${gid})"/></g>`);
    const shadows = [PH, CONVERT, SC].map((o, i) => ({ i, el: houseL.add(`<g opacity="0">${shadowPerson(c, o, mix('#3b2a22', C.plumRobe, 0.2))}</g>`) }));

    /* the trail: little dashes that appear behind them, over the sea and the land */
    const fx = S.layer({ par: 0.3, sh: 2 });
    const TRAIL = [];
    for (let i = 0; i <= 26; i++) {
      const u = i / 26;
      const x = lerp(-160, 1020, u);
      const y = x < SHORE ? 548 + Math.sin(u * 9) * 8 : gfn(x) + 18;
      TRAIL.push({ u, x, y, el: fx.add(`<g><path d="${c.cut([[-7, -1.6], [7, -2], [7.5, 1.8], [-7, 2]], 0.3, 4)}" fill="${shade(C.wood3, -0.2)}" opacity=".7"/></g>`) });
    }

    /* the boat, the travellers, the convert */
    const P = S.layer({ par: 0.3, sh: 5 });
    const B = boat(c, { hull: C.wood, stripe: C.terracotta, mast: false });
    const bBack = P.add(`<g>${B.back}</g>`);
    const pair = [PH, SC].map((o, i) => ({ i, p: S.puppet(P.add(vain(c, o, i === 1 ? { holdF: `<g transform="translate(0 6) rotate(-60)">${scrollOpen(c, 44, 30)}</g>` } : {}))) }));
    const bFront = P.add(`<g>${B.front}</g>`);
    const conv = S.puppet(P.add(person(c, CONVERT)));
    const convV = S.puppet(P.add(vain(c, CONVERT)));
    const cParts = parts(convV.el);
    const pParts = pair.map((p) => parts(p.p.el));
    const woe = woeDrop(P, c, 2, { x: 1290, y: 150 });

    return (t, time) => {
      const T = time;
      swing(sunEl, 520, 160 + es(t, 1.0, 1.6) * 120, T, 1, 0.6);
      swing(cl, 980 + (T ? Math.sin(T * 0.1) * 20 : 0), 150, T, 1.2, 0.7, 1);
      gloom.fade(es(t, 1.05, 1.6) * 0.8);
      woe(es(t, 0.02, 0.25, ease.out) * (1 - es(t, 0.8, 0.95)), T);

      /* v15a — over the sea (0.05–0.38), then over the land (0.42–0.7) */
      const sail = es(t, 0.02, 0.38);
      const bx = lerp(-60, SHORE - 170, sail);
      const bob = T ? Math.sin(T * 2) * 3 : 0;
      const rock_ = T ? Math.sin(T * 1.6) * 2 : 0;
      const boatOn = t < 0.45 ? 1 : 0;
      pose(bBack, { x: bx, y: 562 + bob, s: 0.56, r: rock_, o: boatOn });
      pose(bFront, { x: bx, y: 562 + bob, s: 0.56, r: rock_, o: boatOn });
      const walk = es(t, 0.42, 0.72);
      const meet = es(t, 1.02, 1.3);
      pair.forEach((p) => {
        let x, y;
        if (t < 0.41) { x = bx - 30 + p.i * 50; y = 548 + bob; }
        else {
          x = lerp(SHORE + 10 + p.i * 50, 960 + p.i * 60, walk);
          y = gfn(x) + 4;
        }
        if (t > 1) { x = lerp(960 + p.i * 60, HX - 100 + p.i * 200, meet); y = gfn(x) + 4; }
        const going = (walk > 0.02 && walk < 0.98) || (meet > 0.02 && meet < 0.98);
        const give = p.i === 1 ? bump(t, 0.7, 1.0) : 0;
        p.p.set({ x, y, s: lerp(0.62, 0.74, meet), flip: t > 1 && p.i === 1, walk: going ? x * 0.08 : undefined, armF: 30 + give * 50 + (t < 0.41 && p.i === 0 ? 30 : 0), armB: 20, head: -6, blink: blinkAt(T, p.i + 2) });
      });
      TRAIL.forEach((d) => {
        const lead = t < 0.41 ? lerp(0, (SHORE - 160 + 160) / 1180, sail) : lerp((SHORE + 160) / 1180 * 0.9, 1, walk);
        pose(d.el, { x: d.x, y: d.y, r: d.x < SHORE ? 0 : -4, o: d.u < lead ? 1 - es(t, 1.0, 1.2) : 0 });
      });

      /* the convert: won over (0.7–1.0); then dressed up twice as much, and the shadows */
      const won = es(t, 0.75, 0.9);
      const dress = es(t, 1.08, 1.16);
      const cx = HX + 10;
      const cp = { x: cx, y: gfn(cx) + 4, s: lerp(0.66, 0.74, meet), flip: true, armF: 20 + won * 40, armB: won * 20, head: -won * 6 - dress * 10, lean: -dress * 3, blink: blinkAt(T, 6) };
      conv.set({ ...cp, o: 1 - dress });
      convV.set({ ...cp, o: dress });
      pose(cParts.phyl, { s: 1 + es(t, 1.15, 1.45) * 2.2 });
      pose(cParts.fringe, { sx: es(t, 1.2, 1.55) * 1.3, sy: 1 });
      pParts.forEach((pp) => { pose(pp.phyl, { s: 1 + es(t, 1.15, 1.45) * 0.4 }); pose(pp.fringe, { sx: es(t, 1.2, 1.55) * 0.55, sy: 1 }); });

      const sh = es(t, 1.3, 1.6);
      shadows.forEach((d) => {
        const big = d.i === 1 ? 1.85 : 1.05;
        const xs = [HX - 100, cx, HX + 100][d.i];
        pose(d.el, { x: xs + 30, y: GY + 2, s: 0.74 * lerp(0.9, big, sh), sx: d.i === 2 ? -1 : 1, o: sh * 0.55 });
      });
      pose(redFoot, { x: HX, y: GY, o: es(t, 1.45, 1.75) * 0.8 });

      S.cam.x = lerp(-30, 100, es(t, 0.3, 0.9)) + es(t, 1.0, 1.4) * 20;
      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.12;
      S.cam.y = -es(t, 1.0, 1.4) * 30;
    };
  },
};
