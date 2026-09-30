// J 7,1–2 — the curtains open on Galilee in autumn. Jesus walks the road between the villages with His
// disciples. At a signpost pointing south to Judea a dark cloud hangs, and on a shadow plate the leaders'
// silhouettes point and threaten: He does not go that way, and turns back along the Galilean road.
// The Feast of Tabernacles draws near: a string of moons waxes to the full moon of the feast, villagers carry
// palm branches and raise a booth of poles and leaves by the road.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, curtains } from '../kit.js';
import { stormCloud } from '../../assets/things.js';
import { walledCity } from '../mark1/lib.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  galileeSet, DISC, townMan, townWoman, pharisee, shadowPerson, signpost, sukkah, frond, nameTag, strip, lulavUp, etrog,
  hangAt, vpose, roundel, tr, PI,
} from './lib.js';

const RY = 742;           // the road
const JX = 800;

export default {
  id: 'j7-galilee',
  beats: [
    { cover: true },
    { v: 1, text: 'Potem Jezus obchodził Galileę.' },
    { v: 1, cont: true, text: 'Nie chciał bowiem chodzić po Judei, bo Żydzi mieli zamiar Go zabić.' },
    { v: 2 },
  ],
  cam: { x: [-80, 80], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    // phone: the signpost, the cloud and the shadow plate come inward so the screen edge doesn't slice them
    const SGX = S.portrait ? 1040 : 1110, PLX = S.portrait ? 990 : 1110, CLX = S.portrait ? 950 : 1030;
    const G = galileeSet(S, { skyCols: ['#d3e2d9', '#f0e6c8', '#f7e4c2'], sunAt: [1210, 160], fg: false });

    /* the booth by the road (left): poles, then the roof of branches */
    const boothL = S.layer({ par: 0.48, sh: 4 });
    const BX = 470, BY = RY - 26;
    const boothFrame = boothL.add(`<g>${sheet().p(c.cut(c.rect(-93, -150, 7, 152), 0.2, 6) + c.cut(c.rect(86, -150, 7, 152), 0.2, 6), C.wood2).p(c.cut(c.rect(-100, -154, 200, 7), 0.3, 8), C.wood).out()}</g>`);
    const boothFull = boothL.add(`<g>${sukkah(c, { w: 180, h: 150, cloth: C.cream, stripe: C.terracotta })}</g>`);

    /* the signpost to Judea (right) and the dark cloud over it */
    const signL = S.layer({ par: 0.46, sh: 4 });
    signL.add(`<g transform="translate(${SGX} ${RY - 20})">${signpost(c, tr('Judea', 'Judea'), { size: 22, dir: 1 })}</g>`);
    const cloudEl = hanging(signL, `<g opacity=".92">${stormCloud(c, 280)}</g>`, { x: CLX, y: 200, len: 700 });

    /* people (in front of the booth and the signpost) */
    const A = S.layer({ par: 0.5, sh: 5 });
    const walkers = [CAST.jesus, DISC[0], DISC[2], DISC[1]].map((o, i) => ({ i, p: S.puppet(A.add(person(c, o))), seed: c.rr(0, 9) }));
    const villagers = [0, 1].map((i) => ({ i, p: S.puppet(A.add(person(c, { ...(i ? townWoman(c) : townMan(c)), holdF: `<g transform="rotate(${150})">${frond(c, 130)}</g>` }))), seed: c.rr(0, 9) }));

    /* the shadow plate: Judea, the leaders who want to kill Him */
    const X = S.layer({ par: 0.5, sh: 6 });
    const dark = mix(C.night, C.storm2, 0.4);
    const plateIn = `<rect x="-120" y="-120" width="240" height="240" fill="${mix(C.dusk, C.storm, 0.55)}"/><g transform="translate(0 64)">${walledCity(c, 0, 0, 0.9, { wall: dark, wall2: dark, temple: dark })}</g>` +
      [[-66, 0.5, false], [66, 0.5, true], [0, 0.56, false]].map(([x, s, f], i) => `<g transform="translate(${x} 110) scale(${s}) scale(${f ? -1 : 1} 1)">${shadowPerson(c, { ...pharisee(c, i), pose: 'stand' }, '#1f1a2c').replace('class="armFr"', 'class="armFr" transform="rotate(-100)"')}</g>`).join('');
    const plate = hanging(X, roundel(c, plateIn, { r: 104, face: C.storm, rim: mix(C.storm2, C.wood2, 0.4), id: S.id('judea-clip') }), { x: PLX, y: 300, len: 600 });
    const plateTag = X.add(`<g>${strip(c, tr('szukali, by Go zabić', 'they sought to kill Him'), { size: 16, fill: C.cream })}</g>`);
    const galTag = hanging(X, nameTag(c, tr('Galilea', 'Galilee'), { size: 20 }), { x: 560, y: 250, len: 600 });

    /* the feast drawing near: moons waxing on a string, the feast tag */
    const moonL = S.layer({ par: 0.2, sh: 3 });
    const MN = 5;
    const moons = Array.from({ length: MN }, (_, i) => {
      const f = (i + 1) / MN;             // lit fraction
      const r = 17;
      const lit = f >= 1 ? c.cut(c.circ(0, 0, r, 20), 0.2, 3) : c.cut([...c.arc(0, 0, r, r, -PI / 2, PI / 2, 10), ...c.arc(0, 0, r * Math.abs(1 - 2 * f), r, PI / 2, -PI / 2, 10).map(([x, y]) => [f < 0.5 ? x : -x + 0, y])], 0.2, 3);
      const el = moonL.add(`<g><path d="M0 -1400V-20" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/><path d="${c.cut(c.circ(0, 0, 19, 20), 0.2, 3)}" fill="${mix(C.skyBlue2, C.storm, 0.35)}"/><g class="lit"><path d="${lit}" fill="${C.moon}"/></g>${f >= 1 ? `<circle r="46" fill="url(#halo-glow)" class="lit"/>` : ''}</g>`);
      return { el, lit: el.querySelectorAll('.lit'), i, x: 610 + i * 70, y: 170 + Math.sin(i * 0.9) * 10 };
    });
    const feastIcon = `<g transform="translate(-44 30) scale(.34)">${sukkah(c, { w: 180, h: 150 })}</g><g transform="translate(36 30) scale(.5)">${lulavUp(c, 120)}</g><g transform="translate(58 22)">${etrog(c, 9)}</g>`;
    const feastTag = hanging(X, `${sheet().p(c.cut([[-110, 0], [110, 0], [120, 12], [120, 120], [-120, 120], [-120, 12]], 0.5, 6), C.cream).p(c.cut(c.rect(-110, 16, 220, 96), 0.3, 6), C.parchment).x(c.poly(c.circ(0, 7, 3.2, 8)), C.wood2).out()}<g transform="translate(0 44)">${feastIcon}</g><text x="0" y="104" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.ink}">${tr('Święto Namiotów', 'the Feast of Booths')}</text>`, { x: 800, y: 250, len: 600 });

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      G.update(t, T);

      /* v1a — walking through Galilee */
      const w1 = es(t, 0.7, 1.85, ease.sine);
      /* v1b — He stops at the signpost, looks, and turns back */
      const look = es(t, 2.05, 2.25) * (1 - es(t, 2.72, 2.85));
      const back = es(t, 2.72, 2.85);
      const w2 = es(t, 2.85, 3.6, ease.sine);
      walkers.forEach((m) => {
        const lag = [0, 96, 180, 262][m.i];
        let x = lerp(-60, JX, w1) - lag * (0.6 + 0.4 * w1);
        // turning back: Jesus leads the group left along the Galilean road, the disciples follow on His right
        const x2 = 700 + [0, 92, 172, 250][m.i];
        x = lerp(x, x2, w2);
        const moving = (w1 > 0 && w1 < 1) || (w2 > 0 && w2 < 1);
        const flip = back > 0.5;
        m.p.set({
          x, y: RY + (m.i % 2) * 6, s: m.i ? 0.94 : 1, flip, walk: moving ? x * 0.055 + m.i : undefined,
          armF: m.i === 0 ? bump(t, 2.1, 2.7) * 50 + bump(t, 3.5, 3.95) * 40 : 0, head: m.i === 0 ? -look * 6 : bump(t, 2.1, 2.7) * -4, blink: blinkAt(T, m.seed),
        });
      });
      const gk = es(t, 1.0, 1.3, ease.out), gu = es(t, 1.9, 2.1, ease.in);
      hangAt(galTag, 560, lerp(-300, 250, gk) - gu * 700, T, gk > 0 && gu < 1 ? 1 : 0, 1.4, 0.9, 1);

      const pk = es(t, 2.1, 2.4, ease.out), pu = es(t, 2.9, 3.1, ease.in);
      const py = lerp(-340, 300, pk) - pu * 800;
      hangAt(plate, PLX, py, T, pk > 0 && pu < 1 ? 1 : 0, 1.2, 0.8, 2);
      vpose(plateTag, { x: PLX, y: py + 128, o: pk > 0 && pu < 1 ? seg(t, 2.35, 2.45) : 0 });
      const ck = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.3, ease.in));
      pose(cloudEl, { x: CLX + Math.sin(T * 0.3) * 8, y: lerp(-300, 200, ck), r: Math.sin(T * 0.7) * 1, o: ck > 0 ? 1 : 0 });

      /* v2 — the feast draws near: moons wax, villagers bring branches, the booth goes up */
      moons.forEach((m) => {
        const k = es(t, 3.05 + m.i * 0.1, 3.2 + m.i * 0.1);
        const d = es(t, 3.0, 3.25, ease.out);
        pose(m.el, { x: m.x, y: lerp(-200, m.y, d) + Math.sin(T * 0.8 + m.i) * 2, o: d > 0 ? 1 : 0 });
        m.lit.forEach((l) => fade(l, k));
      });
      const fk = es(t, 3.35, 3.65, ease.out);
      hangAt(feastTag, 800, lerp(-300, 262, fk), T, fk > 0 ? 1 : 0, 1.2, 0.8, 4);
      const vin = es(t, 3.0, 3.45, ease.sine);
      villagers.forEach((m) => {
        const x = lerp(-160 - m.i * 120, m.i ? BX + 95 : BX - 95, vin);
        const lay = bump(t, 3.45, 3.75);
        m.p.set({ x, y: RY - 14 + m.i * 8, s: 0.92, walk: vin > 0 && vin < 1 ? x * 0.055 : undefined, armF: 150 - lay * 60, armB: 20 + lay * 40, head: -lay * 8, blink: blinkAt(T, m.seed), o: vin > 0 ? 1 : 0 });
      });
      const bf = es(t, 3.2, 3.35, ease.back), bu = es(t, 3.5, 3.62);
      vpose(boothFrame, { x: BX, y: BY, sy: bf, oy: 0, o: bf > 0 && bu < 1 ? 1 : 0 });
      vpose(boothFull, { x: BX, y: BY + (1 - es(t, 3.5, 3.6, ease.out)) * -30, o: bu });

      S.cam.x = lerp(-60, 0, es(t, 0.6, 1.6)) + bump(t, 2.0, 2.9) * 60 - es(t, 3.0, 3.5) * 30;
      S.cam.z = 1 + es(t, 0.8, 1.6) * 0.06 - es(t, 3.0, 3.5) * 0.06;
    };
  },
};
