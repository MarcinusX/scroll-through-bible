// Łk 6,17–19 — the level place at the foot of the mountain. Jesus comes down the road from the mountain on the left
// with the apostles and stops in the middle of the plain. Then the people come, from both sides at once — a great crowd
// of His disciples, and hung tags show from where: Judea, Jerusalem on its hill, the sea coast of Tyre and Sidon with
// a ship. They have come to hear Him and to be healed: a lame man, a blind woman, a man tormented by a spirit are
// brought to the front — the crutch falls, the eyes open, the dark shards tear out of the tormented man and blow
// away. And the whole crowd reaches out to touch Him: rings of power go out from Him over the plain, and light after
// light kindles over the people, row after row — He healed them all.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { jerusalem } from '../mark11/lib.js';
import { plainSet, PL, LK12, kf, moving, headAt, handAt, crutch, POSSESSED, shadowShards, sparkle, nameTag, halo, strip, tr, PI } from './lib.js';

const SICK = [
  { x: 640, y: 770, flip: false, kind: 'lame', o: { robe: C.tealRobe, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.rope } },
  { x: 960, y: 772, flip: true, kind: 'blind', o: { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair, skin: C.skin3, beard: 'none' } },
  { x: 1050, y: 760, flip: true, kind: 'spirit', o: { ...POSSESSED } },
];
const APOS = ['peter', 'andrew', 'james', 'john', 'thomas', 'matthew'];

function placeTag(c, text, icon) {
  return `<g transform="translate(0 ${text.length > 14 ? 88 : 72})">${icon}</g>${nameTag(c, text, { size: 17 })}`;
}

export default {
  id: 'lk6-plain',
  beats: [
    { v: 17, text: 'Zeszedł z nimi na dół i zatrzymał się na równinie.' },
    { v: 17, cont: true, text: 'Był tam duży poczet Jego uczniów i wielkie mnóstwo ludu z całej Judei i Jerozolimy oraz z wybrzeża Tyru i Sydonu;' },
    { v: 18 },
    { v: 19 },
  ],
  cam: { x: [-240, 30], y: [-20, 50], z: [1, 1.12] },
  build(S) {
    const P = plainSet(S, { twins: true, dis: false, jesus: false });
    const c = S.c;

    /* where they come from */
    const tagL = S.layer({ par: 0.2, sh: 5 });
    const ship = sheet().p(c.cut([[-26, 0], [26, 0], [18, 12], [-18, 12]], 0.4, 4), C.wood).p(c.cut([[0, -2], [0, -36], [18, -6]], 0.3, 3), C.sail).p(c.ribbon([[-40, 16], [-20, 13], [0, 16], [20, 13], [40, 16]], 3), C.lake2).out();
    const judea = sheet().p(c.cut([[-40, 8], [-22, -10], [-8, -4], [8, -20], [26, -6], [40, 8]], 0.6, 5), mix(C.hillMid, C.sand, 0.3)).p(c.cut(c.ell(20, -12, 7, 12, 10), 0.3, 3), C.olive).out();
    const TAGS = [
      { x: 560, y: 290, m: placeTag(c, tr('Judea', 'Judea'), judea) },
      { x: 740, y: 230, m: placeTag(c, tr('Jerozolima', 'Jerusalem'), `<g transform="translate(0 10) scale(.11)">${jerusalem(c, 1, { tglow: false })}</g>`) },
      { x: 1040, y: 270, m: placeTag(c, tr('Tyr i Sydon', 'Tyre and Sidon'), ship) },
    ].map((g, i) => ({ ...g, i, el: hanging(tagL, g.m, { x: g.x, y: -400, len: 900 }) }));

    /* Jesus and the apostles */
    const act = P.act;
    const aura = act.add(`<g opacity="0">${halo(200, 1)}</g>`);
    const AP = APOS.map((k, i) => ({ k, i, seed: c.rr(0, 9), x1: [560, 640, 1000, 1080, 480, 1160][i], p: S.puppet(act.add(person(c, { ...CAST[k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    /* the sick, at the front */
    const sick = SICK.map((m, i) => {
      const a = m.kind === 'lame' ? { pose: 'sit', holdF: `<g transform="translate(0 -4) scale(.8)">${crutch(c)}</g>` } : m.kind === 'blind' ? { pose: 'kneel', eyes: 'closed' } : {};
      return { ...m, i, seed: c.rr(0, 9), a: S.puppet(act.add(person(c, { ...m.o, ...a }))), b: S.puppet(act.add(person(c, m.o))) };
    });
    const fallen = act.add(`<g>${crutch(c)}</g>`);
    const shards = shadowShards(c, { n: 7, r: 52 }).map((sh) => ({ ...sh, el: act.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.2) }));
    const heals = SICK.map(() => act.add(`<g opacity="0">${sparkle(c, 14)}</g>`));
    /* power going out from Him */
    const fx = P.fx;
    const rings = [0, 1, 2].map(() => fx.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 100, 60, 0, PI * 2, 48), 6)}" fill="${C.halo}"/></g>`));
    const pops = P.crowd.map(() => fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    const walkK = [[-0.5, 150], [0.62, PL.JX]];

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v17a — down from the mountain; He stands on the level place */
      const jx = kf(t, walkK, (u) => u);
      const reach = es(t, 3.05, 3.25);
      const power = es(t, 3.15, 3.4);
      jesus.set({ x: jx, y: PL.JY, s: PL.JS, flip: false, walk: moving(t, walkK) ? jx * 0.05 : undefined, armF: 14 + bump(t, 2.3, 2.9) * 50 + power * 40, armB: 10 + power * 110, head: -2 - power * 4, blink: blinkAt(T) });
      pose(aura, { x: PL.JX, y: PL.JY - 120, s: 0.8 + power * 0.5, o: bump(t, 2.3, 2.95) * 0.7 + power * 0.9 });
      AP.forEach((a) => {
        const keys = [[-0.4 + a.i * 0.05, 60 - a.i * 70], [0.7 + a.i * 0.05, a.x1]];
        const x = kf(t, keys, (u) => u);
        a.p.set({ x, y: PL.JY - 14 + (a.i % 2) * 6, s: 0.92, flip: moving(t, keys) ? false : a.x1 > PL.JX, walk: moving(t, keys) ? x * 0.05 + a.i : undefined, armF: 10 + reach * 20, armB: 6 + reach * (a.i % 2 ? 60 : 10), head: -2, blink: blinkAt(T, a.seed) });
      });

      /* v17b — the crowds come, from Judea, Jerusalem and the coast */
      P.crowd.forEach((g) => {
        const d = 0.05 * g.row + (g.side < 0 ? (1 - Math.abs(g.x - 800) / 700) : Math.abs(g.x - 800) / 700) * 0.2;
        const k = es(t, 1.0 + d, 1.6 + d);
        const press = es(t, 3.05, 3.3) * 30 * -g.side;
        const x = g.x + (1 - k) * g.side * 900 + press;
        const bob = k > 0 && k < 1 ? Math.abs(Math.sin(k * 24 + g.i)) * 3 : 0;
        const oo = seg(t, 0.98 + d, 1.05 + d);
        g.sp.set({ x, y: g.y - bob, s: 1, o: oo * (1 - reach) });
        g.alt.set({ x, y: g.y, s: 1, o: oo * reach });
      });
      TAGS.forEach((g) => {
        const k = es(t, 1.1 + g.i * 0.12, 1.4 + g.i * 0.12, ease.back) * (1 - es(t, 2.0, 2.25));
        pose(g.el, { x: g.x, y: lerp(-400, g.y, k), r: Math.sin(T * 0.9 + g.i) * 1.5, oy: 0, o: k > 0.01 ? 1 : 0 });
      });

      /* v18 — the sick are brought; the unclean spirits go out */
      sick.forEach((m) => {
        const bring = es(t, 1.7 + m.i * 0.08, 2.15 + m.i * 0.06);
        const mx = m.x + (1 - bring) * (m.flip ? 500 : -500);
        const healed = es(t, 2.38 + m.i * 0.12, 2.44 + m.i * 0.12);
        const joy = es(t, 2.44 + m.i * 0.12, 2.64 + m.i * 0.12);
        const writhe = m.kind === 'spirit' ? bump(t, 2.0, 2.6) : 0;
        m.a.set({ x: mx + (time ? Math.sin(T * 14) * 2 * writhe : 0), y: m.kind === 'lame' ? m.y - 6 : m.y, s: 0.95, flip: m.flip, o: seg(t, 1.68 + m.i * 0.08, 1.75 + m.i * 0.08) * (1 - healed), walk: bring > 0 && bring < 1 && m.kind !== 'lame' ? mx * 0.05 : undefined, armF: m.kind === 'blind' ? 64 : 40 + writhe * 60, armB: writhe * 120, head: m.kind === 'blind' ? -6 : m.kind === 'spirit' ? 12 - writhe * 20 : 4, blink: m.kind === 'blind' ? 0 : blinkAt(T, m.seed) });
        m.b.set({ x: mx, y: m.y, s: 0.95, flip: m.flip, o: healed, armF: 50 + joy * 50, armB: 30 + joy * 110, head: -joy * 10, blink: blinkAt(T, m.seed) });
        const [hx, hy] = headAt(mx, m.y, 0.95, m.flip);
        const sp = bump(t, 2.4 + m.i * 0.12, 2.9 + m.i * 0.12);
        pose(heals[m.i], { x: hx, y: hy - 50, s: sp, r: T * 40, o: sp });
      });
      const lame = sick[0];
      const cf = es(t, 2.38, 2.6, ease.in);
      const [cx0, cy0] = handAt(lame.x, lame.y - 6, 0.95, false, 40, 'sit');
      pose(fallen, { x: cx0 + cf * 40, y: lerp(cy0 - 4, lame.y - 8, cf), r: cf * 84, s: 0.8, o: es(t, 2.38, 2.39) * (1 - es(t, 3.0, 3.2)) });
      const sp = sick[2];
      const out = es(t, 2.05, 2.35), gone = es(t, 2.62, 2.95);
      shards.forEach((sh) => {
        const ex = Math.cos(sh.a) * (out * 50 + gone * 160) * sh.drift, ey = Math.sin(sh.a) * out * 36 - out * 120 - gone * 380;
        pose(sh.el, { x: sp.x + ex, y: sp.y - 110 + ey, s: 0.6 + out * 0.4, r: gone * 160 * (sh.i % 2 ? 1 : -1), o: out * 0.9 * (1 - gone) });
      });

      /* v19 — they all try to touch Him; power goes out and heals them all */
      rings.forEach((r, i) => {
        const k = time ? ((T * 0.35 + i / 3) % 1) : (i + 1) / 3.5;
        pose(r, { x: PL.JX, y: PL.JY - 100, s: 0.6 + k * 5, o: power * (1 - k) * 0.8 });
      });
      P.crowd.forEach((g, i) => {
        const at = 3.3 + (Math.abs(g.x - 800) / 700) * 0.4 + g.row * 0.04;
        const k = bump(t, at, at + 0.45);
        pose(pops[i], { x: g.x + es(t, 3.05, 3.3) * 30 * -g.side, y: g.y - 150 * [0.5, 0.58, 0.66][g.row], s: k * 0.9, r: T * 30, o: k });
      });

      S.cam.x = kf(t, [[-0.5, -240], [0.62, 0], [1.0, 0], [1.6, 0], [2.0, 0], [2.3, 10]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.62, 1.02], [1.0, 1.0], [1.8, 1.0], [2.2, 1.08], [2.95, 1.08], [3.2, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.0, 0], [1.8, 0], [2.2, 40], [2.95, 40], [3.2, 10]]);
    };
  },
};
