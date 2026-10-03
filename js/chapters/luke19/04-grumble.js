// Łk 19,7–8 — before Zacchaeus' fine house: pale plaster, latticed windows, the arched door open on a lamp-lit
// room. He leads Jesus up the steps to the door; the townsfolk who followed stop in the court, fold their arms,
// frown and mutter — little puffs of anger — and one says it aloud: "He has gone to be the guest of a sinner!"
// Then Zacchaeus stands on his top step and speaks to the Lord: his servant sets down the strongbox, and he parts the
// heap of silver down the middle — half of it slides across to the poor who come in at the gate: a blind man, a lame
// man on his crutch, a widow, an old beggar hold out their hands. "If I have cheated anyone, I pay it back fourfold":
// he opens his ledger, and to a man he once overcharged one coin comes back as four, with a little tag: ×4.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { zacHouse, ZH, ZACC, ZS, CLERK, WRONGED, GRUMBLE, POOR, POORW, LAMEM, BLINDM, TWELVE, still, folk, say, puff, angryFace, addToHead, mina, minaPile, ledger, label, sparkle, headAt, hand, kf, moving, tr, es, ease, bump, seg, PI, mix, shade, sheet } from './lib.js';
import { crutchHeld } from '../matthew22/lib.js';

const GY = ZH.GY, DX = ZH.DX;
const JX = 836, ZX = 968, ZY = GY - ZH.STEP * 2 + 2;
const PILE = [1046, GY - ZH.STEP + 2];

export default {
  id: 'lk19-grumble',
  beats: [
    { v: 7, text: 'A wszyscy, widząc to, szemrali:' },
    { v: 7, cont: true, text: '«Do grzesznika poszedł w gościnę».' },
    { v: 8, text: 'Lecz Zacheusz stanął i rzekł do Pana: «Panie, oto połowę mego majątku daję ubogim,' },
    { v: 8, cont: true, text: 'a jeśli kogo w czym skrzywdziłem, zwracam poczwórnie».' },
  ],
  cam: { x: [-200, 600], y: [0, 100], z: [1, 1.3] },
  build(S) {
    const H = zacHouse(S, { sunAt: [1320, 140] });
    const c = S.c;
    const A = H.act;

    /* Jesus at the door, Zacchaeus on the top step, his servant with the strongbox */
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const dis = A.sprite(still(c, [{ x: -60, y: 0, s: 0.9, o: TWELVE[0].o, head: 4 }, { x: 0, y: 8, s: 0.9, o: TWELVE[2].o, head: 6 }]), 700, GY + 6);
    const zac = S.puppet(A.add(person(c, ZACC)));
    const servant = S.puppet(A.add(person(c, CLERK)));
    const pileL = A.add(`<g>${minaPile(c, 10, 11)}</g>`);   // the half that goes
    const pileR = A.add(`<g>${minaPile(c, 10, 11)}</g>`);   // the half that stays
    const book = A.add(`<g>${ledger(c, 60)}</g>`);

    /* the grumblers in the court (left), and the poor who come in at the gate */
    const fr = S.layer({ par: 0.5, sh: 5 });
    const GR = GRUMBLE.map((o, i) => ({ i, x: S.portrait ? 340 + i * 66 : 260 + i * 74, y: GY + 34 + (i % 2) * 12, p: S.puppet(fr.add(addToHead(person(c, o), `<g class="ang" opacity="0">${angryFace(c)}</g>`))) }));
    GR.forEach((g) => { g.ang = g.p.el.querySelector('.ang'); });
    const puffs = GR.map(() => fr.add(`<g>${puff(c, 14)}</g>`));
    const mutter = fr.add(`<g>${say(c, tr(['Do grzesznika', 'poszedł w gościnę!'], ['He has gone to be the', 'guest of a sinner!']), { size: 19, side: 1, jag: true })}</g>`);
    const POORS = [
      { o: BLINDM, x: 1190 }, { o: { ...LAMEM, holdF: crutchHeld(c) }, x: 1262 },
      { o: POORW, x: 1330 }, { o: POOR, x: 1400 },
    ].map((m, i) => ({ ...m, x: S.portrait ? 1170 + i * 55 : m.x, i, p: S.puppet(fr.add(person(c, m.o))) }));
    const gifts = POORS.map(() => fr.add(`<g>${mina(c, 11)}</g>`));
    const wronged = S.puppet(fr.add(person(c, WRONGED)));
    const four = [0, 1, 2, 3].map(() => fr.add(`<g>${mina(c, 12)}</g>`));
    const x4 = fr.add(`<g>${label(c, tr('× 4 — poczwórnie', '× 4 — fourfold'), { size: 18, fill: C.halo })}</g>`);
    const half = fr.add(`<g>${label(c, tr('połowa — ubogim', 'half — to the poor'), { size: 18 })}</g>`);
    const shine = [0, 1, 2].map(() => fr.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(T, { lit: 0.3 + es(t, 2, 3) * 0.4 });
      dis.set({ x: 700, y: GY + 6 });
      /* v7 — Jesus goes up to the door with him; all the people mutter */
      const upK = es(t, -0.5, 0.4);
      const jx = lerp(720, JX, upK), jy = lerp(GY + 14, ZY, upK);
      const turnToZ = es(t, 2.05, 2.25);
      jesus.set({ x: jx, y: jy, s: 1.02, flip: turnToZ > 0.5 ? false : false, walk: upK > 0 && upK < 1 ? jx * 0.05 : undefined, armF: 14 + es(t, 2.1, 2.4) * 20 + es(t, 3.4, 3.6) * 30, armB: 6, head: 4 * turnToZ, blink: blinkAt(T) });
      const stand = es(t, 2.02, 2.2);
      const give = es(t, 2.35, 2.9);
      const restore = es(t, 3.2, 3.6);
      const toPoor = es(t, 2.3, 2.36) * (1 - es(t, 2.98, 3.04)) + es(t, 3.3, 3.36);
      zac.set({ x: ZX, y: ZY, s: ZS, flip: toPoor < 0.5, armF: 40 + stand * 60 - give * 20 + restore * 40, armB: 20 + stand * 110 * (1 - give) + give * 50, head: -4 + stand * -4, lean: -give * 6, blink: blinkAt(T, 3) });
      const bring = es(t, 1.9, 2.2);
      servant.set({ x: lerp(DX, 1110, bring), y: lerp(ZY, GY - ZH.STEP + 2, bring), s: 0.86, o: seg(t, 1.9, 1.96), flip: false, walk: bring > 0 && bring < 1 ? bring * 30 : undefined, armF: 30, armB: 10, head: 6, blink: blinkAt(T, 5) });

      GR.forEach((g) => {
        const k = es(t, 0.15 + g.i * 0.08, 0.4 + g.i * 0.08) * (1 - es(t, 2.1, 2.4) * 0.6);
        const aside = es(t, 2.1, 2.4);
        const pose_ = [[70, 10], [20, 110], [80, 20], [30, 30], [60, 130]][g.i];
        g.p.set({ x: g.x - aside * 60, y: g.y, s: 0.92, flip: false, armF: 14 + pose_[0] * k, armB: 10 + pose_[1] * k, lean: -k * 4, head: k * 6, blink: blinkAt(T, g.i + 6) });
        pose(g.ang, { o: k });
        const pk = bump(t, 0.3 + g.i * 0.1, 1.6 + g.i * 0.05) * (1 - aside);
        const [hx, hy] = headAt(g.x - aside * 60, g.y, 0.92, false);
        pose(puffs[g.i], { x: hx + 20, y: hy - 40 - pk * 20, s: pk, r: T * 30 + g.i * 40, o: pk > 0.02 ? 1 : 0 });
      });
      const mk = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.9, 2.02));
      const [mx, my] = headAt(GR[2].x, GR[2].y, 0.92, false);
      pose(mutter, { x: mx + 16, y: my - 26, s: mk, o: mk > 0.02 ? 1 : 0 });

      /* v8a — half of his goods to the poor */
      pose(pileR, { x: PILE[0] + 30, y: PILE[1], o: bring });
      const slide = es(t, 2.35, 2.6);
      pose(pileL, { x: lerp(PILE[0] - 16, 1160, slide), y: lerp(PILE[1], GY + 20, slide) - Math.sin(slide * PI) * 40, o: bring * (1 - es(t, 2.6, 2.66)) });
      POORS.forEach((m) => {
        const k = es(t, 2.05 + m.i * 0.05, 2.35 + m.i * 0.05);
        const x = lerp(m.x + 320, m.x, k) + es(t, 3.0, 3.3) * (S.portrait ? 420 : 150);   // phone: the poor walk off instead of lingering under the thread
        const got = es(t, 2.6 + m.i * 0.03, 2.68 + m.i * 0.03);
        const y = GY + 30 + (m.i % 2) * 10;
        const aF = m.i < 2 ? 30 + got * 40 : 40 + k * 30 + got * 50;
        m.p.set({ x, y, s: 0.9, flip: true, walk: k > 0 && k < 1 ? x * 0.06 + m.i : undefined, armF: aF, armB: got * 110 * (m.i % 2), head: -4, o: seg(t, 2.05, 2.12), blink: blinkAt(T, m.i + 11) });
        const [hx, hy] = hand(x, y, 0.9, true, aF);
        pose(gifts[m.i], { x: hx - 4, y: hy - 12, s: got, o: got > 0.02 && t < 3.1 ? 1 : 0 });
      });
      const hk = es(t, 2.25, 2.4, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(half, { x: S.portrait ? 1080 : 1200, y: GY - 270, s: hk, o: hk > 0.02 ? 1 : 0 });

      /* v8b — fourfold to anyone he has cheated */
      const wk = es(t, 3.02, 3.3);
      const wx = lerp(1320, 1150, wk);
      wronged.set({ x: wx, y: GY + 26, s: 0.94, flip: true, walk: wk > 0 && wk < 1 ? wx * 0.06 : undefined, armF: 40 + es(t, 3.5, 3.7) * 60, armB: es(t, 3.7, 3.9) * 100, head: -4, o: seg(t, 3.0, 3.08), blink: blinkAt(T, 14) });
      const [bx, by] = hand(ZX, ZY, ZS, toPoor < 0.5, 40 + stand * 60 - give * 20 + restore * 40);
      pose(book, { x: bx + 10, y: by - 6, r: 10, o: es(t, 3.05, 3.15) });
      const [whx, why] = hand(wx, GY + 26, 0.94, true, 100);
      four.forEach((f, i) => {
        const k = es(t, 3.4 + i * 0.07, 3.62 + i * 0.07);
        pose(f, { x: lerp(bx + 20, whx + (i % 2) * 18 - 8, k), y: lerp(by - 20, why - 16 - Math.floor(i / 2) * 18, k) - Math.sin(k * PI) * 60, s: 1, o: k > 0.01 && t < 4.3 ? 1 : 0 });
      });
      const xk = es(t, 3.55, 3.7, ease.back);
      pose(x4, { x: whx + (S.portrait ? -40 : 20), y: why - 120, s: xk, o: xk > 0.02 ? 1 : 0 });
      shine.forEach((e, i) => { const k = bump(t, 3.6 + i * 0.08, 4.0 + i * 0.08); pose(e, { x: whx - 20 + i * 26, y: why - 50 - i * 16, s: k, r: T * 40, o: k > 0.02 ? 1 : 0 }); });

      S.cam.x = kf(t, [[-0.5, 60], [0.5, -80], [1.9, -60], [2.3, 120], [3.1, 160]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.5, 60], [2.3, 70]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.5, 1.14], [1.9, 1.12], [2.3, 1.18], [3.2, 1.22]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 60], [0.5, -200], [1.9, -180], [2.3, 560], [3.1, 600]]); S.cam.z = 1.0; }
      void moving; void mix; void shade; void sheet; void folk;
    };
  },
};
