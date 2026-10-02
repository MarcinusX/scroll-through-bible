// Mt 27,3–5a — the Temple court (Mark 12's court, the same cut). Judas stands alone with the purse; a small
// painted plate comes down beside him: Jesus led away bound, condemned. His face falls. He goes to the chief
// priests and the elders at the foot of the sanctuary stairs and holds the purse out to them: "I have sinned,
// I betrayed innocent blood." They shrug — "What is that to us?" — the high priest points back at him, "See to it
// yourself", and they turn their backs. Judas flings the silver towards the sanctuary: the coins ring and scatter
// over the paving at the foot of the stairs, and he goes out, alone.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { templeCourt, kf, moving, hand, headAt, leader, priest, withFace, faceBits, face, purse, silverFlat, taunt, bubble, bonds, guard, picturePlate, JUDAS, MT, tr, CAST, PI } from './lib.js';

const GY = 676;

export default {
  id: 'mt27-remorse',
  beats: [
    { v: 3 },
    { v: 4, text: 'i rzekł: «Zgrzeszyłem, wydawszy krew niewinną».' },
    { v: 4, cont: true, text: 'Lecz oni odparli: «Co nas to obchodzi?' },
    { v: 4, cont: true, text: 'To twoja sprawa».' },
    { v: 5, text: 'Rzuciwszy srebrniki ku przybytkowi, oddalił się,' },
  ],
  cam: { x: [-40, 140], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S, { skyCols: MT.temple, smoke: true });

    /* the plate: Jesus led away bound (what Judas sees) */
    const plateL = S.layer({ par: 0.2, sh: 5 });
    const PW = 250, PH = 150;
    const mini = (o, x, s, flip = false) => `<g transform="translate(${x} ${PH - 8}) scale(${flip ? -s : s} ${s})">${person(c, o)}</g>`;
    let inner = `<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="${mix(C.stone, C.duskViolet, 0.3)}"/>`;
    inner += `<path d="${c.cut([[-PW / 2 - 10, PH - 30], [PW / 2 + 10, PH - 34], [PW / 2 + 10, PH + 10], [-PW / 2 - 10, PH + 10]], 0.6, 8)}" fill="${mix(C.sand, C.stone2, 0.4)}"/>`;
    inner += `<circle cx="-10" cy="${PH - 90}" r="50" fill="url(#halo-glow)"/>`;
    inner += mini({ ...CAST.jesus, holdF: bonds(c) }, -10, 0.5) + `<g transform="translate(58 ${PH - 8}) scale(-.5 .5)">${guard(c, 0)}</g>` + `<g transform="translate(-74 ${PH - 8}) scale(.48)">${guard(c, 1)}</g>`;
    inner += `<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="${C.parchment}" opacity=".22"/>`;
    const plate = hanging(plateL, picturePlate(c, S.id('seen'), inner, { w: PW, h: PH }), { x: 0, y: -1500, len: 900 });

    /* the chief priests and the elders at the foot of the stairs */
    const P = S.layer({ par: 0.5, sh: 5 });
    const lords = [0, 1, 2, 3, 4].map((i) => ({ i, p: S.puppet(P.add(i === 0 ? priest(c, 0) : leader(c, i + 1))), x: (S.portrait ? [870, 928, 983, 1037, 1090] : [960, 1040, 1116, 1190, 1262])[i], y: GY - [0, 8, 2, 10, 4][i], seed: c.rr(0, 9) }));
    const jEl = P.add(withFace(person(c, { ...JUDAS, holdF: `<g transform="translate(0 -4)">${purse(c)}</g>` }), faceBits(c)));
    const judas = S.puppet(jEl);
    const jEl2 = P.add(withFace(person(c, JUDAS), faceBits(c)));
    const judas2 = S.puppet(jEl2);

    /* the silver */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const coins = Array.from({ length: 24 }, (_, i) => ({ i, el: fx.add(`<g>${silverFlat(c, 9)}</g>`), tx: c.rr(640, 980), ty: c.rr(GY - 30, GY + 30), h: c.rr(160, 280), d: c.rr(0, 0.25), spin: c.rr(-500, 500) }));
    const glints = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g><path d="${c.poly(c.star(0, 0, 9, 2.4, 4, 0))}" fill="#fffbe8"/></g>`) }));
    const sinned = fx.add(`<g>${bubble(c, tr(['Zgrzeszyłem,', 'wydałem krew niewinną'], ['I have sinned,', 'I betrayed innocent blood']), { size: 19, dir: -1 })}</g>`);
    const what = fx.add(`<g>${taunt(c, tr('Co nas to obchodzi?', 'What is that to us?'), { size: 19, side: -1 })}</g>`);
    const yours = fx.add(`<g>${taunt(c, tr('To twoja sprawa!', 'You see to it!'), { size: 19, side: -1 })}</g>`);
    set.front({ lampsOn: false });

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v3 — he sees Him condemned; remorse; he goes to the priests with the silver */
      const pk = es(t, 0.02, 0.3) * (1 - es(t, 0.85, 1.0));
      swing(plate, 640, 180 - (1 - pk) * 760, T, 1, 0.7, 1);
      const JS = S.portrait ? 765 : 820;   // phone: Judas a step back, so the five lords fit beside him
      const jK = [[-0.2, [300, GY + 6]], [0.3, [380, GY + 6]], [0.45, [380, GY + 6]], [0.98, [JS, GY + 4]], [4.2, [JS, GY + 4]], [5.0, [S.portrait ? 560 : 240, GY + 8]]];
      const [jx, jy] = kf(t, jK);
      const offer = es(t, 0.85, 1.05) * (1 - es(t, 4.05, 4.12));
      const bow = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.3)) + es(t, 3.3, 3.6) * 0.6 * (1 - es(t, 4.0, 4.1));
      const threw = es(t, 4.08, 4.12);
      const hurl = bump(t, 4.02, 4.3);
      const leaving = t > 4.2;
      const look = es(t, 0.05, 0.25) * (1 - es(t, 0.5, 0.7));
      const armF = leaving ? 14 : 16 + offer * 64 + hurl * 90;
      const common = { x: jx, y: jy, s: 1.02, flip: leaving, walk: moving(t, jK) ? jx * 0.05 : undefined, armF, armB: 8 + bump(t, 1.05, 1.9) * 40 + hurl * 30, head: -look * 14 + bow * 14 + (leaving ? 10 : 0), lean: bow * 6 - hurl * 6 + (leaving ? 4 : 0), blink: blinkAt(T, 2) };
      judas.set({ ...common, o: 1 - threw });
      judas2.set({ ...common, o: threw });
      const sad = es(t, 0.35, 0.6);
      face(jEl, 'sad', sad); face(jEl2, 'sad', 1);
      face(jEl, 'tear', es(t, 1.2, 1.5) * (1 - es(t, 3.0, 3.3)));

      /* the priests and elders: listen; shrug; point; turn their backs */
      const shrug = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const point = es(t, 3.05, 3.25) * (1 - es(t, 3.6, 3.8));
      const turn = es(t, 3.45, 3.55);
      const startle = bump(t, 4.1, 4.5);
      lords.forEach((m) => {
        const hp = m.i === 0;
        const away = turn * (hp ? 30 : 16 + m.i * 4);
        m.p.set({
          x: m.x + away, y: m.y, s: 0.98, flip: turn < 0.5, walk: turn > 0 && turn < 1 ? m.x * 0.05 : undefined,
          armF: 20 + es(t, 0.8, 1.1) * 10 + shrug * 50 + (hp ? point * 70 : 0) + startle * 20, armB: 10 + shrug * 60 + startle * 30, head: -4 + shrug * (m.i % 2 ? 10 : -8) + startle * -8, lean: shrug * -3, blink: blinkAt(T, m.seed),
        });
      });

      /* bubbles */
      const [jhx, jhy] = headAt(jx, jy, 1.02, false);
      const sk = es(t, 1.08, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(sinned, { x: jhx + 16, y: jhy - 18, s: sk, o: sk > 0.02 ? 1 : 0 });
      const [h1x, h1y] = headAt(lords[1].x, lords[1].y, 0.98, true);
      const wk = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(what, { x: h1x - 10, y: h1y - 16, s: wk, o: wk > 0.02 ? 1 : 0 });
      const [h0x, h0y] = headAt(lords[0].x, lords[0].y, 0.98, true);
      const yk = es(t, 3.08, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(yours, { x: h0x - 12, y: h0y - 16, s: yk, o: yk > 0.02 ? 1 : 0 });

      /* v5a — the silver flung towards the sanctuary, ringing on the paving */
      const [hx0, hy0] = hand(JS, GY + 4, 1.02, false, 16 + 64 + 90);
      coins.forEach((k) => {
        const u = seg(t, 4.08 + k.d, 4.5 + k.d);
        const x = lerp(hx0, k.tx, ease.out(u)), y = lerp(hy0, k.ty, u) - Math.sin(u * PI) * k.h;
        const bounce = u >= 1 ? 0 : 0;
        pose(k.el, { x, y: y - bounce, r: u * k.spin, sy: u >= 1 ? 0.55 : 1, o: t > 4.08 + k.d ? 1 : 0 });
      });
      glints.forEach((g) => {
        const u = seg(t, 4.45 + g.i * 0.08, 4.75 + g.i * 0.08);
        const k = coins[g.i * 4];
        pose(g.el, { x: k.tx, y: k.ty - 6, s: Math.sin(u * PI) * 1.2, r: u * 90, o: u > 0 && u < 1 ? 1 : 0 });
      });

      S.cam.x = 60 + es(t, 0.6, 1.0) * 40 - es(t, 4.2, 4.9) * 60;
      S.cam.y = 10 + es(t, 0.8, 1.2) * 30;
      S.cam.z = 1.02 + es(t, 0.8, 1.2) * 0.06 - es(t, 4.0, 4.6) * 0.04;
    };
  },
};
