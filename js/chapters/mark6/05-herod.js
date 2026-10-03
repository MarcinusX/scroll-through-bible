// Mk 6,14–16 — at Herod's court the name of Jesus is on every lip. Three portraits come down from the flies:
// John risen? Elijah? One of the prophets? Herod, uneasy on his throne, is sure: "It is John."
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, headAt, hand, speech, spark, wordSlip, scrollRolled, candle, portrait, labelTag, throne, crown, faceBits, withFace, noble, LOOK, DY } from './lib.js';

const PI = Math.PI;
const Y = 690;

function column(c, x, y, h, w = 44, col = C.stone) {
  const s = sheet();
  s.p(c.cut(c.rect(x - w / 2, y - h, w, h), 0.5, 10), col);
  s.x(c.ribbon([[x - w * 0.2, y - h + 20], [x - w * 0.2, y - 16]], 3) + c.ribbon([[x + w * 0.15, y - h + 20], [x + w * 0.15, y - 16]], 3), shade(col, -0.12), 'opacity=".6"');
  s.p(c.cut(c.rect(x - w / 2 - 10, y - h - 14, w + 20, 16), 0.4, 6) + c.cut(c.rect(x - w / 2 - 8, y - 14, w + 16, 16), 0.4, 6), shade(col, -0.08));
  return s.out();
}
export default {
  id: 'm6-herod',
  beats: [
    { v: 14, text: 'Także król Herod posłyszał o Nim gdyż Jego imię nabrało rozgłosu,' },
    { v: 14, cont: true, text: 'i mówił: «Jan Chrzciciel powstał z martwych i dlatego moce cudotwórcze działają w Nim».' },
    { v: 15, text: 'Inni zaś mówili: «To jest Eliasz»;' },
    { v: 15, cont: true, text: 'jeszcze inni utrzymywali, że to prorok, jak jeden z dawnych proroków.' },
    { v: 16 },
  ],
  cam: { x: [-60, 60], y: [0, 70], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    sky(S, ['#b89fb8', '#e8b597', '#f3d0a4']);

    /* ---------- the hall ---------- */
    const wall = S.layer({ par: 0.2, sh: 3 });
    const W = sheet();
    const arches = [520, 1080].map((x) => [[x - 60, 470], [x - 60, 300], ...c.arc(x, 300, 60, 60, PI, 2 * PI, 12), [x + 60, 470]]);
    W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 640], [-1200, 640]], 1, 30) + arches.map((a) => c.hole(a, 0.5, 6)).join(''), mix(C.stone, C.dawn, 0.3));
    let blocks = '';
    for (let y = -200; y < 620; y += 52) for (let x = -1200 + (Math.round(y / 52) % 2 ? 70 : 0); x < 2800; x += 140) blocks += c.cut(c.rect(x + c.rr(0, 6), y, c.rr(110, 128), 44), 0.6, 10);
    W.x(blocks, shade(C.stone, -0.05), 'opacity=".4"');
    // a frieze of gold squares
    let fr = '';
    for (let x = -600; x < 2400; x += 40) fr += c.cut(c.rect(x, 90, 20, 20), 0.2, 4);
    W.p(c.cut([[-1200, 82], [2800, 82], [2800, 118], [-1200, 118]], 0.4, 20), C.plumRobe).p(fr, C.sun);
    wall.add(W.out());
    wall.add(column(c, 320, 640, 540, 50) + column(c, 800 - 250, 640, 540, 50) + column(c, 800 + 250, 640, 540, 50) + column(c, 1280, 640, 540, 50));
    // hills far away through the arches
    const view = S.layer({ par: 0.12, sh: 1 });
    view.add(sheet().p(c.ridge(c.wave(440, [14, 5], [260, 90]), -900, 2500, 1700, 12, 1), mix(C.hillMid, C.duskViolet, 0.35)).out());
    // move the view behind the wall
    wall.el.parentNode.insertBefore(view.el, wall.el);

    /* ---------- the portraits in the flies ---------- */
    const flies = S.layer({ par: 0.35, sh: 5 });
    const P = [
      { look: LOOK.john, label: tr('Jan Chrzciciel?', 'John the Baptizer?'), x: 590, y: 200, extra: '' },
      { look: LOOK.elijah, label: tr('Eliasz?', 'Elijah?'), x: 1010, y: 200, extra: `<path d="${c.cut(c.star(40, 130, 30, 14, 9, 0), 0.4, 4)}" fill="${C.terracotta}" opacity=".85"/><path d="${c.cut(c.star(40, 132, 18, 8, 9, 0.3), 0.3, 3)}" fill="${C.sun}"/>` },
      { look: LOOK.prophet, label: tr('prorok?', 'a prophet?'), x: 800, y: 150, extra: '' },
    ].map((p, i) => {
      const el = hanging(flies, portrait(c, S.id('por' + i), p.look, { w: 110, h: 130, bg: i === 0 ? mix(C.parchment, C.sand, 0.3) : i === 1 ? mix(C.parchment, C.apricot, 0.3) : mix(C.parchment, C.skyVeil, 0.4), extra: p.extra, label: p.label }), { x: 0, y: 0, len: 800 });
      return { ...p, i, el };
    });
    const scrollBit = flies.add(`<g>${scrollRolled(c, 40)}</g>`);
    const powers = [0, 1, 2, 3].map(() => flies.add(`<g>${spark(c, 10)}</g>`));
    const johnGlow = flies.add(`<g>${rays(c, { n: 14, r0: 40, r1: 260, spread: 0.05, color: '#fff3cf' })}</g>`);

    /* ---------- floor, dais, throne ---------- */
    const floor = S.layer({ par: 0.45, sh: 3 });
    const F = sheet();
    F.p(c.cut([[-1200, 630], [2800, 630], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.sand, 0.3));
    let chk = '';
    for (let y = 650; y < 1100; y += 44) for (let x = -600 + (Math.round(y / 44) % 2) * 50; x < 2200; x += 100) chk += c.poly([[x, y], [x + 50, y], [x + 50, y + 22], [x, y + 22]]);
    F.x(chk, mix(C.plumRobe, C.stone, 0.6), 'opacity=".35"');
    F.p(c.cut([[660, Y - 30], [940, Y - 30], [960, Y], [640, Y]], 0.5, 8), shade(C.stone2, -0.05));
    F.p(c.cut([[620, Y], [980, Y], [990, Y + 18], [610, Y + 18]], 0.5, 8), C.stone2);
    F.p(c.cut([[590, Y + 18], [1010, Y + 18], [1020, Y + 30], [580, Y + 30]], 0.4, 8), C.plumRobe);
    floor.add(F.out());
    floor.add(`<g transform="translate(804 ${Y - 30}) scale(1.1)">${throne(c)}</g>`);
    const cands = [640, 960].map((x) => {
      floor.add(`<g transform="translate(${x} ${Y - 30})">${sheet().p(c.cut([[-18, 0], [-6, -10], [-4, -120], [4, -120], [6, -10], [18, 0]], 0.3, 5), C.sun).out()}</g>`);
      return floor.add(`<g transform="translate(${x} ${Y - 150})"><circle r="60" fill="url(#warm-glow)"/><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/></g>`);
    });

    /* ---------- the court ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    // phone: the courtiers closer in, so the two who speak (Elijah! a prophet!) are not under the thread
    const COURT = (S.portrait ? [[500, 0], [565, 1], [630, 2], [965, 3], [1020, 4], [1070, 5]] : [[440, 0], [520, 1], [600, 2], [1000, 3], [1080, 4], [1160, 5]]).map(([x, i]) => ({ x, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, noble(c, i)))) }));
    const messenger = S.puppet(act.add(person(c, { robe: C.wheatRobe, belt: C.leather, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3 })));
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herodSit = S.puppet(act.add(hMark({ ...LOOK.herod, pose: 'sit' })));
    const herodUp = S.puppet(act.add(hMark({ ...LOOK.herod })));
    const worried = [herodSit, herodUp].map((p) => p.el.querySelector('[data-part="sad"]'));

    /* ---------- whispers ---------- */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const name = hanging(fx, paperLabel(tr('Jezus', 'Jesus'), { size: 30 }), { x: 0, y: 0, len: 600 });
    const whispers = Array.from({ length: 8 }, (_, i) => ({ el: fx.add(wordSlip(c, c.rr(22, 30))), i, seed: c.rr(0, 6) }));
    const bubbles = [1, 4, 5].map((ci, i) => ({ ci, i, el: fx.add(`<g>${speech(c, `<g transform="scale(.8)">${labelTag(['!', tr('Eliasz!', 'Elijah!'), tr('prorok!', 'a prophet!')][i], 16)}</g>`, { w: i ? 96 : 44, h: 40, flip: COURT[ci].x > 800 })}</g>`) }));

    /* ---------- drapes in front ---------- */
    const fg = S.layer({ par: 0.9, sh: 8 });
    // phone: the drape is a valance, not a sheet filling the top of the tall screen
    fg.add(sheet().p(c.cut([[-1200, S.portrait ? -10 : -1400], [2800, S.portrait ? -10 : -1400], [2800, 70], [-1200, 80]], 0.8, 16), shade(C.plumRobe, -0.2)).x(c.ribbon([[-1200, 66], [2800, 62]], 6), C.sun).out());

    return (t, time) => {
      const T = time;
      cands.forEach((f, i) => { const k = 1 + Math.sin(T * 9 + i * 2) * 0.08 + (t > 4 ? Math.sin(T * 17 + i) * 0.1 : 0); pose(f, { x: [640, 960][i], y: Y - 150, sx: 1 / k, sy: k }); });

      /* v14a — the name spreads through the palace */
      const mIn = kf(t, [[-0.2, -200], [0.35, 640]], ease.out);
      messenger.set({ x: mIn, y: Y + 30, s: 0.9, walk: t < 0.35 ? mIn * 0.07 : undefined, amt: 1.3, lean: t < 0.35 ? 8 : bump(t, 0.4, 0.9) * 20, armF: bump(t, 0.35, 0.95) * 70, head: bump(t, 0.4, 0.9) * 10, o: 1 - es(t, 1.2, 1.4), blink: blinkAt(T, 3) });
      const nm = es(t, 0.35, 0.6, ease.back) * (1 - es(t, 1.05, 1.3));
      pose(name, { x: 800, y: lerp(-400, 300, nm), r: Math.sin(T * 1.2) * 3, o: nm > 0.01 ? 1 : 0 });
      whispers.forEach((w) => {
        const k = ((T * 0.3 + w.i / 8) % 1);
        const on = es(t, 0.4, 0.6) * (1 - es(t, 1.0, 1.2));
        const from = COURT[w.i % 6], to = COURT[(w.i + 1) % 6];
        pose(w.el, { x: lerp(from.x, to.x, k), y: 470 - Math.sin(k * PI) * 60 - (w.i % 3) * 16, r: Math.sin(T * 2 + w.seed) * 14, s: 0.8, o: on * Math.sin(k * PI) });
      });

      /* the portraits */
      const standUp = es(t, 4.05, 4.12);
      const toCentre = es(t, 4.05, 4.5);
      P.forEach((p) => {
        const on = p.i === 0 ? es(t, 1.1, 1.4, ease.back) : p.i === 1 ? es(t, 2.1, 2.4, ease.back) : es(t, 3.1, 3.4, ease.back);
        const away = p.i === 0 ? 0 : es(t, 4.05, 4.4);
        const x = p.i === 0 ? lerp(p.x, 800, toCentre) : p.x;
        const y = p.i === 0 ? lerp(p.y, 130, toCentre) : p.y;
        pose(p.el, { x, y: lerp(-700, y, on) - away * 800, s: p.i === 0 ? 1 + toCentre * 0.25 : 1, r: Math.sin(T * 1.1 + p.i) * 1.8, o: on > 0.01 ? 1 : 0 });
      });
      const pk = es(t, 3.2, 3.5) * (1 - es(t, 4.05, 4.3));
      pose(scrollBit, { x: 846, y: 290, r: -20, s: pk, o: pk > 0.01 ? 1 : 0 });
      powers.forEach((sp, i) => {
        const on = bump(t, 1.35 + i * 0.05, 2.0) + bump(t, 4.3, 5.2);
        const cx = lerp(590, 800, toCentre), cy = lerp(280, 230, toCentre);
        pose(sp, { x: cx + Math.cos(T * 1.5 + i * 1.57) * 86, y: cy + Math.sin(T * 1.5 + i * 1.57) * 96, s: on * 0.8, r: T * 40, o: on > 0.02 ? 1 : 0 });
      });
      pose(johnGlow, { x: 800, y: 230, s: 0.5 + toCentre * 0.6, r: T * 4, o: toCentre * 0.35 });

      /* courtiers talk: John? Elijah! a prophet! */
      COURT.forEach((m) => {
        const tell = m.i === 4 ? bump(t, 2.05, 2.95) : m.i === 5 ? bump(t, 3.05, 3.95) : m.i === 1 ? bump(t, 0.4, 1.0) : 0;
        const lookUp = es(t, 1.1, 1.3) * (1 - es(t, 4.0, 4.2)) * 0.6 + es(t, 4.1, 4.3) * 0.4;
        const back = es(t, 4.1, 4.3);
        m.p.set({ x: m.x, y: Y + 26 + (m.i % 2) * 8, s: 0.9, flip: m.x > 800, armF: tell * 90 + back * 30, armB: tell * 60, head: -lookUp * 12 - tell * 4, lean: -back * 5 * (m.x > 800 ? -1 : 1), blink: blinkAt(T, m.seed) });
      });
      bubbles.forEach((b) => {
        const k = b.i === 0 ? es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.95, 1.05)) : b.i === 1 ? es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0)) : es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.0));
        const m = COURT[b.ci];
        const [hx, hy] = headAt(m.x, Y + 26 + (m.i % 2) * 8, 0.9, m.x > 800);
        pose(b.el, { x: hx + (m.x > 800 ? -20 : 20), y: hy - 24, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* Herod: listens, speaks, then rises: "It is John, whom I beheaded" */
      const say = bump(t, 1.05, 1.95);
      herodSit.set({ x: 808, y: Y - 38, s: 1.08, o: 1 - standUp, armF: 20 + bump(t, 0.3, 1.0) * 30 + say * 110, armB: bump(t, 0.3, 1.0) * 140, head: bump(t, 0.3, 1.0) * -8 - say * 12 + bump(t, 2.05, 3.9) * 6, lean: bump(t, 0.3, 1.0) * -6, blink: blinkAt(T, 1) });
      const recoil = es(t, 4.1, 4.4);
      herodUp.set({ x: 812 - recoil * 10, y: Y - 34, s: 1.08, o: standUp, armF: 20 + recoil * 70, armB: recoil * 150, head: -recoil * 14, lean: -recoil * 8, blink: 0 });
      worried.forEach((w) => attr(w, 'opacity', (es(t, 2.2, 2.6) * 0.6 + recoil * 0.4).toFixed(2)));

      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.04], [1.3, 1.08], [3.9, 1.08], [4.5, 1.2]]);
      S.cam.y = kf(t, [[0, 30], [3.9, 20], [4.5, 60]]);
      S.cam.x = kf(t, [[0, -40], [0.8, 0], [1.3, -30], [1.9, -30], [2.2, 30], [2.9, 30], [3.2, 0]]);
    };
  },
};
