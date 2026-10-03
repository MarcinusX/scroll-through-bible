// Łk 5,37–39 — a second painted flat: the vintner's cellar. From a jug he pours new wine, still fizzing, into an old,
// cracked wineskin on its peg — it swells, and swells, and bursts: the halves fly apart, the wine splashes out and
// spreads in a dark pool, and the skin is ruined. So he pours the new wine into fresh skins: they fill plump and hang
// whole, wine and skins both kept. And on the bench by the old dusty jar sits an old man with his cup of old wine; the
// vintner offers him the new — he waves it away, lifts his cup and smiles: "The old is better."
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  wineskin, skinHalf, jug, splash, WINE, fizz, puddle, oldJar, wineCup, sparkle, bubble, hand, headAt, kf, moving,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const FLOOR = 716, PEG = 520;
const SKINS_L = [{ x: 560, old: true }, { x: 460, old: true }, { x: 760, old: false }, { x: 860, old: false }];
const VINT = { robe: C.clayMantle, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.leather };
const OLDMAN = { robe: C.linen2, mantle: mix(C.plumRobe, C.stone, 0.3), hair: '#ece6da', hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: '#ece6da', skin: C.skin2, belt: C.ochre };
const OX = 1040;

/** a speech bubble whose tail points up (for a word said by someone standing above it); origin at the tail's tip */
function bubbleUp(c, text, { size = 22 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.6, hh = size * 2.1;
  const s = sheet();
  s.p(c.cut(c.blob(0, hh / 2 + 16, ww / 2, hh / 2, 18, 0.05), 0.6, 6), C.cream);
  s.p(c.cut([[8, 22], [0, 0], [-10, 20]], 0.4, 4), C.cream);
  return s.out() + `<text x="0" y="${(hh / 2 + 16 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}

export default {
  id: 'lk5-wine',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 37, text: 'Nikt też młodego wina nie wlewa do starych bukłaków;' },
    { v: 37, cont: true, text: 'w przeciwnym razie młode wino rozerwie bukłaki i samo wycieknie, i bukłaki się zepsują.' },
    { v: 38 },
    { v: 39, text: 'Kto się napił starego wina, nie chce potem młodego -' },
    { v: 39, cont: true, text: 'mówi bowiem: "Stare jest lepsze"».' },
  ],
  cam: { x: [-160, 240], y: [0, 100], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    // phone: the two old skins hang nearer the middle, inside the frame
    const SKINS = S.portrait ? SKINS_L.map((s, i) => (i < 2 ? { ...s, x: [598, 522][i] } : s)) : SKINS_L;
    /* the cellar: stone walls, an arch, a beam with pegs, the bench, jars */
    const wallL = S.layer({ par: 0.3, sh: 2 });
    const w = sheet();
    w.p(c.cut([[-1400, -1000], [3000, -1000], [3000, FLOOR], [-1400, FLOOR]], 0.8, 20), mix(C.stone2, C.sand2, 0.35));
    let st = '';
    for (let r = 0; r < 26; r++) for (let x = -900 + (r % 2) * 60; x < 2400; x += 120) st += c.cut(c.rect(x + c.rr(-4, 4), -516 + r * 48, 112, 42), 0.6, 5);
    w.p(st, mix(C.stone, C.sand, 0.3));
    w.p(c.cut([[1300, FLOOR], [1300, 420], ...c.arc(1400, 420, 100, 90, PI, 2 * PI, 12), [1500, FLOOR]], 0.5, 8), mix(C.soilDark, C.night, 0.3));
    wallL.add(w.out());
    const floorL = S.layer({ par: 0.5, sh: 3 });
    floorL.add(sheet().p(c.cut([[-1400, FLOOR - 6], [3000, FLOOR - 10], [3000, 1700], [-1400, 1700]], 0.8, 20), mix(C.clay, C.soil, 0.25)).out());
    const beamL = S.layer({ par: 0.5, sh: 4 });
    beamL.add(sheet().p(c.cut(c.rect(360, PEG - 30, 580, 16), 0.4, 8), C.wood2).p(SKINS.map((s) => c.cut(c.rect(s.x - 5, PEG - 16, 10, 18), 0.2, 3)).join(''), C.wood).out());
    // jars along the wall, the bench and the old dusty jar
    beamL.add(`<g transform="translate(230 ${FLOOR})">${oldJar(c, 110)}</g><g transform="translate(320 ${FLOOR}) scale(.8)">${oldJar(c, 110)}</g>`);
    beamL.add(`<g transform="translate(${OX} ${FLOOR})">${sheet().p(c.cut(c.rect(-90, -48, 180, 12), 0.4, 6), C.wood).p(c.cut(c.rect(-80, -36, 12, 36), 0.3, 4) + c.cut(c.rect(68, -36, 12, 36), 0.3, 4), C.wood2).out()}</g>`);
    const jar = beamL.add(`<g transform="translate(${OX + (S.portrait ? 100 : 130)} ${FLOOR})">${oldJar(c, 130)}</g>`);

    /* the skins: whole (swelling), the burst halves, the fizz inside */
    const skL = S.layer({ par: 0.5, sh: 4 });
    const skins = SKINS.map((s, i) => ({ ...s, i, el: skL.add(`<g>${wineskin(c, { old: s.old, w: 60, h: 96 })}</g>`), fz: skL.add(`<g>${fizz(c, 8, 16)}</g>`) }));
    const halves = [-1, 1].map((side) => ({ side, el: skL.add(`<g>${skinHalf(c, side, 60, 96)}</g>`) }));
    const pool = skL.add(`<g>${puddle(c, 200)}</g>`);
    const splashEl = skL.add(`<g>${splash(c, 50)}</g>`);
    const drops = Array.from({ length: 8 }, (_, i) => ({ i, a: -PI * (0.1 + (i / 7) * 0.8), el: skL.add(`<path d="${c.cut(c.ell(0, 0, 4, 7, 8), 0.2, 2)}" fill="${WINE}"/>`) }));
    const glints = [0, 1].map(() => skL.add(`<g>${sparkle(c, 12)}</g>`));

    /* the vintner with his jug; the old man on the bench */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const vint = S.puppet(PL.add(person(c, VINT)));
    const jugEl = PL.add(`<g><g transform="scale(.62)">${jug(c)}</g></g>`);
    const stream = PL.add(`<path d="${c.ribbon([[0, 0], [1.5, 50], [0, 100]], 4)}" fill="${WINE}"/>`);
    const bub = PL.add(`<g>${fizz(c, 6, 10)}</g>`);
    const old = S.puppet(PL.add(person(c, { ...OLDMAN, pose: 'sit', holdF: wineCup(c) })));
    const say = PL.add(S.portrait ? `<g>${bubbleUp(c, tr('Stare jest lepsze!', 'The old is better!'), { size: 30 })}</g>` : `<g>${bubble(c, tr('Stare jest lepsze!', 'The old is better!'), { size: 22, tail: -1 })}</g>`);
    const jarGlow = PL.add(`<g>${sparkle(c, 12)}</g>`);

    // where the vintner stands to pour into skin i (he stands on the right of it, facing left)
    const V0 = S.portrait ? 38 : 0;
    const VK = [[0, 700 + V0], [0.25, 640 + V0], [1.35, 640 + V0], [1.5, 700 + V0], [2.05, 850], [2.45, 850], [2.55, 950], [2.9, 950], [3.2, 900]];

    return (t, time) => {
      const T = time;
      const vx = kf(t, VK, ease.sine);
      const walking = moving(t, VK);
      const pourA = es(t, 0.3, 0.45) * (1 - es(t, 1.2, 1.3));            // into the old skin
      const pourB = es(t, 2.08, 2.2) * (1 - es(t, 2.42, 2.5));            // new skin 1
      const pourC = es(t, 2.58, 2.68) * (1 - es(t, 2.88, 2.95));          // new skin 2
      const pour = Math.max(pourA, pourB, pourC);
      const jump = es(t, 1.35, 1.45) * (1 - es(t, 1.7, 1.9));
      const offer = es(t, 3.2, 3.45) * (1 - es(t, 4.2, 4.4));
      const armF = walking ? 50 : 60 + pour * 70 + offer * 40;
      vint.set({ x: vx, y: FLOOR + 6, s: 1.02, flip: t < 3.0, walk: walking ? vx * 0.05 : undefined, armF, armB: 20 + jump * 120, lean: -jump * 10, head: jump * -8 + offer * 4, blink: blinkAt(T, 2) });
      const [hx, hy] = hand(vx, FLOOR + 6, 1.02, t < 3.0, armF, -jump * 10);
      const tilt = pour * 70;
      pose(jugEl, { x: hx, y: hy + 4, r: (t < 3.0 ? -1 : 1) * tilt, sx: t < 3.0 ? -1 : 1 });
      const target = pourA > 0.01 ? skins[0] : pourB > 0.01 ? skins[2] : skins[3];
      const sp = [hx - (t < 3.0 ? 30 : -30) * 0.62, hy - 10];
      const len = Math.max(10, PEG + 4 - sp[1] + 30);
      pose(stream, { x: target.x + 2, y: PEG + 4 - len + 6, sy: len / 100, o: pour > 0.6 ? 1 : 0 });
      pose(bub, { x: target.x, y: PEG + 10, s: pour, o: pour > 0.6 ? 1 : 0, r: T * 60 });

      /* v37 — the old skin swells and bursts; the wine spills */
      const swell = es(t, 0.45, 1.3);
      const burst = es(t, 1.32, 1.36);
      skins.forEach((s) => {
        const fillK = s.i === 0 ? swell : s.i === 2 ? es(t, 2.1, 2.45) : s.i === 3 ? es(t, 2.6, 2.9) : 0;
        const k = s.i === 0 ? 1 + swell * 0.28 + (T ? Math.sin(T * 12) * 0.015 * swell : 0) : 1 + fillK * 0.06;
        pose(s.el, { x: s.x, y: PEG, s: 1.2, sx: k * 1.2, sy: (s.i === 0 ? 1 + swell * 0.12 : 1 + fillK * 0.04) * 1.2, o: s.i === 0 ? 1 - burst : 1 });
        const fz = s.i === 0 ? swell * (1 - burst) : fillK * (1 - es(t, 3.0, 3.3) * 0.6);
        pose(s.fz, { x: s.x, y: PEG + 66, s: 0.6 + fz * 0.6, r: T * 30 + s.i * 40, o: fz });
      });
      halves.forEach((h) => {
        const k = es(t, 1.34, 1.7, ease.out);
        pose(h.el, { x: skins[0].x + h.side * k * 50, y: PEG + k * k * (FLOOR - PEG - 60), s: 1.2, r: h.side * k * 70, o: burst });
      });
      const spill = es(t, 1.36, 1.9);
      pose(pool, { x: skins[0].x + 20, y: FLOOR + 8, sx: 0.1 + spill * 0.9, sy: 0.2 + spill * 0.8, o: burst });
      pose(splashEl, { x: skins[0].x, y: PEG + 60, s: bump(t, 1.34, 1.7) * 1.4, o: bump(t, 1.34, 1.7) });
      drops.forEach((d) => { const k = es(t, 1.35, 1.75); pose(d.el, { x: skins[0].x + Math.cos(d.a) * k * 110, y: PEG + 60 + Math.sin(d.a) * k * 90 + k * k * 160, o: k > 0.02 && k < 0.98 ? 1 : 0 }); });

      /* v38 — new wine into new skins: both kept */
      glints.forEach((g, i) => { const k = bump(t, 2.55 + i * 0.35, 3.0 + i * 0.35); pose(g, { x: skins[2 + i].x + 26, y: PEG + 40, s: k, r: T * 50, o: k }); });

      /* v39 — the old man with his old wine waves away the new: "the old is better" */
      const sip = bump(t, 3.02, 3.4);
      const refuse = es(t, 3.4, 3.6) * (1 - es(t, 4.1, 4.3));
      const toast = es(t, 4.05, 4.3);
      old.set({ x: OX - 20, y: FLOOR - 46, s: 1.0, flip: true, armF: 40 + sip * 90 + toast * 70, armB: 20 + refuse * 140, head: sip * -10 + refuse * 14 - toast * 8, blink: blinkAt(T, 5) });
      const sk = es(t, 4.1, 4.3, ease.back);
      pose(say, { x: S.portrait ? OX - 60 : OX + 150, y: S.portrait ? FLOOR - 40 : FLOOR - 140, s: sk, o: sk > 0.01 ? 1 : 0 });
      const jg = bump(t, 3.05, 3.9);
      pose(jarGlow, { x: OX + (S.portrait ? 90 : 120), y: FLOOR - 120, s: jg, r: T * 40, o: jg });
      void jar;

      S.cam.x = kf(t, [[0, S.portrait ? -10 : -80], [1.3, S.portrait ? -10 : -80], [1.9, S.portrait ? 0 : -60], [2.05, 60], [3.0, 80], [3.2, 200], [3.95, 200], [4.2, S.portrait ? 160 : -60], [5, S.portrait ? 170 : -80]]);
      S.cam.y = kf(t, [[0, 80], [1.3, 90], [2.0, 70], [3.2, 70], [4.2, 40], [5, 40]]);
      S.cam.z = kf(t, [[0, S.portrait ? 1.1 : 1.16], [1.3, S.portrait ? 1.12 : 1.2], [2.0, 1.14], [3.2, 1.14], [3.95, 1.12], [4.2, 1.02], [5, 1.02]]);
    };
  },
};
