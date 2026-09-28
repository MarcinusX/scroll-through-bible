// Mt 4,12 — by the Jordan, in the dry country. One of John's disciples comes running up the road from the
// south with the news; a round plate comes down on its string: John behind the bars of a prison window.
// Jesus bows His head. Then He turns and walks north along the road; the camera goes with Him, the dry
// ground gives way to the green hills of Galilee, and He passes a signpost that says "Galilee".
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, reeds, rock, olive, cypress, grass, flowers, sun, cloud, town, bush } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { JOHN_B, johnsDisciple, signpost, acacia, scrub, headAt, tr, DAY, PI } from './lib.js';

const P = 0.5;
const GY = 742;
const X1 = 1560;               // where He is when the camera has followed Him north

export default {
  id: 'mt4-news',
  beats: [
    { v: 12, text: 'Gdy [Jezus] posłyszał, że Jan został uwięziony,' },
    { v: 12, cont: true, text: 'usunął się do Galilei.' },
  ],
  cam: { x: [-40, (X1 - 800) / P], y: [0, 50], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 160, len: 800 });
    const cls = [[470, 160, 190], [1020, 120, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

    /* ---------- far: the Jordan valley (south) turning into the hills of Galilee (north) ---------- */
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 445, amps: [16, 7, 3], lens: [1000, 330, 120], color: C.hillFar, x0: -900, x1: 3400 }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    const green = hillsWith(c, { y: 520, amps: [20, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 40, treeColor: C.sage, treeH: 22, x0: -900, x1: 3600 });
    mid.add(green.markup + town(c, { x: 2050, y: green.fn(2050) + 12, n: 6, spread: 240, sc: 0.5 }));
    const dfn = c.wave(538, [16, 7], [800, 280]);
    const dropF = (x) => dfn(x) + Math.max(0, x - 1150) ** 1.3 * 0.9;
    mid.add(sheet().p(c.ridge(dropF, -900, 1700, 1700, 12, 1), mix(C.dune, C.sand2, 0.4)).out() + acacia(c, 380, dfn(380) + 30, 0.6));
    mid.add(sheet().p(c.ribbon(c.cbez([-900, 612], [-200, 600], [300, 640], [760, 560], 30), (u) => 26 - u * 20), C.lake2).out());

    /* ---------- the road: sand in the south, grass in the north ---------- */
    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(632, [6, 3], [700, 200]);
    const gs = sheet();
    gs.p(c.ridge(gfn, -900, 1500, 1700, 12, 1), C.sand);
    gs.p(c.cut([[820, 1700], [1000, 900], [1120, 760], [1230, gfn(1230) + 6], ...Array.from({ length: 32 }, (_, i) => [1300 + i * 80, gfn(1300 + i * 80) - 2]), [3800, 1700]], 3, 14), C.hillNear);
    gs.p(c.ribbon([[-900, 760], [600, 754], [1200, 760], [2000, 754], [3800, 760]], 48, 2), mix(C.sand, C.cream, 0.35));
    G.add(gs.out());
    G.add(reeds(c, 60, 650, 12, 110, C.olive) + reeds(c, 560, 650, 8, 80, C.olive) + scrub(c, 900, 660, 36) + rock(c, 1040, 700, 110, 44, C.rock2));
    G.add(grass(c, { x0: 1300, x1: 3600, y: 640, fn: gfn, n: 70, h: 16, color: C.moss }) + flowers(c, { x0: 1500, x1: 3200, y: 660, fn: (x) => gfn(x) + 30, n: 30 }) + olive(c, 1880, 680, 1.05) + cypress(c, 1280, 660, 140) + bush(c, 2150, 690, 70, C.sage, C.moss));
    const post = G.add(`<g transform="translate(1400 736)">${signpost(c, tr('Galilea', 'Galilee'), { size: 22 })}</g>`);

    /* ---------- people ---------- */
    const PL = S.layer({ par: P, sh: 5 });
    const runner = S.puppet(PL.add(person(c, johnsDisciple(c))));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));

    /* ---------- the news: John behind bars ---------- */
    const fly = S.layer({ par: 0.2, sh: 6 });
    const cid = S.id('pclip');
    S.defs(`<clipPath id="${cid}"><circle r="86"/></clipPath>`);
    const plateIn = (() => {
      const wall = sheet();
      let bl = '';
      for (let y = -90; y < 90; y += 24) for (let x = -100 + ((y / 24) % 2 ? 20 : 0); x < 100; x += 42) { if (x + 40 > -40 && x < 40 && y + 22 > -60 && y < 44) continue; bl += c.cut(c.rect(x + 2, y + 2, 38, 20), 0.4, 6); }
      wall.p(c.cut(c.rect(-100, -100, 200, 200), 0.3, 20) + c.hole([[-36, 40], [-36, -34], ...c.arc(0, -34, 36, 22, PI, 2 * PI, 8), [36, 40]], 0.4, 6), C.stone2);
      wall.x(bl, C.stone, 'opacity=".7"');
      const barsD = [-18, 0, 18].map((x) => c.cut(c.rect(x - 2.5, -60, 5, 100), 0.2, 6)).join('');
      const john = `<g transform="translate(-2 ${-10 + 167 * 1.05}) scale(1.05)">${person(c, { ...JOHN_B })}</g>`;
      const rim = sheet().p(c.cut(c.circ(0, 0, 96, 40), 0.5, 5) + c.hole(c.circ(0, 0, 86, 40), 0.4, 5), C.haloRim).out();
      return `<g clip-path="url(#${cid})"><rect x="-100" y="-100" width="200" height="200" fill="#2a2338"/><path d="${c.poly([[-60, -60], [-20, -60], [40, 60], [0, 60]])}" fill="${C.halo}" opacity=".25"/>${john}${wall.out()}<path d="${barsD}" fill="#4c4452"/></g>${rim}`;
    })();
    const plateEl = hanging(fly, plateIn, { x: 0, y: 0, len: 900 });
    const plateTag = fly.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="24" font-style="italic" fill="${C.inkSoft}">${tr('Jan w więzieniu', 'John in prison')}</text></g>`);

    return (t, time) => {
      swing(sunEl, 1230, 160, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));

      /* v12a: the runner with the news */
      const run = es(t, 0.02, 0.45, ease.out);
      const rx = lerp(-200, 560, run);
      const tell = es(t, 0.45, 0.6);
      runner.set({ x: rx, y: GY + 4, s: 1.0, walk: run > 0 && run < 1 ? rx * 0.08 : undefined, amt: 1.4, lean: (1 - tell) * 10 * (run < 1 ? 1 : 0), armF: 20 + tell * 50 + bump(t, 0.6, 1.0) * 20, armB: 10 + tell * 40, head: 4 - tell * 4 + es(t, 1.1, 1.4) * 10, blink: blinkAt(time, 3) });
      const pk = es(t, 0.45, 0.75, ease.out) * (1 - es(t, 1.05, 1.3, ease.in));
      const px = 690, py = lerp(-420, 290, pk);
      pose(plateEl, { x: px, y: py, r: Math.sin(time * 0.8) * 2, o: pk > 0.01 ? 1 : 0 });
      pose(plateTag, { x: px, y: py + 128, o: pk > 0.9 ? 1 : 0 });

      /* v12b: He withdraws to Galilee */
      const sad = es(t, 0.6, 0.9);
      const turn = t > 1.1;
      const walk = es(t, 1.1, 1.9, ease.sine);
      const jx = lerp(820, X1, walk);
      jesus.set({ x: jx, y: GY, s: 1.04, flip: !turn, walk: walk > 0 && walk < 1 ? jx * 0.045 : undefined, armF: 14 + (turn ? 0 : sad * 20), armB: 8, head: sad * 12 * (1 - es(t, 1.1, 1.5)) - (turn ? 3 : 0), blink: blinkAt(time) });
      pose(post, { x: 1400, y: 736, o: 1 });

      const cx = lerp(0, (X1 - 800) / P, es(t, 1.08, 1.95, ease.sine));
      S.cam.x = cx - 30 * (1 - es(t, 1.0, 1.2));
      S.cam.y = 30;
      S.cam.z = 1.03 + bump(t, 1.1, 1.95) * -0.02;
    };
  },
};
