// Mt 18,8–9 — Jesus stands where the road forks: one way climbs to a stone gate full of light on the hill (life),
// the other runs down into a far valley where a fire burns. A card comes down from the flies with a hand and a foot
// on it, each tied to a dark stone; the paper scissors snip its string and it is flung away down towards the fire.
// Better to enter life maimed or lame: a traveller with one arm in a sling and a crutch climbs the left road and goes
// in through the lit gate, while a whole, two-handed shadow walks the other way and fades into the smoke of the
// valley. Then the eye: a card with an eye, snipped and thrown away; a traveller with a patch over one eye climbs
// into life, and a second shadow goes down to the fire.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, grass, olive, cloud, cypress, bush } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { DAY, along, scissors, paperHand, paperFoot, paperEye, stumbleCard, lifeGate, firePit, crutch, eyePatch, withFace, labelOnString, shadowPerson, man, kf, tr, PI } from './lib.js';

const P = 0.42;
const GATE = [600, 446];
const LIFE = [[790, 668], [740, 636], [690, 598], [650, 548], [624, 490], [606, 452]];
const FIRE = [[820, 668], [880, 640], [950, 606], [1010, 578], [1060, 560]];
const CARD = [800, 214];
const PIT = [1090, 552];

export default {
  id: 'mt18-cut',
  beats: [
    { v: 8, text: 'Otóż jeśli twoja ręka lub noga jest dla ciebie powodem grzechu, odetnij ją i odrzuć od siebie!' },
    { v: 8, cont: true, text: 'Lepiej jest dla ciebie wejść do życia ułomnym lub chromym, niż z dwiema rękami lub dwiema nogami być wrzuconym w ogień wieczny.' },
    { v: 9, text: 'I jeśli twoje oko jest dla ciebie powodem grzechu, wyłup je i odrzuć od siebie!' },
    { v: 9, cont: true, text: 'Lepiej jest dla ciebie jednookim wejść do życia, niż z dwojgiem oczu być wrzuconym do piekła ognistego.' },
  ],
  cam: { x: [-40, 40], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, ['#c7d9d8', '#ebe3cd', '#f4e1c4']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 160), { x: 1180, y: 150, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.lavender, 0.25) }).markup);

    /* the land: the hill of life on the left, the valley of fire on the right */
    const landL = S.layer({ par: P, sh: 3 });
    const g = sheet();
    g.p(c.cut([[-900, 640], [-200, 600], [300, 520], [470, 468], [560, 444], [650, 440], [740, 470], [860, 540], [980, 580], [1200, 590], [2500, 600], [2500, 1700], [-900, 1700]], 1.2, 10), mix(C.hillNear, C.sage2, 0.4));
    g.p(c.cut([[960, 570], [1010, 548], [1170, 544], [1240, 572], [1180, 604], [1020, 604]], 0.8, 8), mix(C.soilDark, C.hillNear, 0.25));
    g.p(c.ribbon(LIFE.map(([x, y]) => [x, y + 4]), (u) => 24 - u * 14, 2), mix(C.sand, C.hillNear, 0.25));
    g.p(c.ribbon(FIRE.map(([x, y]) => [x, y + 4]), (u) => 14 - u * 8, 2), mix(C.sand2, C.hillNear, 0.35));
    g.p(c.cut([[-900, 668], [2500, 668], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.45));
    g.p(c.cut(c.ell(805, 690, 170, 26, 20), 0.8, 10), mix(C.sand, C.hillNear, 0.25));
    landL.add(g.out());
    landL.add(cypress(c, 520, 460, 90, C.moss2) + cypress(c, 690, 456, 84, C.moss2) + olive(c, 330, 540, 0.9) + bush(c, 460, 520, 60, C.sage, C.moss) + olive(c, 1400, 610, 0.9) + rock(c, 1190, 690, 60, 20) + grass(c, { x0: -600, x1: 2200, y: 676, n: 30, h: 12, color: C.olive }));
    const G = lifeGate(c, { w: 104, h: 150 });
    const gateGlow = landL.add(`<g>${G.light}</g>`);
    landL.add(`<g transform="translate(${GATE[0]} ${GATE[1]})">${G.arch}</g>`);
    const F = firePit(c, 200);
    landL.add(`<g transform="translate(${PIT[0]} ${PIT[1]})">${F.pit}</g>`);
    const flames = F.flames.map((f, i) => ({ ...f, i, el: landL.add(`<g>${f.m}</g>`) }));
    const smoke = landL.add(`<g opacity="0">${[0, 1, 2].map((i) => `<path d="${c.cut(c.blob((i - 1) * 40, -i * 30, 44, 22, 10, 0.2), 1, 6)}" fill="${mix(C.stone2, C.storm, 0.35)}" opacity="${0.6 - i * 0.12}"/>`).join('')}</g>`);
    const lifeL = hanging(landL, labelOnString(tr('życie', 'life'), { size: 20 }), { x: GATE[0], y: 0, len: 800 });

    /* the travellers into life and the shadows into the fire */
    const walkL = S.layer({ par: P, sh: 4 });
    const t1o = man(c, { robe: C.sageRobe, mantle: null, holdB: `<g transform="rotate(-10)">${crutch(c, 124)}</g>` });
    const T1 = S.puppet(walkL.add(person(c, t1o)));
    T1.el.querySelector('.armF').setAttribute('opacity', '0');
    const sling = walkL.add(`<g>${sheet().p(c.cut([[-12, -120], [14, -122], [16, -104], [-10, -100]], 0.3, 4), C.linen).out()}</g>`);
    const T2 = S.puppet(walkL.add(withFace(person(c, { ...man(c, { robe: C.roseRobe }), hairStyle: 'short' }), eyePatch(c))));
    const SH = [0, 1].map((i) => S.puppet(walkL.add(shadowPerson(c, { hairStyle: i ? 'curly' : 'short', beard: 'short' }, '#3b3148'))));

    /* Jesus at the fork */
    const front = S.layer({ par: 0.55, sh: 5 });
    const jesus = S.puppet(front.add(person(c, CAST.jesus)));

    /* the cards and the scissors, from the flies */
    const flyL = S.layer({ par: 0.2, sh: 6 });
    const handFoot = `<g transform="translate(-20 14) scale(1.1)">${paperHand(c, C.skin2)}</g><g transform="translate(-2 20) scale(.95)">${paperFoot(c)}</g>`;
    const cards = [{ i: 0, t0: 0.05, icon: handFoot }, { i: 1, t0: 2.05, icon: `<g transform="scale(1.4)">${paperEye(c, 34)}</g>` }].map((cd) => ({ ...cd, el: hanging(flyL, stumbleCard(c, cd.icon, { w: 104, h: 112 }), { x: CARD[0], y: CARD[1], len: 900 }) }));
    cards.forEach((cd) => { cd.obj = cd.el.querySelector('.obj'); });
    const sc = flyL.add(`<g opacity="0">${scissors(c, 60)}</g>`);
    const bladeA = sc.querySelector('.bA'), bladeB = sc.querySelector('.bB');

    return (t, time) => {
      const T = time;
      swing(cl1, 1180 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6);
      swing(lifeL, GATE[0], lerp(-900, 250, es(t, 0.9, 1.2, ease.back)), T, 1.2, 0.8, 5);

      /* v8a, v9a — a card comes down, the scissors snip it and it is flung away */
      let scO = 0, snip = 0;
      cards.forEach((cd) => {
        const a = cd.t0;
        const down = es(t, a, a + 0.3, ease.back);
        const fall = es(t, a + 0.48, a + 0.92);
        if (t > a - 0.1 && t < a + 1) { scO = es(t, a + 0.22, a + 0.3) * (1 - es(t, a + 0.55, a + 0.65)); snip = bump(t, a + 0.3, a + 0.48); }
        const gone = es(t, a + 0.95, a + 1.1);
        swing(cd.el, CARD[0], lerp(-900, CARD[1], down) - gone * 1300, T, 1.2 * (1 - fall), 0.8, cd.i);
        pose(cd.obj, { x: fall * 280, y: fall * 330 - Math.sin(fall * PI) * 60, r: fall * 160, s: 1 - fall * 0.45, o: 1 - es(t, a + 0.86, a + 0.98) });
      });
      pose(sc, { x: CARD[0] + 38, y: CARD[1] - 12, r: 90, o: scO });
      pose(bladeA, { r: -(1 - snip) * 22 });
      pose(bladeB, { r: (1 - snip) * 22 });

      /* v8b, v9b — one goes up into life, one goes down to the fire */
      let gateOn = 0, flare = 0;
      [[T1, 1.05, 0.5], [T2, 3.05, 0.8]].forEach(([p, a, amt]) => {
        const u = es(t, a, a + 0.72, (x) => x);
        const [x, y, dir] = along(LIFE, u);
        const inG = es(t, a + 0.68, a + 0.84);
        gateOn = Math.max(gateOn, bump(t, a + 0.55, a + 1.0));
        p.set({ x, y, s: lerp(0.66, 0.34, u), flip: dir < 0, o: es(t, a - 0.05, a + 0.02) * (1 - inG), walk: u > 0 && u < 1 ? u * 40 : undefined, amt, armB: p === T1 ? 18 : 0, head: -2, blink: blinkAt(T, 3) });
        if (p === T1) pose(sling, { x: x + (dir < 0 ? -1 : 1) * 2 * lerp(0.66, 0.34, u), y, s: lerp(0.66, 0.34, u), sx: dir < 0 ? -1 : 1, o: es(t, a - 0.05, a + 0.02) * (1 - inG) });
      });
      SH.forEach((p, i) => {
        const a = i ? 3.15 : 1.15;
        const u = es(t, a, a + 0.7, (x) => x);
        const [x, y] = along(FIRE, u);
        flare = Math.max(flare, bump(t, a + 0.5, a + 1.0));
        p.set({ x, y, s: lerp(0.64, 0.38, u), flip: false, o: es(t, a - 0.05, a + 0.02) * (1 - es(t, a + 0.5, a + 0.78)) * 0.85, walk: u > 0 && u < 1 ? u * 40 : undefined, blink: 0 });
      });
      pose(gateGlow, { x: GATE[0], y: GATE[1], s: 1 + gateOn * 0.25, o: 0.55 + gateOn * 0.45 });
      flames.forEach((f) => pose(f.el, { x: PIT[0] + f.x, y: PIT[1] + f.y, sy: 0.7 + flare * 0.5 + Math.sin(T * 6 + f.i * 1.7) * 0.12, sx: 1 + Math.sin(T * 5 + f.i) * 0.08, o: 0.9 }));
      pose(smoke, { x: PIT[0], y: PIT[1] - 40 - flare * 20, s: 0.8 + flare * 0.3, o: flare * 0.8 });

      /* Jesus: points up at the card, then to the gate */
      const up = Math.max(bump(t, 0.05, 0.95), bump(t, 2.05, 2.95));
      const toLife = Math.max(bump(t, 1.0, 1.95), bump(t, 3.0, 3.95));
      jesus.set({ x: 800, y: 732, s: 1.02, flip: toLife > 0.5, armF: 24 + up * 40 + toLife * 60, armB: 10 + up * 110, head: -up * 12 - toLife * 8, blink: blinkAt(T, 1) });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.4, -20], [2.0, 0], [3.0, 0], [3.4, -20], [4, -20]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.02], [1.4, 1.05], [2.0, 1.02], [3.0, 1.02], [3.4, 1.05]]);
    };
  },
};
