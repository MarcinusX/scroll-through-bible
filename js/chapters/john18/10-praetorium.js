// J 18,28–32 — the praetorium at first light, cut open at its threshold: the paved square outside, Pilate's cool hall
// inside. They lead Jesus from Caiaphas across the square and in through the door (a tag: the praetorium). It is
// early: the sun climbs over the city and the Temple. The leaders stop at the threshold — a thin line of light on the
// stone — so as not to be defiled but to eat the Passover (a plate: the lamb, the unleavened bread, the cup). Pilate
// comes out to them: "What accusation do you bring against this man?" "If He were not an evildoer we would not have
// handed Him over": a crooked scroll. "Take Him yourselves and judge Him by your law": a scroll of the Law is pushed
// back to them. "It is not lawful for us to put anyone to death": the sword belongs to Rome (a plate). "That the word of
// Jesus might be fulfilled, by what kind of death He should die": a quiet plate — His own word, "when I am lifted up",
// and a small cross far away on a hill in the light.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  praetorium, PR, pilate, soldier, highPriest, priest, guardOpts, ropeHands, say, nameTag, crookedScroll, scrollRolled, lamb, matzahRound, chalice, discPlate, sword,
  lampSet, hanging, vis, kf, moving, headAt, hand, withFace, faceBits, person, pose, fade, lerp, mix, shade, sheet, tr, blinkAt, C, JESUS, PI, PREDAWN, DAWN, MORNING,
} from './lib.js';

const { FLOOR, DOOR, JX } = PR;
const LEAD = [{ k: 'cai', x: 470 }, { k: 'p1', x: 400, y: -18, s: 0.9 }, { k: 'p2', x: 340, y: 4 }, { k: 'g1', x: 270, y: -16, s: 0.9 }, { k: 'g2', x: 210, y: 6 }];
const PX_OUT = 552;

export default {
  id: 'j18-praetorium',
  beats: [
    { v: 28, text: 'Od Kajfasza zaprowadzili Jezusa do pretorium.' },
    { v: 28, cont: true, text: 'A było to wczesnym rankiem.' },
    { v: 28, cont: true, text: 'Oni sami jednak nie weszli do pretorium, aby się nie skalać, lecz aby móc spożyć Paschę.' },
    { v: 29, text: 'Dlatego Piłat wyszedł do nich na zewnątrz' },
    { v: 29, cont: true, text: 'i rzekł: «Jaką skargę wnosicie przeciwko temu człowiekowi?»' },
    { v: 30 },
    { v: 31, text: 'Piłat więc rzekł do nich: «Weźcie Go wy i osądźcie według swojego prawa!»' },
    { v: 31, cont: true, text: 'Odpowiedzieli mu Żydzi: «Nam nie wolno nikogo zabić».' },
    { v: 32 },
  ],
  cam: { x: [-520, 160], y: [-120, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const R = praetorium(S, { skyCols: PREDAWN });
    // inside: soldiers, Jesus, Pilate
    const inL = S.layer({ par: PR.P, sh: 5 });
    const sols = [0, 1].map((i) => S.puppet(inL.add(soldier(c, i + 1))));
    const jEl = inL.add(withFace(person(c, { ...JESUS, holdF: ropeHands(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    R.jamb();
    // outside: Caiaphas, priests, temple guards
    const outL = S.layer({ par: PR.P, sh: 5 });
    const lead = LEAD.map((d, i) => {
      const m = d.k === 'cai' ? highPriest(c) : d.k[0] === 'p' ? priest(c, i) : person(c, guardOpts(c));
      return { ...d, i, seed: c.rr(0, 9), p: S.puppet(outL.add(m)) };
    });
    const guide = S.puppet(outL.add(person(c, guardOpts(c))));
    const pilL = S.layer({ par: PR.P, sh: 5 });
    const pil = S.puppet(pilL.add(pilate(c)));
    const lineL = S.layer({ par: PR.P, sh: 0, flat: true });
    const line = lineL.add(`<g><rect x="${DOOR - 50}" y="${FLOOR - 4}" width="76" height="10" fill="${C.halo}" opacity=".9"/><ellipse cx="${DOOR - 12}" cy="${FLOOR}" rx="70" ry="16" fill="url(#halo-glow)"/></g>`);

    const fx = S.layer({ par: PR.P, sh: 4 });
    const tag = hanging(fx, nameTag(c, tr('pretorium', 'the Praetorium'), { size: 18 }), { x: 0, y: 0, len: 800 });
    const pascha = hanging(fx, `${sheet().p(c.cut(c.ell(0, 0, 110, 70, 30), 0.5, 6), C.cream).p(c.cut(c.ell(0, 0, 100, 60, 30), 0.4, 6), C.parchment).out()}<g transform="translate(-44 22) scale(.7)">${lamb(c)}</g><g transform="translate(28 4)">${matzahRound(c, 20)}</g><g transform="translate(62 26) scale(.5)">${chalice(c, 50)}</g><g transform="translate(0 70)">${nameTag(c, tr('Pascha', 'the Passover'), { size: 15 })}</g>`, { x: 0, y: 0, len: 800 });
    const q = fx.add(`<g>${say(c, [tr('Jaką skargę wnosicie', 'What accusation do you bring'), tr('przeciwko temu człowiekowi?', 'against this man?')], { size: 16, side: -1 })}</g>`);
    const crook = hanging(fx, `<g transform="scale(1.5)">${crookedScroll(c, 70, 46)}</g><g transform="translate(0 44)">${nameTag(c, tr('złoczyńca?', 'an evildoer?'), { size: 15, dark: true })}</g>`, { x: 0, y: 0, len: 800 });
    const law = fx.add(`<g><circle r="46" fill="url(#halo-glow)" opacity=".5"/><g transform="scale(1.3)">${scrollRolled(c, 40)}</g><g transform="translate(0 30)">${nameTag(c, tr('wasze prawo', 'your law'), { size: 14 })}</g></g>`);
    const rome = hanging(fx, `${discPlate(c, `<g transform="translate(-4 26) rotate(-20) scale(1.1)">${sword(c, 60)}</g><text x="0" y="-14" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" fill="${C.terracotta}" letter-spacing="2">SPQR</text>`, { r: 52, rim: C.curtain2 })}`, { x: 0, y: 0, len: 800 });
    const clip = S.id('lift');
    const lifted = hanging(fx, `${sheet().p(c.cut(c.rect(-120, -2, 240, 150), 0.5, 8), C.wood3).out()}<defs><clipPath id="${clip}"><rect x="-112" y="6" width="224" height="134"/></clipPath></defs><g clip-path="url(#${clip})"><rect x="-112" y="6" width="224" height="134" fill="${mix(C.dawn, C.cream, 0.4)}"/><circle cx="0" cy="70" r="90" fill="url(#halo-glow)"/><path d="${c.cut([[-120, 150], [-120, 116], [-40, 100], [0, 92], [40, 100], [120, 118], [120, 150]], 0.8, 8)}" fill="${mix(C.rock2, C.dune, 0.4)}"/><path d="${c.cut([[-2.5, 96], [-2.5, 54], [-15, 54], [-15, 48], [-2.5, 48], [-2.5, 34], [2.5, 34], [2.5, 48], [15, 48], [15, 54], [2.5, 54], [2.5, 96]], 0.2, 3)}" fill="${mix(C.wood2, C.ink, 0.3)}"/></g><g transform="translate(0 150)">${nameTag(c, tr('«…gdy zostanę wywyższony…»', '“…when I am lifted up…”'), { size: 15 })}</g>`, { x: 0, y: 0, len: 800 });

    // phone: He stands nearer the threshold, so the leaders outside and He inside fit one narrow frame
    const JXP = S.portrait ? 860 : JX;
    return (t, time) => {
      const T = time;
      const day = es(t, 1.0, 1.9);
      R.sky.blend(PREDAWN, DAWN, day);
      vis(R.sun, { x: 330, y: lerp(560, 250, es(t, 0.9, 1.9, ease.out)) + (T ? Math.sin(T * 0.5) * 2 : 0), o: 1 });
      lampSet(R.lamp, 1 - es(t, 1.5, 2.2) * 0.6, T);
      R.beamL.fade(0.4 + day * 0.6);

      /* v28 — led from Caiaphas into the praetorium */
      // He waits ahead of the leaders, not behind Caiaphas
      const jK = [[-0.5, [-160, FLOOR + 6]], [0.9, [525, FLOOR + 6]], [2.05, [540, FLOOR + 6]], [2.6, [JXP, FLOOR]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      jesus.set({ x: jx, y: jy, s: 1.0, flip: false, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, amt: 0.7, armF: 26, armB: 12, head: 6 - es(t, 8.05, 8.4) * 10, blink: blinkAt(T) });
      fade(jEl.querySelector('[data-part="sad"]'), 0.3);
      const gK = [[-0.5, [-70, FLOOR + 10]], [0.9, [596, FLOOR + 10]], [2.3, [600, FLOOR + 10]], [3.0, [130, FLOOR - 12]]];
      const [gx, gy] = kf(t, gK, ease.sine);
      const handOver = es(t, 2.05, 2.3);
      guide.set({ x: gx, y: gy, s: 0.94, flip: t > 2.3, walk: moving(t, gK, 1) ? gx * 0.05 : undefined, armF: 30, armB: 8, blink: blinkAt(T, 12) });
      sols.forEach((so, i) => {
        const x = i === 0 ? lerp(760, S.portrait ? 1010 : JX + 110, handOver) : JXP - (S.portrait ? 106 : 120);
        so.set({ x, y: FLOOR + (i ? -8 : 2), s: 0.96, flip: i === 1 ? false : true, armF: 34, armB: 8, blink: blinkAt(T, 20 + i) });
      });
      lead.forEach((m) => {
        const k = es(t, 0.1 + m.i * 0.05, 0.95 + m.i * 0.05, ease.sine);
        const x = lerp(m.x - 700, m.x, k);
        const talk = m.k === 'cai' ? bump(t, 5.05, 5.9) + bump(t, 7.05, 7.9) : m.k === 'p1' ? bump(t, 7.1, 7.9) * 0.8 : 0;
        const stop = m.k === 'cai' ? bump(t, 2.1, 2.9) : 0;
        m.p.set({ x, y: FLOOR + (m.y ?? 0), s: m.s ?? 1, flip: false, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 16 + talk * 60 + stop * 60 + (m.k === 'cai' ? bump(t, 7.1, 7.9) * 30 : 0), armB: 6 + stop * 30 + bump(t, 7.1, 7.9) * 60 * (m.k !== 'g1' && m.k !== 'g2' ? 1 : 0), head: -talk * 4, blink: blinkAt(T, m.seed) });
      });
      vis(line, { x: 0, y: 0, o: es(t, 2.1, 2.4) * (1 - es(t, 8.1, 8.5) * 0.5) });

      /* Pilate: out to them */
      const pK = [[2.9, [1180, FLOOR]], [3.05, [1180, FLOOR]], [3.75, [PX_OUT, FLOOR + 4]]];
      const [px, py] = kf(t, pK, ease.sine);
      const speak = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.05)) + es(t, 6.05, 6.25) * (1 - es(t, 6.9, 7.05));
      pil.set({ x: px, y: py, s: 1.0, flip: t > 3.0, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 22 + speak * 50 + es(t, 6.1, 6.4) * (1 - es(t, 6.9, 7.1)) * 30, armB: 10 + es(t, 6.1, 6.3) * (1 - es(t, 6.9, 7.1)) * 60, head: -speak * 4, blink: blinkAt(T, 13) });

      /* words and plates */
      const tk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 0.95, 1.1, ease.in));
      vis(tag, { x: DOOR + 120, y: 250 - (1 - tk) * 800, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: tk > 0.01 ? 1 : 0 });
      const pk = es(t, 2.15, 2.45, ease.out) * (1 - es(t, 2.95, 3.1, ease.in));
      vis(pascha, { x: 450, y: 320 - (1 - pk) * 800, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: pk > 0.01 ? 1 : 0 });
      const [phx, phy] = headAt(px, py, 1.0, true);
      const qk = es(t, 4.12, 4.32, ease.back) * (1 - es(t, 4.9, 5.0));
      vis(q, { x: phx - 14, y: phy - 20, s: qk, o: qk > 0.01 ? 1 : 0 });
      const ck = es(t, 5.1, 5.4, ease.out) * (1 - es(t, 5.9, 6.05, ease.in));
      vis(crook, { x: 420, y: 330 - (1 - ck) * 800, r: T ? Math.sin(T * 1.1) * 2 : 0, o: ck > 0.01 ? 1 : 0 });
      const lk = es(t, 6.1, 6.6, ease.sine);
      vis(law, { x: lerp(PX_OUT - 60, 380, lk), y: lerp(560, 470, lk) - Math.sin(lk * PI) * 60, r: lk * -10, o: lk > 0.01 && t < 7.05 ? 1 - es(t, 6.9, 7.05) : 0 });
      const rk = es(t, 7.1, 7.4, ease.out) * (1 - es(t, 7.9, 8.05, ease.in));
      vis(rome, { x: PX_OUT + 20, y: 330 - (1 - rk) * 800, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: rk > 0.01 ? 1 : 0 });
      const wk = es(t, 8.1, 8.45, ease.out);
      vis(lifted, { x: S.portrait ? 770 : 700, y: 220 - (1 - wk) * 800, r: T ? Math.sin(T * 0.7) * 1 : 0, o: wk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, S.portrait
        ? [[0, -380], [1, -340], [2.9, -340], [3.1, -60], [3.8, -380], [8, -380], [8.4, -120], [9, -120]]
        : [[0, -380], [1, -320], [2, -300], [2.6, -220], [3, -60], [3.8, -300], [5, -360], [6, -320], [7, -300], [8, -300], [8.4, -160], [9, -160]]);
      S.cam.y = kf(t, [[0, 40], [1, -40], [2, 20], [3, 10], [4, 20], [8, 20], [8.4, -30], [9, -40]]);
      S.cam.z = kf(t, S.portrait
        ? [[0, 1.04], [1, 1.02], [2, 1.04], [8, 1.04], [9, 1.06]]
        : [[0, 1.04], [1, 1.02], [2, 1.08], [2.6, 1.04], [3, 1.1], [3.8, 1.14], [5, 1.18], [6, 1.14], [7, 1.16], [8, 1.12], [8.4, 1.04], [9, 1.06]]);
    };
  },
};
