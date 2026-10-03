// Łk 15,13b–14 — the far country: a foreign city of domes and towers at night, a terrace hung with strings of
// gaudy lanterns, a low table heaped with food and wine. "…and there he squandered his property in reckless
// living": the younger son in a rose robe and a gold mantle, a gold wreath on his head, lifts his cup and flings
// coins from his fat purse into the air; the revellers dance and pipe and catch them. "When he had spent
// everything, a severe famine arose in that country": he turns his purse inside out — nothing; the revellers slip
// away, the lanterns go dark, and the day that comes is a hard one: a dusty sky, a white sun, cracked earth, the
// trees dead and a crow on a bare branch. "…and he began to be in need": he sits alone on the cracked ground in
// rags, hugging his knees, an empty bowl before him.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { band, palm, moon, sun, stars } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import {
  YOUNGER_RICH, YOUNGER_RAGS, REVELLERS, lantern, goldCoin, purse, bowl, cup, loaf, flute, tambourine, laurel, addToHead, deadTree, domeCity, cracks, skyFade, hangOff, glow, lowTable,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, NIGHT, DUST,
  ragsMarkup,
} from './lib.js';

const GY = 704, SX = 800;

export default {
  id: 'lk15-riot',
  parable: true,
  beats: [
    { v: 13, cont: true, text: 'i tam roztrwonił swój majątek, żyjąc rozrzutnie.' },
    { v: 14, text: 'A gdy wszystko wydał, nastał ciężki głód w owej krainie' },
    { v: 14, cont: true, text: 'i on sam zaczął cierpieć niedostatek.' },
  ],
  cam: { x: [-30, 30], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const skN = S.layer({ par: 0, sky: true });
    const nid = S.id('night');
    S.defs(`<linearGradient id="${nid}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.min(0, S.view().y0).toFixed(0)}" x2="0" y2="760"><stop offset="0" stop-color="${NIGHT[0]}"/><stop offset=".55" stop-color="${mix(NIGHT[1], C.plumRobe, 0.3)}"/><stop offset="1" stop-color="${mix(NIGHT[2], C.dusk, 0.35)}"/></linearGradient>`);
    skN.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${nid})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const skD = skyFade(S, DUST, skN, 'dust');
    const starL = S.layer({ par: 0.02, sh: 0, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -800, y1: 380, n: 90 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const mn = hangOff(hangL, moon(c, 34));
    const sunG = hangL.add(`<g opacity="0">${glow(260, 0.8)}</g>`);
    const sn = hangOff(hangL, sun(c, 50, { rays: mix(C.sun, C.cream, 0.3), disc: mix(C.sun, C.cream, 0.5), inner: mix(C.cream, C.sun, 0.2) }));

    /* the city: at night (lit windows) and in the famine (dusty) */
    const cityN = S.layer({ par: 0.14, sh: 3 });
    cityN.add(band(c, { y: 520, amps: [10, 4, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.night, 0.55), x0: -1400, x1: 3000 }).markup);
    cityN.add(`<g transform="translate(0 560)">${domeCity(c, -1000, 2600, { wall: mix(C.plaster, C.night, 0.45), dome: mix(C.sun, C.night, 0.35), lit: true })}</g>`);
    const cityD = S.layer({ par: 0.14, sh: 3 });
    cityD.add(band(c, { y: 520, amps: [10, 4, 2], lens: [900, 300, 110], color: mix(C.dune, C.sand2, 0.4), x0: -1400, x1: 3000 }).markup);
    cityD.add(`<g transform="translate(0 560)">${domeCity(makeC(S), -1000, 2600, { wall: mix(C.plaster2, C.dune, 0.4), dome: mix(C.ochre, C.dune, 0.4), win: C.soil })}</g>`);
    cityD.fade(0);
    /* the ground: the terrace (night) and the cracked earth (famine) */
    const terr = S.layer({ par: 0.36, sh: 3 });
    const tf = sheet().p(c.cut([[-1400, GY - 20], [3000, GY - 20], [3000, 1800], [-1400, 1800]], 0.5, 16), mix(C.terracotta, C.night, 0.35));
    let tiles = '';
    for (let x = -1400; x < 3000; x += 60) tiles += c.ribbon([[x, GY - 18], [x - 40, 1000]], 2);
    tf.x(tiles, mix(C.terracotta, C.night, 0.55), 'opacity=".5"');
    terr.add(tf.out());
    terr.add(`<g>${palm(c, 330, GY - 16, 250, { trunk: mix(C.wood3, C.night, 0.3), frond: mix(C.moss, C.night, 0.3), frond2: mix(C.leaf, C.night, 0.3) })}${palm(c, 1290, GY - 16, 280, { trunk: mix(C.wood3, C.night, 0.3), frond: mix(C.moss, C.night, 0.3), frond2: mix(C.leaf, C.night, 0.3) })}</g>`);
    const dry = S.layer({ par: 0.36, sh: 3 });
    dry.add(sheet().p(c.cut([[-1400, GY - 20], [3000, GY - 20], [3000, 1800], [-1400, 1800]], 0.8, 16), mix(C.dune, C.sand2, 0.35)).out() + cracks(c, -900, 2500, GY - 10, 1000, 70, mix(C.soil, C.dune, 0.3)));
    dry.add(`<g transform="translate(360 ${GY - 16})">${deadTree(c, 240, mix(C.wood2, C.rock3, 0.3))}</g><g transform="translate(1240 ${GY - 16})">${deadTree(c, 280, mix(C.wood2, C.rock3, 0.3))}</g>`);
    const crow = dry.add(`<g transform="translate(1230 ${GY - 250})">${bird(c, { color: C.crow, belly: C.bird })}</g>`);
    dry.fade(0);

    /* the lanterns over the terrace */
    const lampL = S.layer({ par: 0.3, sh: 4 });
    const strPts = c.qbez([200, 150], [800, 330], [1400, 150], 16);
    lampL.add(`<path d="${c.line(strPts)}" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>`);
    const lamps = [3, 5, 7, 9, 11, 13].map((k, i) => ({ i, x: strPts[k][0], y: strPts[k][1], el: lampL.add(`<g transform="translate(${strPts[k][0]} ${strPts[k][1]})">${lantern(c, { col: [C.roseRobe, C.halo, C.apricot, C.lavender][i % 4] })}</g>`) }));
    lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); });

    /* the feast */
    const feast = S.layer({ par: 0.38, sh: 5 });
    // phone: the table and the revellers close in from the edges
    const RX = S.portrait ? [506, 616, 990, 1072] : [430, 560, 1000, 1110];
    const TX = S.portrait ? 616 : 560;
    const table = feast.add(`<g transform="translate(${TX} ${GY + 16})">${lowTable(c, 300, 40)}<g transform="translate(-100 -42)">${bowl(c, { food: 'fruit' })}</g><g transform="translate(-40 -44)">${loaf(c, 14)}</g><g transform="translate(20 -40)">${cup(c, C.sun)}</g><g transform="translate(70 -40)">${cup(c, C.ochre)}</g><g transform="translate(110 -44)">${loaf(c, 12)}</g></g>`);
    const revs = [
      { x: RX[0], flip: false, o: REVELLERS[3], pose: 'sit', hold: `<g transform="translate(0 2)">${cup(c, C.sun)}</g>`, a: 60 },
      { x: RX[1], flip: false, o: REVELLERS[1], pose: 'sit', hold: `<g transform="rotate(-70) translate(-6 -10) scale(1.3)">${flute(c)}</g>`, a: 90 },
      { x: RX[2], flip: true, o: REVELLERS[0], pose: 'stand', hold: `<g transform="translate(2 6)">${tambourine(c)}</g>`, a: 120 },
      { x: RX[3], flip: true, o: REVELLERS[2], pose: 'stand', hold: '', a: 100 },
    ].map((r, i) => ({ ...r, i, p: S.puppet(feast.add(person(c, { ...r.o, pose: r.pose, holdF: r.hold }))) }));
    const rich = S.puppet(feast.add(addToHead(person(c, { ...YOUNGER_RICH, holdF: `<g transform="translate(0 2)">${cup(c, C.sun)}</g>`, holdB: `<g transform="translate(0 -4)">${purse(c, {})}</g>` }), `<g transform="translate(0 -6)">${laurel(c)}</g>`)));
    const emptyP = S.puppet(feast.add(person(c, { ...YOUNGER_RICH, holdF: `<g transform="translate(0 -2) rotate(180)">${purse(c, { full: false })}</g>` })));
    const rags = S.puppet(feast.add(ragsMarkup(c, { pose: 'sit' })));
    const emptyBowl = feast.add(`<g opacity="0">${bowl(c, { food: null, color: mix(C.pot, C.rock3, 0.3) })}</g>`);
    const coins = Array.from({ length: 10 }, (_, i) => ({ i, el: feast.add(`<g opacity="0">${goldCoin(c, 6)}</g>`), tx: RX[i % 4] + (i % 3 - 1) * 20 }));
    const moth = feast.add(`<g opacity="0"><path d="${c.cut(c.ell(-5, 0, 6, 3.4, 8, -0.4), 0.2, 2) + c.cut(c.ell(5, 0, 6, 3.4, 8, 0.4), 0.2, 2)}" fill="${C.stone2}"/></g>`);

    return (t, time) => {
      const T = time;
      /* the night of the feast → the day of the famine */
      const dark = es(t, 1.2, 1.4);
      const day = es(t, 1.4, 1.75);
      skD.fade(day);
      starL.fade(1 - day);
      cityN.fade(1 - day);
      cityD.fade(day);
      terr.fade(1 - day);
      dry.fade(day);
      lampL.fade(1 - day);
      lamps.forEach((l) => { fade(l.glow, 1 - dark); pose(l.el, { x: l.x, y: l.y, r: T ? Math.sin(T * 1.2 + l.i) * 3 * (1 - dark) : 0 }); });
      pose(mn, { x: 1180, y: lerp(150, -300, day), r: 0 });
      const sk = es(t, 1.45, 1.8, ease.out);
      pose(sn, { x: 800, y: lerp(-1500, 150, sk), r: T ? Math.sin(T * 0.5) : 0 });
      pose(sunG, { x: 800, y: 150, o: sk * 0.7 });
      pose(crow, { x: 1230, y: GY - 252, o: es(t, 1.6, 1.75) });
      pose(table, { x: TX, y: GY + 16, o: 1 - es(t, 1.25, 1.4) });

      /* v13b — reckless living: the cup, the coins flung, the dancing */
      const fling = (t % 0.25) / 0.25;
      const party = 1 - es(t, 1.05, 1.2);
      rich.set({ x: SX, y: GY, s: 1.02, o: 1 - seg(t, 1.02, 1.05), armF: 110 + Math.sin(t * PI * 4) * 10, armB: 60 + Math.abs(Math.sin(t * PI * 8)) * 70, head: -10, bob: -Math.abs(Math.sin(t * PI * 6)) * 5, blink: blinkAt(T, 1) });
      coins.forEach((co) => {
        const k = es(t, 0.08 + co.i * 0.08, 0.36 + co.i * 0.08, (x) => x);
        const [hx, hy] = [SX - 30, GY - 170];
        pose(co.el, { x: lerp(hx, co.tx, k), y: lerp(hy, GY - 120, k) - Math.sin(k * PI) * 140, r: k * 540, o: k > 0 && k < 1 ? 1 : 0 });
      });
      revs.forEach((r) => {
        const leave = es(t, 1.08 + r.i * 0.04, 1.32 + r.i * 0.04);
        const dance = r.pose === 'stand' ? Math.sin(t * PI * 6 + r.i) : 0;
        r.p.set({ x: r.x + (r.flip ? 1 : -1) * leave * 600, y: GY, s: 0.96, flip: r.flip ? leave < 0.05 : leave > 0.05, o: 1 - es(t, 1.2, 1.36), walk: leave > 0 && leave < 1 ? t * 30 : undefined, armF: r.a * party + (r.pose === 'stand' ? dance * 20 : 0), armB: r.pose === 'stand' ? 120 * party + dance * 30 : 10, head: r.i === 1 ? -10 : dance * 4, bob: r.pose === 'stand' ? -Math.abs(dance) * 6 * party : 0, blink: blinkAt(T, r.i + 2) });
      });

      /* v14a — everything spent: the purse turned out, the revellers gone, the famine */
      const turnOut = es(t, 1.06, 1.2);
      emptyP.set({ x: SX, y: GY, s: 1.02, o: seg(t, 1.02, 1.05) * (1 - seg(t, 1.9, 1.95)), armF: 70 + turnOut * 30, armB: 10, head: 10 + es(t, 1.3, 1.5) * 10, blink: blinkAt(T, 1) });
      const [px, py] = handP(SX, GY, 1.02, false, 100);
      pose(moth, { x: px + 10 + es(t, 1.15, 1.5) * 60, y: py - 30 - es(t, 1.15, 1.5) * 60 + Math.sin(t * 40) * 3, o: bump(t, 1.12, 1.55) });

      /* v14b — in need: in rags on the cracked ground */
      const need = seg(t, 1.92, 1.97);
      rags.set({ x: SX - 20, y: GY, s: 1.02, o: need, armF: 50, armB: 60, head: 18, lean: 8, blink: blinkAt(T, 1) });
      pose(emptyBowl, { x: SX + 70, y: GY - 2, o: es(t, 2.0, 2.1) });

      S.cam.x = kf(t, [[0, 0], [1, 10], [2, 0]]);
      S.cam.y = kf(t, [[0, 20], [1, 30], [2.2, 40]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [2.0, 1.02], [2.6, 1.08]]);
    };
  },
};

/** a second pair of scissors (the dusty city differs from the lit one) */
function makeC(S) { return makeCutter(S.id('dusty')); }
