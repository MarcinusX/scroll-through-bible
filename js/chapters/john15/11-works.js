// J 15,22–25 — "If I had not come and spoken to them, they would have no sin": a picture hangs down — Jesus in the
// Temple court, speaking to the leaders. "But now they have no excuse": the little paper excuses in their hands are
// torn away by the wind. "Whoever hates Me hates My Father also": on the ridge the shadows of the world raise their
// fists both at Him and at the light above Him, and a dark cloud rolls against that light. "If I had not done among
// them the works no one else did": His signs come down one by one in an arc of plates — the jars of Cana, the
// official's son, the mat at Bethesda, the loaves, the eyes that were opened, the tomb of Lazarus. "But now they have
// seen, and hated both Me and My Father": the shadows look up at them — and turn away. "To fulfil the word written in
// their Law": a scroll of the Law unrolls; "They hated Me without a cause" — the words light up on it.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, worldRidge, worldSet, framed, person, workPlate, lawScroll, radiance, lightCone, voiceRings, wordSlip,
  vis, kf, pose, attr, fade, lerp, blinkAt, mix, shade, sheet, tr, C, P, PI, JESUS, COLD,
} from './lib.js';
import { leaderOpts } from '../john5/lib.js';
import { caveIcon } from '../john11/lib.js';

const WORKS = ['jar', 'boy', 'mat', 'bread', 'eye', 'tomb'];

export default {
  id: 'j15-works',
  beats: [
    { v: 22, text: 'Gdybym nie przyszedł i nie mówił do nich, nie mieliby grzechu.' },
    { v: 22, cont: true, text: 'Teraz jednak nie mają usprawiedliwienia dla swego grzechu.' },
    { v: 23 },
    { v: 24, text: 'Gdybym nie dokonał wśród nich dzieł, których nikt inny nie dokonał, nie mieliby grzechu.' },
    { v: 24, cont: true, text: 'Teraz jednak widzieli je, a jednak znienawidzili i Mnie, i Ojca mego.' },
    { v: 25, text: 'Ale to się stało, aby się wypełniło słowo napisane w ich Prawie:' },
    { v: 25, cont: true, text: 'Nienawidzili Mnie bez powodu.' },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.25] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: COLD, vine: false, before: () => {
      const upL = S.layer({ par: 0.1, sh: 0, flat: true });
      const cone = upL.add(`<g>${lightCone(c, { w0: 60, w1: 260, h: 720, o: 0.2 })}</g>`);
      const rad = upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 56)}</g>`);
      const cloudL = S.layer({ par: 0.12, sh: 3 });
      const cloud = cloudL.add(`<g>${sheet().p(c.cut([...c.arc(0, 0, 200, 60, PI, PI * 2, 16), ...c.arc(-40, 0, 160, 34, 0, PI, 12)], 3, 10), '#1e1a30').p(c.cut(c.blob(-60, -40, 90, 40, 12, 0.2), 1.6, 8) + c.cut(c.blob(70, -34, 80, 36, 12, 0.2), 1.6, 8), '#262038').out()}</g>`);
      const world = worldRidge(S);
      return { cone, rad, cloud, world };
    } });
    const { ms, jesus, JX, JY } = tb;
    const { cone, rad, cloud, world } = tb.pre;
    // the picture: Jesus speaking in the Temple court; the leaders' paper excuses
    const PW = 420, PH = 220, fl = PH - 22;
    const col = (x) => `<path d="${c.cut(c.rect(x, 18, 26, fl - 18), 0.3, 6)}" fill="${C.stone}"/><path d="${c.cut(c.rect(x - 6, 10, 38, 10), 0.3, 4) + c.cut(c.rect(x - 6, fl - 8, 38, 8), 0.3, 4)}" fill="${C.stone2}"/>`;
    const slipM = (i) => `<g data-k="ex${i}"><path d="${c.cut([[-17, -10], [17, -11], [18, 10], [-17, 11]], 0.4, 5)}" fill="${C.cream}"/><path d="${c.ribbon([[-11, -3], [11, -3]], 1.4) + c.ribbon([[-11, 3], [6, 3]], 1.4)}" fill="${C.inkSoft}" opacity=".55"/></g>`;
    const inner = `<rect x="0" y="0" width="${PW}" height="${PH}" fill="${mix(C.cream, C.sand, 0.4)}"/>${col(30)}${col(PW - 60)}<path d="${c.cut(c.rect(0, fl, PW, 22), 0.4, 8)}" fill="${C.stone2}"/>`
      + `<g data-k="pj">${person(c, { ...JESUS })}</g>`
      + [0, 1, 2].map((i) => `<g data-k="pl${i}">${person(c, { ...leaderOpts(i) })}</g>`).join('')
      + [0, 1, 2].map(slipM).join('')
      + `<g data-k="rings"></g>`;
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const pic = hangL.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3 })}</g>`);
    const pj = S.puppet(pic.querySelector('[data-k="pj"]').firstElementChild);
    const pls = [0, 1, 2].map((i) => S.puppet(pic.querySelector(`[data-k="pl${i}"]`).firstElementChild));
    const exs = [0, 1, 2].map((i) => pic.querySelector(`[data-k="ex${i}"]`));
    const rings = voiceRings(hangL, c, { n: 3, r: 16, w: 3, color: shade(C.ochre, 0.2) });
    // the signs, in an arc of plates
    const plates = WORKS.map((w, i) => {
      const icon = w === 'tomb' ? `<g transform="translate(0 6) scale(.36)">${caveIcon(c, { open: true })}</g>` : '';
      const el = hangL.add(`<g><path d="M0 -1600V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${w === 'tomb' ? workPlate(c, 'none') + icon : workPlate(c, w)}</g>`);
      const a = PI * (1.14 + (i / (WORKS.length - 1)) * 0.72);
      return { el, x: 800 + Math.cos(a) * 300, y: 350 + Math.sin(a) * 160, i };
    });
    // the scroll of the Law
    const scroll = hangL.add(`<g>${lawScroll(c, 420, 150, [tr('Nienawidzili Mnie', 'They hated me'), tr('bez powodu.', 'without a cause.')])}</g>`);
    const lawLines = Array.from(scroll.querySelectorAll('.lawLine'));
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.update(T);
      /* v22 — the picture of the Temple court; the excuses torn away */
      const pk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      const py = 104 - (1 - pk) * 620 + (T ? Math.sin(T * 0.9) * 2 : 0);
      vis(pic, { x: 800, y: py, o: pk > 0.001 ? 1 : 0 });
      if (pk > 0.001) {
        pj.set({ x: 110, y: fl, s: 0.66, armF: 50 + bump(t, 0.2, 0.9) * 40, armB: bump(t, 0.3, 0.9) * 60, blink: blinkAt(T, 1) });
        pls.forEach((p, i) => p.set({ x: 240 + i * 56, y: fl, s: 0.62, flip: true, armF: 50 * (1 - es(t, 1.2, 1.4)), head: es(t, 1.4, 1.7) * 10, blink: blinkAt(T, i + 2) }));
        exs.forEach((ex, i) => {
          const f = es(t, 1.15 + i * 0.1, 1.6 + i * 0.1, ease.in);
          pose(ex, { x: 240 + i * 56 - 24 - f * (180 + i * 40), y: fl - 88 - f * (60 + i * 20), r: f * 300 * (i % 2 ? 1 : -1), s: 1 - f * 0.3, o: 1 - es(t, 1.5 + i * 0.1, 1.7 + i * 0.1) });
        });
      }
      rings(800 - PW / 2 + 110 * 1 + 6, py + fl - 120, bump(t, 0.1, 0.95) * pk, T, { s0: 0.6, spread: 1.4 });
      /* the Father's light over Him: v23, v24b */
      const fa = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.1)) + bump(t, 4.05, 5.0);
      vis(rad, { x: 800, y: 124, s: 1 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: Math.min(1, fa) });
      vis(cone, { x: 800, y: 124, o: Math.min(1, fa) });
      const ck = es(t, 2.2, 2.6) * (1 - es(t, 2.95, 3.1)) + es(t, 4.3, 4.6) * (1 - es(t, 4.9, 5.05));
      vis(cloud, { x: lerp(1400, 1010, ck), y: 150 + (T ? Math.sin(T * 0.6) * 4 : 0), o: ck > 0.01 ? Math.min(1, ck * 2) * 0.9 : 0 });
      /* v24a — the signs come down one by one */
      plates.forEach((p) => {
        const k = es(t, 3.05 + p.i * 0.1, 3.3 + p.i * 0.1, ease.out) * (1 - es(t, 4.9, 5.1, ease.in));
        vis(p.el, { x: p.x, y: p.y - (1 - k) * 700 + (T ? Math.sin(T * 0.9 + p.i) * 3 : 0), r: T ? Math.sin(T * 0.7 + p.i) * 2 : 0, o: k > 0.001 ? 1 : 0 });
      });
      /* v25 — the scroll of the Law unrolls; the words light up */
      const sk = es(t, 5.05, 5.35, ease.out);
      const un = es(t, 5.25, 5.7);
      vis(scroll, { x: 800, y: 250 - (1 - sk) * 600, sx: 0.08 + un * 0.92, sy: 1, s: 1, o: sk > 0.001 ? 1 : 0 });
      lawLines.forEach((l, i) => attr(l, 'opacity', es(t, 6.05 + i * 0.15, 6.3 + i * 0.15)));
      /* Jesus and the eleven */
      jesus.set({ x: JX, y: JY, s: 1.05, armF: bump(t, 0.05, 0.9) * 50 + bump(t, 3.05, 3.9) * 80 + bump(t, 5.05, 5.9) * 50, armB: bump(t, 2.05, 2.9) * 120 + bump(t, 3.1, 3.9) * 90, head: -bump(t, 2.1, 2.9) * 10 - bump(t, 6.1, 6.9) * 6, blink: blinkAt(T, 1) });
      ms.forEach((m) => placeM(m, T, { head: -es(t, 0, 0.3) * 12 * (1 - es(t, 1.9, 2.1)) - bump(t, 3.0, 4.0) * 12 - es(t, 5.1, 5.4) * 12 }));
      lampsAll(ms, 0.7);
      /* the world: fists at Him and at the light (v23); they look at the signs (v24b) — and turn away */
      const fist = bump(t, 2.1, 2.95);
      const look = es(t, 4.05, 4.3), turn = es(t, 4.45, 4.6);
      worldSet(world, (sh) => ({ point: fist * (sh.i % 2 ? 1 : 0.5), armB: fist * (sh.i % 2 ? 60 : 150), head: -look * (1 - turn) * 12 - fist * 8, flip: turn < 0.5 }));
      S.cam.y = kf(t, [[0, -30], [2, -30], [2.3, -30], [3, -40], [4, -50], [5, -40], [5.3, -40], [7, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [2, 1.02], [2.3, 0.98], [3, 1.0], [5, 1.0], [5.5, 1.06], [7, 1.08]]);
    };
  },
};
