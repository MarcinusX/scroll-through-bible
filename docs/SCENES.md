# Writing a scene

The book is a **paper theatre**: each scene is a stack of hand-cut paper layers inside a box.
Scrolling advances *scene time* `t`, measured in **beats** (one beat = one sentence of the Gospel).
`t = 2.5` means "halfway through the third sentence". The caption reveals the sentence word by
word during the first half of its beat, so the second half is when its picture should be complete.

Run it: `python3 -m http.server 5178` in the repo root → <http://localhost:5178/>
Only some scenes: `?only=lamp,measure`. Jump in the console: `__theatre.go('lamp', 1.6)`.
Check the text: `node tools/check.mjs` (beats must reproduce Biblia Tysiąclecia text exactly).

## Books and chapters

The theatre holds several Gospels. `js/chapters/index.js` lists them (`BOOKS`): Mark lives in
`js/chapters/markN/` (scene ids `mN-…`), John in `js/chapters/johnN/` (scene ids `jN-…`). The text is in
`data/<book>.js` (Biblia Tysiąclecia) and `data/<book>-en.js` (World English Bible); a book's published
chapters are its `READY` list. Everything below says "markN", but works the same for every book.

## A chapter

Each chapter lives in `js/chapters/markN/`:

| file | what |
| --- | --- |
| `NN-name.js` | one scene per file, in reading order. **Scene ids are prefixed** `mN-` (e.g. `m1-baptism`) so they are unique across the book. |
| `index.js` | imports the scenes and exports `SCENES = [...]`, plus `BEATS_EN` and `META` (see mark4). |
| `beats-en.js` | English (World English Bible) wording for every beat that splits a verse: `{ 'm1-baptism': { 0: '…', 1: '…' } }`. Beats that show a whole verse need no entry. Split English at the same sentence boundaries as the Polish. |
| `meta.js` | Roman plate number and the title-page subtitle / closing-card question, in `pl` and `en`. |

Section titles on the hanging tag come from the translation headings (`data/mark.js`, `data/mark-en.js`).
Verses the Biblia Tysiąclecia omits (Mk 9,44; 9,46; 11,26 — empty strings in `data/mark.js`) are left out of the beats
in **both** languages; `tools/check.mjs` enforces it.
Words drawn *inside* scenes (paper labels) go through `tr('polski', 'English')` from `js/core/i18n.js`.

Run a chapter: <http://localhost:5178/?book=mark&ch=1> (`&lang=en`, `&only=m1-baptism`, `#w9` = verse 9).
John: <http://localhost:5178/?book=john&ch=3>.
Check text: `node tools/check.mjs mark 1` / `node tools/check.mjs john 3` — Polish **and** English must rebuild every verse exactly.
Look at moments (own Chrome window, safe to run in parallel):
`node tools/shot.mjs <outDir> "http://localhost:5178/?ch=1" m1-baptism:1.7 m1-baptism:2.4 [--size=390x844]`
then open the JPGs. Frame times: `node tools/bench.mjs "http://localhost:5178/?ch=1" m1-baptism:1.5` (aim: 120 fps idle).

## File shape

```js
// js/chapters/mark4/06-lamp.js
import { C, person, CAST, crowd, sky, hanging, swing, flock, sheet, shade, pose, lerp, blinkAt } from '../kit.js';
import { band, waterBand, palm, bush, rock, town, house, sun, moon, cloud, stars, grass, flowers } from '../../assets/nature.js';
import { oilLamp, lampstand, bushel, bed, bird, paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';

export default {
  id: 'lamp',
  parable: true,                     // tag shows "przypowieść"; the set flies in from above
  enter: 'fly',                      // optional; parables descend like painted flats
  beats: [
    { v: 21, text: 'Mówił im dalej: «Czy po to wnosi się światło, by je postawić pod korcem lub pod łóżkiem?' },
    { v: 21, cont: true, text: 'Czy nie po to, aby je postawić na świeczniku?' },   // cont: continues a verse
    { v: 22 },                       // whole verse
  ],
  cam: { x: [-60, 60], y: [0, 80], z: [1, 1.25] },  // ranges the camera may use (layers are sized from this)
  build(S) {
    const c = S.c;                   // seeded scissors — see js/core/paper.js
    const sk = sky(S, ['#top', '#mid', '#bottom']);
    const back = S.layer({ par: 0.15, sh: 2 });      // par: parallax (0 = fixed, 1 = foreground)
    back.add(band(c, { y: 430, color: C.hillFar }).markup);
    const chars = S.layer({ par: 0.6, sh: 5 });
    const jesus = S.puppet(chars.add(person(c, { ...CAST.jesus })));
    return (t, time) => {            // called every frame; t in beats, time in seconds (0 if reduced motion)
      jesus.set({ x: 800, y: 640, s: 1, armF: es(t, 0, 0.5) * 90, blink: blinkAt(time) });
      S.cam.z = 1 + es(t, 1, 2) * 0.2;
    };
  },
};
```

## World & camera
* World is 1600 × 1000 units, screen centre = (800, 470). Always visible: x 390–1210, y 90–850
  (landscape) — portrait shows ~x 420–1180 but much more sky and ground, so **extend skies and ground
  bands to x -900…2500 and down to y 1700**.
* The caption card covers the bottom ~20 % of the screen: keep faces above y ≈ 700.
* A standing adult at `s: 1` is ~210 units tall (feet at y). Main characters: s 0.9–1.3.
* `S.cam = {x, y, z}` pans/zooms; layers move by `par`. Declare the ranges in `cam:`.
* Layers are separate `<div>`s with a drop shadow, so each sheet shadows the one behind it.
  6–10 layers per scene. Put things that animate in their own (small) layers when possible.

## Drawing
* Every shape goes through the cutter so its edge is "scissor-cut": `c.cut(points, jitter, step)`.
  Point helpers: `c.circ, c.ell, c.blob, c.arc, c.star, c.rect, c.qbez, c.cbez, c.ribbon(pts, width)`.
* Wrap pieces in `sheet()` so they get paper grain: `sheet().p(d, C.sage).p(d2, C.moss).out()`.
  `.x(d, fill)` adds a piece without grain (tiny details, glows).
* Colours: only from `C` (js/assets/palette.js) or `shade(c, ±t)` / `mix(a, b, t)`. Pastel, warm, paper.
* People: `person(c, {...CAST.jesus, pose: 'stand'|'kneel'|'sit', k: 'name'})` → markup;
  `S.puppet(el).set({x, y, s, flip, o, armF, armB, head, walk, amt, bob, lean, blink})`.
  Arms are degrees raised forward (0 hanging, 90 pointing, 160 up). `walk` = phase in radians.
  To change pose, cross-fade two puppets (paper theatre swaps cut-outs).
* Mark animated elements with `data-k="name"`, then `S.$('name')`; move with
  `pose(el, {x, y, s, sx, sy, r, o, ox, oy})` (writes are cached — call it every frame freely).
* Hanging things (sun, moon, clouds, plates) use `hanging(layer, markup, {x, y, len})` + `swing()`.

## Motion rules
* Everything the text says must *happen on screen during its beat*, driven by `t` (reversible when
  scrolling back). Idle life (swaying, blinking, water) uses `time`.
* Use `es(t, a, b)` (eased 0→1) and `bump(t, a, b)` (0→1→0). Stagger groups by index.
* Jesus stays at the centre of the composition whenever he is in the scene.
* When `time` is 0 (reduced motion) the scene must still read correctly.

## Performance (keep it smooth — this matters)
* Each `L.add(markup)` becomes one cut-out with its own baked shadow. Static cut-outs are rasterised
  once and cached; anything you `pose()` every frame re-renders **only its own bounds**.
  So: add each moving thing with its **own** `L.add()` call, and never animate a huge element
  (a whole ground band, a full-width wave strip) with `pose()` every frame.
* To slide a whole sheet (waves, drifting mist, a shaking set) use `L.shift(x, y)` — the layer moves on
  the compositor with zero repaint. Give such layers `pad: <max shift>` so their edges never show.
* To fade a whole sheet (a second sky, a lightning flash, night falling) use `L.fade(0…1)` — also free.
* Idle `time` motion is great for small things (a flame, a swinging ornament, blinking, a bird).
  For big things, drive them by `t` (they are still while the reader is not scrolling).
* Hide things with `o: 0` rather than leaving them transparent-but-moving.

## Lessons from chapter 4 (please follow)
* Crowds: **no continuous idle sway** of heads/arms for many people — it forces every figure to redraw
  every frame. Blinking (`blinkAt`) is fine. Move crowds with `t`.
* Swap puppets quickly (`es(t, a, a + 0.07)`), otherwise two half-transparent cut-outs ghost over each other.
* Raising a **front** arm high (armF > 110) makes it cover the face. For "hand raised" use `armB` high
  and `armF` forward (~60–90).
* People stand *in* boats/behind walls: check feet and robe hems don't poke out below the hull/wall.
* Lights must follow the story logic (a lamp lit at night only when the text says so, etc.).
* Keep important things inside x 420–1180 so phones (390×844 portrait) still see them; check one portrait shot.
* Give each beat a clear, readable picture at `x.75` — the reader pauses there. Don't overload with effects.
* Everything the sentence says should be visible; Jesus at the centre when he is present.
