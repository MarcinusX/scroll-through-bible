// J 21,3c–4 — They walk down and climb into the boat; it pushes off into the dusk. Night comes: stars, the moon on
// its string, the lantern lit on the prow — and the net goes down and comes up empty, dripping, again and again;
// heads droop. Then the sky pales to dawn, the lantern goes out, the boat is out on the water — and the near shore
// slides up in front: a Man stands on it in the morning mist. The disciples peer at Him across the water: who is it?
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  shoreSet, frontShore, crewBoat, mistBand, emptyNet, SEVEN, PETER_BARE, JESUS, SHORE, DUSK, NIGHT, PREDAWN, DAWN,
  thought, GLYPH, skyKeys, kf, moving, headAt, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, PI,
} from './lib.js';
import { waveStrip } from '../../assets/nature.js';

const BX = 820, BY = 712;             // the boat by night (close)
const BEACH = (x) => 700 + Math.max(0, x - 600) * 0.35;

export default {
  id: 'j21-night',
  beats: [
    { v: 3, text: 'Wyszli więc i wsiedli do łodzi,' },
    { v: 3, cont: true, text: 'ale tej nocy nic nie złowili.' },
    { v: 4, text: 'A gdy ranek zaświtał, Jezus stanął na brzegu.' },
    { v: 4, cont: true, text: 'Jednakże uczniowie nie wiedzieli, że to był Jezus.' },
  ],
  cam: { x: [-40, 80], y: [-20, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const K = shoreSet(S, { skyCols: DUSK, night: true, sunAt: [1250, 520], moonAt: [420, 200], cloudAt: [980, 140], beach: false });

    /* the beach they leave (slides away to the left) */
    const dep = S.layer({ par: 0.45, sh: 4, pad: 1300 });
    dep.add(sheet().p(c.cut([[-1400, 600], [540, 606], [700, 660], [770, 770], [800, 1800], [-1400, 1800]], 1, 12), mix(C.sand, C.dune, 0.3)).x(c.ribbon([[540, 606], [700, 660], [770, 770]], 4), C.foam, 'opacity=".8"').out());

    /* the boat with the seven */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const B = crewBoat(S, boatL, {});
    const net = boatL.add(`<g>${emptyNet(c, { w: 110, h: 96, col: mix(C.rope, C.linen, 0.45) })}</g>`);
    const drips = Array.from(net.querySelectorAll('.drip'));
    const walkers = SEVEN.map((m, i) => ({ i, k: m.k, p: S.puppet(boatL.add(person(c, m.k === 'peter' ? PETER_BARE : m.o))), seed: c.rr(0, 9) }));

    const wF = S.layer({ par: 0.7, sh: 4, pad: 300 });
    wF.add(waveStrip(c, { y: 760, len: 240, amp: 12, color: mix(C.lake2, C.lake3, 0.4), x0: -1400, x1: 3000 }));
    const tint = S.layer({ par: 0, sh: 0, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const lanGlow = glowL.add(`<circle r="190" fill="url(#warm-glow)"/>`);

    /* the near shore at dawn, with the Man standing on it */
    const FS = frontShore(S, { pad: 600 });
    const jL = S.layer({ par: 0.62, sh: 5, pad: 600 });
    const jGlow = jL.add(`<circle r="170" fill="url(#halo-glow)"/>`);
    const jesus = S.puppet(jL.add(person(c, JESUS)));
    const mistL = S.layer({ par: 0.66, sh: 0, flat: true, pad: 500 });
    mistL.add(`<g transform="translate(640 690)">${mistBand(c, 700, 70)}</g><g transform="translate(760 600)">${mistBand(c, 520, 50)}</g><g transform="translate(560 520)">${mistBand(c, 380, 44)}</g>`);

    const fx = S.layer({ par: 0.55, sh: 3 });
    const qb = fx.add(`<g>${thought(c, `<g transform="translate(-8 4)"><path d="${c.cut([[-9, 16], [-7, -6], [7, -6], [9, 16]], 0.3, 4)}" fill="${C.stone2}"/><path d="${c.cut(c.circ(0, -13, 6, 10), 0.2, 3)}" fill="${C.stone2}"/></g><g transform="translate(14 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 80, h: 60 })}</g>`);
    const frown = fx.add(`<g>${thought(c, GLYPH.frown(c), { w: 56, h: 44 })}</g>`);

    return (t, time) => {
      const T = time;
      /* sky: dusk → night → dawn */
      skyKeys(K.sk, t, [[0.2, DUSK], [1.0, PREDAWN], [2.2, PREDAWN], [2.8, DAWN]]);
      const night = es(t, 0.75, 1.2) * (1 - es(t, 2.05, 2.6));
      K.nightSky.layer.fade(night);
      K.starL.fade(night);
      tint.fade(night * 0.42 + es(t, 0.3, 0.8) * 0.08 * (1 - es(t, 2.2, 2.7)));
      const sunY = lerp(560, 440, es(t, 2.2, 3.2));
      K.idle(T, { sun: es(t, 2.1, 2.4), sunY, moon: seg(t, 0.8, 0.9) * (1 - es(t, 2.2, 2.5)), moonY: lerp(420, 190, es(t, 0.8, 1.6)) + es(t, 2.1, 2.6) * 200, cloud: 1 - night * 0.7, calm: 1 });
      pose(K.sunPath, { x: 1250, y: 440, o: es(t, 2.4, 3.0) * 0.8 });

      /* v3c — they walk down and get in; the boat pushes off */
      const inBoat = seg(t, 0.5, 0.56);
      walkers.forEach((w) => {
        const cm = B.crew.find((q) => q.k === w.k);
        const tx = BX - cm.x;
        const keys = [[0.02 + w.i * 0.04, 260 - w.i * 60], [0.44 + w.i * 0.01, tx]];
        const x = kf(t, keys, ease.io);
        const y = lerp(716, BY + 14, es(t, 0.3, 0.5));
        w.p.set({ x, y, s: 0.8, walk: moving(t, keys) ? x * 0.06 : undefined, armF: 14, o: 1 - inBoat, blink: blinkAt(T, w.seed) });
      });
      const push = es(t, 0.5, 0.98);
      dep.shift(-push * 1300, push * 40);
      dep.fade(1 - es(t, 0.85, 0.98));

      /* the boat: close by night, far out on the water at dawn */
      const away = es(t, 2.05, 2.55);
      const bx = lerp(BX, SHORE.bx, away), by = lerp(BY, SHORE.by, away), bs = lerp(1, SHORE.bs, away);
      const rock = Math.sin(T * 1.1) * 1.4;
      const bob = Math.sin(T * 1.3) * 3 * bs;
      B.set({ x: bx + push * 10, y: by + bob, s: bs, r: rock });
      const onL = es(t, 1.08, 1.2) * (1 - es(t, 2.25, 2.45));
      if (B.lantern) { fade(B.lantern.flame, onL); fade(B.lantern.glow, onL * 0.6); }
      pose(lanGlow, { x: bx - 212 * bs, y: by - 120 * bs, s: bs * (1 + Math.sin(T * 5) * 0.03), o: onL * 0.7 });

      /* v3d — the net: down, up empty, three times */
      const hauls = [[1.1, 1.3], [1.3, 1.5], [1.5, 1.72]];
      let down = 0;
      hauls.forEach(([a, b]) => { const u = seg(t, a, b); if (u > 0 && u < 1) { down = u < 0.3 ? ease.io(u / 0.3) : u < 0.8 ? 1 - ease.io((u - 0.3) / 0.5) : 0; } });
      const netOn = seg(t, 1.1, 1.14) * (1 - seg(t, 1.96, 2.0));
      const nx = bx + 236 * bs, ny = by - 150 * bs + down * 200 * bs;
      vis(net, { x: nx, y: ny, s: bs, r: Math.sin(T * 1.6) * 3, o: netOn * (1 - down * 0.85) });
      drips.forEach((d, i) => { const k = ((T * 1.6 + i * 0.33) % 1); pose(d, { x: -14 + i * 14, y: 90 + k * 26, o: (1 - k) * (1 - down) * netOn }); });
      const tired = es(t, 1.3, 1.95);
      const peer = es(t, 3.05, 3.3);
      B.crew.forEach((m) => {
        if (!m.p) return;
        const pull = netOn * (m.k === 'thomas' || m.k === 'other1' || m.k === 'other2' ? 1 : 0.25);
        m.p.set({
          x: m.x, y: 18, s: 0.8, flip: pull > 0.6, o: inBoat,
          armF: 20 + pull * (80 - down * 40) + peer * 30, armB: 10 + pull * (60 - down * 30) + peer * (m.i % 2 ? 150 : 40),
          lean: pull * (1 - down) * -6 + pull * down * 8 - tired * 4 * (1 - away), head: tired * 12 * (1 - es(t, 2.2, 2.5)) - peer * 8, blink: blinkAt(T, m.seed),
        });
        fade(m.sad, tired * (1 - es(t, 2.2, 2.5)) * 0.9);
      });
      const fk = es(t, 1.72, 1.85, ease.back) * (1 - es(t, 2.0, 2.1));
      vis(frown, { x: bx - 40, y: by - 190, s: fk, o: fk > 0.01 ? 1 : 0 });

      /* v4a — dawn: the shore rises in front; Jesus stands on it */
      const rise = es(t, 2.15, 2.65, ease.out);
      FS.L.shift(0, (1 - rise) * 520);
      jL.shift(0, (1 - rise) * 520);
      FS.L.fade(seg(t, 2.1, 2.2));
      jL.fade(seg(t, 2.1, 2.2));
      jesus.set({ x: SHORE.jx, y: SHORE.jy, s: 1.02, flip: false, armF: 12 + bump(t, 2.6, 3.0) * 20, armB: 6, head: -2, blink: blinkAt(T) });
      pose(jGlow, { x: SHORE.jx, y: SHORE.jy - 120, s: 1 + Math.sin(T * 1.2) * 0.03, o: 0.5 * es(t, 2.5, 2.9) * (1 - es(t, 3.05, 3.4) * 0.6) });
      /* v4b — the mist; they do not know Him */
      mistL.fade(es(t, 2.4, 2.8) * (0.5 + es(t, 3.0, 3.3) * 0.5));
      mistL.shift(-30 + Math.sin(T * 0.2) * 30 + es(t, 3.0, 3.8) * 60, 0);
      const qk = es(t, 3.1, 3.35, ease.back);
      const [qx, qy] = headAt(bx - 40 * bs, by, bs * 0.8, true);
      vis(qb, { x: qx - 10, y: qy - 30, s: qk * 0.95, o: qk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -20], [0.5, 0], [1.0, 10], [2.0, 10], [2.6, 50], [4, 50]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 50], [2.0, 50], [2.6, 30], [4, 30]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.14], [2.0, 1.16], [2.6, 1.0], [3.2, 1.04], [4, 1.06]]);
    };
  },
};
