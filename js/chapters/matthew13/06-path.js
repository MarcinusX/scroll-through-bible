// Mt 13,19–21 — the sower explained, on a field cut open at the front (Mark 4's explanation, Matthew's own stage):
// the trodden path on the left, the rocky ground on the right, Jesus on the green knoll between, sowing the word —
// a tiny glowing scroll. Each listener's heart opens like two little doors onto that very soil. The man on the path
// hears but does not understand, and the crow (the evil one) swoops down and snatches the word out of his heart;
// the flap lifts on the hard-packed road. The woman on the rocky ground takes the word with joy and it springs up at
// once — but the flap shows its roots striking the rock; the sun and wind of persecution come, the shoot withers
// and she sinks to her knees, her heart cracked.
import { C, person, CAST, blinkAt, pose, lerp, sheet } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, clamp } from '../../core/anim.js';
import { soilStage, XP, FFACE, FLAPB, FEET, LISTEN, addHeart, wordSeed, crow, sproutRig, rootPieces, speech, GLYPH, headAt, track, arcAt, PI } from './lib.js';

const PAR = 0.6;
const camFor = (x) => (x - 800) / PAR * 0.62;

export default {
  id: 'mt13-path',
  parable: true,
  beats: [
    { v: 19, text: 'Do każdego, kto słucha słowa o królestwie, a nie rozumie go, przychodzi Zły i porywa to, co zasiane jest w jego sercu.' },
    { v: 19, cont: true, text: 'Takiego człowieka oznacza ziarno posiane na drodze.' },
    { v: 20 },
    { v: 21, text: 'ale nie ma w sobie korzenia, lecz jest niestały.' },
    { v: 21, cont: true, text: 'Gdy przyjdzie ucisk lub prześladowanie z powodu słowa, zaraz się załamuje.' },
  ],
  cam: { x: [camFor(XP.L) - 20, camFor(XP.R) + 20], y: [0, 130], z: [0.96, 1.4] },
  build(S) {
    const St = soilStage(S, { left: 'path', right: 'rock', sky2: [C.apricot, C.peach, C.dawn] });
    const c = St.c;

    /* the path: its flap; the rocky ground: roots that hit the rock, then its flap */
    const rockX = XP.R + 20;
    const rootRock = St.ground.add(`<g>${rootPieces(c, [
      { pts: [[rockX, FFACE + 2], [rockX + 1, 632], [rockX + 3, 640], [rockX + 12, 644], [rockX + 24, 645], [rockX + 36, 642], [rockX + 44, 644]], o0: 0, o1: 0.85 },
      { pts: [[rockX + 1, 634], [rockX - 10, 641], [rockX - 22, 644], [rockX - 32, 642]], o0: 0.3, o1: 1 },
    ], 5)}</g>`);
    const rsRock = Array.from(rootRock.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const bonk = St.ground.add(`<g opacity="0">${sheet().x(c.poly(c.star(0, 0, 11, 4, 6)), C.cream).out(false)}</g>`);
    const flapPath = St.ground.add(`<g>${St.flap(XP.L)}</g>`);
    const flapRock = St.ground.add(`<g>${St.flap(XP.R)}</g>`);
    St.plants.add(rock(c, XP.R - 150, 592, 64, 30, C.rock2) + rock(c, XP.R + 160, 588, 44, 22, C.rock) + rock(c, XP.R + 90, 600, 40, 18, C.rock3));
    const sproutEl = St.plants.add(sproutRig(c, 56));

    /* people: Jesus sowing the word, the man on the path, the woman on the rocky ground */
    const bag = sheet().p(c.cut(c.blob(0, 16, 13, 15, 12, 0.12), 0.4, 4), C.basket).p(c.ribbon([[-6, 3], [6, 3]], 3), C.rope).out();
    const jesus = S.puppet(St.people.add(person(c, { ...CAST.jesus, holdB: bag })));
    const pathMan = S.puppet(St.people.add(person(c, { ...LISTEN.path, holdB: sheet().p(c.cut(c.blob(0, 12, 14, 10, 10, 0.15), 0.4, 4), C.linen2).out() })));
    const pathHeart = addHeart(pathMan, c, 'path', LISTEN.path.robe);
    const rockW = S.puppet(St.people.add(person(c, LISTEN.rock)));
    const rockHeartW = addHeart(rockW, c, 'rock', LISTEN.rock.robe);
    const rockK = S.puppet(St.people.add(person(c, { ...LISTEN.rock, pose: 'kneel' })));
    const rockHeartK = addHeart(rockK, c, 'rock', LISTEN.rock.robe);
    rockK.el.querySelector('.heart').setAttribute('transform', 'translate(-7 -66)');

    /* fx: the words in flight, the puzzled bubble, the crow, sparkles, heat and wind */
    const seedPath = St.fx.add(`<g>${wordSeed(c)}</g>`);
    const seedRock = St.fx.add(`<g>${wordSeed(c)}</g>`);
    const puzzled = St.fx.add(`<g>${speech(c, GLYPH.q(c), { w: 44, h: 40 })}</g>`);
    const crowEl = St.fx.add(`<g opacity="0">${crow(c)}</g>`);
    const crowWF = crowEl.querySelector('.wingF'), crowWB = crowEl.querySelector('.wingB');
    const sparkles = Array.from({ length: 8 }, (_, i) => ({
      el: St.fx.add(`<g opacity="0">${sheet().p(c.cut(c.star(0, 0, 12, 4.5, 4, 0), 0.2, 3), i % 3 ? C.halo : C.star).out(false)}</g>`),
      x: XP.R - 40 + Math.cos(i * 2.4) * c.rr(50, 90), y: 420 + Math.sin(i * 2.4) * c.rr(40, 80), d: i * 0.035,
    }));
    let heat = '';
    for (let i = 0; i < 4; i++) { const x = XP.R - 70 + i * 44, pts = []; for (let y = 0; y <= 220; y += 10) pts.push([x + Math.sin(y / 18 + i) * 7, y]); heat += c.ribbon(pts, 3.2); }
    const heatEl = St.fx.add(`<g opacity="0"><path d="${heat}" fill="${C.sunRay}" opacity=".45"/></g>`);
    const wind = [0, 1, 2, 3, 4, 5].map((i) => {
      const len = c.rr(120, 220), y = 360 + i * 36 + c.rr(-10, 10);
      const pts = c.qbez([0, 0], [len * 0.5, -c.rr(6, 14)], [len, c.rr(-4, 4)], 10);
      return { el: St.fx.add(`<g opacity="0"><path d="${c.ribbon(pts, (u) => Math.sin(u * PI) * 5 + 0.6)}" fill="${C.cream}"/></g>`), y, off: c.rr(0, 1) };
    });

    const CAMX = [[0, camFor(620)], [0.3, camFor(XP.L)], [1.95, camFor(XP.L)], [2.3, camFor(XP.R)]];
    const CAMZ = [[0, 1.12], [0.3, 1.3], [1.0, 1.3], [1.3, 1.22], [1.95, 1.22], [2.3, 1.32], [3.0, 1.32], [3.3, 1.26], [4.0, 1.26], [4.3, 1.34]];
    const CAMY = [[0, 70], [0.3, 90], [1.0, 90], [1.3, 118], [1.95, 118], [2.3, 90], [3.0, 90], [3.3, 124], [4.0, 124], [4.3, 100]];

    return (t, time) => {
      S.cam.x = track(t, CAMX); S.cam.z = track(t, CAMZ); S.cam.y = track(t, CAMY);
      const hot = es(t, 4.05, 4.35) * (1 - es(t, 4.9, 5));
      St.sk2L.fade(hot);
      St.update(time, { hot });

      /* Jesus sows the word: to the left in v19, to the right in v20 */
      const sowL = bump(t, 0.0, 0.3), sowR = bump(t, 2.0, 2.3);
      const jFlip = t < 1.95;
      jesus.set({
        x: XP.J, y: 592, s: 1.1, flip: jFlip,
        armF: 20 + 118 * Math.max(sowL, sowR) + bump(t, 1.05, 1.9) * 60 + Math.sin(time * 0.9) * 3,
        armB: 12 + Math.max(sowL, sowR) * 10, head: -Math.max(sowL, sowR) * 6, lean: Math.max(sowL, sowR) * 5, blink: blinkAt(time),
      });

      /* v19a: the man hears, doesn't understand; the evil one snatches the word */
      const walk = seg(t, 1.1, 1.95);
      const px = lerp(XP.L + 40, XP.L - 260, walk);
      pathMan.set({
        x: px, y: FEET, s: 1.06, flip: walk > 0, walk: walk > 0 && walk < 1 ? -px * 0.085 : undefined, amt: 1.1,
        head: bump(t, 0.3, 0.6) * 10 - 3 - bump(t, 0.62, 0.9) * 8, armF: 6 + bump(t, 0.35, 0.6) * 40, armB: 4, blink: blinkAt(time, 1),
      });
      const open = es(t, 0.24, 0.34) * (1 - es(t, 1.05, 1.2));
      const inHeart = seg(t, 0.3, 0.34) * (1 - seg(t, 0.7, 0.74));
      pathHeart({ open, seed: inHeart, glow: inHeart * 0.9 });
      const fl = seg(t, 0.06, 0.3);
      const [hx, hy] = [XP.L + 40 - 7 * 1.06, FEET - 110 * 1.06];
      {
        const [x, y] = arcAt(ease.out(fl), [XP.J - 40, 400], [hx, hy], 110);
        pose(seedPath, { x, y, s: 1.4, r: (1 - fl) * 200, o: seg(t, 0.05, 0.08) * (1 - seg(t, 0.3, 0.33)) });
      }
      const q = es(t, 0.34, 0.46, ease.back) * (1 - es(t, 0.62, 0.7));
      const [phx, phy] = headAt(XP.L + 40, FEET, 1.06, false);
      pose(puzzled, { x: phx + 18, y: phy - 26, s: q * 0.9, o: q > 0.02 ? 1 : 0 });
      // the crow swoops in from the left and away to the upper right with the word
      const cu = seg(t, 0.5, 0.98);
      const P0 = [XP.L - 420, 170], P2 = [XP.L + 380, 90], PS = [hx, hy - 10];
      const P1 = [2 * PS[0] - 0.5 * (P0[0] + P2[0]), 2 * PS[1] - 0.5 * (P0[1] + P2[1])];
      const bz = (u) => [(1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1]];
      const [cx, cy] = bz(cu);
      const dx = 2 * (1 - cu) * (P1[0] - P0[0]) + 2 * cu * (P2[0] - P1[0]), dy = 2 * (1 - cu) * (P1[1] - P0[1]) + 2 * cu * (P2[1] - P1[1]);
      const ang = clamp(Math.atan2(dy, dx) * 180 / PI, -38, 38);
      const crowOn = seg(t, 0.49, 0.53) * (1 - seg(t, 0.95, 0.99));
      pose(crowEl, { x: cx, y: cy, s: 1.1, r: ang, o: crowOn });
      const flapA = Math.sin(time * 13 + t * 40) * 32;
      pose(crowWF, { x: -4, y: -9, r: flapA });
      pose(crowWB, { x: -4, y: -10, r: flapA * 0.8 });
      // the snatched word rides in its beak
      const snatched = cu >= 0.5 ? 1 : 0;
      if (snatched) {
        const r = ang * PI / 180, bx = 50 * 1.1, by = -11 * 1.1;
        pose(seedPath, { x: cx + bx * Math.cos(r) - by * Math.sin(r), y: cy + bx * Math.sin(r) + by * Math.cos(r), s: 1.2, o: crowOn });
      }
      /* v19b: the seed on the trodden path — the flap lifts on hard-packed layers */
      pose(flapPath, { x: 0, y: FLAPB, sy: 1 - es(t, 1.05, 1.35) * 1.12, oy: FLAPB });

      /* v20: the rocky ground — taken with joy, up at once */
      const land = seg(t, 2.1, 2.34);
      {
        const [x, y] = arcAt(ease.out(land), [XP.J + 40, 400], [XP.R - 58, FEET - 118], 110);
        pose(seedRock, { x, y, s: 1.4, r: (1 - land) * -200, o: seg(t, 2.09, 2.12) * (1 - seg(t, 2.34, 2.37)) });
      }
      const joy = es(t, 2.36, 2.5) * (1 - es(t, 3.0, 3.2));
      const hop = t > 2.36 && t < 2.95 ? Math.abs(Math.sin(((t - 2.36) * PI) / 0.15)) * 12 * (1 - seg(t, 2.36, 2.95)) : 0;
      const sway = es(t, 3.05, 3.3) * (1 - es(t, 4.3, 4.5));
      const fall = es(t, 4.35, 4.62);
      const kn = es(t, 4.56, 4.66);
      rockW.set({
        x: XP.R - 50, y: FEET - hop, s: 1.06, flip: true, o: 1 - kn,
        armF: 8 + joy * 150 + Math.sin(t * 40) * 8 * joy - fall * 4, armB: 6 + joy * 140 + fall * 10,
        head: -joy * 10 + fall * 22, lean: -(Math.sin((t - 3) * PI * 3.2) * 7 * sway + fall * 26), blink: blinkAt(time, 2),
      });
      rockK.set({ x: XP.R - 46, y: FEET, s: 1.06, flip: true, o: kn, armF: 150, armB: 30, head: 24, lean: -8, blink: 1 });
      const rh = { open: es(t, 2.34, 2.46), seed: es(t, 2.34, 2.4) * (1 - es(t, 4.4, 4.65) * 0.7), glow: es(t, 2.34, 2.42) * (1 - es(t, 4.3, 4.6)) * (1 + joy * 0.4), pulse: joy * Math.sin(time * 6) };
      rockHeartW(rh);
      rockHeartK({ ...rh, crack: es(t, 4.55, 4.7) });
      sparkles.forEach((sp) => {
        const k = bump(t, 2.38 + sp.d, 2.95 + sp.d);
        pose(sp.el, { x: sp.x + (sp.x - XP.R) * k * 0.2, y: sp.y - k * 12, s: k * 1.2, r: t * 200 + sp.d * 900, o: k });
      });
      {
        const pop = es(t, 2.42, 2.62, ease.back);
        const wilt = es(t, 4.2, 4.5);
        const rsw = Math.sin((t - 3) * PI * 3.2 + 0.6) * 9 * sway;
        pose(sproutEl, { x: rockX, y: 612, sy: pop, sx: 0.6 + 0.4 * pop, r: rsw + hot * 6 });
        fade(sproutEl.querySelector('.fresh'), 1 - wilt);
        fade(sproutEl.querySelector('.wilt'), wilt);
      }
      /* v21a: no root — the flap lifts and the roots strike the rock */
      pose(flapRock, { x: 0, y: FLAPB, sy: 1 - es(t, 3.02, 3.3) * 1.12, oy: FLAPB });
      const rrv = seg(t, 3.25, 3.65);
      rsRock.forEach((r) => fade(r.el, clamp((rrv - r.o) * 12) * (1 - es(t, 4.4, 4.7) * 0.5)));
      pose(bonk, { x: rockX + 3, y: 646, s: bump(t, 3.45, 3.72) * 1.6, r: t * 90, o: bump(t, 3.45, 3.72) });
      /* v21b: tribulation — heat and wind */
      pose(heatEl, { x: 0, y: 280 + ((t * 120 + (hot > 0 ? time * 20 : 0)) % 30), o: hot * 0.9 });
      const windOn = es(t, 4.1, 4.3) * (1 - es(t, 4.85, 5));
      wind.forEach((w) => {
        const k = ((t * 1.6 + (windOn > 0 ? time * 0.5 : 0) + w.off) % 1);
        pose(w.el, { x: XP.R - 480 + k * 900, y: w.y + Math.sin(k * 6 + w.off * 9) * 8, o: windOn * Math.sin(k * PI) * 0.85 });
      });
    };
  },
};
