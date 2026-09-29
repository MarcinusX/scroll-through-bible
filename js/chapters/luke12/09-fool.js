// Łk 12,20–21 — the same farm, and night comes down over the great barn. The rich man dozes at his table by a little
// lamp, the garland of his many years still strung across the sky. "But God said to him": no one is seen — a shaft of
// light falls from above and gold words hang in it: "Fool!"; "this night your soul is required of you": the lamp goes
// out, the string of years snaps and the suns drop away, all but one, and a small light rises out of him into the
// shaft, while he sinks back on his cushion. "The things you have prepared — whose will they be?": the great barn's
// door swings open, three grey strangers come from both sides and carry off a sack, a jar, the money chest, each his own
// way, and a big "?" hangs over the barn. "So is he who lays up treasure for himself, and is not rich toward God": a
// cold grey dawn; high above in a soft gold light a small chest on a cloud opens its lid — and it is empty.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { cloud } from '../../assets/nature.js';
import { goldWord } from '../john1/lib.js';
import { lightShaft } from '../matthew4/lib.js';
import { lowTable, grapes } from '../mark2/lib.js';
import { farmSet, FARM, RICH, GREY, flourSack, wineJar, coinChest, lampBody, lampFire, smoke, WICK, soulLight, bigQuestion, manO, loaf, jug, headAt, hand, alongPts, halo, tr, PI, FONT } from './lib.js';

const GY = FARM.GY, BX = FARM.BIG[0];
const MX = 660, TX = 780;

function yearDisc(c, n) {
  const s = sheet().p(c.cut(c.circ(0, 0, 22, 24), 0.3, 4), C.haloRim).p(c.cut(c.circ(0, 0, 17, 22), 0.3, 4), C.cream).out();
  return `${s}<path d="${c.cut(c.star(0, -3, 9, 6, 10, 0), 0.2, 3)}" fill="${C.sun}"/><text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-size="10" font-style="italic" fill="${C.ink}">${n}</text>`;
}
function emptyChest(c) {
  const b = sheet();
  b.p(c.cut(c.rect(-40, -40, 80, 40), 0.4, 6), C.wood3);
  b.p(c.cut(c.rect(-34, -38, 68, 8), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
  b.p(c.cut(c.rect(-30, -40, 7, 40), 0.3, 4) + c.cut(c.rect(23, -40, 7, 40), 0.3, 4), C.ochre);
  return b.out();
}
function chestLid(c) {
  return sheet().p(c.cut([[0, 0], ...c.arc(40, 0, 41, 16, PI, 2 * PI, 10), [82, 0], [82, 4], [0, 4]], 0.4, 6), C.wood).p(c.cut(c.rect(10, -12, 7, 14), 0.3, 3) + c.cut(c.rect(64, -12, 7, 14), 0.3, 3), C.ochre).out();
}

export default {
  id: 'lk12-fool',
  parable: true,
  beats: [
    { v: 20, text: 'Lecz Bóg rzekł do niego: "Głupcze, jeszcze tej nocy zażądają twojej duszy od ciebie;' },
    { v: 20, cont: true, text: 'komu więc przypadnie to, coś przygotował?"' },
    { v: 21 },
  ],
  cam: { x: [-60, 120], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    let shaftL;
    const F = farmSet(S, { night: true, beforeAct: () => { shaftL = S.layer({ par: 0.45, sh: 0, flat: true }); } });
    const c = S.c;
    const grey = S.layer({ par: 0, sh: 0, flat: true });
    grey.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#8f95a8" opacity=".35"/>`);
    /* the shaft of light and the word */
    const shaft = shaftL.add(`<g opacity="0">${lightShaft(c, { w0: 34, w1: 90, h: 1100, o: 0.4 })}</g>`);
    const heavenL = S.layer({ par: 0.12, sh: 5 });
    const word = heavenL.add(`<g transform="translate(0 -1500)"><path d="M-60 -2400V-24M60 -2400V-24" stroke="rgba(233,196,111,.6)" stroke-width="1.2" fill="none"/>${goldWord(c, tr('Głupcze!', 'Fool!'), { size: 34 })}</g>`);
    const years = Array.from({ length: 8 }, (_, i) => ({ i, el: heavenL.add(`<g>${yearDisc(c, i + 1)}</g>`), seed: c.rr(-1, 1) }));
    const line = heavenL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [340, 80], [680, 0], 24), 2)}" fill="rgba(74,54,34,.6)"/></g>`);
    const store = heavenL.add(`<g transform="translate(0 -1500)"><path d="M-50 -2400V-60M50 -2400V-60" stroke="${STRINGC}" stroke-width="1.2" fill="none"/>${halo(140, 0.9)}<g transform="translate(0 14)">${cloud(c, 230, '#fbf1d8', '#efd9a8')}</g><g transform="translate(0 -6)">${emptyChest(c)}</g></g>`);
    const lid = heavenL.add(`<g>${chestLid(c)}</g>`);

    /* the rich man at his table; the lamp */
    F.act.add(`<g transform="translate(${TX} ${GY + 16}) scale(1.2)"><g transform="scale(.5)">${lowTable(c, 300, 60)}</g><g transform="translate(-40 -32)">${loaf(c, 14)}</g><g transform="translate(-6 -30)">${grapes(c, 4)}</g><g transform="translate(34 -30)">${jug(c, C.pot)}</g></g>`);
    F.act.add(`<g transform="translate(${MX - 20} ${GY + 8})">${sheet().p(c.cut(c.blob(0, -10, 44, 14, 12, 0.1), 0.4, 5), C.terracotta).out()}</g>`);
    const lampX = TX - 58, lampY = GY + 16 - 36;
    F.act.add(`<g transform="translate(${lampX} ${lampY})">${lampBody(c)}</g>`);
    const fire = F.act.add(`<g>${lampFire(c, 70)}</g>`);
    const smk = F.act.add(`<g opacity="0">${smoke(c, 50)}</g>`);
    const rich = S.puppet(F.act.add(person(c, { ...RICH, pose: 'sit' })));
    const soul = F.fx.add(`<g opacity="0">${soulLight(c, 14)}</g>`);
    /* the strangers who carry it off */
    const LOADS = [flourSack(c, 40, 46), wineJar(c, 50), coinChest(c, 46)];
    const takers = [0, 1, 2].map((i) => ({ i, p: S.puppet(F.act.add(person(c, manO(c, { robe: mix(C.stone2, C.storm, 0.35), mantle: null, belt: C.rope })))), load: F.act.add(`<g opacity="0">${LOADS[i]}</g>`) }));
    const q = F.fx.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${bigQuestion(c, 38)}</g>`);

    return (t, time) => {
      const T = time;
      /* night has come */
      const nk = 1 - es(t, 2.05, 2.5) * 0.55;
      F.update(T, { night: nk });
      F.small.forEach((b) => { pose(b.el, { o: 0 }); pose(b.door, { o: 0 }); });
      F.rows.forEach((el) => pose(el, { x: 0, y: 0 }));
      pose(F.big, { x: BX, y: GY });
      grey.fade(es(t, 2.05, 2.5));

      /* v20a — "Fool! this night your soul is required of you" */
      const lk = es(t, 0.05, 0.3);
      pose(shaft, { x: MX + 10, y: GY - 150, o: lk * (1 - es(t, 1.9, 2.1)) });
      const wk = es(t, 0.12, 0.38, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      pose(word, { x: MX + 40, y: lerp(-1500, 250, wk), r: time ? Math.sin(T * 0.7) * 1 : 0, o: wk > 0.01 ? 1 : 0 });
      const out = es(t, 0.45, 0.55);
      pose(fire, { x: lampX + WICK[0], y: lampY + WICK[1], s: (1 - out) * (1 + (time ? Math.sin(T * 9) * 0.05 : 0)), o: 1 - out });
      pose(smk, { x: lampX + WICK[0], y: lampY + WICK[1], o: bump(t, 0.5, 1.3) * 0.8 });
      const snap = es(t, 0.5, 0.95, ease.in);
      pose(line, { x: 500, y: 236 + snap * 700, r: snap * 20, o: 1 - snap });
      years.forEach((y) => {
        const u = (y.i + 0.5) / 8;
        const d = y.i === 0 ? 0 : es(t, 0.5 + y.i * 0.03, 0.95 + y.i * 0.03, ease.in);
        pose(y.el, { x: 500 + u * 680 + d * y.seed * 60, y: 236 + 160 * u * (1 - u) + 26 + d * 700, r: d * 90 * y.seed, o: (1 - d) * (1 - es(t, 1.9, 2.1)) });
      });
      const up = es(t, 0.55, 0.95);
      const [hx, hy] = headAt(MX, GY + 6, 1.0, false, 62);
      pose(soul, { x: hx, y: lerp(hy + 30, 150, up), s: 0.8 + up * 0.4, o: es(t, 0.52, 0.6) * (1 - es(t, 0.9, 1.0)) });
      const slump = es(t, 0.55, 0.8);
      rich.set({ x: MX, y: GY + 6, s: 1.0, armF: 40 - slump * 20, armB: 20, head: 6 + slump * 20, lean: -8 - slump * 8, blink: slump > 0.3 ? 1 : 0.9 });

      /* v20b — whose will they be? */
      pose(F.bigDoor, { x: -46, y: 0, sx: 1 - es(t, 1.05, 1.25) * 0.9 });
      takers.forEach((tk) => {
        const inK = es(t, 1.1 + tk.i * 0.05, 1.4 + tk.i * 0.05), outK = es(t, 1.5 + tk.i * 0.06, 1.95);
        const x0 = [1400, 1450, 620][tk.i], x1 = [1400, 1500, 480][tk.i];
        const x = inK < 1 ? lerp(x0, BX - 10 + (tk.i - 1) * 40, inK) : lerp(BX - 10 + (tk.i - 1) * 40, x1, outK);
        const flip = inK < 1 ? x0 > BX : x1 < BX;
        const loaded = outK > 0;
        tk.p.set({ x, y: GY + 10 + tk.i * 4, s: 0.92, flip, o: seg(t, 1.08, 1.12) * (1 - es(t, 1.9, 1.98)), walk: (inK > 0 && inK < 1) || (outK > 0 && outK < 1) ? x * 0.06 : undefined, armF: loaded ? 90 : 20, armB: loaded ? 110 : 10, blink: blinkAt(T, tk.i) });
        const [lx, ly] = headAt(x, GY + 10 + tk.i * 4, 0.92, flip);
        pose(tk.load, { x: lx, y: ly - 6, s: 0.9, o: loaded ? 1 - es(t, 1.9, 1.98) : 0 });
      });
      const qk = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      pose(q, { x: BX, y: lerp(-1500, 300, qk), r: time ? Math.sin(T * 0.8) * 2 : 0, o: qk > 0.01 ? 1 : 0 });

      /* v21 — not rich toward God: the treasury in heaven, empty */
      const sk = es(t, 2.1, 2.4, ease.out);
      const SX = 800, SY = 220;
      pose(store, { x: SX, y: lerp(-1500, SY, sk), s: 1.3, o: sk > 0.01 ? 1 : 0 });
      const op = es(t, 2.45, 2.65);
      pose(lid, { x: SX - 41 * 1.3, y: lerp(-1500, SY, sk) - 46 * 1.3, s: 1.3, r: -op * 100, o: sk > 0.01 ? 1 : 0 });

      S.cam.x = lerp(-30, 110, es(t, 1.0, 1.25)) - es(t, 2.0, 2.3) * 110;
      S.cam.y = lerp(30, 10, es(t, 1.0, 1.25)) - es(t, 2.0, 2.3) * 70;
      S.cam.z = 1.1 - es(t, 1.0, 1.25) * 0.04 - es(t, 2.0, 2.3) * 0.04;
    };
  },
};
const STRINGC = 'rgba(74,54,34,.55)';
