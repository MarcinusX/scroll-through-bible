// Mt 27,45–50 — the death of Jesus (Mark 15's darkness, the same cut). From the sixth hour a dark disc slides
// over the sun on the dial and the whole theatre goes dark; the covered sun creeps on to the ninth hour. Only a
// small lamp at the front of the stage and the thin ring of light on the far cross still glow. The cry "Eli, Eli,
// lema sabachthani?" rings out and is written on paper; some of the bystanders (shadows now) say He calls Elijah;
// one runs and lifts a sponge of sour wine on a reed; the rest say "Wait, let us see whether Elijah comes". Then He
// cries out again with a loud voice and yields up His spirit: the lamp goes out, a single breath of light rises
// from the cross, and everything is still.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, man, woman, shadowPerson, spongeReed, jar, strip, taunt, voiceRings, soulLight, wisp, golgothaSet, setCrosses, driftClouds, crossHead, GOL, SKIES, FONT, PI } from './lib.js';

const SIL = '#171320';

/** a paper tag with one or two lines (origin: top centre) */
function paperTag(c, lines, { size = 20, w } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.48 + size * 1.6;
  const hh = lines.length * size * 1.2 + size * 0.8;
  const s = sheet().p(c.cut([[-ww / 2, 0], [ww / 2, -2], [ww / 2 + 2, hh], [-ww / 2 - 1, hh + 1]], 0.5, 6), C.cream);
  const txt = lines.map((l, i) => `<text x="0" y="${(size * 1.05 + i * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${l}</text>`).join('');
  return s.out() + txt;
}

export default {
  id: 'mt27-darkness',
  beats: [
    { v: 45, text: 'Od godziny szóstej mrok ogarnął całą ziemię,' },
    { v: 45, cont: true, text: 'aż do godziny dziewiątej.' },
    { v: 46, text: 'Około godziny dziewiątej Jezus zawołał donośnym głosem: «Eli, Eli, lema sabachthani?»,' },
    { v: 46, cont: true, text: 'to znaczy Boże mój, Boże mój, czemuś Mnie opuścił?' },
    { v: 47 },
    { v: 48 },
    { v: 49 },
    { v: 50, text: 'A Jezus raz jeszcze zawołał donośnym głosem' },
    { v: 50, cont: true, text: 'i wyzionął ducha.' },
  ],
  cam: { x: [-30, 30], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { dial: true, dark: true });
    const [chx, chy] = crossHead(GOL.H);
    const HX = GOL.x + chx, HY = GOL.top + chy;
    const hd = G.crossC.querySelector('.hd'), hl = G.crossC.querySelector('.hl');
    const HDY = GOL.top - GOL.H + 52 * (GOL.H / 240) - 2 * (GOL.H / 240);

    /* bystanders on the slope (shadows in the dark) */
    const P = G.P;
    const by = [[560, 548, false], [612, 530, false], [1030, 540, true]].map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(shadowPerson(c, i === 1 ? woman(c) : man(c), SIL))) }));
    const runner = S.puppet(P.add(shadowPerson(c, man(c, { hairStyle: 'short' }), SIL)));
    const fx = G.fx;
    const reed = fx.add(`<g><path d="${c.ribbon([[0, 0], [2, -160]], 2.4)}" fill="${C.wheat2}"/><path d="${c.cut(c.blob(2, -166, 8, 6, 9, 0.25), 0.4, 3)}" fill="${C.sand2}"/></g>`);
    const jarEl = fx.add(`<g>${jar(c, 30, SIL).replace(/fill="[^"]+"/g, `fill="${SIL}"`)}</g>`);

    /* light: the thin ring on the cross, the lamp at the front of the stage */
    const glow = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`);
    const lamp = fx.add(`<g>${sheet().p(c.cut(c.blob(0, 8, 46, 14, 12, 0.2), 0.8, 6), C.rock2).out()}<g transform="translate(-6 -4)">${oilLamp(c)}</g></g>`);
    const flame = lamp.querySelector('.flame'), lglow = lamp.querySelector('.glow');
    const smoke = fx.add(`<g>${wisp(c, 1.2, '#8c8494')}</g>`);
    const soul = fx.add(`<g>${soulLight(c, 14)}</g>`);
    const rings = voiceRings(fx, c, { n: 3, color: C.halo, r: 30, w: 4 });
    const eloi = fx.add(`<g>${paperTag(c, tr('«Eli, Eli, lema sabachthani?»', '“Eli, Eli, lima sabachthani?”'), { size: 21 })}</g>`);
    const trans = fx.add(`<g>${paperTag(c, tr(['Boże mój, Boże mój,', 'czemuś Mnie opuścił?'], ['My God, my God,', 'why have you forsaken me?']), { size: 19 })}</g>`);
    const elijah = fx.add(`<g>${taunt(c, tr('On Eliasza woła!', 'He is calling Elijah!'), { size: 17 })}</g>`);
    const wait = fx.add(`<g>${taunt(c, tr('Poczekaj! Czy przyjdzie Eliasz?', 'Let him be! Will Elijah come?'), { size: 17, side: -1 })}</g>`);

    return (t, time) => {
      const still = es(t, 8.0, 8.5);
      const T = time;
      const A = 1 - still; // idle motion fades to nothing at His death

      /* v33 — darkness at the sixth hour, until the ninth */
      const cover = es(t, 0.1, 0.6);
      const dark = es(t, 0.25, 0.9);
      G.sk.blend(SKIES.grey, SKIES.dark, dark);
      G.darkSky.layer.fade(dark * 0.85);
      G.dim.fade(dark * 0.62);
      G.fg.fade(1 - dark * 0.85);
      G.starL.fade(dark * 0.35);
      driftClouds(G, T * A);
      setCrosses(G, 1, 1, 1);
      const hr = lerp(6, 9, es(t, 1.05, 1.8));
      const [sxp, syp] = G.dial.at(hr);
      pose(G.sunEl, { x: sxp, y: syp + 22 });
      pose(G.disc, { x: lerp(sxp + 200, sxp, cover), y: syp + 22 - (1 - cover) * 20, o: cover > 0.01 ? 1 : 0 });
      pose(G.dial.el, { o: 1 - dark * 0.5 });
      [7, 8, 9].forEach((h, i) => { const k = bump(t, 1.1 + i * 0.22, 1.5 + i * 0.22) + (h === 9 ? es(t, 1.7, 1.9) * (1 - es(t, 2.9, 3.2)) : 0); fade(G.dial.el.querySelector(`[data-k="hr${h}"]`), 0.6 + Math.min(1, k) * 0.4); });

      /* the light on the cross; His head bows at the end */
      const bow = es(t, 8.05, 8.45);
      pose(hd, { x: 0, y: HDY, r: bow * 28 });
      fade(hl, 1 - bow * 0.7);
      pose(glow, { x: HX, y: HY + 10, s: 1 + bump(t, 2.05, 2.9) * 0.3 + bump(t, 7.05, 7.9) * 0.5, o: (0.45 + dark * 0.3) * (1 - bow * 0.75) });

      /* the lamp at the front of the stage */
      const out = es(t, 8.1, 8.4);
      pose(lamp, { x: 800, y: 672 });
      pose(flame, { x: 35, y: -16, sy: (1 - out) * (1 + Math.sin(T * 9) * 0.07 * A), sx: 1 - out * 0.7, o: out < 0.99 ? 1 : 0 });
      fade(lglow, (0.35 + dark * 0.65) * (1 - out));
      const sm = seg(t, 8.3, 8.95);
      pose(smoke, { x: 829, y: 650 - sm * 60, s: 0.6 + sm * 0.6, o: sm > 0 ? bump(t, 8.3, 8.95) * 0.8 : 0 });

      /* v34 — Eloi, Eloi */
      rings(HX + 6, HY, bump(t, 2.05, 2.95) + bump(t, 7.05, 7.95) * 1.4, T, { spread: 2.4 + bump(t, 7.05, 7.95) * 2.4, speed: 0.6 });
      const ek = es(t, 2.1, 2.4, ease.back) * (1 - es(t, 4.0, 4.2));
      pose(eloi, { x: 800, y: 135, s: ek, r: -1.5, o: ek > 0.02 ? 1 : 0 });
      const tk = es(t, 3.05, 3.35, ease.back) * (1 - es(t, 4.0, 4.2));
      pose(trans, { x: 820, y: 196, s: tk, r: 1, o: tk > 0.02 ? 1 : 0 });

      /* v35 — "He calls Elijah" */
      const point = es(t, 4.05, 4.3) * (1 - es(t, 7.9, 8.2) * 0.5);
      const lookUp = es(t, 6.1, 6.4) * (1 - es(t, 8.05, 8.4));
      by.forEach((b) => b.p.set({ x: b.x, y: b.y, s: 0.5, flip: b.f, armF: 20 + point * (b.i === 0 ? 100 : 40) + lookUp * 20, armB: 10 + point * 20, head: -point * 8 - lookUp * 14 + bow * 10, blink: 0 }));
      const el = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.05));
      const [bhx, bhy] = headAt(560, 548, 0.5, false);
      pose(elijah, { x: bhx + 10, y: bhy - 8, s: el, o: el > 0.02 ? 1 : 0 });

      /* v36 — the sponge on a reed */
      const rK = [[5.0, [1180, 568]], [5.45, [880, 470]]];
      const [rx, ry] = kf(t, rK);
      const raise = es(t, 5.45, 5.75) * (1 - es(t, 6.9, 7.3));
      const rArm = 20 + raise * 130;
      runner.set({ x: rx, y: ry, s: 0.55, flip: true, walk: moving(t, rK) ? rx * 0.1 : undefined, amt: 1.4, armF: rArm, armB: 20 + raise * 40, head: -raise * 16 + bow * 10, o: es(t, 4.95, 5.05) });
      const [hx2, hy2] = hand(rx, ry, 0.55, true, rArm);
      const aim = (Math.atan2(HY + 10 - hy2, HX + 10 - hx2) * 180) / PI + 90;
      pose(reed, { x: hx2, y: hy2, r: lerp(-20, aim, raise), s: 0.95, o: es(t, 5.05, 5.2) * (1 - es(t, 7.2, 7.5)) });
      pose(jarEl, { x: 900, y: 478, o: es(t, 5.3, 5.45) * (1 - es(t, 7.9, 8.1)) });
      const wk = es(t, 6.1, 6.35, ease.back) * (1 - es(t, 6.95, 7.1));
      const [whx, why] = headAt(1030, 540, 0.5, true);
      pose(wait, { x: whx - 8, y: why - 6, s: wk, o: wk > 0.02 ? 1 : 0 });

      /* v37b — a single breath of light rises and is gone */
      const rise = seg(t, 8.12, 8.98);
      pose(soul, { x: HX + Math.sin(rise * 5) * 6, y: HY - rise * 120, s: 0.8 + rise * 0.4, o: rise > 0 ? Math.sin(Math.min(1, rise * 1.25) * PI * 0.5) * (1 - rise * rise * 0.6) : 0 });

      S.cam.z = 1.02 + es(t, 1.8, 2.4) * 0.06 + es(t, 7.9, 8.9) * 0.08;
      S.cam.y = -10 + es(t, 1.8, 2.4) * -20 + es(t, 3.9, 4.4) * 40 + es(t, 7.9, 8.9) * -20;
    };
  },
};
