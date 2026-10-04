// Mk 4,24–25 — the measure: grain poured generously comes back pressed down and running over;
// the full jar receives more, and the last grains leave the empty bowl.
import { C, person, CAST, crowd, flock, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass } from '../../assets/nature.js';
import { bushel, grainPile, seedPath, bird, ear, sheaf } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';

const PI = Math.PI;
const FLOOR = 668;

/* ---------- local cut-outs ---------- */
/** a sack of grain, open at the top; origin at its bottom centre */
function sack(c, w = 70, h = 84, color = C.linen2, stripe = C.dustyBlue) {
  const s = sheet();
  s.p(c.cut([[-w * 0.36, -h], [w * 0.36, -h], [w * 0.44, -h * 0.8], [w * 0.52, -h * 0.35], [w * 0.46, -2], [0, 2], [-w * 0.46, -2], [-w * 0.52, -h * 0.35], [-w * 0.44, -h * 0.8]], 0.8, 7), color);
  s.p(c.cut(c.ell(0, -h, w * 0.38, 8, 16), 0.4, 5), shade(color, -0.12));
  s.p(c.cut([...c.arc(0, -h - 1, w * 0.33, 12, PI, 2 * PI, 10)], 0.6, 4), C.wheat);
  s.x(c.ribbon([[-w * 0.5, -h * 0.45], [w * 0.5, -h * 0.47]], 5) + c.ribbon([[-w * 0.49, -h * 0.34], [w * 0.5, -h * 0.35]], 3), stripe, 'opacity=".8"');
  let d = '';
  for (let i = 0; i < 8; i++) d += seedPath(c, c.rr(-w * 0.28, w * 0.28), -h - c.rr(1, 9), 2.6, c.rr(0, 3));
  s.x(d, C.wheat2);
  return s.out();
}
/** a tied sack (the little extra); origin at its bottom centre */
function tiedSack(c, color = C.sand) {
  return sheet()
    .p(c.cut([[-8, -52], [8, -52], [6, -44], [22, -30], [26, -12], [18, 0], [-18, 0], [-26, -12], [-22, -30], [-6, -44]], 0.6, 5), color)
    .p(c.cut([[-12, -58], [-2, -50], [2, -50], [12, -58], [6, -46], [-6, -46]], 0.3, 3), shade(color, -0.1))
    .p(c.ribbon([[-9, -45], [9, -45]], 4), C.terracotta).out();
}
/** grain heap sitting on a vessel's rim; scale sy to fill (origin: rim centre) */
function mound(c, w = 26, h = 18) {
  const s = sheet();
  s.p(c.cut([[-w, 2], ...c.arc(0, 2, w, h, PI, 2 * PI, 14), [w, 2]], 0.6, 4), C.wheat);
  let d = '';
  for (let i = 0; i < 12; i++) { const a = c.rr(PI * 1.1, PI * 1.9), r = c.rr(0.2, 0.9); d += seedPath(c, Math.cos(a) * w * r, 2 + Math.sin(a) * h * r, 2.6, c.rr(0, 3)); }
  s.x(d, C.wheat2, 'opacity=".8"');
  return s.out();
}
/** a hand measure: bushel + grain; origin at the bottom centre */
function measureCup(c, k) {
  return `<g data-k="${k}">${bushel(c, 66, 52)}<g data-k="${k}Fill" transform="translate(0 -52)">${mound(c, 32, 22)}</g></g>`;
}
/** a big storage jar (pithos), mouth at y -140 */
function pithos(c) {
  const s = sheet();
  s.p(c.cut([[-24, -140], [24, -140], [22, -128], [48, -106], [60, -72], [54, -32], [32, -6], [20, 0], [-20, 0], [-32, -6], [-54, -32], [-60, -72], [-48, -106], [-22, -128]], 0.7, 7), C.clay);
  s.p(c.cut([[-29, -146], [29, -146], [27, -136], [-27, -136]], 0.4, 5), shade(C.clay, -0.15));
  s.p(c.cut(c.ell(0, -146, 26, 5, 14), 0.3, 4), shade(C.clay, -0.45));
  s.x(c.ribbon(c.qbez([-58, -80], [0, -70], [58, -80], 10), 5) + c.ribbon(c.qbez([-56, -64], [0, -54], [56, -64], 10), 2.5), C.cream, 'opacity=".6"');
  let w = '';
  for (let i = 0; i < 7; i++) w += c.ribbon(c.qbez([-48 + i * 16, -100], [-44 + i * 16, -94], [-40 + i * 16, -100], 4), 2);
  s.x(w, shade(C.clay, -0.3), 'opacity=".7"');
  s.x(c.cut([[-40, -96], [-28, -110], [-26, -60], [-38, -50]], 0.4, 5), shade(C.clay, 0.25), 'opacity=".55"');
  return s.out();
}
function bowl(c) {
  return sheet().p(c.cut([[-30, -16], [30, -16], ...c.arc(0, -16, 30, 16, 0, PI, 12).slice(1, -1)], 0.4, 5), C.pot)
    .p(c.cut(c.ell(0, -16, 30, 4, 14), 0.3, 4), shade(C.pot, -0.4)).out();
}
/** falling grain stream, unit length 100 along +y; inner group shimmers */
function stream(c, k) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [0, 100]], (t) => 10 - 4 * t), C.wheat, 'opacity=".55"');
  let d = '';
  for (let i = 0; i < 36; i++) d += seedPath(c, c.rr(-5, 5), c.rr(-14, 100), 3.2, c.rr(0, 3));
  return `<g data-k="${k}" opacity="0"><g class="flow"><path d="${d}" fill="${C.wheat2}"/></g>${s.out(false)}</g>`;
}
function windCurl(c) {
  return `<path d="${c.ribbon([[-160, 0], [-40, -4], [0, -2], ...c.arc(22, -18, 22, 18, PI * 0.5, PI * 2.2, 14)], 4)}" fill="${C.cream}"/>`;
}
function stall(c, x, y, w, stripe) {
  const s = sheet();
  s.p(c.cut([[x + 6, y - 150], [x + 12, y - 150], [x + 12, y], [x + 6, y]], 0.3, 8) + c.cut([[x + w - 12, y - 150], [x + w - 6, y - 150], [x + w - 6, y], [x + w - 12, y]], 0.3, 8), C.wood2);
  const aw = [[x - 10, y - 160], [x + w + 10, y - 160], [x + w + 20, y - 118]];
  for (let xx = x + w + 20; xx > x - 20; xx -= 26) aw.push(...c.arc(xx - 13, y - 118, 13, 9, 0, PI, 4));
  s.p(c.cut(aw, 0.6, 7), C.cream);
  let st = '';
  for (let xx = x - 4; xx < x + w + 10; xx += 26) st += c.cut([[xx, y - 160], [xx + 13, y - 160], [xx + 18, y - 118], [xx + 5, y - 118]], 0.3, 5);
  s.p(st, stripe);
  s.p(c.cut([[x, y - 56], [x + w, y - 56], [x + w, y], [x, y]], 0.6, 8), C.wood3);
  s.p(c.cut([[x - 4, y - 62], [x + w + 4, y - 62], [x + w + 4, y - 54], [x - 4, y - 54]], 0.4, 8), C.wood);
  // produce
  let fruit = '';
  for (let i = 0; i < 6; i++) fruit += c.cut(c.circ(x + 20 + i * ((w - 40) / 5), y - 70, 9, 10), 0.3, 3);
  s.p(fruit, C.curtain);
  s.p(c.cut(c.arc(x + w * 0.3, y - 62, 26, 18, PI, 2 * PI, 10), 0.4, 5) + c.cut(c.arc(x + w * 0.72, y - 62, 22, 14, PI, 2 * PI, 10), 0.4, 5), C.wheat2);
  return s.out();
}

/** approximate position of a puppet's front hand */
function hand(x, y, s, flip, a, dy = 0) {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s];
}

export default {
  id: 'measure',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 24, text: 'I mówił im: «Uważajcie na to, czego słuchacie.' },
    { v: 24, cont: true, text: 'Taką samą miarą, jaką wy mierzycie, odmierzą wam i jeszcze wam dołożą.' },
    { v: 25, text: 'Bo kto ma, temu będzie dane;' },
    { v: 25, cont: true, text: 'a kto nie ma, pozbawią go i tego, co ma».' },
  ],
  cam: { x: [-280, 270], y: [0, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const SKY = ['#cadfdb', '#eee5cc', '#f7ead3'];
    const sk = sky(S, SKY);

    /* sun & clouds on strings */
    const hangL = S.layer({ par: 0.06, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1250, y: 175, len: 600 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 560, y: 170, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1010, y: 240, len: 700 });
    const cl3 = hanging(hangL, cloud(c, 110), { x: 300, y: 300, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 290, speed: 45, scale: 0.5 });

    /* far hills with a town */
    const far = S.layer({ par: 0.15, sh: 3 });
    const h1 = hillsWith(c, { y: 440, amps: [20, 8, 3], lens: [900, 320, 120], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 22 });
    far.add(band(c, { y: 400, amps: [16, 7, 3], lens: [1100, 400, 150], color: C.hillFar }).markup);
    far.add(h1.markup);
    far.add(town(c, { x: 560, y: h1.fn(560) + 12, n: 9, spread: 380, sc: 0.6 }));
    far.add(town(c, { x: 1180, y: h1.fn(1180) + 12, n: 6, spread: 260, sc: 0.55 }));

    /* the market square with a threshing floor */
    const market = S.layer({ par: 0.28, sh: 3 });
    const gfn = c.wave(538, [4, 2], [700, 200]);
    market.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out());
    market.add(sheet().p(c.cut(c.ell(800, 612, 360, 58, 40), 1, 10), C.stone2).p(c.cut(c.ell(800, 606, 340, 50, 40), 0.8, 10), C.stone).out());
    market.add(olive(c, 120, 545, 1.1) + cypress(c, 1540, 548, 170) + cypress(c, 1500, 552, 130));
    market.add(stall(c, 140, 560, 230, C.terracotta) + stall(c, 1230, 560, 230, C.sageRobe));
    market.add(grass(c, { x0: -600, x1: 2200, y: 540, fn: gfn, n: 40, h: 12, color: C.olive }));

    /* listeners in the square */
    const crowdL = S.layer({ par: 0.36, sh: 3 });
    const people = crowd(S, crowdL, [
      { y: 552, s: 0.5, n: 16, x0: 80, x1: 1520 },
      { y: 572, s: 0.58, n: 12, x0: 120, x1: 1480 },
    ]).filter((m) => Math.abs(m.x - 800) > 130);
    people.forEach((m) => { m.busy = c.chance(0.5); m.bf = c.chance(0.5); });

    /* main actors */
    const act = S.layer({ par: 0.55, sh: 6 });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const A = S.puppet(act.add(person(c, { robe: C.tealRobe, mantle: C.ochreRobe, hairStyle: 'veil', veil: C.skyVeil, skin: C.skin2, belt: C.leather })));
    const B = S.puppet(act.add(person(c, { robe: C.wheatRobe, mantle: C.clayMantle, hairStyle: 'curly', hair: C.hair3, beard: 'short', skin: C.skin3, belt: C.leather })));
    const Cp = S.puppet(act.add(person(c, { robe: C.plumRobe, mantle: C.ochre, hairStyle: 'wrap', veil: C.linen2, beard: 'full', hair: C.greyHair, skin: C.skin, belt: C.terracotta })));
    const D = S.puppet(act.add(person(c, { robe: C.rock3, mantle: C.wood3, hairStyle: 'short', hair: C.hair, beard: 'short', skin: C.skin4, pose: 'kneel' })));
    // sound rings & the ear plate for "Uważajcie"
    const rings = [];
    for (let i = 0; i < 3; i++) [1, -1].forEach((sd) => rings.push({ sd, i, el: act.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 40, 40, (sd > 0 ? 0 : PI) - 0.55, (sd > 0 ? 0 : PI) + 0.55, 10), 5)}" fill="${shade(C.ochre, 0.25)}"/></g>`) }));
    const earDisc = sheet().p(c.cut(c.circ(0, 0, 46, 32), 0.6, 5), C.cream).p(c.cut(c.circ(0, 0, 39, 28), 0.4, 5), C.halo).out();
    const earEl = hanging(act, `${earDisc}<g transform="translate(-4 0)">${ear(c, C.skin)}</g>`, { x: 930, y: 320, len: 600 });

    /* grain, measures and vessels (in front of the actors) */
    const things = S.layer({ par: 0.55, sh: 5 });
    const pileA = things.add(`<g>${grainPile(c, 110, 30)}</g>`);
    const extra = things.add(`<g>${tiedSack(c)}</g>`);
    const cupA = things.add(`<g>${measureCup(c, 'mA')}</g>`), fillA = S.$('mAFill');
    const cupB = things.add(`<g>${measureCup(c, 'mB')}</g>`), fillB = S.$('mBFill');
    // the full jar on the right
    const pileJ = things.add(`<g>${grainPile(c, 240, 44)}</g>`);
    things.add(`<g transform="translate(1010 ${FLOOR})">${pithos(c)}</g>`);
    const heapJ = things.add(`<g>${mound(c, 30, 22)}</g>`);
    const sackJ = hanging(things, `<g transform="translate(0 42)">${sack(c, 70, 84, C.sand, C.terracotta)}</g>`, { x: 975, y: -400, len: 500 });
    const sackObj = sackJ.querySelector('.obj');
    const moreSacks = [[918, 0.9, C.linen2, C.dustyBlue], [1098, 0.8, C.sand, C.sageRobe], [1076, 0.7, C.linen2, C.terracotta]].map(([x, s, col, st]) => ({ x, s, el: things.add(`<g>${sack(c, 64, 76, col, st)}</g>`) }));
    // the poor man's bowl and its last grains
    const bowlEl = things.add(`<g>${bowl(c)}</g>`);
    const last = Array.from({ length: 5 }, (_, i) => ({ i, el: things.add(`<g><path d="${seedPath(c, 0, 0, 3.4, c.rr(0, 3))}" fill="${C.wheat2}"/></g>`), dx: (i - 2) * 7 + c.rr(-2, 2), land: 560 + i * 20 + c.rr(-6, 6) }));
    const sparrows = [0, 1].map((i) => {
      const el = things.add(`<g>${bird(c, { color: shade(C.wood3, -0.15), belly: C.cream })}<path d="${seedPath(c, 28, -6, 3, 0.3)}" fill="${C.wheat2}" class="beak" opacity="0"/></g>`);
      return { el, beak: el.querySelector('.beak'), wF: el.querySelector('.wingF'), wB: el.querySelector('.wingB') };
    });
    /* streams & flying grains (no shadows) */
    const fx = S.layer({ par: 0.55, flat: true });
    const sAB = fx.add(stream(c, 'sAB')), sBA = fx.add(stream(c, 'sBA')), sJ = fx.add(stream(c, 'sJ'));
    const sOv = [0, 1, 2, 3].map((i) => fx.add(stream(c, 'sOv' + i)));
    const flow = [sAB, sBA, sJ].map((el) => el.querySelector('.flow'));
    const flowOv = sOv.map((el) => el.querySelector('.flow'));
    // overflow seeds: [vessel, side, i]
    const spill = [];
    for (let i = 0; i < 14; i++) spill.push({ v: 'A', sd: i % 2 ? 1 : -1, ph: c.rr(0, 1), dx: c.rr(8, 34), el: fx.add(`<g opacity="0"><path d="${seedPath(c, 0, 0, 3.2, c.rr(0, 3))}" fill="${C.wheat2}"/></g>`) });
    for (let i = 0; i < 18; i++) spill.push({ v: 'J', sd: i % 2 ? 1 : -1, ph: c.rr(0, 1), dx: c.rr(30, 110), el: fx.add(`<g opacity="0"><path d="${seedPath(c, 0, 0, 3.4, c.rr(0, 3))}" fill="${C.wheat2}"/></g>`) });
    const winds = [0, 1, 2].map((i) => ({ i, el: fx.add(`<g opacity="0">${windCurl(c)}</g>`) }));

    /* foreground */
    const fg = S.layer({ par: 0.9, sh: 8 });
    // phone: the foreground sacks sit further left, so the deeper camera turn doesn't show half a sack at the frame
    const FGX = S.portrait ? -170 : 0;
    fg.add(`<g transform="translate(${110 + FGX} 940) scale(1.8)">${sack(c, 70, 84, C.linen2, C.dustyBlue)}</g>`);
    fg.add(`<g transform="translate(${250 + FGX} 960) scale(1.5)">${sack(c, 64, 76, C.sand, C.terracotta)}</g>`);
    fg.add(`<g transform="translate(1470 950) scale(1.4)">${sheaf(c, 130)}</g>`);
    fg.add(`<g transform="translate(1580 960) scale(1.9)">${bushel(c, 70, 50)}</g>`);

    // pose a stream between two points; a/b are the visible fraction [start, end]
    const setStream = (el, fl, P, Q, a, b, time) => {
      const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy);
      const on = b - a;
      if (on <= 0.001) { fade(el, 0); return; }
      pose(el, { x: P[0] + dx * a, y: P[1] + dy * a, r: (Math.atan2(-dx, dy) * 180) / PI, sy: (L * on) / 100, o: 1 });
      pose(fl, { y: (time * 90) % 14 });
    };

    return (t, time) => {
      const blink = blinkAt(time);
      sk.blend(SKY, ['#d6e5dc', '#f3e9cf', '#f9eed8'], seg(t, 0, 4));
      swing(sunEl, 1250, 175, time, 1, 0.6);
      swing(cl1, 560 + Math.sin(time * 0.1) * 24, 170, time, 1.4, 0.6, 1);
      swing(cl2, 1010 + Math.sin(time * 0.12 + 2) * 24, 240, time, 1.4, 0.8, 2);
      swing(cl3, 300 + Math.sin(time * 0.09 + 4) * 20, 300, time, 1.4, 0.7, 3);
      birds(time);

      /* ---------- the crowd: busy at first, then all ears ---------- */
      const hush = es(t, 0.25, 0.5);
      people.forEach((m) => {
        const busy = m.busy && hush < 0.5;
        m.p.set({
          x: m.x + (m.busy ? Math.sin(time * 0.5 + m.seed) * 12 * (1 - hush) : 0), y: m.y, s: m.s,
          flip: busy ? m.bf : m.x > 800,
          walk: busy ? time * 3 + m.seed : undefined, amt: 0.6,
          armF: hush * (m.i % 3 === 0 ? 60 : 12) + bump(t, 2.3 + m.delay * 0.3, 2.8 + m.delay * 0.3) * 30,
          lean: hush * (m.x > 800 ? -5 : 5) * (1 - seg(t, 3.9, 4)),
          head: -hush * 5 + Math.sin(time * 0.8 + m.seed) * 2, blink: blinkAt(time, m.seed),
        });
      });

      /* ---------- Jesus ---------- */
      const point = es(t, 0.1, 0.35) * (1 - es(t, 0.95, 1.1));
      const jFlip = (t > 1.02 && t < 2.02) || t > 3.02;
      let jArm = point * 106 + Math.sin(time * 1.3) * 3 * point;
      jArm += bump(t, 1.05, 1.95) * 45 + bump(t, 2.05, 2.95) * 60 + es(t, 3.1, 3.4) * 55;
      jesus.set({ x: 800, y: 604, s: 0.95, flip: jFlip, armF: jArm, armB: 10 + point * 10, head: -point * 4 + es(t, 3.3, 3.6) * 8, blink });
      rings.forEach(({ sd, i, el }) => {
        const k = time ? ((time * 0.45 + i / 3) % 1) : (i + 1) / 3.5;
        pose(el, { x: 802 + sd * 6, y: 604 - 167 * 0.95, s: 0.7 + k * 2.2, o: point * es(t, 0.3, 0.45) * (1 - k) * 0.95 });
      });
      const earIn = es(t, 0.3, 0.55, ease.back) * (1 - es(t, 0.95, 1.15));
      if (earIn > 0.001) swing(earEl, 930, lerp(-420, 330, earIn), time, 2, 0.9); else pose(earEl, { x: 930, y: -420 });

      /* ---------- v24b: A pours for B; B pours back, pressed down and running over ---------- */
      const exitAB = es(t, 2.0, 2.35);
      const aRaise = es(t, 1.0, 1.1) * (1 - es(t, 1.44, 1.52));
      const bRaise = es(t, 1.44, 1.52) * (1 - es(t, 1.9, 2.0));
      const aTilt = es(t, 1.1, 1.18) * (1 - es(t, 1.38, 1.46));
      const bTilt = es(t, 1.5, 1.58) * (1 - es(t, 1.78, 1.86));
      const joyA = es(t, 1.78, 1.9);
      const ax = 400 - exitAB * 560, bx = 580 - exitAB * 620;
      const walking = exitAB > 0 && exitAB < 1;
      const armA = walking ? 60 : 60 + aRaise * 65 - bRaise * 15;
      const armB = walking ? 60 : 60 - aRaise * 15 + bRaise * 65;
      const bFlip = t > 0.95 && !walking && exitAB < 1;
      A.set({ x: ax, y: FLOOR, s: 1.05, flip: walking, armF: armA, armB: joyA * 120 * (1 - exitAB), head: -hush * 5 + joyA * -6, walk: walking ? ax * 0.05 : undefined, blink: blinkAt(time, 1), o: 1 - seg(t, 2.25, 2.35) });
      B.set({ x: bx, y: FLOOR, s: 1.05, flip: bFlip || walking, armF: armB, armB: 10, head: -hush * 5, walk: walking ? bx * 0.05 : undefined, blink: blinkAt(time, 2), o: 1 - seg(t, 2.25, 2.35) });
      const hA = hand(ax, FLOOR, 1.05, walking, armA), hB = hand(bx, FLOOR, 1.05, bFlip || walking, armB);
      // cups: centre sits a little below the hand; tilt around the centre
      const shake = bump(t, 1.66, 1.78) * Math.sin(t * 260) * 7;
      const press = bump(t, 1.6, 1.68);
      pose(cupA, { x: hA[0], y: hA[1] + 8 + press * 6, r: aTilt * 100 + shake, ox: 0, oy: -26, o: 1 - seg(t, 2.25, 2.35) });
      pose(cupB, { x: hB[0], y: hB[1] + 8, r: -bTilt * 100, ox: 0, oy: -26, o: 1 - seg(t, 2.25, 2.35) });
      const pourAB = es(t, 1.16, 1.38), pourBA = es(t, 1.56, 1.76);
      const lvlA = t < 1.5 ? 1 - pourAB * 0.85 : 0.15 + pourBA * 1.25 - press * 0.35;
      const lvlB = t < 1.5 ? 0.15 + pourAB * 0.85 : 1 - pourBA * 0.85;
      pose(fillA, { x: 0, y: -52, sy: Math.max(0.12, lvlA), sx: 1 + Math.max(0, lvlA - 1) * 0.4 });
      pose(fillB, { x: 0, y: -52, sy: Math.max(0.12, lvlB) });
      // streams
      const lipA = [hA[0] + 22, hA[1] + 38], rimB = [hB[0], hB[1] - 20];
      setStream(sAB, flow[0], lipA, rimB, seg(t, 1.34, 1.4), seg(t, 1.15, 1.2), time);
      const lipB = [hB[0] - 22, hB[1] + 38], rimA = [hA[0], hA[1] - 20];
      setStream(sBA, flow[1], lipB, rimA, seg(t, 1.74, 1.8), seg(t, 1.55, 1.6), time);
      // running over: grain falls from the rim and heaps at her feet
      const over = seg(t, 1.66, 1.72) * (1 - seg(t, 1.95, 2.0));
      const pileGrow = es(t, 1.66, 1.98) * (1 - seg(t, 2.1, 2.3));
      pose(pileA, { x: hA[0] + 6, y: FLOOR, s: pileGrow * 1.0, sy: pileGrow, o: pileGrow > 0.01 ? 1 : 0 });
      [-1, 1].forEach((sd, i) => setStream(sOv[i], flowOv[i], [hA[0] + sd * 30, hA[1] - 18], [hA[0] + sd * 46, FLOOR - 8], seg(t, 1.94, 2.0), seg(t, 1.66, 1.74), time));
      // the extra: a little sack tossed on top
      const toss = es(t, 1.82, 1.96);
      pose(extra, { x: lerp(hB[0], hA[0] + 40, toss), y: lerp(hB[1] + 30, FLOOR + 2, toss) - Math.sin(toss * PI) * 90 + bump(t, 1.96, 2.0) * -6, r: (1 - toss) * -40, o: seg(t, 1.8, 1.83) * (1 - seg(t, 2.1, 2.3)) });

      /* ---------- v25a: the full jar receives more ---------- */
      const sackIn = es(t, 2.02, 2.18, ease.out) * (1 - es(t, 2.8, 2.98));
      const sackTip = es(t, 2.16, 2.26) * (1 - es(t, 2.7, 2.8));
      if (sackIn > 0.001) swing(sackJ, 975, lerp(-420, 330, sackIn), time, 1.2 * (1 - sackTip), 0.9); else pose(sackJ, { x: 975, y: -420 });
      pose(sackObj, { r: sackTip * 125 });
      const pourJ = es(t, 2.24, 2.7);
      const sy = lerp(-420, 330, sackIn), th = (sackTip * 125 * PI) / 180;
      const mouth = [975 + Math.sin(th) * 42, sy - Math.cos(th) * 42];
      setStream(sJ, flow[2], mouth, [1010, FLOOR - 146], seg(t, 2.66, 2.74), seg(t, 2.24, 2.3), time);
      const heapG = 1 + pourJ * 1.2;
      pose(heapJ, { x: 1010, y: FLOOR - 146, sx: 1 + pourJ * 0.3, sy: heapG });
      const overJ = seg(t, 2.36, 2.42) * (1 - seg(t, 2.72, 2.8));
      const pj = es(t, 2.36, 2.8);
      [-1, 1].forEach((sd, i) => setStream(sOv[2 + i], flowOv[2 + i], [1010 + sd * 28, FLOOR - 150], [1010 + sd * 66, FLOOR - 12], seg(t, 2.74, 2.8), seg(t, 2.36, 2.44), time));
      pose(pileJ, { x: 1010, y: FLOOR + 4, s: 0.3 + pj * 0.7, sy: pj, o: pj > 0.01 ? 1 : 0 });
      moreSacks.forEach((m, i) => {
        const p = es(t, 2.52 + i * 0.1, 2.68 + i * 0.1, ease.back);
        pose(m.el, { x: m.x, y: FLOOR + 2 - (1 - p) * 60, s: m.s * p, o: seg(t, 2.52 + i * 0.1, 2.55 + i * 0.1) });
      });
      const glad = es(t, 2.3, 2.5);
      Cp.set({ x: S.portrait ? 1110 : 1170, y: FLOOR, s: 1.05, flip: true, armF: 30 + glad * 70 + bump(t, 2.5, 2.7) * 30, armB: glad * 110, head: -hush * 4 - glad * 6, blink: blinkAt(time, 3), lean: -hush * 4 });

      // overflow seeds (A's cup and the jar)
      spill.forEach((sp, i) => {
        const on = sp.v === 'A' ? over : overJ;
        if (on <= 0) { fade(sp.el, 0); return; }
        const k = time ? ((time * 0.9 + sp.ph) % 1) : sp.ph;
        const top = sp.v === 'A' ? [hA[0] + sp.sd * 26, hA[1] - 18] : [1010 + sp.sd * 28, FLOOR - 150 - 20 * heapG * 0.5];
        const x = top[0] + sp.sd * sp.dx * k, y = top[1] + k * k * (FLOOR - top[1]);
        pose(sp.el, { x, y, r: k * 300, o: on * (k < 0.9 ? 1 : (1 - k) * 10) });
      });

      /* ---------- v25b: the empty bowl ---------- */
      const dIn = es(t, 2.9, 3.08, ease.out);
      const sad = es(t, 3.55, 3.85);
      const showEmpty = es(t, 3.72, 3.86);
      D.set({ x: 470, y: FLOOR + (1 - dIn) * 280, s: 1.05, o: seg(t, 2.88, 2.95), armF: 50 + showEmpty * 18, armB: 10, head: 8 * sad - bump(t, 3.15, 3.4) * 6, lean: -bump(t, 3.1, 3.4) * 3, blink: blinkAt(time, 4) });
      const hD = hand(470, FLOOR + (1 - dIn) * 280, 1.05, false, 50 + showEmpty * 18, 46);
      pose(bowlEl, { x: hD[0] + 6, y: hD[1] + 10, r: showEmpty * 35, ox: 0, oy: -8, o: seg(t, 2.88, 2.95) });
      const wind = es(t, 3.08, 3.45);
      winds.forEach((w, i) => {
        const k = seg(t, 3.08 + i * 0.07, 3.5 + i * 0.07);
        pose(w.el, { x: lerp(120, 720, k), y: 470 + i * 26 + Math.sin(k * 6 + i) * 8, s: 0.55 + i * 0.1, o: bump(t, 3.08 + i * 0.07, 3.5 + i * 0.07) * 0.8 });
      });
      // the last grains blow out and are picked up by sparrows
      last.forEach((g) => {
        const a = 3.18 + g.i * 0.04;
        const f = es(t, a, a + 0.14);
        const start = [hD[0] + 6 + g.dx, hD[1] - 2];
        const x = lerp(start[0], g.land, f), y = lerp(start[1], FLOOR - 4, f) - Math.sin(f * PI) * 40;
        const taken = g.i < 2 ? seg(t, 3.66, 3.7) : g.i < 4 ? seg(t, 3.72, 3.76) : seg(t, 3.78, 3.82);
        pose(g.el, { x, y, r: f * 400, o: seg(t, 2.95, 3.0) * (1 - taken) });
      });
      sparrows.forEach((sp, i) => {
        const land = [595 + i * 50, FLOOR - 4];
        const inK = es(t, 3.4 + i * 0.05, 3.58 + i * 0.05, ease.out);
        const outK = es(t, 3.7 + i * 0.06, 3.98, ease.in);
        const x = lerp(lerp(160 - i * 60, land[0], inK), -120 - i * 60, outK);
        const y = lerp(lerp(180 + i * 40, land[1], inK), 120 + i * 30, outK) - bump(t, 3.58, 3.7) * Math.abs(Math.sin(time * 9 + i)) * 4;
        const flying = (inK > 0 && inK < 1) || outK > 0;
        pose(sp.el, { x, y, s: 0.9, sx: outK > 0 ? -1 : 1, r: inK < 1 ? 14 * (1 - inK) : bump(t, 3.58, 3.7) * 18 * Math.max(0, Math.sin(time * 8 + i)), o: seg(t, 3.38, 3.42) * (1 - seg(t, 3.94, 3.99)) });
        const f = flying ? Math.sin(time * 16 + i) * 30 : -62;
        pose(sp.wF, { x: -2, y: -5, r: f });
        pose(sp.wB, { x: -2, y: -6, r: f * 0.8 });
        fade(sp.beak, seg(t, 3.66 + i * 0.06, 3.7 + i * 0.06));
      });

      /* ---------- camera ---------- */
      const toA = es(t, 0.95, 1.2) * (1 - es(t, 1.95, 2.2)), toJ = es(t, 1.95, 2.2) * (1 - es(t, 2.9, 3.15)), toD = es(t, 2.9, 3.15) * (1 - es(t, 3.88, 4.1));
      const near = toA + toJ + toD;
      // phone: the camera goes further, so the pourer, the man with the full jar and the poor man stay on screen
      const PH = S.portrait;
      S.cam.x = -toA * (PH ? 270 : 140) + toJ * (PH ? 260 : 130) - toD * (PH ? 210 : 140);
      S.cam.z = 1 + es(t, 0.05, 0.4) * 0.08 * (1 - es(t, 0.9, 1.2)) + near * 0.2;
      S.cam.y = near * 36 + es(t, 0.05, 0.4) * 10 * (1 - es(t, 0.9, 1.2));
    };
  },
};
