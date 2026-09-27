# Ewangelia wg św. Marka — papierowy teatr

A scroll-driven, sentence-by-sentence illustrated reading of the Gospel of Mark, drawn as a
layered **paper-cut diorama**. Chapter 4 is done: teaching from the boat, the five parables and
the calming of the storm. That's 41 verses in 68 animated beats.

Text: **Biblia Tysiąclecia** (5th ed.), scraped from biblia.deon.pl into `data/mark.js` (all 16 chapters).

## Run

```sh
python3 -m http.server 5178      # any static server works; no build step
open http://localhost:5178/
```

Deep links: `#w35` jumps to verse 35. Draw a single scene: `?only=storm`.
Console: `__theatre.go('storm', 7.5)` jumps to scene time 7.5 (beats).

## How it works

* `js/core/engine.js`: the theatre. Scroll position becomes scene time `t` (1 beat = 1 sentence).
  It stacks paper layers, swaps sets between scenes, and drives the caption (word-by-word reveal),
  the hanging section tag, the progress thread and the camera (pan/zoom with per-layer parallax).
* `js/core/paper.js`: the seeded "scissors" (hand-cut polygon edges), paper grain and colour helpers.
* `js/assets/`: reusable cut-outs. `people.js` has puppets with hinged arms, walk, kneel and sit poses,
  plus the Jesus and disciple presets. `nature.js` has hills, water, plants, sun, moon and towns.
  `things.js` has the boat, lamp, bushel, wheat, mustard tree, birds and effects. The palette is in `palette.js`.
* `js/chapters/kit.js`: scene helpers (skies, curtains, crowds, hanging ornaments, flocks).
* `js/chapters/mark4/*.js`: one file per scene. See **docs/SCENES.md** for how to write one.

### Performance model

Every `L.add()` is its own cut-out. Still pieces get a soft SVG shadow and are rasterised once.
Pieces that move are detected automatically and lifted into small, tightly fitted layers of their own,
with a cheap geometric shadow, so redrawing them never touches the big sheets. Whole-sheet motion
(waves, rain, skies, night falling) uses `L.shift()` / `L.fade()`, which run on the compositor.
Upcoming scenes are pre-built in idle time.

## Tools

* `node tools/check.mjs`: verifies the beats reproduce the Bible text exactly, verse by verse.
* `node tools/bench.mjs <url> scene:t …`: frame-time benchmark in a dedicated Chrome window.
* `node tools/shot.mjs <outDir> <url> scene:t … [--size=390x844]`: screenshots of chosen moments.
* `python3 tools/fetch_mark.py`: re-downloads the text into `data/mark.js`.

## Next chapters

Add `js/chapters/markN/` with scene files and an `index.js`, then point `js/main.js` at the chapter.
Headings (section titles on the tag) come from the translation automatically.
