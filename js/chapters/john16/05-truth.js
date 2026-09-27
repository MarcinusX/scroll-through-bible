// J 16,12–13 — "I have yet many things to tell you": a wooden chest in front of Him opens, and scroll after scroll
// rises out of it into a great arc above them. "But you cannot bear them now": Peter reaches for one and sags under
// its weight — so Jesus gently calls them all back into the chest and closes the lid, for later. "When He, the
// Spirit of truth, has come, He will guide you into all truth": the night thins towards dawn, a golden way runs out
// over the hills to a bright horizon, and a dove of light flies ahead along it. "He will not speak from Himself, but
// whatever He hears, He will speak": rings of sound come down from the light above to the dove, and go out from the
// dove to them. "He will declare to you things that are coming": a long banner unrolls — an empty tomb at sunrise,
// small flames over a gathered people, a city of light.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, scrollChest, scrollRolled, dove, flapWings, voiceRings, goldArc, at, fatherLight, hand,
  sheet, shade, mix, person, kf, vis, pose, lerp, C, PI, JX, NIGHT, PREDAWN, TW, LINE,
} from './lib.js';

const CX = 800;                   // the chest, in front of Jesus
const NS = 9;                     // scrolls
const BW = 600, BH = 150;         // the banner

export default {
  id: 'j16-truth',
  beats: [
    { v: 12, text: 'Jeszcze wiele mam wam do powiedzenia,' },
    { v: 12, cont: true, text: 'ale teraz [jeszcze] znieść nie możecie.' },
    { v: 13, text: 'Gdy zaś przyjdzie On, Duch Prawdy, doprowadzi was do całej prawdy.' },
    { v: 13, cont: true, text: 'Bo nie będzie mówił od siebie, ale powie wszystko, cokolwiek usłyszy,' },
    { v: 13, cont: true, text: 'i oznajmi wam rzeczy przyszłe.' },
  ],
  cam: { x: [-20, 60], y: [-70, 40], z: [1, 1.15] },
  build(S) {
    const c = S.c;
    let glowL = null;
    const P = pathSet(S, {
      beyond(S2) {
        glowL = S2.layer({ par: 0.12, sh: 0, flat: true });
        glowL.add(`<ellipse cx="1150" cy="500" rx="820" ry="260" fill="url(#halo-glow)"/><ellipse cx="1150" cy="505" rx="420" ry="110" fill="url(#halo-glow)"/>`);
        return glowL;
      },
    });
    const GY = P.GY;

    // the golden way out to the bright horizon
    const wayL = S.layer({ par: 0.3, sh: 0, flat: true });
    const wayPts = c.cbez([JX + 40, GY - 20], [980, GY - 60], [1000, 520], [1150, P.ridge(1150) - 4], 40);
    const way = goldArc(wayL, c, wayPts, { w: 4.5, n: 46 });

    // the light above and its rings of sound
    const hiL = S.layer({ par: 0.12, sh: 2 });
    const high = hiL.add(`<g>${fatherLight(c, 50, { ray: [1.4, 2.0], glow: 2.4 })}</g>`);
    const ringsL = S.layer({ par: 0.3, sh: 0, flat: true });
    const hear = voiceRings(ringsL, c, { n: 3, color: C.halo, r: 30, w: 4, both: false });
    const tell = voiceRings(ringsL, c, { n: 3, color: C.halo, r: 34, w: 4 });

    // the banner of things to come
    const bnL = S.layer({ par: 0.22, sh: 5 });
    const bs = sheet();
    bs.p(c.cut(c.rect(-BW / 2, 0, BW, BH), 0.6, 8), C.parchment);
    const fr = (x) => c.cut(c.rect(x - 84, 16, 168, 118), 0.4, 6);
    bs.p(fr(-190) + fr(0) + fr(190), C.cream);
    // 1: the empty tomb at sunrise
    const t1 = sheet();
    t1.p(c.cut(c.rect(-266, 24, 152, 102), 0.3, 5), '#f4d3ae');
    t1.p(c.cut(c.circ(-160, 70, 16, 18), 0.2, 3), C.sun);
    t1.p(c.cut([[-268, 126], [-268, 70], [-234, 52], [-196, 62], [-176, 90], [-172, 126]], 0.6, 6), C.rock2);
    t1.p(c.cut([[-232, 126], [-232, 98], ...c.arc(-216, 98, 16, 16, PI, 2 * PI, 8), [-200, 126]], 0.3, 4), C.soilDark);
    t1.p(c.cut(c.circ(-180, 112, 16, 16), 0.4, 4), C.rock);
    t1.p(c.cut(c.rect(-266, 118, 152, 8), 0.3, 5), C.sage);
    // 2: small flames over a gathered people
    const t2 = sheet();
    t2.p(c.cut(c.rect(-76, 24, 152, 102), 0.3, 5), mix(C.plaster, C.apricot, 0.3));
    let heads = '', bodies = '', fl = '';
    for (let i = 0; i < 6; i++) { const x = -60 + i * 24, y = 92 + (i % 2) * 6; bodies += c.cut([[x - 10, 126], [x - 8, y + 6], [x + 8, y + 6], [x + 10, 126]], 0.3, 4); heads += c.cut(c.circ(x, y, 6.5, 10), 0.2, 3); fl += c.cut([[x, y - 26], [x - 4, y - 16], [x, y - 11], [x + 4, y - 16]], 0.2, 2); }
    t2.p(bodies, C.dustyBlue).p(heads, C.skin2).p(fl, C.sunDeep);
    t2.x(c.poly(c.circ(0, 44, 9, 10)), '#fffdf4');
    // 3: the city of light
    const t3 = sheet();
    t3.p(c.cut(c.rect(114, 24, 152, 102), 0.3, 5), '#fbeac4');
    let tw = '';
    [[130, 70], [152, 56], [176, 66], [198, 46], [222, 62], [246, 72]].forEach(([x, y]) => { tw += c.cut(c.rect(x - 9, y, 18, 126 - y), 0.3, 4); });
    t3.p(tw, C.halo).x(c.poly(c.rect(114, 110, 152, 16)), C.haloRim);
    const banner = bnL.add(`<g><path d="M${-BW * 0.35} -1600V0M${BW * 0.35} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="bnb">${bs.out()}${t1.out()}${t2.out()}${t3.out()}</g></g>`);
    const bnb = banner.querySelector('.bnb');
    const rod = () => sheet().p(c.cut(c.rect(-8, -6, 16, BH + 12), 0.3, 5), C.wood2).p(c.cut(c.ell(0, -8, 7, 4, 10), 0.2, 3) + c.cut(c.ell(0, BH + 8, 7, 4, 10), 0.2, 3), C.wood).out();
    const rodL = bnL.add(`<g>${rod()}</g>`), rodR = bnL.add(`<g>${rod()}</g>`);

    // people (the right-hand group stands a little further out, round the chest)
    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY, pos: LINE });
    const PE = D.find((m) => m.k === 'peter');
    // the chest and its scrolls
    const chL = S.layer({ par: 0.54, sh: 5 });
    const ch = scrollChest(c, 150, 70);
    const scrolls = Array.from({ length: NS }, (_, i) => ({ i, el: chL.add(`<g><g transform="rotate(90)">${scrollRolled(c, 58)}</g></g>`), a: PI * (1.14 + (i / (NS - 1)) * 0.72) }));
    const box = chL.add(`<g>${ch.box}</g>`);
    const lidW = chL.add(`<g>${ch.lid}</g>`);
    const lid = lidW.querySelector('.lid');
    const fx = S.layer({ par: 0.56, sh: 4 });
    const dv = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/>${dove(c)}</g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      const CY = GY + 40;
      vis(box, { x: CX, y: CY, o: 1 });

      /* v12 — the scrolls rise; too heavy; back into the chest */
      const open = es(t, 0.05, 0.3) * (1 - es(t, 1.5, 1.7));
      pose(lidW, { x: CX, y: CY });
      pose(lid, { x: -79, y: -72 - open * 18, sy: 1 - open * 0.7 });
      const peterT = 4;           // the scroll handed to Peter
      scrolls.forEach((sc) => {
        const k = es(t, 0.2 + sc.i * 0.05, 0.6 + sc.i * 0.05, ease.out);
        const back = es(t, 1.22 + (NS - sc.i) * 0.025, 1.5 + (NS - sc.i) * 0.025, ease.io);
        const R = 210;
        let x = CX + Math.cos(sc.a) * R * k, y = CY - 60 + Math.sin(sc.a) * (R + 40) * k - k * 40;
        let r = (sc.a / PI - 1.5) * 120 * k;
        if (sc.i === peterT) {
          const give = es(t, 0.95, 1.1) * (1 - es(t, 1.2, 1.3));
          const [px, py] = hand(PE.x, PE.y, PE.s, false, 60);
          x = lerp(x, px + 6, give); y = lerp(y, py + 16 + bump(t, 1.12, 1.4) * 14, give); r = lerp(r, 10, give);
        }
        x = lerp(x, CX, back); y = lerp(y, CY - 40, back); r *= 1 - back;
        vis(sc.el, { x, y: y + (T && k > 0.99 && back < 0.01 ? Math.sin(T * 1.4 + sc.i) * 3 : 0), r, s: 0.9, o: k > 0.01 && back < 0.97 ? 1 : 0 });
      });

      /* v13a — towards dawn: the golden way and the dove leading */
      const dawn = es(t, 2.05, 2.6);
      P.sky.blend(NIGHT, PREDAWN, dawn);
      P.stars.fade(1 - dawn * 0.8);
      fade(P.moon, 1 - dawn * 0.6);
      glowL.fade(dawn);
      way(es(t, 2.1, 2.65));
      const lead = es(t, 2.2, 2.9);
      const [wx, wy] = at(wayPts, 0.2 + lead * 0.8);
      const hov = es(t, 3.0, 3.3);
      const dx = lerp(wx, 1000, hov), dy = lerp(wy - 50, 360, hov);
      vis(dv, { x: dx, y: dy + (T ? Math.sin(T * 2) * 4 : 0), s: 0.75 - lead * 0.1, o: es(t, 2.1, 2.25) });
      if (t > 2.05) flapWings(dv, t * 5 + T, 26, 3);

      /* v13b — hearing and speaking */
      const hk = es(t, 3.0, 3.3) * (1 - es(t, 4.8, 5));
      vis(high, { x: 1000, y: 120 + (1 - hk) * -200, s: 0.8, o: hk });
      const on1 = bump(t, 3.1, 3.6), on2 = bump(t, 3.45, 4.0);
      hear(1000, 190, on1, T || t * 4, { dir: 1, spread: 1.6 });
      tell(dx, dy + 20, on2, T || t * 4, { spread: 2.8 });

      /* v13c — the banner of things to come */
      const bIn = es(t, 3.95, 4.2, ease.out);
      const unroll = es(t, 4.15, 4.6);
      const by = 150 - (1 - bIn) * 700;
      vis(banner, { x: 760, y: by, o: bIn > 0.01 ? 1 : 0 });
      pose(bnb, { sx: Math.max(0.02, unroll) });
      vis(rodL, { x: 760 - (BW / 2) * unroll - 4, y: by, o: bIn > 0.01 ? 1 : 0 });
      vis(rodR, { x: 760 + (BW / 2) * unroll + 4, y: by, o: bIn > 0.01 ? 1 : 0 });

      /* people */
      D.forEach((m) => {
        const isP = m.k === 'peter';
        const sag = isP ? bump(t, 1.0, 1.4) : 0;
        const look = es(t, 0.3, 0.6) * (1 - es(t, 1.8, 2.1));
        const turn = es(t, 2.3, 2.6);
        lampK(m, 0.85 + dawn * 0.1, 0, T);
        fade(m.sad, bump(t, 1.1, 1.9) * 0.7);
        put(m, T, { head: -look * 10 + sag * 18 - turn * 8 - es(t, 3.95, 4.3) * 6, armB: 8 + (isP ? es(t, 0.95, 1.1) * 60 * (1 - es(t, 1.4, 1.6)) : 0), lean: sag * 6, y: m.y + sag * 4, flip: m.flip && turn < 0.5 });
      });
      const call = bump(t, 1.3, 1.95);
      put(J, T, { armF: 20 + bump(t, 0.05, 0.9) * 50 + call * 40 + bump(t, 2.1, 2.9) * 60, armB: 10 + bump(t, 0.1, 0.9) * 100 + call * 60 + bump(t, 4.1, 4.9) * 100, head: -bump(t, 0.1, 0.9) * 8 + call * 8 - bump(t, 3.9, 4.9) * 8 });

      S.cam.x = kf(t, [[0, 0], [2, 0], [2.8, 40], [3.8, 40], [4.3, 0]]);
      S.cam.y = kf(t, [[0, -20], [0.8, -50], [1.5, -10], [2, 0], [2.8, -20], [3.5, -60], [4.4, -60]]);
      S.cam.z = kf(t, [[0, 1.02], [1.2, 1.1], [1.9, 1.04], [3, 1.06], [4.4, 1.0]]);
    };
  },
};
