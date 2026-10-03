// Mk 3,16–19 — a curtain call on the hilltop: as each of the Twelve is named, he steps forward and a
// name tag comes down on its string. Simon's tag turns over to "Peter"; a little thundercloud rumbles
// over James and John; Judas's tag is cut from darker paper.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, rock, grass, flowers, sun, cloud, olive, bush, house } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { TWELVE, nameTag, thunderCloud, headAt, spark } from './lib.js';

const PI = Math.PI;
const JY = 706;
// when each name is heard (scene time)
const AT = [0.12, 1.08, 1.34, 3.06, 3.17, 3.28, 3.4, 4.04, 4.13, 4.3, 4.4, 5.08];

function rockIcon(c) {
  return sheet().p(c.cut(c.blob(0, 0, 17, 11, 10, 0.2).map(([x, y]) => [x, Math.min(y, 6)]), 0.8, 4), C.rock2).x(c.cut([[-8, -4], [0, -8], [6, -3], [-2, -1]], 0.3, 3), shade(C.rock2, 0.35), 'opacity=".8"').out();
}

export default {
  id: 'm3-twelve',
  beats: [
    { v: 16 },
    { v: 17, text: 'dalej Jakuba, syna Zebedeusza, i Jana, brata Jakuba,' },
    { v: 17, cont: true, text: 'którym nadał przydomek Boanerges, to znaczy synowie gromu;' },
    { v: 18, text: 'dalej Andrzeja, Filipa, Bartłomieja, Mateusza,' },
    { v: 18, cont: true, text: 'Tomasza, Jakuba, syna Alfeusza, Tadeusza, Szymona Gorliwego' },
    { v: 19 },
  ],
  cam: { x: [-30, 50], y: [-20, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const GOLD = [mix(C.skyBlue, C.dawn, 0.35), mix(C.dawn, C.sun, 0.15), C.apricot];
    const EVE = [mix(C.duskViolet, C.skyBlue, 0.3), C.dusk, C.apricot];
    const sk = sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1250, y: 330, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 170, C.cream, C.peach), { x: 380, y: 120, len: 600 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 170, speed: 40, scale: 0.45 });

    /* the lake far below, hills, a house in the valley */
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.dusk, 0.15) }).markup);
    far.add(waterBand(c, { y: 440, color: mix(C.lake, C.dawn, 0.25), foamN: 14, bottom: 520 }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 488, amps: [14, 6, 2], lens: [800, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 20 });
    mid.add(h2.markup);
    mid.add(house(c, 1250, h2.fn(1250) + 6, 44, 32));
    const win = mid.add(`<g opacity="0"><circle r="26" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(-4, -4, 8, 7))}" fill="${C.lampFlame}"/></g>`);

    /* the hilltop meadow */
    const top = S.layer({ par: 0.34, sh: 4 });
    const tfn = c.wave(528, [8, 3], [900, 220]);
    top.add(sheet().p(c.ridge((x) => tfn(x) + Math.pow((x - 800) / 900, 2) * 60, -900, 2500, 1700, 12, 1), C.hillNear).out());
    top.add(olive(c, 250, 560, 1.1) + olive(c, 1400, 566, 1));
    top.add(grass(c, { x0: -400, x1: 2000, y: 540, n: 44, h: 13, color: C.olive, fn: (x) => tfn(x) + Math.pow((x - 800) / 900, 2) * 60 }) + flowers(c, { x0: 380, x1: 1220, y: 600, n: 26, h: 12, fn: (x) => 560 + Math.abs(x - 800) * 0.05 }));

    /* the Twelve in an arc, name tags on strings above them */
    const arcL = S.layer({ par: 0.4, sh: 4 });
    const tagL = S.layer({ par: 0.4, sh: 5 });
    const spotL = S.layer({ par: 0.4, sh: 1, flat: true });
    const AP = TWELVE.map((a, i) => {
      // phone: the row is drawn narrower so Peter's and Judas's tags stay inside the screen
      const x = S.portrait ? 512 + (i * 550) / 11 : 468 + (i * 664) / 11, k = Math.pow((x - 800) / (S.portrait ? 275 : 332), 2);
      const m = { ...a, i, x, y: 604 - 40 * (1 - k), s: 0.74 + 0.1 * k, flip: x > 800, seed: c.rr(0, 9), at: AT[i], level: i % 2 };
      m.spot = spotL.add(`<g opacity="0"><ellipse cx="0" cy="-60" rx="70" ry="110" fill="url(#warm-glow)"/></g>`);
      m.p = S.puppet(arcL.add(person(c, { ...a.o })));
      const name = a.name();
      const front = nameTag(c, name, { size: 15, dark: a.k === 'judas' });
      let inner = `<g data-part="front">${front}</g>`;
      if (a.k === 'peter') inner += `<g data-part="back" opacity="0">${nameTag(c, tr('Piotr', 'Peter'), { size: 19, w: 96 })}<g transform="translate(0 62)">${rockIcon(c)}</g></g>`;
      m.tagY = m.y - 167 * m.s - 112 - m.level * 78;
      m.tag = hanging(tagL, inner, { x, y: m.tagY, len: 700 });
      m.front = m.tag.querySelector('[data-part="front"]');
      m.back = m.tag.querySelector('[data-part="back"]');
      return m;
    });
    // Boanerges: a small thundercloud over James and John
    const thunder = hanging(tagL, `${thunderCloud(c, 190)}<text x="0" y="-18" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.cream}">Boanerges</text><text x="0" y="2" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="13" font-style="italic" fill="${C.cream}">${tr('synowie gromu', 'Sons of Thunder')}</text>`, { x: 690, y: 200, len: 700 });
    const bolt = thunder.querySelector('[data-part="bolt"]');
    const flash = spotL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="150" ry="120" fill="#fff6d8"/></g>`);

    /* Jesus in front */
    const front = S.layer({ par: 0.5, sh: 5 });
    const jGlow = front.add(`<g opacity=".5"><circle r="120" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(front.add(person(c, { ...CAST.jesus })));

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 220, 960, 220, C.sage, C.moss) + bush(c, 1380, 968, 240, C.sage, C.moss) + rock(c, 1240, 980, 150, 50, C.rock2));

    return (t, time) => {
      const T = time;
      sk.blend(GOLD, EVE, es(t, 0, 6, ease.sine));
      swing(sunEl, 1250, 330 + es(t, 0, 6) * 60, T, 1, 0.6);
      swing(cl1, 380 + t * 10, 120, T, 1.4, 0.6, 1);
      birds(T);

      // who has just been named?
      let cur = -1;
      AP.forEach((m) => { if (t >= m.at - 0.02) cur = m.i; });
      const curM = AP[Math.max(0, cur)];

      AP.forEach((m) => {
        const drop = es(t, m.at, m.at + 0.22, ease.back);
        const fw = bump(t, m.at - 0.02, m.at + (m.i >= 3 && m.i <= 10 ? 0.42 : 0.7));
        const judas = m.k === 'judas';
        const aside = judas ? es(t, 5.3, 5.7) : 0;
        m.p.set({
          x: m.x + (judas ? aside * 26 : 0), y: m.y + fw * 18, s: m.s * (1 + fw * 0.08), flip: m.flip,
          armB: fw * (judas ? 20 : 120), armF: fw * 30 + (t > m.at ? 10 : 0),
          head: -fw * 4 + (judas ? aside * 14 : 0) + (m.i === 1 || m.i === 2 ? bump(t, 2.1, 2.5) * -10 : 0),
          blink: blinkAt(T, m.seed),
        });
        pose(m.spot, { x: m.x, y: m.y + fw * 18, s: m.s * 1.3, o: fw * 0.8 });
        const shake = (m.i === 1 || m.i === 2) ? bump(t, 2.15, 2.6) * Math.sin(T * 30) * 3 : 0;
        pose(m.tag, { x: m.x + shake, y: lerp(-260, m.tagY, drop), r: Math.sin(T * 0.8 + m.seed) * 2.2 + shake, o: drop > 0.001 ? 1 : 0 });
        if (m.back) {
          const k = seg(t, 0.46, 0.62);
          pose(m.front, { sx: k < 0.5 ? Math.max(0.04, Math.cos(k * PI)) : 0.04, o: k < 0.5 ? 1 : 0 });
          pose(m.back, { sx: k < 0.5 ? 0.04 : Math.max(0.04, -Math.cos(k * PI)), o: k < 0.5 ? 0 : 1 });
        }
      });

      /* Boanerges */
      const th = es(t, 2.05, 2.35, ease.back);
      pose(thunder, { x: 690 + Math.sin(T * 26) * 3 * bump(t, 2.2, 2.7), y: lerp(-300, 200, th), r: Math.sin(T * 0.7) * 2, o: th > 0.001 ? 1 : 0 });
      const zap = Math.max(bump(t, 2.25, 2.4), bump(t, 2.5, 2.6) * 0.8);
      fade(bolt, zap > 0.2 ? 1 : 0);
      pose(flash, { x: 540, y: 470, o: zap * 0.45 });

      /* Jesus turns to each as he names him */
      const side = curM.x < 800;
      const naming = t < 5.6;
      const toHouse = es(t, 5.55, 5.8);
      jesus.set({
        x: 800, y: JY, s: 1.02, flip: toHouse > 0.5 ? false : side,
        armF: 14 + (naming ? 50 + bump(t, curM.at - 0.05, curM.at + 0.3) * 30 : 0) + toHouse * 40 + Math.sin(T * 1.1) * 2,
        armB: 8 + bump(t, 0, 0.9) * 40, head: -3 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });
      pose(jGlow, { x: 800, y: JY - 170, o: 0.45 + Math.sin(T * 1.3) * 0.05 });
      pose(win, { x: 1272, y: h2.fn(1250) - 12, o: es(t, 5.6, 5.9) });

      S.cam.z = 1 + es(t, 0.9, 1.4) * 0.04 - es(t, 2.9, 3.2) * 0.04;
      S.cam.x = -es(t, 0.9, 1.4) * 20 + es(t, 2.9, 3.2) * 20 + es(t, 4.9, 5.3) * (S.portrait ? 45 : 20);   // phone: a little further, to Judas
      S.cam.y = -es(t, 1.9, 2.2) * 20 + es(t, 2.9, 3.2) * 20;
    };
  },
};
