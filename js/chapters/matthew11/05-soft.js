// Mt 11,8 — a painted flat comes down: a king's palace, cut open like a doll's house. "A man dressed in soft
// clothing?": close on a courtier as a servant lays a shimmering silk mantle over his shoulders; he spreads his arms
// and admires it while a fan of feathers sways over him. "Those who wear soft clothing are in kings' houses": the
// view pulls back — the whole hall of silk-robed courtiers bowing to the king on his throne — and beneath its
// floor, in the dungeon of that same palace, John sits in his camel-hair coat behind bars.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, town } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { COURTIERS, HEROD, JOHN_B, crown, throne, bars, addToHead, sparkle, kf, PI } from './lib.js';

const FL = 520;                 // the hall floor
const DF = 716;                 // the dungeon floor
const CX = 790;                 // the courtier in the middle

/** a feather fan on a long pole (origin: the grip) */
function fan(c) {
  const s = sheet();
  s.p(c.ribbon([[0, 30], [0, -150]], 4), C.wood2);
  let f = '';
  for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * 0.22; f += c.cut([[0, -150], [Math.cos(a - 0.1) * 70, -150 + Math.sin(a - 0.1) * 70], [Math.cos(a) * 80, -150 + Math.sin(a) * 80], [Math.cos(a + 0.1) * 70, -150 + Math.sin(a + 0.1) * 70]], 0.4, 5); }
  s.p(f, mix(C.skyVeil, C.cream, 0.3));
  s.x(c.poly(c.circ(0, -150, 6, 8)), C.sun);
  return s.out();
}
/** a soft silk mantle held out (origin: its top centre) */
function silk(c, col = mix(C.lavender, C.roseRobe, 0.35)) {
  const s = sheet();
  const pts = [[-40, 0], [40, 0], [46, 30], [38, 64], [44, 96], [20, 104], [0, 96], [-20, 106], [-44, 96], [-38, 64], [-46, 30]];
  s.p(c.cut(pts, 0.8, 6), col);
  s.x(c.ribbon(c.qbez([-26, 10], [-10, 50], [-24, 96], 10), 3) + c.ribbon(c.qbez([18, 10], [30, 50], [16, 96], 10), 3), shade(col, 0.3), 'opacity=".8"');
  return s.out();
}

export default {
  id: 'mt11-soft',
  enter: 'fly',
  beats: [
    { v: 8, text: 'Ale coście wyszli zobaczyć? Człowieka w miękkie szaty ubranego?' },
    { v: 8, cont: true, text: 'Oto w domach królewskich są ci, którzy miękkie szaty noszą.' },
  ],
  cam: { x: [-10, 10], y: [-85, 15], z: [0.98, 1.62] },
  build(S) {
    const c = S.c;
    // phone: the dais, throne and king stand at TX (the king sat under the progress thread), the third courtier at 905
    const PH = S.portrait, TX = PH ? 1050 : 1120;
    sky(S, ['#8f86ad', '#e3a58e', '#f3c79e']);
    const view = S.layer({ par: 0.3, sh: 1 });
    view.add(band(c, { y: 400, amps: [16, 6, 2], lens: [700, 260, 100], color: mix(C.duskViolet, C.dune, 0.4) }).markup + town(c, { x: 650, y: 420, n: 6, spread: 200, sc: 0.5 }) + town(c, { x: 1100, y: 420, n: 5, spread: 160, sc: 0.5 }));

    /* the hall: back wall with two arches, a frieze, drapes */
    const hall = S.layer({ par: 0.7, sh: 3 });
    const Wl = sheet();
    const arches = [560, 1040].map((x) => [[x - 70, FL - 60], [x - 70, 300], ...c.arc(x, 300, 70, 66, PI, 2 * PI, 12), [x + 70, FL - 60]]);
    Wl.p(c.cut([[-1200, 60], [2800, 60], [2800, FL + 10], [-1200, FL + 10]], 1, 30) + arches.map((a) => c.hole(a, 0.5, 6)).join(''), mix(C.plaster, C.peach, 0.3));
    let fr = '';
    for (let x = -800; x < 2400; x += 40) fr += c.cut(c.rect(x, 150, 20, 18), 0.2, 4);
    Wl.p(c.cut([[-1200, 140], [2800, 140], [2800, 178], [-1200, 178]], 0.4, 20), C.plumRobe).p(fr, C.sun);
    const col = (x) => c.cut(c.rect(x - 22, 180, 44, FL - 180), 0.5, 10) + c.cut(c.rect(x - 32, 178, 64, 16), 0.4, 6);
    Wl.p(col(340) + col(800) + col(1260), mix(C.stone, C.cream, 0.4));
    hall.add(Wl.out());
    const drapes = sheet();
    [340, 800, 1260].forEach((x) => { drapes.p(c.cut([[x - 90, 176], [x + 90, 176], [x + 60, 240], [x + 20, 300], [x, 250], [x - 20, 300], [x - 60, 240]], 0.6, 6), mix(C.plumRobe, C.roseRobe, 0.35)); });
    hall.add(drapes.out());

    /* the floor of the hall = the roof of the dungeon; the dungeon itself */
    const base = S.layer({ par: 0.8, sh: 4 });
    const B = sheet();
    B.p(c.cut([[-1200, FL], [2800, FL], [2800, 1800], [-1200, 1800]], 0.6, 30), mix(C.stone2, C.soil, 0.25));
    let bl = '';
    for (let y = FL + 44; y < 1100; y += 40) for (let x = -900 + (Math.round(y / 40) % 2) * 40; x < 2500; x += 80) bl += c.cut(c.rect(x, y, 72, 34), 0.6, 8);
    B.x(bl, shade(mix(C.stone2, C.soil, 0.25), 0.1), 'opacity=".6"');
    // the cell, cut open
    B.p(c.cut(c.rect(640, FL + 44, 320, DF - FL - 38), 0.6, 8), mix(C.soilDark, C.plumRobe, 0.25));
    let straw = '';
    for (let i = 0; i < 20; i++) { const x = c.rr(650, 950); straw += c.ribbon([[x, DF - 2], [x + c.rr(-10, 10), DF - c.rr(10, 18)]], 1.6); }
    B.x(straw, C.wheat2, 'opacity=".8"');
    // the hall floor slab with its tiles
    B.p(c.cut([[-1200, FL - 4], [2800, FL - 4], [2800, FL + 40], [-1200, FL + 40]], 0.5, 20), mix(C.stone, C.sand, 0.3));
    let chk = '';
    for (let x = -900; x < 2500; x += 60) chk += c.poly([[x, FL - 2], [x + 30, FL - 2], [x + 30, FL + 12], [x, FL + 12]]);
    B.x(chk, mix(C.plumRobe, C.stone, 0.55), 'opacity=".4"');
    base.add(B.out());
    // the dais and throne
    base.add(`<g transform="translate(${TX} ${FL})">${sheet().p(c.cut([[-110, 0], [-96, -24], [96, -24], [110, 0]], 0.4, 6), C.plumRobe).out()}</g><g transform="translate(${TX} ${FL - 24}) scale(1.05)">${throne(c)}</g>`);
    const glowJ = base.add(`<circle r="120" fill="url(#warm-glow)"/>`);

    /* people */
    const act = S.layer({ par: 0.8, sh: 5 });
    const john = S.puppet(act.add(person(c, { ...JOHN_B, pose: 'sit' })));
    const king = S.puppet(act.add(addToHead(person(c, { ...HEROD, pose: 'sit' }), crown(c))));
    const CT = [[520, 0.9, 1], [650, 0.92, 2], [PH ? 905 : 950, 0.9, 3]].map(([x, s, k], i) => ({ i, x, s, p: S.puppet(act.add(person(c, COURTIERS[k]))) }));
    const hero = S.puppet(act.add(person(c, { ...COURTIERS[0], mantle: mix(C.lavender, C.roseRobe, 0.35) })));
    const heroPlain = S.puppet(act.add(person(c, { ...COURTIERS[0], mantle: null })));
    const servant = S.puppet(act.add(person(c, { robe: C.linen2, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin4, belt: C.rope, holdB: `<g transform="translate(0 -8) rotate(180)">${fan(c)}</g>` })));
    const silkEl = act.add(`<g>${silk(c)}</g>`);
    const sparks = [0, 1, 2, 3].map((i) => act.add(`<g>${sparkle(c, 12, i % 2 ? C.star : C.halo)}</g>`));
    const barsEl = act.add(`<g>${bars(c, 300, DF - FL - 40, 7)}</g>`);

    const fg = S.layer({ par: 0.95, sh: 8 });
    fg.add(sheet().p(c.cut([[-1200, -1400], [2800, -1400], [2800, 70], [-1200, 80]], 0.8, 16), shade(C.plumRobe, -0.2)).x(c.ribbon([[-1200, 66], [2800, 62]], 6), C.sun).out());

    return (t, time) => {
      const T = time;

      /* v8a — a man in soft clothing */
      const bring = es(t, 0.05, 0.35);
      const drape = es(t, 0.34, 0.46);
      const sx = lerp(560, CX - 70, bring);
      servant.set({ x: sx, y: FL, s: 0.88, walk: bring > 0 && bring < 1 ? sx * 0.05 : undefined, armF: 70 + drape * 40, armB: 150 + (T ? Math.sin(T * 1.6) * 8 : 0), head: -6, blink: blinkAt(T, 4) });
      const [hdx, hdy] = [CX + 2 * 0.95, FL - 150 * 0.95];
      pose(silkEl, { x: lerp(sx + 70, hdx, drape), y: lerp(FL - 170, hdy, drape), s: 0.9, r: (1 - drape) * -8, o: 1 - es(t, 0.44, 0.48) });
      const on = es(t, 0.45, 0.48);
      const preen = es(t, 0.5, 0.66);
      const twirl = t > 0.62 && t < 0.72;
      heroPlain.set({ x: CX, y: FL, s: 0.95, armF: 20, armB: 10, head: -6, o: 1 - on });
      hero.set({ x: CX, y: FL, s: 0.95, flip: twirl, armF: 20 + preen * 70, armB: 10 + preen * 110, head: -preen * 12, blink: blinkAt(T, 2), o: on });
      sparks.forEach((sp, i) => {
        const k = bump(t, 0.5 + i * 0.05, 0.95 + i * 0.03);
        pose(sp, { x: CX - 50 + i * 34, y: FL - 180 - (i % 2) * 50, s: k, r: T * 40, o: k });
      });

      /* v8b — the king's house: courtiers bow; below, John */
      const bow = es(t, 1.2, 1.45);
      CT.forEach((ct) => ct.p.set({ x: ct.x, y: FL, s: ct.s, flip: false, armF: 20 + bow * 40, armB: 20 + bow * 30, head: bow * 16, lean: bow * 10, blink: blinkAt(T, ct.i + 1) }));
      king.set({ x: TX + 4, y: FL - 30, s: 0.95, flip: true, armF: 30 + bump(t, 1.3, 1.8) * 40, armB: 60, head: -4, blink: blinkAt(T, 8) });
      john.set({ x: 800, y: DF, s: 0.92, armF: 40, armB: 20, head: 12 - es(t, 1.4, 1.6) * 16, blink: blinkAt(T, 3) });
      pose(glowJ, { x: 800, y: DF - 90, o: es(t, 1.35, 1.65) * 0.8 });
      pose(barsEl, { x: 800, y: DF });

      /* camera: close on the courtier, then the whole house */
      const back = es(t, 1.0, 1.45);
      S.cam.z = lerp(1.62, 1.0, back);
      S.cam.y = lerp(-85, 15, back);
      S.cam.x = lerp(-10, 0, back);
    };
  },
};
