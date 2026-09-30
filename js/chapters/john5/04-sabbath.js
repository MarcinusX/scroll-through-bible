// J 5,10–13 — the healed man walks off with his mat on his shoulder; three leaders step into his way.
// "It is the Sabbath: you may not carry your mat" — the mat crossed out under the Sabbath candles. "He who made
// me well told me: Take up your mat and walk" — he points back to the pool. "Who is the man?" — an empty frame
// and a question. He does not know: he turns this way and that. For Jesus had slipped away — far back along the
// porch, among the pilgrims, He passes out through the Sheep Gate.
import { C, person, CAST, crowdPerson, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, attr, pose } from '../../core/anim.js';
import {
  bethesdaSet, bethesdaIdle, backSick, BZ, DAY, HEALED, leaderOpts, withFace, faceBits, matRoll, candle, scrollRolled, sickLook, lyingOn,
  iconBubble, bubble, thought, ghost, medallion, GLYPH, vis, kf, headAt, tr, PI,
} from './lib.js';

const F = BZ.floor;
const MANX = 930;

export default {
  id: 'j5-sabbath',
  beats: [
    { v: 10, text: 'Rzekli więc Żydzi do uzdrowionego:' },
    { v: 10, cont: true, text: '«Dziś jest szabat, nie wolno ci nieść twojego łoża».' },
    { v: 11 },
    { v: 12 },
    { v: 13, text: 'Lecz uzdrowiony nie wiedział, kim On jest;' },
    { v: 13, cont: true, text: 'albowiem Jezus odsunął się od tłumu, który był w tym miejscu.' },
  ],
  cam: { x: [-160, 60], y: [-80, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = bethesdaSet(S, { skyCols: ['#d8dcd0', '#f2e1c2', '#f5d9b6'], sunAt: [1220, 210] });
    backSick(S, set, [470, 780, 1110, 1460]);
    set.sickBackL.fade(1);
    set.waterline();
    const A = set.actL;

    /* pilgrims along the far walk; Jesus among them, going out through the Sheep Gate */
    const pilL = S.layer({ par: 0.24, sh: 3 });
    const pil = [0, 1, 2, 3, 4].map((i) => ({ i, p: S.puppet(pilL.add(person(c, { ...crowdPerson(c), mantle: null }))) }));
    const jBack = S.puppet(pilL.add(person(c, { ...CAST.jesus })));

    /* the crowd at the front */
    const crowdF = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(A.add(person(c, crowdPerson(c)))) }));
    const lier = A.add(lyingOn(c, sickLook(c, 9), { s: 0.7, w: 176, eyes: 'closed' }));

    /* three leaders */
    const LEAD = [0, 1, 2].map((i) => {
      const o = leaderOpts(i);
      const el = A.add(withFace(person(c, { ...o, holdF: i === 1 ? `<g transform="translate(0 8)">${scrollRolled(c, 40)}</g>` : '' }), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), x: (S.portrait ? [535, 620, 705] : [470, 570, 670])[i], seed: c.rr(0, 9) };
    });

    /* the man with his mat */
    const roll = A.add(`<g>${matRoll(c, 120)}</g>`);
    const manEl = A.add(withFace(person(c, HEALED), faceBits(c)));
    const man = S.puppet(manEl);
    const manSad = manEl.querySelector('[data-part="sad"]');

    /* bubbles */
    const X = set.flyL;
    const X2 = `<path d="${c.ribbon([[-26, -20], [26, 20]], 6) + c.ribbon([[26, -20], [-26, 20]], 6)}" fill="${C.terracotta}" opacity=".85"/>`;
    const noB = X.add(`<g>${iconBubble(c, `<g transform="translate(-44 14) scale(.5)">${candle(c, 40)}</g><g transform="translate(44 14) scale(.5)">${candle(c, 40)}</g><g transform="scale(.6)">${matRoll(c, 110)}</g>${X2}`, { w: 150, h: 100, side: 1 })}</g>`);
    const jesusMini = `<g transform="translate(-22 -2)"><circle r="22" fill="${C.halo}"/>${medallion(c, CAST.jesus, { r: 18 })}</g>`;
    const heB = X.add(`<g>${iconBubble(c, `${jesusMini}<g transform="translate(28 0) scale(.42)">${matRoll(c, 110)}</g><path d="${c.ribbon([[6, 20], [44, 20]], 3)}" fill="${C.terracotta}"/><path d="${c.poly([[44, 13], [56, 20], [44, 27]])}" fill="${C.terracotta}"/>`, { w: 150, h: 96, side: -1 })}</g>`);
    const whoB = X.add(`<g>${iconBubble(c, `<g transform="translate(-18 0)"><rect x="-22" y="-28" width="44" height="56" rx="4" fill="${C.wood3}"/><rect x="-16" y="-22" width="32" height="44" fill="${C.parchment}"/><g transform="translate(0 18) scale(.2)">${ghost(c)}</g></g><g transform="translate(30 0) scale(1.6)">${GLYPH.q(c)}</g>`, { w: 130, h: 96, side: 1 })}</g>`);
    const dunnoB = X.add(`<g>${thought(c, `<g transform="translate(-10 22) scale(.26)">${ghost(c)}</g><g transform="translate(18 0) scale(1.3)">${GLYPH.q(c)}</g>`, { w: 90, h: 72 })}</g>`);

    return (t, time) => {
      const T = time;
      bethesdaIdle(set, T, { sunY: 210 });

      /* v10a — the leaders step into his way */
      const MK = [[-0.3, 1250], [0.5, MANX]];
      const mx = kf(t, MK, ease.out);
      const walking = t < 0.5 && t > -0.3;
      const stopK = es(t, 0.45, 0.6);
      const reply = bump(t, 2.05, 2.95);
      const shrug = bump(t, 4.05, 4.95);
      const look = t > 4.1 && t < 4.9 ? Math.sin((t - 4.1) * PI * 2.5) : 0;
      const mflip = look > 0.3 ? false : true;
      man.set({ x: mx, y: F + 6, s: 1, flip: mflip, walk: walking ? mx * 0.09 : undefined, armF: 20 + reply * 50 + shrug * 70, armB: 160 - shrug * 60 - reply * 10, head: -stopK * 4 + reply * 6 - shrug * 6, lean: reply * 4, blink: blinkAt(T, 2) });
      attr(manSad, 'opacity', (bump(t, 1.1, 2.0) * 0.8 + es(t, 4.1, 4.4) * 0.8).toFixed(2));
      const [hx, hy] = headAt(mx, F + 6, 1, mflip);
      const dir = mflip ? -1 : 1;
      pose(roll, { x: hx - dir * 18, y: hy + 44, r: dir * 28 });

      LEAD.forEach((l) => {
        const k = es(t, 0.02 + l.i * 0.08, 0.45 + l.i * 0.08, ease.out);
        const x = lerp(l.x - 420, l.x, k);
        const point = l.i === 2 ? bump(t, 1.05, 2.0) : 0;
        const ask = bump(t, 3.05, 3.95);
        const lean = l.i === 2 ? ask * 6 + point * 4 : ask * 3;
        l.p.set({ x, y: F + 8 - (l.i % 2) * 6, s: 1, flip: false, walk: k > 0 && k < 1 ? x * 0.08 : undefined, armF: (l.i === 1 ? 50 : 20) + point * 70 + ask * (l.i === 2 ? 50 : 20), armB: 10 + (l.i === 0 ? bump(t, 1.1, 2.0) * 130 : 0) + ask * (l.i === 0 ? 40 : 0), head: -ask * 4, lean, blink: blinkAt(T, l.seed) });
        attr(l.angry, 'opacity', (l.i === 1 ? 0.6 : es(t, 0.6, 1.0)).toFixed(2));
      });
      const [lhx, lhy] = headAt(LEAD[2].x, F + 8, 1, false);

      /* v10b — "It is the Sabbath: you may not carry your mat" */
      const nk = es(t, 1.12, 1.32, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(noB, { x: lhx + 22, y: lhy - 22, s: nk, o: nk > 0.01 ? 1 : 0 });
      /* v11 — "He who made me well told me…" */
      const hk = es(t, 2.12, 2.32, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(heB, { x: hx - 20, y: hy - 22, s: hk, o: hk > 0.01 ? 1 : 0 });
      /* v12 — "Who is the man?" */
      const wk = es(t, 3.12, 3.32, ease.back) * (1 - es(t, 3.95, 4.05));
      vis(whoB, { x: lhx + 22, y: lhy - 22, s: wk, o: wk > 0.01 ? 1 : 0 });
      /* v13a — he did not know */
      const dk = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.95, 5.05));
      vis(dunnoB, { x: hx + 6, y: hy - 30, s: dk, o: dk > 0.01 ? 1 : 0 });

      /* v13b — Jesus had withdrawn: out through the Sheep Gate among the pilgrims */
      const pw = es(t, 4.95, 5.95, ease.sine);
      const PY = BZ.porticoY - 2;
      pil.forEach((m) => {
        const x = lerp(900 + m.i * 80, 250 + m.i * 80, pw);
        const inGate = x < 320 ? seg(320 - x, 0, 30) : 0;
        m.p.set({ x, y: PY, s: 0.46, flip: true, walk: pw > 0 && pw < 1 ? x * 0.12 : undefined, armF: 20, blink: blinkAt(T, m.i), o: (pw > 0.001 ? 1 : 0) * (1 - inGate) });
      });
      const jx = lerp(1000, 290, es(t, 4.95, 5.85, ease.sine));
      const jGone = seg(330 - jx, 0, 40);
      const glance = bump(t, 5.3, 5.55);
      jBack.set({ x: jx, y: PY, s: 0.5, flip: glance < 0.5, walk: t > 4.95 && t < 5.85 ? jx * 0.12 : undefined, armF: 14, head: glance * 4, blink: blinkAt(T, 1), o: seg(t, 4.95, 5.0) * (1 - jGone) });
      crowdF.forEach((m) => {
        const k = es(t, 4.9 + m.i * 0.1, 5.9 + m.i * 0.1, ease.sine);
        const x = lerp(1500 + m.i * 90, 1080 + m.i * 110, k);
        m.p.set({ x, y: F + 12 + m.i * 4, s: 0.98, flip: true, walk: k > 0 && k < 1 ? x * 0.08 : undefined, armF: 20, blink: blinkAt(T, m.seed), o: seg(t, 4.9, 5.0) });
      });
      pose(lier, { x: 1260, y: F + 10, sx: -1 });

      S.cam.x = kf(t, [[0, 40], [0.6, -20], [2.0, 0], [3.0, -20], [4.0, 0], [5.0, -60], [5.9, S.portrait ? -100 : -140]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [4.0, 20], [5.0, -20], [5.9, -60]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.14], [4.0, 1.14], [5.0, 1.08], [5.9, 1.16]]);
    };
  },
};
