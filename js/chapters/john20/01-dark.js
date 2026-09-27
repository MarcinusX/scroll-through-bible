// J 20,1 — The curtains open on the garden in the dark. Stars, a low moon, the city asleep behind the hills.
// A tag swings in: the first day after the Sabbath. Mary Magdalene walks the garden path alone with a small clay
// lamp, its warm circle moving with her through the indigo. She comes near the tomb and lifts the lamp: the great
// stone stands rolled aside and the doorway is a dark, empty mouth. She starts back, her hand to her lips.
import { C, person, blinkAt, pose, lerp, curtains, hanging, swing, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, gardenSet, GARDEN_PATH, pathS, DOOR, STONE, NIGHT, PRE, handLamp, along, headAt, handAt, nameTag, GLYPH, skyKeys, upright, withFace, faceBits, sparkle, tr, sky } from './lib.js';

export default {
  id: 'j20-dark',
  beats: [
    { cover: true },
    { v: 1, text: 'A pierwszego dnia po szabacie, wczesnym rankiem, gdy jeszcze było ciemno, Maria Magdalena udała się do grobu' },
    { v: 1, cont: true, text: 'i zobaczyła kamień odsunięty od grobu.' },
  ],
  cam: { x: [-720, 360], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starEl = hangL.add(`<g>${stars(c, { x0: -900, x1: 2400, y0: -500, y1: 420, n: 110 })}</g>`);
    const twinkle = [0, 1, 2, 3].map(() => hangL.add(`<g>${sparkle(c, 10)}</g>`));
    const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 28)}`, { x: 300, y: 230, len: 700 });

    const G = gardenSet(S);
    const L = G.walkL;
    const lampHold = `<g transform="translate(-4 4)">${handLamp(c, { glowR: 60 })}</g>`;
    const maryEl = L.add(withFace(person(c, { ...MAGD, holdF: lampHold }), faceBits(c)));
    const mary = S.puppet(maryEl);
    const sad = maryEl.querySelector('[data-part="sad"]');
    const flameEl = mary.armF.querySelector('.flame');
    const bang = L.add(`<g>${GLYPH.bang(c)}</g>`);

    // the dark of the night over everything, and the lamp's own circle of light above it
    const dark = S.layer({ par: 0.5, sh: 0, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.indigo, 0.3)}" opacity=".6"/>`);
    const glowL = S.layer({ par: 0.52, sh: 0, flat: true });
    const lampGlow = glowL.add(`<g><circle r="170" fill="url(#warm-glow)" opacity=".55"/><circle r="60" fill="url(#halo-glow)" opacity=".8"/></g>`);
    const stoneGlow = glowL.add(`<g opacity="0"><circle r="170" fill="url(#warm-glow)" opacity=".35"/></g>`);

    const tagL = S.layer({ par: 0.2, sh: 4 });
    const title = hanging(tagL, nameTag(c, tr('Ogród przy grobie', 'The garden of the tomb'), { size: 18 }), { x: 0, y: 0, len: 600 });
    const day = hanging(tagL, nameTag(c, tr('pierwszy dzień po szabacie', 'the first day of the week'), { size: 17 }), { x: 0, y: 0, len: 600 });
    const cur = curtains(S);

    return (t, T) => {
      cur.set(es(t, 0.05, 0.85), T);
      skyKeys(sk, t, [[1.4, NIGHT], [3, PRE]]);
      fade(starEl, 1 - es(t, 2.2, 3) * 0.5);
      twinkle.forEach((el, i) => {
        const k = T ? 0.5 + 0.5 * Math.sin(T * 1.6 + i * 1.9) : 0.6;
        pose(el, { x: [120, 520, 1180, 1500][i], y: [120, 60, 90, 150][i], s: 0.5 + k * 0.5, o: k * (1 - es(t, 2.4, 3) * 0.5) });
      });
      swing(moonEl, 300 - es(t, 0.5, 3) * 80, 230 + es(t, 0.5, 3) * 120, T, 1, 0.6, 1);
      dark.fade(1 - es(t, 2.3, 3) * 0.12);

      // the title tag during the cover, then the first day
      const tg = es(t, 0.25, 0.7, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      swing(title, 500, lerp(-600, 220, tg), tg > 0.001 ? T : 0, 1.2, 0.8); fade(title, tg > 0.001 ? 1 : 0);
      const dg = es(t, 1.05, 1.4, ease.back) * (1 - es(t, 2.0, 2.25, ease.in));
      swing(day, 760, lerp(-600, 200, dg), dg > 0.001 ? T : 0, 1.2, 0.8, 2); fade(day, dg > 0.001 ? 1 : 0);

      /* v1a: she walks the garden path alone with her lamp */
      const u = lerp(0.4, 0.46, es(t, 0.3, 1)) + es(t, 1.0, 2.2, ease.sine) * 0.39;
      const walking = t > 0.3 && t < 2.2;
      const [x, y] = along(GARDEN_PATH, u);
      const s = pathS(y) * 1.02;
      const lift = es(t, 2.05, 2.3);
      const startle = es(t, 2.3, 2.42, ease.out);
      const armF = 24 + lift * 52 - startle * 12;
      mary.set({ x: x - startle * 16, y, s, walk: walking ? x * 0.05 : undefined, amt: 0.8, armF, armB: 8 + startle * 128, lean: -startle * 7, head: -lift * 6 - startle * 6, blink: startle > 0.2 ? 0 : blinkAt(T, 2) });
      upright(mary, 'F', armF);
      fade(sad, startle * 0.9);
      if (flameEl) pose(flameEl, { x: 27, y: -12, sx: T ? 1 + Math.sin(T * 7) * 0.1 : 1, sy: T ? 1 + Math.sin(T * 5.3) * 0.14 : 1 });
      const [hx, hy] = handAt(x - startle * 16, y, s, false, armF);
      pose(lampGlow, { x: hx + 22 * s, y: hy - 18 * s, s: 1 + lift * 0.35 + (T ? Math.sin(T * 6) * 0.02 : 0) });

      /* v1b: the stone rolled away, the dark doorway */
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y, o: 0 });
      pose(stoneGlow, { x: STONE.x - 60, y: DOOR.y - 90, s: 1.4, o: lift * 0.9 });
      const [bx, by] = headAt(x - startle * 16, y, s, false);
      const bb = es(t, 2.32, 2.5, ease.back);
      pose(bang, { x: bx + 36, y: by - 44, s: bb * 1.5, r: 8, o: bb > 0.01 ? 1 : 0 });

      S.cam.x = S.portrait ? Math.max(-720, Math.min(360, (x - 800) / 0.52 + 60 + lift * 120)) : Math.max(-720, Math.min(360, (x - 800) / 0.52 + 280 + lift * 60));
      S.cam.y = 30 - es(t, 1, 3) * 20;
      S.cam.z = 1 + es(t, 2, 2.6) * 0.06;
    };
  },
};
