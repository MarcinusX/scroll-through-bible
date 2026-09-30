// Łk 7,33–35 — two small flats come down over the slope, one on each side of Jesus. "John the Baptist came eating
// no bread and drinking no wine": on the left John on his rock in the desert waves away the loaf and the cup a
// disciple holds out. "And you say, 'He has a demon'": in the crowd the Pharisees point at him, and a dark jagged
// cry goes up. "The Son of Man came eating and drinking": on the right He sits at a table with tax collectors and a
// woman of the town, breaking bread and lifting the cup. "And you say, 'Look, a glutton and a drunkard, a friend of
// tax collectors and sinners!'": the critics turn round and cry out again. "Yet wisdom is justified by all her
// children": a golden lamp of Wisdom comes down between the flats; the people who welcomed John and Jesus step
// into its light with their hands raised — and the dark cries crumple and fall.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { rock } from '../../assets/nature.js';
import {
  teachSet, TS, JOHN_B, JD, TAXMAN, SINNER, KID_LOOKS, pharisee, LAWYER, flat, flatSky, flatHills, fig, figure, loaf, cup, crossMark, lowTable,
  cry, lantern, childPerson, folkGroup, headAt, hand, kf, tr, PI, FONT,
} from './lib.js';

const { GY, JX } = TS;
const FW = 300, FH = 200, KF = 1.0;
const LX = 640, RX = 980, FY = 330;

export default {
  id: 'lk7-wisdom',
  beats: [
    { v: 33, text: 'Przyszedł bowiem Jan Chrzciciel: nie jadł chleba i nie pił wina;' },
    { v: 33, cont: true, text: 'a wy mówicie: "Zły duch go opętał".' },
    { v: 34, text: 'Przyszedł Syn Człowieczy: je i pije;' },
    { v: 34, cont: true, text: 'a wy mówicie: "Oto żarłok i pijak, przyjaciel celników i grzeszników".' },
    { v: 35 },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S, { crowds: false });
    const c = T0.c;
    const B = T0.bits;
    const XL = (dx) => LX + dx * KF, XR = (dx) => RX + dx * KF;

    /* the lamp of Wisdom (behind everything on the flats' layer) */
    const lamp = T0.FL.add(`<g opacity="0"><g transform="scale(1.6)">${lantern(c, 24, C.sun)}</g><g transform="translate(0 64)"><path d="M-56 -14L56 -15L57 14L-56 15Z" fill="${C.cream}"/><text x="0" y="7" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.sunDeep}">${tr('Mądrość', 'Wisdom')}</text></g></g>`);
    const lampString = T0.FL.add(`<g opacity="0"><path d="M0 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);

    /* left flat: John in the desert */
    const fL = T0.FL.add(flat(S, flatSky(S, FW, FH, ['#d6dcd0', '#f3dfbc']) + flatHills(c, FW, 10, mix(C.duskViolet, C.dune, 0.45), 8) + flatHills(c, FW, 50, mix(C.sand, C.sand2, 0.5), 5)
      + `<g transform="translate(-40 92)">${rock(c, 0, 0, 90, 30, C.rock2)}</g>`, { w: FW, h: FH }));
    const johnL = B.add(`<g>${figure(c, { ...JOHN_B, pose: 'sit' }, { s: 0.56, armF: 70, armB: 110, head: -6 })}</g>`);
    const disL = B.add(`<g>${figure(c, JD[1], { s: 0.54, flip: true, armF: 70, armB: 40, head: 6 })}</g>`);
    const offerL = B.add(`<g>${loaf(c, 11)}<g transform="translate(18 -4)">${cup(c)}</g></g>`);
    const noL = B.add(`<g>${crossMark(c, 16, C.terracotta)}</g>`);

    /* right flat: the Son of Man at table with tax collectors and sinners */
    const fR = T0.FL.add(flat(S, flatSky(S, FW, FH, [mix(C.plaster, C.apricot, 0.3), mix(C.plaster2, C.apricot, 0.2)])
      + sheet().p(c.cut([[-FW / 2 - 4, 70], [FW / 2 + 4, 66], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.4, 8), mix(C.stone2, C.clay, 0.3)).out()
      + fig(c, { ...TAXMAN, pose: 'sit' }, -108, 88, 0.52) + fig(c, { robe: C.ochreRobe, mantle: C.teal2, hairStyle: 'wrap', veil: C.sun, beard: 'full', hair: C.hair3, skin: C.skin3, pose: 'sit' }, 110, 88, 0.52, true)
      + fig(c, { ...SINNER, pose: 'sit' }, 60, 90, 0.5, true)
      + `<g transform="translate(0 96) scale(.62)">${lowTable(c, 300, 40)}</g>` + `<g transform="translate(-50 66)">${loaf(c, 9)}</g><g transform="translate(34 66)">${cup(c)}</g>`, { w: FW, h: FH }));
    const jesusR = B.add(`<g>${figure(c, { ...CAST.jesus, pose: 'sit' }, { s: 0.54, armF: 90, armB: 110, head: -4 })}</g>`);
    const bread = B.add(`<g>${loaf(c, 10)}</g>`);
    const wine = B.add(`<g>${cup(c, C.clay)}</g>`);

    /* the critics, in the crowd on the right; the people who welcomed John and Jesus on the left */
    const crit = [pharisee(c, 0), LAWYER, pharisee(c, 2)].map((o, i) => ({ i, p: S.puppet(T0.P.add(person(c, o))), seed: c.rr(0, 9) }));
    const kids = [
      { o: TAXMAN, x: 420 }, { o: { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2 }, x: 500 },
      { o: SINNER, x: 580 }, { o: KID_LOOKS[3], x: 650, kid: true },
    ].map((k, i) => ({ ...k, i, p: S.puppet(T0.P.add(k.kid ? childPerson(c, k.o) : person(c, k.o))) }));
    const leftCrowd = T0.crowdL.sprite(folkGroup(makeCutter('lk7-ts-l'), 6, { s: 0.8 }), 290, GY - 8);
    const glowL = T0.crowdL.add(`<g opacity="0"><ellipse rx="300" ry="170" fill="url(#halo-glow)"/></g>`);
    const W = T0.W;
    const cry1 = W.add(`<g opacity="0">${cry(c, tr('Zły duch go opętał!', 'He has a demon!'), { size: 20, dir: 1 })}</g>`);
    const cry2 = W.add(`<g opacity="0">${cry(c, [tr('Oto żarłok i pijak,', 'A glutton and a drunkard,'), tr('przyjaciel celników', 'a friend of tax collectors'), tr('i grzeszników!', 'and sinners!')], { size: 18, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T);
      const up = es(t, 4.0, 4.25, ease.in);
      const kL = es(t, 0.0, 0.26, ease.out) * (1 - up), kR = es(t, 2.0, 2.26, ease.out) * (1 - up);
      const yL = lerp(-1500, FY, kL), yR = lerp(-1500, FY, kR);
      const onL = kL > 0.002 ? 1 : 0, onR = kR > 0.002 ? 1 : 0;
      pose(fL, { x: LX, y: yL, s: KF, o: onL });
      pose(fR, { x: RX, y: yR, s: KF, o: onR });

      /* v33a — John: no bread, no wine */
      pose(johnL, { x: XL(-40), y: yL + 80 * KF, s: KF, o: onL });
      pose(disL, { x: XL(76), y: yL + 98 * KF, s: KF, o: onL });
      const push = es(t, 0.4, 0.6);
      pose(offerL, { x: XL(22 + push * 12), y: yL + (22 + push * 4) * KF, s: KF, o: onL });
      const nk = es(t, 0.55, 0.7, ease.back);
      pose(noL, { x: XL(30), y: yL + 18 * KF, s: nk * KF, o: onL * (nk > 0.02 ? 1 : 0) });

      /* v34a — the Son of Man eats and drinks */
      pose(jesusR, { x: XR(-26), y: yR + 88 * KF, s: KF, o: onR });
      const lift = es(t, 2.3, 2.6);
      pose(bread, { x: XR(4), y: yR + (22 - lift * 16) * KF, s: KF, o: onR });
      pose(wine, { x: XR(16), y: yR + (24 - lift * 20) * KF, r: lift * -20, s: KF, o: onR * es(t, 2.6, 2.7) });

      /* the critics: point left and cry (v33b), turn and cry (v34b) */
      const p1 = es(t, 1.08, 1.22) * (1 - es(t, 1.9, 2.0));
      const turnR = t > 2.9 && t < 4.4;
      const p2 = es(t, 3.08, 3.22) * (1 - es(t, 3.95, 4.05));
      const shrink = es(t, 4.25, 4.5);
      crit.forEach((k) => {
        const x = [990, 1080, 1170][k.i];
        k.p.set({ x, y: GY - 2 + (k.i % 2) * 8, s: 1.0, flip: !turnR, armF: 20 + p1 * 70 + p2 * 70, armB: 10 + p1 * (k.i === 1 ? 110 : 30) + p2 * (k.i === 0 ? 120 : 30), head: -p1 * 10 - p2 * 14 + shrink * 12, lean: shrink * 6, blink: blinkAt(T, k.seed) });
      });
      const [chx, chy] = headAt(1080, GY + 6, 1.0, true);
      const b1 = es(t, 1.12, 1.24, ease.back) * (1 - es(t, 1.92, 2.0));
      pose(cry1, { x: chx - 40, y: chy - 50, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const b2 = es(t, 3.12, 3.24, ease.back);
      const fall = es(t, 4.2, 4.6, ease.in);
      pose(cry2, { x: lerp(chx - 10, chx + 60, fall), y: lerp(chy - 60, GY + 40, fall), r: fall * 60, s: b2 * (1 - fall * 0.7), o: b2 > 0.02 ? 1 - seg(t, 4.5, 4.6) : 0 });

      /* v35 — Wisdom justified by all her children */
      const wk = es(t, 4.05, 4.3, ease.out);
      const ly = lerp(-1500, 300, wk);
      pose(lamp, { x: 800, y: ly + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.6) * 1.5 : 0, o: wk > 0.01 ? 1 : 0 });
      pose(lampString, { x: 800, y: ly, o: wk > 0.01 ? 1 : 0 });
      const come = es(t, 4.3, 4.6);
      const raise = es(t, 4.45, 4.7);
      kids.forEach((k) => {
        const x = lerp(k.x - 60, k.x + 10, come);
        k.p.set({ x, y: GY + (k.i % 2) * 8, s: k.kid ? 0.62 : 0.96, o: seg(t, 4.2, 4.3), walk: come > 0 && come < 1 ? x * 0.05 + k.i : undefined, armF: 20 + raise * 30, armB: 10 + raise * 150, head: -raise * 14, blink: blinkAt(T, k.i + 3) });
      });
      pose(glowL, { x: 560, y: GY - 150, s: 1, o: raise * 0.8 });
      leftCrowd.set({ x: 290, y: GY - 8 });
      const speak = 0.8;
      const toL = es(t, 0.1, 0.25) * (1 - es(t, 1.9, 2.1));
      const toR = es(t, 2.1, 2.25) * (1 - es(t, 3.9, 4.1));
      T0.jesus.set({ x: JX, y: GY, s: 1.06, flip: t < 2.0 || t > 4.1, armF: 16 + (toL + toR) * 30, armB: 10 + (toL + toR) * 110 + es(t, 4.3, 4.5) * 60, head: -(toL + toR) * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, t < 2.0 || t > 4.1);
      T0.voice(hx, hy, speak, T, { dir: t < 2.0 || t > 4.1 ? -1 : 1, spread: 1.8 });

      S.cam.x = kf(t, [[0, -20], [1.9, -20], [2.2, 20], [3.9, 20], [4.2, 0]]);
      S.cam.y = -10;
      S.cam.z = 1.04;
      void hand; void makeCutter; void bump;
    };
  },
};
