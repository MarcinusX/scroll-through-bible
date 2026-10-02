// Mt 27,7–10 — the valley below the city walls: a potter's yard (a lean-to with shelves of pots, a wheel,
// a round kiln) and a field of broken sherds and red clay. Two of the council come down and hand the potter the
// purse; he bows — the field is theirs — and small plain stones rise in it: graves for strangers. A signboard
// grows up at its edge, "Field of Blood", and the clay reddens. Then the prophet's scroll comes down on the
// fly-lines, and beside it thirty silver pieces in a ring, the price that was set; the ring of silver sinks and
// settles on the potter's field.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, bush, grass, olive, cypress, sun as sunCut, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, leader, purse, cityWall, claypot, sherds, potterWheel, graveStone, thirtyRing, verseScroll, strip, wisp, POTTER, MT, tr, FONT, PI } from './lib.js';

const GY = 690;

export default {
  id: 'mt27-potter',
  beats: [
    { v: 7 },
    { v: 8 },
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-40, 130], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, MT.field);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sunCut(c, 40), { x: 1250, y: 140, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 420, y: 130, len: 700 });
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 420, amps: [14, 7, 3], lens: [900, 320, 120], color: C.hillFar }).markup);
    far.add(cityWall(c, -700, 760, 330, 440, { towers: [{ x: -200 }, { x: 240 }, { x: 640, w: 56, h: 40 }] }));
    const mid = S.layer({ par: 0.18, sh: 3 });
    mid.add(band(c, { y: 520, amps: [16, 7, 3], lens: [800, 280, 100], color: mix(C.hillMid, C.sand, 0.3) }).markup + olive(c, 1480, 540, 0.7) + cypress(c, 180, 540, 110));

    /* the field and the potter's yard */
    const fieldL = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(600, [6, 3], [700, 200]);
    fieldL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.clay, 0.25)).out());
    const patch = c.cut(c.blob(640, 668, 330, 60, 18, 0.12), 1.4, 10);
    fieldL.add(sheet().p(patch, mix(C.clay, C.sand2, 0.45)).out());
    const red = fieldL.add(`<g><path d="${patch}" fill="${mix(C.terracotta, C.clay, 0.5)}"/></g>`);
    fieldL.add(`<g transform="translate(640 668)">${sherds(c, 560, 26)}</g>` + grass(c, { x0: -600, x1: 2300, y: 600, fn: gfn, n: 26, h: 12, color: C.olive }));
    const graves = [[520, 650], [590, 694], [680, 652], [790, 684], [860, 648], [960, 676]].map(([x, y], i) => ({ i, x, y, el: fieldL.add(`<g>${graveStone(c, 32 + (i % 3) * 4, 22 + (i % 2) * 6)}</g>`) }));
    const sign = fieldL.add(`<g>${sheet().p(c.cut(c.rect(-5, -130, 10, 130), 0.3, 5), C.wood2).p(c.cut([[-78, -140], [78, -144], [80, -96], [-80, -94]], 0.5, 6), mix(C.wood3, C.parchment, 0.4)).out()}<text x="0" y="-110" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="600" fill="${C.ink}">${tr('Pole Krwi', 'Field of Blood')}</text></g>`);
    const yard = S.layer({ par: 0.36, sh: 4 });
    const Y = sheet();
    Y.p(c.cut([[1060, GY - 180], [1330, GY - 200], [1334, GY - 186], [1062, GY - 166]], 0.5, 8), C.roof);
    Y.p(c.cut(c.rect(1070, GY - 172, 10, 172), 0.3, 5) + c.cut(c.rect(1310, GY - 190, 10, 190), 0.3, 5), C.wood2);
    Y.p(c.cut(c.rect(1090, GY - 120, 210, 8), 0.3, 5) + c.cut(c.rect(1090, GY - 62, 210, 8), 0.3, 5), C.wood);
    Y.p(c.cut([[1350, GY], [1350, GY - 60], ...c.arc(1410, GY - 60, 60, 70, PI, 2 * PI, 12), [1470, GY]], 0.6, 6), mix(C.clay, C.rock2, 0.4));
    Y.p(c.cut([[1392, GY], [1392, GY - 30], ...c.arc(1410, GY - 30, 18, 18, PI, 2 * PI, 8), [1428, GY]], 0.3, 4), C.soilRich);
    yard.add(Y.out());
    let pots = '';
    [1110, 1150, 1196, 1240, 1280].forEach((x, i) => { pots += `<g transform="translate(${x} ${GY - 120})">${claypot(c, 30 + (i % 2) * 8, [C.pot, C.clay, mix(C.pot, C.ochre, 0.4)][i % 3])}</g>`; });
    [1120, 1170, 1230, 1275].forEach((x, i) => { pots += `<g transform="translate(${x} ${GY - 62})">${claypot(c, 38 + (i % 2) * 6, [C.clay, C.pot][i % 2])}</g>`; });
    yard.add(pots + `<g transform="translate(1000 ${GY + 6})">${potterWheel(c)}</g>` + `<g transform="translate(1340 ${GY + 8})">${claypot(c, 60, C.pot)}</g>`);
    const smoke = [0, 1, 2].map(() => yard.add(`<g>${wisp(c, 1.4, '#cfc2b0')}</g>`));

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const lords = [1, 2].map((i) => ({ i, p: S.puppet(P.add(leader(c, i + 1))), seed: c.rr(0, 9) }));
    const withBag = S.puppet(P.add(leader(c, 2, { holdF: `<g transform="translate(0 -4)">${purse(c)}</g>` })));
    const potter = S.puppet(P.add(person(c, POTTER)));
    const fx = S.layer({ par: 0.52, sh: 4 });
    const bag = fx.add(`<g>${purse(c)}</g>`);
    const strangers = hanging(S.layer({ par: 0.5, sh: 4 }), strip(c, tr('na grzebanie cudzoziemców', 'to bury strangers in'), { size: 16 }), { x: 0, y: -1500, len: 900 });

    /* the prophet and the price */
    const scrL = S.layer({ par: 0.12, sh: 5 });
    const vs = verseScroll(c, tr(['Wzięli trzydzieści srebrników,', 'zapłatę za Tego, którego', 'oszacowali synowie Izraela'], ['They took the thirty pieces of silver,', 'the price of him upon whom', 'a price had been set']), { w: 440, size: 20, title: tr('PROROK JEREMIASZ', 'JEREMIAH THE PROPHET') });
    const scroll = hanging(scrL, `${vs.sheet}<g>${vs.rodTop}</g><g transform="translate(0 ${vs.h})">${vs.rodBottom}</g>`, { x: 0, y: -1500, len: 900 });
    const ringL = S.layer({ par: 0.2, sh: 5 });
    const ring = ringL.add(`<g><circle r="110" fill="url(#halo-glow)" opacity=".6"/>${thirtyRing(c, 66, 8)}<text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-size="36" font-style="italic" fill="${C.ink}">30</text></g>`);
    const coinEls = Array.from({ length: 30 }, (_, i) => ring.querySelector(`.k${i}`));
    const given = fx.add(`<g>${strip(c, tr('za Pole Garncarza', 'for the potter’s field'), { size: 18 })}</g>`);

    return (t, time) => {
      const T = time;
      sk.blend(MT.field, MT.dusk, es(t, 1.0, 1.8) * 0.25);
      swing(sunEl, 1250, 140, T, 1, 0.6);
      swing(cl, 420 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.6, 1);
      smoke.forEach((sm, i) => { const k = ((T * 0.22 + i / 3) % 1); pose(sm, { x: 1410 + Math.sin(k * 6 + i) * 8, y: GY - 140 - k * 110, s: 0.6 + k * 0.7, o: Math.sin(k * PI) * 0.55 }); });

      /* v7 — they buy the field from the potter; graves for strangers */
      const lK = [[-0.3, [-60, GY]], [0.35, [S.portrait ? 750 : 700, GY]]];   // phone: a step further in, clear of the signboard
      const [lx, ly] = kf(t, lK);
      const give = es(t, 0.3, 0.45) * (1 - es(t, 0.6, 0.7));
      lords.forEach((m, j) => {
        const x = lx - j * 90;
        const o = { x, y: ly + j * 4, s: 0.98, flip: false, walk: moving(t, lK) ? x * 0.05 : undefined, armF: 20 + (j === 0 ? give * 60 : 0) + es(t, 3.05, 3.4) * 30, armB: 10, head: -es(t, 2.05, 2.4) * 12, blink: blinkAt(T, m.seed) };
        const had = t < 0.45 ? 1 : 0;
        m.p.set({ ...o, o: j === 0 ? 1 - had : 1 });
        if (j === 0) withBag.set({ ...o, o: had });
      });
      const pK = [[0.1, [1150, GY + 4]], [0.35, [860, GY + 4]], [0.8, [860, GY + 4]], [1.1, [1000, GY + 4]]];
      const [px, py] = kf(t, pK);
      const bowK = bump(t, 0.6, 0.95);
      potter.set({ x: px, y: py, s: 1, flip: t < 0.9, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 20 + es(t, 0.4, 0.5) * 50 * (1 - es(t, 0.95, 1.1)), armB: 10 + bowK * 30, head: bowK * 16 - es(t, 2.05, 2.4) * 12, lean: -bowK * 8, blink: blinkAt(T, 3) });
      const [ax, ay] = hand(lx, ly, 0.98, false, 20 + give * 60);
      const [bx, by] = hand(px, py, 1, true, 70);
      const pass = es(t, 0.45, 0.55);
      pose(bag, { x: lerp(ax, bx, pass), y: lerp(ay, by, pass), o: t > 0.44 && t < 0.95 ? 1 : 0 });
      graves.forEach((g) => { const k = es(t, 0.55 + g.i * 0.05, 0.75 + g.i * 0.05, ease.back); pose(g.el, { x: g.x, y: g.y, sx: 1, sy: k, o: k > 0.02 ? 1 : 0 }); });
      const sk2 = es(t, 0.6, 0.85) * (1 - es(t, 1.0, 1.2));
      swing(strangers, 620, 560 - (1 - sk2) * (S.portrait ? 1300 : 800), T, 1.2, 0.8, 2);   // phone: parked out of sight

      /* v8 — the Field of Blood, to this day */
      const up = es(t, 1.05, 1.35, ease.back);
      pose(sign, { x: S.portrait ? 545 : 470, y: GY + 20, sx: 1, sy: up, o: up > 0.02 ? 1 : 0 });
      fade(red, es(t, 1.15, 1.6) * 0.45);

      /* v9 — the prophet Jeremiah; thirty pieces of silver */
      const dn = es(t, 2.05, 2.45) * (1 - es(t, 3.85, 4.2));
      swing(scroll, 720, 150 - (1 - dn) * 800, T, 0.8, 0.7, 3);
      const rk = es(t, 2.3, 2.6);
      coinEls.forEach((el, i) => fade(el, es(t, 2.3 + i * 0.012, 2.36 + i * 0.012)));
      /* v10 — given for the potter's field: the ring of silver settles on it */
      const sinkK = es(t, 3.1, 3.6);
      pose(ring, { x: lerp(S.portrait ? 1040 : 1110, 800, sinkK), y: lerp(250, 640, sinkK), sy: lerp(1, 0.45, sinkK) * lerp(1, 0.8, sinkK), sx: lerp(1, 0.8, sinkK), o: rk > 0.01 ? 1 : 0 });
      const gk = es(t, 3.45, 3.7, ease.back);
      pose(given, { x: 880, y: 590, s: gk, r: -2, o: gk > 0.02 ? 1 : 0 });

      S.cam.x = 10 - es(t, 1.0, 1.3) * 40 * (1 - es(t, 1.9, 2.2));
      S.cam.y = 10 - es(t, 1.9, 2.3) * 30;
      S.cam.z = 1.03 + es(t, 0.1, 0.5) * 0.04 - es(t, 1.9, 2.3) * 0.05;
      if (S.portrait) S.cam.x += 60;
    };
  },
};
