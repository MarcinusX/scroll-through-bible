// J 19,23–24 — at the foot of the hill (the three crosses stand far above) four soldiers sit round a cloth.
// Jesus' rose mantle is laid out and cut into four parts, one flying to each soldier; then they take the tunic.
// A picture plate shows it: not sewn, but woven in one piece from the top down — the rows appear one after
// another under a moving shuttle. "Let us not tear it, but cast lots": two soldiers stop pulling, the dice
// tumble on the cloth; the scroll of Psalm 22 comes down with the words it had foretold; the dice settle and one
// soldier holds up the tunic whole. "This is what the soldiers did."
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, headAt, hand, soldier, golgothaSet, setCrosses, clearClouds, lightClouds, glory, mantleQuarters, wovenTunic, shuttle, dice, verseScroll, speech, strip, swing, tr, GOL, J19, FONT } from './lib.js';

const CX = 800, CY = 704;
const SEATS = [[600, 706, false], [700, 692, false], [900, 692, true], [1000, 706, true]];

export default {
  id: 'j19-tunic',
  beats: [
    { v: 23, text: 'Żołnierze zaś, gdy ukrzyżowali Jezusa, wzięli Jego szaty i podzielili na cztery części, dla każdego żołnierza po części;' },
    { v: 23, cont: true, text: 'wzięli także tunikę.' },
    { v: 23, cont: true, text: 'Tunika zaś nie była szyta, ale cała tkana od góry do dołu.' },
    { v: 24, text: 'Mówili więc między sobą: «Nie rozdzierajmy jej, ale rzućmy o nią losy, do kogo ma należeć».' },
    { v: 24, cont: true, text: 'Tak miały się wypełnić słowa Pisma: Podzielili między siebie szaty, a los rzucili o moją suknię.' },
    { v: 24, cont: true, text: 'To właśnie uczynili żołnierze.' },
  ],
  cam: { x: [-40, 40], y: [-20, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;
    const G = golgothaSet(S, { pal: J19.gold });
    clearClouds(G);
    const gl = G.hangL.add(`<g>${glory(c, 380, 18)}</g>`);
    const clouds = lightClouds(S, G.hangL, [[1150, 220, 160]]);
    const P = G.P;
    P.add(sheet().p(c.cut([[CX - 150, CY - 10], [CX + 140, CY - 14], [CX + 170, CY + 16], [CX - 170, CY + 18]], 0.8, 8), mix(C.stone, C.cream, 0.4)).x(c.ribbon([[CX - 140, CY + 2], [CX + 150, CY]], 1.4), C.stone2, 'opacity=".6"').out());
    const sols = SEATS.map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(soldier(c, i, { pose: 'sit', spear: false }))) }));
    const fx = G.fx;
    const quarters = fx.add(`<g>${mantleQuarters(c, 170, 110)}</g>`);
    const q = [0, 1, 2, 3].map((i) => quarters.querySelector(`.q${i}`));
    const W = wovenTunic(c, { w: 140, h: 210 });
    const small = fx.add(`<g>${W.base}${W.rows.join('')}</g>`);
    const dd = fx.add(`<g>${dice(c)}</g>`);
    const d0 = dd.querySelector('.d0'), d1 = dd.querySelector('.d1');
    const noTear = fx.add(`<g>${speech(c, `<g transform="translate(-12 -2) scale(0.12)">${W.base}${W.rows.join('')}</g><path d="${c.ribbon([[-22, -16], [22, 16]], 3) + c.ribbon([[22, -16], [-22, 16]], 3)}" fill="${C.terracotta}" opacity=".0"/><g transform="translate(18 4) scale(1.2)">${dice(c).replace('class="d0"', 'class="x0"').replace('class="d1"', 'class="x1"')}</g>`, { w: 84, h: 56, flip: true })}</g>`);

    /* the picture plate: the seamless tunic woven from the top down */
    const plL = S.layer({ par: 0.3, sh: 6 });
    const PW = 300, PH = 300;
    const plate = plL.add(`<g><path d="M${-PW / 2 + 24} 0V-1200M${PW / 2 - 24} 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.4"/>${sheet().p(c.cut([[-PW / 2 - 7, -7], [PW / 2 + 7, -8], [PW / 2 + 8, PH + 7], [-PW / 2 - 7, PH + 8]], 0.5, 7), C.haloRim).p(c.cut([[-PW / 2, 0], [PW / 2, -1], [PW / 2 + 1, PH], [-PW / 2, PH + 1]], 0.5, 7), C.parchment).out()}<g transform="translate(0 38)">${W.base}${W.rows.map((r, i) => `<g class="r${i}" opacity="0">${r}</g>`).join('')}</g><g class="sh">${shuttle(c)}</g><g transform="translate(0 ${PH - 20})">${strip(c, tr('cała tkana, bez szwu', 'woven, without seam'), { size: 16 })}</g></g>`);
    const rows = W.rows.map((_, i) => plate.querySelector(`.r${i}`));
    const sh = plate.querySelector('.sh');
    /* the scroll of Psalm 22 */
    const V = verseScroll(c, tr(['Podzielili między siebie szaty,', 'a los rzucili o moją suknię.'], ['They parted my garments among them.', 'For my cloak they cast lots.']), { w: 400, size: 21, title: tr('Psalm 22', 'Psalm 22') });
    const scroll = plL.add(`<g><path d="M-170 0V-1200M170 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.4"/>${V.rodTop}${V.sheet}<g transform="translate(0 ${V.h})">${V.rodBottom}</g></g>`);

    return (t, time) => {
      const T = time;
      G.sk.set(...J19.gold);
      clouds.forEach((cl, i) => swing(cl.el, cl.x + Math.sin(T * 0.07 + i * 2) * 26, cl.y, T, 0.8, 0.5, i));
      setCrosses(G, 1, 1, 1);
      fade(G.crossC.querySelector('.hl'), 0.8);
      pose(gl, { x: GOL.x, y: GOL.top - 150, s: 0.8, r: T * 1.2, o: 0.22 });

      /* v23a — the garments in four parts, one for each soldier */
      const show = es(t, 0.05, 0.3);
      const split = es(t, 0.4, 0.6);
      const go = es(t, 0.6, 0.95);
      q.forEach((el, i) => {
        const [sx, sy] = [[-1, -1], [1, -1], [-1, 1], [1, 1]][i];
        const s = sols[[0, 3, 1, 2][i]];
        const [lx, ly] = [s.x + (s.f ? -30 : 30), s.y - 50];
        const bx = sx * split * 14, by = sy * split * 10;
        pose(el, { x: lerp(bx, (lx - CX), go), y: lerp(by, ly - 610, go), s: lerp(1, 0.32, go), sy: lerp(1, 0.7, go), r: go * sx * 12 });
      });
      pose(quarters, { x: CX, y: lerp(530, 610, show), o: show });

      /* the soldiers */
      const pull = bump(t, 3.05, 3.4);
      const throwK = bump(t, 3.45, 3.8);
      const cheer = es(t, 5.1, 5.35);
      sols.forEach((m) => {
        const get = bump(t, 0.7 + m.i * 0.05, 1.0 + m.i * 0.05);
        const lift = m.i === 1 ? es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1)) + cheer * 1 : 0;
        const talk = (m.i === 2 ? bump(t, 3.05, 3.6) : 0);
        m.p.set({ x: m.x, y: m.y, s: 0.9, flip: m.f, armF: 30 + get * 50 + lift * 110 + (m.i === 1 || m.i === 2 ? pull * 40 : 0) + (m.i === 0 ? throwK * 60 : 0), armB: 10 + lift * 60 + talk * 90, head: -get * 4 + 6 - lift * 10, blink: blinkAt(T, m.i + 2) });
      });
      /* v23b — they take the tunic too */
      const [hx, hy] = hand(700, 692, 0.9, false, 30 + 110, 0, 62);
      const tk = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.05)) + es(t, 3.9, 4.0) * 0 + cheer;
      const tugX = pull * 30;
      pose(small, { x: lerp(CX, hx + 20 + tugX, Math.min(1, es(t, 1.05, 1.3) + cheer)), y: lerp(CY - 30, hy - 30, Math.min(1, es(t, 1.05, 1.3) + cheer)) - cheer * 10, s: 0.3 + cheer * 0.05, r: Math.sin(T * 1.2) * 2 * cheer, o: Math.min(1, es(t, 1.0, 1.1) * (1 - es(t, 2.9, 3.0)) + es(t, 3.0, 3.05) * (1 - es(t, 3.4, 3.5)) + cheer) });
      /* v23c — the plate: woven from the top down */
      const pk = es(t, 2.05, 2.35) * (1 - es(t, 2.95, 3.15));
      pose(plate, { x: ph ? 975 : 1010, y: lerp(-500, 140, pk), s: ph ? 0.75 : 0.85, r: Math.sin(T * 0.6) * 0.6, o: pk > 0.01 ? 1 : 0 });
      const wv = es(t, 2.2, 2.9, (x) => x);
      const n = rows.length;
      rows.forEach((r, i) => fade(r, Math.min(1, Math.max(0, wv * n - i))));
      const cur = Math.min(n - 1, Math.floor(wv * n));
      pose(sh, { x: Math.sin(wv * n * Math.PI) * 60, y: 38 + (cur + 0.5) * (W.h / n), o: wv > 0 && wv < 1 ? 1 : 0 });
      /* v24a — "let us not tear it": the dice */
      const nt = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.85, 4.0));
      const [thx, thy] = headAt(900, 692, 0.9, true, 62);
      pose(noTear, { x: thx - 20, y: thy - 20, s: nt, o: nt > 0.02 ? 1 : 0 });
      const roll = es(t, 3.5, 3.95), settle = es(t, 5.05, 5.4);
      const air = (1 - roll);
      pose(d0, { x: lerp(-190, -12, roll), y: -Math.sin(roll * Math.PI) * 70 * (1 - settle) + (1 - roll) * -40, r: roll * 520 * (1 - settle) + settle * 0 });
      pose(d1, { x: lerp(-170, 14, roll), y: -Math.sin(roll * Math.PI) * 50 * (1 - settle) + (1 - roll) * -60, r: roll * -380 * (1 - settle) });
      pose(dd, { x: CX, y: CY - 10, s: 1.3, o: roll > 0.01 ? 1 : 0 });
      /* v24b — Psalm 22 */
      // phone: the scroll hangs in the middle above the crosses, and is gone before the last sentence rests
      const sk2 = es(t, 4.05, 4.4) * (1 - (ph ? es(t, 5.3, 5.6) : es(t, 5.6, 5.9)));
      pose(scroll, { x: ph ? 800 : 1000, y: lerp(-600, ph ? 20 : 130, sk2), r: Math.sin(T * 0.6 + 1) * 0.5, o: sk2 > 0.01 ? 1 : 0 });

      S.cam.x = es(t, 1.9, 2.3) * 30 * (1 - es(t, 2.9, 3.3)) + es(t, 3.9, 4.3) * 30 * (1 - es(t, 5.5, 5.9));
      S.cam.y = 50 - es(t, 1.9, 2.3) * 40 * (1 - es(t, 2.9, 3.3)) - es(t, 3.9, 4.3) * 40 * (1 - es(t, 5.5, 5.9));
      S.cam.z = 1.08 + es(t, 3.3, 3.7) * 0.04 * (1 - es(t, 3.9, 4.3));
    };
  },
};
