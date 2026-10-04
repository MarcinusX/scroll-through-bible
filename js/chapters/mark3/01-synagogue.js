// Mk 3,1–6 — the synagogue on the sabbath: a man with a withered hand, Pharisees watching from the
// benches, two questions hanging in the air, their silence, stone hearts — and the hand made whole.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { oilLamp, thornBush } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { pharisee, herodian, man, woman, shadowPerson, headAt, handAt, withFace, faceBits, witheredHand, stoneHeart, heart, tapeX, card, question, strip, sparkle, waxTablet } from './lib.js';

const PI = Math.PI;
const BENCH = 548;    // back benches (seat height)
const FLOOR = 668;    // where Jesus and the man stand
const FRONT = 716;    // front benches

/** a hanging bronze oil lamp: a bowl on three chains */
function hangingLamp(c) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [26, 0], [18, 14], [-18, 14]], 0.4, 5), C.ochre);
  s.p(c.cut(c.ell(0, 16, 10, 4, 10), 0.2, 3), shade(C.ochre, -0.25));
  s.x(c.ribbon([[-24, 0], [0, -46]], 1.2) + c.ribbon([[24, 0], [0, -46]], 1.2) + c.ribbon([[0, 2], [0, -46]], 1.2), shade(C.ochre, -0.35));
  const fl = (x) => `<g data-part="fl" transform="translate(${x} -2)"><path d="M0 0C-5 -5 -4 -12 0 -22C4 -12 5 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2 -5 -2 -8 0 -12C2 -8 2 -5 0 -2Z" fill="#fff4d2"/></g>`;
  return `<circle cy="-10" r="90" fill="url(#warm-glow)" opacity=".55"/>${s.out()}${fl(-14)}${fl(14)}`;
}
function menorah(c, x, y, sc = 1) {
  let d = c.ribbon([[x, y], [x, y - 60 * sc]], 4 * sc);
  [18, 34, 50].forEach((r) => { d += c.ribbon(c.arc(x, y - 60 * sc, r * sc, r * sc, 0, PI, 10), 3.4 * sc); });
  d += c.cut([[x - 14 * sc, y + 2], [x + 14 * sc, y + 2], [x + 6 * sc, y - 8 * sc], [x - 6 * sc, y - 8 * sc]], 0.3, 4);
  let fl = '';
  [-50, -34, -18, 0, 18, 34, 50].forEach((dx) => { fl += c.cut(c.ell(x + dx * sc, y - 60 * sc - (dx ? Math.sqrt(2500 - dx * dx) * 0 : 0) - 8 * sc, 3 * sc, 6 * sc, 8), 0.2, 3); });
  return { d, fl };
}
/** two sabbath candles on a little tag */
function sabbathTag(c) {
  const s = sheet();
  s.p(c.cut([[-58, 8], [58, 8], [64, 18], [64, 92], [-64, 92], [-64, 18]], 0.5, 6), C.cream);
  s.p(c.cut(c.rect(-56, 22, 112, 64), 0.3, 6), C.parchment);
  s.x(c.poly(c.circ(0, 14, 3.2, 10)), C.wood2);
  const cd = sheet();
  [-14, 14].forEach((x) => {
    cd.p(c.cut(c.rect(x - 5, 44, 10, 26), 0.2, 4), C.linen);
    cd.p(c.cut([[x - 10, 70], [x + 10, 70], [x + 7, 76], [x - 7, 76]], 0.2, 4), C.ochre);
  });
  let fl = '';
  [-14, 14].forEach((x) => { fl += `<path d="M${x} 44C${x - 4} 40 ${x - 3} 34 ${x} 28C${x + 3} 34 ${x + 4} 40 ${x} 44Z" fill="${C.lampFlame}"/>`; });
  return `${s.out()}<circle cx="0" cy="40" r="34" fill="url(#warm-glow)" opacity=".7"/>${cd.out()}${fl}<g transform="translate(0 112)">${strip(c, tr('szabat', 'Sabbath'), { size: 17 })}</g>`;
}
function thornKnot(c) {
  const s = sheet();
  s.p(c.cut(c.star(0, 0, 30, 14, 9, 0.2), 1.2, 4), C.thorn2);
  s.p(c.cut(c.star(0, 0, 18, 9, 7, 0.6), 0.8, 3), shade(C.thorn2, -0.25));
  return s.out();
}
function snuffedLamp(c) {
  const lamp = oilLamp(c).replace(/<circle class="glow"[^>]*\/>/, '').replace(/<g class="flame"[\s\S]*<\/g><\/g>$/, '</g>');
  const smoke = c.ribbon(c.cbez([35, -18], [26, -36], [46, -48], [34, -70], 12), (t) => 4 - t * 3);
  return `${lamp}<path d="${smoke}" fill="${C.rock2}" opacity=".85"/>`;
}

export default {
  id: 'm3-synagogue',
  beats: [
    { cover: true },
    { v: 1, text: 'Wszedł znowu do synagogi.' },
    { v: 1, cont: true, text: 'Był tam człowiek, który miał uschłą rękę.' },
    { v: 2 },
    { v: 3 },
    { v: 4, text: 'A do nich powiedział: «Co wolno w szabat: uczynić coś dobrego czy coś złego?' },
    { v: 4, cont: true, text: 'Życie ocalić czy zabić?»' },
    { v: 4, cont: true, text: 'Lecz oni milczeli.' },
    { v: 5, text: 'Wtedy spojrzawszy wkoło po wszystkich z gniewem, zasmucony z powodu zatwardziałości ich serca,' },
    { v: 5, cont: true, text: 'rzekł do człowieka: «Wyciągnij rękę!».' },
    { v: 5, cont: true, text: 'Wyciągnął, i ręka jego stała się znów zdrowa.' },
    { v: 6 },
  ],
  cam: { x: [-30, 60], y: [-20, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: the outermost benches, and the plot, come inside the screen
    sky(S, ['#cfe2df', '#eee5cc', '#f7ead3']);

    /* ---------- the hall: back wall with high windows, the ark of the scrolls ---------- */
    const wallL = S.layer({ par: 0.16, sh: 3 });
    const winL = [[500, 268], [500, 188], ...c.arc(545, 188, 45, 44, PI, 2 * PI, 10), [590, 268]];
    const winR = [[1010, 268], [1010, 188], ...c.arc(1055, 188, 45, 44, PI, 2 * PI, 10), [1100, 268]];
    const winC = [[770, 238], [770, 196], ...c.arc(800, 196, 30, 30, PI, 2 * PI, 10), [830, 238]];
    const wall = sheet();
    wall.p(c.cut([[-900, -900], [2500, -900], [2500, 600], [-900, 600]], 1, 30) + c.hole(winL, 0.6, 7) + c.hole(winR, 0.6, 7) + c.hole(winC, 0.5, 6), C.plaster);
    let blocks = '';
    for (let r = 0; r < 12; r++) {
      const y = 96 + r * 38;
      blocks += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.3);
      for (let x = -880 + (r % 2) * 40; x < 2500; x += c.rr(70, 100)) blocks += c.ribbon([[x, y], [x + c.rr(-1, 1), y + 38]], 1.2);
    }
    wall.x(blocks, C.plaster2, 'opacity=".75"');
    // a painted frieze band and a darker dado
    wall.p(c.cut([[-900, 300], [2500, 300], [2500, 316], [-900, 316]], 0.6, 12), mix(C.ochre, C.plaster, 0.45));
    let meander = '';
    for (let x = -880; x < 2500; x += 26) meander += c.poly(c.rect(x, 304, 12, 8));
    wall.x(meander, mix(C.terracotta, C.plaster, 0.3), 'opacity=".55"');
    wall.p(c.cut([[-900, 470], [2500, 470], [2500, 600], [-900, 600]], 0.8, 12), C.plaster2);
    // window sills and lattices
    wall.p(c.ribbon([[494, 270], [596, 270]], 8) + c.ribbon([[1004, 270], [1106, 270]], 8) + c.ribbon([[764, 240], [836, 240]], 7), C.wood2);
    let lat = '';
    [[545, 188, 45], [1055, 188, 45]].forEach(([x, y, r]) => { lat += c.ribbon([[x, y - r], [x, 268]], 3.4) + c.ribbon([[x - r, 222], [x + r, 222]], 3.4); });
    lat += c.ribbon([[800, 166], [800, 238]], 3) + c.ribbon([[770, 206], [830, 206]], 3);
    wall.p(lat, C.wood2);
    // menorah reliefs on the wall
    [[400, 450], [1200, 450]].forEach(([x, y]) => { const m = menorah(c, x, y, 0.9); wall.p(m.d, mix(C.ochre, C.plaster2, 0.35)); });
    wallL.add(wall.out());

    /* light falling through the windows */
    const light = S.layer({ par: 0.18, sh: 1, flat: true });
    const beam = (x, w, dx) => c.poly([[x - w / 2, 230], [x + w / 2, 230], [x + w / 2 + dx + 90, 700], [x - w / 2 + dx - 40, 700]]);
    light.add(`<path d="${beam(545, 80, 190)}${beam(1055, 80, 190)}${beam(800, 50, 120)}" fill="#fff4d6" opacity=".22"/>`);

    /* the ark with its curtain, two columns */
    const ark = S.layer({ par: 0.22, sh: 5 });
    const a = sheet();
    a.p(c.cut([[716, 520], [716, 330], ...c.arc(800, 330, 84, 70, PI, 2 * PI, 14), [884, 330], [884, 520]], 0.6, 7), C.stone2);
    a.p(c.cut([[734, 510], [734, 336], ...c.arc(800, 336, 66, 54, PI, 2 * PI, 12), [866, 336], [866, 510]], 0.5, 7), C.wood2);
    const drape = [[738, 350], [862, 350]];
    for (let x = 862; x >= 738; x -= 15.5) drape.push([x, 506 + ((x / 15.5) % 2 ? 4 : 0)]);
    a.p(c.cut(drape, 0.6, 7), C.dustyBlue);
    let folds = '';
    for (let x = 752; x < 860; x += 18) folds += c.ribbon([[x, 354], [x + c.rr(-2, 2), 502]], 3);
    a.x(folds, shade(C.dustyBlue, -0.15), 'opacity=".6"');
    a.p(c.ribbon([[738, 352], [862, 352]], 8) + c.ribbon([[740, 494], [860, 494]], 5), C.ochre);
    let ros = '';
    for (let i = 0; i < 8; i++) { const an = (i / 8) * PI * 2; ros += c.cut(c.ell(800 + Math.cos(an) * 11, 420 + Math.sin(an) * 11, 8, 4.5, 10, an), 0.2, 3); }
    a.p(ros, C.sun).p(c.cut(c.circ(800, 420, 5.5, 10), 0.2, 3), C.ochre);
    a.p(c.cut([[704, 520], [896, 520], [904, 540], [696, 540]], 0.5, 8), C.stone);
    ark.add(a.out());
    const col = (x) => sheet()
      .p(c.cut([[x - 22, 548], [x - 18, 150], [x + 18, 150], [x + 22, 548]], 0.6, 8), C.stone)
      .x(c.ribbon([[x - 8, 160], [x - 7, 540]], 2) + c.ribbon([[x + 6, 160], [x + 7, 540]], 2), shade(C.stone, -0.12), 'opacity=".8"')
      .p(c.cut([[x - 34, 150], [x + 34, 150], [x + 26, 132], [x - 26, 132]], 0.5, 6) + c.cut([[x - 30, 548], [x + 30, 548], [x + 26, 532], [x - 26, 532]], 0.5, 6), C.stone2).out();
    ark.add(col(640) + col(960) + col(300) + col(1300));

    /* hanging lamps */
    const lampL = S.layer({ par: 0.24, sh: 4 });
    const lamps = [[560, 340], [1040, 340]].map(([x, y], i) => ({ x, y, i, el: hanging(lampL, hangingLamp(c), { x, y, len: 600 }) }));
    lamps.forEach((l) => { l.fl = Array.from(l.el.querySelectorAll('[data-part="fl"]')); });

    /* ---------- the floor and the stone benches along the walls ---------- */
    const hall = S.layer({ par: 0.3, sh: 4 });
    const fl = sheet();
    fl.p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.stone2, 0.4));
    let pav = '';
    for (let r = 0; r < 9; r++) { const y = 580 + r * r * 7 + r * 16; pav += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4); }
    for (let i = -14; i < 16; i++) pav += c.ribbon([[800 + i * 58, 562], [800 + i * 150, 1100]], 1.2);
    fl.x(pav, shade(C.stone2, -0.1), 'opacity=".45"');
    // a mosaic rosette in the middle of the floor
    fl.p(c.cut(c.ell(800, 700, 150, 36, 30), 0.6, 8), mix(C.stone2, C.ochre, 0.2));
    fl.p(c.cut(c.ell(800, 700, 110, 25, 26), 0.5, 8), mix(C.stone, C.dustyBlue, 0.25));
    fl.x(c.poly(c.star(800, 700, 70, 24, 8, 0).map(([x, y]) => [x, 700 + (y - 700) * 0.24])), mix(C.ochre, C.stone, 0.3), 'opacity=".8"');
    hall.add(fl.out());
    const bench = (x0, x1) => sheet()
      .p(c.cut([[x0, 500], [x1, 500], [x1, 520], [x0, 520]], 0.5, 10), C.stone2)
      .p(c.cut([[x0, 520], [x1, BENCH - 6], [x1, 580], [x0, 580]].map(([x, y], i) => [x, i === 1 ? 520 : y]), 0.5, 10), C.stone)
      .p(c.cut([[x0 - 6, BENCH - 6], [x1 + 6, BENCH - 6], [x1 + 6, BENCH + 4], [x0 - 6, BENCH + 4]], 0.4, 10), C.stone2)
      .p(c.cut([[x0, BENCH + 4], [x1, BENCH + 4], [x1, 590], [x0, 590]], 0.5, 10), shade(C.stone, -0.06)).out();
    hall.add(bench(-900, 668) + bench(932, 2500));

    /* ---------- the Pharisees on the benches ---------- */
    const phL = S.layer({ par: 0.3, sh: 4 });
    const PH = [
      { x: P ? 482 : 425, s: 0.72 }, { x: P ? 546 : 510, s: 0.74 }, { x: P ? 610 : 596, s: 0.72 },
      { x: P ? 948 : 1004, s: 0.72 }, { x: P ? 994 : 1090, s: 0.74 }, { x: P ? 1040 : 1175, s: 0.72 },
    ].map((m, i) => {
      const look = pharisee(c, i);
      m.i = i; m.flip = m.x > 800; m.dir = m.flip ? -1 : 1; m.seed = c.rr(0, 9); m.y = BENCH;
      m.sit = S.puppet(phL.add(person(c, { ...look, pose: 'sit', holdF: i === 1 ? `<g transform="translate(8 -4) rotate(-20)">${waxTablet(c)}</g>` : '' })));
      m.stand = S.puppet(phL.add(person(c, { ...look })));
      m.heart = phL.add(`<g opacity="0">${stoneHeart(c, 26)}</g>`);
      m.tape = phL.add(`<g opacity="0">${tapeX(c, 26)}</g>`);
      m.away = 1750 + i * 70;
      return m;
    });

    /* they watch him: dotted lines of looking, from every eye to Jesus */
    let gz = '';
    PH.forEach((m) => {
      const [ex, ey] = headAt(m.x, BENCH, m.s, m.flip, 'sit');
      const x0 = ex + m.dir * 10 * m.s, y0 = ey - 3 * m.s, x1 = 832 - m.dir * 16, y1 = FLOOR - 186;
      const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 16);
      for (let i = 1; i < n - 1; i++) { const u = i / n, u2 = (i + 0.45) / n; gz += c.ribbon([[lerp(x0, x1, u), lerp(y0, y1, u)], [lerp(x0, x1, u2), lerp(y0, y1, u2)]], 2.2); }
    });
    const gaze = phL.add(`<g opacity="0"><path d="${gz}" fill="${C.inkSoft}" opacity=".45"/></g>`);

    /* ---------- the question cards ---------- */
    const cardL = S.layer({ par: 0.4, sh: 6 });
    const lampIcon = `<g transform="translate(-4 14)">${oilLamp(c).replace(/<circle class="glow"[^>]*\/>/, '')}</g>`;
    const CARDS = [
      { x: 630, y: 190, f1: card(c, `<g transform="translate(0 4)">${heart(c, 30)}</g>`, tr('dobro', 'do good')), f2: card(c, lampIcon, tr('ocalić życie', 'save a life')) },
      { x: 970, y: 190, f1: card(c, thornKnot(c), tr('zło', 'do harm'), { face: mix(C.parchment, C.rock2, 0.3) }), f2: card(c, `<g transform="translate(-4 14)">${snuffedLamp(c)}</g>`, tr('zabić', 'kill'), { face: mix(C.parchment, C.rock2, 0.3) }) },
    ].map((cd, i) => {
      cd.i = i;
      cd.el = hanging(cardL, `<g data-part="f1">${cd.f1}</g><g data-part="f2" opacity="0">${cd.f2}</g>`, { x: cd.x, y: cd.y, len: 500 });
      cd.a = cd.el.querySelector('[data-part="f1"]'); cd.b = cd.el.querySelector('[data-part="f2"]');
      return cd;
    });
    const qEl = hanging(cardL, `<g transform="scale(1.5)">${question(c)}</g>`, { x: 800, y: 205, len: 500 });
    const sabbath = hanging(cardL, sabbathTag(c), { x: 800, y: 120, len: 500 });

    /* ---------- the people in front: congregation, the man, Jesus ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const frontBench = (x0, x1) => sheet().p(c.cut([[x0, FRONT - 4], [x1, FRONT - 4], [x1, FRONT + 8], [x0, FRONT + 8]], 0.4, 8), C.wood)
      .p(c.cut([[x0 + 10, FRONT + 8], [x0 + 22, FRONT + 8], [x0 + 20, FRONT + 60], [x0 + 12, FRONT + 60]], 0.3, 6) + c.cut([[x1 - 22, FRONT + 8], [x1 - 10, FRONT + 8], [x1 - 12, FRONT + 60], [x1 - 20, FRONT + 60]], 0.3, 6), C.wood2).out();
    act.add(frontBench(300, 640) + frontBench(1000, 1320));
    const glowMan = act.add(`<ellipse cx="0" cy="0" rx="120" ry="150" fill="url(#warm-glow)" opacity="0"/>`);
    const FOLK = [
      { x: P ? 462 : 405, o: woman(c, { robe: C.roseRobe, veil: C.skyVeil }), s: 0.9 },
      { x: P ? 512 : 478, o: man(c), s: 0.92 },
      { x: P ? 1004 : 1082, o: man(c), s: 0.92 },
      { x: P ? 1048 : 1160, o: woman(c, { veil: C.blushVeil }), s: 0.9 },
    ].map((f, i) => ({ ...f, i, flip: f.x > 800, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...f.o, pose: 'sit' }))) }));
    const manLook = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
    const hand = witheredHand(c);
    const manSit = S.puppet(act.add(person(c, { ...manLook, pose: 'sit', holdF: hand })));
    const manStand = S.puppet(act.add(person(c, { ...manLook, holdF: witheredHand(c) })));
    const handParts = (p) => ({ w: p.el.querySelector('[data-part="wither"]'), h: p.el.querySelector('[data-part="well"]') });
    const hSit = handParts(manSit), hStand = handParts(manStand);
    const heal = act.add(`<g opacity="0"><circle r="130" fill="url(#warm-glow)"/>${[0, 1, 2, 3, 4].map((i) => `<g data-part="sp" data-i="${i}">${sparkle(c, 10 + (i % 3) * 4)}</g>`).join('')}</g>`);
    const healSp = Array.from(heal.querySelectorAll('[data-part="sp"]'));
    const thread = act.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [1, 0]], 4)}" fill="${C.lampGlow}"/></g>`);
    const jesusEl = act.add(withFace(person(c, { ...CAST.jesus }), faceBits(c)));
    const jesus = S.puppet(jesusEl);
    const angry = jesusEl.querySelector('[data-part="angry"]'), sad = jesusEl.querySelector('[data-part="sad"]'), tear = jesusEl.querySelector('[data-part="tear"]');

    /* ---------- meanwhile, outside: a shadow-play of the plot ---------- */
    const insetL = S.layer({ par: 0.34, sh: 7 });
    const fr = sheet();
    fr.p(c.cut(c.rect(-150, 0, 300, 196), 0.6, 8), C.wood2);
    fr.p(c.cut(c.rect(-138, 12, 276, 172), 0.5, 8), mix(C.lampGlow, C.apricot, 0.35));
    const back = `<ellipse cx="0" cy="120" rx="150" ry="90" fill="url(#warm-glow)"/>`;
    const SIL = [
      { o: pharisee(c, 0), x: -92, flip: false }, { o: herodian(c, 0), x: -40, flip: false },
      { o: herodian(c, 1), x: 40, flip: true }, { o: pharisee(c, 3), x: 94, flip: true },
    ];
    const silMk = SIL.map((m, i) => `<g data-part="sil" data-i="${i}">${shadowPerson(c, m.o)}</g>`).join('');
    const doorway = sheet().p(c.cut([[-138, 184], [-138, 60], [-110, 30], [-80, 60], [-80, 184]], 0.4, 6), mix(C.apricot, C.ochre, 0.2)).out();
    const scheme = sheet().p(c.cut(c.blob(0, 0, 46, 22, 14, 0.2), 1.4, 4), '#3b2a22').x(c.ribbon(c.cbez([-30, 0], [-10, -18], [10, 18], [30, -2], 14), 2.4), mix(C.apricot, C.ochre, 0.3)).out();
    const inset = hanging(insetL, `${fr.out()}<g>${back}${doorway}</g><g transform="translate(0 182)">${silMk}</g><g data-part="scheme" opacity="0" transform="translate(0 70)">${scheme}</g><g transform="translate(0 214)">${strip(c, tr('narada', 'the plot'), { size: 17 })}</g>`, { x: P ? 900 : 1010, y: 160, len: 700 });
    const INX = P ? 900 : 1010;
    const sils = Array.from(inset.querySelectorAll('[data-part="sil"]')).map((el, i) => ({ ...SIL[i], p: S.puppet(el.firstElementChild), seed: c.rr(0, 9) }));
    const schemeEl = inset.querySelector('[data-part="scheme"]');

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      lamps.forEach((l) => {
        pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.7 + l.i * 2) * 1.2 });
        l.fl.forEach((f, k) => pose(f, { x: k ? 14 : -14, y: -2, sx: 1 + Math.sin(T * 7 + k) * 0.08, sy: 1 + Math.sin(T * 5.3 + k * 2) * 0.1 }));
      });

      /* ---------- Jesus ---------- */
      const walk = es(t, 1.0, 1.75, ease.sine);
      const jx = lerp(250, 832, walk);
      // beat 8: he looks around at all of them — left, right, left
      const look = seg(t, 8.05, 8.85);
      const lookFlip = look > 0 && look < 1 ? Math.sin(look * PI * 2.4) > 0 : null;
      const toPh = es(t, 5.02, 5.3) * (1 - es(t, 7.9, 8.05));
      const beckon = bump(t, 4.0, 4.8);
      const stretch = es(t, 9.05, 9.4) * (1 - es(t, 10.7, 11.2));
      const open = toPh * (0.7 + 0.3 * Math.sin(Math.min(1, seg(t, 5.1, 6.9)) * PI * 3));
      let flip = walk >= 1 && t < 5.02 ? true : walk < 1 ? false : true;
      if (toPh > 0.5) flip = seg(t, 5.9, 6.1) > 0 && t < 7 ? false : true; // turns to the right-hand benches for the second pair
      if (lookFlip !== null) flip = lookFlip;
      if (t >= 8.85) flip = true;
      jesus.set({
        x: jx, y: FLOOR, s: 1.06, flip,
        walk: walk > 0 && walk < 1 ? jx * 0.055 : undefined,
        armF: 12 + beckon * 70 + open * 58 + stretch * 80 + bump(t, 10.4, 11) * -10 + Math.sin(T * 1.1) * 2,
        armB: 8 + open * 48 + beckon * 12 + es(t, 7.2, 7.6) * (1 - es(t, 8, 8.2)) * 10,
        head: -2 + beckon * 4 - stretch * 4 + look * 0 + Math.sin(T * 0.7) * 1.2,
        blink: blinkAt(T, 2),
      });
      fade(angry, es(t, 8.02, 8.2) * (1 - es(t, 8.55, 8.75)));
      fade(sad, es(t, 8.55, 8.75) * (1 - es(t, 9.6, 9.9)));
      fade(tear, es(t, 8.6, 8.8) * (1 - es(t, 9.5, 9.8)));

      /* ---------- the man with the withered hand ---------- */
      const up = es(t, 4.2, 4.27);
      const mWalk = es(t, 4.3, 4.85);
      const mx = lerp(566, 668, mWalk), my = lerp(FRONT, FLOOR, mWalk), ms = lerp(0.92, 0.98, mWalk);
      const reach = es(t, 10.0, 10.35) * (1 - es(t, 10.85, 11.2) * 0.6);
      const well = es(t, 10.28, 10.55);
      const joy = es(t, 10.62, 10.95);
      const shy = bump(t, 2.05, 2.95);
      manSit.set({ x: 566, y: FRONT, s: 0.92, o: 1 - up, armF: 30 + shy * 40, head: shy * 10 + es(t, 3.9, 4.2) * 4, blink: blinkAt(T, 5) });
      const tremble = bump(t, 9.2, 10) * Math.sin(T * 16) * 3;
      manStand.set({
        x: mx, y: my, s: ms, o: up,
        walk: mWalk > 0 && mWalk < 1 ? mx * 0.06 : undefined,
        armF: 34 * (1 - reach) + reach * 92 + joy * 26 + tremble, armB: joy * 140 + es(t, 5.1, 5.3) * (1 - es(t, 9.9, 10.1)) * 20,
        head: -3 - bump(t, 9.1, 9.9) * 5 + joy * -8, lean: joy * -4, blink: blinkAt(T, 5),
      });
      [hSit, hStand].forEach((h) => { fade(h.w, 1 - well); fade(h.h, well); });
      const [gx, gy] = headAt(566, FRONT, 0.92, false, 'sit');
      pose(glowMan, { x: up > 0.5 ? mx : gx, y: up > 0.5 ? my - 100 : gy + 50, o: bump(t, 1.95, 3.1) * 0.9 + bump(t, 9.9, 11.4) * 0.7 });
      const [hx, hy] = handAt(mx, my, ms, false, 34 * (1 - reach) + reach * 92 + joy * 26);
      fade(heal, bump(t, 10.2, 11.3));
      healSp.forEach((sp, i) => {
        const k = seg(t, 10.25 + i * 0.05, 10.95 + i * 0.05);
        const a = i * 1.3 + 0.4;
        pose(sp, { x: Math.cos(a) * k * 60, y: Math.sin(a) * k * 50 - k * 20, s: Math.sin(k * PI), r: k * 90 });
      });
      pose(heal, { x: hx, y: hy });

      // a thread of light from his outstretched hand to the man's hand
      const [jhx, jhy] = handAt(jx, FLOOR, 1.06, true, 12 + stretch * 80);
      const th = es(t, 9.35, 9.7) * (1 - es(t, 10.35, 10.6));
      pose(thread, { x: hx, y: hy, sx: Math.hypot(jhx - hx, jhy - hy) * th, sy: 1, r: (Math.atan2(jhy - hy, jhx - hx) * 180) / PI, o: th > 0.01 ? 0.85 : 0 });
      fade(gaze, es(t, 3.15, 3.45) * (1 - es(t, 4.0, 4.2)));

      /* ---------- the congregation ---------- */
      FOLK.forEach((f) => {
        const wonder = es(t, 10.45 + f.i * 0.05, 10.8 + f.i * 0.05);
        f.p.set({ x: f.x, y: FRONT, s: f.s, flip: f.flip, armF: wonder * (f.i % 2 ? 70 : 40) + bump(t, 1.2, 1.9) * 10, armB: wonder * (f.i % 2 ? 20 : 110), head: -wonder * 6 + bump(t, 2.1, 2.9) * (f.flip ? 6 : -6), lean: wonder * (f.flip ? 3 : -3), blink: blinkAt(T, f.seed) });
      });

      /* ---------- the Pharisees ---------- */
      PH.forEach((m) => {
        const narrow = es(t, 3.05 + m.i * 0.05, 3.3 + m.i * 0.05) * (1 - es(t, 10.9, 11.1));
        const rise = es(t, 11.05 + (m.flip ? 0 : 0.12), 11.12 + (m.flip ? 0 : 0.12));
        const go = es(t, 11.15 + m.i * 0.03 + (m.flip ? 0 : 0.15), 11.8 + m.i * 0.02);
        const x = lerp(m.x, m.away, ease.in(go));
        const writing = m.i === 1 ? es(t, 3.2, 3.4) * (1 - es(t, 4.8, 5)) : 0;
        const silent = es(t, 7.05 + m.i * 0.06, 7.3 + m.i * 0.06);
        const turnAway = silent * (1 - es(t, 8, 8.3)) * (m.i % 2 ? 8 : -6);
        const bl = Math.max(narrow * 0.58, blinkAt(T, m.seed));
        m.sit.set({
          x: m.x, y: m.y, s: m.s, flip: m.flip, o: 1 - rise,
          armF: 10 + writing * (50 + Math.sin(T * 9) * 6) + bump(t, 3.5 + m.i * 0.1, 4.4) * (m.i === 4 ? 40 : 0) + silent * 22,
          armB: silent * 30,
          head: narrow * (m.flip ? -4 : 4) + turnAway + bump(t, 3.2, 4.2) * (m.i === 0 || m.i === 5 ? 8 : 0) + es(t, 8.2, 8.6) * -5,
          lean: bump(t, 3.3, 4.2) * (m.i === 0 ? 8 : m.i === 5 ? -8 : 0),
          blink: bl,
        });
        m.stand.set({ x, y: m.y, s: m.s, flip: go > 0 ? false : m.flip, o: rise * (1 - seg(go, 0.85, 1)), walk: go > 0 && go < 1 ? x * 0.06 : undefined, head: 4, blink: bl });
        const [hx2, hy2] = rise > 0.5 ? headAt(x, m.y, m.s, go > 0 ? false : m.flip) : headAt(m.x, m.y, m.s, m.flip, 'sit');
        const tdir = (rise > 0.5 ? (go > 0 ? 1 : m.dir) : m.dir);
        pose(m.tape, { x: hx2 + tdir * 9 * m.s, y: hy2 + 8 * m.s, s: m.s * 1.1 * lerp(1.6, 1, es(t, 7.1 + m.i * 0.06, 7.3 + m.i * 0.06, ease.back)), r: -8 * tdir, o: silent * (1 - es(t, 7.9, 8.1)) });
        // stone hearts appear as his gaze passes over them
        const gazeAt = m.flip ? 8.1 + (m.i - 3) * 0.07 : 8.32 + m.i * 0.07;
        const st = es(t, gazeAt, gazeAt + 0.15, ease.back) * (1 - rise);
        const [cx, cy] = [m.x + m.dir * 4 * m.s, m.y - 56 * m.s];
        pose(m.heart, { x: cx, y: cy, s: m.s * st, r: Math.sin(T * 0.8 + m.seed) * 3, o: st > 0.01 ? 1 : 0 });
      });

      /* ---------- cards: good / harm, then life / death ---------- */
      pose(sabbath, { x: 800, y: lerp(-250, 150, es(t, 3.05, 3.45, ease.back)) - es(t, 4.9, 5.2) * 400, r: Math.sin(T * 0.8) * 2, o: t > 3 && t < 5.3 ? 1 : 0 });
      CARDS.forEach((cd) => {
        const drop = es(t, 5.1 + cd.i * 0.18, 5.5 + cd.i * 0.18, ease.back) * (1 - es(t, 8.02, 8.35));
        const k = seg(t, 6.05 + cd.i * 0.1, 6.35 + cd.i * 0.1);
        const still = 1 - es(t, 7, 7.3) * 0.8;
        pose(cd.el, { x: cd.x, y: lerp(-320, cd.y, drop), sx: Math.max(0.04, Math.abs(Math.cos(k * PI))), r: Math.sin(T * 0.8 + cd.i * 1.7) * 2.2 * still, o: drop > 0.001 ? 1 : 0 });
        fade(cd.a, k < 0.5 ? 1 : 0); fade(cd.b, k < 0.5 ? 0 : 1);
      });
      const qd = es(t, 5.3, 5.6, ease.back) * (1 - es(t, 8.02, 8.3));
      pose(qEl, { x: 800, y: lerp(-300, 225, qd), r: Math.sin(T * 1.1) * 4 * (1 - es(t, 7, 7.3) * 0.8), s: 1 + bump(t, 7.0, 7.9) * 0.08, o: qd > 0.001 ? 1 : 0 });

      /* ---------- the plot, seen as a shadow-play ---------- */
      const inD = es(t, 11.3, 11.7, ease.out);
      pose(inset, { x: INX, y: lerp(-400, 150, inD), r: Math.sin(T * 0.6) * 1.2, o: inD > 0.001 ? 1 : 0 });
      const huddle = es(t, 11.5, 11.9);
      sils.forEach((m, i) => {
        m.p.set({ x: m.x * lerp(1.15, 0.8, huddle), y: 0, s: 0.52, flip: m.flip, lean: (m.flip ? -1 : 1) * huddle * 12, head: huddle * 14 + Math.sin(T * 3 + m.seed) * 3 * huddle, armF: huddle * (i % 2 ? 60 : 30) + Math.sin(T * 2.4 + m.seed) * 8 * huddle, blink: 0 });
      });
      pose(schemeEl, { x: 0, y: 72, s: 0.5 + huddle * 0.5 + Math.sin(T * 1.7) * 0.04, r: Math.sin(T * 0.9) * 6, o: huddle * 0.95 });

      /* ---------- camera ---------- */
      S.cam.z = 1 + es(t, 1.8, 2.5) * 0.05 - es(t, 4.5, 5.2) * 0.05 + es(t, 8.9, 9.5) * 0.12 - es(t, 10.9, 11.4) * 0.12;
      S.cam.y = es(t, 1.8, 2.5) * 30 - es(t, 4.5, 5.2) * 40 + es(t, 8.9, 9.5) * 60 - es(t, 10.9, 11.4) * 50;
      S.cam.x = es(t, 1.8, 2.5) * -20 + es(t, 4.5, 5.2) * 20 + es(t, 8.9, 9.5) * -10 + es(t, 10.9, 11.4) * 40;
    };
  },
};
