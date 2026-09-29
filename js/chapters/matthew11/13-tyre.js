// Mt 11,21b–22 — a painted flat: the bright Phoenician coast, Tyre on its island with purple-sailed ships, Sidon
// further up the shore. "If the mighty works had been done in Tyre and Sidon": golden sparks rain down over the
// harbour; the people in their fine purple clothes stop, take them off for sackcloth, and sit down in heaps of ashes,
// grey flakes falling on their bowed heads. "It will be more tolerable for Tyre and Sidon on the day of judgment":
// the sky turns gold and a great balance comes down — Tyre and Sidon on one pan, Chorazin and Bethsaida on the
// other — and the pan of the unrepentant towns sinks.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, palm } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { SEA, KINGDOM, SACK, penitent, cityIcon, ship, ashFlake, ashPile, sparkle, scalesParts, poseScales, strip, tr, PI } from './lib.js';

const GY = 744;
const PEN = [[470, 0], [590, 1], [720, 2], [900, 3], [1030, 4], [1150, 5]];
let BX = 900, BY = 200, ARM = 230;
const PURPLE = [mix(C.plumRobe, C.roseRobe, 0.2), C.plumRobe, mix(C.plumRobe, C.indigo, 0.25)];

export default {
  id: 'mt11-tyre',
  enter: 'fly',
  beats: [
    { v: 21, cont: true, text: 'Bo gdyby w Tyrze i Sydonie działy się cuda, które u was się dokonały, już dawno w worze i w popiele by się nawróciły.' },
    { v: 22 },
  ],
  cam: { x: [-30, 30], y: [-120, 40], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    if (S.portrait) { BX = 800; ARM = 170; } else { BX = 900; ARM = 230; }
    sky(S, SEA);
    const gold = sky(S, KINGDOM, { name: 'judg', rise: 0 }).layer;
    gold.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 140, len: 900 });
    const cl = hanging(hangL, cloud(c, 170), { x: 420, y: 190, len: 900 });

    /* the sea, Sidon far off, Tyre on its island, ships */
    S.layer({ par: 0.06, sh: 2 }).add(band(c, { y: 440, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.15), x1: 400 }).markup + `<g transform="translate(160 450)">${cityIcon(makeCutter('mt11-sidon'), 110)}</g>`);
    const sea = S.layer({ par: 0.1, sh: 2 });
    sea.add(waterBand(c, { y: 470, color: mix(C.lake2, C.skyBlue, 0.2), foamN: 30, bottom: 900 }).markup);
    const isle = S.layer({ par: 0.16, sh: 3 });
    isle.add(sheet().p(c.cut([[880, 540], [920, 510], [1300, 500], [1400, 530], [1380, 548], [900, 552]], 0.8, 10), C.sand2).out() + `<g transform="translate(1110 520)">${cityIcon(makeCutter('mt11-tyre'), 250, { tower: true, dome: true })}</g>`);
    const shipL = S.layer({ par: 0.2, sh: 3 });
    const ships = [[560, 580, 0.5], [1480, 600, 0.6]].map(([x, y, s], i) => ({ i, x, y, s, el: shipL.add(`<g>${ship(makeCutter('mt11-sh' + i), 200)}</g>`) }));
    const shL = S.layer({ par: 0.2, sh: 1, flat: true });
    shL.add(`<g transform="translate(0 0)">${waterBand(c, { y: 600, color: mix(C.lake2, C.lake3, 0.3), foamN: 16, bottom: 900, x0: -900, x1: 2500 }).markup}</g>`);
    // the quay
    const G = S.layer({ par: 0.45, sh: 3 });
    const gs = sheet();
    gs.p(c.cut([[-1100, 660], [2700, 656], [2700, 1800], [-1100, 1800]], 0.8, 14), mix(C.stone, C.sand, 0.35));
    let bl = '';
    for (let y = 670; y < 1000; y += 30) for (let x = -900 + (Math.round(y / 30) % 2) * 30; x < 2500; x += 60) bl += c.cut(c.rect(x, y, 54, 24), 0.4, 6);
    gs.x(bl, shade(mix(C.stone, C.sand, 0.35), -0.06), 'opacity=".5"');
    G.add(gs.out() + palm(c, 300, 668, 200) + palm(c, 1340, 668, 180));

    /* the people: fine clothes → sackcloth, sitting in ashes */
    const act = S.layer({ par: 0.45, sh: 5 });
    const piles = PEN.map(([x], i) => act.add(`<g>${ashPile(c, 110)}</g>`));
    const ppl = PEN.map(([x, i]) => {
      const o = penitent(c, i);
      const fine = { ...o, robe: PURPLE[i % 3], mantle: i % 2 ? C.sun : C.linen, belt: C.sun, veil: i % 3 === 1 ? C.roseRobe : o.veil };
      return { i, x, fine: S.puppet(act.add(person(c, fine))), sack: S.puppet(act.add(person(c, { ...o, pose: 'sit', eyes: 'closed' }))) };
    });
    const fx = S.layer({ par: 0.45, sh: 3 });
    const sparks = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 12, i % 2 ? C.halo : C.star)}</g>`), x: 400 + ((i * 97) % 820) }));
    const ash = Array.from({ length: 18 }, (_, i) => ({ i, el: fx.add(ashFlake(c, 5)), x: PEN[i % 6][0] + ((i * 13) % 30) - 15 }));

    /* the balance of the day of judgment */
    const balL = S.layer({ par: 0.12, sh: 6 });
    const B = scalesParts(c, { arm: ARM, drop: 90, col: mix(C.sun, C.ochre, 0.4) });
    const pan = (inner, label) => `<g>${B.pan}<g transform="translate(0 ${90 + 2}) scale(1.5)">${inner}</g><g transform="translate(0 ${90 + 44})">${strip(c, label, { size: 19 })}</g></g>`;
    const two = (a, b, dark) => `<g transform="translate(-28 0) scale(.5)">${cityIcon(makeCutter(a), 90, dark ? { wall: mix(C.stone2, C.storm, 0.35), wall2: mix(C.stone2, C.storm, 0.5) } : {})}</g><g transform="translate(26 0) scale(.5)">${cityIcon(makeCutter(b), 90, dark ? { wall: mix(C.stone2, C.storm, 0.35), wall2: mix(C.stone2, C.storm, 0.5) } : {})}</g>`;
    const els = {
      frame: balL.add(`<g>${B.frame}</g>`), beam: balL.add(`<g>${B.beam}</g>`),
      panL: balL.add(pan(two('mt11-b1', 'mt11-b2', false), tr('Tyr i Sydon', 'Tyre and Sidon'))),
      panR: balL.add(pan(two('mt11-b3', 'mt11-b4', true), tr('Korozain i Betsaida', 'Chorazin and Bethsaida'))),
    };

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1250, y: 140, r: T ? Math.sin(T * 0.6) : 0 });
      pose(cl, { x: 420 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 190, r: T ? Math.sin(T * 0.6 + 1) : 0 });
      ships.forEach((s) => pose(s.el, { x: s.x + (T ? Math.sin(T * 0.3 + s.i) * 10 : 0), y: s.y + (T ? Math.sin(T * 1.2 + s.i) * 2 : 0), s: s.s, r: T ? Math.sin(T * 1.1 + s.i) * 1.5 : 0 }));

      /* v21b — the works rain down; they put on sackcloth and sit in ashes */
      sparks.forEach((sp) => {
        const k = seg(t, 0.04 + sp.i * 0.025, 0.4 + sp.i * 0.025);
        pose(sp.el, { x: sp.x + Math.sin(k * 6 + sp.i) * 20, y: lerp(120, 600, k), s: 1 - k * 0.3, r: T * 40 + sp.i * 20, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 });
      });
      ppl.forEach((p) => {
        const sw = es(t, 0.32 + p.i * 0.04, 0.36 + p.i * 0.04);
        const look = es(t, 0.05, 0.2);
        p.fine.set({ x: p.x, y: GY - (p.i % 2) * 14, s: 0.9, flip: p.x > 800, armF: 20 + look * 30, armB: 10 + look * 90, head: -look * 16, blink: blinkAt(T, p.i), o: 1 - sw });
        const bowK = es(t, 0.4 + p.i * 0.04, 0.6);
        p.sack.set({ x: p.x, y: GY - (p.i % 2) * 14, s: 0.9, flip: p.x > 800, armF: 50 + bowK * 40, armB: 20 + bowK * 140, head: bowK * 22, lean: bowK * 8, o: sw });
      });
      piles.forEach((pl, i) => pose(pl, { x: PEN[i][0] + (PEN[i][0] > 800 ? -10 : 10), y: GY - (i % 2) * 14 + 4, o: es(t, 0.28 + i * 0.03, 0.4 + i * 0.03) }));
      ash.forEach((a) => {
        const k = T ? (T * 0.3 + a.i / 18) % 1 : a.i / 18;
        pose(a.el, { x: a.x + Math.sin(k * 9 + a.i) * 12, y: lerp(430, GY - 110, k), r: k * 300, o: es(t, 0.45, 0.6) * Math.sin(k * PI) });
      });

      /* v22 — the day of judgment: the balance */
      const jd = es(t, 1.02, 1.3);
      gold.fade(jd * 0.9);
      const bk = es(t, 1.05, 1.35, ease.out);
      const tilt = es(t, 1.35, 1.6, ease.back) * 14;
      poseScales(els, BX, lerp(-600, BY, bk) + (T ? Math.sin(T * 0.8) * 2 : 0), tilt, bk > 0.01 ? 1 : 0, 1, ARM);

      S.cam.y = lerp(30, -90, es(t, 1.0, 1.35));
      S.cam.z = 1.1 - es(t, 1.0, 1.35) * 0.06;
    };
  },
};
