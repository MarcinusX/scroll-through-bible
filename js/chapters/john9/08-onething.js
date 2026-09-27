// J 9,24–27 — Act four: the second summons. They call him forward again: "Give glory to God" — hands raised to
// the light above; "We know this man is a sinner" — a card of Jesus with a dark scrap pinned beside. "Whether He
// is a sinner, I don't know" — he opens his hands. And the heart of the chapter, simple and luminous: "One thing
// I know: I was blind, and now I see" — the hall dims, a beam falls on him alone, and a round plate comes down
// with a closed eye under the stars — it turns over: an open eye in the sun. "What did He do to you? How did He
// open your eyes?" — "I told you already, and you did not listen" (they turn their heads away); "why do you want
// to hear it again?" (the three picture cards once more); "Do you also want to become His disciples?" — a
// picture of the officials trooping after Jesus; they bristle.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hallSet, H, SEER, manPuppet, officials, offSet, official, iconBubble, say, thought, storyTile, clayLump, clayEye, poolIcon, eyeIcon, threeTiles,
  eyePlate, darkScrap, qmark, medallion, framed, rayBurst, spark, hanging, drop, kf, moving, headAt, vis, tr, pose, mix, sheet, PI, DY, FONT,
} from './lib.js';

const MX = H.MANX + 20;

export default {
  id: 'j9-onething',
  beats: [
    { v: 24, text: 'Znowu więc przywołali tego człowieka, który był niewidomy, i rzekli do niego:' },
    { v: 24, cont: true, text: '«Daj chwałę Bogu.' },
    { v: 24, cont: true, text: 'My wiemy, że człowiek ten jest grzesznikiem».' },
    { v: 25, text: 'Na to odpowiedział: «Czy On jest grzesznikiem, tego nie wiem.' },
    { v: 25, cont: true, text: 'Jedno wiem: byłem niewidomy, a teraz widzę».' },
    { v: 26 },
    { v: 27, text: 'Odpowiedział im: «Już wam powiedziałem, a wyście mnie nie wysłuchali.' },
    { v: 27, cont: true, text: 'Po co znowu chcecie słuchać?' },
    { v: 27, cont: true, text: 'Czy i wy chcecie zostać Jego uczniami?»' },
  ],
  cam: { x: [-60, 200], y: [-90, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const hall = hallSet(S);
    const offL = S.layer({ par: 0.46, sh: 5 });
    const offs = officials(S, offL);
    /* the dimming of the hall and the beam on him (flat sheets) */
    const dimL = S.layer({ par: 0.47, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#221c2c" opacity=".55"/>`);
    dimL.fade(0);
    const spotL = S.layer({ par: 0.48, sh: 0, flat: true });
    S.defs(`<linearGradient id="${S.id('spot')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf" stop-opacity=".05"/><stop offset=".6" stop-color="#fff3cf" stop-opacity=".55"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".7"/></linearGradient>`);
    spotL.add(`<path d="M${MX - 40} -200L${MX + 40} -200L${MX + 130} 720L${MX - 130} 720Z" fill="url(#${S.id('spot')})"/><ellipse cx="${MX}" cy="712" rx="150" ry="22" fill="#fff3cf" opacity=".6"/>`);
    spotL.fade(0);
    const act = S.layer({ par: 0.5, sh: 5 });
    const glowMan = act.add(`<g opacity="0"><circle r="150" fill="url(#halo-glow)"/></g>`);
    const man = manPuppet(S, act, SEER, {});

    const fx = S.layer({ par: 0.52, sh: 5 });
    const jMed = `<circle r="26" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 20 })}`;
    const glory = fx.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 20, r1: 200, spread: 0.04, color: '#fff1c4', o: 0.7 })}<circle r="70" fill="url(#halo-glow)"/></g>`);
    const sinner = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-20 0)">${jMed}</g><g transform="translate(26 8)">${darkScrap(c, 14)}</g>`, { w: 120, h: 80, side: -1 })}</g>`);
    const dunno = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(-14 0) scale(.8)">${jMed}</g><g transform="translate(16 6) scale(.8)">${darkScrap(c, 12)}</g><g transform="translate(34 -2) scale(.8)">${qmark(c, C.inkSoft, 1.1)}</g>`, { w: 108, h: 64 })}</g>`);
    const what = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-40 8)">${clayLump(c, 14)}</g><g transform="translate(0 0)">${eyeIcon(c, { r: 15 })}</g><g transform="translate(40 2)">${qmark(c, C.terracotta, 1.2)}</g>`, { w: 150, h: 76, side: -1 })}</g>`);
    const told = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="scale(.62)">${threeTiles(c)}</g>`, { w: 210, h: 84, side: 1 })}</g>`);
    const why = fx.add(`<g opacity="0">${say(c, '?', { size: 30, side: 1 })}</g>`);

    /* the two-faced plate: blind → seeing */
    const hangL = S.layer({ par: 0.49, sh: 6 });
    const ep = eyePlate(c, 86);
    const plate = hanging(hangL, `<g class="fl"><g class="dk">${ep.dark}</g><g class="gd">${ep.gold}</g></g>`, { x: 0, y: 0, len: 900 });
    const flip = plate.querySelector('.fl'), dk = plate.querySelector('.dk'), gd = plate.querySelector('.gd');
    const cap = hangL.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="${FONT}" font-size="24" font-style="italic" fill="${C.cream}"></text></g>`);
    /* the replayed cards, and the "disciples" picture */
    const tileL = S.layer({ par: 0.3, sh: 5 });
    const tiles = [
      storyTile(c, `<g transform="translate(0 -4)">${clayEye(c, 24)}</g>`, { w: 110 }),
      storyTile(c, `<g transform="translate(0 -4)">${poolIcon(c, 32)}</g>`, { w: 110 }),
      storyTile(c, `<circle r="40" fill="url(#warm-glow)"/>${eyeIcon(c, { r: 24 })}`, { w: 110, bg: mix(C.halo, C.parchment, 0.5) }),
    ].map((m) => hanging(tileL, m, { x: 0, y: 0, len: 900 }));
    const discInner = (() => {
      let m = `<rect x="0" y="150" width="360" height="40" fill="${mix(C.sand, C.stone2, 0.4)}"/>`;
      m += `<g transform="translate(300 176) scale(.5)">${person(c, CAST.jesus)}</g>`;
      [0, 1, 2, 4].forEach((i, k) => { m += `<g transform="translate(${236 - k * 52} ${178 - (k % 2) * 4}) scale(.46)">${person(c, official(i))}</g>`; });
      return m;
    })();
    const disciples = hanging(tileL, framed(S, discInner, { w: 360, h: 190, bg: mix(C.skyBlue, C.parchment, 0.5), k: 'disc' }), { x: 0, y: 0, len: 900 });

    hall.front();

    return (t, time) => {
      const T = time;
      hall.door(0, 0);
      /* v24a — called forward again */
      const CK = [[-0.3, 560], [0.2, 560], [0.75, MX]];
      const mx = kf(t, CK, ease.io);
      const mw = moving(t, CK, 1);
      const shrug = bump(t, 3.05, 3.95), one = es(t, 4.1, 4.4) * (1 - es(t, 4.9, 5.05)), toldK = bump(t, 6.05, 6.95), whyK = bump(t, 7.05, 7.95), disc = bump(t, 8.05, 8.95);
      man.p.set({ x: mx, y: H.FLOOR + 8, s: 1.02, walk: mw ? mx * 0.07 : undefined, armF: 18 + shrug * 50 + one * 30 + toldK * 60 + whyK * 70 + disc * 40, armB: 12 + shrug * 70 + one * 20 + whyK * 60, head: -one * 10 + disc * 4, blink: blinkAt(T, 3) });
      const [hx, hy] = headAt(mx, H.FLOOR + 8, 1.02, false);

      offs.forEach((o) => {
        const beckon = o.i === 0 ? bump(t, 0.05, 0.7) : 0;
        const up = bump(t, 1.05, 1.95);
        const accuse = o.side === 0 ? bump(t, 2.05, 2.95) : o.i === 3 ? bump(t, 2.1, 2.95) * 0.8 : 0;
        const lean = bump(t, 5.05, 5.95);
        const away = bump(t, 6.2, 7.0);
        const bristle = bump(t, 8.2, 9.0);
        offSet(o, T, {
          flip: away < 0.4, armF: 18 + beckon * 70 + accuse * 70 + lean * 40 + bristle * (o.i % 2 ? 60 : 30), armB: 8 + up * 150 + bristle * (o.i % 2 ? 100 : 130),
          head: -up * 12 - lean * 4 + away * 10 + bristle * 6, lean: lean * 5 - bristle * 6, angry: Math.max(0.35, accuse, bristle, lean * 0.6), sad: 0,
        });
      });

      /* v24b — give glory to God: light from above */
      vis(glory, { x: 980, y: 140, s: 0.6 + es(t, 1.1, 1.5) * 0.5, r: T * 4, o: bump(t, 1.08, 1.98) });
      const B = (el, a, b, x, y) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.08, b)); vis(el, { x, y, s: k, o: k > 0.01 ? 1 : 0 }); };
      const [o4x, o4y] = headAt(868, H.FLOOR + 10, 1, true);
      const [o2x, o2y] = headAt(1052, H.SEAT + 12, 0.98, true, DY.sit);
      B(sinner, 2.12, 3.0, o4x - 14, o4y - 26);
      B(dunno, 3.12, 4.0, hx + 4, hy - 26);
      B(what, 5.12, 6.0, o2x - 12, o2y - 24);
      B(told, 6.12, 7.0, hx + 16, hy - 28);
      B(why, 7.12, 8.0, hx + 16, hy - 28);

      /* v25b — one thing I know: the dimming, the beam, the plate that turns */
      const dim = es(t, 4.02, 4.3) * (1 - es(t, 4.95, 5.2));
      dimL.fade(dim);
      spotL.fade(dim);
      vis(glowMan, { x: hx, y: hy + 60, s: 0.8 + one * 0.4, o: one * 0.6 });
      const pk = es(t, 4.08, 4.35, ease.out) * (1 - es(t, 4.95, 5.2, ease.in));
      drop(plate, MX, 250, pk, T, { amp: 0.8 });
      const fk = es(t, 4.5, 4.72);
      const sx = Math.cos(fk * PI);
      pose(flip, { sx: Math.max(0.02, Math.abs(sx)) });
      fade(dk, sx > 0 ? 1 : 0); fade(gd, sx > 0 ? 0 : 1);

      /* v27b — the cards once more; v27c — the officials as disciples */
      [640, 780, 920].forEach((x, i) => drop(tiles[i], x, 170, es(t, 7.1 + i * 0.1, 7.4 + i * 0.1, ease.out) * (1 - es(t, 7.9, 8.15, ease.in)), T, { amp: 1, seed: i }));
      drop(disciples, 820, 140, es(t, 8.12, 8.45, ease.out), T, { amp: 0.8 });

      S.cam.x = kf(t, [[0, 40], [0.8, 60], [1.1, 140], [2, 140], [2.2, 120], [3, 60], [3.8, 40], [4.1, 0], [5, 0], [5.2, 120], [6, 120], [6.2, 60], [7, 60], [7.2, 20], [8, 20], [8.2, 60], [9, 60]]);
      S.cam.y = kf(t, [[0, 0], [1, 0], [1.2, -60], [1.9, -60], [2.2, 0], [4.0, 0], [4.25, -50], [5, -50], [5.2, 0], [7, 0], [7.2, -80], [8, -80], [8.2, -70], [9, -70]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.08], [2.2, 1.12], [4.0, 1.12], [4.25, 1.2], [5, 1.24], [5.2, 1.1], [7, 1.1], [7.2, 1.02], [9, 1.02]]);
    };
  },
};
