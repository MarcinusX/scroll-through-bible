// Łk 3,18–20 — on the left, the riverbank where John goes on preaching: paper slips of good news fly out to the
// listeners. On the right, on its rock, Herod's fortress: Herod on his throne and Herodias beside him. John turns
// and points at them — two wedding rings struck through hang over the pair, "his brother's wife". For his other
// crimes, dark stones drop one by one into the pan of a great balance hung in the hall, and it sinks. "He added
// this to them all": Herod points, his guards lead John away into the cell below the tower, the bars come down —
// and one more stone, the heaviest, slams into the pan.
import { C, person, blinkAt, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, reeds } from '../../assets/nature.js';
import {
  JOHN_B, headAt, hand, voiceRings, standRock, folk, group, wordSlip, HEROD, HERODIAS, GUARD, crown, circlet, helmet, withFace,
  faceBits, throne, labelTag, hungWord, JORDAN_DAY, tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';
import { attr } from '../../core/anim.js';

const GY = 690;
const JX = 515;
const CELL = { x0: 760, x1: 890, top: 450, floor: 686 };
const HX = 1010, HDX = 1118;          // Herod (seated), Herodias
const BAL = { x: 1070, y: 250 };      // the balance

function ringsX(c) {
  return sheet().x(c.ribbon(c.arc(-10, 0, 12, 12, 0, PI * 2, 16), 3.2) + c.ribbon(c.arc(10, 0, 12, 12, 0, PI * 2, 16), 3.2), C.sun).x(c.ribbon([[-28, -20], [28, 20]], 5) + c.ribbon([[28, -20], [-28, 20]], 5), C.terracotta).out();
}
function darkStone(c, r = 14) {
  const col = mix('#4a3a33', C.plumRobe, 0.2);
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.78, 9, 0.22), 0.6, 4), col).x(c.ribbon([[-r * 0.4, -r * 0.1], [0, r * 0.2], [r * 0.3, -r * 0.3]], 1.4), C.terracotta, 'opacity=".55"').out();
}

export default {
  id: 'lk3-prison',
  beats: [
    { v: 18 },
    { v: 19, text: 'Lecz tetrarcha Herod, karcony przez niego z powodu Herodiady, żony swego brata,' },
    { v: 19, cont: true, text: 'i z powodu innych zbrodni, które popełnił,' },
    { v: 20 },
  ],
  cam: { x: [-30, 50], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, JORDAN_DAY);
    const dusk = sky(S, ['#8f7fa6', '#d9a996', '#eccaa6'], { name: 'dusk' }).layer;
    dusk.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 580, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 160), { x: 330, y: 220, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 500, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.dune, 0.5) }).markup);

    /* the land: the river on the left, the fortress rock on the right */
    const land = S.layer({ par: 0.3, sh: 3 });
    const ls = sheet();
    ls.p(c.ridge(c.wave(600, [3, 1], [300, 90]), -1100, 740, 1900, 12, 0.6), C.lake);
    ls.p(c.ridge(c.wave(646, [4, 2], [500, 140]), -1100, 2700, 1900, 12, 1), mix(C.sage2, C.sand, 0.4));
    // the rock of the fortress
    ls.p(c.cut([[730, 700], [760, 560], [800, 500], [900, 470], [1300, 460], [1500, 470], [1600, 700]], 1.4, 12), mix(C.dune, C.clay, 0.35));
    land.add(ls.out());
    land.add(reeds(c, 330, 640, 9, 64) + reeds(c, 640, 650, 7, 56) + grass(c, { x0: -1100, x1: 740, y: 648, n: 30, h: 12, color: C.moss }));

    /* the fortress: a tower with its cell (cut away), the hall */
    const fort = S.layer({ par: 0.3, sh: 4 });
    const stone = mix(C.stone2, C.dune, 0.35);
    const B = sheet();
    B.p(c.cut([[CELL.x0 - 30, GY], [CELL.x0 - 30, 300], [CELL.x1 + 30, 300], [CELL.x1 + 30, GY]], 1, 10), stone);
    let cren = '';
    for (let x = CELL.x0 - 30; x < CELL.x1 + 30; x += 34) cren += c.cut(c.rect(x, 274, 20, 28), 0.4, 5);
    B.p(cren, stone);
    let tb = '';
    for (let y = 310; y < CELL.top - 10; y += 30) for (let x = CELL.x0 - 26 + (Math.round(y / 30) % 2) * 22; x < CELL.x1 + 24; x += 48) tb += c.cut(c.rect(x, y, 42, 24), 0.5, 7);
    B.p(tb, shade(stone, 0.12));
    B.p(c.cut(c.rect(CELL.x0, CELL.top, CELL.x1 - CELL.x0, CELL.floor - CELL.top), 0.6, 8), mix(C.soilDark, C.wood2, 0.45));
    B.p(c.cut([[CELL.x0 + 36, CELL.top + 36], [CELL.x0 + 36, CELL.top + 22], ...c.arc(CELL.x0 + 55, CELL.top + 22, 19, 16, PI, 2 * PI, 6), [CELL.x0 + 74, CELL.top + 36]], 0.3, 4), JORDAN_DAY[0]);
    // the hall
    const hall = mix(C.plaster, C.dune, 0.2);
    B.p(c.cut([[910, GY], [910, 390], [1240, 390], [1240, GY]], 1, 10), hall);
    B.p(c.cut([[896, 392], [1254, 392], [1254, 368], [896, 368]], 0.6, 8), mix(C.plumRobe, C.dune, 0.35));
    let pil = '';
    [930, 1220].forEach((x) => { pil += c.cut(c.rect(x - 14, 396, 28, GY - 400), 0.5, 8); });
    B.p(pil, shade(C.plaster, -0.08));
    B.p(c.cut(c.rect(952, 410, 250, GY - 414), 0.6, 8), mix(C.dune, C.plumRobe, 0.22));
    fort.add(B.out());
    fort.add(`<g transform="translate(${HX} ${GY})">${throne(c)}</g>`);

    /* people */
    const act = S.layer({ par: 0.3, sh: 5 });
    act.add(`<g transform="translate(${JX} ${GY + 6})">${standRock(c, 150, 60)}</g>`);
    const mem = Array.from({ length: 4 }, (_, k) => ({ x: k * 58 + c.rr(-6, 6), y: c.rr(-5, 5), s: 1, flip: true, o: folk(c) }));
    act.sprite(`<g transform="scale(.84)">${group(c, mem)}</g>`, 590, GY + 4);
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });
    const herod = S.puppet(act.add(withFace(withFace(person(c, { ...HEROD, pose: 'sit' }), `<g transform="translate(0 1)">${crown(c)}</g>`), faceBits(c))));
    const hdias = S.puppet(act.add(withFace(withFace(person(c, HERODIAS), circlet(c)), faceBits(c))));
    const hAngry = herod.el.querySelector('[data-part="angry"]'), dAngry = hdias.el.querySelector('[data-part="angry"]');
    const guards = [0, 1].map((i) => S.puppet(act.add(withFace(person(c, { ...GUARD, robe: i ? shade(GUARD.robe, 0.1) : GUARD.robe }), helmet(c)))));
    const barsEl = act.add(`<g>${sheet().p([0, 1, 2, 3].map((i) => c.cut(c.rect(i * 36, 0, 8, CELL.floor - CELL.top), 0.3, 8)).join('') + c.cut(c.rect(-6, 60, 122, 8), 0.3, 6) + c.cut(c.rect(-6, 150, 122, 8), 0.3, 6), mix(C.ink, C.storm, 0.4)).out()}</g>`);

    /* words, rings, the balance and the stones */
    const fx = S.layer({ par: 0.3, sh: 5 });
    const SLIPS = [0, 1, 2, 3, 4].map(() => fx.add(wordSlip(c, 30)));
    const rings = fx.add(`<g>${ringsX(c)}</g>`);
    const tagHd = hanging(fx, labelTag(tr('Herodiada, żona brata', 'Herodias, his brother’s wife'), 17), { x: 0, y: -1500, len: 700 });
    const bal = sheet();
    bal.p(c.cut([[-8, -40], [8, -40], [6, 0], [-6, 0]], 0.3, 4), C.ochre);
    const post = fx.add(`<g><path d="M0 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>${bal.out()}</g>`);
    const beam = fx.add(`<g>${sheet().p(c.ribbon([[-120, 0], [120, 0]], 7), C.ochre).p(c.cut(c.circ(0, 0, 9, 10), 0.3, 3), shade(C.ochre, -0.2)).out()}</g>`);
    const pan = (col) => `<path d="M0 0L-36 64M0 0L36 64" stroke="${shade(C.ochre, -0.3)}" stroke-width="1.6" fill="none"/>${sheet().p(c.cut([[-44, 62], [44, 62], ...c.arc(0, 62, 44, 18, 0, PI, 10)], 0.4, 5), col).out()}`;
    const panL = fx.add(`<g>${pan(shade(C.ochre, -0.1))}</g>`);
    const panR = fx.add(`<g>${pan(shade(C.ochre, -0.1))}</g>`);
    const STONES = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: fx.add(`<g>${darkStone(c, i === 5 ? 21 : 12 + (i % 3) * 2)}</g>`) }));
    const crimes = hanging(fx, labelTag(tr('inne zbrodnie', 'all his evil deeds'), 17), { x: 0, y: -1500, len: 700 });

    return (t, time) => {
      swing(sunEl, 580, 150 + es(t, 2.5, 3.5) * 60, time, 1, 0.6);
      swing(cl1, 330 + Math.sin(time * 0.1) * 20, 220, time, 1.2, 0.6, 1);
      dusk.fade(es(t, 2.6, 3.4) * 0.8);

      /* v18 — many other exhortations, the good news: slips of paper fly out to the listeners */
      const preach = es(t, 0.05, 0.2) * (1 - es(t, 0.9, 1.05));
      SLIPS.forEach((w, i) => {
        const k = time ? ((time * 0.4 + i / 5) % 1) : (i + 1) / 6;
        pose(w, { x: lerp(JX + 30, 590 + (i % 4) * 50, k), y: lerp(GY - 160, GY - 190 + (i % 2) * 20, k) - Math.sin(k * PI) * 60, s: 0.9, r: Math.sin(time * 2 + i) * 14, o: preach * Math.sin(k * PI) });
      });

      /* v19a — he turns and rebukes Herod over Herodias */
      const turn = es(t, 1.02, 1.08);
      const rebuke = es(t, 1.05, 1.22) * (1 - es(t, 2.9, 3.05));
      const led = es(t, 3.18, 3.5);
      const jx = lerp(JX, (CELL.x0 + CELL.x1) / 2, led);
      john.set({
        x: jx, y: GY - 4 * led, s: 1.02 - led * 0.08, flip: false, walk: led > 0 && led < 1 ? jx * 0.05 : undefined,
        armF: 20 + preach * 60 + rebuke * 70 - led * 10, armB: 10 + preach * 40 + bump(t, 2.05, 2.8) * 60, head: -preach * 4 - rebuke * 4 + led * 10, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(JX, GY, 1.02);
      voice(hx + 14, hy, Math.max(preach * 0.7, rebuke * (1 - es(t, 2.9, 3.0))), time, { spread: 2.6, dir: 1 });
      const rk = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(rings, { x: 1064, y: 470, s: rk * 1.3, r: Math.sin(time * 2) * 5, o: rk > 0.01 ? 1 : 0 });
      const tk = es(t, 1.3, 1.6, ease.out), tUp = es(t, 1.95, 2.1, ease.in);
      swing(tagHd, HDX + 10, lerp(-500, 390, tk) - tUp * 800, time, 1.2, 0.8);
      fade(tagHd, tk > 0.01 && tUp < 1 ? 1 : 0);
      const angry = es(t, 1.3, 1.5);
      attr(hAngry, 'opacity', angry.toFixed(2));
      attr(dAngry, 'opacity', angry.toFixed(2));
      const order = es(t, 3.05, 3.2);
      herod.set({ x: HX + 4, y: GY - 16, s: 1.02, flip: true, armF: 30 + order * 70, armB: 60 + bump(t, 1.3, 1.9) * 30, head: 4 - angry * 6, blink: blinkAt(time, 1) });
      hdias.set({ x: HDX, y: GY + 2, s: 0.98, flip: true, armF: 20 + bump(t, 1.3, 2.0) * 50 + order * 30, armB: 30, head: -angry * 6, blink: blinkAt(time, 4) });

      /* v19b — his other crimes: dark stones into the pan of the balance */
      const bk = es(t, 1.95, 2.25, ease.out);
      const by = lerp(-500, BAL.y, bk);
      const n = [0, 1, 2, 3, 4].reduce((k, i) => k + es(t, 2.3 + i * 0.1, 2.36 + i * 0.1), 0) + es(t, 3.6, 3.66) * 2;
      const tilt = Math.min(24, n * 3.4);
      pose(post, { x: BAL.x, y: by, o: bk > 0.01 ? 1 : 0 });
      pose(beam, { x: BAL.x, y: by - 40, r: -tilt, o: bk > 0.01 ? 1 : 0 });
      const a = (-tilt * PI) / 180;
      const lx = BAL.x - Math.cos(a) * 118, ly = by - 40 - Math.sin(a) * 118, rx = BAL.x + Math.cos(a) * 118, ry = by - 40 + Math.sin(a) * 118;
      pose(panL, { x: lx, y: ly, o: bk > 0.01 ? 1 : 0 });
      pose(panR, { x: rx, y: ry, o: bk > 0.01 ? 1 : 0 });
      STONES.forEach((s) => {
        const at = s.i < 5 ? 2.22 + s.i * 0.1 : 3.52;
        const k = seg(t, at, at + 0.14);
        const px = lx + (s.i < 5 ? (s.i - 2) * 13 : 0), py = ly + 50 - (s.i < 5 ? (s.i % 2) * 8 : 14);
        pose(s.el, { x: px, y: lerp(py - 260, py, k * k), r: k * 90, o: k > 0 ? 1 : 0 });
      });
      const ck = es(t, 2.05, 2.3, ease.out), cUp = es(t, 2.9, 3.05, ease.in);
      swing(crimes, BAL.x - 190, lerp(-500, 230, ck) - cUp * 800, time, 1.2, 0.8, 2);
      fade(crimes, ck > 0.01 && cUp < 1 ? 1 : 0);

      /* v20 — he adds this to them all: guards take John into the cell, the bars come down */
      guards.forEach((g, i) => {
        const go = es(t, 3.04, 3.2), back = es(t, 3.2, 3.52);
        const gx = lerp(lerp(930 - i * 40, JX + 70 + i * 60, go), CELL.x1 + 40 + i * 50, back);
        g.set({ x: i ? gx : gx, y: GY + 4 + i * 3, s: 0.96, flip: go < 1 && back < 0.02, o: es(t, 2.98, 3.04), walk: (go > 0 && go < 1) || (back > 0 && back < 1) ? gx * 0.05 + i : undefined, armF: 30 + back * 30, blink: blinkAt(time, 5 + i) });
      });
      const drop = es(t, 3.5, 3.6, ease.in);
      pose(barsEl, { x: CELL.x0 + 8, y: CELL.top - (1 - drop) * (CELL.floor - CELL.top + 60), o: drop > 0.01 ? 1 : 0 });

      S.cam.x = -10 + es(t, 1.0, 1.3) * 40 - es(t, 3.2, 3.6) * 20;
      S.cam.z = 1.02 + es(t, 1.9, 2.2) * 0.03;
      S.cam.y = 20;
    };
  },
};
