// Mt 6,16–18 — the market street again. A hypocrite who is fasting drags himself along in sackcloth with a long face;
// he rubs ashes onto his head and his face greys over, and the street points at him: look, he fasts. The wreath comes
// down onto him, and dries. Then the camera moves to the quiet man's house, cut open: he washes his face at the basin
// and anoints his head with oil, and it shines; he steps out into the street and the neighbours just wave good
// morning — nobody can tell. "Your Father who sees in secret": the shaft of light and the gold star.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, palm, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hypocrite, QUIET, manOf, womanOf, streetRow, street, wreath, dryLeaf, strip, secretShaft, rewardStar, withFace, oilFlask, basinParts, ewer,
  waterStream, splash, handAt, headAt, kf, moving, tr, PI,
} from './lib.js';

const GY = 704;
const RX0 = 1120, RX1 = 1500, RT = 430;   // the house, cut open
const BASX = 1330;                        // the basin
const DOORX = 1150;                       // its street door (left wall)

export default {
  id: 'mt6-fast',
  enter: 'fly',
  beats: [
    { v: 16, text: 'Kiedy pościcie, nie bądźcie posępni jak obłudnicy.' },
    { v: 16, cont: true, text: 'Przybierają oni wygląd ponury, aby pokazać ludziom, że poszczą.' },
    { v: 16, cont: true, text: 'Zaprawdę, powiadam wam: już odebrali swoją nagrodę.' },
    { v: 17 },
    { v: 18, text: 'aby nie ludziom pokazać, że pościsz, ale Ojcu twemu, który jest w ukryciu.' },
    { v: 18, cont: true, text: 'A Ojciec twój, który widzi w ukryciu, odda tobie.' },
  ],
  cam: { x: [-320, 660], y: [-40, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, ['#c6dcd8', '#eee6cc', '#f7e8cc']);
    const P = S.portrait;
    const SUNX = P ? 1000 : 1180;   // phone: the sun hangs inside the screen, not half under the thread
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: SUNX, y: 160, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 640, y: 200, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [14, 6, 3], lens: [1000, 340, 120], color: C.hillFar, x1: 3200 }).markup);
    const hl = S.layer({ par: 0.16, sh: 3 });
    hl.add(hillsWith(c, { y: 470, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20, x1: 3200 }).markup);
    const row = S.layer({ par: 0.4, sh: 4 });
    row.add(streetRow(c, { base: 604, x1: 3400 }) + palm(c, 420, 606, 160) + olive(c, 980, 608, 0.7));

    /* market stalls along the street */
    const stallL = S.layer({ par: 0.8, sh: 4 });
    const st = sheet();
    [[260, C.terracotta], [640, C.dustyBlue]].forEach(([x, col]) => {
      st.p(c.cut(c.rect(x - 4, GY - 200, 8, 170), 0.3, 6) + c.cut(c.rect(x + 176, GY - 200, 8, 170), 0.3, 6), C.wood2);
      st.p(c.cut([[x - 20, GY - 204], [x + 200, GY - 204], [x + 190, GY - 170], [x - 10, GY - 170]], 0.5, 6), col);
      let str = '';
      for (let k = 0; k < 6; k++) str += c.cut(c.rect(x - 14 + k * 36, GY - 204, 16, 34), 0.3, 4);
      st.x(str, C.cream, 'opacity=".6"');
      st.p(c.cut(c.rect(x - 10, GY - 80, 200, 50), 0.4, 6), C.wood);
      st.p(c.cut(c.blob(x + 40, GY - 90, 26, 12, 10, 0.2), 0.4, 4) + c.cut(c.blob(x + 90, GY - 92, 22, 12, 10, 0.2), 0.4, 4), C.wheat2);
      st.p(c.cut(c.blob(x + 144, GY - 90, 24, 12, 10, 0.2), 0.4, 4), mix(C.terracotta, C.roseRobe, 0.3));
    });
    stallL.add(st.out());
    const ground = S.layer({ par: 0.8, sh: 3 });
    ground.add(street(c, { y: GY - 30, x1: 3200 }));

    /* the house cut open: a wall, a basin on a stand, a shelf with the oil */
    const roomL = S.layer({ par: 0.8, sh: 4 });
    const rs = sheet();
    const wall = mix(C.plaster2, C.dawn, 0.25);
    rs.p(c.cut([[RX0 - 30, RT - 26], [RX1 + 30, RT - 26], [RX1 + 30, GY - 20], [RX0 - 30, GY - 20]], 0.5, 10), C.plaster);
    rs.p(c.cut([[RX0, RT], [RX1, RT], [RX1, GY - 24], [RX0, GY - 24]], 0.5, 10), wall);
    rs.p(c.cut([[RX0 - 40, RT - 40], [RX1 + 40, RT - 40], [RX1 + 40, RT - 20], [RX0 - 40, RT - 20]], 0.4, 10), C.roof);
    rs.p(c.cut(c.rect(RX0 + 30, GY - 24 - 160, 76, 160), 0.3, 6), mix(C.cream, C.sand, 0.3));
    rs.p(c.cut(c.rect(RX1 - 110, RT + 70, 90, 8), 0.3, 5), C.wood);
    rs.p(c.cut(c.rect(BASX - 6, GY - 90, 12, 66), 0.2, 4) + c.cut(c.rect(BASX - 30, GY - 30, 60, 8), 0.2, 4), C.wood2);
    rs.p(c.cut(c.rect(RX0 + 250, RT + 50, 70, 56), 0.3, 4), mix(C.skyBlue, C.cream, 0.4));
    roomL.add(rs.out());
    const B = basinParts(c, 90);
    roomL.add(`<g transform="translate(${BASX} ${GY - 88})">${B.back}${B.water}${B.front}</g>`);
    const flask = roomL.add(`<g>${oilFlask(c)}</g>`);
    const ewerEl = roomL.add(`<g>${ewer(c)}</g>`);

    /* the people of the street */
    const act = S.layer({ par: 0.8, sh: 5 });
    const PASS = [
      { o: womanOf(c, { robe: C.tealRobe }), x: 330, y: 24, flip: false, x2: 560 },
      { o: manOf(c, { belt: C.leather }), x: 410, y: 34, flip: false, x2: 650 },
      { o: womanOf(c), x: P ? 730 : 760, y: 20, flip: true, x2: 1010 },
      { o: manOf(c, { mantle: C.clayMantle }), x: P ? 818 : 850, y: 36, flip: true, x2: 1090 },   // phone: clear of the thread
    ].map((m, i) => ({ ...m, i, p: S.puppet(act.add(person(c, m.o))), seed: c.rr(0, 9) }));
    const ink = C.inkSoft;
    const sadBrows = `<path d="${c.ribbon([[-1, -6.6], [7.2, -10.4]], 2.6) + c.ribbon([[10, -10.4], [16.5, -6.8]], 2.4)}" fill="${ink}"/><path d="${c.ribbon(c.arc(10, 12, 3.4, 2.4, PI + 0.3, 2 * PI - 0.3, 6), 1.3)}" fill="${ink}"/>`;
    const ashes = `<g data-k="ash" opacity="0"><path d="${c.cut(c.blob(2, -16, 16, 7, 10, 0.3), 0.8, 4) + c.cut(c.blob(8, -2, 7, 5, 8, 0.4), 0.6, 3) + c.cut(c.blob(-4, 4, 5, 4, 8, 0.4), 0.6, 3)}" fill="${mix(C.rock3, C.storm, 0.3)}" opacity=".75"/></g>`;
    const hypO = { ...hypocrite(2), robe: mix(C.rock3, C.soil, 0.25), mantle: mix(C.soil, C.rock3, 0.4), veil: C.rock2, veil2: C.rock3 };
    const hyp = S.puppet(act.add(withFace(person(c, hypO), sadBrows + ashes)));
    const ashEl = S.$('ash');
    const dust = [0, 1, 2, 3].map(() => act.add(`<path d="${c.poly(c.circ(0, 0, 3, 6))}" fill="${C.rock3}"/>`));
    const wr = hanging(act, `<g data-k="f-wrG">${wreath(c, { r: 25 })}</g><g data-k="f-wrD" opacity="0">${wreath(c, { r: 25, dry: true })}</g>`, { x: 0, y: 0, len: 900 });
    const wrG = S.$('f-wrG'), wrD = S.$('f-wrD');
    const reward = act.add(`<g>${strip(c, tr('nagroda', 'their reward'), { size: 17 })}</g>`);
    const leaves = [0, 1, 2, 3, 4].map(() => act.add(`<g>${dryLeaf(c)}</g>`));
    const points = [0, 1].map(() => act.add(`<g>${strip(c, tr('pości!', 'he fasts!'), { size: 15 })}</g>`));

    /* the quiet man */
    const shaftL = S.layer({ par: 0.8, sh: 0, flat: true });
    const shaft = shaftL.add(`<g>${secretShaft(c, { w1: 180 })}</g>`);
    const qL = S.layer({ par: 0.8, sh: 5 });
    const quiet = S.puppet(qL.add(withFace(person(c, QUIET), `<g data-k="shine" opacity="0"><path d="${c.ribbon(c.arc(0, 0, 21, 21, PI * 1.15, PI * 1.6, 8), 3)}" fill="#fff8e2"/><path d="${c.poly(c.star(-6, -20, 6, 1.4, 4, 0))}" fill="#fff8e2"/></g>`)));
    const shine = S.$('shine');
    const drops = qL.add(`<g>${splash(c, 16, 6)}</g>`);
    const oilD = qL.add(`<path d="${c.cut([[0, -8], [4, 0], [2, 3], [-2, 3], [-4, 0]], 0.1, 2)}" fill="${C.sun}"/>`);
    const starEl = qL.add(`<g>${rewardStar(c, 15)}</g>`);
    // the front edges of the cut-open house
    const edge = S.layer({ par: 0.8, sh: 6 });
    const e = sheet();
    e.p(c.cut([[RX1 + 8, RT - 30], [RX1 + 40, RT - 30], [RX1 + 40, GY - 16], [RX1 + 8, GY - 16]], 0.4, 8), shade(C.plaster, -0.04));
    e.p(c.cut([[RX0 - 40, RT - 30], [RX0 - 8, RT - 30], [RX0 - 8, GY - 196], [RX0 - 40, GY - 196]], 0.4, 8), shade(C.plaster, -0.04));
    e.p(c.cut([[RX0 + 10, GY - 22], [RX1 + 50, GY - 22], [RX1 + 50, GY - 4], [RX0 + 10, GY - 4]], 0.4, 10), C.stone2);
    edge.add(e.out());

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: SUNX, y: 160, r: T ? Math.sin(T * 0.6) : 0 });
      pose(cl, { x: 640 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 200, r: T ? Math.sin(T * 0.6 + 1) * 1.2 : 0 });

      /* v16a — he drags himself along, long-faced; v16b — ashes, the street points */
      const HK = [[0.0, 20], [0.9, 560]];
      const hx = kf(t, HK, (u) => u);
      const smear = bump(t, 1.05, 1.4);
      const off = es(t, 2.92, 3.1);
      hyp.set({ x: hx, y: GY + 46, s: 1.08, walk: t < 0.9 ? hx * 0.035 : undefined, amt: 0.6, armF: 8 + smear * 150, armB: 4, head: 16 - smear * 10, lean: 7, blink: blinkAt(T, 1), o: 1 - off });
      fade(ashEl, es(t, 1.1, 1.35));
      const [ax, ay] = headAt(hx, GY + 46, 1.08, false);
      dust.forEach((d, i) => {
        const k = seg(t, 1.15 + i * 0.05, 1.5 + i * 0.05);
        pose(d, { x: ax + 6 + (i - 1.5) * 6, y: ay + k * 120, o: k > 0 && k < 1 ? 0.8 : 0 });
      });
      PASS.forEach((m) => {
        const look = es(t, 1.2 + m.i * 0.05, 1.4 + m.i * 0.05);
        const flip = look > 0.5 ? m.x > hx : m.flip;
        const later = t > 4.0;
        const wave = bump(t, 4.5 + m.i * 0.06, 4.95 + m.i * 0.04);
        m.p.set({ x: later ? m.x2 : m.x, y: GY + m.y, s: 0.92, flip: later ? m.x2 > 820 : flip, armF: later ? 14 + wave * 20 : 14 + look * (m.i % 2 ? 80 : 30) * (1 - es(t, 2.6, 2.9)), armB: later ? 10 + wave * 120 : 10, head: later ? wave * 4 : -look * 4, blink: blinkAt(T, m.seed), o: later ? es(t, 4.1, 4.3) : 1 - off });
      });
      points.forEach((p, i) => {
        const k = es(t, 1.4 + i * 0.1, 1.55 + i * 0.1, ease.back) * (1 - es(t, 1.95, 2.1));
        pose(p, { x: [370, 810][i], y: GY - 220 - i * 10, s: k, r: i ? 4 : -4, o: k > 0.02 ? 1 : 0 });
      });

      /* v16c — the wreath, and it dries */
      const wk = es(t, 2.04, 2.32, ease.out);
      const hhx = hx + 2, hhy = GY + 46 - 167 * 1.08 + 6;
      pose(wr, { x: hhx + 2, y: lerp(-500, hhy - 8, wk), r: 0, o: wk > 0.01 ? 1 - off : 0 });
      const dry = es(t, 2.4, 2.64);
      fade(wrG, 1 - dry); fade(wrD, dry);
      const rk = es(t, 2.2, 2.36, ease.back);
      pose(reward, { x: hhx + 4, y: hhy - 54, s: rk, r: -4, o: rk > 0.02 ? 1 - off : 0 });
      leaves.forEach((l, i) => {
        const k = seg(t, 2.46 + i * 0.05, 2.96 + i * 0.02);
        pose(l, { x: hhx + (i - 2) * 12 + Math.sin(k * 6 + i) * 12, y: hhy + k * 190, r: k * 300 + i * 40, o: k > 0 && k < 1 ? 1 - off : 0 });
      });

      /* v17 — at home: he washes his face and anoints his head */
      const wash = bump(t, 3.1, 3.45);
      const anoint = bump(t, 3.5, 3.85);
      const smile = es(t, 3.8, 3.95);
      const QK = [[3.0, BASX - 70], [3.98, BASX - 70], [4.3, DOORX + 60], [4.42, DOORX - 60], [4.8, 820]];
      const qx = kf(t, QK);
      const qm = moving(t, QK);
      const flipQ = t > 3.98 && t < 4.95;
      const recv = es(t, 5.3, 5.55);
      quiet.set({ x: qx, y: GY - 20 + es(t, 4.3, 4.42) * 30, s: 0.98, flip: flipQ, walk: qm ? qx * 0.06 : undefined, armF: 14 + wash * 130 + recv * 60, armB: 8 + anoint * 150 + recv * 56 + bump(t, 4.5, 4.8) * 80, head: wash * 16 - anoint * 10 - es(t, 5.1, 5.3) * 12, lean: wash * 12, blink: blinkAt(T, 2), o: seg(t, 2.95, 3.0) });
      fade(shine, es(t, 3.7, 3.9));
      const [fx, fy] = headAt(BASX - 70, GY - 20, 0.98, false);
      pose(drops, { x: fx + 14, y: fy + 4, s: 0.6 + wash * 0.6, r: T * 20, o: wash > 0.3 ? 1 : 0 });
      pose(ewerEl, { x: BASX + 50, y: GY - 88, r: -bump(t, 3.05, 3.25) * 40 });
      pose(flask, { x: RX1 - 60 - anoint * 110, y: RT + 70 - anoint * 110, r: -anoint * 110 });
      const od = seg(t, 3.66, 3.8);
      pose(oilD, { x: fx + 2, y: fy - 40 + od * 24, o: od > 0 && od < 1 ? 1 : 0 });

      /* v18a — out into the street: the neighbours just wave */
      /* v18b — the shaft, the star */
      const sk = es(t, 5.02, 5.3);
      pose(shaft, { x: 820, y: GY + 10, sx: 0.3 + sk * 0.7, o: sk });
      const stK = es(t, 5.2, 5.55, ease.out);
      const [rx, ry] = handAt(820, GY - 20 + 30, 0.98, false, 74);
      pose(starEl, { x: rx + 8, y: lerp(-100, ry - 10, stK) + (T ? Math.sin(T * 2) * 3 : 0) * stK, s: 0.8 + stK * 0.3, r: T * 25, o: stK > 0.01 ? 1 : 0 });

      /* camera: the street → the house → back to the street */
      const toHouse = es(t, 2.9, 3.2), back = es(t, 4.2, 4.7);
      S.cam.x = lerp(-280, 640, toHouse) - back * 520;
      S.cam.z = 1.04 + toHouse * 0.08 * (1 - back);
      S.cam.y = -10 + toHouse * 20 * (1 - back);
    };
  },
};
