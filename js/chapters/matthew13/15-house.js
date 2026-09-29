// Mt 13,36b–39 — inside Peter's house in the evening, the lamp lit, dusk and the first star in the window. The
// disciples gather round Jesus and ask Him to explain the weeds (a bubble with a darnel stalk). He gives them the key
// like a set of painted cards that come down on strings and turn over, the parable on the front, its meaning on
// the back: the sower of good seed — the Son of Man; the field — the world; the wheat — the children of the
// Kingdom; the darnel — the children of the evil one; the enemy — the devil; the harvest — the end of the age; the
// reapers — the angels.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { stars as starsCut, moon as moonCut, grass } from '../../assets/nature.js';
import { wheatStalk, sickle, sheaf } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  keyCard, flipCard, MASTER, ENEMY, TEMPTER, tempterAura, REAPERS, darnelStalk, globe, shadowPerson, angel, speech, GLYPH, headAt, hangAt, storeJar, kf, tr, DUSK, PI,
} from './lib.js';

const JX = 800, JY = 724;

export default {
  id: 'mt13-house',
  beats: [
    { v: 36, cont: true, text: 'Tam przystąpili do Niego uczniowie i prosili Go: «Wyjaśnij nam przypowieść o chwaście!»' },
    { v: 37 },
    { v: 38 },
    { v: 39, text: 'Nieprzyjacielem, który posiał chwast, jest diabeł;' },
    { v: 39, cont: true, text: 'żniwem jest koniec świata, a żeńcami są aniołowie.' },
  ],
  cam: { x: [-20, 20], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, ['#6f6c98', '#c79a9a', '#e8b996']);
    const winL = S.layer({ par: 0.2, sh: 1, flat: true });
    winL.add(starsCut(c, { x0: 1000, x1: 1260, y0: 260, y1: 420, n: 12 }) + `<g transform="translate(1200 300)">${moonCut(c, 18)}</g>`);

    /* the room */
    const WALLC = mix(C.plaster2, C.clay, 0.28);
    const wall = S.layer({ par: 0.3, sh: 3 });
    const W = sheet();
    const win = [[1020, 440], [1020, 330], ...c.arc(1110, 330, 90, 70, PI, 2 * PI, 12), [1200, 440]];
    W.p(c.cut([[-900, -900], [2500, -900], [2500, 1700], [-900, 1700]], 0.6, 40) + c.hole(win, 0.4, 6), WALLC);
    let bl = '';
    for (let y = 120; y < 640; y += 44) for (let x = -900 + ((y / 44) % 2 ? 60 : 0); x < 2500; x += 120) bl += c.ribbon([[x, y], [x + 104, y + c.rr(-1, 1)]], 1.3);
    W.x(bl, shade(WALLC, -0.1), 'opacity=".5"');
    W.p(c.ribbon([[1016, 442], [1204, 442]], 8), C.wood2);
    let beams = '';
    for (let x = -600; x < 2300; x += 160) beams += c.cut(c.rect(x, 60, 24, 36), 0.3, 5);
    W.p(c.cut([[-900, 40], [2500, 40], [2500, 66], [-900, 66]], 0.5, 20) + beams, C.wood2);
    // a shelf with jars and a niche with a lamp
    W.p(c.cut(c.rect(300, 400, 220, 12), 0.3, 6), C.wood);
    W.p(c.cut([[600, 470], [600, 400], ...c.arc(640, 400, 40, 30, PI, 2 * PI, 8), [680, 470]], 0.3, 5), shade(WALLC, -0.25));
    wall.add(W.out());
    wall.add(`<g transform="translate(340 400)">${storeJar(c, 54)}</g><g transform="translate(400 400)">${storeJar(c, 44, C.clay)}</g><g transform="translate(470 400)">${storeJar(c, 50, C.pot)}</g>`);
    const niche = wall.add(`<g transform="translate(640 468)"><circle r="70" fill="url(#warm-glow)"/><path d="M-10 0C-12 -8 -6 -16 0 -26C6 -16 12 -8 10 0Z" fill="${C.lampFlame}"/></g>`);
    const floor = S.layer({ par: 0.42, sh: 3 });
    floor.add(sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 0.6, 30), mix(C.sand2, C.clay, 0.25)).p(c.cut(c.ell(800, 760, 420, 60, 30), 0.8, 10), mix(C.terracotta, C.roseRobe, 0.5)).out());
    const pool = floor.add(`<ellipse cx="800" cy="700" rx="560" ry="220" fill="url(#warm-glow)" opacity=".45"/>`);

    /* people round the lamp */
    const ppl = S.layer({ par: 0.5, sh: 5 });
    const SEATS = [
      { o: CAST.matthew, x: 450, y: 700, s: 0.86 }, { o: CAST.thomas, x: 1150, y: 700, s: 0.86 },
      { o: CAST.andrew, x: 550, y: 736, s: 0.94 }, { o: CAST.james, x: 1050, y: 736, s: 0.94 },
      { o: CAST.peter, x: 650, y: 768, s: 1.0 }, { o: CAST.john, x: 950, y: 768, s: 1.0 },
    ].map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 6), p: S.puppet(ppl.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(ppl.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const ask = ppl.add(`<g>${speech(c, `<g transform="translate(-12 16) scale(.42)">${darnelStalk(c, { h: 70 })}</g><g transform="translate(14 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 70, h: 56 })}</g>`);

    /* the cards */
    const cardsL = S.layer({ par: 0.52, sh: 6 });
    const fig = (o, { s = 0.42, y = 60, x = 0, flip = false, armF = 0, armB = 0, extra = '' } = {}) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${person(c, o).replace('class="armFr"', `class="armFr" transform="rotate(${-armF})"`).replace('class="armBr"', `class="armBr" transform="rotate(${-armB})"`)}</g>${extra}`;
    const ground = (col = mix(C.soil, C.clay, 0.5)) => `<path d="${c.cut([[-90, 58], [90, 58], [90, 80], [-90, 80]], 0.4, 6)}" fill="${col}"/>`;
    const gseeds = (col) => Array.from({ length: 7 }, (_, i) => `<path d="${c.poly(c.ell(10 + i * 9, -8 + (i % 3) * 14, 3, 2, 6, i))}" fill="${col}"/>`).join('');
    const light = (r = 60) => `<circle r="${r}" fill="url(#warm-glow)"/>`;
    const CARD = [
      { front: ground() + fig(MASTER, { armF: 110, x: -20 }) + gseeds(C.wheat), back: light(80) + ground(mix(C.sage, C.hillNear, 0.5)) + fig(CAST.jesus, { armF: 110, x: -20 }) + gseeds(C.halo), label: tr('Syn Człowieczy', 'the Son of Man') },
      { front: `<path d="${c.cut([[-90, -10], [90, -14], [90, 80], [-90, 80]], 0.5, 8)}" fill="${mix(C.soil, C.clay, 0.5)}"/>` + Array.from({ length: 6 }, (_, i) => `<path d="${c.ribbon([[-90, i * 14], [90, i * 14 - 3]], 2)}" fill="${shade(C.soil, -0.15)}"/>`).join(''), back: `<circle r="80" fill="url(#halo-glow)" opacity=".6"/><g transform="scale(.9)">${globe(c, 60)}</g>`, label: tr('świat', 'the world') },
      { front: `<g transform="translate(0 70)">${wheatStalk(c, { h: 120 }).replace('class="stalk"', '')}</g>`, back: light(70) + fig({ ...CAST.john, robe: C.linen, mantle: C.halo }, { x: -22, s: 0.38 }) + fig({ robe: C.linen, mantle: C.skyVeil, hairStyle: 'veil', veil: C.cream, skin: C.skin2, hair: C.hair }, { x: 24, s: 0.36, flip: true }), label: tr('synowie królestwa', 'children of the Kingdom') },
      { front: `<g transform="translate(0 70)">${darnelStalk(c, { h: 116 })}</g>`, back: `<path d="${c.cut(c.rect(-90, -80, 180, 160), 0.2, 8)}" fill="${mix(C.storm, C.stone2, 0.5)}"/>` + `<g transform="translate(-22 60) scale(.38)">${shadowPerson(c, { hairStyle: 'short' }, '#3f3647')}</g><g transform="translate(24 60) scale(-.36 .36)">${shadowPerson(c, { hairStyle: 'wrap' }, '#453b4e')}</g>`, label: tr('synowie Złego', 'children of the evil one') },
      { front: `<path d="${c.cut(c.rect(-90, -80, 180, 160), 0.2, 8)}" fill="${C.night}"/>` + starsCut(c, { x0: -80, x1: 80, y0: -70, y1: -10, n: 8 }) + ground(mix(C.soil, C.night, 0.4)) + fig(ENEMY, { armF: 80, x: 0, flip: true }), back: `<path d="${c.cut(c.rect(-90, -80, 180, 160), 0.2, 8)}" fill="${mix(C.night2, C.storm2, 0.5)}"/><g transform="translate(0 60) scale(.5)">${tempterAura(c, 130)}</g>` + fig(TEMPTER, { x: 0, flip: true, armF: 40 }), label: tr('diabeł', 'the devil') },
      { front: ground(mix(C.wheat2, C.soil, 0.3)) + `<g transform="translate(-20 64)">${sheaf(c, 90)}</g><g transform="translate(34 20) rotate(20) scale(.8)">${sickle(c)}</g>`, back: `<path d="${c.cut(c.rect(-90, -80, 180, 160), 0.2, 8)}" fill="${mix(C.dusk, C.duskViolet, 0.4)}"/><circle cx="0" cy="30" r="44" fill="${C.sunDeep}"/><circle cx="0" cy="30" r="90" fill="url(#warm-glow)"/><path d="${c.cut([[-90, 30], [90, 30], [90, 80], [-90, 80]], 0.3, 6)}" fill="${mix(C.storm2, C.duskViolet, 0.4)}"/>`, label: tr('koniec świata', 'the end of the age') },
      { front: ground(mix(C.wheat2, C.soil, 0.3)) + fig(REAPERS[1], { armF: 100, extra: '' }) + `<g transform="translate(26 -6) rotate(30) scale(.5)">${sickle(c)}</g>`, back: light(80) + `<g transform="translate(0 62) scale(.4)">${angel(c, { hair: C.wheat2, skin: C.skin })}</g>`, label: tr('aniołowie', 'the angels') },
    ];
    const cards = CARD.map((cd, i) => ({ i, el: hanging(cardsL, keyCard(c, S.id('kc' + i), cd.front, cd.back, cd.label), { x: 0, y: 0, len: 1000 }) }));
    const PLAN = [
      { i: 0, x: 800, y: 290, in: 1.05, flip: 1.4, out: 2.0 },
      { i: 1, x: 590, y: 300, in: 2.0, flip: 2.2, out: 3.0 },
      { i: 2, x: 830, y: 280, in: 2.06, flip: 2.34, out: 3.0 },
      { i: 3, x: 1070, y: 300, in: 2.12, flip: 2.48, out: 3.0 },
      { i: 4, x: 800, y: 290, in: 3.02, flip: 3.35, out: 4.0 },
      { i: 5, x: 640, y: 300, in: 4.02, flip: 4.3, out: 9 },
      { i: 6, x: 960, y: 290, in: 4.1, flip: 4.5, out: 9 },
    ];

    return (t, time) => {
      const T = time;
      pose(niche, { x: 640, y: 468, s: 1 + Math.sin(T * 7) * 0.03 });
      fade(pool, 0.45 + Math.sin(T * 3.1) * 0.03);
      const lean = es(t, 0.1, 0.4) * (1 - es(t, 0.9, 1.1));
      SEATS.forEach((d) => {
        const look = es(t, 1.1, 1.4);
        d.p.set({ x: d.x, y: d.y, s: d.s, flip: d.flip, lean: lean * (d.flip ? -7 : 7), armF: 20 + lean * 30 * (d.i >= 4 ? 1 : 0) + bump(t, 2.3 + d.i * 0.05, 2.9) * 20, armB: 10, head: -6 - look * 10, blink: blinkAt(T, d.seed) });
      });
      const qk = es(t, 0.25, 0.42, ease.back) * (1 - es(t, 0.95, 1.1));
      const [hx, hy] = headAt(650, 768, 1.0, false, 62);
      pose(ask, { x: hx + 18, y: hy - 28, s: qk, o: qk > 0.02 ? 1 : 0 });
      const self = bump(t, 1.35, 1.95);
      jesus.set({ x: JX, y: JY, s: 1.04, armF: 30 + es(t, 1.0, 1.2) * 60 * (1 - self) + self * 20 + Math.sin(T * 1.3) * 4, armB: 12 + es(t, 1.0, 1.2) * 70 + self * 30, head: -8 - es(t, 1.0, 1.2) * 6, blink: blinkAt(T) });
      PLAN.forEach((p) => {
        const k = es(t, p.in, p.in + 0.3, ease.out) * (1 - es(t, p.out, p.out + 0.25));
        hangAt(cards[p.i].el, p.x, lerp(-500, p.y, k), T, 1.1, 0.7, p.i);
        flipCard(cards[p.i].el, es(t, p.flip, p.flip + 0.25));
      });
      S.cam.z = kf(t, [[0, 1.14], [0.9, 1.14], [1.1, 1.02], [4.0, 1.02], [4.3, 1.04]]);
      S.cam.y = kf(t, [[0, 60], [0.9, 60], [1.1, -10], [4.0, -10], [4.3, -20]]);
    };
  },
};
