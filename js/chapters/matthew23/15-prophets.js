// Mt 23,29–32 — the seventh woe, a painted flat in the Kidron valley among the monuments of the prophets. The scribe and
// the Pharisee build a new one, course by course, lower its stone cap and hang it with garlands. "If we had lived in the
// days of our fathers…": a lit paper screen comes down and in shadow-play the fathers lift stones against a kneeling
// prophet — the two shake their heads at it. "So you testify that you are their sons": their own shadows appear on the
// screen among the fathers, the same shape, stones in hand. "Fill up, then, the measure of your fathers": the screen
// flies away and a tall measuring jar comes down; a dark tide rises to its brim and spills over.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, rock, olive } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, PH, SC, woeDrop, monument, measureJar, garland, bubble, shadowPerson, bakeArms, cityWall, hang2, tr, PI } from './lib.js';
import { shadowScreen } from '../mark13/lib.js';

const GY = 650;
const MX0 = 540;                // the new monument
const SX0 = 1010, SY0 = 170, SW = 380, SH = 260;   // the shadow screen (top centre)
const INK = '#3b2a22';

export default {
  id: 'mt23-prophets',
  enter: 'fly',
  beats: [
    { v: 29, text: 'Biada wam, uczeni w Piśmie i faryzeusze, obłudnicy!' },
    { v: 29, cont: true, text: 'Bo budujecie groby prorokom i zdobicie grobowce sprawiedliwych,' },
    { v: 30 },
    { v: 31 },
    { v: 32 },
  ],
  cam: { x: [-10, 40], y: [-30, 10], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    // phone: the monument and its builders move right (the scribe stood off the left edge), the shadow screen comes
    // left out from under the progress thread and hangs a little higher, clear of the Pharisee's speech bubble
    const PH_ = S.portrait;
    const JR = PH_ ? 945 : SX0 + 10;   // the measuring jar (phone: where it stood before the screen moved)
    const MX = PH_ ? 625 : MX0, SX = PH_ ? 910 : SX0, SY = PH_ ? 110 : SY0;
    sky(S, ['#d6ddd2', '#efe3c6', '#f4d9b0']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 38), { x: 1230, y: 130, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 380, y: 140, len: 800 });
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(`<g>${cityWall(c, -300, 1900, 360, 410, { towers: [{ x: 200 }, { x: 640 }, { x: 1100 }, { x: 1560 }] })}${band(c, { y: 392, amps: [10, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.dune, 0.3) }).markup}</g>`);
    const mid = S.layer({ par: 0.16, sh: 3 });
    const m1 = monument(c, 'cone', 110, 120), m2 = monument(c, 'pyr', 120, 110);
    mid.add(`<g>${band(c, { y: 500, amps: [12, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.sand, 0.35) }).markup}<g transform="translate(250 540)">${m1.base}<g transform="translate(0 -124)">${m1.cap}</g></g><g transform="translate(1340 548)">${m2.base}<g transform="translate(0 -114)">${m2.cap}</g></g>${olive(c, 120, 540, 0.6)}${olive(c, 1480, 548, 0.6)}</g>`);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-900, GY - 8], [2500, GY - 12], [2500, 1700], [-900, 1700]], 1, 16), mix(C.sand, C.rock, 0.3)).out() + grass(c, { x0: -700, x1: 2300, y: GY - 8, n: 24, h: 12, color: C.olive }) + rock(c, 1250, GY + 12, 80, 26, C.rock2));

    /* the new monument, built course by course; its cap; garlands */
    const P = S.layer({ par: 0.35, sh: 5 });
    const M = monument(c, 'pyr', 150, 150);
    const base = P.add(`<g>${M.base}</g>`);
    const cap = P.add(`<g>${M.cap}</g>`);
    const gar = P.add(`<g>${garland(c, 170, 26)}</g>`);
    const wreath = P.add(`<g><path d="${c.ribbon(c.arc(0, 0, 22, 22, 0, PI * 2, 20), 7)}" fill="${C.moss}"/><path d="${c.cut(c.star(0, 22, 6, 3, 5), 0.2, 3) + c.cut(c.star(-18, 12, 5, 2.4, 5), 0.2, 3) + c.cut(c.star(18, 12, 5, 2.4, 5), 0.2, 3)}" fill="${C.jesusMantle}"/></g>`);

    /* the shadow screen with the fathers stoning a prophet — and later their sons among them */
    const scr = S.layer({ par: 0.3, sh: 5 });
    const shade_ = mix(INK, C.plumRobe, 0.15);
    const father = (i) => bakeArms(shadowPerson(c, { robe: INK, hairStyle: ['wrap', 'short', 'curly'][i], beard: 'full', mantle: i === 1 ? INK : null }, shade_), 150, 30);
    const prophet = shadowPerson(c, { robe: INK, hairStyle: 'wild', beard: 'wild', pose: 'kneel' }, shade_);
    const stoneD = c.cut(c.blob(0, 0, 7, 6, 7, 0.2), 0.4, 3);
    const inner = `${shadowScreen(c, SW, SH)}${[0, 1, 2].map((i) => `<g transform="translate(${-110 + i * 55} ${SH - 12}) scale(.62)">${father(i)}</g>`).join('')}<g transform="translate(${120} ${SH - 12}) scale(-.62 .62)">${bakeArms(prophet, 120, 150)}</g>`;
    const screen = scr.add(`<g>${inner}</g>`);
    const stones = [0, 1, 2].map((i) => ({ i, el: scr.add(`<g><path d="${stoneD}" fill="${shade_}"/></g>`) }));
    const sons = [PH, SC].map((o, i) => ({ i, el: scr.add(`<g>${bakeArms(shadowPerson(c, o, shade_), 150, 30)}</g>`) }));

    /* the jar of the measure, from the flies */
    const jarL = S.layer({ par: 0.3, sh: 5 });
    const jar = jarL.add(`<g>${hang2(measureJar(c, 220, 120), 30, 900).replace('<g class="obj">', '<g class="obj" transform="translate(0 220)">')}</g>`);
    const tide = jarL.add(`<g><path d="${c.cut([...c.arc(0, 0, 54, 26, Math.PI, 2 * Math.PI, 14), ...c.arc(0, 0, 54, 8, 0, Math.PI, 10)], 0.6, 5)}" fill="${mix(C.curtain2, C.soilDark, 0.45)}"/></g>`);
    const spills = [-1, 1].map((d) => ({ d, el: jarL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [d * 14, 40], [d * 8, 200], 12), (u) => 18 - u * 6)}" fill="${mix(C.curtain2, C.soilDark, 0.45)}"/></g>`) }));
    const pool = jarL.add(`<g><path d="${c.cut(c.blob(0, 0, 110, 12, 14, 0.2), 0.6, 5)}" fill="${mix(C.curtain2, C.soilDark, 0.45)}"/></g>`);

    /* the builders */
    const Q = S.layer({ par: 0.4, sh: 5 });
    const phar = S.puppet(Q.add(vain(c, PH)));
    const scribe = S.puppet(Q.add(vain(c, SC)));
    const say = Q.add(`<g>${bubble(c, tr(['Gdybyśmy żyli za dni ojców,', 'nie bylibyśmy ich wspólnikami!'], ['Had we lived in our fathers’ days,', 'we would have had no part in it!']), { size: 17, tail: -1 })}</g>`);
    const woe = woeDrop(Q, c, 7, { x: PH_ ? 1030 : 1230, y: 150 });   // phone: the woe-tag inside the screen

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 130 + es(t, 3, 5) * 80, T, 1, 0.6);
      swing(cl, 380 + (T ? Math.sin(T * 0.1) * 20 : 0), 140, T, 1.2, 0.7, 1);
      woe(es(t, 0.02, 0.25, ease.out) * (1 - es(t, 0.9, 1.05)), T);

      /* v29 — built course by course, capped, garlanded */
      const build = es(t, 0.2, 0.9);
      const courses = Math.min(1, Math.ceil(build * 5 - 0.001) / 5);
      pose(base, { x: MX, y: GY - 6, sy: Math.max(0.001, courses), o: build > 0 ? 1 : 0 });
      const capK = es(t, 1.05, 1.3, ease.out);
      pose(cap, { x: MX, y: lerp(-300, GY - 160, capK), o: capK > 0.01 ? 1 : 0 });
      const gk = es(t, 1.35, 1.55, ease.back);
      pose(gar, { x: MX - 85, y: GY - 150, sx: gk, sy: 1, o: gk > 0.02 ? 1 : 0 });
      const wk = es(t, 1.5, 1.7, ease.back);
      pose(wreath, { x: MX, y: GY - 100, s: wk, o: wk > 0.02 ? 1 : 0 });
      const lift = bump(t, 0.2, 0.9);
      scribe.set({ x: MX - (PH_ ? 108 : 150), y: GY + 4, s: 0.96, armF: 40 + lift * 50 + bump(t, 1.35, 1.7) * 60, armB: 20 + lift * 60, lean: lift * 6, head: -6 - es(t, 1.7, 1.9) * 8, blink: blinkAt(T, 3) });

      /* v30 — the screen: the fathers stone a prophet; the Pharisee disowns them */
      const scrIn = es(t, 1.95, 2.25, ease.out) * (1 - es(t, 4.0, 4.25, ease.in));
      pose(screen, { x: SX, y: lerp(-500, SY, scrIn) - es(t, 4.0, 4.25, ease.in) * 300, o: scrIn > 0.01 ? 1 : 0 });
      stones.forEach((s) => {
        const k = t > 2.2 && t < 4 ? ((t - 2.2) * 1.6 + s.i / 3) % 1 : 0;
        const x0 = SX - 110 + s.i * 55 + 20, x1 = SX + 110;
        pose(s.el, { x: lerp(x0, x1, k), y: SY + SH - 110 - Math.sin(k * PI) * 50 + (lerp(0, 60, k)), o: scrIn > 0.9 && t > 2.25 && t < 3.95 ? 1 : 0 });
      });
      const sk = es(t, 3.1, 3.35);
      sons.forEach((s) => pose(s.el, { x: SX - 165 + s.i * 225, y: SY + SH - 12 - (1 - scrIn) * 800, s: 0.62, sx: 1, sy: 1, o: sk * scrIn }));
      const disown = bump(t, 2.3, 2.98);
      const startle = bump(t, 3.2, 3.95);
      const pour = bump(t, 4.3, 4.95);
      const pxw = es(t, 1.8, 2.2);
      const px = lerp(MX + (PH_ ? 150 : 170), PH_ ? 815 : 780, pxw);
      phar.set({
        x: px, y: GY + 6, s: 1, flip: false, walk: pxw > 0.02 && pxw < 0.98 ? px * 0.05 : undefined,
        armF: 30 + bump(t, 0.3, 1.7) * 30 + disown * 70 + startle * 40, armB: 10 + disown * 30 + startle * 90 + pour * 40, head: -6 - bump(t, 1.5, 1.9) * 10 + (T ? Math.sin(T * 7) * 6 * disown : 0) + startle * 10, lean: -startle * 8, blink: blinkAt(T, 5),
      });
      const b = es(t, 2.3, 2.45, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(say, { x: PH_ ? 790 : 760, y: GY - 205, s: b, o: b > 0.02 ? 1 : 0 });

      /* v32 — the measure fills to the brim and spills over */
      const jk = es(t, 4.05, 4.3, ease.out);
      pose(jar, { x: JR, y: lerp(-900, GY - 214, jk), o: jk > 0.01 ? 1 : 0 });
      const fill = es(t, 4.35, 4.6);
      pose(tide, { x: JR, y: GY - 214, sx: 0.4 + fill * 0.6, sy: 0.2 + fill * 0.8, o: fill > 0.02 ? 1 : 0 });
      const over = es(t, 4.55, 4.85);
      spills.forEach((sp) => pose(sp.el, { x: JR + sp.d * 52, y: GY - 212, sx: 1, sy: Math.max(0.001, over), o: over > 0.02 ? 1 : 0 }));
      pose(pool, { x: JR, y: GY + 2, sx: over, sy: 1, o: over > 0.02 ? 1 : 0 });

      S.cam.x = 20 + es(t, 1.9, 2.3) * 20;
      S.cam.z = 1.03;
      S.cam.y = -10;
    };
  },
};
