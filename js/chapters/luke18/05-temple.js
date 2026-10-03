// Łk 18,10–12 — the parable comes down as a painted set: the Temple court of Luke 2, the sanctuary shining over its
// inner wall. "Two men went up into the temple to pray, one a Pharisee, the other a tax collector": the Pharisee
// strides in from the left, straight to the front before the sanctuary; the tax collector comes in slowly at the right,
// a dark sack on his back, and stops by the columns. "The Pharisee stood and prayed to himself: God, I thank you
// that I am not like the rest of men" — arms raised, chin up; his words fly up, but turn round in the air and circle
// back round his own head. "Extortioners, unrighteous, adulterers" — three grey little portraits pop up behind him and
// he waves them off — "or even like this tax collector": he jerks his thumb at the man by the columns. "I fast twice
// a week": the seven days of the week hang in a row over him, and on two of them the bowl is empty. "I give tithes
// of all that I get": ten coins stand in a row on his palm, and he drops one of them, with a flourish, into the chest.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeParable, TP, PHARISEE, TAXMAN, nameTag, words, wordSlip, iconDisc, shadowPerson, strip, onString, coin, bowl, loaf,
  headAt, handAt, kf, moving, es, ease, bump, seg, tr, PI,
} from './lib.js';

const F = TP.FLOOR, PX = TP.PHX, TXW = TP.TXX;

export default {
  id: 'lk18-temple',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 10 },
    { v: 11, text: 'Faryzeusz stanął i tak w duszy się modlił: "Boże, dziękuję Ci, że nie jestem jak inni ludzie,' },
    { v: 11, cont: true, text: 'zdziercy, oszuści, cudzołożnicy, albo jak i ten celnik.' },
    { v: 12, text: 'Zachowuję post dwa razy w tygodniu,' },
    { v: 12, cont: true, text: 'daję dziesięcinę ze wszystkiego, co nabywam".' },
  ],
  cam: { x: [-40, 80], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const TPR = templeParable(S);
    const TX = S.portrait ? 1000 : TXW;   // phone: the tax collector inside the screen, clear of the thread
    const { c, fx } = TPR;

    /* name tags as they come in */
    const tagP = fx.add(`<g>${onString(nameTag(c, tr('faryzeusz', 'a Pharisee'), { size: 17 }), 1600)}</g>`);
    const tagT = fx.add(`<g>${onString(nameTag(c, tr('celnik', 'a tax collector'), { size: 17 }), 1600)}</g>`);

    /* his words, which circle back round his own head */
    const slips = [0, 1, 2].map((i) => ({ i, el: fx.add(`<g opacity="0">${wordSlip(c, 38)}</g>`) }));
    const thanks = fx.add(`<g opacity="0">${words(c, tr(['Boże, dziękuję Ci,', 'że nie jestem', 'jak inni ludzie…'], ['God, I thank you,', 'that I am not like', 'the rest of men…']), { size: 18, side: -1 })}</g>`);

    /* the three kinds of men he is not like */
    const KINDS = [
      [tr('zdziercy', 'extortionists'), { robe: '#6e6470', hairStyle: 'short', beard: 'full' }],
      [tr('oszuści', 'unrighteous'), { robe: '#6e6470', hairStyle: 'wrap', beard: 'short' }],
      [tr('cudzołożnicy', 'adulterers'), { robe: '#6e6470', hairStyle: 'curly', beard: 'none' }],
    ];
    const kinds = KINDS.map(([label, o], i) => ({ i, el: fx.add(`<g opacity="0">${iconDisc(c, `<g transform="translate(0 30) scale(.3)">${shadowPerson(c, o, mix(C.storm2, C.stone2, 0.3))}</g>`, { r: 36, face: mix(C.stone, C.cream, 0.4), rim: C.stone2 })}<g transform="translate(0 52)">${strip(c, label, { size: 14 })}</g></g>`) }));

    /* the week, and the two fast days */
    const DAYN = tr(['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'], ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    const week = DAYN.map((d, i) => {
      const fast = i === 1 || i === 4;
      const icon = fast ? `<g transform="translate(0 6)">${bowl(c, { w: 30, food: null })}</g>` : `<g transform="translate(0 2)">${loaf(c, 9)}</g>`;
      const s = sheet().p(c.cut(c.circ(0, 0, 25, 24), 0.4, 4), fast ? C.haloRim : C.stone2).p(c.cut(c.circ(0, 0, 21, 24), 0.4, 4), fast ? C.cream : mix(C.stone, C.cream, 0.5));
      return { i, fast, el: fx.add(`<g>${onString(`${s.out()}${icon}<text x="0" y="-9" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="11" font-style="italic" fill="${C.ink}">${d}</text>`, 1600)}</g>`) };
    });

    /* ten coins; one of them for God */
    const coins = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${coin(c, 7)}</g>`) }));
    const tenth = fx.add(`<g opacity="0">${strip(c, '1/10', { size: 15, italic: false })}</g>`);

    return (t, time) => {
      const T = time;
      TPR.TS.sunEl && pose(TPR.TS.sunEl, { x: 1230, y: 150 });

      /* v10 — they come in */
      const inP = es(t, 0.0, 0.5);
      const px = lerp(360, PX, inP);
      const inT = es(t, 0.15, 0.75);
      const tx = lerp(1420, TX, inT);
      pose(tagP, { x: px + 6, y: lerp(-1500, 330, es(t, 0.3, 0.5, ease.out) * (1 - es(t, 1.0, 1.2, ease.in))) });
      pose(tagT, { x: tx - 4, y: lerp(-1500, 350, es(t, 0.45, 0.65, ease.out) * (1 - es(t, 1.0, 1.2, ease.in))) });

      /* the Pharisee: stands tall and prays (11a), waves them off and points at the tax collector (11b), fasting (12a),
         the coins on his palm (12b) */
      const pray = es(t, 1.05, 1.25) * (1 - es(t, 1.95, 2.05));
      const wave = bump(t, 2.1, 2.4);
      const thumb = es(t, 2.4, 2.55) * (1 - es(t, 2.95, 3.05));
      const fastK = es(t, 3.05, 3.25) * (1 - es(t, 3.95, 4.05));
      const palm = es(t, 4.05, 4.2);
      const flick = es(t, 4.5, 4.62);
      TPR.phar.set({
        x: px, y: F, s: 1.0, flip: thumb > 0.5 ? false : false, walk: inP > 0 && inP < 1 ? px * 0.05 : undefined,
        armF: 14 + pray * 90 + wave * 70 + thumb * 80 + fastK * 30 + palm * 70 - flick * 10,
        armB: 10 + pray * 150 + wave * 30 + fastK * 140 + palm * 20,
        head: -4 - pray * 14 - fastK * 10 + thumb * -6 + bump(t, 4.6, 4.95) * 8,
        lean: -pray * 4,
        blink: blinkAt(T, 2),
      });
      const [phx, phy] = headAt(px, F, 1.0, false);
      pose(thanks, { x: phx - 20, y: phy - 44, s: es(t, 1.12, 1.3, ease.back), o: t > 1.12 && t < 2.02 ? 1 - es(t, 1.9, 2.02) : 0 });
      slips.forEach((sl) => {
        const k = T ? (T * 0.3 + sl.i / 3) % 1 : (sl.i + 0.5) / 3;
        const rise = es(t, 1.15, 1.4);
        const a = k * PI * 2;
        pose(sl.el, { x: phx + Math.cos(a) * 70, y: phy - 20 + Math.sin(a) * 26 - rise * 26, r: Math.cos(a) * 10, o: es(t, 1.2, 1.35) * (1 - es(t, 4.9, 5.0)) * (Math.sin(a) > -0.2 || true ? 1 : 0) });
      });
      kinds.forEach((k) => {
        const on = es(t, 2.05 + k.i * 0.08, 2.2 + k.i * 0.08, ease.back) * (1 - es(t, 2.95, 3.05));
        pose(k.el, { x: 540 + k.i * 96, y: 410 - (k.i % 2) * 30 + (1 - on) * 30, s: on, o: on > 0.02 ? 1 : 0 });
      });
      const [fhx, fhy] = handAt(px, F, 1.0, false, 14 + palm * 70 - flick * 10);
      week.forEach((w) => {
        const k = es(t, 3.05 + w.i * 0.04, 3.25 + w.i * 0.04, ease.out) * (1 - es(t, 3.95, 4.1, ease.in));
        const lift = w.fast ? es(t, 3.4, 3.55, ease.back) * 16 : 0;
        pose(w.el, { x: 560 + w.i * 70, y: lerp(-1500, 330 - lift + (w.i % 2) * 14, k) + (T ? Math.sin(T * 0.9 + w.i) * 2 : 0), s: w.fast ? 1 + lift / 40 : 0.92, r: T ? Math.sin(T * 0.8 + w.i * 2) * 2 : 0 });
      });

      /* v12b — ten coins, and one into the chest */
      coins.forEach((co) => {
        const show = es(t, 4.12 + co.i * 0.02, 4.2 + co.i * 0.02);
        const row = [fhx - 42 + (co.i % 5) * 20, fhy - 16 - Math.floor(co.i / 5) * 16];
        let x = row[0], y = row[1];
        if (co.i === 9) {
          const k = seg(t, 4.52, 4.78);
          x = lerp(row[0], TP.CHX, k); y = lerp(row[1], F - 100, k) - Math.sin(k * PI) * 70;
        }
        const inChest = co.i === 9 && t > 4.78;
        pose(co.el, { x, y, o: show * (inChest ? 0 : 1) * (1 - es(t, 4.95, 5.0)) });
      });
      pose(tenth, { x: TP.CHX, y: F - 150, s: es(t, 4.72, 4.86, ease.back), o: t > 4.72 ? 1 : 0 });

      /* the tax collector, far off by the columns, head bowed */
      const taxWalk = inT > 0 && inT < 1;
      TPR.tax.set({ x: tx, y: F - 8, s: 0.94, flip: true, walk: taxWalk ? tx * 0.04 : undefined, amt: 0.7, armF: 12, armB: 8, head: 16 + es(t, 2.5, 2.7) * 8, lean: 4 + es(t, 2.5, 2.7) * 3, blink: 0 });
      TPR.taxOpen.set({ x: tx, y: F - 8, o: 0 });
      pose(TPR.sack, { x: tx + 22, y: F - 70, r: 8 });

      S.cam.x = kf(t, [[0, -20], [0.8, 20], [2.4, 0], [2.6, 30], [3.0, 20], [4.0, 0]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.09], [3.0, 1.09], [4.0, 1.08]]);
      void shade; void mix; void moving; void PHARISEE; void TAXMAN;
    };
  },
};
