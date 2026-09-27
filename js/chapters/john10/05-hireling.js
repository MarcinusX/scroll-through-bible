// J 10,12–13 — the same hills at nightfall, another flock. The hired hand sits on a rock turning his coins, his
// back to the sheep. Out of the dark wood a paper wolf comes creeping, eyes glinting — he sees it, jumps up, drops
// his staff and runs for it. The wolf leaps into the flock: the sheep scatter every way and it lopes off with a
// lamb by the scruff (a storybook picture, no harm shown). Far off on the next hill the hired hand sits down again,
// counting his coins, never looking back — the sheep were never his care.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet, swing } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { grass, rock, bush, cypress, olive } from '../../assets/nature.js';
import {
  pastureSet, ewe, sheepRig, wolf, WOOLS, HIRELING, staff, pouch, coin, bang, question, thought, nameTag, hanging, kf, vis, tr,
  TWILIGHT, NIGHT, PI,
} from './lib.js';

const FL = [[720, 640, 0], [790, 618, 1], [860, 642, 2], [660, 614, 3], [930, 620, 4], [764, 664, 5]];
const DIRS = [[-1.1, 0.25], [0.1, -0.6], [1.2, 0.4], [-1.4, -0.4], [1.5, -0.3], [0.2, 0.5]];

export default {
  id: 'j10-hireling',
  enter: 'fly',
  beats: [
    { v: 12, text: 'Najemnik zaś i ten, kto nie jest pasterzem, którego owce nie są własnością, widząc nadchodzącego wilka,' },
    { v: 12, cont: true, text: 'opuszcza owce i ucieka,' },
    { v: 12, cont: true, text: 'a wilk je porywa i rozprasza;' },
    { v: 13 },
  ],
  cam: { x: [-60, 60], y: [-80, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { skyCols: TWILIGHT, sunAt: [1180, 560], sunR: 40, moonAt: [1120, 170], starsN: 60, groundY: 560, clouds: false, tintCol: C.indigo, tintK: 0.28 });
    // the far hill the hired hand runs off to
    const farHill = S.layer({ par: 0.3, sh: 3 });
    const hf = (x) => 530 + Math.pow((x - 1250) / 300, 2) * 60;
    farHill.add(sheet().p(c.ridge(hf, 850, 1700, 1400, 12, 1), mix(mix(C.hillMid, C.sage, 0.3), C.indigo, 0.3)).out());
    // the near meadow
    const ground = S.layer({ par: 0.45, sh: 4 });
    const gfn = c.wave(574, [6, 2], [700, 160]);
    ground.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.indigo, 0.25)).out());
    ground.add(grass(c, { x0: -1000, x1: 2600, y: 574, fn: gfn, n: 60, h: 13, color: mix(C.moss, C.indigo, 0.3) }));
    // the dark wood on the left
    const wood = S.layer({ par: 0.45, sh: 5 });
    const TREE = mix(C.moss2, '#1f1c3a', 0.45);
    wood.add(cypress(c, 250, 600, 260, TREE) + cypress(c, 330, 610, 220, shade(TREE, -0.1)) + cypress(c, 400, 600, 190, TREE) + olive(c, 180, 630, 1.2, { trunk: mix(C.wood2, C.night2, 0.4), leaf: mix(C.olive, C.night2, 0.45), leaf2: mix(C.sage, C.night2, 0.5) }) + bush(c, 450, 630, 90, mix(C.moss, C.night2, 0.4)));
    const act = S.layer({ par: 0.45, sh: 5 });
    act.add(rock(c, 1060, 654, 110, 40, mix(C.rock2, C.indigo, 0.2)));
    const flock = FL.map(([x, y, w], i) => ({ i, x, y, lamb: i === 5, r: sheepRig(act.add(ewe(c, { wool: WOOLS[w], lamb: i === 5, patch: i === 2 })), i === 5) }));
    const w = act.add(wolf(c, { dark: true }));
    const wHd = w.querySelector('.hd'), wTl = w.querySelector('.tl');
    const carried = act.add(`<g>${ewe(c, { wool: WOOLS[5], lamb: true })}</g>`);
    const hireSit = S.puppet(act.add(person(c, { ...HIRELING, pose: 'sit', holdF: `<g transform="translate(0 4)">${coin(c, 7)}</g>`, holdB: pouch(c) })));
    const hireRun = S.puppet(act.add(person(c, { ...HIRELING, holdB: pouch(c) })));
    const dropped = act.add(`<g>${staff(c, 180, 0)}</g>`);
    const farL = S.layer({ par: 0.3, sh: 3 });
    const hireFar = S.puppet(farL.add(person(c, { ...HIRELING, pose: 'sit', holdF: `<g transform="translate(0 4)">${coin(c, 8)}</g>`, holdB: pouch(c) })));
    const fx = S.layer({ par: 0.5, sh: 5 });
    const bangH = fx.add(`<g>${bang(c, 18)}</g>`);
    const qs = [0, 1, 2].map(() => fx.add(`<g>${question(c)}</g>`));
    const think = fx.add(`<g>${thought(c, `<g transform="translate(-9 2)">${coin(c, 9)}</g><g transform="translate(9 2)">${coin(c, 9)}</g><g transform="translate(0 -8)">${coin(c, 9)}</g>`, { w: 64, h: 48 })}</g>`);
    const glint = fx.add(`<g><circle r="18" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 9, 2.4, 4, 0))}" fill="${C.star}"/></g>`);
    const tagH = hanging(fx, nameTag(c, tr('najemnik', 'the hired hand'), { size: 18 }), { x: 1060, y: 300, len: 700 });
    const tagW = hanging(fx, nameTag(c, tr('wilk', 'the wolf'), { size: 18, dark: true }), { x: 470, y: 300, len: 700 });
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 110, 960, 220, mix(C.moss, C.night2, 0.35), mix(C.moss2, C.night2, 0.35)) + rock(c, 1480, 985, 240, 90, mix(C.rock2, C.indigo, 0.3)));

    return (t, time) => {
      const T = time;
      const night = es(t, 0.2, 3.6);
      set.sk.blend(TWILIGHT, NIGHT, night * 0.8);
      set.starL.fade(0.2 + night * 0.8);
      set.update(T, { sunX: 1180, sunY: lerp(560, 640, es(t, 0, 1)), sunO: 1 - es(t, 0.3, 1), glow: 0.3, moonY: lerp(240, 150, es(t, 0, 3)) });
      /* v12a — the hired hand, the wolf coming, he sees it */
      const htk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.8, 1.0, ease.in));
      swing(tagH, 1060, 300 - (1 - htk) * 700, htk > 0.001 ? T : 0, 1.2, 0.8);
      fade(tagH, htk > 0.001 ? 1 : 0);
      const creep = es(t, 0.3, 0.85);
      const leap = es(t, 2.1, 2.45);
      const away = es(t, 2.55, 2.95, ease.in);
      const wtk = es(t, 0.4, 0.7, ease.out) * (1 - es(t, 0.95, 1.1, ease.in));
      swing(tagW, 470, 300 - (1 - wtk) * 700, wtk > 0.001 ? T : 0, 1.2, 0.8, 2);
      fade(tagW, wtk > 0.001 ? 1 : 0);
      // wolf: creeps out of the wood, waits, leaps into the flock, lopes away with the lamb
      let wx = lerp(300, 530, creep), wy = 640, wr = 0, flip = false;
      if (leap > 0) { wx = lerp(530, 730, leap); wy = 640 - Math.sin(leap * PI) * 80; wr = lerp(-14, 10, leap); }
      if (away > 0) { wx = lerp(730, 240, away); wy = 650; wr = 0; flip = true; }
      const trot = (creep > 0 && creep < 1) || (away > 0 && away < 1);
      pose(w, { x: wx, y: wy - (trot ? Math.abs(Math.sin(T * 10)) * 4 : 0), s: 1.3, sx: flip ? -1 : 1, r: wr, o: creep > 0.001 && away < 0.98 ? 1 : 0 });
      pose(wHd, { x: 40, y: -52, r: creep < 1 ? 8 : -6 + bump(t, 1.2, 2) * 10 });
      pose(wTl, { x: -40, y: -46, r: (trot ? Math.sin(T * 8) * 8 : 0) + leap * -10, ox: -40, oy: -46 });
      const sees = es(t, 0.65, 0.8);
      const up = es(t, 1.08, 1.15);
      const run = es(t, 1.15, 1.9, ease.in);
      hireSit.set({ x: 1060, y: 644, s: 1.0, flip: sees < 0.5, armF: 40 + (T ? Math.sin(T * 3) * 6 : 0) * (1 - sees), armB: 10 + sees * 60, head: 8 - sees * 16, o: 1 - up, blink: sees > 0.5 ? 0 : blinkAt(T, 3) });
      hireRun.set({ x: lerp(1060, 1420, run), y: 650, s: 1.0, flip: false, walk: run > 0 && run < 1 ? T * 16 : undefined, amt: 1.6, lean: 12 * (run > 0 ? 1 : 0), armF: 50, armB: 60, head: -6, o: up * (run < 0.98 ? 1 : 0), blink: 0 });
      const bk = es(t, 0.7, 0.8, ease.back) * (1 - es(t, 1.3, 1.45));
      vis(bangH, { x: 1110, y: 420, s: bk * 1.4, o: bk > 0.01 ? 1 : 0 });
      vis(dropped, { x: lerp(1030, 1000, es(t, 1.1, 1.3)), y: 656, r: lerp(10, 84, es(t, 1.1, 1.35, ease.in)), o: up > 0.01 ? 1 : 0 });
      /* v12c — the wolf snatches and scatters them */
      const scat = es(t, 2.2, 2.9, ease.out);
      flock.forEach((m) => {
        const i = m.i;
        const [dx, dy] = DIRS[i];
        let x = m.x + dx * scat * 260, y = m.y + dy * scat * 50;
        const hop = scat > 0 && scat < 1 ? Math.abs(Math.sin(T * 13 + i)) * 5 : 0;
        const graze = (1 - es(t, 0.7, 0.9)) * (i % 2 ? 1 : 0.4);
        const look = es(t, 0.75, 1.0) * (1 - scat);
        m.r.set({ x, y, s: m.lamb ? 0.8 : 0.94, flip: scat > 0.05 ? dx < 0 : x > 800, head: graze * 32 - look * 12 + (i % 3 === 0 ? bump(t, 3.2, 3.9) * -18 : 0), hop, o: m.lamb ? (leap > 0.9 ? 0 : 1) : 1 });
      });
      // the lamb in the wolf's jaws
      const hasLamb = leap > 0.9;
      const hx = wx + (flip ? -1 : 1) * 92, hy = wy - 60;
      vis(carried, { x: hx, y: hy + 26, s: 0.66, sx: flip ? -1 : 1, r: flip ? 12 : -12, o: hasLamb && away < 0.98 ? 1 : 0 });
      /* v13 — far off, counting his coins; the sheep left wondering */
      const far = es(t, 3.05, 3.35);
      hireFar.set({ x: 1250, y: hf(1250) + 4, s: 0.55, flip: false, armF: 40 + (T ? Math.sin(T * 3) * 8 : 0), armB: 10, head: 10, o: far, blink: blinkAt(T, 5) });
      const tk = es(t, 3.3, 3.5, ease.back);
      vis(think, { x: 1290, y: hf(1250) - 150, s: tk * 0.9, o: tk > 0.01 ? 1 : 0 });
      vis(glint, { x: 1262, y: hf(1250) - 62, s: 0.8 + (T ? Math.sin(T * 5) * 0.2 : 0), o: far * es(t, 3.2, 3.4) });
      qs.forEach((el, i) => {
        const m = flock[[0, 2, 4][i]];
        const k = es(t, 3.35 + i * 0.1, 3.55 + i * 0.1, ease.back);
        vis(el, { x: m.x + DIRS[m.i][0] * scat * 260 + 20, y: m.y + DIRS[m.i][1] * scat * 50 - 90, s: k * 0.8, o: k > 0.01 ? 1 : 0 });
      });
      S.cam.x = kf(t, [[0, 60], [0.6, -20], [1.2, 60], [2, 0], [3, 0], [3.4, 60]]);
      S.cam.y = kf(t, [[0, -20], [3, 0], [3.5, -40]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.14], [2.2, 1.08], [3.4, 1.06]]);
    };
  },
};
