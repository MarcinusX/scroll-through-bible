// J 18,1–2 — the curtains open on the same night as John 16: the moon over the Mount of Olives, the city up on its
// ridge, and Jesus walking down with the Eleven and their little lanterns. "He went out with His disciples over the
// brook Kidron": the moonlit brook winds across the floor and they step over it on the stones, one after another.
// "There was a garden, into which He and His disciples entered": the low wall of the olive garden, its gate swings
// open and they go in under the trees. "Judas, who betrayed Him, also knew the place, for Jesus often met there with
// His disciples": a memory hangs down — one evening under an olive tree, and another, and another (three moons) —
// and on a thread beside it Judas' dark medallion: he knows the way here.
import { curtains } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, eleven, lamp, nameTag, hanging, swing, vis, kf, moving, medallion, withFace, faceBits, person, sheet, shade, mix, pose, lerp, tr, blinkAt,
  C, JESUS, TW, PI, nt, SEPIA,
} from './lib.js';
import { olive, moon } from '../../assets/nature.js';

const BX = 760, GX = 900;
// the walking line, relative to Jesus (dx, dy)
const LINE = [
  { k: 'simonZ', dx: -350, y: -22, s: 0.84 }, { k: 'thaddaeus', dx: -300, y: 6 }, { k: 'jamesA', dx: -236, y: -24, s: 0.84 }, { k: 'bartholomew', dx: -180, y: 4 }, { k: 'philip', dx: -112, y: -20, s: 0.84 },
  { k: 'john', dx: 78, y: 6 }, { k: 'peter', dx: 140, y: -22, s: 0.86 }, { k: 'james', dx: 196, y: 8 }, { k: 'andrew', dx: 258, y: -24, s: 0.84 }, { k: 'thomas', dx: 312, y: 4 }, { k: 'matthew', dx: 372, y: -20, s: 0.84 },
];
// where they settle in the garden (around Jesus at 1020)
const REST = {
  simonZ: [876, -24], thaddaeus: [912, 6], jamesA: [946, -26], bartholomew: [972, 10], philip: [998, -30],
  john: [1100, 8], peter: [1140, -24], james: [1180, 10], andrew: [1222, -26], thomas: [1262, 6], matthew: [1300, -22],
};
const JR = 1040;

export default {
  id: 'j18-kidron',
  beats: [
    { cover: true },
    { v: 1, text: 'To powiedziawszy Jezus wyszedł z uczniami swymi za potok Cedron.' },
    { v: 1, cont: true, text: 'Był tam ogród, do którego wszedł On i Jego uczniowie.' },
    { v: 2 },
  ],
  cam: { x: [-460, 460], y: [-60, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { brook: true, brookX: BX, gate: true, gateX: GX, moonAt: [1240, 140] });
    const GY = N.GY;
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: LINE.map((d) => ({ ...d, x: 0 })) });
    D.forEach((m) => { m.dx = LINE.find((l) => l.k === m.k).dx; m.rest = REST[m.k]; });

    // the memory: evenings in the garden (sepia oval) + three moons for "often"; Judas' medallion on a thread
    const fx = S.layer({ par: 0.3, sh: 5 });
    const clip = S.id('mem');
    const small = (o, x, y, s, flip, pose = 'sit') => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${person(c, { ...o, pose, halo: o === JESUS })}</g>`;
    const memInner = `<rect x="-170" y="-110" width="340" height="220" fill="${mix(SEPIA.wall, C.duskViolet, 0.25)}"/>`
      + `<path d="${c.cut([[-180, 110], [-180, 40], [-40, 30], [180, 44], [180, 110]], 1, 10)}" fill="${mix(C.sage, SEPIA.wall2, 0.5)}"/>`
      + `<g transform="translate(40 40) scale(.9)">${olive(c, 0, 0, 1, { trunk: SEPIA.ink, leaf: mix(C.olive, SEPIA.wall2, 0.4), leaf2: mix(C.sage, SEPIA.wall2, 0.4) })}</g>`
      + small(JESUS, -10, 92, 0.34, false) + small(TW.peter, 50, 94, 0.3, true) + small(TW.john, 88, 96, 0.3, true) + small(TW.andrew, -60, 96, 0.3, false) + small(TW.judas, 124, 98, 0.3, true) + small(TW.thomas, -100, 98, 0.3, false);
    const memory = hanging(fx, `${sheet().p(c.cut(c.ell(0, 0, 184, 124, 44), 0.6, 6), C.wood3).out()}<defs><clipPath id="${clip}"><ellipse cx="0" cy="0" rx="170" ry="110"/></clipPath></defs><g clip-path="url(#${clip})">${memInner}</g>`, { x: 0, y: 0, len: 800 });
    const moons = [0.3, 0.6, 1].map((ph, i) => {
      const r = 15;
      const shadow = ph < 1 ? `<path d="${c.cut(c.circ(r * (ph < 0.5 ? 0.5 : 1.25), 0, r * 0.95, 16), 0.1, 3)}" fill="${mix(SEPIA.wall, C.duskViolet, 0.25)}"/>` : '';
      return { i, el: fx.add(`<g><circle r="30" fill="url(#halo-glow)" opacity=".6"/>${moon(c, r)}${shadow}</g>`) };
    });
    const judasMed = hanging(fx, `${medallion(c, TW.judas, { r: 30, rim: mix(C.storm, C.wood2, 0.4), back: mix(C.stone2, C.storm, 0.3) })}<path d="${c.cut([...c.arc(0, 0, 30, 30, -PI * 0.5, PI * 0.5, 14), ...c.arc(-8, 0, 24, 30, PI * 0.5, -PI * 0.5, 14)], 0.2, 3)}" fill="${C.night2}" opacity=".55"/><g transform="translate(0 40)">${nameTag(c, tr('Judasz', 'Judas'), { size: 15, dark: true })}</g>`, { x: 0, y: 0, len: 800 });

    const tagL = S.layer({ par: 0.3, sh: 4 });
    const tag = hanging(tagL, nameTag(c, tr('potok Cedron', 'the brook Kidron'), { size: 18 }), { x: 0, y: 0, len: 600 });
    const tag2 = hanging(tagL, nameTag(c, tr('ogród', 'a garden'), { size: 18 }), { x: 0, y: 0, len: 600 });
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      N.update(T);
      // travel: Jesus stays in the middle of the screen while they walk
      const camX = kf(t, [[0, -440], [0.7, -440], [1.75, -80], [2.7, 440], [3, 460]], ease.sine);
      const JXw = 800 + camX * 0.5;
      const walking = t > 0.7 && t < 2.72;
      const settle = es(t, 2.72, 3.25);
      N.gateLeaf && pose(N.gateLeaf, { x: GX + 56, y: GY - 14, sx: 1 - es(t, 1.9, 2.2) * 0.8 });

      const hop = (x) => bump(x, BX - 150, BX + 10) * 18;           // stepping over the brook
      D.forEach((m) => {
        const x0 = JXw + m.dx;
        const x = lerp(x0, m.rest[0], settle);
        const y = lerp(m.y - hop(x0) * (1 - settle), GY + m.rest[1], settle);
        const face = x > JR && settle > 0.5;
        m.p.set({ x, y, s: m.s, flip: face, walk: walking || (settle > 0 && settle < 1) ? x * 0.06 + m.i : undefined, amt: 0.8, armF: m.arm, armB: 8, head: settle * (face ? 4 : 2), blink: blinkAt(T, m.seed) });
        lamp(m, 0.9, 0, T);
      });
      const jx = lerp(JXw, JR, settle);
      J.p.set({ x: jx, y: GY + 4 - hop(JXw) * (1 - settle), s: 1.02, flip: false, walk: walking ? jx * 0.06 : undefined, amt: 0.8, armF: 20 + es(t, 3.05, 3.3) * 18, armB: 10, head: -es(t, 3.0, 3.4) * 4, blink: blinkAt(T) });

      // tags: the brook, the garden
      const tg = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.85, 2.0, ease.in));
      vis(tag, { x: BX - 20, y: 260 - (1 - tg) * 620, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: tg > 0.01 ? 1 : 0 });
      const tg2 = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.85, 3.0, ease.in));
      vis(tag2, { x: GX + 170, y: 250 - (1 - tg2) * 620, r: T ? Math.sin(T * 0.8 + 1) * 1.2 : 0, o: tg2 > 0.01 ? 1 : 0 });

      /* v2 — the memory of many evenings; Judas knew the place */
      const mk = es(t, 3.05, 3.4, ease.out);
      // fx layer is par 0.3: centre of screen there is 800 + camX * 0.3
      const cx = 800 + camX * 0.3;
      vis(memory, { x: cx + (S.portrait ? -30 : 10), y: 250 - (1 - mk) * 720, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: mk > 0.01 ? 1 : 0 });
      moons.forEach((m) => {
        const k = es(t, 3.3 + m.i * 0.12, 3.45 + m.i * 0.12, ease.back);
        vis(m.el, { x: cx - (S.portrait ? 130 : 90) + m.i * 100, y: 178 - (1 - mk) * 720, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const jk = es(t, 3.5, 3.75, ease.out);
      vis(judasMed, { x: cx + (S.portrait ? 225 : 250), y: 300 - (1 - jk) * 720, r: T ? Math.sin(T * 0.9 + 2) * 2 : 0, o: jk > 0.01 ? 1 : 0 });

      S.cam.x = camX;
      S.cam.y = kf(t, [[0, 10], [1, 30], [2, 30], [3, 0], [4, -40]]);
      S.cam.z = kf(t, [[0, 1], [1, 1.06], [2.6, 1.06], [3, 1.04], [4, 1.06]]);
    };
  },
};
