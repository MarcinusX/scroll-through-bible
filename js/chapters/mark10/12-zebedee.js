// Mk 10,35–40 — James and John come close: "Teacher, do for us whatever we ask." In glory, let us sit
// at your right and your left — three thrones of light come down, their names on the side ones.
// "You do not know what you ask": the thrones grow dim. The cup he must drink and the baptism he must
// receive come down instead. "We can!" — "You will." But the seats are not his to give: cloths veil
// them and they are drawn back up into the flies, kept for those for whom they are prepared.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, shadeTree, TWELVE, lightThrone, chalice, say, nameTag, qmark, headAt } from './lib.js';

const GY = 676;
const JX = 740;
const JAX = 900, JOX = 985;

/** a great drop of water (the baptism); origin top (the string) */
function waterWave(c, r = 58) {
  const s = sheet();
  const pts = [[0, 0], ...c.arc(0, r * 1.9, r, r, -Math.PI * 0.2, Math.PI * 1.2, 20)];
  s.p(c.cut(pts, 0.6, 6), C.lake2);
  s.p(c.cut([[0, r * 0.5], ...c.arc(0, r * 1.9, r * 0.72, r * 0.72, -Math.PI * 0.1, Math.PI * 1.1, 16)], 0.4, 5), C.lake);
  s.x(c.ribbon(c.arc(0, r * 1.9, r * 0.5, r * 0.5, Math.PI * 1.05, Math.PI * 1.45, 6), 5), C.foam, 'opacity=".85"');
  s.x(c.ribbon([[-r * 0.5, r * 2.1], [r * 0.5, r * 2.05]], 2.4) + c.ribbon([[-r * 0.35, r * 2.35], [r * 0.35, r * 2.3]], 2), C.foam, 'opacity=".6"');
  return `<circle cy="${r * 1.9}" r="${r * 1.6}" fill="url(#halo-glow)" opacity=".35"/>${s.out()}`;
}
/** a cloth that veils a throne; origin top-centre */
function veil(c, w = 120, h = 150) {
  const s = sheet();
  const pts = [[-w * 0.2, 0], [w * 0.2, 0], [w / 2, h * 0.5], [w / 2 + 6, h]];
  for (let x = w / 2; x > -w / 2; x -= 20) pts.push(...c.arc(x - 10, h, 10, 6, 0, Math.PI, 4));
  pts.push([-w / 2 - 6, h], [-w / 2, h * 0.5]);
  s.p(c.cut(pts, 0.8, 7), C.linen);
  s.x(c.ribbon([[-w * 0.1, 10], [-w * 0.3, h - 10]], 2) + c.ribbon([[w * 0.1, 10], [w * 0.25, h - 10]], 2), C.linen2);
  return s.out();
}
function drop(c) { return `<path d="${c.cut([[0, -8], [4, 1], [0, 5], [-4, 1]], 0.1, 3)}" fill="${C.lake2}"/>`; }

export default {
  id: 'm10-zebedee',
  beats: [
    { v: 35, text: 'Wtedy zbliżyli się do Niego synowie Zebedeusza, Jakub i Jan, i rzekli:' },
    { v: 35, cont: true, text: '«Nauczycielu, chcemy, żebyś nam uczynił to, o co Cię poprosimy».' },
    { v: 36 },
    { v: 37 },
    { v: 38, text: 'Jezus im odparł: «Nie wiecie, o co prosicie.' },
    { v: 38, cont: true, text: 'Czy możecie pić kielich, który Ja mam pić, albo przyjąć chrzest, którym Ja mam być ochrzczony?»' },
    { v: 39, text: 'Odpowiedzieli Mu: «Możemy».' },
    { v: 39, cont: true, text: 'Lecz Jezus rzekł do nich: «Kielich, który Ja mam pić, pić będziecie; i chrzest, który Ja mam przyjąć, wy również przyjmiecie.' },
    { v: 40 },
  ],
  cam: { x: [-30, 40], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.7, jerX: 1220, farY: 420, roadX: 840, trees: 14, clouds: [[450, 150, 160], [1080, 120, 120]] });
    const back = S.layer({ par: 0.35, sh: 3 });
    back.add(shadeTree(c, 420, 640, 1.1) + olive(c, 1380, 610, 0.9));
    // the other ten resting under the tree
    const restL = S.layer({ par: 0.4, sh: 4 });
    const TEN = [0, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k, i) => ({ p: S.puppet(restL.add(person(c, { ...TWELVE[k].o, pose: 'sit' }))), x: 300 + i * 34 + (i % 2) * 10, y: 640 + (i % 2) * 12, seed: c.rr(0, 9), i }));

    /* hanging: three thrones of glory, the cup, the water */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const THR = [[800, 1, 0], [630, 0.72, -1], [970, 0.72, 1]].map(([x, s, side], i) => {
      const el = hanging(hangL, `<g transform="translate(0 ${190 * s})">${lightThrone(c, s)}</g>`, { x, y: 165, len: 800 });
      const tag = side ? hangL.add(`<g opacity="0">${nameTag(c, side < 0 ? tr('Jakub', 'James') : tr('Jan', 'John'), { size: 16 })}</g>`) : null;
      const vl = side ? hangL.add(`<g opacity="0">${veil(c, 110, 150)}</g>`) : null;
      return { el, tag, vl, x, s, side, i };
    });
    const cupEl = hanging(hangL, `<g transform="translate(0 110)"><circle cy="-40" r="70" fill="url(#halo-glow)" opacity=".4"/>${chalice(c, 90)}</g>`, { x: 640, y: 230, len: 800 });
    const waveEl = hanging(hangL, waterWave(c), { x: 960, y: 250, len: 800 });

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const james = S.puppet(pL.add(person(c, CAST.james)));
    const john = S.puppet(pL.add(person(c, CAST.john)));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const fxL = S.layer({ par: 0.5, sh: 6 });
    const ask1 = fxL.add(`<g opacity="0">${say(c, tr(['Nauczycielu, chcemy,', 'żebyś nam uczynił…'], ['Teacher, we want you', 'to do for us…']), { size: 18, side: 1 })}</g>`);
    const ask2 = fxL.add(`<g opacity="0">${say(c, tr('Co chcecie?', 'What do you want?'), { size: 19, side: 1 })}</g>`);
    const ask3 = fxL.add(`<g opacity="0">${say(c, tr(['Po prawej', 'i po lewej!'], ['At your right', 'and your left!']), { size: 18, side: 1 })}</g>`);
    const can = fxL.add(`<g opacity="0">${say(c, tr('Możemy!', 'We are able!'), { size: 22, side: 1, jag: true })}</g>`);
    const q = fxL.add(`<g opacity="0"><g transform="scale(1.3)">${qmark(c)}</g></g>`);
    const drops = Array.from({ length: 8 }, (_, i) => ({ el: fxL.add(`<g opacity="0">${drop(c)}</g>`), i }));
    const cupGlow = fxL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 9) * 30 });
      TEN.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.62, flip: false, head: -4 + es(t, 7.9, 8.4) * 0, blink: blinkAt(T, m.seed) }));

      /* beat 0–1: James and John come close and ask */
      const come = es(t, -0.3, 0.6);
      const bowK = es(t, 1.02, 1.3) * (1 - es(t, 2.9, 3.1));
      const glory = es(t, 3.02, 3.4);
      const cant = es(t, 6.02, 6.25) * (1 - es(t, 6.9, 7.1));
      const receive = es(t, 7.1, 7.5);
      const jaX = lerp(JAX + 420, JAX, come), joX = lerp(JOX + 440, JOX, come);
      james.set({ x: jaX, y: GY, s: 0.96, flip: true, walk: come > 0 && come < 1 ? jaX * 0.07 : undefined, lean: -bowK * 6 - receive * 5, armF: bowK * 70 + glory * 30 * (1 - es(t, 4, 4.3)) + cant * 90 + receive * 60, armB: bowK * 40 + cant * 150, head: bowK * 8 - glory * 8 * (1 - es(t, 4, 4.3)) + receive * 10, blink: blinkAt(T, 1) });
      john.set({ x: joX, y: GY + 6, s: 0.92, flip: true, walk: come > 0 && come < 1 ? joX * 0.07 + 1 : undefined, lean: -bowK * 6 - receive * 5, armF: bowK * 60 + cant * 100 + receive * 50, armB: bowK * 60 + glory * 60 * (1 - es(t, 4, 4.3)) + cant * 130, head: bowK * 8 - glory * 10 * (1 - es(t, 4, 4.3)) + receive * 10, blink: blinkAt(T, 2) });
      pose(ask1, { x: JAX - 20, y: GY - 206, s: es(t, 1.02, 1.25, ease.back), o: t > 1.02 && t < 2 ? 1 - es(t, 1.85, 2) : 0 });
      pose(ask3, { x: JAX - 20, y: GY - 206, s: es(t, 3.05, 3.3, ease.back), o: t > 3.05 && t < 4 ? 1 - es(t, 3.85, 4) : 0 });
      pose(can, { x: JAX - 10, y: GY - 206, s: es(t, 6.05, 6.25, ease.back), o: t > 6.05 && t < 7.05 ? 1 - es(t, 6.9, 7.05) : 0 });

      /* Jesus */
      const askJ = es(t, 2.02, 2.3) * (1 - es(t, 2.9, 3.05));
      const shake = bump(t, 4.02, 4.9);
      const offer = es(t, 5.02, 5.3) * (1 - es(t, 7.9, 8.1));
      const up = es(t, 8.02, 8.3);
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 20 + askJ * 50 + offer * 70 + up * 60, armB: offer * 110 + up * 130, head: Math.sin(t * 20) * 5 * shake - askJ * 3 - up * 8 + Math.sin(T * 0.6), blink: blinkAt(T) });
      pose(ask2, { x: JX + 20, y: GY - 226, s: es(t, 2.02, 2.25, ease.back), o: t > 2.02 && t < 3.05 ? 1 - es(t, 2.9, 3.05) : 0 });
      pose(q, { x: 860, y: GY - 310, s: es(t, 4.05, 4.3, ease.back), r: Math.sin(T) * 6, o: t > 4.05 && t < 5 ? 1 - es(t, 4.8, 5) : 0 });

      /* the thrones: come down in glory (3), grow dim (4), rise away (5) — veiled and taken up (8) */
      const dim = es(t, 4.05, 4.4);
      const away = es(t, 4.9, 5.3) * (1 - es(t, 7.9, 8.2));
      const veiled = es(t, 8.2, 8.5), gone = es(t, 8.85, 9.3);
      THR.forEach((th) => {
        const d = es(t, 3.02 + th.i * 0.08, 3.35 + th.i * 0.08, ease.back);
        const y = 165 - (1 - d) * 1100 - away * 1100 - gone * 1100;
        swing(th.el, th.x, y, 0, 0, 0);
        fade(th.el, th.side ? 1 - dim * 0.55 : 1);
        if (th.tag) pose(th.tag, { x: th.x + th.side * 4, y: y + 190 * th.s + 4, s: 1, o: es(t, 3.3, 3.45) * (1 - dim) });
        if (th.vl) pose(th.vl, { x: th.x, y: y + 4 - (1 - veiled) * 120, s: 0.95, o: veiled });
      });
      /* the cup and the water */
      const cd = es(t, 5.1, 5.45, ease.back), cu = es(t, 8.05, 8.35);
      swing(cupEl, lerp(640, 820, receive), 230 - (1 - cd) * 1100 - cu * 1100 + receive * 60, T, 1, 0.7, 5);
      swing(waveEl, lerp(960, 1000, receive), 180 - (1 - es(t, 5.2, 5.55, ease.back)) * 1100 - cu * 1100, T, 1, 0.8, 6);
      pose(cupGlow, { x: lerp(640, 820, receive), y: 340 + receive * 60, s: 0.8, o: receive * (1 - cu) * 0.8 });
      drops.forEach((dp) => {
        const k = T ? (T * 0.7 + dp.i / 8) % 1 : dp.i / 8;
        pose(dp.el, { x: 965 + (dp.i % 4) * 16 - 24 + (dp.i > 3 ? 8 : 0), y: 360 + k * 170, o: receive * (1 - cu) * Math.sin(k * Math.PI) });
      });

      S.cam.y = -es(t, 2.9, 3.4) * 40 * (1 - es(t, 4.9, 5.3)) - es(t, 4.9, 5.4) * 20 + es(t, 8.3, 8.8) * 20;
      S.cam.z = 1 + es(t, 0.5, 1.2) * 0.05;
      S.cam.x = es(t, 0.5, 1.2) * 20;
    };
  },
};
