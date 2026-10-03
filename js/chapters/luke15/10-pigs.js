// Łk 15,15–17 — the far country in the famine: a dusty sky, dead trees, a rich man's house with a colonnade on the
// left, his fields on the right with a rail fence, a stone trough and his pigs. "He went and hired himself out to
// one of the citizens of that country": the ragged young man comes to the rich man's door and bows low; the
// citizen, sleek in plum and gold, points him to the fields. "…who sent him into his fields to feed pigs": with a
// staff in his hand he goes out among the pigs. "He longed to fill his belly with the pods the pigs ate": he tips a
// basket of pods into the trough, the pigs crowd round it, and he crouches and reaches for the pods himself; "but
// no one gave him any": two servants of the house pass by with bread and a basket, looking away from his empty
// hand. "Then he came to himself and said": evening falls; he sits on the trough's edge with his head in his hands
// — and lifts it, a small light kindling in him and the evening star in the sky. "How many of my father's hired
// servants have bread enough, and I am dying of hunger here!": a thought-cloud opens over him: his father's
// courtyard, the hired men at a table heaped with loaves — and he looks at his own empty bowl.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { band, rock, sun } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { flap } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import {
  YOUNGER_RAGS, CITIZEN, SERVANTS, FATHER, pig, herd, trough, podHeap, bowl, loaf, deadTree, cracks, skyFade, hangOff, glow, sparkle, staff, figure, pose3, withFace, faceBits,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, DUST, DUSK, STRING,
  ragsMarkup,
} from './lib.js';
import { basket } from '../mark6/lib.js';

const GY = 706, TX = 960;
const DOORX = 430;

/** the rich man's house with a colonnade (origin: its base at x 0 = left end) */
function richHouse(c) {
  const s = sheet();
  const W = 330, H = 290;
  s.p(c.cut([[0, -H], [W, -H], [W, 4], [0, 4]], 0.5, 10), mix(C.plaster, C.ochre, 0.18));
  s.p(c.cut([[-14, -H - 30], [W + 14, -H - 30], [W + 14, -H + 6], [-14, -H + 6]], 0.4, 10), mix(C.plumRobe, C.indigo, 0.2));
  s.p(c.cut([[-6, -H - 46], [W + 6, -H - 46], [W + 6, -H - 28], [-6, -H - 28]], 0.4, 10), C.sun);
  let cols = '';
  for (let x = 20; x < W; x += 58) cols += c.cut([[x, 0], [x + 2, -H + 10], [x + 20, -H + 10], [x + 22, 0]], 0.3, 6);
  s.p(cols, mix(C.linen, C.stone, 0.2));
  let caps = '';
  for (let x = 20; x < W; x += 58) caps += c.cut(c.rect(x - 4, -H + 6, 30, 10), 0.2, 3) + c.cut(c.rect(x - 4, -8, 30, 10), 0.2, 3);
  s.p(caps, C.stone2);
  return s.out();
}

/** his father's courtyard with the hired men at a table heaped with bread, for the thought cloud (cloud coords) */
function plenty(c, id) {
  const w = 300, h = 170;
  const cloudPts = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * PI * 2, a2 = ((i + 1) / 12) * PI * 2;
    const x1 = Math.cos(a) * w / 2, y1 = Math.sin(a) * h / 2, x2 = Math.cos(a2) * w / 2, y2 = Math.sin(a2) * h / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(my, mx);
    cloudPts.push(...c.qbez([x1, y1], [mx + Math.cos(ang) * 22, my + Math.sin(ang) * 22], [x2, y2], 5).slice(0, -1));
  }
  const s = sheet().p(c.cut(cloudPts, 0.4, 6), C.cream);
  const oc = makeCutter('lk15-plenty');
  const inner = `<rect x="-160" y="-100" width="320" height="200" fill="${mix(C.skyBlue, C.cream, 0.4)}"/>`
    + sheet().p(oc.cut([[-40, -70], [60, -70], [60, 60], [-40, 60]], 0.4, 6), mix(C.plaster, C.peach, 0.14)).p(oc.cut([[-10, 60], [-10, 0], ...oc.arc(10, 0, 20, 20, PI, 2 * PI, 8), [30, 60]], 0.3, 4), mix(C.wood2, C.soilDark, 0.3)).out()
    + sheet().p(oc.cut([[-160, 56], [160, 56], [160, 100], [-160, 100]], 0.4, 8), mix(C.hillNear, C.sand2, 0.35)).out()
    + pose3(oc, [
      { x: -110, y: 72, s: 0.34, flip: false, armF: 70, armB: 20, head: -4, o: { ...SERVANTS[0], pose: 'sit' } },
      { x: -60, y: 72, s: 0.34, flip: false, armF: 90, armB: 10, head: 0, o: { ...SERVANTS[3], pose: 'sit' } },
      { x: 104, y: 72, s: 0.34, flip: true, armF: 80, armB: 20, head: 4, o: { ...SERVANTS[1], pose: 'sit' } },
    ])
    + `<g transform="translate(0 76)">${sheet().p(oc.cut(oc.rect(-80, -16, 160, 8), 0.3, 5), C.wood).p(oc.cut(oc.rect(-70, -8, 8, 26), 0.2, 3) + oc.cut(oc.rect(62, -8, 8, 26), 0.2, 3), C.wood2).out()}${[-56, -30, -4, 22, 48, -42, -16, 10, 36].map((x, i) => `<g transform="translate(${x} ${i < 5 ? -24 : -38}) scale(.8)">${loaf(oc, 12)}</g>`).join('')}</g>`;
  return `${s.out()}<clipPath id="${id}"><ellipse rx="${w / 2 - 6}" ry="${h / 2 - 4}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
}

export default {
  id: 'lk15-pigs',
  parable: true,
  beats: [
    { v: 15, text: 'Poszedł i przystał do jednego z obywateli owej krainy,' },
    { v: 15, cont: true, text: 'a ten posłał go na swoje pola żeby pasł świnie.' },
    { v: 16, text: 'Pragnął on napełnić swój żołądek strąkami, którymi żywiły się świnie,' },
    { v: 16, cont: true, text: 'lecz nikt mu ich nie dawał.' },
    { v: 17, text: 'Wtedy zastanowił się i rzekł:' },
    { v: 17, cont: true, text: 'Iluż to najemników mojego ojca ma pod dostatkiem chleba, a ja tu z głodu ginę.' },
  ],
  cam: { x: [-280, 160], y: [-40, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const skD = S.layer({ par: 0, sky: true });
    const did = S.id('dust');
    S.defs(`<linearGradient id="${did}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.min(0, S.view().y0).toFixed(0)}" x2="0" y2="760"><stop offset="0" stop-color="${DUST[0]}"/><stop offset=".55" stop-color="${DUST[1]}"/><stop offset="1" stop-color="${DUST[2]}"/></linearGradient>`);
    skD.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${did})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const skE = skyFade(S, DUSK, skD, 'dusk');
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const star = hangL.add(`<g opacity="0">${glow(50, 0.8)}${sparkle(c, 14)}</g>`);
    const sunG = hangL.add(`<g>${glow(240, 0.7)}</g>`);
    const sn = hangOff(hangL, sun(c, 46, { rays: mix(C.sun, C.cream, 0.3), disc: mix(C.sun, C.cream, 0.5), inner: mix(C.cream, C.sun, 0.2) }));
    const crows = [0, 1].map((i) => ({ i, el: hangL.add(`<g>${bird(c, { color: C.crow, belly: C.bird })}</g>`) }));
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [20, 8, 3], lens: [1000, 340, 120], color: mix(C.dune, C.hillFar, 0.4), x0: -1400, x1: 3000 }).markup);
    const far = S.layer({ par: 0.2, sh: 3 });
    far.add(band(c, { y: 520, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.dune, C.sand2, 0.5), x0: -1400, x1: 3000 }).markup);
    far.add(`<g transform="translate(1500 540)">${deadTree(c, 160, mix(C.wood2, C.rock3, 0.3))}</g><g transform="translate(40 540)">${deadTree(c, 130, mix(C.wood2, C.rock3, 0.3))}</g>`);
    const ground = S.layer({ par: 0.36, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, GY - 30], [3000, GY - 30], [3000, 1800], [-1400, 1800]], 0.8, 16), mix(C.sand2, C.dune, 0.4)).out() + cracks(c, 600, 2400, GY - 20, 1000, 40, mix(C.soil, C.dune, 0.4)));
    /* the rich man's house */
    const houseL = S.layer({ par: 0.36, sh: 4 });
    houseL.add(`<g transform="translate(250 ${GY})">${richHouse(c)}</g>`);
    houseL.add(sheet().p(c.cut([[DOORX - 34, GY], [DOORX - 34, GY - 140], ...c.arc(DOORX, GY - 140, 34, 30, PI, 2 * PI, 8), [DOORX + 34, GY]], 0.3, 5), mix(C.wood2, C.plumRobe, 0.3)).out());
    /* the field: a rail fence behind, the trough, the pigs */
    const field = S.layer({ par: 0.36, sh: 4 });
    const fe = sheet();
    let posts = '', rails = '';
    for (let x = 640; x <= 1500; x += 86) posts += c.cut(c.rect(x - 5, GY - 96, 10, 90), 0.3, 4);
    rails += c.ribbon([[634, GY - 80], [1506, GY - 84]], 7) + c.ribbon([[634, GY - 46], [1506, GY - 48]], 7);
    fe.p(posts, mix(C.wood, C.rock3, 0.3)).p(rails, mix(C.wood3, C.rock3, 0.3));
    field.add(fe.out());
    field.sprite(`<g>${herd(c, 7, 200, 30, { sc: 1.15 })}</g>`, 1240, GY - 16);
    field.sprite(`<g>${herd(c, 5, 130, 20, { sc: 1.1 })}</g>`, 730, GY - 20);
    const pigs = [[1080, -1], [860, 1], [1110, -1], [830, 1]].map(([x, d], i) => ({ i, x, d, el: field.add(`<g>${pig(c, { down: i % 2 === 0 })}</g>`) }));
    const troughEl = field.add(`<g transform="translate(${TX} ${GY})">${trough(c, 140, mix(C.stone2, C.rock2, 0.3))}</g>`);
    const pods = field.add(`<g opacity="0">${podHeap(c, 110, 18)}</g>`);

    /* people */
    const act = S.layer({ par: 0.38, sh: 5 });
    const citizen = S.puppet(act.add(person(c, CITIZEN)));
    const beg = S.puppet(act.add(withFace(ragsMarkup(c), faceBits(c))));
    const herdP = S.puppet(act.add(ragsMarkup(c, { holdF: staff(c, 190, 30) })));
    const carry = S.puppet(act.add(ragsMarkup(c, { holdF: `<g transform="rotate(-60) translate(0 10)">${basket(c, { w: 60, h: 36 })}${sheet().p(c.cut(c.blob(0, -40, 26, 10, 10, 0.2), 0.3, 4), mix(C.wood2, C.soil, 0.3)).out()}</g>` })));
    const reach = S.puppet(act.add(withFace(ragsMarkup(c, { pose: 'kneel' }), faceBits(c))));
    const reachSad = reach.el.querySelector('[data-part="sad"]');
    const sitP = S.puppet(act.add(withFace(ragsMarkup(c, { pose: 'sit' }), faceBits(c))));
    const sitSad = sitP.el.querySelector('[data-part="sad"]');
    const passers = [
      { o: SERVANTS[3], hold: `<g transform="rotate(-80) translate(0 6)">${basket(c, { w: 56, h: 34, full: true })}</g>`, t0: 3.02 },
      { o: SERVANTS[2], hold: `<g transform="translate(0 6)">${loaf(c, 14)}</g>`, t0: 3.1 },
    ].map((p, i) => ({ ...p, i, p: S.puppet(act.add(person(c, { ...p.o, holdF: p.hold }))) }));
    const bowlE = act.add(`<g opacity="0">${bowl(c, { food: null, color: mix(C.pot, C.rock3, 0.3) })}</g>`);
    /* the light kindling in him (behind), the thought */
    const inner = S.layer({ par: 0.37, sh: 0, flat: true });
    inner.el.parentNode.insertBefore(inner.el, act.el);
    const kindle = inner.add(`<g opacity="0">${glow(120, 0.8)}</g>`);
    const thinkL = S.layer({ par: 0.3, sh: 6 });
    const cloudEl = thinkL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-86" stroke="${STRING}" stroke-width="1.2" fill="none"/>${plenty(c, S.id('plenty'))}</g>`);
    const dots = [0, 1, 2].map((i) => thinkL.add(`<g opacity="0"><path d="${c.cut(c.circ(0, 0, 6 + i * 3, 10), 0.2, 3)}" fill="${C.cream}"/></g>`));

    const PH = S.portrait;
    return (t, time) => {
      const T = time;
      const eve = es(t, 4.0, 4.6);
      pose(sn, { x: 1200, y: lerp(150, 420, eve), r: T ? Math.sin(T * 0.5) : 0, o: 1 - eve });
      pose(sunG, { x: 1200, y: lerp(150, 420, eve), o: 0.7 * (1 - eve) });
      crows.forEach((cw) => {
        const a = (T ? T * 0.4 : 0) + cw.i * PI;
        pose(cw.el, { x: 980 + Math.cos(a) * 160, y: 230 + Math.sin(a) * 40, sx: Math.sin(a) > 0 ? -0.8 : 0.8, s: 0.8, o: 1 - eve });
        flap(cw.el, T + cw.i, 22, 7);
      });
      skE.fade(eve);
      pose(star, { x: 1180, y: 170, s: 0.8 + (T ? Math.sin(T * 2) * 0.1 : 0), o: es(t, 4.4, 4.7) });

      /* v15a — at the rich man's door; he bows; the citizen points to the fields */
      const BK = [[0.04, 1300], [0.42, 560]];
      const bx = kf(t, BK);
      const bow = es(t, 0.44, 0.58);
      const point = es(t, 0.6, 0.76) * (1 - es(t, 1.4, 1.6));
      citizen.set({ x: DOORX + 20, y: GY, s: 1.04, o: PH ? 1 - seg(t, 2.0, 2.05) : 1,   // phone: gone in while off-screen, no sliver at the edge later
        armF: 20 + point * 80, armB: 10, head: -point * 4, blink: blinkAt(T, 3) });
      beg.set({ x: bx, y: GY, s: 1.0, flip: true, o: 1 - seg(t, 1.04, 1.08), walk: moving(t, BK) ? bx * 0.06 : undefined, armF: 20 + bow * 40, armB: 10 + bow * 40, lean: -bow * 14, head: bow * 16, blink: blinkAt(T, 1) });
      fade(beg.el.querySelector('[data-part="sad"]'), 1);

      /* v15b — to the fields with a staff, among the pigs */
      const HK = [[1.08, 560], [1.6, 880]];
      const hx = kf(t, HK);
      herdP.set({ x: hx, y: GY, s: 1.0, o: seg(t, 1.04, 1.08) * (1 - seg(t, 1.98, 2.02)), walk: moving(t, HK) ? hx * 0.06 : undefined, armF: 40 + es(t, 1.62, 1.8) * 30, armB: 10, head: 6, blink: blinkAt(T, 1) });

      /* v16a — pods tipped into the trough; the pigs crowd in; he reaches for them himself */
      const tip = es(t, 2.12, 2.32);
      carry.set({ x: TX - 110, y: GY, s: 1.0, o: seg(t, 1.98, 2.02) * (1 - seg(t, 2.44, 2.48)), armF: 50 + tip * 50, armB: 20, lean: tip * 8, head: 10, blink: blinkAt(T, 1) });
      pose(pods, { x: TX, y: GY - 20, o: es(t, 2.2, 2.34), s: 1 });
      pigs.forEach((p) => {
        const k = es(t, 2.24 + p.i * 0.04, 2.5 + p.i * 0.04);
        const tx = TX + (p.d < 0 ? 1 : -1) * (80 + (p.i >> 1) * 30);
        pose(p.el, { x: lerp(p.x, tx, k), y: GY - 4 + (p.i >> 1) * 6, sx: p.d, s: 1.6, o: 1 });
      });
      const rk = es(t, 2.5, 2.75) * (1 - es(t, 3.3, 3.5) * 0.4);
      const kneelO = seg(t, 2.44, 2.48) * (1 - seg(t, 3.96, 4.0));
      reach.set({ x: TX - 104, y: GY, s: 1.0, o: kneelO, armF: 40 + rk * 50, armB: 10 + es(t, 3.3, 3.5) * 70, lean: rk * 10, head: 12 - es(t, 3.2, 3.4) * 24, blink: blinkAt(T, 1) });
      fade(reachSad, es(t, 3.3, 3.5));

      /* v16b — no one gave him any: two of the house pass by, looking away */
      passers.forEach((p) => {
        const K = PH ? [[p.t0, 300], [p.t0 + 0.92, 1240]] : [[p.t0, 300], [p.t0 + 0.9, 1300]];   // phone: still inside the screen at x.75
        const x = kf(t, K, (u) => u);
        p.p.set({ x, y: GY, s: 0.96, o: seg(t, p.t0, p.t0 + 0.03) * (1 - seg(t, p.t0 + 0.88, p.t0 + 0.9)), walk: moving(t, K) ? x * 0.06 : undefined, armF: p.i ? 50 : 150, armB: 10, head: p.i ? -10 : -6, blink: blinkAt(T, p.i + 5) });
      });

      /* v17a — evening: he sits, head in hands, and comes to himself */
      const lift = es(t, 4.4, 4.6);
      sitP.set({ x: TX - 110, y: GY, s: 1.0, o: seg(t, 3.96, 4.0), armF: 150 - lift * 110, armB: 150 - lift * 120, head: 22 - lift * 34, lean: 8 - lift * 8, blink: blinkAt(T, 1) });
      fade(sitSad, 1 - lift * 0.6);
      const [kx, ky] = headP(TX - 110, GY, 1.0, false, 'sit');
      pose(kindle, { x: kx, y: ky, s: 0.8 + es(t, 4.4, 4.8) * 0.5, o: es(t, 4.42, 4.7) });

      /* v17b — the thought: his father's hired men with bread to spare; his own empty bowl */
      const ck = es(t, 5.06, 5.4, ease.out);
      pose(cloudEl, { x: 780, y: lerp(-1500, 290, ck), s: 1.3, r: T ? Math.sin(T * 0.7) * 0.6 * ck : 0 });
      dots.forEach((d, i) => pose(d, { x: kx + 20 + i * 18, y: ky - 50 - i * 34, o: es(t, 5.0 + i * 0.06, 5.1 + i * 0.06) }));
      pose(bowlE, { x: TX - 30, y: GY - 6, s: 1.4, o: es(t, 5.3, 5.45) });

      S.cam.x = PH ? kf(t, [[0, -270], [0.9, -260], [1.3, 60], [2.0, 100], [3.9, 100], [4.4, 60], [5.2, 20]]) : kf(t, [[0, -150], [0.9, -140], [1.3, 60], [2.0, 100], [3.9, 100], [4.4, 60], [5.2, 20]]);
      S.cam.y = kf(t, [[0, 30], [4.4, 30], [5.3, -20]]);
      S.cam.z = kf(t, [[0, 1.06], [1.3, 1.04], [2.4, 1.1], [3.9, 1.08], [5.3, 1.02]]);
    };
  },
};
