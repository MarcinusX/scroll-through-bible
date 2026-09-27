// Mk 3,22–26 — scribes come down from Jerusalem: "He has Beelzebul!" — an ink-cloud of flies.
// Jesus calls them over and answers in parables, hung in a picture frame above them all:
// Satan throwing out Satan; a kingdom, a house, and Satan himself torn in two, falling apart.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, cloud, olive, palm, town, bush, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { scribe, man, woman, headAt, handAt, strip, question, tornPair } from './lib.js';

const PI = Math.PI;
const JX = 800, JY = 668;
const FX = 800, FY = 118;          // the picture frame hangs here (top-centre)
const FW = 330, FH = 236;
const DEVIL = '#3d3346';

/** a shadow-puppet devil: horns, tail with an arrow tip; faces right; feet at (0,0) */
function devil(c, s = 1, { arms = 'up' } = {}) {
  const S_ = (pts) => pts.map(([x, y]) => [x * s, y * s]);
  const d = sheet();
  d.p(c.cut(S_([[-14, 0], [-18, -30], [-14, -60], [-8, -74], [8, -74], [14, -60], [18, -30], [14, 0], [6, 0], [2, -22], [-2, -22], [-6, 0]]), 0.5, 5), DEVIL);
  d.p(c.cut(S_(c.circ(0, -86, 13, 16)), 0.3, 4), DEVIL);
  d.p(c.cut(S_([[-10, -94], [-16, -112], [-4, -98]]), 0.2, 3) + c.cut(S_([[10, -94], [16, -112], [4, -98]]), 0.2, 3), DEVIL);
  d.p(c.ribbon(S_(c.cbez([-12, -20], [-40, -16], [-44, -50], [-30, -58], 12)), 3 * s) + c.cut(S_([[-30, -66], [-24, -54], [-36, -54]]), 0.2, 3), DEVIL);
  const armPts = arms === 'up' ? [[[-12, -64], [-26, -82], [-30, -100]], [[12, -64], [26, -82], [30, -100]]] : [[[-12, -64], [-30, -50], [-40, -40]], [[12, -64], [30, -52], [42, -48]]];
  d.p(armPts.map((a) => c.ribbon(S_(a), 6 * s)).join(''), DEVIL);
  d.x(c.poly(S_(c.circ(-4, -88, 2.2, 6))) + c.poly(S_(c.circ(5, -88, 2.2, 6))), C.sun);
  return d.out();
}
/** a painted card for the frame: parchment with a hand-cut edge */
function plate(c, inner) {
  const s = sheet();
  s.p(c.cut(c.rect(-FW / 2 + 16, 16, FW - 32, FH - 32), 0.6, 10), C.parchment);
  return `${s.out()}${inner}`;
}
function kingdomArt(c) {
  const s = sheet();
  s.p(c.cut([[-140, 190], [-140, 150], [-90, 132], [-30, 140], [30, 128], [90, 138], [140, 146], [140, 190]], 1, 8), C.hillNear);
  // the castle, and two banners that don't agree
  s.p(c.cut([[-60, 150], [-60, 90], [-44, 90], [-44, 80], [-36, 80], [-36, 90], [36, 90], [36, 80], [44, 80], [44, 90], [60, 90], [60, 150]], 0.4, 5), C.stone2);
  s.p(c.cut([[-72, 150], [-72, 66], [-48, 66], [-48, 150]], 0.3, 5) + c.cut([[48, 150], [48, 66], [72, 66], [72, 150]], 0.3, 5), C.stone);
  s.p(c.cut([[-76, 66], [-60, 44], [-44, 66]], 0.3, 4) + c.cut([[44, 66], [60, 44], [76, 66]], 0.3, 4), C.terracotta);
  s.p(c.cut(c.arc(0, 150, 16, 22, PI, 2 * PI, 8), 0.3, 4), C.wood2);
  s.p(c.ribbon([[-60, 44], [-60, 24]], 2) + c.ribbon([[60, 44], [60, 24]], 2), C.wood2);
  s.p(c.cut([[-60, 24], [-34, 30], [-60, 36]], 0.2, 3), C.dustyBlue);
  s.p(c.cut([[60, 24], [34, 30], [60, 36]], 0.2, 3), C.jesusMantle);
  // a crown floating over it
  s.p(c.cut([[-18, 40], [-18, 22], [-10, 30], [0, 16], [10, 30], [18, 22], [18, 40]], 0.3, 3), C.sun);
  return s.out();
}
function houseArt(c) {
  let out = house(c, -70, 180, 140, 104, { stairs: false });
  const s = sheet();
  s.p(c.cut([[-84, 76], [84, 76], [84, 84], [-84, 84]], 0.3, 6), C.roof);
  out += s.out();
  // two people inside, quarrelling (scribble clouds)
  const a = person(c, { robe: C.dustyBlue, hair: C.hair2, beard: 'short' }), b = person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2 });
  out += `<g transform="translate(-40 178) scale(.42)">${a.replace('class="armFr"', 'class="armFr" transform="rotate(-80)"')}</g><g transform="translate(40 178) scale(-.42 .42)">${b.replace('class="armFr"', 'class="armFr" transform="rotate(-80)"')}</g>`;
  const sc = sheet().x(c.ribbon(c.cbez([-14, 0], [-4, -12], [4, 12], [14, 0], 12), 2.2), C.ink).x(c.ribbon(c.cbez([-12, 6], [-2, -6], [6, 14], [12, 4], 12), 2), C.terracotta).out();
  out += `<g transform="translate(-18 88)">${sc}</g><g transform="translate(22 92) scale(-1 1)">${sc}</g>`;
  return out;
}
/** the Beelzebul cloud: dark ink, a label */
function inkCloud(c) {
  const s = sheet();
  const pts = [];
  for (let i = 0; i < 18; i++) { const a = (i / 18) * PI * 2, r = (i % 2 ? 60 : 72) * c.rr(0.85, 1.1); pts.push([Math.cos(a) * r * 1.5, Math.sin(a) * r * 0.62]); }
  s.p(c.cut(pts, 1.6, 5), '#433a4c');
  s.p(c.cut(c.blob(-30, -10, 50, 20, 12, 0.3), 1.2, 4), '#54495e');
  let sc = '';
  for (let i = 0; i < 4; i++) sc += c.ribbon(c.cbez([c.rr(-80, -20), c.rr(-20, 20)], [c.rr(-40, 0), c.rr(-40, 40)], [c.rr(0, 40), c.rr(-40, 40)], [c.rr(20, 80), c.rr(-20, 20)], 12), 1.6);
  s.x(sc, '#6b6076', 'opacity=".8"');
  return `${s.out()}<g transform="translate(0 64)">${strip(c, tr('Belzebub', 'Beelzebul'), { size: 21, fill: mix(C.cream, C.rock2, 0.3) })}</g>`;
}
function fly(c) {
  return sheet().p(c.cut(c.ell(0, 0, 5, 3.2, 10), 0.2, 3), '#2b2530').x(c.poly(c.ell(-1, -4, 3, 2, 8, -0.4)) + c.poly(c.ell(2, -4, 3, 2, 8, 0.4)), '#cfd6e0', 'opacity=".75"').out();
}

export default {
  id: 'm3-scribes',
  beats: [
    { v: 22, text: 'Natomiast uczeni w Piśmie, którzy przyszli z Jerozolimy, mówili:' },
    { v: 22, cont: true, text: '«Ma Belzebuba i przez władcę złych duchów wyrzuca złe duchy».' },
    { v: 23, text: 'Wtedy przywołał ich do siebie i mówił im w przypowieściach:' },
    { v: 23, cont: true, text: '«Jak może szatan wyrzucać szatana?' },
    { v: 24 },
    { v: 25 },
    { v: 26 },
  ],
  cam: { x: [-20, 60], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#d4e2dc', '#efe6cf', '#f4e2c6']);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 430, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 120), { x: 1200, y: 110, len: 600 });

    /* Jerusalem on its far hill (right), the village square with the house */
    const far = S.layer({ par: 0.12, sh: 2 });
    const fb = band(c, { y: 440, amps: [20, 8, 3], lens: [900, 320, 120], color: C.hillFar });
    far.add(fb.markup);
    const walls = sheet();
    walls.p(c.cut([[1180, 420], [1180, 384], [1196, 384], [1196, 376], [1206, 376], [1206, 384], [1330, 384], [1330, 376], [1340, 376], [1340, 384], [1360, 384], [1360, 420]], 0.5, 6), mix(C.stone2, C.ochre, 0.2));
    walls.p(c.cut([[1250, 384], [1250, 350], [1262, 340], [1286, 340], [1298, 350], [1298, 384]], 0.4, 5), C.stone2);
    walls.p(c.cut(c.arc(1274, 344, 20, 16, PI, 2 * PI, 10), 0.3, 4), C.sun);
    far.add(walls.out());
    const mid = S.layer({ par: 0.22, sh: 3 });
    const mb = hillsWith(c, { y: 500, amps: [12, 6, 2], lens: [800, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    mid.add(mb.markup);
    // the road from Jerusalem winding in from the right
    mid.add(`<path d="${c.ribbon([[1420, 470], [1300, 500], [1180, 540], [1080, 580]], (u) => 8 + u * 30)}" fill="${C.sand2}" opacity=".85"/>`);
    const square = S.layer({ par: 0.34, sh: 3 });
    square.add(sheet().p(c.ridge(c.wave(560, [5, 2], [700, 170]), -900, 2500, 1700, 12, 1), C.sand).out());
    square.add(house(c, 180, 560, 150, 110) + house(c, 360, 556, 110, 84) + olive(c, 1140, 566, 0.9) + palm(c, 1350, 566, 200));
    const sign = sheet();
    sign.p(c.ribbon([[1110, 610], [1112, 520]], 6), C.wood2);
    sign.p(c.cut([[1070, 520], [1180, 520], [1196, 534], [1180, 548], [1070, 548]], 0.4, 5), C.wood3);
    square.add(`${sign.out()}<text x="1128" y="540" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.ink}">${tr('Jerozolima', 'Jerusalem')}</text>`);

    /* the crowd at the left */
    const crowdL = S.layer({ par: 0.42, sh: 3 });
    const CROWD = [[380, 612, 0.72], [440, 606, 0.7], [500, 616, 0.74], [560, 610, 0.72], [410, 650, 0.8], [480, 656, 0.82], [550, 652, 0.8], [620, 648, 0.78]].map(([x, y, s], i) => ({ x, y, s, i, seed: c.rr(0, 9), sit: i >= 4, p: S.puppet(crowdL.add(person(c, { ...crowdPerson(c), pose: i >= 4 ? 'sit' : 'stand' }))) }));

    /* the picture frame of the parables */
    const frameL = S.layer({ par: 0.4, sh: 7 });
    const fr = sheet();
    fr.p(c.cut(c.rect(-FW / 2, 0, FW, FH), 0.6, 10) + c.hole(c.rect(-FW / 2 + 16, 16, FW - 32, FH - 32), 0.5, 10), C.ochre);
    fr.p(c.cut(c.rect(-FW / 2 + 6, 6, FW - 12, 6), 0.3, 8), shade(C.ochre, 0.25));
    let orn = '';
    [[-FW / 2 + 8, 8], [FW / 2 - 8, 8], [-FW / 2 + 8, FH - 8], [FW / 2 - 8, FH - 8]].forEach(([x, y]) => { orn += c.cut(c.circ(x, y, 9, 10), 0.3, 3); });
    fr.p(orn, C.sunDeep);
    const frameEl = hanging(frameL, `<g data-part="bg"><path d="${c.cut(c.rect(-FW / 2 + 16, 16, FW - 32, FH - 32), 0.5, 10)}" fill="${mix(C.parchment, C.lavender, 0.25)}"/></g>${fr.out()}<g transform="translate(0 ${FH + 22})">${strip(c, tr('przypowieść', 'a parable'), { size: 16 })}</g>`, { x: FX, y: FY, len: 700 });
    const cardsL = S.layer({ par: 0.4, sh: 3 });
    // beat 3: satan throwing out satan — two shadow puppets, tied together by the tail
    const q = cardsL.add(`<g opacity="0">${plate(c, `
      <path d="${c.cut([[-24, 196], [-24, 70], [24, 70], [24, 196]], 0.4, 6)}" fill="${C.wood3}"/><path d="${c.cut([[-16, 196], [-16, 80], [16, 80], [16, 196]], 0.3, 6)}" fill="${C.soilDark}"/>
      <g data-part="d1" transform="translate(-40 196)">${devil(c, 1, { arms: 'push' })}</g>
      <g data-part="d2" transform="translate(40 196) scale(-1 1)">${devil(c, 1, { arms: 'push' })}</g>
      <g data-part="q" opacity="0" transform="translate(0 50)">${question(c)}</g>`)}</g>`);
    const qD1 = q.querySelector('[data-part="d1"]'), qD2 = q.querySelector('[data-part="d2"]'), qQ = q.querySelector('[data-part="q"]');
    // beats 4–6: pictures that tear in two
    const tearables = [kingdomArt(c), houseArt(c), `<g transform="translate(0 196)">${devil(c, 1.45, { arms: 'up' })}</g>`].map((art, i) => {
      const inner = plate(c, art);
      const halves = tornPair(c, inner, [-FW / 2 + 16, 16, FW / 2 - 16, FH - 16], c.rr(-10, 10), S.id('tear' + i));
      return { i, L: cardsL.add(`<g opacity="0">${halves.left}</g>`), R: cardsL.add(`<g opacity="0">${halves.right}</g>`) };
    });

    /* the scribes (right) and Jesus */
    const act = S.layer({ par: 0.5, sh: 5 });
    const SCR = [0, 1, 2].map((i) => ({ i, x: [950, 1036, 1116][i], y: [664, 672, 660][i], s: [0.96, 0.98, 0.94][i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, scribe(c, i)))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const cloudEl = act.add(`<g opacity="0">${inkCloud(c)}</g>`);
    const flies = Array.from({ length: 7 }, (_, i) => ({ i, el: act.add(`<g opacity="0">${fly(c)}</g>`), ph: c.rr(0, 6), r: c.rr(60, 120) }));
    const beckon = act.add(`<g opacity="0"><circle r="80" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 230, 970, 220, C.sage, C.moss) + rock(c, 1360, 985, 190, 64, C.rock2) + grass(c, { x0: 0, x1: 1600, y: 940, n: 30, h: 20, color: C.moss }));

    return (t, time) => {
      const T = time;
      swing(cl1, 430 + t * 6, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1200 - t * 5, 110, T, 1.4, 0.7, 2);

      /* the scribes arrive from Jerusalem, accuse, are called closer */
      const come = (i) => es(t, 0.02 + i * 0.1, 0.62 + i * 0.1);
      const closer = es(t, 2.1, 2.5);
      SCR.forEach((m) => {
        const k = come(m.i);
        const x = lerp(m.x + 520, m.x, k) - closer * 50;
        const accuse = es(t, 1.05 + m.i * 0.08, 1.25 + m.i * 0.08) * (1 - es(t, 2.0, 2.2));
        const shaken = es(t, 6.2, 6.5);
        m.p.set({ x, y: m.y, s: m.s, flip: true, walk: (k > 0 && k < 1) || (t > 2.1 && t < 2.5) ? x * 0.06 : undefined, armF: 20 + accuse * (m.i === 1 ? 70 : 40), armB: accuse * (m.i === 0 ? 110 : 0), head: -accuse * 6 + es(t, 2.5, 2.8) * -8 + shaken * 10, lean: -accuse * 4 + shaken * 4, blink: blinkAt(T, m.seed) });
      });

      /* Jesus: listens, beckons, then tells the parables toward the frame */
      const beck = bump(t, 2.0, 2.7);
      const tell = es(t, 2.6, 2.9);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 12 + beck * 80 + tell * (40 + bump(t, 3.1, 3.7) * 30 + bump(t, 4.1, 4.7) * 30 + bump(t, 5.1, 5.7) * 30 + bump(t, 6.1, 6.7) * 30), armB: 8 + tell * 50, head: -3 + tell * -4 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      pose(beckon, { x: 870, y: 520, o: beck * 0.8, s: 0.8 + beck * 0.4 });

      /* crowd reacts */
      CROWD.forEach((m) => {
        const gasp = es(t, 1.2 + m.i * 0.04, 1.4 + m.i * 0.04) * (1 - es(t, 2.2, 2.5));
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, armF: gasp * (m.i % 2 ? 60 : 20), armB: gasp * (m.i % 3 === 0 ? 100 : 0), head: -gasp * 8 + es(t, 2.8, 3.2) * -6, lean: -gasp * 4, blink: blinkAt(T, m.seed) });
      });

      /* "Beelzebul" — an ink-cloud with flies; it breaks up once Satan falls */
      const cOn = es(t, 1.08, 1.4, ease.back) * (1 - es(t, 6.35, 6.8));
      pose(cloudEl, { x: 880, y: 420 + Math.sin(T * 1.3) * 4, s: Math.max(0.01, cOn), r: Math.sin(T * 0.9) * 3, o: cOn > 0.01 ? 1 : 0 });
      flies.forEach((f) => {
        const a = T * (1.8 + f.i * 0.2) + f.ph, scatter = es(t, 6.35, 6.9);
        pose(f.el, { x: 880 + Math.cos(a) * f.r * (1 + scatter * 4), y: 420 + Math.sin(a * 1.3) * f.r * 0.4 - scatter * 200, r: (a * 180) / PI, s: 1.3, o: cOn > 0.3 ? cOn : 0 });
      });

      /* the frame drops in; the cards come and go */
      const fIn = es(t, 2.2, 2.6, ease.back);
      pose(frameEl, { x: FX, y: lerp(-420, FY, fIn), r: Math.sin(T * 0.6) * 1, o: fIn > 0.001 ? 1 : 0 });
      const cy = lerp(-420, FY, fIn);
      // Satan casting out Satan
      const qOn = es(t, 3.02, 3.25) * (1 - es(t, 3.95, 4.05));
      pose(q, { x: FX, y: cy, o: qOn });
      const tug = Math.sin(seg(t, 3.2, 3.9) * PI * 4);
      pose(qD1, { x: -40 + tug * 8, y: 196, r: tug * 4 });
      pose(qD2, { x: 40 + tug * 8, y: 196, sx: -1, r: tug * 4 });
      pose(qQ, { x: 0, y: 50, s: es(t, 3.4, 3.6, ease.back), o: es(t, 3.4, 3.5) });
      // kingdom, house, Satan: shown, torn, fallen
      tearables.forEach((tc) => {
        const b0 = 4 + tc.i;
        const show = es(t, b0 + 0.02, b0 + 0.2);
        const tear = es(t, b0 + 0.35, b0 + 0.55, ease.out);
        const fall = es(t, b0 + 0.62, b0 + 1.02, ease.in);
        const o = show * (1 - es(t, b0 + 0.95, b0 + 1.02));
        [tc.L, tc.R].forEach((el, side) => {
          const d = side ? 1 : -1;
          pose(el, { x: FX + d * 60 + d * tear * 16 + d * fall * 60, y: cy + FH + fall * 700, r: d * (tear * 5 + fall * 30), ox: d * 60, oy: FH, o });
        });
      });

      S.cam.x = es(t, -0.2, 0.6) * 50 - es(t, 0.8, 1.3) * 30 - es(t, 1.9, 2.4) * 20;
      S.cam.y = -es(t, 2.2, 2.7) * 50;
      S.cam.z = 1 + es(t, 0.8, 1.3) * 0.05 - es(t, 1.9, 2.4) * 0.05;
    };
  },
};
