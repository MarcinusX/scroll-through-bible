// Łk 20,15–16a — dusk over the vineyard, a great low sun behind the gate. "And they threw him out of the vineyard and
// killed him": told as a shadow play, nothing more — dark silhouettes against the sun seize the son, carry him out at
// the gate, and outside it he falls; a white cloth is lowered over him on its string. "What then will the lord of the
// vineyard do to them?": a great "?" hangs in the dusk; in the far land the owner rises with his staff. "He will come
// and destroy those tenants, and give the vineyard to others": he comes in at the gate; strings come down and the three
// wicked tenants are lifted off the stage like paper puppets; the light comes back, and new farmers walk in from the
// other side and take the key from his hand.
import { C, person, blinkAt, pose, lerp, mix } from '../kit.js';
import { vineyardSet, vineBack, vineFront, VY, LOOK, tenant, newTenant, hoe, bigKey, basketCut, moodPuppet, drapeCloth, shadowPerson, bigQuestion, kf, es, ease, bump, seg } from './lib.js';

const G = VY.G;
const TX = [724, 792, 860];
const SX = 968;
const SHADOW = '#3a2630';

export default {
  id: 'lk20-heir',
  parable: true,
  beats: [
    { v: 15, text: 'I wyrzuciwszy go z winnicy, zabili.' },
    { v: 15, cont: true, text: 'Co więc uczyni z nimi właściciel winnicy?' },
    { v: 16, text: 'Przyjdzie i wytraci tych rolników, a winnicę da innym».' },
  ],
  cam: { x: [-20, 540], y: [0, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    // phone: the far land hangs further in; the shadow play outside the gate ends nearer, and the camera follows it
    const AB = S.portrait ? [990, 236] : VY.ABROAD;
    const CE = S.portrait ? [1090, 1180] : [1160, 1290];
    const OUT = S.portrait ? 1140 : 1230;
    const set = vineyardSet(S);
    vineBack(set);
    const veil1 = S.layer({ par: 0.4, sh: 1, flat: true });
    veil1.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.4)}" opacity=".42"/>`);
    const sunL = S.layer({ par: 0.3, sh: 2, flat: true });
    const bigSun = sunL.add(`<g><circle r="330" fill="url(#warm-glow)"/><path d="${c.cut(c.circ(0, 0, 150, 60), 0.6, 6)}" fill="${mix(C.sunDeep, C.dusk, 0.3)}"/><path d="${c.cut(c.circ(-10, -10, 118, 50), 0.5, 6)}" fill="${mix(C.sun, C.apricot, 0.5)}"/></g>`);
    const near = S.layer({ par: 0.12, sh: 5 });
    const qEl = near.add(`<g><path d="M0 -1600V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${bigQuestion(c, 64, C.cream)}</g>`);

    const pl = S.layer({ par: 0.5, sh: 5 });
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: i === 1 ? hoe(c) : '' }), sh: S.puppet(pl.add(shadowPerson(c, { ...tenant(i) }, SHADOW))), seed: c.rr(0, 9) }));
    const sonSh = S.puppet(pl.add(shadowPerson(c, LOOK.son, SHADOW)));
    const owner = S.puppet(pl.add(person(c, { ...LOOK.owner, holdF: `<g transform="rotate(-10)"><path d="${c.ribbon([[0, -60], [2, 80]], 5)}" fill="${C.wood2}"/></g>` })));
    const fresh = [0, 1, 2].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...newTenant(i), holdB: i === 1 ? '' : `<g transform="translate(-4 -14)">${basketCut(c)}</g>` }))), seed: c.rr(0, 9) }));
    const keyEl = pl.add(`<g>${bigKey(c)}</g>`);
    const strings = ten.map(() => pl.add(`<path d="M0 -1600V-190" stroke="rgba(74,54,34,.6)" stroke-width="1.4" fill="none"/>`));
    const fr = set.front();
    vineFront(fr);
    const clothL = S.layer({ par: 0.55, sh: 5 });
    const cloth = clothL.add(`<g>${drapeCloth(c, 110, 92)}</g>`);
    const veil2 = S.layer({ par: 0.6, sh: 1, flat: true });
    veil2.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.5)}" opacity=".28"/>`);

    return (t, time) => {
      const T = time;
      const dawn = es(t, 2.3, 2.7);
      const deep = 1 - es(t, 0.9, 1.3);
      veil1.fade(1 - dawn);
      veil2.fade(deep);
      sunL.fade(deep);
      pose(bigSun, { x: 1180, y: 600 });
      set.update(t, T, { sunX: S.portrait ? 570 : 500, sunY: lerp(420, 160, dawn) });

      /* v15a — shadow play: seized, carried out at the gate, falls; the cloth */
      const shadow = 1 - seg(t, 0.93, 0.97);
      const seize = es(t, 0.05, 0.2), carry = es(t, 0.22, 0.55), fall = es(t, 0.55, 0.64, ease.in);
      const cx = lerp(SX + 30, OUT, carry);
      sonSh.set({ x: carry > 0 ? cx : SX, y: carry < 1 ? (carry > 0 ? G - 70 : G + 2) : G + 2, s: 0.98, flip: true, r: carry > 0 && carry < 1 ? 88 : fall * 86, armF: 20 + seize * 60, o: 1 - es(t, 0.86, 0.9) });
      const ck = es(t, 0.66, 0.84, ease.out);
      pose(cloth, { x: S.portrait ? OUT + 95 : OUT - 15, y: lerp(G - 420, G + 6, ck), o: ck > 0.001 ? (S.portrait ? 1 - es(t, 1.0, 1.15) : 1) : 0 });   // phone: gone once the camera leaves it at the edge

      /* the tenants: in the shadow play, then back in colour; lifted off at the end */
      const lift = es(t, 2.3, 2.62, ease.in) * 2.6;
      ten.forEach((m) => {
        let x = TX[m.i] + seize * [180, 150, 100][m.i];
        if (carry > 0 && m.i < 2) x = lerp(TX[m.i] + [180, 150][m.i], CE[m.i], carry);
        const back = es(t, 0.66, 0.92);
        if (t > 0.66) x = lerp(m.i < 2 ? CE[m.i] : TX[m.i] + 100, TX[m.i], back);
        const walking = (carry > 0 && carry < 1 && m.i < 2) || (back > 0 && back < 1);
        const common = {
          x, y: G + (m.i === 1 ? 6 : 0) - lift * 560, s: 0.96, flip: t > 0.66 && t < 0.92, walk: walking ? x * 0.05 + m.i : undefined, blink: blinkAt(T, m.seed),
          armF: 20 + seize * 60 * (1 - back) + lift * 40, armB: 10 + seize * 40 * (1 - back) + lift * 60 + bump(t, 2.05, 2.3) * 60,
          head: -es(t, 1.1, 1.4) * 10 + bump(t, 2.0, 2.3) * 12, lean: bump(t, 2.0, 2.3) * 6,
        };
        m.p.set({ ...common, o: 1 - shadow });
        m.p.mood({ angry: 1 - es(t, 1.1, 1.3), sad: es(t, 1.2, 1.4) });
        m.sh.set({ ...common, o: shadow });
        pose(strings[m.i], { x: x + 2, y: G - lift * 560, o: es(t, 2.1, 2.25) * (1 - seg(t, 2.6, 2.62)) });
      });

      /* v15b — what will the owner do? */
      const qk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.1));
      pose(qEl, { x: 800, y: lerp(-1500, 230, qk), r: T ? Math.sin(T * 1.2) * 3 : 0, o: qk > 0.002 ? 1 : 0 });
      pose(set.plateEl, { x: AB[0], y: AB[1] - es(t, 1.9, 2.1, ease.in) * 1100, r: T ? Math.sin(T * 0.8) * 1.2 : 0 });
      const rise = es(t, 1.35, 1.6);
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: true, armF: 20 + rise * 60, armB: rise * 120, head: -rise * 8, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, o: 0 });

      /* v16a — he comes; new farmers take the key */
      const oin = es(t, 2.02, 2.3);
      const ox = lerp(1440, 1000, oin);
      owner.set({ x: ox, y: G + 2, s: 1.04, flip: true, walk: oin > 0 && oin < 1 ? ox * 0.05 : undefined, armF: 30 + bump(t, 2.2, 2.5) * 60 + es(t, 2.72, 2.85) * 40, armB: bump(t, 2.25, 2.55) * 120, head: -bump(t, 2.2, 2.5) * 8, blink: blinkAt(T, 1), o: oin > 0 ? 1 : 0 });
      fresh.forEach((m) => {
        const k = es(t, 2.45 + m.i * 0.05, 2.75 + m.i * 0.05);
        const x = lerp(160 - m.i * 60, TX[m.i] + 40, k);
        m.p.set({ x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, walk: k > 0 && k < 1 ? x * 0.05 + m.i : undefined, armF: 20 + (m.i === 2 ? es(t, 2.78, 2.86) * 60 : 0), armB: 10, head: -4, blink: blinkAt(T, m.seed), o: k > 0 ? 1 : 0 });
      });
      const kk = es(t, 2.76, 2.9);
      pose(keyEl, { x: lerp(ox - 44, TX[2] + 110, kk), y: G - 104 - Math.sin(kk * Math.PI) * 30, r: 20 - kk * 30, s: 0.9, o: t > 2.7 ? 1 : 0 });

      if (S.portrait) fr.fg.fade(1 - es(t, 0.3, 0.45) * (1 - es(t, 1.0, 1.15)));   // phone: the near bush would swing into the corner with the pan
      S.cam.z = kf(t, [[0, 1.14], [0.9, 1.14], [1.2, 1.08], [2.0, 1.1]]);
      S.cam.y = kf(t, [[0, 40], [0.9, 40], [1.2, 10], [2.0, 40]]);
      S.cam.x = S.portrait ? kf(t, [[0, 30], [0.15, 30], [0.5, 540], [0.9, 540], [1.2, 0], [2.0, 10]]) : kf(t, [[0, 30], [0.9, 30], [1.2, 0], [2.0, 10]]);
    };
  },
};
