// Mt 20,16 — back on the road in Judea, Jesus sits with the Twelve under a broad tree (the parable was his). A long
// painted strip is let down above them: the pay table on the left and the line of labourers, the strong men of the
// first hour at the front and the patched men of the last hour at the very end. As he says it, the two groups trade
// places: the last walk up to the front, glowing, and the first go down to the back. "So the last will be first, and
// the first last."
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, FIRST, LAST, THIRD, MIDDAY, payTable, pose3, slip, hangAt, tr, sheet, shade, mix, bush, rock, olive } from './lib.js';

const GY = 690, JX = 800;
const BW = 620, BH = 230, BY = 176;       // the strip
const SC = 0.5;

export default {
  id: 'mt20-last',
  beats: [
    { v: 16 },
  ],
  cam: { x: [-20, 20], y: [-40, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.5, jerX: 1220, farY: 420, roadX: 820, trees: 14, clouds: [[450, 150, 160], [1080, 120, 120]] });
    const back = S.layer({ par: 0.35, sh: 3 });
    back.add(shadeTree(c, 360, 650, 1.15) + olive(c, 1400, 612, 0.9));

    /* the strip */
    const bL = S.layer({ par: 0.3, sh: 6 });
    const board = sheet().p(c.cut(c.rect(-BW / 2, 0, BW, BH), 0.6, 8), C.wood2).p(c.cut(c.rect(-BW / 2 + 10, 10, BW - 20, BH - 20), 0.5, 8), mix('#f2cdb2', C.parchment, 0.4))
      .p(c.cut([[-BW / 2 + 10, BH - 58], [BW / 2 - 10, BH - 62], [BW / 2 - 10, BH - 10], [-BW / 2 + 10, BH - 10]], 0.6, 8), mix(C.sand, C.sage2, 0.35)).out();
    const boardEl = bL.add(`<g><path d="M${-BW / 2 + 40} 0V-1400M${BW / 2 - 40} 0V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${board}<g transform="translate(${-BW / 2 + 70} ${BH - 20}) scale(${SC + 0.04})">${payTable(c, 130)}</g></g>`);
    const FL = BH - 18;         // the strip's floor, in board coords
    const fig = (o, armF = 10) => `<g>${pose3(c, [{ x: 0, y: 0, s: SC, flip: true, armF, o }])}</g>`;
    const firsts = FIRST.map((o, i) => ({ i, el: bL.add(fig(o, 14)) }));
    const mids = [THIRD[0], MIDDAY[2]].map((o, i) => ({ i, el: bL.add(fig(o, 10)) }));
    const lasts = LAST.map((o, i) => ({ i, el: bL.add(`<g><circle cy="-40" r="42" fill="url(#halo-glow)" class="gl"/>${pose3(c, [{ x: 0, y: 0, s: SC, flip: true, armF: 60, o }])}</g>`) }));
    const tagL = bL.add(`<g>${slip(c, tr('ostatni', 'the last'), { size: 17 })}</g>`);
    const tagF = bL.add(`<g>${slip(c, tr('pierwsi', 'the first'), { size: 17 })}</g>`);

    /* Jesus and the Twelve, sitting */
    const P = S.layer({ par: 0.5, sh: 5 });
    const SEAT = [[470, 712], [540, 700], [610, 716], [680, 704], [548, 736], [646, 744], [920, 704], [990, 716], [1060, 700], [1130, 712], [954, 744], [1052, 736]];
    const dis = TWELVE.map((d, i) => ({ i, p: S.puppet(P.add(person(c, { ...d.o, pose: i % 4 === 3 ? 'kneel' : 'sit' }))), at: SEAT[i], seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 190, 1000, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: 0 });
      const down = es(t, -0.3, 0.12, ease.back);
      const by = lerp(-360, BY, down);
      hangAt(boardEl, 800, by, 0, 0, 0);
      const swap = es(t, 0.3, 0.66);
      // front of the line is next to the table (left); spacing along the strip
      const at = (k) => [800 - BW / 2 + 140 + k * 44, by + FL];
      firsts.forEach((m) => {
        const k0 = m.i, k1 = 5 + m.i;
        const [x, y] = at(lerp(k0, k1, swap));
        pose(m.el, { x, y: y + Math.sin(swap * Math.PI) * 14, o: down > 0.01 ? 1 : 0 });
      });
      mids.forEach((m) => { const [x, y] = at(lerp(5 + m.i, 3 + m.i, swap)); pose(m.el, { x, y, o: down > 0.01 ? 1 : 0 }); });
      lasts.forEach((m) => {
        const k0 = 7 + m.i, k1 = m.i;
        const [x, y] = at(lerp(k0, k1, swap));
        pose(m.el, { x, y: y - Math.sin(swap * Math.PI) * 16, o: down > 0.01 ? 1 : 0 });
      });
      const [lx] = at(lerp(8, 1, swap)), [fx] = at(lerp(2, 7, swap));
      pose(tagL, { x: lx, y: by + 40, r: -3, o: es(t, 0.15, 0.3) });
      pose(tagF, { x: fx, y: by + 40, r: 3, o: es(t, 0.15, 0.3) });
      lasts.forEach((m) => { const g = m.el.querySelector('.gl'); pose(g, { y: -40, o: es(t, 0.55, 0.7) }); });

      jesus.set({ x: JX, y: GY, s: 1.02, armF: 30 + es(t, 0.05, 0.3) * 50, armB: bump(t, 0.3, 0.7) * 100 + es(t, 0.6, 0.8) * 40, head: -es(t, 0.05, 0.3) * 6, blink: blinkAt(T) });
      dis.forEach((d) => {
        const [x, y] = d.at;
        d.p.set({ x, y, s: 0.8 + (y - 700) / 600, flip: x > JX, head: -8 - es(t, 0.2, 0.5) * 6, armF: 20 + (d.i % 3 === 0 ? es(t, 0.6, 0.8) * 30 : 0), blink: blinkAt(T, d.seed) });
      });
      S.cam.y = -30 + es(t, 0, 0.6) * 20;
      S.cam.z = 1.02;
    };
  },
};
