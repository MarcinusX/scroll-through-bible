// Mt 27,19 — Matthew's own moment. On the platform Pilate has sat down on the judgment seat; the crowd waits
// below. A maid of his wife's household hurries up and hands him a folded wax tablet; he opens it and reads.
// The message comes down on the fly-lines: a night picture — his wife asleep, and over her a troubled dream,
// dark swirls around a small figure of light — and beside it her words, "Have nothing to do with that righteous
// man". Pilate lowers the tablet and turns to look at Jesus, who stands quietly in a soft light.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stars, moon } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, moving, hand, headAt, squareSet, squareCast, PLAT, pilate, curuleSeat, tablet, wordPlate, picturePlate, strip, hanging, swing, WIFE, MAID, tr, PI } from './lib.js';

const JX = 780;
const PX = 1000;

export default {
  id: 'mt27-dream',
  beats: [
    { v: 19, text: 'A gdy on odbywał przewód sądowy, żona jego przysłała mu ostrzeżenie:' },
    { v: 19, cont: true, text: '«Nie miej nic do czynienia z tym Sprawiedliwym, bo dzisiaj we śnie wiele nacierpiałam się z Jego powodu».' },
  ],
  cam: { x: [0, 140], y: [-40, 0], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const H = squareSet(S);
    const K = squareCast(S, H);
    const P = H.charL;
    const shine = H.cellIn.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    P.add(`<g transform="translate(${PX} ${PLAT})">${curuleSeat(c)}</g>`);
    const pil = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const maid = S.puppet(P.add(person(c, MAID)));
    const fx = H.fxL;
    const tab = fx.add(`<g>${tablet(c, 26, 20)}</g>`);

    /* the dream, a night picture */
    const dreamL = S.layer({ par: 0.2, sh: 5 });
    const W = 280, Hh = 160;
    let inner = `<rect x="${-W / 2}" y="0" width="${W}" height="${Hh}" fill="${mix(C.night2, C.indigo, 0.4)}"/>` + stars(c, { x0: -W / 2, x1: W / 2, y0: 6, y1: 90, n: 14 });
    inner += `<g transform="translate(${W / 2 - 42} 40)">${moon(c, 18)}</g>`;
    // the couch and the sleeper
    inner += sheet().p(c.cut([[-120, Hh - 40], [110, Hh - 42], [112, Hh - 18], [-122, Hh - 16]], 0.5, 6), mix(C.wood2, C.plumRobe, 0.3)).p(c.cut([[-128, Hh - 70], [-110, Hh - 72], [-108, Hh - 40], [-126, Hh - 38]], 0.4, 5), mix(C.wood2, C.plumRobe, 0.3)).p(c.cut(c.blob(-92, Hh - 48, 22, 9, 10, 0.2), 0.4, 4), C.linen2).out();
    inner += `<g transform="translate(-100 ${Hh - 44}) rotate(-90) scale(.52)">${person(c, { ...WIFE, eyes: 'closed' })}</g>`;
    inner += sheet().p(c.cut([[-70, Hh - 64], [100, Hh - 66], [106, Hh - 42], [-74, Hh - 40]], 0.6, 6), shade(WIFE.mantle, -0.05)).out();
    // the troubled dream: dark swirls around a small figure of light
    const cx = 20, cy = 78;
    let sw = '';
    for (let i = 0; i < 5; i++) sw += c.ribbon(c.arc(cx, cy, 48 + i * 7, 30 + i * 5, PI * (0.1 + i * 0.37), PI * (1.0 + i * 0.37), 14), 3.2 - i * 0.3);
    inner += `<path d="${c.cut(c.blob(cx, cy, 70, 46, 16, 0.12), 0.8, 6)}" fill="${mix(C.lavender, C.indigo, 0.35)}" opacity=".85"/><path d="${sw}" fill="${mix(C.storm2, C.plumRobe, 0.3)}" opacity=".9"/>`;
    inner += `<circle cx="${cx}" cy="${cy}" r="42" fill="url(#halo-glow)"/><g transform="translate(${cx} ${cy + 34}) scale(.3)">${person(c, CAST.jesus)}</g>`;
    inner += [0, 1, 2].map((i) => `<circle cx="${-60 + i * 16}" cy="${Hh - 90 - i * 18}" r="${3 + i * 2}" fill="${mix(C.lavender, C.indigo, 0.35)}"/>`).join('');
    const dream = hanging(dreamL, `<g transform="scale(.8)">${picturePlate(c, S.id('dream'), inner, { w: W, h: Hh })}</g>`, { x: 0, y: -1500, len: 900 });
    const words = hanging(dreamL, wordPlate(c, tr(['Nie miej nic do czynienia', 'z tym Sprawiedliwym'], ['Have nothing to do', 'with that righteous man']), { size: 18 }).replace(/<path d="M[^"]*-900[^"]*"[^>]*\/>/, ''), { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const T = time;
      swing(H.sunEl, 1230, 150, T, 1, 0.6);
      swing(H.cl1, 420 + Math.sin(T * 0.1) * 30, 150, T, 1.2, 0.6, 1);
      swing(H.cl2, 1050 + Math.sin(T * 0.12 + 2) * 30, 110, T, 1.2, 0.8, 2);
      K.rebels.forEach((r) => r.set({ o: 0 }));
      K.bar.set({ x: H.CELL.x + 2, y: H.CELL.y - 2, s: 0.66, flip: true, armF: 24, armB: 14, blink: blinkAt(T, 8) });
      K.pil.set({ o: 0 });
      K.people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 20, armB: 10, head: -6, blink: blinkAt(T, m.seed) }));
      K.pr.forEach((m, i) => m.p.set({ x: m.x, y: m.y, s: 0.96, flip: false, armF: 30, armB: 12, head: -4, blink: blinkAt(T, 7 + i) }));
      K.sols[0].set({ x: 600, y: PLAT, s: 0.84, flip: false, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      K.sols[1].set({ x: 1190, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });

      /* v19a — on the judgment seat; the maid brings the tablet */
      const mK = [[0.0, [1330, PLAT]], [0.45, [1085, PLAT]], [0.8, [1085, PLAT]], [1.2, [1150, PLAT]]];
      const [mx, my] = kf(t, mK);
      const reach = es(t, 0.42, 0.55) * (1 - es(t, 0.66, 0.8));
      maid.set({ x: mx, y: my, s: 0.84, flip: t < 0.95, walk: moving(t, mK) ? mx * 0.07 : undefined, armF: 14 + reach * 70, armB: 8 + bump(t, 0.5, 0.9) * 20, head: bump(t, 0.5, 0.9) * 12, lean: bump(t, 0.55, 0.95) * 8, blink: blinkAt(T, 3) });
      const read = es(t, 0.6, 0.75);
      const turn = es(t, 1.3, 1.6);
      const pArm = 20 + read * 50 - turn * 30;
      pil.set({ x: PX, y: PLAT - 34 * 0.88, s: 0.88, flip: true, armF: pArm, armB: 10 + read * 30 * (1 - turn) + turn * 50, head: read * 12 * (1 - turn) - turn * 6, lean: read * 4 * (1 - turn), blink: blinkAt(T, 2) });
      const [ax, ay] = hand(mx, my, 0.84, true, 14 + reach * 70);
      const [bx, by] = hand(PX, PLAT - 30, 0.88, true, pArm, 0, 62);
      const pass = es(t, 0.55, 0.66);
      pose(tab, { x: lerp(ax, bx, pass), y: lerp(ay, by, pass) - 6, s: 1 + read * 0.3, r: -8, o: t > 0.35 ? 1 : 0 });

      /* Jesus, the righteous one, quiet in the light */
      K.jes.set({ x: JX, y: PLAT, s: 0.88, flip: false, armF: 30, armB: 28, head: 4, blink: blinkAt(T) });
      pose(shine, { x: JX + 4, y: PLAT - 130, s: 0.6 + turn * 0.3, o: 0.2 + turn * 0.6 });

      /* v19b — the dream and the words come down */
      const dk = es(t, 1.02, 1.4, ease.out);
      swing(dream, 790, (S.portrait ? -60 : 128) - (1 - dk) * 900, T, 0.9, 0.7, 1);
      const wk = es(t, 1.15, 1.5, ease.out);
      swing(words, S.portrait ? 790 : 1110, (S.portrait ? 110 : 128) - (1 - wk) * 900, T, 1, 0.8, 2);

      S.cam.x = 60 + es(t, 0.0, 0.6) * 60 - es(t, 1.0, 1.4) * 100;
      S.cam.y = -es(t, 0.2, 0.7) * 30 * (1 - es(t, 1.0, 1.4));
      S.cam.z = 1.0 + es(t, 0.2, 0.7) * 0.14 * (1 - es(t, 1.0, 1.4));
    };
  },
};
