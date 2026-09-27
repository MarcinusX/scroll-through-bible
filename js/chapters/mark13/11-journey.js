// Mk 13,33–34 — a prologue in front of the closed act curtain: Jesus, lamp-lit, says "Be on guard, keep
// awake"; an hourglass hangs with a cloth over it — no one knows the time. Then the curtain opens on a
// house: its master, dressed for the road, gathers his servants, hands over the key of the house, gives
// each a task (the well, the oven, the broom, the chest), puts a lamp in the doorkeeper's hand with a
// raised finger — and goes off down the road.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { houseSet, HOUSE, STATIONS, MASTER, SERVANTS, DOORKEEPER, FOUR, keyProp, broom, handLamp, hourglass, question, voiceRings, bowl, along, PI } from './lib.js';

const F = HOUSE.FLOOR;

export default {
  id: 'm13-journey',
  beats: [
    { v: 33 },
    { v: 34, text: 'Bo rzecz ma się podobnie jak z człowiekiem, który udał się w podróż.' },
    { v: 34, cont: true, text: 'Zostawił swój dom, powierzył swoim sługom staranie o wszystko,' },
    { v: 34, cont: true, text: 'każdemu wyznaczył zajęcie, a odźwiernemu przykazał, żeby czuwał.' },
  ],
  cam: { x: [-30, 60], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const DAY = ['#e6d3b4', '#f1dfbf', '#f7e8cf'];
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 190, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 620, y: 150, len: 700 });
    const H = houseSet(S);

    /* the household */
    const P = S.layer({ par: 0.45, sh: 5 });
    const STAFF = `<path d="M-2 30L2 30L3 -120L-1 -120Z" fill="${C.wood2}"/>`;
    const BAG = `<g transform="translate(-6 -70)"><path d="${c.cut([[-16, 0], [16, 0], [14, 26], [-14, 26]], 0.4, 4)}" fill="${C.leather}"/></g>`;
    const master = S.puppet(P.add(person(c, { ...MASTER, holdB: STAFF }).replace('<g class="head"', `${BAG}<g class="head"`)));
    const HOLD = [
      `<g transform="translate(-10 0)"><path d="${c.cut([[-9, 0], [9, 0], [7, 16], [-7, 16]], 0.3, 3)}" fill="${C.wood3}"/></g>`,   // a bucket
      `<g transform="translate(0 -2)">${bowl(c, { w: 28, food: 'bread' })}</g>`,                                                   // bread
      `<g transform="translate(0 0) rotate(-20)">${broom(c)}</g>`,                                                                  // broom
      `<g transform="translate(0 2) rotate(80)">${keyProp(c)}</g>`,                                                                  // the key
    ];
    const serv = SERVANTS.map((o, i) => ({
      i, seed: c.rr(0, 9),
      p: S.puppet(P.add(person(c, o))),
      w: S.puppet(P.add(person(c, { ...o, holdF: HOLD[i] }))),
      line: 560 + i * 62, st: [STATIONS.well - 66, STATIONS.oven - 72, STATIONS.broom + 10, STATIONS.chest - 56][i],
    }));
    const dk = S.puppet(P.add(person(c, DOORKEEPER)));
    const dkLamp = S.puppet(P.add(person(c, { ...DOORKEEPER, holdF: `<g transform="translate(-4 4)">${handLamp(c, { glowR: 120 })}</g>` })));
    const keyEl = P.add(`<g>${keyProp(c)}</g>`);
    const sparks = serv.map((s) => P.add(`<g><circle r="30" fill="url(#warm-glow)"/>${keyProp(c, C.sun)}</g>`));

    /* the curtain, and the prologue in front of it */
    const cur = curtains(S);
    const pro = S.layer({ par: 0.6, sh: 5 });
    const apron = pro.add(`<g>${sheet().p(c.cut([[-1400, 704], [3000, 704], [3000, 1800], [-1400, 1800]], 0.4, 20), mix(C.wood2, C.wood, 0.5)).x([0, 1, 2, 3].map((i) => c.ribbon([[-1400, 716 + i * i * 14], [3000, 716 + i * i * 14]], 1.4)).join(''), C.soilDark, 'opacity=".5"').out()}</g>`);
    const hg = pro.add(`<g><path d="M0 -1500V-50" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${hourglass(c, 100)}<path d="${c.cut([[-40, -58], [40, -58], [46, 40], [30, 34], [14, 44], [-2, 36], [-18, 46], [-34, 36], [-46, 42]], 0.8, 6)}" fill="${C.plumRobe}"/><g transform="translate(0 -6) scale(.9)">${question(c, { fill: C.cream })}</g></g>`);
    const jp = S.puppet(pro.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(-4 4)">${handLamp(c, { glowR: 140 })}</g>` })));
    const fourPos = [560, 640, 960, 1040];
    const four = FOUR.map((f, i) => ({ ...f, i, x: fourPos[i], seed: c.rr(0, 9), p: S.puppet(pro.add(person(c, { ...f.o, pose: 'sit' }))), w: S.puppet(pro.add(person(c, f.o))) }));
    const voice = voiceRings(pro, c, { n: 3, r: 26, w: 4 });

    return (t, time) => {
      const T = time;
      /* the prologue (beat 0), then the curtain opens (beat 1) */
      const open = es(t, 1.0, 1.6);
      cur.set(open, T);
      const leave = es(t, 1.0, 1.5);
      jp.set({ x: lerp(800, -250, leave), y: 700, s: 1.05, flip: leave > 0, walk: leave > 0 && leave < 1 ? leave * 30 : undefined, armF: 70 * (1 - leave), armB: bump(t, -0.2, 0.95) * 150, head: -4, blink: blinkAt(T, 1), o: leave < 0.98 ? 1 : 0 });
      voice(806, 700 - 176, bump(t, -0.2, 0.95), T, { s0: 0.7 });
      four.forEach((m) => {
        const up = es(t, 0.95, 1.05);
        const x = lerp(m.x, m.x < 800 ? -200 - m.i * 60 : 1800 + m.i * 60, es(t, 1.05, 1.55));
        m.p.set({ x: m.x, y: 736, s: 0.94, flip: m.x > 800, o: 1 - up, head: -8 + es(t, 0.3, 0.5) * -4, blink: blinkAt(T, m.seed) });
        m.w.set({ x, y: 732, s: 0.94, flip: m.x < 800, o: up * (x > -150 && x < 1750 ? 1 : 0), walk: t > 1.05 && t < 1.55 ? x * 0.05 : undefined, blink: blinkAt(T, m.seed) });
      });
      const hk = es(t, -0.3, 0.2, ease.back) * (1 - es(t, 0.95, 1.2));
      pose(hg, { x: 800, y: lerp(-300, 250, hk) + Math.sin(T * 0.9) * 2, r: Math.sin(T * 0.8) * 1.5, o: hk > 0.01 ? 1 : 0 });
      pose(apron, { x: 0, y: es(t, 1.2, 1.7) * 60, o: 1 - es(t, 1.3, 1.7) * 0.6 });

      pose(sunEl, { x: 1260, y: 190, r: Math.sin(T * 0.7) });
      pose(cl, { x: 620 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6) });
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.5 + Math.sin(T * 3) * 0.1 });

      /* the master: ready for the road (1), gives the key and sweeps his arm over the house (2),
         sends each to work, gives the doorkeeper a lamp with a raised finger, and goes (3) */
      const toGate = es(t, 3.35, 3.6), road = seg(t, 3.6, 4.0);
      let mx = lerp(720, 900, es(t, 1.55, 1.95));
      mx = lerp(mx, 1052, toGate);
      let my = F, ms = 1, walkM = (t > 1.55 && t < 1.95) || (t > 3.35 && t < 3.6);
      if (road > 0) { const [rx, ry] = along(HOUSE.ROAD, road); mx = rx; my = ry; ms = 1 - road * 0.55; walkM = road < 1; }
      const give = es(t, 2.3, 2.55) * (1 - es(t, 2.75, 2.9));
      const sweep = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.05));
      const finger = es(t, 3.2, 3.35) * (1 - es(t, 3.5, 3.6));
      master.set({ x: mx, y: my, s: ms, flip: t > 1.95 && t < 3.35, walk: walkM ? mx * 0.05 : undefined, armF: 20 + sweep * 90 + give * 30 + es(t, 3.05, 3.2) * (1 - es(t, 3.4, 3.5)) * 60, armB: 30 + finger * 130, head: -sweep * 4, blink: blinkAt(T, 3), o: road < 0.98 ? 1 : 0 });

      /* the key flies from the master to the steward (beat 2) */
      const kf = es(t, 2.45, 2.75);
      const st = serv[3];
      pose(keyEl, { x: lerp(mx - 40, st.line + 30, kf), y: lerp(F - 120, F - 90, kf) - Math.sin(kf * PI) * 50, r: kf * 360, o: kf > 0.01 && kf < 0.99 ? 1 : 0 });
      // little keys of charge glint over each servant
      sparks.forEach((sp, i) => {
        const k = es(t, 2.65 + i * 0.05, 2.85 + i * 0.05, ease.back) * (1 - es(t, 3.0, 3.15));
        pose(sp, { x: serv[i].line + 6, y: F - 210, s: k * 0.8, r: -30, o: k > 0.01 ? 1 : 0 });
      });

      /* the servants gather (2), then go each to their work (3) */
      serv.forEach((s) => {
        const come = es(t, 1.9 + s.i * 0.06, 2.3 + s.i * 0.06);
        const go = es(t, 3.0 + s.i * 0.04, 3.3 + s.i * 0.04);
        const x = lerp(lerp(380, s.line, come), s.st, go);
        const walking = (come > 0 && come < 1) || (go > 0 && go < 1);
        const work = es(t, 3.3, 3.4);
        const act = work * (s.i === 0 ? 60 + Math.sin(T * 2) * 20 : s.i === 1 ? 50 + Math.sin(T * 1.5) * 8 : s.i === 2 ? 30 + Math.sin(T * 3) * 18 : 40);
        const flipW = s.i === 0 || s.i === 1 ? false : s.i === 2 ? Math.sin(T * 0.6) > 0 : false;
        s.p.set({ x, y: F + (s.i % 2) * 4, s: 0.95, flip: false, o: come > 0.01 && work < 0.5 ? 1 : 0, walk: walking ? x * 0.05 : undefined, armF: 10 + bump(t, 2.55, 2.95) * 30, head: -4, blink: blinkAt(T, s.seed) });
        s.w.set({ x, y: F + (s.i % 2) * 4, s: 0.95, flip: flipW, o: work >= 0.5 ? 1 : 0, armF: act, lean: s.i === 2 ? 6 : 4, head: 6, blink: blinkAt(T, s.seed) });
      });

      /* the doorkeeper: at the gate; gets his lamp (3) */
      const lampOn = es(t, 3.15, 3.22);
      const dkx = 1116;
      dk.set({ x: dkx, y: F, s: 0.96, flip: true, o: 1 - lampOn, armF: 10, head: -4, blink: blinkAt(T, 7) });
      dkLamp.set({ x: dkx, y: F, s: 0.96, flip: true, o: lampOn, armF: 60, armB: 10, head: -2, blink: blinkAt(T, 7) });
      pose(H.gateDoor, { x: HOUSE.GATE - 36, y: F + 38, sx: 1 - es(t, 3.4, 3.6) * 0.8 });

      S.cam.x = es(t, 1.7, 2.2) * 20 + es(t, 3.4, 3.9) * 50;
      S.cam.z = 1 + es(t, 3.4, 3.9) * 0.04;
    };
  },
};
