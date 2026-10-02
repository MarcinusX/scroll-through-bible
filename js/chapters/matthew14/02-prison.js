// Mt 14,3–5 — a story from before, on old sepia paper: Herod's guards lead John in bound and the barred door of
// the cell drops; the reason — Herodias, the wife of his brother Philip (Philip walks away, she takes Herod's arm
// under a wedding garland). From the cell John says, "It is not lawful for you to have her." Herod would kill him
// (a sword in his thought) — but outside the gate the people stand for John, "a prophet!", and the king steps back.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, cloud, sun } from '../../assets/nature.js';
import { es, ease, bump, attr } from '../../core/anim.js';
import { kf, moving, headAt, speech, thought, GLYPH, wordSlip, garland, crown, helmet, circlet, faceBits, withFace, labelTag, storyFrame, SEPIA, L6, mob, swordIcon, tr, PI } from './lib.js';

const Y = 690;
const CELL = { x0: 380, x1: 660, top: 400, floor: 672 };
const HALL = { x0: 730, x1: 1110 };
const GATE = 1250;

function bonds(c) { return sheet().p(c.ribbon(c.arc(0, 2, 9, 6, 0, PI * 2, 14), 3), C.rope).p(c.ribbon([[6, 6], [14, 26]], 2.4), C.rope).out(); }
function tablets(c) {
  const s = sheet();
  [-13, 13].forEach((x) => { s.p(c.cut([[x - 11, 16], [x - 11, -8], ...c.arc(x, -8, 11, 10, PI, 2 * PI, 6), [x + 11, 16]], 0.3, 3), C.stone); });
  let l = '';
  [-13, 13].forEach((x) => { for (let i = 0; i < 4; i++) l += c.ribbon([[x - 6, -6 + i * 6], [x + 6, -6 + i * 6]], 1.2); });
  s.x(l, C.ink, 'opacity=".5"');
  return s.out();
}
function ringsX(c) {
  return sheet().x(c.ribbon(c.arc(-9, 0, 11, 11, 0, PI * 2, 16), 3) + c.ribbon(c.arc(9, 0, 11, 11, 0, PI * 2, 16), 3), C.sun).x(c.ribbon([[-24, -18], [24, 18]], 4) + c.ribbon([[24, -18], [-24, 18]], 4), C.terracotta).out();
}

export default {
  id: 'mt14-prison',
  enter: 'fly',
  beats: [
    { v: 3, text: 'Herod bowiem kazał pochwycić Jana i związanego wrzucić do więzienia.' },
    { v: 3, cont: true, text: 'Powodem była Herodiada, żona brata jego, Filipa.' },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-120, 360], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    sky(S, SEPIA.sky);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.ochre, disc: mix(C.sun, C.parchment, 0.3), inner: mix(C.sun, C.cream, 0.5) }), { x: 1180, y: 180, len: 700 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.parchment), { x: 560, y: 150, len: 700 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 450, amps: [30, 12, 4], lens: [900, 330, 120], color: mix(C.dune, C.parchment, 0.45) }).markup);
    S.layer({ par: 0.22, sh: 2 }).add(band(c, { y: 520, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.sand2, C.dune, 0.35) }).markup);

    /* ---------- the fortress: the cell cut open (left), Herod's hall, the gate (right) ---------- */
    const walls = S.layer({ par: 0.45, sh: 3 });
    const B = sheet();
    const stone = mix(C.stone2, C.dune, 0.35);
    B.p(c.ridge(c.wave(Y - 20, [3, 1], [600, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.5));
    B.p(c.cut([[CELL.x0 - 40, Y - 10], [CELL.x0 - 40, CELL.top - 60], [CELL.x1 + 40, CELL.top - 60], [CELL.x1 + 40, Y - 10]], 1, 10), stone);
    let tb = '';
    for (let y = CELL.top - 56; y < Y - 20; y += 34) for (let x = CELL.x0 - 36 + (Math.round(y / 34) % 2) * 30; x < CELL.x1 + 30; x += 64) tb += c.cut(c.rect(x, y, 56, 28), 0.6, 8);
    B.p(tb, shade(stone, 0.12));
    let cren = '';
    for (let x = CELL.x0 - 40; x < CELL.x1 + 40; x += 44) cren += c.cut(c.rect(x, CELL.top - 90, 26, 32), 0.5, 5);
    B.p(cren, stone);
    B.p(c.cut(c.rect(CELL.x0, CELL.top, CELL.x1 - CELL.x0, CELL.floor - CELL.top), 0.6, 8), mix(C.soilDark, C.wood2, 0.45));
    B.p(c.cut(c.rect(CELL.x0, CELL.floor - 10, CELL.x1 - CELL.x0, 12), 0.4, 8), mix(C.soil, C.sand2, 0.4));
    B.p(c.cut([[CELL.x0 + 30, CELL.top + 40], [CELL.x0 + 30, CELL.top + 20], ...c.arc(CELL.x0 + 50, CELL.top + 20, 20, 18, PI, 2 * PI, 6), [CELL.x0 + 70, CELL.top + 40]], 0.3, 4), SEPIA.sky[0]);
    let straw = '';
    for (let i = 0; i < 24; i++) { const x = c.rr(CELL.x0 + 10, CELL.x1 - 10); straw += c.ribbon([[x, CELL.floor - 8], [x + c.rr(-12, 12), CELL.floor - c.rr(12, 20)]], 1.6); }
    B.x(straw, C.wheat2, 'opacity=".8"');
    // the hall
    B.p(c.cut([[HALL.x0, Y - 10], [HALL.x0, 360], [HALL.x1, 360], [HALL.x1, Y - 10]], 1, 10), mix(C.plaster, C.dune, 0.25));
    B.p(c.cut([[HALL.x0 - 20, 360], [HALL.x1 + 20, 360], [HALL.x1 + 20, 340], [HALL.x0 - 20, 340]], 0.6, 8), mix(C.plumRobe, C.dune, 0.4));
    let pil = '';
    [HALL.x0 + 30, HALL.x1 - 30].forEach((x) => { pil += c.cut(c.rect(x - 16, 370, 32, Y - 380), 0.5, 8); });
    B.p(pil, shade(C.plaster, -0.08));
    B.p(c.cut([[850, 560], [850, 440], ...c.arc(920, 440, 70, 60, PI, 2 * PI, 12), [990, 560]], 0.5, 8), mix(C.dune, C.plumRobe, 0.2));
    // the outer wall with its gate
    B.p(c.cut([[HALL.x1 + 20, Y - 10], [HALL.x1 + 20, 420], [GATE - 60, 420], [GATE - 60, Y - 10]], 0.8, 8), stone);
    B.p(c.cut([[GATE - 60, 420], [GATE - 60, 380], [GATE + 60, 380], [GATE + 60, 420]], 0.5, 6), stone);
    B.p(c.cut([[GATE - 50, Y - 10], [GATE - 50, 470], ...c.arc(GATE, 470, 50, 44, PI, 2 * PI, 10), [GATE + 50, Y - 10]], 0.5, 8), mix(C.soilDark, C.dune, 0.35));
    B.p(c.cut([[GATE + 60, Y - 10], [GATE + 60, 420], [2400, 420], [2400, Y - 10]], 0.8, 8), stone);
    walls.add(B.out());
    const hallGar = walls.add(`<g>${garland(c, 300, 40)}</g>`);

    /* ---------- the people outside the gate (one still cut-out, slides in) ---------- */
    const outL = S.layer({ par: 0.48, sh: 4 });
    const people = outL.sprite(mob(c, 7, { s: 0.78, flip: true, spread: 42, rows: 2, arms: 60 }), GATE + 20, Y + 10);

    /* ---------- the people inside ---------- */
    const act = S.layer({ par: 0.5, sh: 5 });
    const john = S.puppet(act.add(person(c, { ...L6.john, holdF: bonds(c) })));
    const johnSit = S.puppet(act.add(person(c, { ...L6.john, pose: 'sit', holdF: bonds(c) })));
    const guards = [0, 1].map((i) => S.puppet(act.add(withFace(person(c, { ...L6.guard, robe: i ? shade(L6.guard.robe, 0.1) : L6.guard.robe }), helmet(c)))));
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herod = S.puppet(act.add(hMark({ ...L6.herod })));
    const hSad = herod.el.querySelector('[data-part="sad"]');
    const hAngry = herod.el.querySelector('[data-part="angry"]');
    const herodias = S.puppet(act.add(withFace(withFace(person(c, L6.herodias), circlet(c)), faceBits(c))));
    const hdBrows = herodias.el.querySelector('[data-part="angry"]');
    const philip = S.puppet(act.add(person(c, { robe: C.tealRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun })));
    const barsEl = act.add(`<g>${sheet().p([0, 1, 2, 3, 4, 5].map((i) => c.cut(c.rect(i * 48, 0, 9, CELL.floor - CELL.top), 0.3, 8)).join('') + c.cut(c.rect(-6, 60, 258, 10), 0.3, 8) + c.cut(c.rect(-6, 180, 258, 10), 0.3, 8), mix(C.ink, C.storm, 0.4)).out()}</g>`);

    /* ---------- tags and bubbles ---------- */
    const fx = S.layer({ par: 0.55, sh: 4 });
    const tag = (pl, en, size = 20) => hanging(fx, labelTag(tr(pl, en), size), { x: 0, y: 0, len: 600 });
    const tagJ = tag('Jan', 'John'), tagH = tag('Herod', 'Herod'), tagHd = tag('Herodiada', 'Herodias'), tagF = tag('Filip, jego brat', 'Philip, his brother', 18);
    const tagP = hanging(fx, `<g transform="scale(1.15)">${labelTag(tr('prorok!', 'a prophet!'), 22)}</g>`, { x: 0, y: 0, len: 600 });
    const law = fx.add(`<g>${speech(c, `<g transform="translate(-20 0)">${tablets(c)}</g><g transform="translate(26 0) scale(.8)">${ringsX(c)}</g>`, { w: 110, h: 64 })}</g>`);
    const kill = fx.add(`<g>${thought(c, `<g transform="translate(0 20) rotate(-20)">${swordIcon(c, 40)}</g>`, { w: 60, h: 62 })}</g>`);
    const afraid = fx.add(`<g>${thought(c, GLYPH.q(c, C.ochre), { w: 50, h: 44 })}</g>`);
    const words = [0, 1, 2].map(() => fx.add(wordSlip(c, 26)));

    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1180, 180, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 150, T, 1.1, 0.6, 1);

      /* v3a — seized, bound, thrown into prison */
      const jKeys = [[-0.3, -120], [0.4, 520]];
      const jx = kf(t, jKeys);
      const sitK = es(t, 0.5, 0.56);
      john.set({ x: jx, y: CELL.floor - 4, s: 0.94, o: 1 - sitK, walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 40, armB: 36, head: 6, lean: 3, blink: blinkAt(T, 2) });
      const preach = bump(t, 2.05, 2.95);
      johnSit.set({ x: 520 + es(t, 2.0, 2.2) * 70 * (1 - es(t, 2.9, 3.2)), y: CELL.floor - 4, s: 0.94, o: sitK, armF: 40 + preach * 40, armB: 36 + preach * 110, head: -preach * 6, blink: blinkAt(T, 2) });
      guards.forEach((g, i) => {
        const gx = kf(t, [[-0.3, -60 - i * 160], [0.4, 600 - i * 150], [0.45, 600 - i * 150], [0.7, 700 + i * 30]]);
        const walking = (t > -0.3 && t < 0.4) || (t > 0.45 && t < 0.7);
        g.set({ x: gx, y: Y + 6 + i * 4, s: 0.94, flip: t > 0.45 && t < 0.7, o: i === 1 ? 1 - es(t, 0.96, 1.0) : 1, walk: walking ? gx * 0.05 + i : undefined, armF: 30 + (t < 0.5 ? 30 : 0), blink: blinkAt(T, 5 + i) });
      });
      const drop = es(t, 0.5, 0.62, ease.in);
      pose(barsEl, { x: CELL.x0 + 14, y: CELL.top - (1 - drop) * (CELL.floor - CELL.top + 80), o: drop > 0.01 ? 1 : 0 });

      /* Herod: orders the arrest; weds Herodias; turns from John's word; wants to kill; fears the people */
      const order = bump(t, -0.1, 0.6);
      const wantKill = es(t, 3.05, 3.25);
      const seePeople = es(t, 3.4, 3.6);
      const hx = 900 + seePeople * 30;
      herod.set({ x: hx, y: Y, s: 1.0, flip: order > 0.2 || (t > 2.0 && t < 3.4), o: 1, armF: order * 100 + wantKill * (1 - seePeople) * 40 + seePeople * 60, armB: bump(t, 1.2, 1.9) * 40 + seePeople * 140, head: bump(t, 2.3, 2.95) * 14 - seePeople * 8, lean: -seePeople * 8, blink: blinkAt(T, 1) });
      attr(hAngry, 'opacity', (bump(t, 2.3, 3.0) + wantKill * (1 - seePeople)).toFixed(2));
      attr(hSad, 'opacity', (seePeople * 0.9).toFixed(2));
      const hdIn = es(t, 1.0, 1.3);
      herodias.set({ x: lerp(1300, 1010, hdIn) + seePeople * 40, y: Y + 4, s: 0.96, flip: true, o: hdIn > 0 ? 1 : 0, walk: hdIn > 0 && hdIn < 1 ? t * 30 : undefined, armF: bump(t, 1.3, 1.9) * 40 + bump(t, 3.05, 3.5) * 50, armB: es(t, 2.4, 2.7) * 50, head: -bump(t, 2.3, 2.9) * 8, blink: blinkAt(T, 4) });
      attr(hdBrows, 'opacity', es(t, 2.3, 2.6).toFixed(2));
      const phK = es(t, 1.1, 1.3) * (1 - es(t, 1.85, 2.0));
      const phx = lerp(1100, P ? 1170 : 1240, es(t, 1.5, 1.95));   // phone: he walks off less far, still in sight
      philip.set({ x: phx, y: Y + 10, s: 0.9, flip: t < 1.5, o: phK, walk: t > 1.5 && t < 1.95 ? phx * 0.06 : undefined, armF: bump(t, 1.15, 1.5) * 50, head: 10, blink: blinkAt(T, 9) });
      const gar = es(t, 1.15, 1.4) * (1 - es(t, 2.9, 3.1));
      pose(hallGar, { x: 950, y: 380 - (1 - gar) * 420, o: gar > 0.01 ? 1 : 0 });

      /* tags */
      const tg = (el, x, y, k) => pose(el, { x, y: lerp(-500, y, k), r: Math.sin(T * 1.2 + x) * 3, o: k > 0.01 ? 1 : 0 });
      tg(tagJ, 520, CELL.top - 130, es(t, 0.1, 0.4, ease.back) * (1 - es(t, 0.95, 1.1)));
      tg(tagH, 900, 290, es(t, 0.05, 0.35, ease.back) * (1 - es(t, 1.95, 2.1)));
      tg(tagHd, 1010, 320, es(t, 1.1, 1.4, ease.back) * (1 - es(t, 1.95, 2.1)));
      tg(tagF, P ? 1090 : 1180, 400, es(t, 1.15, 1.4, ease.back) * (1 - es(t, 1.85, 2.0)));

      /* v4 — "It is not lawful for you to have her" */
      const lw = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.92, 3.05));
      pose(law, { x: 650, y: CELL.top + 60, s: lw * 1.3, o: lw > 0.01 ? 1 : 0 });
      words.forEach((w, i) => {
        const k = (T * 0.45 + i / 3) % 1;
        const on = es(t, 2.3, 2.45) * (1 - es(t, 2.9, 3.0));
        pose(w, { x: lerp(640, hx - 20, k), y: lerp(CELL.top + 140, 510, k) - Math.sin(k * PI) * 40, r: Math.sin(T * 2 + i) * 10, s: 0.8, o: on * Math.sin(k * PI) });
      });

      /* v5 — he would kill him (a sword in his thought) — but he fears the people, who hold John a prophet */
      const [tx, ty] = headAt(hx, Y, 1.0, t > 2.0 && t < 3.4);
      const kk = es(t, 3.08, 3.25, ease.back);
      pose(kill, { x: tx - 4, y: ty - 18, s: kk, o: kk > 0.01 ? 1 : 0 });
      const ak = 0;
      pose(afraid, { x: tx + 4, y: ty - 18, s: ak, o: ak > 0.01 ? 1 : 0 });
      const pin = es(t, 3.2, 3.5);
      people.set({ x: lerp(GATE + 260, P ? GATE - 75 : GATE - 30, pin), y: Y + 10, o: pin > 0.01 ? 1 : 0 });
      tg(tagP, P ? GATE - 75 : GATE - 30, 400, es(t, 3.3, 3.55, ease.back));

      // phone: further left for the cell, right for Philip walking off, and right again for the people at the gate
      S.cam.x = kf(t, P ? [[0, -110], [0.9, -110], [1.2, 240], [1.9, 240], [2.2, 20], [3.0, 20], [3.35, 350]] : [[0, -30], [0.9, -30], [1.2, 60], [1.9, 60], [2.2, 20], [3.0, 20], [3.35, 260]]);
      S.cam.z = kf(t, [[0, 1.06], [1.2, 1.08], [2.2, 1.06], [3.0, 1.06], [3.35, 1.04]]);
      S.cam.y = kf(t, [[0, 20], [4, 30]]);
    };
  },
};
