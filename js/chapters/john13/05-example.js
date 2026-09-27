// J 13,12–15 — back at the table. All their feet are washed (a row of sparkles along the floor); the basin and
// the towel are set down in front. He unties the towel, puts His red mantle on again and reclines. "Do you
// understand what I have done to you?" — a question hangs over the basin. "Teacher" and "Lord" come down in gold
// over Him: so I am. And the Lord and Teacher washed your feet: the two gold words bow all the way down to the basin.
// Then a shadow-play screen: disciples kneel to wash one another's feet — and a gold figure at the head of the
// row, the Master kneeling: the example; the light passes from Him along the row.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, EVE, JX, JESUS, JESUS_TUNIC, TW, CAST, C, tr, person, addToBody, towelWrap, foldedCloth, basinParts, towelHeld, hungGold, framed, silhouette,
  sparkle, question, hungPlate, strip, kf, hand, vis, pose, fade, lerp, mix, blinkAt, PI,
} from './lib.js';

export default {
  id: 'j13-example',
  beats: [
    { v: 12, text: 'A kiedy im umył nogi,' },
    { v: 12, cont: true, text: 'przywdział szaty i znów zajął miejsce przy stole, rzekł do nich:' },
    { v: 12, cont: true, text: '«Czy rozumiecie, co wam uczyniłem?' },
    { v: 13 },
    { v: 14, text: 'Jeżeli więc Ja, Pan i Nauczyciel, umyłem wam nogi,' },
    { v: 14, cont: true, text: 'to i wyście powinni sobie nawzajem umywać nogi.' },
    { v: 15 },
  ],
  cam: { x: [-40, 40], y: [0, 200], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: EVE });
    const { R, at, by, SEAT, TOP, FLOOR } = T0;
    const J = by.jesus;
    const SY = SEAT - 8;
    const jG = S.puppet(T0.seatL.add(addToBody(person(c, JESUS_TUNIC), towelWrap(c, 'stand'))));
    const jT = S.puppet(T0.seatL.add(person(c, JESUS_TUNIC)));
    const jM = S.puppet(T0.seatL.add(person(c, JESUS)));
    const onTable = S.layer({ par: 0.55, sh: 4 });
    const mantle = onTable.add(`<g>${foldedCloth(c, 52, 14, C.jesusMantle)}</g>`);
    /* the basin and towel set down in front of the table */
    const front = S.layer({ par: 0.6, sh: 5 });
    const bas = basinParts(c, 70);
    const BY = FLOOR + 22;
    front.add(`<g transform="translate(${JX} ${BY})">${bas.back}${bas.water}${bas.front}</g>`);
    const towel = front.add(`<g>${towelHeld(c, 40)}</g>`);
    const feetSp = at.map((m) => ({ m, el: front.add(`<g>${sparkle(c, 8)}</g>`) }));
    /* the gold words; the question */
    const words = S.layer({ par: 0.58, sh: 4 });
    const wT = words.add(`<g>${hungGold(c, tr('Nauczyciel', 'Teacher'), { size: 26 })}</g>`);
    const wL = words.add(`<g>${hungGold(c, tr('Pan', 'Lord'), { size: 26 })}</g>`);
    const q = words.add(`<g>${question(c)}</g>`);
    const qStr = words.add(`<g><path d="M0 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    /* the shadow-play screen */
    const SW = 480, SH = 220, G = 196, INK = '#3b2a33', GOLD = '#b9802a';
    const pairs = [[34, true], [186, false], [338, false]];
    let inner = `<circle cx="${SW / 2}" cy="${SH * 0.45}" r="${SW * 0.6}" fill="url(#warm-glow)"/><rect x="0" y="${G}" width="${SW}" height="${SH - G}" fill="${mix(INK, '#f3d9a4', 0.55)}"/>`;
    const looks = [TW.andrew, TW.philip, TW.thomas, TW.james, TW.matthew, TW.peter];
    pairs.forEach(([x, gold], i) => {
      const b = basinParts(c, 36);
      inner += `<g transform="translate(${x + 46} ${G}) scale(1.3)"><g fill="${INK}">${b.back.replace(/fill="[^"]*"/g, `fill="${INK}"`)}${b.front.replace(/fill="[^"]*"/g, `fill="${INK}"`)}</g></g>`;
      inner += `<g transform="translate(${x} ${G}) scale(.6)">${person(c, { ...silhouette(looks[i * 2], INK), pose: 'sit' }).split(`fill="${C.blush}"`).join(`fill="${INK}"`)}</g>`;
      const kn = gold ? silhouette({ ...CAST.jesus, mantle: null }, GOLD) : silhouette(looks[i * 2 + 1], INK);
      inner += `<g transform="translate(${x + 106} ${G}) scale(.6)">${person(c, { ...kn, pose: 'kneel', k: 'kn' + i }).split(`fill="${C.blush}"`).join(`fill="${kn.robe}"`)}</g>`;
    });
    const scrL = S.layer({ par: 0.5, sh: 5 });
    const screen = scrL.add(`<g>${framed(S, inner, { w: SW, h: SH, rim: C.wood2, bg: '#f3d9a4', k: 'shadow' })}</g>`);
    const kn = pairs.map((_, i) => S.puppet(S.$('kn' + i)));
    const exTag = scrL.add(`<g>${strip(c, tr('Dałem wam przykład', 'I have given you an example'), { size: 18 })}</g>`);
    const lightSp = [0, 1, 2].map(() => scrL.add(`<g>${sparkle(c, 12)}</g>`));
    const goldGlow = scrL.add(`<g><circle r="60" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0);
      R.stars.fade(0.6);

      /* b0 — their feet are washed: sparkles along the floor; b1 — the towel off, the mantle on, He reclines */
      feetSp.forEach(({ m, el }, i) => {
        const k = bump(t, 0.1 + i * 0.05, 0.75 + i * 0.04);
        vis(el, { x: m.x + (m.flip ? -30 : 30), y: FLOOR - 8, s: 0.4 + k * 0.7, r: t * 90, o: k });
      });
      const untie = es(t, 1.08, 1.15), dressed = es(t, 1.4, 1.47), sat = es(t, 1.72, 1.8);
      const tw = es(t, 1.05, 1.3);
      vis(towel, { x: lerp(JX + 30, JX + 26, tw), y: lerp(SY - 90, BY - 22, tw), r: -tw * 70, o: es(t, 1.05, 1.1) });
      const reachM = bump(t, 1.2, 1.5);
      const mk = es(t, 1.22, 1.4);
      vis(mantle, { x: lerp(734, JX + 20, mk), y: lerp(TOP, SY - 100, mk), o: 1 - dressed });
      const base = { x: JX, y: SY, s: 1.02, flip: false, head: 4, blink: blinkAt(T) };
      jG.set({ ...base, o: 1 - untie, armF: 20 + bump(t, 0.9, 1.15) * 20, armB: 10 + bump(t, 0.9, 1.15) * 30 });
      jT.set({ ...base, o: untie * (1 - dressed), armF: 30 + reachM * 40, armB: 20 + reachM * 40, lean: -reachM * 3 });
      jM.set({ ...base, o: dressed * (1 - sat), armF: 30, armB: 14 });

      /* the Twelve */
      const ask = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const nod = es(t, 3.4, 3.7) * (1 - es(t, 4.0, 4.2));
      const talk = bump(t, 2.1, 2.9) + bump(t, 3.1, 3.9) * 0.8 + bump(t, 4.1, 4.9) * 0.7 + bump(t, 5.1, 5.9) + bump(t, 6.1, 6.9);
      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { o: sat, armF: 30 + talk * 26, armB: 14 + talk * 60, head: -talk * 4 + bump(t, 4.2, 4.9) * 14 });
          return;
        }
        const d = m.x - JX;
        const glance = ask * Math.sin(m.i * 2.1) * 10;
        T0.sit(m, T, { head: glance + nod * (4 + Math.sin(t * PI * 6 + m.seed) * 5) + es(t, 4.2, 4.6) * (1 - es(t, 5, 5.2)) * 10, armF: 36 + ask * 10 * Math.sin(m.i), lean: es(t, 5.1, 5.4) * 3 });
      });

      /* b2 — do you understand? */
      const qk = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.1));
      vis(q, { x: JX + 64, y: BY - 44 + (1 - qk) * 30, s: 1.2 * qk, o: qk > 0.01 ? 1 : 0 });
      vis(qStr, { x: JX + 64, y: BY - 44, o: qk > 0.01 ? 1 : 0 });

      /* b3 — Teacher and Lord (so I am); b4 — they bow down to the basin */
      const wk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 4.95, 5.2));
      const down = es(t, 4.15, 4.75);
      const glow = bump(t, 3.5, 4.1);
      [[wT, -110, 1], [wL, 110, -1]].forEach(([el, dx, sg], i) => {
        const x = JX + lerp(dx, dx * 0.62, down), y = lerp(420, BY - 60 - i * 0, down) - (1 - wk) * 700;
        vis(el, { x, y, r: sg * down * -24 + (T ? Math.sin(T * 0.8 + i) * 1.2 : 0), s: 1 + glow * 0.08 - down * 0.15, o: wk > 0.01 ? 1 : 0 });
      });

      /* b5 — the shadow screen: one another; b6 — the example */
      const sk = es(t, 5.05, 5.4, ease.out);
      const scx = JX, scy = 250 - (1 - sk) * 700;
      vis(screen, { x: scx, y: scy, r: T ? Math.sin(T * 0.6) * 0.6 : 0, o: sk > 0.01 ? 1 : 0 });
      kn.forEach((p, i) => {
        const on = i === 0 ? es(t, 6.05, 6.3) : 1;
        const dip = sk * Math.sin(t * PI * 5 + i * 1.3);
        p.set({ x: 0, y: 0, s: 1, flip: true, armF: 58 + dip * 12, lean: 18 + dip * 4, head: 12, o: on });
      });
      const ek = es(t, 6.2, 6.5, ease.out);
      vis(exTag, { x: scx, y: scy + SH + 40 - (1 - ek) * 30, o: ek });
      const X0 = scx - SW / 2;
      vis(goldGlow, { x: X0 + pairs[0][0] + 96, y: scy + G - 50, o: es(t, 6.05, 6.3) });
      lightSp.forEach((el, i) => {
        const u = seg(t, 6.3 + i * 0.08, 6.9 + i * 0.03);
        const x = X0 + lerp(pairs[0][0] + 106, pairs[2][0] + 106, u), y = scy + G - 110 - Math.sin(u * PI * 2) * 20;
        vis(el, { x, y, s: 0.5 + Math.sin(u * PI) * 0.5, r: t * 120, o: u > 0 && u < 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [2, 0], [5, 0], [7, 0]]);
      S.cam.y = kf(t, [[0, 150], [1.0, 130], [2.0, 150], [3.0, 110], [4.0, 150], [5.0, 60], [6, 60], [7, 60]]);
      S.cam.z = kf(t, [[0, 1.3], [1.0, 1.4], [2.0, 1.3], [3.0, 1.35], [4.0, 1.35], [5.0, 1.2], [6, 1.25], [7, 1.25]]);
    };
  },
};
