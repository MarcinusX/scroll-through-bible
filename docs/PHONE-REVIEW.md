# Reviewing a book on a phone

How the Gospel of John was audited and repaired for phones (portrait, 390×844) on 2026-09-29/30,
written down so the other books can get the same pass. John had 316 findings in 286 scenes; the
other books were drawn the same way, so expect the same amount. Matthew followed on 2026-10-02
(559 repairs in 28 chapters, 1765 beats), Luke on 2026-10-03 (516 repairs in 24 chapters, 1731 beats).
Mark followed on 2026-10-04 in three passes (a first repair, a second pass, and a final check of the chapters
whose second pass had never been looked at — it found 69 more leftovers), with eight desktop faults fixed on the way.

## What goes wrong on a phone

The theatre keeps the world's centre and scales it so that x 420–1180 fits the width, but the paper
frame takes ~30 units on each side and the progress thread runs at x ≈ 1130–1170, so the **usable
width is about x 450–1150**. Scenes composed for a wide screen fail in the same few ways:

1. **Sliced at the edge or off-screen**: hanging plates, name tags, speech bubbles, scrolls,
   signposts and the outermost figures, placed at x < 450 or x > 1150. The bad case is when the
   *subject of the sentence* is the thing that is off-screen (the man counting his coins, the people
   who marvel, the poor at the door). About nine findings in ten were this.
2. **Composition**: two groups at opposite edges with an empty middle; the speaker on one edge and
   the listener off the other; a ring, a garland or a row of plates wider than the screen.
3. **Tall-screen artefacts**: a phone shows y ≈ −350…1290, so anything "parked" just above the
   picture (plates waiting at y ≈ −250) peeps out under the section tag; sheets that end at
   y 1000 show a bare edge; step or column cut-outs that run to y 1700 read as stripes; an indoor
   set's ceiling drawn as a sheet from y −1200 fills the top third of the screen as flat wood.
4. **Interface**: the caption card covers world y > ~1000 (more with long sentences), the tag and
   "Powrót" cover y < −230, the closing card of a chapter hangs at 26 % of the height on phones.
5. Ordinary faults that were simply never seen: a glow drawn *over* a figure, one figure hidden
   behind another, feet under a boat hull, a plate lying on someone's head.

## How to fix

* Branch on `S.portrait`; leave the landscape values exactly as they are:
  `S.cam.x = S.portrait ? -190 : 0`, `const PX = S.portrait ? 640 : 520`, `cam.z * (S.portrait ? 0.9 : 1)`.
  Widen the scene's declared `cam:` ranges when the phone camera goes further (layers are sized from them).
* Zooming out barely helps on mid-depth layers (a layer's zoom is `1 + (z − 1) · par`), so **move
  things inward** rather than zoom.
* Park hidden things at y ≤ −500 in portrait. Draw ceilings as a band, not a sheet from −1200;
  extend skies, ground and water to y 1700 and x −900…2500.
* Glows go behind figures; a figure that walks past others is laid on top (`L.add` it last, but
  cut the markup in the old order so the seeded scissors don't change every other piece).
* Shared drawings (`../markN/lib.js` etc.) are used by other books: fix them there, and shoot one
  scene of each other user before and after.

## The procedure

1. Serve the working tree on its own port (`python3 -m http.server 5190`), and the untouched
   version on another (`git archive HEAD | tar -x -C /tmp/head`, serve on 5191) for comparisons.
2. Baseline contact sheets of every beat, per chapter:
   `PORT=5190 tools/review.sh john:3 /tmp/before/j3 pl 390x844` (portrait sheets, 8 shots each).
   Keep them: they are the "before" half of the report.
3. One agent per chapter (Opus, four to twenty at a time), each with the brief below. It edits
   only its chapter's folder, verifies every fix with `tools/shot.mjs` (headless; never `--window`),
   and writes a JSON list of findings with the `sceneId:t` spot that shows each one best.
4. Check the agents' work yourself: rebuild the sheets after the fixes and look at every
   before/after pair. In John, four chapters of 21 still had a leftover (a hidden figure, parked
   plates exposed by a zoom-out, stripes). Expect the agents to be honest but not thorough about
   desktop checks. In Matthew the look was handed to a **second pass**: fresh agents, three chapters
   each, who re-judged every after sheet (including what the first agent called "acceptable") and
   ran the desktop compare. They found half as many again (181 on top of 378): suns half under the thread,
   the last of a row of figures still touching it, things a first fix had moved onto something else.
5. Prove the desktop is unchanged: `tools/compare.sh john:3 /tmp/cmp/j3 http://localhost:5191 http://localhost:5190`
   prints the changed fraction of every beat; anything above ~1 % that is not idle motion (lamps,
   rays, swaying tags) gets looked at.
6. `node tools/check.mjs <book>` for both languages, then a full re-shoot for the "after" pictures.
7. Shared code found by more than one agent (name tags, closing card, ceilings) is fixed by the
   coordinator, not by an agent, so two agents never edit the same file.

## The brief given to each chapter agent

> You are reviewing one chapter of the Gospel of John as it looks on a phone in portrait (390×844),
> and fixing whatever looks wrong. Read `docs/SCENES.md` first, then your chapter's files.
>
> Baseline shots of every beat at x.75 are in `before/jN/` (contact sheets `sheet-NN.jpg`, 8 per
> sheet, plus the individual `<sceneId>-<t>.jpg`). Never modify them.
>
> **Review** every sheet, opening individual shots when a tile looks suspicious. For each beat read
> its sentence and ask whether the picture makes sense on a phone. Problems: something the sentence is
> about cut off at the edge or off-screen (landscape scenery running off the edge is normal, a single
> figure with half a body is not); feet floating or sunk, a figure on the wrong ground band, a bare
> gap where a sheet runs out; wrong stacking (a glow over a figure, a figure in front of a wall it
> should be behind); things hidden under the caption, the tag, "Powrót" or the progress thread;
> overlaps that don't read (two figures on top of each other, a label over a face, ghosting);
> stray or meaningless elements; the action squeezed into a corner with the middle empty; an empty
> beat. Be demanding but fair: don't invent problems, don't redesign, most beats are fine.
>
> **Fix** with `S.portrait` branches so the desktop stays as it is (geometry: usable x 450–1150,
> caption covers y > ~1000, tag covers y < −230, thread at x ≈ 1150). Edit only `js/chapters/johnN/`;
> if the cause is in shared code, report it with `status: "shared"`. Don't change `beats`, ids or
> order. Keep the performance rules (no filters, no new per-frame motion of big pieces, glows behind
> figures). Do not commit, stash or branch.
>
> **Verify** every fix with `node tools/shot.mjs <out> "http://localhost:5190/?book=john&ch=N&lang=pl" jN-scene:1.75 … --size=390x844`
> and the same beats at `--size=1440x900`; shoot in-between moments when you change a camera path.
> Re-shoot all beats of a scene when a fix moves things used by several beats. Finish with
> `node tools/check.mjs john N` and a full phone re-shoot of the chapter.
>
> **Report** `reports/jN.json`: `{ chapter, scenes_reviewed, beats_reviewed, issues: [{ scene, spot,
> title, problem, fix, files, status: fixed|unfixed|shared, also_affects }], notes }`, where `spot`
> is a baseline `sceneId:t` that shows the problem best. Report honestly; an empty list is fine.

## Report

The report page pairs each finding's baseline shot with the re-shot after picture, side by side on
the theatre's dark board, grouped by chapter, with the title / problem / fix text from the JSON.
John's is at https://claude.ai/artifact/3NbxLUSYBXdS7ZDpSRTy3E.
