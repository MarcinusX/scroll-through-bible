// Mt 16,2–3 — "You read the sky." Evening: the whole sky turns red-gold, the sun sinks to the hills, and a Pharisee
// points up — a round plate with a clear evening sun comes down: fair weather. Morning: a red, threatening dawn, dark
// clouds let down on their lines, and the plate of the storm. "You can read the face of the sky, but not the signs
// of the times": they stand gazing up at their weather plates with their backs to Him, while round Jesus the signs
// of the days just past are lit: the blind see, the lame walk, the mute speak, the loaves.
import { C, person, CAST, blinkAt, pose, lerp, hanging, mix } from '../kit.js';
import { stormCloud, ear } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { say, pharisee, sadducee, headAt, hangAt, magadan, magadanFront, weatherPlate, hungPlate, eyeIcon, crutch, loaf, glowDisc, tag, MG, EVENING, MORNING_RED, tr } from './lib.js';

const GY = MG.GY, JX = 800;
const DIS = [{ o: CAST.peter, x: 660 }, { o: CAST.andrew, x: 596 }, { o: CAST.john, x: 540 }];
const testers = (ph) => [0, 1, 2, 3, 4].map((i) => ({ i, sad: i >= 3, x: ph ? 868 + i * 40 + (i >= 3 ? 10 : 0) : 922 + i * 54 + (i >= 3 ? 20 : 0), y: GY - 6 + (i % 2) * 10 }));

export default {
  id: 'mt16-sky',
  beats: [
    { v: 2 },
    { v: 3, text: 'rano zaś: "Dziś burza, bo niebo się czerwieni i jest zasępione".' },
    { v: 3, cont: true, text: 'Wygląd nieba umiecie rozpoznawać, a znaków czasu nie możecie?' },
  ],
  cam: { x: [-20, 40], y: [-80, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const TEST = testers(S.portrait);
    const M = magadan(S, { skies: [EVENING, MORNING_RED] });
    const [eveL, mornL] = M.extra;

    /* ---------- the storm clouds and the two weather plates (up in the flies) ---------- */
    const hangL = S.layer({ par: 0.07, sh: 6 });
    const storms = [[520, 250, 380], [1010, 200, 320], [1330, 280, 300]].map(([x, y, w], i) => ({ i, x, y, el: hangL.add(`<g>${stormCloud(c, w, mix(C.storm, C.plumRobe, 0.2), C.storm2)}<path d="M${-w * 0.3} -30V-1500M${w * 0.3} -30V-1500" stroke="rgba(74,54,34,.5)" stroke-width="1.2"/></g>`) }));
    const plL = S.layer({ par: 0.12, sh: 7 });
    const fair = plL.add(`<g><path d="M0 -58V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${weatherPlate(c, 'fair', 50)}<g transform="translate(0 62)">${tag(c, tr('pogoda', 'fair'), { size: 19 })}</g></g>`);
    const foul = plL.add(`<g><path d="M0 -58V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${weatherPlate(c, 'foul', 50)}<g transform="translate(0 62)">${tag(c, tr('burza', 'storm'), { size: 19 })}</g></g>`);

    /* ---------- the signs of the times round Jesus ---------- */
    const sgL = S.layer({ par: 0.5, sh: 6 });
    const glow = sgL.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const signs = [
      eyeIcon(c, true, 26),
      `<g transform="rotate(-20) scale(.44) translate(0 -70)">${crutch(c)}</g>`,
      `<g transform="translate(-2 2) scale(.72)">${ear(c, C.skin2)}</g>`,
      `<g transform="translate(0 12)">${loaf(c, 24)}</g>`,
    ].map((icon, i) => ({ i, el: sgL.add(hungPlate(c, icon, { r: 40 })) }));
    const sgTag = hanging(sgL, tag(c, tr('znaki czasu', 'the signs of the times'), { size: 22, fill: C.halo }), { x: 0, y: 0, len: 900 });

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const test = TEST.map((m) => ({ ...m, p: S.puppet(P.add(person(c, m.sad ? sadducee(m.i - 3) : pharisee(m.i)))), seed: c.rr(0, 9) }));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const sayFair = fx.add(`<g>${say(c, tr('Będzie pogoda!', 'Fair weather!'), { size: 21, side: -1 })}</g>`);
    const sayFoul = fx.add(`<g>${say(c, tr('Dziś burza!', 'Foul weather today!'), { size: 21, side: -1 })}</g>`);
    magadanFront(S);

    return (t, time) => {
      const T = time;
      /* v2 — evening: the sky reddens, the sun sinks; v3a — a red, threatening morning; v3b — back to day */
      const eve = es(t, 0.05, 0.45) * (1 - es(t, 1.0, 1.3));
      const morn = es(t, 1.05, 1.4) * (1 - es(t, 2.05, 2.4));
      eveL.fade(eve);
      mornL.fade(morn);
      // the sun sets at the right in the evening, rises red at the left in the morning, then back to day
      let sunX = 1240, sunY = 150;
      if (t < 1.12) { sunX = lerp(1240, 1200, es(t, 0.05, 0.5)); sunY = 150 + es(t, 0.05, 0.5) * 260 + es(t, 1.0, 1.12) * 180; }
      else if (t < 2.2) { sunX = 380; sunY = 590 - es(t, 1.12, 1.45) * 180 + es(t, 2.05, 2.2) * 180; }
      else { sunX = 1330; sunY = 590 - es(t, 2.2, 2.55) * 440; }
      M.update(T, { sunX, sunY, clouds: 1 - Math.max(eve, morn) });
      storms.forEach((st) => hangAt(st.el, st.x, st.y - (1 - es(t, 1.1 + st.i * 0.06, 1.45 + st.i * 0.06, ease.back) * (1 - es(t, 2.05, 2.35))) * 700, T, 0.8, 0.5, st.i));

      /* the weather plates: fair (v2), storm (v3a); both stay up there, gazed at, in v3b */
      const fk = es(t, 0.35, 0.65, ease.back);
      const wk = es(t, 1.35, 1.65, ease.back);
      const up = es(t, 2.05, 2.35);
      if (S.portrait) {   // phone: both plates inside the screen; lifted clear of the signs of the times in v3b
        hangAt(fair, lerp(925, 935, up), 250 - (1 - fk) * 800 - up * 60, T, 1.2, 0.8, 1);
        hangAt(foul, lerp(1030, 1035, up), 236 - (1 - wk) * 800 - up * 60, T, 1.2, 0.8, 2);
      } else {
        hangAt(fair, lerp(990, 1000, up), 250 - (1 - fk) * 800 - up * 10, T, 1.2, 0.8, 1);
        hangAt(foul, lerp(1170, 1190, up), 236 - (1 - wk) * 800 - up * 10, T, 1.2, 0.8, 2);
      }

      /* Jesus speaks, points to the sky; then the signs light up round Him */
      const point = bump(t, 0.1, 0.95) + bump(t, 1.1, 1.95);
      const signsK = es(t, 2.1, 2.5);
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: 16 + point * 40 + signsK * 30, armB: 8 + point * 120 + signsK * 50, head: -point * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1, false);
      pose(glow, { x: JX, y: hy + 10, s: 0.6 + signsK * 0.5, o: signsK * 0.9 });
      const SP = [[-150, -70], [-80, -170], [80, -170], [150, -70]];
      signs.forEach((sg) => {
        const k = es(t, 2.15 + sg.i * 0.1, 2.45 + sg.i * 0.1, ease.back);
        pose(sg.el, { x: JX + SP[sg.i][0], y: hy + SP[sg.i][1] - (1 - k) * 800, r: T ? Math.sin(T * 1.1 + sg.i) * 2 : 0, o: k > 0.005 ? 1 : 0 });
      });
      const tk = es(t, 2.3, 2.6, ease.out);
      pose(sgTag, { x: JX, y: lerp(-800, hy - 290, tk), r: T ? Math.sin(T * 1.2) * 1.2 : 0, o: tk > 0.01 ? 1 : 0 });

      dis.forEach((d) => {
        const toJ = es(t, 2.2, 2.5);
        d.p.set({ x: d.x, y: GY + 4 + (d.i % 2) * 8, s: 0.9, flip: false, armF: 16 + toJ * 30, armB: 8, head: -eve * 8 - morn * 8 + toJ * 6, blink: blinkAt(T, d.seed) });
      });
      /* they read the sky; in v3b they stand with their backs to Him, gazing up */
      test.forEach((m) => {
        const turn = es(t, 2.05, 2.15);
        const gaze = es(t, 2.1, 2.4);
        const talk = m.i === 0 ? bump(t, 0.4, 0.98) : m.i === 3 ? bump(t, 1.4, 1.98) : 0;
        m.p.set({
          x: m.x + gaze * 20, y: m.y, s: 0.94, flip: turn < 0.5,
          armF: 16 + talk * 60 + gaze * (m.i % 2 ? 40 : 20), armB: 8 + talk * 140 + gaze * (m.i % 2 ? 20 : 130),
          head: -talk * 16 - gaze * 22 - (eve + morn) * 8, blink: blinkAt(T, m.seed),
        });
      });
      const sf = es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.95, 1.02));
      const [ax, ay] = headAt(TEST[0].x, TEST[0].y, 0.94, true);
      pose(sayFair, { x: ax - 10, y: ay - 36, s: sf, o: sf > 0.02 ? 1 : 0 });
      const sw = es(t, 1.45, 1.6, ease.back) * (1 - es(t, 1.95, 2.02));
      const [bx, by] = headAt(TEST[3].x, TEST[3].y, 0.94, true);
      pose(sayFoul, { x: bx - 10, y: by - 36, s: sw, o: sw > 0.02 ? 1 : 0 });

      S.cam.x = 20 - es(t, 2.05, 2.4) * 30;
      S.cam.z = 1.04 - es(t, 2.05, 2.4) * 0.04;
      S.cam.y = -20 - es(t, 0.1, 0.5) * 40 + es(t, 2.05, 2.4) * 30;
    };
  },
};
