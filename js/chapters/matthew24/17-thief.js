// Mt 24,42–44 — night on the Mount. "Watch therefore, for you don't know on what day your Lord comes": seven day-cards
// come down on a line, all alike, and a question mark wanders along them; Jesus lifts His lamp. "But know this:" a
// painted flat of a house at night flies in — the householder asleep in his bed, his lamp out, the four watches of the
// night hanging above. "If he had known in what watch the thief was coming, he would have watched": the midnight plate
// lights up; a thief creeps along the outside wall with his mattock — but the householder is sitting up, lamp lit,
// staff in hand; the thief sees the light and slinks off; the wall stands. "Therefore be ready": the flat flies away,
// a lamp is lit in each of the four hands — and far off on the horizon a light breaks out at an hour no one expected.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { bed, oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, voiceRings, dayCard, question, watchPlate, rooster, handLamp, cudgel, mattock, hand, THIEF, HOUSEHOLDER, PI } from './lib.js';

const FL = 690, X0 = 440, X1 = 960, ROOF = 402;

export default {
  id: 'mt24-thief',
  beats: [
    { v: 42 },
    { v: 43, text: 'A to rozumiejcie:' },
    { v: 43, cont: true, text: 'Gdyby gospodarz wiedział, o której porze nocy złodziej ma przyjść, na pewno by czuwał i nie pozwoliłby włamać się do swego domu.' },
    { v: 44 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    S.defs(`<clipPath id="mt24-watch-clip"><circle r="47"/></clipPath>`);
    const NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: 0.42, moonXY: [1240, 110], templeGlow: 0.2 });
    /* a light far off on the horizon (the unexpected hour) */
    const dawnL = S.layer({ par: 0.12, sh: 1, flat: true });
    dawnL.add(`<ellipse cx="800" cy="440" rx="900" ry="170" fill="url(#halo-glow)"/><ellipse cx="800" cy="450" rx="620" ry="60" fill="${C.lampGlow}" opacity=".5"/>`);
    dawnL.fade(0);

    /* the circle, and the four's lamps */
    const PM = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, PM, { tintCol: NIGHTC, tintK: 0.18 });
    const J = circ.jesus;
    const jLamp = PM.add(`<g transform="translate(0 -1500)">${handLamp(c, { glowR: 200 })}</g>`);
    const voice = voiceRings(PM, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });
    const lamps = circ.four.map(() => PM.add(`<g transform="translate(0 -1500)">${handLamp(c, { glowR: 60 })}</g>`));

    /* the seven days on a line */
    const dayL = S.layer({ par: 0.3, sh: 5 });
    const days = Array.from({ length: 7 }, (_, i) => ({ i, x: 560 + i * 80, el: dayL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V0" stroke="rgba(230,210,180,.45)" stroke-width="1.1"/>${dayCard(c, false, 40, 52)}</g>`) }));
    const qm = dayL.add(`<g transform="translate(0 -1500)">${question(c)}</g>`);

    /* the flat: the householder's house at night */
    const F = [];
    const skyF = S.layer({ par: 0.04, sh: 3 }); F.push(skyF);
    skyF.add(sheet().p(c.cut([[-1400, -1400], [3000, -1400], [3000, 1000], [-1400, 1000]], 0.3, 30), mix(C.night2, C.indigo, 0.35)).out() + stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 50 }) + `<g transform="translate(1180 150)">${moon(c, 30)}</g>`);
    const houseL = S.layer({ par: 0.3, sh: 4 }); F.push(houseL);
    const h = sheet();
    h.p(c.cut([[-1400, FL - 4], [3000, FL - 4], [3000, 1800], [-1400, 1800]], 0.6, 20), mix(C.sand2, C.night2, 0.45));
    h.p(c.cut([[X0, FL], [X0, ROOF], [X1, ROOF], [X1, FL]], 0.6, 10), mix(C.plaster2, C.night2, 0.55));
    h.p(c.cut([[X0 + 60, FL], [X0 + 60, 520], [X0 + 120, 520], [X0 + 120, FL]], 0.4, 6), mix(C.soilDark, C.night2, 0.4));
    h.p(c.cut([[X0 - 30, ROOF + 2], [X0 - 30, ROOF - 30], [X1 + 44, ROOF - 30], [X1 + 44, ROOF + 2]], 0.5, 10), mix(C.clay, C.night2, 0.45));
    h.p(c.cut([[X0 - 30, ROOF], [X0, ROOF], [X0, FL + 6], [X0 - 30, FL + 6]], 0.4, 8), mix(C.stone, C.night2, 0.4));
    h.p(c.cut([[X1, ROOF], [X1 + 40, ROOF], [X1 + 40, FL + 6], [X1, FL + 6]], 0.4, 8), mix(C.stone, C.night2, 0.35));
    let bricks = '';
    for (let y = ROOF + 14; y < FL; y += 22) bricks += c.ribbon([[X1 + 2, y], [X1 + 38, y]], 1.2);
    h.x(bricks, mix(C.stone2, C.night2, 0.6), 'opacity=".7"');
    houseL.add(h.out());
    houseL.add(`<g transform="translate(700 ${FL})">${bed(c, 230).replace(/#[0-9a-fA-F]{6}\b/g, (x) => mix(x, C.night2, 0.35))}</g>`);
    const lampOn = houseL.add(`<g transform="translate(0 -1500)"><circle r="260" fill="url(#warm-glow)"/></g>`);
    const winGlow = houseL.add(`<g transform="translate(0 -1500)"><ellipse rx="70" ry="220" fill="url(#warm-glow)"/></g>`);
    const PF = S.layer({ par: 0.32, sh: 5 }); F.push(PF);
    const sleeper = S.puppet(PF.add(person(c, { ...HOUSEHOLDER, eyes: 'closed' })));
    const blanket = PF.add(`<g transform="translate(0 -1500)">${sheet().p(c.cut([[-120, -6], [-100, -30], [60, -36], [110, -20], [118, 0], [-120, 2]], 0.8, 8), mix(C.skyVeil, C.night2, 0.3)).out()}</g>`);
    const awake = S.puppet(PF.add(person(c, { ...HOUSEHOLDER, pose: 'sit', holdF: `<g transform="translate(-2 2)">${handLamp(c, { glowR: 120 })}</g>`, holdB: `<g transform="rotate(-10)">${cudgel(c, 120)}</g>` })));
    const thief = S.puppet(PF.add(person(c, { ...THIEF, holdF: `<g transform="rotate(-30)">${mattock(c)}</g>` })));
    const watchL = S.layer({ par: 0.2, sh: 6 }); F.push(watchL);
    const WATCH = ['eve', 'mid', 'cock', 'morn'].map((k, i) => ({ k, i, x: 560 + i * 160, el: watchL.add(`<g transform="translate(0 -1500)"><circle class="lit" r="100" fill="url(#halo-glow)" opacity="0"/>${watchPlate(c, k, 'mt24-watch-clip', rooster)}${k === 'mid' ? `<g class="who" opacity="0" transform="translate(-26 38) scale(.2)">${person(c, THIEF).replace(/#[0-9a-fA-F]{6}\b/g, '#2b2130')}</g>` : ''}</g>`) }));
    WATCH.forEach((w) => { w.lit = w.el.querySelector('.lit'); w.who = w.el.querySelector('.who'); });

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 800, sunO: 0, moon: 110, moonO: 1, glow: 0.2, starsO: 1 });

      /* v42 — seven days alike; which one? */
      days.forEach((d) => {
        const k = es(t, 0.05 + d.i * 0.05, 0.3 + d.i * 0.05, ease.back) * (1 - es(t, 0.95, 1.15));
        pose(d.el, { x: d.x, y: lerp(-300, 250 + Math.sin(d.i * 0.9) * 8, k), r: T ? Math.sin(T * 1.2 + d.i) * 3 : 0, o: k > 0.01 ? 1 : 0 });
      });
      const qk = es(t, 0.35, 0.5, ease.back) * (1 - es(t, 0.95, 1.1));
      const qx = 560 + (0.5 - 0.5 * Math.cos(seg(t, 0.4, 1.0) * PI * 2.5)) * 480;
      pose(qm, { x: qx, y: 186 + (T ? Math.sin(T * 3) * 4 : 0), s: qk * 0.9, o: qk > 0.01 ? 1 : 0 });

      /* the flat flies in (beat 1) and away (beat 3) */
      const fin = es(t, 1.0, 1.4, ease.out), fout = es(t, 3.0, 3.4, ease.in);
      F.forEach((L, i) => { L.shift(0, -(1 - fin) * (1300 + i * 60) - fout * (1300 + i * 60)); L.fade(fin > 0.001 && fout < 0.999 ? 1 : 0); });

      /* the watches; the midnight plate lights, the thief in it */
      WATCH.forEach((w) => {
        const k = es(t, 1.3 + w.i * 0.06, 1.55 + w.i * 0.06, ease.back);
        const mid = w.k === 'mid' ? es(t, 2.05, 2.25) : 0;
        pose(w.el, { x: w.x, y: lerp(-300, 168, k), r: (1 - k) * 6, s: 0.85 + mid * 0.18, o: k > 0.01 ? 1 : 0 });
        fade(w.lit, mid);
        if (w.who) fade(w.who, mid);
      });

      /* he sleeps (1), then — had he known — he is awake with his lamp (2) */
      const up = es(t, 2.18, 2.26);
      sleeper.set({ x: 796, y: FL - 50, s: 0.86, r: -90, o: 1 - up });
      pose(blanket, { x: 702, y: FL - 44, o: 1 - up });
      awake.set({ x: 760, y: FL - 34, s: 0.86, flip: false, o: up, armF: 70, armB: 20, head: -4 + bump(t, 2.3, 2.6) * 6, blink: blinkAt(T, 4) });
      pose(lampOn, { x: 830, y: 560, o: up * 0.9 });
      pose(winGlow, { x: X1 + 20, y: 560, o: up * 0.7 });

      /* the thief creeps up, sees the light, slinks away */
      const creep = seg(t, 1.5, 2.3);
      const flee = seg(t, 2.36, 2.8);
      const tx = flee > 0 ? lerp(1030, 1330, ease.out(flee)) : lerp(1360, 1030, ease.out(creep));
      thief.set({ x: tx, y: FL + 2, s: 0.9, flip: flee <= 0, o: 1, walk: (creep > 0 && creep < 1) || (flee > 0 && flee < 1) ? tx * 0.05 : undefined, amt: flee > 0 ? 1.4 : 0.7, lean: flee > 0 ? -8 : 14, armF: flee > 0 ? 20 : 60 + es(t, 2.2, 2.35) * 40, armB: flee > 0 ? 60 : 20, head: flee > 0 ? 0 : 10 - es(t, 2.3, 2.4) * 20, blink: blinkAt(T, 9) });

      /* v44 — be ready: lamps in every hand, and a light far off at an unexpected hour */
      const ready = es(t, 3.3, 3.55);
      const burst = es(t, 3.55, 3.75);
      dawnL.fade(burst * 0.6);
      const lift = es(t, 0.1, 0.4) * (1 - es(t, 0.95, 1.1)) + ready;
      J.set({ x: JX, y: JY, s: circ.s, armB: 10 + Math.min(1, lift) * 140, armF: 25 + ready * 30, head: -lift * 6 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      const [lx, ly] = hand(JX, JY, circ.s, false, 10 + Math.min(1, lift) * 140, 0, 62);
      pose(jLamp, { x: lx, y: ly + 6, s: 1, o: Math.min(1, lift) });
      voice(JX - 4, JY - 158, Math.max(es(t, 0.05, 0.25) * (1 - es(t, 0.9, 1.0)), ready), T, { s0: 0.7 });
      circ.four.forEach((m, i) => {
        const look = es(t, 3.6, 3.8);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: look > 0.5 ? m.x > 800 : m.flip, lean: m.dir * 3, armF: 20 + ready * 50, head: -8 - look * 8, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x, m.y, m.s, look > 0.5 ? m.x > 800 : m.flip, 20 + ready * 50, 0, 62);
        const lk = es(t, 3.3 + i * 0.05, 3.45 + i * 0.05);
        pose(lamps[i], { x: hx, y: hy + 6, s: 0.8 * m.s, sx: (look > 0.5 ? m.x > 800 : m.flip) ? -1 : 1, o: lk });
      });

      S.cam.y = -es(t, -0.2, 0.4) * 30 * (1 - es(t, 0.9, 1.2)) + es(t, 3.5, 3.9) * 10;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.04 * (1 - es(t, 2.9, 3.1));
      S.cam.x = es(t, 1.9, 2.3) * 20 * (1 - es(t, 2.9, 3.1));
    };
  },
};
