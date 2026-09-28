// Mt 1,6 — Jerusalem, city of David, in the evening gold. Jesse's son blooms large on the vine: a horn of oil tips
// over him (Samuel's anointing) and a crown comes down on its string — King David with his harp. Then Solomon,
// crowned, while behind them the Temple he will build rises on the hill; and on a rose ribbon beside him his
// mother, "the one who had been Uriah's wife".
import { C, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, olive, cypress } from '../../assets/nature.js';
import {
  GOLDEN, RIM, ICON, DAVID, medal, lineage, elder, mother, sanctuary, oilHorn, crown, harp, glowDisc, rayBurst, sparkle, hang2,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const DX = 620, DY = 430, DR = 68;          // David's medallion

export default {
  id: 'mt1-david',
  beats: [
    { v: 6, text: 'a Jesse ojcem króla Dawida.' },
    { v: 6, cont: true, text: 'Dawid był ojcem Salomona, a matką była [dawna] żona Uriasza.' },
  ],
  cam: { x: [-20, 20], y: [-40, 20], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const EVE_GOLD = ['#d7b89c', '#f0c894', '#f6ddb2'];
    const sk = sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1180, y: 200, len: 700 });
    const cl = hanging(hangL, cloud(c, 160, '#f8e6c8', '#ecd2ae'), { x: 470, y: 150, len: 700 });

    /* ---------- the hill of Zion, the walls, the Temple that rises for Solomon ---------- */
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(sheet().p(c.ridge(c.wave(560, [16, 7, 3], [900, 320, 120]), -1200, 2800, 1900, 12, 1), mix(C.hillFar, C.duskViolet, 0.3)).out());
    const templeL = S.layer({ par: 0.1, sh: 3, pad: 320 });
    const temple = templeL.add(`<g>${sanctuary(c, 0.95)}</g>`);
    const city = S.layer({ par: 0.14, sh: 3 });
    const hs = sheet();
    hs.p(c.cut([[-1200, 1900], [-1200, 640], [-200, 600], [300, 560], [560, 540], [1000, 540], [1300, 560], [1800, 600], [2800, 640], [2800, 1900]], 1.2, 12), mix(C.sand2, C.dune, 0.4));
    // the wall of the city of David along the hill
    const wy = 574;
    const wpts = [[160, wy + 40], [160, wy - 30]];
    for (let x = 160; x < 1440; x += 20) wpts.push([x, wy - 30], [x, wy - 40], [x + 10, wy - 40], [x + 10, wy - 30]);
    wpts.push([1440, wy - 30], [1440, wy + 40]);
    hs.p(c.cut(wpts, 0.4, 6), mix(C.stone, C.sand2, 0.35));
    let towers = '';
    [200, 520, 1080, 1400].forEach((x) => { towers += c.cut(c.rect(x - 22, wy - 70, 44, 110), 0.4, 6); });
    hs.p(towers, mix(C.stone2, C.sand2, 0.3));
    let roofs = '';
    for (let i = 0; i < 12; i++) { const x = 240 + i * 100 + c.rr(-20, 20), h = c.rr(24, 44); if (Math.abs(x - 820) < 130) continue; roofs += c.cut(c.rect(x, wy - 30 - h, c.rr(40, 60), h + 2), 0.3, 5); }
    hs.p(roofs, C.plaster);
    city.add(hs.out() + cypress(c, 330, 600, 130) + olive(c, 1260, 610, 0.8));

    /* ---------- the vine ---------- */
    const vineL = S.layer({ par: 0.4, sh: 3 });
    const medL = S.layer({ par: 0.4, sh: 6 });
    const K = RIM.king;
    const dO = { ...DAVID, holdF: '' };
    const nodes = [
      { key: 'jesse', x: 476, y: 620, r: 44, at: -1, markup: medal(S, elder(c, { robe: C.sageRobe, hairStyle: 'wrap', veil: C.wheatRobe, beard: 'full', hair: C.greyHair, beardColor: C.greyHair }), { r: 44, ...RIM.field, name: tr('Jesse', 'Jesse'), icon: ICON.crook(c) }) },
      { key: 'david', parent: 'jesse', x: DX, y: DY, r: DR, at: 0.26,
        markup: medal(S, dO, { r: DR, ...K, name: tr('król Dawid', 'King David'), icon: ICON.harp(c), size: 25, front: `<g transform="translate(${DR * 0.34} ${DR * 0.62}) rotate(-8) scale(.62)">${harp(c)}</g>` }) },
      { key: 'solomon', parent: 'david', x: 990, y: 300, r: 54, at: 1.34, markup: medal(S, elder(c, { robe: C.linen, mantle: C.plumRobe, hairStyle: 'short', hair: C.hair3, beard: 'short', skin: C.skin }), { r: 54, ...K, king: true, flip: true, name: tr('Salomon', 'Solomon'), icon: ICON.temple(c) }) },
      { key: 'bathsheba', parent: 'solomon', mother: true, x: 1070, y: 520, r: 44, at: 1.56, markup: medal(S, mother(c, { robe: C.mauve, veil: C.lavender, veil2: shade(C.lavender, -0.14), skin: C.skin }), { r: 44, ...RIM.mother, flip: true, name: tr('żona Uriasza', 'Uriah’s wife'), size: 20, icon: ICON.lily(c) }) },
    ];
    const line = lineage(S, vineL, medL, nodes);

    /* ---------- the anointing and the crown ---------- */
    const topL = S.layer({ par: 0.4, sh: 6 });
    const k = DR / 52;
    const hornEl = topL.add(`<g>${hang2(`<g data-k="horn">${oilHorn(c)}</g>`, 18, 500)}</g>`);
    const horn = S.$('horn');
    const drop = topL.add(`<path d="${c.cut([[0, -10], [5, 0], ...c.arc(0, 1, 5, 5, 0, PI, 6), [-5, 0]], 0.2, 2)}" fill="${C.halo}"/>`);
    const crownEl = topL.add(`<g><path d="M${-8 * k} ${-32 * k}V-1600M${8 * k} ${-32 * k}V-1600" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/><g transform="scale(${k.toFixed(3)})">${crown(c)}</g></g>`);
    const glowL = S.layer({ par: 0.4, sh: 1, flat: true });
    const halo = glowL.add(`<g>${glowDisc(DR * 2.2, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: DR, r1: DR * 3, spread: 0.04, color: '#fff3cf', o: 0.55 })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => glowL.add(`<g>${sparkle(c, 12 + (i % 2) * 6)}</g>`));

    return (t, time) => {
      pose(sunEl, { x: 1180, y: lerp(200, 250, es(t, 1, 2)), r: Math.sin(time * 0.6) });
      pose(cl, { x: 470 + Math.sin(time * 0.1) * 20, y: 150, r: Math.sin(time * 0.6 + 1) * 1.2 });
      sk.blend(GOLDEN, EVE_GOLD, es(t, 1.0, 1.8));
      line.update(t);

      /* v6a: King David — anointed with oil, then crowned */
      const hIn = es(t, 0.3, 0.46, ease.out), tip = es(t, 0.42, 0.52), hOut = es(t, 0.62, 0.78, ease.in);
      pose(hornEl, { x: DX + 70, y: lerp(-420, DY - DR - 120, hIn) - hOut * 600, o: hIn > 0.001 && hOut < 0.999 ? 1 : 0 });
      pose(horn, { r: -40 - tip * 60, ox: 0, oy: 0 });
      const dk = seg(t, 0.5, 0.62);
      pose(drop, { x: DX + 30 - dk * 20, y: lerp(DY - DR - 100, DY - DR * 0.4, dk * dk), o: dk > 0 && dk < 1 ? 1 : 0 });
      const cr = es(t, 0.52, 0.72, ease.out);
      const headY = DY - 0.12 * DR - 2 * k;
      pose(crownEl, { x: DX + 2 * k, y: lerp(-300, headY, cr), r: (1 - cr) * Math.sin(t * 8) * 4, o: cr > 0.001 ? 1 : 0 });
      const glory = es(t, 0.6, 0.8);
      pose(halo, { x: DX, y: DY, s: 0.6 + glory * 0.4, r: t * 3, o: glory * 0.45 * (1 - es(t, 1.2, 1.5) * 0.4) });
      sparks.forEach((sp, i) => { const a = (i / 5) * PI * 2 + 0.4; const kk = bump(t, 0.6 + i * 0.03, 1.0 + i * 0.03); pose(sp, { x: DX + Math.cos(a) * (DR + 20 + kk * 30), y: DY + Math.sin(a) * (DR + 20 + kk * 30), s: kk, r: t * 90, o: kk }); });

      /* v6b: Solomon — the Temple rises behind him */
      const tk = es(t, 1.2, 1.6, ease.out);
      pose(temple, { x: 820, y: 548 + (1 - tk) * 300, s: 1, o: tk > 0.001 ? 1 : 0 });

      S.cam.z = 1.02 + es(t, 0.2, 0.6) * 0.04 - es(t, 1.1, 1.4) * 0.06;
      S.cam.x = -es(t, 0.2, 0.6) * 10 + es(t, 1.1, 1.4) * 20;
    };
  },
};
