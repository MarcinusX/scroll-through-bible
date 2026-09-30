// Łk 4,23–24 — still in the synagogue, Jesus in the teacher's seat. "You will quote me this proverb: Physician,
// heal yourself": an arched plate comes down — a physician with a bandage round his own head, his jar of balm at
// his side. "Do here in your home town what we heard was done in Capernaum": two plates, Capernaum by the lake
// sparkling with healings and Nazareth on its hill, a gold dotted road from the one to the other, and hands in the
// room held out: here too! "No prophet is accepted in his home town": a prophet stands outside his own town's
// gate, shut against him; in the room arms fold, faces turn away and the light goes cool.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { nazSynagogue, headAt, hand, voiceRings, labelTag, hangAt, sparkle, physicianKit, speech, GLYPH, figure, village, smallSynagogue, PHYSICIAN, L6, staff, manO, womanO, tr, DY, PI } from './lib.js';

const JX = 800;

/** an arched gold-rimmed plate (origin centre) with inner markup; w × h */
function archPlate(c, inner, { w = 200, h = 220, bg = '#efe6d2' } = {}) {
  const arch = (ww, hh) => [[-ww / 2, hh / 2], [-ww / 2, -hh / 2 + ww / 2], ...c.arc(0, -hh / 2 + ww / 2, ww / 2, ww / 2, PI, 2 * PI, 18), [ww / 2, hh / 2]];
  const s = sheet().p(c.cut(arch(w + 14, h + 14), 0.5, 6), C.haloRim).p(c.cut(arch(w, h), 0.4, 6), bg);
  const id = `lk4ph${Math.round(c.rr(0, 1e9))}`;
  return `${s.out()}<clipPath id="${id}"><path d="${c.poly(arch(w, h))}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
}

export default {
  id: 'lk4-physician',
  beats: [
    { v: 23, text: 'Wtedy rzekł do nich: «Z pewnością powiecie Mi to przysłowie: Lekarzu, ulecz samego siebie;' },
    { v: 23, cont: true, text: 'dokonajże i tu w swojej ojczyźnie tego, co wydarzyło się, jak słyszeliśmy, w Kafarnaum».' },
    { v: 24 },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const N = nazSynagogue(S);
    const { FLOOR, FRONT } = N;

    /* ---------- the plates ---------- */
    const hi = S.layer({ par: 0.3, sh: 6 });
    // the physician with his own head bandaged
    const phys = (() => {
      const g = sheet().p(c.cut([[-110, 70], [110, 70], [110, 130], [-110, 130]], 0.4, 6), mix(C.sand, C.stone, 0.4)).out();
      const man = figure(c, PHYSICIAN, { x: -10, y: 80, s: 0.62, armF: 40, armB: 150, head: 10 });
      const band = sheet().p(c.ribbon(c.arc(-9, -22, 12, 11, PI * 0.95, PI * 2.05, 10), 7), C.linen).p(c.cut([[-18, -30], [-26, -20], [-22, -16]], 0.2, 2), C.linen).x(c.poly(c.circ(4, -26, 2.6, 6)), C.terracotta).out();
      return archPlate(c, `${g}${man}<g transform="translate(0 0)">${band}</g><g transform="translate(50 80) scale(.8)">${physicianKit(c)}</g>`, { w: 200, h: 230 });
    })();
    const physEl = hanging(hi, phys + `<g transform="translate(0 140)">${labelTag(tr('Lekarzu, ulecz samego siebie', 'Physician, heal yourself'), 18)}</g>`, { x: 0, y: -1500, len: 700 });
    // Capernaum by the lake, sparkling
    const kaf = (() => {
      const s = sheet();
      s.p(c.cut([[-110, -40], [110, -46], [110, 130], [-110, 130]], 0.4, 6), C.lake);
      s.x(c.ribbon([[-80, 0], [-40, -2]], 2) + c.ribbon([[20, 20], [70, 18]], 2), C.foam, 'opacity=".8"');
      s.p(c.cut([[-110, 50], [-40, 40], [40, 44], [110, 36], [110, 130], [-110, 130]], 0.5, 6), C.sand);
      const houses = village(c, -30, 46, { n: 5, spread: 150, sc: 0.8 });
      const syn = `<g transform="translate(58 44) scale(.3)">${smallSynagogue(c)}</g>`;
      const jumper = figure(c, manO(c), { x: -20, y: 108, s: 0.34, armF: 120, armB: 160, head: -10 });
      const sp = [[-60, -10], [40, -30], [0, 70]].map(([x, y]) => `<g transform="translate(${x} ${y})">${sparkle(c, 12)}</g>`).join('');
      return archPlate(c, s.out() + houses + syn + jumper + sp, { w: 200, h: 220, bg: C.skyBlue });
    })();
    const kafEl = hanging(hi, kaf + `<g transform="translate(0 134)">${labelTag(tr('Kafarnaum', 'Capernaum'), 18)}</g>`, { x: 0, y: -1500, len: 700 });
    // Nazareth on its hill, hands held out: here too!
    const naz = (() => {
      const s = sheet();
      s.p(c.cut([[-110, 60], [-60, 20], [0, -10], [60, 16], [110, 50], [110, 130], [-110, 130]], 0.5, 6), mix(C.hillNear, C.sand, 0.35));
      const houses = village(c, 0, 20, { n: 6, spread: 150, sc: 0.8 });
      const ppl = [-56, -20, 16, 52].map((x, i) => figure(c, i % 2 ? womanO(c) : manO(c), { x, y: 116, s: 0.3, flip: i > 1, armF: 80, armB: 60 })).join('');
      return archPlate(c, s.out() + houses + ppl, { w: 200, h: 220, bg: C.skyBlue });
    })();
    const nazEl = hanging(hi, naz + `<g transform="translate(0 134)">${labelTag(tr('Nazaret', 'Nazareth'), 18)}</g>`, { x: 0, y: -1500, len: 700 });
    const road = hi.add(`<g opacity="0"><path d="${Array.from({ length: 12 }, (_, i) => { const u0 = i / 12, u1 = u0 + 0.05; const p = (u) => [lerp(-230, 230, u), -Math.sin(u * PI) * 70]; return c.ribbon([p(u0), p(u1)], 4.4); }).join('')}" fill="${C.sunDeep}"/><path d="${c.poly([[222, -14], [246, 4], [218, 14]])}" fill="${C.sunDeep}"/></g>`);
    // a prophet outside the shut gate of his own town
    const prophet = (() => {
      const s = sheet();
      s.p(c.cut([[-110, 90], [110, 90], [110, 130], [-110, 130]], 0.4, 6), mix(C.sand, C.stone, 0.4));
      s.p(c.cut(c.rect(-10, -30, 120, 124), 0.5, 6), C.stone2);
      let bl = '';
      for (let y = -24; y < 86; y += 20) for (let x = -6 + ((y + 24) / 20 % 2) * 14; x < 104; x += 30) bl += c.cut(c.rect(x, y, 26, 16), 0.3, 4);
      s.x(bl, shade(C.stone2, -0.12), 'opacity=".6"');
      s.p(c.cut([[16, 94], [16, 30], ...c.arc(46, 30, 30, 26, PI, 2 * PI, 8), [76, 94]], 0.3, 5), C.wood2);
      s.x(c.ribbon([[46, 6], [46, 94]], 2) + c.ribbon([[18, 50], [74, 50]], 3), shade(C.wood2, -0.3));
      s.p(c.cut(c.rect(-14, -40, 128, 12), 0.3, 5), shade(C.stone2, 0.15));
      const backs = [14, 42, 70, 98].map((x, i) => `<g transform="translate(${x} -2) scale(.26)">${person(c, { ...(i % 2 ? womanO(c) : manO(c)) })}</g>`).join('');
      const pr = figure(c, { ...L6.prophet, holdF: `<g transform="translate(0 -10)">${staff(c, 190)}</g>` }, { x: -60, y: 116, s: 0.5, armF: 30, head: 14 });
      return archPlate(c, backs + s.out() + pr, { w: 220, h: 230, bg: C.skyBlue });
    })();
    const propEl = hanging(hi, prophet + `<g transform="translate(0 140)">${labelTag(tr('prorok w swojej ojczyźnie', 'a prophet in his hometown'), 18)}</g>`, { x: 0, y: -1500, len: 700 });

    /* ---------- the people ---------- */
    const backL = S.layer({ par: 0.45, sh: 4 });
    const back = N.backRow(backL);
    const act = S.layer({ par: 0.55, sh: 5 });
    N.lectern(act);
    act.add(sheet().p(c.cut([[JX - 44, FLOOR + 2], [JX - 40, 612], [JX + 40, 612], [JX + 44, FLOOR + 2]], 0.5, 6), C.stone2).p(c.cut([[JX - 48, 604], [JX + 48, 604], [JX + 48, 614], [JX - 48, 614]], 0.4, 6), shade(C.stone2, 0.2)).out());
    const jSit = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 40, w: 5 });
    N.bench(act);
    const front = N.frontLooks().filter((m) => m.i !== 4).map((m) => ({ ...m, p: S.puppet(act.add(person(c, { ...m.o, pose: 'sit' }))) }));
    const fx = S.layer({ par: 0.56, sh: 4 });
    const demands = [back[0], back[3], back[6], front[1], front[5], front[7]].map((m, i) => ({ m, i, el: fx.add(`<g opacity="0">${speech(c, GLYPH.star(c), { w: 46, h: 40, flip: m.x > JX })}</g>`) }));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#6c7898"/>`);
    tint.fade(0);
    N.columns();
    const [shx, shy] = headAt(JX, 618, 1.0, false, DY.sit);

    return (t, time) => {
      N.flicker(time);
      const speak = es(t, 0.05, 0.3);
      const point = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const sad = es(t, 2.1, 2.4);
      jSit.set({ x: JX, y: 618, s: 1.0, armF: 30 + speak * 30 + point * 30, armB: 10 + speak * 40 * (1 - sad) + sad * 20, head: -speak * 4 + sad * 10, blink: blinkAt(time) });
      voice(shx, shy, speak * 0.8, time, { spread: 2.4 });

      /* v23a: the proverb */
      const pk = es(t, 0.1, 0.4, ease.back) * (1 - es(t, 0.95, 1.15));
      hangAt(physEl, 800, lerp(-500, 240, pk), time, 1.3, 0.8);
      /* v23b: Capernaum → here too */
      const kk = es(t, 1.08, 1.35, ease.back) * (1 - es(t, 1.95, 2.15));
      hangAt(kafEl, 520, lerp(-500, 250, kk), time, 1.2, 0.8, 1);
      const nk = es(t, 1.18, 1.45, ease.back) * (1 - es(t, 1.95, 2.15));
      hangAt(nazEl, 1080, lerp(-500, 250, nk), time, 1.2, 0.8, 2);
      const rk = es(t, 1.4, 1.6);
      pose(road, { x: 800, y: 200 - (1 - kk) * 0, sx: 0.2 + rk * 0.8, o: rk * kk });
      demands.forEach((d) => {
        const k = es(t, 1.45 + d.i * 0.06, 1.62 + d.i * 0.06, ease.back) * (1 - es(t, 1.95, 2.1));
        const y0 = d.m.y ?? FRONT - 6, s0 = d.m.s ?? 0.8;
        const [x, y] = headAt(d.m.x, y0, s0, d.m.x > JX, DY.sit);
        pose(d.el, { x: x + (d.m.x > JX ? -16 : 16), y: y - 22, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });
      /* v24: no prophet is accepted at home */
      const prk = es(t, 2.08, 2.35, ease.back);
      hangAt(propEl, 800, lerp(-500, 240, prk), time, 1.2, 0.8, 3);
      tint.fade(es(t, 2.2, 2.6) * 0.16);

      /* the congregation: listen → hold out their hands → fold their arms */
      const ask = es(t, 1.4, 1.6) * (1 - es(t, 2.0, 2.2));
      const cold = es(t, 2.15, 2.4);
      back.forEach((m, i) => {
        const away = cold > 0.5 && i % 3 !== 1;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX ? !away : away, armF: 30 + ask * 50 * (i % 2 ? 1 : 0.6) - cold * 2, armB: ask * (i % 2 ? 60 : 20) + cold * 34, head: -ask * 6 - cold * 10, blink: blinkAt(time, m.seed) });
      });
      front.forEach((m, i) => {
        const away = cold > 0.5 && i % 3 === 0;
        m.p.set({ x: m.x, y: FRONT - 6, s: 0.8, flip: away ? m.left : !m.left, armF: 24 + ask * 60 + cold * 4, armB: ask * 30 + cold * 34, head: -ask * 6 - cold * 10, blink: blinkAt(time, m.seed) });
      });

      S.cam.z = 1.04 + es(t, 2.0, 2.4) * 0.03;
      S.cam.y = 10;
      S.cam.x = 0;
    };
  },
};
