// Łk 23,11–12 — Herod's hall. Herod and his guard treat Him with contempt: the guards bow in mock homage and
// laugh (grey "ha ha" scraps that fall before they reach Him), Herod throws back his head and waves Him away.
// For a jest a gleaming white robe with a golden hem comes down on its strings onto His shoulders; He stands
// quiet and upright in it. Two of the guard lead Him out, back to Pilate. Then two portraits come down on the
// fly-lines, Herod and Pilate, turned away from each other: they turn, come together, and a red cord ties them —
// friends from that day. Beside them a small grey plate recalls what was before: the same two back to back,
// a dark crack between them.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { withFace, faceBits } from '../mark6/lib.js';
import { kf, moving, hand, headAt, hguard, herodHall, candleSet, herodCrown, taunt, gleamRobe, bustPortrait, wordCard, pilate, bonds, HEROD, JESUS_GLEAM, HALL, LOOK, tr, PI } from './lib.js';

const JX = 780, JY = 704;
const HS = [1142, 652], HU = [1080, 664];

export default {
  id: 'lk23-scorn',
  beats: [
    { v: 11, text: 'Wówczas wzgardził Nim Herod wraz ze swoją strażą;' },
    { v: 11, cont: true, text: 'na pośmiewisko kazał ubrać Go w lśniący płaszcz' },
    { v: 11, cont: true, text: 'i odesłał do Piłata.' },
    { v: 12, text: 'W tym dniu Herod i Piłat stali się przyjaciółmi.' },
    { v: 12, cont: true, text: 'Przedtem bowiem żyli z sobą w nieprzyjaźni.' },
  ],
  cam: { x: [-60, 140], y: [-60, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const H = herodHall(S);
    const P = H.charL;
    const hMark = (o) => withFace(withFace(person(c, o), herodCrown(c)), faceBits(c));
    const hSit = S.puppet(P.add(hMark({ ...HEROD, pose: 'sit' })));
    const hUp = S.puppet(P.add(hMark({ ...HEROD })));
    const G = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(hguard(c, i))), seed: c.rr(0, 9) }));
    const jB = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c) })));
    const jG = S.puppet(P.add(person(c, { ...JESUS_GLEAM, holdF: bonds(c) })));
    const fx = H.fxL;
    const robeL = S.layer({ par: 0.56, sh: 6 });
    const robe = robeL.add(`<g><path d="M-30 0V-1400M30 0V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${gleamRobe(c, 0.9)}</g>`);
    const glints = [0, 1, 2, 3].map(() => fx.add(`<g><path d="${c.poly(c.star(0, 0, 9, 2.4, 4, 0))}" fill="${C.sun}"/></g>`));
    const has = [0, 1, 2, 3].map((i) => fx.add(`<g>${taunt(c, 'ha ha', { size: 14, w: 58, side: i % 2 ? -1 : 1 })}</g>`));

    /* the portraits of Herod and Pilate */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const hB = withFace(person(c, { ...HEROD }), herodCrown(c));
    const pB = pilate(c);
    const port = (m, i, flip) => `<g>${bustPortrait(c, S.id('bp' + i), `<g transform="scale(${flip ? -1 : 1} 1)">${m}</g>`, { w: 110, h: 128, bg: i ? mix(C.parchment, C.skyVeil, 0.35) : mix(C.parchment, C.apricot, 0.3), label: i ? tr('Piłat', 'Pilate') : tr('Herod', 'Herod') })}</g>`;
    const porH = flies.add(`<g><path d="M-40 0V-1500M40 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/><g class="face">${port(hB, 0, false)}</g><g class="back" opacity="0">${port(hB, 2, true)}</g></g>`);
    const porP = flies.add(`<g><path d="M-40 0V-1500M40 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/><g class="face">${port(pB, 1, true)}</g><g class="back" opacity="0">${port(pB, 3, false)}</g></g>`);
    const cord = flies.add(`<g><path d="${c.ribbon(c.qbez([-70, 0], [0, 14], [70, 0], 12), 4)}" fill="${C.curtain2}"/><path d="${c.cut(c.blob(0, 8, 12, 8, 9, 0.2), 0.3, 3)}" fill="${C.curtain2}"/><path d="${c.ribbon([[-2, 12], [-12, 34]], 3) + c.ribbon([[2, 12], [12, 34]], 3)}" fill="${C.curtain2}"/></g>`);
    /* the grey plate of "before": back to back, a crack between them */
    const bs = sheet().p(c.cut(c.rect(-120, 0, 240, 150), 0.6, 8), mix(C.stone2, C.storm, 0.3)).p(c.cut(c.rect(-110, 10, 220, 130), 0.5, 8), mix(C.stone, C.storm2, 0.2));
    const mini = (m, x, flip) => `<g transform="translate(${x} ${10 + 130 * 0.42 + 167 * 0.9}) scale(${flip ? -0.9 : 0.9} .9)">${m}</g>`;
    const cid = S.id('before');
    const crack = `<path d="${c.poly([[-6, 10], [8, 40], [-4, 60], [10, 92], [-2, 112], [6, 140], [-6, 140], [-14, 112], [-6, 92], [-18, 60], [-6, 40], [-16, 10]])}" fill="#2a2433"/>`;
    const beforeM = `<path d="M-60 0V-1500M60 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${bs.out()}<clipPath id="${cid}"><rect x="-110" y="10" width="220" height="130"/></clipPath><g clip-path="url(#${cid})" opacity=".55">${mini(hB, -52, true)}${mini(pB, 58, false)}</g>${crack}<g transform="translate(0 164)">${wordCard(c, tr('przedtem', 'before'), { size: 16, fill: C.stone })}</g>`;
    const before = flies.add(`<g>${beforeM}</g>`);

    return (t, time) => {
      const T = time;
      H.candles.forEach((cd) => candleSet(cd, 1, T));

      /* Herod: laughs and waves Him away (v11a); points (v11b); sits back (v11c); pleased (v12) */
      const sitBack = es(t, 2.2, 2.28);
      const laugh = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const point = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      hUp.set({ x: HU[0], y: HU[1], s: 1.06, flip: true, o: 1 - sitBack, armF: 20 + laugh * 40 + point * 70, armB: 10 + laugh * 120 + point * 20, head: -laugh * 12 + (T ? Math.sin(T * 9) * 3 * laugh : 0), lean: laugh * 6, blink: blinkAt(T, 1) });
      hSit.set({ x: HS[0], y: HS[1], s: 1.06, flip: true, o: sitBack, armF: 26 + es(t, 3.1, 3.4) * 30, armB: 10, head: -4 - es(t, 3.1, 3.4) * 6, lean: -es(t, 3.1, 3.4) * 4, blink: blinkAt(T, 1) });

      /* the guard: mock bows and laughter */
      const mock = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.15));
      const lead = es(t, 2.05, 3.1, ease.in);
      G.forEach((g) => {
        const base = [[600, JY + 4, false], [960, JY + 2, true], [1020, JY + 12, true]][g.i];
        const bow = mock * bump(t, 0.1 + g.i * 0.12, 0.9 + g.i * 0.06);
        // two of them lead Him out to the left
        const out = g.i < 2 ? lead : 0;
        const x = g.i === 0 ? kf(t, [[2.05, base[0]], [2.8, 350], [3.1, -300]]) : g.i === 1 ? kf(t, [[1.9, base[0]], [2.05, JX + 110], [2.8, 570], [3.1, -60]]) : base[0];
        const walking = (g.i < 2 && t > 1.9 && t < 3.1);
        g.p.set({ x, y: base[1], s: 1, flip: g.i === 0 ? t > 2.05 : g.i === 1 ? true : base[2], walk: walking ? x * 0.06 : undefined, armF: 16 + bow * 70 + (walking && g.i === 1 ? 30 : 0), armB: 8 + bow * 40, lean: bow * 22, head: bow * 10 - mock * (1 - bow) * 6, o: 1, blink: blinkAt(T, g.seed) });
      });
      has.forEach((h, i) => {
        const src = [[600, JY + 4, false], [960, JY + 2, true], [1020, JY + 12, true], [HU[0], HU[1], true]][i];
        const k = seg(t, 0.12 + i * 0.1, 0.85 + i * 0.1);
        const [hx, hy] = headAt(src[0], src[1], i === 3 ? 1.06 : 1, src[2]);
        const tx = JX + (src[0] < JX ? -60 : 70), ty = JY - 250;
        const fly = Math.min(1, k / 0.6), fall = Math.max(0, (k - 0.6) / 0.4);
        pose(h, { x: lerp(hx, tx, ease.out(fly)), y: lerp(hy - 30, ty, fly) + fall * fall * 200, r: fall * (src[0] < JX ? -40 : 40), s: 0.9, o: k > 0 && k < 1 ? 1 - fall : 0 });
      });

      /* v11b — the gleaming robe comes down onto Him */
      const rk = es(t, 1.05, 1.5, ease.out);
      const on = es(t, 1.5, 1.57);
      const jx = kf(t, [[2.05, JX], [2.8, 470], [3.1, -180]]);
      const jW = t > 2.05 && t < 3.1;
      jB.set({ x: jx, y: JY, s: 1.02, flip: jW, o: 1 - on, armF: 30, armB: 28, head: 4, blink: blinkAt(T) });
      jG.set({ x: jx, y: JY, s: 1.02, flip: jW, o: on, walk: jW ? jx * 0.05 : undefined, amt: 0.6, armF: 30, armB: 28, head: 3, blink: blinkAt(T) });
      pose(robe, { x: JX - 4, y: lerp(-400, JY - 150, rk), o: rk > 0.01 && on < 1 ? 1 : 0 });
      glints.forEach((g, i) => {
        const k = bump(t, 1.55 + i * 0.08, 1.95 + i * 0.08);
        pose(g, { x: jx + [-24, 20, -8, 30][i], y: JY - [120, 90, 60, 140][i], s: k, r: T * 40, o: k });
      });

      /* v12 — the portraits: turned away, then face to face, tied by a red cord */
      const dn = es(t, 3.0, 3.35, ease.out);
      const turn = es(t, 3.3, 3.5);
      const close = es(t, 3.45, 3.7);
      const px = 800, gap = lerp(170, 72, close);
      [[porH, -1], [porP, 1]].forEach(([el, side]) => {
        pose(el, { x: px + side * gap, y: lerp(-500, 150, dn), r: T ? Math.sin(T * 0.8 + side) * 1.2 * (1 - close) : 0, o: dn > 0.01 ? 1 : 0 });
        fade(el.querySelector('.face'), turn);
        fade(el.querySelector('.back'), 1 - turn);
      });
      const ck = es(t, 3.65, 3.85, ease.back);
      pose(cord, { x: px, y: 150 + 90, s: ck, o: ck > 0.02 ? 1 : 0 });
      const bk = es(t, 4.05, 4.4, ease.out);
      pose(before, { x: S.portrait ? 800 : 1180, y: lerp(-500, S.portrait ? 470 : 200, bk), r: T ? Math.sin(T * 0.7) * 1 : 0, s: 0.8, o: bk > 0.01 ? 1 : 0 });

      S.cam.x = 10 + es(t, 1.9, 2.6) * -60 * (1 - es(t, 2.8, 3.2)) + es(t, 3.9, 4.3) * 40;
      S.cam.y = 10 - es(t, 2.9, 3.3) * 60;
      S.cam.z = 1.02 + es(t, 0.9, 1.3) * 0.04 * (1 - es(t, 1.9, 2.3));
      if (S.portrait) S.cam.x += 60 * (1 - es(t, 1.9, 2.4)) + 60 * es(t, 2.9, 3.3);
    };
  },
};
