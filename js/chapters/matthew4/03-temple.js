// Mt 4,5–7 — Jerusalem across the valley in the evening light: a whirl of shadow carries two small figures
// over the Kidron to the corner of the Temple. Then close: the great drafted stones of the south-east corner,
// Jesus standing on its edge with the valley far below, the tempter beside Him. "Throw yourself down":
// pebbles tumble off the edge. "His angels…": pale, ghostly angels — only the tempter's picture — rise out of
// the depth, hold up their hands, a stone below glints. "Again it is written": the ghosts melt away,
// a scroll comes down, and the tempter backs off along the wall.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flap, sheet, shade, mix } from '../kit.js';
import { bird } from '../../assets/things.js';
import { band, sun, cloud, rock, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { GOLDEN, TEMPTER, tempterAura, pinnacleWall, royalPortico, valleyBelow, jerusalem, hungWord, angel, addScroll, whirl as whirlM, setScroll, sparkle, tr, PI } from './lib.js';

const JX = 800, JY = 520;      // Jesus on the corner
const TX = 1010, TY = 548;     // the tempter on the wall top
const GHOST = { robe: mix(C.linen, C.lavender, 0.45), mantle: mix(C.skyVeil, C.lavender, 0.5), hair: mix(C.wheat2, C.lavender, 0.4), skin: mix(C.skin, C.lavender, 0.35) };

export default {
  id: 'mt4-temple',
  beats: [
    { v: 5, text: 'Wtedy wziął Go diabeł do Miasta Świętego,' },
    { v: 5, cont: true, text: 'postawił na narożniku świątyni' },
    { v: 6, text: 'i rzekł Mu: «Jeśli jesteś Synem Bożym, rzuć się w dół,' },
    { v: 6, cont: true, text: 'jest przecież napisane: Aniołom swoim rozkaże o tobie,' },
    { v: 6, cont: true, text: 'a na rękach nosić cię będą, byś przypadkiem nie uraził swej nogi o kamień».' },
    { v: 7 },
  ],
  cam: { x: [-20, 20], y: [-20, 70], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, GOLDEN);
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
    const whirl = (sc) => whirlM(c, sc);
    const tiny = aFly.add(`<g><g transform="translate(-16 34) scale(.24)">${person(c, { ...CAST.jesus })}</g><g transform="translate(20 36) scale(-.24 .24)">${person(c, { ...TEMPTER })}</g></g>`);
    const swirlA = aFly.add(`<g>${whirl(1)}</g>`);
    const aFront = S.layer({ par: 0.8, sh: 7 });
    aFront.add(olive(c, 120, 1010, 2.2) + olive(c, 1560, 1020, 2) + rock(c, 1350, 980, 300, 110, C.rock2));
    const SETA = [aFar, aCity, aFly, aFront];

    /* ---------- set B: on the corner of the Temple ---------- */
    const bFar = S.layer({ par: 0.12, sh: 2 });
    bFar.add(valleyBelow(c, { y0: 330 }));
    const glint = bFar.add(`<g opacity="0">${sparkle(c, 16)}</g>`);
    const bigStone = bFar.add(`<g>${rock(c, 0, 0, 30, 15, C.rock3)}</g>`);
    const hid = S.id('haze');
    S.defs(`<linearGradient id="${hid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLDEN[2]}" stop-opacity="0"/><stop offset=".12" stop-color="${GOLDEN[2]}" stop-opacity=".6"/><stop offset=".6" stop-color="${GOLDEN[2]}" stop-opacity=".2"/><stop offset="1" stop-color="${GOLDEN[2]}" stop-opacity="0"/></linearGradient>`);
    const haze = S.layer({ par: 0.16, sh: 0, flat: true });
    haze.add(`<rect x="-900" y="316" width="3400" height="700" fill="url(#${hid})"/>`);
    const birdsL = S.layer({ par: 0.22, sh: 2 });
    const birds = [0, 1, 2].map((i) => ({ i, el: birdsL.add(bird(c, { color: C.birdLight, belly: C.cream })) }));
    const ghostsL = S.layer({ par: 0.3, sh: 3 });
    const ghosts = [[470, 860, false, 0], [640, 900, true, 1], [330, 930, false, 2]].map(([x, y, flip, i]) => ({ x, y, flip, i, p: S.puppet(ghostsL.add(angel(c, { ...GHOST, pose: 'stand' }))) }));
    const bWall = S.layer({ par: 0.5, sh: 4 });
    bWall.add(royalPortico(c));
    bWall.add(pinnacleWall(c, { edge: 752, top: JY, wallTop: TY }));
    const pebbles = [0, 1, 2].map((i) => bWall.add(`<g>${rock(c, 0, 0, 12 + i * 3, 8 + i, C.rock2)}</g>`));
    const bPeople = S.layer({ par: 0.5, sh: 5 });
    const aura = bPeople.add(`<g opacity="0">${tempterAura(c, 132)}</g>`);
    const tempter = S.puppet(bPeople.add(person(c, { ...TEMPTER })));
    const jesus = S.puppet(bPeople.add(person(c, { ...CAST.jesus })));
    const swirlB = bPeople.add(`<g>${whirl(1)}</g>`);
    const SETB = [bFar, haze, birdsL, ghostsL, bWall, bPeople];

    /* ---------- from the flies ---------- */
    const fly = S.layer({ par: 0.1, sh: 6 });
    const cityWord = fly.add(hungWord(c, tr('Miasto Święte', 'the holy city'), { size: 26 }));
    const scroll = addScroll(fly, c, [tr('Napisane jest także:', 'Again, it is written:'), tr('«Nie będziesz wystawiał na próbę', '“You shall not test'), tr('Pana, Boga swego»', 'the Lord, your God.”')], { w: 440, h: 160, size: 25 });

    return (t, time) => {
      swing(sunEl, 360, lerp(200, 250, es(t, 0, 6)), time, 0.8, 0.5);
      swing(cl, 1150 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);

      /* ---------- v5a: carried to the Holy City ---------- */
      const cut = es(t, 1.0, 1.12);
      SETA.forEach((L) => L.fade(1 - cut));
      SETB.forEach((L) => L.fade(cut));
      const wk = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      pose(cityWord, { x: 800, y: lerp(-420, 230, wk), r: Math.sin(time * 0.8) * 1.2, o: wk > 0.01 ? 1 : 0 });
      const fk = es(t, 0.3, 0.92, ease.sine);
      const fx = lerp(180, 976, fk), fy = lerp(760, 490, fk) - Math.sin(fk * PI) * 140;
      pose(swirlA, { x: fx, y: fy, s: 1.6 - fk * 0.5, r: t * 400, o: seg(t, 0.28, 0.36) });
      pose(tiny, { x: fx, y: fy - 10, s: 1 - fk * 0.3, o: seg(t, 0.28, 0.36) });

      /* ---------- v5b: set on the corner of the Temple ---------- */
      const arrive = es(t, 1.1, 1.45);
      pose(swirlB, { x: 900, y: 440, s: 3.4 - arrive * 2.6, r: t * 300, o: 0.9 * (1 - es(t, 1.35, 1.6)) });
      const recoil = es(t, 5.4, 5.85);
      const point = es(t, 2.05, 2.3) * (1 - es(t, 4.8, 5.1));
      const sweep = bump(t, 3.1, 3.9) + bump(t, 4.1, 4.9);
      const tx = TX + recoil * 90;
      tempter.set({ x: tx, y: TY, s: 1.02, flip: !(recoil > 0 && recoil < 1), o: arrive, walk: recoil > 0 && recoil < 1 ? tx * 0.05 : undefined, armF: 14 + point * 50 + sweep * 30, armB: 10 + sweep * 60, head: point * 12 - sweep * 6 + recoil * 10, lean: point * 8, blink: blinkAt(time, 5) });
      pose(aura, { x: tx - 6, y: TY + 10, s: 1.02 * (1 - recoil * 0.3) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4, o: arrive * 0.9 * (1 - recoil * 0.5) });
      const answer = es(t, 5.05, 5.3);
      jesus.set({ x: JX, y: JY, s: 1.0, o: arrive, armF: 12 + answer * 70, armB: 8 + answer * 100, head: -answer * 4 + bump(t, 2.3, 2.9) * 6, blink: blinkAt(time) });

      /* ---------- v6a: "throw yourself down" — pebbles tumble off the edge ---------- */
      pebbles.forEach((p, i) => {
        const k = seg(t, 2.3 + i * 0.16, 2.78 + i * 0.16);
        pose(p, { x: 744 - i * 10 - k * 50, y: JY - 4 + k * k * 300, s: 1 - k * 0.7, r: k * 360 * (i % 2 ? 1 : -1), o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* ---------- v6b/c: the ghostly angels of his quotation ---------- */
      const gIn = es(t, 3.05, 3.6, ease.out), gOut = es(t, 5.0, 5.4);
      const hold = es(t, 4.05, 4.35);
      ghosts.forEach((g) => {
        const k = es(t, 3.05 + g.i * 0.1, 3.6 + g.i * 0.1, ease.out);
        g.p.set({ x: g.x + (g.flip ? -1 : 1) * Math.sin(time * 0.7 + g.i) * 4, y: g.y - k * 110 + gOut * 160 + Math.sin(time * 1.1 + g.i) * 5, s: 0.86, flip: g.flip, o: k * (1 - gOut) * 0.58, armF: 20 + hold * 80, armB: 20 + hold * 140, head: -8 - hold * 10, blink: blinkAt(time, g.i + 3) });
      });
      pose(bigStone, { x: 600, y: 640, o: 1 });
      birds.forEach((b) => { const a = time * 0.25 + b.i * 2.1; pose(b.el, { x: 520 + Math.cos(a) * 160 + b.i * 30, y: 610 + b.i * 40 + Math.sin(a * 2) * 12, s: 0.45 - b.i * 0.05, sx: (Math.sin(a) > 0 ? -1 : 1) * (0.45 - b.i * 0.05) }); flap(b.el, time + b.i, 20, 6); });
      const gl = bump(t, 4.3, 4.95);
      pose(glint, { x: 606, y: 626, s: gl * 1.4, r: time * 50, o: gl });

      /* ---------- v7: it is written again ---------- */
      const down = es(t, 5.02, 5.3, ease.out);
      setScroll(scroll, 800, lerp(-420, 110, down) + Math.sin(time * 0.8) * 2, es(t, 5.2, 5.5), down, Math.sin(time * 0.6) * 0.6);

      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.04 - es(t, 5.0, 5.4) * 0.04;
      S.cam.y = lerp(10, 20, es(t, 1.0, 1.4)) + es(t, 2.1, 2.6) * 40 - es(t, 5.0, 5.4) * 50;
      S.cam.x = 0;
    };
  },
};
