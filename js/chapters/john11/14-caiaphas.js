// J 11,49–53 — Caiaphas, high priest that year, rises behind the table: "You know nothing at all" — his name comes
// down on a tag and the others lean back. "It is better for you that one man should die for the people": a balance
// comes down from the flies — one small figure on one pan, a whole little nation on the other — and the beam tips
// (dark, weighty, quiet). "He did not say this of himself… he prophesied that Jesus would die for the nation": a gold
// light falls on the balance and the one figure becomes the Lord's haloed portrait, the light spilling onto the
// nation. "And not for the nation only, but to gather into one the scattered children of God": the room goes dark and
// small lights appear everywhere, drift, and gather into one bright light. "From that day they planned to kill Him":
// the lights are gone, the shadows on the wall grow tall, and a seal comes down on a scroll.
import { C, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { balanceRig } from '../john5/lib.js';
import { scrollOpen } from '../mark2/lib.js';
import { shadowPerson } from '../mark3/lib.js';
import {
  councilSet, peopleIcon, medallion, nameTag, wordTag, seal, spark, hang2, radiance, vis, kf, pose, attr, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

export default {
  id: 'j11-caiaphas',
  beats: [
    { v: 49 },
    { v: 50 },
    { v: 51 },
    { v: 52 },
    { v: 53 },
  ],
  cam: { x: [-40, 40], y: [-90, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const K = councilSet(S, { skyCols: ['#343a6e', '#6d5f8a', '#b88592'] });
    const { R, FLOOR, TOP } = K;
    const onTable = K.tabL.add(`<g transform="translate(930 ${TOP - 6}) rotate(-3) scale(.55)">${scrollOpen(c, 90, 44)}</g>`);
    void onTable;
    const dark = S.layer({ par: 0.58, sh: 0, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".62"/>`);
    const X = S.layer({ par: 0.6, sh: 6 });
    const tag = X.add(`<g>${hang2(nameTag(c, [tr('Kajfasz', 'Caiaphas'), tr('arcykapłan owego roku', 'high priest that year')], { size: 16 }), 30, 300)}</g>`);
    const bal = balanceRig(S, X, 150);
    const one = X.add(`<g>${shadowPerson(c, { hairStyle: 'short', beard: 'full' }, mix(C.inkSoft, C.plumRobe, 0.2)).replace('<g class="fig"', '<g class="fig" transform="scale(.3)"')}</g>`);
    const oneLit = X.add(`<g><circle r="60" fill="url(#halo-glow)"/>${medallion(c, CAST.jesus, { r: 24, rim: C.haloRim, back: C.halo })}</g>`);
    const many = X.add(`<g>${peopleIcon(c, 10, mix(C.plumRobe, C.ink, 0.3), 100)}</g>`);
    const beam = X.add(`<g><path d="${c.poly([[-18, 0], [18, 0], [80, 330], [-80, 330]])}" fill="${C.lampGlow}" opacity=".35"/></g>`);
    const proph = X.add(`<g>${hang2(wordTag(c, tr('proroctwo', 'a prophecy'), { size: 20 }), 0.01, 300)}</g>`);
    // the scattered children of God: little lights all over, gathering into one
    const N = 22;
    const lights = Array.from({ length: N }, (_, i) => ({ i, x0: c.rr(430, 1170), y0: c.rr(170, 640), ph: c.rr(0, 6), el: X.add(`<g>${spark(c, 8)}</g>`) }));
    const oneLight = X.add(`<g><circle r="160" fill="url(#halo-glow)"/>${radiance(c, 40)}</g>`);
    const sealEl = X.add(`<g>${seal(c, 22)}</g>`);

    return (t, time) => {
      const T = time;
      R.stars.fade(0.8);
      R.crowd.fade(0);
      const gloom = es(t, 4.05, 4.5);
      K.idle(T, 0.9 - gloom * 0.5);

      /* v49 — Caiaphas speaks; the others draw back */
      const rise = es(t, 0.1, 0.4);
      const point = es(t, 0.45, 0.7) * (1 - es(t, 1.9, 2.1));
      K.cast.forEach((m) => {
        let armF = 12, armB = 6, head = 0, lean = 0;
        const back = rise * (1 - es(t, 2.9, 3.2));
        if (m.k === 'hp') { armF = 20 + point * 70 + es(t, 2.0, 2.3) * (1 - es(t, 2.9, 3.1)) * 40 + gloom * 20; armB = 10 + es(t, 4.4, 4.6) * 100; head = -rise * 4; }
        else { lean = (m.x < 800 ? -1 : 1) * back * 5; head = back * 8 - es(t, 3.05, 3.4) * (1 - gloom) * 12; armF = 10 + gloom * 30; }
        K.pose(m, { armF, armB, head, lean, blink: blinkAt(T, m.seed) }, gloom * 0.55);
      });
      const tk = es(t, 0.2, 0.5, ease.back) * (1 - es(t, 0.95, 1.15));
      vis(tag, { x: 820, y: 330 - (1 - tk) * 420, r: Math.sin(T * 0.8) * 1.4, o: tk > 0.01 ? 1 : 0 });

      /* v50 — one man, for the people */
      const bk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      const tilt = es(t, 1.45, 1.85) * 14;
      const by = 250 - (1 - bk) * 520;
      const [[lx, ly], [rx, ry]] = bal.set(800, by, tilt, bk > 0.01 ? 1 : 0);
      const lit = es(t, 2.2, 2.5);
      vis(one, { x: lx, y: ly + 86, o: bk > 0.01 ? 1 - lit : 0 });
      vis(oneLit, { x: lx, y: ly + 60, s: lit, o: bk > 0.01 && lit > 0.01 ? 1 : 0 });
      vis(many, { x: rx, y: ry + 66, s: 0.7, o: bk > 0.01 ? 1 : 0 });

      /* v51 — a prophecy: gold light, the one becomes the Lord, light on the nation */
      const gk = es(t, 2.05, 2.35) * (1 - es(t, 2.95, 3.15));
      vis(beam, { x: lx, y: 0, o: gk });
      const pk = es(t, 2.1, 2.4, ease.back) * (1 - es(t, 2.95, 3.1));
      vis(proph, { x: 800, y: 200 - (1 - pk) * 420, r: Math.sin(T * 0.8) * 1.4, o: pk > 0.01 ? 1 : 0 });

      /* v52 — the scattered gathered into one */
      const dk = es(t, 3.0, 3.3) * (1 - es(t, 4.05, 4.3) * 0.5);
      dark.fade(dk);
      const gather = es(t, 3.35, 3.85, ease.io);
      const fadeAll = 1 - es(t, 4.05, 4.3);
      lights.forEach((l) => {
        const k = es(t, 3.0 + l.i * 0.012, 3.2 + l.i * 0.012);
        const wob = Math.sin(T * 1.3 + l.ph) * 10 * (1 - gather);
        vis(l.el, { x: lerp(l.x0 + wob, 800, gather), y: lerp(l.y0 + Math.cos(T + l.ph) * 8 * (1 - gather), 330, gather), s: 0.8 + Math.sin(T * 3 + l.ph) * 0.1, o: k * fadeAll * (1 - es(t, 3.8, 3.95) * 0.8) });
      });
      const ol = es(t, 3.75, 3.95) * fadeAll;
      vis(oneLight, { x: 800, y: 330, s: 0.8 + ol * 0.4, r: T * 3, o: ol });

      /* v53 — they decide to kill Him: the seal */
      const sk = es(t, 4.35, 4.6, ease.in);
      vis(sealEl, { x: 935, y: lerp(TOP - 200, TOP - 12, sk), s: 0.7 + (1 - sk) * 0.4, r: -8, o: sk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 10], [1, 0], [2, 0], [3, 0], [4, 0], [5, 30]]);
      S.cam.y = kf(t, [[0, -20], [1, -70], [2, -60], [3, -40], [4, 0], [5, 10]]);
      S.cam.z = S.portrait ? kf(t, [[0, 1.03], [1, 1.02], [3, 1.0], [5, 1.03]]) : kf(t, [[0, 1.06], [1, 1.02], [2, 1.04], [3, 1.0], [4, 1.02], [5, 1.12]]);
    };
  },
};
