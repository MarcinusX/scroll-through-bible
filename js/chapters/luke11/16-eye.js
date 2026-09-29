// Łk 11,34–36 — on a bare stage stand two great paper lanterns in the shape of people, dark cut-outs whose bodies are
// thin parchment. "The lamp of the body is your eye": the eyes of both open, and in the left one's eye a little flame
// is lit. "When your eye is sound, your whole body is full of light": the light pours in through its eye and fills it
// from head to foot, and it glows like a lantern. "But when it is bad, your body is full of darkness": a grey film
// clouds the right one's eye and darkness pours into it the same way. "See to it, then, that the light in you is not
// darkness": in the heart of each a flame shows — a bright one in the left, and in the right a flame cut from black
// paper, a light that is darkness, a question hanging over it. "If your whole body is full of light, with no part dark,
// it will be wholly bright, as when a lamp lights you with its rays": a lamp on its stand beside the bright figure
// sends its rays over it, it shines all through — and the dark one sinks back into the shadow.
import { C, pose, lerp, sky, sheet, shade, mix, attr } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { lampstand, clayLamp, qMark, rayBurst, PI } from './lib.js';

const BOT = 770, HR = 56;
const FIG = [{ x: 650, flip: 1 }, { x: 990, flip: -1 }];
const HY = 300;

/** the outline of a standing person in profile (head centre hx, hy; facing dir) */
function bodyPts(c, hx, hy, dir) {
  const r = HR, pts = [];
  const X = (dx) => hx + dx * dir;
  pts.push(...c.arc(hx, hy, r, r, PI * 0.62, PI * 1.9, 24).map(([x, y]) => [hx + (x - hx) * dir, y]));
  pts.push([X(r * 0.98), hy - 6], [X(r + 10), hy + 8], [X(r * 0.94), hy + 14], [X(r * 0.82), hy + 34]);
  pts.push([X(22), hy + 62], [X(28), hy + 84], [X(96), hy + 112], [X(120), hy + 176], [X(120), hy + 264], [X(136), BOT], [X(-136), BOT], [X(-120), hy + 264], [X(-122), hy + 168], [X(-94), hy + 108], [X(-28), hy + 82], [X(-24), hy + 60]);
  return dir < 0 ? pts.reverse() : pts;
}
function eyeCut(c, r = 24) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, 0, r, r * 0.62, PI, 2 * PI, 10), ...c.arc(0, 0, r, r * 0.62, 0, PI, 10)], 0.3, 4), C.cream);
  s.x(c.poly(c.circ(0, 0, r * 0.42, 12)), C.teal2);
  s.x(c.poly(c.circ(0, 0, r * 0.2, 10)), C.ink);
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.66, PI, 2 * PI, 10), 1.6), C.inkSoft);
  return s.out();
}
const flameM = (h = 24, col = C.lampFlame, inner = '#fff4d2') => `<path d="M0 ${h * 0.25}C${-h * 0.33} 0 ${-h * 0.3} ${-h * 0.5} 0 ${-h}C${h * 0.3} ${-h * 0.5} ${h * 0.33} 0 0 ${h * 0.25}Z" fill="${col}"/><path d="M0 ${h * 0.12}C${-h * 0.12} ${-h * 0.04} ${-h * 0.12} ${-h * 0.25} 0 ${-h * 0.5}C${h * 0.12} ${-h * 0.25} ${h * 0.12} ${-h * 0.04} 0 ${h * 0.12}Z" fill="${inner}"/>`;

export default {
  id: 'lk11-eye',
  enter: 'fly',
  beats: [
    { v: 34, text: 'Światłem ciała jest twoje oko.' },
    { v: 34, cont: true, text: 'Jeśli twoje oko jest zdrowe, całe twoje ciało będzie w świetle.' },
    { v: 34, cont: true, text: 'Lecz jeśli jest chore, ciało twoje będzie również w ciemności.' },
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-60, 20], y: [-40, 40], z: [0.98, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#d9cdb8', '#efe2c8', '#f6ead3']);
    const back = S.layer({ par: 0.1, sh: 2 });
    const bs = sheet();
    for (let i = 0; i < 9; i++) bs.p(c.cut([[-900 + i * 420, -900], [-700 + i * 420, -900], [-680 + i * 420, 780], [-900 + i * 420, 780]], 1, 30), i % 2 ? mix(C.parchment, C.dawn, 0.3) : mix(C.parchment, C.sand, 0.3));
    back.add(bs.out());
    const shadeL = S.layer({ par: 0.1, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2338" opacity=".35"/>`);
    shadeL.fade(0);
    const floor = S.layer({ par: 0.3, sh: 3 });
    floor.add(sheet().p(c.cut([[-1100, BOT - 10], [2700, BOT - 10], [2700, 1900], [-1100, 1900]], 0.5, 20), mix(C.wood3, C.sand, 0.4)).x(c.ribbon([[-1100, BOT + 20], [2700, BOT + 20]], 2) + c.ribbon([[-1100, BOT + 70], [2700, BOT + 70]], 2), shade(C.wood3, -0.2), 'opacity=".4"').out());

    /* the glow behind the bright one, the lampstand and its rays */
    const glowL = S.layer({ par: 0.38, sh: 0, flat: true });
    const halo = glowL.add(`<g opacity="0"><circle r="440" fill="url(#warm-glow)"/></g>`);
    const lampRays = glowL.add(`<g opacity="0">${rayBurst(c, { n: 18, r0: 30, r1: 260, spread: 0.06, color: '#fff3cf', o: 0.5 })}</g>`);
    const stand = S.layer({ par: 0.4, sh: 5 });
    const standEl = stand.add(`<g opacity="0">${lampstand(c, 190)}<g transform="translate(-34 -196)">${clayLamp(c)}</g></g>`);

    /* the two lantern figures */
    const fig = S.layer({ par: 0.4, sh: 6 });
    const paper = mix(C.night, C.plumRobe, 0.3);
    const litId = S.id('litg'), darkId = S.id('dkg');
    S.defs(`<radialGradient id="${litId}" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#fff6d8"/><stop offset=".6" stop-color="#ffe3a1"/><stop offset="1" stop-color="#f3c16b"/></radialGradient>`);
    S.defs(`<linearGradient id="${darkId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1830"/><stop offset="1" stop-color="#2d2540"/></linearGradient>`);
    const F = FIG.map((f, i) => {
      const P = bodyPts(c, f.x, HY, f.flip);
      fig.add(`<g>${sheet().p(c.cut(P, 0.6, 8), mix(paper, C.parchment, 0.45)).out()}</g>`);
      const cid = S.id('clip' + i);
      const fillEl = fig.add(`<g><clipPath id="${cid}"><rect x="${f.x - 300}" y="${HY - HR - 10}" width="600" height="0"/></clipPath><path d="${c.poly(P)}" fill="url(#${i ? darkId : litId})" clip-path="url(#${cid})"/></g>`);
      let ribs = '';
      for (let y = HY + 200; y < BOT - 20; y += 64) ribs += c.ribbon([[f.x - 124, y], [f.x + 124, y + 4]], 3);
      fig.add(`<g>${sheet().x(ribs, mix(C.wood2, C.soilDark, 0.3), 'opacity=".45"').out()}<path d="${c.poly(P)}" fill="none" stroke="${mix(C.soilDark, C.plumRobe, 0.3)}" stroke-width="6" stroke-linejoin="round"/></g>`);
      return { ...f, i, rect: fillEl.querySelector('rect'), ex: f.x + 28 * f.flip, ey: HY - 6 };
    });
    const eyeL = S.layer({ par: 0.4, sh: 4 });
    const eyes = F.map((f) => eyeL.add(`<g opacity="0">${eyeCut(c, 22)}</g>`));
    const eyeFlame = eyeL.add(`<g opacity="0"><circle r="34" fill="url(#warm-glow)"/>${flameM(22)}</g>`);
    const film = eyeL.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 23, 15, 18), 0.8, 4)}" fill="${mix(C.storm, C.stone2, 0.4)}" opacity=".95"/></g>`);
    const heartLit = eyeL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/>${flameM(40)}</g>`);
    const heartDark = eyeL.add(`<g opacity="0">${flameM(40, '#0e0c18', '#3a3450')}</g>`);
    const qm = eyeL.add(`<g opacity="0">${qMark(c, 60, C.cream)}</g>`);

    return (t, time) => {
      const T = time;
      /* v34a — the eyes open; in the left one a flame is lit */
      const open = es(t, 0.05, 0.3, ease.back);
      const bl = T ? (1 - (Math.sin(T * 1.3) > 0.985 ? 0.9 : 0)) : 1;
      eyes.forEach((e, i) => pose(e, { x: F[i].ex, y: F[i].ey, sx: F[i].flip, sy: Math.max(0.06, open * bl), o: open > 0.02 ? 1 : 0 }));
      const fk = es(t, 0.35, 0.6, ease.back);
      pose(eyeFlame, { x: F[0].ex, y: F[0].ey + 4, s: fk * (1 + (T ? Math.sin(T * 7) * 0.06 : 0)), o: fk > 0.02 ? 0.95 : 0 });

      /* v34b — light fills the left one; v34c — darkness fills the right one */
      const fill = es(t, 1.05, 1.7);
      attr(F[0].rect, 'height', lerp(0, BOT - HY + HR + 30, fill));
      pose(halo, { x: F[0].x, y: HY + 200, s: 0.6 + fill * 0.3 + es(t, 4.1, 4.5) * 0.3, o: fill * 0.7 + es(t, 4.1, 4.5) * 0.3 });
      const fl = es(t, 2.05, 2.25);
      pose(film, { x: F[1].ex, y: F[1].ey, sx: fl, o: fl > 0.02 ? 1 : 0 });
      const dark = es(t, 2.2, 2.85);
      attr(F[1].rect, 'height', lerp(0, BOT - HY + HR + 30, dark));

      /* v35 — the light in you: a bright flame, and a flame that is darkness */
      const hk = es(t, 3.05, 3.25, ease.back);
      pose(heartLit, { x: F[0].x, y: HY + 150, s: hk * (1 + (T ? Math.sin(T * 6) * 0.05 : 0)), o: hk > 0.02 ? 1 : 0 });
      const dk = es(t, 3.15, 3.35, ease.back);
      pose(heartDark, { x: F[1].x, y: HY + 150, s: dk, o: dk > 0.02 ? 1 : 0 });
      const qk = es(t, 3.3, 3.45, ease.back) * (1 - es(t, 4.0, 4.1));
      pose(qm, { x: F[1].x + 10, y: HY + 60, s: qk, r: T ? Math.sin(T * 1.5) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      /* v36 — wholly bright, as when a lamp shines on you; the dark one sinks into shadow */
      const sk = es(t, 4.05, 4.3);
      pose(standEl, { x: 450, y: BOT - 2, o: sk });
      pose(lampRays, { x: 450, y: BOT - 212, s: 0.5 + sk * 0.6, r: T * 3, o: sk * 0.9 });
      shadeL.fade(es(t, 4.2, 4.5));

      S.cam.x = kf2(t, [[0, 40], [3.9, 40], [4.3, 0]]);
      S.cam.z = kf2(t, [[0, 1.0], [3.9, 1.0], [4.3, 1.04]]);
      S.cam.y = kf2(t, [[0, 10], [3.9, 10], [4.3, 20]]);
    };
  },
};
import { kf as kf2 } from './lib.js';
