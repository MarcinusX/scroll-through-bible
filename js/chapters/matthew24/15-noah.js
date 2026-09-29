// Mt 24,37–39 — a painted flat flies in over the night on the Mount: the days of Noah, a warm afternoon. In front a
// feast — people at a long table eating and drinking, a wedding under a canopy, a father bringing the bride; far off on
// the hill Noah stands by his great ark and calls. "Until the day Noah entered the ark": he goes up the ramp with the
// animals two by two, and the door shuts. "They did not know until the flood came and took them all away": the sky
// goes dark, rain, the water rises over the table and the wedding — only the ark lifts and floats. "So will be the
// coming of the Son of Man": the whole flat flies up and away, and Jesus is there again on the Mount at night, with a
// little ark swinging on its string above Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging } from '../kit.js';
import { band, hillsWith, waveStrip, cloud, sun, olive, cypress, grass, flowers } from '../../assets/nature.js';
import { rain, stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, voiceRings, ark, ramp, beast, lowTable, bowl, loaf, cup, jug, canopy, tambourine, tagOnString, addToHead, folk, NOAH, tint, tr, PI } from './lib.js';
import { wreath } from '../mark2/lib.js';

const GY = 700;
const ARK = [590, 506], AS = 0.62;
const DOOR = [ARK[0] - (0.3 * 420 - 44) * AS, ARK[1] - 84 * 0.98 * AS];   // the door's hinge (the ark is drawn mirrored)
const DOORC = DOOR[0] - 18 * AS;
const RAMP0 = [DOORC + 150, DOOR[1] + 76];

export default {
  id: 'mt24-noah',
  enter: 'fly',
  beats: [
    { v: 37 },
    { v: 38 },
    { v: 39, text: 'i nie spostrzegli się, aż przyszedł potop i pochłonął wszystkich,' },
    { v: 39, cont: true, text: 'tak również będzie z przyjściem Syna Człowieczego.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    /* behind: the Mount at night, Jesus and the four (revealed at the end) */
    const NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: 0.42, moonXY: [1240, 110], templeGlow: 0.2 });
    const PM = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, PM, { tintCol: NIGHTC, tintK: 0.18 });
    const J = circ.jesus;
    const voice = voiceRings(PM, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });
    const memL = S.layer({ par: 0.3, sh: 5 });
    const memArk = ark(c, 420);
    const smallArk = memL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-80" stroke="rgba(230,210,180,.5)" stroke-width="1.2"/><circle cy="-30" r="90" fill="url(#warm-glow)"/><g transform="scale(.36)">${memArk.body}<g transform="translate(${memArk.doorAt[0]} ${memArk.doorAt[1]})">${memArk.door}</g></g></g>`);

    /* the flat: the days of Noah */
    const F = [];
    const clothL = S.layer({ par: 0.04, sh: 3 }); F.push(clothL);
    const DAYC = ['#c7dcd6', '#f1e6c6', '#f6e3c0'];
    const cloth = sheet();
    cloth.p(c.cut([[-1400, -1400], [3000, -1400], [3000, 900], [-1400, 900]], 0.3, 30), mix(DAYC[0], DAYC[1], 0.45));
    cloth.x(c.cut([[-1400, 300], [3000, 300], [3000, 900], [-1400, 900]], 0.3, 30), DAYC[2], 'opacity=".8"');
    clothL.add(cloth.out());
    clothL.add(`<g transform="translate(1250 170)">${sun(c, 44)}</g><g transform="translate(420 160)">${cloud(c, 190)}</g><g transform="translate(820 110)">${cloud(c, 140)}</g>`);
    const stormL = S.layer({ par: 0.04, sh: 2 }); F.push(stormL);
    stormL.add(sheet().p(c.cut([[-1400, -1400], [3000, -1400], [3000, 900], [-1400, 900]], 0.3, 30), mix(C.storm2, C.night2, 0.3)).out() + `<g transform="translate(400 160)">${stormCloud(c, 620, C.storm, C.storm2)}</g><g transform="translate(1100 120)">${stormCloud(c, 700, C.storm, C.storm2)}</g>`);
    stormL.fade(0);

    const hillL = S.layer({ par: 0.12, sh: 3 }); F.push(hillL);
    hillL.add(hillsWith(c, { y: 470, amps: [16, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 20, x0: -1400, x1: 3000 }).markup);
    const arkHill = sheet().p(c.cut([[130, 900], [220, 560], [370, 520], [590, 508], [770, 516], [930, 560], [1030, 900]], 1.2, 10), mix(C.hillMid, C.sand2, 0.35)).out();
    hillL.add(arkHill);
    const arkL = S.layer({ par: 0.14, sh: 5 }); F.push(arkL);
    const A = ark(c, 420);
    const arkEl = arkL.add(`<g transform="translate(0 -1500)"><g transform="scale(${-AS} ${AS})">${A.body}</g></g>`);
    const doorEl = arkL.add(`<g transform="translate(0 -1500)"><g transform="scale(${-AS} ${AS})">${A.door}</g></g>`);
    const rampEl = arkL.add(`<g transform="translate(0 -1500)"><g transform="scale(-1 1)">${ramp(c, 150, 76)}</g></g>`);
    const noah = S.puppet(arkL.add(person(c, NOAH)));
    const wife = S.puppet(arkL.add(person(c, { robe: C.sageRobe, mantle: C.stone, hairStyle: 'veil', veil: C.linen2, skin: C.skin2, belt: C.rope })));
    const BEASTS = [['sheep'], ['sheep'], ['ox'], ['ox'], ['bird', C.bird], ['bird', C.ochre]].map(([k, col], i) => ({ i, el: arkL.add(`<g transform="translate(0 -1500)">${beast(c, k, col)}</g>`) }));
    const tag = arkL.add(`<g transform="translate(0 -1500)">${tagOnString(tr('Noe', 'Noah'), { size: 18, len: 300, dx: 0, dy: 40 })}</g>`);

    const G = S.layer({ par: 0.4, sh: 3 }); F.push(G);
    const gfn = c.wave(620, [6, 2], [700, 170]);
    G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out() + grass(c, { x0: -800, x1: 2400, y: 620, fn: gfn, n: 40, h: 13, color: C.olive }) + flowers(c, { x0: 300, x1: 1300, y: 660, n: 20, fn: (x) => gfn(x) + 30 }) + olive(c, 200, 640, 1) + cypress(c, 1380, 640, 160));

    /* the feast and the wedding */
    const P = S.layer({ par: 0.45, sh: 5 }); F.push(P);
    const DINERS = [470, 550, 630, 710].map((x, i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...folk(c), pose: 'sit', holdF: `<g transform="translate(0 4) rotate(-80)">${cup(c)}</g>` }))) }));
    const tableEl = P.add(`<g transform="translate(0 -1500)">${lowTable(c, 380, 44)}<g transform="translate(-120 -44)">${bowl(c, { w: 34, food: 'fruit' })}</g><g transform="translate(-30 -44)">${loaf(c, 18)}</g><g transform="translate(60 -44)">${bowl(c, { w: 34, food: 'stew' })}</g><g transform="translate(130 -44)">${loaf(c, 15)}</g></g>`);
    const pourer = S.puppet(P.add(person(c, { ...folk(c, true), holdF: `<g transform="translate(0 2) rotate(-40)">${jug(c)}</g>` })));
    const posts = P.add(`<g transform="translate(0 -1500)">${sheet().p(c.cut(c.rect(870, 460, 7, 240), 0.3, 6) + c.cut(c.rect(1083, 460, 7, 240), 0.3, 6), C.wood2).out()}<g transform="translate(980 456)">${canopy(c, 240, 34)}</g></g>`);
    const GROOM = { robe: C.linen, mantle: C.dustyBlue, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.ochre };
    const groom = S.puppet(P.add(person(c, GROOM)));
    const bride = S.puppet(P.add(addToHead(person(c, { robe: C.linen, mantle: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin, belt: C.ochre }), wreath(c))));
    const father = S.puppet(P.add(person(c, { robe: C.plumRobe, mantle: C.stone, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin2 })));
    const girl = S.puppet(P.add(person(c, { ...folk(c, false), holdB: `<g transform="translate(0 4)">${tambourine(c)}</g>` })));

    /* the flood: rain and the rising water */
    const rainL = S.layer({ par: 0.5, sh: 1, flat: true, pad: 400 }); F.push(rainL);
    rainL.add(rain(c, { x0: -1400, x1: 3000, y0: -900, y1: 1700, n: 520, slant: -30, color: '#dfe6f0' }));
    rainL.fade(0);
    const waterL = S.layer({ par: 0.46, sh: 4, pad: 900 }); F.push(waterL);
    waterL.add(waveStrip(c, { y: 560, len: 140, amp: 12, color: C.waveStorm, crest: C.foam, x0: -1400, x1: 3000, bottom: 2600 }) + waveStrip(c, { y: 620, len: 110, amp: 10, color: C.waveStorm2, crest: C.foam, x0: -1400, x1: 3000, bottom: 2600 }));

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 800, sunO: 0, moon: 110, moonO: 1, glow: 0.2, starsO: 1 });

      /* v37 — Noah by the ark, calling (the tag) */
      const call = es(t, 0.2, 0.45) * (1 - es(t, 1.05, 1.2));
      const tg = es(t, 0.15, 0.45, ease.back) * (1 - es(t, 1.4, 1.7));
      pose(tag, { x: RAMP0[0] + 20, y: lerp(-300, RAMP0[1] - 250, tg), r: Math.sin(T * 1.1) * 2, o: tg > 0.01 ? 1 : 0 });

      /* v38 — up the ramp, two by two; the door shuts */
      const board = (u) => [lerp(RAMP0[0], DOORC, u), lerp(RAMP0[1], DOOR[1], u)];
      BEASTS.forEach((b) => {
        const u = seg(t, 1.05 + b.i * 0.07, 1.45 + b.i * 0.07);
        const [x, y] = u > 0 ? board(u) : [RAMP0[0] + 50 + b.i * 24, RAMP0[1] + 8];
        pose(b.el, { x, y: y - (b.i >= 4 ? 30 + (T ? Math.sin(T * 6 + b.i) * 3 : 0) : 0), s: 0.6, sx: -1, o: u < 0.96 ? 1 : 0 });
      });
      const nu = seg(t, 1.45, 1.75), wu = seg(t, 1.4, 1.7);
      const [nx, ny] = nu > 0 ? board(nu) : [RAMP0[0] + 14, RAMP0[1]];
      noah.set({ x: nx, y: ny, s: 0.46, flip: nu > 0, o: nu < 0.96 ? 1 : 0, walk: nu > 0 && nu < 1 ? nx * 0.2 : undefined, armB: call * 150, armF: 30 + call * 40, blink: blinkAt(T, 5) });
      const [wx, wy] = wu > 0 ? board(wu) : [RAMP0[0] + 46, RAMP0[1] + 4];
      wife.set({ x: wx, y: wy, s: 0.44, flip: true, o: wu < 0.96 ? 1 : 0, walk: wu > 0 && wu < 1 ? wx * 0.2 : undefined, armF: 20, blink: blinkAt(T, 6) });
      const shut = es(t, 1.78, 1.92);
      const flood = es(t, 2.1, 2.7);
      const floatY = -es(t, 2.35, 2.8) * 30 + (T ? Math.sin(T * 1.3) * 3 : 0) * es(t, 2.4, 2.8);
      const rock = (T ? Math.sin(T * 1.1) : 0) * 2.5 * es(t, 2.4, 2.8);
      pose(arkEl, { x: ARK[0], y: ARK[1] + floatY, r: rock });
      pose(doorEl, { x: DOOR[0], y: DOOR[1] + floatY, r: rock, sx: Math.max(0.12, shut), o: 1 });
      pose(rampEl, { x: RAMP0[0], y: RAMP0[1], o: 1 - es(t, 1.95, 2.1) });

      /* the feast and the wedding go on */
      const feast = seg(t, 0.0, 2.2);
      const lookUp = es(t, 2.12, 2.3);
      const under = es(t, 2.4, 2.58);
      DINERS.forEach((d) => {
        const lift = T ? Math.max(0, Math.sin(t * 7 + d.i * 1.7)) : 0.6;
        d.p.set({ x: d.x, y: GY, s: 0.84, flip: d.i >= 2, o: 1 - under, armF: (40 + lift * 70 * (feast < 1 ? 1 : 0)) * (1 - lookUp) + lookUp * 120, armB: lookUp * 80, head: -lookUp * 14 + (d.i % 2 ? 4 : -2), blink: blinkAt(T, d.seed) });
      });
      pourer.set({ x: 800, y: GY + 4, s: 0.9, flip: true, o: 1 - under, armF: 70 + Math.sin(t * 5) * 10 * (1 - lookUp) + lookUp * 50, head: -lookUp * 12 + 6, blink: blinkAt(T, 3) });
      pose(tableEl, { x: 590, y: GY + 12, o: 1 - under });
      pose(posts, { x: 0, y: 0, o: 1 - under });
      const give = es(t, 1.05, 1.5);
      father.set({ x: lerp(1180, 1070, give), y: GY + 2, s: 0.9, flip: true, o: 1 - under, walk: give > 0 && give < 1 ? give * 30 : undefined, armF: 60 + lookUp * 40, head: -lookUp * 10, blink: blinkAt(T, 7) });
      bride.set({ x: lerp(1110, 1010, give), y: GY + 4, s: 0.88, flip: true, o: 1 - under, walk: give > 0 && give < 1 ? give * 30 + 1 : undefined, armF: 30 + give * 40, armB: lookUp * 120, head: 4 - lookUp * 14, blink: blinkAt(T, 8) });
      groom.set({ x: 950, y: GY + 4, s: 0.92, o: 1 - under, armF: 30 + give * 45, armB: lookUp * 100, head: -lookUp * 12, blink: blinkAt(T, 9) });
      const shake = Math.sin(t * 22) * (feast < 1 ? 1 : 0);
      girl.set({ x: 1150, y: GY + 10, s: 0.74, flip: true, o: 1 - under, armB: 130 + shake * 20 - lookUp * 30, armF: 60 + lookUp * 50, bob: Math.abs(shake) * -4, head: -lookUp * 12, blink: blinkAt(T, 10) });

      /* v39a — the storm, the rain, the flood */
      stormL.fade(es(t, 2.0, 2.3));
      rainL.fade(es(t, 2.1, 2.3) * (1 - es(t, 3.0, 3.2)));
      rainL.shift(T ? ((T * 90) % 300) * -0.5 : 0, T ? (T * 500) % 600 - 300 : 0);
      waterL.shift((T ? Math.sin(T * 0.7) * 30 : 0) + t * 40, lerp(700, -40, flood));

      /* v39b — the flat flies out; He is there on the Mount */
      const fly = es(t, 3.0, 3.45, ease.in);
      F.forEach((L, i) => { const sx = L.sx || 0, sy = L.sy || 0; L.shift(L === waterL || L === rainL ? sx : 0, (L === waterL || L === rainL ? sy : 0) - fly * (1200 + i * 60)); });
      [clothL, stormL, hillL, arkL, G, P, rainL, waterL].forEach((L) => { if (L !== stormL && L !== rainL) L.fade(1 - es(t, 3.3, 3.5)); });
      if (t > 3.3) { stormL.fade(es(t, 2.0, 2.3) * (1 - es(t, 3.3, 3.5))); rainL.fade(0); }

      const speak = es(t, 3.35, 3.55);
      J.set({ x: JX, y: JY, s: circ.s, armB: 10 + speak * 130, armF: 25 + speak * 50, head: -speak * 6 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, speak, T, { s0: 0.7 });
      circ.four.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, lean: m.dir * 3, head: -8 - speak * 6, blink: blinkAt(T, m.seed) }));
      const sa = es(t, 3.4, 3.7, ease.back);
      pose(smallArk, { x: 1040, y: lerp(-300, 236, sa) + Math.sin(T * 0.9) * 3, r: Math.sin(T * 0.8) * 3, o: sa > 0.01 ? 1 : 0 });

      S.cam.y = -es(t, 1.0, 1.4) * 20 * (1 - es(t, 2.0, 2.4)) + es(t, 3.3, 3.7) * 10;
      S.cam.x = es(t, 1.0, 1.4) * 25 * (1 - es(t, 2.0, 2.4));
    };
  },
};
