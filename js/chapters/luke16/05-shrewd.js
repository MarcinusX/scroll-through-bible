// Łk 16,8 — the same court towards evening; the bills lie on the manager's desk: fifty, eighty. "The master commended
// the dishonest manager because he had acted shrewdly": the master comes out of his house and down into the court,
// picks up the bills and looks at them — and then, half against his will, lifts his hand to the manager, and over him
// hangs his verdict: a fox, the shrewd one. "For the sons of this world are shrewder in dealing with their own kind
// than the sons of light": a painted diptych comes down over the court — on the left, in the lamplight of a market,
// two traders strike a quick bargain, coins changing hands; on the right the sons of light stand with their lamps
// lit, idle, one of them yawning.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { estateSet, ES, speech, fox, bill, desk, stool, panel, panelSky, panelGround, figure, coin, clayLamp, zzz, label, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, MASTER, STEWARD, ESTATE_EVE } from './lib.js';

const GY = ES.GY;
const DX = 820;
const PW = 470, PH = 200;

/** the diptych: the market in lamplight (left) and the idle lamp-bearers (right) — panel coords */
function diptych(S, c) {
  const G = 60;
  let m = '';
  // left half: dusk market
  m += `<g><clipPath id="${S.id('dl')}"><rect x="${-PW / 2}" y="${-PH / 2}" width="${PW / 2}" height="${PH}"/></clipPath></g>`;
  m += `<rect x="${-PW / 2 - 2}" y="${-PH / 2 - 2}" width="${PW / 2 + 2}" height="${PH + 4}" fill="${mix(C.duskViolet, C.dusk, 0.35)}"/>`;
  m += `<rect x="0" y="${-PH / 2 - 2}" width="${PW / 2 + 2}" height="${PH + 4}" fill="${mix(C.halo, C.cream, 0.5)}"/>`;
  m += `<circle cx="-120" cy="-10" r="90" fill="url(#warm-glow)" opacity=".7"/><circle cx="120" cy="-20" r="110" fill="url(#halo-glow)" opacity=".8"/>`;
  m += sheet().p(c.cut([[-PW / 2 - 4, G - 4], [0, G - 2], [0, PH / 2 + 4], [-PW / 2 - 4, PH / 2 + 4]], 0.5, 8), mix(C.sand2, C.duskViolet, 0.3)).p(c.cut([[0, G - 2], [PW / 2 + 4, G - 4], [PW / 2 + 4, PH / 2 + 4], [0, PH / 2 + 4]], 0.5, 8), mix(C.sand, C.halo, 0.3)).out();
  // a stall with an awning, sacks and scales
  m += sheet().p(c.cut([[-200, -40], [-40, -40], [-30, -20], [-210, -20]], 0.4, 6), mix(C.terracotta, C.clay, 0.3)).p(c.ribbon([[-200, -20], [-200, G]], 4) + c.ribbon([[-44, -20], [-44, G]], 4), C.wood2).p(c.cut([[-190, G - 30], [-60, G - 30], [-60, G], [-190, G]], 0.4, 6), C.wood).out();
  m += `<g transform="translate(-86 ${G - 30})">${sheet().p(c.cut(c.circ(-10, -6, 8, 10), 0.2, 3) + c.cut(c.circ(8, -5, 7, 10), 0.2, 3) + c.cut(c.circ(0, -14, 7, 10), 0.2, 3), C.sun).out()}</g>`;
  m += `<g transform="translate(-126 -44)">${clayLamp(c)}</g>`;
  m += figure(c, { robe: C.ochreRobe, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'full', skin: C.skin3, belt: C.leather }, { x: -170, y: G + 2, s: 0.52, armF: 80, armB: 20, head: 4 });
  m += figure(c, { robe: C.dustyBlue, mantle: C.clayMantle, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope }, { x: -70, y: G + 2, s: 0.52, flip: true, armF: 80, armB: 40, head: -4 });
  // right half: the sons of light, lamps lit, idle
  m += figure(c, { robe: C.linen, mantle: C.skyVeil, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.haloRim, holdF: `<g transform="rotate(-60) translate(0 4)">${clayLamp(c)}</g>` }, { x: 60, y: G + 2, s: 0.5, armF: 60, armB: 0, head: 12 });
  m += figure(c, { robe: C.linen2, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.haloRim, holdF: `<g transform="rotate(-60) translate(0 4)">${clayLamp(c)}</g>` }, { x: 130, y: G + 2, s: 0.5, armF: 60, armB: 150, head: -14 });
  m += figure(c, { robe: C.linen, mantle: C.wheatRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair, skin: C.skin2, beard: 'none', holdF: `<g transform="rotate(-60) translate(0 4)">${clayLamp(c)}</g>` }, { x: 196, y: G + 2, s: 0.48, flip: true, armF: 60, armB: 0, head: 16 });
  m += `<g transform="translate(150 -60) scale(.7)">${zzz(c, 16, C.inkSoft)}</g>`;
  m += `<path d="M0 ${-PH / 2 - 2}V${PH / 2 + 2}" stroke="${mix(C.wood3, C.ochre, 0.4)}" stroke-width="6"/>`;
  return m;
}

export default {
  id: 'lk16-shrewd',
  parable: true,
  beats: [
    { v: 8, text: 'Pan pochwalił nieuczciwego rządcę, że roztropnie postąpił.' },
    { v: 8, cont: true, text: 'Bo synowie tego świata roztropniejsi są w stosunkach z ludźmi podobnymi sobie niż synowie światłości.' },
  ],
  cam: { x: [-20, 40], y: [-80, 40], z: [1, 1.1] },
  build(S) {
    const E = estateSet(S, { sky2: ESTATE_EVE });
    const c = E.c;
    E.act.add(`<g transform="translate(${DX + 92} ${GY})">${stool(c)}</g>`);
    const stew = S.puppet(E.act.add(person(c, STEWARD)));
    const master = S.puppet(E.act.add(person(c, MASTER)));
    E.front.add(`<g transform="translate(${DX} ${GY})">${desk(c)}</g>`);
    const b50 = E.front.add(`<g>${bill(c, '50')}</g>`);
    const b80 = E.front.add(`<g>${bill(c, '80')}</g>`);
    const verdict = E.W.add(`<g opacity="0">${speech(c, `<g transform="translate(-6 34) scale(.62)">${fox(c)}</g>`, { w: 84, h: 70, flip: true })}</g>`);
    const pan = E.fly.add(panel(S, diptych(S, c), { w: PW, h: PH }));
    const labL = E.fly.add(`<g opacity="0">${label(c, tr('synowie tego świata', 'the children of this world'), { size: 17 })}</g>`);
    const labR = E.fly.add(`<g opacity="0">${label(c, tr('synowie światłości', 'the children of the light'), { size: 17 })}</g>`);

    return (t, time) => {
      const T = time;
      E.update(T);
      E.sk2.layer.fade(0.35 + es(t, 0, 1.2) * 0.4);
      /* v8a — the master comes out, looks at the bills, and commends him */
      const MK = [[-0.4, 1380], [0.1, 1120], [0.3, 1000], [0.4, DX + 70]];
      const mx = kf(t, MK);
      const look = es(t, 0.42, 0.52) * (1 - es(t, 0.62, 0.7));
      const praise = es(t, 0.66, 0.78);
      const onDais = mx > ES.STEP + 10;
      master.set({ x: mx, y: onDais ? ES.DAIS : GY, s: 1.02, flip: true, walk: moving(t, MK) ? mx * 0.06 : undefined, armF: 20 + look * 70 + praise * 20, armB: 10 + praise * 140, head: look * 14 - praise * 4, blink: blinkAt(T, 1) });
      const bow = es(t, 0.7, 0.85);
      stew.set({ x: 700, y: GY, s: 1.0, armF: 10 + bow * 30, armB: 6 + bow * 20, head: 6 + bow * 10 - bump(t, 0.8, 1.6) * 6, lean: bow * 6, blink: blinkAt(T, 3) });
      const [hx, hy] = handAt(mx, GY, 1.02, true, 20 + look * 70 + praise * 20);
      const held = es(t, 0.42, 0.5);
      pose(b50, { x: lerp(DX - 40, hx - 20, held), y: lerp(GY - 80, hy - 26, held), s: 0.6, r: -held * 8 });
      pose(b80, { x: lerp(DX + 10, hx + 6, held), y: lerp(GY - 78, hy - 10, held), s: 0.6, r: held * 8 });
      const [mhx, mhy] = headAt(mx, GY, 1.02, true);
      const vk = es(t, 0.7, 0.82, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(verdict, { x: mhx - 20, y: mhy - 20, s: vk, o: vk > 0.01 ? 1 : 0 });

      /* v8b — the children of this world and the children of light */
      const pk = es(t, 1.08, 1.4, ease.out);
      const py = lerp(-500, 270, pk);
      pose(pan, { x: 800, y: py, r: T ? Math.sin(T * 0.7) * 0.5 * pk : 0, o: pk > 0.004 ? 1 : 0 });
      pose(labL, { x: 800 - PW / 4, y: py + PH / 2 + 26, o: pk > 0.004 ? 1 : 0 });
      pose(labR, { x: 800 + PW / 4, y: py + PH / 2 + 26, o: pk > 0.004 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 30], [0.4, 20], [1.0, 10], [1.4, 0]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.0, 20], [1.4, -60]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [1.0, 1.08], [1.4, 1.02]]);
    };
  },
};
