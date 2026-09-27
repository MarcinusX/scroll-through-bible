// Mk 16,15–16 — On a hill, Jesus with the Eleven. "Go into all the world": the map of the land comes
// down on its strings and swells into a whole paper globe; paths of light run out from Jerusalem to every
// side, and all creation stands round the rim — peoples of every kind, birds, fish, a lamb, a camel, flowers.
// Then two arched plates: one who believes goes down into the water and rises in light; one who will not
// believe turns away from the lit doorway, and the door gently closes.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, cloud, sun } from '../../assets/nature.js';
import { bird, fish } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { ELEVEN, landMap, worldGlobe, archPlate, voiceRings, headAt, sparkle, lamb, camel, PI } from './lib.js';

const GY = 730, JX = 800;
const GR = 140, GXY = [800, 330];

export default {
  id: 'm16-world',
  beats: [
    { v: 15, text: 'I rzekł do nich:' },
    { v: 15, cont: true, text: '«Idźcie na cały świat i głoście Ewangelię wszelkiemu stworzeniu!' },
    { v: 16, text: 'Kto uwierzy i przyjmie chrzest, będzie zbawiony;' },
    { v: 16, cont: true, text: 'a kto nie uwierzy, będzie potępiony.' },
  ],
  cam: { x: [-20, 20], y: [-20, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, [C.skyBlue, mix(C.skyBlue, C.cream, 0.5), C.cream]);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 160, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1200, y: 200, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 200, speed: 50, scale: 0.5 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 520, amps: [18, 8, 3], lens: [1000, 330, 120], color: C.hillFar }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    mid.add(hillsWith(c, { y: 590, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 22 }).markup);
    const ground = S.layer({ par: 0.45, sh: 3 });
    const gy = c.wave(660, [10, 3], [900, 200]);
    ground.add(sheet().p(c.ridge((x) => gy(x) - Math.max(0, 1 - Math.abs(x - 800) / 700) * 40, -1400, 2800, 1700, 12, 1), C.hillNear).out());
    ground.add(grass(c, { x0: -900, x1: 2500, y: 640, fn: (x) => gy(x) - Math.max(0, 1 - Math.abs(x - 800) / 700) * 40, n: 60, h: 16, color: C.moss }) + olive(c, 180, 700, 1.1) + olive(c, 1460, 700, 1.0) + cypress(c, 320, 690, 140) + flowers(c, { x0: 300, x1: 1300, y: 700, fn: () => c.rr(660, 760), n: 30, h: 18 }));

    /* the map comes down, then the globe with all creation */
    const worldL = S.layer({ par: 0.4, sh: 6 });
    const mapEl = hanging(worldL, `<g transform="scale(.66)">${landMap(c)}</g>`, { x: GXY[0], y: GXY[1] - 20, len: 700 });
    const peoples = Array.from({ length: 8 }, (_, i) => {
      const o = crowdPerson(c, { skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4] });
      return `<g transform="scale(.25)">${person(c, { ...o, flip: false })}</g>`;
    });
    const beasts = [
      `<g transform="translate(0 -34) scale(.8)">${bird(c, { color: C.bird })}</g>`,
      `<g transform="translate(0 -6) scale(.6)">${lamb(c)}</g>`,
      `<g transform="scale(.26)">${camel(c)}</g>`,
      `<g transform="translate(0 -12) rotate(-30) scale(.8)">${fish(c, { color: C.lake3 })}</g>`,
      `<g transform="translate(0 2) scale(1.1)">${flowers(c, { x0: -12, x1: 12, y: 0, n: 5, h: 18 })}</g>`,
    ];
    const rimM = [peoples[0], beasts[0], peoples[1], peoples[2], beasts[1], peoples[3], beasts[4], peoples[4], beasts[2], peoples[5], beasts[3], peoples[6], peoples[7]];
    const rim = rimM.map((m, i) => ({ m, a: -PI - 0.45 + (i / (rimM.length - 1)) * (PI + 0.9) }));
    const globeEl = worldL.add(`<g>${worldGlobe(c, GR, rim)}</g>`);
    const rayEls = Array.from(globeEl.querySelectorAll('.ray'));
    const whoEls = Array.from(globeEl.querySelectorAll('.who'));

    /* the two plates */
    const plL = S.layer({ par: 0.42, sh: 6 });
    const waterBack = `<path d="${c.cut([[-40, 176], [105, 172], [105, 250], [-40, 250]], 0.6, 6)}" fill="${C.lake2}"/>`;
    const bank = `<path d="${c.cut([[-105, 186], [-50, 178], [-20, 190], [-10, 250], [-105, 250]], 0.6, 6)}" fill="${C.sand2}"/>`;
    const waterFront = `<path d="${c.cut([[-18, 214], [105, 208], [105, 250], [-18, 250]], 0.5, 6)}" fill="${C.lake}" opacity=".92"/><path d="${c.ribbon([[0, 220], [40, 218]], 2) + c.ribbon([[60, 230], [96, 228]], 2)}" fill="${C.foam}" opacity=".8"/>`;
    const beliefInner = `<g data-k="pl-sun"><circle cx="60" cy="70" r="70" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(60, 70, 20, 20), 0.3, 4)}" fill="${C.sun}"/></g>${waterBack}${bank}<g data-k="pl-glow" opacity="0"><circle r="70" fill="url(#halo-glow)"/>${sparkle(c, 18)}</g><g data-k="pl-man">${person(c, { robe: C.tealRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather })}</g>${waterFront}`;
    const plateL = hanging(plL, archPlate(S, beliefInner, { fill: mix(C.skyBlue, C.cream, 0.4), k: 'L' }), { x: 0, y: 0, len: 0 });
    const dark = mix(C.stone2, C.storm, 0.2);
    const unInner = `<path d="${c.cut([[-105, 200], [105, 200], [105, 250], [-105, 250]], 0.4, 8)}" fill="${shade(C.stone2, -0.1)}"/><path d="${c.poly(c.rect(20, 86, 62, 116))}" fill="${C.lampGlow}"/><circle cx="50" cy="150" r="80" fill="url(#warm-glow)" data-k="pr-glow"/><path d="${c.ribbon([[16, 84], [86, 84]], 7)}" fill="${C.wood2}"/><g data-k="pr-leaf" transform="translate(82 88)"><path d="${c.cut(c.rect(-62, 0, 62, 114), 0.3, 6)}" fill="${C.wood}"/><path d="${c.ribbon([[-54, 30], [-8, 30]], 3) + c.ribbon([[-54, 84], [-8, 84]], 3)}" fill="${C.wood2}"/></g><g data-k="pr-man">${person(c, { robe: C.ochreRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather })}</g><rect data-k="pr-dim" x="-110" y="-10" width="220" height="270" fill="${C.storm2}" opacity="0"/>`;
    const plateR = hanging(plL, archPlate(S, unInner, { fill: C.stone2, k: 'R' }), { x: 0, y: 0, len: 0 });
    const plMan = S.puppet(S.$('pl-man').firstElementChild), plGlow = S.$('pl-glow'), plSun = S.$('pl-sun');
    const prMan = S.puppet(S.$('pr-man').firstElementChild), prLeaf = S.$('pr-leaf'), prDim = S.$('pr-dim'), prGlow = S.$('pr-glow');

    /* Jesus and the Eleven */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const XS = [430, 505, 580, 650, 1010, 1085, 1160, 460, 560, 1050, 1140];
    const YS = [GY - 30, GY - 36, GY - 40, GY - 44, GY - 44, GY - 40, GY - 36, GY + 30, GY + 36, GY + 36, GY + 30];
    const M = ELEVEN.map((m, i) => ({ ...m, i, x: XS[i], y: YS[i], s: YS[i] > GY ? 1.02 : 0.9, flip: XS[i] > JX, seed: c.rr(0, 9) })).sort((a, b) => a.y - b.y);
    M.forEach((m) => { m.p = S.puppet(PL.add(person(c, { ...m.o }))); });
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.halo, r: 40, w: 6 });

    return (t, time) => {
      swing(cl1, 420 + Math.sin(time * 0.1) * 30, 160, time, 1.2, 0.6, 1);
      swing(cl2, 1200 + Math.sin(time * 0.12 + 1) * 30, 200, time, 1.2, 0.7, 2);
      birds(time, 1);

      /* v15a: He speaks to them; the map of the land comes down */
      const speak = es(t, 0.1, 0.4);
      const wide = es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.2));
      const left = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const right = es(t, 3.05, 3.3);
      jesus.set({
        x: JX, y: GY, s: 1.12, flip: left > 0.5,
        armF: 20 + speak * 40 + wide * 70 + left * 50 + right * 30 + Math.sin(time * 1.4) * 4 * speak, armB: 10 + speak * 20 + wide * 120 + left * 20,
        head: -speak * 4 - wide * 10 + right * 12, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(JX, GY, 1.12, false);
      voice(hx, hy, speak * (1 - es(t, 3.0, 3.3) * 0.7), time, { spread: 2.6 });
      M.forEach((m) => {
        const up = es(t, 1.2, 1.6);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 20 + up * (m.i % 2 ? 90 : 50) * (1 - es(t, 2.0, 2.4) * 0.6), armB: 10 + up * (m.i % 3 === 0 ? 120 : 30) * (1 - es(t, 2.0, 2.4) * 0.6), head: -up * 14 + es(t, 3.2, 3.6) * 10, blink: blinkAt(time, m.seed) });
      });

      const mDrop = es(t, 0.3, 0.8, ease.back) * (1 - es(t, 1.0, 1.25));
      swing(mapEl, GXY[0], lerp(-1000, GXY[1] - 20, es(t, 0.3, 0.8, ease.back)), time, 1, 0.7);
      pose(mapEl.querySelector('.obj'), { s: 1 - es(t, 1.0, 1.25) * 0.6, o: mDrop > 0.01 ? 1 : 0 });

      /* v15b: … into a whole paper globe; light to every side, all creation round the rim */
      const grow = es(t, 1.05, 1.45, ease.back);
      const up2 = es(t, 2.02, 2.35);
      pose(globeEl, { x: GXY[0], y: lerp(GXY[1], 200, up2), s: grow * (1 - up2 * 0.5), r: (t - 1) * 6, o: grow > 0.01 ? 1 : 0 });
      rayEls.forEach((r, i) => attr(r, 'stroke-dashoffset', (1 - es(t, 1.3 + i * 0.03, 1.55 + i * 0.03)).toFixed(3)));
      whoEls.forEach((w, i) => {
        const k = es(t, 1.5 + i * 0.03, 1.7 + i * 0.03, ease.back);
        attr(w, 'transform', `scale(${k.toFixed(3)})`);
      });

      /* v16a: believed and baptised — into the water, up into light */
      const pL = es(t, 2.05, 2.4, ease.out);
      swing(plateL, 545, lerp(-1000, 250, pL), time, 0.8, 0.6, 1);
      const walkIn = es(t, 2.25, 2.45), down = es(t, 2.45, 2.58), rise = es(t, 2.62, 2.8, ease.out);
      const mx = lerp(-72, 14, walkIn);
      plMan.set({ x: mx, y: lerp(186, 206, walkIn) + down * 36 - rise * 34, s: 0.4, flip: false, walk: walkIn > 0 && walkIn < 1 ? mx * 0.3 : undefined, armF: 20 + rise * 120, armB: 10 + rise * 140, head: -rise * 12, blink: blinkAt(time, 7) });
      pose(plGlow, { x: 14, y: 150, s: 0.5 + rise, r: time * 20, o: rise });
      pose(plSun, { x: 0, y: 0, o: 0.6 + rise * 0.4 });
      /* v16b: will not believe — he turns away from the lit door; it closes */
      const pR = es(t, 3.02, 3.35, ease.out);
      swing(plateR, 1055, lerp(-1000, 250, pR), time, 0.8, 0.6, 2);
      const turn = es(t, 3.3, 3.36), away = es(t, 3.36, 3.7);
      const rx = lerp(30, -64, away);
      prMan.set({ x: rx, y: 204, s: 0.4, flip: turn > 0.5, walk: away > 0 && away < 1 ? rx * 0.3 : undefined, armF: 10, armB: 6, head: 8 * turn, blink: blinkAt(time, 8) });
      const shut = es(t, 3.6, 3.85);
      pose(prLeaf, { x: 82, y: 88, sx: Math.max(0.06, shut) });
      fade(prGlow, 1 - shut);
      fade(prDim, shut * 0.45);

      S.cam.x = -left * 20 + right * 20;
      S.cam.y = 20 - es(t, 1.0, 1.5) * 30 + es(t, 2.0, 2.4) * 20;
      S.cam.z = 1.02 + es(t, 1.0, 1.5) * 0.03;
    };
  },
};
