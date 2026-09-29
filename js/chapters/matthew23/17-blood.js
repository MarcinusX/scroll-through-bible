// Mt 23,35–36 — in the court at evening a long painted frieze unrolls above Jesus, from Abel to Zechariah: at its left
// end Abel kneels by his little altar with his lamb, the smoke of his offering rising straight to heaven; at its right
// end Zechariah the priest kneels, head bowed, between the sanctuary and the altar. Along the whole frieze runs a thin red
// thread, marked with small red flowers and little heaps of stones — the innocent blood, told without a wound. "All this
// will come upon this generation": the frieze rolls itself up, a dark cloud gathers over the sanctuary, the light dims,
// and Jesus speaks to the people before Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stormCloud } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, EVENING, voiceRings, pose3, folk, vain, PH, SC, pharisees, scribes, lamb, altar, templeModel, strip, TWELVE, tr, PI } from './lib.js';

const JX = 800;
const FX0 = 360, FX1 = 1240, FY = 150, FH = 220;   // the frieze
const ABEL = { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope, pose: 'kneel' };
const ZECH = { robe: C.linen, mantle: C.indigo, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, beard: 'full', skin: C.skin2, belt: C.sun, pose: 'kneel' };

export default {
  id: 'mt23-blood',
  beats: [
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-10, 10], y: [-40, 10], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S, { skyCols: EVENING, sunY: 280 });
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    stepL.sprite(pose3(c, Array.from({ length: 5 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: false, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 330, 604);
    stepL.sprite(pose3(c, Array.from({ length: 4 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: true, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 1050, 604);

    /* the storm cloud gathering over the sanctuary (v36) */
    const skyL = S.layer({ par: 0.12, sh: 5 });
    const storm = skyL.add(`<g>${stormCloud(c, 460)}</g>`);

    /* the people */
    const P = S.layer({ par: 0.5, sh: 5 });
    P.sprite(pose3(c, [TWELVE[0].o, TWELVE[2].o, TWELVE[1].o, TWELVE[3].o].map((o, i) => ({ x: -i * 62, y: (i % 2) * 10, s: 0.92, flip: false, head: -6, o }))), 600, F + 10);
    const LEAD = [[1000, PH, 0], [1080, SC, 8], [1160, pharisees(3), 2], [1240, scribes(2), 10]].map(([x, o, dy], i) => ({ x, y: F + dy, i, seed: c.rr(0, 9), p: S.puppet(P.add(vain(c, o))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 5 });

    /* the frieze: parchment strip with Abel, the red thread, Zechariah */
    const fr = S.layer({ par: 0.3, sh: 6 });
    const W = FX1 - FX0;
    const PS = S.portrait ? 0.86 : 1, X0 = 800 - (W * PS) / 2;
    const bg = sheet().p(c.cut(c.rect(0, 0, W, FH), 0.6, 10), C.wood3).p(c.cut(c.rect(10, 10, W - 20, FH - 20), 0.5, 10), mix(C.parchment, C.cream, 0.3));
    const GL = FH - 30;   // the ground line on the frieze
    bg.p(c.cut([[10, GL], [W - 10, GL - 2], [W - 10, FH - 10], [10, FH - 10]], 0.5, 10), mix(C.sand2, C.dune, 0.3));
    // Abel's altar and its straight smoke
    const abelAlt = sheet().p(c.cut([[-26, 0], [-22, -30], [22, -30], [26, 0]], 0.6, 5), C.rock2).out();
    const smoke = `<path d="${c.ribbon([[0, 0], [2, -40], [-2, -80], [1, -120]], (u) => 10 - u * 6)}" fill="#efe9df"/>`;
    const content = bg.out()
      + `<g transform="translate(120 ${GL})">${abelAlt}<g transform="translate(0 -30)">${smoke}</g></g>`
      + `<g transform="translate(72 ${GL}) scale(.62)">${person(c, ABEL)}</g>`
      + `<g transform="translate(165 ${GL}) scale(.55)">${lamb(c)}</g>`
      + `<g transform="translate(${W - 190} ${GL}) scale(.4)">${templeModel(c, 1, { glow: false })}</g>`
      + `<g transform="translate(${W - 60} ${GL}) scale(.42)">${altar(c, 150, 90)}</g>`
      + `<g transform="translate(${W - 115} ${GL}) scale(-.62 .62)">${person(c, ZECH)}</g>`
      + `<g transform="translate(95 ${FH - 16})">${strip(c, 'Abel', { size: 14 })}</g>`
      + `<g transform="translate(${W - 115} ${FH - 16})">${strip(c, tr('Zachariasz', 'Zechariah'), { size: 14 })}</g>`;
    const strings = fr.add(`<g><path d="M40 -1600V0M${W - 40} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    const frieze = fr.add(`<g>${content}</g>`);
    // the red thread, the flowers and the little heaps of stones
    let flw = '', cairn = '';
    for (let i = 0; i < 6; i++) {
      const x = 230 + i * ((W - 470) / 5);
      flw += c.cut(c.star(x, GL - 22, 7, 3, 5, c.rr(0, 6)), 0.2, 3);
      cairn += c.cut(c.blob(x + 24, GL - 4, 12, 6, 7, 0.2), 0.4, 3) + c.cut(c.blob(x + 26, GL - 11, 7, 4, 7, 0.2), 0.3, 3);
    }
    const thread = fr.add(`<g><path d="${c.ribbon(c.qbez([150, GL - 40], [W / 2, GL - 90], [W - 150, GL - 40], 30), 2.6)}" fill="${C.curtain2}"/><path d="${cairn}" fill="${C.rock2}"/><path d="${flw}" fill="${C.curtain}"/></g>`);
    set.front();
    const dim = S.layer({ par: 0, sh: 1, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night, C.plumRobe, 0.4)}"/>`);
    dim.fade(0);

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunDY: es(t, 1, 1.8) * 60 });

      /* v35 — the frieze unrolls from Abel to Zechariah; the red thread runs along it */
      const drop = es(t, 0.0, 0.2, ease.out);
      const unroll = es(t, 0.15, 0.55) * (1 - es(t, 1.05, 1.35));
      pose(frieze, { x: X0, y: lerp(-400, FY, drop), sx: Math.max(0.02, unroll) * PS, sy: PS, o: drop > 0.01 ? 1 : 0 });
      pose(strings, { x: X0, y: lerp(-400, FY, drop), sx: Math.max(0.02, unroll) * PS, sy: PS, o: drop > 0.01 ? 1 : 0 });
      const th = es(t, 0.5, 0.75) * (1 - es(t, 1.02, 1.1));
      pose(thread, { x: X0, y: lerp(-400, FY, drop), sx: th * PS, sy: PS, o: th > 0.02 ? 1 : 0 });

      /* v36 — the cloud gathers, the light dims */
      const gather = es(t, 1.1, 1.6);
      pose(storm, { x: 800, y: lerp(-200, 150, gather), s: 0.8 + gather * 0.3, o: gather > 0.01 ? 0.95 : 0 });
      dim.fade(gather * 0.28);

      const lookUp = es(t, 0.1, 0.4) * (1 - es(t, 0.95, 1.1));
      const solemn = es(t, 1.05, 1.3);
      jesus.set({ x: JX, y: F, s: 1.04, flip: lookUp > 0.5 && t < 0.6, armF: 20 + lookUp * 60 + solemn * 60, armB: 10 + lookUp * 90 + solemn * 30, head: -lookUp * 18 + solemn * 4, blink: blinkAt(T) });
      voice(JX + 28, F - 182, bump(t, 0.05, 0.9) * 0.6 + solemn * (1 - es(t, 1.85, 2)), T, { dir: 1 });
      LEAD.forEach((l) => l.p.set({ x: l.x, y: l.y, s: 0.94, flip: true, armF: 30, armB: 20, head: -lookUp * 16 + solemn * 10, lean: solemn * 3, blink: blinkAt(T, l.seed) }));

      S.cam.y = -30 + es(t, 1.0, 1.4) * 20;
      S.cam.z = 1.02;
    };
  },
};
