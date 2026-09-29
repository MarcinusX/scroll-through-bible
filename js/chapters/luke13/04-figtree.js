// Łk 13,6–9 — the barren fig tree, a painted flat of a vineyard at the end of summer: rows of vines on their
// trellises, a stone watch-hut, and in the middle a fig tree, planted by its owner and growing up full of leaves.
// He comes with his basket, reaches up into the leaves, finds nothing: a fig on a tag, crossed out. Three years
// hang down one after another, each crossed out the same; he sets down his basket and hands the vinedresser the axe
// — "Cut it down! Why should it use up the ground?" — and the soil round the tree goes grey and cracked. The
// vinedresser gently pushes the axe aside: "Sir, leave it this year also" — a tag "one more year" comes down — and he
// digs round the tree and pours out a basket of manure, and the earth turns dark and rich. "Perhaps it will bear
// fruit": in his thoughts the tree is heavy with figs, and small green figs begin to show among the leaves. "If not,
// you can cut it down": the owner leans the axe against the trunk, and it waits there as the evening comes.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  vineyardSet, VY, OWNER, DRESSER, figTree, emptyBasket, noFig, yearDisc, youngFigs, oneFig, dungBasket, dungHeap, axe, spade,
  wordTag, onString, thought, handF, kf, moving, EVENING, es, ease, bump, seg, tr, PI,
} from './lib.js';

const OX = 612, DX = 990, GY = VY.GY, TX = VY.TX;
const AXE_H = 190;

export default {
  id: 'lk13-figtree',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 6, text: 'I opowiedział im następującą przypowieść: «Pewien człowiek miał drzewo figowe zasadzone w swojej winnicy;' },
    { v: 6, cont: true, text: 'przyszedł i szukał na nim owoców, ale nie znalazł.' },
    { v: 7, text: 'Rzekł więc do ogrodnika: "Oto już trzy lata, odkąd przychodzę i szukam owocu na tym drzewie figowym, a nie znajduję.' },
    { v: 7, cont: true, text: 'Wytnij je: po co jeszcze ziemię wyjaławia?"' },
    { v: 8 },
    { v: 9, text: 'może wyda owoc.' },
    { v: 9, cont: true, text: 'A jeśli nie, w przyszłości możesz je wyciąć"».' },
  ],
  cam: { x: [-40, 40], y: [20, 60], z: [1, 1.12] },
  build(S) {
    const V = vineyardSet(S, { sky2: EVENING });
    const c = S.c;
    const L = V.treeL;

    /* the fig tree */
    const FT = figTree(c, 1.2);
    const tree = L.add(`<g>${FT.trunk}${FT.leaves}</g>`);
    const young = L.add(`<g opacity="0">${youngFigs(c, 1.2, 14)}</g>`);

    /* the people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const basketDown = act.add(`<g opacity="0">${emptyBasket(c, 46)}</g>`);
    const ownerA = S.puppet(act.add(person(c, { ...OWNER, holdF: `<g transform="translate(0 -2)">${emptyBasket(c, 40)}</g>` })));
    const ownerB = S.puppet(act.add(person(c, { ...OWNER })));
    const sp = `<g transform="rotate(-8)">${spade(c, 118)}</g>`;
    const dresA = S.puppet(act.add(person(c, { ...DRESSER, holdF: sp, holdB: `<g transform="translate(0 -4)">${dungBasket(c)}</g>` })));
    const dresB = S.puppet(act.add(person(c, { ...DRESSER, holdF: sp })));
    const axeEl = act.add(`<g opacity="0"><g transform="translate(0 ${-AXE_H * 0.8})">${axe(c, AXE_H)}</g></g>`);
    const tipBasket = act.add(`<g opacity="0"><g transform="translate(0 -30)">${dungBasket(c)}</g></g>`);
    const heapL = act.add(`<g opacity="0">${dungHeap(c, 130)}</g>`);
    const heapR = act.add(`<g opacity="0">${dungHeap(c, 110)}</g>`);
    const clods = [0, 1, 2, 3].map((i) => act.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 7, 4, 7, 0.3), 0.3, 3)}" fill="${C.soil}"/></g>`));

    /* hanging things: no fig; three years; one more year; the dream of fruit */
    const fx = S.layer({ par: 0.4, sh: 6 });
    const none = fx.add(`<g opacity="0">${noFig(c, 30)}</g>`);
    const years = ['I', 'II', 'III'].map((r, i) => ({ i, el: fx.add(`<g>${yearDisc(c, r, 34)}</g>`) }));
    const oneMore = fx.add(`<g>${onString(`<g transform="translate(0 22)">${wordTag(c, tr('jeszcze ten rok', 'this year also'), { size: 22, fill: C.halo })}</g>`, 1600)}</g>`);
    const FT2 = figTree(c, 0.3);
    let ripe = '';
    [[-26, -70], [10, -76], [30, -62], [-8, -58], [-34, -54], [22, -84], [0, -90]].forEach(([x, y]) => { ripe += `<g transform="translate(${x} ${y})">${oneFig(c, 5.5)}</g>`; });
    const dream = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(0 44)">${FT2.trunk}${FT2.leaves}${ripe}</g>`, { w: 150, h: 120 })}</g>`);

    const OK = [[0, 360], [0.4, OX], [1.05, OX], [1.3, 700], [1.72, 700], [1.9, OX], [2, OX]];
    const DK = [[2.05, 1400], [2.45, DX]];

    return (t, time) => {
      const T = time;
      V.update(T, es(t, 5.9, 6.9));
      V.sk2.fade(es(t, 6.0, 6.8));

      /* v6a — a fig tree planted in his vineyard, growing up */
      const g = es(t, 0.12, 0.7, ease.out);
      pose(tree, { x: TX, y: GY, s: 0.25 + g * 0.75, o: 1 });
      pose(young, { x: TX, y: GY, o: es(t, 5.25, 5.6) * 0.95 });

      /* the owner */
      const ox = kf(t, OK);
      const reach = bump(t, 1.28, 1.72);
      const swap = es(t, 2.9, 2.96);
      const give = es(t, 3.15, 3.4) * (1 - es(t, 4.05, 4.25));
      const lean = es(t, 6.1, 6.4);
      const oFlip = t > 1.72 && t < 1.95;
      ownerA.set({ x: ox, y: GY, s: 1.02, flip: oFlip, walk: moving(t, OK) ? ox * 0.05 : undefined, armF: 30 + es(t, 1.6, 1.75) * 30, armB: 10 + reach * 150 + es(t, 0.45, 0.6) * 30 * (1 - es(t, 0.95, 1.05)), head: -reach * 16 + bump(t, 1.72, 1.98) * Math.sin(t * 40) * 6, o: 1 - swap, blink: blinkAt(T) });
      const point = es(t, 2.2, 2.4) * (1 - es(t, 2.85, 2.95)) + es(t, 3.1, 3.3) * (1 - es(t, 4.0, 4.2));
      const oArmF = 20 + give * 50 + lean * 50;
      const ownX = ox - lean * 0 + es(t, 6.1, 6.4) * 60 - es(t, 6.4, 6.8) * 60;
      ownerB.set({ x: ownX, y: GY, s: 1.02, flip: false, armF: oArmF, armB: 10 + point * 110, head: -point * 6 + es(t, 4.2, 4.5) * 8 - es(t, 5.2, 5.5) * 8, o: swap, blink: blinkAt(T) });
      pose(basketDown, { x: OX - 40, y: GY + 2, o: swap });
      const [ahx, ahy] = handF(ownX, GY, 1.02, false, oArmF);
      // the axe: in his hand, held out; lowered; leaned against the trunk
      const onTree = es(t, 6.25, 6.4);
      const ar = lerp(-10 + give * 30, 16, onTree);
      const gx = TX - 44, gy = GY + 2;
      const lx = gx + Math.sin((16 * PI) / 180) * AXE_H * 0.2 * 0.9, ly = gy - Math.cos((16 * PI) / 180) * AXE_H * 0.2 * 0.9;
      pose(axeEl, { x: lerp(ahx, lx, onTree), y: lerp(ahy, ly, onTree), s: 0.9, r: ar, o: es(t, 3.05, 3.15) });

      /* the vinedresser */
      const dx = kf(t, DK);
      const dig = es(t, 4.35, 4.4) * (1 - es(t, 4.6, 4.64));
      const pour = es(t, 4.62, 4.67);
      const stroke = dig * Math.max(0, Math.sin(t * 50));
      const hold = es(t, 4.02, 4.2) * (1 - es(t, 4.3, 4.36));
      const dPos = lerp(dx, 900, es(t, 4.3, 4.36));
      const dSet = { x: dPos, y: GY, s: 1.0, flip: true, walk: moving(t, DK) ? dx * 0.05 : undefined, armF: 20 + stroke * 40 + hold * 60, armB: 10 + hold * 40, head: 6 * dig + es(t, 5.1, 5.3) * -10, lean: -stroke * 10 - pour * 12 * (1 - es(t, 4.9, 5.0)), blink: blinkAt(T, 3) };
      dresA.set({ ...dSet, o: t > 2.02 ? 1 - pour : 0 });
      dresB.set({ ...dSet, armB: 10 + pour * 60 * (1 - es(t, 4.9, 5.0)), o: pour });
      clods.forEach((cl, i) => { const k = seg(t, 4.38 + i * 0.05, 4.48 + i * 0.05); pose(cl, { x: dPos - 50 - k * 30 - i * 10, y: GY - 4 - Math.sin(k * PI) * 30, o: k > 0 && k < 1 ? 1 : 0 }); });
      const tip = es(t, 4.64, 4.78);
      pose(tipBasket, { x: 880, y: GY - 6, r: -tip * 110, o: pour * (1 - es(t, 5.0, 5.1)) });
      const heap = es(t, 4.7, 4.9, ease.out);
      pose(heapL, { x: TX - 70, y: GY + 10, sy: Math.max(0.01, heap), o: heap > 0.01 ? 1 : 0 });
      pose(heapR, { x: TX + 66, y: GY + 12, sy: Math.max(0.01, heap), o: heap > 0.01 ? 1 : 0 });

      /* the soil: normal → grey and cracked → dug → dark and rich */
      pose(V.dry, { o: es(t, 3.3, 3.6) * (1 - es(t, 4.4, 4.6)) });
      pose(V.dug, { o: es(t, 4.4, 4.6) * (1 - es(t, 4.75, 4.9)) });
      pose(V.rich, { o: es(t, 4.75, 4.9) });

      /* hanging: no fig; three years; one more year; the thought of fruit */
      const nk = es(t, 1.55, 1.7, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(none, { x: TX + 6, y: 300, s: nk * 1.1, o: nk > 0.02 ? 1 : 0 });
      years.forEach((y) => {
        const k = es(t, 2.2 + y.i * 0.16, 2.42 + y.i * 0.16, ease.out) * (1 - es(t, 3.0 + y.i * 0.04, 3.2 + y.i * 0.04, ease.in));
        pose(y.el, { x: 620 + y.i * 180, y: lerp(-800, 150 + (y.i % 2) * 20, k) + (T ? Math.sin(T * 0.8 + y.i) * 2 : 0), r: T ? Math.sin(T * 0.7 + y.i * 2) * 2 : 0 });
      });
      const om = es(t, 4.12, 4.35, ease.out) * (1 - es(t, 6.05, 6.3, ease.in));
      pose(oneMore, { x: 800, y: lerp(-800, 176, om) + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.6) * 1.2 : 0 });
      const dk = es(t, 5.12, 5.3, ease.back) * (1 - es(t, 5.95, 6.05));
      pose(dream, { x: 1030, y: 420, s: dk * 1.35, o: dk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.0, -20], [2.0, 0], [4.0, 0], [4.3, 20], [5.0, 20], [6.0, 0]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 50], [2.0, 30], [4.3, 50], [6, 40]]);
      S.cam.z = kf(t, [[0, 1.02], [1.2, 1.08], [2.0, 1.02], [4.3, 1.08], [6.0, 1.03]]);
    };
  },
};
