// Mt 10,9–10 — packing for the road, and Jesus unpacking it. At the bench Peter holds up a full purse: a gold coin,
// a silver one and a copper one jump out as each is named and drop back into the bowl. Andrew is loaded like a
// pedlar — bag, a spare tunic, sandals, a staff — and one thing after another flies off him onto the pegs of the
// olive tree. Then a painted plate comes down: a reaper at the end of the day, and the farmer's wife sets bread
// and a bowl before him — the labourer is worth his food.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hill, MORNING, purse, bag, tunic, sandals, staff, coin, bowl, loaf, hand, headAt, sparkle, plateCard, tr, PI } from './lib.js';

const JX = 800;

/** a coin of a given metal */
function metalCoin(c, col, r = 12) {
  return sheet().p(c.cut(c.circ(0, 0, r, 16), 0.3, 3), col).p(c.cut(c.circ(0, 0, r * 0.62, 12), 0.2, 3), shade(col, -0.16)).x(c.poly(c.circ(-r * 0.3, -r * 0.3, r * 0.2, 6)), '#fffaf0', 'opacity=".7"').out();
}
/** the painted plate: a reaper seated under a tree at a table; bread and bowl are separate */
function reaperPlate(c, w, h) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 10, 10, w - 20, h - 50), 0.3, 8), mix(C.dawn, C.skyBlue, 0.3));
  s.p(c.cut([[-w / 2 + 10, h - 90], [w / 2 - 10, h - 104], [w / 2 - 10, h - 40], [-w / 2 + 10, h - 40]], 0.5, 8), C.wheat);
  let st = '';
  for (let x = -w / 2 + 20; x < w / 2 - 20; x += 11) st += c.ribbon([[x, h - 90 - (x > 0 ? 8 : 0)], [x + 2, h - 120 - (x > 0 ? 8 : 0)]], 2.4);
  s.p(st, C.wheat2);
  s.p(c.cut([[-40, h - 70], [60, h - 70], [60, h - 62], [-40, h - 62]], 0.3, 5) + c.cut(c.rect(-34, h - 62, 6, 22), 0.2, 4) + c.cut(c.rect(50, h - 62, 6, 22), 0.2, 4), C.wood2);
  return s.out();
}

export default {
  id: 'mt10-pack',
  beats: [
    { v: 9 },
    { v: 10, text: 'Nie bierzcie na drogę torby ani dwóch sukien, ani sandałów, ani laski!' },
    { v: 10, cont: true, text: 'Wart jest bowiem robotnik swej strawy.' },
  ],
  cam: { x: [-40, 40], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const H = hill(S, { skyCols: MORNING, sunAt: S.portrait ? [1040, 200] : [1150, 200] });   // phone: the sun hangs inside the frame, not half under the thread
    const c = S.c;
    const { gfn } = H;

    /* the bench with the bowl, and the olive with pegs */
    const G2 = S.layer({ par: 0.48, sh: 4 });
    const BX = 560, BY = gfn(BX) + 30;
    const bench = sheet();
    bench.p(c.cut([[BX - 70, BY - 40], [BX + 70, BY - 40], [BX + 70, BY - 30], [BX - 70, BY - 30]], 0.3, 6), C.wood);
    bench.p(c.cut(c.rect(BX - 62, BY - 30, 8, 30), 0.2, 4) + c.cut(c.rect(BX + 54, BY - 30, 8, 30), 0.2, 4), C.wood2);
    G2.add(bench.out() + `<g transform="translate(${BX - 30} ${BY - 40})">${bowl(c, { w: 44, food: null })}</g>`);
    const PHN = S.portrait;   // phone: the olive with its pegs comes in from under the thread
    const TX = PHN ? 1036 : 1090, TY = gfn(TX) + 20;
    G2.add(olive(c, TX, TY, 1.0));
    const pegs = [[TX - 70, TY - 150], [TX - 26, TY - 168], [TX + 22, TY - 160], [TX + 64, TY - 140]];
    G2.add(sheet().p(c.ribbon([[TX - 100, TY - 142], [TX + 90, TY - 168]], 7), C.wood2).p(pegs.map(([x, y]) => c.cut(c.rect(x - 3, y - 4, 6, 12), 0.2, 3)).join(''), C.wood3).out());

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const PX = 640, AX = PHN ? 922 : 950;   // phone: the tree and its pegs come in from under the thread
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const andrew = S.puppet(P.add(person(c, CAST.andrew)));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    /* the things */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const purseEl = fx.add(`<g>${purse(c)}</g>`);
    const METALS = [[C.sun, tr('złoto', 'gold')], [mix(C.stone, C.skyBlue2, 0.5), tr('srebro', 'silver')], [C.clay, tr('miedź', 'brass')]];
    const coins = METALS.map(([col], i) => ({ i, el: fx.add(`<g>${metalCoin(c, col, 13 - i)}</g>`) }));
    const ITEMS = [
      { m: `<g transform="scale(.9)">${bag(c)}</g>`, at: 1.08, on: [-14, -120] },
      { m: `<g transform="scale(.8)">${tunic(c, C.dustyBlue)}</g>`, at: 1.32, on: [18, -110] },
      { m: `<g transform="scale(.9)">${sandals(c)}</g>`, at: 1.52, on: [-20, -60] },
      { m: `<g transform="rotate(-10)">${staff(c, 190, 0)}</g>`, at: 1.72, on: [30, -90] },
    ].map((it, i) => ({ ...it, i, el: fx.add(`<g>${it.m}</g>`) }));
    const puffs = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));

    /* the reaper's plate */
    const flies = S.layer({ par: 0.25, sh: 6 });
    const PW = 330, PH = 250;
    const plate = flies.add(`<g><path d="M${-PW / 2 + 30} 0V-2000M${PW / 2 - 30} 0V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${plateCard(c, '', tr('robotnik i jego strawa', 'the laborer and his food'), { w: PW, h: PH })}<g transform="translate(0 0)">${reaperPlate(c, PW, PH)}</g></g>`);
    const reaper = S.puppet(flies.add(person(c, { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin4, belt: C.rope, pose: 'sit' })));
    const wife = S.puppet(flies.add(person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.cream, veil2: C.linen2, skin: C.skin2, beard: 'none' })));
    const food = flies.add(`<g><g transform="translate(-14 0)">${loaf(c, 14)}</g><g transform="translate(18 0)">${bowl(c, { w: 28, food: 'stew' })}</g></g>`);

    return (t, time) => {
      const T = time;
      H.update(T);
      const JY = gfn(JX) + 10;

      /* v9 — no gold, silver or brass */
      const lift = es(t, 0.05, 0.2) * (1 - es(t, 0.9, 1.05));
      peter.set({ x: PX, y: gfn(PX) + 20, s: 0.98, armF: 20 + lift * 110, armB: 10 + bump(t, 0.2, 0.9) * 30, head: -lift * 10, blink: blinkAt(T, 2) });
      const [phx, phy] = hand(PX, gfn(PX) + 20, 0.98, false, 20 + lift * 110);
      pose(purseEl, { x: phx + 4, y: phy + (lift > 0.05 ? -6 : 10), s: 0.9 + lift * 0.3, o: 1 });
      coins.forEach((co) => {
        const a = 0.25 + co.i * 0.2;
        const k = seg(t, a, a + 0.4);
        const x = lerp(phx + 4, BX - 30 + (co.i - 1) * 8, k), y = lerp(phy - 20, BY - 52, k) - Math.sin(k * PI) * 110;
        pose(co.el, { x, y, r: k * 540, s: 1.3, o: k > 0 ? 1 : 0 });
      });
      const shake = bump(t, 0.2, 0.95);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: t < 1.0 || t > 2.0 ? true : false, armF: 20 + shake * 60 + bump(t, 1.0, 1.9) * 60 + es(t, 2.05, 2.3) * 30, armB: 10 + bump(t, 2.1, 2.9) * 40, head: Math.sin(t * 22) * 4 * bump(t, 0.3, 0.8) - 2, blink: blinkAt(T, 1) });

      /* v10a — no bag, no two tunics, no sandals, no staff: onto the pegs */
      const AY = gfn(AX) + 22;
      const rel = es(t, 1.9, 2.1);
      andrew.set({ x: AX, y: AY, s: 0.98, flip: bump(t, 1.0, 1.95) > 0.5, armF: 30 + bump(t, 1.0, 1.9) * 40 + rel * 20, armB: 20 + rel * 60, head: bump(t, 1.0, 1.9) * 6 - rel * 8, lean: bump(t, 1.0, 1.9) * -3, blink: blinkAt(T, 3) });
      ITEMS.forEach((it) => {
        const k = es(t, it.at, it.at + 0.24);
        const [px, py] = pegs[it.i];
        const x = lerp(AX + it.on[0], px, k), y = lerp(AY + it.on[1], py + 26, k) - Math.sin(k * PI) * 60;
        pose(it.el, { x, y, r: lerp(it.i === 3 ? 10 : 0, 0, k) + Math.sin(k * PI) * 20, s: lerp(0.9, 0.75, k), o: 1 });
      });
      puffs.forEach((p, i) => {
        const k = bump(t, 1.95 + i * 0.05, 2.35 + i * 0.05);
        pose(p, { x: AX - 20 + i * 20, y: AY - 190 - i * 12, s: k, r: T * 40, o: k });
      });

      /* v10b — the labourer is worth his food */
      const pk = es(t, 2.05, 2.35, ease.back);
      const px0 = 800, py0 = lerp(-500, 110, pk);
      pose(plate, { x: px0, y: py0, r: Math.sin(T * 0.8) * 1 * pk, o: pk > 0.002 ? 1 : 0 });
      reaper.set({ x: px0 - 70, y: py0 + PH - 44, s: 0.46, armF: 30 + es(t, 2.55, 2.75) * 40, armB: 10, head: -es(t, 2.55, 2.75) * 6, blink: blinkAt(T, 5), o: pk > 0.002 ? 1 : 0 });
      const wk = es(t, 2.3, 2.6);
      wife.set({ x: px0 + lerp(140, 70, wk), y: py0 + PH - 44, s: 0.48, flip: true, walk: wk > 0 && wk < 1 ? t * 40 : undefined, armF: 70 * (1 - es(t, 2.6, 2.75)) + 30, blink: blinkAt(T, 6), o: pk > 0.002 ? 1 : 0 });
      const fk = es(t, 2.55, 2.7);
      pose(food, { x: px0 + lerp(56, 10, fk), y: py0 + PH - 72 - (1 - fk) * 30, s: 0.9, o: pk > 0.002 && wk > 0.5 ? 1 : 0 });

      S.cam.x = -bump(t, 0, 1.0) * 25 + bump(t, 1.0, 2.0) * 25;
      S.cam.y = -es(t, 2.0, 2.4) * 40;
      S.cam.z = 1 + bump(t, 0, 1.0) * 0.04 + bump(t, 1.0, 2.0) * 0.04;
    };
  },
};
