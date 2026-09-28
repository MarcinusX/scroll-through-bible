// Mt 8,9 — the centurion's own picture, a painted flat that flies in: the courtyard of his garrison. Over him hangs
// Caesar's silver coin — he too is under authority — and his soldiers march in and stand in line. "Go!" — one turns
// and marches out of the gate. "Come!" — another comes in from the door. And to his servant: "Do this!" — the boy
// takes up the broom and sweeps the court.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { centurion, soldier, HOUSEBOY, bubble, headAt, hangAt, dust, tr, PI, DAY } from './lib.js';
import { denarius } from '../mark12/lib.js';
import { broom } from '../mark13/lib.js';

const FEET = 742, CX = 700, GATE = 1110, DOOR = 400;

/** a Roman standard: a pole, discs, a small golden eagle and a red cloth (origin: foot) */
function standard(c, h = 300) {
  const s = sheet();
  s.p(c.cut(c.rect(-4, -h, 8, h), 0.3, 6), shade(C.wood2, -0.1));
  s.p(c.cut(c.circ(0, -h * 0.55, 12, 16), 0.3, 4) + c.cut(c.circ(0, -h * 0.42, 10, 16), 0.3, 4), C.sun);
  s.p(c.cut([[0, -h - 4], [-26, -h - 24], [-38, -h - 20], [-18, -h - 10], [-8, -h - 2], [8, -h - 2], [18, -h - 10], [38, -h - 20], [26, -h - 24]], 0.4, 4) + c.cut(c.circ(0, -h - 12, 7, 10), 0.3, 3), C.sun);
  s.p(c.cut(c.rect(-40, -h + 8, 80, 6), 0.3, 5), C.sun);
  s.p(c.cut([[-36, -h + 14], [36, -h + 14], [36, -h + 84], [0, -h + 96], [-36, -h + 84]], 0.5, 6), shade(C.curtain2, -0.05));
  s.x(c.ribbon([[-30, -h + 22], [30, -h + 22]], 2) + c.ribbon([[-30, -h + 76], [30, -h + 76]], 2), C.sun);
  return s.out();
}

export default {
  id: 'mt8-authority',
  enter: 'fly',
  beats: [
    { v: 9, text: 'Bo i ja, choć podlegam władzy, mam pod sobą żołnierzy.' },
    { v: 9, cont: true, text: 'Mówię temu: "Idź!" - a idzie;' },
    { v: 9, cont: true, text: 'drugiemu: "Chodź tu!" - a przychodzi;' },
    { v: 9, cont: true, text: 'a słudze: "Zrób to!" - a robi».' },
  ],
  cam: { x: [-20, 40], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [14, 6, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);

    /* ---------- the courtyard: back wall with a door on the left and a gate on the right ---------- */
    const wallL = S.layer({ par: 0.3, sh: 4 });
    const w = sheet();
    const top = 360, base = 660;
    const gate = [[GATE - 70, base], [GATE - 70, 470], ...c.arc(GATE, 470, 70, 66, PI, 2 * PI, 12), [GATE + 70, base]];
    const door = [[DOOR - 44, base], [DOOR - 44, 530], ...c.arc(DOOR, 530, 44, 38, PI, 2 * PI, 10), [DOOR + 44, base]];
    w.p(c.cut([[-900, top], [2500, top], [2500, base + 10], [-900, base + 10]], 0.8, 16) + c.hole(gate, 0.4, 8) + c.hole(door, 0.4, 6), mix(C.plaster, C.sand, 0.2));
    w.p(c.cut(c.rect(-900, top - 16, 3400, 18), 0.4, 12), C.terracotta);
    w.p(c.ribbon([...c.arc(GATE, 470, 78, 74, PI, 2 * PI, 12)], 14) + c.ribbon([[GATE - 78, 470], [GATE - 78, base]], 14) + c.ribbon([[GATE + 78, 470], [GATE + 78, base]], 14), C.stone);
    w.p(c.ribbon([...c.arc(DOOR, 530, 50, 44, PI, 2 * PI, 10)], 10) + c.ribbon([[DOOR - 50, 530], [DOOR - 50, base]], 10) + c.ribbon([[DOOR + 50, 530], [DOOR + 50, base]], 10), C.wood2);
    let blocks = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-600, 2200), y = c.rr(top + 20, base - 30); if (Math.abs(x - GATE) < 110 || Math.abs(x - DOOR) < 70) continue; blocks += c.cut(c.rect(x, y, c.rr(40, 70), 18), 0.3, 6); }
    w.x(blocks, shade(C.plaster2, -0.05), 'opacity=".45"');
    // two shields hung on the wall
    w.p(c.cut(c.ell(560, 470, 26, 34, 16), 0.3, 4) + c.cut(c.ell(880, 470, 26, 34, 16), 0.3, 4), C.curtain2);
    w.x(c.poly(c.star(560, 470, 11, 4, 4, 0)) + c.poly(c.star(880, 470, 11, 4, 4, 0)), C.sun);
    // what is seen through the gate and the door: the street beyond
    const beyond = S.layer({ par: 0.28, sh: 1 });
    beyond.add(sheet().p(c.cut(c.rect(GATE - 80, 400, 160, 262), 0.4, 8), mix(C.skyBlue, C.cream, 0.4)).p(c.cut(c.rect(GATE - 80, 600, 160, 62), 0.4, 8), C.sand).p(c.cut(c.rect(DOOR - 50, 480, 100, 182), 0.4, 8), shade(C.plaster2, -0.3)).out() + cypress(c, GATE + 30, 610, 120) + olive(c, GATE - 40, 630, 0.5));
    wallL.add(w.out());
    wallL.add(`<g transform="translate(${CX - 150} ${base + 4})">${standard(c, 300)}</g>`);

    /* ---------- the court floor ---------- */
    const G = S.layer({ par: 0.4, sh: 3 });
    const g = sheet().p(c.cut([[-900, 650], [2500, 650], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.stone, C.sand, 0.45));
    let flags = '';
    for (let r = 0; r < 6; r++) for (let x = -700 + (r % 2) * 60; x < 2300; x += 120) flags += c.ribbon([[x, 660 + r * 40 + r * r * 6], [x + 110, 660 + r * 40 + r * r * 6]], 1.4);
    g.x(flags, shade(C.stone2, -0.1), 'opacity=".5"');
    G.add(g.out());

    /* ---------- Caesar's coin above him ---------- */
    const hangL = S.layer({ par: 0.2, sh: 6 });
    const coin = hanging(hangL, `<g transform="scale(-1 1)">${denarius(c, 62)}</g>`, { x: CX, y: -600, len: 900 });

    /* ---------- the men ---------- */
    const P = S.layer({ par: 0.4, sh: 5 });
    const LINE = [880, 960, 1040];
    const sol = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(soldier(c, i, { spear: 30 }))), seed: c.rr(0, 9) }));
    const comer = S.puppet(P.add(soldier(c, 3, { spear: 30 })));
    const boyB = S.puppet(P.add(person(c, { ...HOUSEBOY, holdF: `<g data-k="broom" transform="rotate(-10)">${broom(c)}</g>` })));
    const broomEl = S.$('broom');
    const puffs = [0, 1, 2].map(() => P.add(`<g opacity="0">${dust(c, 18, C.sand2)}</g>`));
    const cen = S.puppet(P.add(centurion(c)));

    const W = S.layer({ par: 0.42, sh: 3 });
    const words = [tr('Idź!', 'Go!'), tr('Chodź tu!', 'Come!'), tr('Zrób to!', 'Do this!')].map((txt, i) => W.add(`<g opacity="0">${bubble(c, txt, { size: 28, dir: i === 1 ? 1 : -1 })}</g>`));

    return (t, time) => {
      const T = time;
      hangAt(coin, CX, lerp(-600, 200, es(t, 0.05, 0.4, ease.out)), T, 1.2, 0.7);

      /* v9a — he is under authority, and has soldiers under him: they march in and stand in line */
      const go = es(t, 1.15, 1.7, (u) => u);
      const come = es(t, 2.2, 2.85);
      const turnL = es(t, 2.05, 2.12) * (1 - es(t, 2.95, 3.02));
      const order = [bump(t, 1.05, 1.95), bump(t, 2.1, 2.95), bump(t, 3.05, 3.95)];
      sol.forEach((sd) => {
        const k = es(t, 0.1 + sd.i * 0.08, 0.6 + sd.i * 0.08);
        let x = lerp(1500 + sd.i * 90, LINE[sd.i], k);
        const leaving = sd.i === 2 ? go : 0;
        if (sd.i === 2) x = lerp(x, GATE + 10, leaving);
        const walking = (k > 0 && k < 1) || (leaving > 0 && leaving < 1);
        const salute = bump(t, 0.6, 1.0) * (1 - leaving);
        sd.p.set({ x, y: FEET - 4 + sd.i * 3 - leaving * 30, s: 0.96 - leaving * 0.12, flip: !(leaving > 0.02), o: sd.i === 2 ? 1 - es(t, 1.72, 1.95) : 1, walk: walking ? x * 0.05 : undefined, armF: 30, armB: 10 + salute * 120, head: salute * -4, blink: blinkAt(T, sd.seed) });
      });
      const cx = lerp(-120, 500, come);
      comer.set({ x: cx, y: FEET + 2, s: 0.98, flip: false, o: t > 2.1 ? 1 : 0, walk: come > 0 && come < 1 ? cx * 0.05 : undefined, armF: 30 + es(t, 2.85, 3.0) * 70 * (1 - es(t, 3.4, 3.6)), blink: blinkAt(T, 9) });

      /* the centurion: stands, then gives his orders */
      const say = order[0] + order[1] + order[2];
      cen.set({ x: CX, y: FEET, s: 1.06, flip: turnL > 0.5, armF: 14 + order[0] * 80 + order[1] * 50 * (0.6 + 0.4 * Math.sin(T * 6)) + order[2] * 70, armB: 10 + bump(t, 0.1, 0.9) * 20, head: -say * 4, blink: blinkAt(T, 4) });
      const [hx, hy] = headAt(CX, FEET, 1.06, turnL > 0.5);
      words.forEach((wd, i) => {
        const a = 1.08 + i;
        const k = es(t, a, a + 0.18, ease.back) * (1 - es(t, a + 0.82, a + 0.9));
        pose(wd, { x: hx + (i === 1 ? -24 : 24), y: hy - 60, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v9d — the servant sweeps */
      const sweep = es(t, 3.3, 3.5);
      const sw = t > 3.3 ? Math.sin((t - 3.3) * 18) * sweep : 0;
      const up = es(t, 3.2, 3.32);
      const bx = 1200 - es(t, 3.3, 3.95) * 60;
      boyB.set({ x: bx, y: FEET + 10, s: 0.84, flip: true, armF: 20 + up * 40 + sw * 16, armB: 10 + up * 30, lean: sweep * 8, head: sweep * 6, blink: blinkAt(T, 6) });
      pose(broomEl, { r: -10 - up * 20 });
      puffs.forEach((p, i) => { const k = seg(t, 3.4 + i * 0.15, 3.85 + i * 0.12); pose(p, { x: bx - 70 - i * 30, y: FEET + 8 - k * 20, s: 0.5 + k, o: bump(t, 3.4 + i * 0.15, 3.85 + i * 0.12) * 0.8 }); });

      S.cam.z = 1.02 + es(t, 0.5, 1.0) * 0.04;
      S.cam.x = 10 + es(t, 1.0, 1.6) * 20 - es(t, 2.0, 2.5) * 30 + es(t, 3.0, 3.5) * 20;
      S.cam.y = 20;
    };
  },
};
