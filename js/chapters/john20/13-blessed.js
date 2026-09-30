// J 20,29 — A round picture hangs in the night: the lit room, Jesus, and Thomas on his knees before Him. "You have
// believed because you have seen Me?" — an open eye, and a heart lit from it. Then the camera draws back across time:
// the picture shrinks into the one lit window of a small house on top of a great paper globe at night — and lights
// kindle all over the globe, wave after wave, and in front of it, near us, someone reads a book by its own glow, and
// an old woman holds up her lamp. "Blessed are those who have not seen, and have believed": a closed eye — and a
// heart lit all the same.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { THOMAS, strip, nightGlobe, lightsOn, litHouse, smallBook, handLamp, vignette, eyeIcon, heart, goldWord, glowDisc, upright, sparkle, tr, sky } from './lib.js';

const GC = { x: 800, y: 1010, r: 440 };

export default {
  id: 'j20-blessed',
  beats: [
    { v: 29, text: 'Powiedział mu Jezus: «Uwierzyłeś dlatego, ponieważ Mnie ujrzałeś?' },
    { v: 29, cont: true, text: 'Błogosławieni, którzy nie widzieli, a uwierzyli».' },
  ],
  cam: { x: [-20, 20], y: [-60, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#10132b', '#1d2350', '#39407a']);
    const stL = S.layer({ par: 0.03, sh: 1, flat: true });
    stL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 700, n: 130 }));
    // the globe of the world at night, the little house on top, lights all over it
    const gL = S.layer({ par: 0.3, sh: 4 });
    gL.add(`<g transform="translate(${GC.x} ${GC.y})">${nightGlobe(c, GC.r)}</g>`);
    const houseGlow = gL.add(`<g opacity="0">${glowDisc(90, 'warm-glow', 0.9)}</g>`);
    gL.add(`<g transform="translate(${GC.x} ${GC.y - GC.r + 8})">${litHouse(c, 1.4)}</g>`);
    const waves = [0, 1, 2, 3].map((i) => gL.add(`<g opacity="0" transform="translate(${GC.x} ${GC.y})">${lightsOn(c, GC.r * 0.96, 22 + i * 6, { ymax: -0.42, size: 3.4 + (3 - i) * 0.4 })}</g>`));
    // the round picture: the lit room, Jesus and Thomas kneeling
    const vL = S.layer({ par: 0.5, sh: 6 });
    const room = `<rect x="-200" y="-200" width="400" height="400" fill="${mix(C.plaster, C.indigo, 0.35)}"/><rect x="-200" y="80" width="400" height="120" fill="${mix(C.clay, C.sand2, 0.5)}"/>`
      + `<circle cx="20" cy="-10" r="170" fill="url(#halo-glow)"/>`
      + `<g class="pj" transform="translate(52 128) scale(-.92 .92)">${person(c, { ...CAST.jesus })}</g>`
      + `<g class="pt" transform="translate(-58 128) scale(.92)">${person(c, { ...THOMAS, pose: 'kneel' })}</g>`;
    const plate = vL.add(`<g>${vignette(S, room, { r: 170, fill: '#2b3060', k: 'room' })}</g>`);
    const pj = S.puppet(plate.querySelector('.pj .fig'));
    const pt = S.puppet(plate.querySelector('.pt .fig'));
    // near us: someone reading, an old woman with her lamp
    const fg = S.layer({ par: 0.75, sh: 6 });
    const reader = S.puppet(fg.add(person(c, { robe: C.skyVeil, mantle: C.ochreRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3, pose: 'sit', holdF: `<g transform="translate(4 6)">${smallBook(c)}</g>` })));
    const old = S.puppet(fg.add(person(c, { robe: C.plumRobe, mantle: C.stone, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, pose: 'kneel', holdF: `<g transform="translate(-2 4)">${handLamp(c, { glowR: 90 })}</g>` })));
    const fx = S.layer({ par: 0.56, sh: 4 });
    const eyeOpen = fx.add(`<g>${eyeIcon(c, { r: 24, open: true })}</g>`);
    const heart1 = fx.add(`<g><circle r="46" fill="url(#halo-glow)"/>${heart(c, 18, C.jesusMantle)}</g>`);
    const arrow1 = fx.add(`<path d="M-26 0H26M16 -9L27 0L16 9" stroke="${C.halo}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    const eyeShut = fx.add(`<g>${eyeIcon(c, { r: 30, open: false })}</g>`);
    const heart2 = fx.add(`<g><circle r="56" fill="url(#halo-glow)"/>${heart(c, 20, C.jesusMantle)}</g>`);
    const arrow2 = fx.add(`<path d="M-26 0H26M16 -9L27 0L16 9" stroke="${C.halo}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    const cap1 = fx.add(`<g>${strip(c, tr('nie widzieli', 'have not seen'), { size: 16 })}</g>`);
    const cap2 = fx.add(`<g>${strip(c, tr('uwierzyli', 'have believed'), { size: 16, fill: C.halo })}</g>`);
    const word = fx.add(`<g>${goldWord(c, tr('Błogosławieni', 'Blessed'), { size: 32 })}</g>`);
    const sp = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, T) => {
      /* v29a: "You have believed because you have seen Me?" */
      const speak = es(t, 0.1, 0.35);
      pj.set({ x: 0, y: 0, armF: 20 + speak * 50, armB: 14 + speak * 30, head: 4, blink: blinkAt(T) });
      pt.set({ x: 0, y: 0, armF: 80, armB: 110, head: -12 });
      const pull = es(t, 1.02, 1.6, ease.io);
      pose(plate, { x: lerp(800, GC.x, pull), y: lerp(370, GC.y - GC.r - 20, pull), s: lerp(1, 0.07, pull), o: 1 - es(t, 1.5, 1.62) });
      const e1 = es(t, 0.35, 0.55, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(eyeOpen, { x: 520, y: 330, s: e1, o: e1 > 0.01 ? 1 : 0 });
      pose(arrow1, { x: 520, y: 400, r: 90, s: e1 * 0.8, o: e1 > 0.01 ? 1 : 0 });
      const h1 = es(t, 0.5, 0.7, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(heart1, { x: 520, y: 470, s: h1, o: h1 > 0.01 ? 1 : 0 });

      /* v29b: across time — the globe of those who have not seen and believe */
      pose(houseGlow, { x: GC.x, y: GC.y - GC.r - 10, s: 0.6 + pull * 0.6, o: pull });
      waves.forEach((w, i) => fade(w, es(t, 1.35 + i * 0.12, 1.55 + i * 0.12)));
      const nf = es(t, 1.4, 1.7);
      reader.set({ x: S.portrait ? 1050 : 1130, y: 800, s: 1.2, flip: true, o: nf, armF: 70, armB: 20, head: 12, blink: blinkAt(T, 2) });
      upright(reader, 'F', 70);
      old.set({ x: S.portrait ? 550 : 470, y: 806, s: 1.15, o: nf, armF: 110, armB: 30, head: -8, blink: blinkAt(T, 4) });
      upright(old, 'F', 110);
      const fl = old.armF.querySelector('.flame');
      if (fl) pose(fl, { x: 27, y: -12, sx: T ? 1 + Math.sin(T * 7) * 0.1 : 1, sy: T ? 1 + Math.sin(T * 5.3) * 0.14 : 1 });
      const e2 = es(t, 1.45, 1.65, ease.back);
      pose(eyeShut, { x: 640, y: 300, s: e2, o: e2 > 0.01 ? 1 : 0 });
      pose(arrow2, { x: 740, y: 300, s: e2 * 0.8, o: e2 > 0.01 ? 1 : 0 });
      const h2 = es(t, 1.55, 1.75, ease.back);
      pose(heart2, { x: 840, y: 300, s: h2 * (1 + (T ? Math.sin(T * 3) * 0.05 : 0)), o: h2 > 0.01 ? 1 : 0 });
      const ck = es(t, 1.6, 1.8, ease.back);
      pose(cap1, { x: 640, y: 350, s: ck, r: -2, o: ck > 0.01 ? 1 : 0 });
      pose(cap2, { x: 840, y: 358, s: ck, r: 2, o: ck > 0.01 ? 1 : 0 });
      const wk = es(t, 1.3, 1.5, ease.back);
      pose(word, { x: 740, y: 210, s: wk, o: wk > 0.01 ? 1 : 0 });
      sp.forEach((el, i) => {
        const b = bump(t, 1.5 + i * 0.08, 2 + i * 0.08);
        pose(el, { x: 380 + i * 190, y: 420 + (i % 2) * 60, s: b, r: T * 30, o: b });
      });

      S.cam.x = 0;
      S.cam.y = lerp(-30, 0, pull);
      S.cam.z = lerp(1.1, 1.0, pull) * (S.portrait ? 0.9 : 1);
    };
  },
};
