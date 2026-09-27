// Mk 10,46–52 — Jericho, the city of palms. Jesus goes in; then out again with his disciples and a great
// crowd, and blind Bartimaeus sits by the road on his mat with his bowl. When he hears it is Jesus, a sheet
// of frosted tracing paper slides down over the world — his blurred, sightless view — and only the voices
// come through, crisp. He cries out; many tell him to be quiet; he cries all the louder. Jesus stops:
// "Call him." He throws off his cloak, jumps up and comes. "What do you want?" — "Rabboni, that I may see."
// "Your faith has healed you" — the frosted sheet tears in two and falls away, colour floods back, his eyes
// open, and he follows Jesus up the road towards Jerusalem.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing, crowdPerson } from '../kit.js';
import { bush, rock, palm, grass } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, jericho, TWELVE, LOOK, say, slip, nameTag, beggarBowl, cloakFly, cloakSpread, voiceRings, headAt, spark } from './lib.js';

const GY = 668;
const BX = 1010, BY = 700;       // where Bartimaeus sits
const JSTOP = 770;               // where Jesus stops
const CITY = 250;                // Jericho's gate

export default {
  id: 'm10-jericho',
  beats: [
    { v: 46, text: 'Tak przyszli do Jerycha.' },
    { v: 46, cont: true, text: 'Gdy wraz z uczniami i sporym tłumem wychodził z Jerycha, niewidomy żebrak, Bartymeusz, syn Tymeusza, siedział przy drodze.' },
    { v: 47, text: 'Ten słysząc, że to jest Jezus z Nazaretu, zaczął wołać:' },
    { v: 47, cont: true, text: '«Jezusie, Synu Dawida, ulituj się nade mną!»' },
    { v: 48, text: 'Wielu nastawało na niego, żeby umilkł.' },
    { v: 48, cont: true, text: 'Lecz on jeszcze głośniej wołał: «Synu Dawida, ulituj się nade mną!»' },
    { v: 49, text: 'Jezus przystanął i rzekł: «Zawołajcie go!»' },
    { v: 49, cont: true, text: 'I przywołali niewidomego, mówiąc mu: «Bądź dobrej myśli, wstań, woła cię».' },
    { v: 50 },
    { v: 51, text: 'A Jezus przemówił do niego: «Co chcesz, abym ci uczynił?»' },
    { v: 51, cont: true, text: 'Powiedział Mu niewidomy: «Rabbuni, żebym przejrzał».' },
    { v: 52, text: 'Jezus mu rzekł: «Idź, twoja wiara cię uzdrowiła».' },
    { v: 52, cont: true, text: 'Natychmiast przejrzał i szedł za Nim drogą.' },
  ],
  cam: { x: [-260, 160], y: [-30, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { skyCols: ['#d3e0d8', '#f1e4c6', '#f7e3c2'], road: false, jer: 0.85, jerX: 1330, farY: 400, hillY: 470, groundY: 570, trees: 10, treeCol: C.olive, hillCol: mix(C.hillMid, C.dune, 0.35), groundCol: mix(C.sand, C.dune, 0.3), sunAt: [1260, 150], clouds: [[560, 130, 170], [1040, 100, 120]] });
    const G = R.groundL;
    // the road out of Jericho, climbing towards Jerusalem
    const road = [];
    for (let i = 0; i <= 26; i++) { const x = -700 + i * 120; road.push([x, 690 - Math.max(0, x - 900) * 0.12]); }
    G.add(sheet().p(c.ribbon(road, 96), mix(C.sand2, C.dune, 0.15)).out());
    const cityL = S.layer({ par: 0.32, sh: 3 });
    cityL.add(`<g transform="translate(${CITY} 600)">${jericho(c, 1.5)}</g>`);
    cityL.add(palm(c, 560, 620, 200) + palm(c, 640, 624, 170) + palm(c, 1480, 620, 190));

    /* the crowd, the disciples and Jesus */
    const crowdL = S.layer({ par: 0.5, sh: 4 });
    const CROWD = Array.from({ length: 16 }, (_, i) => {
      const row = i % 2;
      const x = 380 + i * 58 + c.rr(-14, 14);
      return { i, x, y: 612 + row * 22, s: 0.6 + row * 0.08, p: S.puppet(crowdL.add(person(c, crowdPerson(c)))), seed: c.rr(0, 9), d: c.rr(0, 0.3) };
    });
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 3, 1, 2, 6, 7].map((k, i) => ({ i, p: S.puppet(pL.add(person(c, TWELVE[k].o))), seed: c.rr(0, 9), dx: -90 - i * 52, dy: (i % 2) * 16 - 10 }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    // the people who hush him, then call him
    const NEAR = [[1110, GY + 20, true], [1180, GY + 8, true], [905, GY + 24, false]].map(([x, y, flip], i) => ({ i, x, y, flip, p: S.puppet(pL.add(person(c, crowdPerson(c, { hairStyle: i === 2 ? 'veil' : 'short', beard: i === 2 ? 'none' : 'short' })))), seed: c.rr(0, 9) }));

    const matL = S.layer({ par: 0.5, sh: 4 });
    const mat = matL.add(`<g>${cloakSpread(c, mix(C.sand2, C.wood3, 0.4))}</g>`);
    const bowl = matL.add(`<g>${beggarBowl(c)}</g>`);
    const cloak = matL.add(`<g opacity="0">${cloakFly(c)}</g>`);

    /* the frosted sheet: his blurred sightless view (two halves that can tear apart) */
    const tear = [];
    for (let i = 0; i <= 16; i++) tear.push([800 + c.rr(-26, 26) + (i % 2 ? 12 : -12), -700 + (2600 * i) / 16]);
    const vellum = (side) => {
      const L = S.layer({ par: 0, sh: 1, flat: true, pad: 600 });
      const pts = side < 0 ? [[-1800, -700], ...tear, [-1800, 1900]] : [[3400, -700], ...tear, [3400, 1900]];
      L.add(`<path d="${c.poly(pts)}" fill="#ebe7e0" opacity=".86"/><path class="grain" d="${c.poly(pts)}"/><path d="${c.ribbon(tear, 3)}" fill="#fbfaf6" opacity=".55"/>`);
      L.fade(0);
      return L;
    };
    const vL = vellum(-1), vR = vellum(1);

    /* Bartimaeus (always crisp, above the frosted sheet) */
    const bL = S.layer({ par: 0.5, sh: 5 });
    const bSit = S.puppet(bL.add(person(c, { ...LOOK.bart, pose: 'sit' })));
    const bStand = S.puppet(bL.add(person(c, { ...LOOK.bart, mantle: null })));
    const bSee = S.puppet(bL.add(person(c, { ...LOOK.bart, mantle: null, eyes: 'open' })));
    const name = hanging(bL, nameTag(c, tr(['Bartymeusz,', 'syn Tymeusza'], ['Bartimaeus,', 'son of Timaeus']), { size: 16 }), { x: BX, y: 380, len: 700 });
    const jGlow = bL.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/><circle r="60" fill="url(#warm-glow)"/></g>`);
    const eyeLight = bL.add(`<g opacity="0">${spark(c, 12)}</g>`);
    const burst = bL.add(`<g opacity="0">${rays(c, { n: 16, r0: 20, r1: 260, spread: 0.06, color: '#fff3cf' })}</g>`);

    /* voices and words */
    const wL = S.layer({ par: 0.5, sh: 6 });
    const rings = voiceRings(wL, c, { n: 3, color: C.terracotta, r: 30, w: 4 });
    const hear = [0, 1, 2].map((i) => wL.add(`<g opacity="0">${slip(c, tr('Jezus z Nazaretu!', 'Jesus of Nazareth!'), { size: 17 })}</g>`));
    const cry1 = wL.add(`<g opacity="0">${say(c, tr(['Jezusie, Synu Dawida,', 'ulituj się nade mną!'], ['Jesus, son of David,', 'have mercy on me!']), { size: 18, side: -1, jag: true })}</g>`);
    const hush = NEAR.map(() => wL.add(`<g opacity="0">${say(c, tr('Cicho!', 'Quiet!'), { size: 18, side: 1 })}</g>`));
    const cry2 = wL.add(`<g opacity="0">${say(c, tr(['SYNU DAWIDA,', 'ULITUJ SIĘ NADE MNĄ!'], ['SON OF DAVID,', 'HAVE MERCY ON ME!']), { size: 19, side: -1, jag: true, bold: true })}</g>`);
    const callHim = wL.add(`<g opacity="0">${say(c, tr('Zawołajcie go!', 'Call him!'), { size: 19, side: 1 })}</g>`);
    const cheer = wL.add(`<g opacity="0">${say(c, tr(['Bądź dobrej myśli,', 'wstań, woła cię!'], ['Cheer up!', 'Get up. He is calling you!']), { size: 17, side: 1 })}</g>`);
    const what = wL.add(`<g opacity="0">${say(c, tr(['Co chcesz,', 'abym ci uczynił?'], ['What do you want', 'me to do for you?']), { size: 18, side: 1 })}</g>`);
    const see = wL.add(`<g opacity="0">${say(c, tr(['Rabbuni,', 'żebym przejrzał!'], ['Rabboni,', 'that I may see again!']), { size: 18, side: -1 })}</g>`);
    const go_ = wL.add(`<g opacity="0">${say(c, tr(['Idź, twoja wiara', 'cię uzdrowiła.'], ['Go your way. Your faith', 'has made you well.']), { size: 18, side: 1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 160, 1000, 230, C.olive, C.moss) + rock(c, 1440, 990, 200, 66, C.rock2) + grass(c, { x0: -300, x1: 1900, y: 980, n: 16, h: 30, color: C.olive }));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 13) * 40 });

      /* where is everybody? beat 0: into Jericho; beat 1: out again with a crowd */
      const inK = es(t, -0.5, 0.97);
      const outK = es(t, 1.0, 1.9);
      const stop = es(t, 6.02, 6.2);
      const follow = es(t, 12.25, 13.2);
      // Jesus walks: towards the gate (in), then from the gate along the road, stopping near Bartimaeus
      let jx = inK < 1 ? lerp(640, CITY + 60, inK) : lerp(CITY + 70, JSTOP - 70, outK);
      jx = lerp(jx, JSTOP, es(t, 2.0, 6.1));
      jx += follow * 420;
      const inGate = inK >= 1 && outK <= 0;
      const jWalk = (inK > 0 && inK < 1) || (outK > 0 && outK < 1) || (t > 2 && t < 6.1) || (follow > 0 && follow < 1);
      const turnIn = inK < 1;
      const ask = es(t, 9.02, 9.25) * (1 - es(t, 10.9, 11.05));
      const touch = es(t, 11.02, 11.3) * (1 - es(t, 12.2, 12.4));
      const jO = inGate ? 0 : (t < 1 ? 1 - es(t, 0.88, 0.97) : 1) * (outK > 0 && outK < 0.1 ? seg(outK, 0, 0.1) : 1);
      jesus.set({ x: jx, y: GY, s: 1.02, flip: turnIn, o: jO, walk: jWalk ? jx * 0.06 : undefined, armF: 14 + es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.1)) * 90 + ask * 50 + touch * 85, armB: es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.1)) * 40 + ask * 30, head: -touch * 6 + Math.sin(T * 0.6), blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = jx + (turnIn ? -d.dx * 0.8 : d.dx);
        d.p.set({ x, y: GY + d.dy, s: 0.86, flip: turnIn, o: inGate ? 0 : (t < 1 ? 1 - es(t, 0.86, 0.96) : 1) * (outK > 0 && outK < 0.2 ? seg(outK, 0.05 + d.i * 0.02, 0.2) : 1), walk: jWalk ? x * 0.06 + d.i : undefined, head: -es(t, 3, 3.3) * 4, blink: blinkAt(T, d.seed) });
      });
      CROWD.forEach((m) => {
        const k = seg(t, 1.0 + m.d, 1.9 + m.d);
        const x = lerp(CITY + 40, m.x, ease.out(k)) + follow * 380;
        const turnTo = es(t, 3.02, 3.3) * (1 - es(t, 12.2, 12.5));
        m.p.set({ x, y: m.y, s: m.s, flip: turnTo > 0.5 && m.x < BX ? false : false, o: k > 0 ? 1 : 0, walk: (k > 0 && k < 1) || (follow > 0 && follow < 1) ? x * 0.06 + m.i : undefined, head: -turnTo * 4, armF: es(t, 12.3, 12.6) * (m.i % 3 === 0 ? 120 : 30), blink: blinkAt(T, m.seed) });
      });

      /* Bartimaeus by the road */
      const reveal = es(t, 1.2, 1.5);
      const cry = bump(t, 3.05, 3.95), loud = bump(t, 5.05, 5.98);
      const upK = es(t, 8.15, 8.22);
      const come = es(t, 8.3, 8.9);
      const healed = es(t, 12.05, 12.12);
      const bx = lerp(BX, JSTOP + 96, come) + follow * 330;
      pose(mat, { x: BX + 6, y: BY + 2, s: 0.8, o: reveal });
      pose(bowl, { x: BX - 56, y: BY + 4, o: reveal * (1 - es(t, 8.1, 8.2) * 0) });
      bSit.set({ x: BX, y: BY, s: 0.94, flip: true, o: reveal * (1 - upK), armF: 40 + cry * 70 + loud * 110 + es(t, 7.1, 7.4) * 20, armB: cry * 120 + loud * 160, head: -8 - cry * 8 - loud * 12 + es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.05)) * 10, lean: -loud * 4, blink: 0 });
      const sw = come > 0 && come < 1;
      bStand.set({ x: bx, y: BY - 10 - bump(t, 8.15, 8.35) * 30, s: 0.96, flip: true, o: upK * (1 - healed), walk: sw ? bx * 0.07 : undefined, armF: 60 + bump(t, 8.2, 8.5) * 60 + es(t, 10.02, 10.3) * 30, armB: 30 + bump(t, 8.15, 8.4) * 100 + es(t, 10.02, 10.3) * 50, head: -6, blink: 0 });
      bSee.set({ x: bx, y: BY - 10, s: 0.96, flip: follow < 0.02, o: healed, walk: follow > 0 && follow < 1 ? bx * 0.07 : undefined, armF: 30 + (1 - follow) * es(t, 12.1, 12.3) * 90, armB: (1 - follow) * es(t, 12.1, 12.3) * 150, head: -8, blink: blinkAt(T, 6) });
      const cf = seg(t, 8.12, 8.6);
      pose(cloak, { x: BX - 30 + cf * 240, y: BY - 120 - Math.sin(cf * Math.PI) * 170 + cf * 90, r: cf * 200, s: 0.8 - cf * 0.1, o: cf > 0 ? 1 : 0 });
      swing(name, BX, 360 - (1 - es(t, 1.35, 1.7, ease.back)) * 1100 - es(t, 1.95, 2.2) * 1100, T, 1.4, 0.8);

      /* the frosted sheet: his view (beats 2–3), again before the healing (9–11), torn away (12) */
      const fog = Math.max(es(t, 2.02, 2.35) * (1 - es(t, 3.95, 4.2)), es(t, 9.05, 9.4) * (1 - healed * 0));
      const torn = es(t, 12.05, 12.55);
      vL.fade(fog * (1 - torn)); vR.fade(fog * (1 - torn));
      vL.shift(-torn * 700, torn * 300); vR.shift(torn * 700, torn * 220);
      const [jhx, jhy] = headAt(jx, GY, 1.02, false);
      pose(jGlow, { x: jhx, y: jhy + 40, s: 0.8 + Math.sin(T * 1.4) * 0.04, o: es(t, 9.1, 9.4) * (1 - torn) });
      const [bhx, bhy] = headAt(bx, BY - 10, 0.96, true);
      pose(eyeLight, { x: bhx - 8, y: bhy - 2, s: 0.8 + touch * 0.6, o: touch * (1 - es(t, 12.3, 12.5)) });
      pose(burst, { x: bhx, y: bhy, s: 0.4 + torn * 1.2, r: t * 20, o: bump(t, 12.05, 12.8) });

      /* what he hears */
      hear.forEach((h, i) => {
        const k = seg(t, 2.1 + i * 0.18, 2.75 + i * 0.18);
        pose(h, { x: lerp(jx + 40 + i * 60, BX - 40, k), y: GY - 200 - i * 34 + Math.sin(k * Math.PI) * -30, s: 0.9, r: -4 + i * 4, o: Math.sin(k * Math.PI) });
      });
      const [sx, sy] = headAt(BX, BY, 0.94, true, 'sit');
      rings(sx - 10, sy + 4, Math.max(es(t, 2.1, 2.3) * (1 - es(t, 2.9, 3.1)) * 0.8, cry, loud * 1.2), T, { spread: 1.8 + loud, dir: 0 });
      pose(cry1, { x: BX - 20, y: BY - 190, s: es(t, 3.05, 3.3, ease.back), o: t > 3.05 && t < 4.05 ? 1 - es(t, 3.9, 4.05) : 0 });
      pose(cry2, { x: BX - 20, y: BY - 200, s: es(t, 5.05, 5.3, ease.back) * 1.18, o: t > 5.05 && t < 6.05 ? 1 - es(t, 5.9, 6.05) : 0 });

      /* the many who rebuke him (4), then call him kindly (7) */
      NEAR.forEach((n) => {
        const rebuke = es(t, 4.05 + n.i * 0.06, 4.3 + n.i * 0.06) * (1 - es(t, 5.9, 6.1));
        const kind = es(t, 7.05, 7.3) * (1 - es(t, 8.1, 8.3));
        n.p.set({ x: n.x + follow * 360 + (n.i === 2 ? es(t, 8.2, 8.5) * 40 : 0), y: n.y - (n.i === 2 ? es(t, 8.2, 8.5) * 34 : 0), o: es(t, 1.2, 1.5), s: 0.9, flip: n.flip, lean: rebuke * (n.flip ? -8 : 8) + kind * (n.flip ? -12 : 12), armF: rebuke * 150 + kind * 70, armB: rebuke * 30 + kind * (n.i === 0 ? 110 : 20), head: rebuke * 10 + kind * 12, walk: follow > 0 && follow < 1 ? n.x * 0.07 : undefined, blink: blinkAt(T, n.seed) });
        pose(hush[n.i], { x: n.x + (n.flip ? -20 : 20), y: n.y - 190, s: es(t, 4.1 + n.i * 0.08, 4.3 + n.i * 0.08, ease.back) * 0.9, o: t > 4.1 && t < 5.1 ? 1 - es(t, 4.95, 5.1) : 0 });
      });
      pose(callHim, { x: JSTOP + 20, y: GY - 226, s: es(t, 6.05, 6.3, ease.back), o: t > 6.05 && t < 7.05 ? 1 - es(t, 6.9, 7.05) : 0 });
      pose(cheer, { x: NEAR[0].x - 150, y: GY - 196, s: es(t, 7.05, 7.3, ease.back), o: t > 7.05 && t < 8.05 ? 1 - es(t, 7.9, 8.05) : 0 });
      pose(what, { x: JSTOP + 20, y: GY - 226, s: es(t, 9.05, 9.3, ease.back), o: t > 9.05 && t < 10.05 ? 1 - es(t, 9.9, 10.05) : 0 });
      pose(see, { x: JSTOP + 110, y: BY - 206, s: es(t, 10.05, 10.3, ease.back), o: t > 10.05 && t < 11.05 ? 1 - es(t, 10.9, 11.05) : 0 });
      pose(go_, { x: JSTOP + 20, y: GY - 226, s: es(t, 11.05, 11.3, ease.back), o: t > 11.05 && t < 12.05 ? 1 - es(t, 11.9, 12.05) : 0 });

      /* camera: to the city (0), along the road to him (1…), close on the two of them (9–11), then up the road (12) */
      S.cam.x = -220 * (1 - es(t, 0.9, 1.9)) + es(t, 1.9, 2.4) * 60 + follow * 100;
      S.cam.z = 1 + es(t, 1.9, 2.4) * 0.04 + es(t, 8.9, 9.4) * 0.06 * (1 - es(t, 12.2, 12.8));
      S.cam.y = es(t, 8.9, 9.4) * 20 * (1 - es(t, 12.2, 12.8));
    };
  },
};
