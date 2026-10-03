// Mk 14,13b–16 — in the city: a man carrying a jar of water at the fountain; the two follow him through the
// narrow street to a house; the master of the house shows them the large upper room, spread and ready
// (its paper front folds down); they carry up the bread, the cups and the lamb, and light the lamps.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud } from '../../assets/nature.js';
import { house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  TW, LOOK, kf, moving, hand, headAt, speech, GLYPH, waterJar, drop, oilLamp, lowTable, bowl, loaf, cup, matzah, lamb, templeMini, PI,
vis, } from './lib.js';

const GY = 700;                    // the street
const HX = 1180;                   // the house of the upper room (centre)
const HW = 380, H1 = 520, H2 = 318;   // width, first-floor line, roof line
const DOORX = HX - 110;

export default {
  id: 'm14-jar',
  beats: [
    { v: 13, text: '«Idźcie do miasta, a spotka was człowiek, niosący dzban wody.' },
    { v: 13, cont: true, text: 'Idźcie za nim' },
    { v: 14 },
    { v: 15, text: 'On wskaże wam na górze salę dużą, usłaną i gotową.' },
    { v: 15, cont: true, text: 'Tam przygotujecie dla nas».' },
    { v: 16 },
  ],
  cam: { x: [-580, 560], y: [-60, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const SKY = ['#c3d8d8', '#efe5cb', '#f7e6c8'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1500, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 160), { x: 700, y: 170, len: 600 });

    // roofs of Jerusalem far behind, the Temple above them
    const far = S.layer({ par: 0.12, sh: 2 });
    let rf = '';
    for (let i = 0; i < 40; i++) { const x = c.rr(-500, 2200), w = c.rr(50, 110), top = c.rr(400, 470); rf += c.cut(c.rect(x, top, w, 300), 0.4, 6); }
    far.add(sheet().p(rf, mix(C.plaster2, C.skyBlue2, 0.35)).out() + `<g transform="translate(560 420)">${templeMini(c, 1.5)}</g>`);

    // the street: a row of houses behind, the fountain, the city gate on the left
    const row = S.layer({ par: 0.3, sh: 3 });
    const walls = [C.plaster, mix(C.plaster, C.sand, 0.4), mix(C.plaster, C.apricot, 0.25), mix(C.plaster2, C.sand, 0.2)];
    let hs = '';
    [[-420, 150, 150], [-250, 120, 190], [-110, 160, 150], [360, 140, 170], [520, 170, 140], [700, 130, 190], [840, 120, 160]].forEach(([x, w, h], i) => {
      hs += house(c, x, GY - 60, w, h, { wall: walls[i % 4], shadow: shade(walls[i % 4], -0.1), stairs: false });
    });
    row.add(hs);
    // the city gate
    const gate = sheet();
    gate.p(c.cut([[40, GY - 40], [40, 330], [300, 330], [300, GY - 40]], 0.6, 8) + c.hole([[110, GY - 38], [110, 470], ...c.arc(170, 470, 60, 60, PI, 2 * PI, 10), [230, GY - 38]], 0.4, 6), C.stone);
    let merl = '';
    for (let x = 40; x < 300; x += 26) merl += c.cut(c.rect(x, 314, 14, 18), 0.2, 4);
    gate.p(merl, C.stone2);
    let crs = '';
    for (let y = 350; y < GY - 50; y += 22) crs += c.ribbon([[44, y], [296, y + c.rr(-1, 1)]], 1.1);
    gate.x(crs, shade(C.stone, -0.15), 'opacity=".5"');
    row.add(`<path d="${c.poly([[110, GY - 38], [110, 470], ...c.arc(170, 470, 60, 60, PI, 2 * PI, 10), [230, GY - 38]])}" fill="${C.hillMid}"/>` + gate.out());
    // the street floor
    const streetL = S.layer({ par: 0.38, sh: 3 });
    const st = sheet();
    st.p(c.cut([[-900, GY - 60], [2500, GY - 60], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.sand, 0.5));
    let cob = '';
    for (let i = 0; i < 90; i++) cob += c.cut(c.blob(c.rr(-600, 2200), c.rr(GY - 40, GY + 200), c.rr(10, 20), c.rr(5, 8), 8, 0.2), 0.4, 4);
    st.x(cob, shade(C.stone2, -0.1), 'opacity=".55"');
    streetL.add(st.out());
    // the fountain
    const fnt = sheet();
    fnt.p(c.cut([[380, GY - 6], [380, GY - 70], [520, GY - 70], [520, GY - 6]], 0.5, 6), C.stone);
    fnt.p(c.cut(c.rect(372, GY - 80, 156, 14), 0.4, 6), C.stone2);
    fnt.p(c.cut([[440, GY - 80], [440, GY - 150], [460, GY - 150], [460, GY - 80]], 0.4, 5), C.stone2);
    fnt.p(c.cut(c.circ(450, GY - 156, 12, 12), 0.3, 4), C.stone);
    fnt.x(c.cut(c.ell(450, GY - 74, 64, 5, 16), 0.2, 4), C.lake);
    streetL.add(fnt.out());
    const spout = streetL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [16, 4], [22, 60], 10), 3)}" fill="${C.lake2}" opacity=".8"/></g>`);

    // the house with the upper room: interior (behind), people inside, then the front flap
    const hIn = S.layer({ par: 0.42, sh: 3 });
    const inner = sheet();
    const X0 = HX - HW / 2, X1 = HX + HW / 2;
    inner.p(c.cut([[X0, H1], [X0, H2], [X1, H2], [X1, H1]], 0.4, 8), mix(C.plaster, C.apricot, 0.3));
    inner.p(c.cut([[X0, H1], [X1, H1], [X1, H1 - 16], [X0, H1 - 16]], 0.3, 8), mix(C.terracotta, C.clay, 0.5));
    let pat = '';
    for (let x = X0 + 20; x < X1 - 10; x += 34) pat += c.cut(c.star(x, H1 - 8, 5, 2, 4, 0), 0.2, 3);
    inner.x(pat, C.cream, 'opacity=".7"');
    // cushions along the back
    let cush = '';
    for (let x = X0 + 40; x < X1 - 30; x += 56) cush += c.cut(c.blob(x, H1 - 26, 24, 12, 10, 0.1), 0.4, 4);
    inner.p(cush, mix(C.jesusMantle, C.clay, 0.3));
    hIn.add(`<rect x="${X0}" y="${H2}" width="${HW}" height="${H1 - H2}" fill="${C.lampGlow}" opacity=".4"/>` + inner.out());
    const roomGlow = hIn.add(`<g opacity="0"><circle cx="${HX}" cy="${H1 - 80}" r="240" fill="url(#warm-glow)"/></g>`);
    const roomL = S.layer({ par: 0.42, sh: 4 });
    const pIn = S.puppet(roomL.add(person(c, TW.peter)));
    const jIn = S.puppet(roomL.add(person(c, TW.john)));
    roomL.add(`<g transform="translate(${HX} ${H1})">${lowTable(c, 240, 34)}</g>`);
    const dishes = [[HX - 90, loaf(c, 14)], [HX - 50, cup(c)], [HX - 10, matzah(c, 18)], [HX + 36, bowl(c, { food: 'stew' })], [HX + 84, cup(c, C.clay)]]
      .map(([x, m], i) => ({ i, x, el: roomL.add(`<g>${m}</g>`) }));
    const lamps = [HX - 150, HX + 150].map((x, i) => { const el = roomL.add(`<g>${oilLamp(c, { r: 110 })}</g>`); return { el, x, fl: el.querySelector('.flame'), gl: el.querySelector('.glow') }; });
    const lambDish = roomL.add(`<g>${sheet().p(c.cut(c.ell(0, -4, 34, 5, 16), 0.3, 4), C.stone2).out()}<g transform="translate(0 -6) scale(.42)">${lamb(c)}</g></g>`);

    // the facade: ground floor with a door, the upper floor's front as a flap, the outside stair
    const hf = S.layer({ par: 0.42, sh: 5 });
    const wall = mix(C.plaster, C.sand, 0.25);
    const g = sheet();
    g.p(c.cut([[X0, GY - 56], [X0, H1], [X1, H1], [X1, GY - 56]], 0.5, 8) + c.hole([[DOORX - 30, GY - 54], [DOORX - 30, GY - 140], ...c.arc(DOORX, GY - 140, 30, 26, PI, 2 * PI, 8), [DOORX + 30, GY - 54]], 0.3, 5), wall);
    g.p(c.cut(c.rect(X0 - 8, H1 - 4, HW + 16, 12), 0.3, 8), C.wood2);
    g.p(c.cut(c.rect(X0 - 10, H2 - 14, HW + 20, 16), 0.4, 8), C.roof);
    g.p(c.cut(c.rect(HX + 60, GY - 150, 44, 34), 0.3, 5), C.soilDark);
    hf.add(`<path d="${c.poly([[DOORX - 30, GY - 54], [DOORX - 30, GY - 140], ...c.arc(DOORX, GY - 140, 30, 26, PI, 2 * PI, 8), [DOORX + 30, GY - 54]])}" fill="${mix(C.soilDark, C.wood2, 0.4)}"/>` + g.out());
    // the stair up the left side, step by step
    const stair = sheet();
    const nS = 9, stepW = 17, stepH = (GY - 56 - H1) / nS;
    const sp = [[X0 - nS * stepW - 14, GY - 56]];
    for (let i = 0; i < nS; i++) { const x = X0 - (nS - i) * stepW - 14, y = GY - 56 - (i + 1) * stepH; sp.push([x, y], [x + stepW, y]); }
    sp.push([X0, H1], [X0, GY - 56]);
    stair.p(c.cut(sp, 0.3, 6), mix(C.stone, C.sand, 0.3));
    stair.x(c.ribbon([[X0 - nS * stepW - 14, GY - 56], [X0 - 14, H1 + 2]], 3), shade(C.stone, -0.18), 'opacity=".6"');
    hf.add(stair.out());
    // the flap: the front of the upper floor, hinged at the bottom
    const fl = sheet();
    fl.p(c.cut([[X0, 0], [X0, -(H1 - H2)], [X1, -(H1 - H2)], [X1, 0]], 0.5, 8), wall);
    fl.p(c.cut([[HX - 40, -30], [HX - 40, -110], ...c.arc(HX, -110, 40, 36, PI, 2 * PI, 8), [HX + 40, -30]], 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    fl.p(c.cut(c.rect(HX - 150, -120, 40, 50), 0.3, 5) + c.cut(c.rect(HX + 110, -120, 40, 50), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    const flap = hf.add(`<g>${fl.out()}</g>`);

    // people in the street
    const P = S.layer({ par: 0.42, sh: 5 });
    const water = S.puppet(P.add(person(c, { ...LOOK.waterman, holdF: '' })));
    const host = S.puppet(P.add(person(c, LOOK.host)));
    const peter = S.puppet(P.add(person(c, TW.peter)));
    const john = S.puppet(P.add(person(c, TW.john)));
    const jarEl = P.add(`<g>${waterJar(c)}</g>`);
    const drops = Array.from({ length: 4 }, (_, i) => ({ i, el: P.add(`<g>${drop(c, 3)}</g>`) }));
    const fx = S.layer({ par: 0.43, sh: 4 });
    const askB = fx.add(`<g>${speech(c, `<g transform="translate(-16 10)"><circle cy="-14" r="16" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, -14, 9, 12), 0.2, 3)}" fill="${C.halo}"/><path d="${c.cut([[-7, 10], [-5, -6], [5, -6], [7, 10]], 0.2, 3)}" fill="${C.linen}"/><path d="${c.cut(c.circ(0, -13, 5, 10), 0.2, 3)}" fill="${C.skin}"/></g><g transform="translate(18 6) scale(.7)">${lowTable(c, 50, 20)}</g><g transform="translate(22 -14) scale(.7)">${GLYPH.q(c)}</g>`, { w: 90, h: 62 })}</g>`);
    const upArrow = fx.add(`<g><path d="${c.cut([[-6, 0], [-6, -40], [-16, -40], [0, -62], [16, -40], [6, -40], [6, 0]], 0.4, 4)}" fill="${C.cream}"/></g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1500, 150, T, 1.2, 0.7);
      swing(cl, 700 + Math.sin(T * 0.1) * 30, 170, T, 1.5, 0.6, 1);
      pose(spout, { x: 462, y: GY - 150 });

      /* the man with the water jar: fills it, lifts it, walks up the street, goes in */
      const wK = [[0.9, [520, GY]], [1.95, [DOORX + 60, GY]], [2.15, [DOORX, GY - 4]]];
      const [wx, wy] = kf(t, wK, ease.sine);
      const ww = moving(t, wK, 1);
      const lift = es(t, 0.4, 0.8);
      const inside = es(t, 2.1, 2.3);
      const wArm = lerp(60, 165, lift);
      water.set({ x: wx, y: wy, s: 0.98, flip: false, o: 1 - inside, walk: ww ? wx * 0.05 : undefined, armF: 30 * (1 - lift), armB: wArm, head: -lift * 4 + (t < 0.4 ? 14 : 0), blink: blinkAt(T, 1) });
      // the jar: at the spout, then on his shoulder
      const shoulder = headAt(wx, wy, 0.98, false);
      const jx = lerp(466, shoulder[0] - 22, lift), jy = lerp(GY - 96, shoulder[1] + 4, lift);
      vis(jarEl, { x: jx, y: jy + (ww ? -Math.abs(Math.cos(wx * 0.05)) * 3.5 : 0), s: 0.95, r: -lift * 10, o: 1 - inside });
      drops.forEach((d) => {
        const k = ((T * 0.9 + d.i / 4) % 1);
        vis(d.el, { x: jx + 4, y: jy - 30 + k * 10, o: (1 - lift) * es(t, 0, 0.3) * (1 - k) });
      });

      /* Peter and John: in through the gate, meet him, follow, ask, climb, prepare */
      const pK = [[-0.3, [120, GY]], [0.7, [320, GY]], [1.05, [330, GY]], [2.0, [DOORX - 150, GY]], [3.95, [DOORX - 150, GY]], [4.3, [X0 - 150, GY - 60]], [4.8, [X0 - 20, H1 + 4]], [4.95, [X0 + 20, H1]]];
      const jK = pK.map(([tt, [x, y]], i) => [tt + (i > 4 ? 0.1 : 0.06), [x - (i > 4 ? 20 : 70), y + (i > 4 ? 2 : 6)]]);
      const [px, py] = kf(t, pK, ease.sine), [jx2, jy2] = kf(t, jK, ease.sine);
      const inRoom = es(t, 4.9, 5.0);
      const talk = es(t, 2.2, 2.45) * (1 - es(t, 3.0, 3.2));
      peter.set({ x: px, y: py, s: 0.98, flip: false, o: 1 - inRoom, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 20 + talk * 60 + bump(t, 0.6, 1.0) * 50, armB: 8, head: -es(t, 3.2, 3.5) * 16 * (1 - es(t, 4.0, 4.3)), blink: blinkAt(T, 3) });
      john.set({ x: jx2, y: jy2, s: 0.94, flip: false, o: 1 - inRoom, walk: moving(t, jK, 1) ? jx2 * 0.05 : undefined, armF: 14 + bump(t, 0.7, 1.1) * 30, head: -es(t, 3.2, 3.5) * 18 * (1 - es(t, 4.0, 4.3)), blink: blinkAt(T, 5) });
      const [phx, phy] = headAt(DOORX - 150, GY, 0.98, false);
      const ab = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(askB, { x: phx + 20, y: phy - 20, s: ab, o: ab > 0.01 ? 1 : 0 });

      // the master of the house at his door: points up
      const hOn = es(t, 2.2, 2.4);
      const point = es(t, 3.05, 3.3) * (1 - es(t, 4.4, 4.7));
      host.set({ x: DOORX + 10, y: GY - 4, s: 0.96, flip: true, o: hOn * (1 - es(t, 5.0, 5.3)), armF: 20 + point * 60, armB: 10 + point * 150, head: -point * 12, blink: blinkAt(T, 7) });
      const ua = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(upArrow, { x: DOORX + 60, y: H1 + 60 - Math.sin(T * 3) * 6, s: ua, o: ua > 0.01 ? 1 : 0 });

      // v15 — the front folds down: a large room, spread and ready
      const open = es(t, 3.15, 3.7, ease.out);
      vis(flap, { x: 0, y: H1, sy: Math.max(0.02, 1 - open * 1.0), o: 1 - es(t, 3.6, 3.75) });
      fade(roomGlow, open * 0.5 + es(t, 5.3, 5.8) * 0.5);

      // v16 — inside: they set the table and light the lamps
      const prep = seg(t, 5.0, 5.9);
      pIn.set({ x: HX - 60 + Math.sin(prep * PI * 2) * 40, y: H1 - 6, s: 0.72, flip: prep > 0.5, o: inRoom, armF: 40 + Math.sin(T * 3) * 10 * (prep > 0 && prep < 1 ? 1 : 0), armB: 20, head: 10, blink: blinkAt(T, 3) });
      jIn.set({ x: HX + 80 - Math.sin(prep * PI * 2) * 30, y: H1 - 4, s: 0.7, flip: true, o: inRoom, armF: 50, armB: 20, head: 8, blink: blinkAt(T, 5) });
      dishes.forEach((d) => {
        const k = es(t, 5.1 + d.i * 0.1, 5.3 + d.i * 0.1, ease.back);
        vis(d.el, { x: d.x, y: H1 - 34 - (1 - k) * 20, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const lk = es(t, 5.2, 5.4, ease.back);
      vis(lambDish, { x: HX + 4, y: H1 - 34, s: lk * 0.9, o: lk > 0.01 ? 1 : 0 });
      lamps.forEach((l, i) => {
        const lit = es(t, 5.55 + i * 0.12, 5.75 + i * 0.12);
        vis(l.el, { x: l.x, y: H1 - 22, s: 0.7, o: es(t, 3.5, 3.7) });
        pose(l.fl, { x: 35, y: -16, s: lit, sx: lit * (1 + Math.sin(T * 7 + i) * 0.08), sy: lit * (1 + Math.sin(T * 5.3 + i) * 0.1) });
        fade(l.gl, lit * 0.8);
      });

      sk.blend(SKY, ['#d2c8d6', '#f0d9bf', '#f5dcbf'], es(t, 4.5, 6));
      // phone: start further left (the man at the fountain, the two at the gate), end further right with less zoom
      // (the whole upper room, both of them inside it)
      S.cam.x = kf(t, S.portrait
        ? [[-0.5, -560], [0.8, -540], [1.2, -420], [2.0, 250], [2.6, 330], [3.3, 470], [4.2, 540], [5.0, 540]]
        : [[-0.5, -40], [0.8, 20], [1.2, 60], [2.0, 250], [2.6, 330], [3.3, 400], [4.2, 440], [5.0, 440]]);
      S.cam.z = kf(t, S.portrait
        ? [[-0.5, 1.06], [0.8, 1.12], [2.0, 1.08], [2.6, 1.14], [3.3, 1.06], [5.0, 1.1]]
        : [[-0.5, 1.06], [0.8, 1.12], [2.0, 1.08], [2.6, 1.14], [3.3, 1.06], [5.0, 1.2]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.8, 40], [2.0, 30], [3.3, -30], [4.2, -20], [5.0, -50]]);
    };
  },
};
