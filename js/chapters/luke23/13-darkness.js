// Łk 23,44–45a — Golgotha from afar under the hour-dial (Mark 15's). About the sixth hour the sky sinks into
// darkness over the whole land; the sun creeps along the dial from the sixth hour to the ninth while everything
// goes dark. Then the sun itself fails: a dark disc slides across it and only its thin rim remains. Only the faint
// ring of light on the far cross still glows.
import { C, pose, lerp } from '../kit.js';
import { es, bump, fade } from '../../core/anim.js';
import { golgothaSet, setCrosses, driftClouds, crossHead, strip, GOL, SKIES, tr } from './lib.js';

export default {
  id: 'lk23-darkness',
  beats: [
    { v: 44 },
    { v: 45, text: 'Słońce się zaćmiło' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { dial: true, dark: true });
    const behind = S.layer({ par: 0.16, sh: 1, flat: true });
    G.hillL.el.parentNode.insertBefore(behind.el, G.hillL.el);
    const [chx, chy] = crossHead(GOL.H);
    const HX = GOL.x + chx, HY = GOL.top + chy;
    const glow = behind.add(`<g><circle r="80" fill="url(#halo-glow)"/></g>`);
    const tags = [tr('godzina szósta', 'the sixth hour'), tr('godzina dziewiąta', 'the ninth hour')].map((l) => G.hangL.add(`<g>${strip(c, l, { size: 15 })}</g>`));

    return (t, time) => {
      const T = time;
      const dark = es(t, 0.15, 0.85);
      G.sk.blend(SKIES.grey, SKIES.dark, dark);
      G.darkSky.layer.fade(dark * 0.85);
      G.fg.fade(1 - dark * 0.85);
      G.starL.fade(dark * 0.3);
      driftClouds(G, T);
      setCrosses(G, 1, 1, 1);
      const hr = lerp(6, 9, es(t, 0.3, 0.95));
      const [sxp, syp] = G.dial.at(hr);
      pose(G.sunEl, { x: sxp, y: syp + 22 });
      pose(G.dial.el, { o: 1 - dark * 0.45 });
      [6, 7, 8, 9].forEach((h, i) => fade(G.dial.el.querySelector(`[data-k="hr${h}"]`), 0.6 + Math.min(1, bump(t, 0.2 + i * 0.2, 0.6 + i * 0.2) + (h === 9 ? es(t, 0.85, 1) : 0)) * 0.4));
      [[6, 0.05, 0.55], [9, 0.75, 1.9]].forEach(([h, a, b], i) => {
        const [x, y] = G.dial.at(h);
        const k = es(t, a, a + 0.2) * (1 - es(t, b, b + 0.1));
        pose(tags[i], { x, y: y - 96, s: k, o: k > 0.02 ? 1 : 0 });
      });
      /* v45a — the sun fails */
      const cover = es(t, 1.05, 1.6);
      pose(G.disc, { x: lerp(sxp + 200, sxp, cover), y: syp + 22 - (1 - cover) * 20, o: cover > 0.01 ? 1 : 0 });
      G.dim.fade(dark * 0.55 + cover * 0.12);
      pose(glow, { x: HX, y: HY + 10, s: 1, o: 0.35 + dark * 0.3 });
      S.cam.z = 1.02 + es(t, 0.9, 1.6) * 0.06;
      S.cam.y = -10 - es(t, 0.9, 1.6) * 30;
    };
  },
};
