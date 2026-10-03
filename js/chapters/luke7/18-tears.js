// Łk 7,38–40 — the woman comes in and stands behind Him at His feet, weeping; she kneels, her tears fall on His feet,
// she lets down her hair and wipes them with it. Then she kisses His feet — little rose kisses rise — breaks open the
// alabaster flask and pours the ointment over them, and the fragrance rises in golden curls. Simon, at the far end of
// the table, frowns and thinks to himself: "If this man were a prophet, he would know who and what sort of woman this
// is who touches him — a sinner." Jesus turns to him: "Simon, I have something to say to you." — "Say it, Teacher."
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { simonRoom, SH, SR7, SINNER, thoughtCloud, figure, tear, kiss, nardMist, bubble, headAt, hand, voiceRings, kf, moving, tr, PI, FONT } from './lib.js';

const { FLOOR, JX } = SH;
const GX = (SH.GATE[0] + SH.GATE[1]) / 2;
const WX = SR7.WX, FX = SR7.FEETX, FY = SR7.FEETY;

export default {
  id: 'lk7-tears',
  beats: [
    { v: 38, text: 'i stanąwszy z tyłu u nóg Jego, płacząc, zaczęła łzami oblewać Jego nogi i włosami swej głowy je wycierać.' },
    { v: 38, cont: true, text: 'Potem całowała Jego stopy i namaszczała je olejkiem.' },
    { v: 39 },
    { v: 40, text: 'Na to Jezus rzekł do niego: «Szymonie, mam ci coś powiedzieć».' },
    { v: 40, cont: true, text: 'On rzekł: «Powiedz, Nauczycielu!»' },
  ],
  cam: { x: [-90, 140], y: [0, 200], z: [0.8, 1.34] },
  build(S) {
    // phone: Simon sits a little in from the right edge, and the ceiling is a short eave with the evening sky above
    const M = simonRoom(S, S.portrait ? { sx: 1130, ceilTop: 0 } : {});
    const { R, c } = M;
    const tears = [0, 1, 2, 3].map(() => R.fx.add(`<g opacity="0">${tear(c, 4.4)}</g>`));
    const kisses = [0, 1, 2, 3].map(() => R.fx.add(`<g opacity="0">${kiss(c, 8)}</g>`));
    const mist = R.fx.add(`<g opacity="0">${nardMist(c, 70, { glow: false })}</g>`);
    const stream = R.fx.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([0, 0], [6, 18], [2, 40], 10), (u) => 5 - u * 2)}" fill="${C.wheat}" opacity=".9"/></g>`);
    const TC = thoughtCloud(c, 280, 150, { dir: -1 });
    const thinkEl = R.fx.add(`<g opacity="0">${TC.m}<text x="${TC.cx}" y="${TC.cy - 30}" text-anchor="middle" font-family="${FONT}" font-size="18" font-style="italic" fill="${C.ink}">${tr('Gdyby On był prorokiem,', 'If he were a prophet,')}</text><text x="${TC.cx}" y="${TC.cy - 8}" text-anchor="middle" font-family="${FONT}" font-size="18" font-style="italic" fill="${C.ink}">${tr('wiedziałby, kim ona jest…', 'he would know who she is…')}</text>${figure(c, { ...SINNER, robe: mix(SINNER.robe, C.storm2, 0.55), veil: mix(SINNER.veil, C.storm2, 0.55), skin: mix(C.skin, C.storm2, 0.4) }, { x: TC.cx, y: TC.cy + 58, s: 0.28, armF: 150, head: 16 })}</g>`);
    const jv = voiceRings(R.frontL, c, { n: 3, color: C.sun, r: 30, w: 4 });
    const sv = voiceRings(R.frontL, c, { n: 2, color: C.clay, r: 26, w: 4 });
    const b1 = R.fx.add(`<g opacity="0">${bubble(c, [tr('Szymonie,', 'Simon,'), tr('mam ci coś powiedzieć', 'I have something to tell you')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const b2 = R.fx.add(`<g opacity="0">${bubble(c, tr('Powiedz, Nauczycielu!', 'Teacher, say on.'), { size: 20, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(t, T, { lit: 1 });
      R.sk2.fade(0.6);
      /* v38a — behind Him at His feet, weeping; tears; her hair */
      const WK = [[0, GX + 40], [0.24, WX - 30]];
      const wx = kf(t, WK);
      const kneel = es(t, 0.26, 0.31);
      const hair = es(t, 0.56, 0.62);
      M.wStand.set({ x: wx, y: FLOOR, s: 0.98, o: 1 - kneel, walk: moving(t, WK) ? wx * 0.05 : undefined, amt: 0.5, armF: 60, armB: 110, head: 16, blink: 1 });
      M.wKneel.set({ x: WX, y: FLOOR, s: 0.98, o: kneel * (1 - hair), armF: 40, armB: 130, lean: 16, head: 18, blink: 1 });
      const wipe = es(t, 0.62, 0.72) * (1 - es(t, 1.0, 1.1) * 0.3);
      const kissK = bump(t, 1.05, 1.42);
      const pour = es(t, 1.46, 1.58) * (1 - es(t, 1.85, 1.95));
      const bowed = es(t, 1.95, 2.1);
      const lean = 20 + wipe * 24 + kissK * 18 - pour * 10 + Math.sin(t * 24) * 2 * wipe - bowed * 14;
      const head = 18 + wipe * 12 + kissK * 10 - pour * 6;
      const armF = 50 + wipe * 20 + pour * 40 + (T ? Math.sin(t * 20) * 5 * wipe : 0);
      M.wHair.set({ x: WX, y: FLOOR, s: 0.98, o: hair, armF, armB: 30 + wipe * 20 + pour * 30, lean, head, blink: 1 });
      pose(M.hairEl, { r: -(lean + head) * 0.8 });
      const [wfx, wfy] = headAt(WX, FLOOR, 0.98, false, 46);
      tears.forEach((e, i) => {
        const k = T ? ((T * 0.9 + i / 4) % 1) : (i + 0.5) / 4;
        const on = (seg(t, 0.1, 0.2) * (1 - seg(t, 0.95, 1.05)));
        pose(e, { x: lerp(wfx + 14 + i * 4, FX - 6 + i * 6, k * es(t, 0.3, 0.4)), y: lerp(wfy + 20, FY - 4, k), s: 1, o: on * (1 - k * 0.6) });
      });
      // the flask: in her hand, set down by her knee, then taken up and poured
      let px, py, pr = 0;
      if (kneel < 1) { const [hx, hy] = hand(wx, FLOOR, 0.98, false, 60); px = hx; py = hy + 10; }
      else if (t < 1.4) { px = WX - 64; py = FLOOR + 2; }
      else { const [hx, hy] = hand(WX, FLOOR, 0.98, false, armF, lean, 46); px = lerp(WX - 64, hx, es(t, 1.4, 1.46)); py = lerp(FLOOR + 2, hy + 8, es(t, 1.4, 1.46)); pr = pour * 110; }
      pose(M.flask, { x: px, y: py, r: pr });
      const lip = [px + Math.cos((pr - 90) * PI / 180) * 44, py + Math.sin((pr - 90) * PI / 180) * 44];
      pose(stream, { x: lip[0], y: lip[1], o: pour > 0.5 ? 1 : 0 });
      pose(M.sheen, { o: es(t, 1.55, 1.7) * 0.9 });
      /* v38b — kisses; the ointment; the fragrance */
      kisses.forEach((k, i) => { const u = seg(t, 1.08 + i * 0.07, 1.5 + i * 0.07); pose(k, { x: FX - 10 + i * 8 + Math.sin(u * 6 + i) * 6, y: FY - 20 - u * 90, s: 1 + u * 0.4, o: u > 0 && u < 1 ? Math.sin(u * PI) : 0 }); });
      const mk = es(t, 1.6, 1.95);
      pose(mist, { x: FX + 6, y: FY - 10, s: 0.5 + mk * 0.8, o: mk * (1 - es(t, 2.6, 2.9) * 0.6) });

      /* Jesus: turned to the table; at v40 He speaks to Simon */
      const speak = es(t, 3.05, 3.2) * (1 - es(t, 3.9, 4.0));
      M.jesus.set({ x: JX, y: FLOOR, s: 1.0, armF: 30 + speak * 30, armB: 10 + speak * 60, head: 4 + bump(t, 0.3, 1.9) * 10 - speak * 6, blink: blinkAt(T) });
      pose(M.legs, { x: JX, y: FLOOR, sx: -1 });
      const [jhx, jhy] = headAt(JX, FLOOR, 1.0, false, 62);
      jv(jhx, jhy, speak, T, { dir: 1, spread: 1.8 });
      const k1 = es(t, 3.08, 3.2, ease.back) * (1 - es(t, 3.94, 4.0));
      pose(b1, { x: jhx + 40, y: jhy - 40, s: k1, o: k1 > 0.02 ? 1 : 0 });

      /* v39 — Simon thinks to himself; v40b — "Say it, Teacher" */
      const frown = es(t, 2.05, 2.25) * (1 - es(t, 3.9, 4.1));
      const reply = es(t, 4.05, 4.2);
      M.table(t, T, { look: bump(t, 0.1, 2.9), simonArmF: 30 + frown * 100 + reply * 40, simonArmB: 10 + reply * 60, simonHead: 4 - frown * 6 + reply * 4, simonLean: -frown * 6 });
      const [shx, shy] = headAt(M.sx, FLOOR, 0.96, true, 62);
      const tk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(thinkEl, { x: shx - 20, y: shy - 36, s: tk, o: tk > 0.02 ? 1 : 0 });
      sv(shx, shy, reply * (1 - es(t, 4.9, 5.0)), T, { dir: -1, spread: 1.6 });
      const k2 = es(t, 4.08, 4.2, ease.back);
      pose(b2, { x: shx - 30, y: shy - 36, s: k2, o: k2 > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -70], [1.9, -70], [2.2, 40], [3.0, 40], [3.3, 0]]);
      S.cam.z = kf(t, [[0, 1.26], [1.9, 1.28], [2.2, 1.2], [3.3, 1.18]]);
      S.cam.y = kf(t, [[0, 180], [2.2, 150]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 60], [1.9, 60], [2.2, 130]]); S.cam.z = 0.82; }
    };
  },
};
