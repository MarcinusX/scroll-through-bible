// Mt 23,23 — the fourth woe, a painted flat: a courtyard herb garden. The Pharisee stoops over his bed of mint, dill and
// cumin, plucks the sprigs and counts them out on his table, one, two… ten — and with two fingers lays the tenth in the
// tithe dish. Behind him, forgotten in the weeds, lie three great stones of the Law — justice, mercy, faith — tipped
// over, sunk in the earth, spun over with cobwebs. "These you ought to have done": the three stones rise, stand upright
// on their step and glow, the weeds and webs falling away — while the little tithe dish stays where it is, and glows
// too: "without leaving the other undone".
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, grass } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, PH, woeDrop, herb, sprig, titheDish, table, greatWeight, virtueIcon, cobweb, handAt, tr } from './lib.js';

const GY = 650;
const TX = 700;                               // the table
const STONES = [[900, 'justice', ['sprawiedliwość', 'justice'], 12], [1030, 'mercy', ['miłosierdzie', 'mercy'], -9], [1160, 'faith', ['wiara', 'faith'], 7]];

export default {
  id: 'mt23-tithe',
  enter: 'fly',
  beats: [
    { v: 23, text: 'Biada wam, uczeni w Piśmie i faryzeusze, obłudnicy!' },
    { v: 23, cont: true, text: 'Bo dajecie dziesięcinę z mięty, kopru i kminku, lecz pomijacie to, co ważniejsze jest w Prawie: sprawiedliwość, miłosierdzie i wiarę.' },
    { v: 23, cont: true, text: 'To zaś należało czynić, a tamtego nie opuszczać.' },
  ],
  cam: { x: [-20, 120], y: [-30, 10], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#d2e2d8', '#f0e8cf', '#f7e6c6']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 38), { x: 420, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 1060, y: 160, len: 800 });

    /* the courtyard wall with a trellised vine, the paving */
    const back = S.layer({ par: 0.2, sh: 3 });
    const w = sheet();
    const WC = mix(C.plaster, C.sand, 0.25);
    w.p(c.cut([[-900, GY - 20], [-900, 330], [2500, 326], [2500, GY - 20]], 0.6, 16), WC);
    w.p(c.cut([[-900, 334], [2500, 330], [2500, 318], [-900, 322]], 0.4, 12), C.roof);
    w.p(c.cut([[300, GY - 20], [300, 470], ...c.arc(345, 470, 45, 40, Math.PI, 2 * Math.PI, 10), [390, GY - 20]], 0.5, 8), C.wood2);
    let tr_ = '', lv = '';
    for (let x = 520; x < 820; x += 40) tr_ += c.ribbon([[x, 340], [x, GY - 20]], 3);
    for (let y = 360; y < GY - 20; y += 50) tr_ += c.ribbon([[520, y], [800, y]], 3);
    for (let i = 0; i < 40; i++) lv += c.cut(c.ell(c.rr(520, 800), c.rr(340, 480), c.rr(8, 13), c.rr(5, 8), 8, c.rr(0, 3)), 0.3, 3);
    w.p(tr_, C.wood3).p(lv, C.leaf);
    back.add(w.out());
    const G = S.layer({ par: 0.35, sh: 3 });
    G.add(sheet().p(c.cut([[-900, GY - 24], [2500, GY - 26], [2500, 1700], [-900, 1700]], 1, 16), mix(C.stone, C.sand, 0.4)).out());
    // the herb bed
    const bed = sheet().p(c.cut(c.blob(360, GY - 10, 170, 22, 14, 0.1), 0.8, 8), C.soil);
    G.add(bed.out());
    const HERBS = [['mint', 230], ['dill', 285], ['cumin', 335], ['mint', 385], ['dill', 440], ['cumin', 490]];
    G.add(`<g>${HERBS.map(([k, x]) => `<g transform="translate(${x} ${GY - 14})">${herb(c, k, 64)}</g>`).join('')}</g>`);

    /* the three great stones of the Law, sunk in the weeds */
    const P = S.layer({ par: 0.4, sh: 5 });
    P.add(sheet().p(c.cut([[830, GY + 4], [840, GY - 20], [1230, GY - 22], [1240, GY + 4]], 0.6, 10), mix(C.stone2, C.rock, 0.3)).out());
    const glows = STONES.map(([x]) => P.add(`<g><circle cy="-60" r="110" fill="url(#halo-glow)"/></g>`));
    const stones = STONES.map(([x, k, word, r], i) => ({ x, r, i, el: P.add(`<g>${greatWeight(c, tr(word[0], word[1]), virtueIcon(c, k), { w: 126, h: 104 })}</g>`) }));
    const weeds = P.add(`<g>${grass(c, { x0: 830, x1: 1240, y: GY + 6, n: 26, h: 34, color: C.olive })}</g>`);
    const webs = STONES.map(([x], i) => P.add(`<g>${cobweb(c, 40)}</g>`));

    /* the table, the counting, the tithe dish */
    P.add(`<g transform="translate(${TX} ${GY + 6})">${table(c, 170, 76)}</g>`);
    const dishGlow = P.add(`<g><circle cy="-10" r="60" fill="url(#halo-glow)"/></g>`);
    const dish = P.add(`<g>${titheDish(c, 46)}</g>`);
    const sprigs = Array.from({ length: 10 }, (_, i) => ({ i, el: P.add(`<g>${sprig(c, [C.leaf, C.olive, C.moss][i % 3])}</g>`) }));
    const phar = S.puppet(P.add(vain(c, PH)));
    const woe = woeDrop(P, c, 4, { x: 1150, y: 150 });

    return (t, time) => {
      const T = time;
      swing(sunEl, 420, 140, T, 1, 0.6);
      swing(cl, 1060 + (T ? Math.sin(T * 0.1) * 20 : 0), 160, T, 1.2, 0.7, 1);
      woe(es(t, 0.02, 0.25, ease.out) * (1 - es(t, 0.9, 1.05)), T);

      /* v23a — he stoops over the herbs; v23b — at the table, counting to ten, the tenth into the dish */
      const toTable = es(t, 0.9, 1.08);
      const px = lerp(530, 620, toTable);
      const pick = t < 1 ? Math.max(0, Math.sin(t * 16)) * es(t, 0.2, 0.3) * (1 - es(t, 0.8, 0.9)) : 0;
      const count = es(t, 1.1, 1.55);
      const tenth = es(t, 1.55, 1.7);
      phar.set({
        x: px, y: GY - 4, s: 0.98, flip: toTable < 0.5, walk: toTable > 0.02 && toTable < 0.98 ? px * 0.06 : undefined,
        lean: pick * 14 + es(t, 0.2, 0.3) * (1 - toTable) * 16 + count * (1 - tenth) * 10 + tenth * 6, head: 14 * (1 - es(t, 1.7, 1.9)) - es(t, 1.7, 1.9) * 12,
        armF: 40 + pick * 30 + count * 30 + tenth * 20, armB: 10 + bump(t, 1.62, 1.95) * 110, blink: blinkAt(T, 2),
      });
      sprigs.forEach((sp) => {
        const k = es(t, 1.1 + sp.i * 0.04, 1.16 + sp.i * 0.04, ease.out);
        let x = TX - 76 + sp.i * 14, y = GY - 64;
        if (sp.i === 9) { x = lerp(x, TX + 55, tenth); y = lerp(y, GY - 80, tenth) + Math.sin(tenth * Math.PI) * -30; }
        pose(sp.el, { x, y, s: 1.5, r: sp.i === 9 ? tenth * 20 : 0, o: k > 0.02 ? 1 : 0 });
      });
      pose(dish, { x: TX + 55, y: GY - 70, o: 1 });
      pose(dishGlow, { x: TX + 55, y: GY - 70, o: es(t, 2.25, 2.5) * (0.8 + (T ? Math.sin(T * 2) * 0.1 : 0)) });

      /* the neglected stones; v23c — they rise upright on their step and glow */
      stones.forEach((st) => {
        const k = es(t, 2.05 + st.i * 0.08, 2.4 + st.i * 0.08, ease.back);
        pose(st.el, { x: st.x, y: lerp(GY + 26, GY - 20, k), r: lerp(st.r, 0, k), s: 1 });
        pose(glows[st.i], { x: st.x, y: GY - 20, o: k * (0.8 + (T ? Math.sin(T * 1.5 + st.i) * 0.1 : 0)) });
        pose(webs[st.i], { x: st.x + 40, y: GY - 60, sx: -1, sy: 1, o: 1 - es(t, 2.05, 2.25) });
      });
      pose(weeds, { y: es(t, 2.05, 2.35) * 60, o: 1 - es(t, 2.05, 2.3) });

      S.cam.x = lerp(-10, 110, es(t, 1.35, 1.75)) * (1 - es(t, 2.0, 2.3)) + es(t, 2.0, 2.3) * 60;
      S.cam.z = 1.04 + es(t, 1.35, 1.75) * 0.04 * (1 - es(t, 2.0, 2.3));
      S.cam.y = -10;
    };
  },
};
