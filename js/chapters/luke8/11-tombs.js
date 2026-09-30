// Łk 8,26–29 — the far shore, "opposite Galilee": a little round map shows the lake with the crossing drawn on it
// as the boat glides in under the hillside of tombs. Jesus steps ashore, and down from the tombs runs a man with
// demons, in rags, with a dark shadow clinging behind him; two small cards hang over him — a house crossed out, a
// tomb — he lives not in a house but among the tombs. He sees Jesus, cries out and falls down before Him: "What have
// you to do with me, Jesus, Son of the Most High God? I beg you, do not torment me!" — for Jesus was commanding the
// unclean spirit to come out, light in His raised hand, the shadow straining. A sepia flat comes down with the
// story of before: men bound him with chains and fetters, he snapped them, and the spirit drove him into the desert.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { boat, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gerasaShore, WILD, shadowCloak, cry, tomb, chain, link, fetter, spirit, disc, crossX, discPlate, headAt, hand, kf, alongPts, still, flat, flatSky,
  flatHills, flyTo, dropK, SEPIA, manO, figure, tr, PI,
} from './lib.js';

const JX = 690, FEET = 700, MX = 870;

/** a tiny round map: the lake, Galilee on the west shore, the land of the Gerasenes on the east, the crossing dotted */
function lakeMap(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 4, 30, 50, 16, 0.08), 0.5, 5), C.lake);
  s.x(c.ribbon([[-4, 54], [0, 70]], 4), C.lake2);
  let dots = '';
  for (let i = 0; i < 6; i++) dots += c.poly(c.circ(-24 + i * 9.5, -8 + i * 2, 1.8, 6));
  s.x(dots, C.inkSoft);
  s.p(c.cut(c.circ(-40, -12, 5, 8), 0.2, 3), C.terracotta);
  s.p(c.cut(c.circ(40, 6, 5, 8), 0.2, 3), C.moss2);
  const F = 'EB Garamond, Georgia, serif';
  return `${s.out()}<text x="-40" y="-24" text-anchor="middle" font-family="${F}" font-size="12" font-style="italic" fill="${C.ink}">${tr('Galilea', 'Galilee')}</text><text x="40" y="28" text-anchor="middle" font-family="${F}" font-size="11" font-style="italic" fill="${C.ink}">${tr('Gergezeńczycy', 'Gadarenes')}</text>`;
}
function houseIcon(c) {
  return sheet().p(c.cut(c.rect(-18, -14, 36, 26), 0.3, 4), C.plaster).p(c.cut([[-22, -14], [0, -30], [22, -14]], 0.3, 4), C.roof).p(c.cut(c.rect(-5, -2, 10, 14), 0.2, 3), C.wood2).out();
}

export default {
  id: 'lk8-tombs',
  beats: [
    { v: 26 },
    { v: 27, text: 'Gdy wyszedł na ląd, wybiegł Mu naprzeciw pewien człowiek, który był opętany przez złe duchy.' },
    { v: 27, cont: true, text: 'Już od dłuższego czasu nie nosił ubrania i nie mieszkał w domu, lecz w grobach.' },
    { v: 28, text: 'Gdy ujrzał Jezusa, z krzykiem upadł przed Nim i zawołał:' },
    { v: 28, cont: true, text: '«Czego chcesz ode mnie, Jezusie, Synu Boga Najwyższego? Błagam Cię, nie dręcz mnie!»' },
    { v: 29, text: 'Rozkazywał bowiem duchowi nieczystemu, by wyszedł z tego człowieka.' },
    { v: 29, cont: true, text: 'Bo już wiele razy porywał go, a choć wiązano go łańcuchami i trzymano w pętach, on rwał więzy, a zły duch pędził go na miejsca pustynne.' },
  ],
  cam: { x: [-120, 120], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = gerasaShore(S, { skyCols: ['#b9c6d2', '#efd9bf', '#f6dab0'], sunAt: [1300, 240], sunR: 40 });
    const TOMB = set.tombAt[0];

    /* the boat: disciples baked in, Jesus a puppet at the stern until He steps out */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const B = boat(c, {});
    const disM = still(c, [CAST.james, CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ x: -110 + i * 56, y: 2, s: 0.92, flip: false, armF: 14 + (i % 2) * 20, armB: 8, head: -2, o })));
    const boatG = boatL.add(`<g><g>${B.back}</g>${disM}<g data-k="jin">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g></g>`);
    const jIn = S.puppet(S.$('jin').firstElementChild);

    /* the man from the tombs */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const burst = lightL.add(`<g opacity="0">${rays(c, { n: 16, r0: 30, r1: 200, spread: 0.04, color: '#fff3cf' })}<circle r="90" fill="url(#halo-glow)"/></g>`);
    const manL = S.layer({ par: 0.5, sh: 4 });
    const shadowEl = manL.add(`<g>${shadowCloak(c, 140, 260)}</g>`);
    const run = S.puppet(manL.add(person(c, { ...WILD })));
    const kneel = S.puppet(manL.add(person(c, { ...WILD, pose: 'kneel' })));

    /* Jesus on the shore, light in His hand */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));

    /* words, cards, the map */
    const wL = S.layer({ par: 0.52, sh: 4 });
    const mapEl = set.hangL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-82" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${discPlate(c, `<g transform="scale(1.1)">${lakeMap(c)}</g>`, { r: 74, face: mix(C.parchment, C.cream, 0.3) })}</g>`);
    const cardHouse = wL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-48" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${disc(c, `<g transform="scale(1.1)">${houseIcon(c)}</g>`, { r: 42 })}<g>${crossX(c, 30)}</g></g>`);
    const cardTomb = wL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-48" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${disc(c, `<g transform="translate(0 22) scale(.55)">${tomb(c, 70, 84, { face: C.rock2 })}</g>`, { r: 42 })}</g>`);
    const bang = wL.add(`<g opacity="0">${cry(c, ['!!'], { size: 32, w: 84, dir: -1 })}</g>`);
    const plea = wL.add(`<g opacity="0">${cry(c, [tr('Czego chcesz ode mnie, Jezusie,', 'What do I have to do with you, Jesus,'), tr('Synu Boga Najwyższego?', 'you Son of the Most High God?'), tr('Błagam Cię, nie dręcz mnie!', 'I beg you, don’t torment me!')], { size: 16, dir: 1 })}</g>`);

    /* the story of before: a sepia flat */
    const FW = 520, FH = 250;
    const inner = flatSky(S, FW, FH, [SEPIA.sky[0], SEPIA.sky[2]], 'lk8-chains')
      + flatHills(c, FW, 40, mix(C.sand2, C.dune, 0.4), 12)
      + `<g transform="translate(150 60) scale(.5)">${tomb(c, 70, 84, { face: mix(C.rock2, C.dune, 0.3) })}</g>`
      + figure(c, { ...manO(c), robe: mix(C.stone2, C.dune, 0.4), hairStyle: 'wrap', veil: C.sand2 }, { x: -170, y: 104, s: 0.5, armF: 70, armB: 40 })
      + figure(c, { ...manO(c), robe: mix(C.dustyBlue, C.dune, 0.4), hairStyle: 'short' }, { x: -110, y: 108, s: 0.5, armF: 80, armB: 30 });
    const flatEl = wL.add(flat(S, inner, { w: FW, h: FH, face: SEPIA.wall }));
    const fMan = S.puppet(wL.add(person(c, { ...WILD, robe: mix(WILD.robe, C.dune, 0.3) })));
    const fLinks = Array.from({ length: 8 }, (_, i) => ({ i, el: wL.add(`<g opacity="0">${i < 6 ? link(c, 6) : fetter(c, 8)}</g>`), a: -PI * 0.9 + (i / 7) * PI * 0.8 }));
    const fChain = wL.add(`<g opacity="0">${chain(c, 7, 6)}</g>`);
    const fWind = [0, 1, 2].map(() => wL.add(`<g opacity="0">${spirit(c, 0.7)}</g>`));

    const boatKeys = [[0.05, [-80, 716]], [0.85, [390, 730]]];
    const manPath = [[TOMB[0], TOMB[1] + 2], [1120, set.hfn(1120) + 26], [1040, 650], [960, 686], [MX, FEET + 4]];

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v26 — they sail to the country of the Gerasenes, opposite Galilee */
      const [bx, by] = kf(t, boatKeys, ease.out);
      const afloat = 1 - es(t, 0.8, 0.95);
      pose(boatG, { x: bx, y: by + (T ? Math.sin(T * 1.3) * 2 * afloat : 0), s: 0.88, r: T ? Math.sin(T * 1.1) * 0.8 * afloat : 0 });
      const mk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 1.0, 1.25));
      pose(mapEl, { x: 800, y: lerp(-1500, 230, mk), r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: mk > 0.01 ? 1 : 0 });

      /* v27a — He steps ashore; the man runs down from the tombs */
      const out = es(t, 1.05, 1.1);
      jIn.set({ x: 128, y: -2, s: 0.98, o: 1 - out, armF: 16, armB: 6, head: 3, blink: blinkAt(T) });
      const jx = kf(t, [[1.08, bx + 128 * 0.88], [1.5, JX]], ease.out);
      const hop = bump(t, 1.08, 1.28) * 30;
      const cmd = es(t, 5.05, 5.3) * (1 - es(t, 6.0, 6.2));
      jesus.set({ x: jx, y: lerp(by - 6, FEET, es(t, 1.08, 1.28)) - hop, s: 1.0, o: out, walk: t > 1.25 && t < 1.5 ? jx * 0.06 : undefined, armF: 16 + bump(t, 3.1, 3.8) * 20 + cmd * 70, armB: 8 + cmd * 130, head: -cmd * 6, blink: blinkAt(T) });
      const u = es(t, 1.2, 1.95, (x) => x);
      const [mx, my] = alongPts(manPath, u);
      const ms = lerp(0.62, 1.0, es(t, 1.2, 1.95));
      const fall = es(t, 3.3, 3.38);
      const writhe = es(t, 5.1, 5.3) * (1 - es(t, 6.0, 6.1));
      run.set({ x: mx, y: my, s: ms, flip: true, o: seg(t, 1.18, 1.25) * (1 - fall), walk: u > 0 && u < 1 ? t * 40 : undefined, amt: 1.5, armF: 120 + (T ? Math.sin(T * 9) * 16 : 0) * (u < 1 ? 1 : 0) - (u >= 1 ? 90 : 0), armB: 140 - (u >= 1 ? 110 : 0), head: -10 + (u >= 1 ? 16 : 0), lean: u < 1 ? -8 : 2, blink: blinkAt(T, 4) });
      kneel.set({ x: MX - 10 + (T ? Math.sin(T * 30) * 2 * writhe : 0), y: FEET + 4, s: 1.0, flip: true, o: fall, armF: 70 + bump(t, 3.9, 4.9) * 40 + writhe * 30, armB: 60 + writhe * 60, lean: 16 - writhe * 10, head: -es(t, 3.4, 3.7) * 10 - writhe * 10, blink: blinkAt(T, 4) });
      const sx = fall > 0.5 ? MX - 10 : mx, sy = fall > 0.5 ? FEET + 4 : my;
      pose(shadowEl, { x: sx + 10, y: sy + 2, s: (fall > 0.5 ? 0.86 : ms) * (1 + writhe * 0.12 * (T ? Math.sin(T * 12) : 1)), sx: 1 + writhe * 0.2, o: seg(t, 1.18, 1.25) * 0.9 * (1 - es(t, 6.0, 6.1) * 0) });

      /* v27b — no clothes; no house; the tombs */
      const hk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.15));
      pose(cardHouse, { x: 800, y: lerp(-1500, 330, hk), r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: hk > 0.01 ? 1 : 0 });
      const tk = es(t, 2.2, 2.5, ease.out) * (1 - es(t, 2.95, 3.15));
      pose(cardTomb, { x: 960, y: lerp(-1500, 300, tk), r: T ? Math.sin(T * 0.8 + 1) * 1.5 : 0, o: tk > 0.01 ? 1 : 0 });

      /* v28 — he cries out and falls down before Him; "What have you to do with me?" */
      const [khx, khy] = headAt(MX - 10, FEET + 4, 1.0, true, 46);
      const b1 = es(t, 3.05, 3.2, ease.back) * (1 - es(t, 3.9, 4.0));
      pose(bang, { x: khx - 20, y: khy - 30, s: b1, r: b1 > 0.02 && T ? Math.sin(T * 9) * 4 : 0, o: b1 > 0.02 ? 1 : 0 });
      const b2 = es(t, 4.05, 4.22, ease.back) * (1 - es(t, 4.95, 5.05));
      pose(plea, { x: khx - 20, y: khy - 76, s: b2, o: b2 > 0.02 ? 1 : 0 });

      /* v29a — He commands the unclean spirit to come out */
      const [hhx, hhy] = hand(JX, FEET, 1.0, false, 16 + cmd * 70);
      pose(burst, { x: hhx, y: hhy - 20, s: 0.4 + cmd * 0.6, r: T * 6, o: cmd * 0.6 });

      /* v29b — the story of before, on a sepia flat */
      const fk = dropK(t, 6.02, 7.2, 0.25);
      flyTo(flatEl, fk, 800, 318, T);
      // the pieces ride with the flat (its centre is at (800, baseY))
      const baseX = 800, baseY = lerp(-1500, 318, fk);
      const snap = es(t, 6.3, 6.4);
      const drive = es(t, 6.45, 6.95);
      const fmx = baseX - 20 + drive * 150;
      fMan.set({ x: fmx, y: baseY + 108, s: 0.5, o: fk > 0.02 ? 1 : 0, flip: false, walk: drive > 0 && drive < 1 ? fmx * 0.1 : undefined, amt: 1.4, armF: 40 + snap * 100, armB: 30 + snap * 120, head: -snap * 12, lean: drive * 8 });
      pose(fChain, { x: baseX - 42, y: baseY + 50, o: fk > 0.02 ? 1 - snap : 0 });
      fLinks.forEach((l) => { const k = es(t, 6.32, 6.7, ease.out); pose(l.el, { x: baseX - 10 + Math.cos(l.a) * k * 110, y: baseY + 50 + Math.sin(l.a) * k * 70 + k * k * 40, r: k * 300 * (l.i % 2 ? 1 : -1), o: k > 0.01 && fk > 0.5 ? 1 - es(t, 6.85, 7.0) : 0 }); });
      fWind.forEach((w, i) => { pose(w, { x: fmx - 50 - i * 26, y: baseY + 40 + i * 14 + (T ? Math.sin(T * 3 + i) * 4 : 0), s: 0.8, o: drive * (fk > 0.5 ? 0.9 : 0) }); });

      S.cam.x = -50 + es(t, 0.8, 1.5) * 50 + es(t, 2.0, 2.4) * 40 - es(t, 3.0, 3.4) * 40;
      S.cam.y = 20 - es(t, 2.0, 2.4) * 30 + es(t, 3.0, 3.4) * 30 - es(t, 6.0, 6.3) * 30;
      S.cam.z = 1.04 + es(t, 3.0, 3.4) * 0.1 - es(t, 6.0, 6.3) * 0.1;
    };
  },
};
