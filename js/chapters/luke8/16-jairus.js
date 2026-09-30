// Łk 8,40–42 — back on the Capernaum shore the crowd has been sitting on the beach, watching the lake; when the
// boat comes in they jump up and welcome Him with their hands raised. From the white synagogue on the hill comes
// Jairus, its ruler (a tag with his name comes down), and falls at Jesus' feet, begging Him to come to his house:
// in a thought cloud his only daughter, about twelve, lies ill and the little lamp by her bed burns low. Jesus goes
// with him — and the crowd closes in on Him from both sides, pressing and jostling.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { capShore, RULER, L5, knot, knotUp, still, thinkBubble, sickGirlIcon, nameTag, headAt, hangAt, kf, MORNING, tr, PI } from './lib.js';

const JX = 700, FEET = 704, RX = 820;

export default {
  id: 'lk8-jairus',
  beats: [
    { v: 40 },
    { v: 41, text: 'A oto przyszedł człowiek, imieniem Jair, który był przełożonym synagogi.' },
    { v: 41, cont: true, text: 'Upadł Jezusowi do nóg i prosił Go, żeby zaszedł do jego domu.' },
    { v: 42, text: 'Miał bowiem córkę jedynaczkę, liczącą około dwunastu lat, która była bliska śmierci.' },
    { v: 42, cont: true, text: 'Gdy Jezus tam szedł, tłumy napierały na Niego.' },
  ],
  cam: { x: [-80, 120], y: [-30, 50], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = capShore(S, { skyCols: MORNING, sunAt: [460, 170], beachY: 640 });

    /* the crowd on the beach: sitting and waiting, then up to welcome Him */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const SP = [[430, 668, 'a', 4, false], [560, 690, 'b', 3, false], [980, 690, 'c', 4, true], [1110, 668, 'd', 4, true], [1230, 690, 'e', 3, true], [320, 690, 'f', 3, false]];
    const groups = SP.map(([x, y, k, n, flip], i) => ({
      i, x, y, flip,
      sit: crowdL.sprite(knot('lk8-jai-' + k, n, { s: 0.9, spread: 40, rows: 1, flip: !flip, pose: 'sit' }), x, y),
      up: crowdL.sprite(knotUp('lk8-jai-' + k, n, { s: 0.9, spread: 40, rows: 1, flip }), x, y),
      stand: crowdL.sprite(knot('lk8-jai-' + k, n, { s: 0.9, spread: 40, rows: 1, flip }), x, y),
    }));

    /* the boat comes in with Jesus and the disciples */
    const boatL = S.layer({ par: 0.45, sh: 5 });
    const B = boat(c, {});
    const disM = still(c, [CAST.james, CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ x: -110 + i * 56, y: 2, s: 0.92, flip: false, armF: 14 + (i % 2) * 20, armB: 8, head: -2, o })));
    const boatG = boatL.add(`<g><g>${B.back}</g>${disM}<g data-k="jin">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g></g>`);
    const jIn = S.puppet(S.$('jin').firstElementChild);

    /* Jesus, Jairus, Peter */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const peter = S.puppet(pL.add(person(c, { ...CAST.peter })));
    const jair = S.puppet(pL.add(person(c, RULER)));
    const jairK = S.puppet(pL.add(person(c, { ...RULER, pose: 'kneel' })));
    const press = [[560, 'g', false], [1000, 'h', true], [460, 'i', false], [1110, 'j', true]].map(([x, k, flip], i) => ({ i, x, flip, sp: crowdL.sprite(knot('lk8-jai-' + k, 3, { s: 0.94, spread: 34, rows: 1, flip, arms: [40, 80] }), x, FEET + 10) }));

    /* the name, the thought */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const tag = fx.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr(['Jair,', 'przełożony synagogi'], ['Jairus,', 'ruler of the synagogue']), { size: 17 })}</g>`);
    const think = fx.add(`<g opacity="0">${thinkBubble(c, [' ', ' ', ' '], { size: 22, dir: 1, w: 230 })}<g transform="translate(120 -96) scale(1.3)">${sickGirlIcon(c, L5.girl)}</g><text x="24" y="-128" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.terracotta}">~12</text></g>`);

    const BK = [[0.02, [-260, 694]], [0.5, [380, 700]]];

    return (t, time) => {
      const T = time;
      set.update(T);
      /* v40 — the crowd welcomes Him; they were all waiting for Him */
      const [bx, by] = kf(t, BK, ease.out);
      const afloat = 1 - es(t, 0.45, 0.55);
      pose(boatG, { x: bx, y: by + (T ? Math.sin(T * 1.3) * 2 * afloat : 0), s: 0.88 });
      groups.forEach((g) => {
        const rise = es(t, 0.35 + g.i * 0.03, 0.42 + g.i * 0.03);
        const cheer = rise * (1 - es(t, 1.2 + g.i * 0.02, 1.27 + g.i * 0.02));
        const close = es(t, 4.05, 4.6);
        const x = g.x + (g.flip ? -1 : 1) * close * 60;
        g.sit.set({ x: g.x, y: g.y, o: 1 - rise });
        g.up.set({ x, y: g.y, o: cheer });
        g.stand.set({ x, y: g.y, o: rise * (1 - cheer) });
      });
      const out = es(t, 0.6, 0.66);
      jIn.set({ x: 128, y: -2, s: 0.98, o: 1 - out, armF: 16 + bump(t, 0.3, 0.6) * 60, armB: 8, blink: blinkAt(T) });
      const go = es(t, 4.1, 4.9);
      const JK = [[0.62, bx + 128 * 0.88], [0.95, JX], [4.1, JX], [4.95, JX + 170]];
      const jx = kf(t, JK);
      const walking = (t > 0.62 && t < 0.95) || (t > 4.1 && t < 4.95);
      jesus.set({ x: jx, y: FEET, s: 1.02, o: out, walk: walking ? jx * 0.06 : undefined, armF: 16 + bump(t, 0.7, 1.4) * 60 + es(t, 2.1, 2.4) * (1 - go) * 40, armB: 8 + bump(t, 0.7, 1.4) * 50, head: es(t, 2.1, 2.4) * (1 - go) * 10, blink: blinkAt(T) });
      const pk = es(t, 0.7, 1.0);
      const px = lerp(bx + 60, JX - 90, pk) + go * 170;
      peter.set({ x: px, y: FEET - 8, s: 0.96, o: pk > 0 ? 1 : 0, walk: (pk > 0 && pk < 1) || walking && t > 4 ? px * 0.06 : undefined, armF: 14 + bump(t, 4.4, 4.9) * 60, blink: blinkAt(T, 2) });

      /* v41a — Jairus, a ruler of the synagogue */
      const come = es(t, 1.05, 1.6);
      const fall = es(t, 2.05, 2.12);
      const rise = es(t, 3.95, 4.02);
      const JRX = kf(t, [[1.05, 1300], [1.6, RX], [4.1, RX], [4.95, RX + 200]]);
      jair.set({ x: JRX, y: FEET, s: 1.0, flip: t < 4.05, o: 1 - fall + rise, walk: (t > 1.05 && t < 1.6) || (t > 4.1 && t < 4.95) ? JRX * 0.06 : undefined, armF: 20 + (t > 4 ? 40 : 0), armB: 10, head: 6, blink: blinkAt(T, 3) });
      const tk = es(t, 1.3, 1.6, ease.out) * (1 - es(t, 1.95, 2.15));
      hangAt(tag, RX, lerp(-1500, 380, tk), T, 1.2, 0.7);
      /* v41b — he falls at His feet and begs Him to come to his house */
      jairK.set({ x: RX - 30, y: FEET + 4, s: 1.0, flip: true, o: fall * (1 - rise), armF: 80 + bump(t, 2.3, 3.8) * 20 + (T ? Math.sin(T * 2) * 4 : 0), armB: 100, head: -12, lean: -6, blink: blinkAt(T, 3) });
      /* v42a — his only daughter, about twelve, is dying */
      const [khx, khy] = headAt(RX - 30, FEET + 4, 1.0, true, 46);
      const th = es(t, 3.08, 3.3, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(think, { x: khx + 20, y: khy - 16, s: th, o: th > 0.02 ? 1 : 0 });
      /* v42b — the crowds press in on Him */
      press.forEach((p) => {
        const k = es(t, 4.1 + p.i * 0.05, 4.6 + p.i * 0.05);
        const x = lerp(p.x + (p.flip ? 500 : -500), jx + (p.flip ? 110 + p.i * 30 : -110 - p.i * 30), k);
        p.sp.set({ x: x + (T ? Math.sin(T * 5 + p.i) * 3 * k : 0), y: FEET + 10 + (p.i % 2) * 10, o: seg(t, 4.05, 4.15) });
      });

      S.cam.x = -60 + es(t, 0.5, 1.0) * 60 + es(t, 4.1, 4.9) * 100;
      S.cam.z = 1.02 + es(t, 1.9, 2.3) * 0.1 - es(t, 4.0, 4.4) * 0.08;
      S.cam.y = 10 + es(t, 1.9, 2.3) * 20 - es(t, 4.0, 4.4) * 20;
    };
  },
};
