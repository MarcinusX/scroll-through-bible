// J 10,17–18 — a hilltop, alone, from sunset to sunrise. Jesus holds a small flame in His hands — His life. Above
// Him the Father is only light. "The Father loves Me, because I lay down My life" — a heart of light comes down the
// beam while He kneels and sets the flame on the ground; the sun goes down. "That I may take it again" — the night
// passes, the sun comes up on the other side and the flame rises back into His hands, brighter. "No one takes it
// from Me" — shadow hands reach in from both sides and cannot close on it: He holds it out Himself. "I have power to
// lay it down and power to take it again" — a golden arc hangs above: the sun-token sinks down one side and climbs
// the other. "This command I received from My Father" — a sealed scroll comes down the beam into His hands.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { grass, rock, bush, olive } from '../../assets/nature.js';
import {
  pastureSet, JESUS, soulLight, radiance, heart2, shadowHand, sealedScroll, beamGrad, lightBeam, hand, kf, vis, tr, FONT,
  GOLDEN, DUSK, NIGHT, DAWN, MORNING, PI,
} from './lib.js';

const JX = 800, JY = 606;
const AR = 190, AX = 800, AY = 280; // the hanging arc

export default {
  id: 'j10-lay',
  beats: [
    { v: 17, text: 'Dlatego miłuje Mnie Ojciec, bo Ja życie moje oddaję,' },
    { v: 17, cont: true, text: 'aby je [potem] znów odzyskać.' },
    { v: 18, text: 'Nikt Mi go nie zabiera, lecz Ja od siebie je oddaję.' },
    { v: 18, cont: true, text: 'Mam moc je oddać i mam moc je znów odzyskać.' },
    { v: 18, cont: true, text: 'Taki nakaz otrzymałem od mojego Ojca». -' },
  ],
  cam: { x: [-40, 40], y: [-120, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { skyCols: GOLDEN, sunAt: [560, 330], sunR: 50, moonAt: [1100, 150], starsN: 90, groundY: 560, clouds: true });
    const crest = S.layer({ par: 0.45, sh: 4 });
    const cfn = (x) => JY + Math.pow((x - 800) / 420, 2) * 110 + Math.sin(x * 0.03) * 2;
    crest.add(sheet().p(c.ridge(cfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.wheat, 0.12)).out());
    crest.add(grass(c, { x0: -800, x1: 2400, y: JY, fn: cfn, n: 60, h: 13, color: C.moss }));
    crest.add(olive(c, 470, cfn(470) + 12, 0.9) + rock(c, 1100, cfn(1100) + 10, 80, 30, C.rock2));
    // the night veil over the land (Jesus stays lit in front of it)
    const veil = S.layer({ par: 0.45, sh: 0, flat: true });
    veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".5"/>`);
    // the Father's light and the beam
    const bid = beamGrad(S, 'lay-beam');
    const beamL = S.layer({ par: 0.3, sh: 0, flat: true });
    const beam = beamL.add(`<g>${lightBeam(bid, 60, 220, 440)}</g>`);
    const upL = S.layer({ par: 0.3, sh: 1 });
    const rad = upL.add(`<g><circle r="160" fill="url(#halo-glow)"/>${radiance(c, 44)}</g>`);
    // the arc of lay down / take up
    const arcL = S.layer({ par: 0.35, sh: 4 });
    const arcM = sheet().p(c.ribbon(c.arc(0, 0, AR, AR * 0.8, PI, 2 * PI, 30), 5), C.haloRim).p(c.ribbon([[-AR - 30, 0], [AR + 30, 0]], 3), C.wood2).out();
    const arcEl = arcL.add(`<g><path d="M${-AR * 0.7} -1600V${-AR * 0.62}M${AR * 0.7} -1600V${-AR * 0.62}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${arcM}<text x="${-AR - 10}" y="34" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.inkSoft}">${tr('oddać', 'lay down')}</text><text x="${AR + 10}" y="34" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.inkSoft}">${tr('odzyskać', 'take again')}</text></g>`);
    const token = arcL.add(`<g><circle r="40" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 22, 15, 12, 0), 0.3, 3)}" fill="${C.sun}"/><path d="${c.cut(c.circ(0, 0, 12, 14), 0.2, 3)}" fill="${C.halo}"/></g>`);
    // Jesus: standing, kneeling
    const act = S.layer({ par: 0.45, sh: 5 });
    const jSt = S.puppet(act.add(person(c, JESUS)));
    const jKn = S.puppet(act.add(person(c, { ...JESUS, pose: 'kneel' })));
    const hands = [-1, 1].map((d) => act.add(`<g>${shadowHand(c, mix('#2a2238', C.indigo, 0.3))}</g>`));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const flame = fx.add(`<g>${soulLight(c, 16)}</g>`);
    const fGlow = flame.querySelector('.glow');
    const heart = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/>${heart2(c, 18, C.jesusMantle)}</g>`);
    const scroll = fx.add(`<g>${sealedScroll(c, 100)}</g>`);
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 110, 960, 220, mix(C.sage, C.moss, 0.4), C.moss) + rock(c, 1480, 985, 240, 90, C.rock2));

    return (t, time) => {
      const T = time;
      /* the day: sunset (v17a), night and sunrise (v17b), day (v18) */
      const set1 = es(t, 0.3, 0.95), night = es(t, 0.9, 1.2), dawn = es(t, 1.2, 1.6), morn = es(t, 1.55, 2.2);
      if (night <= 0) set.sk.blend(GOLDEN, DUSK, set1);
      else if (dawn <= 0) set.sk.blend(DUSK, NIGHT, night);
      else if (morn <= 0) set.sk.blend(NIGHT, DAWN, dawn);
      else set.sk.blend(DAWN, MORNING, morn);
      set.starL.fade(night * (1 - dawn));
      const sunX = t < 1.1 ? 560 : 1080, sunY = t < 1.1 ? lerp(330, 520, es(t, 0.3, 1.0, ease.in)) : lerp(520, 200, es(t, 1.3, 2.3, ease.out));
      set.update(T, { sunX, sunY, glow: 0.7, sunO: t < 1.1 ? 1 - es(t, 0.95, 1.05) : es(t, 1.2, 1.35), moonY: lerp(420, 150, night) + dawn * 300, moonO: night * (1 - dawn) });
      /* the light above and its beam */
      const rk = es(t, 0.05, 0.35, ease.out);
      vis(rad, { x: 800, y: lerp(-160, 140, rk), o: rk });
      const bk = es(t, 0.1, 0.4) * (0.75 - bump(t, 2.1, 2.9) * 0.3) + bump(t, 4.0, 4.9) * 0.3;
      vis(beam, { x: 800, y: 150, o: bk });
      veil.fade(night * (1 - dawn));
      /* v17a — the heart comes down; He kneels and lays the flame down */
      const hk = es(t, 0.1, 0.55) * (1 - es(t, 0.8, 0.95));
      vis(heart, { x: 800, y: lerp(160, JY - 240, es(t, 0.1, 0.6)), s: 0.8 + hk * 0.3, o: hk });
      const kneel = es(t, 0.45, 0.55) * (1 - es(t, 1.45, 1.55));
      const down = es(t, 0.55, 0.9);
      const rise = es(t, 1.45, 1.9);
      /* v18a — no one takes it: the hands reach and stop */
      const reach = es(t, 2.1, 2.5, ease.out) * (1 - es(t, 2.7, 2.95, ease.in));
      const offer = es(t, 2.35, 2.6) * (1 - es(t, 2.9, 3.1));
      /* v18b — lay down / take again, once more */
      const arcK = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      const u = es(t, 3.3, 3.9);
      const ta = PI + u * PI;
      const again = bump(t, 3.3, 3.6) * 0.8;
      /* v18c — the sealed scroll */
      const sc = es(t, 4.05, 4.5);
      const hold = es(t, 4.45, 4.6);
      const aF = kneel > 0.5 ? 50 : 56 + offer * 30 - again * 30 + hold * 10;
      const aB = kneel > 0.5 ? 46 : 52 + offer * 34 - again * 30 + hold * 14;
      jSt.set({ x: JX, y: JY, s: 1.08, o: 1 - kneel, armF: aF, armB: aB, head: 6 + offer * -4 + hold * 10, blink: blinkAt(T, 1) });
      jKn.set({ x: JX, y: JY, s: 1.08, o: kneel, armF: 44 - down * 14, armB: 40 - down * 10, head: 14, blink: down > 0.8 ? 1 : blinkAt(T, 2) });
      // the flame: in His hands → laid on the ground (sunset) → back in His hands (sunrise)
      const [hx, hy] = hand(JX, JY, 1.08, false, aF);
      const [kx, ky] = [JX + 56, JY - 70];
      let fxp = hx + 4, fyp = hy - 20;
      if (kneel > 0.5 || (t > 0.5 && t < 1.5)) { fxp = lerp(kx, JX + 70, down); fyp = lerp(ky, JY - 12, down); }
      if (rise > 0) { fxp = lerp(JX + 70, hx + 4, rise); fyp = lerp(JY - 12, hy - 20, rise); }
      if (again > 0) fyp += again * 60;
      const fs = 0.9 - down * 0.35 * (1 - rise) + rise * 0.3 + offer * 0.1;
      vis(flame, { x: fxp, y: fyp + (T ? Math.sin(T * 3) * 1.5 : 0), s: fs, o: sc > 0.6 ? 1 - es(t, 4.4, 4.6) * 0.5 : 1 });
      fade(fGlow, 0.7 + night * 0.3);
      hands.forEach((el, i) => {
        const d = i ? 1 : -1;
        const x = JX + d * lerp(620, 150, reach), y = JY - 120 + i * 16;
        vis(el, { x, y, sx: d < 0 ? 1 : -1, r: d * -6, o: reach > 0.01 ? 0.85 : 0 });
      });
      vis(arcEl, { x: AX, y: AY - (1 - arcK) * 700, o: arcK > 0.001 ? 1 : 0 });
      vis(token, { x: AX + Math.cos(ta) * AR, y: AY - (1 - arcK) * 700 + Math.sin(ta) * AR * 0.8, o: arcK > 0.001 ? 1 : 0 });
      vis(scroll, { x: lerp(800, hx + 6, es(t, 4.35, 4.6)), y: lerp(150, hy - 30, sc), s: 0.8, o: sc > 0.01 ? 1 : 0 });
      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -60], [1, -20], [2, -40], [3, -100], [4, -100], [4.4, -40]]);
      S.cam.z = kf(t, [[0, 1.05], [1, 1.2], [2, 1.12], [3, 1.02], [4, 1.02], [5, 1.18]]);
    };
  },
};
