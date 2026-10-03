// Łk 17,7 — the parable flies in: a farm at the end of the day, the field on the left with the fold and the sheep on
// the slope behind it, the master's house on the right. "Who is there among you, having a servant plowing or keeping
// sheep": the servant walks behind the ox and the plough, cutting a long furrow, his shepherd's crook leant against
// the fold where the flock grazes; the master watches from his door. "That will say, when he comes in from the field,
// 'Come immediately and sit down at the table'": evening comes; the servant unyokes the ox and trudges to the house,
// bent and dusty — and the master's bubble says it: "Come, sit down at the table!" … with a large question mark.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { farmSet, FARM, SERVANT, MASTER, plough, crook, ox, sheep, bubble, question, headAt, hand, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const PY = 690;
const P0 = 650, P2L = 400;    // he ploughs from the house end of the field out to the left
const MX = 800;

export default {
  id: 'lk17-plough',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 7, text: 'Kto z was, mając sługę, który orze lub pasie,' },
    { v: 7, cont: true, text: 'powie mu, gdy on wróci z pola: "Pójdź i siądź do stołu?"' },
  ],
  cam: { x: [-360, 40], y: [0, 50], z: [1, 1.12] },
  build(S) {
    // phone: a shorter furrow and the camera further left, so the ox, the plough and the servant are all on the screen
    const P2 = S.portrait ? 560 : P2L;
    const F = farmSet(S);
    const c = S.c;
    /* the flock on the slope, the crook against the fold */
    const flock = [[180, 584, 1], [230, 590, -1], [290, 580, 1], [360, 596, 1], [420, 588, -1], [120, 596, -1]].map(([x, y, d], i) => ({ x, y, d, i, el: F.sheepL.add(`<g>${sheep(c)}</g>`) }));
    F.sheepL.add(`<g transform="translate(336 566) rotate(12) scale(.5)">${crook(c, 150)}</g>`);
    /* the furrow behind the plough, the plough, the ox, the servant */
    const fL = S.layer({ par: 0.36, sh: 2 });
    const furrow = fL.add(`<g>${sheet().p(c.ribbon([[P2 - P0, 0], [0, 0]], 7), mix(C.soilDark, C.soil, 0.3)).out()}</g>`);
    const oxEl = F.act.add(`<g>${ox(c)}</g>`);
    const oxHead = oxEl.querySelector('.oxhead');
    const pl = F.act.add(`<g>${plough(c)}</g>`);
    /* the master at his door (in front of the house) */
    const out = S.layer({ par: 0.47, sh: 5 });
    const serv = S.puppet(out.add(person(c, SERVANT)));
    const master = S.puppet(out.add(person(c, MASTER)));
    const say = out.add(`<g opacity="0">${bubble(c, [tr('Pójdź zaraz', 'Come at once,'), tr('i siądź do stołu!', 'sit down at the table!')], { size: 18, tail: 1 })}</g>`);
    const q = out.add(`<g opacity="0">${question(c)}</g>`);
    const seedS = c.rr(0, 9);

    return (t, time) => {
      const T = time;
      const eve = es(t, 0.9, 1.4);
      F.update(T, { eveK: eve * 0.85 });

      /* v7a — ploughing; the sheep graze */
      const u = es(t, 0.05, 0.85, (x) => x);
      const px = lerp(P0, P2, u);
      const going = u > 0 && u < 1;
      const wob = going ? Math.sin(u * 40) * 3 : 0;
      pose(pl, { x: px + 18, y: PY + wob * 0.5, sx: -1, r: -wob * 0.3, o: 1 });
      pose(oxEl, { x: px - 138, y: PY + 4 + wob * 0.6, sx: -1, r: -wob * 0.2 });
      if (oxHead) pose(oxHead, { x: 58, y: -80 + (going ? Math.sin(t * 40) * 2 : 0) - es(t, 1.05, 1.2) * 0 });
      pose(furrow, { x: P0 + 12, y: PY + 2, sx: Math.max(0.001, u), o: u > 0.005 ? 1 : 0 });
      flock.forEach((f) => {
        const graze = T ? Math.sin(T * 0.5 + f.i) : 0;
        pose(f.el, { x: f.x + graze * 3, y: f.y, s: 0.42, sx: f.d });
      });

      /* v7b — he unyokes the ox and trudges in from the field */
      const walkIn = es(t, 1.1, 1.55, (x) => x);
      const sx = t < 1.1 ? px + 60 : lerp(P2 + 60, MX - 150, walkIn);
      const tired = es(t, 1.0, 1.15);
      serv.set({ x: sx, y: PY + 2 + (t < 1.1 ? 0 : walkIn * 12), s: 0.98, flip: t < 1.05, walk: (going && t < 1.1) || (walkIn > 0 && walkIn < 1) ? sx * 0.06 : undefined, armF: t < 1.1 ? 60 : 12 + bump(t, 1.0, 1.1) * 60, armB: t < 1.1 ? 50 : 6, lean: t < 1.1 ? 10 : tired * 12, head: t < 1.1 ? -8 : 10 * tired, blink: blinkAt(T, seedS) });

      /* the master at his door; the question */
      const talk = es(t, 1.4, 1.6);
      master.set({ x: MX, y: FARM.GY + 4, s: 1.0, flip: true, armF: 20 + talk * 60, armB: 10 + talk * 30, head: 4 - talk * 4, blink: blinkAt(T, 3) });
      const [mhx, mhy] = headAt(MX, FARM.GY + 4, 1, true);
      const bk = es(t, 1.45, 1.6, ease.back);
      pose(say, { x: mhx - 90, y: mhy - 40, s: bk, o: bk > 0.01 ? 1 : 0 });
      const qk = es(t, 1.62, 1.78, ease.back);
      pose(q, { x: mhx + 40, y: mhy - 120, s: qk * 1.6, r: (1 - qk) * 30, o: qk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, S.portrait ? [[0, -330], [0.8, -350], [1.3, -80], [2, 0]] : [[0, -40], [0.8, -60], [1.3, -20], [2, 0]]);
      S.cam.y = kf(t, [[0, 30], [2, 30]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.06], [2, 1.1]]);
    };
  },
};
