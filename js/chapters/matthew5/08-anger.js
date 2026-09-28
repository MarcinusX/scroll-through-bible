// Mt 5,21–22 — a painted flat: the square inside a town gate, where the elders sit to judge. "You have heard it
// was said to the ancients, You shall not murder": the old stone tablet comes down (the scene still in old
// sepia), and the elders raise the scales of judgment. "But I tell you": the tablet goes up and the answer comes
// down in gold. Two brothers: one grows angry — a storm cloud gathers over his head, and the elders' scales turn
// towards him. He shouts "Raka!" — and a plate of the Great Council comes down. He shouts "You fool!" — and far
// off, beyond the hill, the fire of Gehenna flares up.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, cypress, olive, grass, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, oldTablet, goldAnswer, say, greyCloud, firePit, picture, tagWord, folk, sep, tr, PI, STRING } from './lib.js';

const G = 670;
const COURT = [520, G - 30];
const AX = 740, BX = 960;

/** a small pair of scales; origin: the pivot on top of its post (post hangs below) */
function scales(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-3, 0, 6, 70), 0.2, 4), C.wood2).p(c.cut(c.ell(0, 72, 16, 4, 10), 0.2, 3), C.wood2);
  return s.out();
}
function scaleBeam(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-50, -3, 100, 6), 0.2, 4), C.sun);
  s.x('M-46 0L-58 30M-46 0L-34 30M46 0L34 30M46 0L58 30', 'none', `stroke="${STRING}" stroke-width="1"`);
  s.p(c.cut(c.arc(-46, 30, 14, 7, 0, PI, 8), 0.2, 3) + c.cut(c.arc(46, 30, 14, 7, 0, PI, 8), 0.2, 3), C.sun);
  return s.out();
}

export default {
  id: 'mt5-anger',
  enter: 'fly',
  beats: [
    { v: 21 },
    { v: 22, text: 'A Ja wam powiadam: Każdy, kto się gniewa na swego brata, podlega sądowi.' },
    { v: 22, cont: true, text: 'A kto by rzekł swemu bratu: Raka, podlega Wysokiej Radzie.' },
    { v: 22, cont: true, text: 'A kto by mu rzekł: "Bezbożniku", podlega karze piekła ognistego.' },
  ],
  cam: { x: [-30, 60], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKY.gold);
    /* the valley of Gehenna far off to the right, beyond a hill */
    const farL = S.layer({ par: 0.08, sh: 2 });
    farL.add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.3), x0: -1400, x1: 3000 }).markup);
    const fireL = S.layer({ par: 0.12, sh: 3 });
    const F = firePit(c, 220);
    const pit = fireL.add(`<g>${F.pit}</g>`);
    const flames = F.flames.map((f, i) => ({ ...f, i, el: fireL.add(`<g>${f.m}</g>`) }));
    const smoke = fireL.add(`<g>${[0, 1, 2].map((i) => `<path d="${c.cut(c.blob(i * 30 - 30, -i * 40, 40, 22, 10, 0.2), 0.8, 6)}" fill="${mix(C.storm, C.stone2, 0.4)}" opacity=".6"/>`).join('')}</g>`);
    const hillF = S.layer({ par: 0.16, sh: 3 });
    const hf = hillsWith(c, { y: 540, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.3), trees: 12, treeColor: C.olive, treeH: 18, x0: -1400, x1: 3000 });
    hillF.add(hf.markup);
    const gTag = hillF.add(`<g>${tagWord(c, tr('Gehenna', 'Gehenna'), { size: 17 })}</g>`);

    /* the town wall with its gate and the elders' bench */
    const town = S.layer({ par: 0.3, sh: 4 });
    const w = sheet();
    w.p(c.cut([[-1400, 380], [700, 380], [700, G], [-1400, G]], 0.8, 14) + c.hole([[360, G], [360, 480], ...c.arc(440, 480, 80, 70, PI, 2 * PI, 12), [520, 480], [520, G]], 0.5, 8), mix(C.stone, C.sand2, 0.35));
    let bl = '';
    for (let y = 392, r = 0; y < G - 20; y += 36, r++) for (let x = -300 + (r % 2) * 40; x < 690; x += 84) { if (x > 340 && x < 540 && y > 400) continue; bl += c.cut(c.rect(x, y, 76, 30), 0.5, 8); }
    w.x(bl, shade(C.stone, -0.08), 'opacity=".7"');
    let crenel = '';
    for (let x = -300; x < 700; x += 44) crenel += c.cut(c.rect(x, 356, 28, 26), 0.4, 6);
    w.p(crenel, mix(C.stone, C.sand2, 0.35));
    town.add(w.out() + house(c, 760, 600, 110, 80, { stairs: false }) + olive(c, 1300, 640, 0.9) + cypress(c, 1220, 630, 120));
    town.add(sheet().p(c.cut([[-1400, G - 8], [3000, G - 12], [3000, 1800], [-1400, 1800]], 0.8, 14), mix(C.sand, C.stone, 0.35)).out() + grass(c, { x0: 700, x1: 2200, y: G - 8, n: 20, h: 10, color: C.olive }));
    town.add(`<g transform="translate(${COURT[0]} ${G + 4})">${sheet().p(c.cut(c.rect(-150, -40, 300, 40), 0.5, 8), C.wood).p(c.cut(c.rect(-156, -46, 312, 10), 0.4, 8), C.wood2).out()}</g>`);

    /* the elders at the gate, their scales */
    const P = S.layer({ par: 0.34, sh: 5 });
    const EL = [-100, 0, 100].map((dx, i) => ({ dx, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...LOOK.elder, mantle: [C.tealRobe, C.plumRobe, C.dustyBlue][i], pose: 'sit' }))) }));
    const post = P.add(`<g>${scales(c)}</g>`);
    const beamS = P.add(`<g>${scaleBeam(c)}</g>`);
    /* the two brothers */
    const A = S.puppet(P.add(person(c, LOOK.brotherA)));
    const B = S.puppet(P.add(person(c, LOOK.brotherB)));
    const storm = P.add(`<g>${greyCloud(c, 110)}</g>`);
    const bolt = P.add(`<g><path d="${c.ribbon([[0, 0], [-8, 14], [4, 16], [-6, 34]], 3)}" fill="${C.lampFlame}"/></g>`);
    const raka = P.add(`<g>${say(c, 'Raka!', { size: 24, jag: true, fill: mix(C.cream, C.peach, 0.3), ink: C.terracotta, bold: true })}</g>`);
    const fool = P.add(`<g>${say(c, tr('Bezbożniku!', 'You fool!'), { size: 22, jag: true, fill: mix(C.peach, C.dusk, 0.4), ink: C.soilDark, bold: true })}</g>`);

    /* the old wash, the tablet, the answer, the council */
    const wash = S.layer({ par: 0, sh: 1, flat: true });
    wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#c9ae86"/>`);
    const fly = S.layer({ par: 0.3, sh: 6 });
    const tab = fly.add(`<g>${oldTablet(c, tr(['Nie zabijaj!'], ['You shall not murder']), { w: 300, size: 28 })}</g>`);
    const ans = fly.add(`<g>${goldAnswer(c, tr('A Ja wam powiadam', 'But I tell you'), { size: 24 })}</g>`);
    const councilIn = (() => {
      const W = 340, H = 170;
      const s = sheet().p(c.poly(c.rect(-W / 2 - 10, -H / 2 - 10, W + 20, H + 20)), mix(C.plaster, C.parchment, 0.4));
      let cols = '';
      [-140, -70, 0, 70, 140].forEach((x) => { cols += c.cut(c.rect(x - 8, -H / 2, 16, H), 0.3, 6); });
      s.p(cols, mix(C.stone, C.plaster2, 0.3)).p(c.cut([[-W / 2, 30], [W / 2, 30], [W / 2, H / 2 + 10], [-W / 2, H / 2 + 10]], 0.5, 8), mix(C.wood3, C.sand2, 0.4));
      let men = '';
      [[-130, 40, 0.34, false], [-86, 22, 0.3, false], [-44, 12, 0.28, false], [0, 8, 0.3, false], [44, 12, 0.28, true], [86, 22, 0.3, true], [130, 40, 0.34, true]].forEach(([x, y, s_, f], i) => {
        men += `<g transform="translate(${x} ${y + 30}) scale(${f ? -s_ : s_} ${s_})">${person(c, { ...LOOK.elder, mantle: [C.tealRobe, C.plumRobe, C.dustyBlue, C.curtain][i % 4], pose: 'sit' })}</g>`;
      });
      return s.out() + men;
    })();
    const council = fly.add(`<g>${picture(c, S.id('council'), 340, 170, councilIn)}</g>`);
    const cTag = fly.add(`<g>${tagWord(c, tr('Wysoka Rada', 'the council'), { size: 18, len: 20 })}</g>`);

    return (t, time) => {
      const T = time;

      /* v21 — the old saying (sepia); the elders hold up the scales of judgment */
      wash.fade(0.34 * (1 - es(t, 0.9, 1.25)));
      const tk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 1.0, 1.25));
      pose(tab, { x: 800, y: lerp(-500, 150, tk) - es(t, 1.0, 1.25) * 300, r: Math.sin(T * 0.8) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const judge = es(t, 0.35, 0.6);
      EL.forEach((e) => e.p.set({ x: COURT[0] + e.dx, y: G, s: 0.92, flip: e.dx > 0, armF: 20 + (e.i === 1 ? judge * 70 : 0), armB: e.i === 1 ? judge * 30 : 0, head: -4 + es(t, 1.2, 1.5) * 6, blink: blinkAt(T, e.seed) }));
      const tilt = es(t, 1.4, 1.62) * 14 * (1 - es(t, 2.0, 2.2) * 0.3);
      pose(post, { x: COURT[0] + 70, y: G - 190, s: judge, o: judge > 0.01 ? 1 : 0 });
      pose(beamS, { x: COURT[0] + 70, y: G - 190, r: tilt, s: judge, o: judge > 0.01 ? 1 : 0 });

      /* v22a — But I tell you: anger — the storm over the brother; the scales turn towards him */
      const ak = es(t, 1.08, 1.38, ease.out) * (1 - es(t, 2.0, 2.2));
      pose(ans, { x: 800, y: lerp(-300, 190, ak) - es(t, 2.0, 2.2) * 300, r: Math.sin(T * 0.9) * 1.2, o: ak > 0.01 ? 1 : 0 });
      const anger = es(t, 1.3, 1.6);
      const shout1 = bump(t, 2.1, 2.95), shout2 = bump(t, 3.1, 3.95);
      A.set({ x: AX, y: G + 10, s: 1.0, lean: -anger * 4 + (shout1 + shout2) * 6, armF: 20 + anger * 40 + (shout1 + shout2) * 50, armB: anger * 90 + (shout1 + shout2) * 50, head: -4 + (shout1 + shout2) * -4, blink: blinkAt(T, 1) });
      B.set({ x: BX, y: G + 12, s: 1.0, flip: true, lean: -(shout1 + shout2) * 6, armF: 20 + (shout1 + shout2) * 50, head: 6 + (shout1 + shout2) * 8, blink: blinkAt(T, 2) });
      const sk_ = es(t, 1.36, 1.6, ease.back);
      pose(storm, { x: AX, y: G - 250 + Math.sin(T * 1.3) * 4, s: sk_ * (1 + (shout1 + shout2) * 0.2), o: sk_ > 0.01 ? 1 : 0 });
      const flash = shout1 + shout2 > 0.3 ? (T ? (Math.sin(T * 9) > 0 ? 1 : 0) : 1) : 0;
      pose(bolt, { x: AX + 10, y: G - 246, o: flash });

      /* v22b — "Raka!" — the council */
      pose(raka, { x: AX + 40, y: G - 176, s: es(t, 2.08, 2.26, ease.back), o: es(t, 2.08, 2.12) * (1 - es(t, 2.95, 3.05)) });
      const ck = es(t, 2.2, 2.46, ease.out) * (1 - es(t, 3.0, 3.25));
      const cy = lerp(-400, 250, ck) - es(t, 3.0, 3.25) * 300;
      pose(council, { x: 1000, y: cy, r: Math.sin(T * 0.7) * 1, o: ck > 0.01 ? 1 : 0 });
      pose(cTag, { x: 1000, y: cy + 122, o: ck > 0.01 ? 1 : 0 });

      /* v22c — "You fool!" — the fire of Gehenna */
      pose(fool, { x: AX + 40, y: G - 176, s: es(t, 3.08, 3.26, ease.back), o: es(t, 3.08, 3.12) });
      const fk = es(t, 3.2, 3.5);
      flames.forEach((f) => pose(f.el, { x: 1130 + f.x, y: 500 + f.y, sy: 0.25 + fk * 0.9 + Math.sin(T * 6 + f.i * 1.7) * 0.12 * fk, sx: 1 + Math.sin(T * 5 + f.i) * 0.08, o: 0.4 + fk * 0.6 }));
      pose(smoke, { x: 1130, y: 420 - fk * 30, s: 0.5 + fk * 0.6, o: fk * 0.8 });
      pose(pit, { x: 1130, y: 500, o: 0.3 + fk * 0.7 });
      pose(gTag, { x: 1130, y: lerp(-500, 380, es(t, 3.3, 3.55, ease.back)), r: Math.sin(T * 1.1) * 2 });

      S.cam.x = es(t, 3.0, 3.5) * 40;
      S.cam.z = 1.02 + es(t, 1.2, 1.6) * 0.03;
      S.cam.y = -20;
    };
  },
};
