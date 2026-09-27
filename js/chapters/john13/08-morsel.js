// J 13,26–27 — John still on His breast; He answers him softly (a little bubble with a morsel of bread in it).
// He takes a piece of bread and dips it in the dish (the edge darkens); He holds it out to Judas, son of Simon
// Iscariot, and Judas takes it (his dark tag comes down). After the morsel — restrained, never a figure: a shadow
// falls over Judas, his shadow grows long on the wall, the lamp above him sinks. "What you are going to do, do
// quickly": He looks at Judas and an hourglass over Judas flips over, its sand pouring fast; Judas half rises.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, beloved, EVE, NIGHTFALL, JX, TW, C, tr, speech, morsel, bowl, nameTag, shadowPerson, hourglassRig, vignette, kf, hand, headAt, vis, pose, fade, lerp,
  blinkAt, hanging, PI,
} from './lib.js';

export default {
  id: 'j13-morsel',
  beats: [
    { v: 26, text: 'Jezus odparł: «To ten, dla którego umaczam kawałek [chleba], i podam mu».' },
    { v: 26, cont: true, text: 'Umoczywszy więc kawałek [chleba],' },
    { v: 26, cont: true, text: 'wziął i podał Judaszowi, synowi Szymona Iskarioty' },
    { v: 27, text: 'A po spożyciu kawałka [chleba] wszedł w niego szatan.' },
    { v: 27, cont: true, text: 'Jezus zaś rzekł do niego: «Co chcesz czynić, czyń prędzej!».' },
  ],
  cam: { x: [-20, 140], y: [60, 260], z: [1, 2.4] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTFALL });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus, JU = by.judas;
    const B = beloved(S, T0);
    const DX = 852;
    T0.tabL.add(`<g transform="translate(${DX} ${TOP - 2})">${bowl(c, { w: 38, food: 'stew', color: '#b9774f' })}</g>`);
    /* the shadow over Judas: a dark copy of him, a hush on the wall, his long shadow */
    S.defs(`<radialGradient id="${S.id('hush')}"><stop offset="0" stop-color="#171226" stop-opacity=".6"/><stop offset="1" stop-color="#171226" stop-opacity="0"/></radialGradient>`);
    const hush = T0.wallFx.add(`<g><circle r="160" fill="url(#${S.id('hush')})"/></g>`);
    const wallSh = S.puppet(T0.wallFx.add(`<g opacity="0">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#221a2e')}</g>`).firstElementChild);
    const wallShG = wallSh.el.parentNode;
    const dark = S.puppet(T0.midL.add(`<g opacity="0">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#2a2236')}</g>`).firstElementChild);
    const darkG = dark.el.parentNode;
    const dimL = S.layer({ par: 0.56, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".35"/>`);
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: 830, cy: SEAT - 80, r: 300, col: '#1d1830', o: 0.55 }));
    /* the morsel, the bubble, the tag, the hourglass */
    const fx = S.layer({ par: 0.5, sh: 3 });
    const bit = fx.add(`<g>${morsel(c, 12)}</g>`);
    const dip = bit.querySelector('.dip');
    const shine = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/></g>`);
    const hint = fx.add(`<g>${speech(c, `<g transform="scale(1.3)">${morsel(c, 9)}</g>`, { w: 54, h: 42, flip: true })}</g>`);
    const hangL = S.layer({ par: 0.5, sh: 4 });
    const tag = hanging(hangL, nameTag(c, tr(['Judasz, syn', 'Szymona Iskarioty'], ['Judas, son of', 'Simon Iscariot']), { size: 15, dark: true }), { x: 0, y: 0, len: 600 });
    const glass = hourglassRig(hangL, c, 80);
    const gStr = hangL.add(`<g><path d="M0 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);

    return (t, time) => {
      const T = time;
      const fall = es(t, 3.1, 3.6);     // the shadow falls
      T0.idle(t, T, 0.25 + fall * 0.2);
      R.stars.fade(0.9);
      dimL.fade(0.7 + fall * 0.3);
      spotL.fade(0.6 + fall * 0.3);

      /* Jesus: whisper to John; take, dip, give; look at Judas */
      const whisper = bump(t, 0.1, 0.95);
      const take = es(t, 0.6, 0.8);
      const toDish = es(t, 1.08, 1.4) * (1 - es(t, 1.75, 1.95));
      const give = es(t, 2.05, 2.4) * (1 - es(t, 2.8, 3.05));
      const speak = bump(t, 4.05, 4.9);
      const armF = 30 + take * 16 + toDish * 8 + give * 36 + speak * 30;
      const lean = toDish * 4 + give * 6;
      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { armF, armB: 14 + speak * 40, head: -whisper * 8 + toDish * 10 + give * 4 + fall * 6 - speak * 6, lean });
          fade(m.sad, es(t, 2.9, 3.3));
          return;
        }
        if (m.k === 'john' && B.set(1 - es(t, 4.1, 4.5) * 0.4, T, { head: -8 - whisper * 6 + fall * 6 })) return;
        if (m.k === 'judas') return;
        const watch = es(t, 2.1, 2.4) * (Math.abs(m.x - DX) < 250 ? 1 : 0.4);
        T0.sit(m, T, { head: watch * 4, armF: 36 });
      });
      // Judas: reaches, takes, eats; half rises
      const reach = es(t, 2.3, 2.5) * (1 - es(t, 2.9, 3.05));
      const eat = bump(t, 3.0, 3.35);
      const rise = es(t, 4.4, 4.9);
      const jud = { x: JU.x + rise * 8, y: SEAT + (JU.i % 2) * 3 - rise * 12, s: JU.s, flip: true, armF: 36 + reach * 28 + eat * 70, armB: 14 + rise * 20, head: 4 + fall * 16 - speak * 10 - rise * 4, lean: rise * 10, blink: blinkAt(T, JU.seed) };
      JU.p.set(jud);
      fade(JU.sad, fall * 0.6);
      dark.set(jud);
      fade(darkG, fall * 0.55);
      wallSh.set({ x: JU.x + 30, y: SEAT - 4, s: JU.s * (1.3 + fall * 0.5), flip: true, head: jud.head });
      fade(wallShG, 0.1 + fall * 0.2);
      pose(hush, { x: JU.x + 20, y: SEAT - 110, s: 0.5 + fall * 0.9, o: fall });
      fade(hush, fall);

      /* the morsel: in His hand, dipped, given, eaten */
      const [jhx, jhy] = hand(JX, SEAT, J.s, false, armF, lean, 62);
      const [uhx, uhy] = hand(JU.x, SEAT, JU.s, true, 36 + reach * 28 + eat * 70, 0, 62);
      const handed = es(t, 2.55, 2.62);
      const bx = lerp(jhx, uhx, handed), by_ = lerp(jhy, uhy, handed);
      const arc = Math.sin(seg(t, 2.4, 2.8) * PI) * 22;
      vis(bit, { x: bx, y: by_ - 10 - arc, r: t * 20, o: take * (1 - es(t, 3.25, 3.35)) });
      fade(dip, es(t, 1.35, 1.6));
      const sh = bump(t, 2.05, 2.95);
      vis(shine, { x: bx, y: by_ - 10 - arc, s: 0.6 + sh * 0.6, o: sh });
      const hk = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.85, 1.0));
      const [bhx, bhy] = headAt(JX, SEAT, J.s, false, 62);
      vis(hint, { x: bhx - 10, y: bhy - 22, s: hk * 0.9, o: hk > 0.01 ? 1 : 0 });
      const tk = es(t, 2.3, 2.6, ease.out) * (1 - es(t, 3.0, 3.2, ease.in));
      vis(tag, { x: JU.x + 40, y: 430 - (1 - tk) * 600, r: T ? Math.sin(T * 0.8) : 0, o: tk > 0.01 ? 1 : 0 });

      /* b4 — do quickly: the hourglass flips, its sand runs fast */
      const gk = es(t, 4.05, 4.3, ease.out);
      const flip = es(t, 4.3, 4.5);
      const gx = 960, gy = 470 - (1 - gk) * 600;
      vis(glass.el, { x: gx, y: gy, r: flip * 180, o: gk > 0.01 ? 1 : 0 });
      vis(gStr, { x: gx, y: gy, o: gk > 0.01 ? 1 : 0 });
      const lvl = flip < 1 ? 0.05 : 1 - seg(t, 4.5, 4.95);
      glass.set(flip < 1 ? 0.05 : lvl, flip >= 1 && lvl > 0.02 ? 1 : 0);

      S.cam.x = kf(t, [[0, -20], [1.0, 60], [2.0, 60], [3.0, 110], [4.0, 110], [4.4, 120]]);
      S.cam.y = kf(t, [[0, 200], [1.0, 230], [2.0, 220], [3.0, 200], [4.0, 180], [4.4, 170]]);
      S.cam.z = kf(t, [[0, 2.0], [1.0, 2.3], [2.0, 2.3], [3.0, 2.0], [4.0, 1.7], [4.4, 1.7]]);
    };
  },
};
