// Mk 15,23–28 — Golgotha. Up close, a soldier offers wine with myrrh; Jesus gently refuses.
// Then the camera draws back and everything is seen from far away, quietly: the cross is raised on the bare
// hill, a small dark silhouette with a thin ring of light. In the foreground the soldiers kneel over His
// garments and throw dice. The hour-dial shows the third hour; the inscription hangs beside the cross; two
// more crosses rise, left and right; and a scroll of the prophet comes down: "counted with transgressors".
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, addToHead, soldier, thornWreath, wineCup, garments, dice, board, strip, golgothaSet, setCrosses, driftClouds, crossHead, hanging, hang2, swing, GOL, SKIES, INK, FONT, PI } from './lib.js';

const JX = 800, JY = 690;

export default {
  id: 'm15-cross',
  beats: [
    { v: 23, text: 'Tam dawali Mu wino zaprawione mirrą,' },
    { v: 23, cont: true, text: 'lecz On nie przyjął.' },
    { v: 24, text: 'Ukrzyżowali Go' },
    { v: 24, cont: true, text: 'i rozdzielili między siebie Jego szaty, rzucając o nie losy, co który miał zabrać.' },
    { v: 25 },
    { v: 26 },
    { v: 27 },
    { v: 28 },
  ],
  cam: { x: [-30, 30], y: [-60, 150], z: [0.96, 1.3] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { dial: true });
    const P = G.P;
    const wr = thornWreath(c);
    const jes = S.puppet(P.add(addToHead(person(c, CAST.jesus), wr)));
    const offer = S.puppet(P.add(soldier(c, 2, { spear: false, extra: { holdF: wineCup(c) } })));
    // the soldiers at the foot, dividing the garments
    const kneel = [[610, 700, false], [700, 712, false], [900, 712, true], [990, 700, true]].map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(soldier(c, i, { pose: 'kneel', spear: false }))), seed: c.rr(0, 9) }));
    const g = garments(c);
    const fx = G.fx;
    const cloth = fx.add(`<g>${sheet().p(c.cut([[-110, -8], [104, -12], [118, 10], [-114, 12]], 0.8, 8), C.stone2).out()}</g>`);
    const tunic = fx.add(`<g>${g.tunic}</g>`);
    const mantle = fx.add(`<g>${g.mantle}</g>`);
    const dz = fx.add(`<g>${dice(c)}</g>`);
    const d0 = dz.querySelector('.d0'), d1 = dz.querySelector('.d1');
    // the inscription: a small board on the cross, a big one hanging beside it
    const small = G.hillL.add(`<g>${board(c, tr('KRÓL ŻYDOWSKI', 'KING OF THE JEWS'), { size: 7, w: 54 })}</g>`);
    const bigL = S.layer({ par: 0.12, sh: 5 });
    const big = bigL.add(`<g>${hang2(`${board(c, tr(['KRÓL', 'ŻYDOWSKI'], ['THE KING', 'OF THE JEWS']), { size: 24 })}`, 60, 900)}</g>`);
    const ptr = bigL.add(`<path d="M0 0L100 0" stroke="${C.cream}" stroke-width="1.6" stroke-dasharray="4 4" fill="none" opacity=".8"/>`);
    // the prophet's scroll
    const scr = sheet().p(c.cut(c.rect(-150, -40, 300, 80), 0.5, 8), C.parchment).p(c.cut(c.ell(-152, 0, 8, 44, 12), 0.3, 4) + c.cut(c.ell(152, 0, 8, 44, 12), 0.3, 4), C.wood2).out();
    const lines = tr(['W poczet złoczyńców', 'został zaliczony'], ['He was counted', 'with transgressors']);
    const scrollTxt = lines.map((l, i) => `<text x="0" y="${-6 + i * 26}" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.ink}">${l}</text>`).join('') + `<text x="118" y="34" text-anchor="end" font-family="${FONT}" font-size="12" fill="${C.wood2}">${tr('Iz 53,12', 'Is 53:12')}</text>`;
    const scroll = hanging(S.layer({ par: 0.1, sh: 5 }), `${scr}${scrollTxt}`, { x: 0, y: 0, len: 900 });
    const light = G.onHill.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);
    const hourTag = G.hangL.add(`<g>${strip(c, tr('godzina trzecia', 'the third hour'), { size: 16 })}</g>`);

    return (t, time) => {
      const T = time;
      G.sk.blend(SKIES.storm, SKIES.grey, es(t, 2, 3) * 0.5);
      driftClouds(G, T);

      /* v23 — the wine with myrrh, refused */
      const [hx, hy] = headAt(JX, JY, 1.02, false);
      const reach = es(t, 0.05, 0.4) * (1 - es(t, 1.2, 1.5));
      const refuse = es(t, 1.05, 1.3);
      const gone = es(t, 1.95, 2.2);
      const oK = [[-0.3, [1180, JY + 4]], [0.3, [930, JY + 4]], [1.55, [930, JY + 4]], [2.4, [1260, JY + 8]]];
      const [ox, oy] = kf(t, oK);
      offer.set({ x: ox, y: oy, s: 1, flip: t < 1.6, walk: moving(t, oK) ? ox * 0.06 : undefined, armF: 20 + reach * 70, armB: 8, head: refuse * 6, o: 1 - es(t, 2.3, 2.5), blink: blinkAt(T, 3) });
      jes.set({ x: JX, y: JY, s: 1.02, flip: false, o: 1 - gone, armF: 10 + refuse * 55 * (1 - es(t, 1.8, 2.1)), armB: 6, head: -refuse * 12, blink: blinkAt(T) });

      /* v24a — crucified: seen from far away, the cross is raised */
      const up = es(t, 2.15, 2.75);
      const upS = es(t, 6.05, 6.6);
      setCrosses(G, up, upS, es(t, 6.2, 6.75));
      pose(light, { x: GOL.x, y: GOL.top - GOL.H + 60, s: 0.5 + up * 0.5, o: up * (0.35 + bump(t, 7, 8) * 0.4) });

      /* v24b — the garments divided, lots cast */
      const div = es(t, 3.0, 3.25);
      kneel.forEach((k) => {
        const lean = bump(t, 3.2 + k.i * 0.08, 3.7 + k.i * 0.08);
        k.p.set({ x: k.x, y: k.y, s: 0.95, flip: k.f, o: div, armF: 50 + lean * 40 + (k.i === 1 ? bump(t, 3.3, 3.6) * 60 : 0), armB: 20 + (k.i === 3 ? es(t, 3.6, 3.9) * 90 : 0), lean: 8 + lean * 6, head: 12, blink: blinkAt(T, k.seed) });
      });
      pose(cloth, { x: 800, y: 700, o: div });
      pose(tunic, { x: 770, y: 688, o: div });
      const lift = es(t, 3.6, 3.9);
      pose(mantle, { x: lerp(830, 950, lift), y: lerp(690, 600, lift), r: lift * -20, o: div });
      const roll = seg(t, 3.25, 3.65);
      pose(d0, { x: lerp(-60, -12, roll), y: -Math.sin(roll * PI) * 70, r: roll * 540 });
      pose(d1, { x: lerp(-50, 14, roll), y: -Math.sin(roll * PI) * 90 + 4, r: -roll * 480 });
      pose(dz, { x: 800, y: 690, o: roll > 0 ? div : 0 });

      /* v25 — the third hour on the dial */
      const dk = es(t, 4.0, 4.3);
      G.hangL.fade(1);
      const hr = lerp(2.2, 3, es(t, 4.1, 4.5));
      const [sxp, syp] = G.dial.at(hr);
      pose(G.sunEl, { x: sxp, y: syp + 22 - (1 - dk) * 600, o: dk > 0.01 ? 1 : 0 });
      pose(G.dial.el, { o: dk });
      pose(G.disc, { o: 0 });
      const [h3x, h3y] = G.dial.at(3);
      const htk = es(t, 4.4, 4.65, ease.back);
      pose(hourTag, { x: h3x + 30, y: h3y + 100, s: htk, o: htk > 0.02 ? 1 - es(t, 5.0, 5.2) : 0 });

      /* v26 — the inscription */
      const ik = es(t, 5.05, 5.4);
      const topY = GOL.top - GOL.H - 10;
      pose(small, { x: GOL.x, y: topY, o: ik });
      const bx = S.portrait ? 990 : 1110, by = 118 - (1 - ik) * 700;   // phone: the board hangs inside the frame
      pose(big, { x: bx, y: by, r: Math.sin(T * 0.8) * 1.2 * ik, o: ik > 0.01 ? 1 : 0 });
      const d = Math.hypot(bx - 60 - GOL.x, by + 40 - topY);
      pose(ptr, { x: GOL.x + 20, y: topY + 6, r: (Math.atan2(by + 40 - topY - 6, bx - 70 - GOL.x - 20) * 180) / PI, sx: Math.max(0.01, (d - 60) / 100), o: es(t, 5.35, 5.5) });

      /* v28 — the scroll */
      const sk2 = es(t, 7.05, 7.45);
      swing(scroll, S.portrait ? 765 : 800, 150 - (1 - sk2) * 700, T, 1, 0.7, 2);   // phone: clear of the inscription board

      S.cam.z = lerp(1.2, 1.0, es(t, 1.9, 2.8)) - es(t, 5.0, 5.4) * 0.03;
      S.cam.y = lerp(110, -10, es(t, 1.9, 2.8)) + es(t, 2.9, 3.3) * 40 * (1 - es(t, 3.9, 4.2)) - es(t, 3.9, 4.2) * 20;
    };
  },
};
