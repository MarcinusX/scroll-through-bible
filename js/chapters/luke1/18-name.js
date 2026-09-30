// Łk 1,59–63 — the eighth day: the relatives gather in the courtyard for the circumcision; an elder holds the child,
// and they hang the name "Zechariah" over him, after his father. "No," says his mother, stepping forward, "he shall be
// called John." "There is no one among your relatives who has that name" — the elder unrolls the family scroll: name
// after name, and none is John. They make signs to his father, sitting mute: what would he call him? He asks for a
// writing tablet and writes, the words appearing under his stylus: "His name is John." And they all marvel.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import {
  ELIZABETH, zechMute, HILLDAY, hillHome, homeLight, hillFront, HGY, johnInArms, hungWord, speech, thought, GLYPH, bigTablet, glowDisc, sparkle, folk,
  hand, tr, es, ease, bump, seg, PI, FONT,
} from './lib.js';
import { elder } from '../mark11/lib.js';

const ZX = 560, EX = 700, OX = 860;   // Zechariah (seated), Elizabeth, the elder with the child
const TX = 720, TY = 400;            // the tablet

export default {
  id: 'lk1-name',
  beats: [
    { v: 59 },
    { v: 60 },
    { v: 61 },
    { v: 62 },
    { v: 63, text: 'On zażądał tabliczki i napisał: «Jan będzie mu na imię».' },
    { v: 63, cont: true, text: 'I wszyscy się dziwili.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const W = hillHome(S, HILLDAY);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1220, y: -1500, len: 800 });
    const P = W.P;
    const zS = S.puppet(P.add(zechMute(c, { pose: 'sit' })));
    const zU = S.puppet(P.add(zechMute(c)));
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const old = S.puppet(P.add(elder(c, 0, { holdF: johnInArms(c) })));
    // the relatives: a still group, and the same group marvelling (hands lifted) to cross-fade to
    const crowdL = S.layer({ par: 0.4, sh: 5 });
    const mem = []; for (let i = 0; i < 4; i++) mem.push({ x: i * 60 + c.rr(-8, 8), y: (i % 2) * 20, s: 0.9 * c.rr(0.95, 1.04), o: folk(c) });
    const draw = (raise) => mem.slice().sort((a, b) => a.y - b.y).map((mm) => { let mk = person(c, { ...mm.o, holdF: '', holdB: '' }); if (raise) mk = mk.replace(/class="armBr"/, 'class="armBr" transform="rotate(-150)"').replace(/class="armFr"/, 'class="armFr" transform="rotate(-60)"'); return `<g transform="translate(${mm.x.toFixed(1)} ${mm.y.toFixed(1)}) scale(${-mm.s} ${mm.s})">${mk}</g>`; }).join('');
    const rel = crowdL.sprite(draw(false), 1000, 740);
    const relW = crowdL.sprite(draw(true), 1000, 740);

    const up = S.layer({ par: 0.3, sh: 6 });
    const day = up.add(hungWord(c, tr('ósmy dzień', 'the eighth day'), { size: 24 }));
    const zTag = up.add(hungWord(c, tr('Zachariasz?', 'Zacharias?'), { size: 24 }));
    const sayJ = up.add(`<g>${speech(c, `<text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-size="26" font-style="italic" fill="${C.terracotta}">${tr('Jan', 'John')}</text>`, { w: 80, h: 50 })}</g>`);
    // the family scroll: a row of names, and a question at the end
    const fam = (() => {
      const w = 300, h = 90, s = sheet().p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), C.parchment).p(c.cut(c.ell(-w / 2 - 4, 0, 8, h / 2 + 4, 10), 0.3, 4) + c.cut(c.ell(w / 2 + 4, 0, 8, h / 2 + 4, 10), 0.3, 4), C.wood3);
      const names = tr(['Aaron', 'Abiasz', 'Zachariasz'], ['Aaron', 'Abijah', 'Zacharias']);
      const txt = names.map((n, i) => `<text x="${-100 + i * 90}" y="-6" text-anchor="middle" font-family="${FONT}" font-size="19" font-style="italic" fill="${C.ink}">${n}</text>`).join('');
      return `<g><path d="M${-w * 0.35} -1800V${-h / 2}M${w * 0.35} -1800V${-h / 2}" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/>${s.out()}${txt}<path d="${c.ribbon([[-130, 12], [130, 12]], 1.4)}" fill="${C.ink}" opacity=".4"/><text x="0" y="36" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.terracotta}">${tr('…Jan?', '…John?')}</text></g>`;
    })();
    const famEl = up.add(fam);
    const q = up.add(`<g>${thought(c, GLYPH.q(c), { w: 60, h: 48 })}</g>`);
    const T = bigTablet(c, tr(['Jan będzie', 'mu na imię'], ['His name', 'is John']), { w: 240, h: 150, size: 30 });
    const tab = up.add(`<g>${T.frame}</g>`);
    const cover = up.add(`<g>${T.cover}</g>`);
    const stylus = up.add(`<g><path d="${c.ribbon([[0, 0], [16, -40]], 3)}" fill="${C.wood2}"/></g>`);
    const tGlow = W.G.add(`<g>${glowDisc(170, 'halo-glow', 1)}</g>`);
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));
    hillFront(S);

    return (t, time) => {
      const Tm = time;
      swing(sunEl, 1220, 160, Tm, 1, 0.7);
      homeLight(W.H, { open: 0.8, lit: 0.3 });
      /* v59: the eighth day; they would call him Zechariah */
      const inK = es(t, 0.05, 0.35, ease.out);
      const wonder = es(t, 5.05, 5.15);
      rel.set({ x: lerp(1500, 1000, inK), y: 740, o: (inK > 0.01 ? 1 : 0) * (1 - wonder) });
      relW.set({ x: 1000, y: 740, o: wonder });
      const dk = es(t, 0.1, 0.35, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      pose(day, { x: 800, y: lerp(-1100, 250, dk), r: Math.sin(Tm * 0.8) * 1.2, o: dk > 0.002 ? 1 : 0 });
      const zk = es(t, 0.45, 0.7, ease.out) * (1 - es(t, 1.3, 1.55, ease.in));
      pose(zTag, { x: OX + 20 + es(t, 1.2, 1.5) * 120, y: lerp(-1100, 390, zk), r: Math.sin(Tm * 0.9) * 1.4 + es(t, 1.1, 1.3) * 12, o: zk > 0.002 ? 1 : 0 });
      old.set({ x: OX, y: HGY, s: 1, flip: true, armF: 70, armB: 10 + bump(t, 2.1, 2.9) * 50 + bump(t, 3.05, 3.9) * 70, head: 10 - bump(t, 3.05, 3.9) * 14, blink: blinkAt(Tm, 4) });

      /* v60: No — he shall be called John */
      const step = es(t, 1.05, 1.3);
      e.set({ x: EX + step * 30, y: HGY, s: 0.96, flip: false, armF: 20 + bump(t, 1.05, 1.9) * 70, armB: 10 + bump(t, 1.05, 1.9) * 40, head: -bump(t, 1.05, 1.9) * 8, blink: blinkAt(Tm, 1) });
      const jk = es(t, 1.25, 1.45, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(sayJ, { x: EX + 50, y: HGY - 190, s: Math.max(0.001, jk), o: jk > 0.01 ? 1 : 0 });

      /* v61: no one of your kin has that name — the family scroll */
      const fk = es(t, 2.05, 2.3, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      pose(famEl, { x: 900, y: lerp(-1500, 330, fk), r: Math.sin(Tm * 0.7) * 1 * fk, o: fk > 0.002 ? 1 : 0 });

      /* v62: they make signs to his father */
      const qk = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(q, { x: ZX + 10, y: HGY - 160, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });

      /* v63a: he asks for a tablet and writes */
      const stand = es(t, 4.05, 4.12);
      zS.set({ x: ZX, y: HGY, s: 1, flip: false, o: 1 - stand, armF: 30 + bump(t, 3.3, 3.9) * 30, armB: 10, head: -bump(t, 3.2, 3.9) * 8, blink: blinkAt(Tm, 2) });
      const write = seg(t, 4.3, 4.85);
      const wr = write > 0 && write < 1 ? Math.sin(t * 70) * 6 : 0;
      zU.set({ x: ZX, y: HGY, s: 1, flip: false, o: stand, armF: 80 + wr + es(t, 5.05, 5.3) * 30, armB: 60 + es(t, 5.05, 5.3) * 60, head: -8, blink: blinkAt(Tm, 2) });
      const tk = es(t, 4.05, 4.3, ease.out);
      const ty = TY + (1 - tk) * 80 - es(t, 5.05, 5.3) * 30;
      pose(tab, { x: TX, y: ty, s: 0.7 + tk * 0.3, o: tk > 0.01 ? 1 : 0 });
      pose(cover, { x: TX + T.w / 2 - 15, y: ty, sx: Math.max(0.001, 1 - write) * (0.7 + tk * 0.3), sy: 0.7 + tk * 0.3, o: tk > 0.01 && write < 1 ? 1 : 0 });
      pose(stylus, { x: TX - T.w / 2 + 30 + write * (T.w - 60), y: ty + 10 + Math.sin(t * 50) * 4 * (write > 0 && write < 1 ? 1 : 0), o: write > 0 && write < 1 ? 1 : 0 });
      pose(tGlow, { x: TX, y: ty, s: 1, o: es(t, 4.8, 5.1) });

      /* v63b: and they all marvel */
      sparks.forEach((sp, i) => { const kk = seg(t, 5.1 + i * 0.04, 5.55 + i * 0.04); const a = (i / 6) * PI * 2; pose(sp, { x: TX + Math.cos(a) * (130 + kk * 40), y: ty + Math.sin(a) * (85 + kk * 30), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 5.1 + i * 0.04, 5.55 + i * 0.04) }); });

      S.cam.z = 1.04 + es(t, 4.0, 4.4) * 0.05;
      S.cam.y = 20 - es(t, 4.0, 4.4) * 20;
      S.cam.x = -es(t, 4.0, 4.4) * 20;
    };
  },
};
