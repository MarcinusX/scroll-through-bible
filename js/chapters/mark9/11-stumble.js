// Mk 9,42–48 — told as symbolic paper theatre, with Jesus and the child in front. A little one with a
// small light stumbles over a dark stone pushed into his path; better a millstone sunk in the sea
// (it drops and sinks — no one is shown). Hand, foot, eye: cards hang down, each tied to a dark stone;
// paper scissors snip them away, and a traveller — one arm hidden, then on a crutch, then with a patch
// over one eye — walks up the path through the lit gate into life, while far off the fire of Gehenna
// burns on; even rain cannot put it out.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, rock, grass, olive, cloud, cypress, bush } from '../../assets/nature.js';
import { rain, stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, along, millstone, scissors, paperHand, paperFoot, paperEye, stumbleCard, lifeGate, firePit, candle, crutch, eyePatch, withFace, labelOnString, darkScrap, man } from './lib.js';

const PI = Math.PI;
const P = 0.35;
const GATE = [800, 452];
const PATHG = [[930, 700], [990, 650], [900, 600], [850, 530], [812, 470], [800, 452]];
const LITTLE = [[1060, 690], [940, 690]];
const CARD = [1010, 150];

export default {
  id: 'm9-stumble',
  beats: [
    { v: 42, text: 'Kto by się stał powodem grzechu dla jednego z tych małych, którzy wierzą,' },
    { v: 42, cont: true, text: 'temu byłoby lepiej uwiązać kamień młyński u szyi i wrzucić go w morze.' },
    { v: 43, text: 'Jeśli twoja ręka jest dla ciebie powodem grzechu, odetnij ją;' },
    { v: 43, cont: true, text: 'lepiej jest dla ciebie ułomnym wejść do życia wiecznego, niż z dwiema rękami pójść do piekła w ogień nieugaszony.' },
    { v: 45, text: 'I jeśli twoja noga jest dla ciebie powodem grzechu, odetnij ją;' },
    { v: 45, cont: true, text: 'lepiej jest dla ciebie, chromym wejść do życia, niż z dwiema nogami być wrzuconym do piekła.' },
    { v: 47, text: 'Jeśli twoje oko jest dla ciebie powodem grzechu, wyłup je;' },
    { v: 47, cont: true, text: 'lepiej jest dla ciebie jednookim wejść do królestwa Bożego, niż z dwojgiem oczu być wrzuconym do piekła,' },
    { v: 48 },
  ],
  cam: { x: [-60, 60], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the valley of fire, its label and the rain drawn in from under the thread; the cards
    // and the millstone a little further in
    const PH = S.portrait;
    const FX = PH ? 975 : 1090, DX = FX - 1090;
    const CX = PH ? 955 : CARD[0], MX = PH ? 535 : 490;
    sky(S, ['#c7d9d8', '#ebe3cd', '#f4e1c4']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 560, y: 120, len: 700 });

    /* ---------- the land: the sea on the left, the hill of life, the valley of fire ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.lavender, 0.25) }).markup);
    const seaL = S.layer({ par: 0.2, sh: 2 });
    seaL.add(waterBand(c, { y: 520, color: C.lake2, x1: 2500, foamN: 24 }).markup);
    const splash = seaL.add(`<g opacity="0">${[0, 1, 2].map((i) => `<path class="rip" d="${c.ribbon(c.arc(0, 0, 30, 8, 0, PI * 2, 24), 3)}" fill="${C.foam}"/>`).join('')}</g>`);
    const rips = Array.from(splash.querySelectorAll('.rip'));
    const bubbles = seaL.add(`<g opacity="0">${[0, 1, 2, 3].map((i) => `<circle cx="${(i - 1.5) * 10}" cy="${-i * 12}" r="${3 + (i % 2)}" fill="${C.foam}"/>`).join('')}</g>`);
    const landL = S.layer({ par: P, sh: 3 });
    const g = sheet();
    g.p(c.cut([[570, 1700], [570, 560], [620, 530], [680, 470], [760, 440], [840, 438], [920, 470], [1040, 530], [1300, 560], [2500, 560], [2500, 1700]], 1.2, 10), mix(C.hillNear, C.sage2, 0.4));
    g.p(c.cut([[960, 566], [1010, 600], [1170, 606], [1230, 570], [1200, 560]].map(([x, y]) => [x + DX, y]), 0.8, 8), mix(C.soilDark, C.hillNear, 0.3));
    g.p(c.ribbon(PATHG.map(([x, y]) => [x, y + 4]), 16, 2), mix(C.sand, C.hillNear, 0.3));
    g.p(c.ribbon([[990, 654], [1040 + DX / 2, 626], [1090 + DX, 600]], 12, 2), mix(C.sand2, C.soilDark, 0.35), 'opacity=".6"');
    g.p(c.cut([[-900, 700], [2500, 700], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.45));
    g.p(c.ribbon([[1180, 704], [1000, 694], [880, 692]], 14, 2), mix(C.sand, C.hillNear, 0.3));
    landL.add(g.out());
    landL.add(cypress(c, 700, 470, 90, C.moss2) + cypress(c, 900, 470, 80, C.moss2) + olive(c, 1420, 700, 0.9) + bush(c, 640, 540, 60, C.sage, C.moss) + rock(c, 1080, 700, 40, 14));
    const G = lifeGate(c, { w: 104, h: 150 });
    const gateGlow = landL.add(`<g>${G.light}</g>`);
    landL.add(`<g transform="translate(${GATE[0]} ${GATE[1]})">${G.arch}</g>`);
    const F = firePit(c, 200);
    landL.add(`<g transform="translate(${FX} 570)">${F.pit}</g>`);
    const flames = F.flames.map((f, i) => ({ ...f, i, el: landL.add(`<g>${f.m}</g>`) }));
    const labelLife = hanging(landL, labelOnString(tr('życie', 'life'), { size: 20 }), { x: GATE[0], y: 250, len: 800 });
    const labelKing = hanging(landL, labelOnString(tr('królestwo Boże', 'God’s Kingdom'), { size: 20 }), { x: GATE[0], y: 250, len: 800 });
    const labelFire = hanging(landL, labelOnString(tr('Gehenna', 'Gehenna'), { size: 18 }), { x: FX + 20, y: 420, len: 800 });

    /* ---------- the little one who stumbles, and the travellers ---------- */
    const walkL = S.layer({ par: P, sh: 4 });
    const little = S.puppet(walkL.add(person(c, { ...LOOK.boy, robe: C.wheatRobe, holdF: `<g transform="translate(0 8) scale(.35)">${candle(c, 30)}</g>` })));
    const littleFlame = little.el.querySelector('.flame');
    const darkStone = walkL.add(`<g>${sheet().p(c.cut(c.blob(0, -14, 20, 15, 10, 0.3), 1.2, 4), mix(C.storm2, C.soilDark, 0.5)).out()}</g>`);
    const shove = walkL.add(`<g opacity="0">${darkScrap(c, 16)}</g>`);
    const T1 = S.puppet(walkL.add(person(c, man(c, { robe: C.sageRobe }))));
    T1.el.querySelector('.armF').setAttribute('opacity', '0');
    const T2 = S.puppet(walkL.add(person(c, man(c, { robe: C.dustyBlue }))));
    const crutchEl = walkL.add(`<g opacity="0">${crutch(c, 130)}</g>`);
    const T3 = S.puppet(walkL.add(withFace(person(c, { ...man(c, { robe: C.roseRobe }), hairStyle: 'short' }), eyePatch(c))));
    const TRAV = [{ p: T1, t0: 3.05 }, { p: T2, t0: 5.05 }, { p: T3, t0: 7.05 }];

    /* ---------- rain that cannot put out the fire (v48) ---------- */
    const rainL = S.layer({ par: P, sh: 3 });
    const rCloud = hanging(rainL, stormCloud(c, 240, mix(C.storm, C.stone2, 0.4), mix(C.storm2, C.stone2, 0.3)), { x: FX, y: 400, len: 900 });
    const rainEl = rainL.add(`<g opacity="0">${rain(c, { x0: -90, x1: 90, y0: 0, y1: 150, n: 40, slant: -10 })}</g>`);

    /* ---------- Jesus and the child, in front ---------- */
    const mainL = S.layer({ par: 0.55, sh: 5 });
    mainL.add(rock(c, 660, 752, 150, 40, C.rock2));
    const jesus = S.puppet(mainL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const child = S.puppet(mainL.add(person(c, LOOK.child)));

    /* ---------- the millstone and the cards come down from the flies ---------- */
    const flyL = S.layer({ par: 0.15, sh: 6 });
    const stone = hanging(flyL, `<g transform="scale(.9)">${millstone(c, 50)}</g>`, { x: MX, y: 250, len: 900 });
    const cards = [paperHand(c, C.skin2, 1.3), `<g transform="translate(-16 12) scale(1.2)">${paperFoot(c)}</g>`, `<g transform="scale(1.4)">${paperEye(c, 34)}</g>`].map((icon, i) => ({ i, t0: 2 + i * 2, el: hanging(flyL, `<g transform="translate(0 0)">${stumbleCard(c, `<g transform="translate(0 ${i === 0 ? 20 : 0})">${icon}</g>`)}</g>`, { x: CX, y: CARD[1], len: 900 }) }));
    cards.forEach((cd) => { cd.obj = cd.el.querySelector('.obj'); });
    const sc = flyL.add(`<g opacity="0">${scissors(c, 60)}</g>`);
    const bladeA = sc.querySelector('.bA'), bladeB = sc.querySelector('.bB');

    return (t, time) => {
      const T = time;
      swing(cl1, 560 + Math.sin(T * 0.1) * 20, 120, T, 1.2, 0.6);

      /* beat 0: the little one walks with his light; a dark stone is pushed into his way; he stumbles */
      const lw = es(t, 0, 0.45);
      const trip = es(t, 0.55, 0.7) * (1 - es(t, 1.6, 1.9));
      const [lx, ly] = [lerp(LITTLE[0][0], LITTLE[1][0], lw), 700];
      little.set({ x: lx, y: ly, s: 0.46, flip: true, walk: lw > 0 && lw < 1 ? lx * 0.1 : undefined, lean: -trip * 38, armF: 50 + trip * 40, armB: trip * 80, head: -trip * 10, o: 1 - es(t, 2, 2.3) });
      pose(littleFlame, { x: 0, y: -50, sy: 1 - trip * 0.6 + Math.sin(T * 8) * 0.05, o: 1 - trip * 0.7 });
      const push = es(t, 0.35, 0.55);
      pose(darkStone, { x: lerp(1000, 912, push), y: 704, r: -push * 200, o: es(t, 0.3, 0.36) * (1 - es(t, 1.35, 1.6)) });
      pose(shove, { x: lerp(1040, 950, push) + 20, y: 670, r: T * 30, o: bump(t, 0.3, 0.7) });

      /* beat 1: the millstone drops into the sea */
      const ms = es(t, 1.05, 1.3, ease.back);
      const drop = es(t, 1.45, 1.75, ease.in);
      swing(stone, MX, lerp(-1000, 250, ms) + drop * 300 + es(t, 1.75, 2.1) * 60, T, 1.2 * (1 - drop), 0.8, 1);
      fade(stone, 1 - es(t, 1.72, 2));
      const sink = seg(t, 1.72, 2.3);
      pose(splash, { x: MX, y: 560, o: sink > 0 && sink < 1 ? 1 : 0 });
      rips.forEach((r, i) => pose(r, { s: 0.5 + ((sink * 1.4 + i * 0.3) % 1) * 3, o: (1 - ((sink * 1.4 + i * 0.3) % 1)) * 0.9 }));
      pose(bubbles, { x: MX, y: 560 - sink * 30, o: bump(t, 1.8, 2.4) });

      /* beats 2, 4, 6: a card comes down, the scissors snip it away and it falls */
      let scX = CX + 40, scY = CARD[1] - 30, scO = 0, snip = 0;
      cards.forEach((cd) => {
        const down = es(t, cd.t0, cd.t0 + 0.3, ease.back);
        const fall = es(t, cd.t0 + 0.62, cd.t0 + 0.98, ease.in);
        if (t > cd.t0 - 0.1 && t < cd.t0 + 1) { scO = es(t, cd.t0 + 0.3, cd.t0 + 0.4) * (1 - es(t, cd.t0 + 0.75, cd.t0 + 0.9)); snip = bump(t, cd.t0 + 0.45, cd.t0 + 0.62); }
        const gone = es(t, cd.t0 + 0.95, cd.t0 + 1.2);
        swing(cd.el, CX, lerp(-1000, CARD[1], down) - gone * 1300, T, 1.2 * (1 - fall), 0.8, cd.i);
        pose(cd.obj, { x: fall * 50, y: fall * 640, r: fall * 35, o: 1 - es(t, cd.t0 + 0.85, cd.t0 + 0.98) });
      });
      pose(sc, { x: scX, y: scY + 40, r: 90, o: scO });
      pose(bladeA, { r: -(1 - snip) * 22 });
      pose(bladeB, { r: (1 - snip) * 22 });

      /* beats 3, 5, 7: a traveller walks up the path and through the gate into life */
      let gateOn = 0;
      TRAV.forEach((tr_) => {
        const u = es(t, tr_.t0, tr_.t0 + 0.75, (x) => x);
        const [x, y, dir] = along(PATHG, u);
        const inGate = es(t, tr_.t0 + 0.72, tr_.t0 + 0.88);
        gateOn = Math.max(gateOn, bump(t, tr_.t0 + 0.6, tr_.t0 + 1.1));
        tr_.p.set({ x, y, s: lerp(0.62, 0.36, u), flip: dir < 0, o: es(t, tr_.t0 - 0.05, tr_.t0 + 0.05) * (1 - inGate), walk: u > 0 && u < 1 ? u * 40 : undefined, amt: tr_.p === T2 ? 0.5 : 0.8, armF: tr_.p === T2 ? 10 : 0, blink: blinkAt(T, 3) });
      });
      { const u = es(t, 5.05, 5.8, (x) => x); const [x, y, dir] = along(PATHG, u); const sc_ = lerp(0.62, 0.36, u); pose(crutchEl, { x: x + (dir < 0 ? -1 : 1) * 30 * sc_, y, s: sc_, r: (dir < 0 ? -1 : 1) * (6 + Math.sin(u * 40) * 4), o: es(t, 5, 5.1) * (1 - es(t, 5.77, 5.93)) }); }
      pose(gateGlow, { x: GATE[0], y: GATE[1], s: 1 + gateOn * 0.2, o: 0.55 + gateOn * 0.45 });
      const king = es(t, 7.05, 7.3);
      swing(labelLife, GATE[0], lerp(lerp(-1000, 250, es(t, 2.9, 3.2, ease.back)), -1000, king), T, 1.2, 0.8, 5);
      swing(labelKing, GATE[0], lerp(-1000, 250, king), T, 1.2, 0.8, 6);
      swing(labelFire, FX + 20, lerp(-1000, 420, es(t, 3.4, 3.7, ease.back)), T, 1.2, 0.8, 7);

      /* the fire that is never quenched */
      const flare = Math.max(bump(t, 3.5, 4), bump(t, 5.5, 6), bump(t, 7.5, 8), es(t, 8.1, 8.5));
      flames.forEach((f) => pose(f.el, { x: FX + f.x, y: 570 + f.y, sy: 0.7 + flare * 0.5 + Math.sin(T * 6 + f.i * 1.7) * 0.12, sx: 1 + Math.sin(T * 5 + f.i) * 0.08, o: 0.9 }));
      const rn = es(t, 8.05, 8.35, ease.back);
      swing(rCloud, FX - (PH ? 40 : 0), lerp(-1000, 440, rn), T, 1, 0.8, 8);
      pose(rainEl, { x: FX, y: 450 + ((T * 120) % 40), o: rn * 0.9 });

      /* Jesus teaches, with the child beside him */
      const pointUp = es(t, 3.05, 3.3) * 0.5 + es(t, 2.05, 2.3) * 0.5;
      jesus.set({ x: 660, y: 740, s: 1.02, armF: 30 + es(t, 0.1, 0.4) * 40 + pointUp * 40 + Math.sin(T * 1.2) * 5, armB: 10 + es(t, 1.05, 1.3) * 60 * (1 - es(t, 1.9, 2.1)) + es(t, 8.05, 8.3) * 30, head: -4 - pointUp * 6, blink: blinkAt(T, 1) });
      child.set({ x: 560, y: 748, s: 0.58, head: -6 - pointUp * 6, armF: 20 + bump(t, 0.5, 1.5) * 30, blink: blinkAt(T, 6) });

      S.cam.x = -30 * bump(t, 0.9, 2.1) + 10 * es(t, 2, 3);
      S.cam.z = 1.02 + es(t, 8, 8.6) * 0.03;
      S.cam.y = 20;
    };
  },
};
