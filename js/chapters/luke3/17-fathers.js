// Łk 3,32–34 — the road passes through the harvest fields of Bethlehem, sheaves standing at its side: Jesse the
// shepherd with his crook, Obed, Boaz with his sheaf, Salmon, Nahshon with the banner of Judah. Then Judah himself
// with his lion. Night falls over the tents of the patriarchs and the sky fills with Abraham's stars: Jacob with
// his ladder, Isaac with the ram, and Abraham, the father of many nations.
import { C, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, moon } from '../../assets/nature.js';
import { sheaf } from '../../assets/things.js';
import { eraSet, lineRoad, gen, ICON3, ABRAHAM, VP, tr, es, fade, pose } from './lib.js';
import { tentMamre } from '../john8/lib.js';

export default {
  id: 'lk3-fathers',
  beats: [
    { v: 32 },
    { v: 33 },
    { v: 34 },
  ],
  cam: { x: [-10, 10], y: [0, 30], z: [1, 1.05] },
  build(S) {
    const c = S.c;
    const E = eraSet(S, { skyCols: ['#dcc3a3', '#f2d3a2', '#f7e2bd'], night: ['#10163a', '#1f2858', '#3a4378'], far: mix(C.duskViolet, C.dune, 0.4), mid: mix(C.wheat, C.sand2, 0.5), ground: mix(C.wheat, C.sand2, 0.45), road: mix(C.sand, C.cream, 0.4), grassCol: C.wheat2 });
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44, { disc: C.sunDeep, inner: C.sun }), { x: 1220, y: 300, len: 700 });
    const moonEl = hanging(hangL, moon(c, 32), { x: 1200, y: 150, len: 700 });
    // sheaves along the road, tents on the horizon
    let sh = '';
    [[430, 610, 0.5], [560, 590, 0.36], [1130, 612, 0.5], [1010, 588, 0.34], [300, 650, 0.7], [1300, 660, 0.72]].forEach(([x, y, s]) => { sh += `<g transform="translate(${x} ${y}) scale(${s})">${sheaf(c, 110)}</g>`; });
    E.R.add(sh);
    E.midL.add(`<g transform="translate(360 ${VP[1] - 4}) scale(.34)">${tentMamre(c, 250, 170)}</g><g transform="translate(470 ${VP[1] - 2}) scale(.26)">${tentMamre(c, 250, 170)}</g><g transform="translate(1180 ${VP[1] - 2}) scale(.3)">${tentMamre(c, 250, 170)}</g>`);
    const nightWash = S.layer({ par: 0.3, sh: 1, flat: true });
    nightWash.add(`<rect x="-3000" y="${VP[1] - 60}" width="8000" height="3000" fill="#1f2858" opacity=".45"/>`);
    nightWash.fade(0);

    const R = (pl, en, o) => gen(c, tr(pl, en), o);
    const judah = { robe: C.clayMantle, mantle: C.ochre, hairStyle: 'curly', hair: C.hair3, beard: 'full', skin: C.skin3, belt: C.leather };
    const nightBack = mix('#2b3262', C.indigo, 0.3);
    const L = lineRoad(S, [
      { people: [
        R('Jesse', 'Jesse', { o: { robe: C.sageRobe, hairStyle: 'wrap', veil: C.wheatRobe, beard: 'full', hair: C.greyHair, beardColor: C.greyHair, skin: C.skin2 }, rim: 'field', icon: ICON3.crook }),
        R('Jobed', 'Obed', { rim: 'field' }),
        R('Booz', 'Boaz', { o: { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather }, rim: 'field', icon: ICON3.sheaf }),
        R('Sala', 'Salmon', { rim: 'field' }),
        R('Naasson', 'Nahshon', { rim: 'desert', icon: ICON3.banner }),
      ] },
      { people: tr(
        [R('Aminadab', '', { rim: 'desert' }), R('Admin', '', { rim: 'desert' }), R('Arni', '', { rim: 'desert' }), R('Esrom', '', { rim: 'desert' }), R('Fares', '', { rim: 'desert' }), R('Juda', '', { o: judah, rim: 'patriarch', icon: ICON3.lion, r: 46 })],
        [R('', 'Amminadab', { rim: 'desert' }), R('', 'Aram', { rim: 'desert' }), R('', 'Hezron', { rim: 'desert' }), R('', 'Perez', { rim: 'desert' }), R('', 'Judah', { o: judah, rim: 'patriarch', icon: ICON3.lion, r: 50 })],
      ) },
      { people: [
        R('Jakub', 'Jacob', { o: { robe: C.tealRobe, mantle: C.clayMantle, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.leather }, rim: 'patriarch', icon: ICON3.ladder }),
        R('Izaak', 'Isaac', { o: { robe: C.wheatRobe, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2 }, rim: 'patriarch', icon: ICON3.ram }),
        R('Abraham', 'Abraham', { o: ABRAHAM, r: 58, rim: 'night', back: nightBack, icon: ICON3.stars, size: 22 }),
        R('Tare', 'Terah', { rim: 'patriarch' }),
        R('Nachor', 'Nahor', { rim: 'patriarch' }),
      ], opts: { gold: true } },
    ], [0, 1, 2], { extra: 2, gopts: S.portrait ? { x0: 370, x1: 1190, inner: 110 } : null });   // phone: the row stays clear of the edges and the thread

    return (t, time) => {
      const night = es(t, 2.0, 2.45);
      swing(sunEl, 1220, 300 + night * 260, time, 1, 0.6);
      fade(sunEl, 1 - es(t, 2.1, 2.4));
      swing(moonEl, 1200, 150 + (1 - night) * -700, time, 0.8, 0.5);
      E.nightL.fade(night);
      nightWash.fade(night);
      L.update(t);
      S.cam.z = 1.02 + Math.min(1, t / 3) * 0.02;
      S.cam.y = 15;
    };
  },
};
