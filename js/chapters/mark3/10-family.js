// Mk 3,31–35 — the same house, full of people sitting round Jesus. His mother and brothers stand
// outside the open door and send in word; a boy threads his way through the crowd with the message.
// "Who are my mother and my brothers?" He looks round at them all — "Here are my mother and my
// brothers!" — and a warm ring of light joins everyone who does God's will, reaching out of the door too.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, cloud, olive, bush, sun } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { houseSection, LOOK, man, woman, headAt, handAt, bubble, question, strip, spark, heart } from './lib.js';

const PI = Math.PI;
const PAR = 0.4;
const X0 = 520, X1 = 1080, FLOOR = 652, CEIL = 300;
const JX = 820, JY = 650;

export default {
  id: 'm3-family',
  beats: [
    { v: 31 },
    { v: 32, text: 'Właśnie tłum ludzi siedział wokół Niego,' },
    { v: 32, cont: true, text: 'gdy Mu powiedzieli: «Oto Twoja Matka i bracia na dworze pytają się o Ciebie».' },
    { v: 33 },
    { v: 34, text: 'I spoglądając na siedzących dokoła Niego rzekł:' },
    { v: 34, cont: true, text: '«Oto moja matka i moi bracia.' },
    { v: 35 },
  ],
  cam: { x: [-60, 20], y: [-30, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DAY = ['#d6e3dc', '#f1e6cc', '#f6e3c6'];
    const EVE = [mix(C.duskViolet, C.skyBlue, 0.4), mix(C.dawn, C.dusk, 0.3), C.apricot];
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1210, y: 200, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 160), { x: 470, y: 140, len: 600 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 470, amps: [22, 9, 3], lens: [900, 300, 120], color: C.hillFar }).markup);
    S.layer({ par: 0.2, sh: 3 }).add(hillsWith(c, { y: 530, amps: [12, 6, 2], lens: [800, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 }).markup);

    /* outside, behind the house: his mother and brothers at the door */
    const outL = S.layer({ par: PAR, sh: 3 });
    outL.add(sheet().p(c.cut([[-900, 590], [2500, 590], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out() + olive(c, 330, 610, 1) + olive(c, 1290, 614, 0.9));
    const outGlow = outL.add(`<g opacity="0"><ellipse rx="120" ry="150" fill="url(#warm-glow)"/></g>`);
    const FAM = [
      { o: LOOK.mary, x: 632, s: 0.74 },
      { o: { robe: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather }, x: 596, s: 0.72 },
      { o: { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2 }, x: 672, s: 0.73 },
      { o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, skin: C.skin2 }, x: 560, s: 0.7 },
    ].map((f, i) => ({ ...f, i, y: 616, seed: c.rr(0, 9), p: S.puppet(outL.add(person(c, f.o))) }));
    const boyOut = S.puppet(outL.add(person(c, man(c, { robe: C.wheatRobe, beard: 'none', hairStyle: 'curly' }))));

    /* the house */
    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL, doorX: 50, doorW: 140, doorH: 206 });
    const houseL = S.layer({ par: PAR, sh: 4 });
    houseL.add(H.back);

    /* inside: the ring of light, the circle of people, Jesus */
    const ringL = S.layer({ par: PAR, sh: 1, flat: true });
    const ring = ringL.add(`<g opacity="0"><ellipse rx="300" ry="62" fill="url(#warm-glow)"/><path d="${c.ribbon(c.arc(0, 0, 290, 56, 0, PI * 2, 60), 4)}" fill="${C.halo}" opacity=".8"/></g>`);
    const threadsL = S.layer({ par: PAR, sh: 1, flat: true });
    const inL = S.layer({ par: PAR, sh: 4 });
    const SEAT = [
      // back row (behind Jesus)
      { x: 752, y: 610, s: 0.64, p: 'sit', label: tr('brat', 'brother') }, { x: 900, y: 608, s: 0.64, p: 'kneel', w: true },
      { x: 970, y: 612, s: 0.66, p: 'sit' }, { x: 1036, y: 616, s: 0.66, p: 'sit' },
      // middle row
      { x: 560, y: 650, s: 0.76, p: 'sit' }, { x: 646, y: 654, s: 0.76, p: 'kneel', w: true },
      // front row
      { x: 606, y: 688, s: 0.84, p: 'sit' }, { x: 700, y: 692, s: 0.86, p: 'sit' },
      { x: 944, y: 692, s: 0.86, p: 'sit', w: true, label: tr('siostra', 'sister') }, { x: 1030, y: 688, s: 0.84, p: 'sit', w: true, old: true, label: tr('matka', 'mother') },
    ].map((m, i) => {
      const look = m.w ? woman(c, m.old ? { veil: C.stone, hair: C.greyHair } : {}) : man(c);
      m.i = i; m.flip = m.x > JX; m.seed = c.rr(0, 9);
      m.glow = inL.add(`<g opacity="0">${spark(c, 9)}</g>`);
      m.pp = S.puppet(inL.add(person(c, { ...look, pose: m.p })));
      const [hx, hy] = headAt(m.x, m.y, m.s, m.flip, m.p);
      m.hx = hx; m.hy = hy;
      return m;
    });
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const boy = S.puppet(inL.add(person(c, man(c, { robe: C.wheatRobe, beard: 'none', hairStyle: 'curly' }))));
    // golden threads from Jesus to each person (and out through the door)
    const [jhx, jhy] = headAt(JX, JY, 0.96, false, 'sit');
    const TH = SEAT.map((m) => {
      const x0 = jhx, y0 = jhy + 40, x1 = m.hx, y1 = m.hy + 30 * m.s;
      const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 40;
      const d = `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      const len = Math.hypot(x1 - x0, y1 - y0) * 1.25;
      const el = threadsL.add(`<g><path d="${d}" fill="none" stroke="${C.sun}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${len.toFixed(0)}" stroke-dashoffset="${len.toFixed(0)}" opacity=".85"/></g>`);
      return { el: el.firstElementChild, len };
    });
    const doorThread = (() => {
      const x0 = jhx, y0 = jhy + 40, x1 = 630, y1 = 500;
      const d = `M${x0} ${y0}Q${(x0 + x1) / 2} ${Math.min(y0, y1) - 70} ${x1} ${y1}`;
      const len = Math.hypot(x1 - x0, y1 - y0) * 1.3;
      const el = threadsL.add(`<g><path d="${d}" fill="none" stroke="${C.sun}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${len.toFixed(0)}" stroke-dashoffset="${len.toFixed(0)}" opacity=".85"/></g>`);
      return { el: el.firstElementChild, len };
    })();

    /* the cut edges of the house */
    const frontL = S.layer({ par: PAR, sh: 5 });
    frontL.add(H.front);

    /* words: the message, the question, the names of a family */
    const wordL = S.layer({ par: PAR, sh: 6 });
    const msg = wordL.add(`<g opacity="0">${bubble(c, tr(['Twoja Matka i bracia', 'pytają o Ciebie!'], ['Your mother and brothers', 'are asking for you!']), { size: 17, tail: 1 })}</g>`);
    const ask = wordL.add(`<g opacity="0"><g transform="scale(1.7)">${question(c)}</g></g>`);
    const hearts = SEAT.map(() => wordL.add(`<g opacity="0">${heart(c, 12)}</g>`));
    const LABELS = SEAT.filter((m) => m.label).map((m, k) => ({ m, k, el: wordL.add(`<g opacity="0">${strip(c, m.label, { size: 19 })}</g>`) }));

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 200, 975, 220, C.sage, C.moss) + rock(c, 1390, 985, 190, 64, C.rock2));

    return (t, time) => {
      const T = time;
      sk.blend(DAY, EVE, es(t, 3, 7, ease.sine) * 0.8);
      swing(sunEl, 1210, 200 + es(t, 0, 7) * 120, T, 1, 0.6);
      swing(cl1, 470 + t * 8, 140, T, 1.4, 0.6, 1);

      /* beat 0: his mother and brothers arrive outside and send word in */
      FAM.forEach((f) => {
        const come = es(t, 0.02 + f.i * 0.06, 0.5 + f.i * 0.06);
        const x = lerp(f.x - 330, f.x, come);
        const call = f.i === 0 ? bump(t, 0.45, 1.0) : 0;
        const warm = es(t, 6.2, 6.6);
        f.p.set({ x, y: f.y, s: f.s, flip: false, walk: come > 0 && come < 1 ? x * 0.06 : undefined, armF: call * 70 + warm * (f.i === 0 ? 50 : 30), armB: warm * (f.i === 0 ? 40 : 0), head: -call * 4 + es(t, 2.2, 2.5) * -4 - warm * 6, blink: blinkAt(T, f.seed) });
      });
      // the boy: outside, then in through the door, then weaving through the crowd to Jesus
      const bIn = es(t, 0.55, 0.62);
      const bw = seg(t, 0.6, 2.35);
      boyOut.set({ x: lerp(560, 650, es(t, 0.3, 0.58)), y: 620, s: 0.62, o: t > 0.28 ? 1 - bIn : 0, walk: t > 0.3 && t < 0.58 ? t * 40 : undefined, blink: 0 });
      const path = [[650, 646], [700, 660], [740, 668], [772, 664]];
      const seg_ = Math.min(path.length - 2, Math.floor(ease.io(bw) * (path.length - 1)));
      const u = ease.io(bw) * (path.length - 1) - seg_;
      const bx = lerp(path[seg_][0], path[seg_ + 1][0], u), by = lerp(path[seg_][1], path[seg_ + 1][1], u);
      const tell = es(t, 2.05, 2.25) * (1 - es(t, 3.0, 3.2));
      boy.set({ x: bx, y: by, s: 0.64, o: bIn * (1 - es(t, 3.3, 3.6)), flip: false, walk: bw > 0 && bw < 1 && (bw < 0.1 || bw > 0.55) ? bx * 0.08 : undefined, armF: tell * 60, armB: tell * 120, head: -tell * 4, blink: blinkAt(T, 3) });

      /* the people sitting round him */
      const settle = es(t, 1.02, 1.4);
      const toDoor = es(t, 2.15, 2.35) * (1 - es(t, 3.0, 3.3));
      const lookK = seg(t, 4.05, 4.9);
      const openArms = es(t, 5.05, 5.35);
      SEAT.forEach((m) => {
        const seen = es(t, 4.05 + (m.x - 540) / 560 * 0.8, 4.2 + (m.x - 540) / 560 * 0.8);
        const warm = es(t, 6.05 + m.i * 0.03, 6.3 + m.i * 0.03);
        m.pp.set({ x: m.x, y: m.y, s: m.s, flip: toDoor > 0.5 ? m.x > 650 : m.flip, lean: (m.flip ? -1 : 1) * settle * 3, head: -settle * 4 + toDoor * 6 - seen * 4 - warm * 6, armF: seen * 20 + warm * (m.i % 2 ? 60 : 30), armB: warm * (m.i % 3 === 0 ? 50 : 0), blink: blinkAt(T, m.seed) });
        pose(m.glow, { x: m.hx, y: m.hy - 30 * m.s, s: m.s * 1.3, o: seen * (1 - es(t, 5.9, 6.2) * 0.4) * 0.9 });
      });
      pose(ring, { x: JX - 20, y: 668, s: 0.7 + settle * 0.2 + es(t, 6.05, 6.5) * 0.12, o: settle * 0.35 + openArms * 0.25 + es(t, 6.05, 6.4) * 0.4 });

      /* Jesus */
      const looking = lookK > 0 && lookK < 1;
      const lookFlip = looking ? Math.sin(lookK * PI * 2) < 0 : false;
      jesus.set({
        x: JX, y: JY, s: 0.96, flip: looking ? lookFlip : t > 2.1 && t < 3 ? true : false,
        armF: 24 + bump(t, 1.1, 1.9) * 30 + es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1)) * 50 + openArms * 60,
        armB: 12 + es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1)) * 30 + openArms * 70,
        head: -3 + (looking ? Math.sin(lookK * PI * 4) * 4 : 0) + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });

      /* words */
      pose(msg, { x: 690, y: 470, s: es(t, 2.2, 2.4, ease.back), o: t > 2.2 && t < 3.1 ? 1 - es(t, 2.9, 3.05) : 0 });
      pose(ask, { x: JX + 6, y: 430 + Math.sin(T * 1.5) * 3, s: es(t, 3.08, 3.3, ease.back), r: Math.sin(T * 1.1) * 4, o: t > 3.05 && t < 4.1 ? 1 - es(t, 3.9, 4.05) : 0 });
      TH.forEach((th, i) => attr(th.el, 'stroke-dashoffset', (th.len * (1 - es(t, 5.1 + i * 0.03, 5.45 + i * 0.03))).toFixed(1)));
      attr(doorThread.el, 'stroke-dashoffset', (doorThread.len * (1 - es(t, 6.2, 6.6))).toFixed(1));
      SEAT.forEach((m, i) => pose(hearts[i], { x: m.hx + (m.flip ? -1 : 1) * 4, y: m.hy + 44 * m.s, s: m.s * es(t, 5.3 + i * 0.03, 5.5 + i * 0.03, ease.back), o: t > 5.3 ? 0.95 : 0 }));
      LABELS.forEach((l) => pose(l.el, { x: l.m.hx, y: l.m.hy - 58 * l.m.s - 10, s: es(t, 6.1 + l.k * 0.07, 6.3 + l.k * 0.07, ease.back), r: -3 + l.k * 2, o: t > 6.1 ? 1 : 0 }));
      pose(outGlow, { x: 632, y: 540, o: es(t, 6.3, 6.7) * 0.8 });

      // phone: a little to the right, so the people sitting by the right wall clear the thread
      S.cam.x = -es(t, -0.3, 0.4) * 50 + es(t, 0.9, 1.4) * 40 + es(t, 5.9, 6.4) * -20 + (S.portrait ? 25 : 0);
      S.cam.z = 1 + es(t, 0.9, 1.4) * 0.06 + es(t, 3.9, 4.3) * 0.05 - es(t, 5.9, 6.4) * 0.1;
      S.cam.y = es(t, 0.9, 1.4) * 20 + es(t, 3.9, 4.3) * 10 - es(t, 5.9, 6.4) * 30;
    };
  },
};
