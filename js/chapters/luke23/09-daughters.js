// Łk 23,28–31 — on the road. Jesus stops and turns to the women who follow Him weeping: "Daughters of Jerusalem,
// do not weep for Me; weep for yourselves and for your children" — little children come to the women's sides. Then
// His words come down as painted flats above the road: the days that are coming, an empty cradle in a dark house,
// "Blessed are the barren"; people crying to the mountains "Fall on us!" and to the hills "Cover us!" as the
// mountains lean over them; and the green tree and the dry one — a spark by the dry wood: if they do this when the
// wood is green, what will happen when it is dry?
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { olive } from '../../assets/nature.js';
import { flat, flatSky, fig, flyTo, dropK, flatHills, flatText } from '../luke1/lib.js';
import { kf, moving, headAt, soldier, carriedCross, strip, hanging, swing, roadSet, pose3, folkO, withFace, faceBits, face, child, woman, bareTree, flame, RGY, LOOK, SKIES, tr, PI } from './lib.js';

const GY = RGY, JX = 850;
const FW = 400, FH = 250;

export default {
  id: 'lk23-daughters',
  beats: [
    { v: 28, text: 'Lecz Jezus zwrócił się do nich i rzekł:' },
    { v: 28, cont: true, text: '«Córki jerozolimskie, nie płaczcie nade Mną; płaczcie raczej nad sobą i nad waszymi dziećmi!' },
    { v: 29 },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-40, 80], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S);
    /* the crowd further back (sprites), Simon with the cross, a soldier ahead */
    const mk = (n, sc) => {
      const mem = [];
      for (let i = 0; i < n; i++) mem.push({ x: i * 46 + c.rr(-6, 6) - n * 23, y: (i % 2) * 14, s: sc * c.rr(0.94, 1.04), flip: false, o: folkO(c), armF: c.rr(6, 30), armB: 8, head: c.rr(-6, 2) });
      return pose3(c, mem);
    };
    [[230, GY - 34], [40, GY - 26], [-150, GY - 34]].forEach(([x, y]) => R.P2.sprite(mk(5, 0.76), x, y));
    const simon = S.puppet(R.P2.add(person(c, LOOK.simon)));
    const crossEl = R.P2.add(`<g>${carriedCross(c)}</g>`);
    const P = R.P;
    const sol = S.puppet(P.add(soldier(c, 0)));
    const W = [
      { o: woman(c, { robe: C.roseRobe }), x: 560 }, { o: woman(c, { robe: C.dustyBlue }), x: 480 },
      { o: woman(c, { robe: C.ochreRobe }), x: 400 }, { o: woman(c, { robe: C.sageRobe }), x: 630 },
    ].map((w, i) => ({ ...w, i, p: S.puppet(P.add(withFace(person(c, w.o), faceBits(c)))), seed: c.rr(0, 9) }));
    const kids = [[520, 2], [665, 3], [440, 5]].map(([x, i], k) => ({ x, k, p: S.puppet(P.add(person(c, child(c, i)))), seed: c.rr(0, 9) }));
    const jes = S.puppet(P.add(person(c, CAST.jesus)));
    const tagL = S.layer({ par: 0.6, sh: 5 });
    const dTag = hanging(tagL, strip(c, tr('Córki jerozolimskie', 'Daughters of Jerusalem'), { size: 18 }), { x: 0, y: -1500, len: 900 });

    /* the three flats */
    const flL = S.layer({ par: 0.3, sh: 6 });
    const SK = (a, b) => flatSky(S, FW, FH, [a, b]);
    // v29 — the days that are coming: an empty cradle in a dark house
    const cradle = sheet().p(c.cut([[-40, -26], [40, -26], [36, 0], [-36, 0]], 0.5, 5), C.wood3).p(c.ribbon(c.arc(0, -4, 52, 14, 0.1 * PI, 0.9 * PI, 10), 4), C.wood2).p(c.cut([[-34, -30], [34, -30], [30, -22], [-30, -22]], 0.3, 4), C.linen2).out();
    const room = sheet().p(c.cut([[-FW / 2 - 4, -FH / 2 - 4], [FW / 2 + 4, -FH / 2 - 4], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.4, 10) + c.hole(c.rect(40, -70, 90, 70), 0.3, 5), mix(C.plaster2, C.storm2, 0.45)).p(c.cut(c.rect(-FW / 2 - 4, 58, FW + 8, 80), 0.4, 8), mix(C.wood3, C.storm2, 0.4)).out();
    const flat1 = flL.add(flat(S, `${SK('#4d4a6a', '#8a7f93')}<g transform="translate(85 -34)">${flatHills(c, 120, 0, mix(C.hillFar, C.storm2, 0.5), 5)}</g>${room}<g transform="translate(-40 96) scale(1.3)">${cradle}</g>${fig(c, { ...woman(c, { robe: mix(C.dustyBlue, C.storm2, 0.3) }), pose: 'sit' }, 70, 118, 0.48, true)}${flatText(0, -86, tr('«Szczęśliwe niepłodne…»', '“Blessed are the barren…”'), 22, C.cream)}`, { w: FW, h: FH }));
    // v30 — "Fall on us!", "Cover us!": the mountains lean over the little people
    const mtn = (sd, col) => sheet().p(c.cut([[0, 0], [sd * 40, -120], [sd * 80, -170], [sd * 130, -140], [sd * 200, 0]], 0.8, 8), col).out();
    const crowdMini = pose3(c, [-3, -2, -1, 0, 1, 2, 3].map((k) => ({ x: k * 24, y: Math.abs(k) * 2, s: 0.34, flip: k > 0, o: folkO(c), armF: 120 + (k % 2) * 30, armB: 150, head: -16 })));
    const flat2 = flL.add(flat(S, `${SK('#3f3d5e', '#8e7b86')}<g class="mL" transform="translate(-200 110)">${mtn(1, mix(C.rock2, C.storm2, 0.4))}</g><g class="mR" transform="translate(200 110)">${mtn(-1, mix(C.rock3, C.storm2, 0.4))}</g>${flatHills(c, FW, 90, mix(C.rock2, C.storm, 0.4), 6)}<g transform="translate(0 112)">${crowdMini}</g>${flatText(0, -90, tr('«Padnijcie na nas!» «Przykryjcie nas!»', '“Fall on us!” “Cover us!”'), 21, C.cream)}`, { w: FW, h: FH }));
    const mL = flat2.querySelector('.mL'), mR = flat2.querySelector('.mR');
    // v31 — the green tree and the dry
    const flat3 = flL.add(flat(S, `${SK('#9fb3b8', '#e8d6b6')}${flatHills(c, FW, 80, mix(C.hillMid, C.sand, 0.3), 6)}${olive(c, -90, 100, 0.82)}<g transform="translate(95 102)">${bareTree(c, 130, mix(C.wood2, C.soil, 0.4))}</g><g class="fl" transform="translate(95 96)">${flame(c, 18)}</g>${flatText(-90, -92, tr('drzewo zielone', 'the green tree'), 19, C.moss2)}${flatText(95, -92, tr('suche', 'the dry'), 19, C.wood2)}`, { w: FW, h: FH }));
    const fl = flat3.querySelector('.fl');

    return (t, time) => {
      const T = time;
      R.sk.blend(SKIES.storm, SKIES.grey, 0.6);
      R.clouds.forEach((cl, i) => swing(cl.el, cl.x + Math.sin(T * 0.08 + i) * 30, cl.y, T, 1, 0.5, i));

      /* v28a — He stops and turns to them */
      const jK = [[-0.3, [760, GY]], [0.4, [JX, GY]]];
      const [jx] = kf(t, jK);
      const turn = t > 0.45;
      const speak = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1)) + [2, 3, 4].reduce((a, b) => a + es(t, b + 0.05, b + 0.3) * (1 - es(t, b + 0.85, b + 1.0)) * 0.5, 0);
      jes.set({ x: jx, y: GY, s: 1.04, flip: turn, walk: moving(t, jK) ? jx * 0.05 : undefined, amt: 0.6, armF: 14 + speak * 50, armB: 8 + es(t, 1.05, 1.3) * 30 * (1 - es(t, 1.9, 2.1)), head: 4 - speak * 3, blink: blinkAt(T) });
      sol.set({ x: S.portrait ? 1015 : 1110, y: GY + 8, s: 1, flip: es(t, 0.3, 0.5) > 0.5, armF: 34, armB: 10, blink: blinkAt(T, 3) });
      const sx = kf(t, [[-0.3, 650], [0.4, 700]]);
      simon.set({ x: sx, y: GY - 16, s: 0.96, flip: false, walk: t < 0.4 ? sx * 0.05 : undefined, amt: 0.7, armF: 70, armB: 40, lean: 8, head: 8, blink: blinkAt(T, 2) });
      pose(crossEl, { x: sx - 12, y: GY - 16 - 134 + 22, r: 60, s: 0.96 });

      /* the women weep; children come to their sides at "your children" */
      W.forEach((w) => {
        const wx = w.x + (S.portrait ? 40 : 0);   // phone: the women a step in from the left edge
        const K = [[-0.3, [wx - 120, GY + 12]], [0.45, [wx, GY + 12]]];
        const [x, y] = kf(t, K);
        const weep = 1 - es(t, 1.05, 1.4) * 0.5;
        const look = es(t, 0.4, 0.7);
        w.p.set({ x, y, s: 1.0, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 14 + weep * (w.i % 2 ? 126 : 90) * (1 - look * 0.4), armB: 8 + (w.i === 2 ? 30 : 0), head: 10 * weep - look * 8, blink: blinkAt(T, w.seed) });
        face(w.p.el, 'sad', 1);
        face(w.p.el, 'tear', w.i < 2 ? 1 : 0);
      });
      kids.forEach((k) => {
        const kx = k.x + (S.portrait ? 40 : 0);
        const K = [[1.1 + k.k * 0.08, [kx - 140, GY + 26]], [1.5 + k.k * 0.08, [kx, GY + 26]]];
        const [x, y] = kf(t, K);
        k.p.set({ x, y, s: 0.56, flip: false, walk: moving(t, K) ? x * 0.1 : undefined, armF: 20 + es(t, 1.5, 1.8) * 50, armB: 10, head: -6, o: es(t, 1.08 + k.k * 0.08, 1.15 + k.k * 0.08), blink: blinkAt(T, k.seed) });
      });
      const tk = es(t, 1.05, 1.4) * (1 - es(t, 1.95, 2.15));
      swing(dTag, S.portrait ? 620 : 520, 360 - (1 - tk) * 900, T, 1.2, 0.8, 1);

      /* the flats */
      const f1 = dropK(t, 2.0, 3.05), f2 = dropK(t, 3.0, 4.05), f3 = dropK(t, 4.0, 5.3);
      flyTo(flat1, f1, 800, 250, T, 1);
      flyTo(flat2, f2, 800, 250, T, 2);
      flyTo(flat3, f3, 800, 250, T, 3);
      const lean = es(t, 3.2, 3.7);
      pose(mL, { x: -200, y: 110, r: lean * 16 });
      pose(mR, { x: 200, y: 110, r: -lean * 16 });
      const fk = es(t, 4.35, 4.6);
      pose(fl, { x: 95, y: 96, s: fk * (1 + (T ? Math.sin(T * 9) * 0.08 : 0)), o: fk > 0.02 ? 1 : 0 });

      S.cam.x = -20 + es(t, 0.3, 0.9) * -20;
      S.cam.y = 20 - es(t, 1.9, 2.3) * 60;
      S.cam.z = 1.02 + es(t, 0.3, 0.9) * 0.04 - es(t, 1.9, 2.3) * 0.04;
    };
  },
};
