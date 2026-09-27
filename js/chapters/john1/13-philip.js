// J 1,43–46 — The next day He sets out for Galilee (a dotted road draws itself on the map) and finds Philip:
// "Follow me." Philip is from Bethsaida, the town of Andrew and Peter. Philip runs on to Nathanael, reading under
// a fig tree: "We have found Him of whom Moses and the prophets wrote — Jesus, son of Joseph, from Nazareth."
// "Can anything good come out of Nazareth?" — "Come and see!"
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, attr } from '../kit.js';
import { band, hillsWith, waterBand, olive, cypress, grass, flowers, rock, town, cloud, sun } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, nameTag, bubble, question, hungPlate, hungWord, iconWord, lawTablets, scrollRoll, figTree, figs, landMap, LAND, pin, hang2, headAt, hand, withFace, faceBits, bust, PI } from './lib.js';

const PY = 770, FIGX = 1330;

export default {
  id: 'j1-philip',
  beats: [
    { v: 43, text: 'Nazajutrz [Jezus] postanowił udać się do Galilei.' },
    { v: 43, cont: true, text: 'I spotkał Filipa.' },
    { v: 43, cont: true, text: 'Jezus powiedział do niego: «Pójdź za Mną!».' },
    { v: 44 },
    { v: 45, text: 'Filip spotkał Natanaela i powiedział do niego:' },
    { v: 45, cont: true, text: '«Znaleźliśmy Tego, o którym pisał Mojżesz w Prawie i Prorocy - Jezusa, syna Józefa z Nazaretu».' },
    { v: 46, text: 'Rzekł do niego Natanael: «Czyż może być co dobrego z Nazaretu?»' },
    { v: 46, cont: true, text: 'Odpowiedział mu Filip: «Chodź i zobacz!»' },
  ],
  cam: { x: [-40, 1200], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const MORN = ['#cde2dd', '#eef0d8', '#f8eed6'];
    sky(S, MORN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1180, y: 150, len: 700 });
    const cls = [[480, 160, 190], [980, 120, 150], [1500, 170, 200]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 700 }), x, y, i }));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1000, 360, 130], color: C.hillFar, x0: -1300, x1: 3200 }).markup);
    const lakeL = S.layer({ par: 0.14, sh: 2 });
    lakeL.add(waterBand(c, { y: 470, color: mix(C.lake, C.skyBlue, 0.3), x0: -1300, x1: 3200, foamN: 20 }).markup);
    const hills = hillsWith(c, { y: 530, amps: [22, 9, 3], lens: [900, 300, 110], color: C.hillMid, trees: 40, treeColor: C.sage, treeH: 24, x0: -1300, x1: 3400 });
    const H = S.layer({ par: 0.22, sh: 3 });
    H.add(hills.markup);
    H.add(town(c, { x: 1500, y: hills.fn(1500) + 12, n: 7, spread: 240, sc: 0.5 }));
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(690, [8, 3], [700, 180]);
    G.add(sheet().p(c.ridge(gfn, -1300, 3600, 1700, 12, 1), C.hillNear).out());
    G.add(sheet().p(c.ribbon([[-1300, 752], [-400, 748], [300, 756], [900, 750], [1500, 758], [2200, 752], [3600, 756]], 60, 2), mix(C.sand, C.cream, 0.4)).out());
    G.add(grass(c, { x0: -1300, x1: 3600, y: 690, fn: gfn, n: 90, h: 16, color: C.moss }) + flowers(c, { x0: -800, x1: 3200, y: 690, fn: gfn, n: 40 }) + olive(c, 180, 700, 0.9) + rock(c, 620, 712, 60, 22, C.rock2) + cypress(c, 1000, 700, 140));
    // the fig tree (on the same ground, further along the road)
    const fig = figTree(c, 1.05);
    G.add(`<g transform="translate(${FIGX} 712)">${fig.trunk}${fig.leaves}<g transform="translate(-40 -210)">${figs(c, 3, 8)}</g><g transform="translate(60 -236)">${figs(c, 2, 8)}</g></g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.45, sh: 4 });
    const jn = S.puppet(P.add(person(c, { ...CAST.john })));
    const andrew = S.puppet(P.add(person(c, { ...CAST.andrew })));
    const peter = S.puppet(P.add(person(c, { ...CAST.peter })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const philip = S.puppet(P.add(person(c, { ...LOOK.philip, holdB: `<g transform="translate(-6 -6)"><path d="${c.cut(c.blob(0, 0, 16, 12, 10, 0.2), 0.4, 4)}" fill="${C.basket}"/></g>` })));
    const NATH = { ...LOOK.bartholomew, holdF: `<g transform="translate(4 2) rotate(70)">${scrollRoll(c)}</g>` };
    const nSit = S.puppet(P.add(withFace(person(c, { ...NATH, pose: 'sit' }), faceBits(c))));
    const nStand = S.puppet(P.add(person(c, { ...LOOK.bartholomew })));
    const frown = nSit.el.querySelector('[data-part="angry"]');

    /* ---------- the map, plates, words ---------- */
    const T = S.layer({ par: 0.45, sh: 6 });
    const route = [[LAND.beth[0], LAND.beth[1]], [60, 40], [72, -40], [52, -110], [60, -160]];
    const mapEl = T.add(hang2(`<g transform="scale(.5)">${landMap(c)}<path data-k="route" d="M${route.map((p) => p.join(' ')).join('L')}" stroke="${C.terracotta}" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/><g transform="translate(${LAND.beth[0]} ${LAND.beth[1]})">${pin(c, C.clay)}</g></g>`, 120, 500));
    const routeEl = S.$('route');
    const phTag = hanging(T, nameTag(c, tr('Filip', 'Philip'), { size: 20 }), { x: 0, y: 0, len: 900 });
    const followEl = T.add(`<g>${bubble(c, tr('Pójdź za Mną!', 'Follow me!'), { size: 22, tail: -1 })}</g>`);
    const bsd = T.add(hungPlate(c, iconWord(`<g transform="translate(0 14)">${town(c, { x: 0, y: 0, n: 4, spread: 60, sc: 0.45 })}</g><path d="${c.ribbon([[-40, 18], [40, 18]], 6)}" fill="${C.lake}"/>`, tr('Betsaida', 'Bethsaida'), { size: 16, y: 40 }), { r: 58 }));
    const minis = [CAST.andrew, CAST.peter, LOOK.philip].map((o) => T.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 26, 24), 0.3, 4), C.haloRim).p(c.cut(c.circ(0, 0, 22, 24), 0.3, 4), C.parchment).out()}<g clip-path="url(#${S.id('mc')})"><g transform="translate(0 6) scale(.36)">${bust(c, o)}</g></g></g>`));
    S.defs(`<clipPath id="${S.id('mc')}"><circle r="21"/></clipPath>`);
    const links = T.add(`<g>${[0, 1, 2].map((i) => `<path data-i="${i}" d="M0 0L1 1" stroke="${C.clay}" stroke-width="2" stroke-dasharray="3 6" fill="none"/>`).join('')}</g>`);
    const linkEls = Array.from(links.querySelectorAll('path'));
    const mosesP = T.add(hungPlate(c, iconWord(`<g transform="translate(0 30) scale(.55)">${lawTablets(c, { w: 50, h: 70 })}</g>`, tr('Mojżesz', 'Moses'), { size: 15, y: 40 }), { r: 52 }));
    const prophP = T.add(hungPlate(c, iconWord(`<g transform="translate(0 2) scale(1.6)">${scrollRoll(c)}</g>`, tr('Prorocy', 'the prophets'), { size: 15, y: 40 }), { r: 52 }));
    const nameEl = T.add(hungWord(c, tr('Jezus, syn Józefa z Nazaretu', 'Jesus of Nazareth, son of Joseph'), { size: 19 }));
    const nazP = T.add(hungPlate(c, iconWord(`<g transform="translate(0 14)">${town(c, { x: 0, y: 0, n: 3, spread: 40, sc: 0.4 })}</g>`, tr('Nazaret', 'Nazareth'), { size: 16, y: 40 }), { r: 52 }));
    const doubt = T.add(`<g>${bubble(c, [tr('Czyż może być co dobrego', 'Can any good thing'), tr('z Nazaretu?', 'come out of Nazareth?')], { size: 19, tail: 1 })}</g>`);
    const qEl = T.add(`<g>${question(c)}</g>`);
    const comeEl = T.add(`<g>${bubble(c, tr('Chodź i zobacz!', 'Come and see!'), { size: 22, tail: -1 })}</g>`);

    return (t, time) => {
      pose(sunEl, { x: 1180, y: 150, r: Math.sin(time * 0.6) });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 22, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2 }));

      /* v43a: to Galilee — the map, and the road */
      const mk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      pose(mapEl, { x: 1010, y: lerp(-500, 270, mk), r: Math.sin(t * 2.8) * 0.8, o: mk > 0.01 ? 1 : 0 });
      attr(routeEl, 'stroke-dasharray', `2 12`);
      attr(routeEl, 'opacity', es(t, 0.3, 0.8));
      const walk = es(t, 0.1, 1.2);
      const baseX = lerp(-300, 760, walk);
      /* v43b: He finds Philip; v43c: follow me */
      const meet = es(t, 1.05, 1.6);
      const phx0 = lerp(1300, 900, meet);
      /* v44: then on together */
      /* v45a: Philip goes to Nathanael (the camera travels down the road) */
      const run = es(t, 4.05, 4.7);
      const pan = es(t, 4.0, 4.7);
      const phx = lerp(phx0, FIGX - 170, run);
      const moving = (walk > 0 && walk < 1);
      jesus.set({ x: baseX + 40, y: PY, s: 1.05, flip: false, walk: moving ? baseX * 0.05 : undefined, armF: 12 + es(t, 2.05, 2.3) * 70 * (1 - es(t, 2.9, 3.1)), armB: es(t, 2.05, 2.3) * 30 * (1 - es(t, 2.9, 3.1)), blink: blinkAt(time, 2) });
      peter.set({ x: baseX - 110, y: PY + 6, s: 1.02, flip: false, walk: moving ? baseX * 0.05 + 1 : undefined, armF: 10 + bump(t, 3.1, 3.8) * 70, blink: blinkAt(time, 3) });
      andrew.set({ x: baseX - 210, y: PY + 2, s: 1.0, flip: false, walk: moving ? baseX * 0.05 + 2 : undefined, armF: 10 + bump(t, 3.15, 3.85) * 60, blink: blinkAt(time, 4) });
      jn.set({ x: baseX - 300, y: PY + 8, s: 0.96, flip: false, walk: moving ? baseX * 0.05 + 3 : undefined, blink: blinkAt(time, 5) });
      const phWalk = (meet > 0 && meet < 1) || (run > 0 && run < 1);
      philip.set({ x: phx, y: PY + 4, s: 1.0, flip: run > 0 ? false : true, o: seg(t, 1.02, 1.06), walk: phWalk ? phx * 0.06 : undefined, amt: run > 0 ? 1.3 : 1, armF: 10 + bump(t, 2.4, 3.0) * 40 + bump(t, 3.1, 3.8) * 60 + bump(t, 5.1, 5.9) * 70 + es(t, 7.1, 7.35) * 80, armB: bump(t, 5.1, 5.9) * 110, head: bump(t, 2.3, 2.9) * 8, blink: blinkAt(time, 6) });
      const [phx1, phy1] = headAt(phx, PY + 4, 1, true);
      pose(phTag, { x: phx1, y: lerp(-600, phy1 - 130, es(t, 1.4, 1.7, ease.out) * (1 - es(t, 2.9, 3.1, ease.in))), r: Math.sin(t * 4.4) * 2, o: t > 1.3 && t < 3.2 ? 1 : 0 });
      const [jhx, jhy] = headAt(baseX + 40, PY, 1.05, false);
      pose(followEl, { x: jhx + 50, y: jhy - 20, s: es(t, 2.05, 2.25, ease.back), o: seg(t, 2.03, 2.07) * (1 - seg(t, 2.95, 3.0)) });

      /* v44: Bethsaida, the town of Andrew and Peter */
      const bk = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      const BX = 800, BY = 280;
      pose(bsd, { x: BX, y: lerp(-500, BY, bk), r: Math.sin(t * 3.2) * 1.2, o: bk > 0.01 ? 1 : 0 });
      const who = [[baseX - 210, PY + 2], [baseX - 110, PY + 6], [phx, PY + 4]];
      minis.forEach((m, i) => {
        const k = es(t, 3.2 + i * 0.08, 3.45 + i * 0.08, ease.back) * (1 - es(t, 3.95, 4.1));
        const [hx, hy] = headAt(who[i][0], who[i][1], 1, i === 2);
        pose(m, { x: hx, y: hy - 70, s: k, o: k > 0.01 ? 1 : 0 });
        attr(linkEls[i], 'd', `M${hx.toFixed(0)} ${(hy - 96).toFixed(0)}L${BX} ${(BY + 60).toFixed(0)}`);
        attr(linkEls[i], 'opacity', k * 0.8);
      });

      /* Nathanael under the fig tree */
      const up = es(t, 7.2, 7.35);
      const reading = 1 - es(t, 4.4, 4.7);
      const doubtK = es(t, 6.1, 6.35);
      nSit.set({ x: FIGX - 30, y: PY - 4, s: 1.0, flip: true, o: 1 - up, armF: 50 * reading + 30 + doubtK * 40 * (1 - es(t, 6.9, 7.1)), armB: 30 + doubtK * 60 * (1 - es(t, 6.9, 7.1)), head: 10 * reading - doubtK * 6, blink: blinkAt(time, 7) });
      fade(frown, doubtK * (1 - es(t, 7.0, 7.2)));
      const nx = lerp(FIGX - 30, FIGX - 700, es(t, 7.4, 7.95));
      nStand.set({ x: nx, y: PY + 2, s: 1.0, flip: true, o: up, walk: es(t, 7.4, 7.95) > 0 && es(t, 7.4, 7.95) < 1 ? nx * 0.06 : undefined, armF: 40, blink: blinkAt(time, 7) });

      /* v45b: Moses in the Law, and the Prophets — Jesus, son of Joseph, from Nazareth */
      const m1 = es(t, 5.1, 5.35, ease.out) * (1 - es(t, 5.95, 6.15, ease.in));
      const m2 = es(t, 5.2, 5.45, ease.out) * (1 - es(t, 5.95, 6.15, ease.in));
      const nm = es(t, 5.4, 5.7, ease.out) * (1 - es(t, 5.95, 6.15, ease.in));
      pose(mosesP, { x: FIGX - 250, y: lerp(-500, 270, m1), r: Math.sin(t * 3.6) * 1.4, o: m1 > 0.01 ? 1 : 0 });
      pose(prophP, { x: FIGX - 110, y: lerp(-500, 250, m2), r: Math.sin(t * 3.6 + 1) * 1.4, o: m2 > 0.01 ? 1 : 0 });
      pose(nameEl, { x: FIGX - 180, y: lerp(-500, 385, nm), r: Math.sin(t * 3.2 + 2) * 1.2, o: nm > 0.01 ? 1 : 0 });
      /* v46a: can anything good come out of Nazareth? */
      const nz = es(t, 6.15, 6.4, ease.out) * (1 - es(t, 6.95, 7.15, ease.in));
      pose(nazP, { x: FIGX - 180, y: lerp(-500, 280, nz), r: Math.sin(t * 3.2) * 1.4, o: nz > 0.01 ? 1 : 0 });
      pose(qEl, { x: FIGX - 180 + 60, y: 230, s: es(t, 6.3, 6.5, ease.back) * (1 - es(t, 6.95, 7.1)), r: Math.sin(t * 8.0) * 8, o: seg(t, 6.28, 6.32) });
      const [nhx, nhy] = headAt(FIGX - 30, PY - 4, 1, true, 62);
      pose(doubt, { x: nhx - 70, y: nhy - 24, s: es(t, 6.08, 6.28, ease.back), o: seg(t, 6.06, 6.1) * (1 - seg(t, 6.95, 7.0)) });
      /* v46b: come and see */
      pose(comeEl, { x: phx1 + 40, y: phy1 - 20, s: es(t, 7.05, 7.25, ease.back), o: seg(t, 7.03, 7.07) });

      S.cam.x = pan * 1000;
      S.cam.z = 1.02 + 0.06 * es(t, 5.0, 5.4) * (1 - es(t, 7.3, 7.8));
    };
  },
};
