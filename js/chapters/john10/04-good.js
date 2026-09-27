// J 10,11 — evening gold on the hills. Jesus Himself now stands on the knoll among the flock with the shepherd's
// crook, a lamb across His shoulders: "I am the good shepherd" — the I AM comes down and the light gathers round
// Him. "The good shepherd lays down His life for the sheep" — the night comes rolling in from the right like a dark
// sheet with claws; He steps forward between the flock and the dark, arms wide open, and a dome of warm light
// covers the sheep behind Him while the sun goes down.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { grass, rock, bush, olive } from '../../assets/nature.js';
import {
  pastureSet, ewe, sheepRig, WOOLS, JESUS, staff, shoulderLamb, onShoulders, iAm, word, glory, darkSheet, voiceRings, flowerClump,
  kf, vis, tr, GOLDEN, DUSK, TWILIGHT, PI,
} from './lib.js';

const FLOCK = [[600, 646, 1, false], [676, 672, 0, false], [540, 682, 2, false], [940, 650, 3, true], [1020, 674, 4, true], [870, 690, 5, true], [720, 640, 0, false, true], [1000, 628, 1, true, true]];

export default {
  id: 'j10-good',
  beats: [
    { v: 11, text: 'Ja jestem dobrym pasterzem.' },
    { v: 11, cont: true, text: 'Dobry pasterz daje życie swoje za owce.' },
  ],
  cam: { x: [-40, 60], y: [-80, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { skyCols: GOLDEN, sunAt: [1160, 250], sunR: 52, groundY: 560, clouds: true });
    // the knoll
    const knoll = S.layer({ par: 0.45, sh: 4 });
    const kfn = (x) => 560 + Math.pow((x - 800) / 520, 2) * 90 + Math.sin(x * 0.02) * 3;
    knoll.add(sheet().p(c.ridge(kfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.wheat, 0.18)).out());
    knoll.add(grass(c, { x0: -1000, x1: 2600, y: 560, fn: kfn, n: 70, h: 14, color: C.moss }));
    knoll.add(olive(c, 330, kfn(330) + 10, 1.1) + rock(c, 1260, kfn(1260) + 12, 90, 30, C.rock2));
    [[480, 720], [1120, 730], [760, 740], [330, 700], [1290, 700]].forEach(([x, y]) => knoll.add(`<g transform="translate(${x} ${y})">${flowerClump(c, { n: 7, w: 70, h: 30 })}</g>`));
    // the glory behind Him
    const gL = S.layer({ par: 0.45, sh: 0, flat: true });
    const glo = gL.add(`<g>${glory(c, 250, 16)}</g>`);
    // the night rolling in (a whole sheet slid on the compositor)
    const nightL = S.layer({ par: 0.5, sh: 0, flat: true, pad: 900 });
    nightL.add(`<g transform="translate(1500 500)">${darkSheet(c, 1, { w: 1800, h: 1800, col: '#1f1c3a' })}</g>`);
    // the dome of light over the flock
    const domeL = S.layer({ par: 0.5, sh: 0, flat: true });
    const dome = domeL.add(`<g><ellipse rx="420" ry="220" fill="url(#halo-glow)"/></g>`);
    const act = S.layer({ par: 0.5, sh: 5 });
    const flock = FLOCK.map(([x, y, w, fl, lamb], i) => ({ i, x, y, fl, lamb: !!lamb, r: sheepRig(act.add(ewe(c, { wool: WOOLS[w], lamb: !!lamb, patch: i === 2 })), !!lamb) }));
    const jesus = S.puppet(act.add(onShoulders(person(c, { ...JESUS, holdF: staff(c, 210, 22) }), shoulderLamb(c, C.cream))));
    const fx = S.layer({ par: 0.55, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: false, color: shade(C.halo, -0.05) });
    const am = fx.add(`<g>${iAm(c, tr('JA JESTEM', 'I AM'), { size: 42 })}<g transform="translate(0 60)">${word(c, tr('dobrym pasterzem', 'the good shepherd'), { size: 24, fill: C.cream })}</g></g>`);
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 110, 960, 220, mix(C.sage, C.moss, 0.4), C.moss) + rock(c, 1480, 985, 240, 90, C.rock2) + bush(c, 1660, 950, 170, C.moss));

    return (t, time) => {
      const T = time;
      const dusk = es(t, 1.05, 1.9);
      if (dusk <= 0) set.sk.set(...GOLDEN); else set.sk.blend(GOLDEN, TWILIGHT, dusk);
      set.update(T, { sunX: 1160, sunY: lerp(250, 470, es(t, 1.1, 1.95, ease.in)), glow: 0.8 });
      /* v11a — I am the good shepherd */
      const ak = es(t, 0.15, 0.45, ease.back) * (1 - es(t, 1.1, 1.3) * 0.0);
      vis(am, { x: 800, y: 210 - (1 - ak) * 80 - es(t, 1.05, 1.3) * 40, s: Math.min(1, ak), o: ak > 0.01 ? 1 - es(t, 1.1, 1.3) * 0.25 : 0 });
      const gk = es(t, 0.2, 0.6);
      vis(glo, { x: 800, y: 440, s: 0.7 + gk * 0.3 + bump(t, 1.3, 2) * 0.2, o: gk * (0.6 - dusk * 0.15) });
      /* v11b — lays down His life: the dark comes, He steps between, arms wide */
      const dk = es(t, 1.08, 1.6);
      nightL.shift(lerp(700, -430, dk), 0);
      nightL.fade(dk > 0.001 ? 0.9 : 0);
      const step = es(t, 1.35, 1.65);
      const wide = es(t, 1.45, 1.75);
      const talk = Math.max(bump(t, 0.05, 0.95), bump(t, 1.05, 1.5));
      const jx = lerp(790, 870, step);
      jesus.set({ x: jx, y: 624 + step * 4, s: 1.12, flip: false, walk: step > 0 && step < 1 ? jx * 0.08 : undefined, armF: 22 + wide * 38, armB: 10 + talk * 20 + wide * 110, head: -3 + wide * -4, blink: blinkAt(T, 1) });
      rings(jx + 12, 624 - 186, talk, T, { dir: 1, s0: 0.7, spread: 1.7 });
      const dm = es(t, 1.55, 1.85);
      vis(dome, { x: 760, y: 660, s: 0.8 + dm * 0.2, o: dm });
      flock.forEach((m) => {
        const hide = es(t, 1.4 + m.i * 0.02, 1.7 + m.i * 0.02);
        const x = m.x - (m.fl ? hide * 80 : 0), y = m.y;
        const look = es(t, 0.1 + m.i * 0.04, 0.4 + m.i * 0.04);
        m.r.set({ x, y, s: m.lamb ? 0.8 : 0.96, flip: m.fl, head: -look * 14 + (m.i % 3 === 0 ? bump(t, 0.6, 1.0) * 26 : 0), hop: hide > 0 && hide < 1 ? Math.abs(Math.sin(T * 12 + m.i)) * 3 : 0 });
      });
      S.cam.x = kf(t, [[0, 0], [1, 0], [1.8, 30]]);
      S.cam.y = kf(t, [[0, -30], [1, -20], [1.8, 10]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.2], [1.8, 1.08]]);
    };
  },
};
