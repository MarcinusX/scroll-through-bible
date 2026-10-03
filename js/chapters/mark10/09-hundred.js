// Mk 10,28–31 — Peter: "We have left everything" — a sepia card of the lake, the boat and the nets
// swings down behind him. Jesus: no one who has left house, brothers, sisters, mother, father, children
// or fields… — a row of little picture cards comes down. Each fans out a hundredfold (a few dark
// thorn-clouds too: with persecutions). Eternal life: a great dawn on the horizon. Last of all a queue
// walks to a gate of light — and turns round: the first will be last, and the last first.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing, crowdPerson } from '../kit.js';
import { bush, rock, olive, house, sun as sunCut, band } from '../../assets/nature.js';
import { boat, rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, TWELVE, doll, slip, say, thornCrown } from './lib.js';
import { stormCloud } from '../../assets/things.js';

const GY = 676;
const JX = 780;

/** a small picture card; origin top-centre */
function card(c, icon, w = 84, h = 84) {
  const s = sheet().p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 6), C.cream).p(c.cut(c.rect(-w / 2 + 5, 5, w - 10, h - 10), 0.3, 6), C.parchment).out();
  return `${s}<g transform="translate(0 ${h * 0.82})">${icon}</g>`;
}
/** a patch of field: furrows and wheat; origin: bottom centre */
function field(c, w = 60) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 8, -26], [w / 2 - 8, -26], [w / 2, 0]], 0.4, 5), C.wheat);
  let f = '';
  for (let i = 0; i < 5; i++) f += c.ribbon([[-w / 2 + 4 + i * 2, -4 - i * 5], [w / 2 - 4 - i * 2, -4 - i * 5]], 1.4);
  s.x(f, C.wheat2, 'opacity=".8"');
  return s.out();
}

export default {
  id: 'm10-hundred',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30, text: 'z powodu Mnie i z powodu Ewangelii, żeby nie otrzymał stokroć więcej teraz, w tym czasie, domów, braci, sióstr, matek, dzieci i pól, wśród prześladowań,' },
    { v: 30, cont: true, text: 'a życia wiecznego w czasie przyszłym.' },
    { v: 31 },
  ],
  cam: { x: [-30, 30], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    // phone: the card of the lake, the row of cards, the storms, the disciples, the gate and the queue close in
    const MEMX = P ? 960 : 1080, PX = P ? 905 : 940, GATEX = P ? 1045 : 1165;
    const R = roadSet(S, { jer: 0.32, jerX: 1190, roadX: 820, trees: 16, clouds: [[470, 140, 160], [1080, 110, 110]] });
    // the dawn of the age to come, behind the far hills
    const dawnL = S.layer({ par: 0.06, sh: 1, flat: true });
    const dawn = dawnL.add(`<g opacity="0">${rays(c, { n: 22, r0: 70, r1: 1000, spread: 0.045, color: '#fff1c6' })}<circle r="340" fill="url(#halo-glow)"/><circle r="130" fill="url(#warm-glow)"/></g>`);
    const dawnSun = dawnL.add(`<g opacity="0">${sunCut(c, 70, { rays: C.sunDeep, disc: '#f3c070', inner: '#f8d9a0' })}</g>`);
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1420, 606, 0.9));

    /* hanging: Peter's memory card; the row of cards; storm clouds of persecution */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const b = boat(c, { mast: true });
    const memInner = sheet().p(c.cut(c.rect(-110, 0, 220, 140), 0.6, 7), C.cream).p(c.cut(c.rect(-102, 8, 204, 124), 0.4, 7), mix(C.parchment, C.dune, 0.35)).p(c.cut([[-102, 84], [102, 80], [102, 132], [-102, 132]], 0.4, 7), mix(C.lake, C.parchment, 0.45)).out();
    const memory = hanging(hangL, `<g>${memInner}<g transform="translate(-20 104) scale(.34)">${b.back}${b.front}</g><g transform="translate(30 80)">${house(c, 26, 0, 40, 30, { stairs: false })}</g></g>`, { x: MEMX, y: 150, len: 800 });
    const ICONS = [
      `<g transform="translate(-20 0)">${house(c, 0, 0, 40, 32, { stairs: false })}</g>`,
      `<g transform="translate(-12 0) scale(.62)">${doll(c, C.dustyBlue)}</g><g transform="translate(12 0) scale(.62)">${doll(c, C.sageRobe)}</g>`,
      `<g transform="translate(-12 0) scale(.62)">${doll(c, C.roseRobe, { woman: true, skin: C.skin })}</g><g transform="translate(12 0) scale(.62)">${doll(c, C.lavender, { woman: true })}</g>`,
      `<g transform="scale(.7)">${doll(c, C.mauve, { woman: true, skin: C.skin3 })}</g>`,
      `<g transform="scale(.72)">${doll(c, C.tealRobe, { skin: C.skin3 })}</g>`,
      `<g transform="translate(-12 0) scale(.45)">${doll(c, C.wheatRobe)}</g><g transform="translate(12 0) scale(.45)">${doll(c, C.peach, { woman: true, skin: C.skin })}</g>`,
      field(c),
    ];
    const XS = P ? [505, 597, 689, 781, 873, 965, 1057] : [500, 605, 710, 815, 920, 1025, 1130];
    const CARDS = ICONS.map((icon, i) => {
      const one = card(c, icon);
      let fan = '';
      for (let k = 0; k < 6; k++) fan += `<g transform="translate(0 110) rotate(${(k - 2.5) * 11}) translate(0 -110)">${one}</g>`;
      const el = hanging(hangL, `<g class="fan" opacity="0">${fan}</g><g>${one}</g>`, { x: XS[i], y: 230, len: 800 });
      return { el, fan: el.querySelector('.fan'), i, x: XS[i] };
    });
    const times = hangL.add(`<g opacity="0">${slip(c, tr('× 100', '× 100'), { size: 30 })}</g>`);
    const storms = (P ? [[530, 150], [1035, 160]] : [[470, 170], [1180, 190]]).map(([x, y], i) => ({ el: hanging(hangL, `<g transform="scale(.5)">${stormCloud(c, 220)}</g><g transform="translate(0 40) scale(.55)">${thornCrown(c, 40, C.storm2)}</g>`, { x, y, len: 800 }), x, y, i }));

    /* verse 31: a line of paper dolls walks to a gate of light — then the line turns round */
    const qL = S.layer({ par: 0.3, sh: 4 });
    const gateEl = hanging(qL, `<g><circle cy="-60" r="90" fill="url(#halo-glow)"/>${sheet().p(c.cut([[-30, 0], [-30, -90], ...c.arc(0, -90, 30, 26, Math.PI, 2 * Math.PI, 10), [30, 0]], 0.4, 5), C.sun).x(c.cut([[-20, 0], [-20, -88], ...c.arc(0, -88, 20, 18, Math.PI, 2 * Math.PI, 10), [20, 0]], 0.3, 4), '#fff6d6').out()}</g>`, { x: GATEX, y: 360, len: 800 });
    const DOLLC = [C.dustyBlue, C.roseRobe, C.sageRobe, C.ochreRobe, C.lavender, C.tealRobe, C.wheatRobe, C.mauve];
    const QUEUE = DOLLC.map((col, i) => ({ i, el: hanging(qL, `<g class="d">${doll(c, col, { woman: i % 2 === 1, h: 74, skin: [C.skin, C.skin2, C.skin3][i % 3] })}</g><g transform="translate(0 -104)">${slip(c, String(i + 1), { size: 17, w: 28 })}</g>`, { x: 0, y: 0, len: 800 }) }));
    QUEUE.forEach((m) => { m.d = m.el.querySelector('.d'); m.x = P ? 965 - m.i * 63 : 1080 - m.i * 70; });

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [3, 1, 2, 6].map((k, i) => ({ i, p: S.puppet(pL.add(person(c, TWELVE[k].o))), seed: c.rr(0, 9), x: P ? 952 + i * 36 : 1020 + i * 58, y: GY - 36 + (i % 2) * 14 }));
    const peter = S.puppet(pL.add(person(c, TWELVE[0].o)));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const wordL = S.layer({ par: 0.5, sh: 6 });
    const left = wordL.add(`<g opacity="0">${say(c, tr(['Oto my opuściliśmy', 'wszystko!'], ['We have left', 'everything!']), { size: 19, side: 1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 20 });
      const eternal = es(t, 3.02, 3.5);
      R.sk.blend(['#cfe0da', '#efe6cd', '#f6e8cf'], ['#e7dcc8', '#f8e3bf', '#fbe7c6'], eternal * (1 - es(t, 4.0, 4.4) * 0.5));

      /* beat 0: Peter — we have left everything (the boat, the nets, the house) */
      const pk = es(t, 0.02, 0.3) * (1 - es(t, 0.9, 1.1));
      peter.set({ x: PX, y: GY, s: 0.98, flip: true, armF: 18 + pk * 60, armB: pk * 110, head: -pk * 4, blink: blinkAt(T, 3) });
      pose(left, { x: PX - 20, y: GY - 212, s: es(t, 0.05, 0.3, ease.back), o: t > 0.05 && t < 1.1 ? 1 - es(t, 0.95, 1.1) : 0 });
      const mem = es(t, 0.15, 0.5, ease.back) * (1 - es(t, 0.95, 1.2));
      swing(memory, MEMX, 150 - (1 - mem) * 1100, T, 1, 0.7, 1);
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.86, flip: true, head: -3 - eternal * 6, armF: 10 + eternal * 30, blink: blinkAt(T, d.seed) }));

      /* Jesus answers */
      const speak = es(t, 1.02, 1.3);
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 18 + speak * (50 + Math.sin(T * 1.2) * 8) * (1 - eternal) + eternal * 80 - es(t, 4, 4.3) * 40, armB: speak * 40 + eternal * 90 * (1 - es(t, 4, 4.3)), head: -3 - eternal * 8 + Math.sin(T * 0.6), blink: blinkAt(T) });

      /* beat 1: the row of cards comes down; beat 2: each fans out a hundredfold, with persecutions */
      const fan = es(t, 2.05, 2.5);
      const rise = es(t, 3.0, 3.4);
      CARDS.forEach((cd) => {
        const d = es(t, 1.05 + cd.i * 0.08, 1.35 + cd.i * 0.08, ease.back);
        swing(cd.el, cd.x, 262 + (cd.i % 2) * 22 - (1 - d) * 1100 - rise * 1100, T, 1.4 * (1 - fan), 0.8, cd.i);
        pose(cd.fan, { o: fan, s: 0.6 + fan * 0.4 });
      });
      pose(times, { x: 815, y: 440, s: es(t, 2.2, 2.45, ease.back) * 1.1, r: -4, o: t > 2.2 && t < 3.3 ? 1 - es(t, 3.0, 3.3) : 0 });
      storms.forEach((st) => swing(st.el, st.x, st.y - (1 - es(t, 2.4, 2.7)) * 1100 - rise * 1100, T, 2, 1, st.i));

      /* beat 3: eternal life in the age to come — a great dawn */
      pose(dawn, { x: P ? 930 : 1000, y: 470, s: 0.5 + eternal * 0.6, r: t * 6, o: eternal * (1 - es(t, 3.9, 4.3) * 0.75) });

      /* beat 4: the line of dolls: No. 1 is nearest the gate… then the whole line turns round */
      const q = es(t, 3.9, 4.25, ease.back);
      const turn = es(t, 4.4, 4.75);
      swing(gateEl, GATEX, 360 - (1 - q) * 1100, T, 0.8, 0.6, 5);
      QUEUE.forEach((m) => {
        const x = lerp(m.x, (P ? 1488 : 1710) - m.x, turn) + 10;
        swing(m.el, x, 372 - (1 - q) * 1100 - Math.sin(turn * Math.PI) * 26, T, 1.6, 0.9, m.i);
        pose(m.d, { sx: Math.cos(turn * Math.PI) >= 0 ? Math.max(0.15, Math.abs(Math.cos(turn * Math.PI))) : -Math.max(0.15, Math.abs(Math.cos(turn * Math.PI))) });
      });
      pose(dawnSun, { x: P ? 930 : 1000, y: 470 - eternal * 60 + es(t, 3.9, 4.4) * 140, o: eternal });

      S.cam.y = -es(t, 0.9, 1.3) * 30 + es(t, 3.8, 4.2) * 20;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.02 + es(t, 3.8, 4.2) * 0.02;
    };
  },
};
