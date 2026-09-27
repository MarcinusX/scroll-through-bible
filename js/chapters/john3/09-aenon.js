// J 3,22–25 — Morning in Judea: Jesus and His disciples come down the road into the land of Judea; by the
// Jordan He stays with them and baptizes (tents, a man kneeling in the river). The set changes: at Aenon near
// Salim water bubbles up from many springs, and John baptizes in a pool while people keep coming.
// "John had not yet been thrown into prison": prison bars come down from the flies above him — and stop,
// and go back up: not yet. Then an argument about purification: John's disciples and a Jew by the stone jars.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, reeds, rock, sun, cloud, palm, grass, town } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { LOOK as L3 } from '../mark3/lib.js';
import {
  JOHN_B, johnsOpts, springRock, stoneJar, tent, bars, shell, drops, word, nameTag, say, question, bang, kf, moving, hand, headAt, tr, PI, DAY,
  hangAt,
  vpose,
} from './lib.js';

const RIV = 690;   // water line (people standing in the water)
const SEP = 740;   // the near bank
const POOL = 714;  // people standing in the pool at Aenon

export default {
  id: 'j3-aenon',
  beats: [
    { v: 22, text: 'Potem Jezus i uczniowie Jego udali się do ziemi judzkiej.' },
    { v: 22, cont: true, text: 'Tam z nimi przebywał i udzielał chrztu.' },
    { v: 23, text: 'Także i Jan był w Ainon, w pobliżu Salim, udzielając chrztu, ponieważ było tam wiele wody.' },
    { v: 23, cont: true, text: 'I przychodzili [tam] ludzie i przyjmowali chrzest.' },
    { v: 24 },
    { v: 25 },
  ],
  cam: { x: [-80, 80], y: [-20, 80], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1200, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 480, y: 150, len: 700 });

    /* ================= set A: Judea, by the Jordan ================= */
    const A = [];
    const lay = (arr, o) => { const L = S.layer(o); arr.push(L); return L; };
    lay(A, { par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [30, 12, 4], lens: [900, 320, 120], color: mix(C.dune, C.duskViolet, 0.35) }).markup);
    const aH = lay(A, { par: 0.2, sh: 3 });
    const jh = hillsWith(c, { y: 500, amps: [26, 10, 3], lens: [800, 300, 110], color: mix(C.sand2, C.dune, 0.5), trees: 16, treeColor: C.olive, treeH: 22 });
    aH.add(jh.markup);
    const aG = lay(A, { par: 0.5, sh: 3 });
    const gfn = c.wave(620, [5, 2], [600, 160]);
    aG.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage3, 0.3)).out());
    aG.add(sheet().p(c.ribbon([[-200, 560], [200, 590], [520, 610], [700, 640]], (u) => 20 + u * 30, 1), C.sand).out());
    aG.add(`<g transform="translate(1180 626)">${tent(c, 170, 100)}</g><g transform="translate(1330 630) scale(.8)">${tent(c, 170, 100, mix(C.clay, C.sand, 0.4))}</g>`);
    aG.add(palm(c, 1470, 628, 200) + reeds(c, 380, 650, 10, 70));
    const aW = lay(A, { par: 0.5, sh: 2 });
    aW.add(sheet().p(c.ridge(c.wave(662, [3, 1.2], [300, 90]), -900, 2500, 1700, 10, 0.6), C.lake).out());
    const aP = lay(A, { par: 0.5, sh: 5 });
    const jesus = S.puppet(aP.add(person(c, { ...CAST.jesus, holdF: `<g data-k="shA" transform="rotate(-20)">${shell(c, 14)}</g>` })));
    const DISC = [CAST.peter, CAST.andrew, CAST.john, CAST.james, L3.philip];
    const disc = DISC.map((o, i) => ({ p: S.puppet(aP.add(person(c, o))), i }));
    const kneeler = S.puppet(aP.add(person(c, { ...crowdPerson(c), hairStyle: 'short', beard: 'short', robe: C.tealRobe, pose: 'kneel' })));
    const pourA = aP.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const aF = lay(A, { par: 0.5, sh: 3 });
    aF.add(sheet().p(c.ridge(c.wave(RIV + 6, [2.5, 1], [200, 70]), -900, 2500, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.5)).x(Array.from({ length: 30 }, () => { const x = c.rr(-900, 2500); return c.cut([[x, RIV + 8], [x + 22, RIV + 5], [x + 44, RIV + 8], [x + 22, RIV + 10]], 0.2, 6); }).join(''), C.foam, 'opacity=".7"').out());
    aF.add(sheet().p(c.ridge(c.wave(SEP + 40, [4, 2], [500, 150]), -900, 2500, 1700, 12, 1), C.sand2).out() + reeds(c, 160, SEP + 60, 14, 200, C.moss) + reeds(c, 1460, SEP + 60, 12, 180, C.moss));
    const aT = lay(A, { par: 0.5, sh: 5 });
    const judea = hanging(aT, nameTag(c, tr(['ziemia', 'judzka'], ['the land', 'of Judea']), { size: 17 }), { x: 520, y: 330, len: 600 });

    /* ================= set B: Aenon near Salim, many springs ================= */
    const B = [];
    lay(B, { par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [24, 10, 3], lens: [1000, 340, 130], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup);
    const bH = lay(B, { par: 0.2, sh: 3 });
    const bh = hillsWith(c, { y: 500, amps: [22, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 24 });
    bH.add(bh.markup + town(c, { x: 1250, y: bh.fn(1250) + 8, n: 7, spread: 220, sc: 0.5 }));
    const salim = hanging(bH, `<g transform="translate(0 30)">${nameTag(c, 'Salim', { size: 16 })}</g>`, { x: 1250, y: 330, len: 600 });
    const bG = lay(B, { par: 0.5, sh: 3 });
    bG.add(sheet().p(c.ridge(c.wave(600, [5, 2], [600, 160]), -900, 2500, 1700, 12, 1), mix(C.sage3, C.sand, 0.3)).out());
    bG.add(grass(c, { x0: -900, x1: 2500, y: 600, n: 50, h: 14, color: C.moss }) + palm(c, 230, 606, 210) + palm(c, 1400, 610, 190));
    // springs and little brooks running down into the pool
    const SPR = [[380, 612, 0.9], [560, 604, 0.7], [1040, 606, 0.8], [1210, 616, 1], [1330, 626, 0.7]];
    let brooks = '';
    SPR.forEach(([x, y]) => { brooks += c.ribbon(c.qbez([x, y + 2], [lerp(x, 860, 0.5), y + 40], [lerp(x, 860, 0.8), 660], 12), (u) => 5 + u * 8); });
    bG.add(`<path d="${brooks}" fill="${C.lake}"/>`);
    const springs = SPR.map(([x, y, s], i) => ({ el: bG.add(`<g transform="translate(${x} ${y}) scale(${s})">${springRock(c, 110, 56, i % 2 ? C.rock : C.rock2)}</g>`), i }));
    springs.forEach((sp) => { sp.jet = sp.el.querySelector('.jet'); });
    const bW = lay(B, { par: 0.5, sh: 2 });
    bW.add(sheet().p(c.cut(c.ell(860, 680, 310, 48, 40), 0.8, 10), C.lake).out());
    const bP = lay(B, { par: 0.5, sh: 5 });
    const john = S.puppet(bP.add(person(c, { ...JOHN_B, holdF: `<g data-k="shB" transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const pourB = bP.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const LINE = Array.from({ length: 5 }, (_, i) => {
      const o = crowdPerson(c);
      return { i, stand: S.puppet(bP.add(person(c, o))), kneel: S.puppet(bP.add(person(c, { ...o, pose: 'kneel' }))) };
    });
    // v25: the dispute by the stone jars
    const jars = bP.add(`<g>${stoneJar(c, 70)}<g transform="translate(46 4)">${stoneJar(c, 60)}</g><g transform="translate(-44 6)">${stoneJar(c, 56)}</g></g>`);
    const jd = [0, 1].map((i) => ({ i, p: S.puppet(bP.add(person(c, { ...johnsOpts(c), hairStyle: i ? 'short' : 'wild' }))) }));
    const jew = S.puppet(bP.add(person(c, { robe: C.linen2, mantle: C.dustyBlue, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.dustyBlue, beard: 'full', skin: C.skin2, belt: C.leather })));
    const bF = lay(B, { par: 0.5, sh: 3 });
    bF.add(sheet().p(c.cut(c.arc(860, 684, 310, 48, 0, PI, 30), 0.6, 8), mix(C.lake, C.lake2, 0.45)).out());
    bF.add(sheet().p(c.ridge(c.wave(SEP + 20, [4, 2], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.sage3, 0.3)).out() + reeds(c, 300, SEP + 40, 12, 150, C.moss) + reeds(c, 1330, SEP + 40, 12, 160, C.moss) + rock(c, 1180, SEP + 50, 120, 40, C.rock2));
    const bT = lay(B, { par: 0.5, sh: 5 });
    const aenon = hanging(bT, nameTag(c, 'Ainon', { size: 20 }), { x: 580, y: 300, len: 600 });
    const much = bT.add(`<g>${word(c, tr('wiele wody', 'much water'), { size: 17 })}</g>`);
    const barsEl = hanging(bT, `<g transform="translate(0 0)">${sheet().p(c.cut(c.rect(-110, -10, 220, 14), 0.3, 6), C.soilDark).out()}<g transform="translate(0 200)">${bars(c, 220, 200, 6)}</g></g>`, { x: 800, y: 200, len: 700 });
    const notYet = bT.add(`<g>${word(c, tr('jeszcze nie', 'not yet'), { size: 20 })}</g>`);
    const argL = bT.add(`<g>${say(c, [tr('oczyszczenie!', 'purification!')], { size: 17, side: -1 })}</g>`);
    const argR = bT.add(`<g>${say(c, ['?'], { size: 26, side: 1 })}</g>`);
    const bangEl = bT.add(`<g>${bang(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1200, 160 - es(t, 0, 2) * 20, T, 1, 0.6);
      swing(cl1, 480 + Math.sin(T * 0.1) * 26, 150, T, 1.3, 0.6, 1);

      /* the change of set */
      const ch = es(t, 1.9, 2.3);
      A.forEach((L, i) => { L.shift(0, ch * (60 + i * 30)); L.fade(1 - ch); });
      B.forEach((L, i) => { L.shift(0, -(1 - ch) * (60 + i * 30)); L.fade(ch); });

      /* v22a — the road into Judea */
      const JK = [[-0.2, [-120, 610]], [0.8, [640, 640]], [1.05, [800, RIV]]];
      const [jx, jy] = kf(t, JK, ease.sine);
      const pour = bump(t, 1.35, 1.8);
      jesus.set({ x: jx, y: jy, s: 1, walk: moving(t, JK, 1) ? jx * 0.05 : undefined, armF: 20 + pour * 80 + es(t, 1.05, 1.2) * 20, armB: 10 + pour * 20, head: pour * 8, blink: blinkAt(T, 2) });
      fade(S.$('shA'), es(t, 1.0, 1.1));
      disc.forEach((d) => {
        const k = [[-0.2, [-260 - d.i * 70, 600]], [0.85 + d.i * 0.03, [[480, 405, 330, 1010, 1085][d.i], 628 + (d.i % 2) * 8]]];
        const [x, y] = kf(t, k, ease.sine);
        d.p.set({ x, y, s: 0.9, flip: d.i > 2 && t > 0.9, walk: moving(t, k, 1) ? x * 0.05 : undefined, armF: 10 + bump(t, 1.3, 1.9) * 30 * (d.i % 2), blink: blinkAt(T, d.i + 3) });
      });
      const jk = es(t, 0.3, 0.6, ease.out);
      hangAt(judea, 520, lerp(-300, 320, jk) - es(t, 1.2, 1.4) * 700, T, jk > 0 && t < 1.4 ? 1 : 0, 1.2, 0.8, 1);
      /* v22b — He stays and baptizes */
      const kin = es(t, 1.05, 1.3);
      kneeler.set({ x: lerp(1040, 900, kin), y: RIV, s: 0.95, flip: true, o: kin, head: 10 + pour * 8, armF: 50, armB: 40, blink: blinkAt(T, 4) });
      const [px, py] = hand(jx, jy, 1, false, 20 + pour * 80);
      const fall = (T * 1.6) % 1;
      vpose(pourA, { x: px + 12 + fall * 8, y: py + 8 + fall * 44, o: seg(t, 1.45, 1.5) * (1 - seg(t, 1.72, 1.78)) });

      /* v23 — John at Aenon; many springs */
      springs.forEach((sp) => vpose(sp.jet, { x: 0, y: -45, sy: (0.4 + es(t, 2.2 + sp.i * 0.05, 2.5 + sp.i * 0.05) * 0.6) * (1 + Math.sin(T * 7 + sp.i) * 0.07), o: es(t, 2.2 + sp.i * 0.05, 2.3 + sp.i * 0.05) }));
      const ak = es(t, 2.3, 2.6, ease.out), sk2 = es(t, 2.45, 2.75, ease.out);
      hangAt(aenon, 560, lerp(-300, 300, ak), T, ak > 0 && t < 4 ? 1 - es(t, 3.8, 4) : 0, 1.2, 0.8, 2);
      hangAt(salim, 1250, lerp(-300, 330, sk2), T, sk2 > 0 ? 1 : 0, 1.2, 0.8, 3);
      vpose(much, { x: 600, y: 540, s: es(t, 2.6, 2.8, ease.back), r: -3, o: seg(t, 2.6, 2.65) * (1 - es(t, 3.3, 3.5)) });
      // John pours water; a line of people come and kneel one after another
      const bap = (k) => bump(t, 3.1 + k * 0.28, 3.34 + k * 0.28);
      let pourJ = bump(t, 2.3, 2.8);
      for (let k = 0; k < 3; k++) pourJ = Math.max(pourJ, bap(k));
      const dispute = es(t, 5.0, 5.2);
      john.set({ x: 840, y: POOL, s: 1.05, armF: 30 + pourJ * 80, armB: 10 + bump(t, 4.2, 4.8) * 40, head: pourJ * 8 - bump(t, 4.1, 4.7) * 16, blink: blinkAt(T, 5) });
      const [qx, qy] = hand(840, POOL, 1.05, false, 30 + pourJ * 80);
      vpose(pourB, { x: qx + 12 + fall * 8, y: qy + 8 + fall * 44, o: pourJ > 0.4 ? 1 : 0 });
      LINE.forEach((m) => {
        const come = es(t, 2.3 + m.i * 0.18, 3.0 + m.i * 0.14);
        const slot = 945 + m.i * 80;
        const adv = m.i === 0 ? 0 : es(t, 3.3 + (m.i - 1) * 0.28, 3.45 + (m.i - 1) * 0.28) * 0;
        const x = lerp(1500 + m.i * 60, slot - adv, come);
        const kneelK = m.i < 3 ? es(t, 3.05 + m.i * 0.28, 3.12 + m.i * 0.28) * (1 - es(t, 3.38 + m.i * 0.28, 3.45 + m.i * 0.28)) : 0;
        const kx = 945;
        m.stand.set({ x: kneelK > 0.5 ? kx : x, y: POOL + 2, s: 0.95, flip: true, o: (1 - kneelK) * seg(t, 2.3, 2.35) * (1 - es(t, 4.95, 5.1)), walk: come > 0 && come < 1 ? x * 0.05 : undefined, armF: 20, blink: blinkAt(T, m.i + 6) });
        m.kneel.set({ x: kx, y: POOL + 2, s: 0.95, flip: true, o: kneelK, head: 12, armF: 50, armB: 40, blink: blinkAt(T, m.i + 6) });
      });

      /* v24 — not yet in prison */
      const bd = kf(t, [[4.05, 0], [4.4, 0.8], [4.85, 0.8], [5.0, 0]], ease.io);
      hangAt(barsEl, 840, lerp(-420, 330, bd), T, bd > 0.001 ? 1 : 0, 0.6, 0.8, 4);
      vpose(notYet, { x: 1010, y: 300, r: 4, s: es(t, 4.45, 4.6, ease.back), o: seg(t, 4.45, 4.5) * (1 - es(t, 4.95, 5.05)) });

      /* v25 — the dispute about purification */
      vpose(jars, { x: 450, y: 640, s: 0.9, o: dispute });
      jd.forEach((d) => d.p.set({ x: 540 + d.i * 70, y: 646 - d.i * 6, s: 0.9, flip: true, o: dispute, armF: 40 + bump(t, 5.2 + d.i * 0.2, 5.6 + d.i * 0.2) * 70 + Math.sin(T * 5 + d.i) * 8 * dispute, armB: 20 + d.i * 40, head: -4, blink: blinkAt(T, d.i + 9) }));
      jew.set({ x: 360, y: 648, s: 0.9, flip: false, o: dispute, armF: 40 + bump(t, 5.45, 5.9) * 70, armB: 30 + bump(t, 5.3, 5.7) * 60, head: -4, blink: blinkAt(T, 11) });
      vpose(argL, { x: 560, y: 470, s: es(t, 5.2, 5.35, ease.back) * 0.9, o: seg(t, 5.2, 5.25) });
      vpose(argR, { x: 380, y: 470, s: es(t, 5.45, 5.6, ease.back), o: seg(t, 5.45, 5.5) });
      vpose(bangEl, { x: 470, y: 400, s: es(t, 5.6, 5.75, ease.back), r: Math.sin(T * 8) * 8, o: seg(t, 5.6, 5.65) });

      S.cam.x = -es(t, 4.95, 5.3) * 140;
      S.cam.y = 20 + es(t, 4.0, 4.3) * -20 * (1 - es(t, 4.9, 5.1));
      S.cam.z = 1.05 + es(t, 4.95, 5.3) * 0.1;
    };
  },
};
