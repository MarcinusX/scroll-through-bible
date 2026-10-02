// Mt 3,7 — Pharisees and Sadducees come down to the river in their fine robes, heads high, to be baptised.
// John turns, sees them — and calls them a brood of vipers. The sky dims, a storm with a red glow gathers
// behind (the wrath to come), and a painted picture comes down between them: a dry field on fire and
// vipers slithering out of the grass, fleeing before the flames.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { lightning } from '../../assets/things.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, voiceRings, jordanSet, shell, pharisee, sadducee, nameTag, question, viper, fireLine, hang2, DAY, WRATH, tr } from './lib.js';

const PI = Math.PI;
const JX = 980, WADE = 702, BANK = 776;
const FX = 690, FY = 250, FW = 470, FH = 250;      // the hung picture (top centre)

/** the painted picture: a frame, dusk sky, hills and a dry field (origin: top centre of the frame) */
function wrathPicture(c) {
  const s = sheet();
  const x0 = -FW / 2, y0 = 0;
  s.p(c.cut(c.rect(x0 - 14, y0 - 14, FW + 28, FH + 28), 0.6, 10), C.wood);
  s.x(c.ribbon([[x0 - 6, y0 - 6], [x0 + FW + 6, y0 - 6], [x0 + FW + 6, y0 + FH + 6], [x0 - 6, y0 + FH + 6], [x0 - 6, y0 - 4]], 2), C.sun, 'opacity=".7"');
  s.p(c.cut(c.rect(x0, y0, FW, FH), 0.3, 10), mix(WRATH[1], WRATH[2], 0.4));
  s.x(c.poly(c.rect(x0, y0, FW, FH * 0.35)), mix(WRATH[0], WRATH[1], 0.5), 'opacity=".8"');
  s.p(c.cut([[x0, y0 + FH * 0.62], [x0 + 90, y0 + FH * 0.5], [x0 + 200, y0 + FH * 0.56], [x0 + 330, y0 + FH * 0.46], [x0 + FW, y0 + FH * 0.54], [x0 + FW, y0 + FH], [x0, y0 + FH]], 0.6, 8), mix(C.duskViolet, C.clay, 0.4));
  s.p(c.cut([[x0, y0 + FH * 0.7], [x0 + FW, y0 + FH * 0.66], [x0 + FW, y0 + FH], [x0, y0 + FH]], 0.6, 8), mix(C.wheat2, C.clay, 0.3));
  let gr = '';
  for (let x = x0 + 6; x < x0 + FW - 6; x += c.rr(6, 11)) { const y = y0 + FH * 0.7 + c.rr(-2, 3), h = c.rr(12, 26); gr += c.ribbon([[x, y + 4], [x + c.rr(-5, 5), y - h]], 2); }
  s.x(gr, shade(C.wheat2, -0.15), 'opacity=".8"');
  return s.out();
}

export default {
  id: 'mt3-vipers',
  beats: [
    { v: 7, text: 'A gdy widział, że przychodzi do chrztu wielu spośród faryzeuszów i saduceuszów, mówił im:' },
    { v: 7, cont: true, text: '«Plemię żmijowe, kto wam pokazał, jak uciec przed nadchodzącym gniewem?' },
  ],
  cam: { x: [-40, 40], y: [0, 80], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: the leaders, their name tags and the picture move inward; the picture waits higher
    const DX = P ? 75 : 0, PFX = P ? 770 : FX;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1250, 150], city: false, path: false });
    // the world dims (a violet wash over the sky and the far bank; the people stay in the light)
    const gid = S.id('dim');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="720"><stop offset="0" stop-color="${WRATH[0]}" stop-opacity=".9"/><stop offset=".7" stop-color="${WRATH[1]}" stop-opacity=".55"/><stop offset="1" stop-color="${WRATH[1]}" stop-opacity=".35"/></linearGradient>`);
    const dark = S.layer({ par: 0, sh: 1, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${gid})"/>`);
    dark.fade(0);

    /* the storm of the wrath to come, far behind */
    const storm = S.layer({ par: 0.05, sh: 4 });
    const redGlow = storm.add(`<ellipse rx="520" ry="200" fill="url(#warm-glow)" opacity="0"/>`);
    const cloudEl = storm.add(`<g><g transform="translate(-90 10)">${cloud(c, 260, mix(C.storm, C.plumRobe, 0.35), C.storm2)}</g><g transform="translate(80 -20)">${cloud(c, 300, mix(C.storm, C.plumRobe, 0.2), C.storm2)}</g><g transform="translate(10 40)">${cloud(c, 220, mix(C.storm2, C.plumRobe, 0.3), C.storm2)}</g></g>`);
    const bolt = storm.add(`<g opacity="0">${lightning(c, 260)}</g>`);

    /* the river: John */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g data-k="v-shell" transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const shellEl = S.$('v-shell');
    J.waterFront(R);
    const voice = voiceRings(R, c, { n: 3, color: C.clay, r: 40, w: 6, both: false });

    /* the near bank: Pharisees and Sadducees arrive */
    const { N } = J.nearBank();
    const LEAD = [
      { o: pharisee(c, 0), x: 380, s: 0.98 }, { o: pharisee(c, 1), x: 480, s: 1.0 }, { o: sadducee(0), x: 580, s: 0.97 },
      { o: pharisee(c, 3), x: 670, s: 1.02 }, { o: sadducee(1), x: 760, s: 0.99 },
    ].map((m, i) => ({ ...m, x: P ? 525 + (m.x - 380) * 0.8 : m.x, i,   // phone: the row a little tighter, the first leader inside the frame
      p: S.puppet(N.add(person(c, m.o))), seed: c.rr(0, 9) }));
    const qEl = N.add(`<g opacity="0">${question(c)}</g>`);

    /* name tags for the two parties */
    const tagL = S.layer({ par: 0.45, sh: 5 });
    const tags = [
      { el: tagL.add(hang2(nameTag(c, tr('faryzeusze', 'Pharisees'), { size: 16 }), 0, 500)), x: P ? 560 : 430, y: 440 },
      { el: tagL.add(hang2(nameTag(c, tr('saduceusze', 'Sadducees'), { size: 16 }), 0, 500)), x: P ? 775 : 680, y: 450 },
    ];

    /* the hung picture: fire in the field, vipers fleeing */
    const pic = S.layer({ par: 0.3, sh: 6 });
    const frame = pic.add(hang2(wrathPicture(c), FW * 0.35, 700));
    const fireGlow = pic.add(`<ellipse rx="150" ry="70" fill="url(#warm-glow)" opacity="0"/>`);
    const fire = pic.add(`<g>${fireLine(c, 150, 70)}</g>`);
    const snakes = [0, 1, 2].map((i) => ({ i, el: pic.add(viper(c, { len: 120 - i * 10, col: [mix(C.moss2, C.soilDark, 0.35), mix(C.teal, C.soilDark, 0.3), mix(C.olive, C.soilDark, 0.45)][i] })) }));

    J.foreground();

    return (t, time) => {
      J.update(t, time);

      /* v7a — they come down to the river; John sees them */
      LEAD.forEach((m) => {
        const k = es(t, 0.05 + m.i * 0.06, 0.55 + m.i * 0.05);
        const x = lerp(m.x - 760, m.x, k);
        const recoil = es(t, 1.08 + m.i * 0.03, 1.3 + m.i * 0.03);
        const look = es(t, 1.4, 1.6) * (m.i % 2 ? 1 : 0);
        m.p.set({
          x: x - recoil * 12, y: BANK + (m.i % 2) * 6, s: m.s, flip: look > 0.5 && m.i > 2 ? true : false, walk: k > 0 && k < 1 ? x * 0.05 + m.i : undefined,
          head: -6 + recoil * 10 + bump(t, 1.4, 1.9) * 4, lean: -recoil * 5, armF: 20 + bump(t, 0.6, 1.0) * 20 + recoil * 30, armB: 10 + recoil * 40,
          blink: blinkAt(time, m.seed),
        });
      });
      tags.forEach((tg, i) => {
        const k = es(t, 0.45 + i * 0.1, 0.7 + i * 0.1, ease.out), up = es(t, 1.0, 1.15, ease.in);
        pose(tg.el, { x: tg.x, y: lerp(-300, tg.y, k) - up * 600, r: Math.sin(time * 0.9 + i) * 2, o: k > 0.01 && up < 1 ? 1 : 0 });
      });
      pose(qEl, { x: 610 + DX, y: BANK - 250, s: es(t, 1.55, 1.7, ease.back), o: seg(t, 1.55, 1.6) });

      const seeK = es(t, 0.55, 0.75);
      const point = es(t, 1.02, 1.18);
      john.set({
        x: JX, y: WADE, s: 1.06, flip: seeK > 0.5,
        armF: 30 - seeK * 16 + point * 75, armB: 10 + point * 30, head: bump(t, 0.6, 0.95) * -6 + point * -4, lean: -point * 4,
        blink: blinkAt(time),
      });
      fade(shellEl, 1 - es(t, 0.95, 1.05));
      const [hx, hy] = headAt(JX, WADE, 1.06, true);
      voice(hx - 14, hy, point * (1 - es(t, 1.9, 2.0)), time, { spread: 2.6, dir: -1 });

      /* v7b — the wrath to come: the sky dims, a storm glows red behind */
      const w = es(t, 1.05, 1.45);
      dark.fade(w * 0.6);
      pose(cloudEl, { x: 1160 + (1 - w) * 400, y: 300, s: 0.8 + w * 0.2, o: w });
      pose(redGlow, { x: 1160, y: 360, s: 1, o: w * 0.6 });
      const fl = time ? (Math.sin(time * 1.7) > 0.93 ? 1 : 0) : 0;
      pose(bolt, { x: 1200, y: 320, o: w * fl * 0.9 });

      /* … and the picture of the vipers fleeing the fire */
      const pk = es(t, 1.08, 1.4, ease.out);
      const fy = lerp(P ? -700 : -420, FY, pk);
      pose(frame, { x: PFX, y: fy });
      const fireK = es(t, 1.3, 1.5);
      const flick = time ? 1 + Math.sin(time * 9) * 0.08 : 1;
      pose(fire, { x: PFX + FW / 2 - 80, y: fy + FH * 0.74, sx: 1, sy: fireK * flick, o: pk > 0.99 ? 1 : 0 });
      pose(fireGlow, { x: PFX + FW / 2 - 80, y: fy + FH * 0.66, o: fireK * 0.8 });
      snakes.forEach((sn) => {
        const u = seg(t, 1.35 + sn.i * 0.1, 2.2 + sn.i * 0.1);
        const x = PFX + FW / 2 - 150 - u * (FW - 190) - sn.i * 30;
        const y = fy + FH * (0.78 + sn.i * 0.07);
        const wig = time ? Math.sin(time * 7 + sn.i * 2) * 0.12 : 0;
        pose(sn.el, { x, y, s: 1 - sn.i * 0.08, sy: (1 - sn.i * 0.08) * (1 + wig), o: pk > 0.99 ? seg(t, 1.35 + sn.i * 0.1, 1.45 + sn.i * 0.1) : 0 });
      });

      S.cam.z = 1.02 + es(t, 0.6, 1.0) * 0.06 - es(t, 1.05, 1.4) * 0.04;
      S.cam.x = -20 + es(t, 0.6, 1.0) * 30;
      S.cam.y = 40 - es(t, 1.05, 1.4) * 30;
    };
  },
};
