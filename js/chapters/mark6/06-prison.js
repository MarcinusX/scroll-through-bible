// Mk 6,17–20 — a story from before, told on old sepia paper: John bound in Herod's prison because of
// Herodias; John's "it is not lawful"; her grudge; Herod who fears John, guards him — and likes to listen.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, cloud, sun } from '../../assets/nature.js';
import { paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, speech, thought, GLYPH, wordSlip, garland, candle, crown, helmet, circlet, faceBits, withFace, labelTag, storyFrame, SEPIA, LOOK } from './lib.js';

const PI = Math.PI;
const Y = 690;
const CELL = { x0: 340, x1: 650, top: 400, floor: 672 };

/** a rope coil in John's hands (arm coords) */
function bonds(c) { return sheet().p(c.ribbon(c.arc(0, 2, 9, 6, 0, PI * 2, 14), 3), C.rope).p(c.ribbon([[6, 6], [14, 26]], 2.4), C.rope).out(); }
function tablets(c) {
  const s = sheet();
  [-13, 13].forEach((x) => { s.p(c.cut([[x - 11, 16], [x - 11, -8], ...c.arc(x, -8, 11, 10, PI, 2 * PI, 6), [x + 11, 16]], 0.3, 3), C.stone); });
  let l = '';
  [-13, 13].forEach((x) => { for (let i = 0; i < 4; i++) l += c.ribbon([[x - 6, -6 + i * 6], [x + 6, -6 + i * 6]], 1.2); });
  s.x(l, C.ink, 'opacity=".5"');
  return s.out();
}
function ringsX(c) {
  return sheet().x(c.ribbon(c.arc(-9, 0, 11, 11, 0, PI * 2, 16), 3) + c.ribbon(c.arc(9, 0, 11, 11, 0, PI * 2, 16), 3), C.sun).x(c.ribbon([[-24, -18], [24, 18]], 4) + c.ribbon([[24, -18], [-24, 18]], 4), C.terracotta).out();
}

export default {
  id: 'm6-prison',
  enter: 'fly',
  beats: [
    { v: 17, text: 'Ten bowiem Herod kazał pochwycić Jana i związanego trzymał w więzieniu,' },
    { v: 17, cont: true, text: 'z powodu Herodiady, żony brata swego Filipa, którą wziął za żonę.' },
    { v: 18 },
    { v: 19 },
    { v: 20, text: 'Herod bowiem czuł lęk przed Janem, znając go jako męża prawego i świętego, i brał go w obronę.' },
    { v: 20, cont: true, text: 'Ilekroć go posłyszał, odczuwał duży niepokój, a przecież chętnie go słuchał.' },
  ],
  cam: { x: [-40, 160], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the tower and its cell a step nearer the middle, so John in his cell is not at the very edge
    const DX = S.portrait ? 70 : 0;
    const CL = { ...CELL, x0: CELL.x0 + DX, x1: CELL.x1 + DX };
    sky(S, SEPIA.sky);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.ochre, disc: mix(C.sun, C.parchment, 0.3), inner: mix(C.sun, C.cream, 0.5) }), { x: 1180, y: 190, len: 700 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.parchment), { x: 560, y: 150, len: 700 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 450, amps: [30, 12, 4], lens: [900, 330, 120], color: mix(C.dune, C.parchment, 0.45) }).markup);
    S.layer({ par: 0.22, sh: 2 }).add(band(c, { y: 520, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.sand2, C.dune, 0.35) }).markup);

    /* ---------- the fortress: a cut-away cell on the left, the hall on the right ---------- */
    const walls = S.layer({ par: 0.45, sh: 3 });
    const B = sheet();
    const stone = mix(C.stone2, C.dune, 0.35);
    // ground
    B.p(c.ridge(c.wave(Y - 20, [3, 1], [600, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.5));
    // prison tower with the cell cut open
    B.p(c.cut([[CL.x0 - 40, Y - 10], [CL.x0 - 40, CELL.top - 60], [CL.x1 + 40, CELL.top - 60], [CL.x1 + 40, Y - 10]], 1, 10), stone);
    let tb = '';
    for (let y = CELL.top - 56; y < Y - 20; y += 34) for (let x = CL.x0 - 36 + (Math.round(y / 34) % 2) * 30; x < CL.x1 + 30; x += 64) tb += c.cut(c.rect(x, y, 56, 28), 0.6, 8);
    B.p(tb, shade(stone, 0.12));
    let cren = '';
    for (let x = CL.x0 - 40; x < CL.x1 + 40; x += 44) cren += c.cut(c.rect(x, CELL.top - 90, 26, 32), 0.5, 5);
    B.p(cren, stone);
    // the inside of the cell
    B.p(c.cut(c.rect(CL.x0, CELL.top, CL.x1 - CL.x0, CELL.floor - CELL.top), 0.6, 8), mix(C.soilDark, C.wood2, 0.45));
    B.p(c.cut(c.rect(CL.x0, CELL.floor - 10, CL.x1 - CL.x0, 12), 0.4, 8), mix(C.soil, C.sand2, 0.4));
    B.p(c.cut([[CL.x0 + 30, CELL.top + 40], [CL.x0 + 30, CELL.top + 20], ...c.arc(CL.x0 + 50, CELL.top + 20, 20, 18, PI, 2 * PI, 6), [CL.x0 + 70, CELL.top + 40]], 0.3, 4), SEPIA.sky[0]);
    // straw
    let straw = '';
    for (let i = 0; i < 24; i++) { const x = c.rr(CL.x0 + 10, CL.x1 - 10); straw += c.ribbon([[x, CELL.floor - 8], [x + c.rr(-12, 12), CELL.floor - c.rr(12, 20)]], 1.6); }
    B.x(straw, C.wheat2, 'opacity=".8"');
    // Herod's hall on the right
    B.p(c.cut([[760, Y - 10], [760, 360], [1340, 360], [1340, Y - 10]], 1, 10), mix(C.plaster, C.dune, 0.25));
    B.p(c.cut([[740, 360], [1360, 360], [1360, 340], [740, 340]], 0.6, 8), mix(C.plumRobe, C.dune, 0.4));
    let pil = '';
    [790, 1310].forEach((x) => { pil += c.cut(c.rect(x - 16, 370, 32, Y - 380), 0.5, 8); });
    B.p(pil, shade(C.plaster, -0.08));
    B.p(c.cut([[860, 560], [860, 440], ...c.arc(930, 440, 70, 60, PI, 2 * PI, 12), [1000, 560]], 0.5, 8), mix(C.dune, C.plumRobe, 0.2));
    walls.add(B.out());
    const hallGar = walls.add(`<g>${garland(c, 360, 40)}</g>`);

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.5, sh: 5 });
    const john = S.puppet(act.add(person(c, { ...LOOK.john, holdF: bonds(c) })));
    const johnSit = S.puppet(act.add(person(c, { ...LOOK.john, pose: 'sit', holdF: bonds(c) })));
    const holy = act.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const guards = [0, 1].map((i) => S.puppet(act.add(withFace(person(c, { ...LOOK.guard, robe: i ? shade(LOOK.guard.robe, 0.1) : LOOK.guard.robe }), helmet(c)))));
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herod = S.puppet(act.add(hMark({ ...LOOK.herod })));
    const herodSit = S.puppet(act.add(hMark({ ...LOOK.herod, pose: 'sit' })));
    const stool = act.add(`<g>${sheet().p(c.cut([[-26, -34], [26, -34], [22, 0], [14, 0], [12, -26], [-12, -26], [-14, 0], [-22, 0]], 0.4, 5), C.wood).out()}</g>`);
    const herodias = S.puppet(act.add(withFace(withFace(person(c, LOOK.herodias), circlet(c)), faceBits(c))));
    const hdBrows = herodias.el.querySelector('[data-part="angry"]');
    const philip = S.puppet(act.add(person(c, { robe: C.tealRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun })));
    const hSad = [herod, herodSit].map((p) => p.el.querySelector('[data-part="sad"]'));
    // the barred door of the cell (it drops down when John is inside)
    const barsEl = act.add(`<g>${sheet().p([0, 1, 2, 3, 4, 5, 6].map((i) => c.cut(c.rect(i * 44, 0, 9, CELL.floor - CELL.top), 0.3, 8)).join('') + c.cut(c.rect(-6, 60, 290, 10), 0.3, 8) + c.cut(c.rect(-6, 180, 290, 10), 0.3, 8), mix(C.ink, C.storm, 0.4)).out()}</g>`);

    /* ---------- labels, bubbles, words ---------- */
    const fx = S.layer({ par: 0.55, sh: 4 });
    const tagJ = hanging(fx, labelTag(tr('Jan', 'John'), 20), { x: 0, y: 0, len: 600 });
    const tagH = hanging(fx, labelTag(tr('Herod', 'Herod'), 20), { x: 0, y: 0, len: 600 });
    const tagHd = hanging(fx, labelTag(tr('Herodiada', 'Herodias'), 20), { x: 0, y: 0, len: 600 });
    const tagF = hanging(fx, labelTag(tr('Filip', 'Philip'), 18), { x: 0, y: 0, len: 600 });
    const law = fx.add(`<g>${speech(c, `${tablets(c)}`, { w: 84, h: 64 })}</g>`);
    const rings = fx.add(`<g>${ringsX(c)}</g>`);
    const grudge = fx.add(`<g>${thought(c, `<g transform="scale(1.1)">${GLYPH.storm(c)}</g>`, { w: 66, h: 54 })}</g>`);
    const puzz = [0, 1, 2].map(() => fx.add(`<g>${GLYPH.q(c, C.ochre)}</g>`));
    const words = [0, 1, 2, 3].map(() => fx.add(wordSlip(c, 26)));
    const heartish = fx.add(`<g><circle r="40" fill="url(#warm-glow)"/></g>`);

    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1180, 190, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 150, T, 1.1, 0.6, 1);

      /* v17a — seized, bound, locked in */
      const jKeys = [[-0.3, -120], [0.5, 490 + DX]];
      const jx = kf(t, jKeys);
      const sitK = es(t, 0.62, 0.68);
      john.set({ x: jx, y: CELL.floor - 4, s: 0.94, o: 1 - sitK, walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 40, armB: 36, head: 6, lean: 3, blink: blinkAt(T, 2) });
      const talk = bump(t, 2.05, 2.95);
      const preach = bump(t, 5.05, 5.95);
      johnSit.set({ x: 500 + DX + es(t, 2.0, 2.2) * 60 * (1 - es(t, 2.9, 3.2)) + es(t, 5.0, 5.2) * 70, y: CELL.floor - 4, s: 0.94, o: sitK, armF: 40 + talk * 40 + preach * 30, armB: 36 + talk * 110 + preach * 40, head: -talk * 6 + Math.sin(T * 0.6) * 2, blink: blinkAt(T, 2) });
      pose(holy, { x: 520 + DX, y: CELL.floor - 100, s: 0.6 + es(t, 4.05, 4.4) * 0.6, o: es(t, 4.05, 4.4) * 0.7 * (1 - es(t, 5.0, 5.3) * 0.4) });
      guards.forEach((g, i) => {
        const gx = kf(t, [[-0.3, -60 - i * 160], [0.5, 570 + DX - i * 150], [0.62, 570 + DX - i * 150], [0.9, 700 + i * 30]]);
        const post = es(t, 3.9, 4.2);
        g.set({ x: t < 0.9 ? gx : lerp(700 + i * 30, 690 + i * 520, post) + (i ? 0 : es(t, 4.95, 5.2) * 190), y: Y + 6 + i * 4, s: 0.94, flip: t > 0.62 && t < 0.9, o: i === 1 ? 1 - es(t, 0.9, 1.0) * (1 - post) : 1, walk: (t > -0.3 && t < 0.5) || (t > 0.62 && t < 0.9) ? gx * 0.05 + i : undefined, armF: 30 + (t < 0.5 ? 30 : 0), blink: blinkAt(T, 5 + i) });
      });
      const drop = es(t, 0.66, 0.8, ease.in);
      pose(barsEl, { x: CL.x0 + 10, y: CELL.top - (1 - drop) * (CELL.floor - CELL.top + 80), o: drop > 0.01 ? 1 : 0 });

      /* Herod in his hall: orders the arrest, weds Herodias, turns from John's words, blocks her, listens */
      const order = bump(t, -0.1, 0.6);
      const block = es(t, 3.3, 3.55) * (1 - es(t, 4.9, 5.05));
      const listen = es(t, 5.0, 5.25);
      const hx = lerp(960, 820, block);
      herod.set({ x: hx, y: Y, s: 1.0, flip: order > 0.2 || (t > 3.3 && t < 5.0), o: 1 - listen, armF: order * 100 + block * 20, armB: block * 110 + bump(t, 1.1, 1.9) * 40, head: bump(t, 2.3, 2.95) * 14, blink: blinkAt(T, 1) });
      herodSit.set({ x: 745, y: Y - 30, s: 1.0, flip: true, o: listen, armF: 30 + Math.sin(T * 0.8) * 4, armB: 90, head: 8 + Math.sin(T * 0.9) * 4, lean: -6, blink: blinkAt(T, 1) });
      pose(stool, { x: 743, y: Y, o: listen });
      hSad.forEach((w) => attr(w, 'opacity', (es(t, 4.05, 4.3) * 0.8).toFixed(2)));
      const hdIn = es(t, 1.0, 1.3);
      const HDX = S.portrait ? 1035 : 1060;   // phone: Herodias clear of the thread
      const toward = es(t, 3.05, 3.3) * (1 - es(t, 3.7, 3.95));
      herodias.set({ x: lerp(1400, HDX, hdIn) - toward * 110, y: Y + 4, s: 0.96, flip: t > 2.1 && t < 4.9, o: hdIn > 0 ? 1 : 0, walk: hdIn > 0 && hdIn < 1 ? t * 30 : toward > 0 && toward < 1 ? t * 30 : undefined, armF: bump(t, 1.3, 1.9) * 40 + toward * 60, armB: es(t, 2.4, 2.7) * 50 * (1 - es(t, 4.0, 4.3)), head: -bump(t, 2.3, 2.9) * 8, blink: blinkAt(T, 4) });
      attr(hdBrows, 'opacity', (es(t, 2.3, 2.6) * (1 - es(t, 4.9, 5.1))).toFixed(2));
      const phK = es(t, 1.15, 1.4) * (1 - es(t, 1.85, 2.0));
      const phA = S.portrait ? 1.76 : 1.55;   // phone: he is still in sight at the pause, then leaves
      const phx = lerp(S.portrait ? 1105 : 1230, 1330, es(t, phA, 1.95));
      philip.set({ x: phx, y: Y + 10, s: 0.9, flip: t < phA, o: phK, walk: t > phA && t < 1.95 ? phx * 0.06 : undefined, armF: bump(t, 1.2, 1.55) * 50, head: 10, blink: blinkAt(T, 9) });
      const gar = es(t, 1.15, 1.4) * (1 - es(t, 2.9, 3.1));
      pose(hallGar, { x: 830, y: 390 - (1 - gar) * 420, o: gar > 0.01 ? 1 : 0 });

      /* tags */
      const tg = (el, x, y, k) => pose(el, { x, y: lerp(-500, y, k), r: Math.sin(T * 1.2 + x) * 3, o: k > 0.01 ? 1 : 0 });
      tg(tagJ, 500 + DX, CELL.top - 130, es(t, 0.1, 0.4, ease.back) * (1 - es(t, 0.95, 1.1)));
      tg(tagH, 960, 290, es(t, 0.05, 0.35, ease.back) * (1 - es(t, 1.95, 2.1)));
      tg(tagHd, 1070, 320, es(t, 1.1, 1.4, ease.back) * (1 - es(t, 1.95, 2.1)));
      tg(tagF, S.portrait ? 1095 : 1290, S.portrait ? 420 : 400, es(t, 1.2, 1.45, ease.back) * (1 - es(t, 1.85, 2.0)));

      /* v18 — "It is not lawful for you…" */
      const lw = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(law, { x: 640 + DX, y: CELL.top + 70, s: lw, o: lw > 0.01 ? 1 : 0 });
      const rg = es(t, 2.35, 2.55, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(rings, { x: 780, y: CELL.top - 30, s: rg, r: Math.sin(T * 2) * 6, o: rg > 0.01 ? 1 : 0 });
      /* v19 — Herodias' grudge */
      const gd = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      const [dx, dy] = headAt(lerp(1400, HDX, hdIn) - toward * 110, Y + 4, 0.96, true);
      pose(grudge, { x: dx - 10, y: dy - 20, s: gd, o: gd > 0.01 ? 1 : 0 });

      /* v20b — perplexed, yet glad to listen */
      const [px, py] = headAt(745, Y - 30, 1.0, true, 62);
      puzz.forEach((q, i) => {
        const k = bump(t, 5.2 + i * 0.1, 5.95);
        pose(q, { x: px + Math.cos(T * 1.3 + i * 2.1) * 34, y: py - 50 + Math.sin(T * 1.3 + i * 2.1) * 12, s: k, r: Math.sin(T * 2 + i) * 14, o: k > 0.02 ? 1 : 0 });
      });
      words.forEach((w, i) => {
        const k = ((T * 0.35 + i / 4) % 1);
        const on = es(t, 5.1, 5.3);
        pose(w, { x: lerp(600 + DX, px - 16, k), y: lerp(CELL.top + 120, py, k) - Math.sin(k * PI) * 30, s: 0.7, r: Math.sin(T * 2 + i) * 10, o: on * Math.sin(k * PI) });
      });
      pose(heartish, { x: px, y: py, s: 1, o: es(t, 5.3, 5.6) * 0.6 });

      S.cam.x = kf(t, [[0, -30], [0.9, -30], [1.2, S.portrait ? 140 : 40], [1.9, S.portrait ? 140 : 40],   // phone: Philip and his name in sight
         [2.2, 0], [4.9, 0], [5.2, -20]]);
      S.cam.z = kf(t, [[0, 1.06], [1.2, 1.1], [2.2, 1.06], [4.9, 1.06], [5.3, 1.12]]);
      S.cam.y = kf(t, [[0, 20], [5.3, 40]]);
    };
  },
};
