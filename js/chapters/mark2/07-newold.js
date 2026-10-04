// Mk 2,21–22 — a patch of new cloth sewn on an old cloak tears a worse hole;
// new wine bursts an old wineskin; new wine goes into fresh skins.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { kf, hand, headAt, townsfolk, cloak, CLOAK_HOLE, patch, needle, wineskin, skinHalf, jug, splash, WINE, spark } from './lib.js';

const PI = Math.PI;
const PAR = 0.62;
const Y = 690;
const CL = { x: 560, y: 380 };                 // cloak hangs from the line here
const HX = CL.x + CLOAK_HOLE[0], HY = CL.y + CLOAK_HOLE[1];
const CRATE = 708;                            // the skins stand on a straw mat here
const SK = [{ x: 1036, old: true }, { x: 1118 }, { x: 1196 }];
const camFor = (x) => (x - 800) / PAR;

export default {
  id: 'm2-newold',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 21, text: 'Nikt nie przyszywa łaty z surowego sukna do starego ubrania.' },
    { v: 21, cont: true, text: 'W przeciwnym razie nowa łata obrywa jeszcze [część] ze starego ubrania i robi się gorsze przedarcie.' },
    { v: 22, text: 'Nikt też młodego wina nie wlewa do starych bukłaków.' },
    { v: 22, cont: true, text: 'W przeciwnym razie wino rozerwie bukłaki; i wino przepadnie, i bukłaki.' },
    { v: 22, cont: true, text: 'Lecz młode wino [należy wlewać] do nowych bukłaków».' },
  ],
  cam: { x: [camFor(550), camFor(1030)], y: [-20, 50], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, ['#d2e3dc', '#f1e8cf', '#f8eed8']);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const SUNX = S.portrait ? 1010 : 1200;   // phone: not half under the progress thread
    const sunEl = hanging(hangL, sun(c, 44), { x: SUNX, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 360, y: 150, len: 700 });

    /* hills with rows of vines */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 380, 130], color: C.hillFar });
    far.add(h1.markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    const h2 = band(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 120], color: C.hillMid });
    mid.add(h2.markup);
    let rows = '';
    for (let r = 0; r < 4; r++) for (let x = -900; x < 2500; x += 34) { const y = h2.fn(x) + 16 + r * 18; rows += c.cut(c.blob(x + (r % 2) * 17, y, 11, 7, 7, 0.2), 0.4, 3); }
    mid.add(sheet().p(rows, C.moss).out());

    /* the workshop yard: a wall with a doorway, packed earth */
    const yard = S.layer({ par: 0.4, sh: 3 });
    const ws = sheet();
    const door = [[780, 604], [780, 500], ...c.arc(820, 500, 40, 36, PI, 2 * PI, 10), [860, 604]];
    ws.p(c.cut([[-900, 520], [2500, 520], [2500, 606], [-900, 606]], 1, 20) + c.hole(door.map(([x, y]) => [x, Math.max(y, 522)]), 0.4, 6), mix(C.plaster, C.sand, 0.3));
    ws.p(c.cut([[-900, 512], [2500, 512], [2500, 524], [-900, 524]], 0.6, 12), C.stone2);
    yard.add(ws.out());
    yard.add(sheet().p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand2, C.clay, 0.2)).out());
    yard.add(bush(c, 700, 606, 90, C.sage, C.moss) + bush(c, 1360, 606, 120, C.sage, C.moss) + grass(c, { x0: -800, x1: 2400, y: 606, n: 30, h: 12, color: C.olive }));

    /* the tailor's corner: posts, line, the old cloak */
    const tailL = S.layer({ par: PAR, sh: 5 });
    const posts = sheet();
    posts.p(c.cut(c.rect(392, 340, 10, Y - 340), 0.4, 8) + c.cut(c.rect(736, 340, 10, Y - 340), 0.4, 8), C.wood2);
    posts.x(c.ribbon(c.qbez([398, 352], [570, 390], [740, 352], 16), 1.6), C.rope);
    tailL.add(posts.out());
    const cloakOld = tailL.add(`<g>${cloak(c)}</g>`);
    const cloakTorn = tailL.add(`<g>${cloak(c, { big: true })}</g>`);
    const pegs = tailL.add(`<g>${sheet().p(c.cut(c.rect(-50, -6, 8, 14), 0.2, 3) + c.cut(c.rect(42, -6, 8, 14), 0.2, 3), C.wood3).out()}</g>`);
    const patchEl = tailL.add(`<g>${patch(c)}</g>`);
    const patchTorn = tailL.add(`<g>${patch(c, { flap: true })}</g>`);
    const needleEl = tailL.add(`<g>${needle(c)}</g>`);
    // the tailor with her bolt of bright new cloth
    const bolt = sheet().p(c.cut(c.rect(-26, -40, 52, 40), 0.5, 6), C.basket).p(c.cut([[-24, -40], [24, -40], [28, -56], [-20, -60]], 0.5, 5), C.terracotta).x(c.ribbon([[-20, -50], [24, -48]], 3), shade(C.terracotta, 0.3), 'opacity=".6"').out();
    tailL.add(`<g transform="translate(300 ${Y})">${bolt}</g>`);
    const tailor = S.puppet(tailL.add(person(c, townsfolk(c, { hairStyle: 'veil', veil: C.skyVeil, robe: C.sageRobe, beard: 'none', skin: C.skin2, pose: 'sit' }))));
    // the washing cloud and its drops
    const rainCloud = hanging(tailL, `${cloud(c, 120, C.skyVeil, C.skyBlue2)}`, { x: CL.x, y: 250, len: 700 });
    const drops = Array.from({ length: 10 }, (_, i) => ({ i, el: tailL.add(`<path d="${c.cut(c.ell(0, 0, 3, 6, 8), 0.2, 3)}" fill="${C.skyBlue2}"/>`), x: CL.x - 50 + i * 11 + c.rr(-4, 4), ph: c.rr(0, 1) }));
    const rip = tailL.add(`<path d="${c.ribbon([[-30, 0], [-20, -8], [-10, 4], [0, -8], [10, 4], [20, -8], [30, 0]], 3)}" fill="${C.terracotta}"/>`);

    /* the vintner's corner */
    const wineL = S.layer({ par: PAR, sh: 5 });
    const mat = sheet();
    mat.p(c.cut([[980, CRATE - 4], [1250, CRATE - 6], [1262, CRATE + 8], [972, CRATE + 10]], 0.8, 8), C.wheat2);
    let straw = '';
    for (let x = 984; x < 1250; x += 9) straw += c.ribbon([[x, CRATE - 3], [x + 3, CRATE + 8]], 1.4);
    mat.x(straw, shade(C.wheat2, -0.2), 'opacity=".6"');
    wineL.add(mat.out());
    // the big jar of new wine, fizzing
    const amph = sheet();
    amph.p(c.cut([[852, Y], [836, Y - 40], [840, Y - 90], [856, Y - 110], [860, Y - 124], [896, Y - 124], [900, Y - 110], [916, Y - 90], [920, Y - 40], [904, Y]], 0.6, 6), C.pot);
    amph.p(c.cut(c.ell(878, Y - 124, 20, 5, 12), 0.3, 4), WINE);
    amph.x(c.ribbon([[838, Y - 60], [918, Y - 60]], 3), C.cream, 'opacity=".5"');
    wineL.add(amph.out());
    const bubbles = Array.from({ length: 6 }, (_, i) => ({ i, el: wineL.add(`<circle r="${c.rr(2.5, 4.5)}" fill="${mix(WINE, C.cream, 0.5)}"/>`), x: 870 + c.rr(-10, 10), ph: c.rr(0, 1) }));
    const vintner = S.puppet(wineL.add(person(c, townsfolk(c, { man: true, robe: C.ochreRobe, mantle: null, belt: C.leather, hairStyle: 'curly', beard: 'full' }))));
    const skins = SK.map((k, i) => {
      const el = wineL.add(`<g>${wineskin(c, { old: !!k.old })}</g>`);
      return { ...k, i, el, y: CRATE - 96 };
    });
    const halves = [-1, 1].map((sd) => wineL.add(`<g>${skinHalf(c, sd)}</g>`));
    const splashEl = wineL.add(`<g>${splash(c, 50)}</g>`);
    const puddle = wineL.add(`<path d="${c.cut(c.blob(0, 0, 90, 14, 14, 0.2), 0.8, 6)}" fill="${WINE}"/>`);
    const jugEl = wineL.add(`<g>${jug(c)}</g>`);
    const stream = wineL.add(`<path d="${c.ribbon([[0, 0], [0.8, -50], [0, -100]], 4.4)}" fill="${WINE}"/>`);
    const sparks = [0, 1, 2, 3].map((i) => wineL.add(`<g>${spark(c, 9)}</g>`));

    /* foreground */
    const fg = S.layer({ par: 0.92, sh: 6 });
    fg.add(bush(c, 130, 910, 240, C.moss, C.sage) + bush(c, 1560, 910, 260, C.sage, C.moss));

    return (t, time) => {
      const T = time;
      swing(sunEl, SUNX, 140, T, 1, 0.6);
      swing(cl1, 360 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* the cloak: patch sewn on, washed, shrinks, tears */
      const torn = es(t, 1.55, 1.6);
      const tug = bump(t, 1.35, 1.6);
      const sway = Math.sin(T * 0.9) * 1.2;
      pose(cloakOld, { x: CL.x, y: CL.y, r: sway + tug * Math.sin(t * 90) * 2, o: 1 - torn });
      pose(cloakTorn, { x: CL.x, y: CL.y, r: sway, o: torn });
      pose(pegs, { x: CL.x, y: CL.y + 2, r: sway });
      const fly = es(t, 0.08, 0.38, ease.out);
      const shrink = es(t, 1.32, 1.55);
      const fall = es(t, 1.6, 1.95, ease.in);
      pose(patchEl, { x: lerp(300, HX, fly), y: lerp(Y - 60, HY, fly) - Math.sin(fly * PI) * 80, r: (1 - fly) * -40 + sway, s: (0.7 + fly * 0.3) * (1 - shrink * 0.2), sy: 1 - shrink * 0.12, o: seg(t, 0.05, 0.1) * (1 - torn) });
      pose(patchTorn, { x: HX + fall * 30, y: lerp(HY, Y - 8, fall), r: fall * 200, s: 0.8, o: torn });
      // the needle hops around the patch
      const sew = seg(t, 0.4, 0.92);
      const corners = [[-22, -20], [22, -20], [22, 20], [-22, 20], [-22, -20]];
      const ci = Math.min(3, Math.floor(sew * 4)), cu = sew * 4 - ci;
      const [ax, ay] = corners[ci], [bx, by] = corners[ci + 1];
      pose(needleEl, { x: HX + lerp(ax, bx, cu) - 4, y: HY + lerp(ay, by, cu) - Math.abs(Math.sin(cu * PI * 3)) * 10, r: -10 + Math.sin(sew * 40) * 12, o: bump(t, 0.35, 0.98) > 0.05 ? 1 : 0 });
      const dismay = es(t, 1.6, 1.8);
      tailor.set({ x: 330, y: Y, s: 0.95, flip: false, armF: 60 + (sew > 0 && sew < 1 ? Math.sin(t * 60) * 20 : 0) + dismay * 60, armB: 30 + dismay * 110, head: -4 - dismay * 10 + bump(t, 1.1, 1.5) * -8, blink: blinkAt(T, 2) });
      const rc = es(t, 1.0, 1.2, ease.out) * (1 - es(t, 1.45, 1.65));
      pose(rainCloud, { x: CL.x, y: lerp(-150, 250, rc), r: Math.sin(T * 0.8) * 1.5, o: rc > 0.01 ? 1 : 0 });
      drops.forEach((d) => {
        const k = (T * 1.2 + d.ph) % 1;
        pose(d.el, { x: d.x, y: lerp(275, 520, k), o: bump(t, 1.12, 1.5) * (1 - k * 0.5) });
      });
      const r_ = bump(t, 1.52, 1.75);
      pose(rip, { x: HX, y: HY - 40, s: 0.6 + r_ * 0.8, o: r_ });

      /* the wine: pour into the old skin, it swells and bursts; then into fresh skins */
      const VX = kf(t, [[2.0, SK[0].x - 92], [4.05, SK[0].x - 92], [4.22, SK[1].x - 92], [4.6, SK[1].x - 92], [4.7, SK[2].x - 92]]);
      const pourOld = es(t, 2.25, 2.45) * (1 - es(t, 2.95, 3.1));
      const pourNew1 = es(t, 4.24, 4.34) * (1 - es(t, 4.54, 4.6));
      const pourNew2 = es(t, 4.72, 4.8) * (1 - es(t, 4.96, 5.0));
      const pour = Math.max(pourOld, pourNew1, pourNew2);
      const shock = es(t, 3.4, 3.55) * (1 - es(t, 4.0, 4.15));
      const target = t < 3.5 ? skins[0] : t < 4.66 ? skins[1] : skins[2];
      const lift = Math.max(es(t, 2.1, 2.3) * (1 - es(t, 3.0, 3.3)), es(t, 4.15, 4.28) * (1 - es(t, 4.98, 5.1)));
      const armF = 30 + lift * 70 + shock * 30;
      const walkV = (t > 4.05 && t < 4.22) || (t > 4.6 && t < 4.7);
      vintner.set({ x: VX, y: Y - 4, s: 1.0, flip: false, walk: walkV ? VX * 0.05 : undefined, armF, armB: 20 + shock * 150, head: -4 + pour * 8 - shock * 10, lean: pour * 4 - shock * 6, blink: blinkAt(T, 4) });
      const [jhx, jhy] = hand(VX, Y - 4, 1.0, false, armF, pour * 4 - shock * 6);
      const tilt = pour * 72;
      pose(jugEl, { x: jhx, y: jhy, r: tilt, s: 0.7, oy: -38, o: t > 1.9 && shock < 0.5 ? 1 : 0 });
      // spout in world coords
      const tr_ = (tilt * PI) / 180, sx = jhx + (30 * Math.cos(tr_) + 32 * Math.sin(tr_)) * 0.7, sy = jhy + (30 * Math.sin(tr_) - 32 * Math.cos(tr_)) * 0.7;
      const mx = target.x, my = CRATE - 96 * (target === skins[0] ? 1 : 0.9) + 4;
      const dx = sx - mx, dy = sy - my;
      pose(stream, { x: mx, y: my, r: (Math.atan2(dx, -dy) * 180) / PI, sy: Math.max(0.01, Math.hypot(dx, dy) / 100), o: pour > 0.5 ? 1 : 0 });
      bubbles.forEach((b) => {
        const k = (T * 0.8 + b.ph) % 1;
        pose(b.el, { x: b.x + Math.sin(T * 3 + b.i) * 3, y: Y - 126 - k * 40, s: 1 - k * 0.6, o: (1 - k) * 0.9 });
      });
      // old skin: fills, swells, wobbles, bursts
      const fillOld = es(t, 2.45, 2.95);
      const swell = es(t, 3.0, 3.38);
      const burst = es(t, 3.38, 3.42);
      const wob = swell * Math.sin(T * 14) * 0.03 * (1 - burst);
      pose(skins[0].el, { x: skins[0].x, y: CRATE, oy: 96, sx: 0.9 + fillOld * 0.1 + swell * 0.28 + wob, sy: 0.92 + fillOld * 0.08 + swell * 0.16 - wob, o: 1 - burst });
      const flyH = es(t, 3.4, 3.9, ease.out);
      halves.forEach((h, i) => {
        const sd = i ? 1 : -1;
        pose(h, { x: skins[0].x + sd * flyH * 70, y: skins[0].y - Math.sin(flyH * PI) * 70 + flyH * 50, r: sd * flyH * 80, o: burst });
      });
      const sp = es(t, 3.38, 3.7, ease.out);
      pose(splashEl, { x: skins[0].x, y: skins[0].y + 50 - sp * 20, s: 0.4 + sp * 1.4, o: bump(t, 3.38, 3.95) });
      pose(puddle, { x: skins[0].x - 10, y: CRATE + 14, sx: es(t, 3.45, 3.95), sy: es(t, 3.45, 3.95) * 0.9, o: seg(t, 3.44, 3.5) });
      // new skins: fill and stay whole
      [1, 2].forEach((i) => {
        const f = i === 1 ? es(t, 4.35, 4.62) : es(t, 4.72, 4.98);
        pose(skins[i].el, { x: skins[i].x, y: CRATE, oy: 96, sx: 0.8 + f * 0.25, sy: 0.72 + f * 0.3 });
      });
      sparks.forEach((spk, i) => {
        const k = es(t, 4.85 + i * 0.05, 5.0 + i * 0.05, ease.back);
        const sk = skins[1 + (i % 2)];
        pose(spk, { x: sk.x + (i < 2 ? -30 : 30), y: sk.y + 10 - i * 12, s: k * 0.9, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      const TX = camFor(S.portrait ? 555 : 600);   // phone: the tailor and her bolt of cloth clear of the left edge
      S.cam.x = kf(t, [[-0.5, TX], [1.9, TX], [2.3, camFor(1000)]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.9, 1.16], [1.9, 1.16], [2.3, 1.14], [3.3, 1.14], [3.5, 1.06], [4.0, 1.12]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.9, 20], [2.3, 30]]);
    };
  },
};
