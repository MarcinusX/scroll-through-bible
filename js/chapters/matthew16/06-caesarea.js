// Mt 16,13–14 — the road into the country of Caesarea Philippi, under snowy Hermon: the great red cliff of Paneas with
// the dark grotto of the old shrine and the springs of the Jordan pouring out below it. Jesus walks in with the
// disciples, stops, and turns to them: "Who do men say that the Son of Man is?" Their answers are let down as oval
// portraits: John the Baptist, Elijah (with the fire of his chariot) — then Jeremiah (with his wooden yoke), and one
// of the prophets.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, headAt, speech, GLYPH, portrait, signpost, hangAt, nameTag, caesareaSet, caesareaFront, CZ, DIS16, LOOK, JEREMIAH, tr } from './lib.js';

const GY = CZ.GROUND, JX = 780;

export default {
  id: 'mt16-caesarea',
  beats: [
    { v: 13, text: 'Gdy Jezus przyszedł w okolice Cezarei Filipowej,' },
    { v: 13, cont: true, text: 'pytał swych uczniów: «Za kogo ludzie uważają Syna Człowieczego?»' },
    { v: 14, text: 'A oni odpowiedzieli: «Jedni za Jana Chrzciciela, inni za Eliasza,' },
    { v: 14, cont: true, text: 'jeszcze inni za Jeremiasza albo za jednego z proroków».' },
  ],
  cam: { x: [-160, 20], y: [-40, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const Z = caesareaSet(S);
    Z.ground.add(`<g transform="translate(${S.portrait ? 470 : 430} ${GY - 22})">${signpost(c, tr('Cezarea Filipowa', 'Caesarea Philippi'), { size: 18, dir: 1 })}</g>`);

    /* ---------- the portraits ---------- */
    const pL = S.layer({ par: 0.1, sh: 7 });
    const yoke = `<g transform="translate(0 30)"><path d="${c.cut([[-58, -6], [58, -9], [58, 3], [-58, 6]], 0.3, 6)}" fill="${C.wood3}"/><path d="${c.cut(c.rect(-36, -16, 8, 26), 0.2, 4) + c.cut(c.rect(26, -18, 8, 26), 0.2, 4)}" fill="${C.wood2}"/></g>`;
    const flame = `<g transform="translate(34 58)"><path d="M0 0C-8 -10 -6 -22 0 -34C6 -22 8 -10 0 0Z" fill="${C.sunDeep}"/><path d="M0 -4C-3 -10 -3 -16 0 -22C3 -16 3 -10 0 -4Z" fill="${C.lampFlame}"/></g>`;
    const PORTS = S.portrait ? [510, 680, 860, 1040] : [480, 690, 910, 1120];
    const ports = [
      { o: LOOK.baptist, name: tr('Jan Chrzciciel', 'John the Baptist'), t0: 2.1, extra: '' },
      { o: LOOK.elijah, name: tr('Eliasz', 'Elijah'), t0: 2.35, extra: flame },
      { o: JEREMIAH, name: tr('Jeremiasz', 'Jeremiah'), t0: 3.1, extra: yoke },
      { o: LOOK.prophet, name: tr('jeden z proroków', 'one of the prophets'), t0: 3.4, extra: '' },
    ].map((p, i) => ({ ...p, i, x: PORTS[i], el: pL.add(`<g><path d="M0 -84V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${portrait(S, p.o, p.name, { w: 112, h: 144, extra: p.extra })}</g>`) }));
    // phone: the walkers always cover the signpost, so the place's name also hangs in the sky while they arrive
    const placeTag = S.portrait ? pL.add(`<g><path d="M0 -14V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr('Cezarea Filipowa', 'Caesarea Philippi'), { size: 20 })}</g>`) : null;

    /* ---------- people on the road ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS16.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const whoQ = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 48, h: 48 })}</g>`);
    const ans = [2, 4, 1, 5].map((di, j) => ({ di, j, el: fx.add(`<g>${speech(c, `<g transform="scale(.8)">${GLYPH.star(c)}</g>`, { w: 50, h: 40, flip: DIS16[di].x > JX })}</g>`) }));
    caesareaFront(S);

    return (t, time) => {
      const T = time;
      Z.update(T);

      /* v13a — they walk in along the road */
      const u = kf(t, [[0, 0], [0.9, 1]], (x) => x);
      const walking = t > 0 && t < 0.9;
      const off = (1 - u) * -720;
      const ask = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const listen = es(t, 2.05, 2.3);
      jesus.set({ x: JX + off, y: GY, s: 1, flip: false, walk: walking ? off * 0.05 : undefined, armF: 16 + ask * 60 - listen * 4, armB: 8 + ask * 40, head: -ask * 4 + listen * 6, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1, false);
      const wq = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(whoQ, { x: hx + 16, y: hy - 32, s: wq, o: wq > 0.02 ? 1 : 0 });

      /* v14 — they answer, pointing up at the portraits */
      dis.forEach((d) => {
        const x = d.x + off * 0.94;
        const turn = t > 0.95;
        const a = ans.find((q) => q.di === d.i);
        const tp = a ? ports[a.j].t0 : 0;
        const point = a ? bump(t, tp - 0.05, tp + 0.75) : 0;
        const each = bump(t, 1.2, 1.95) * (d.i % 2);
        d.p.set({
          x, y: GY + 4 + (d.i % 2) * 8, s: 0.88, flip: turn ? (d.x > JX) !== (each > 0.3) : false,
          walk: walking ? x * 0.05 + d.i : undefined,
          armF: 18 + point * 40 + each * 30, armB: 10 + point * 130,
          head: -point * 14 - es(t, 2.1, 2.4) * 6, blink: blinkAt(T, d.seed),
        });
      });
      ans.forEach((a) => {
        const t0 = ports[a.j].t0;
        const k = es(t, t0, t0 + 0.15, ease.back) * (1 - es(t, t0 + 0.6, t0 + 0.7));
        const d = DIS16[a.di];
        const [ax, ay] = headAt(d.x, GY + 4 + (a.di % 2) * 8, 0.88, d.x > JX);
        pose(a.el, { x: ax + (d.x > JX ? -12 : 12), y: ay - 30, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      if (placeTag) { const pk = es(t, 0.05, 0.35, ease.back) * (1 - es(t, 1.75, 1.95)); hangAt(placeTag, 800, 300 - (1 - pk) * 900, T, 1.2, 0.8, 9); }

      /* the portraits come down */
      ports.forEach((p) => {
        const on = es(t, p.t0, p.t0 + 0.35, ease.back);
        hangAt(p.el, p.x, 250 - (1 - on) * 700 + (p.i % 2) * 18, T, 1.2, 0.8, p.i * 2);
      });

      S.cam.x = lerp(-150, 0, es(t, 0, 0.9));
      S.cam.z = 1.04 + es(t, 0.9, 1.3) * 0.1 - es(t, 1.95, 2.3) * 0.12;
      S.cam.y = 20 + es(t, 0.9, 1.3) * 30 - es(t, 1.95, 2.3) * 60;
    };
  },
};
