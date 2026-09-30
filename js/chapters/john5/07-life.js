// J 5,21–23 — a grey plain where grey paper figures lie still. As the Father raises the dead and gives them
// life — a ray from the great light falls on one: colour flows into him and he stands up — so the Son gives life
// to whom He will: Jesus stretches out His hand and two more rise in colour, and the whole land turns green. The
// Father judges no one — high in the light an empty throne, the scales hanging idle beside it — but has given
// all judgment to the Son: the scales come down and hang at His hand. That all may honour the Son as they
// honour the Father — the living bow to the light and to Him alike. Whoever does not honour the Son does not
// honour the Father: one man turns his back, and the light leaves him in shadow.
import { C, person, CAST, crowdPerson, blinkAt, lerp, mix, shade, sky, sheet } from '../kit.js';
import { band, grass, flowers, cloud, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  GREY, DAY, silhouette, lyingOn, radiance, rayBurst, lightThrone, balanceRig, beamGrad, lightBeam, withFace, faceBits, vis, kf, headAt, handAt, hanging, swing, tr, PI,
} from './lib.js';

const F = 700;
const GREYC = mix(C.stone2, C.rock2, 0.4);

export default {
  id: 'j5-life',
  beats: [
    { v: 21, text: 'Albowiem jak Ojciec wskrzesza umarłych i ożywia,' },
    { v: 21, cont: true, text: 'tak również i Syn ożywia tych, których chce.' },
    { v: 22, text: 'Ojciec bowiem nie sądzi nikogo,' },
    { v: 22, cont: true, text: 'lecz cały sąd przekazał Synowi,' },
    { v: 23, text: 'aby wszyscy oddawali cześć Synowi, tak jak oddają cześć Ojcu.' },
    { v: 23, cont: true, text: 'Kto nie oddaje czci Synowi, nie oddaje czci Ojcu, który Go posłał.' },
  ],
  cam: { x: [-60, 100], y: [-120, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GREY);
    /* the light above (never a figure) */
    const hiL = S.layer({ par: 0.06, sh: 2 });
    const burst = hiL.add(`<g>${rayBurst(c, { n: 22, r0: 60, r1: 700, spread: 0.04, o: 0.45 })}<circle r="260" fill="url(#halo-glow)"/></g>`);
    const rad = hiL.add(`<g>${radiance(c, 70)}</g>`);
    const cls = [[330, 170, 200], [1250, 150, 230]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hiL, cloud(c, w), { x, y, len: 700 }) }));
    const throneL = S.layer({ par: 0.12, sh: 4 });
    const throne = throneL.add(`<g>${lightThrone(c, 1.1, mix(C.haloRim, C.sun, 0.35))}</g>`);

    /* the land: green, with a grey sheet over it that lifts away */
    const farG = S.layer({ par: 0.12, sh: 2 });
    farG.add(band(c, { y: 470, amps: [24, 8, 3], lens: [1100, 380, 130], color: C.hillMid }).markup + `<g>${olive(c, 250, 470, 0.7)}${olive(c, 1360, 468, 0.8)}</g>`);
    const farGrey = S.layer({ par: 0.12, sh: 0 });
    farGrey.add(band(c, { y: 470, amps: [24, 8, 3], lens: [1100, 380, 130], color: mix(C.stone2, C.hillFar, 0.3) }).markup);
    const near = S.layer({ par: 0.3, sh: 3 });
    const g = band(c, { y: F - 40, amps: [10, 4, 2], lens: [900, 300, 110], color: C.hillNear });
    near.add(g.markup + grass(c, { x0: -900, x1: 2500, y: F - 40, n: 60, h: 14, color: C.moss, fn: g.fn }) + flowers(c, { x0: -600, x1: 2200, y: F - 30, n: 40, fn: (x) => g.fn(x) + 14, h: 12 }));
    const nearGrey = S.layer({ par: 0.3, sh: 0 });
    nearGrey.add(band(c, { y: F - 40, amps: [10, 4, 2], lens: [900, 300, 110], color: mix(C.stone2, C.rock, 0.5) }).markup);
    const bid = beamGrad(S, 'ray');
    const rayL = S.layer({ par: 0.3, sh: 0, flat: true });
    const rays = [0, 1, 2, 3].map(() => rayL.add(`<g>${lightBeam(bid, 30, 120, 560)}</g>`));
    S.defs(`<radialGradient id="${S.id('shd')}"><stop offset="0" stop-color="#2a2440" stop-opacity=".55"/><stop offset=".6" stop-color="#2a2440" stop-opacity=".35"/><stop offset="1" stop-color="#2a2440" stop-opacity="0"/></radialGradient>`);

    /* the dead (grey, lying) and the living (colour, standing) */
    const L = S.layer({ par: 0.45, sh: 5 });
    const shade1 = L.add(`<g><ellipse rx="160" ry="280" fill="url(#${S.id('shd')})"/></g>`);
    // phone: everyone stands closer to Jesus, so nobody is sliced by the screen edge
    const ph = S.portrait;
    const DEAD = (ph ? [[525, 0], [935, 1], [1045, 2]] : [[470, 0], [1010, 1], [1150, 2]]).map(([x, k], i) => {
      const o = { ...crowdPerson(c), mantle: null };
      const grey = L.add(lyingOn(c, { ...silhouette(o, GREYC), eyes: 'closed' }, { s: 0.72, w: 150, mat: false, eyes: 'closed' }));
      const live = S.puppet(L.add(person(c, o)));
      return { i, x, grey, live, seed: c.rr(0, 9), flip: x > 800 };
    });
    const others = (ph ? [[410, false], [630, false], [1130, true]] : [[330, false], [620, false], [1310, true]]).map(([x, flip], i) => {
      const el = L.add(withFace(person(c, crowdPerson(c)), faceBits(c)));
      return { i, x, flip, el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const lifeGlow = [0, 1, 2].map(() => L.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`));

    /* the scales */
    const X = S.layer({ par: 0.36, sh: 5 });
    const bal = balanceRig(S, X, 110);

    return (t, time) => {
      const T = time;
      const green = es(t, 0.5, 1.9);
      sk.blend(GREY, DAY, green);
      farGrey.fade(1 - green);
      nearGrey.fade(1 - green);
      const up = es(t, 0.0, 0.4, ease.out);
      pose(rad, { x: 800, y: lerp(-200, 130, up), r: T * 3 });
      fade(burst, 0.4 + up * 0.6);
      pose(burst, { x: 800, y: lerp(-200, 130, up), r: T * 1.5 });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));

      /* v21 — the Father raises the dead; so the Son gives life */
      const rise = [es(t, 0.3, 0.7), es(t, 1.35, 1.7), es(t, 1.5, 1.85)];
      const bow = bump(t, 4.1, 4.5) + bump(t, 4.5, 4.95);
      const bowToLight = bump(t, 4.1, 4.5), bowToSon = bump(t, 4.5, 4.95);
      DEAD.forEach((d) => {
        const k = rise[d.i];
        pose(d.grey, { x: d.x, y: F + 6, sx: d.flip ? -1 : 1, o: 1 - seg(k, 0.1, 0.4) });
        const face = d.x < 800 ? false : true;
        d.live.set({ x: d.x, y: F + 6 + (1 - k) * 60, s: 0.96, flip: face, armF: 30 + bump(k, 0.4, 1) * 90 + bowToSon * 20 + bowToLight * 20, armB: 20 + bump(k, 0.4, 1) * 130 + bowToLight * 140, head: -bowToLight * 22 + bowToSon * 22, lean: bowToSon * (face ? -18 : 18), blink: blinkAt(T, d.seed), o: seg(k, 0.05, 0.3) });
        vis(lifeGlow[d.i], { x: d.x, y: F - 90, s: 0.6 + k * 0.6, o: bump(k, 0.05, 1) });
        vis(rays[d.i], { x: d.i === 0 ? 800 : jhxy()[0] + 40, y: d.i === 0 ? 180 : jhxy()[1] + 40, r: d.i === 0 ? Math.atan2(d.x - 800, F - 180) * -57.3 : Math.atan2(d.x - jhxy()[0] - 40, F - jhxy()[1] - 40) * -57.3, sy: d.i === 0 ? 1 : 0.5, o: d.i === 0 ? bump(t, 0.1, 0.9) : bump(t, 1.2, 1.9) * 0.9 });
      });
      function jhxy() { return handAt(800, F + 10, 1.06, false, 80); }
      const give = bump(t, 1.1, 1.95);
      const scales = es(t, 3.1, 3.6);
      jesus.set({ x: 800, y: F + 10, s: 1.06, flip: false, armF: 20 + give * 70 + scales * 40, armB: 10 + give * 40 + scales * 80, head: -scales * 10 + bump(t, 5.05, 5.9) * 8, blink: blinkAt(T, 1) });

      /* v22 — the empty throne; the scales idle beside it, then given to the Son */
      const th = es(t, 2.05, 2.4, ease.out);
      vis(throne, { x: 800, y: lerp(-100, 380, th), s: 1, o: th > 0.01 ? 1 : 0 });
      const bx = lerp(ph ? 1005 : 1080, 880, scales), by = lerp(190, 330, scales);
      const sway = t > 3.6 ? Math.sin((t - 3.6) * 6) * 5 * Math.max(0, 1 - (t - 3.6) * 1.5) : 0;
      bal.set(bx, by - (1 - es(t, 2.2, 2.55, ease.out)) * 480, sway, t > 2.15 ? 1 : 0);

      /* v23 — all honour the Son as the Father; one turns his back */
      const away = es(t, 5.1, 5.5);
      others.forEach((m) => {
        const turnAway = m.i === 2 ? away : 0;
        const face = m.x < 800 ? false : true;
        m.p.set({ x: m.x, y: F + 8, s: 0.96, flip: turnAway > 0.5 ? !face : face, armF: 20 + (1 - turnAway) * (bowToSon * 20 + bowToLight * 20), armB: 10 + bowToLight * 140 * (1 - turnAway), head: (-bowToLight * 22 + bowToSon * 22) * (1 - turnAway) + turnAway * 10, lean: bowToSon * (face ? -18 : 18) * (1 - turnAway), blink: blinkAt(T, m.seed), o: ph && m.i === 0 ? 0 : es(t, 1.7, 2.1) });
        if (m.i === 2) attr(m.sad, 'opacity', away.toFixed(2));
      });
      vis(shade1, { x: others[2].x, y: F - 110, s: 0.6 + away * 0.5, o: away });

      S.cam.x = kf(t, ph ? [[0, -30], [1.0, -20], [1.5, 40], [4.0, 40], [5.0, 60], [5.9, 70]] : [[0, -60], [1.0, -40], [1.5, 60], [2.0, 0], [4.0, 0], [5.0, 40], [5.9, 60]]);
      S.cam.y = kf(t, [[0, 0], [1.0, 20], [2.0, -80], [3.0, -60], [4.0, 10], [5.0, 20]]);
      S.cam.z = kf(t, ph ? [[0, 1.06], [1.0, 1.06], [2.0, 1], [4.0, 1], [5.0, 1.02]] : [[0, 1.08], [1.0, 1.1], [2.0, 1.02], [3.0, 1.04], [4.0, 1.06], [5.0, 1.1]]);
    };
  },
};
