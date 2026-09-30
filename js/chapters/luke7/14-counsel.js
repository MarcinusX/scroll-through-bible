// Łk 7,29–30 — the crowds on the slope divide. On the left the people — and the tax collectors among them — lift up
// their hands and give God the glory: the flat above shows the Jordan, where John poured the water over a tax
// collector with his purse at his belt and the others waited in the river. On the right stand the Pharisees and the
// lawyers: over the flat a golden scroll of God's purpose hangs in the light, John holds out his hand to them from
// the water — but they fold their arms and turn their backs, and the scroll rolls itself up and rises away.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  teachSet, TS, flatY, JOHN_B, TAXMAN, LAWYER, pharisee, folkGroup, flat, flatSky, flatHills, fig, figure, scrollOpen, scrollRolled, moneybag,
  headAt, hangAt, kf, moving, addToBody, tr, PI, FONT,
} from './lib.js';

const { GY, JX, FX, FW, FH, K } = TS;

export default {
  id: 'lk7-counsel',
  beats: [
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-20, 40], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S, { crowds: false, johnCameo: true });
    const c = T0.c;
    const X = (dx) => FX + dx * K;
    const B = T0.bits;
    /* the people (left): as they listen, then praising God */
    const people = ['walk', 'praise'].map((a) => T0.crowdL.sprite(folkGroup(makeCutter('lk7-ts-l'), 7, { s: 0.84, arms: a }), 420, GY - 4));
    /* a tax collector (left, near Jesus) and the Pharisees and lawyers (right) */
    const tax = S.puppet(T0.P.add(addToBody(person(c, TAXMAN), `<g transform="translate(22 -94) scale(.6)">${moneybag(c)}</g>`)));
    const LOOKS = [pharisee(c, 0), LAWYER, pharisee(c, 3), { ...LAWYER, mantle: shade(C.teal2, -0.1), veil2: C.teal2, beardColor: C.hair3, hair: C.hair3 }];
    const phar = LOOKS.map((o, i) => ({ i, p: S.puppet(T0.P.add(person(c, o))), seed: c.rr(0, 9) }));

    /* the flat: the Jordan, John baptizing */
    const fl = T0.FL.add(flat(S, flatSky(S, FW, FH, ['#cfdcd4', '#f3e3c3']) + flatHills(c, FW, 0, mix(C.dune, C.sand2, 0.35), 8)
      + `<path d="${c.cut([[-FW / 2 - 4, 60], [FW / 2 + 4, 56], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.6, 8)}" fill="${C.lake}"/>`
      + `<path d="${c.cut([[70, 56], [FW / 2 + 4, 40], [FW / 2 + 4, 120], [110, 120]], 0.6, 8)}" fill="${mix(C.sand, C.sand2, 0.4)}"/>`
      + fig(c, { robe: C.sageRobe, hairStyle: 'short', hair: C.hair3, beard: 'short' }, -170, 96, 0.38) + fig(c, { robe: C.mauve, hairStyle: 'veil', veil: C.linen2, beard: 'none' }, -140, 98, 0.36), { w: FW, h: FH }));
    const water = sheet().p(c.cut([[-40, 0], [40, 0], [36, 16], [-36, 16]], 0.5, 6), C.lake).out();
    const johnF = B.add(`<g>${figure(c, JOHN_B, { s: 0.42, armF: 110, armB: 30, head: 6 })}${`<g transform="translate(0 0)">${water}</g>`}</g>`);
    const johnReach = B.add(`<g>${figure(c, JOHN_B, { s: 0.42, flip: false, armF: 80, armB: 60, head: -4 })}${water}</g>`);
    const taxF = B.add(`<g>${figure(c, { ...TAXMAN, pose: 'kneel' }, { s: 0.42, flip: true, armF: 60, armB: 40, head: 16 })}${water}</g>`);
    const drops = [0, 1, 2, 3].map(() => B.add(`<g><path d="${c.cut([[0, -4], [2.4, 0], [0, 3], [-2.4, 0]], 0.1, 2)}" fill="${C.lake2}"/></g>`));
    const pharF = B.add(`<g>${[0, 1, 2].map((i) => figure(c, i === 1 ? LAWYER : pharisee(c, i), { x: 120 + i * 30, y: 0, s: 0.34, flip: true, armF: 24, armB: 30, head: -8 })).join('')}</g>`);
    const pharBack = B.add(`<g>${[0, 1, 2].map((i) => figure(c, i === 1 ? LAWYER : pharisee(c, i), { x: 120 + i * 30, y: 0, s: 0.34, flip: false, armF: 24, armB: 30, head: -12 })).join('')}</g>`);
    const glow = B.add(`<circle r="80" fill="url(#halo-glow)" opacity="0"/>`);
    const plan = B.add(`<g>${scrollOpen(c, 150, 48)}<text x="0" y="5" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.terracotta}">${tr('zamiar Boży', 'the counsel of God')}</text></g>`);
    const rolled = B.add(`<g>${scrollRolled(c, 44)}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T);
      hangAt(T0.jc, S.portrait ? 800 : 1118, S.portrait ? 20 : 150, T, 1, 0.6);
      const k = es(t, 0.0, 0.26, ease.out);
      const fy = flatY(k);
      const on = k > 0.002 ? 1 : 0;
      pose(fl, { x: FX, y: fy, s: K, o: on });
      const Y = (dy) => fy + dy * K;

      /* v29 — the people and the tax collectors justify God: they were baptized by John */
      const praise = es(t, 0.3, 0.38);
      people[0].set({ x: 420, y: GY - 4, o: 1 - praise });
      people[1].set({ x: 420, y: GY - 4, o: praise });
      tax.set({ x: 620, y: GY + 4, s: 1.0, armF: 20 + praise * 20, armB: 10 + praise * 150, head: -praise * 16, blink: blinkAt(T, 4) });
      const pour = bump(t, 0.2, 0.9);
      pose(johnF, { x: X(-40), y: Y(96), s: K, o: on * (1 - es(t, 1.1, 1.16)) });
      pose(taxF, { x: X(-2), y: Y(98), s: K, o: on * (1 - es(t, 1.0, 1.1)) });
      drops.forEach((d, i) => { const u = T ? ((T * 1.2 + i / 4) % 1) : (i + 0.5) / 4; pose(d, { x: X(-14 + i * 4), y: Y(20 + u * 40), s: K, o: on * pour * (1 - u) }); });

      /* v30 — the Pharisees and lawyers reject God's purpose: they turn their backs; the scroll rolls up and rises */
      const turn = es(t, 1.3, 1.36);
      const away = es(t, 1.36, 1.8);
      pose(johnReach, { x: X(-40), y: Y(96), s: K, o: on * es(t, 1.1, 1.16) });
      pose(pharF, { x: X(0), y: Y(78), s: K, o: on * (1 - turn) });
      pose(pharBack, { x: X(away * 30), y: Y(78), s: K, o: on * turn });
      const offer = es(t, 1.05, 1.25);
      const roll = es(t, 1.45, 1.6);
      const rise = es(t, 1.55, 1.95, ease.in);
      pose(glow, { x: X(60), y: Y(-70) - rise * 60, s: K, o: on * offer * (1 - rise * 0.7) });
      pose(plan, { x: X(60), y: Y(-70), sx: K * Math.max(0.05, 1 - roll), sy: K, o: on * offer * (roll < 0.95 ? 1 : 0) });
      pose(rolled, { x: X(60), y: Y(-70) - rise * 260, r: 90, s: K, o: on * (roll >= 0.95 ? 1 : 0) });
      phar.forEach((p) => {
        const x = [960, 1050, 1140, 1230][p.i] + away * 40;
        const turned = t > 1.33;
        p.p.set({ x, y: GY - 4 + (p.i % 2) * 8, s: 1.0, flip: !turned, walk: away > 0 && away < 1 ? x * 0.05 + p.i : undefined, amt: 0.6, armF: 24, armB: 30, head: turned ? -12 : -6, blink: blinkAt(T, p.seed) });
      });

      const point = es(t, 0.1, 0.25);
      const toPh = es(t, 1.05, 1.2);
      T0.jesus.set({ x: JX, y: GY, s: 1.06, flip: t < 1.05, armF: 16 + point * 30, armB: 10 + point * 100 * (1 - toPh) + toPh * 40, head: -point * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, t < 1.05);
      T0.voice(hx, hy, 0.7, T, { dir: t < 1.05 ? -1 : 1, spread: 1.8 });

      S.cam.y = -20;
      S.cam.z = 1.04;
      S.cam.x = kf(t, [[0, -10], [1.0, -10], [1.3, 20]]);
      void moving; void lerp; void seg;
    };
  },
};
