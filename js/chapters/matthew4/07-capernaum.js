// Mt 4,13–15 — Jesus leaves Nazareth on its hill and walks down the road to Capernaum by the lake, where the
// door of a house opens for Him: He settles there. A map of Galilee comes down from the flies: His dotted path
// from Nazareth to Capernaum, and the dashed border of Zebulun and Naphtali running past the town.
// "So was to be fulfilled the word of Isaiah": the old prophet's medallion and his open scroll. "Land of Zebulun,
// land of Naphtali": the two lands are washed with colour; "the way of the sea, beyond the Jordan, Galilee of the
// Gentiles": the golden Way of the Sea lights up along the coast and on to Damascus, travellers from far away
// walk on it, and the country beyond the Jordan is coloured in.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, town, house, olive, cypress, grass, sun, cloud, rock, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAP4, galilee4Map, along, hang2, nameTag, camel, addScroll, setScroll, folk4, tr, DAY, PI } from './lib.js';
import { ISAIAH } from '../john12/lib.js';

const P = 0.5;
const GY = 742;
const DOOR = 950;
const MX = 800, MY = 300;       // the map's centre when down
const MS = 0.64;               // …and its scale

export default {
  id: 'mt4-capernaum',
  beats: [
    { v: 13, text: 'Opuścił jednak Nazaret, przyszedł i osiadł w Kafarnaum nad jeziorem,' },
    { v: 13, cont: true, text: 'na pograniczu Zabulona i Neftalego.' },
    { v: 14 },
    { v: 15, text: 'Ziemia Zabulona i ziemia Neftalego.' },
    { v: 15, cont: true, text: 'Droga morska, Zajordanie, Galilea pogan!' },
  ],
  cam: { x: [-300, 300], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the map, the Capernaum tag and Isaiah's medallion come inside the screen (the camera ends 290 right)
    const MXp = PH ? 845 : MX, KAFX = PH ? 1190 : 1290, ISAX = PH ? 585 : 470, SCRX = PH ? 890 : 900;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1250, y: 150, len: 800 });
    const cls = [[430, 150, 190], [980, 110, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

    /* ---------- Nazareth on its hill, the lake of Capernaum ---------- */
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 440, amps: [14, 6, 3], lens: [1000, 330, 120], color: C.hillFar }).markup);
    far.add(waterBand(c, { y: 520, color: C.lake, foamN: 16, x0: 760, x1: 3200, bottom: 700 }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    const hfn = (x) => 560 - Math.max(0, 1 - Math.abs(x - 480) / 520) ** 1.6 * 150 + Math.sin(x * 0.02) * 4;
    mid.add(sheet().p(c.ridge(hfn, -900, 1000, 1700, 12, 1), C.hillMid).out());
    mid.add(town(c, { x: 480, y: hfn(480) + 14, n: 8, spread: 280, sc: 0.62 }) + cypress(c, 290, hfn(290) + 10, 110) + olive(c, 700, hfn(700) + 16, 0.7));
    const tagNaz = hanging(mid, nameTag(c, tr('Nazaret', 'Nazareth'), { size: 20 }), { x: 480, y: 290, len: 700 });
    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(640, [6, 3], [700, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).p(c.ribbon([[-900, 766], [2500, 762]], 50, 2), mix(C.sand, C.cream, 0.35)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 640, fn: gfn, n: 60, h: 14, color: C.moss }));
    // Capernaum: houses along the shore, the house where He settles
    G.add(house(c, 1250, 690, 110, 80, { stairs: true }) + house(c, 1420, 684, 90, 66) + house(c, 640, 684, 80, 60) + olive(c, 1560, 700, 0.9) + bush(c, 610, 700, 60, C.sage, C.moss));
    const hs = sheet();
    hs.p(c.cut(c.rect(DOOR - 110, 560, 220, 150), 0.6, 10), C.plaster);
    hs.p(c.cut([[DOOR + 110, 566], [DOOR + 150, 580], [DOOR + 150, 710], [DOOR + 110, 710]], 0.5, 8), C.plaster2);
    hs.p(c.cut(c.rect(DOOR - 118, 548, 236, 16), 0.4, 8), C.roof);
    hs.p(c.cut([[DOOR - 40, 712], [DOOR - 40, 632], ...c.arc(DOOR, 632, 40, 34, PI, 2 * PI, 10), [DOOR + 40, 712]], 0.4, 6), C.soilDark);
    hs.x(c.poly(c.rect(DOOR + 58, 600, 34, 28)), C.soilDark);
    G.add(hs.out());
    const doorLeaf = G.add(`<g>${sheet().p(c.cut([[0, 0], [0, -80], ...c.arc(40, -80, 40, 34, PI, 1.5 * PI, 6), [40, -114], [40, 0]], 0.3, 5) + c.cut([[40, 0], [40, -114], ...c.arc(40, -80, 40, 34, 1.5 * PI, 2 * PI, 6), [80, -80], [80, 0]], 0.3, 5), C.wood).x(c.ribbon([[40, -110], [40, 0]], 2), shade(C.wood, -0.25)).out()}</g>`);
    const tagKaf = hanging(G, nameTag(c, tr('Kafarnaum', 'Capernaum'), { size: 20 }), { x: KAFX, y: 250, len: 700 });
    const jesus = S.puppet(S.layer({ par: P, sh: 5 }).add(person(c, { ...CAST.jesus })));

    /* ---------- the map ---------- */
    const ML = S.layer({ par: 0.15, sh: 7 });
    const M = galilee4Map(c);
    const mapEl = ML.add(hang2(`<g transform="scale(${MS})">${M.base}${M.labels}</g>`, 300, 900));
    const piece = (m) => ML.add(`<g opacity="0">${m}</g>`);
    const zeb = piece(M.zeb), naf = piece(M.naf), trans = piece(M.trans), border = piece(M.border), road = piece(M.road), walkP = piece(M.walk), gent = piece(M.gentiles);
    const token = ML.add(`<g opacity="0"><circle r="30" fill="url(#halo-glow)"/><g transform="scale(.2)">${person(c, { ...CAST.jesus })}</g></g>`);
    const ring = ML.add(`<g opacity="0"><circle r="26" fill="none" stroke="${C.terracotta}" stroke-width="3"/></g>`);
    const walkers = [
      { el: ML.add(`<g opacity="0"><g transform="scale(.17)">${camel(c)}</g></g>`), d: 0 },
      { el: ML.add(`<g opacity="0"><g transform="scale(.2)">${person(c, folk4(c, true, { robe: C.tealRobe, hairStyle: 'wrap', veil: C.ochreRobe }))}</g></g>`), d: 0.18 },
      { el: ML.add(`<g opacity="0"><g transform="scale(.2)">${person(c, folk4(c, true, { robe: C.terracotta, mantle: C.ochre, hairStyle: 'curly' }))}</g></g>`), d: 0.34 },
      { el: ML.add(`<g opacity="0"><g transform="scale(.2)">${person(c, folk4(c, false, { robe: C.mauve }))}</g></g>`), d: 0.5 },
    ];

    /* ---------- Isaiah ---------- */
    const IL = S.layer({ par: 0.12, sh: 8 });
    const cid = S.id('isa');
    S.defs(`<clipPath id="${cid}"><circle r="76"/></clipPath>`);
    const isaPlate = hanging(IL, `${sheet().p(c.cut(c.circ(0, 0, 86, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 77, 40), 0.4, 5), '#e9dcc0').out()}<g clip-path="url(#${cid})"><g transform="translate(-4 ${-8 + 167 * 1.5}) scale(1.5)">${person(c, { ...ISAIAH })}</g></g><text x="0" y="112" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="24" font-style="italic" fill="${C.terracotta}">${tr('prorok Izajasz', 'Isaiah the prophet')}</text>`, { x: 0, y: 0, len: 900 });
    const scroll = addScroll(IL, c, [tr('Izajasz 8,23 – 9,1', 'Isaiah 9:1–2'), tr('«Ziemia Zabulona i ziemia Neftalego…»', '“The land of Zebulun and Naphtali…”')], { w: 440, h: 120, size: 24 });

    const at = (el, [x, y], o, extra = {}) => pose(el, { x: MXp + x * MS + mapDX, y: MY + y * MS + mapDY, s: MS * (extra.s || 1), o, ...(extra.sx ? { sx: extra.sx * MS } : {}) });
    let mapDX = 0, mapDY = 0;

    return (t, time) => {
      swing(sunEl, 1250, 150, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));

      /* v13a: from Nazareth down to Capernaum; the door opens */
      const walk = es(t, 0.05, 0.8, ease.sine);
      const jx = lerp(470, DOOR, walk);
      const home = es(t, 0.78, 0.9);
      jesus.set({ x: jx, y: GY + 4 - home * 34, s: 1.04 - home * 0.08, flip: false, walk: walk > 0 && walk < 1 ? jx * 0.045 : undefined, armF: 14 + home * 20, armB: 8, head: -home * 4, blink: blinkAt(time) });
      const open = es(t, 0.7, 0.85);
      pose(doorLeaf, { x: DOOR - 40, y: 712, sx: 1 - open * 0.8 });
      swing(tagNaz, 480, 290, time, 1, 0.7, 1);
      swing(tagKaf, KAFX, 250, time, 1, 0.7, 2);
      S.cam.x = lerp(-260, 290, es(t, 0.0, 0.85, ease.sine));

      /* the map comes down */
      const down = es(t, 1.0, 1.3, ease.out);
      mapDX = 0; mapDY = lerp(-900, 0, down);
      pose(mapEl, { x: MXp, y: MY + mapDY, r: Math.sin(time * 0.6) * 0.4 * down });
      const on = down > 0.01 ? 1 : 0;
      at(walkP, [0, 0], on * es(t, 1.3, 1.5));
      const tk = es(t, 1.3, 1.7);
      const [wx, wy] = along(MAP4.walk, tk);
      at(token, [wx, wy - 4], on * seg(t, 1.28, 1.35), { s: 1 + bump(t, 1.7, 2.0) * 0.2 });
      at(border, [0, 0], on * es(t, 1.5, 1.7));
      at(ring, MAP4.kaf, on * bump(t, 1.6, 2.4), { s: 0.8 + seg(t, 1.6, 2.4) * 0.8 });
      at(zeb, [0, 0], on * (es(t, 1.55, 1.75) * 0.5 + es(t, 3.05, 3.3) * 0.5));
      at(naf, [0, 0], on * (es(t, 1.6, 1.8) * 0.5 + es(t, 3.2, 3.45) * 0.5));
      at(gent, [0, 0], on * es(t, 4.05, 4.3));
      at(road, [0, 0], on * es(t, 4.05, 4.3));
      at(trans, [0, 0], on * es(t, 4.35, 4.6));
      walkers.forEach((w) => {
        const k = seg(t, 4.1 + w.d * 0.5, 4.95);
        const [x, y, dir] = along(MAP4.road, k * 0.9 + w.d * 0.2);
        at(w.el, [x, y], on * (k > 0 ? 1 : 0), { sx: dir });
      });

      /* v14: Isaiah */
      const ik = es(t, 2.02, 2.35, ease.out) * (1 - es(t, 3.0, 3.25, ease.in));
      pose(isaPlate, { x: ISAX, y: lerp(-420, 250, ik), r: Math.sin(time * 0.8) * 1.5, o: ik > 0.01 ? 1 : 0 });
      const sk = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      setScroll(scroll, SCRX, lerp(-400, 130, sk) + Math.sin(time * 0.7) * 2, es(t, 2.3, 2.6), sk);

      S.cam.y = 20;
      S.cam.z = 1.02 + es(t, 0.6, 0.95) * 0.03;
    };
  },
};
