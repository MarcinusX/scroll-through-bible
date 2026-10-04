// Mk 13,1–2 — leaving the Temple by the great gate in the retaining wall: huge paper stones,
// the gleaming sanctuary above. A disciple points up in wonder; Jesus answers — and in a hanging
// plate the stones of a little Temple lift apart and drift down: not one stone upon another.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix, crowdPerson } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { sanctuary as bigSanctuary } from '../mark12/lib.js';
import { sparkle } from '../mark1/lib.js';
import { kf, speech, GLYPH, voiceRings, ashlar, plate, dust, PI } from './lib.js';

const GY = 690;           // the street
const WT = 350;           // top of the retaining wall
const GATE = [462, 598];  // the gate opening
const STONE = mix(C.stone, C.cream, 0.3);

/** the retaining wall: courses of drafted ashlars, a double gate, the portico along the top */
function wall(c) {
  let out = sheet().p(c.cut([[-1400, WT - 2], [3000, WT - 2], [3000, GY], [-1400, GY]], 0.4, 20), mix(C.rock3, C.soil, 0.25)).out();
  const courses = [[WT, 64], [WT + 64, 84], [WT + 148, 110], [WT + 258, 82]];
  courses.forEach(([y, h], r) => {
    let x = -1400 + c.rr(0, 200) - r * 90;
    while (x < 3000) {
      const big = r === 2 && c.chance(0.6);
      const w = big ? c.rr(460, 700) : c.rr(170, 320);
      const x1 = Math.min(x + w, 3000);
      // leave the gate open
      if (!(x1 > GATE[0] - 30 && x < GATE[1] + 30 && y + h > 470)) out += `<g transform="translate(${x.toFixed(1)} ${y})">${ashlar(c, x1 - x - 5, h - 5, mix(STONE, c.pick([C.sand, C.dawn, C.stone2, C.sand2]), c.rr(0.1, 0.6)))}</g>`;
      else {
        // split around the gate
        if (x < GATE[0] - 30) out += `<g transform="translate(${x.toFixed(1)} ${y})">${ashlar(c, GATE[0] - 30 - x - 3, h - 3, STONE)}</g>`;
        if (x1 > GATE[1] + 30) out += `<g transform="translate(${GATE[1] + 30} ${y})">${ashlar(c, x1 - GATE[1] - 33, h - 3, STONE)}</g>`;
      }
      x = x1;
    }
  });
  // the gate: a deep arch framed with a moulded lintel
  const g = sheet();
  const gx = (GATE[0] + GATE[1]) / 2, gw = GATE[1] - GATE[0];
  g.p(c.cut([[GATE[0] - 30, GY], [GATE[0] - 30, 414], [GATE[1] + 30, 414], [GATE[1] + 30, GY]], 0.5, 8), mix(STONE, C.sand2, 0.3));
  g.p(c.cut([[GATE[0], GY + 2], [GATE[0], 520], ...c.arc(gx, 520, gw / 2, 48, PI, 2 * PI, 12), [GATE[1], GY + 2]], 0.4, 6), mix(C.soilDark, C.wood2, 0.25));
  g.p(c.cut([[GATE[0] + 10, GY + 2], [GATE[0] + 10, 530], ...c.arc(gx, 530, gw / 2 - 10, 40, PI, 2 * PI, 12), [GATE[1] - 10, GY + 2]], 0.3, 6), mix(C.soilDark, C.night2, 0.3));
  g.x(c.ribbon(c.arc(gx, 520, gw / 2 + 8, 56, PI, 2 * PI, 14), 7), shade(STONE, -0.12));
  g.p(c.cut(c.rect(GATE[0] - 38, 408, gw + 76, 12), 0.3, 6), C.sun);
  out += g.out();
  // the royal portico along the top of the wall
  const p = sheet();
  p.p(c.cut([[-1400, WT + 2], [-1400, WT - 56], [3000, WT - 56], [3000, WT + 2]], 0.5, 14), mix(C.plaster2, C.rock2, 0.3));
  let cols = '';
  for (let x = -1380; x < 3000; x += 36) cols += c.cut([[x - 6, WT], [x - 5, WT - 50], [x + 5, WT - 50], [x + 6, WT]], 0.2, 6);
  p.p(cols, mix(C.cream, C.stone, 0.3));
  p.p(c.cut([[-1400, WT - 48], [3000, WT - 48], [3000, WT - 64], [-1400, WT - 64]], 0.4, 12), mix(C.stone, C.plaster, 0.4));
  const rf = [[-1400, WT - 62], [-1400, WT - 76]];
  for (let x = -1400; x < 3000; x += 24) rf.push(...c.arc(x + 12, WT - 76, 12, 6, PI, 2 * PI, 4));
  rf.push([3000, WT - 76], [3000, WT - 62]);
  p.p(c.cut(rf, 0.3, 8), mix(C.clay, C.roof, 0.5));
  p.x(c.ribbon([[-1400, WT - 50], [3000, WT - 50]], 2), C.sun, 'opacity=".75"');
  out += p.out();
  return out;
}

/** the street: big paving slabs in soft perspective */
function street(c) {
  const s = sheet();
  const col = mix(C.stone, C.sand, 0.4);
  s.p(c.cut([[-1400, GY - 14], [3000, GY - 14], [3000, 1800], [-1400, 1800]], 0.6, 20), col);
  let lines = '';
  [GY + 4, GY + 30, GY + 70, GY + 130, GY + 220].forEach((y) => { lines += c.ribbon([[-1400, y], [3000, y + c.rr(-1, 1)]], 1.4); });
  for (let k = -20; k <= 20; k++) { const xb = 800 + k * 90; lines += c.ribbon([[800 + (xb - 800) * 0.5, GY - 14], [800 + (xb - 800) * 2.4, 1400]], 1.2); }
  s.x(lines, shade(col, -0.15), 'opacity=".5"');
  s.p(c.cut([[-1400, GY - 20], [3000, GY - 20], [3000, GY - 8], [-1400, GY - 8]], 0.5, 14), shade(col, -0.08));
  return s.out();
}

/** the little Temple of the plate, as separate blocks: [{x, y, w, h, col}] in plate coordinates (origin: ground centre) */
function templeBlocks(c) {
  const B = [];
  const st = mix(C.stone, C.cream, 0.35), gold = C.sun;
  // the platform
  for (let i = 0; i < 6; i++) B.push({ x: -150 + i * 50, y: -18, w: 50, h: 18, col: mix(C.stone2, st, 0.4) });
  // the wings
  for (let r = 0; r < 3; r++) { B.push({ x: -120, y: -40 - r * 22, w: 44, h: 22, col: C.plaster2 }); B.push({ x: 76, y: -40 - r * 22, w: 44, h: 22, col: C.plaster2 }); }
  B.push({ x: -124, y: -92, w: 52, h: 8, col: gold }); B.push({ x: 72, y: -92, w: 52, h: 8, col: gold });
  // the tall front, three stones wide, with the dark portal in the middle column
  for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) {
    const portal = k === 1 && r < 3;
    B.push({ x: -66 + k * 44, y: -40 - r * 22, w: 44, h: 22, col: portal ? mix(C.plumRobe, C.soilDark, 0.25) : st });
  }
  B.push({ x: -74, y: -180, w: 148, h: 12, col: gold });
  return B.map((b) => ({ ...b, r0: c.rr(-30, 30), ex: c.rr(-150, 140), rot: c.rr(-60, 60) }));
}

export default {
  id: 'm13-stones',
  beats: [
    { cover: true },
    { v: 1, text: 'Gdy wychodził ze świątyni, rzekł Mu jeden z uczniów:' },
    { v: 1, cont: true, text: '«Nauczycielu, patrz, co za kamienie i jakie budowle!»' },
    { v: 2, text: 'Jezus mu odpowiedział: «Widzisz te potężne budowle?' },
    { v: 2, cont: true, text: 'Nie zostanie tu kamień na kamieniu, który by nie był zwalony».' },
  ],
  cam: { x: [-30, 30], y: [-90, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#e2d7bf', '#f1dfbf', '#f7e8cf'];
    const SKY2 = ['#d9b9a4', '#ecc9a8', '#f4dcc0'];
    const sk = sky(S, SKY);

    /* heavens */
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 430, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1050, y: 110, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 36, scale: 0.42 });

    /* the sanctuary rising behind the wall */
    const sanL = S.layer({ par: 0.12, sh: 4 });
    sanL.add(`<circle cx="800" cy="230" r="330" fill="url(#halo-glow)" opacity=".55"/>`);
    sanL.add(`<g transform="translate(800 ${WT - 30}) scale(.8) translate(-800 -410)">${bigSanctuary(c)}</g>`);
    const glints = [[662, 160], [800, 150], [940, 158], [712, 220]].map(([x, y], i) => ({ x, y, i, el: sanL.add(`<g>${sparkle(c, 14)}</g>`) }));

    /* the wall of huge stones and the gate; the street */
    const wallL = S.layer({ par: 0.3, sh: 5 });
    wallL.add(wall(c));
    const sheen = wallL.add(`<g><ellipse rx="260" ry="150" fill="url(#warm-glow)"/></g>`);
    const streetL = S.layer({ par: 0.42, sh: 3 });
    streetL.add(street(c));

    /* pilgrims going up to the Temple, on the right */
    const people = S.layer({ par: 0.5, sh: 5 });
    const PH0 = S.portrait;   // phone: pilgrims clear of the thread, the disciples closed up inside the screen
    const pil = [{ x: PH0 ? 955 : 1030, s: 0.86 }, { x: PH0 ? 1007 : 1108, s: 0.92 }, { x: PH0 ? 1058 : 1184, s: 0.84 }].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(people.add(person(c, crowdPerson(c)))) }));

    /* Jesus and the disciples coming out of the gate */
    const GX = (GATE[0] + GATE[1]) / 2;
    const GROUP = [
      { o: CAST.jesus, x: 836, s: 1 },
      { o: CAST.john, x: 724, s: 0.93, k: 'john' },
      { o: CAST.peter, x: 648, s: 0.95 },
      { o: CAST.andrew, x: 578, s: 0.93 },
      { o: CAST.james, x: 506, s: 0.94 },
      { o: CAST.thomas, x: 440, s: 0.92 },
      { o: CAST.matthew, x: 378, s: 0.9 },
    ].map((m, i) => ({ ...m, x: PH0 ? 836 - (836 - m.x) * 0.74 : m.x, i, seed: c.rr(0, 9), t0: 1.0 + i * 0.09, y: GY + (i % 2) * 6 }));
    // the last ones in, first drawn (so the ones ahead overlap them)
    [...GROUP].reverse().forEach((m) => { m.p = S.puppet(people.add(person(c, m.o))); });
    const J = GROUP[0], JOHN = GROUP[1];
    const bang = people.add(`<g>${speech(c, GLYPH.bang(c), { w: 42, h: 42 })}</g>`);
    const voice = voiceRings(people, c, { n: 3, r: 26, w: 4 });

    /* the plate: a little Temple whose stones come apart */
    const plL = S.layer({ par: 0.36, sh: 6 });
    const PW = 390, PH = 236, PX = 820, PY = 116;
    const plEl = plL.add(`<g>${plate(c, PW, PH, { face: mix(C.parchment, C.dusk, 0.18) })}</g>`);
    const blocks = templeBlocks(c).map((b, i) => ({ ...b, i, el: plL.add(`<g>${sheet().p(c.cut(c.rect(-b.w / 2, -b.h / 2, b.w - 1.5, b.h - 1.5), 0.3, 5), b.col).x(c.ribbon([[-b.w / 2 + 3, b.h / 2 - 4], [b.w / 2 - 4, b.h / 2 - 4]], 1.1), shade(b.col, -0.2), 'opacity=".6"').out()}</g>`) }));
    const NB = blocks.length;
    const puffs = [0, 1, 2, 3].map((i) => plL.add(`<g opacity="0">${dust(c, 22)}</g>`));
    const GROUND = PH - 26; // plate ground line (from plate top)

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const eve = es(t, 3.2, 5);
      sk.blend(SKY, SKY2, eve * 0.8);
      swing(sunEl, 1230, 170 + eve * 50, T, 1, 0.7);
      swing(cl1, 430 + Math.sin(T * 0.1) * 24, 150, T, 1.3, 0.6, 1);
      swing(cl2, 1050 + Math.sin(T * 0.12 + 2) * 24, 110, T, 1.3, 0.8, 2);
      birds(T, 1);

      /* v1b — "look, what stones!": the gold glints, a warm sheen runs along the wall */
      const look = es(t, 2.05, 2.4) * (1 - es(t, 3.8, 4.2));
      glints.forEach((g) => {
        const tw = 0.5 + 0.5 * Math.sin(T * 2.2 + g.i * 1.7);
        pose(g.el, { x: g.x, y: g.y, s: (0.4 + look * 0.8) * (0.7 + tw * 0.4), r: T * 20 + g.i * 30, o: 0.35 + look * 0.65 * tw });
      });
      pose(sheen, { x: lerp(200, 1300, seg(t, 2.05, 2.95)), y: 520, o: bump(t, 2.05, 2.95) * 0.9 });

      /* pilgrims admire the Temple */
      pil.forEach((m) => m.p.set({ x: m.x, y: GY + 4 + m.i * 3, s: m.s, flip: true, head: -10 - look * 6, armF: m.i === 1 ? 30 + look * 50 : 0, blink: blinkAt(T, m.seed) }));

      /* the group comes out of the gate (beat 1) */
      GROUP.forEach((m) => {
        const k = seg(t, m.t0, m.t0 + 0.7);
        const x = lerp(GX - 10, m.x, ease.out(k));
        const walking = k > 0 && k < 1;
        const upHead = m.i ? look * (m.i === 1 ? 0 : 1) * -12 : 0;
        const sad = es(t, 4.25, 4.7);
        let armF = 0, armB = 0, head = upHead + sad * 8, flip = false;
        if (m === JOHN) {
          // stops, turns to the Teacher and points up at the stones
          armB = look * 165 * (1 - sad * 0.8);
          armF = look * 40;
          head = -look * 16 + sad * 10;
        }
        if (m === J) {
          flip = t > 3.05;
          const ans = es(t, 3.1, 3.4) * (1 - es(t, 4.8, 5.2) * 0.5);
          armF = ans * (105 - es(t, 4.1, 4.4) * 45);
          armB = ans * 20;
          head = -ans * 8 * (1 - sad) + sad * 4;
        }
        m.p.set({ x, y: m.y, s: m.s, flip, o: seg(t, m.t0 - 0.01, m.t0 + 0.08), walk: walking ? x * 0.05 : undefined, armF, armB, head, blink: blinkAt(T, m.seed) });
      });
      // "Teacher, look!" — an exclamation pops over John
      const b = es(t, 2.08, 2.3, ease.back) * (1 - es(t, 2.85, 3.05));
      pose(bang, { x: JOHN.x + 10, y: JOHN.y - 190 * JOHN.s, s: b, o: b > 0.01 ? 1 : 0 });
      // Jesus speaks (beats 3–4)
      voice(J.x - 6, J.y - 170, es(t, 3.1, 3.3) * (1 - es(t, 4.8, 5.1)), T, { dir: -1, off: 8 });

      /* v2b — the plate drops; its stones lift apart and fall */
      const down = es(t, 3.95, 4.3, ease.back);
      const py = lerp(-420, PY, down);
      const pr = Math.sin(T * 0.8) * 0.6 * down;
      pose(plEl, { x: PX, y: py, r: pr, o: down > 0.001 ? 1 : 0 });
      const gy = py + GROUND; // ground line of the plate (world)
      blocks.forEach((bk) => {
        const order = (NB - 1 - bk.i) / NB;           // top stones go first
        const a = 4.2 + order * 0.25;
        const lift = es(t, a, a + 0.12);               // stones lift apart
        const fall = es(t, a + 0.08, a + 0.3, ease.in);
        const bx0 = PX + bk.x + bk.w / 2, by0 = gy + bk.y + bk.h / 2;
        const spread = lift * (bk.x + bk.w / 2) * 0.12;
        const x = bx0 + spread + fall * (bk.ex - (bk.x + bk.w / 2)) * 0.8;
        const restY = gy - bk.h * 0.35 - (bk.i % 4) * 7 * (1 - Math.abs(bk.ex) / 170);
        const y = lerp(by0 - lift * 12, restY, fall);
        pose(bk.el, { x, y, r: lift * bk.r0 * 0.2 + fall * bk.rot, o: down > 0.001 ? 1 : 0 });
      });
      puffs.forEach((p, i) => {
        const k = seg(t, 4.4 + i * 0.1, 4.9 + i * 0.1);
        pose(p, { x: PX - 110 + i * 70, y: gy - 10 - k * 26, s: 0.6 + k * 1.1, o: bump(t, 4.4 + i * 0.1, 4.9 + i * 0.1) * 0.8 });
      });

      S.cam.y = -es(t, 2.0, 2.6) * 80 * (1 - es(t, 3.0, 3.6)) + es(t, 0.5, 1.4) * 20 - es(t, 3.9, 4.4) * 50;
      S.cam.z = 1 + es(t, 2.0, 2.6) * 0.06 * (1 - es(t, 3.0, 3.6)) + es(t, 3.9, 4.4) * 0.04;
    };
  },
};
