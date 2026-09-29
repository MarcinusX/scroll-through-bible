// Mt 14,1–2 — the curtains open on Herod's hall. A messenger runs in; the name of Jesus hangs in the air and the
// words fly from it straight into the tetrarch's ear. Herod turns to his servants: "It is John the Baptist" — John's
// portrait comes down from the flies — "he has risen from the dead": the portrait lifts in a burst of light, sparks
// of power circle it, and the king gets up from his throne, frightened.
import { C, person, blinkAt, pose, lerp, sky, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump, attr } from '../../core/anim.js';
import { kf, headAt, speech, GLYPH, spark, wordSlip, portrait, labelTag, throne, crown, faceBits, withFace, noble, L6, tr, PI } from './lib.js';

const Y = 690;

function column(c, x, y, h, w = 44, col = C.stone) {
  const s = sheet();
  s.p(c.cut(c.rect(x - w / 2, y - h, w, h), 0.5, 10), col);
  s.x(c.ribbon([[x - w * 0.2, y - h + 20], [x - w * 0.2, y - 16]], 3) + c.ribbon([[x + w * 0.15, y - h + 20], [x + w * 0.15, y - 16]], 3), shade(col, -0.12), 'opacity=".6"');
  s.p(c.cut(c.rect(x - w / 2 - 10, y - h - 14, w + 20, 16), 0.4, 6) + c.cut(c.rect(x - w / 2 - 8, y - 14, w + 16, 16), 0.4, 6), shade(col, -0.08));
  return s.out();
}

export default {
  id: 'mt14-rumour',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'I rzekł do swych dworzan: «To Jan Chrzciciel.' },
    { v: 2, cont: true, text: 'On powstał z martwych i dlatego moce cudotwórcze w nim działają».' },
  ],
  cam: { x: [-60, 60], y: [0, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, ['#b89fb8', '#e8b597', '#f3d0a4']);

    /* ---------- the hall, with a view of hills through two arches ---------- */
    const view = S.layer({ par: 0.12, sh: 1 });
    view.add(sheet().p(c.ridge(c.wave(440, [14, 5], [260, 90]), -900, 2500, 1700, 12, 1), mix(C.hillMid, C.duskViolet, 0.35)).out());
    const wall = S.layer({ par: 0.2, sh: 3 });
    const W = sheet();
    const arches = [520, 1080].map((x) => [[x - 60, 470], [x - 60, 300], ...c.arc(x, 300, 60, 60, PI, 2 * PI, 12), [x + 60, 470]]);
    W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 640], [-1200, 640]], 1, 30) + arches.map((a) => c.hole(a, 0.5, 6)).join(''), mix(C.stone, C.dawn, 0.3));
    let blocks = '';
    for (let y = -200; y < 620; y += 52) for (let x = -1200 + (Math.round(y / 52) % 2 ? 70 : 0); x < 2800; x += 140) blocks += c.cut(c.rect(x + c.rr(0, 6), y, c.rr(110, 128), 44), 0.6, 10);
    W.x(blocks, shade(C.stone, -0.05), 'opacity=".4"');
    let fr = '';
    for (let x = -600; x < 2400; x += 40) fr += c.cut(c.rect(x, 90, 20, 20), 0.2, 4);
    W.p(c.cut([[-1200, 82], [2800, 82], [2800, 118], [-1200, 118]], 0.4, 20), C.plumRobe).p(fr, C.sun);
    wall.add(W.out());
    wall.add(column(c, 320, 640, 540, 50) + column(c, 550, 640, 540, 50) + column(c, 1050, 640, 540, 50) + column(c, 1280, 640, 540, 50));

    /* ---------- from the flies: the name, John's portrait, light and sparks ---------- */
    const flies = S.layer({ par: 0.35, sh: 5 });
    const johnGlow = flies.add(`<g>${rays(c, { n: 16, r0: 40, r1: 300, spread: 0.05, color: '#fff3cf' })}<circle r="130" fill="url(#halo-glow)"/></g>`);
    const pj = hanging(flies, portrait(c, S.id('pj'), L6.john, { w: 118, h: 138, bg: mix(C.parchment, C.sand, 0.3), label: tr('Jan Chrzciciel', 'John the Baptizer') }), { x: 0, y: 0, len: 900 });
    const name = hanging(flies, `<g transform="scale(1.25)">${labelTag(tr('Jezus', 'Jesus'), 24)}</g>`, { x: 0, y: 0, len: 700 });
    const powers = [0, 1, 2, 3, 4].map(() => flies.add(`<g>${spark(c, 11)}</g>`));

    /* ---------- floor, dais, throne, lamps ---------- */
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
    const LAMPS = [640, 960];
    const flames = LAMPS.map((x) => {
      floor.add(`<g transform="translate(${x} ${Y - 30})">${sheet().p(c.cut([[-18, 0], [-6, -10], [-4, -120], [4, -120], [6, -10], [18, 0]], 0.3, 5), C.sun).out()}</g>`);
      return floor.add(`<g transform="translate(${x} ${Y - 150})"><circle r="60" fill="url(#warm-glow)"/><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/></g>`);
    });

    /* ---------- the court ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const COURT = [[430, 0], [510, 1], [590, 2], [1010, 3], [1090, 4], [1170, 5]].map(([x, i]) => ({ x, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, noble(c, i)))) }));
    const messenger = S.puppet(act.add(person(c, { robe: C.wheatRobe, belt: C.leather, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3 })));
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herodSit = S.puppet(act.add(hMark({ ...L6.herod, pose: 'sit' })));
    const herodUp = S.puppet(act.add(hMark({ ...L6.herod })));
    const worried = [herodSit, herodUp].map((p) => p.el.querySelector('[data-part="sad"]'));

    /* ---------- the report flying into his ear; what he says ---------- */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const words = Array.from({ length: 9 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(24, 32))), seed: c.rr(0, 6) }));
    const says = fx.add(`<g>${speech(c, `<g transform="translate(0 -30) scale(.34)">${portrait(c, S.id('pj2'), L6.john, { w: 110, h: 130 })}</g>`, { w: 70, h: 72, flip: false })}</g>`);
    const turnBubbles = [1, 4].map((ci, i) => ({ ci, i, el: fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40, flip: COURT[ci].x > 800 })}</g>`) }));

    /* ---------- drapes in front ---------- */
    const fg = S.layer({ par: 0.9, sh: 8 });
    fg.add(sheet().p(c.cut([[-1200, -1400], [2800, -1400], [2800, 70], [-1200, 80]], 0.8, 16), shade(C.plumRobe, -0.2)).x(c.ribbon([[-1200, 66], [2800, 62]], 6), C.sun).out());

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const risen = es(t, 3.05, 3.4);
      flames.forEach((f, i) => { const k = 1 + Math.sin(T * 9 + i * 2) * 0.08 + risen * Math.sin(T * 17 + i) * 0.1; pose(f, { x: LAMPS[i], y: Y - 150, sx: 1 / k, sy: k }); });

      /* v1 — the report about Jesus reaches Herod's ears */
      const mIn = kf(t, [[0.95, -220], [1.35, 640]], ease.out);
      const tell = bump(t, 1.35, 1.98);
      messenger.set({ x: mIn, y: Y + 34, s: 0.9, walk: t > 0.95 && t < 1.35 ? mIn * 0.07 : undefined, amt: 1.3, lean: t < 1.35 ? 8 : tell * 18, armF: tell * 70, head: tell * 10, o: 1 - es(t, 2.2, 2.4), blink: blinkAt(T, 3) });
      const nk = es(t, 1.15, 1.45, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(name, { x: 610, y: lerp(-500, 250, nk), r: Math.sin(T * 1.2) * 3, o: nk > 0.01 ? 1 : 0 });
      const [ex, ey] = headAt(808, Y - 38, 1.08, false, 62);
      words.forEach((w) => {
        const on = es(t, 1.35, 1.5) * (1 - es(t, 1.95, 2.1));
        const k = (T * 0.35 + w.i / 9) % 1;
        pose(w.el, { x: lerp(630, ex - 10, k), y: lerp(290, ey - 6, k) - Math.sin(k * PI) * (40 + (w.i % 3) * 20), r: Math.sin(T * 2 + w.seed) * 14, s: 1.6 - k * 0.7, o: on * Math.sin(k * PI) });
      });

      /* the portrait: "It is John" — then lifted up in light: "risen from the dead" */
      const pk = es(t, 2.1, 2.45, ease.back);
      const py = lerp(-760, 150, pk) - risen * 26;
      pose(pj, { x: 800, y: py, s: 1 + risen * 0.12, r: Math.sin(T * 1.1) * 1.6 * (1 - risen * 0.6), o: pk > 0.01 ? 1 : 0 });
      pose(johnGlow, { x: 800, y: py + 90, s: 0.3 + risen * 0.9, r: T * 4, o: risen * 0.55 });
      powers.forEach((sp, i) => {
        const on = es(t, 3.35 + i * 0.06, 3.55 + i * 0.06);
        const a = T * 1.3 + i * (PI * 2 / 5);
        pose(sp, { x: 800 + Math.cos(a) * 118, y: py + 100 + Math.sin(a) * 110, s: on * (0.8 + Math.sin(T * 3 + i) * 0.15), r: T * 40, o: on > 0.02 ? 1 : 0 });
      });

      /* the servants: whisper, then turn to the king; at "risen" they look up at the light */
      COURT.forEach((m) => {
        const turn = es(t, 2.05, 2.3);
        const up = es(t, 3.1, 3.3);
        const gasp = m.i === 1 || m.i === 4 ? bump(t, 3.1, 3.95) : 0;
        m.p.set({ x: m.x, y: Y + 26 + (m.i % 2) * 8, s: 0.9, flip: m.x > 800, armF: 20 + bump(t, 1.3, 1.95) * (m.i % 3 === 0 ? 60 : 0) + gasp * 70 + up * 20, armB: gasp * 120, head: -up * 14 + turn * 4 * (1 - up), lean: -gasp * 6, blink: blinkAt(T, m.seed) });
      });
      turnBubbles.forEach((b) => {
        const k = es(t, 3.2 + b.i * 0.1, 3.4 + b.i * 0.1, ease.back);
        const m = COURT[b.ci];
        const [hx, hy] = headAt(m.x, Y + 26 + (m.i % 2) * 8, 0.9, m.x > 800);
        pose(b.el, { x: hx + (m.x > 800 ? -18 : 18), y: hy - 22, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });

      /* Herod: listens (leaning to the word), speaks — and rises, afraid */
      const listen = bump(t, 1.3, 2.0);
      const speak = bump(t, 2.05, 2.95);
      const standUp = es(t, 3.05, 3.12);
      herodSit.set({ x: 808, y: Y - 38, s: 1.08, o: 1 - standUp, armF: 20 + speak * 70, armB: listen * 60 + speak * 150, head: listen * 12 - speak * 10, lean: -listen * 8, blink: blinkAt(T, 1) });
      const recoil = es(t, 3.1, 3.4);
      herodUp.set({ x: 812 - recoil * 10, y: Y - 34, s: 1.08, o: standUp, armF: 20 + recoil * 60, armB: 10 + recoil * 70, head: -recoil * 10, lean: -recoil * 8, blink: 0 });
      worried.forEach((w) => attr(w, 'opacity', (es(t, 2.2, 2.6) * 0.5 + recoil * 0.5).toFixed(2)));
      const sk = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.9, 3.0));
      const [hx, hy] = headAt(808, Y - 38, 1.08, false, 62);
      pose(says, { x: hx + 22, y: hy - 18, s: sk, o: sk > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.0], [0.9, 1.02], [1.3, 1.06], [2.0, 1.06], [2.4, 1.04], [3.1, 1.04], [3.6, 1.1]]);
      S.cam.y = kf(t, [[0, 30], [1.3, 40], [2.0, 30], [3.1, 20], [3.6, 30]]);
      S.cam.x = kf(t, [[0, 0], [0.9, 0], [1.3, -30], [2.0, -20], [2.4, 0]]);
    };
  },
};
