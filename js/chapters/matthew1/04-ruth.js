// Mt 1,5 — the fields of Bethlehem at harvest. Salmon's son Boaz blooms on the vine, and beside him, on a rose
// ribbon, his mother Rahab — far off the wall of Jericho rises, her scarlet cord at the window. Boaz's son Obed,
// with Ruth his mother: down in the barley a young woman gleans behind the reapers. Then Jesse, the shepherd of
// Bethlehem: a flock comes over the hill.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { sun, cloud, town, olive } from '../../assets/nature.js';
import { sheaf } from '../../assets/things.js';
import {
  GOLDEN, RIM, ICON, medal, lineage, phoneFit, elder, mother, jerichoWall, sheep, kf,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { crowdPerson } from '../kit.js';

export default {
  id: 'mt1-ruth',
  beats: [
    { v: 5, text: 'Salmon ojcem Booza, a matką była Rachab.' },
    { v: 5, cont: true, text: 'Booz był ojcem Obeda, a matką była Rut.' },
    { v: 5, cont: true, text: 'Obed był ojcem Jessego,' },
  ],
  cam: { x: [-20, 20], y: [-200, 20], z: [1, 1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1200, y: 170, len: 700 });
    const cl = hanging(hangL, cloud(c, 170, '#f8ead0', '#ecd6b4'), { x: 460, y: 150, len: 700 });

    /* ---------- far hills with Bethlehem; Jericho's wall comes up for Rahab ---------- */
    const far = S.layer({ par: 0.06, sh: 2 });
    const ffn = c.wave(520, [16, 7, 3], [900, 320, 120]);
    far.add(sheet().p(c.ridge(ffn, -1200, 2800, 1900, 12, 1), mix(C.hillFar, C.dune, 0.3)).out() + town(c, { x: 1060, y: ffn(1060) + 10, n: 7, spread: 240, sc: 0.5 }));
    const jer = S.layer({ par: 0.08, sh: 3, pad: 260 });
    jer.add(`<g transform="translate(420 560)">${jerichoWall(c, 380, 120)}</g>`);
    const hill = S.layer({ par: 0.12, sh: 3 });
    const hfn = c.wave(590, [12, 5], [700, 220]);
    hill.add(sheet().p(c.ridge(hfn, -1200, 2800, 1900, 12, 1), mix(C.hillMid, C.wheat, 0.35)).out() + olive(c, 1280, hfn(1280) + 10, 0.7) + olive(c, 250, hfn(250) + 10, 0.8));
    // Jesse's flock comes over the hill
    const flock = S.layer({ par: 0.12, sh: 3, pad: 200 });
    let fl = '';
    [[-60, 0, 0.5], [-10, 6, 0.55], [40, -2, 0.5], [90, 8, 0.58], [140, 2, 0.5], [190, 10, 0.55]].forEach(([x, y, s], i) => { fl += `<g transform="translate(${x} ${y}) scale(${i % 2 ? -s : s} ${s})">${sheep(c)}</g>`; });
    fl += `<g transform="translate(250 12) scale(.5)">${person(c, { robe: C.sageRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.wheatRobe, beard: 'short', skin: C.skin3, holdB: `<path d="${c.ribbon([[0, -40], [0, 130]], 5)}" fill="${C.wood2}"/>` })}</g>`;
    const flockEl = flock.add(`<g>${fl}</g>`);

    /* ---------- the barley field, the reapers, Ruth gleaning ---------- */
    const field = S.layer({ par: 0.22, sh: 3 });
    const gfn = c.wave(660, [6, 3], [700, 200]);
    const fs = sheet().p(c.ridge(gfn, -1200, 2800, 1900, 12, 1), mix(C.wheat, C.wheat2, 0.4));
    let ears = '';
    for (let i = 0; i < 240; i++) { const x = c.rr(-1200, 2800), y = gfn(x) + c.rr(-4, 80); ears += c.ribbon([[x, y], [x + c.rr(-3, 3), y - c.rr(14, 26)]], 2); }
    fs.x(ears, C.wheat2, 'opacity=".75"');
    field.add(fs.out());
    field.add(`<g transform="translate(560 ${gfn(560) + 20}) scale(.6)">${sheaf(c, 100)}</g><g transform="translate(610 ${gfn(610) + 24}) scale(.55)">${sheaf(c, 100)}</g><g transform="translate(1180 ${gfn(1180) + 22}) scale(.6)">${sheaf(c, 100)}</g>`);
    const reapers = field.add(`<g>${[[700, 0.56], [780, 0.52]].map(([x, s], i) => `<g transform="translate(${x} ${gfn(x) + 26}) scale(${s})">${person(c, { ...crowdPerson(c), hairStyle: 'wrap', beard: 'short', pose: 'kneel' })}</g>`).join('')}</g>`);
    const RUTH = { robe: C.roseRobe, mantle: C.wheatRobe, hairStyle: 'veil', veil: C.ochreRobe, veil2: shade(C.ochreRobe, -0.12), hair: C.hair3, skin: C.skin3, holdF: `<g transform="translate(0 4) rotate(-30) scale(.34)">${sheaf(c, 100)}</g>` };
    const ruth = S.puppet(field.add(person(c, RUTH)));

    /* ---------- the vine ---------- */
    const vineL = S.layer({ par: 0.9, sh: 3 });
    const medL = S.layer({ par: 0.9, sh: 6 });
    const F = RIM.field;
    const nodes = [
      { key: 'salmon', x: 500, y: 604, r: 40, at: -1, markup: medal(S, elder(c), { r: 40, ...RIM.desert, name: tr('Salmon', 'Salmon') }) },
      { key: 'boaz', parent: 'salmon', x: 720, y: 486, r: 46, at: 0.34, markup: medal(S, elder(c, { robe: C.wheatRobe, mantle: C.clayMantle, beard: 'full' }), { r: 46, ...F, name: tr('Booz', 'Boaz'), icon: ICON.grain(c) }) },
      { key: 'rahab', parent: 'boaz', mother: true, x: 530, y: 366, r: 40, at: 0.56, markup: medal(S, mother(c, { robe: C.terracotta, veil: C.roseRobe, veil2: shade(C.roseRobe, -0.14) }), { r: 40, ...RIM.mother, name: tr('Rachab', 'Rahab'), icon: ICON.cord(c) }) },
      { key: 'obed', parent: 'boaz', x: 930, y: 380, r: 42, at: 1.34, markup: medal(S, elder(c), { r: 42, ...F, name: tr('Obed', 'Obed'), flip: true }) },
      { key: 'ruth', parent: 'obed', mother: true, x: 1090, y: 500, r: 40, at: 1.56, markup: medal(S, RUTH, { r: 40, ...RIM.mother, name: tr('Rut', 'Ruth'), flip: true, icon: ICON.sheaf(c) }) },
      { key: 'jesse', parent: 'obed', x: 760, y: 236, r: 46, at: 2.38, markup: medal(S, elder(c, { robe: C.sageRobe, hairStyle: 'wrap', veil: C.wheatRobe, beard: 'full', hair: C.greyHair, beardColor: C.greyHair }), { r: 46, ...F, name: tr('Jesse', 'Jesse'), icon: ICON.crook(c) }) },
    ];
    phoneFit(S, nodes, { cx: 795, k: 0.78 });   // phone: the outermost medallions come in from the edges
    const line = lineage(S, vineL, medL, nodes);

    return (t, time) => {
      pose(sunEl, { x: 1200, y: 170, r: Math.sin(time * 0.6) });
      pose(cl, { x: 460 + Math.sin(time * 0.1) * 20, y: 150, r: Math.sin(time * 0.6 + 1) * 1.2 });
      line.update(t);
      /* v5a: Rahab — the wall of Jericho with her scarlet cord comes up on the far flat */
      const j = es(t, 0.3, 0.62, ease.out) * (1 - es(t, 1.05, 1.3));
      jer.shift(0, (1 - j) * 320);
      jer.fade(j > 0.001 ? 1 : 0);
      /* v5b: Ruth gleaning behind the reapers */
      const rIn = es(t, 1.2, 1.55);
      const glean = Math.max(0, Math.sin(Math.max(0, t - 1.4) * 9)) * bump(t, 1.35, 2.4);
      ruth.set({ x: lerp(1500, 930, rIn), y: 700, s: 0.6, flip: true, o: rIn > 0.001 ? 1 : 0, walk: rIn > 0 && rIn < 1 ? t * 30 : undefined, lean: glean * 18, armF: 40 + glean * 30, armB: 10 + glean * 40, blink: blinkAt(time, 2) });
      pose(reapers, { x: Math.sin(t * 2) * 6, y: 0 });
      /* v5c: Jesse the shepherd — his flock comes over the hill */
      const fk = es(t, 2.1, 2.5, ease.out);
      pose(flockEl, { x: lerp(1500, 960, fk), y: hfn(960) + 16 + (1 - fk) * 30, s: 1, o: fk > 0.001 ? 1 : 0 });

      S.cam.y = kf(t, [[0.9, 0], [1.35, -60], [2.0, -60], [2.45, -170]]);
    };
  },
};
