// Łk 6,27–30 — a painted flat of a village lane, two houses facing each other: on the left the house of a man with
// a fig tree by his door, on the right the house of his neighbour, who hates him. "Love your enemies, do good to those
// who hate you": the neighbour glares from his door under a black scribble of hate, and the man picks a basket of figs
// and carries it over to his door — a heart goes ahead of him. "Bless those who curse you, pray for those who abuse
// you": the neighbour shouts a jagged black curse; the man lifts his hand and answers with a golden blessing; the
// neighbour kicks the basket over and throws a clod of mud — and the man kneels in the lane and prays for him, a
// thread of light going up from him and coming down over his neighbour's roof. "If anyone strikes you on the cheek,
// offer the other": the slap — and he turns and offers the other cheek. "From him who takes your cloak do not withhold
// your tunic": the neighbour pulls the cloak off his shoulders — and he holds out his tunic too. "Give to everyone who
// asks": a beggar and his boy come by, and he gives them bread and a coin; and the neighbour walks off with the cloak
// — he does not call after him to give it back, he only lifts his open hand.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, bush, grass, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { HERO, HERO_BARE, ENEMY, AFTERNOON, kf, moving, headAt, handAt, heart, bubble, contentBasket, loaf, coin, jug, cloak, question, sparkle, storyFrame, halo, sinKnot, manO, tr, PI } from './lib.js';

const GY = 704;
const HX = 700, EX = 930;       // where they stand when they meet

function facade(c, x, w, h, { col = C.plaster, door = C.wood } = {}) {
  const s = sheet();
  const dw = 70, dh = 130, dx = x + w * 0.5;
  s.p(c.cut([[x, GY + 6], [x, GY - h], [x + w, GY - h - 4], [x + w, GY + 6]], 0.8, 10), col);
  s.p(c.cut([[x - 10, GY - h - 16], [x + w + 10, GY - h - 20], [x + w + 10, GY - h], [x - 10, GY - h + 4]], 0.5, 10), C.roof);
  s.p(c.cut([[dx - dw / 2, GY + 2], [dx - dw / 2, GY - dh + dw / 2], ...c.arc(dx, GY - dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 10), [dx + dw / 2, GY - dh + dw / 2], [dx + dw / 2, GY + 2]], 0.4, 6), door);
  s.x(c.ribbon([[dx, GY - dh + 8], [dx, GY]], 1.4), shade(door, -0.3), 'opacity=".6"');
  s.p(c.cut(c.rect(x + w * 0.14, GY - h + 40, 40, 34), 0.3, 5), C.soilDark);
  s.p(c.cut([[x - 6, GY], [x + w + 6, GY], [x + w + 4, GY + 12], [x - 4, GY + 12]], 0.4, 8), C.stone2);
  return s.out();
}
function mudClod(c) { return sheet().p(c.cut(c.blob(0, 0, 11, 8, 9, 0.3), 0.8, 3), mix(C.soil, C.clay, 0.3)).out(); }
function curse(c) {
  // a jagged black shout full of scribbles
  const s = sheet();
  const p = [];
  for (let i = 0; i < 18; i++) { const a = (i / 18) * PI * 2, r = i % 2 ? 0.74 : 1.14; p.push([Math.cos(a) * 58 * r, -48 + Math.sin(a) * 40 * r]); }
  s.p(c.cut(p, 0.5, 4) + c.cut([[-10, -14], [8, 6], [4, -12]], 0.3, 3), '#3b3346');
  let sc = '';
  for (let i = 0; i < 4; i++) sc += c.ribbon(c.cbez([c.rr(-40, -10), c.rr(-70, -30)], [c.rr(-20, 20), c.rr(-80, -20)], [c.rr(-20, 20), c.rr(-80, -20)], [c.rr(10, 40), c.rr(-70, -30)], 10), 2);
  s.x(sc, '#e9a0a0', 'opacity=".8"');
  return s.out();
}
function blessing(c) {
  const s = sheet();
  s.p(c.cut([...c.blob(0, -46, 50, 34, 16, 0.05), [8, -14], [-2, 0], [-8, -14]], 0.5, 5), C.halo);
  s.p(c.cut(c.star(0, -46, 20, 9, 8, 0), 0.3, 3), C.sun);
  s.p(c.cut(c.circ(0, -46, 7, 10), 0.2, 2), C.star);
  return `<circle cy="-46" r="60" fill="url(#halo-glow)"/>${s.out()}`;
}
const BEGGAR = { robe: mix(C.stone2, C.sand2, 0.4), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
const BOY = { robe: C.skyVeil, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.ochre };

export default {
  id: 'lk6-enemies',
  enter: 'fly',
  beats: [
    { v: 27 },
    { v: 28 },
    { v: 29, text: 'Jeśli cię kto uderzy w [jeden] policzek, nadstaw mu i drugi!' },
    { v: 29, cont: true, text: 'Jeśli bierze ci płaszcz, nie broń mu i szaty!' },
    { v: 30 },
  ],
  cam: { x: [-40, 40], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, AFTERNOON);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1180, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 640, y: 120, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 430, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    S.layer({ par: 0.18, sh: 3 }).add(hillsWith(c, { y: 500, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 18 }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.stone, 0.35)).out());
    G.add(olive(c, 560, 600, 0.9) + bush(c, 150, 620, 120, C.sage, C.moss));
    G.add(facade(c, 230, 280, 250, { col: mix(C.plaster, C.peach, 0.2) }) + facade(c, 1090, 280, 250, { col: mix(C.plaster, C.skyVeil, 0.3), door: C.wood2 }));
    G.add(sheet().p(c.cut([[-900, GY - 6], [2500, GY - 6], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.sand2, 0.4)).out() + grass(c, { x0: -600, x1: 2200, y: GY + 4, n: 30, h: 10, color: C.olive }));
    // the fig tree by his door, and his jar on the doorstep
    const figs = sheet();
    figs.p(c.ribbon([[520, GY], [516, 560], [540, 500]], 12), C.wood2);
    figs.p(c.cut(c.blob(520, 470, 110, 70, 16, 0.2), 1, 6) + c.cut(c.blob(470, 510, 60, 40, 12, 0.2), 1, 5) + c.cut(c.blob(590, 510, 60, 40, 12, 0.2), 1, 5), C.leaf);
    let fr = '';
    for (let i = 0; i < 12; i++) fr += c.cut(c.ell(c.rr(430, 620), c.rr(440, 540), 6, 8, 8), 0.2, 2);
    figs.p(fr, mix(C.plumRobe, C.terracotta, 0.3));
    G.add(figs.out());

    const back = S.layer({ par: 0.4, sh: 1, flat: true });
    const prayer = back.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([0, 0], [200, -520], [440, -60], 30), (u) => 6 - u * 2)}" fill="#fff3cf" opacity=".85"/></g>`);
    const roofGlow = back.add(`<g opacity="0">${halo(220, 1)}</g>`);

    const L = S.layer({ par: 0.4, sh: 5 });
    const basket = L.add(`<g>${contentBasket(c, 'fruit', 70)}</g>`);
    const hero = S.puppet(L.add(person(c, HERO)));
    const bare = S.puppet(L.add(person(c, HERO_BARE)));
    const kneel = S.puppet(L.add(person(c, { ...HERO, pose: 'kneel' })));
    const enemy = S.puppet(L.add(person(c, ENEMY)));
    const beggar = S.puppet(L.add(person(c, BEGGAR)));
    const boy = S.puppet(L.add(person(c, BOY)));
    const mantle = L.add(`<g>${cloak(c, { col: HERO.mantle })}</g>`);
    const shirt = L.add(`<g transform="scale(.36)">${cloak(c, { col: C.linen2 })}</g>`);
    const bread = L.add(`<g>${loaf(c, 14)}</g>`);
    const cn = L.add(`<g>${coin(c, 8)}</g>`);

    const fx = S.layer({ par: 0.42, sh: 5 });
    const hate = fx.add(`<g opacity="0"><g transform="scale(2.2)">${sinKnot(c, 14)}</g></g>`);
    const love = fx.add(`<g opacity="0">${heart(c, 20)}</g>`);
    const cur = fx.add(`<g opacity="0">${curse(c)}</g>`);
    const bless = fx.add(`<g opacity="0">${blessing(c)}</g>`);
    const clod = fx.add(`<g>${mudClod(c)}</g>`);
    const splat = fx.add(`<g opacity="0">${mudClod(c)}</g>`);
    const pac = fx.add(`<g opacity="0">${sparkle(c, 16)}</g>`);
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1180, 140, T, 1, 0.6);
      swing(cl, 640 + Math.sin(T * 0.1) * 20, 120, T, 1.2, 0.6, 1);

      /* the man: to the neighbour's door with the figs, back; kneels; stands; is struck; is robbed; gives */
      const hK = [[0.1, 440], [0.62, 860], [0.9, 860], [1.08, HX], [4.0, HX], [4.2, 640]];
      const hx = kf(t, hK);
      const hWalk = moving(t, hK);
      const pray = es(t, 1.62, 1.68) * (1 - es(t, 2.0, 2.06));
      const robbed = es(t, 3.28, 3.34);
      const turned = es(t, 2.46, 2.54);                // offers the other cheek (turns round)
      const facingE = !(turned > 0.5 && t < 3.0) && !(t > 4.1 && t < 4.75) && !(t > 0.9 && t < 1.08);
      const struck = bump(t, 2.2, 2.42);
      const blessUp = es(t, 1.3, 1.45) * (1 - es(t, 1.55, 1.62));
      const carry = t < 0.8 ? 1 : 0;
      const offer = es(t, 3.46, 3.62) * (1 - es(t, 3.95, 4.05));
      const give = es(t, 4.3, 4.45) * (1 - es(t, 4.6, 4.7));
      const letGo = es(t, 4.6, 4.8);
      const openA = es(t, 2.5, 2.6) * (1 - es(t, 2.95, 3.05));
      const hSet = { x: hx, y: GY, s: 1.0, flip: !facingE, walk: hWalk ? hx * 0.05 : undefined, armF: 14 + carry * 44 + blessUp * 60 + offer * 64 + give * 70 + letGo * 40 + openA * 40, armB: 10 + blessUp * 110 + letGo * 60 + openA * 40, head: -struck * 22 + (turned > 0.5 && t < 3 ? -10 : 0), lean: -struck * 6, blink: blinkAt(T, 3) };
      hero.set({ ...hSet, o: (1 - pray) * (1 - robbed) });
      bare.set({ ...hSet, o: (1 - pray) * robbed });
      kneel.set({ x: hx, y: GY, s: 1.0, flip: false, armF: 60, armB: 140, head: -16, o: pray, blink: 0 });

      /* the neighbour */
      const eK = [[0, 1060], [1.02, 1060], [1.12, 1040], [2.05, EX], [4.45, EX], [4.95, 1180]];
      const ex = kf(t, eK);
      const glare = es(t, 0.05, 0.25);
      const shout = bump(t, 1.04, 1.4);
      const kick = bump(t, 1.44, 1.56);
      const thr = bump(t, 1.5, 1.62);
      const slap = bump(t, 2.14, 2.3);
      const pull = es(t, 3.1, 3.3) * (1 - es(t, 3.5, 3.6));
      const puzzled = Math.max(es(t, 2.6, 2.72) * (1 - es(t, 2.95, 3.05)), es(t, 3.62, 3.75) * (1 - es(t, 4.4, 4.5)));
      const halt = es(t, 2.5, 2.6) * (1 - es(t, 2.9, 3.0));
      const leaving = t > 4.45;
      enemy.set({ x: ex, y: GY, s: 1.0, flip: !leaving, walk: moving(t, eK) ? ex * 0.05 : undefined, armF: 20 + glare * 30 * (1 - es(t, 0.9, 1.0)) + shout * 50 + thr * 120 + slap * 100 + halt * 110 + pull * 70 + (leaving ? 40 : 0), armB: 10 + shout * 80 + kick * 10 + (leaving ? 50 : 0), head: glare * 6 * (1 - es(t, 2.9, 3.1)) - shout * 8 + puzzled * 10, lean: slap * 8 + pull * -6, blink: blinkAt(T, 7) });
      const [ehx, ehy] = headAt(ex, GY, 1.0, true);
      const hk = es(t, 0.05, 0.25, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(hate, { x: ehx + 10, y: ehy - 70, s: hk, r: time ? Math.sin(T * 3) * 8 : 0, o: hk > 0.01 ? 1 : 0 });
      const cu = es(t, 1.08, 1.24, ease.back) * (1 - es(t, 1.44, 1.52));
      pose(cur, { x: ehx - 40, y: ehy - 30, s: cu, o: cu > 0.01 ? 1 : 0 });

      /* v27 — the basket of figs, a heart */
      const [hhx, hhy] = handAt(hx, GY, 1.0, !facingE, 58);
      const setDown = t >= 0.62;
      const tip = es(t, 1.46, 1.54);
      pose(basket, { x: setDown ? 900 + tip * 20 : hhx, y: setDown ? GY : hhy + 34, r: tip * 70, o: 1 - es(t, 2.0, 2.1) });
      const lv = bump(t, 0.12, 0.8);
      pose(love, { x: lerp(hx + 40, 1000, es(t, 0.15, 0.6)), y: GY - 260 - Math.sin(es(t, 0.15, 0.6) * PI) * 40, s: 0.6 + lv * 0.6, o: lv });

      /* v28 — blessing; the clod; prayer */
      const [hhx2, hhy2] = headAt(hx, GY, 1.0, false);
      const bl = es(t, 1.3, 1.42, ease.back) * (1 - es(t, 1.56, 1.64));
      pose(bless, { x: hhx2 + 40, y: hhy2 - 30, s: bl, o: bl > 0.01 ? 1 : 0 });
      const fly = seg(t, 1.54, 1.62);
      pose(clod, { x: lerp(ex - 40, hx + 14, fly), y: lerp(GY - 150, GY - 120, fly) - Math.sin(fly * PI) * 60, r: fly * 300, o: fly > 0 && fly < 1 ? 1 : 0 });
      pose(splat, { x: hx + 12, y: GY - 112, s: 1.3, sx: 1.4, o: es(t, 1.61, 1.63) * (1 - es(t, 2.0, 2.1)) });
      const pr = es(t, 1.66, 1.82) * (1 - es(t, 2.0, 2.1));
      pose(prayer, { x: hx + 10, y: GY - 150, o: pr * 0.9 });
      pose(roofGlow, { x: 1230, y: 470, o: es(t, 1.78, 1.95) * (1 - es(t, 2.0, 2.2)) });

      /* v29a — the slap, the other cheek */
      pose(pac, { x: hx + 20, y: GY - 176, s: bump(t, 2.2, 2.36), r: T * 30, o: bump(t, 2.2, 2.36) });

      /* v29b — the cloak pulled off; the tunic held out too */
      const [ehx2, ehy2] = handAt(ex, GY, 1.0, true, 70 * pull + (leaving ? 40 : 0));
      const mOn = es(t, 3.28, 3.3);
      const mx = leaving ? ehx2 - 20 : lerp(hx + 10, ehx2 - 10, es(t, 3.28, 3.4));
      pose(mantle, { x: mx, y: leaving ? GY - 150 : lerp(GY - 150, ehy2 - 10, es(t, 3.28, 3.4)), s: 0.5, r: leaving ? 10 : -10, o: mOn });
      const [ohx, ohy] = handAt(hx, GY, 1.0, false, 14 + offer * 64);
      pose(shirt, { x: ohx - 6, y: ohy - 30, s: 0.4, o: offer });
      pose(q, { x: ehx - 16, y: ehy - 66, s: puzzled, o: puzzled });

      /* v30 — the beggar and his boy; bread and a coin; the neighbour goes off with the cloak and the jar */
      const bK = [[3.9, 200], [4.3, 520]];
      const bx = kf(t, bK);
      const got = es(t, 4.4, 4.5);
      beggar.set({ x: bx, y: GY, s: 0.96, flip: false, walk: moving(t, bK) ? bx * 0.05 : undefined, armF: 40 + got * 40, armB: 10 + got * 40, head: 8 - got * 10, o: seg(t, 3.88, 3.95), blink: blinkAt(T, 5) });
      boy.set({ x: bx - 64, y: GY + 4, s: 0.62, flip: false, walk: moving(t, bK) ? bx * 0.06 : undefined, armF: 60 + got * 60, armB: got * 120, head: -6, o: seg(t, 3.88, 3.95), blink: blinkAt(T, 8) });
      const [ghx, ghy] = handAt(hx, GY, 1.0, true, 14 + give * 70);
      pose(bread, { x: lerp(ghx, bx + 50, got), y: lerp(ghy, GY - 118, got), o: es(t, 4.3, 4.34) });
      pose(cn, { x: lerp(ghx - 4, bx + 40, got), y: lerp(ghy - 8, GY - 130, got), o: es(t, 4.3, 4.34) });

      S.cam.x = kf(t, [[-0.5, -20], [0.6, 30], [1.1, 20], [1.8, 0], [2.1, 10], [3.9, 10], [4.3, -20]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [1.1, 1.04], [2.1, 1.12], [3.9, 1.12], [4.3, 1.02]]);
      S.cam.y = kf(t, [[-0.5, 10], [2.1, 40], [3.9, 40], [4.3, 10]]);
    };
  },
};
