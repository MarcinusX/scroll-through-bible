// Łk 8,11–13 — the sower explained, on the field cut open at the front: the trodden path on the left, the rocky
// ground on the right, Jesus on the green knoll between. "The seed is the word of God": in His raised hand a grain
// opens into a tiny glowing scroll. The man on the path hears it and his heart opens like two little doors — then
// the devil comes, the same hooded shadow that tempted Jesus in the desert, reaches into the man's heart and walks
// off with the word; the doors close on nothing and the flap lifts on the hard, trodden earth. The woman on the
// rock takes the word with joy and it springs up at once — but the flap shows the rock right under it; an hourglass
// runs out over her ("for a while"), the tempter whispers at her shoulder, and she turns away as the shoot withers.
import { C, person, CAST, blinkAt, pose, lerp, sheet, hanging } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, clamp } from '../../core/anim.js';
import {
  soilStage, XP, FFACE, FLAPB, FEET, LISTEN, TEMPTER, tempterAura, addHeart, wordSeed, sproutRig, rootPieces, hourglassT, speech, GLYPH,
  headAt, hand, track, arcAt, hangAt, nameTag, sparkle, bubble, tr, PI,
} from './lib.js';

const camFor = (x) => (x - 800) / 0.6 * 0.62;
const JY = 592;

export default {
  id: 'lk8-meaning',
  parable: true,
  beats: [
    { v: 11 },
    { v: 12, text: 'Tymi na drodze są ci, którzy słuchają słowa;' },
    { v: 12, cont: true, text: 'potem przychodzi diabeł i zabiera słowo z ich serca, żeby nie uwierzyli i nie byli zbawieni.' },
    { v: 13, text: 'Na skałę pada u tych, którzy, gdy usłyszą, z radością przyjmują słowo,' },
    { v: 13, cont: true, text: 'lecz nie mają korzenia: wierzą do czasu, a w chwili pokusy odstępują.' },
  ],
  cam: { x: [camFor(XP.L) - 20, camFor(XP.R) + 20], y: [0, 130], z: [0.96, 1.36] },
  build(S) {
    const St = soilStage(S, { left: 'path', right: 'rock', sky2: ['#9d93b5', '#d9b6a6', '#ecd2b6'] });
    if (S.portrait) { St.SUN[0] = 1000; St.SUN[1] = 40; }   // phone: the sun hangs clear of the progress thread
    const c = St.c;

    /* flaps and roots */
    const rockX = XP.R + 20;
    const rootRock = St.ground.add(`<g>${rootPieces(c, [
      { pts: [[rockX, FFACE + 2], [rockX + 1, 632], [rockX + 3, 640], [rockX + 12, 644], [rockX + 24, 645], [rockX + 36, 642], [rockX + 44, 644]], o0: 0, o1: 0.85 },
      { pts: [[rockX + 1, 634], [rockX - 10, 641], [rockX - 22, 644], [rockX - 32, 642]], o0: 0.3, o1: 1 },
    ], 5)}</g>`);
    const rsRock = Array.from(rootRock.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const flapPath = St.ground.add(`<g>${St.flap(XP.L)}</g>`);
    const flapRock = St.ground.add(`<g>${St.flap(XP.R)}</g>`);
    St.plants.add(rock(c, XP.R - 150, 592, 64, 30, C.rock2) + rock(c, XP.R + 160, 588, 44, 22, C.rock) + rock(c, XP.R + 90, 600, 40, 18, C.rock3));
    const sproutEl = St.plants.add(sproutRig(c, 56));

    /* people */
    const jesus = S.puppet(St.people.add(person(c, { ...CAST.jesus })));
    const auraEl = St.people.add(`<g opacity="0">${tempterAura(c, 120)}</g>`);
    const devil = S.puppet(St.people.add(person(c, { ...TEMPTER })));
    const pathMan = S.puppet(St.people.add(person(c, LISTEN.path)));
    const pathHeart = addHeart(pathMan, c, 'path', LISTEN.path.robe);
    const rockW = S.puppet(St.people.add(person(c, LISTEN.rock)));
    const rockHeart = addHeart(rockW, c, 'rock', LISTEN.rock.robe);

    /* the word */
    const fx = St.fx;
    const grain = fx.add(`<g opacity="0"><circle r="40" fill="url(#warm-glow)"/><path d="${c.poly(c.ell(0, 0, 9, 6, 10, 0.4))}" fill="${C.wheat2}"/></g>`);
    const bigWord = fx.add(`<g opacity="0">${wordSeed(c, { glow: 40 })}</g>`);
    const label = St.skyL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr('słowo Boże', 'the word of God'), { size: 20 })}</g>`);
    const seedPath = fx.add(`<g opacity="0">${wordSeed(c)}</g>`);
    const seedRock = fx.add(`<g opacity="0">${wordSeed(c)}</g>`);
    const whisper = fx.add(`<g opacity="0">${bubble(c, '…', { size: 26, w: 60, jag: true, fill: '#4a3f58', ink: C.cream, dir: 1 })}</g>`);
    const lost = fx.add(`<g opacity="0">${speech(c, GLYPH.q(c), { w: 44, h: 40 })}</g>`);
    const hg = St.fx.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${hourglassT(c)}</g>`);
    const sand = St.fx.add(`<g opacity="0"><path d="${c.cut([[-8, 0], [8, 0], [0, 10]], 0.1, 2)}" fill="${C.ochre}"/></g>`);
    const joy = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`), x: XP.R - 40 + Math.cos(i * 2.4) * c.rr(50, 90), y: 420 + Math.sin(i * 2.4) * c.rr(30, 70) }));

    const CAMX = [[0, camFor(800)], [0.9, camFor(800)], [1.2, camFor(XP.L)], [2.95, camFor(XP.L)], [3.25, camFor(XP.R)]];
    const CAMZ = [[0, 1.3], [0.9, 1.3], [1.2, 1.24], [2.95, 1.24], [3.25, 1.26], [3.9, 1.26], [4.2, 1.3]];
    const CAMY = [[0, 70], [0.9, 70], [1.2, 90], [2.2, 90], [2.5, 112], [2.95, 112], [3.25, 90], [3.9, 90], [4.2, 116]];

    return (t, time) => {
      const T = time;
      S.cam.x = track(t, CAMX); S.cam.z = track(t, CAMZ); S.cam.y = track(t, CAMY);
      const dim = es(t, 2.05, 2.35) * (1 - es(t, 2.95, 3.2)) + es(t, 4.3, 4.6);
      St.sk2L.fade(dim * 0.7);
      St.update(T);

      /* v11 — the seed is the word of God */
      const lift = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.15));
      const sowL = bump(t, 1.05, 1.35), sowR = bump(t, 3.05, 3.35);
      const jFlip = t < 3.0 && t > 1.0;
      jesus.set({ x: XP.J, y: JY, s: 1.1, flip: jFlip, armF: 20 + lift * 120 + 118 * Math.max(sowL, sowR), armB: 10 + lift * 20 + Math.max(sowL, sowR) * 10, head: -lift * 10 - Math.max(sowL, sowR) * 6, blink: blinkAt(T) });
      const [gx, gy] = hand(XP.J, JY, 1.1, false, 20 + lift * 120);
      const open = es(t, 0.35, 0.55);
      pose(grain, { x: gx + 4, y: gy - 12, s: 1.4 * (1 - open * 0.6), r: T * 20, o: seg(t, 0.12, 0.2) * (1 - open) });
      pose(bigWord, { x: gx + 4, y: gy - 16, s: 0.8 + open * 1.4, o: open * (1 - es(t, 0.95, 1.1)) });
      const lk = es(t, 0.45, 0.75, ease.out) * (1 - es(t, 0.95, 1.2));
      hangAt(label, XP.J + 130, lerp(-1500, 330, lk), T, 1.2, 0.7);

      /* v12a — the path: they hear the word */
      const inV = S.portrait ? es(t, 0.95, 1.1) : 1;   // phone: the listeners at the plots' edges step in only as the camera turns to them (in v11 they were half cut by the frame)
      pathMan.set({ x: XP.L + 40, y: FEET, s: 1.06, o: inV, head: bump(t, 1.3, 1.6) * 10 - 3 + es(t, 2.6, 2.8) * 14, armF: 6 + bump(t, 1.35, 1.6) * 40 + bump(t, 2.55, 2.95) * 30, armB: 4, blink: blinkAt(T, 1) });
      const hOpen = es(t, 1.24, 1.34) * (1 - es(t, 2.58, 2.72));
      const inHeart = seg(t, 1.3, 1.34) * (1 - seg(t, 2.47, 2.5));
      pathHeart({ open: hOpen, seed: inHeart, glow: inHeart * 0.9 });
      const fl = seg(t, 1.06, 1.3);
      const [hx, hy] = [XP.L + 40 - 7 * 1.06, FEET - 110 * 1.06];
      const [sx, sy] = arcAt(ease.out(fl), [XP.J - 40, 400], [hx, hy], 110);

      /* v12b — the devil comes and takes away the word from their heart */
      const come = es(t, 2.02, 2.38), go = es(t, 2.6, 2.98);
      const dx = lerp(XP.L - 420, hx - 70, come) - go * 360;
      const reach = es(t, 2.36, 2.48) * (1 - es(t, 2.52, 2.62));
      const devilOn = seg(t, 1.98, 2.06) * (1 - seg(t, 2.95, 3.0)) + seg(t, 4.2, 4.3) * (1 - seg(t, 4.93, 5.0));
      const second = t > 3.5;
      const d2x = lerp(XP.R + 360, XP.R + 40, es(t, 4.2, 4.45));
      devil.set({
        x: second ? d2x : dx, y: FEET + 2, s: 1.04, flip: second ? true : go > 0.3, o: devilOn,
        walk: (come > 0 && come < 1) || (go > 0 && go < 1) || (second && es(t, 4.2, 4.45) < 1 && t > 4.2) ? (second ? d2x : dx) * 0.05 : undefined,
        armF: 20 + reach * 60 + (second ? es(t, 4.3, 4.45) * 50 : 0) + (go > 0 ? 40 : 0), armB: 10, head: 8 - (second ? 4 : 0), lean: reach * 10, blink: blinkAt(T, 6),
      });
      pose(auraEl, { x: second ? d2x : dx, y: FEET + 2, s: 1.04, o: devilOn * 0.8 });
      const [dhx, dhy] = hand(dx, FEET + 2, 1.04, go > 0.3, 20 + reach * 60 + (go > 0 ? 40 : 0));
      if (t < 2.48) pose(seedPath, { x: sx, y: sy, s: 1.4, r: (1 - fl) * 200, o: seg(t, 1.05, 1.08) * (1 - seg(t, 1.3, 1.33)) + (t > 1.33 ? 0 : 0) });
      else pose(seedPath, { x: dhx, y: dhy - 6, s: 1.2, o: 1 - seg(t, 2.95, 3.0) });
      const lq = es(t, 2.62, 2.74, ease.back) * (1 - es(t, 2.92, 3.0));
      const [pqx, pqy] = headAt(XP.L + 40, FEET, 1.06, false);
      pose(lost, { x: pqx + 18, y: pqy - 26, s: lq * 0.9, o: lq > 0.02 ? 1 : 0 });
      pose(flapPath, { x: 0, y: FLAPB, sy: 1 - es(t, 2.55, 2.85) * 1.12, oy: FLAPB });

      /* v13a — the rock: received with joy */
      const land = seg(t, 3.1, 3.34);
      {
        const [x, y] = arcAt(ease.out(land), [XP.J + 40, 400], [XP.R - 58, FEET - 118], 110);
        pose(seedRock, { x, y, s: 1.4, r: (1 - land) * -200, o: seg(t, 3.09, 3.12) * (1 - seg(t, 3.34, 3.37)) });
      }
      const glad = es(t, 3.36, 3.5) * (1 - es(t, 4.0, 4.2));
      const hop = t > 3.36 && t < 3.95 ? Math.abs(Math.sin(((t - 3.36) * PI) / 0.15)) * 12 * (1 - seg(t, 3.36, 3.95)) : 0;
      const turn = es(t, 4.55, 4.7);
      const leave = seg(t, 4.7, 4.98);
      const rwx = XP.R - 50 + leave * 40;
      rockW.set({
        x: rwx, y: FEET - hop, s: 1.06, o: inV, flip: turn < 0.5, walk: leave > 0 && leave < 1 ? rwx * 0.08 : undefined,
        armF: 8 + glad * 150 + Math.sin(t * 40) * 8 * glad + turn * 20, armB: 6 + glad * 140, head: -glad * 10 + bump(t, 4.3, 4.6) * 12, blink: blinkAt(T, 2),
      });
      rockHeart({ open: es(t, 3.34, 3.46), seed: es(t, 3.34, 3.4) * (1 - es(t, 4.6, 4.8) * 0.8), glow: es(t, 3.34, 3.42) * (1 - es(t, 4.5, 4.8)) * (1 + glad * 0.4), pulse: glad * (T ? Math.sin(T * 6) : 0), crack: es(t, 4.65, 4.8) });
      joy.forEach((sp) => { const k = bump(t, 3.38 + sp.i * 0.03, 3.95 + sp.i * 0.03); pose(sp.el, { x: sp.x, y: sp.y - k * 12, s: k * 1.2, r: t * 200 + sp.i * 90, o: k }); });
      {
        const pop = es(t, 3.42, 3.62, ease.back), wilt = es(t, 4.55, 4.85);
        pose(sproutEl, { x: rockX, y: 612, sy: pop, sx: 0.6 + 0.4 * pop, r: wilt * 12 });
        fade(sproutEl.querySelector('.fresh'), 1 - wilt);
        fade(sproutEl.querySelector('.wilt'), wilt);
      }

      /* v13b — no root; believe for a while; in the time of temptation they fall away */
      pose(flapRock, { x: 0, y: FLAPB, sy: 1 - es(t, 4.02, 4.25) * 1.12, oy: FLAPB });
      const rrv = seg(t, 4.1, 4.35);
      rsRock.forEach((r) => fade(r.el, clamp((rrv - r.o) * 12) * (1 - es(t, 4.7, 4.9) * 0.5)));
      const hk = es(t, 4.05, 4.3, ease.out) * (1 - es(t, 4.85, 5.0));
      hangAt(hg, XP.R - 200, lerp(-1500, 330, hk), T, 1.2, 0.7, 2);
      const run = seg(t, 4.2, 4.55);
      pose(sand, { x: XP.R - 200, y: 330 + 22 + ((run * 5) % 1) * 18, s: 0.5, o: run > 0 && run < 1 ? 1 : 0 });
      const wb = es(t, 4.35, 4.5, ease.back) * (1 - es(t, 4.75, 4.85));
      pose(whisper, { x: XP.R + 70, y: FEET - 214, s: wb, o: wb > 0.02 ? 1 : 0 });
    };
  },
};
