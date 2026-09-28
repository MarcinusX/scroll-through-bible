// Mt 6,22–23 — a great paper lantern in the shape of a person stands on a bare stage: a dark cut-out whose body is
// thin parchment. "The lamp of the body is the eye": the eye opens, and a flame is lit in it. "If your eye is sound,
// your whole body will be full of light": the light pours in through the eye and fills the figure from head to foot,
// and it glows like a lantern. "If your eye is evil, your whole body will be full of darkness": a grey film clouds
// the eye and darkness pours in the same way, from the head down, until the lantern is out. "If the light in you is
// darkness, how great the darkness": the darkness spills out of the figure over the whole stage.
import { C, pose, lerp, sky, sheet, shade, mix, attr } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { watchEye, tr, PI } from './lib.js';

const HX = 800, HY = 250, HR = 72;         // the head
const EX = HX + 34, EY = HY - 8;          // the eye
const TOP = HY - HR - 6, BOT = 760;

function bodyPts(c) {
  const pts = [];
  // the head in profile (facing right), with a nose
  pts.push(...c.arc(HX, HY, HR, HR, PI * 0.62, PI * 1.9, 26));
  pts.push([HX + HR * 0.98, HY - 8], [HX + HR + 12, HY + 10], [HX + HR * 0.94, HY + 18], [HX + HR * 0.82, HY + 44]);
  pts.push(...c.arc(HX, HY, HR, HR, PI * 0.26, PI * 0.36, 3));
  // neck, shoulders, robe
  pts.push([HX + 26, HY + 80], [HX + 34, HY + 106], [HX + 120, HY + 140], [HX + 150, HY + 220], [HX + 150, HY + 330], [HX + 170, BOT], [HX - 170, BOT], [HX - 150, HY + 330], [HX - 152, HY + 210], [HX - 118, HY + 136], [HX - 34, HY + 104], [HX - 30, HY + 76]);
  return pts;
}

export default {
  id: 'mt6-eye',
  enter: 'fly',
  beats: [
    { v: 22, text: 'Światłem ciała jest oko.' },
    { v: 22, cont: true, text: 'Jeśli więc twoje oko jest zdrowe, całe twoje ciało będzie w świetle.' },
    { v: 23, text: 'Lecz jeśli twoje oko jest chore, całe twoje ciało będzie w ciemności.' },
    { v: 23, cont: true, text: 'Jeśli więc światło, które jest w tobie, jest ciemnością, jakże wielka to ciemność!' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#d9cdb8', '#efe2c8', '#f6ead3']);
    const back = S.layer({ par: 0.1, sh: 2 });
    const bs = sheet();
    for (let i = 0; i < 9; i++) bs.p(c.cut([[-900 + i * 420, -900], [-700 + i * 420, -900], [-680 + i * 420, 780], [-900 + i * 420, 780]], 1, 30), i % 2 ? mix(C.parchment, C.dawn, 0.3) : mix(C.parchment, C.sand, 0.3));
    back.add(bs.out());
    const floor = S.layer({ par: 0.3, sh: 3 });
    floor.add(sheet().p(c.cut([[-1100, BOT - 10], [2700, BOT - 10], [2700, 1900], [-1100, 1900]], 0.5, 20), mix(C.wood3, C.sand, 0.4)).x(c.ribbon([[-1100, BOT + 20], [2700, BOT + 20]], 2) + c.ribbon([[-1100, BOT + 70], [2700, BOT + 70]], 2), shade(C.wood3, -0.2), 'opacity=".4"').out());

    /* the lantern figure */
    const P = bodyPts(c);
    const fig = S.layer({ par: 0.4, sh: 6 });
    const clipId = S.id('lit');
    const paper = mix(C.night, C.plumRobe, 0.3);
    fig.add(`<g>${sheet().p(c.cut(P, 0.6, 8), paper).out()}</g>`);
    const glowId = S.id('lg');
    S.defs(`<radialGradient id="${glowId}" cx="${HX}" cy="${HY + 200}" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff6d8"/><stop offset=".6" stop-color="#ffe3a1"/><stop offset="1" stop-color="#f3c16b"/></radialGradient>`);
    const lit = fig.add(`<g><clipPath id="${clipId}"><rect x="${HX - 400}" y="${TOP}" width="800" height="0"/></clipPath><path d="${c.poly(P)}" fill="url(#${glowId})" clip-path="url(#${clipId})"/></g>`);
    const litRect = lit.querySelector('rect');
    // the ribs of the lantern and the dark outline
    const rib = sheet();
    let ribs = '';
    for (let y = HY + 230; y < BOT - 20; y += 70) ribs += c.ribbon([[HX - 150, y], [HX + 150, y + 4]], 3);
    rib.x(ribs, mix(C.wood2, C.soilDark, 0.3), 'opacity=".45"');
    fig.add(`<g>${rib.out()}<path d="${c.poly(P)}" fill="none" stroke="${mix(C.soilDark, C.plumRobe, 0.3)}" stroke-width="7" stroke-linejoin="round"/></g>`);
    const halo = fig.add(`<circle r="520" fill="url(#warm-glow)"/>`);

    /* the eye: open, lit, clouded */
    const eyeL = S.layer({ par: 0.4, sh: 4 });
    const eye = eyeL.add(`<g>${watchEye(c, 30, { iris: C.teal2 })}</g>`);
    const flame = eyeL.add(`<g><circle r="40" fill="url(#warm-glow)"/><path d="M0 6C-8 0 -7 -12 0 -24C7 -12 8 0 0 6Z" fill="${C.lampFlame}"/><path d="M0 3C-3 -1 -3 -6 0 -12C3 -6 3 -1 0 3Z" fill="#fff4d2"/></g>`);
    const film = eyeL.add(`<g><path d="${c.cut(c.ell(0, 0, 31, 20, 18), 0.8, 4)}" fill="${mix(C.storm, C.stone2, 0.4)}" opacity=".92"/></g>`);
    const rays = eyeL.add(`<g>${Array.from({ length: 5 }, (_, i) => { const a = PI * (0.85 + i * 0.075); return `<path d="${c.poly([[0, 0], [Math.cos(a) * -260 - 4, Math.sin(a) * -260], [Math.cos(a) * -260 + 4, Math.sin(a) * -260]])}" fill="#fff3cf" opacity=".6"/>`; }).join('')}</g>`);

    /* the great darkness */
    const darkL = S.layer({ par: 0, sh: 0, flat: true, rise: 0 });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#15132a" opacity=".9"/>`);
    darkL.fade(0);
    const rimL = S.layer({ par: 0.4, sh: 0, flat: true });
    rimL.add(`<path d="${c.poly(P)}" fill="none" stroke="${mix(C.night, C.lavender, 0.35)}" stroke-width="3" opacity=".7"/>`);
    rimL.fade(0);

    return (t, time) => {
      const T = time;
      /* v22a — the eye opens, and a flame is lit in it */
      const open = es(t, 0.05, 0.3, ease.back);
      const film_ = es(t, 2.05, 2.3);
      const bl = T ? (1 - (Math.sin(T * 1.3) > 0.985 ? 0.9 : 0)) : 1;
      pose(eye, { x: EX, y: EY, sy: Math.max(0.06, open * bl), o: open > 0.02 ? 1 : 0 });
      const fk = es(t, 0.35, 0.6, ease.back) * (1 - film_);
      pose(flame, { x: EX, y: EY - 2, s: fk * (1 + (T ? Math.sin(T * 7) * 0.06 : 0)), o: fk > 0.02 ? 0.95 : 0 });
      pose(film, { x: EX, y: EY, sx: film_, o: film_ > 0.02 ? 1 : 0 });
      pose(rays, { x: EX, y: EY, s: 0.6 + es(t, 0.5, 1.2) * 0.4, o: es(t, 0.5, 0.8) * (1 - film_) });

      /* v22b — light pours in and fills him, head to foot; v23a — darkness pours in the same way */
      const fill = es(t, 1.05, 1.7, ease.io);
      const drain = es(t, 2.25, 2.85, ease.io);
      const y0 = lerp(TOP - 10, BOT + 10, drain), y1 = lerp(TOP - 10, BOT + 10, fill);
      attr(litRect, 'y', y0);
      attr(litRect, 'height', Math.max(0, y1 - y0));
      pose(halo, { x: HX, y: HY + 220, s: 0.6 + fill * 0.4, o: fill * (1 - drain) * 0.8 });

      /* v23b — the darkness spills over the whole stage */
      const dk = es(t, 3.05, 3.5);
      darkL.fade(dk * 0.85);
      rimL.fade(dk);

      S.cam.z = 1.08 - es(t, 0.8, 1.4) * 0.1 + es(t, 3.0, 3.6) * 0.02;
      S.cam.y = -30 + es(t, 0.8, 1.4) * 40;
    };
  },
};
