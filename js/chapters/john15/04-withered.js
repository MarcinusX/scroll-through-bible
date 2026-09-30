// J 15,6 — told as a shadow-play: a lamp-lit linen screen is set up over the eleven, and on it the vine in silhouette.
// "Whoever does not abide in Me is thrown out like a branch": one branch is cut off and flung away onto the bare
// ground. "And withers": sun and moon cross the screen, its leaves drop one by one, it curls. "They gather them,
// throw them into the fire, and they burn": a labourer's shadow comes, gathers the dry twigs into a bundle and
// throws them on a small fire at the edge of the field; a few sparks go up. (Kept small and quiet.)
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, screenFrame, shadowPerson, vineStock, vineLeaf, bunch, fireFlames, vis, kf, pose, lerp, blinkAt, fade, mix, shade, sheet, C, PI,
} from './lib.js';

const INK = '#2b2233';

export default {
  id: 'j15-withered',
  beats: [
    { v: 6, text: 'Ten, kto we Mnie nie trwa, zostanie wyrzucony jak winna latorośl' },
    { v: 6, cont: true, text: 'i uschnie.' },
    { v: 6, cont: true, text: 'I zbiera się ją, i wrzuca do ognia, i płonie.' },
  ],
  cam: { x: [-40, 40], y: [-100, 40], z: [0.98, 1.3] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { vine: false });
    const { ms, jesus, JX, JY } = tb;
    const L = tb.vineL;
    const SX = 800, SY = 486, W = 620, H = 290;
    const F = screenFrame(S, { w: W, h: H, k: 'shadow' });
    const top = SY + F.top, bot = SY - 30, GND = bot - 18;
    L.add(`<g transform="translate(${SX} ${SY})"><circle cy="${F.top + H / 2}" r="${W * 0.62}" fill="url(#warm-glow)" opacity=".35"/>${F.frame}${F.face}</g>`);
    // everything drawn on the screen is clipped to its face (in world coords)
    const cid = S.id('scr-clip');
    S.defs(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="${SX - W / 2}" y="${top}" width="${W}" height="${H}"/></clipPath>`);
    const onScreen = (inner) => { const g = L.add(`<g clip-path="url(#${cid})"><g>${inner}</g></g>`); return g.firstElementChild; };
    // the field on the screen: ground, the vine on its trellis (all in one shadow colour)
    const VX = SX - 190, WY = top + 118;
    let sv = `<path d="${c.ribbon(c.cbez([VX, GND + 2], [VX - 14, GND - 60], [VX + 12, WY + 50], [VX, WY], 14), (u) => 13 - u * 6)}"/>`;
    sv += `<path d="${c.ribbon([[SX - W / 2 - 10, WY - 2], [SX - 20, WY + 2]], 2)}"/><path d="${c.ribbon([[SX - 290, WY - 6], [SX - 290, GND]], 5) + c.ribbon([[SX - 90, WY - 6], [SX - 90, GND]], 5)}"/>`;
    sv += `<path d="${c.ribbon(c.cbez([VX, WY], [VX - 40, WY - 16], [VX - 70, WY + 4], [VX - 110, WY], 10), (u) => 8 - u * 4) + c.ribbon(c.cbez([VX, WY], [VX + 40, WY - 16], [VX + 80, WY + 4], [VX + 120, WY], 10), (u) => 8 - u * 4)}"/>`;
    for (let i = 0; i < 11; i++) { const x = VX - 110 + i * 22 + c.rr(-5, 5), y = WY - 12 + c.rr(-10, 8); sv += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${vineLeaf(c, c.rr(13, 17))}</g>`; }
    [[VX - 80, WY + 6], [VX - 24, WY + 8], [VX + 56, WY + 6]].forEach(([x, y]) => { sv += `<g transform="translate(${x} ${y})">${bunch(c, 4.4)}</g>`; });
    const silVine = `<g fill="${INK}">${sv.replace(/fill="[^"]*"/g, '').replace(/class="grain"/g, 'class="grain" opacity="0"').replace(/opacity="\.[0-9]+"/g, '')}</g>`;
    onScreen(`<path d="${c.cut([[SX - W / 2 - 10, GND], [SX + W / 2 + 10, GND - 4], [SX + W / 2 + 10, bot + 10], [SX - W / 2 - 10, bot + 10]], 0.8, 10)}" fill="${INK}"/>`
      + silVine);
    const sun = onScreen(`<circle r="18" fill="${mix(C.sunDeep, C.lampGlow, 0.3)}"/><circle r="30" fill="${C.sun}" opacity=".3"/>`);
    const moonS = onScreen(`<circle r="14" fill="${C.cream}"/><circle cx="6" cy="-4" r="12" fill="${mix(C.lampGlow, C.cream, 0.45)}"/>`);
    // the branch that is cut off and flung away; its leaves drop one by one
    const bpts = c.cbez([0, 0], [30, -18], [70, -10], [110, 4], 12);
    let leaves = '';
    [[26, -16], [52, -14], [78, -6], [96, 2], [40, -4]].forEach(([x, y], i) => { leaves += `<g class="lf" data-i="${i}" transform="translate(${x} ${y})"><path d="${c.cut(c.star(0, -8, 11, 7, 5, c.rr(0, 6)), 0.3, 3)}" fill="${INK}"/></g>`; });
    const branch = onScreen(`<path d="${c.ribbon(bpts, (u) => 6 - u * 3)}" fill="${INK}"/>${leaves}<g class="fr" transform="translate(104 6)"><path d="${c.cut(c.blob(0, 12, 9, 13, 10, 0.2), 0.3, 3)}" fill="${INK}"/></g>`);
    const lfs = Array.from(branch.querySelectorAll('.lf')).map((el, i) => ({ el, i, x: +el.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)/)[1], y: +el.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)/)[2] }));
    const fruitEl = branch.querySelector('.fr');
    // other dry twigs already lying there, and the labourer
    const twigs = [0, 1, 2].map((i) => onScreen(`<path d="${c.ribbon(c.cbez([0, 0], [20, -6], [50, -4], [80 - i * 10, 2], 8), 3)}" fill="${INK}"/><path d="${c.ribbon([[30, -3], [40, -14]], 1.6)}" fill="${INK}"/>`));
    const worker = S.puppet(onScreen(shadowPerson(c, { robe: C.stone, hairStyle: 'wrap', veil: C.stone, beard: 'short', belt: C.leather }, INK)).firstElementChild);
    const bundle = onScreen(`${[0, 1, 2, 3].map((i) => `<path d="${c.ribbon([[-40, -i * 4], [40, -i * 4 + c.rr(-3, 3)]], 3)}" fill="${INK}"/>`).join('')}<path d="${c.ribbon([[-4, -14], [-4, 4]], 3) + c.ribbon([[8, -14], [8, 4]], 3)}" fill="${INK}"/>`);
    // the little fire at the edge of the field (coloured paper flames, like cellophane on a shadow screen)
    const FX = SX + 230;
    onScreen(`<g transform="translate(${FX} ${GND + 2})">${[-1, 0, 1].map((i) => `<path d="${c.cut(c.blob(i * 16, -4, 10, 6, 7, 0.2), 0.3, 3)}" fill="${INK}"/>`).join('')}</g>`);
    const fire = onScreen(`<circle cy="-30" r="70" fill="url(#warm-glow)" opacity=".9"/>${fireFlames(c, 60)}`);
    const tongues = Array.from(fire.querySelectorAll('.tongue'));
    const sparks = [0, 1, 2, 3, 4].map((i) => onScreen(`<circle r="2.4" fill="${C.lampFlame}"/>`));
    tb.set.front();

    const land = [SX + 70, GND - 4];
    return (t, time) => {
      const T = time;
      tb.set.update(T);
      jesus.set({ x: JX, y: JY, s: 1.05, armB: bump(t, 0.05, 0.9) * 120, armF: bump(t, 0.1, 0.9) * 50 + bump(t, 2.1, 2.9) * 30, head: -es(t, 0, 0.3) * 8 * (1 - es(t, 2.9, 3)), blink: blinkAt(T, 1) });
      ms.forEach((m) => placeM(m, T, { head: -12 - bump(t, 2.2, 2.9) * 4 }));
      lampsAll(ms, 0.7);
      /* v6a — cut off and thrown out */
      const fly = es(t, 0.3, 0.75, ease.io);
      const start = [VX + 118, WY - 4];
      const bx = lerp(start[0], land[0], fly), by = lerp(start[1], land[1], fly) - Math.sin(fly * PI) * 90;
      /* v6b — withering: days pass (sun, moon), the leaves drop, the branch curls */
      const days = seg(t, 1.05, 1.85);
      const wz = es(t, 1.1, 1.8);
      /* v6c — gathered into a bundle, thrown on the fire */
      const walkIn = es(t, 2.02, 2.3), carry = es(t, 2.38, 2.62), throwK = es(t, 2.62, 2.72);
      const gathered = es(t, 2.3, 2.38);
      vis(branch, { x: bx, y: by, r: lerp(-30, 170, fly) + wz * 14, s: 1.45 - wz * 0.1, o: (1 - gathered) });
      lfs.forEach((l) => {
        const d = es(t, 1.15 + l.i * 0.12, 1.4 + l.i * 0.12, ease.in);
        pose(l.el, { x: l.x + d * (8 + l.i * 3), y: l.y + d * 40, r: d * 120 * (l.i % 2 ? 1 : -1), o: 1 - d });
      });
      pose(fruitEl, { x: 104, y: 6, s: 1 - es(t, 1.1, 1.5), o: 1 - es(t, 1.1, 1.5) });
      const sa = days * PI;
      vis(sun, { x: SX - W / 2 + days * W * 1.8, y: top + 70 - Math.sin(Math.min(1, days * 2) * PI) * 40, o: days > 0 && days < 0.55 ? 1 : 0 });
      vis(moonS, { x: SX - W / 2 + (days - 0.5) * W * 2, y: top + 60 - Math.sin(Math.max(0, days * 2 - 1) * PI) * 30, o: days > 0.5 && days < 1 ? 1 : 0 });
      twigs.forEach((tw, i) => vis(tw, { x: SX + 110 + i * 22, y: GND - 2 - i * 3, r: i * 6 - 4, o: (1 - gathered) }));
      // the labourer walks in, stoops, lifts the bundle, carries it to the fire, throws it
      const wx = lerp(SX + W / 2 + 60, SX + 120, walkIn) + carry * (FX - 60 - SX - 120);
      worker.set({ x: wx, y: GND + 2, s: 0.55, flip: true, walk: (walkIn > 0 && walkIn < 1) || (carry > 0 && carry < 1) ? T * 9 + t * 30 : undefined, lean: bump(t, 2.28, 2.42) * 22 - throwK * 10, armF: 20 + bump(t, 2.28, 2.42) * 20 + gathered * 50 + throwK * 60 * (1 - es(t, 2.8, 2.9)), armB: gathered * 40 });
      vis(bundle, { x: wx - 34, y: GND - 50 - throwK * 30 + es(t, 2.72, 2.8) * 40, r: -8 + throwK * 20, s: 0.9, o: gathered * (1 - es(t, 2.74, 2.82)) });
      // the fire takes it
      const burn = es(t, 2.7, 2.85) * (1 - es(t, 2.98, 3.0) * 0.4);
      vis(fire, { x: FX, y: GND + 2, s: 0.35 + burn * 0.5, o: 0.45 + burn * 0.55 });
      tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i] * 0.5, y: -16, sy: 0.8 + (T ? Math.sin(T * 7 + i * 1.7) * 0.18 : 0) + burn * 0.2 }));
      sparks.forEach((sp, i) => {
        const u = T ? ((T * 0.5 + i / 5) % 1) : i / 5;
        vis(sp, { x: FX + Math.sin(u * 6 + i) * 12, y: GND - 40 - u * 110 * (0.5 + burn * 0.5), o: (1 - u) * (0.3 + burn * 0.7) });
      });
      S.cam.y = kf(t, [[0, -40], [1, -60], [2, -60], [3, -50]]);
      // phone: no zoom, so the whole shadow screen with its frame stays inside the picture
      S.cam.z = S.portrait ? 1.0 : kf(t, [[0, 1.06], [0.6, 1.16], [1.5, 1.2], [2.2, 1.18], [3, 1.14]]);
    };
  },
};
