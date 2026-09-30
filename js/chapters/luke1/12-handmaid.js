// Łk 1,34–38 — "How can this be, since I know not a man?" — Mary, a hand on her heart. "The Holy Spirit will come upon
// you, and the power of the Most High will overshadow you": the dove comes down, and a luminous cloud spreads above her
// with its light falling behind her. "The holy one to be born will be called the Son of God" — a small light within her,
// the words in gold. "Elizabeth your kinswoman, called barren, is in her sixth month" — Elizabeth in a round picture with
// six moons. "For nothing is impossible with God" — the dry rod in the jar on the table bursts into blossom. Then the still
// moment: Mary bows, hands open — "Behold the handmaid of the Lord; let it be to me according to your word" — and the room
// fills with a quiet light. The angel goes out through the doorway into the light, and she stays, kneeling in it.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  MARY, ELIZABETH, maryRoom, RY, DOORW, gabriel, lily, thought, GLYPH, dove, flapWings, glowDisc, rayBurst, hungGold, fig, moonDisc,
  sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const MX = 660, AX = 960;

export default {
  id: 'lk1-handmaid',
  beats: [
    { v: 34 },
    { v: 35, text: 'Anioł Jej odpowiedział: «Duch Święty zstąpi na Ciebie i moc Najwyższego osłoni Cię.' },
    { v: 35, cont: true, text: 'Dlatego też Święte, które się narodzi, będzie nazwane Synem Bożym.' },
    { v: 36 },
    { v: 37 },
    { v: 38, text: 'Na to rzekła Maryja: «Oto Ja służebnica Pańska, niech Mi się stanie według twego słowa!»' },
    { v: 38, cont: true, text: 'Wtedy odszedł od Niej anioł.' },
  ],
  cam: { x: [-40, 40], y: [-40, 50], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const R = maryRoom(S);
    const still = R.G.add(`<g>${glowDisc(260, 'halo-glow', 0.85)}${rayBurst(c, { n: 24, r0: 120, r1: 360, spread: 0.02, o: 0.16 })}</g>`);
    const cloudGlow = R.G.add(`<g>${glowDisc(200, 'halo-glow', 1)}<path d="${c.poly([[-60, 0], [60, 0], [120, 330], [-120, 330]])}" fill="#fff3cf" opacity=".2"/></g>`);
    const mGlow = R.G.add(`<g>${glowDisc(130, 'halo-glow', 0.85)}</g>`);
    const aGlow = R.G.add(`<g>${glowDisc(180, 'halo-glow', 1)}</g>`);
    const P = R.P;
    const m = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const mH = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));
    const ang = S.puppet(P.add(gabriel(c, { holdB: lily(c) })));
    const wombG = R.G.add(`<g>${glowDisc(36, 'warm-glow', 1)}</g>`);
    const womb = P.add(`<g><path d="${c.poly(c.star(0, 0, 9, 3.4, 4, 0))}" fill="${C.star}"/></g>`);

    const up = S.layer({ par: 0.3, sh: 6 });
    const q = up.add(`<g>${thought(c, GLYPH.q(c), { w: 62, h: 50 })}</g>`);
    // the luminous cloud (the power of the Most High overshadowing her) — above her head, never over her
    const cloud = up.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 150, 36, 16, 0.14), 1, 6) + c.cut(c.blob(-80, 10, 70, 26, 12, 0.2), 1, 5) + c.cut(c.blob(80, 8, 76, 28, 12, 0.2), 1, 5), mix(C.halo, C.haloRim, 0.25)).x(c.ribbon([[-120, 18], [120, 18]], 3), C.haloRim, 'opacity=".7"').out()}</g>`);
    const dv = up.add(dove(c));
    const son = up.add(hungGold(c, tr('Syn Boży', 'Son of God'), { size: 30 }));
    const elzPlate = up.add(`<g><path d="M0 -1800V-78" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${sheet().p(c.cut(c.circ(0, 0, 80, 40), 0.4, 5), C.roseRobe).p(c.cut(c.circ(0, 0, 72, 40), 0.4, 5), mix(C.dawn, C.cream, 0.4)).out()}<circle r="60" fill="url(#halo-glow)"/><g clip-path="url(#${S.id('ec')})">${fig(c, { ...ELIZABETH }, 0, 110, 0.62)}</g><clipPath id="${S.id('ec')}"><circle r="71"/></clipPath><circle cx="10" cy="20" r="18" fill="url(#warm-glow)"/></g>`);
    const moons = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g>${i === 5 ? glowDisc(30, 'halo-glow', 1) : ''}${moonDisc(c, i === 5 ? 13 : 10)}</g>`));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    return (t, time) => {
      const T = time;
      pose(R.doorLight, { o: 1 - es(t, 6.4, 6.9) * 0.6 });

      /* v34: how can this be? */
      const hand = es(t, 0.1, 0.25) * (1 - es(t, 5.02, 5.1));
      const bow = es(t, 5.02, 5.1);
      const mk = { x: MX, y: RY, s: 1, flip: false, blink: blinkAt(T, 3) };
      m.set({ ...mk, o: 1 - hand, armF: bow ? 30 : 60, armB: bow ? 60 : 40, head: bow ? 16 : -10, lean: bow ? 6 : 0 });
      mH.set({ ...mk, o: hand, armF: 72, armB: 30 + es(t, 1.1, 1.4) * 20, head: -6 - es(t, 1.2, 1.5) * 10, lean: -3 });
      const qk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.08));
      pose(q, { x: MX + 10, y: RY - 170, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });

      /* v35a: the Holy Spirit will come upon you; the power of the Most High will overshadow you */
      const dk = es(t, 1.05, 1.45, ease.out);
      pose(dv, { x: lerp(MX + 260, MX + 16, dk), y: lerp(60, RY - 300, dk), s: 1, o: t > 1.02 && t < 5.9 ? 1 - es(t, 5.6, 5.9) : 0 });
      if (t > 1.02 && t < 5.9) flapWings(dv, T || t * 3, 30, 7, -6);
      const ov = es(t, 1.3, 1.7, ease.out);
      pose(cloud, { x: MX + 20, y: lerp(-300, 330, ov), s: 0.6 + ov * 0.4, o: ov > 0.01 ? 1 - es(t, 4.9, 5.2) : 0 });
      pose(cloudGlow, { x: MX + 20, y: 340, s: 0.5 + ov * 0.6, o: ov * (1 - es(t, 4.9, 5.2)) });
      pose(mGlow, { x: MX, y: RY - 110, s: 0.6 + ov * 0.5, o: ov });

      /* v35b: the holy one — Son of God */
      const wk = es(t, 2.1, 2.4);
      pose(womb, { x: MX + 18, y: RY - 70, s: 0.5 + wk * 0.7 + bump(t, 2.1, 2.6) * 0.3, o: wk });
      pose(wombG, { x: MX + 18, y: RY - 70, s: 0.5 + wk * 0.7, o: wk });
      const sk = es(t, 2.3, 2.55, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      pose(son, { x: 880, y: lerp(-1100, 440, sk), r: Math.sin(T * 0.9) * 1.4, o: sk > 0.002 ? 1 : 0 });

      /* v36: Elizabeth in her sixth month; v37: nothing is impossible — the dry rod blossoms */
      const ek = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 4.8, 5.05, ease.in));
      const ey = lerp(-1500, 250, ek);
      pose(elzPlate, { x: 960, y: ey, r: Math.sin(T * 0.7) * 1.4 * ek, o: ek > 0.002 ? 1 : 0 });
      moons.forEach((mo, i) => { const k = es(t, 3.3 + i * 0.06, 3.45 + i * 0.06, ease.back); const a = PI * (1.05 + i * 0.18); pose(mo, { x: 960 + Math.cos(a) * 104, y: ey + Math.sin(a) * 104, s: Math.max(0.001, k), o: ek > 0.002 && k > 0.01 ? 1 : 0 }); });
      const bl = es(t, 4.15, 4.45, ease.back);
      pose(R.blossom, { x: 362, y: RY - 160, s: Math.max(0.001, bl), o: bl > 0.01 ? 1 : 0, ox: 0, oy: -120 });
      sparks.forEach((sp, i) => { const kk = seg(t, 4.3 + i * 0.04, 4.75 + i * 0.04); const a = (i / 6) * PI * 2; pose(sp, { x: 362 + Math.cos(a) * (50 + kk * 40), y: RY - 150 + Math.sin(a) * (50 + kk * 30), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 4.3 + i * 0.04, 4.75 + i * 0.04) }); });

      /* v38a: behold the handmaid of the Lord — a quiet light fills the room */
      const st = es(t, 5.1, 5.6);
      pose(still, { x: MX, y: RY - 140, s: 0.5 + st * 0.6, r: t * 2, o: st });
      /* v38b: the angel departs */
      const go = es(t, 6.05, 6.55);
      const ax = lerp(AX, DOORW[0] + 20, go);
      ang.set({ x: ax, y: RY + 4, s: 1.02, flip: go > 0.02 ? false : true, o: 1 - es(t, 6.45, 6.7), walk: go > 0 && go < 1 ? t * 24 : undefined, armF: 40 + Math.max(0, Math.sin(t * PI * 2)) * 20 * (t < 5 ? 1 : 0), armB: 26, head: -4, blink: blinkAt(T, 2) });
      pose(aGlow, { x: ax, y: RY - 150, s: 1, o: 1 - es(t, 6.45, 6.7) });

      S.cam.z = 1.04 + es(t, 5.05, 5.9) * 0.08;
      S.cam.x = -es(t, 5.05, 5.9) * 30;
      S.cam.y = 10 + es(t, 5.05, 5.9) * 20;
    };
  },
};
