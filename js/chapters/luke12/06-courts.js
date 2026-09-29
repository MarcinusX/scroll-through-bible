// Łk 12,11–12 — a dark pillared hall. Two soldiers bring Peter and John in from the left, and as they are led past,
// the three seats light up one after the other: the elders of the synagogue on their bench, the ruler on his high seat
// at the back, the Roman magistrate under his awning. "Do not be anxious how or what you will answer": the three point
// and question them; a grey worry-cloud of crossed-out words gathers over Peter — then it breaks up and blows away, and
// an hourglass comes down: the hour. "For the Holy Spirit will teach you in that same hour what you must say": the dove
// comes down over him in a shaft of light, little golden slips float down into his hands, and he lifts his hand and
// speaks — golden words go out to all three seats, and the judges lean forward to listen.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { soldier } from '../mark15/lib.js';
import { elder, priest } from '../mark11/lib.js';
import { throne } from '../mark6/lib.js';
import { goldSlip, lightShaft } from '../matthew4/lib.js';
import { hallSet, judgeSeat, worryCloud, hourglass, dove, flapWings, headAt, hand, alongPts, halo, warm, PI } from './lib.js';

const GY = 712;
const PX = 740, JX2 = 832;                  // where Peter and John stand
const SEATS = [{ x: 430, y: 646 }, { x: 800, y: 520 }, { x: 1130, y: 652 }];

export default {
  id: 'lk12-courts',
  beats: [
    { v: 11, text: 'Kiedy was ciągać będą do synagog, urzędów i władz,' },
    { v: 11, cont: true, text: 'nie martwcie się, w jaki sposób albo czym macie się bronić lub co mówić,' },
    { v: 12 },
  ],
  cam: { x: [-60, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const H = hallSet(S);
    const c = S.c;
    /* the three seats and their spots of light */
    const glowL = S.layer({ par: 0.4, sh: 0, flat: true });
    const spots = SEATS.map((s) => glowL.add(`<g opacity="0">${warm(170, 0.9)}</g>`));
    const seatL = S.layer({ par: 0.42, sh: 4 });
    const benchC = mix(C.wood, C.plumRobe, 0.2);
    seatL.add(`<g transform="translate(${SEATS[0].x} ${SEATS[0].y})">${sheet().p(c.cut(c.rect(-110, -20, 220, 20), 0.3, 6), mix(C.stone2, C.plumRobe, 0.3)).p(c.cut(c.rect(-96, -58, 192, 10), 0.3, 6), benchC).p(c.cut(c.rect(-88, -48, 8, 28), 0.2, 4) + c.cut(c.rect(80, -48, 8, 28), 0.2, 4), shade(benchC, -0.2)).out()}</g>`);
    seatL.add(`<g transform="translate(${SEATS[1].x} ${SEATS[1].y})">${sheet().p(c.cut([[-96, 0], [-84, -20], [84, -20], [96, 0], [96, 190], [-96, 190]], 0.4, 8), mix(C.stone2, C.plumRobe, 0.55)).p(c.cut([[-96, 50], [96, 50], [96, 58], [-96, 58]], 0.3, 8) + c.cut([[-96, 110], [96, 110], [96, 118], [-96, 118]], 0.3, 8), mix(C.stone2, C.plumRobe, 0.4)).out()}<g transform="translate(0 -20) scale(.66)">${throne(c)}</g></g>`);
    seatL.add(`<g transform="translate(${SEATS[2].x} ${SEATS[2].y + 30}) scale(.9)">${judgeSeat(c)}</g>`);
    const judges = S.layer({ par: 0.42, sh: 5 });
    const eld = [0, 1].map((i) => ({ i, p: S.puppet(judges.add(elder(c, i, { pose: 'sit' }))) }));
    const ruler = S.puppet(judges.add(priest(c, 1, { pose: 'sit' })));
    const roman = S.puppet(judges.add(person(c, { robe: C.linen, mantle: shade(C.curtain2, 0.05), mantleArm: true, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: null, pose: 'sit' })));

    /* the accused and the guards */
    const fx0 = S.layer({ par: 0.5, sh: 0, flat: true });
    const P = S.layer({ par: 0.5, sh: 5 });
    const shaft = fx0.add(`<g opacity="0">${lightShaft(c, { w0: 26, w1: 76, h: 1000, o: 0.35 })}</g>`);
    const guards = [0, 1].map((i) => ({ i, p: S.puppet(P.add(soldier(c, i + 1, { spear: 34 }))) }));
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const john = S.puppet(P.add(person(c, CAST.john)));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const cloud = fx.add(`<g opacity="0"><g transform="scale(2.2)">${worryCloud(c)}</g></g>`);
    const puffs = [0, 1, 2, 3].map(() => fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 14, 10, 9, 0.3), 0.6, 4)}" fill="${C.storm}"/></g>`));
    const glass = fx.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-48" stroke="rgba(240,220,190,.4)" stroke-width="1.2" fill="none"/>${hourglass(c, 70)}</g>`);
    const doveEl = fx.add(dove(c));
    const doveGlow = fx.add(`<g opacity="0">${halo(90, 1)}</g>`);
    const slips = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${goldSlip(c, 34)}</g>`));
    const words = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: fx.add(`<g opacity="0">${goldSlip(c, 30)}</g>`), to: SEATS[i % 3] }));

    return (t, time) => {
      const T = time;
      H.update(T);
      /* v11a — dragged before synagogues, rulers and authorities */
      const walk = es(t, 0.02, 0.62, (x) => x);
      const px = lerp(180, PX, walk), jx = lerp(100, JX2, walk);
      const moving = walk > 0 && walk < 1;
      const at = [0.12, 0.3, 0.48];
      spots.forEach((el, i) => { fade(el, es(t, at[i], at[i] + 0.1) * (0.8 + bump(t, 2.6, 3.0) * 0.2)); pose(el, { x: SEATS[i].x, y: SEATS[i].y - 90, o: es(t, at[i], at[i] + 0.1) }); });
      const look = t < 0.25 ? -10 : t < 0.45 ? -16 : 0;
      const ask = bump(t, 1.02, 1.5), lean = es(t, 2.6, 2.9);
      const worry = es(t, 1.04, 1.22) * (1 - es(t, 1.48, 1.62));
      const up = es(t, 2.05, 2.3), speak = es(t, 2.55, 2.7);
      peter.set({ x: px, y: GY, s: 0.98, flip: false, walk: moving ? px * 0.05 : undefined, armF: 14 + worry * 30 + es(t, 2.35, 2.5) * 50 * (1 - speak) + speak * 60, armB: 10 + speak * 130, head: moving ? look : 6 * worry - up * 12 + speak * 4, blink: blinkAt(T, 1) });
      john.set({ x: jx, y: GY + 6, s: 0.94, flip: walk >= 1, walk: moving ? jx * 0.05 + 1 : undefined, armF: 14 + bump(t, 2.6, 3.0) * 30, armB: 8, head: moving ? look : 6 - up * 10, blink: blinkAt(T, 2) });
      guards.forEach((g) => {
        const gx = g.i ? lerp(20, 950, walk) : lerp(-60, 560, walk);
        g.p.set({ x: gx, y: GY + 10 - g.i * 4, s: 0.96, flip: walk >= 1 && g.i === 1, walk: moving ? gx * 0.05 + g.i : undefined, armF: 34, armB: 20 + (g.i === 0 && moving ? 40 : 0), head: 0, blink: blinkAt(T, 3 + g.i) });
      });
      eld.forEach((e) => e.p.set({ x: SEATS[0].x - 40 + e.i * 80, y: SEATS[0].y - 16, s: 0.84, flip: false, armF: 20 + (e.i ? ask * 70 : 0) + lean * 20, armB: 10, head: 4 - lean * 8, lean: lean * 8, blink: blinkAt(T, 5 + e.i) }));
      ruler.set({ x: SEATS[1].x, y: SEATS[1].y - 16, s: 0.7, flip: false, armF: 20 + ask * 60 + lean * 20, armB: 10 + ask * 40, head: 8 - lean * 6, lean: lean * 6, blink: blinkAt(T, 7) });
      roman.set({ x: SEATS[2].x + 6, y: SEATS[2].y - 8, s: 0.86, flip: true, armF: 20 + bump(t, 1.2, 1.7) * 80 + lean * 20, armB: 10, head: 4 - lean * 8, lean: lean * 8, blink: blinkAt(T, 8) });

      /* v11b — do not be anxious */
      const [hx, hy] = headAt(PX, GY, 0.98, false);
      pose(cloud, { x: hx - 4, y: hy - 150 + (time ? Math.sin(T * 1.4) * 3 : 0), s: 0.6 + worry * 0.4, o: worry > 0.01 ? worry : 0 });
      puffs.forEach((p, i) => {
        const k = es(t, 1.48, 1.75);
        pose(p, { x: hx + (i - 1.5) * 30 + k * (i - 1.5) * 90, y: hy - 110 - k * 80, s: 1 - k * 0.6, o: k > 0 && k < 1 ? 1 - k : 0 });
      });
      const gk = es(t, 1.45, 1.7, ease.out) * (1 - es(t, 2.9, 3.0));
      pose(glass, { x: hx + 150, y: lerp(-1500, hy - 150, gk), r: (time ? Math.sin(T * 0.8) * 1.5 : 0), oy: 0, o: gk > 0.01 ? 1 : 0 });
      const flipG = es(t, 1.7, 2.6);
      if (glass.querySelector('.sandT')) {
        pose(glass.querySelector('.sandT'), { x: 0, y: -3, sy: 1 - flipG * 0.6 });
      }

      /* v12 — the Spirit teaches him in that same hour */
      const dv = es(t, 2.02, 2.35);
      pose(doveEl, { x: lerp(hx - 300, hx + 6, dv), y: lerp(160, hy - 110, dv), s: 0.9, o: dv > 0.001 ? 1 : 0 });
      flapWings(doveEl, time ? T : 0.3, dv < 1 ? 34 : 16, dv < 1 ? 7 : 2.4);
      pose(doveGlow, { x: hx + 6, y: hy - 118, s: 1, o: dv * 0.8 });
      pose(shaft, { x: hx + 6, y: hy - 70, o: dv });
      slips.forEach((el, i) => {
        const k = es(t, 2.25 + i * 0.07, 2.5 + i * 0.07);
        const [ax, ay] = hand(PX, GY, 0.98, false, 64);
        pose(el, { x: lerp(hx + 20 + (i - 1) * 30, ax, k), y: lerp(hy - 140, ay, k), r: (1 - k) * (i - 1) * 30, s: 1 - k * 0.4, o: k > 0 && k < 1 ? 1 : 0 });
      });
      words.forEach((w) => {
        const k = es(t, 2.6 + w.i * 0.05, 2.95 + w.i * 0.03);
        const dx = w.to.x - hx, dy = w.to.y - 130 - (hy - 10);
        pose(w.el, { x: hx + 20 + dx * k, y: hy - 10 + dy * k - Math.sin(k * PI) * 50, r: Math.sin(k * 6 + w.i) * 12, s: 0.9, o: k > 0 && k < 1 ? 1 : 0 });
      });

      S.cam.x = lerp(-50, 0, es(t, 0.1, 0.6)) + es(t, 2.0, 2.4) * -10;
      S.cam.z = 1.02 + es(t, 1.0, 1.3) * 0.05 - es(t, 2.5, 2.8) * 0.04;
      S.cam.y = es(t, 1.0, 1.3) * 10 - es(t, 2.0, 2.3) * 20;
    };
  },
};
