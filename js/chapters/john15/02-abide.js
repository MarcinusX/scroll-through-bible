// J 15,3–4 — "You are already clean because of the word": His words flow out from Him like a stream of little lit
// word-slips, weaving between the eleven; the grey dust of the road falls from them and they shine. "Abide in Me, and
// I in you": golden sap runs along the vine into every branch, a thread of light comes down from each branch to a
// little heart-light in each disciple. "As the branch cannot bear fruit by itself": the one spare branch at the end
// of the vine comes loose — its sap runs out, its grapes shrink away, it greys. "Neither can you, unless you abide in
// Me": a picture hangs down — a small figure walks away from the vine into the dark with an empty hand and a lamp
// that goes out.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, vineBranch, branchRig, threads, heartLight, framed, vineStock, bunch, person, sparkle,
  vis, kf, pose, lerp, blinkAt, fade, mix, shade, sheet, C, P, PI, headOf,
} from './lib.js';

export default {
  id: 'j15-abide',
  beats: [
    { v: 3 },
    { v: 4, text: 'Wytrwajcie we Mnie, a Ja [będę trwał] w was.' },
    { v: 4, cont: true, text: 'Podobnie jak latorośl nie może przynosić owocu sama z siebie - jeśli nie trwa w winnym krzewie -' },
    { v: 4, cont: true, text: 'tak samo i wy, jeżeli we Mnie trwać nie będziecie.' },
  ],
  cam: { x: [-80, 80], y: [-140, 60], z: [0.98, 1.34] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { beadsN: 2 });
    const { vine, ms, jesus, JX, JY } = tb;
    // the spare branch at the right end of the vine
    const [ssx, ssy] = vine.armAt(1, 880);
    const spare = branchRig(tb.vineL.add(vineBranch(c, 190, -125, { leaves: 5, w: 9 })));
    const snap = tb.beadL.add(`<g>${sparkle(c, 16)}</g>`);
    const spot = tb.glowL.add(`<g><circle r="190" fill="url(#halo-glow)" opacity=".7"/></g>`);
    // v3 — the word-stream and the dust of the road
    const fx = S.layer({ par: P, sh: 3 });
    const STREAMS = [
      [[792, 548], [730, 600], [660, 574], [600, 612], [540, 580], [470, 610], [400, 586]],
      [[812, 548], [872, 600], [940, 574], [1000, 612], [1060, 580], [1130, 610], [1200, 586]],
    ];
    const slips = [];
    STREAMS.forEach((pts, si) => { for (let i = 0; i < 9; i++) slips.push({ pts, si, i, el: fx.add(`<g><circle r="16" fill="url(#warm-glow)" opacity=".7"/>${sheet().p(c.cut([[-12, -5], [12, -6], [13, 5], [-12, 6]], 0.4, 5), C.cream).x(c.ribbon([[-8, 0], [-1, 0]], 1.4) + c.ribbon([[2, 0], [8, 0]], 1.4), C.inkSoft, 'opacity=".5"').out()}</g>`) }); });
    const dust = ms.map((m) => {
      let d = '';
      for (let i = 0; i < 7; i++) d += c.cut(c.blob(c.rr(-26, 26), c.rr(-150, -30), c.rr(3, 6), c.rr(2.5, 4.5), 7, 0.3), 0.3, 2);
      return fx.add(`<g><path d="${d}" fill="${mix(C.rock3, C.stone2, 0.3)}" opacity=".85"/></g>`);
    });
    const sparks = ms.map(() => fx.add(`<g>${sparkle(c, 14)}</g>`));
    // v4a — threads from each branch to a heart-light in each disciple
    const thL = S.layer({ par: P, sh: 0, flat: true });
    const th = threads(thL, ms.length, { color: C.halo, w: 1.6 });
    const hearts = ms.map(() => thL.add(`<g>${heartLight(c, 9)}</g>`));
    // v4c — the picture of one who walks away from the vine
    const PW = 420, PH = 220;
    const plateL = S.layer({ par: 0.2, sh: 6 });
    const inner = `<rect x="0" y="0" width="${PW}" height="${PH}" fill="${mix(C.night, C.indigo, 0.4)}"/>`
      + `<circle cx="80" cy="${PH - 70}" r="110" fill="url(#halo-glow)" opacity=".8"/>`
      + `<path d="${c.cut([[0, PH - 26], [PW, PH - 30], [PW, PH], [0, PH]], 0.8, 10)}" fill="${mix(C.hillNear, C.indigo, 0.5)}"/>`
      + `<g transform="translate(80 ${PH - 24}) scale(1.3)">${vineStock(c, 96)}</g>`
      + `<g transform="translate(60 ${PH - 128})">${bunch(c, 4, mix(C.plumRobe, C.mauve, 0.25))}</g><g transform="translate(104 ${PH - 122})">${bunch(c, 3.6, mix(C.plumRobe, C.mauve, 0.25))}</g>`
      + `<rect data-k="dark" x="${PW * 0.45}" y="0" width="${PW * 0.55}" height="${PH}" fill="#11142c" opacity=".55"/>`
      + `<g data-k="wander">${person(c, { robe: C.stone2, mantle: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, holdB: `<g class="lampU" transform="rotate(58)"><path d="${c.cut([[-8, 8], [8, 8], [10, 28], [-10, 28]], 0.3, 4)}" fill="${C.wood2}"/><path data-k="wflame" d="${c.poly([[0, 13], [3, 21], [0, 24], [-3, 21]])}" fill="${C.lampFlame}"/></g>` })}</g>`;
    const plate = plateL.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, bg: C.night })}</g>`);
    const wander = S.puppet(plate.querySelector('[data-k="wander"]').firstElementChild);
    const wflame = plate.querySelector('[data-k="wflame"]');
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.update(T);
      /* v3 — the word flows out and washes the dust away */
      const flow = es(t, 0.08, 0.75);
      slips.forEach((sl) => {
        const u = ((T ? T * 0.12 : 0) + sl.i / 9) % 1;
        const vis_ = u < flow ? 1 : 0;
        const on = vis_ * (1 - es(t, 0.9, 1.05)) * Math.min(1, (flow - u) * 6) * Math.sin(Math.min(1, u * 1.1) * PI * 0.5 + 0.2);
        const idx = u * (sl.pts.length - 1), i0 = Math.floor(idx), f = idx - i0, a = sl.pts[i0], b = sl.pts[Math.min(sl.pts.length - 1, i0 + 1)];
        vis(sl.el, { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f + Math.sin(u * 20 + sl.i) * 4, r: Math.sin(u * 12 + sl.i) * 14, o: on });
      });
      ms.forEach((m, i) => {
        const reach = Math.abs(m.x - JX) / 420;      // the stream reaches each disciple in turn
        const wash = es(t, 0.1 + reach * 0.62, 0.3 + reach * 0.62);
        vis(dust[i], { x: m.x, y: m.y + wash * 60, s: m.s, o: (1 - wash) * (1 - es(t, 0.9, 1)) });
        const [hx, hy] = headOf(m);
        vis(sparks[i], { x: hx + 16, y: hy - 18, s: 0.6 + bump(t, 0.2 + reach * 0.62, 0.8 + reach * 0.4) * 0.6, r: T * 20, o: bump(t, 0.2 + reach * 0.62, 1.0) });
        /* v4a — thread from the branch tip to the heart */
        const k = es(t, 1.2 + i * 0.03, 1.5 + i * 0.03) * (1 - es(t, 3.0, 3.2) * 0.6);
        const b = vine.branches[i];
        const hy2 = m.y - 104 * m.s;
        th(i, b.tip[0], b.tip[1] + 30, m.x + (m.flip ? -4 : 4) * m.s, hy2, k * 0.8);
        vis(hearts[i], { x: m.x + (m.flip ? -4 : 4) * m.s, y: hy2, s: 0.7 + es(t, 1.3 + i * 0.03, 1.6 + i * 0.03, ease.back) * 0.4, o: k });
        const look = es(t, 3.05, 3.3);
        placeM(m, T, { head: -look * 14 - bump(t, 2.1, 2.9) * (m.x > 900 ? 8 : 0), armF: bump(t, 1.3, 1.95) * 28 });
      });
      lampsAll(ms, 0.7 + es(t, 0.2, 0.9) * 0.3);
      jesus.set({ x: JX, y: JY, s: 1.05, armF: bump(t, 0.05, 0.9) * 70 + bump(t, 1.05, 1.9) * 40 + bump(t, 3.1, 3.9) * 30, armB: bump(t, 1.05, 1.95) * 100 + bump(t, 2.1, 2.9) * 110, head: -bump(t, 3.1, 3.9) * 10, blink: blinkAt(T, 1) });
      /* the vine — full, ripe; sap flows through it in v4a */
      const sap = es(t, 1.05, 1.5);
      vine.set({ grow: 1, sap: 0.35 + sap * 0.65, fruit: 1.05, ripe: 1, glow: 0.7 + bump(t, 1.1, 2) * 0.3, T });
      tb.beads(T, es(t, 1.3, 1.5) * (1 - es(t, 2.9, 3.1)), (r) => (r === spare ? 0 : 1));
      /* v4b — the spare branch comes loose and withers */
      const off = es(t, 2.1, 2.45);
      const wither = es(t, 2.35, 2.85);
      vis(snap, { x: ssx + 4, y: ssy - 4, s: 0.6 + bump(t, 2.08, 2.4) * 0.8, o: bump(t, 2.08, 2.4) });
      spare.set({ x: ssx + off * 56, y: ssy + off * 34, r: off * 12, grow: 1, sap: 1 - es(t, 2.12, 2.4), fruit: 1.5 * (1 - es(t, 2.4, 2.8)), ripe: 1, dry: wither });
      vis(spot, { x: ssx + 110, y: ssy - 60, o: bump(t, 1.95, 3.05) });
      /* v4c — the picture */
      const pk = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 3.92, 4.0));
      vis(plate, { x: 800, y: 96 - (1 - pk) * 520 + (T ? Math.sin(T * 0.9) * 2 : 0), o: pk > 0.001 ? 1 : 0 });
      if (pk > 0.001) {
        const w = es(t, 3.15, 3.9);
        wander.set({ x: lerp(150, 360, w), y: PH - 24, s: 0.52, walk: w > 0 && w < 1 ? w * 26 : undefined, armB: 58, head: 4 });
        fade(wflame, 1 - es(t, 3.4, 3.7));
      }
      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 0], [2.2, -30], [2.9, -30], [3.1, 0], [4, 0]]);
      S.cam.y = kf(t, [[0, 30], [1, 10], [2, 0], [2.2, -70], [2.9, -70], [3.1, -70], [4, -70]]);
      S.cam.z = kf(t, [[0, 1.2], [0.9, 1.12], [1.2, 1.02], [2, 1.02], [2.25, 1.14], [2.9, 1.14], [3.1, 1.0], [4, 0.99]]);
    };
  },
};
