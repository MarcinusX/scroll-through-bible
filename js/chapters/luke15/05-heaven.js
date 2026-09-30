// Łk 15,7 — back in the courtyard under the fig tree, now in the warm light of evening; the guests sit round the
// table, the Pharisees stand over the wall. "I tell you: in the same way there will be more joy in heaven over one
// sinner who repents…": the tax collector beside Jesus gets up, lays his fat purse down at His feet and kneels —
// and above them the clouds draw apart and the light of heaven opens (only light), golden sparks and hearts
// raining down from it. "…than over ninety-nine righteous who need no repentance": a great balance comes down out
// of the light. On one pan the one who has turned back, with his heart; on the other ninety-nine upright little
// figures in a neat block — and the pan of the one sinks, heaped with joy.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import {
  courtSet, heartFlat, seatGuests, GUEST_SEATS, CT, JESUS, PENITENT, pharisee, purse, heart, sparkle, fatherLight, figure, pose3, hungWords, glow,
  headP, handP, kf, es, ease, bump, seg, fade, tr, PI, STRING, GOLDEN,
} from './lib.js';

const JX = CT.JX, GY = CT.GY;
const PH_X = [1100, 1172, 1246];
const BX = 800, BY = 176, ARM = 210, ROD = 118;

export default {
  id: 'lk15-heaven',
  beats: [
    { v: 7, text: 'Powiadam wam: Tak samo w niebie większa będzie radość z jednego grzesznika, który się nawraca,' },
    { v: 7, cont: true, text: 'niż z dziewięćdziesięciu dziewięciu sprawiedliwych, którzy nie potrzebują nawrócenia.' },
  ],
  cam: { x: [-10, 40], y: [-40, 40], z: [1, 1.06] },
  build(S) {
    const H = courtSet(S, { skyCols: GOLDEN, sunAt: [1270, 250], table: false });
    const c = H.c;

    /* heaven opening: the light behind parting clouds (rise 0: it is there from the start, hidden) */
    const heavenL = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
    H.hangL.el.parentNode.insertBefore(heavenL.el, H.hangL.el.nextSibling);
    const light = heavenL.add(`<g opacity="0">${fatherLight(c, 56)}</g>`);
    const cloudL = S.layer({ par: 0.07, sh: 4, rise: 0 });
    heavenL.el.parentNode.insertBefore(cloudL.el, heavenL.el.nextSibling);
    const clouds = [-1, 1].map((d) => ({ d, el: cloudL.add(`<g>${cloud(c, 340, C.cream, '#eadcc0')}</g>`) }));

    /* the guests (the tax collector's seat empty: he gets up) */
    const seats = seatGuests(S, H.people, GUEST_SEATS.filter((g) => g.o !== PENITENT));
    const jesus = S.puppet(H.people.add(person(c, { ...JESUS, pose: 'sit' })));
    const pSit = H.people.add(`<g>${pose3(c, [{ x: 0, y: 0, s: 0.94, flip: true, armF: 30, armB: 10, head: 4, o: { ...PENITENT, pose: 'sit' } }])}</g>`);
    const pKneel = S.puppet(H.front.add(person(c, { ...PENITENT, pose: 'kneel' })));
    const bag = H.front.add(`<g>${purse(c, {})}</g>`);
    const phs = PH_X.map((x, i) => S.puppet(H.street.add(pharisee(c, i))));

    /* joy raining from heaven */
    const fx = H.fx;
    const drops = Array.from({ length: 12 }, (_, i) => ({ i, x: 890 + (i % 2 ? 1 : -1) * c.rr(20, 150), x0: 800 + c.rr(-60, 60), el: fx.add(`<g opacity="0">${i % 3 ? sparkle(c, 10 + (i % 4) * 2, C.halo) : heartFlat(c, 9)}</g>`) }));

    /* the balance */
    const balL = S.layer({ par: 0.2, sh: 6 });
    const col = mix(C.ochre, C.wood3, 0.3);
    const pivot = balL.add(`<g transform="translate(0 -1500)"><path d="M0 -1800V-14" stroke="${STRING}" stroke-width="1.6" fill="none"/>${sheet().p(c.cut([[-20, -28], [20, -28], [0, -6]], 0.3, 4), shade(col, -0.25)).out()}</g>`);
    const beam = balL.add(`<g transform="translate(0 -1500)">${sheet().p(c.cut([[-ARM - 10, -6], [-40, -8], [0, -14], [40, -8], [ARM + 10, -6], [ARM + 10, 6], [0, 8], [-ARM - 10, 6]], 0.4, 10), col).p(c.cut(c.circ(-ARM, 0, 9, 12), 0.2, 3) + c.cut(c.circ(ARM, 0, 9, 12), 0.2, 3), shade(col, -0.2)).p(c.cut(c.circ(0, 0, 14, 16), 0.3, 3), C.sun).out()}</g>`);
    const pan = (inner, label) => `<g transform="translate(0 -1500)"><path d="M0 0L-70 ${ROD}M0 0L70 ${ROD}" stroke="${STRING}" stroke-width="1.4" fill="none"/>${inner}${sheet().p(c.cut([[-84, ROD - 4], [84, ROD - 4], [70, ROD + 14], [-70, ROD + 14]], 0.4, 8), C.sun).out()}<g transform="translate(0 ${ROD + 40})">${hungWords(c, label, { size: 26, w: 56 })}</g></g>`;
    // the one: a small kneeling figure with a glowing heart
    const one = `<g transform="translate(0 ${ROD - 4})">${glow(70, 0.9)}${figure(c, { ...PENITENT, pose: 'kneel' }, { x: -8, y: 0, s: 0.4, armF: 40, armB: 20, head: 10 })}<g transform="translate(26 -54)">${heart(c, 11)}</g></g>`;
    // the ninety-nine: a neat block of small upright figures
    const oc = makeCutter('lk15-99');
    const nn = [];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 11; k++) nn.push({ x: -66 + k * 13.2 + (r % 2) * 5, y: ROD - 6 - (2 - r) * 10, s: 0.2, flip: k % 2 === 0, o: { robe: [C.linen, C.stone, C.linen2, C.parchment][(k + r) % 4], mantle: [C.dustyBlue, C.teal2, C.plumRobe][(k + r * 2) % 3], hair: C.hair3, hairStyle: 'wrap', veil: C.linen, beard: 'full', skin: [C.skin2, C.skin3][k % 2] } });
    const many = `${pose3(oc, nn)}`;
    const pans = [pan(one, '1'), pan(many, '99')].map((m) => balL.add(m));
    const joyHeap = [0, 1, 2, 3, 4].map((i) => balL.add(`<g opacity="0">${heart(c, 9 + (i % 2) * 3)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(T, { glowO: 0.6 });

      /* v7a — the one turns back: he rises, lays down his purse, kneels at Jesus' feet */
      const up = seg(t, 0.12, 0.16);
      const KX = kf(t, [[0.16, GUEST_SEATS[3].x], [0.36, 890]]);
      pose(pSit, { x: GUEST_SEATS[3].x, y: GY, o: 1 - up });
      const bow = es(t, 0.4, 0.58);
      pKneel.set({ x: KX, y: GY + 4, s: 0.94, flip: true, o: up, armF: 30 + bow * 60, armB: 20 + bow * 70, head: 10 + bow * 16, lean: -bow * 16, blink: blinkAt(T, 4) });
      const bd = es(t, 0.28, 0.4);
      pose(bag, { x: lerp(KX - 30, 846, bd), y: lerp(GY - 70, GY - 40, bd), r: bd * 20, s: 0.8, o: up });
      const point = es(t, 0.1, 0.3);
      jesus.set({ x: JX, y: GY, s: 1.0, armF: 30 + point * 20 - es(t, 1.1, 1.3) * 20, armB: 20 + point * 130, head: -point * 10 + es(t, 0.5, 0.7) * 12, blink: blinkAt(T) });
      seats.forEach((g) => pose(g.el, { x: g.x, y: GY, o: 1 }));
      phs.forEach((p, i) => p.set({ x: PH_X[i], y: GY - 6, s: 0.96, flip: true, armF: 14, armB: 8, head: -es(t, 1.2, 1.4) * 14 + i * 2, blink: blinkAt(T, i + 2) }));

      /* heaven opens */
      const open = es(t, 0.3, 0.7);
      clouds.forEach((cl) => pose(cl.el, { x: BX + cl.d * (150 + open * 320), y: 196 + cl.d * 6, r: T ? Math.sin(T * 0.5 + cl.d) : 0 }));
      pose(light, { x: BX, y: 170, s: 0.8 + open * 0.3, r: T * 3, o: open });
      drops.forEach((d) => {
        const k = (t - 0.5 - d.i * 0.035) / 0.7;
        const on = k > 0 && k < 1 && t < 1.2 ? 1 : 0;
        pose(d.el, { x: lerp(d.x0, d.x, k) + Math.sin(k * 6 + d.i) * 10, y: lerp(210, 540, k), s: 1, r: T * 30 + d.i * 20, o: on * Math.min(1, (1 - k) * 3) });
      });

      /* v7b — the balance comes down from the light: the one outweighs the ninety-nine */
      const bk = es(t, 1.02, 1.3, ease.out);
      const tilt = -es(t, 1.35, 1.7, ease.back) * 13;
      const by = lerp(-1500, BY, bk);
      pose(pivot, { x: BX, y: by });
      pose(beam, { x: BX, y: by, r: tilt });
      [-1, 1].forEach((side, i) => {
        const r = (tilt * PI) / 180;
        pose(pans[i], { x: BX + side * Math.cos(r) * ARM, y: by + side * Math.sin(r) * ARM });
      });
      const r = (tilt * PI) / 180;
      joyHeap.forEach((h, i) => {
        const k = es(t, 1.3 + i * 0.06, 1.42 + i * 0.06);
        pose(h, { x: BX - Math.cos(r) * ARM + (i - 2) * 22, y: lerp(120, by - Math.sin(r) * ARM + ROD - 30 - (i % 2) * 14, k), o: k > 0 ? 1 : 0, s: 1 });
      });

      S.cam.x = 10;
      S.cam.y = kf(t, [[0, 30], [0.5, -10], [1.2, -30], [1.8, -20]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.0], [1.8, 1.02]]);
    };
  },
};
