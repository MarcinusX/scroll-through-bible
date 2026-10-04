// Mk 4,21–23 — the lamp: hidden under a bushel, under a bed, then set on a lampstand; nothing stays hidden.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { oilLamp, lampstand, bushel, rays, ear, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';

const PI = Math.PI;
const FLOOR = 664;   // where things stand on the floor
const FEET = 670;    // where people stand

/* ---------- local cut-outs ---------- */
function jar(c) {
  const s = sheet();
  s.p(c.cut([[-12, -74], [12, -74], [11, -64], [24, -54], [31, -34], [26, -12], [14, 0], [-14, 0], [-26, -12], [-31, -34], [-24, -54], [-11, -64]], 0.6, 6), C.pot);
  s.p(c.cut([[-15, -78], [15, -78], [14, -71], [-14, -71]], 0.3, 5), shade(C.pot, -0.15));
  s.p(c.ribbon(c.qbez([22, -56], [40, -60], [30, -36], 8), 5), shade(C.pot, -0.1));
  s.x(c.ribbon([[-29, -36], [29, -36]], 4) + c.ribbon([[-27, -28], [27, -28]], 2), C.cream, 'opacity=".55"');
  s.x(c.cut([[-20, -50], [-12, -58], [-8, -30], [-14, -18]], 0.3, 4), shade(C.pot, 0.25), 'opacity=".6"');
  return s.out();
}
function coin(c) {
  return sheet().p(c.cut(c.circ(0, -7, 8, 14), 0.3, 3), C.sun).p(c.cut(c.circ(0, -7, 5, 10), 0.2, 3), shade(C.sun, -0.18))
    .x(c.poly(c.circ(-2.5, -9.5, 1.6, 6)), C.star).out();
}
function key(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 12, 11, 16), 0.3, 3) + c.hole(c.circ(0, 12, 5.5, 10), 0.2, 3), C.sun);
  s.p(c.cut([[-2.8, 21], [2.8, 21], [2.8, 64], [-2.8, 64]], 0.3, 5), C.sun);
  s.p(c.cut([[2.5, 52], [11, 52], [11, 57], [7, 57], [7, 60], [11, 60], [11, 64], [2.5, 64]], 0.2, 3), shade(C.sun, -0.12));
  const nail = c.poly(c.circ(0, 0, 3, 6));
  return `${s.out()}<path d="${nail}" fill="${C.soilDark}"/>`;
}
function scrollRod(c, w = 70) {
  return sheet().p(c.cut([[-w / 2, -7], [w / 2, -7], [w / 2, 7], [-w / 2, 7]], 0.3, 5), C.parchment)
    .p(c.cut(c.ell(-w / 2 - 3, 0, 4, 9, 10), 0.2, 3) + c.cut(c.ell(w / 2 + 3, 0, 4, 9, 10), 0.2, 3), C.wood2).out();
}
function scrollSheet(c, w = 60, h = 80) {
  const s = sheet().p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 1, h], [-w / 2 + 1, h]], 0.4, 6), C.parchment);
  let lines = '';
  for (let y = 12; y < h - 8; y += 9) { const l = c.rr(0.55, 0.9) * (w - 16); lines += c.ribbon([[-w / 2 + 8, y], [-w / 2 + 8 + l, y + c.rr(-0.5, 0.5)]], 1.6); }
  s.x(lines, C.ink, 'opacity=".45"');
  return s.out();
}
/** a sleeping cat curled up, facing left; parts: catHead, catEyesOpen, catEyesShut, catTail */
function cat(c) {
  const fur = C.ochre, dk = shade(C.ochre, -0.22);
  const tail = sheet().p(c.ribbon(c.qbez([0, 0], [16, -26], [-2, -42], 10), (t) => 9 - t * 3), fur)
    .x(c.ribbon(c.qbez([4, -30], [8, -36], [-2, -42], 5), 5), dk).out();
  const body = sheet();
  body.p(c.cut(c.blob(4, -20, 40, 20, 14, 0.06).map(([x, y]) => [x, Math.min(y, 0)]), 0.7, 6), fur);
  body.p(c.cut(c.ell(-10, -6, 22, 7, 14), 0.4, 5), C.cream);
  let st = '';
  for (let i = 0; i < 4; i++) st += c.ribbon([[i * 12 - 6, -38], [i * 12 - 2, -26]], 3.4);
  body.x(st, dk, 'opacity=".8"');
  const head = sheet();
  head.p(c.cut([[-12, -8], [-8, -26], [-2, -12]], 0.2, 3) + c.cut([[4, -10], [10, -26], [14, -8]], 0.2, 3), fur);
  head.p(c.cut(c.ell(0, 0, 16, 13, 16), 0.3, 4), fur);
  head.x(c.poly([[-9, -22], [-6, -14], [-4, -15]]) + c.poly([[10, -22], [8, -14], [11, -14]]), C.blush);
  head.x(c.poly([[-4, 4], [0, 7], [-7, 7]].map(([x, y]) => [x - 7, y - 1])), C.blush);
  const shut = sheet().x(c.ribbon(c.arc(-8, 0, 3.4, 2.2, 0.1, PI - 0.1, 5), 1.3) + c.ribbon(c.arc(4, 0, 3.4, 2.2, 0.1, PI - 0.1, 5), 1.3), C.inkSoft).out();
  const open = sheet().x(c.poly(c.ell(-8, -1, 2.6, 3.4, 10)) + c.poly(c.ell(4, -1, 2.6, 3.4, 10)), C.teal)
    .x(c.poly(c.ell(-8, -1, 0.9, 2.8, 8)) + c.poly(c.ell(4, -1, 0.9, 2.8, 8)), C.ink).out();
  const whisk = c.ribbon([[-14, 5], [-30, 2]], 0.8) + c.ribbon([[-14, 7], [-30, 9]], 0.8);
  return `<g data-k="catTail" transform="translate(38 -10)">${tail}</g>${body.out()}` +
    `<g data-k="catHead" transform="translate(-32 -20)">${head.out()}<path d="${whisk}" fill="${C.inkSoft}" opacity=".5"/><g data-k="catEyesShut">${shut}</g><g data-k="catEyesOpen" opacity="0">${open}</g></g>`;
}
/** a low bed with a blanket that falls almost to the floor — room to hide a lamp under it */
function bedDrape(c, w = 270) {
  const s = sheet();
  s.p(c.cut([[w / 2 - 14, -98], [w / 2 + 4, -104], [w / 2 + 6, 0], [w / 2 - 10, 0]], 0.4, 7), C.wood2);
  s.p(c.cut([[-w / 2 + 4, -12], [-w / 2 + 14, -12], [-w / 2 + 13, 0], [-w / 2 + 5, 0]], 0.3, 4) + c.cut([[w / 2 - 26, -12], [w / 2 - 16, -12], [w / 2 - 17, 0], [w / 2 - 25, 0]], 0.3, 4), C.wood);
  s.p(c.cut([[-w / 2, -66], [w / 2 - 8, -66], [w / 2 - 8, -56], [-w / 2, -56]], 0.4, 8), C.linen2);
  s.p(c.cut(c.blob(w / 2 - 44, -76, 34, 13, 12, 0.08), 0.4, 5), C.skyVeil);
  const drape = [[-w / 2 - 6, -62], [w / 2 - 60, -64], [w / 2 - 50, -14]];
  for (let x = w / 2 - 50; x > -w / 2 - 6; x -= 22) drape.push(...c.arc(x - 11, -14, 11, 5, 0, PI, 4));
  s.p(c.cut(drape, 0.6, 8), C.dustyBlue);
  let pat = '';
  for (let x = -w / 2 + 8; x < w / 2 - 60; x += 30) pat += c.cut(c.star(x + 8, -38, 7, 3, 4, 0), 0.2, 3);
  pat += c.ribbon([[-w / 2 - 4, -54], [w / 2 - 58, -56]], 4) + c.ribbon([[-w / 2 - 2, -22], [w / 2 - 52, -22]], 4);
  s.x(pat, C.cream, 'opacity=".6"');
  return s.out();
}
function sparkle(c, r = 18) {
  return `<path d="${c.poly(c.star(0, 0, r, r * 0.22, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(r * 0.9, -r * 0.8, r * 0.4, r * 0.1, 4, 0.4))}" fill="${C.star}"/>`;
}

/** approximate position of a puppet's front hand */
function hand(x, y, s, flip, a, lean = 0, dy = 0) {
  const r = (a * PI) / 180, l = (lean * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  const rx = hx * Math.cos(l) - hy * Math.sin(l), ry = hx * Math.sin(l) + hy * Math.cos(l);
  return [x + (flip ? -1 : 1) * rx * s, y + ry * s];
}

export default {
  id: 'lamp',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 21, text: 'Mówił im dalej: «Czy po to wnosi się światło, by je postawić pod korcem lub pod łóżkiem?' },
    { v: 21, cont: true, text: 'Czy nie po to, aby je postawić na świeczniku?' },
    { v: 22 },
    { v: 23 },
  ],
  cam: { x: [-50, 50], y: [0, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    // phone: the hidden things (jar & coin, scroll niche, cat) and the listeners come inward, clear of the
    // frame and the progress thread; the bushel waits a little further right to make room for the jar;
    // the ceiling beam is a band rather than a sheet filling the top of the tall screen
    const P = S.portrait;
    const JAR = P ? 512 : 444, COIN = P ? 542 : 474, BUSH = P ? 610 : 540, NX = P ? 1062 : 1125, BEAM = P ? -60 : -400;
    // phone: the bed (and the cat on it) a step left, so its head end is not under the thread
    const BX = P ? -90 : 0, CATX = P ? 1075 + BX : 1150;

    /* sky seen through the window and door */
    const sk = sky(S, [C.night2, C.night, C.indigo]);
    sk.layer.add(stars(c, { x0: -900, x1: 2500, y0: -200, y1: 700, n: 160 }));
    const hangL = S.layer({ par: 0.08, sh: 3 });
    const moonEl = hanging(hangL, moon(c, 30), { x: 650, y: 225, len: 400 });

    /* ---------- the room: wall with window, door and niche; floor ---------- */
    const room = S.layer({ par: 0.2, sh: 3 });
    const win = [[560, 300], [560, 222], ...c.arc(625, 222, 65, 52, PI, 2 * PI, 12), [690, 300]];
    const door = [[330, 598], [330, 440], ...c.arc(385, 440, 55, 58, PI, 2 * PI, 12), [440, 598]];
    const wall = sheet();
    wall.p(c.cut([[-900, -800], [2500, -800], [2500, 600], [-900, 600]], 1, 30) + c.hole(win, 0.6, 7) + c.hole(door, 0.6, 7), C.plaster);
    // plaster patches & a darker dado
    let patch = '';
    for (let i = 0; i < 14; i++) patch += c.cut(c.blob(c.rr(-300, 1900), c.rr(120, 520), c.rr(30, 80), c.rr(14, 30), 10, 0.2), 0.8, 6);
    wall.x(patch, C.plaster2, 'opacity=".55"');
    wall.p(c.cut([[-900, 540], [330, 540], [330, 598], [-900, 598]], 0.8, 10) + c.cut([[440, 540], [2500, 540], [2500, 598], [440, 598]], 0.8, 10), C.plaster2);
    // niche for the scroll
    wall.p(c.cut([[NX - 45, 424], [NX - 45, 360], ...c.arc(NX, 360, 45, 36, PI, 2 * PI, 10), [NX + 45, 424]], 0.5, 6), shade(C.plaster2, -0.12));
    wall.p(c.cut([[NX - 51, 424], [NX + 51, 424], [NX + 55, 432], [NX - 55, 432]], 0.4, 6), C.wood3);
    // window frame and bars
    wall.p(c.ribbon([[555, 302], [695, 302]], 12) + c.ribbon([[625, 172], [625, 300]], 6) + c.ribbon([[562, 250], [688, 250]], 6), C.wood2);
    // door jambs + an open door leaf
    wall.p(c.ribbon([[326, 600], [326, 440]], 10) + c.ribbon([[444, 600], [444, 440]], 10) + c.ribbon(c.arc(385, 440, 59, 62, PI, 2 * PI, 12), 10), C.wood2);
    wall.p(c.cut([[250, 600], [250, 432], [318, 398], [318, 598]], 0.6, 8), C.wood);
    wall.x(c.ribbon([[270, 590], [272, 424]], 3) + c.ribbon([[296, 594], [298, 410]], 3), shade(C.wood, -0.25), 'opacity=".6"');
    // shelf with bowls on the right wall (seen on wide screens)
    wall.p(c.cut([[1260, 400], [1460, 400], [1460, 410], [1260, 410]], 0.4, 7), C.wood2);
    wall.p(c.cut(c.arc(1300, 400, 26, 16, 0, PI, 8), 0.4, 5) + c.cut(c.arc(1360, 400, 20, 22, 0, PI, 8), 0.4, 5), C.pot);
    wall.p(c.cut([[1400, 400], [1404, 360], [1420, 350], [1436, 360], [1440, 400]], 0.4, 5), C.clay);
    // herbs hanging on the left wall
    wall.p(c.ribbon([[170, 240], [180, 360]], 3) + c.ribbon([[210, 240], [200, 380]], 3), C.moss);
    wall.p(c.cut(c.blob(178, 370, 16, 26, 9, 0.2), 0.6, 5) + c.cut(c.blob(202, 388, 14, 24, 9, 0.2), 0.6, 5), C.olive);
    room.add(wall.out());
    // floor
    const floor = sheet();
    floor.p(c.cut([[-900, 596], [2500, 596], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand2, C.clay, 0.25));
    let boards = '';
    for (let i = 0; i < 7; i++) { const y = 612 + i * i * 9 + i * 10; boards += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.6); }
    floor.x(boards, shade(C.sand2, -0.2), 'opacity=".5"');
    floor.p(c.cut([[500, 640], [1010, 638], [1040, 700], [470, 704]], 0.8, 10), C.terracotta);
    floor.p(c.cut([[520, 648], [990, 646], [1014, 694], [494, 696]], 0.6, 10), C.clayMantle);
    let rugDots = '';
    for (let x = 530; x < 990; x += 34) rugDots += c.cut(c.star(x, 671, 7, 3, 4, 0), 0.2, 3);
    floor.x(rugDots, C.cream, 'opacity=".7"');
    room.add(floor.out());
    // key on a nail & scroll in the niche (animated)
    const keyEl = room.add(`<g data-k="key" transform="translate(1010 232)">${key(c)}</g>`);
    const scrollSheetEl = room.add(`<g data-k="scrollSheet" transform="translate(${NX} 416)">${scrollSheet(c, 62, 84)}</g>`);
    const rodBottom = room.add(`<g transform="translate(${NX} 416)">${scrollRod(c, 66)}</g>`);
    const rodTop = room.add(`<g transform="translate(${NX} 414)">${scrollRod(c, 66)}</g>`);

    /* ---------- furniture behind the actors ---------- */
    const furn = S.layer({ par: 0.35, sh: 4 });
    furn.add(`<g transform="translate(1340 664)">${sheet().p(c.cut([[-80, -60], [80, -60], [80, -50], [-80, -50]], 0.4, 7), C.wood).p(c.cut(c.rect(-72, -50, 10, 50), 0.3, 5) + c.cut(c.rect(62, -50, 10, 50), 0.3, 5), C.wood2).p(c.cut(c.blob(-30, -70, 28, 12, 10, 0.1), 0.4, 5), C.wheat2).p(c.cut(c.arc(30, -60, 24, 16, PI, 2 * PI, 8), 0.4, 5), C.pot).out()}</g>`);
    furn.add(`<g transform="translate(200 664) scale(1.4)">${jar(c)}</g>`);
    const coinEl = furn.add(`<g data-k="coin" transform="translate(478 664)">${coin(c)}</g>`);
    const jarEl = furn.add(`<g data-k="jar" transform="translate(470 664)">${jar(c)}</g>`);

    /* ---------- the lamp & the lampstand (flown in on a string) ---------- */
    const lampL = S.layer({ par: 0.5, sh: 5 });
    const standEl = hanging(lampL, `<g transform="scale(1.3)">${lampstand(c, 150)}</g>`, { x: 660, y: 666, len: 900 });
    const standObj = standEl.querySelector('.obj');
    // the string should hold the top of the stand, not its foot
    attr(standEl.querySelector('.hang > path'), 'd', `M0 -3000V${-156 * 1.3}`);
    const lampEl = lampL.add(`<g transform="translate(0 0)">${oilLamp(c, { k: 'lamp' })}</g>`);
    const lampG = S.$('lamp');
    fade(lampG.querySelector('.glow'), 0);
    const flame = lampG.querySelector('.flame');

    /* ---------- bed, bushel and the cat (in front of the lamp) ---------- */
    const cover = S.layer({ par: 0.5, sh: 5 });
    cover.add(`<g transform="translate(${1095 + BX} 664)">${bedDrape(c, 270)}</g>`);
    const catEl = cover.add(`<g transform="translate(${CATX} 602)">${cat(c)}</g>`);
    const catHead = S.$('catHead'), catTail = S.$('catTail'), catOpen = S.$('catEyesOpen'), catShut = S.$('catEyesShut');
    const bushEl = cover.add(`<g>${bushel(c, 90, 70)}</g>`);

    /* ---------- people ---------- */
    const peopleL = S.layer({ par: 0.5, sh: 6 });
    const HOST = { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2, belt: C.leather };
    const d1 = S.puppet(peopleL.add(person(c, { ...CAST.matthew })));
    const d2 = S.puppet(peopleL.add(person(c, { ...CAST.peter })));
    const d3 = S.puppet(peopleL.add(person(c, { ...CAST.john })));
    const d4 = S.puppet(peopleL.add(person(c, { ...CAST.andrew })));
    const hostS = S.puppet(peopleL.add(person(c, { ...HOST })));
    const hostK = S.puppet(peopleL.add(person(c, { ...HOST, pose: 'kneel' })));
    const jesus = S.puppet(peopleL.add(person(c, { ...CAST.jesus })));
    // sound rings around Jesus' head
    const ringM = [];
    for (let i = 0; i < 3; i++) {
      ringM.push(`<g data-k="ringR" data-i="${i}" opacity="0"><path d="${c.ribbon(c.arc(0, 0, 40, 40, -0.55, 0.55, 10), 5)}" fill="${shade(C.ochre, 0.25)}"/></g>`);
      ringM.push(`<g data-k="ringL" data-i="${i}" opacity="0"><path d="${c.ribbon(c.arc(0, 0, 40, 40, PI - 0.55, PI + 0.55, 10), 5)}" fill="${shade(C.ochre, 0.25)}"/></g>`);
    }
    ringM.forEach((m) => peopleL.add(m));
    const ringsR = S.$$('ringR'), ringsL = S.$$('ringL');
    const earDisc = sheet().p(c.cut(c.circ(0, 0, 50, 34), 0.6, 5), C.cream).p(c.cut(c.circ(0, 0, 43, 30), 0.4, 5), C.halo).out();
    const earEl = hanging(peopleL, `${earDisc}<g transform="translate(-4 0) scale(1.05)">${ear(c, C.skin)}</g>`, { x: 800, y: 280, len: 600 });

    /* ---------- foreground: ceiling beam, a big pot and a basket ---------- */
    const fg = S.layer({ par: 0.9, sh: 8 });
    const beam = sheet();
    beam.p(c.cut([[-900, BEAM], [2500, BEAM], [2500, 108], [-900, 122]], 0.8, 14), C.wood2);
    beam.x(c.ribbon([[-900, 110], [2500, 114]], 3) + c.ribbon([[-900, 90], [2500, 94]], 2), shade(C.wood2, -0.25), 'opacity=".6"');
    beam.p(c.ribbon([[240, 100], [240, 170]], 2) + c.ribbon([[1380, 104], [1380, 160]], 2), C.rope);
    beam.p(c.cut(c.blob(240, 186, 16, 20, 9, 0.2), 0.5, 5) + c.cut(c.blob(226, 200, 12, 14, 8, 0.2), 0.5, 5) + c.cut(c.blob(254, 202, 12, 14, 8, 0.2), 0.5, 5), C.linen2);
    beam.p(c.cut(c.blob(1380, 176, 22, 18, 10, 0.2), 0.5, 5), C.olive);
    fg.add(beam.out());
    fg.add(`<g transform="translate(90 930) scale(2.4)">${jar(c)}</g>`);
    fg.add(`<g transform="translate(1520 930) scale(1.8)">${bushel(c, 90, 60)}</g>`);

    /* ---------- darkness: a night overlay with a pool of lamplight cut out of it ---------- */
    const dark = S.layer({ par: 0.5, sky: true });
    const mId = S.id('mask'), gId = S.id('hole');
    const spots = [[COIN + 4, 630, 120], [1010, 262, 95], [NX, 430, 105], [CATX, 590, 125]];
    dark.add(`<defs><radialGradient id="${gId}"><stop offset="0" stop-color="#000" stop-opacity="1"/><stop offset=".45" stop-color="#000" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <mask id="${mId}" maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="8000" height="8000"><rect x="-3000" y="-3000" width="8000" height="8000" fill="#fff"/>
      <circle data-k="hole" cx="0" cy="0" r="1" fill="url(#${gId})"/><ellipse data-k="holeBed" cx="${1070 + BX}" cy="664" rx="1" ry="1" fill="url(#${gId})"/>
      ${spots.map(([x, y, r], i) => `<circle data-k="spot" data-i="${i}" cx="${x}" cy="${y}" r="${r}" fill="url(#${gId})" opacity="0"/>`).join('')}</mask></defs>`);
    const darkRect = dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" mask="url(#${mId})" opacity=".8"/>`);
    const hole = S.$('hole'), holeBed = S.$('holeBed'), spotEls = S.$$('spot');
    // shadow pools that still hide things after the lamp is lit
    const pId = S.id('pool');
    dark.add(`<defs><radialGradient id="${pId}"><stop offset="0" stop-color="${C.night2}" stop-opacity=".85"/><stop offset=".5" stop-color="${C.night2}" stop-opacity=".7"/><stop offset="1" stop-color="${C.night2}" stop-opacity="0"/></radialGradient></defs>`);
    const pools = spots.map(([x, y, r]) => dark.add(`<g transform="translate(${x} ${y})"><ellipse rx="${r * 1.1}" ry="${r * 0.9}" fill="url(#${pId})"/></g>`));

    /* ---------- light: glows, rays, leaks, sparkles ---------- */
    const light = S.layer({ par: 0.5, sky: true });
    const shaft = light.add(`<path d="${c.poly([[560, 300], [690, 300], [900, FLOOR + 4], [690, FLOOR + 4]])}" fill="${C.moon}" opacity=".1"/>`);
    const wash = light.add(`<circle r="900" fill="url(#warm-glow)" opacity="0"/>`);
    const raysEl = light.add(`<g opacity="0">${rays(c, { n: 16, r0: 50, r1: 700, spread: 0.06, color: C.lampGlow })}</g>`);
    const glowEl = light.add(`<circle r="160" fill="url(#warm-glow)"/>`);
    let leak = '';
    [-1, 1].forEach((sd) => { for (let i = 0; i < 3; i++) { const a = 0.08 + i * 0.12; leak += c.poly([[sd * 30, -2], [sd * 60, -2], [sd * (60 + Math.cos(a) * 120), -2 - Math.sin(a) * 60], [sd * (34 + Math.cos(a) * 60), -2 - Math.sin(a) * 26]]); } });
    const leakBush = light.add(`<g><ellipse cx="0" cy="-20" rx="150" ry="60" fill="url(#warm-glow)" opacity=".7"/><ellipse cx="0" cy="0" rx="130" ry="20" fill="url(#warm-glow)"/><path d="${leak}" fill="${C.lampGlow}" opacity=".45"/></g>`);
    const leakBed = light.add(`<g transform="translate(${1060 + BX} ${FLOOR})"><ellipse cx="0" cy="0" rx="190" ry="22" fill="url(#warm-glow)"/><path d="${c.poly([[-125, -8], [100, -8], [96, -1], [-122, -1]])}" fill="${C.lampGlow}" opacity=".8"/></g>`);
    const qEl = light.add(`<g opacity="0">${paperLabel('?', { size: 40 })}</g>`);
    const sparks = spots.map(() => light.add(`<g opacity="0">${sparkle(c, 20)}</g>`));
    const SPARK_AT = [[COIN - 12, 628], [1010, 290], [NX + 25, 405], [CATX + 46, 548]];

    return (t, time) => {
      const blink = blinkAt(time);
      /* ---------- the householder's choreography ---------- */
      let hx = 430, flip = false, armF = 55, armB = 8, lean = 0, head = 0, walk, kneel = 0, ho = seg(t, -0.05, 0.06);
      let lampX, lampY, held = 1;           // held: 1 = lamp in hand
      const floorSpot = [690, FLOOR], bedSpot = [1060 + BX, FLOOR], standTop = [655, 463];
      let bx = BUSH, by = FLOOR - 42, br = 0, bushHeld = 0;   // bushel centre & rotation
      if (t < 0.18) { const k = seg(t, -0.02, 0.18); hx = lerp(430, 620, ease.out(k)); walk = k > 0 && k < 1 ? hx * 0.055 : undefined; }
      else hx = 620;
      // set the lamp down
      const down = es(t, 0.18, 0.26), bend1 = bump(t, 0.18, 0.34);
      // turn, grab the bushel, cover the lamp
      const grab = es(t, 0.27, 0.3), cover1 = es(t, 0.3, 0.39);
      if (t > 0.25 && t < 0.3) flip = true;
      // oops — lift it and toss it aside
      const lift = es(t, 0.5, 0.58);
      // pick the lamp up again
      const pick = es(t, 0.6, 0.64);
      const toBed = es(t, 0.64, 0.76);
      kneel = seg(t, 0.75, 0.79) * (1 - seg(t, 1.1, 1.14));
      const under = es(t, 0.8, 0.88) * (1 - es(t, 1.0, 1.1));
      const toStand = es(t, 1.2, 1.4);
      const raise = es(t, 1.3, 1.44), setOn = es(t, 1.42, 1.5);
      const stepBack = es(t, 1.5, 1.7);

      if (t >= 0.64) {
        hx = lerp(620, 880 + BX, toBed);
        if (toBed > 0 && toBed < 1) walk = hx * 0.055;
      }
      if (t >= 1.14) {
        hx = lerp(880 + BX, 700, toStand);
        flip = toStand > 0;
        if (toStand > 0 && toStand < 1) walk = hx * 0.055;
        hx = lerp(hx, 830, stepBack);
      }
      lean = bend1 * 16 + bump(t, 0.58, 0.66) * 16 + bump(t, 0.26, 0.31) * 8;
      armF = 55 - bend1 * 15 + bump(t, 0.27, 0.4) * 10 - bump(t, 0.58, 0.66) * 15;
      // the "oh!" after covering it
      const oh = bump(t, 0.39, 0.52);
      armF += oh * 70 * (1 - down * 0) ; armB += oh * 90;
      head += oh * -8;
      if (t > 0.26 && t < 0.6) { armF = 40 + oh * 90 + bump(t, 0.3, 0.39) * 130 + bump(t, 0.5, 0.58) * 130; armB += bump(t, 0.3, 0.39) * 150 + bump(t, 0.5, 0.58) * 150; }
      if (t >= 1.1) { armF = 55 + raise * 110 - setOn * 30; }
      // after the lamp is set: open arms in delight
      const joy = es(t, 1.5, 1.7);
      if (t >= 1.5) { armF = lerp(135, 60, joy) ; armB = 8 + joy * 50; head = -joy * 6; }

      // v22: point at each revealed thing
      const REV = [2.08, 2.3, 2.52, 2.74];
      const rev = REV.map((a) => es(t, a, a + 0.16));
      if (t >= 1.95) {
        const idx = t < REV[1] ? 0 : t < REV[2] ? 1 : t < REV[3] ? 2 : 3;
        const pt = bump(t, REV[idx] - 0.04, REV[idx] + 0.26) * seg(t, 2.02, 2.1);
        const aims = [[true, 95, 8], [false, 150, -14], [false, 120, -8], [false, 95, 4]];
        flip = t < 2.0 ? true : aims[idx][0];
        armF = lerp(60, aims[idx][1], pt); armB = lerp(58, 20, seg(t, 1.95, 2.05)); head = aims[idx][2] * pt;
        lean = 0;
      }
      const hostOut = es(t, 2.95, 3.2);

      // hand and lamp positions
      const hy = FEET + hostOut * 320;
      const hK = kneel > 0.5;
      const hp = hK ? hand(hx, FEET, 1, false, 70, 10, 46) : hand(hx, FEET, 1, flip, armF, lean);
      lampX = hp[0]; lampY = hp[1] - 2;
      if (t >= 0.18 && t < 0.64) {
        const inHand = t < 0.26 ? 1 - down : pick;
        lampX = lerp(floorSpot[0], hp[0], inHand); lampY = lerp(floorSpot[1], hp[1] - 2, inHand);
      }
      if (t >= 0.78 && t < 1.14) { lampX = lerp(hp[0], bedSpot[0], under); lampY = lerp(hp[1] - 2, bedSpot[1], under); }
      if (t >= 1.14) { lampX = lerp(hp[0], standTop[0], setOn); lampY = lerp(hp[1] - 2, standTop[1], setOn); }
      if (t >= 1.5) { lampX = standTop[0]; lampY = standTop[1]; }

      // bushel
      if (t >= 0.27) {
        const gp = hand(hx, FEET, 1, flip, armF, lean);
        if (cover1 <= 0) { bx = BUSH; by = FLOOR - 42 - grab * 8; }
        else {
          bx = lerp(BUSH, floorSpot[0], cover1); by = lerp(FLOOR - 50, FLOOR - 42, cover1) - Math.sin(cover1 * PI) * 230; br = 180 * cover1;
        }
        if (lift > 0) {
          bx = lerp(floorSpot[0], BUSH, lift); by = FLOOR - 42 - Math.sin(lift * PI) * 230; br = 180 + 180 * lift;
        }
        bushHeld = gp ? 1 : 0;
      }
      const bounce = bump(t, 0.58, 0.63) * 6;
      pose(bushEl, { x: bx, y: by - bounce, r: br, s: 1.2, ox: 0, oy: -35 });

      hostS.set({ x: hx, y: hy, s: 1, flip, o: (hK ? 0 : ho) * (1 - hostOut), armF, armB, lean, head, walk, blink });
      const shrug = bump(t, 0.88, 1.02);
      hostK.set({ x: hx, y: FEET, s: 1, o: hK ? 1 : 0, armF: 70 - shrug * 30, armB: shrug * 60, lean: 10 - shrug * 10, head: -shrug * 10, blink });

      // lamp
      const fl = 1 + Math.sin(time * 13) * 0.06 + Math.sin(time * 7.3) * 0.05;
      pose(lampEl, { x: lampX, y: lampY, s: 1.1 });
      pose(flame, { x: 35, y: -16, sx: 1 / fl, sy: fl, r: Math.sin(time * 5) * 4 });
      // lampstand flies in during beat 1
      const standIn = es(t, 1.08, 1.34, ease.out);
      swing(standEl, 660, lerp(-560, 666, standIn), time, 1.2 * (1 - standIn), 0.9);
      fade(standEl, seg(t, 1.02, 1.1));

      /* ---------- light & darkness ---------- */
      const lx = lampX + 38, ly = lampY - 30;
      const bushCover = es(t, 0.34, 0.39) * (1 - es(t, 0.5, 0.54));
      const bedCover = es(t, 0.83, 0.88) * (1 - es(t, 1.0, 1.05));
      const flood = es(t, 1.45, 1.8);
      const open = (1 - bushCover) * (1 - bedCover);
      const flick = 1 + (Math.sin(time * 9) * 0.03 + Math.sin(time * 5.3) * 0.02) * (1 - flood);
      const R = (230 + flood * 700 + es(t, 2, 3) * 500) * open * seg(t, -0.05, 0.08) + 1;
      attr(hole, 'cx', lx); attr(hole, 'cy', ly); attr(hole, 'r', R);
      attr(holeBed, 'rx', bedCover * 170 + 1); attr(holeBed, 'ry', bedCover * 40 + 1);
      const night = 0.76 - flood * 0.42 - es(t, 2.0, 2.95) * 0.34;
      fade(darkRect, night);
      spotEls.forEach((el, i) => fade(el, rev[i]));
      pools.forEach((p, i) => {
        const [x, y] = spots[i], away = rev[i];
        const dx = x - standTop[0], dy = y - standTop[1], L = Math.hypot(dx, dy);
        pose(p, { x: x + (dx / L) * away * 90, y: y + (dy / L) * away * 60, s: 1 - away * 0.6, o: flood * (1 - away) * 0.9 });
      });
      pose(glowEl, { x: lx, y: ly, s: (0.9 + flood * 1.6) * open * flick, o: seg(t, -0.05, 0.08) * (0.9 - flood * 0.2) });
      pose(wash, { x: lx, y: ly, s: 0.4 + flood * 0.6, o: flood * 0.3 });
      pose(raysEl, { x: lx, y: ly, s: 0.3 + flood * 0.9, r: t * 12, o: flood * (0.14 + bump(t, 1.45, 1.95) * 0.3) * (1 - es(t, 2.9, 3.3) * 0.5) });
      pose(leakBush, { x: floorSpot[0], y: FLOOR + 2, s: 1, o: bushCover * (0.75 + Math.sin(time * 11) * 0.12) });
      fade(leakBed, bedCover * (0.85 + Math.sin(time * 10) * 0.1));
      const puzzled = Math.max(bump(t, 0.39, 0.53), bump(t, 0.87, 1.04));
      pose(qEl, { x: hx + 40, y: (t < 0.7 ? FEET - 250 : FEET - 190) - puzzled * 12, s: 0.6 + ease.back(Math.min(1, puzzled * 2)) * 0.4, r: Math.sin(time * 2) * 6, o: Math.min(1, puzzled * 2.5) });
      fade(shaft, 0.07 * (1 - flood));
      swing(moonEl, 650, 225, time, 1.2, 0.6);

      /* ---------- v22: the hidden things come to light ---------- */
      pose(jarEl, { x: JAR - rev[0] * 4, y: FLOOR, r: -rev[0] * 80, ox: -26, oy: 0 });
      const hop = bump(t, REV[0] + 0.06, REV[0] + 0.2);
      pose(coinEl, { x: COIN, y: FLOOR - 10.5 - hop * 40, s: 1.5, sx: Math.cos(seg(t, REV[0] + 0.06, REV[0] + 0.2) * PI * 4), ox: 0, oy: -7 });
      pose(keyEl, { x: 1010, y: 232, r: Math.sin((t - REV[1]) * 22) * 18 * bump(t, REV[1], REV[1] + 0.5) + Math.sin(time * 1.3) * 1.5 });
      const unroll = es(t, REV[2], REV[2] + 0.2);
      pose(scrollSheetEl, { x: NX, y: 416, sy: 0.04 + unroll * 0.96 });
      pose(rodBottom, { x: NX, y: 416 + unroll * 84 });
      const wake = es(t, REV[3], REV[3] + 0.14);
      const perk = es(t, 3.3, 3.5);
      pose(catHead, { x: -32, y: -20 - wake * 8, r: 24 * (1 - wake) - perk * 6 + Math.sin(time * 0.8) * wake * 3, ox: 10, oy: 8 });
      fade(catOpen, wake > 0.5 ? 1 - blinkAt(time, 2) : 0);
      fade(catShut, wake > 0.5 ? blinkAt(time, 2) : 1);
      pose(catTail, { x: 38, y: -10, r: -30 + wake * (20 + Math.sin(time * 2.2) * 18) });
      pose(catEl, { x: CATX, y: 602 + Math.sin(time * 1.4) * 0.8 * (1 - wake), sy: 1 + Math.sin(time * 1.4) * 0.02 * (1 - wake), ox: 0, oy: 0 });
      sparks.forEach((sp, i) => {
        const a = REV[i] + 0.06;
        const pop = es(t, a, a + 0.12, ease.back);
        const so = seg(t, a, a + 0.05) * (1 - seg(t, 3.0, 3.3) * 0.7);
        if (so <= 0) { fade(sp, 0); return; }
        pose(sp, { x: SPARK_AT[i][0], y: SPARK_AT[i][1], s: pop * (1 + Math.sin(time * 4 + i) * 0.12), r: time * 20 + i * 30, o: so });
      });

      /* ---------- v23: Jesus and the disciples; "let him hear" ---------- */
      const rise = (a) => es(t, a, a + 0.22, ease.out);
      const lean23 = es(t, 3.35, 3.6);
      const listen = (p, x, fl, a, i, extra = {}) => {
        const r = rise(a);
        p.set({ x, y: FEET + (1 - r) * 330, s: 0.95, flip: fl, o: seg(t, a - 0.02, a + 0.06), lean: lean23 * (fl ? -7 : 7), head: lean23 * (fl ? 4 : -4) + Math.sin(time * 0.9 + i) * 1.5, blink: blinkAt(time, i + 1), ...extra });
      };
      listen(d1, P ? 515 : 370, false, 3.12, 1, { armF: 20 + lean23 * 30 });
      listen(d2, P ? 595 : 530, false, 3.06, 2, { armF: lean23 * 62, armB: 10 });
      listen(d3, P ? 975 : 1040, true, 3.09, 3, { armF: lean23 * 35 });
      listen(d4, P ? 1040 : 1170, true, 3.15, 4, { armF: lean23 * 75 });
      const jr = rise(3.02);
      const raiseJ = es(t, 3.22, 3.42);
      jesus.set({ x: 800, y: FEET + 2 + (1 - jr) * 340, s: 1.05, o: seg(t, 3.0, 3.08), armF: raiseJ * 112 + Math.sin(time * 1.2) * 4 * raiseJ, armB: 12 + raiseJ * 10, head: -raiseJ * 5, blink });
      const ringOn = es(t, 3.35, 3.55);
      const hxJ = 800 + 2 * 1.05, hyJ = FEET + 2 - 167 * 1.05 + (1 - jr) * 340;
      [ringsR, ringsL].forEach((arr, side) => arr.forEach((el, i) => {
        const k = ((time * 0.45 + i / 3) % 1);
        const kk = time ? k : (i + 1) / 3.5;
        pose(el, { x: hxJ + (side ? -6 : 6), y: hyJ, s: 0.8 + kk * 2.4, o: ringOn * (1 - kk) * 0.95 });
      }));
      const earIn = es(t, 3.3, 3.55, ease.back);
      if (earIn > 0.001) swing(earEl, 800, lerp(-420, 290, earIn), time, 2, 0.9); else pose(earEl, { x: 800, y: -420 });
      fade(earEl, seg(t, 3.28, 3.34));

      /* ---------- camera ---------- */
      const follow = t < 1.5 ? (lampX - 800) * 0.12 * seg(t, 0, 0.2) : 0;
      S.cam.x = Math.max(-50, Math.min(50, follow * (1 - es(t, 1.3, 1.6))));
      S.cam.z = 1 + es(t, 3.1, 3.6) * 0.1 + bump(t, 1.45, 2) * 0.03;
      S.cam.y = es(t, 3.1, 3.6) * 24;
    };
  },
};
