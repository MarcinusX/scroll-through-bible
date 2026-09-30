// J 7,3–5 — the family courtyard in Galilee; a booth of branches already stands on the roof. His brothers,
// their travelling bundles ready, come to Jesus: "Leave here, go to Judea!" — James points south and a plate
// shows the disciples gazing at His works (the signs of Cana and Capernaum). "No one does anything in secret…"
// — Joses lifts the basket off a hidden lamp and its light spills out. "Show yourself to the world!" — a globe
// comes down in a spotlight. "For even His brothers did not believe in Him": they fold their arms and turn
// away; above them little heart-windows stay shut.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { bushel, oilLamp } from '../../assets/things.js';
import { bundle, staff } from '../mark8/lib.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  yardSet, YARD, BROS, headAt, hand, voiceRings, say, nameTag, strip, roundel, signBadge, globe, beamGrad, lightBeam, thought, stoneHeart,
  signpost, hangAt, vpose, tr, PI,
} from './lib.js';

const F = YARD.F;
const JX = 690;
const BXL = [880, 968, 1056, 1144];
const LAMP = 790;

export default {
  id: 'j7-brothers',
  beats: [
    { v: 3, text: 'Rzekli więc Jego bracia do Niego:' },
    { v: 3, cont: true, text: '«Wyjdź stąd i idź do Judei, aby i uczniowie Twoi ujrzeli czyny, których dokonujesz.' },
    { v: 4, text: 'Nikt bowiem nie dokonuje niczego w ukryciu, jeżeli chce się publicznie ujawnić.' },
    { v: 4, cont: true, text: 'Skoro takich rzeczy dokonujesz, to okaż się światu!»' },
    { v: 5 },
  ],
  cam: { x: [-40, 120], y: [-60, 40], z: [0.94, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the four brothers stand closer together and the camera sits further right, so all of them are in view
    const BX = S.portrait ? [856, 932, 1008, 1084] : BXL;
    const PUT = S.portrait ? 970 : 1010, JUX = S.portrait ? 1070 : 1130, PZ = S.portrait ? 0.95 : 1;
    const Y = yardSet(S, { skyCols: ['#d3e2d9', '#f0e6c8', '#f7e4c2'], sunAt: [1230, 150] });

    /* the hidden lamp under a basket, on a low stool */
    const P = S.layer({ par: 0.5, sh: 5 });
    P.add(`<g transform="translate(${LAMP} ${F})">${sheet().p(c.cut(c.rect(-40, -34, 80, 10), 0.3, 6), C.wood).p(c.cut(c.rect(-34, -26, 8, 26), 0.2, 4) + c.cut(c.rect(26, -26, 8, 26), 0.2, 4), C.wood2).out()}</g>`);
    const lampEl = P.add(`<g transform="translate(${LAMP - 4} ${F - 34}) scale(.9)">${oilLamp(c)}</g>`);
    const lamp = { glow: lampEl.querySelector('.glow'), flame: lampEl.querySelector('.flame') };
    const basket = P.add(`<g>${bushel(c, 96, 72)}</g>`);

    /* Jesus and His brothers */
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 28, w: 4, both: false });
    const bros = BROS.map((o, i) => ({
      i, x: BX[i], seed: c.rr(0, 9),
      p: S.puppet(P.add(person(c, { ...o, holdB: i % 2 ? bundle(c) : '', holdF: i === 3 ? staff(c, 150) : '' }))),
    }));
    const sayB = P.add(`<g>${say(c, '…', { size: 26, side: -1 })}</g>`);

    /* words and plates */
    const X = S.layer({ par: 0.5, sh: 6 });
    const judea = hanging(X, signpost(c, tr('do Judei', 'to Judea'), { size: 22, dir: 1 }), { x: 1180, y: 260, len: 700 });
    const disc = (o, x) => `<g transform="translate(${x} 74) scale(.5)">${person(c, o)}</g>`;
    const worksIn = `<rect x="-120" y="-120" width="240" height="240" fill="${mix(C.parchment, C.sage3, 0.4)}"/><path d="${c.ridge(c.wave(62, [6, 3], [140, 60]), -120, 120, 130, 10, 1)}" fill="${mix(C.sage2, C.sand, 0.4)}"/>` +
      disc(CAST.peter, -64) + disc(CAST.john, -22) + disc(CAST.andrew, 20) + `<g transform="translate(58 -22) scale(.42)">${signBadge(c, 1)}</g><g transform="translate(-6 -58) scale(.34)">${signBadge(c, 2, { icon: '' })}</g>`;
    const works = hanging(X, roundel(c, worksIn, { r: 96, face: C.parchment, id: S.id('works-clip') }), { x: 930, y: 250, len: 600 });
    const worksT = X.add(`<g>${strip(c, tr('niech zobaczą Twoje czyny', 'let them see your works'), { size: 16 })}</g>`);
    const secretT = X.add(`<g>${strip(c, tr('nic w ukryciu', 'nothing in secret'), { size: 17 })}</g>`);
    const bid = beamGrad(S, 'spot', '#fff3cf');
    const spot = X.add(`<g>${lightBeam(bid, 40, 300, 330)}</g>`);
    const world = hanging(X, `<circle r="130" fill="url(#halo-glow)" opacity=".6"/>${globe(c, 74)}`, { x: 960, y: 250, len: 700 });
    const worldT = X.add(`<g>${strip(c, tr('okaż się światu!', 'show yourself to the world!'), { size: 17 })}</g>`);
    const hearts = BROS.map((_, i) => X.add(`<g>${thought(c, `<g transform="scale(.8)">${stoneHeart(c, 16)}</g>`, { w: 58, h: 46 })}</g>`));
    const notT = X.add(`<g>${strip(c, tr('nie wierzyli w Niego', 'they did not believe in Him'), { size: 17 })}</g>`);

    return (t, time) => {
      const T = time;
      Y.update(t, T);

      /* v3a — the brothers come up to Him */
      const come = es(t, 0.0, 0.55, ease.sine);
      /* v5 — they turn away */
      const away = es(t, 4.1, 4.45);
      bros.forEach((b) => {
        const x = lerp(b.x + 260, b.x, come) + away * (18 + b.i * 6);
        const talk = b.i === 0 ? bump(t, 1.05, 1.95) : b.i === 1 ? bump(t, 2.05, 2.9) : b.i === 2 ? bump(t, 3.05, 3.95) : 0;
        const point = b.i === 0 ? es(t, 1.2, 1.4) * (1 - es(t, 1.85, 2.0)) : 0;
        const lift = b.i === 1 ? es(t, 2.25, 2.5) * (1 - es(t, 3.0, 3.2)) : 0;
        const wide = es(t, 3.2, 3.45) * (1 - es(t, 3.9, 4.05));
        const cross = away;
        const staffy = b.i === 3;
        const armF = staffy ? 34 : lerp(20 + talk * 30 + point * 60 + lift * 110 + wide * (b.i === 2 ? 60 : 0), 42, cross);
        const armB = staffy ? 10 : lerp(10 + wide * (b.i === 2 ? 150 : 0) + (b.i === 0 ? point * -10 : 0), 34, cross);
        b.p.set({
          x, y: F + (b.i % 2) * 6, s: 0.95, flip: away < 0.5, walk: come > 0 && come < 1 ? x * 0.06 + b.i : undefined,
          armF, armB, head: -talk * 4 + point * -6 - wide * 10 + away * (8 - b.i * 2), lean: -point * 4 + away * 3, blink: blinkAt(T, b.seed),
        });
      });
      const [bh0x, bh0y] = headAt(BX[0], F, 0.95, true);
      vpose(sayB, { x: bh0x - 24, y: bh0y - 20, s: es(t, 0.35, 0.5, ease.back) * 0.9, o: seg(t, 0.35, 0.4) * (1 - es(t, 0.9, 1.0)) });

      const listen = bump(t, 0.4, 4.0);
      const sad = es(t, 4.2, 4.5);
      jesus.set({ x: JX, y: F + 4, s: 1.02, armF: 12 + bump(t, 2.5, 3.0) * 20, armB: 8, head: -3 * listen + sad * 12, blink: blinkAt(T, 1) });
      voice(0, 0, 0, T);

      /* v3b — go to Judea; your disciples will see your works */
      const jk = es(t, 1.2, 1.45, ease.out), ju = es(t, 1.9, 2.1, ease.in);
      hangAt(judea, JUX, lerp(-300, 330, jk) - ju * 700, T, jk > 0 && ju < 1 ? 1 : 0, 1.2, 0.9, 1);
      const wk = es(t, 1.4, 1.7, ease.out), wu = es(t, 1.95, 2.15, ease.in);
      const wy = lerp(-300, 250, wk) - wu * 800;
      hangAt(works, 930, wy, T, wk > 0 && wu < 1 ? 1 : 0, 1.2, 0.8, 2);
      vpose(worksT, { x: 930, y: wy + 118, o: wk > 0 && wu < 1 ? seg(t, 1.6, 1.7) : 0 });

      /* v4a — nothing in secret: the basket comes off the lamp */
      const lift = es(t, 2.25, 2.5) * (1 - es(t, 3.0, 3.2)), up = es(t, 2.25, 2.55), put = es(t, 3.0, 3.25);
      const [lhx, lhy] = hand(BX[1] + away * 24, F + 6, 0.95, true, 20 + 110 * lift);
      let bx = lerp(LAMP, lhx + 4, up), by = lerp(F - 34, lhy + 58, up);
      bx = lerp(bx, PUT, put); by = lerp(by, F + 16, put);
      pose(basket, { x: bx, y: by, r: up * (1 - put) * -8 });
      const shine = es(t, 2.35, 2.6);
      pose(lamp.flame, { x: 35, y: -16, sy: 1 + Math.sin(T * 9) * 0.06, o: shine > 0 ? 1 : 0 });
      fade(lamp.glow, shine * 0.95);
      vpose(secretT, { x: LAMP, y: F - 150, s: 0.9 + es(t, 2.4, 2.6, ease.back) * 0.1, o: es(t, 2.4, 2.5) * (1 - es(t, 2.95, 3.05)) });

      /* v4b — show yourself to the world */
      const gk = es(t, 3.15, 3.45, ease.out), gu = es(t, 3.95, 4.15, ease.in);
      const gy = lerp(-300, 240, gk) - gu * 800;
      hangAt(world, 960, gy, T, gk > 0 && gu < 1 ? 1 : 0, 1.4, 0.7, 3);
      vpose(worldT, { x: 960, y: gy + 108, o: gk > 0 && gu < 1 ? seg(t, 3.4, 3.5) : 0 });
      const sp = bump(t, 3.25, 4.0);
      vpose(spot, { x: JX + 4, y: F - 330, sx: 0.6 + sp * 0.4, o: sp * 0.8 });

      /* v5 — even His brothers did not believe: shut heart-windows */
      bros.forEach((b, i) => {
        const [hx, hy] = headAt(b.x + away * (18 + b.i * 6), F + (b.i % 2) * 6, 0.95, away < 0.5);
        const k = es(t, 4.15 + i * 0.06, 4.35 + i * 0.06, ease.back);
        vpose(hearts[i], { x: hx + 4, y: hy - 22, s: k * 0.9, o: seg(t, 4.15 + i * 0.06, 4.2 + i * 0.06) });
      });
      vpose(notT, { x: 1010, y: F - 330, o: es(t, 4.4, 4.55) });

      S.cam.x = (S.portrait ? 100 : 40) + bump(t, 1.0, 2.1) * 20;
      S.cam.y = -10 - bump(t, 3.0, 4.1) * 30;
      S.cam.z = (1.06 + es(t, 4.1, 4.6) * (S.portrait ? 0 : 0.06)) * PZ;
    };
  },
};
