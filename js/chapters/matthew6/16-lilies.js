// Mt 6,28–30 — a meadow on the hillside in spring. "Why are you anxious about clothing?": a man holds up his old
// cloak, worn through, a worry-cloud over him. "Consider the lilies of the field, how they grow": all across the meadow
// red and white lilies rise and open, and among them a spindle and a distaff lie idle — "they do not toil or spin".
// "Even Solomon in all his glory was not dressed like one of these": Solomon on his golden throne is let down on a
// painted plate, and beside him one lily grows tall, brighter than all his gold. "The grass of the field, which is here
// today and tomorrow is thrown into the oven": the day-discs hang, "today" and "tomorrow"; a woman gathers an armful of
// dry grass and throws it into her bread-oven, which flares. "Will He not much more clothe you, you of little faith?":
// a new mantle comes down on its string and settles, glowing, on the man's shoulders.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SPRING, QUIET, womanOf, worryCloud, tunic, oven, dayDisc, plateBoard, pose3, addToHead, crown, throne, handAt, headAt, tr, PI } from './lib.js';
import { cloak } from '../mark2/lib.js';

const GY = 704;
const MX0 = 520;                   // the man with his cloak
const OX0 = 1110;                  // the oven
const PX = 720, PY = 150, PW = 300, PH = 250;   // Solomon's plate
const LILX = 900;                  // the great lily

/** a lily of the field (origin: foot of the stem); h tall; col petals */
function lily(c, h = 70, col = C.roseRobe, { big = false } = {}) {
  const s = sheet();
  const lean = c.rr(-6, 6);
  s.p(c.ribbon(c.qbez([0, 0], [lean * 0.3, -h * 0.5], [lean, -h], 8), (u) => (big ? 5 : 2.8) - u * (big ? 2 : 1.2)), C.moss);
  const lw = big ? 60 : h;
  s.p(c.cut([[0, -h * 0.3], [-lw * 0.22, -h * 0.3 - lw * 0.2], [-lw * 0.3, -h * 0.3 - lw * 0.14], [-lw * 0.04, -h * 0.3 + lw * 0.04]], 0.3, 4) + c.cut([[0, -h * 0.45], [lw * 0.24, -h * 0.45 - lw * 0.19], [lw * 0.3, -h * 0.45 - lw * 0.13], [lw * 0.04, -h * 0.45 + lw * 0.05]], 0.3, 4), C.leaf);
  const r = big ? 30 : h * 0.2;
  const bx = lean, by = -h;
  let pet = '';
  for (let i = 0; i < 6; i++) {
    const a = -PI / 2 + ((i - 2.5) / 5) * PI * 1.15;
    pet += c.cut([[bx, by], [bx + Math.cos(a - 0.22) * r * 0.7, by + Math.sin(a - 0.22) * r * 0.7], [bx + Math.cos(a) * r, by + Math.sin(a) * r], [bx + Math.cos(a + 0.22) * r * 0.7, by + Math.sin(a + 0.22) * r * 0.7]], 0.2, 3);
  }
  s.p(pet, col);
  s.p(c.cut(c.circ(bx, by - r * 0.1, r * 0.2, 8), 0.2, 2), C.sun);
  return s.out();
}
function spindle(c) {
  const s = sheet();
  s.p(c.ribbon([[-40, 0], [40, -4]], 3), C.wood3);
  s.p(c.cut(c.ell(-6, -2, 12, 9, 12), 0.3, 3), C.linen2);
  s.p(c.cut(c.ell(34, -4, 5, 7, 8), 0.2, 3), C.wood2);
  s.p(c.ribbon([[50, 2], [120, -6]], 3), C.wood2);
  s.p(c.cut(c.blob(126, -8, 16, 11, 10, 0.3), 0.8, 4), C.linen);
  return s.out();
}
/** a new mantle (origin: its neck) */
function mantle(c, col = mix(C.jesusMantle, C.dustyBlue, 0.55)) {
  return sheet().p(c.cut([[-26, 0], [26, 0], [44, 30], [50, 140], [-50, 140], [-44, 30]], 0.8, 7), col).x(c.ribbon([[-30, 20], [-36, 130]], 3) + c.ribbon([[20, 20], [30, 130]], 3), shade(col, -0.18), 'opacity=".5"').p(c.ribbon([[-46, 128], [46, 128]], 6), C.sun).out();
}

export default {
  id: 'mt6-lilies',
  beats: [
    { v: 28, text: 'A o odzienie czemu się zbytnio troszczycie?' },
    { v: 28, cont: true, text: 'Przypatrzcie się liliom na polu, jak rosną: nie pracują ani przędą.' },
    { v: 29 },
    { v: 30, text: 'Jeśli więc ziele na polu, które dziś jest, a jutro do pieca będzie wrzucone, Bóg tak przyodziewa,' },
    { v: 30, cont: true, text: 'to czyż nie tym bardziej was, małej wiary?' },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the man with his cloak, the oven and "tomorrow" come inside the screen, clear of the edge and the thread
    const MX = S.portrait ? 565 : MX0, OX = S.portrait ? 1050 : OX0, TMX = S.portrait ? 1020 : 1060;
    sky(S, SPRING);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 140, len: 900 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [14, 6, 3], lens: [1000, 340, 120], color: C.hillFar }).markup);
    const hl = S.layer({ par: 0.16, sh: 3 });
    hl.add(hillsWith(c, { y: 520, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18 }).markup);
    const meadow = S.layer({ par: 0.4, sh: 3 });
    const mfn = c.wave(610, [8, 3], [700, 200]);
    meadow.add(sheet().p(c.ridge(mfn, -1100, 2700, 1900, 14, 1), mix(C.hillNear, C.sage2, 0.3)).out() + olive(c, 1330, 640, 0.9) + grass(c, { x0: -800, x1: 2400, y: 620, fn: mfn, n: 60, h: 14, color: C.moss }));
    meadow.add(`<g transform="translate(${OX} ${GY - 12})">${oven(c)}</g>`);
    const flare = meadow.add(`<g><circle r="80" fill="url(#warm-glow)"/><path d="M-20 0C-26 -20 -10 -36 -4 -60C4 -40 16 -30 20 0Z" fill="${C.sunDeep}"/><path d="M-10 0C-12 -14 -4 -24 0 -40C4 -26 10 -18 10 0Z" fill="${C.lampFlame}"/></g>`);

    /* the lilies */
    const lilL = S.layer({ par: 0.4, sh: 4 });
    const LIL = Array.from({ length: 34 }, (_, i) => {
      const x = 280 + (i % 17 + c.rr(0, 0.8)) * 60, y = mfn(x) + 24 + (i >= 17 ? 60 : 0) + c.rr(0, 24);
      return { i, x, y, el: lilL.add(`<g>${lily(c, c.rr(60, 96), c.pick([C.roseRobe, C.terracotta, C.cream, C.roseRobe]))}</g>`) };
    }).filter((l) => Math.abs(l.x - MX) > 60 && Math.abs(l.x - OX) > 80);
    const spin = lilL.add(`<g>${spindle(c)}</g>`);
    const great = lilL.add(`<g><circle cy="-240" r="120" fill="url(#halo-glow)"/>${lily(c, 260, C.cream, { big: true })}</g>`);

    /* Solomon's plate */
    const plateL = S.layer({ par: 0.12, sh: 6 });
    const board = plateL.add(`<g>${plateBoard(c, PW, PH, { fill: mix(C.parchment, C.plumRobe, 0.15), ground: mix(C.plumRobe, C.parchment, 0.4), gy: 0.82 })}</g>`);
    const sol = plateL.add(`<g><g transform="translate(0 0) scale(.8)">${throne(c)}</g>${pose3(c, [{ x: 0, y: -8, s: 0.78, flip: false, o: { ...{ robe: C.sun, mantle: C.plumRobe, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full', belt: C.terracotta }, pose: 'sit' }, armF: 40, armB: 20 }]).replace('</g></g><g class="armF"', `<g transform="translate(0 -14) scale(.9)">${crown(c)}</g></g></g><g class="armF"`)}</g>`);
    const solName = plateL.add(`<g>${sheet().p(c.cut(c.rect(-60, -12, 120, 24), 0.4, 6), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.terracotta}">${tr('Salomon', 'Solomon')}</text></g>`);

    /* today, tomorrow */
    const dayL = S.layer({ par: 0.12, sh: 5 });
    const today = hanging(dayL, dayDisc(c, tr('dziś', 'today'), 30), { x: 0, y: 0, len: 900 });
    const tomorrow = hanging(dayL, dayDisc(c, tr('jutro', 'tomorrow'), 30), { x: 0, y: 0, len: 900 });
    fade(today.querySelector('.lit'), 1); fade(today.querySelector('.off'), 0);

    /* the man, the woman */
    const act = S.layer({ par: 0.4, sh: 5 });
    const man = S.puppet(act.add(person(c, { ...QUIET, robe: C.mauve, holdF: `<g data-k="oldCloak">${cloak(c, { big: true })}</g>` })));
    const oldCloak = S.$('oldCloak');
    const cl = act.add(`<g>${worryCloud(c, 90)}<g transform="translate(0 -16) scale(.6)"><circle r="24" fill="${C.cream}" opacity=".85"/>${tunic(c, C.dustyBlue)}</g></g>`);
    const woman = S.puppet(act.add(person(c, { ...womanOf(c, { robe: C.ochreRobe }), holdF: `<g data-k="bundle" transform="translate(0 6)">${sheet().p(c.cut(c.blob(0, 0, 26, 14, 10, 0.3), 1.2, 4), mix(C.wheat2, C.olive, 0.4)).out()}</g>` })));
    const bundle = S.$('bundle');
    const flyB = act.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 26, 14, 10, 0.3), 1.2, 4), mix(C.wheat2, C.olive, 0.4)).out()}</g>`);
    const newM = hanging(act, `<circle cy="60" r="110" fill="url(#halo-glow)"/>${mantle(c)}`, { x: 0, y: 0, len: 1100 });

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1250, y: 140, r: T ? Math.sin(T * 0.6) : 0 });
      /* v28a — the worn cloak, the worry */
      const hold = es(t, 0.05, 0.3) * (1 - es(t, 3.95, 4.1));
      const lookUp = es(t, 4.25, 4.5);
      const mk = es(t, 4.1, 4.5, ease.out);
      const aF = 20 + hold * 60;
      man.set({ x: MX, y: GY + 10, s: 1.02, armF: aF, armB: 10 + hold * 40 + lookUp * 60, head: hold * 8 - lookUp * 20, blink: blinkAt(T, 2) });
      pose(oldCloak, { x: 0, y: -4, r: aF, s: 0.42, o: 1 - es(t, 3.9, 4.0) });
      const [hx, hy] = headAt(MX, GY + 10, 1.02, false);
      const ck = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 4.3, 4.55));
      pose(cl, { x: hx + 10, y: hy - 64 - es(t, 4.3, 4.55) * 200, s: ck, o: ck > 0.02 ? 1 : 0 });

      /* v28b — the lilies rise and open; the spindle lies idle */
      LIL.forEach((l) => {
        const k = es(t, 1.05 + ((l.i * 5) % 34) * 0.014, 1.35 + ((l.i * 5) % 34) * 0.014, ease.back);
        pose(l.el, { x: l.x, y: l.y, sy: Math.max(0.02, k), sx: 0.6 + k * 0.4, o: k > 0.02 ? 1 : 0 });
      });
      pose(spin, { x: 700, y: mfn(700) + 70, r: -6, o: es(t, 1.2, 1.35) });

      /* v29 — Solomon in all his glory, and one lily */
      const pk = es(t, 2.02, 2.35, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      const py = lerp(-560, PY, pk) + (T ? Math.sin(T * 0.8) * 2 : 0);
      const po = pk > 0.005 ? 1 : 0;
      pose(board, { x: PX, y: py, o: po });
      pose(sol, { x: PX, y: py + PH * 0.82 + 4, o: po });
      pose(solName, { x: PX, y: py + PH - 2, o: po });
      const gk = es(t, 2.2, 2.6, ease.out) * (1 - es(t, 2.95, 3.2) * 0.6);
      pose(great, { x: LILX, y: GY + 30, sy: Math.max(0.02, gk), sx: 0.7 + gk * 0.3, o: gk > 0.02 ? 1 : 0 });

      /* v30a — today and tomorrow; the grass is thrown into the oven */
      const dk = es(t, 3.02, 3.3, ease.out) * (1 - es(t, 4.0, 4.2, ease.in));
      pose(today, { x: 860, y: lerp(-400, 190, dk), r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: dk > 0.01 ? 1 : 0 });
      pose(tomorrow, { x: TMX, y: lerp(-400, 230, dk), r: T ? Math.sin(T * 0.8 + 1) * 1.5 : 0, o: dk > 0.01 ? 1 : 0 });
      const WK = [[3.02, 900], [3.35, OX - 90]];
      const wx = t < 3.02 ? 900 : t > 3.35 ? OX - 90 : lerp(900, OX - 90, es(t, 3.02, 3.35));
      const gather = bump(t, 3.02, 3.2);
      const throwK = es(t, 3.42, 3.6);
      woman.set({ x: wx, y: GY + 20, s: 0.98, walk: t > 3.02 && t < 3.35 ? wx * 0.06 : undefined, armF: 30 + gather * 40 + throwK * 80, armB: 20, lean: gather * 20, head: gather * 10, blink: blinkAt(T, 5), o: seg(t, 2.95, 3.02) });
      fade(bundle, t > 3.2 && throwK < 0.01 ? 1 : 0);
      const [bx, by] = handAt(OX - 90, GY + 20, 0.98, false, 110);
      const fl = es(t, 3.6, 3.75);
      pose(flyB, { x: lerp(bx, OX, fl), y: lerp(by, GY - 60, fl) - Math.sin(fl * PI) * 60, r: fl * 90, o: fl > 0 && fl < 1 ? 1 : 0 });
      const fk = es(t, 3.72, 3.85) * (1 - es(t, 4.4, 4.7) * 0.7);
      pose(flare, { x: OX, y: GY - 62, s: fk * (1 + (T ? Math.sin(T * 8) * 0.08 : 0)), o: fk });
      LIL.forEach((l) => { if (l.x > 1000) { const cut = es(t, 3.05, 3.25); pose(l.el, { x: l.x, y: l.y, sy: Math.max(0.02, 1 - cut), o: cut < 0.98 && t > 1.05 ? 1 : 0 }); } });

      /* v30b — a new mantle, glowing, for him */
      pose(newM, { x: hx - 2, y: lerp(-500, hy + 20, mk), r: T ? Math.sin(T * 0.8) * 1.4 * (1 - mk) : 0, o: mk > 0.01 ? 1 : 0 });

      S.cam.z = 1.04 + es(t, 0.9, 1.4) * 0.02;
      S.cam.y = -10 - es(t, 1.9, 2.3) * 40 + es(t, 2.9, 3.3) * 30;
      S.cam.x = -20 + es(t, 2.9, 3.3) * 40 - es(t, 3.95, 4.3) * 50;
    };
  },
};
