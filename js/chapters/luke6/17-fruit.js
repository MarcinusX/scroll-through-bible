// Łk 6,43–45 — a painted flat of a hillside orchard in the late afternoon. "No good tree bears bad fruit, nor a bad
// tree good fruit": on the green fig tree on the left the figs swell and ripen; on the grey, crooked tree on the right
// the fruit comes brown and shrivelled, and a worm looks out. "Each tree is known by its fruit; figs are not gathered
// from thorns, nor grapes from a bramble": a harvester with a basket reaches into the thorn bush for figs — ouch — and
// into the bramble for grapes — ouch again — and goes to the fig tree, where his basket fills. "The good man brings good
// out of the good treasure of his heart, the evil man evil out of the evil": under the good tree a man opens the
// heart-shaped chest at his feet — light, bread and a heart come out and he gives them away; under the bad tree
// another opens his dark chest — thorns and black knots. "For out of the abundance of the heart the mouth speaks":
// golden words flow from the one, black scribbles from the other.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers, bush } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { orchardTree, fruit, rottenFruit, worm, thistle, chest, heart, loaf, sinKnot, sparkle, storyFrame, GOLDEN, kf, moving, headAt, handAt, halo, contentBasket, basketEmpty, tr, PI } from './lib.js';

const GY = 700;
const GOOD = { robe: C.skyVeil, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather };
const EVIL = { robe: mix(C.plumRobe, C.storm2, 0.35), mantle: mix(C.soil, C.storm, 0.3), hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin3, belt: C.ochre };
const PICKER = { robe: C.ochreRobe, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, veil2: C.clayMantle, beard: 'short', skin: C.skin4, belt: C.rope };
const GT0 = [470, GY - 10], BT0 = [1130, GY - 10];

function heartChest(c, dark) {
  const ch = chest(c, { w: 70, h: 44, dark });
  const mark = `<g transform="translate(0 -24) scale(.55)">${dark ? sheet().p(c.cut([[0, 12], [-16, -2], [-12, -12], [-4, -12], [0, -6], [4, -12], [12, -12], [16, -2]], 0.3, 3), '#2a2230').out() : heart(c, 18)}</g>`;
  return { box: ch.box + mark, lid: ch.lid };
}
function goldWords(c) {
  const s = sheet();
  s.p(c.cut([[-26, -8], [26, -9], [27, 8], [-26, 9]], 0.4, 4), C.halo);
  s.x(c.ribbon([[-18, -1], [-4, -2]], 1.8) + c.ribbon([[2, 0], [18, -1]], 1.8), C.sunDeep, 'opacity=".8"');
  return `<circle r="26" fill="url(#halo-glow)"/>${s.out()}`;
}
function blackWords(c) {
  const s = sheet();
  const p = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2, r = i % 2 ? 0.7 : 1.1; p.push([Math.cos(a) * 26 * r, Math.sin(a) * 12 * r]); }
  s.p(c.cut(p, 0.4, 3), '#3b3346');
  s.x(c.ribbon(c.cbez([-14, 2], [-6, -8], [4, 8], [14, -3], 8), 1.6), '#e9a0a0', 'opacity=".8"');
  return s.out();
}

export default {
  id: 'lk6-fruit',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 43 },
    { v: 44 },
    { v: 45, text: 'Dobry człowiek z dobrego skarbca swego serca wydobywa dobro, a zły człowiek ze złego skarbca wydobywa zło.' },
    { v: 45, cont: true, text: 'Bo z obfitości serca mówią jego usta.' },
  ],
  cam: { x: [-40, 40], y: [-30, 50], z: [1, 1.12] },
  build(S) {
    // phone: the two trees stand further in, the bad one clear of the thread
    const GT = S.portrait ? [540, GY - 10] : GT0, BT = S.portrait ? [1010, GY - 10] : BT0;
    const c = S.c;
    sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 820, y: 150, len: 800 });
    const CLX = S.portrait ? 1040 : 1180;   // phone: the cloud clear of the thread
    const cl = hanging(hangL, cloud(c, 170), { x: CLX, y: 140, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.dusk, 0.15) }).markup);
    S.layer({ par: 0.18, sh: 3 }).add(hillsWith(c, { y: 520, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.wheat, 0.2), trees: 12, treeColor: C.olive, treeH: 18 }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(600, [6, 2], [800, 200]), -900, 2500, 1800, 12, 1), mix(C.hillNear, C.wheat, 0.25)).out() + flowers(c, { x0: 200, x1: 700, y: 640, n: 12, h: 12 }));
    const trees = S.layer({ par: 0.36, sh: 4 });
    const gTree = orchardTree(c, { sc: 1.45 }), bTree = orchardTree(c, { sc: 1.35, barren: true });
    trees.add(`<g transform="translate(${GT[0]} ${GT[1]})">${gTree.tree}</g>`);
    trees.add(`<g transform="translate(${BT[0]} ${BT[1]})">${bTree.tree}</g>`);
    // the thorn bush and the bramble in the middle
    trees.add(thornBush(c, 720, GY + 4, 110) + `<g transform="translate(900 ${GY + 4})">${thistle(c, 120)}</g>`);

    /* fruit */
    const FL = S.layer({ par: 0.37, sh: 3 });
    const goodF = gTree.fruits.map((f, i) => ({ i, x: GT[0] + f.x, y: GT[1] + f.y, el: FL.add(`<g>${fruit(c, 10, mix(C.plumRobe, C.terracotta, 0.35))}</g>`) }));
    const badF = Array.from({ length: 7 }, (_, i) => ({ i, x: BT[0] + c.rr(-80, 90) * 1.35, y: BT[1] + c.rr(-225, -150) * 1.35, el: FL.add(`<g>${rottenFruit(c, 10)}</g>`) }));
    const wm = FL.add(`<g>${worm(c)}</g>`);

    /* people */
    const L = S.layer({ par: 0.4, sh: 5 });
    const picker = S.puppet(L.add(person(c, PICKER)));
    const basket = L.add(`<g>${contentBasket(c, 'fruit', 56)}</g>`);
    const emptyB = L.add(`<g transform="scale(.9)">${basketEmpty(c)}</g>`);
    const good = S.puppet(L.add(person(c, GOOD)));
    const evil = S.puppet(L.add(person(c, EVIL)));
    const gc = heartChest(c, false), ec = heartChest(c, true);
    const gGlow = L.add(`<g opacity="0">${halo(90, 1)}</g>`);
    const gBox = L.add(`<g>${gc.box}</g>`), gLid = L.add(`<g>${gc.lid}</g>`);
    const eBox = L.add(`<g>${ec.box}</g>`), eLid = L.add(`<g>${ec.lid}</g>`);
    const gifts = [heart(c, 14), loaf(c, 13), heart(c, 12)].map((m) => L.add(`<g opacity="0">${m}</g>`));
    const knots = [0, 1, 2].map((i) => L.add(`<g opacity="0">${i === 1 ? thornBush(c, 0, 0, 30) : `<g transform="scale(1.2)">${sinKnot(c, 12)}</g>`}</g>`));
    const fx = S.layer({ par: 0.42, sh: 5 });
    const ouch = [0, 1].map(() => fx.add(`<g opacity="0">${sparkle(c, 16)}</g>`));
    const gw = [0, 1, 2].map(() => fx.add(`<g opacity="0">${goldWords(c)}</g>`));
    const bw = [0, 1, 2].map(() => fx.add(`<g opacity="0">${blackWords(c)}</g>`));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 820, 150, T, 1, 0.6);
      swing(cl, CLX + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1);

      /* v43 — the fruit comes */
      goodF.forEach((f) => { const k = es(t, 0.05 + f.i * 0.04, 0.4 + f.i * 0.04, ease.back); pose(f.el, { x: f.x, y: f.y, s: k, o: k > 0.01 ? 1 : 0 }); });
      badF.forEach((f) => { const k = es(t, 0.1 + f.i * 0.05, 0.45 + f.i * 0.05); pose(f.el, { x: f.x, y: f.y + es(t, 0.6, 0.9) * 6, s: k * (1 - es(t, 0.5, 0.8) * 0.15), r: es(t, 0.5, 0.8) * 20, o: k > 0.01 ? 1 : 0 }); });
      const wk = es(t, 0.6, 0.8);
      pose(wm, { x: badF[2].x + 4, y: badF[2].y - 2 - wk * 6, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* v44 — figs from thorns? grapes from a bramble? */
      const pK = [[0.95, 250], [1.15, 670], [1.35, 670], [1.45, 850], [1.62, 850], [1.8, 560], [2.05, 560], [2.2, 330]];
      const px = kf(t, pK);
      const reach1 = bump(t, 1.15, 1.32), reach2 = bump(t, 1.45, 1.6), pick = bump(t, 1.8, 1.98);
      const jolt = bump(t, 1.22, 1.3) + bump(t, 1.52, 1.6);
      const back = t > 1.62 && t < 1.8;
      picker.set({ x: px, y: GY, s: 0.96, flip: back || t > 2.05, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 30 + reach1 * 50 + reach2 * 50 + pick * 110, armB: 20 + jolt * 100, head: -jolt * 12 - pick * 16, lean: (reach1 + reach2) * 6 - jolt * 8, o: seg(t, 0.93, 1.0) * (1 - seg(t, 2.15, 2.2)), blink: blinkAt(T, 4) });
      pose(ouch[0], { x: 720, y: GY - 80, s: bump(t, 1.2, 1.34), r: T * 60, o: bump(t, 1.2, 1.34) });
      pose(ouch[1], { x: 900, y: GY - 90, s: bump(t, 1.5, 1.64), r: T * 60, o: bump(t, 1.5, 1.64) });
      const full = es(t, 1.9, 1.95);
      const [bhx, bhy] = handAt(px, GY, 0.96, back || t > 2.05, 30, 'stand');
      pose(emptyB, { x: bhx, y: bhy + 30, o: (1 - full) * seg(t, 0.93, 1.0) * (1 - seg(t, 2.15, 2.2)) });
      pose(basket, { x: bhx, y: bhy + 30, o: full * (1 - seg(t, 2.15, 2.2)) });
      goodF.forEach((f) => { if (f.i < 3) pose(f.el, { x: f.x, y: f.y, s: 1 - es(t, 1.86 + f.i * 0.03, 1.92 + f.i * 0.03), o: 1 }); });

      /* v45a — the treasure of the heart */
      const gx = 600, ex = 1010;
      const come = es(t, 1.95, 2.2);
      const open = es(t, 2.25, 2.42);
      const giveK = es(t, 2.45, 2.8);
      good.set({ x: gx - (1 - come) * 400, y: GY, s: 1.0, flip: false, walk: come > 0 && come < 1 ? gx * 0.05 + t * 30 : undefined, armF: 20 + open * 40 + giveK * 50, armB: 10 + giveK * 60, head: 8 - giveK * 10, o: seg(t, 1.93, 2.0), blink: blinkAt(T, 2) });
      evil.set({ x: ex + (1 - come) * 400, y: GY, s: 1.0, flip: true, walk: come > 0 && come < 1 ? ex * 0.05 + t * 30 : undefined, armF: 20 + open * 40, armB: 10 + es(t, 2.5, 2.7) * 70, head: 8 - es(t, 2.5, 2.7) * 12, o: seg(t, 1.93, 2.0), blink: blinkAt(T, 6) });
      const gcx = gx + 80, ecx = ex - 80;
      const chestO = es(t, 2.1, 2.2);
      pose(gBox, { x: gcx, y: GY, o: chestO }); pose(eBox, { x: ecx, y: GY, o: chestO });
      pose(gLid, { x: gcx - 37, y: GY - 44, r: -open * 110, ox: -37, o: chestO });
      pose(eLid, { x: ecx - 37, y: GY - 44, r: -open * 110, ox: -37, o: chestO });
      pose(gGlow, { x: gcx, y: GY - 50, o: open * 0.9 });
      gifts.forEach((el, i) => {
        const k = es(t, 2.42 + i * 0.1, 2.72 + i * 0.1);
        const [hx, hy] = [gcx - 150 + i * 30, GY - 170 - i * 12];
        pose(el, { x: lerp(gcx, hx, k), y: lerp(GY - 46, hy, k) - Math.sin(k * PI) * 40, o: es(t, 2.4 + i * 0.1, 2.45 + i * 0.1) * (1 - es(t, 3.9, 4.0)) });
      });
      knots.forEach((el, i) => {
        const k = es(t, 2.42 + i * 0.1, 2.72 + i * 0.1);
        const [hx, hy] = [ecx + 110 - i * 30, GY - 150 - i * 20];
        pose(el, { x: lerp(ecx, hx, k), y: lerp(GY - 46, hy, k) - Math.sin(k * PI) * 40, r: time ? Math.sin(T * 3 + i) * 10 : 0, o: es(t, 2.4 + i * 0.1, 2.45 + i * 0.1) * (1 - es(t, 3.9, 4.0)) });
      });

      /* v45b — the mouth speaks from the heart */
      const [ghx, ghy] = headAt(gx, GY, 1.0, false), [ehx, ehy] = headAt(ex, GY, 1.0, true);
      gw.forEach((el, i) => { const k = es(t, 3.05 + i * 0.14, 3.45 + i * 0.14); pose(el, { x: ghx + 40 + k * (60 + i * 40), y: ghy - 20 - k * (40 + i * 34), s: 0.5 + k * 0.6, o: k > 0.01 ? 1 : 0 }); });
      bw.forEach((el, i) => { const k = es(t, 3.05 + i * 0.14, 3.45 + i * 0.14); pose(el, { x: ehx - 40 - k * (60 + i * 40), y: ehy - 20 - k * (40 + i * 34), s: 0.5 + k * 0.6, r: time ? Math.sin(T * 4 + i) * 8 : 0, o: k > 0.01 ? 1 : 0 }); });

      S.cam.x = kf(t, [[-0.5, 0], [0.9, 0], [1.3, 10], [1.9, -10], [2.2, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.6, 1.04], [1.1, 1.08], [1.9, 1.08], [2.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.6, -20], [1.1, 40], [1.9, 40], [2.2, 30]]);
    };
  },
};
