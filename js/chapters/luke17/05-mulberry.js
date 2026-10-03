// Łk 17,5–6 — the road along the hill above the lake; a great old mulberry tree stands by the road, dark berries in
// its leaves. "The apostles said to the Lord, 'Increase our faith'": they gather round Him holding out their open
// hands, each with only a tiny, flickering flame in it. "If you had faith like a grain of mustard seed": a round glass
// comes down on its string over His open hand — and in it lies one tiny mustard seed, glowing. "You would tell this
// sycamore tree, 'Be uprooted, and be planted in the sea'": Peter points at the tree, it shivers, the ground cracks,
// and up it comes, roots and all, sails over the hillside and plunges into the lake — and stands there in the waves.
// "And it would obey you": the tree bows its crown to them, fish leap round it, and the disciples throw up their hands.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { fish } from '../../assets/things.js';
import { lakeSet, LAKE, mulberry, roadFour, mustardGlass, seedDot, tinyFlame, bubble, strung, flyIn, dustPuff, voiceRings, headAt, hand, palmAt, halo, warm, behindOf, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const JX = 820, JY = 730;
const TX0 = 500, TY = 668;              // the tree on the bank
const SX0 = 1060, SY = 566, SS = 0.46;  // where it stands in the lake
const SPOT0 = { peter: [650, 736, false], andrew: [572, 748, false], john: [980, 736, true], james: [1060, 748, true] };

export default {
  id: 'lk17-mulberry',
  beats: [
    { v: 5 },
    { v: 6, text: 'Pan rzekł: «Gdybyście mieli wiarę jak ziarnko gorczycy,' },
    { v: 6, cont: true, text: 'powiedzielibyście tej morwie: "Wyrwij się z korzeniem i przesadź się w morze!",' },
    { v: 6, cont: true, text: 'a byłaby wam posłuszna.' },
  ],
  cam: { x: [-60, 120], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    // phone: the tree stands a little further in on the bank, and lands nearer in the lake, clear of the thread
    const TX = S.portrait ? 580 : TX0, SX = S.portrait ? 990 : SX0;
    // phone: Andrew and James a step in (James clear of the thread), so the tree on the bank is whole at the left
    const SPOT = S.portrait ? { ...SPOT0, andrew: [600, 748, false], james: [1030, 748, true] } : SPOT0;
    const L = lakeSet(S);
    const c = S.c;
    const M = mulberry(c, 250);
    /* the tree in the lake (behind the front waves), fish round it */
    const inLake = L.treeL.add(`<g>${M.tree}</g>`);
    const jumpers = [0, 1, 2].map((i) => L.treeL.add(`<g opacity="0">${fish(c, { color: i % 2 ? C.lake2 : C.lake3 })}</g>`));
    const rings = [0, 1].map(() => L.treeL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 60, 12, PI, 2 * PI, 14), 3)}" fill="${C.foam}"/></g>`));
    /* the tree on the bank, the hole it leaves, the tree in flight */
    const bankL = S.layer({ par: 0.4, sh: 5 });
    behindOf(bankL, L.pit);
    const onBank = bankL.add(`<g>${M.tree}</g>`);
    const hole = L.pit.add(`<g opacity="0"><ellipse rx="46" ry="12" fill="${mix(C.soilDark, C.soil, 0.3)}"/></g>`);
    const puffs = [0, 1, 2, 3].map((i) => L.pit.add(`<g opacity="0">${dustPuff(c, 20)}</g>`));
    const flyL = S.layer({ par: 0.45, sh: 6 });
    const flying = flyL.add(`<g><g transform="translate(0 0)">${M.roots}</g>${M.tree}</g>`);
    /* people */
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    behindOf(glowL, L.act);
    const aura = glowL.add(`<g>${halo(130, 0.55)}</g>`);
    const seedGlow = glowL.add(`<g opacity="0">${warm(40)}</g>`);
    const F = roadFour(S, L.act, c);
    const small = F.ds.map((d) => ({ d, el: L.fx.add(`<g opacity="0">${tinyFlame(c, 12, false)}</g>`), g: glowL.add(`<g opacity="0">${warm(22, 0.8)}</g>`) }));
    const seed = L.fx.add(`<g opacity="0">${seedDot(c, 3)}</g>`);
    const glass = L.fx.add(`<g transform="translate(0 -1500)">${strung(mustardGlass(c, 46), 46)}</g>`);
    const ask = L.fx.add(`<g opacity="0">${bubble(c, tr('Przymnóż nam wiary!', 'Increase our faith!'), { size: 19, tail: 1 })}</g>`);
    const order = L.fx.add(`<g opacity="0">${bubble(c, [tr('Wyrwij się z korzeniem', 'Be uprooted,'), tr('i przesadź się w morze!', 'and be planted in the sea!')], { size: 17, tail: -1 })}</g>`);
    const voice = voiceRings(L.act, c, { n: 3, color: C.sun, r: 36, w: 5 });

    return (t, time) => {
      const T = time;
      L.update(T);

      /* v5 — "Increase our faith!": they hold out their hands, each with only a tiny flame */
      const gather = es(t, 0.05, 0.35);
      const hands = es(t, 0.2, 0.45) * (1 - es(t, 1.9, 2.1));
      const [px, py] = hand(SPOT.peter[0], SPOT.peter[1], 0.96, false, 70);
      F.ds.forEach((d, i) => {
        const [x0, y0, fl] = SPOT[d.k];
        const x = x0 + (fl ? -1 : 1) * gather * 20;
        const amaze = es(t, 3.2, 3.45);
        const pointing = d.k === 'peter' ? es(t, 2.05, 2.25) * (1 - es(t, 2.85, 3.0)) : 0;
        d.p.set({ x, y: y0, s: 0.96, flip: d.k === 'peter' ? pointing > 0.5 : fl, armF: 14 + hands * 56 + pointing * 60 + amaze * 60, armB: 6 + amaze * 130 + bump(t, 2.4, 2.9) * (d.k === 'andrew' ? 60 : 0), head: -4 - hands * 4 + amaze * -6, lean: -bump(t, 2.3, 2.8) * 6, blink: blinkAt(T, d.seed) });
        const [hx, hy] = hand(x, y0, 0.96, d.k === 'peter' ? pointing > 0.5 : fl, 14 + hands * 56);
        const fk = hands * (1 - es(t, 1.9, 2.0));
        pose(small[i].el, { x: hx + (fl ? -4 : 4), y: hy - 6, s: 0.8 + (T ? Math.sin(T * 11 + i * 2) * 0.18 : 0), o: fk });
        pose(small[i].g, { x: hx, y: hy - 10, o: fk * 0.8 });
      });
      const [phx, phy] = headAt(SPOT.peter[0] + gather * 20, SPOT.peter[1], 0.96, false);
      const ak = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(ask, { x: phx + 50, y: phy - 30, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v6a — a grain of mustard seed in His palm, under the glass */
      const open = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const tell = es(t, 2.05, 2.2) * (1 - es(t, 2.8, 2.95));
      F.jesus.set({ x: JX, y: JY, s: 1.04, flip: tell > 0.5, armF: 16 + open * 58 + tell * 10, armB: 8 + bump(t, 0.4, 0.95) * 30 + tell * 60 + es(t, 3.2, 3.4) * 40, head: open * 8 - es(t, 3.2, 3.4) * 4, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jx, jy] = palmAt(JX, JY, 1.04, false, 16 + open * 58);
      const sk = es(t, 1.15, 1.35, ease.back);
      pose(seed, { x: jx + 2, y: jy - 4, s: Math.max(0.001, sk), o: sk > 0.01 && open > 0.01 ? 1 : 0 });
      pose(seedGlow, { x: jx, y: jy - 6, o: sk * open });
      flyIn(glass, es(t, 1.2, 1.45, ease.back) * (1 - es(t, 1.9, 2.1)), jx + 10, jy - 120, T, 1, 1);
      const [jhx, jhy] = headAt(JX, JY, 1.04, tell > 0.5);
      voice(jhx + 14, jhy, es(t, 1.02, 1.12) * (1 - es(t, 1.8, 1.9)), T, { dir: 1, spread: 2 });

      /* v6b — "Be uprooted!": the tree shivers, comes up roots and all, flies to the lake */
      const ok = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.85, 2.95));
      pose(order, { x: phx - (S.portrait ? 20 : 70), y: phy - 60, s: ok, o: ok > 0.01 ? 1 : 0 });
      const shiver = bump(t, 2.15, 2.45) * (T ? Math.sin(T * 40) : 0.5);
      const up = t >= 2.42;
      const fl = es(t, 2.42, 2.82, (u) => u);
      pose(onBank, { x: TX + shiver * 4, y: TY, r: shiver * 1.5, o: up ? 0 : 1 });
      pose(hole, { x: TX, y: TY + 4, o: up ? 1 - es(t, 3.6, 3.9) : 0 });
      puffs.forEach((p, i) => {
        const k = bump(t, 2.36 + i * 0.03, 2.75 + i * 0.03);
        pose(p, { x: TX - 40 + i * 28, y: TY - k * 20, s: 0.6 + k * 0.7, o: k * 0.9 });
      });
      const fxp = lerp(TX, SX, fl), fyp = lerp(TY, SY, fl) - Math.sin(fl * PI) * 360;
      pose(flying, { x: fxp, y: fyp - (fl < 0.05 ? fl * 400 : 0), s: lerp(1, SS, fl), r: Math.sin(fl * PI) * 18, o: up && fl < 1 ? 1 : 0 });
      // it stands in the lake, then bows
      const bow = bump(t, 3.1, 3.55);
      pose(inLake, { x: SX, y: SY, s: SS, r: bow * 14, o: fl >= 1 ? 1 : 0 });
      rings.forEach((el, i) => {
        const k = seg(t, 2.82 + i * 0.12, 3.4 + i * 0.12);
        pose(el, { x: SX, y: SY + 4, s: 0.4 + k * 1.4, o: k > 0 && k < 1 ? (1 - k) : 0 });
      });
      jumpers.forEach((el, i) => {
        const k = seg(t, 3.15 + i * 0.12, 3.5 + i * 0.12);
        const d = i % 2 ? -1 : 1;
        pose(el, { x: SX + d * (50 + i * 20) + d * k * 40, y: SY + 6 - Math.sin(k * PI) * 60, s: 0.7, sx: d, r: d * (k - 0.5) * 120, o: k > 0 && k < 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [1, 10], [2.0, 10], [2.4, 40], [2.9, 80], [3.5, 60]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 36], [2.0, 30], [2.6, -20], [3.0, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [1.2, 1.1], [2.0, 1.06], [2.6, 1.0], [3.5, 1.04]]);
    };
  },
};
