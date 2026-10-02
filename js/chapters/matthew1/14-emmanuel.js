// Mt 1,22–23 — all this to fulfil the word of the Lord through the prophet: Isaiah raises his hand as his scroll comes
// down and unrolls, a golden mark reading along its lines. "Behold, the virgin shall conceive and bear a son" — a painted
// oval flies in, the Virgin with the Child — "and they shall call his name Emmanuel", in gold. "Which means: God with us"
// — the oval rises away, and the Mother with the Child stands in the midst of the people, in the light, under the words.
import { C, CAST, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix, crowdPerson } from '../kit.js';
import { stars, band, town } from '../../assets/nature.js';
import {
  DUSK, ISAIAH, MARY, scrollParts, hang2, hungGold, glowDisc, rayBurst, childInArms, sparkle, tint,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const GY = 712;

export default {
  id: 'mt1-emmanuel',
  beats: [
    { v: 22 },
    { v: 23, text: 'Oto Dziewica pocznie i porodzi Syna, któremu nadadzą imię Emmanuel,' },
    { v: 23, cont: true, text: 'to znaczy: "Bóg z nami".' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: Isaiah and the outermost of the people come in from the edges
    const IX = PH ? 575 : 500, FK = PH ? 0.8 : 1;
    const WARM = ['#e3c29e', '#f3d7ad', '#f8e7c9'];
    const sk = sky(S, DUSK);
    const glowL = S.layer({ par: 0.04, sh: 1, flat: true });
    const bigGlow = glowL.add(`<g>${glowDisc(520, 'halo-glow', 1)}${rayBurst(c, { n: 28, r0: 80, r1: 900, spread: 0.026, color: '#fff3cf', o: 0.5 })}</g>`);
    const far = S.layer({ par: 0.07, sh: 2 });
    far.add(band(c, { y: 560, color: mix(C.hillFar, C.duskViolet, 0.25) }).markup + town(c, { x: 800, y: 578, n: 12, spread: 1100, sc: 0.6 }));
    const ground = S.layer({ par: 0.2, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(640, [8, 3], [700, 200]), -1200, 2800, 1900, 12, 1), mix(C.sand2, C.hillNear, 0.3)).out());

    /* ---------- the scroll of Isaiah ---------- */
    const scL = S.layer({ par: 0.2, sh: 6 });
    const sp = scrollParts(c, { w: 360, h: 190, title: tr('Izajasz', 'Isaiah'), lines: 5 });
    const scrollEl = scL.add(hang2(`<g data-k="sheet">${sp.sheet}</g><g data-k="rodB">${sp.rod}</g><g>${sp.rod}</g><g data-k="mark"><path d="${c.ribbon([[-40, 0], [40, 0]], 5)}" fill="${C.sun}" opacity=".7"/></g>`, 170, 600));
    const sheetEl = S.$('sheet'), rodB = S.$('rodB'), mark = S.$('mark');

    /* ---------- the painted oval: the Virgin with the Child ---------- */
    const id = S.id('oval');
    const ov = sheet();
    ov.p(c.cut(c.ell(0, 0, 150, 190, 48), 0.6, 6), C.wood2).p(c.cut(c.ell(0, 0, 140, 180, 48), 0.5, 6), C.sun).p(c.cut(c.ell(0, 0, 128, 168, 48), 0.5, 6), mix(C.night, C.indigo, 0.5));
    const inner = `<g clip-path="url(#${id})"><circle cx="0" cy="-40" r="120" fill="url(#halo-glow)"/>${stars(c, { x0: -120, x1: 120, y0: -160, y1: 0, n: 22 })}<g transform="translate(-4 176) scale(.92)">${person(c, { ...MARY, holdF: childInArms(c) }).replace('class="armFr"', 'class="armFr" transform="rotate(-70)"')}</g></g>`;
    const oval = scL.add(`<g><path d="M-40 -186V-1600M40 -186V-1600" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/>${ov.out()}<clipPath id="${id}"><ellipse rx="128" ry="168"/></clipPath>${inner}</g>`);
    const emm = scL.add(hungGold(c, tr('Emmanuel', 'Immanuel'), { size: 34 }));
    const withUs = scL.add(hungGold(c, tr('Bóg z nami', 'God with us'), { size: 36 }));

    /* ---------- Isaiah; then the people with the Mother and Child in their midst ---------- */
    const P = S.layer({ par: 0.3, sh: 5 });
    const isa = S.puppet(P.add(person(c, ISAIAH)));
    const light = P.add(`<g>${glowDisc(240, 'halo-glow', 1)}</g>`);
    const maryC = S.puppet(P.add(person(c, { ...MARY, holdF: childInArms(c) })));
    const FOLK = [[-330, 8, 0.86], [-250, -10, 0.8], [-170, 4, 0.9], [170, 2, 0.9], [250, -8, 0.82], [330, 8, 0.88]].map(([dx, dy, s], i) => ({ dx: dx * FK, dy, s, i, p: S.puppet(P.add(person(c, crowdPerson(c)))) }));
    const sparks = [0, 1, 2, 3, 4, 5, 6].map((i) => P.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    return (t, time) => {
      const gold = es(t, 1.0, 2.6);
      sk.blend(DUSK, WARM, gold);
      /* v22: the prophet and his scroll */
      const down = es(t, 0.05, 0.4, ease.out), unroll = es(t, 0.3, 0.6), up = es(t, 1.0, 1.3, ease.in);
      pose(scrollEl, { x: 800, y: lerp(-420, 150, down) - up * 700, r: Math.sin(time * 0.6) * 0.6 });
      pose(sheetEl, { sy: 0.03 + unroll * 0.97 });
      pose(rodB, { y: unroll * 190 });
      pose(mark, { x: -90 + seg(t, 0.55, 0.95) * 150, y: 70 + Math.floor(seg(t, 0.55, 0.95) * 3) * 26, o: unroll > 0.95 ? 0.9 : 0 });
      const out = es(t, 2.05, 2.35);
      isa.set({ x: lerp(IX, 380, out), y: GY, s: 1, o: 1 - out, armF: 30 + es(t, 0.1, 0.4) * 40, armB: 10 + es(t, 0.1, 0.4) * 140, head: -es(t, 0.1, 0.4) * 12, blink: blinkAt(time, 2) });

      /* v23a: the virgin shall bear a son — the painted oval; his name Emmanuel */
      const ok = es(t, 1.1, 1.45, ease.out) * (1 - es(t, 2.0, 2.3, ease.in));
      pose(oval, { x: 800, y: lerp(-500, 300, es(t, 1.1, 1.45, ease.out)) - es(t, 2.0, 2.3, ease.in) * 800, r: Math.sin(time * 0.6) * 0.8, o: ok > 0.002 ? 1 : 0 });
      const ek = es(t, 1.4, 1.65, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      pose(emm, { x: 800, y: lerp(-500, 530, ek), r: Math.sin(t * 3) * 1.2, o: ek > 0.002 ? 1 : 0 });

      /* v23b: God with us — the Mother and Child among the people, in the light */
      const wk = es(t, 2.1, 2.5);
      const mk = es(t, 2.05, 2.4);
      maryC.set({ x: 800, y: GY - 6, s: 0.98, flip: false, o: mk, armF: 70, armB: 30, head: 8, blink: blinkAt(time, 3) });
      pose(light, { x: 800, y: GY - 120, s: 0.4 + mk * 0.8, o: mk });
      FOLK.forEach((f) => {
        const k = es(t, 2.1 + f.i * 0.03, 2.5 + f.i * 0.03);
        const x = 800 + f.dx + Math.sign(f.dx) * (1 - k) * 500;
        f.p.set({ x, y: GY + f.dy, s: f.s, flip: f.dx > 0, o: k > 0.002 ? 1 : 0, walk: k > 0 && k < 1 ? t * 30 + f.i : undefined, armF: 10 + es(t, 2.5, 2.7) * (40 + f.i * 8), armB: es(t, 2.5, 2.7) * (f.i % 2 ? 90 : 20), head: -es(t, 2.5, 2.7) * 8, blink: blinkAt(time, f.i) });
      });
      const gw = es(t, 2.35, 2.6, ease.out);
      pose(withUs, { x: 800, y: lerp(-500, 250, gw), r: Math.sin(t * 3 + 1) * 1.2, o: gw > 0.002 ? 1 : 0 });
      pose(bigGlow, { x: 800, y: GY - 140, s: 0.5 + wk * 0.6, r: t * 3, o: wk * 0.8 });
      sparks.forEach((spk, i) => { const kk = seg(t, 2.4 + i * 0.04, 2.95 + i * 0.04); const a = (i / 7) * PI - PI; pose(spk, { x: 800 + Math.cos(a) * (90 + kk * 120), y: GY - 130 + Math.sin(a) * (60 + kk * 100), s: 1 - kk * 0.4, r: t * 90, o: bump(t, 2.4 + i * 0.04, 2.95 + i * 0.04) }); });

      S.cam.z = 1.02 - es(t, 2.0, 2.4) * 0.02;
      S.cam.y = -10 + es(t, 2.0, 2.4) * 20;
    };
  },
};
