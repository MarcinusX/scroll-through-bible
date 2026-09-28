// Mt 1,11–12 — the exile to Babylon. Josiah's son Jechoniah blooms, crowned, with his brothers; then the crown
// falls from him, the vine is cut off above him, and along the river a line of captives walks in chains towards
// the ziggurat of Babylon, where the harps hang on the willows. After the exile a green shoot springs from the
// stump: Shealtiel; and with the dawn Zerubbabel, who laid the Temple's stones again.
import { C, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import {
  DUSK, NIGHT, DAWN, RIM, ICON, medal, lineage, elder, crown, ziggurat, willow, captives, vineLink, glowDisc, sparkle, kf,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const JX = 700, JY = 470, JR = 46;           // Jechoniah

export default {
  id: 'mt1-exile',
  beats: [
    { v: 11 },
    { v: 12, text: 'Po przesiedleniu babilońskim Jechoniasz był ojcem Salatiela;' },
    { v: 12, cont: true, text: 'Salatiel ojcem Zorobabela;' },
  ],
  cam: { x: [-20, 20], y: [-160, 20], z: [1, 1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 420, n: 150 }));
    starL.fade(0);

    /* ---------- far: Jerusalem left behind in smoke; Babylon ahead ---------- */
    const far = S.layer({ par: 0.05, sh: 2 });
    far.add(sheet().p(c.ridge(c.wave(560, [10, 5, 2], [900, 320, 120]), -1200, 2800, 1900, 12, 1), mix(C.dune, C.duskViolet, 0.4)).out());
    far.add(`<g transform="translate(1180 566)">${ziggurat(c, 300, 190)}</g>`);
    const jer = S.layer({ par: 0.05, sh: 2 });
    let smoke = '';
    for (let i = 0; i < 5; i++) smoke += c.cut(c.blob(300 + i * 26, 470 - i * 46, 50 + i * 12, 26 + i * 6, 12, 0.2), 1, 6);
    const js = sheet();
    const wp = [[170, 566], [170, 520]];
    for (let x = 170; x < 450; x += 18) wp.push([x, 520], [x, 511], [x + 9, 511], [x + 9, 520]);
    wp.push([450, 520], [450, 566]);
    js.p(c.cut(wp, 0.4, 6), mix(C.stone2, C.duskViolet, 0.35));
    js.x(smoke, mix(C.storm, C.stone2, 0.4), 'opacity=".55"');
    jer.add(js.out());
    // Zerubbabel's new Temple: its stones laid again, at the far left at dawn
    const stonesL = S.layer({ par: 0.05, sh: 3 });
    const blocks = [[-50, 0], [0, 0], [50, 0], [-25, -30], [25, -30], [0, -60]].map(([x, y], i) => ({ x: 310 + x, y: 548 + y, i, el: stonesL.add(`<g>${sheet().p(c.cut(c.rect(-24, -28, 48, 30), 0.4, 5), mix(C.stone, C.cream, 0.3)).out()}</g>`) }));

    /* ---------- the rivers of Babylon, the willows with the harps ---------- */
    const river = S.layer({ par: 0.16, sh: 2 });
    river.add(sheet().p(c.ridge(c.wave(610, [3, 1.2], [140, 52]), -1200, 2800, 1900, 10, 0.6), mix(C.lake, C.duskViolet, 0.25)).out());
    const bank = S.layer({ par: 0.2, sh: 3 });
    bank.add(`<g transform="translate(360 650)">${willow(c, 230, { harpAt: [-44, -118] })}</g><g transform="translate(1260 654)">${willow(c, 250, { harpAt: [50, -130] })}</g>`);
    bank.add(sheet().p(c.ridge(c.wave(660, [5, 2], [500, 150]), -1200, 2800, 1900, 12, 1), mix(C.sand2, C.duskViolet, 0.2)).out());
    const walk = S.layer({ par: 0.2, sh: 4 });
    const line1 = walk.sprite(captives(c, 7, 74, 0.62), 0, 700);

    /* ---------- the vine: Josiah, Jechoniah and his brothers; the cut; the shoot ---------- */
    const vineL = S.layer({ par: 0.9, sh: 3 });
    const medL = S.layer({ par: 0.9, sh: 6 });
    const E = RIM.exile;
    const nodes = [
      { key: 'josiah', x: 500, y: 612, r: 42, at: -1, markup: medal(S, elder(c, { robe: C.linen, mantle: C.terracotta }), { r: 42, ...RIM.king, king: true, name: tr('Jozjasz', 'Josiah'), icon: ICON.scroll(c) }) },
      { key: 'jechoniah', parent: 'josiah', x: JX, y: JY, r: JR, at: 0.26, markup: medal(S, elder(c, { robe: C.dustyBlue, mantle: C.plumRobe, beard: 'short' }), { r: JR, ...RIM.king, name: tr('Jechoniasz', 'Jechoniah'), icon: ICON.chain(c) }) },
      { key: 'b1', parent: 'jechoniah', x: 880, y: 520, r: 26, at: 0.38, grow: 0.14, markup: medal(S, elder(c), { r: 26, ...RIM.king, flip: true }) },
      { key: 'b2', parent: 'b1', x: 960, y: 440, r: 26, at: 0.44, grow: 0.12, markup: medal(S, elder(c), { r: 26, ...RIM.king, flip: true }) },
      { key: 'b3', parent: 'b2', x: 1040, y: 370, r: 26, at: 0.5, grow: 0.12, markup: medal(S, elder(c), { r: 26, ...RIM.king, flip: true }) },
      { key: 'shealtiel', parent: 'jechoniah', x: 590, y: 300, r: 40, at: 1.4, grow: 0.36, vine: { col: C.leaf, w: 7 }, markup: medal(S, elder(c, { robe: C.skyVeil, hairStyle: 'wrap', veil: C.stone }), { r: 40, ...E, name: tr('Salatiel', 'Shealtiel') }) },
      { key: 'zerubbabel', parent: 'shealtiel', x: 830, y: 190, r: 44, at: 2.4, markup: medal(S, elder(c, { robe: C.wheatRobe, mantle: C.sageRobe }), { r: 44, ...RIM.patriarch, flip: true, name: tr('Zorobabel', 'Zerubbabel'), icon: ICON.stones(c) }) },
    ];
    const line = lineage(S, vineL, medL, nodes);
    // the crown that falls from Jechoniah
    const k = JR / 52;
    const fx = S.layer({ par: 0.9, sh: 6 });
    const crownEl = fx.add(`<g><g transform="scale(${k.toFixed(3)})">${crown(c)}</g></g>`);
    // the vine cut off above him: a stub and falling leaves
    const stub = fx.add(`<g>${vineLink(c, 60, { w: 9, n: 1 })}<path d="${c.poly([[56, -8], [66, -2], [58, 3], [64, 8], [54, 9]])}" fill="${C.soilDark}"/></g>`);
    const leaves = [0, 1, 2, 3].map((i) => fx.add(`<path d="${c.cut(c.ell(0, 0, 10, 4.4, 10, 0.4), 0.3, 3)}" fill="${i % 2 ? C.leaf : C.olive}"/>`));
    // the new shoot's bud of light
    const glowL = S.layer({ par: 0.9, sh: 1, flat: true });
    const bud = glowL.add(`<g>${glowDisc(60, 'halo-glow', 1)}${sparkle(c, 14)}</g>`);

    return (t, time) => {
      line.update(t);
      /* v11: exile — night falls; the crown falls; the vine is cut; the captives walk towards Babylon */
      const night = es(t, 0.4, 0.9) * (1 - es(t, 2.0, 2.5));
      if (t < 2.0) sk.blend(DUSK, NIGHT, night);
      else sk.blend(NIGHT, DAWN, es(t, 2.0, 2.5));
      starL.fade(night * 0.9);
      jer.fade(1 - es(t, 1.1, 1.5));
      const fall = es(t, 0.5, 0.8, ease.in);
      const headY = JY - 0.12 * JR - 2 * k;
      pose(crownEl, { x: JX + 2 * k + fall * 70, y: headY + fall * 260, r: fall * 120, o: t < 0.26 ? 0 : 1 - es(t, 0.74, 0.84) });
      const cut = es(t, 0.56, 0.7);
      pose(stub, { x: JX - 20, y: JY - JR - 4, r: -110, sx: Math.max(0.001, cut), o: cut > 0.001 ? 1 : 0 });
      leaves.forEach((lf, i) => {
        const kk = seg(t, 0.6 + i * 0.04, 1.1 + i * 0.04);
        pose(lf, { x: JX - 40 + i * 14 + Math.sin(kk * 6 + i) * 20, y: JY - JR - 60 + kk * 260, r: kk * 300 + i * 40, o: kk > 0 && kk < 1 ? 1 - kk * 0.6 : 0 });
      });
      const wk = seg(t, 0.15, 1.1);
      line1.set({ x: lerp(-260, 640, wk), y: 700, s: 1, o: t > 0.15 ? 1 - es(t, 1.0, 1.15) : 0 });

      /* v12a: after the exile, a shoot from the stump */
      const bk = bump(t, 1.05, 1.45);
      pose(bud, { x: lerp(JX - 20, 590, seg(t, 1.1, 1.4)), y: lerp(JY - JR, 300, seg(t, 1.1, 1.4)), s: 0.5 + bk * 0.8, o: bk });
      /* v12b: Zerubbabel at dawn — the Temple's stones laid again */
      blocks.forEach((b) => { const kk = es(t, 2.2 + b.i * 0.06, 2.4 + b.i * 0.06, ease.out); pose(b.el, { x: b.x, y: b.y - (1 - kk) * 120, o: kk > 0.001 ? 1 : 0 }); });

      S.cam.y = kf(t, [[1.9, 0], [2.4, -120]]);
    };
  },
};
