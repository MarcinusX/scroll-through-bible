// J 4,23–26 — "The hour is coming, and now is": the day-arc comes down again and its little sun stands at the sixth
// hour — now. True worshipers: soft searchlights from above sweep the hills and find people everywhere lifting their
// hands, each lit as the light passes. "God is spirit": long breaths of wind blow across the whole stage (no figure,
// only moving air). "In spirit and truth": two tags. "I know that Messiah is coming" — in her thought an anointing
// horn and a crown; "He will tell us all things" — a scroll unrolls and fills with light. "I am he, the one who is
// speaking to you": Jesus rises, light breaks out behind Him, and the crown of light comes to rest over Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { wellSet, wellCast, G, NOON, dayArc, hourAt, sunToken, samaritan, tag, thought, oilHorn, lightCrown, glory, say, vis, kf, hanging, swing } from './lib.js';

const AR0 = { x: 850, y: 310, r: 100 };

export default {
  id: 'j4-spirit',
  beats: [
    { v: 23, text: 'Nadchodzi jednak godzina, owszem już jest,' },
    { v: 23, cont: true, text: 'kiedy to prawdziwi czciciele będą oddawać cześć Ojcu w Duchu i prawdzie, a takich to czcicieli chce mieć Ojciec.' },
    { v: 24, text: 'Bóg jest duchem:' },
    { v: 24, cont: true, text: 'potrzeba więc, by czciciele Jego oddawali Mu cześć w Duchu i prawdzie».' },
    { v: 25, text: 'Rzekła do Niego kobieta: «Wiem, że przyjdzie Mesjasz, zwany Chrystusem.' },
    { v: 25, cont: true, text: 'A kiedy On przyjdzie, objawi nam wszystko».' },
    { v: 26 },
  ],
  cam: { x: [-60, 60], y: [-80, 100], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const AR = S.portrait ? { ...AR0, y: 400 } : AR0;     // phone: the day-arc under the sun, not over it
    const SCX = S.portrait ? 812 : 850;                  // phone: the whole scroll, rods and all, inside the frame
    let beamL;
    const W = wellSet(S, {
      skyCols: NOON, sunAt: [830, 140],
      behind: (S) => { beamL = S.layer({ par: 0.3, sh: 0, flat: true }); return S.layer({ par: 0.55, sh: 0, flat: true }); },
    });
    // worshipers on the hills and in the fields
    const spots = [[1250, 556, 0.22, W.midL], [1130, 560, 0.2, W.midL], [300, 600, 0.34, W.fieldL], [640, 598, 0.32, W.fieldL], [1000, 600, 0.34, W.fieldL], [1180, 604, 0.36, W.fieldL], [1400, 602, 0.34, W.fieldL], [470, 604, 0.3, W.fieldL]];
    const wors = spots.map(([x, y, s, L], i) => {
      const g = L.add(`<circle r="150" fill="url(#halo-glow)" opacity="0"/>`);
      const p = S.puppet(L.add(person(c, samaritan(c, i + 30, { white: i % 3 === 0 }))));
      return { x, y, s, i, g, p, flip: x > 800, seed: c.rr(0, 9), at: 1.2 + (i % 4) * 0.12 + Math.floor(i / 4) * 0.06 };
    });
    const beams = [0, 1, 2].map((i) => beamL.add(`<path d="M-30 0L30 0L260 1100L-260 1100Z" fill="#fff4d0" opacity="0"/>`));
    const glowJ = W.behind.add(`<g>${glory(c, 420, 24)}</g>`);

    const K = wellCast(S, W);
    const jStand = S.puppet(W.actL.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.55, sh: 5 });
    // the hour: now
    const arc = fx.add(`<g>${dayArc(c, AR.r, { label: tr('teraz', 'now'), marks: [6] })}</g>`);
    const tok = fx.add(`<g>${sunToken(c, 13)}</g>`);
    // spirit and truth
    const tS = hanging(fx, tag(c, tr('w Duchu', 'in spirit'), { size: 22 }), { x: 700, y: 300, len: 600 });
    const tT = hanging(fx, tag(c, tr('i prawdzie', 'and truth'), { size: 22 }), { x: 1000, y: 300, len: 600 });
    // her thought: the Anointed One, a king
    const crownI = `<g transform="translate(14 0)"><path d="${c.cut([[-18, 8], [-20, -12], [-10, -2], [0, -18], [10, -2], [20, -12], [18, 8]], 0.3, 3)}" fill="${C.sun}"/></g>`;
    const think = fx.add(`<g>${thought(c, `<g transform="translate(-34 12) scale(.6)">${oilHorn(c)}</g>${crownI}`, { w: 110, h: 76 })}</g>`);
    // the scroll that tells all things
    const SW = 520;
    const scroll = hanging(fx, (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-SW / 2, 0, SW, 120), 0.5, 8), C.parchment);
      let ln = '';
      for (let r = 0; r < 6; r++) { let x = -SW / 2 + 24; while (x < SW / 2 - 30) { const l = c.rr(14, 46); ln += c.ribbon([[x, 20 + r * 16], [Math.min(x + l, SW / 2 - 24), 20 + r * 16 + c.rr(-1, 1)]], 2); x += l + 8; } }
      s.x(ln, C.inkSoft, 'opacity=".5"');
      return `${s.out()}<rect class="shine" x="${-SW / 2}" y="0" width="80" height="120" fill="#fff7dc" opacity="0"/>`;
    })(), { x: SCX, y: 170, len: 600 });
    const sClip = S.id('sc');
    S.defs(`<clipPath id="${sClip}"><rect x="${-SW / 2}" y="-20" width="${SW}" height="160"/></clipPath>`);
    const shine = scroll.querySelector('.shine');
    const rod = fx.add(`<g>${sheet().p(c.cut(c.rect(-10, -4, 20, 136), 0.3, 4), C.wood2).p(c.cut(c.ell(0, -6, 12, 7, 10), 0.3, 3) + c.cut(c.ell(0, 134, 12, 7, 10), 0.3, 3), C.wood).out()}</g>`);
    const rodL = fx.add(`<g>${sheet().p(c.cut(c.rect(-10, -4, 20, 136), 0.3, 4), C.wood2).p(c.cut(c.ell(0, -6, 12, 7, 10), 0.3, 3) + c.cut(c.ell(0, 134, 12, 7, 10), 0.3, 3), C.wood).out()}</g>`);
    const scrollBody = scroll.querySelector('.obj');
    scrollBody.setAttribute('clip-path', `url(#${sClip})`);
    // I am he
    const crown = fx.add(`<g>${lightCrown(c, 40)}</g>`);
    const iam = fx.add(`<g>${say(c, tr('Jestem nim Ja', 'I am he'), { size: 26, side: 1 })}</g>`);
    // the wind (slides on the compositor)
    const windL = S.layer({ par: 0.6, sh: 0, flat: true, pad: 500 });
    let wd = '';
    for (let i = 0; i < 6; i++) {
      const y = 180 + i * 90 + c.rr(-20, 20), pts = [];
      for (let x = -1400; x <= 3000; x += 40) pts.push([x, y + Math.sin(x / 180 + i) * 24]);
      wd += c.ribbon(pts, (u) => 4 + 5 * Math.abs(Math.sin(u * 22 + i)));
    }
    windL.add(`<path d="${wd}" fill="#fffaf0" opacity=".75"/>`);

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 830, sunY: 140, glow: 0.8 + es(t, 6.05, 6.4) * 0.3 });
      /* v23a — the hour: now */
      const ak = es(t, -0.2, 0.3, ease.out) * (1 - es(t, 0.95, 1.3, ease.in));
      const ay = AR.y - (1 - ak) * 700;
      vis(arc, { x: AR.x, y: ay, o: ak > 0.01 ? 1 : 0 });
      const [hx, hy] = hourAt(AR.r, 6);
      vis(tok, { x: AR.x + hx, y: ay + hy, s: 1 + bump(t, 0.4, 0.8) * 0.6, r: T * 10, o: ak > 0.01 ? 1 : 0 });
      /* v23b — the Father seeks worshipers: lights sweep and find them */
      const sweep = seg(t, 1.05, 2.0);
      beams.forEach((b, i) => {
        const a = lerp(-40 + i * 30, 10 + i * 30, sweep) * (i % 2 ? -1 : 1);
        vis(b, { x: 400 + i * 400, y: -40, r: a, o: bump(t, 1.05, 2.05) * 0.35 });
      });
      wors.forEach((w) => {
        const up = es(t, 1.1 + w.i * 0.03, 1.3 + w.i * 0.03);
        const lit = es(t, w.at, w.at + 0.2) * (1 - es(t, 5.9, 6.2) * 0.5);
        w.p.set({ x: w.x, y: w.y, s: w.s, flip: w.flip, o: up, armB: 20 + lit * 130, armF: 20 + lit * 60, head: -lit * 8, blink: blinkAt(T, w.seed) });
        vis(w.g, { x: w.x, y: w.y - 100 * w.s, s: w.s * 2.2, o: lit * 0.8 });
      });
      /* v24a — God is spirit: the wind */
      const wind = es(t, 2.05, 2.3) * (1 - es(t, 3.6, 4.0));
      windL.shift(((T * 90 + t * 400) % 360) - 180, 0);
      windL.fade(wind * 0.8);
      /* v24b — in spirit and truth */
      const tk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.9, 4.2, ease.in));
      swing(tS, 700, 300 - (1 - tk) * 600, tk > 0.001 ? T : 0, 2, 0.9, 1);
      fade(tS, tk > 0.001 ? 1 : 0);
      swing(tT, 1000, 300 - (1 - tk) * 600, tk > 0.001 ? T : 0, 2, 0.9, 2);
      fade(tT, tk > 0.001 ? 1 : 0);
      /* v25a — her hope */
      const [whx, why] = K.wHead();
      const th = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.9, 5.05));
      vis(think, { x: whx + 8, y: why - 18, s: th, o: th > 0.01 ? 1 : 0 });
      /* v25b — a scroll unrolls: He will tell us all things */
      const sk = es(t, 5.0, 5.2, ease.out) * (1 - es(t, 5.9, 6.1, ease.in));
      const un = es(t, 5.15, 5.6);
      const sy = 170 - (1 - sk) * 600;
      pose(scroll, { x: SCX, y: sy });
      fade(scroll, sk > 0.01 ? 1 : 0);
      const half = 10 + un * (SW / 2);
      pose(scrollBody, { sx: un * 0.98 + 0.02 });
      vis(rod, { x: SCX + half, y: sy, o: sk > 0.01 ? 1 : 0 });
      vis(rodL, { x: SCX - half, y: sy, o: sk > 0.01 ? 1 : 0 });
      const sh = seg(t, 5.55, 5.95);
      pose(shine, { x: sh * (SW - 80) });
      fade(shine, bump(t, 5.55, 5.95) * 0.8);
      /* v26 — I am he */
      const rise = es(t, 6.05, 6.14);
      const glow = es(t, 6.1, 6.45);
      const [jhx, jhy] = K.head();
      jStand.set({ x: G.jx + 14, y: G.floor, s: 1.05, o: rise, armF: 30 + glow * 40, armB: 20 + glow * 60, head: -2, blink: blinkAt(T) });
      vis(glowJ, { x: G.jx + 16, y: G.floor - 150, s: 0.5 + glow * 0.6, r: T * 3, o: glow });
      const ck = es(t, 6.2, 6.5, ease.out);
      vis(crown, { x: G.jx + 18, y: lerp(260, G.floor - 232, ck) + Math.sin(T * 1.5) * 3, s: 0.5 + ck * 0.3, o: ck });
      const ik = es(t, 6.25, 6.45, ease.back);
      vis(iam, { x: G.jx + 40, y: G.floor - 216, s: ik, o: ik > 0.01 ? 1 : 0 });
      const awe = es(t, 6.2, 6.45);
      K.j.set({ x: G.jx, y: K.JY, s: K.JS, o: 1 - rise, armF: 22 + bump(t, 0.1, 0.9) * 40 + bump(t, 1.05, 2) * 60 + bump(t, 3.05, 3.95) * 40, armB: 12 + bump(t, 1.05, 2) * 50, head: -2, blink: blinkAt(T) });
      K.w.p.set({
        x: G.wx + awe * 16, y: G.floor, s: K.JS, flip: true,
        armF: 26 + bump(t, 3.1, 3.95) * 60 + bump(t, 4.05, 4.95) * 30 + awe * 90, armB: 16 + bump(t, 3.1, 3.95) * 120 + awe * 40,
        head: -bump(t, 4.05, 4.95) * 16 + bump(t, 2.1, 2.9) * -6 - awe * 6, lean: -awe * 5, blink: awe > 0.5 ? 0 : blinkAt(T, 3),
      });
      pose(K.w.jar, { x: K.RIM.x, y: K.RIM.y, s: 0.78 });
      pose(K.bk, { x: G.well + 96, y: G.floor + 2, s: 1.1 });

      S.cam.x = kf(t, [[-0.5, 20], [0.5, 20], [1.1, 0], [2.0, 0], [4.0, 20], [5.0, 20], [6.05, 0], [6.5, -20]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.5, -20], [1.1, -40], [2.0, -40], [3.0, 0], [4.0, 40], [5.0, -20], [6.05, 0], [6.5, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.5, 1.1], [1.1, 1.0], [2.0, 1.0], [3.0, 1.06], [4.0, 1.2], [5.0, 1.08], [6.05, 1.1], [6.5, 1.3]]);
    };
  },
};
