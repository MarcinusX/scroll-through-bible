// J 4,11–12 — "Sir, you have nothing to draw with, and the well is deep." The sandy front of the stage falls away
// and shows the well in cross-section; she lets her bucket down and we go down with it, past the stone lining and
// the layers of earth, to the dark water far below. "Where then do you get living water?" Back up; a sepia picture
// comes down from the flies: father Jacob, who gave them this well — and drank from it, with his sons and his cattle.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { wellSet, wellCast, G, NOON, bucketRope, speech, GLYPH, well, panel, sepia, JACOB, sheep, cow, trough, cupJ, hydria, nameTag, vis, kf, hand } from './lib.js';

const SX = G.well, TOP = G.floor + 6, BOT = 1640;      // the shaft
const PAN = { x: 850, y: 150, w: 460, h: 250 };

export default {
  id: 'j4-deep',
  beats: [
    { v: 11, text: 'Powiedziała do Niego kobieta: «Panie, nie masz czerpaka, a studnia jest głęboka.' },
    { v: 11, cont: true, text: 'Skądże więc weźmiesz wody żywej?' },
    { v: 12, text: 'Czy Ty jesteś większy od ojca naszego Jakuba, który dał nam tę studnię,' },
    { v: 12, cont: true, text: 'z której pił i on sam, i jego synowie i jego bydło?»' },
  ],
  cam: { x: [-40, 60], y: [-40, 1900], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    let cover, rope, bucketD, fill;
    const PUL = G.floor + 6 - 156 * 1.1;
    const W = wellSet(S, {
      skyCols: NOON, sunAt: [830, 150],
      behind: (S) => {
        // the cross-section of the ground under the well
        const L = S.layer({ par: 0.55, sh: 4 });
        const s = sheet();
        const top = c.wave(TOP, [2, 1], [300, 90]);
        s.p(c.ridge(top, -900, 2500, 2100, 12, 1), C.soil);
        const bands = [[820, C.soil, shade(C.soil, 0.12)], [1000, shade(C.soil, -0.12), null], [1180, mix(C.rock3, C.soil, 0.5), null], [1380, shade(C.soil, -0.25), null], [1560, mix(C.rock2, C.soilDark, 0.55), null]];
        bands.forEach(([y, col]) => s.p(c.ridge(c.wave(y, [14, 6], [700, 200]), -900, 2500, 2100, 14, 2), col));
        let peb = '';
        for (let i = 0; i < 80; i++) peb += c.cut(c.blob(c.rr(-600, 2200), c.rr(740, 2200), c.rr(4, 14), c.rr(3, 8), 7, 0.25), 0.4, 3);
        s.x(peb, shade(C.soil, 0.25), 'opacity=".45"');
        let roots = '';
        for (let i = 0; i < 16; i++) { const x = c.rr(-400, 2000); roots += c.ribbon(c.qbez([x, TOP + 2], [x + c.rr(-30, 30), TOP + 50], [x + c.rr(-50, 50), TOP + c.rr(60, 130)], 8), (u) => 3 - u * 2.4); }
        s.x(roots, shade(C.wood2, -0.2), 'opacity=".7"');
        // the shaft: stone lining at the top, rock below, water at the bottom
        s.p(c.cut([[SX - 52, TOP], [SX + 52, TOP], [SX + 50, BOT], [SX - 50, BOT]], 1.2, 12), mix(C.soilDark, C.night2, 0.35));
        let lin = '';
        for (let y = TOP; y < TOP + 360; y += 22) { lin += c.cut(c.rect(SX - 60, y, 12, 20), 0.3, 4) + c.cut(c.rect(SX + 48, y + 8, 12, 20), 0.3, 4); }
        s.p(lin, mix(C.stone2, C.soil, 0.3));
        s.x(c.poly([[SX - 30, TOP], [SX + 20, TOP], [SX + 6, BOT - 60], [SX - 16, BOT - 60]]), '#fff3cf', 'opacity=".08"');
        s.p(c.cut([[SX - 50, BOT - 60], [SX + 50, BOT - 60], [SX + 56, BOT + 20], [SX - 56, BOT + 20]], 0.6, 8), mix(C.lakeDeep, C.night2, 0.45));
        s.x(c.ribbon([[SX - 36, BOT - 52], [SX + 30, BOT - 54]], 2.2), C.lake2, 'opacity=".7"');
        L.add(s.out());
        // a depth mark
        L.add(`<g><path d="M${SX + 120} ${TOP + 10}V${BOT - 60}" stroke="${C.cream}" stroke-width="2" stroke-dasharray="8 7" opacity=".7"/><path d="${c.poly([[SX + 112, TOP + 22], [SX + 120, TOP + 8], [SX + 128, TOP + 22]]) + c.poly([[SX + 112, BOT - 72], [SX + 120, BOT - 58], [SX + 128, BOT - 72]])}" fill="${C.cream}" opacity=".7"/><text x="${SX + 136}" y="${(TOP + BOT) / 2}" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.cream}" transform="rotate(90 ${SX + 136} ${(TOP + BOT) / 2})">${tr('studnia jest głęboka', 'the well is deep')}</text></g>`);
        // the rope and bucket going down inside the shaft
        rope = L.add(`<path d="M-2 0H2V100H-2Z" fill="${C.rope}"/>`);
        bucketD = L.add(`<g>${bucketRope(c)}</g>`);
        fill = L.add(`<ellipse rx="10" ry="3" fill="${C.lake2}"/>`);
        // the sandy front that falls away
        cover = S.layer({ par: 0.55, sh: 3 });
        cover.add(sheet().p(c.ridge(top, -900, 2500, 2100, 12, 1), mix(C.sand, C.sand2, 0.45)).out());
        return L;
      },
    });
    const K = wellCast(S, W, { bucket: false });
    const fx = S.layer({ par: 0.55, sh: 5 });
    const bucket = fx.add(`<g>${bucketRope(c)}</g>`);
    const splash = fx.add(`<g><ellipse rx="40" ry="8" fill="none" stroke="${C.foam}" stroke-width="3"/><ellipse rx="22" ry="5" fill="none" stroke="${C.foam}" stroke-width="2"/></g>`);
    const dq = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/><path d="${c.cut([[0, -26], [14, -2], [12, 10], [0, 16], [-12, 10], [-14, -2]], 0.3, 4)}" fill="#bfe6ee"/><path d="${c.poly(c.ell(-4, 2, 3, 6, 8))}" fill="#fff" opacity=".8"/><g transform="translate(34 -4)">${GLYPH.q(c)}</g></g>`);
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-14 2)"><circle r="18" fill="url(#halo-glow)"/><path d="${c.cut([[0, -16], [9, -1], [8, 6], [0, 10], [-8, 6], [-9, -1]], 0.3, 3)}" fill="#bfe6ee"/></g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 72, h: 50, flip: true })}</g>`);

    // the picture of Jacob's days
    const bg = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-PAN.w / 2, 0, PAN.w, PAN.h), 0, 40), mix(C.parchment, C.dune, 0.25));
      s.p(c.ridge(c.wave(150, [10, 4], [300, 90]), -PAN.w / 2 - 10, PAN.w / 2 + 10, PAN.h + 10, 10, 1), mix(C.hillMid, C.dune, 0.5));
      s.p(c.ridge(c.wave(206, [3, 1], [200, 60]), -PAN.w / 2 - 10, PAN.w / 2 + 10, PAN.h + 10, 10, 0.8), mix(C.sand, C.dune, 0.4));
      return s.out() + `<g transform="translate(-20 222) scale(.72)">${well(c)}</g>`.replace(/#[0-9a-f]{6}/g, (m) => mix(m, mix(C.parchment, C.dune, 0.5), 0.45)) + `<g transform="translate(160 226) scale(1)">${trough(c, 90, mix(C.stone2, C.dune, 0.4))}</g>`;
    })();
    const panEl = fx.add(`<g>${panel(S, bg, { w: PAN.w, h: PAN.h, k: 'jacob' })}</g>`);
    const pTag = fx.add(`<g>${nameTag(c, tr('ojciec Jakub', 'father Jacob'), { size: 17 })}</g>`);
    const jacob = S.puppet(fx.add(person(c, sepia({ ...JACOB, holdB: `<path d="${c.ribbon([[0, -10], [2, 80]], 4)}" fill="${mix(C.wood2, C.dune, 0.4)}"/>`, holdF: `<g transform="translate(0 4) scale(.7)">${cupJ(c, mix(C.pot, C.dune, 0.4))}</g>` }))));
    const sons = [0, 1, 2].map((i) => ({ i, p: S.puppet(fx.add(person(c, sepia({ robe: [C.sageRobe, C.roseRobe, C.dustyBlue][i], hair: [C.hair, C.hair2, C.hair3][i], hairStyle: ['short', 'curly', 'wrap'][i], veil: C.linen2, beard: ['short', 'full', 'none'][i], skin: [C.skin2, C.skin3, C.skin][i], belt: C.leather, holdB: i === 1 ? `<g transform="translate(0 8) scale(.5)">${hydria(c, { col: mix(C.pot, C.dune, 0.4) })}</g>` : '' })))) }));
    const beasts = [
      { el: fx.add(`<g>${cow(c, { col: mix(C.wood3, C.dune, 0.4) })}</g>`), dx: 120, dy: 226, s: 0.8, flip: 1 },
      { el: fx.add(`<g>${sheep(c, { wool: mix(C.linen, C.dune, 0.3) })}</g>`), dx: 200, dy: 230, s: 0.72, flip: -1 },
      { el: fx.add(`<g>${sheep(c, { wool: mix(C.linen2, C.dune, 0.4) })}</g>`), dx: 160, dy: 244, s: 0.78, flip: 1 },
    ];
    beasts.forEach((b) => { b.head = b.el.querySelector('.headr'); });

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 830, sunY: 150, glow: 0.9 });
      /* v11a — she lifts the bucket: "nothing to draw with"; the front falls away; down the shaft */
      const lift = bump(t, 0.05, 0.4);
      const toWell = es(t, 0.3, 0.42);
      const down = es(t, 0.42, 0.95, ease.io);
      const up = es(t, 1.45, 1.9);
      const len = lerp(10, BOT - 76 - PUL, down) * (1 - up) + 10 * up;
      const point = es(t, 2.1, 2.35) * (1 - es(t, 3.0, 3.2));
      const back = es(t, 2.6, 2.8) * (1 - es(t, 3.0, 3.2));
      K.set({
        T, jF: 22 + bump(t, 1.95, 2.3) * 10, jB: 12, jH: -2 + point * -8,
        wF: 40 + lift * 60 + toWell * 20 * (1 - up) + point * 70 + es(t, 3.2, 3.5) * 30, wB: 20 + lift * 30 + back * 40, wH: -lift * 6 + point * -14 + back * 10, wLean: lift * 3,
      });
      cover.fade(1 - es(t, 0.3, 0.55) + es(t, 1.9, 2.1));
      W.fgL.fade(1 - es(t, 0.3, 0.45) + es(t, 1.85, 2.0));
      const [hx, hy] = hand(G.wx, G.floor, 1.05, true, 40 + lift * 60);
      const inShaft = t > 0.42 && t < 1.9;
      const tw = toWell * (1 - es(t, 1.9, 2.0));
      vis(bucket, { x: lerp(hx, SX, tw), y: lerp(hy + 4, PUL + 14, tw), s: 1.1, o: inShaft ? 0 : 1 });
      vis(bucketD, { x: SX, y: PUL + len, s: 1.1, o: inShaft ? 1 : 0 });
      vis(rope, { x: SX, y: PUL, sy: len / 100, o: t > 0.35 && t < 1.95 ? 1 : 0 });
      vis(fill, { x: SX, y: PUL + len + 3, s: 1.1, o: inShaft && t > 1.25 ? 1 : 0 });
      const sp = seg(t, 0.92, 1.4);
      vis(splash, { x: SX, y: BOT - 56, s: 0.4 + sp * 1.2, o: sp > 0 && sp < 1 ? 1 - sp : 0 });
      /* v11b — where then the living water? */
      const dk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.45, 1.6));
      vis(dq, { x: SX - 10, y: BOT - 160 + Math.sin(T * 2) * 4, s: dk, o: dk > 0.01 ? 1 : 0 });
      const [whx, why] = K.wHead();
      const ak = es(t, 1.7, 1.9, ease.back) * (1 - es(t, 2.05, 2.15));
      vis(ask, { x: whx - 16, y: why - 22, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v12 — Jacob's picture */
      const pk = es(t, 2.0, 2.4, ease.out);
      const py = PAN.y - (1 - pk) * 700;
      const on = pk > 0.01 ? 1 : 0;
      vis(panEl, { x: PAN.x, y: py, o: on });
      vis(pTag, { x: PAN.x - PAN.w / 2 + 70, y: py + 6, r: -4, o: on * es(t, 2.3, 2.5) });
      const drink = es(t, 3.1, 3.3) * (1 - es(t, 3.75, 3.9));
      jacob.set({ x: PAN.x - 100, y: py + 226, s: 0.6, o: on, armB: 30, armF: 20 + es(t, 2.35, 2.6) * 60 * (1 - es(t, 3.0, 3.1)) + drink * 130, head: -drink * 16, blink: blinkAt(T, 4) });
      sons.forEach((sn) => {
        const k = es(t, 3.15 + sn.i * 0.12, 3.35 + sn.i * 0.12);
        sn.p.set({ x: PAN.x - 190 + sn.i * 40 + (sn.i === 2 ? 180 : 0), y: py + 234 + (sn.i % 2) * 6, s: 0.54, flip: sn.i === 2, o: on * k, armF: 30 + bump(t, 3.4 + sn.i * 0.1, 3.9) * 90, head: -bump(t, 3.4 + sn.i * 0.1, 3.9) * 14, blink: blinkAt(T, sn.i + 5) });
      });
      beasts.forEach((b, i) => {
        const k = es(t, 3.3 + i * 0.1, 3.5 + i * 0.1);
        vis(b.el, { x: PAN.x + b.dx, y: py + b.dy, s: b.s, sx: b.s * b.flip, o: on * k });
        pose(b.head, { r: 30 * es(t, 3.5, 3.6) * (0.6 + 0.4 * Math.sin(t * 20 + i)) });
      });

      const follow = es(t, 0.42, 0.6) * (1 - es(t, 1.5, 1.85));
      const camK = kf(t, [[-0.5, 40], [0.3, 60], [0.5, 200], [1.9, 40], [2.4, -20], [4, -20]]);
      S.cam.y = lerp(camK, Math.min((BOT - 150 - 470) / 0.55, (PUL + len - 500) / 0.55), follow);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.3, 1.2], [0.6, 1.1], [1.0, 1.22], [1.45, 1.26], [1.9, 1.14], [2.4, 1.04]]);
      S.cam.x = kf(t, [[-0.5, 30], [0.5, 50], [1.9, 40], [2.4, 20]]);
    };
  },
};
