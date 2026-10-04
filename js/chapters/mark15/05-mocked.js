// Mk 15,16–20 — the King mocked. In the courtyard a great linen screen is lit from behind; the whole cohort
// gathers on it as shadows. Jesus stands before it, quiet and upright, in full colour: the purple cloak comes
// down on its strings, a crown of thorns is woven on the screen and laid on His head. The shadows salute,
// raise a reed, spit (grey flecks that never reach Him), kneel in mock homage — the shadows do it all; His
// dignity stays untouched. The purple is lifted away, His own clothes return, and they lead Him out.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, addToHead, soldier, soldierSil, thornWreath, purpleCloak, PURPLE, taunt, column, hanging, swing, voiceRings, INK, SKIES, PI } from './lib.js';

const JX = 800, JY = 690, JS = 1.04;
const SX0 = 540, SX1 = 1060, SY0 = 168, SY1 = 562, FL = 548;

export default {
  id: 'm15-mocked',
  beats: [
    { v: 16 },
    { v: 17, text: 'Ubrali Go w purpurę' },
    { v: 17, cont: true, text: 'i uplótłszy wieniec z ciernia włożyli Mu na głowę.' },
    { v: 18 },
    { v: 19, text: 'Przy tym bili Go trzciną po głowie, pluli na Niego' },
    { v: 19, cont: true, text: 'i przyklękając oddawali Mu hołd.' },
    { v: 20, text: 'A gdy Go wyszydzili, zdjęli z Niego purpurę i włożyli na Niego własne Jego szaty.' },
    { v: 20, cont: true, text: 'Następnie wyprowadzili Go, aby Go ukrzyżować.' },
  ],
  cam: { x: [-60, 140], y: [-40, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKIES.storm);

    /* ---------- the courtyard ---------- */
    const wallL = S.layer({ par: 0.25, sh: 4 });
    const W = sheet();
    W.p(c.cut([[-900, 110], [2500, 110], [2500, 600], [-900, 600]], 0.6, 20) + c.hole(c.rect(SX0 - 6, SY0 - 6, SX1 - SX0 + 12, SY1 - SY0 + 12), 0.3, 8), mix(C.stone, C.plaster2, 0.4));
    let blocks = '';
    for (let y = 130; y < 600; y += 40) for (let x = -900 + ((y / 40) % 2) * 50; x < 2500; x += 100) if (x + 96 < SX0 - 10 || x > SX1 + 10 || y + 36 < SY0 - 10 || y > SY1 + 10) blocks += c.cut(c.rect(x + 3, y + 3, 92, 34), 0.4, 8);
    W.x(blocks, shade(C.stone, 0.12), 'opacity=".5"');
    W.p(c.cut([[-900, 96], [2500, 96], [2500, 124], [-900, 124]], 0.5, 12), C.stone2);
    wallL.add(W.out());
    const gid = S.id('scr');
    S.defs(`<radialGradient id="${gid}" cx="50%" cy="58%" r="70%"><stop offset="0" stop-color="#fbe6b8"/><stop offset=".7" stop-color="#f0cf96"/><stop offset="1" stop-color="#d7a56b"/></radialGradient>`);
    const scrL = S.layer({ par: 0.25, sh: 2, flat: true });
    scrL.add(`<rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}" fill="url(#${gid})"/><path class="grain" d="M${SX0} ${SY0}H${SX1}V${SY1}H${SX0}Z"/>`);
    const cid = S.id('clip');
    S.defs(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}"/></clipPath>`);
    const shL = S.layer({ par: 0.25, sh: 1, flat: true });
    const clipAdd = (inner) => shL.add(`<g clip-path="url(#${cid})"><g>${inner}</g></g>`).firstElementChild;
    // the cohort as shadows: standing and kneeling cut-outs for each
    const XS = [590, 655, 720, 880, 945, 1010];
    const cohort = XS.map((x, i) => {
      const st = clipAdd(soldierSil(c, i, { spear: i % 2 === 0 }));
      const kn = clipAdd(soldierSil(c, i, { pose: 'kneel', spear: false }));
      return { x, i, st: S.puppet(st.querySelector('.fig')), stG: st, kn: S.puppet(kn.querySelector('.fig')), knG: kn, flip: x > JX, seed: c.rr(0, 9) };
    });
    const horn = clipAdd(soldierSil(c, 3, { spear: false }));
    const hornP = S.puppet(horn.querySelector('.fig'));
    const hornRings = voiceRings(shL, c, { n: 3, color: INK, r: 18, w: 3, both: false });
    const wreathSh = clipAdd(`<path d="${c.ribbon(c.arc(0, 0, 26, 26, 0, PI * 2, 30), 4)}" fill="${INK}"/>${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * PI * 2; return `<path d="${c.poly([[Math.cos(a) * 24, Math.sin(a) * 24], [Math.cos(a + 0.1) * 36, Math.sin(a + 0.1) * 36], [Math.cos(a + 0.2) * 24, Math.sin(a + 0.2) * 24]])}" fill="${INK}"/>`; }).join('')}`);
    const reed = clipAdd(`<path d="${c.ribbon([[0, 0], [0, -150]], 2.6)}" fill="${INK}"/><path d="${c.cut(c.ell(0, -154, 5, 9, 8), 0.3, 3)}" fill="${INK}"/>`);
    const dimScr = shL.add(`<rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}" fill="#2a2030" opacity="0"/>`);
    // posts and columns framing the screen
    const frameL = S.layer({ par: 0.27, sh: 5 });
    frameL.add(sheet().p(c.cut(c.rect(SX0 - 16, SY0 - 18, SX1 - SX0 + 32, 16), 0.4, 8) + c.cut(c.rect(SX0 - 16, SY0 - 18, 14, SY1 - SY0 + 36), 0.4, 8) + c.cut(c.rect(SX1 + 2, SY0 - 18, 14, SY1 - SY0 + 36), 0.4, 8), C.wood2).out());
    frameL.add(column(c, 420, 600, 490, 50, C.stone) + column(c, 1180, 600, 490, 50, C.stone) + column(c, 250, 600, 490, 50, C.stone) + column(c, 1350, 600, 490, 50, C.stone));
    const floorL = S.layer({ par: 0.35, sh: 2 });
    const F = sheet().p(c.cut([[-900, 598], [2500, 598], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.stone, C.sand, 0.35));
    let lines = '';
    [640, 700, 780, 880].forEach((y) => { lines += c.ribbon([[-900, y], [2500, y]], 1.2); });
    F.x(lines, shade(C.stone2, -0.12), 'opacity=".45"');
    floorL.add(F.out());

    /* ---------- Jesus and the two soldiers who bring Him ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    const shine = P.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);
    const solA = S.puppet(P.add(soldier(c, 0)));
    const solB = S.puppet(P.add(soldier(c, 1)));
    const wr = thornWreath(c);
    const jOwn = S.puppet(P.add(person(c, CAST.jesus)));
    const jPur = S.puppet(P.add(person(c, { ...CAST.jesus, mantle: PURPLE })));
    const jPurC = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE }), wr)));
    const jPurCq = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE, eyes: 'closed' }), wr)));
    const jOwnC = S.puppet(P.add(addToHead(person(c, CAST.jesus), wr)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const cloak = hanging(fx, purpleCloak(c), { x: JX, y: 300, len: 900 });
    const crownF = fx.add(`<g>${wr}</g>`);
    const hail = fx.add(`<g>${taunt(c, tr('Witaj, Królu Żydowski!', 'Hail, King of the Jews!'), { size: 19, side: 1 })}</g>`);
    const flecks = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g><path d="${c.cut(c.blob(0, 0, 4, 3, 7, 0.3), 0.3, 2)}" fill="#8f8c96"/></g>`), from: XS[[0, 5, 1, 4, 2, 3][i]], dy: c.rr(-20, 20) }));
    const fg = S.layer({ par: 0.95, sh: 7 });
    fg.add(column(c, -80, 1100, 1300, 90, shade(C.stone, -0.04)) + column(c, 1680, 1100, 1300, 90, shade(C.stone, -0.04)));

    return (t, time) => {
      const T = time;
      sk.blend(SKIES.storm, SKIES.grey, es(t, 0, 8) * 0.5);

      /* v16 — led in; the cohort is called together on the screen */
      const jK = [[-0.3, [420, JY]], [0.6, [JX, JY]], [7.1, [JX, JY]], [7.8, [1010, JY]]];
      const [jx, jy] = kf(t, jK);
      const jw = moving(t, jK) ? jx * 0.05 : undefined;
      const AX = S.portrait ? 1045 : 1150, BX = S.portrait ? 520 : 450;   // phone: the two guards stand inside the frame
      const aK = [[-0.3, [560, JY + 4]], [0.6, [960, JY + 4]], [0.9, [AX, JY + 6]], [6.9, [AX, JY + 6]], [7.2, [1000, JY + 4]], [7.8, [1200, JY + 4]]];
      const bK = [[-0.3, [260, JY + 6]], [0.6, [640, JY + 6]], [0.9, [BX, JY + 8]], [6.9, [BX, JY + 8]], [7.2, [620, JY + 6]], [7.8, [840, JY + 6]]];
      const [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      solA.set({ x: ax, y: ay, s: 1, flip: (t > 0.6 && t < 7.0), walk: moving(t, aK) ? ax * 0.06 : undefined, armF: 34, armB: 10 + bump(t, 7.0, 7.3) * 40, blink: blinkAt(T, 3) });
      solB.set({ x: bx, y: by, s: 1, flip: t > 0.6 && t < 7.0, walk: moving(t, bK) ? bx * 0.06 : undefined, armF: 34, armB: 10 + bump(t, 7.0, 7.3) * 40, blink: blinkAt(T, 4) });
      hornP.set({ x: 1020, y: FL, s: 0.9, flip: true, armF: 150 * bump(t, 0.05, 0.8) + 20, armB: 110 * bump(t, 0.05, 0.8), o: bump(t, -0.1, 0.9) });
      hornRings(972, FL - 170, bump(t, 0.1, 0.8), T, { dir: -1, spread: 2 });

      const kneel = es(t, 5.05, 5.15) * (1 - es(t, 5.9, 6.0));
      const salute = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const lightsOut = es(t, 7.05, 7.5);
      cohort.forEach((m) => {
        const inK = es(t, 0.2 + m.i * 0.08, 0.5 + m.i * 0.08);
        const x = lerp(m.x < JX ? SX0 - 60 : SX1 + 60, m.x, inK);
        const drape = m.i === 2 || m.i === 3 ? bump(t, 1.05, 1.75) : 0;
        const weave = m.i === 2 ? bump(t, 1.9, 2.4) : 0;
        const strike = m.i === 3 ? bump(t, 4.2, 4.95) : 0;
        const spit = (m.i === 1 || m.i === 4) ? bump(t, 4.2, 4.8) : 0;
        m.st.set({ x, y: FL, s: 0.95, flip: m.flip, walk: inK > 0 && inK < 1 ? x * 0.08 : undefined, armF: 30 + drape * 60 + weave * 70 + salute * 70 + strike * 110 + spit * 30, armB: 10 + salute * 140 + drape * 40, head: -salute * 6 + spit * -10, lean: spit * -6, o: inK > 0.01 ? 1 - kneel : 0 });
        m.kn.set({ x, y: FL, s: 0.95, flip: m.flip, armF: 70 + Math.sin(m.seed) * 10, armB: 60, head: 10, lean: 10, o: kneel });
      });
      fade(dimScr, lightsOut * 0.75);
      scrL.fade(1 - lightsOut * 0.3);

      /* v17a — the purple cloak comes down on its strings */
      const cl = es(t, 1.0, 1.55);
      const off = es(t, 6.05, 6.55);
      const [hx0, hy0] = headAt(jx, jy, JS, false);
      const cloakY = cl < 1 ? lerp(hy0 - 520, hy0 + 18, cl) : lerp(hy0 + 18, hy0 - 520, off);
      pose(cloak, { x: jx - 4, y: cloakY, r: Math.sin(T * 0.9) * 1.4 * (1 - cl + off), o: (cl > 0.001 && cl < 0.97) || (off > 0.03 && off < 0.999) ? 1 : 0 });
      pose(cloak.querySelector('.obj'), { s: 0.95, o: cl > 0.97 && off < 0.03 ? 0 : 1 });
      const purple = es(t, 1.5, 1.57) * (1 - es(t, 6.1, 6.17));
      /* v17b — a crown of thorns is woven (on the screen) and laid on His head */
      const wv = es(t, 1.95, 2.25);
      pose(wreathSh, { x: 720 + 20, y: 330, s: wv, r: T * 20 * wv, o: wv > 0.02 ? 1 - es(t, 2.3, 2.45) : 0 });
      const lay = es(t, 2.2, 2.55);
      const crowned = es(t, 2.54, 2.6);
      pose(crownF, { x: hx0, y: lerp(hy0 - 300, hy0 - 13 * JS, lay), s: JS, o: lay > 0.01 && crowned < 1 ? 1 : 0 });

      /* Jesus: upright and still, whatever the shadows do */
      const bow = bump(t, 4.35, 4.95);
      const quiet = es(t, 4.45, 4.5) * (1 - es(t, 4.9, 4.95));
      const common = { x: jx, y: jy, s: JS, flip: jx > 900, walk: jw, amt: 0.7, armF: 8 + Math.sin(T * 0.7) * 1.5, armB: 4, head: 2 + bow * 12, blink: blinkAt(T) };
      jOwn.set({ ...common, o: (1 - purple) * (1 - crowned) });
      jPur.set({ ...common, o: purple * (1 - crowned) });
      jPurC.set({ ...common, o: purple * crowned * (1 - quiet) });
      jPurCq.set({ ...common, o: purple * crowned * quiet });
      jOwnC.set({ ...common, o: (1 - purple) * crowned });
      pose(shine, { x: jx + 4, y: jy - 150, s: 0.7 + bump(t, 4.9, 6.2) * 0.6, o: 0.25 + bump(t, 4.9, 6.2) * 0.6 });

      /* v18 — "Hail, King of the Jews!" */
      const hk = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(hail, { x: 590, y: 300, s: hk, o: hk > 0.02 ? 1 : 0, r: -3 });
      /* v19a — the reed, and grey flecks that never reach Him */
      const m3 = cohort[3];
      const sb = bump(t, 4.2, 4.95);
      const rA = 30 + sb * 110;
      const [rx, ry] = hand(m3.x, FL, 0.95, true, rA);
      const [thx, thy] = headAt(jx, jy, JS, false);
      const aim = (Math.atan2(thy - 30 - ry, thx - rx) * 180) / PI + 90;
      pose(reed, { x: rx, y: ry, r: lerp(-10, aim, sb), o: es(t, 3.95, 4.1) * (1 - es(t, 4.8, 4.95)) });
      flecks.forEach((f) => {
        const k = seg(t, 4.2 + f.i * 0.05, 4.65 + f.i * 0.05);
        const x0 = f.from + (f.from < JX ? 40 : -40), y0 = FL - 170;
        pose(f.el, { x: lerp(x0, lerp(x0, JX, 0.55), k), y: y0 + f.dy + k * k * 140, o: k > 0 && k < 1 ? 1 - k : 0 });
      });

      S.cam.x = es(t, 7.1, 7.8) * 120;
      S.cam.y = 10 + es(t, 0.6, 1.2) * 20 - es(t, 2.9, 3.4) * 30 + es(t, 5.9, 6.4) * 30;
      S.cam.z = 1.02 + es(t, 0.8, 1.3) * 0.06 - es(t, 2.9, 3.4) * 0.05 + es(t, 5.9, 6.4) * 0.06;
    };
  },
};
