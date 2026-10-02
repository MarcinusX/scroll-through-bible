// Mt 27,27–31 — the King mocked, as shadow-play (Mark 15's courtyard and lit screen). The whole cohort gathers
// on the screen as shadows; Jesus stands before it, quiet and upright, in full colour. His own rose mantle is
// lifted away on its strings and the scarlet cloak comes down; a crown of thorns is woven on the screen and laid
// on His head, and a reed is put into His right hand. The shadows kneel — "Hail, King of the Jews!" — spit (grey
// flecks that never reach Him), take the reed and strike (only shadows swinging on the screen). The scarlet is
// lifted off, His own mantle returns, the light behind the screen goes down, and they lead Him out.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, headAt, hand, addToHead, soldier, soldierSil, thornWreath, purpleCloak, scarletCloak, reedSceptre, SCARLET, taunt, column, hanging, voiceRings, INK, SKIES, tr, PI } from './lib.js';

const JX = 800, JY = 690, JS = 1.04;
const SX0 = 540, SX1 = 1060, SY0 = 168, SY1 = 562, FL = 548;

export default {
  id: 'mt27-cohort',
  beats: [
    { v: 27 },
    { v: 28 },
    { v: 29, text: 'Uplótłszy wieniec z ciernia włożyli Mu na głowę, a do prawej ręki dali Mu trzcinę.' },
    { v: 29, cont: true, text: 'Potem przyklękali przed Nim i szydzili z Niego, mówiąc: «Witaj, Królu Żydowski!»' },
    { v: 30 },
    { v: 31, text: 'A gdy Go wyszydzili, zdjęli z Niego płaszcz, włożyli na Niego własne Jego szaty' },
    { v: 31, cont: true, text: 'i odprowadzili Go na ukrzyżowanie.' },
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
    const XS = [590, 655, 720, 880, 945, 1010];
    const cohort = XS.map((x, i) => {
      const st = clipAdd(soldierSil(c, i, { spear: i % 2 === 0 }));
      const kn = clipAdd(soldierSil(c, i, { pose: 'kneel', spear: false }));
      return { x, i, st: S.puppet(st.querySelector('.fig')), kn: S.puppet(kn.querySelector('.fig')), flip: x > JX, seed: c.rr(0, 9) };
    });
    const horn = clipAdd(soldierSil(c, 3, { spear: false }));
    const hornP = S.puppet(horn.querySelector('.fig'));
    const hornRings = voiceRings(shL, c, { n: 3, color: INK, r: 18, w: 3, both: false });
    const wreathSh = clipAdd(`<path d="${c.ribbon(c.arc(0, 0, 26, 26, 0, PI * 2, 30), 4)}" fill="${INK}"/>${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * PI * 2; return `<path d="${c.poly([[Math.cos(a) * 24, Math.sin(a) * 24], [Math.cos(a + 0.1) * 36, Math.sin(a + 0.1) * 36], [Math.cos(a + 0.2) * 24, Math.sin(a + 0.2) * 24]])}" fill="${INK}"/>`; }).join('')}`);
    const reedSh = clipAdd(`<path d="${c.ribbon([[0, 0], [0, -150]], 2.6)}" fill="${INK}"/><path d="${c.cut(c.ell(0, -154, 5, 9, 8), 0.3, 3)}" fill="${INK}"/>`);
    const dimScr = shL.add(`<rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}" fill="#2a2030" opacity="0"/>`);
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
    const J = (o, crown) => S.puppet(P.add(crown ? addToHead(person(c, { ...CAST.jesus, ...o }), wr) : person(c, { ...CAST.jesus, ...o })));
    const jOwn = J({}, false);
    const jBare = J({ mantle: null }, false);
    const jBareC = J({ mantle: null }, true);
    const jSc = J({ mantle: SCARLET }, false);
    const jScC = J({ mantle: SCARLET }, true);
    const jScR = J({ mantle: SCARLET, holdF: reedSceptre(c, 40) }, true);
    const jScQ = J({ mantle: SCARLET, eyes: 'closed' }, true);
    const jOwnC = J({}, true);
    const fx = S.layer({ par: 0.58, sh: 5 });
    const cloak = hanging(fx, scarletCloak(c), { x: JX, y: -1500, len: 900 });
    const mantle = hanging(fx, purpleCloak(c, C.jesusMantle), { x: JX, y: -1500, len: 900 });
    const crownF = fx.add(`<g>${wr}</g>`);
    const reedF = fx.add(`<g>${reedSceptre(c, 0)}</g>`);
    const hail = fx.add(`<g>${taunt(c, tr('Witaj, Królu Żydowski!', 'Hail, King of the Jews!'), { size: 19, side: 1 })}</g>`);
    const flecks = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g><path d="${c.cut(c.blob(0, 0, 4, 3, 7, 0.3), 0.3, 2)}" fill="#8f8c96"/></g>`), from: XS[[0, 5, 1, 4, 2, 3][i]], dy: c.rr(-20, 20) }));
    const fg = S.layer({ par: 0.95, sh: 7 });
    fg.add(column(c, -80, 1100, 1300, 90, shade(C.stone, -0.04)) + column(c, 1680, 1100, 1300, 90, shade(C.stone, -0.04)));

    /** a loose cloth on its strings: comes down (k 0→1) onto the shoulders / goes back up */
    const cloth = (el, down, up, hy) => {
      const y = down < 1 ? lerp(hy - 520, hy + 18, down) : lerp(hy + 18, hy - 520, up);
      const vis = (down > 0.001 && down < 0.97) || (up > 0.03 && up < 0.999);
      pose(el, { x: JX - 4, y, r: Math.sin(y * 0.02) * 1.4, o: vis ? 1 : 0 });
      pose(el.querySelector('.obj'), { s: 0.95 });
    };

    return (t, time) => {
      const T = time;
      sk.blend(SKIES.storm, SKIES.grey, es(t, 0, 7) * 0.5);

      /* v27 — led into the praetorium; the whole cohort gathers on the screen */
      const jK = [[-0.3, [420, JY]], [0.6, [JX, JY]], [6.1, [JX, JY]], [6.8, [1010, JY]]];
      const [jx, jy] = kf(t, jK);
      const jw = moving(t, jK) ? jx * 0.05 : undefined;
      const AX = S.portrait ? 1045 : 1150, BX = S.portrait ? 515 : 450;   // phone: both soldiers whole, inside the frame
      const aK = [[-0.3, [560, JY + 4]], [0.6, [960, JY + 4]], [0.9, [AX, JY + 6]], [5.9, [AX, JY + 6]], [6.2, [1000, JY + 4]], [6.8, [1200, JY + 4]]];
      const bK = [[-0.3, [260, JY + 6]], [0.6, [640, JY + 6]], [0.9, [BX, JY + 8]], [5.9, [BX, JY + 8]], [6.2, [620, JY + 6]], [6.8, [840, JY + 6]]];
      const [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      const give = bump(t, 2.6, 2.95);
      solA.set({ x: ax, y: ay, s: 1, flip: t > 0.6 && t < 6.0, walk: moving(t, aK) ? ax * 0.06 : undefined, armF: 34, armB: 10 + give * 70 + bump(t, 6.0, 6.3) * 40, blink: blinkAt(T, 3) });
      solB.set({ x: bx, y: by, s: 1, flip: t > 0.6 && t < 6.0, walk: moving(t, bK) ? bx * 0.06 : undefined, armF: 34, armB: 10 + bump(t, 6.0, 6.3) * 40, blink: blinkAt(T, 4) });
      hornP.set({ x: 1020, y: FL, s: 0.9, flip: true, armF: 150 * bump(t, 0.05, 0.8) + 20, armB: 110 * bump(t, 0.05, 0.8), o: es(t, -0.1, 0.02) * (1 - es(t, 0.6, 0.66)) });
      hornRings(972, FL - 170, bump(t, 0.1, 0.8), T, { dir: -1, spread: 2 });

      const kneel = es(t, 3.05, 3.15) * (1 - es(t, 3.9, 4.0));
      const salute = es(t, 3.3, 3.5) * (1 - es(t, 3.85, 3.95));
      const lightsOut = es(t, 6.05, 6.5);
      cohort.forEach((m) => {
        const inK = es(t, 0.2 + m.i * 0.08, 0.5 + m.i * 0.08);
        const x = lerp(m.x < JX ? SX0 - 60 : SX1 + 60, m.x, inK);
        const strip = (m.i === 2 || m.i === 3) ? bump(t, 1.0, 1.3) : 0;
        const drape = (m.i === 2 || m.i === 3) ? bump(t, 1.25, 1.6) : 0;
        const weave = m.i === 2 ? bump(t, 2.0, 2.35) : 0;
        const strike = m.i === 3 ? bump(t, 4.3, 4.95) : 0;
        const spit = (m.i === 1 || m.i === 4) ? bump(t, 4.05, 4.6) : 0;
        const unrobe = (m.i === 2 || m.i === 3) ? bump(t, 5.0, 5.3) : 0;
        m.st.set({ x, y: FL, s: 0.95, flip: m.flip, walk: inK > 0 && inK < 1 ? x * 0.08 : undefined, armF: 30 + (strip + drape + unrobe) * 90 + weave * 70 + salute * 70 + strike * 110 + spit * 30, armB: 10 + salute * 140 + (strip + drape) * 40, head: -salute * 6 + spit * -10, lean: spit * -6, o: inK > 0.01 ? 1 - kneel : 0 });
        m.kn.set({ x, y: FL, s: 0.95, flip: m.flip, armF: 70 + Math.sin(m.seed) * 10 + salute * 40, armB: 60, head: 10, lean: 10, o: kneel });
      });
      fade(dimScr, lightsOut * 0.75);
      scrL.fade(1 - lightsOut * 0.3);

      /* v28 — stripped: His mantle lifted away; the scarlet cloak comes down */
      const [hx0, hy0] = headAt(jx, jy, JS, false);
      const mOff = es(t, 1.02, 1.3), mOn = es(t, 5.28, 5.56);
      if (t < 3) cloth(mantle, 1, mOff, hy0); else cloth(mantle, mOn, 0, hy0);
      const bare = es(t, 1.04, 1.08);
      const scIn = es(t, 1.28, 1.58), scOut = es(t, 5.02, 5.3);
      if (t < 3) cloth(cloak, scIn, 0, hy0); else cloth(cloak, 1, scOut, hy0);
      const scarlet = es(t, 1.55, 1.59) * (1 - es(t, 5.04, 5.08));
      const own = es(t, 5.54, 5.58);
      /* v29a — the crown of thorns (woven on the screen), the reed in His right hand */
      const wv = es(t, 2.05, 2.3);
      pose(wreathSh, { x: 740, y: 330, s: wv, r: T * 20 * wv, o: wv > 0.02 ? 1 - es(t, 2.35, 2.45) : 0 });
      const lay = es(t, 2.3, 2.55);
      const crowned = es(t, 2.54, 2.6);
      pose(crownF, { x: hx0, y: lerp(hy0 - 300, hy0 - 13 * JS, lay), s: JS, o: lay > 0.01 && crowned < 1 ? 1 : 0 });
      const [sax, say] = hand(ax, ay, 1, true, 10 + give * 70);
      const [jhx, jhy] = hand(jx, jy, JS, false, 40);
      const rk = es(t, 2.62, 2.85);
      const holding = es(t, 2.84, 2.88) * (1 - es(t, 4.1, 4.14));
      pose(reedF, { x: lerp(sax, jhx, rk), y: lerp(say, jhy, rk), r: lerp(-60, 40, rk), s: JS, o: rk > 0.01 && holding < 1 && t < 3 ? 1 : 0 });

      /* Jesus: upright and still, whatever the shadows do */
      const bow = bump(t, 4.35, 4.95);
      const quiet = es(t, 4.45, 4.5) * (1 - es(t, 4.9, 4.95));
      const common = { x: jx, y: jy, s: JS, flip: jx > 900, walk: jw, amt: 0.7, armF: 8, armB: 4, head: 2 + bow * 12, blink: blinkAt(T) };
      const wCrown = crowned;
      jOwn.set({ ...common, o: (1 - bare) * (1 - wCrown) });
      jBare.set({ ...common, o: bare * (1 - scarlet) * (1 - own) * (1 - wCrown) });
      jBareC.set({ ...common, o: bare * (1 - scarlet) * (1 - own) * wCrown });
      jSc.set({ ...common, o: scarlet * (1 - wCrown) });
      jScC.set({ ...common, o: scarlet * wCrown * (1 - holding) * (1 - quiet) });
      jScR.set({ ...common, armF: 40, o: scarlet * wCrown * holding });
      jScQ.set({ ...common, o: scarlet * wCrown * quiet });
      jOwnC.set({ ...common, o: own });
      pose(shine, { x: jx + 4, y: jy - 150, s: 0.7 + bump(t, 4.9, 6.0) * 0.6, o: 0.25 + bump(t, 4.9, 6.0) * 0.6 });

      /* v29b — "Hail, King of the Jews!" */
      const hk = es(t, 3.3, 3.5, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(hail, { x: 590, y: 300, s: hk, o: hk > 0.02 ? 1 : 0, r: -3 });
      /* v30 — spitting (grey flecks that never reach Him); the reed taken, striking (shadows only) */
      const m3 = cohort[3];
      const sb = bump(t, 4.3, 4.95);
      const [rx, ry] = hand(m3.x, FL, 0.95, true, 30 + sb * 110);
      const [thx, thy] = headAt(jx, jy, JS, false);
      const aim = (Math.atan2(thy - 30 - ry, thx - rx) * 180) / PI + 90;
      pose(reedSh, { x: rx, y: ry, r: lerp(-10, aim, sb), o: es(t, 4.1, 4.2) * (1 - es(t, 4.85, 4.95)) });
      flecks.forEach((f) => {
        const k = seg(t, 4.05 + f.i * 0.05, 4.5 + f.i * 0.05);
        const x0 = f.from + (f.from < JX ? 40 : -40), y0 = FL - 170;
        pose(f.el, { x: lerp(x0, lerp(x0, JX, 0.55), k), y: y0 + f.dy + k * k * 140, o: k > 0 && k < 1 ? 1 - k : 0 });
      });

      S.cam.x = es(t, 6.1, 6.8) * 120;
      S.cam.y = 10 + es(t, 0.6, 1.2) * 20 - es(t, 2.9, 3.4) * 30 + es(t, 4.9, 5.4) * 30;
      S.cam.z = 1.02 + es(t, 0.8, 1.3) * 0.06 - es(t, 2.9, 3.4) * 0.05 + es(t, 4.9, 5.4) * 0.06;
    };
  },
};
