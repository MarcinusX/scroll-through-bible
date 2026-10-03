// Łk 4,9–13 — Jerusalem across the valley in the evening light; a whirl of shadow carries the two small figures
// over the Kidron to the corner of the Temple. Close: the great drafted stones of the south-east corner, Jesus on
// its edge, the valley far below, the tempter beside Him. "Throw yourself down from here!": pebbles tumble off.
// "It is written…": the tempter holds up his own picture of the psalm, a dark-rimmed plate with two angels on
// guard, and in it a little figure falls and is caught on their hands above a stone. "It has been said: you shall
// not put the Lord your God to the test": the scroll comes down and his picture drops into the valley. Every test
// ended, he goes to pieces on the wind — all but one small shadow that slips into a crack of the wall, while an
// hourglass turns on its string: "until an opportune time".
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flap, sheet, shade, mix } from '../kit.js';
import { bird } from '../../assets/things.js';
import { band, sun, cloud, rock, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  GOLDEN, TEMPTER, tempterAura, pinnacleWall, royalPortico, valleyBelow, jerusalem, hungWord, angel, addScroll, whirl as whirlM, setScroll,
  sparkle, shadowShards, hourglass, headAt, hand, figure, bake, tr, PI,
} from './lib.js';

const JX = 800, JY = 520;      // Jesus on the corner
const TX = 1010, TY = 548;     // the tempter on the wall top
const PX = 560, PY = 330;      // the tempter's picture

/** the tempter's picture of the psalm: a dark-rimmed round plate with two angels holding up their hands over a stone */
function psalmPlate(c) {
  const r = 104;
  const s = sheet();
  s.p(c.cut(c.star(0, 0, r + 22, r + 10, 26, 0), 1, 6), '#3d3650');
  s.p(c.cut(c.circ(0, 0, r, 44), 0.5, 6), mix(C.skyVeil, C.lavender, 0.35));
  const a0 = Math.asin(48 / r);
  s.p(c.cut([...c.arc(0, 0, r - 1, r - 1, a0, PI - a0, 16), [-60, 40], [0, 46], [60, 38]], 0.5, 6), mix(C.sand2, C.lavender, 0.25));
  s.p(c.cut([[-18, 64], [-14, 52], [0, 48], [16, 52], [20, 64]], 0.4, 4), C.rock3);
  const ang = (x, flip) => `<g transform="translate(${x} 58) scale(${flip ? -0.42 : 0.42} .42)">${bake(angel(c, { robe: C.linen, mantle: C.skyVeil, hair: C.wheat2, skin: C.skin }), 120, 150, -10)}</g>`;
  return `${s.out()}${ang(-40, false)}${ang(40, true)}`;
}

export default {
  id: 'lk4-pinnacle',
  beats: [
    { v: 9, text: 'Zaprowadził Go też do Jerozolimy, postawił na narożniku świątyni i rzekł do Niego:' },
    { v: 9, cont: true, text: '«Jeśli jesteś Synem Bożym, rzuć się stąd w dół!' },
    { v: 10 },
    { v: 11 },
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-30, 20], y: [-20, 70], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the tempter, his picture, the crack and the hourglass stand inside the screen, clear of the thread
    const TXp = PH ? 950 : TX, PXp = PH ? 632 : PX, PYp = PH ? 290 : PY, CRX = PH ? 1040 : 1100;
    sky(S, GOLDEN);
    const dusk = sky(S, ['#8f86ad', '#e3a58e', '#f3c79e'], { name: 'dusk' }).layer;
    dusk.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 360, y: 200, len: 900 });
    const cl = hanging(hangL, cloud(c, 190, '#f6e3d2', '#e8cdb8'), { x: 1150, y: 170, len: 800 });

    /* ---------- set A: the Holy City across the valley ---------- */
    const aFar = S.layer({ par: 0.08, sh: 2 });
    aFar.add(band(c, { y: 470, amps: [14, 6, 2], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup);
    const aCity = S.layer({ par: 0.2, sh: 3 });
    aCity.add(`<g transform="translate(560 640)">${jerusalem(c, 0.8)}</g>`);
    aCity.add(band(c, { y: 690, amps: [8, 3, 1], lens: [800, 260, 100], color: mix(C.sage2, C.sand2, 0.45) }).markup);
    const aFly = S.layer({ par: 0.2, sh: 4 });
    const tiny = aFly.add(`<g><g transform="translate(-16 34) scale(.24)">${person(c, { ...CAST.jesus })}</g><g transform="translate(20 36) scale(-.24 .24)">${person(c, { ...TEMPTER })}</g></g>`);
    const swirlA = aFly.add(`<g>${whirlM(c, 1)}</g>`);
    const aFront = S.layer({ par: 0.8, sh: 7 });
    aFront.add(olive(c, 120, 1010, 2.2) + olive(c, 1560, 1020, 2) + rock(c, 1350, 980, 300, 110, C.rock2));
    const SETA = [aFar, aCity, aFly, aFront];

    /* ---------- set B: on the corner of the Temple ---------- */
    const bFar = S.layer({ par: 0.12, sh: 2 });
    bFar.add(valleyBelow(c, { y0: 330 }));
    const hid = S.id('haze');
    S.defs(`<linearGradient id="${hid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLDEN[2]}" stop-opacity="0"/><stop offset=".12" stop-color="${GOLDEN[2]}" stop-opacity=".6"/><stop offset=".6" stop-color="${GOLDEN[2]}" stop-opacity=".2"/><stop offset="1" stop-color="${GOLDEN[2]}" stop-opacity="0"/></linearGradient>`);
    const haze = S.layer({ par: 0.16, sh: 0, flat: true });
    haze.add(`<rect x="-900" y="316" width="3400" height="700" fill="url(#${hid})"/>`);
    const birdsL = S.layer({ par: 0.22, sh: 2 });
    const birds = [0, 1, 2].map((i) => ({ i, el: birdsL.add(bird(c, { color: C.birdLight, belly: C.cream })) }));
    // the tempter's picture (behind the wall, over the valley)
    const picL = S.layer({ par: 0.3, sh: 6 });
    const plate = picL.add(`<g>${psalmPlate(c)}</g>`);
    const faller = picL.add(`<g>${figure(c, { ...CAST.jesus, halo: false }, { s: 0.3, armF: 150, armB: 160 })}</g>`);
    const bWall = S.layer({ par: 0.5, sh: 4 });
    bWall.add(royalPortico(c));
    bWall.add(pinnacleWall(c, { edge: 752, top: JY, wallTop: TY }));
    const pebbles = [0, 1, 2].map((i) => bWall.add(`<g>${rock(c, 0, 0, 12 + i * 3, 8 + i, C.rock2)}</g>`));
    const crack = bWall.add(`<g opacity="0"><path d="${c.cut([[-4, -30], [6, -26], [4, 0], [9, 30], [-2, 34], [-6, 4]], 0.6, 4)}" fill="#2a2238"/></g>`);
    const bPeople = S.layer({ par: 0.5, sh: 5 });
    const glow = bPeople.add(`<circle r="130" fill="url(#halo-glow)" opacity="0"/>`);
    const aura = bPeople.add(`<g opacity="0">${tempterAura(c, 132)}</g>`);
    const tempter = S.puppet(bPeople.add(person(c, { ...TEMPTER })));
    const jesus = S.puppet(bPeople.add(person(c, { ...CAST.jesus })));
    const swirlB = bPeople.add(`<g>${whirlM(c, 1)}</g>`);
    const shards = shadowShards(c, { n: 11, r: 90, color: '#2a2238' }).map((sh) => ({ ...sh, el: bPeople.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.3) }));
    const lurk = bPeople.add(`<g opacity="0"><path d="${c.cut(c.star(0, 0, 22, 12, 7, 0.3), 1.2, 4)}" fill="#2a2238"/><circle cx="5" cy="-3" r="2.2" fill="${C.apricot}"/></g>`);
    const glass = bPeople.add(`<g opacity="0"><circle r="40" fill="url(#warm-glow)" opacity=".6"/>${hourglass(c, 50)}</g>`);
    const SETB = [bFar, haze, birdsL, picL, bWall, bPeople];

    /* ---------- from the flies ---------- */
    const fly = S.layer({ par: 0.1, sh: 6 });
    const cityWord = fly.add(hungWord(c, tr('Jerozolima', 'Jerusalem'), { size: 26 }));
    const scroll = addScroll(fly, c, [tr('Powiedziano:', 'It has been said:'), tr('«Nie będziesz wystawiał na próbę', '“You shall not tempt'), tr('Pana, Boga swego»', 'the Lord your God.”')], { w: 440, h: 160, size: 25 });

    return (t, time) => {
      swing(sunEl, 360, lerp(200, 330, es(t, 0, 6)), time, 0.8, 0.5);
      swing(cl, 1150 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      dusk.fade(es(t, 5.0, 5.8) * 0.8);

      /* ---------- v9a: led to Jerusalem, set on the corner of the Temple ---------- */
      const cut = es(t, 0.52, 0.62);
      SETA.forEach((L) => L.fade(1 - cut));
      SETB.forEach((L) => L.fade(cut));
      const wk = es(t, 0.02, 0.2, ease.out) * (1 - es(t, 0.5, 0.6, ease.in));
      pose(cityWord, { x: 800, y: lerp(-420, 230, wk), r: Math.sin(time * 0.8) * 1.2, o: wk > 0.01 ? 1 : 0 });
      const fk = es(t, 0.1, 0.5, ease.sine);
      const fx = lerp(180, 976, fk), fy = lerp(760, 490, fk) - Math.sin(fk * PI) * 140;
      pose(swirlA, { x: fx, y: fy, s: 1.6 - fk * 0.5, r: t * 400, o: seg(t, 0.08, 0.14) });
      pose(tiny, { x: fx, y: fy - 10, s: 1 - fk * 0.3, o: seg(t, 0.08, 0.14) });
      const arrive = es(t, 0.58, 0.8);
      pose(swirlB, { x: 900, y: 440, s: 3.4 - arrive * 2.6, r: t * 300, o: 0.9 * (1 - es(t, 0.75, 0.95)) });

      /* the tempter: dares Him, holds up his picture, recoils, goes to pieces */
      const point = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const show = es(t, 2.05, 2.35) * (1 - es(t, 4.05, 4.3));
      const recoil = es(t, 4.1, 4.5);
      const gone = es(t, 5.05, 5.5);
      const tx = TXp + recoil * (PH ? 40 : 60);
      const tArmF = 14 + point * 60 + show * 110;
      tempter.set({ x: tx, y: TY, s: 1.02, flip: true, o: arrive * (1 - es(t, 5.1, 5.25)), armF: tArmF, armB: 10 + show * 40 + bump(t, 3.1, 3.9) * 30, head: point * 14 - show * 8 + recoil * 12, lean: point * 10 - recoil * 8, blink: blinkAt(time, 5) });
      pose(aura, { x: tx - 6, y: TY + 10, s: 1.02 * (1 - recoil * 0.3) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4, o: arrive * 0.9 * (1 - recoil * 0.5) * (1 - es(t, 5.05, 5.2)) });

      /* v9b: "throw yourself down from here!" — pebbles tumble off the edge */
      pebbles.forEach((p, i) => {
        const k = seg(t, 1.3 + i * 0.16, 1.78 + i * 0.16);
        pose(p, { x: 744 - i * 10 - k * 50, y: JY - 4 + k * k * 300, s: 1 - k * 0.7, r: k * 360 * (i % 2 ? 1 : -1), o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v10–11: his picture of the psalm — angels on guard; a figure falls and is caught above the stone */
      const pk = es(t, 2.1, 2.45, ease.out);
      const pfall = es(t, 4.05, 4.5, ease.in);
      const px = PXp, py = lerp(PYp + 420, PYp, pk) + pfall * 600;
      pose(plate, { x: px, y: py, r: Math.sin(time * 0.7) * 1.5 + pfall * 30, s: 1, o: pk > 0.01 && pfall < 0.99 ? 1 : 0 });
      const catchK = es(t, 3.1, 3.5, ease.out);
      pose(faller, { x: px, y: py - 58 + catchK * 64, r: (1 - catchK) * 20, o: pk > 0.5 && t > 3.0 && pfall < 0.99 ? 1 : 0 });

      /* Jesus */
      const answer = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.1));
      jesus.set({ x: JX, y: JY, s: 1.0, o: arrive, armF: 12 + answer * 70, armB: 8 + answer * 100, head: -answer * 4 + bump(t, 1.3, 1.9) * 8, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(JX, JY, 1.0, false);
      pose(glow, { x: jhx, y: jhy + 30, s: 1 + Math.sin(time * 1.2) * 0.04, o: es(t, 5.3, 5.7) * 0.8 });

      /* v12: it has been said */
      const down = es(t, 4.02, 4.3, ease.out);
      const lift = es(t, 4.9, 5.2, ease.in);
      setScroll(scroll, 800, lerp(-420, 110, down) - lift * 620 + Math.sin(time * 0.8) * 2, es(t, 4.2, 4.5) * (1 - es(t, 4.85, 5.0)), down, Math.sin(time * 0.6) * 0.6);

      /* v13: he departs — torn to shards on the wind; one small shadow slips into a crack and waits */
      shards.forEach((sh) => {
        const k = es(t, 5.08 + sh.i * 0.015, 5.7, ease.out);
        pose(sh.el, { x: tx - 10 + Math.cos(sh.a) * k * 120 * sh.drift + k * 260, y: TY - 100 + Math.sin(sh.a) * k * 80 - k * 200 * sh.drift, s: 1 - k * 0.6, r: k * 200 * (sh.i % 2 ? 1 : -1), o: seg(t, 5.05, 5.12) * (1 - seg(k, 0.7, 1)) });
      });
      const sl = es(t, 5.2, 5.6);
      pose(lurk, { x: lerp(tx - 20, CRX, sl), y: lerp(TY - 60, TY + 56, sl), s: 1 - sl * 0.3, r: sl * 90, o: seg(t, 5.12, 5.2) });
      fade(crack, es(t, 5.4, 5.6));
      pose(crack, { x: CRX, y: TY + 76, o: es(t, 5.4, 5.6) });
      const gk = es(t, 5.3, 5.6, ease.out);
      pose(glass, { x: CRX - 10, y: TY - 30, s: gk, r: es(t, 5.55, 5.85) * 180, o: gk > 0.01 ? 1 : 0 });

      birds.forEach((b) => { const a = time * 0.25 + b.i * 2.1; pose(b.el, { x: 380 + Math.cos(a) * 140 + b.i * 30, y: 640 + b.i * 40 + Math.sin(a * 2) * 12, s: 0.45 - b.i * 0.05, sx: (Math.sin(a) > 0 ? -1 : 1) * (0.45 - b.i * 0.05) }); flap(b.el, time + b.i, 20, 6); });

      S.cam.z = 1.02 + es(t, 0.55, 0.9) * 0.04 - es(t, 4.0, 4.4) * 0.03;
      S.cam.y = lerp(10, 20, es(t, 0.55, 0.9)) + es(t, 1.1, 1.6) * 40 * (1 - es(t, 2.0, 2.4)) - es(t, 4.0, 4.4) * 20;
      S.cam.x = -es(t, 2.0, 2.4) * 20 * (1 - es(t, 4.0, 4.4)) + es(t, 5.1, 5.5) * 15;
    };
  },
};
