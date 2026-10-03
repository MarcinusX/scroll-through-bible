// Łk 9,7–9 — evening in the hall of Herod the tetrarch (Mark 6's Herod). A messenger runs in and kneels: news of all
// that is being done — little tags of it float up to the throne (a spirit driven out, a crutch thrown away, a light) —
// and Herod is perplexed: his brows knit, a question hangs over him. "Some said John had risen": John's portrait comes
// down on its strings, with a light behind it; "others, Elijah", "others, one of the old prophets": two more. Herod gets
// up: "John I beheaded" — John's portrait goes grey and the candle beside it is snuffed. "Who then is this, about whom
// I hear such things?" — the portraits fly away, and an empty frame comes down with a question in it and a faint figure
// of light. "And he sought to see him": Herod crosses to the tall window and looks out, shading his eyes: far off on the
// hills, small and bright, a crowd round Someone.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band } from '../../assets/nature.js';
import { seg, es, ease, bump, attr } from '../../core/anim.js';
import { throne, crown, noble, withFace, faceBits, whoPortrait, silhouette, shadowPerson, labelTag, disc, spirit, crutch, crossX, sparkle, spark, thought, GLYPH, wordSlip, candle, folk, stillGroup, halo, HEROD, COURT9, kf, headAt, hand, tr, PI } from './lib.js';

const Y = 690;            // the foot of the dais
const WIN = [[510, 250, 580], [1080, 250, 580]];   // the two tall windows: x, top, sill

export default {
  id: 'lk9-herod',
  beats: [
    { v: 7, text: 'O wszystkich tych wydarzeniach usłyszał również tetrarcha Herod i był zaniepokojony.' },
    { v: 7, cont: true, text: 'Niektórzy bowiem mówili, że Jan powstał z martwych;' },
    { v: 8 },
    { v: 9, text: 'Lecz Herod mówił: «Jana ja ściąć kazałem.' },
    { v: 9, cont: true, text: 'Któż więc jest Ten, o którym takie rzeczy słyszę?»' },
    { v: 9, cont: true, text: 'I chciał Go zobaczyć.' },
  ],
  cam: { x: [-40, 320], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: the courtiers stand inside the screen; at the end the camera turns to the window
    sky(S, COURT9);

    /* ---------- the land outside the windows, with a crowd round Someone far away ---------- */
    const view = S.layer({ par: 0.12, sh: 1 });
    const vfn = c.wave(470, [16, 5], [300, 90]);
    view.add(sheet().p(c.ridge((x) => vfn(x) - 40, -900, 2500, 1700, 12, 1), mix(C.hillFar, C.duskViolet, 0.3)).p(c.ridge(vfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.duskViolet, 0.25)).out());
    const farGlow = view.add(`<g opacity="0">${halo(70, 0.95)}</g>`);
    const mem = [-3, -2, -1, 1, 2, 3].map((k) => ({ x: k * 22 + c.rr(-4, 4), y: Math.abs(k) * 3 + c.rr(-2, 2), s: 0.92, flip: k > 0, o: folk(c), armF: c.rr(20, 60), head: -4 }));
    const farCrowd = view.add(`<g opacity="0"><g transform="scale(.26)">${stillGroup(c, mem)}<g transform="translate(0 -6)">${person(c, { ...CAST.jesus })}</g></g></g>`);

    /* ---------- the hall ---------- */
    const wall = S.layer({ par: 0.2, sh: 3 });
    const Wl = sheet();
    const holes = WIN.map(([x, top, sill]) => c.hole([[x - 70, sill], [x - 70, top + 70], ...c.arc(x, top + 70, 70, 70, PI, 2 * PI, 14), [x + 70, sill]], 0.5, 6)).join('');
    Wl.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 660], [-1200, 660]], 1, 30) + holes, mix(C.stone, C.dawn, 0.3));
    let blocks = '';
    for (let y = -200; y < 640; y += 52) for (let x = -1200 + (Math.round(y / 52) % 2 ? 70 : 0); x < 2800; x += 140) {
      if (WIN.some(([wx, top, sill]) => x + 130 > wx - 80 && x < wx + 80 && y + 44 > top && y < sill + 10)) continue;
      blocks += c.cut(c.rect(x + c.rr(0, 6), y, c.rr(110, 128), 44), 0.6, 10);
    }
    Wl.x(blocks, shade(C.stone, -0.05), 'opacity=".4"');
    let fr = '';
    for (let x = -600; x < 2400; x += 40) fr += c.cut(c.rect(x, 90, 20, 20), 0.2, 4);
    Wl.p(c.cut([[-1200, 82], [2800, 82], [2800, 118], [-1200, 118]], 0.4, 20), C.plumRobe).p(fr, C.sun);
    WIN.forEach(([x, top, sill]) => Wl.p(c.cut([[x - 86, sill], [x + 86, sill], [x + 92, sill + 14], [x - 92, sill + 14]], 0.4, 8), shade(C.stone2, -0.04)));
    wall.add(Wl.out());

    /* ---------- the portraits in the flies ---------- */
    const flies = S.layer({ par: 0.35, sh: 5 });
    const POR = [[0, 632, 214], [1, 968, 214], [2, 800, 150]].map(([i, x, y]) => ({ i, x, y, el: hanging(flies, whoPortrait(S, i), { x: 0, y: -1500, len: 900 }) }));
    const johnRays = flies.add(`<g opacity="0">${halo(130, 0.8)}</g>`);
    // John's portrait going grey (a veil of grey over its face)
    const grey = flies.add(`<g opacity="0"><rect x="-52" y="10" width="104" height="124" fill="${mix(C.storm2, C.stone2, 0.4)}" opacity=".7"/></g>`);
    // the empty frame: who is this?
    const WHO = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-62, 0, 124, 150), 0.6, 8), C.ochre);
      s.p(c.cut(c.rect(-52, 10, 104, 130), 0.5, 8), mix(C.parchment, C.halo, 0.3));
      const id = S.id('whoclip');
      const fig = shadowPerson(c, CAST.jesus, mix(C.duskViolet, C.cream, 0.35));
      return `${s.out()}<clipPath id="${id}"><rect x="-52" y="10" width="104" height="130"/></clipPath><g clip-path="url(#${id})"><circle cx="0" cy="62" r="60" fill="url(#halo-glow)"/><g transform="translate(-4 ${10 + 58 + 167 * 1.05}) scale(1.05)">${fig}</g><path d="${c.ribbon(c.arc(-2, 58, 28, 28, 0, PI * 2, 24), 3)}" fill="${C.haloRim}" opacity=".8"/></g><g transform="translate(0 176)">${labelTag(tr('Kto to jest?', 'Who is this?'), 18)}</g>`;
    })();
    const who = hanging(flies, WHO, { x: 0, y: -1500, len: 900 });
    const whoQ = flies.add(`<g opacity="0"><g transform="scale(2.2)">${GLYPH.q(c)}</g></g>`);

    /* ---------- floor, dais, throne, candles ---------- */
    const floor = S.layer({ par: 0.45, sh: 3 });
    const F = sheet();
    F.p(c.cut([[-1200, 650], [2800, 650], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.sand, 0.3));
    let chk = '';
    for (let y = 670; y < 1100; y += 44) for (let x = -600 + (Math.round(y / 44) % 2) * 50; x < 2200; x += 100) chk += c.poly([[x, y], [x + 50, y], [x + 50, y + 22], [x, y + 22]]);
    F.x(chk, mix(C.plumRobe, C.stone, 0.6), 'opacity=".35"');
    F.p(c.cut([[660, Y - 30], [940, Y - 30], [960, Y], [640, Y]], 0.5, 8), shade(C.stone2, -0.05));
    F.p(c.cut([[620, Y], [980, Y], [990, Y + 18], [610, Y + 18]], 0.5, 8), C.stone2);
    F.p(c.cut([[590, Y + 18], [1010, Y + 18], [1020, Y + 30], [580, Y + 30]], 0.4, 8), C.plumRobe);
    floor.add(F.out());
    floor.add(`<g transform="translate(804 ${Y - 30}) scale(1.1)">${throne(c)}</g>`);
    const CANDLES = [650, 950].map((x, i) => ({ x, i, el: floor.add(`<g transform="translate(${x} ${Y - 30}) scale(1.5)">${candle(c, 60)}</g>`) }));
    CANDLES.forEach((cd) => { cd.flame = cd.el.querySelector('.flame'); cd.glow = cd.el.querySelector('.glow'); });
    const smoke = floor.add(`<g opacity="0"><path d="${c.ribbon(c.cbez([0, 0], [-10, -20], [12, -40], [0, -70], 14), (u) => 5 - u * 4)}" fill="${C.stone2}"/></g>`);

    /* ---------- the court ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const COURT = (P ? [[478, 0], [552, 1], [1010, 3], [1064, 4]] : [[430, 0], [520, 1], [1080, 3], [1170, 4]]).map(([x, i]) => ({ x, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, noble(c, i)))) }));
    const messenger = S.puppet(act.add(person(c, { robe: C.wheatRobe, belt: C.leather, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3 })));
    const messengerK = S.puppet(act.add(person(c, { robe: C.wheatRobe, belt: C.leather, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3, pose: 'kneel' })));
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herodSit = S.puppet(act.add(hMark({ ...HEROD, pose: 'sit' })));
    const herodUp = S.puppet(act.add(hMark({ ...HEROD })));
    const worried = [herodSit, herodUp].map((p) => p.el.querySelector('[data-part="sad"]'));

    /* ---------- the news, the question ---------- */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const NEWS = [
      `<g transform="scale(.9)">${spirit(c, 1, '#43384d')}</g><g>${crossX(c, 16)}</g>`,
      `<g transform="translate(-2 -20) rotate(20) scale(.3)">${crutch(c)}</g>`,
      `${sparkle(c, 12)}`,
    ].map((inner, i) => ({ i, el: fx.add(`<g opacity="0">${disc(c, inner, { r: 26 })}</g>`) }));
    const slips = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${wordSlip(c, 22)}</g>`) }));
    const hThought = fx.add(`<g opacity="0">${thought(c, GLYPH.q(c), { w: 60, h: 46 })}</g>`);

    /* ---------- drapes in front ---------- */
    const fg = S.layer({ par: 0.9, sh: 8 });
    fg.add(sheet().p(c.cut([[-1200, -1400], [2800, -1400], [2800, 60], [-1200, 70]], 0.8, 16), shade(C.plumRobe, -0.2)).x(c.ribbon([[-1200, 56], [2800, 52]], 6), C.sun).out());

    return (t, time) => {
      const T = time;
      /* candles; the left one is snuffed at "John I beheaded" */
      const snuff = es(t, 3.3, 3.42);
      CANDLES.forEach((cd) => {
        const out = cd.i === 0 ? snuff : 0;
        const k = 1 + Math.sin(T * 9 + cd.i * 2) * 0.08;
        pose(cd.flame, { x: 0, y: -80, sx: (1 / k) * (1 - out), sy: k * (1 - out) + 0.001 });
        attr(cd.glow, 'opacity', (1 - out).toFixed(2));
      });
      const sm = seg(t, 3.36, 4.2);
      pose(smoke, { x: 650, y: Y - 30 - 150 - sm * 30, s: 0.8 + sm * 0.6, o: sm > 0 ? Math.sin(sm * PI) * 0.8 : 0 });

      /* v7a — the messenger, the news, Herod perplexed */
      const mX = kf(t, [[-0.2, -200], [0.3, 640]], ease.out);
      const kneel = es(t, 0.3, 0.36);
      messenger.set({ x: mX, y: Y + 34, s: 0.9, walk: t < 0.3 ? mX * 0.08 : undefined, amt: 1.3, lean: 8, o: (1 - kneel) * (t > -0.15 ? 1 : 0), blink: blinkAt(T, 3) });
      messengerK.set({ x: 640, y: Y + 34, s: 0.9, o: kneel * (1 - es(t, 1.1, 1.3)), armF: 60 + bump(t, 0.35, 0.95) * 30, armB: 30, head: -10, blink: blinkAt(T, 3) });
      NEWS.forEach((n) => {
        const k = seg(t, 0.36 + n.i * 0.1, 0.62 + n.i * 0.1);
        const tx = 800 + (n.i - 1) * 56, ty = 420 - (n.i % 2) * 24;
        pose(n.el, { x: lerp(660, tx, ease.out(k)), y: lerp(560, ty, k) - Math.sin(k * PI) * 40, s: 0.4 + k * 0.6, o: k > 0 ? 1 - es(t, 1.0, 1.15) : 0 });
      });
      slips.forEach((w) => {
        const k = T ? (T * 0.5 + w.i / 5) % 1 : (w.i + 0.5) / 5;
        pose(w.el, { x: lerp(660, 780, k), y: 560 - k * 50 - (w.i % 3) * 14, s: 0.7, r: Math.sin(T * 2 + w.i) * 10, o: bump(t, 0.3, 0.95) * Math.sin(k * PI) });
      });

      /* the portraits */
      const standUp = es(t, 3.02, 3.09);
      POR.forEach((p) => {
        const on = es(t, [1.05, 2.05, 2.4][p.i], [1.35, 2.35, 2.7][p.i], ease.back);
        const away = es(t, 4.02, 4.3);
        pose(p.el, { x: p.x, y: lerp(-1500, p.y, on) - away * 1300, r: Math.sin(T * 1.1 + p.i) * 1.8, oy: 0, o: on > 0.002 ? 1 : 0 });
      });
      const jr = es(t, 1.2, 1.5) * (1 - es(t, 3.0, 3.3));
      pose(johnRays, { x: 632, y: 280, s: 0.6 + jr * 0.5, o: jr });
      const gr = es(t, 3.1, 3.4) * (1 - es(t, 4.02, 4.1));
      pose(grey, { x: 632, y: 214 - es(t, 4.02, 4.3) * 1300, r: Math.sin(T * 1.1) * 1.8, o: gr });
      const wk = es(t, 4.1, 4.4, ease.back) * (1 - es(t, 5.0, 5.3));
      pose(who, { x: 800, y: lerp(-1500, 170, wk), r: Math.sin(T * 0.9) * 1.5, oy: 0, o: wk > 0.002 ? 1 : 0 });
      pose(whoQ, { x: 880, y: 240, s: bump(t, 4.3, 5.0), r: Math.sin(T * 2) * 8, o: bump(t, 4.3, 5.0) });

      /* the courtiers: John! Elijah! A prophet! */
      COURT.forEach((m) => {
        const tell = m.i === 1 ? bump(t, 1.05, 1.95) : m.i === 3 ? bump(t, 2.05, 2.5) : m.i === 4 ? bump(t, 2.4, 2.95) : 0;
        const look = es(t, 1.05, 1.3) * (1 - es(t, 4.0, 4.3));
        const toWin = es(t, 5.05, 5.3);
        m.p.set({ x: m.x + (m.i >= 3 ? toWin * 110 : 0), y: Y + 30 + (m.i % 2) * 8, s: 0.9, flip: toWin > 0.5 ? false : m.x > 800, armF: tell * 90, armB: tell * 60, head: -look * 10 - tell * 4, blink: blinkAt(T, m.seed) });
      });

      /* Herod */
      const hSay = bump(t, 3.05, 3.9);
      const ask = bump(t, 4.05, 4.95);
      const go = es(t, 5.05, 5.45);
      herodSit.set({ x: 808, y: Y - 38, s: 1.08, o: 1 - standUp, armF: 20 + bump(t, 0.4, 1.0) * 70 + bump(t, 1.2, 2.9) * 30, armB: bump(t, 0.4, 2.9) * 110, head: -bump(t, 0.4, 2.9) * 6, lean: -bump(t, 1.2, 2.9) * 5, blink: blinkAt(T, 1) });
      const hx = lerp(812, 950, go);
      herodUp.set({ x: hx, y: lerp(Y - 34, Y + 14, go), s: 1.08, o: standUp, flip: go > 0 ? false : hSay > 0.1, walk: go > 0 && go < 1 ? hx * 0.07 : undefined, armF: 20 + hSay * 60 + ask * 90 + es(t, 5.4, 5.6) * 20, armB: hSay * 140 * (1 - ask) + es(t, 5.4, 5.6) * 150, head: -hSay * 10 - ask * 14 - es(t, 5.4, 5.6) * 6, lean: -hSay * 6 + es(t, 5.4, 5.6) * 6, blink: blinkAt(T, 1) });
      const w = es(t, 0.45, 0.7) * 0.7 + es(t, 3.05, 3.2) * 0.3;
      worried.forEach((el) => attr(el, 'opacity', Math.min(1, w).toFixed(2)));
      const [thx, thy] = headAt(808, Y - 38, 1.08, false, 62);
      const tk = es(t, 0.55, 0.75, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(hThought, { x: thx + 6, y: thy - 20, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* v9c — far off, the crowd round Him, lit */
      const far = es(t, 5.2, 5.55);
      const FX = P ? 1062 : 1090;
      pose(farGlow, { x: FX, y: vfn(FX) + 2, s: 0.6 + far * 0.5, o: far });
      pose(farCrowd, { x: FX, y: vfn(FX) + 8, o: far });

      S.cam.x = kf(t, [[0, -30], [0.9, 0], [1.3, -10], [1.95, -10], [2.2, 20], [2.9, 10], [3.0, 0], [5.05, 0], [5.6, P ? 300 : 60]]);
      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.06], [1.3, 1.02], [3.0, 1.02], [3.4, 1.1], [4.0, 1.1], [4.3, 1.02], [5.05, 1.02], [5.6, 1.14]]);
      S.cam.y = kf(t, [[0, 30], [0.9, 40], [1.3, 10], [3.0, 10], [3.4, 40], [4.0, 40], [4.3, 10], [5.05, 10], [5.6, 20]]);
    };
  },
};
