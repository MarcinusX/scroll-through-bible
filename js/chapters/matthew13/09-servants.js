// Mt 13,27–29 — the same farm, the field grown thick with wheat and darnel together. The servants come along the
// path to the householder: one holds up an ear of wheat — didn't you sow good seed? — another a dark darnel stalk —
// then where did this come from? "An enemy has done this": a small night plate comes down with the hooded sower in
// it. The servants lift their hoes: shall we go and pull it up? "No" — a darnel lifted out of the field drags a wheat plant up with it, their roots knotted together.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { farmSet, growRow, FARM, MASTER, SERVANTS, ENEMY, darnelStalk, discPlate, storyFrame, speech, GLYPH, headAt, kf, moving, hangAt, PI } from './lib.js';
import { moon as moonCut, stars as starsCut } from '../../assets/nature.js';

const MX = 600;
const SV = [870, 965, 1060];

function hoe(c) {
  return sheet().p(c.ribbon([[0, 30], [0, -90]], 4.4), C.wood2).p(c.cut([[-2, -92], [22, -96], [24, -84], [-2, -82]], 0.3, 3), C.stone2).out();
}

export default {
  id: 'mt13-servants',
  parable: true,
  beats: [
    { v: 27, text: 'Słudzy gospodarza przyszli i zapytali go: "Panie, czy nie posiałeś dobrego nasienia na swej roli?' },
    { v: 27, cont: true, text: 'Skąd więc wziął się na niej chwast?"' },
    { v: 28, text: 'Odpowiedział im: "Nieprzyjazny człowiek to sprawił".' },
    { v: 28, cont: true, text: 'Rzekli mu słudzy: "Chcesz więc, żebyśmy poszli i zebrali go?"' },
    { v: 29 },
  ],
  cam: { x: [-40, 40], y: [0, 110], z: [1, 1.24] },
  build(S) {
    const F = farmSet(S, { skyCols: ['#d0e2dc', '#f0e8cf', '#f8ebd2'] });
    const c = F.c;
    const wheat = F.rows('wheat');
    const darnel = F.rows('darnel');
    wheat.forEach((r) => growRow(r, 1));
    darnel.forEach((r) => growRow(r, 1));

    // the pair lifted together: a darnel with a wheat plant hanging from its roots
    let tangle = '';
    for (let i = 0; i < 7; i++) tangle += c.ribbon(c.cbez([c.rr(-6, 6), 0], [c.rr(-24, 24), 16], [c.rr(-20, 20), 30], [c.rr(-26, 26), 44], 8), 1.8);
    const pair = F.ppl.add(`<g><g transform="translate(-12 0)">${darnelStalk(c, { h: 120 })}</g><g transform="translate(12 0)">${wheatStalk(c, { h: 116 })}</g><path d="${tangle}" fill="${C.wood3}"/><path d="${c.cut(c.blob(0, 14, 26, 14, 10, 0.3), 0.8, 4)}" fill="${C.soil}"/></g>`);

    /* people */
    const master = S.puppet(F.ppl.add(person(c, MASTER)));
    const ear = `<g transform="translate(0 4) rotate(180) scale(.95)">${wheatStalk(c, { h: 96 }).replace('class="stalk"', '')}</g>`;
    const dstalk = `<g transform="translate(0 4) rotate(180) scale(.95)">${darnelStalk(c, { h: 92 })}</g>`;
    const SERV = SERVANTS.map((o, i) => ({
      i, x: SV[i], from: 1500 + i * 90, seed: c.rr(0, 6),
      p: S.puppet(F.ppl.add(person(c, { ...o, holdF: i === 0 ? ear : i === 1 ? dstalk : '' }))),
      h: S.puppet(F.ppl.add(person(c, { ...o, holdF: `<g transform="translate(0 2) rotate(170)">${hoe(c)}</g>` }))),
    }));

    /* bubbles and the night plate */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const bubEar = fx.add(`<g>${speech(c, `<g transform="translate(-10 12) scale(.4)">${wheatStalk(c, { h: 60 }).replace('class="stalk"', '')}</g><g transform="translate(14 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 70, h: 56, flip: true })}</g>`);
    const bubDar = fx.add(`<g>${speech(c, `<g transform="translate(-10 12) scale(.42)">${darnelStalk(c, { h: 56 })}</g><g transform="translate(14 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 70, h: 56, flip: true })}</g>`);
    const bubHoe = fx.add(`<g>${speech(c, `<g transform="translate(-8 8) scale(.34) rotate(20)">${hoe(c)}</g><g transform="translate(14 0) scale(.8)">${GLYPH.q(c)}</g>`, { w: 70, h: 56, flip: true })}</g>`);
    const id = S.id('np');
    const nightScene = `<clipPath id="${id}"><circle r="62"/></clipPath><g clip-path="url(#${id})"><rect x="-70" y="-70" width="140" height="140" fill="${C.night}"/>${starsCut(c, { x0: -60, x1: 60, y0: -60, y1: 0, n: 10 })}<g transform="translate(34 -34) scale(.4)">${moonCut(c, 30)}</g><rect x="-70" y="22" width="140" height="60" fill="${mix(C.soil, C.night, 0.5)}"/><g transform="translate(-6 34) scale(.36)">${person(c, { ...ENEMY }).replace('class="armFr"', 'class="armFr" transform="rotate(-80)"')}</g></g>`;
    const plate = hanging(fx, `<g transform="scale(1.35)">${discPlate(c, nightScene, { r: 68, rim: C.ochre, face: C.night })}</g>`, { x: 0, y: 0, len: 900 });
    storyFrame(S);

    return (t, time) => {
      F.update(time);
      const T = time;
      /* the servants arrive and ask */
      SERV.forEach((sv) => {
        const keys = [[0.0 + sv.i * 0.06, sv.from], [0.45 + sv.i * 0.06, sv.x]];
        const x = kf(t, keys);
        const hoeOn = es(t, 3.05, 3.15);
        const show = sv.i === 0 ? bump(t, 0.35, 1.0) * 1 : sv.i === 1 ? bump(t, 1.0, 1.95) : 0;
        const eager = es(t, 3.15, 3.4) * (1 - es(t, 4.1, 4.35));
        const st = {
          x, y: FARM.PATH, s: 1.0, flip: true, walk: moving(t, keys) ? x * 0.05 : undefined,
          armF: 10 + show * 120 + eager * 100, armB: 8 + eager * 20, head: -show * 4 - eager * 4 + es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1)) * -10, lean: -eager * 6, blink: blinkAt(T, sv.seed),
        };
        sv.p.set({ ...st, o: 1 - hoeOn });
        sv.h.set({ ...st, o: hoeOn });
      });
      const bE = es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.95, 1.08));
      const [h0x, h0y] = headAt(SV[0], FARM.PATH, 1, true);
      pose(bubEar, { x: h0x - 18, y: h0y - 26, s: bE, o: bE > 0.02 ? 1 : 0 });
      const bD = es(t, 1.08, 1.24, ease.back) * (1 - es(t, 1.9, 2.02));
      const [h1x, h1y] = headAt(SV[1], FARM.PATH, 1, true);
      pose(bubDar, { x: h1x - 18, y: h1y - 26, s: bD, o: bD > 0.02 ? 1 : 0 });
      const bH = es(t, 3.2, 3.36, ease.back) * (1 - es(t, 3.9, 4.02));
      const [h2x, h2y] = headAt(SV[2], FARM.PATH, 1, true);
      pose(bubHoe, { x: h2x - 18, y: h2y - 26, s: bH, o: bH > 0.02 ? 1 : 0 });

      /* the householder: "an enemy has done this"; "no" */
      const point = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const no = es(t, 4.05, 4.2);
      master.set({ x: MX, y: FARM.PATH, s: 1.02, flip: false, armF: 12 + point * 120 + no * 70, armB: 8 + no * 150, head: -point * 10 + Math.sin(T * 0.7) * 1.5, blink: blinkAt(T) });
      const pl = es(t, 2.05, 2.4, ease.back) * (1 - es(t, 2.95, 3.2));
      hangAt(plate, 790, lerp(-400, 330, pl), T, 1.4, 0.7);

      /* v29: roots knotted together; a darnel pulled up drags the wheat with it */
      const lift = es(t, 4.2, 4.5) * (1 - es(t, 4.85, 5));
      pose(pair, { x: 1010, y: FARM.WHEAT[1] - lift * 170, s: 1.35, r: lift * -8, o: lift > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [0.5, 20], [2.0, 10], [2.3, 0], [3.0, 0], [3.3, 20], [4.0, 20], [4.3, 10]]);
      S.cam.z = kf(t, [[0, 1.1], [0.5, 1.16], [2.0, 1.16], [2.3, 1.06], [3.0, 1.06], [3.3, 1.14], [4.0, 1.14], [4.3, 1.1]]);
      S.cam.y = kf(t, [[0, 70], [0.5, 90], [2.0, 90], [2.3, 50], [3.0, 50], [3.3, 90], [4.0, 90], [4.3, 104]]);
    };
  },
};
