// Mt 12,5 — "Have you not read in the Law…?": the scroll of the Law unrolls over a second parchment flat, the court of
// the Temple on a Sabbath (the tag with the candles hangs there too). The priests are hard at work — one carries a
// lamb on his shoulders up to the altar, one stacks wood on the fire, one sounds the fresh loaves of the Presence — and the smoke of
// the Sabbath offering goes up. They break the Sabbath rest, and a warm light falls on them: "without guilt".
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { sanctuary } from '../mark11/lib.js';
import { parchSet, PRIEST, LEVITE, kf, moving, handAt, altar, puff, onShoulders, shoulderLamb, sabbathTag, scrollOpen, loaf, turban, addToHead, tick, tagText, glow, tr, PI } from './lib.js';

const Y = 700;
const AX = 640;       // the altar

export default {
  id: 'mt12-temple',
  enter: 'fly',
  beats: [
    { v: 5 },
  ],
  cam: { x: [-20, 20], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const P = parchSet(S, { gy: 640, sunAt: null });
    const c = P.c;

    /* the sanctuary behind its court wall */
    const back = S.layer({ par: 0.3, sh: 4 });
    const wall = sheet();
    wall.p(c.cut([[-900, 600], [-900, 540], [2500, 540], [2500, 600]], 0.6, 16), mix(C.cream, C.stone, 0.35));
    let posts = '';
    for (let x = -900; x < 2500; x += 34) posts += c.cut(c.rect(x, 548, 12, 40), 0.2, 5);
    wall.x(posts, shade(C.stone, -0.1), 'opacity=".6"');
    wall.p(c.cut(c.rect(-900, 532, 3400, 10), 0.3, 16), C.sun);
    back.add(`<g transform="translate(960 546)">${sanctuary(c, 1.25)}</g>` + wall.out());
    const court = S.layer({ par: 0.4, sh: 3 });
    const f = sheet();
    f.p(c.cut([[-900, 596], [2500, 596], [2500, 1700], [-900, 1700]], 0.8, 30), mix(C.stone, C.sand, 0.4));
    let tiles = '';
    for (let i = 0; i < 8; i++) { const y = 610 + i * i * 7 + i * 10; tiles += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.3); }
    for (let x = -900; x < 2500; x += 90) tiles += c.ribbon([[x, 596], [800 + (x - 800) * 2.2, 1700]], 1.2);
    f.x(tiles, shade(C.stone, -0.16), 'opacity=".4"');
    court.add(f.out());

    /* the altar, its fire and smoke */
    const altL = S.layer({ par: 0.5, sh: 5 });
    const smoke = [0, 1, 2, 3, 4].map((i) => ({ i, el: altL.add(`<g opacity="0">${puff(c, 26 + i * 4, mix('#ece6dc', C.parchment, 0.3))}</g>`) }));
    altL.add(`<g transform="translate(${AX} ${Y})">${altar(c, 190, 110)}</g>`);
    // the ramp up to it
    altL.add(sheet().p(c.cut([[AX + 90, Y], [AX + 90, Y - 100], [AX + 250, Y]], 0.5, 8), mix(C.rock, C.stone2, 0.4)).out());
    const flames = [0, 1, 2].map((i) => ({ i, el: altL.add(`<g><path d="M0 0C-16 -10 -12 -34 0 -60C12 -34 16 -10 0 0Z" fill="${C.sunDeep}"/><path d="M0 0C-9 -8 -7 -22 0 -40C7 -22 9 -8 0 0Z" fill="${C.lampFlame}"/></g>`) }));
    const fireGlow = altL.add(`<g>${glow(130, 0.8)}</g>`);

    /* the priests */
    const act = S.layer({ par: 0.55, sh: 5 });
    const priestO = (o) => addToHead(person(c, o), turban(c));
    const carrier = S.puppet(act.add(onShoulders(priestO({ ...LEVITE, robe: C.linen, belt: C.terracotta }), shoulderLamb(c))));
    const wood = S.puppet(act.add(priestO({ ...LEVITE, skin: C.skin2, hair: C.hair2, beard: 'full', holdF: `<g transform="translate(0 4) rotate(80)">${sheet().p(c.ribbon([[-26, -4], [26, -6]], 7) + c.ribbon([[-24, 5], [28, 4]], 7), C.wood2).out()}</g>` })));
    const tray = sheet().p(c.cut([[-40, 0], [40, 0], [36, 7], [-36, 7]], 0.3, 5), C.sun);
    let loaves = '';
    for (let k = 0; k < 2; k++) for (let j = 0; j < 3; j++) loaves += `<g transform="translate(${-22 + j * 22} ${-4 - k * 9})">${loaf(c, 11, mix(C.wheat2, C.sun, 0.2))}</g>`;
    const trump = S.puppet(act.add(priestO({ ...PRIEST, mantle: null, holdF: `<g transform="rotate(-90) translate(0 -2)">${tray.out()}${loaves}</g>` })));
    const light = act.add(`<g opacity="0">${glow(260, 0.7)}</g>`);

    /* the Law, the Sabbath, "without guilt" */
    const fx = S.layer({ par: 0.2, sh: 5 });
    const law = hanging(fx, `<g data-k="law">${scrollOpen(c, 150, 90)}</g><g transform="translate(0 70)">${tagText(c, tr('Prawo', 'the Law'), { size: 20 })}</g>`, { x: 1120, y: -300, len: 800 });
    const lawSc = S.$('law');
    const tag = hanging(fx, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: -300, len: 800 });
    const guilt = hanging(fx, `${tagText(c, tr('bez winy', 'guiltless'), { size: 22 })}<g transform="translate(-58 0)">${tick(c, 16)}</g>`, { x: 520, y: -300, len: 800 });

    const cK = [[-0.6, 1180], [0.45, 820]];

    return (t, time) => {
      const T = time;
      P.update(T);
      const lw = es(t, -0.4, 0.05, ease.back);
      pose(law, { x: 1080, y: lerp(-300, 210, lw), r: Math.sin(T * 0.8) * 1.2, oy: 0, o: lw > 0.01 ? 1 : 0 });
      pose(lawSc, { sx: 0.1 + 0.9 * es(t, -0.05, 0.2) });
      const tg = es(t, 0.05, 0.3, ease.back);
      pose(tag, { x: 820, y: lerp(-300, 140, tg), r: Math.sin(T * 0.9) * 1.5, oy: 0, o: tg > 0.01 ? 1 : 0 });
      const gl = es(t, 0.52, 0.7, ease.back);
      pose(guilt, { x: 640, y: lerp(-300, 330, gl), r: Math.sin(T * 1.1) * 1.5, oy: 0, o: gl > 0.01 ? 1 : 0 });

      /* the fire and the smoke of the offering */
      const fire = 0.7 + es(t, 0.2, 0.5) * 0.5;
      flames.forEach((fl) => pose(fl.el, { x: AX - 40 + fl.i * 40, y: Y - 116, sx: fire * (1 + Math.sin(T * 7 + fl.i * 2) * 0.1), sy: fire * (1 + Math.sin(T * 5.3 + fl.i) * 0.14) * (fl.i === 1 ? 1.25 : 1) }));
      pose(fireGlow, { x: AX, y: Y - 140, s: fire });
      smoke.forEach((sm) => {
        const k = ((T * 0.12 + sm.i / 5) % 1);
        const kk = time ? k : (sm.i + 0.5) / 5;
        pose(sm.el, { x: AX + Math.sin(kk * 4 + sm.i) * 30 + kk * 80, y: Y - 170 - kk * 380, s: 0.6 + kk * 1.1, o: fire * Math.sin(kk * PI) * 0.85 });
      });

      /* the priests at work */
      const cx = kf(t, cK);
      const cm = moving(t, cK);
      carrier.set({ x: cx, y: Y - (cx < 890 ? (890 - cx) * 0.625 : 0), s: 0.98, flip: true, walk: cm ? cx * 0.05 : undefined, armF: 62, armB: 130, head: -4, blink: blinkAt(T, 3) });
      const stack = bump(t, 0.1, 0.45) + bump(t, 0.5, 0.85);
      wood.set({ x: 470, y: Y + 6, s: 0.98, flip: false, armF: 40 + stack * 50, armB: 30 + stack * 40, head: 6 + stack * 6, lean: 8 + stack * 6, blink: blinkAt(T, 5) });
      const tx = lerp(1180, 1040, es(t, -0.3, 0.5));
      trump.set({ x: tx, y: Y + 2, s: 0.98, flip: true, walk: t > -0.3 && t < 0.5 ? tx * 0.05 : undefined, armF: 90, armB: 70, head: -4, blink: blinkAt(T, 8) });
      pose(light, { x: 780, y: Y - 150, o: es(t, 0.55, 0.72) * 0.9 });

      S.cam.z = 1.05;
      S.cam.y = 20;
    };
  },
};
