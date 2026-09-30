// J 19,31–34 — late afternoon; the sun goes down towards the great Sabbath (a card with two unlit Sabbath
// candles comes down). The chief priests ask Pilate — his round portrait on the fly-lines nods. Everything here
// stays small and far away: two soldiers' shadows climb the hill to the two other crosses and stand there a
// moment; the heads on those crosses sink. At the middle cross they stop and look up — He is already dead — and
// lower their clubs. One lifts his spear towards His side: a flash of light hides it all — and from the cross a
// stream of light and a stream of clear water run down the hill towards us, like the living water.
import { C, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, soldierSil, priest, golgothaSet, setCrosses, clearClouds, glory, medallion, speech, shroudCross, candle, strip, waterChunks, waterGlowDef, sunCut, hanging, swing, LOOK, tr, GOL, INK, J19, PI } from './lib.js';

const RY = 704;
const SIL = '#3a2c34';

export default {
  id: 'j19-pierced',
  beats: [
    { v: 31, text: 'Ponieważ był to dzień Przygotowania, aby zatem ciała nie pozostawały na krzyżu w szabat - ów bowiem dzień szabatu był wielkim świętem -' },
    { v: 31, cont: true, text: 'Żydzi prosili Piłata, aby ukrzyżowanym połamano golenie i usunięto ich ciała.' },
    { v: 32, text: 'Przyszli więc żołnierze' },
    { v: 32, cont: true, text: 'i połamali golenie tak pierwszemu, jak i drugiemu, którzy z Nim byli ukrzyżowani.' },
    { v: 33, text: 'Lecz gdy podeszli do Jezusa i zobaczyli, że już umarł,' },
    { v: 33, cont: true, text: 'nie łamali Mu goleni,' },
    { v: 34, text: 'tylko jeden z żołnierzy włócznią przebił Mu bok' },
    { v: 34, cont: true, text: 'i natychmiast wypłynęła krew i woda.' },
  ],
  cam: { x: [-40, 60], y: [-40, 60], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { pal: J19.still });
    clearClouds(G);
    const sunEl = hanging(G.hangL, `<circle r="110" fill="url(#warm-glow)" opacity=".8"/>${sunCut(c, 40, { disc: C.apricot, inner: C.peach, rays: C.sunDeep })}`, { x: 0, y: 0, len: 900 });
    const gl = G.hangL.add(`<g>${glory(c, 360, 16)}</g>`);
    const u = GOL.H / 240;
    const HDY = -GOL.H + 52 * u - 2 * u;
    const hdC = G.crossC.querySelector('.hd');
    const sides = [G.crossL, G.crossR].map((el, i) => ({ hd: el.querySelector('.hd'), h: GOL.sides[i][2] }));
    const [SX, SY] = [GOL.x + 10 * u, GOL.top - GOL.H + 52 * u + 40 * u];   // His side

    /* the small shadows on the hill */
    const H = G.onHill;
    const solA = S.puppet(H.add(soldierSil(c, 0, { spear: false, col: SIL })));
    const solB = S.puppet(H.add(soldierSil(c, 2, { spear: true, col: SIL })));
    const flash = H.add(`<g><circle r="60" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 26, 6, 8, 0))}" fill="#fff6dc"/></g>`);
    /* the chief priests below, Pilate's portrait on the fly-lines */
    const P = G.P;
    const pr = [0, 1].map((i) => S.puppet(P.add(priest(c, i))));
    const plL = S.layer({ par: 0.3, sh: 6 });
    const pil = hanging(plL, `${medallion(c, LOOK.pilate, { r: 46, rim: C.sun })}<g transform="translate(0 72)">${strip(c, tr('Piłat', 'Pilate'), { size: 16 })}</g><g class="nod" opacity="0" transform="translate(40 34)"><circle r="16" fill="${C.cream}"/><path d="${c.ribbon([[-7, 0], [-2, 5], [7, -6]], 3)}" fill="${C.moss}"/></g>`, { x: 0, y: 0, len: 900 });
    const nod = pil.querySelector('.nod');
    const ask = plL.add(`<g>${speech(c, `<g transform="scale(1.2)">${shroudCross(c, 40)}</g>`, { w: 62, h: 64 })}</g>`);
    const cd = (x) => `<g transform="translate(${x} 104)">${candle(c, 40).replace(/<g class="flame"[\s\S]*<\/g>$/, '').replace(/<circle class="glow"[^>]*\/>/, '')}</g>`;
    const card = hanging(plL, `${sheet().p(c.cut(c.rect(-120, 0, 240, 150), 0.5, 7), C.parchment).out()}${cd(-28)}${cd(28)}<g transform="translate(0 130)">${strip(c, tr('szabat — wielkie święto', 'a special Sabbath'), { size: 16 })}</g>`, { x: 0, y: 0, len: 900 });

    /* the streams: light and living water */
    const gid = waterGlowDef(S);
    const stL = S.layer({ par: 0.2, sh: 2 });
    const path = [...c.cbez([SX + 2, SY + 4], [SX + 24, SY + 110], [SX - 30, GOL.top + 50], [SX + 6, GOL.top + 170], 18), ...c.cbez([SX + 6, GOL.top + 170], [SX + 50, 640], [SX - 50, 770], [SX + 30, 980], 18).slice(1)];
    const W = waterChunks(c, path, 14, [5, 34], gid);
    const water = W.chunks.map((ch) => ({ u: ch.u, el: stL.add(`<g>${ch.markup}</g>`) }));
    const L = waterChunks(c, path.map(([x, y]) => [x - 10, y]), 14, [3, 16]);
    const light = L.chunks.map((ch) => ({ u: ch.u, el: stL.add(`<g opacity="0">${ch.markup.replace(/#9fd6e0/g, '#fff0c2').replace(/#f2fdff/g, '#fffaf0')}</g>`) }));

    return (t, time) => {
      const T = time;
      G.sk.blend(J19.still, J19.eve, es(t, 0, 2) * 0.8);
      pose(sunEl, { x: 1180, y: lerp(260, 400, es(t, 0, 2.5)) });
      setCrosses(G, 1, 1, 1);
      pose(hdC, { x: 0, y: HDY, r: 28 });
      fade(G.crossC.querySelector('.hl'), 0.35 + es(t, 7.05, 7.6) * 0.5);
      pose(gl, { x: GOL.x, y: GOL.top - 150, s: 0.7 + es(t, 7.05, 7.7) * 0.2, r: T * 1.2 * 0.3, o: 0.12 + es(t, 6.1, 6.3) * 0.2 * (1 - es(t, 6.5, 7.0)) + es(t, 7.05, 7.7) * 0.3 });

      /* v31a — the Preparation; the great Sabbath is near */
      const ck = es(t, 0.1, 0.45) * (1 - es(t, 0.95, 1.15));
      swing(card, S.portrait ? 960 : 1020, 130 - (1 - ck) * 700, T, 1, 0.8, 1);
      /* v31b — the chief priests ask Pilate; he nods */
      const prK = (i) => [[0.9 + i * 0.1, [1560 + i * 90, RY + 4]], [1.5 + i * 0.1, [1000 + i * 100, RY + 4]], [2.0, [1000 + i * 100, RY + 4]], [2.6, [1600 + i * 100, RY + 4]]];
      pr.forEach((p, i) => {
        const k = prK(i), [x, y] = kf(t, k);
        const up = es(t, 1.4, 1.6) * (1 - es(t, 1.95, 2.05));
        p.set({ x, y, s: 0.82, flip: t < 2.0, walk: moving(t, k) ? x * 0.06 : undefined, armF: 30 + up * 90, armB: 10 + up * 40, head: -up * 14, blink: blinkAt(T, 5 + i) });
      });
      const pk = es(t, 1.1, 1.4) * (1 - es(t, 1.95, 2.15));
      swing(pil, S.portrait ? 1030 : 1080, 200 - (1 - pk) * 700, T, 1, 0.8, 2);
      fade(nod, es(t, 1.6, 1.75));
      const ak = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(ask, { x: 990, y: 520, s: ak, o: ak > 0.02 ? 1 : 0 });

      /* v32 — two soldiers climb to the other two crosses; their heads sink */
      const aK = [[2.05, [470, 560]], [2.8, [632, 452]], [4.05, [632, 452]], [4.5, [764, 426]]];
      const bK = [[2.05, [1130, 560]], [2.8, [968, 452]], [4.05, [968, 452]], [4.5, [842, 426]]];
      const [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      const look = es(t, 4.4, 4.6) * (1 - es(t, 5.1, 5.3));
      const lower = es(t, 5.05, 5.3);
      const turnA = es(t, 5.2, 5.25);
      const thrust = es(t, 6.05, 6.35) * (1 - es(t, 6.6, 6.9));
      const stay = bump(t, 3.05, 3.9);
      solA.set({ x: ax, y: ay, s: 0.34, flip: t > 4.0 ? turnA < 0.5 ? false : true : false, walk: moving(t, aK) ? ax * 0.2 : undefined, armF: 30 + stay * 40 + look * 20 - lower * 20, armB: 10 + lower * 50 * (1 - es(t, 5.6, 5.9)), head: -look * 18, blink: 0, o: es(t, 2.0, 2.15) });
      solB.set({ x: bx, y: by, s: 0.34, flip: true, walk: moving(t, bK) ? bx * 0.2 : undefined, armF: 30 + stay * 40 + thrust * 90, armB: 10, head: -look * 18 - thrust * 14, lean: -thrust * 10, blink: 0, o: es(t, 2.0, 2.15) });
      sides.forEach((sd, i) => {
        const k = es(t, 3.25 + i * 0.25, 3.6 + i * 0.25);
        const u2 = sd.h / 240;
        pose(sd.hd, { x: 0, y: -sd.h + 52 * u2 - 2 * u2, r: (i ? 1 : -1) * k * 26 });
      });
      /* v34a — the spear: a flash of light hides it */
      const fl = bump(t, 6.3, 6.75);
      pose(flash, { x: SX + 6, y: SY, s: 0.4 + fl * 1.2, r: T * 20, o: fl });
      /* v34b — blood and water: a stream of light and a stream of living water run down towards us */
      const run = es(t, 6.5, 7.6, (x) => x);
      water.forEach((w) => { const k = Math.min(1, Math.max(0, (run - (w.u - 1 / 14)) * 14)); pose(w.el, { o: k, sy: 1 }); });
      light.forEach((w) => { const k = Math.min(1, Math.max(0, (run * 1.02 - (w.u - 1 / 14)) * 14)); fade(w.el, k * 0.9); });

      S.cam.x = es(t, 0.9, 1.4) * 60 * (1 - es(t, 1.95, 2.3));
      S.cam.y = -10 - es(t, 2.2, 2.8) * 20 + es(t, 6.8, 7.8) * 50;
      S.cam.z = 1.02 + es(t, 2.6, 3.2) * 0.08 * (1 - es(t, 6.8, 7.6)) + es(t, 4.2, 4.7) * 0.06 * (1 - es(t, 6.8, 7.6));
    };
  },
};
