// J 12,14–15 — by a palm stands a young donkey on a tether. Jesus unties it and sits on it, and a scroll comes down
// from the flies: "as it is written". On the wall above the gate stands the Daughter of Zion, crowned with a little
// city wall, her hands over her face — "Do not be afraid!" — she lowers them. "Behold, your King comes, sitting on
// a donkey's colt": He rides towards her through the waving palms, and she opens her arms.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roadSet, RD, man, crowdPerson, handFrond, colt, coltRig, saddleCloaks, riderLeg, zionDaughter, verseScroll, nameTag, hanging, swing, kf, vis, sparkle, lightCrown, tr, PI, FONT } from './lib.js';

export default {
  id: 'j12-colt',
  beats: [
    { v: 14 },
    { v: 15, text: 'Nie bój się, Córo Syjońska!' },
    { v: 15, cont: true, text: 'Oto Król twój przychodzi, siedząc na oślęciu.' },
  ],
  cam: { x: [-60, 160], y: [-80, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = roadSet(S, { skyCols: ['#dfe3d6', '#f3e6c8', '#f8ecd4'], sunAt: [1180, 170] });
    const G = RD.GROUND;
    // the Daughter of Zion on the wall over the gate
    const wallP = S.layer({ par: 0.24, sh: 4, pad: 200 });
    const zGlow = wallP.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);
    const zion = S.puppet(wallP.add(zionDaughter(c)));
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.52, sh: 5 });
    const spots = [[520, G - 16, 0.86], [600, G - 14, 0.86], [680, G - 16, 0.86], [470, G + 8, 0.95], [560, G + 10, 0.95], [650, G + 8, 0.95], [1130, G - 14, 0.86], [1210, G + 8, 0.95]];
    const crowd = spots.map(([x, y, s], i) => {
      const o = i % 2 ? crowdPerson(c) : man(c);
      const p = S.puppet((y < G ? back : act).add(person(c, { ...o, holdB: handFrond(c, 96 + (i % 3) * 8) })));
      return { i, x, y, s, p, seed: c.rr(0, 9), ph: c.rr(0, 6) };
    });
    // the tether rope from the palm
    const rope = back.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [40, 40], [96, 18], 10), 2)}" fill="${C.rope}"/></g>`);
    const coltA = coltRig(act.add(colt(c, { halter: true })));
    const coltB = coltRig(act.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g>${riderLeg(c)}` })));
    const rider = S.puppet(S.$('rider').firstElementChild);
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const disc = [CAST.peter, CAST.john].map((o) => S.puppet(act.add(person(c, o))));
    const fx = S.layer({ par: 0.4, sh: 5 });
    const halo = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/>${lightCrown(c, 30)}</g>`);
    // the scroll of the prophet
    const sc = verseScroll(c, ['', '', ''], { w: 420, size: 22 });
    const scrollL = S.layer({ par: 0.3, sh: 5 });
    const clipId = S.id('scr');
    S.defs(`<clipPath id="${clipId}"><rect x="-230" y="0" width="460" height="${sc.h}"/></clipPath>`);
    const scSheet = scrollL.add(`<g>${sc.sheet}</g>`);
    const rodT = scrollL.add(`<g><path d="M-160 -1600V0M160 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${sc.rodTop}</g>`);
    const rodB = scrollL.add(`<g>${sc.rodBottom}</g>`);
    const T0 = (txt, y, size = 22, col = C.ink) => scrollL.add(`<g><text x="0" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${txt}</text></g>`);
    const l0 = T0(tr('jak jest napisane:', 'as it is written:'), 34, 18, C.terracotta);
    const l1 = T0(tr('Nie bój się, Córo Syjońska!', 'Don’t be afraid, daughter of Zion.'), 70);
    const l2 = T0(tr('Oto Król twój przychodzi,', 'Behold, your King comes,'), 104);
    const l3 = T0(tr('siedząc na oślęciu', 'sitting on a donkey’s colt'), 134);
    const zTag = hanging(fx, nameTag(c, tr('Córa Syjońska', 'daughter of Zion'), { size: 15 }), { x: RD.GATE, y: 200, len: 600 });
    set.fg();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v14 — He finds the young donkey and sits on it */
      const go = es(t, 0.08, 0.4);
      const mount = es(t, 0.46, 0.53);
      const ride = es(t, 2.05, 2.9, ease.io);
      const cx = lerp(1010, 800, ride);
      const walkC = ride > 0 && ride < 1 ? cx * 0.05 : undefined;
      jesus.set({ x: lerp(900, 950, go), y: G + 10, s: 1.02, flip: false, o: 1 - mount, walk: go > 0 && go < 1 ? t * 30 : undefined, armF: 14 + bump(t, 0.3, 0.5) * 60, blink: blinkAt(T) });
      coltA.set({ x: 1010, y: G + 12, s: 1, flip: true, o: 1 - mount, nod: T ? Math.sin(T * 0.9) * 3 : 0, ear: bump(t, 0.2, 0.45) * 14, tail: T ? Math.sin(T * 1.3) * 8 : 0 });
      coltB.set({ x: cx, y: G + 12, s: 1, flip: true, o: mount, walk: walkC, amt: 0.8, nod: T ? Math.sin(T * 0.9) * 2 : 0, ear: bump(t, 1.1, 1.5) * 14, tail: T ? Math.sin(T * 1.3) * 8 : 0 });
      const bless = es(t, 2.2, 2.5);
      rider.set({ x: 0, y: 0, s: 1, armF: 26 + bless * 60, armB: 16 + bump(t, 0.6, 1.0) * 40, head: -2 - bless * 4, blink: blinkAt(T) });
      vis(rope, { x: 1080, y: G - 118, r: 180, sx: 1 - es(t, 0.3, 0.45) * 0.6, o: 1 - es(t, 0.3, 0.45) });
      disc.forEach((p, i) => { const x = cx + 110 + i * 70; p.set({ x, y: G + 2 - i * 4, s: 0.94, flip: true, walk: walkC !== undefined ? x * 0.055 + i : undefined, armF: 12 + bump(t, 0.4, 0.7) * 40 * (i === 0 ? 1 : 0), head: 2, blink: blinkAt(T, i + 3) }); });
      const cheer = es(t, 0.5, 0.8);
      crowd.forEach((m, j) => {
        const x = m.x - ride * (m.x > 1000 ? 170 : 120);
        const wave = Math.sin(t * 10 + j * 1.7) * 16 * cheer;
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > 1000, walk: ride > 0 && ride < 1 ? x * 0.06 + m.ph : undefined, armB: 70 + cheer * 50 + wave, armF: 10 + cheer * 20 + bump(t, 2.3, 2.9) * 40, head: -4, blink: blinkAt(T, m.seed) });
      });
      vis(halo, { x: cx - 10, y: G - 250, s: bless, o: bless * (T ? 0.85 + Math.sin(T * 2) * 0.1 : 0.9) });
      /* "as it is written" — the scroll unrolls */
      const un = es(t, 0.55, 0.95);
      const sy = 100;
      pose(rodT, { x: 840, y: sy });
      pose(scSheet, { x: 840, y: sy, sy: Math.max(0.01, un), o: un > 0.01 ? 1 : 0 });
      pose(rodB, { x: 840, y: sy + un * sc.h, o: 1 });
      const txt = (el, a) => pose(el, { x: 840, y: sy, o: es(t, a, a + 0.2) * (un > 0.95 ? 1 : 0) });
      txt(l0, 0.85); txt(l1, 1.1); txt(l2, 2.08); txt(l3, 2.3);
      /* v15a — the Daughter of Zion: afraid, then at peace */
      const zIn = es(t, 1.02, 1.3, ease.out);
      const calm = es(t, 1.45, 1.8);
      const welcome = es(t, 2.3, 2.7);
      zion.set({ x: RD.GATE, y: RD.WT + 6, s: 0.8, flip: false, o: zIn, armF: 150 * (1 - calm) + 20 * calm + welcome * 60, armB: 140 * (1 - calm) + 20 * calm + welcome * 110, head: 10 * (1 - calm) - welcome * 6, lean: (1 - calm) * 6 + (T ? Math.sin(T * 14) * 1.4 * (1 - calm) * zIn : 0), blink: calm < 0.5 ? 1 : blinkAt(T, 8) });
      vis(zGlow, { x: RD.GATE, y: RD.WT - 110, s: 0.7 + welcome * 0.8, o: zIn * (0.3 + calm * 0.3 + welcome * 0.4) });
      const zk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.85, 3));
      swing(zTag, RD.GATE, 220 - (1 - zk) * 600, zk > 0.001 ? T : 0, 1.2, 0.8);
      fade(zTag, zk > 0.001 ? 1 : 0);

      S.cam.x = kf(t, [[0, 140], [0.6, 150], [1.0, 60], [1.8, -20], [2.2, 20], [3, 0]]);
      S.cam.y = kf(t, [[0, 0], [0.6, -20], [1.4, -50], [2.1, -20], [3, -30]]);
      S.cam.z = kf(t, [[0, 1.06], [0.6, 1.04], [1.4, 1.08], [2.1, 1.04], [3, 1.02]]);
    };
  },
};
