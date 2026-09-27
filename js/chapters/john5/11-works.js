// J 5,36–38 — a deep blue stage under the great light (never a figure). "I have a testimony greater than
// John's": a balance comes down — John's little lamp on one pan, a disc of light on the other, which sinks. "The
// works the Father gave me to finish" — the three signs so far (the jar of Cana, the official's boy, the rolled
// mat) float down from the light to Jesus; "the very works I do testify that the Father sent me" — golden
// threads run from each sign to Him and from Him up to the light. "The Father who sent me has testified about
// me" — rings of the voice and the dove come down upon Him. "You have never heard His voice nor seen His form":
// the leaders look up into an empty frame. "You do not have His word abiding in you" — the words come down to
// the little windows of their hearts, but the shutters stay shut and the words fall away.
import { C, person, CAST, blinkAt, lerp, mix, shade, sky, sheet } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  NIGHT, radiance, rayBurst, balanceRig, bigLamp, signBadge, matRoll, HEALED, leaderOpts, withFace, faceBits, heartWindow, openWindow, wordSlip, voiceRings, hungWord, hang2,
  vis, kf, headAt, handAt, swing, tr, PI,
} from './lib.js';
import { dove, flapWings } from '../mark1/lib.js';

const F = 700;
const STAGE = ['#1f2550', '#343b70', '#5a5886'];

export default {
  id: 'j5-works',
  beats: [
    { v: 36, text: 'Ja mam świadectwo większe od Janowego.' },
    { v: 36, cont: true, text: 'Są to dzieła, które Ojciec dał Mi do wykonania;' },
    { v: 36, cont: true, text: 'dzieła, które czynię, świadczą o Mnie, że Ojciec Mnie posłał.' },
    { v: 37, text: 'Ojciec, który Mnie posłał, On dał o Mnie świadectwo.' },
    { v: 37, cont: true, text: 'Nigdy nie słyszeliście ani Jego głosu, ani nie widzieliście Jego oblicza;' },
    { v: 38 },
  ],
  cam: { x: [-60, 100], y: [-100, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, STAGE);
    S.layer({ par: 0.02, sh: 0, flat: true }).add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 520, n: 80 }));
    const hi = S.layer({ par: 0.06, sh: 3 });
    const burst = hi.add(`<g>${rayBurst(c, { n: 20, r0: 60, r1: 560, spread: 0.045, o: 0.5 })}<circle r="220" fill="url(#halo-glow)"/></g>`);
    const rad = hi.add(`<g>${radiance(c, 64)}</g>`);

    /* the floor: a dark stage with a soft pool of light */
    const fl = S.layer({ par: 0.34, sh: 3 });
    fl.add(sheet().p(c.cut([[-1800, F - 20], [3400, F - 20], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.storm2, C.plumRobe, 0.2)).x(c.poly(c.ell(800, F + 10, 360, 50, 30)), C.halo, 'opacity=".22"').out());

    /* threads of light */
    const thL = S.layer({ par: 0.4, sh: 0, flat: true });
    const TH = [0, 1, 2, 3].map(() => thL.add(`<path d="" stroke="${C.halo}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0"/>`));

    /* people */
    const L = S.layer({ par: 0.45, sh: 6 });
    const LEAD = [0, 1, 2].map((i) => {
      const el = L.add(withFace(person(c, leaderOpts(i + 1)), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), x: [1060, 1160, 1260][i], y: F + 6 - (i % 2) * 8, seed: c.rr(0, 9) };
    });
    LEAD.forEach((l) => { l.win = L.add(`<g>${heartWindow(c, 'faint', 15)}</g>`); });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L, c, { n: 3, color: C.halo, r: 40, w: 6, both: false });
    const doveEl = L.add(dove(c));

    /* flies */
    const X = S.layer({ par: 0.36, sh: 5 });
    const bal = balanceRig(S, X, 130);
    const lampSmall = X.add(`<g transform="scale(.26)">${bigLamp(c, { r: 160 }).replace(/<path d="M0 -1600V-6"[^>]*>/, '')}</g>`);
    const disc = X.add(`<g><circle r="60" fill="url(#halo-glow)"/>${radiance(c, 26)}</g>`);
    const greaterT = X.add(hungWord(c, tr('większe', 'greater'), { size: 20 }));
    const B1 = signBadge(c, 1, { r: 40 });
    const B2 = `${signBadge(c, 2, { r: 40, icon: 'boy' })}<g transform="translate(-16 12) scale(.18)">${person(c, { robe: C.linen, skin: C.skin2, hair: C.hair3, hairStyle: 'curly', belt: C.sun })}</g>`;
    const B3 = `${signBadge(c, 3, { r: 40, icon: 'mat' })}<g transform="translate(-16 -4) scale(.26)">${matRoll(c, 110)}</g>`;
    const badges = [B1, B2, B3].map((m, i) => ({ i, el: X.add(`<g>${m}</g>`) }));
    const frame = X.add(`<g>${hang2(`<rect x="-80" y="0" width="160" height="200" fill="${C.wood3}"/><rect x="-66" y="14" width="132" height="172" fill="${mix(C.halo, C.cream, 0.4)}"/><circle cx="0" cy="100" r="70" fill="url(#halo-glow)"/>`, 50, 400)}</g>`);
    const ears = [0, 1, 2].map(() => X.add(`<g><path d="${c.cut([[0, -16], [8, -14], [12, -6], [11, 4], [6, 10], [2, 16], [-3, 14], [-1, 6], [-5, -4], [-4, -12]], 0.3, 3)}" fill="${C.skin2}"/><path d="${c.ribbon([[-14, -14], [14, 14]], 3)}" fill="${C.terracotta}"/></g>`));
    const slips = [0, 1, 2].map((i) => ({ i, el: X.add(`<g><circle r="22" fill="url(#halo-glow)"/>${wordSlip(c, 34)}</g>`) }));

    const JX = 760, JY = F + 10, JS = 1.06;
    const BPOS = [[560, 330], [700, 290], [840, 330]];
    return (t, time) => {
      const T = time;
      const up = es(t, 0, 0.3, ease.out);
      pose(rad, { x: 800, y: lerp(-150, 110, up), r: T * 3 });
      pose(burst, { x: 800, y: lerp(-150, 110, up), r: T * 1.5 });
      fade(burst, 0.5 + bump(t, 3.0, 4.0) * 0.5);

      /* v36a — greater than John's: the balance */
      const bk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      const tilt = es(t, 0.4, 0.8, ease.back) * 22;
      const [pl, pr] = bal.set(820, 170 - (1 - bk) * 520, tilt, bk > 0.01 ? 1 : 0);
      vis(lampSmall, { x: pl[0] - 3, y: pl[1] + 58, o: bk > 0.01 ? 1 : 0 });
      vis(disc, { x: pr[0], y: pr[1] + 60, r: T * 5, o: bk > 0.01 ? 1 : 0 });
      vis(greaterT, { x: pr[0], y: pr[1] + 150, s: es(t, 0.6, 0.8, ease.back), o: t > 0.6 && bk > 0.01 ? 1 : 0 });

      /* v36b — the works given: three signs come down from the light */
      const recv = bump(t, 1.1, 2.0);
      const speak37 = bump(t, 4.05, 4.95) + bump(t, 5.05, 5.95);
      jesus.set({ x: JX, y: JY, s: JS, flip: false, armF: 20 + bump(t, 0.1, 0.9) * 40 + recv * 70 + speak37 * 40, armB: 10 + recv * 110 + bump(t, 2.1, 2.9) * 60, head: -recv * 12 - bump(t, 3.05, 3.9) * 14, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, JY, JS, false);
      badges.forEach((b) => {
        const k = es(t, 1.1 + b.i * 0.15, 1.5 + b.i * 0.15, ease.out);
        const [bx, by] = BPOS[b.i];
        const fade2 = 1 - es(t, 3.9, 4.2);
        vis(b.el, { x: lerp(800, bx, k), y: lerp(110, by, k) + Math.sin(T * 1.2 + b.i) * 4, s: 0.5 + k * 0.5, o: k > 0.01 ? fade2 : 0 });
      });
      /* v36c — threads: signs → Jesus → the light */
      const thk = es(t, 2.1, 2.5) * (1 - es(t, 3.9, 4.2));
      TH.forEach((p, i) => {
        if (thk <= 0.01) { attr(p, 'opacity', 0); return; }
        const [x0, y0] = i < 3 ? BPOS[i] : [jhx, jhy - 30];
        const [x1, y1] = i < 3 ? [jhx, jhy + 30] : [800, 170];
        const k = i < 3 ? thk : es(t, 2.4, 2.8) * (1 - es(t, 3.9, 4.2));
        attr(p, 'd', `M${x0} ${y0}L${lerp(x0, x1, k).toFixed(1)} ${lerp(y0, y1, k).toFixed(1)}`);
        attr(p, 'opacity', (0.85 * Math.min(1, k * 3)).toFixed(2));
      });

      /* v37a — the Father's testimony: the voice and the dove */
      voice(jhx, jhy - 170, bump(t, 3.0, 4.0), T, { dir: 1, spread: 2, s0: 1, off: 0 });
      const dk = es(t, 3.1, 3.7, ease.out) * (1 - es(t, 4.0, 4.3));
      vis(doveEl, { x: jhx + 4, y: lerp(120, jhy - 70, dk), s: 0.8, o: dk > 0.01 ? 1 : 0 });
      if (dk > 0.01) flapWings(doveEl, T, 26 * (1 - dk * 0.6));

      /* v37b — never heard His voice nor seen His form: an empty frame, closed ears */
      const fk = es(t, 4.1, 4.4, ease.out) * (1 - es(t, 4.95, 5.2, ease.in));
      vis(frame, { x: 1160, y: 180 - (1 - fk) * 520, r: Math.sin(T * 0.6) * 1, o: fk > 0.01 ? 1 : 0 });
      LEAD.forEach((l) => {
        const look = es(t, 4.1, 4.4) * (1 - es(t, 5.0, 5.2));
        l.p.set({ x: l.x, y: l.y, s: 1, flip: true, armF: 20 + look * 40, armB: 10 + (l.i === 1 ? bump(t, 0.4, 1.0) * 60 : 0), head: -look * 18, blink: blinkAt(T, l.seed) });
        attr(l.angry, 'opacity', (0.5 + bump(t, 5.2, 5.9) * 0.5).toFixed(2));
        const [hx, hy] = headAt(l.x, l.y, 1, true);
        vis(ears[l.i], { x: hx + 18, y: hy - 44, s: es(t, 4.35 + l.i * 0.06, 4.5 + l.i * 0.06, ease.back), o: t > 4.35 && t < 5.1 ? 1 : 0 });
        /* v38 — the heart-windows stay shut */
        vis(l.win, { x: hx - 6, y: hy + 64, s: es(t, 5.05, 5.25, ease.back), o: t > 5.05 ? 1 : 0 });
        openWindow(l.win, bump(t, 5.3 + l.i * 0.08, 5.45 + l.i * 0.08) * 0.25, 15);
      });
      slips.forEach((s) => {
        const l = LEAD[s.i];
        const [hx, hy] = headAt(l.x, l.y, 1, true);
        const k = seg(t, 5.1 + s.i * 0.08, 5.45 + s.i * 0.08);
        const fall = seg(t, 5.45 + s.i * 0.08, 5.9 + s.i * 0.08);
        const x = k < 1 ? lerp(800, hx - 6, k) : hx - 6 - fall * 40;
        const y = k < 1 ? lerp(120, hy + 50, k) : hy + 50 + fall * fall * 170;
        vis(s.el, { x, y, r: fall * 70, o: k > 0 && fall < 1 ? 1 - fall * 0.6 : 0 });
      });

      S.cam.x = kf(t, [[0, 20], [1.0, 20], [2.0, -20], [3.0, -20], [4.0, 60], [5.0, 100], [6.0, 100]]);
      S.cam.y = kf(t, [[0, -60], [1.0, -60], [2.0, -20], [3.0, -40], [4.0, -20], [5.0, 10], [6.0, 20]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.04], [2.0, 1.08], [3.0, 1.06], [4.0, 1.08], [5.0, 1.14], [6.0, 1.14]]);
    };
  },
};
