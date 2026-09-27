// Mk 16,17–18 — "These signs will accompany those who believe." Five blank plates come down on strings;
// one by one each flies to the middle, turns over and plays its sign: dark wisps flee from a man at a word
// "in my name"; greetings in many scripts; a snake lifted and let go, harmless; a cup of poison whose dark
// fume becomes a spark of light; hands laid on a sick man, who gets up. Jesus speaks at the centre.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, flowers, cloud, town } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { ELEVEN, LOOK, voiceRings, headAt, wisp, sparkle, snake, cup, bubble, FONT, PI } from './lib.js';

const GY = 740, JX = 800, R = 115;
const ROW = [580, 690, 800, 910, 1020].map((x) => [x, 205]);
const SLOT = [[545, 340], [1055, 340], [545, 500], [1055, 500], [800, 385]];
const MID = [800, 385];

export default {
  id: 'm16-signs',
  beats: [
    { v: 17, text: 'Tym zaś, którzy uwierzą, te znaki towarzyszyć będą:' },
    { v: 17, cont: true, text: 'w imię moje złe duchy będą wyrzucać,' },
    { v: 17, cont: true, text: 'nowymi językami mówić będą;' },
    { v: 18, text: 'węże brać będą do rąk,' },
    { v: 18, cont: true, text: 'i jeśliby co zatrutego wypili, nie będzie im szkodzić.' },
    { v: 18, cont: true, text: 'Na chorych ręce kłaść będą, i ci odzyskają zdrowie».' },
  ],
  cam: { x: [-10, 10], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    sky(S, [C.skyBlue, mix(C.skyBlue, C.cream, 0.5), mix(C.cream, C.dawn, 0.4)]);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 1250, y: 150, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 150, speed: 45, scale: 0.45 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 540, amps: [18, 8, 3], lens: [1000, 330, 120], color: C.hillFar }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 600, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 22 });
    mid.add(h2.markup + town(c, { x: 300, y: h2.fn(300) + 8, n: 6, spread: 260, sc: 0.5 }) + town(c, { x: 1350, y: h2.fn(1350) + 8, n: 6, spread: 260, sc: 0.5 }));
    const ground = S.layer({ par: 0.45, sh: 3 });
    const gy = c.wave(680, [8, 3], [900, 200]);
    ground.add(sheet().p(c.ridge(gy, -1400, 2800, 1700, 12, 1), C.hillNear).out() + grass(c, { x0: -900, x1: 2500, y: 680, fn: gy, n: 60, h: 16, color: C.moss }) + olive(c, 200, 720, 1.1) + olive(c, 1420, 716, 1) + cypress(c, 1260, 700, 130) + flowers(c, { x0: 300, x1: 1300, y: 720, fn: () => c.rr(700, 780), n: 30, h: 18 }));

    /* the five plates */
    const PLL = S.layer({ par: 0.4, sh: 6 });
    const disc = (fill) => sheet().p(c.cut(c.circ(0, 0, R + 9, 40), 0.5, 5), C.wood3).p(c.cut(c.circ(0, 0, R, 40), 0.4, 5), fill).out();
    const clip = S.id('signclip');
    S.defs(`<clipPath id="${clip}"><circle r="${R}"/></clipPath>`);
    const ground2 = (col) => `<path d="${c.cut([[-R, 60], [-40, 52], [40, 56], [R, 50], [R, R], [-R, R]], 0.6, 6)}" fill="${col}"/>`;
    const tiny = (o, k) => `<g data-k="${k}">${person(c, o)}</g>`;
    const DISC_O = { robe: C.dustyBlue, mantle: C.ochre, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather };
    const inners = [
      // 1: demons cast out
      `${ground2(C.sage)}${tiny(DISC_O, 's1-a')}${tiny({ robe: C.stone, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin3 }, 's1-b')}<g data-k="s1-light">${sparkle(c, 12)}</g>${Array.from({ length: 5 }, (_, i) => `<g data-k="s1-w${i}">${wisp(c, 0.8, mix(C.storm2, C.plumRobe, 0.3))}</g>`).join('')}`,
      // 2: new tongues
      `${ground2(C.sand)}${tiny(CAST.john, 's2-a')}${tiny(crowdPerson(c, { skin: C.skin4 }), 's2-b')}${tiny(crowdPerson(c, { skin: C.skin }), 's2-c')}${['Pax', 'Ἀγάπη', 'שָׁלוֹם', '平安', 'سلام', 'Мир'].map((w, i) => `<g data-k="s2-t${i}">${sheet().p(c.cut(c.blob(0, 0, 22 + w.length * 2.5, 14, 12, 0.06), 0.4, 4), C.cream).out()}<text x="0" y="5" text-anchor="middle" font-family="${FONT}, serif" font-size="14" fill="${C.ink}">${w}</text></g>`).join('')}`,
      // 3: serpents
      `${ground2(C.sand2)}${tiny(CAST.andrew, 's3-a')}<g data-k="s3-snake">${snake(c)}</g>`,
      // 4: poison
      `${ground2(C.sage2)}${tiny(LOOK.philip, 's4-a')}<g data-k="s4-cup">${cup(c, C.plumRobe)}</g><g data-k="s4-fume"><path d="${c.ribbon(c.cbez([0, 0], [-10, -12], [10, -22], [0, -36], 12), (u) => 5 - u * 3.5)}" fill="${mix(C.olive, C.storm2, 0.5)}"/></g><g data-k="s4-spark">${sparkle(c, 12)}</g>`,
      // 5: the sick recover
      `${ground2(C.sage)}<path d="${c.cut(c.rect(-40, 86, 100, 8), 0.3, 4)}" fill="${C.clay}"/><g data-k="s5-lie" transform="translate(44 70) rotate(-90)">${person(c, { robe: C.linen2, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, eyes: 'closed' }).replace('class="fig"', 'class="fig" transform="scale(.4)"')}</g>${tiny({ robe: C.linen2, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2 }, 's5-up')}${tiny(CAST.peter, 's5-a')}<g data-k="s5-glow"><circle r="60" fill="url(#halo-glow)"/>${sparkle(c, 14)}</g>`,
    ];
    const backs = ['#f1e6cf', '#f1e6cf', '#f1e6cf', '#f1e6cf', '#f1e6cf'];
    const plates = inners.map((inner, i) => {
      const fillC = [mix(C.skyBlue, C.cream, 0.3), mix(C.dawn, C.cream, 0.3), mix(C.sand, C.cream, 0.4), mix(C.lavender, C.cream, 0.5), mix(C.skyBlue2, C.cream, 0.4)][i];
      const el = hanging(PLL, `<g class="blank">${disc(backs[i])}<g transform="scale(1.6)">${sparkle(c, 16)}</g></g><g class="pic" opacity="0">${disc(fillC)}<g clip-path="url(#${clip})">${inner}</g></g>`, { x: 0, y: 0, len: 900 });
      return { i, el, obj: el.querySelector('.obj'), blank: el.querySelector('.blank'), pic: el.querySelector('.pic') };
    });
    const P = (k) => S.puppet(S.$(k).firstElementChild);
    const s1a = P('s1-a'), s1b = P('s1-b'), s2a = P('s2-a'), s2b = P('s2-b'), s2c = P('s2-c'), s3a = P('s3-a'), s4a = P('s4-a'), s5a = P('s5-a');
    const s5up = P('s5-up'), s5lie = S.$('s5-lie');
    const W1 = Array.from({ length: 5 }, (_, i) => S.$('s1-w' + i)), T2 = Array.from({ length: 6 }, (_, i) => S.$('s2-t' + i));

    /* Jesus and the disciples */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const D = [0, 2, 4, 1, 3, 7].map((j, i) => ({ ...ELEVEN[j], i, x: [440, 520, 600, 1000, 1080, 1160][i], y: GY - [20, 10, 0, 0, 10, 20][i], seed: c.rr(0, 9) }));
    D.forEach((m) => { m.flip = m.x > JX; m.p = S.puppet(PL.add(person(c, { ...m.o }))); });
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.halo, r: 40, w: 6 });

    return (t, time) => {
      swing(cl1, 1250 + Math.sin(time * 0.1) * 30, 150, time, 1.2, 0.6, 1);
      birds(time, 1);
      jesus.set({ x: JX, y: GY, s: 1.12, armF: 40 + Math.sin(time * 1.4) * 4 + bump(t, 0.1, 0.9) * 40, armB: 20 + bump(t, 0.1, 0.9) * 90, head: -4, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, GY, 1.12, false);
      voice(hx, hy, 0.8, time, { spread: 2.4 });
      D.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.98, flip: m.flip, armF: 20 + es(t, 0.3, 0.7) * 30, armB: 10, head: -8 - es(t, 0.3, 0.7) * 6, blink: blinkAt(time, m.seed) }));

      /* the plates: down in a row, then one by one to the middle */
      plates.forEach((p) => {
        const drop = es(t, 0.15 + p.i * 0.1, 0.55 + p.i * 0.1, ease.back);
        const a = p.i + 1;                  // its beat
        const toMid = es(t, a, a + 0.25);
        const toSlot = p.i < 4 ? es(t, a + 1, a + 1.25) : 0;
        let [x, y] = ROW[p.i];
        y = lerp(-1000, y, drop);
        x = lerp(x, MID[0], toMid); y = lerp(y, MID[1], toMid);
        x = lerp(x, SLOT[p.i][0], toSlot); y = lerp(y, SLOT[p.i][1], toSlot);
        const sc = lerp(0.42, 1.2, toMid) * (1 - toSlot * 0.52);
        swing(p.el, x, y, time, 1, 0.7, p.i);
        const turn = es(t, a + 0.05, a + 0.3);
        const sx = Math.cos(turn * PI);
        pose(p.obj, { s: sc, sx: Math.max(0.03, Math.abs(sx)) });
        fade(p.blank, sx >= 0 ? 1 : 0);
        fade(p.pic, sx < 0 ? 1 : 0);
      });

      /* 1: in my name they will cast out demons */
      const cmd = es(t, 1.3, 1.45);
      const flee = es(t, 1.45, 1.85, ease.in);
      s1a.set({ x: -48, y: 72, s: 0.42, armF: 30 + cmd * 70, armB: 10 + cmd * 120, blink: blinkAt(time, 1) });
      s1b.set({ x: 34, y: 76, s: 0.42, flip: true, lean: 16 * (1 - flee), armF: 10 + flee * 110, armB: 30 * (1 - flee) + flee * 130, head: 14 * (1 - flee) - flee * 10, blink: blinkAt(time, 2) });
      pose(S.$('s1-light'), { x: -20, y: -30, s: cmd * (1 + Math.sin(time * 4) * 0.1), r: time * 30, o: cmd });
      W1.forEach((w, i) => {
        const a = -PI * 0.1 - i * (PI * 0.2);
        pose(w, { x: 34 + Math.cos(a) * (34 + flee * 110) + Math.sin(time * 3 + i) * 2, y: -10 + Math.sin(a) * (30 + flee * 110), r: Math.cos(a) * 30 * flee, o: (1 - flee) * 0.9 });
      });
      /* 2: they will speak with new tongues */
      const talk = es(t, 2.3, 2.45);
      s2a.set({ x: -40, y: 76, s: 0.42, armF: 30 + talk * 60 + Math.sin(time * 3) * 8 * talk, armB: 10 + talk * 40, blink: blinkAt(time, 3) });
      s2b.set({ x: 30, y: 72, s: 0.4, flip: true, armF: bump(t, 2.6, 3) * 40, head: -bump(t, 2.5, 3) * 8, blink: blinkAt(time, 4) });
      s2c.set({ x: 72, y: 80, s: 0.4, flip: true, armF: 20, head: bump(t, 2.6, 3) * 8, blink: blinkAt(time, 5) });
      T2.forEach((el, i) => {
        const k = es(t, 2.3 + i * 0.07, 2.45 + i * 0.07, ease.back);
        const a = -PI * 0.92 + i * (PI * 0.17);
        pose(el, { x: -10 + Math.cos(a) * 70, y: -6 + Math.sin(a) * 62, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* 3: they will take up serpents — harmlessly, and let them go */
      const lift = es(t, 3.3, 3.55) * (1 - es(t, 3.7, 3.85));
      const away = es(t, 3.85, 3.99);
      s3a.set({ x: -20, y: 78, s: 0.44, armF: 20 + lift * 70, armB: 10, head: -lift * 8, blink: blinkAt(time, 6) });
      pose(S.$('s3-snake'), { x: lerp(40, 10, lift) + away * 70, y: lerp(76, 20, lift), s: 0.7, r: lift * -10 });
      /* 4: if they drink any deadly thing it will not hurt them */
      const drink = es(t, 4.35, 4.55) * (1 - es(t, 4.75, 4.9));
      const clean = es(t, 4.55, 4.75);
      s4a.set({ x: -10, y: 78, s: 0.44, armF: 40 + drink * 100, armB: 10 + es(t, 4.8, 5) * 90, head: -drink * 14, blink: blinkAt(time, 7) });
      const cx = lerp(20, 14, drink), cy = lerp(40, -4, drink);
      pose(S.$('s4-cup'), { x: cx, y: cy, s: 0.9, r: -drink * 50 });
      pose(S.$('s4-fume'), { x: cx, y: cy - 22 + Math.sin(time * 2) * 2, o: 1 - clean });
      pose(S.$('s4-spark'), { x: cx, y: cy - 40, s: clean * (1 + Math.sin(time * 4) * 0.1), r: time * 30, o: clean });
      /* 5: they will lay hands on the sick, and they will recover */
      const lay = es(t, 5.25, 5.45);
      const get = es(t, 5.6, 5.66);
      const glad = es(t, 5.66, 5.85);
      s5a.set({ x: -64, y: 78, s: 0.44, lean: lay * 18 * (1 - get), armF: 30 + lay * 60 * (1 - get) + glad * 40, armB: 10 + lay * 50 * (1 - get) + glad * 100, blink: blinkAt(time, 8) });
      fade(s5lie, 1 - get);
      s5up.set({ x: 10, y: 78, s: 0.44, flip: true, o: get, armF: glad * 120, armB: glad * 150, head: -glad * 10, blink: blinkAt(time, 9) });
      pose(S.$('s5-glow'), { x: 0, y: 30, s: 0.4 + lay * 0.4 + glad * 0.6, r: time * 20, o: lay * 0.7 + glad * 0.3 });

      S.cam.y = 20;
      S.cam.z = 1.02;
    };
  },
};
