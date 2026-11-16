# Writing the script

The script (`src/episodes/<Episode>.script.json`) is the episode: everything on screen fires on its words. Every
rule here is a note the user gave on a draft that failed. **The text matters most**: show it to the user before
building anything.

## The viewer and the goal

A French-speaking TikTok/Reels viewer who has **never seen the painting**, often with the sound off, who swipes
away at the first sentence that doesn't make sense. The goal is **emotion**: "le but des vidéos c'est susciter des
émotions". A reveal must change how the painting reads; trivia doesn't.

## Rules

1. **Vouvoiement**: the Guide says "regardez", never "regarde" (the user's call on *Le Cri*; *Alexander* still has
   one "regarde" from before).
2. **Every sentence makes sense on its own to a cold viewer.** No allusion they can't decode.
3. **Tie what is in the painting to the story.** The best line explains a pose or a detail: the hands on the ears,
   not on the mouth; the finger pointing at the men, not at the water; the back turned to us.
4. **One idea per sentence, said concretely, written for the ear**: short sentences, one subordinate clause at most,
   concrete nouns, one number per sentence. Dates and names TTS mangles go in `say` ("1883" → "mille huit cent
   quatre-vingt-trois", Munch → "Mounk"); the caption keeps `text`.
5. **Facts are true and sourced** (museum page, Wikipedia FR/EN, the period documents; sources in the episode file's
   header comment). **Readings are ours to tell** with conviction, without "peut-être" (what a figure feels, what a
   pose means). **A disputed hypothesis that adds emotion can stay, said as a hypothesis** ("des astronomes pensent
   que…"). No false superlatives.
6. **Cut what doesn't serve the question.** A fun anecdote that leads nowhere costs 5 seconds and the viewer.
7. **The hook teases a fact the video pays off later** (`bible/format.md`, the hook): ≤ 12 words, ≤ 3.5 s, a
   surprise that makes a cold viewer ask "what is he talking about?": "Et si ce qui l'angoisse, c'était un volcan à
   onze mille kilomètres ?" (*Le Cri*), "Ce tableau vient d'être vendu un million… et il s'autodétruit devant tout
   le monde." (*Banksy*). Rejected: "Tout le monde croit qu'il hurle." (a reading, no surprise), the name-first
   opening, "ce tableau cache un secret". Write it for the ear, in one breath: no "…" pause inside it.
8. **The end answers the hook and its last words run into it**: read the last line then the first aloud, as one
   sentence ("…et il est le seul à l'entendre. / Et si ce qui l'angoisse…"; "Voilà pourquoi…" / the hook). No call
   to action, ever.
9. **Every sentence must be showable**: when you write it, know what will be on screen (a detail of the painting, an
   archive of the time). A sentence with nothing true to show is a sentence to rewrite.
10. **Length: about 40 s, 90–120 words, never a minute.** Tell the story once, in order, and stop: a last line
    that says it again (*Alexander* after 40 s) is cut. Cut anecdotes and pauses, never the explanation that makes a
    sentence true.
11. **Written for TikTok, Reels and Shorts**: every line raises the next question (an open loop the next line closes
    and reopens), concrete and spoken like a friend telling a story, never a lesson.

12. **Start at 70 %, then waves** (the user, 2026-11-03): the first sentence drops the viewer in the story near its
    climax, a shock line about what is happening, not a game or a question to work out. Then the energy goes down a
    little (who, how), back up, down, up: each line is a jump that relaunches, with the peaks spread to the end
    (the fall, then a last twist), never a calm block of context.

## Reference scripts

- *Rue de Paris* (`GuideParisRain.script.json`, the user's own rewrite, Oct. 2026): **the best structure so far.**
  The hook is a game plus a mystery ("Il y a un homme caché dans ce tableau. Et le peintre l'a caché exprès." +
  on screen "Trouvez-le"); the next line rewards the searchers at once and relaunches the question ("Mais pourquoi
  le cacher… ?"); the history is told through him ("des ouvriers comme lui"), never as a lesson, so the character
  stays the thread; the last line repeats the first ("Voilà pourquoi il y a un homme caché dans ce tableau") for a
  perfect loop. About 40 s.

- *Le Cri* (`src/episodes/GuideScream.script.json`): a reading. Hook (the misconception), the proof in the painting
  (hands, mouth, the calm friends), the story behind it (the diary, Krakatoa as a hypothesis), the painting again
  (it vibrates, the inscription), the answer ("Ce n'est pas cet homme qui crie. C'est toute la nature qui hurle… et
  il est le seul à l'entendre.").
- *Alexander* (`GuideAlexander.script.json`): an anecdote. Question, who he was, the desert, the scene, the gesture,
  its meaning, the source, the loop.
- *Homecoming* (`GuideHomecoming.script.json`): a story on one painting. Everyone runs to him; why he doesn't move;
  the war; the hidden face as every family's son.
- *Athens* (`GuideAthens.script.json`): figures in a fresco, each pose tied to an idea.

## Audience data (to watch, not rules yet)

Signals from published videos. Samples are tiny (under 100 viewers), so these are hypotheses: don't rewrite
published episodes on them; confirm on more videos before changing the rules or re-cutting for Instagram.

- **Context before the first reveal may lose half the viewers** (YouTube Shorts, 2026-10-25). *Athens*: the hook
  (0–4.4 s) holds, then the retention curve falls from ~100 % to ~50 % during the context block ("En 1508, il
  confie ses murs à Raphaël…", 4.8–13 s), then stays flat to the end. Hypothesis: after the hook, show something
  concrete in the painting first; slip the context in later, in half a sentence.
- **First second** (same date): *Le Cri* had 70 % swiped away vs 52 % for *Athens*. Suspects: the opening frame (the
  painting a narrow strip between wide beige margins) and the hook's revelation arriving only after ~3 s ("Dans Le
  Cri d'Edvard Munch, tout le monde croit…"). To check against its own retention curve.
- **TikTok, first video of a cold account** (*Paris Rain*, 2026-10-28): 880 views, 98.8 % from For You, so TikTok
  did test it; but only ~19 % still watching at 0:04, average watch 6.5 s of 52 s, 4 % to the end. Third video
  where the loss is in the first 2 s. Suspects on the opening: a dim painting crop with a wandering loupe that blurs
  faces, a small title, the spoken line only describing the screen ("Tout le monde regarde ce couple") with no
  stakes, the Guide and the caption bubble in the bottom third, which TikTok's caption overlay covers. To test next:
  frame 0 full screen and already moving, big text in the upper-middle safe zone, a hook with stakes for today's
  viewer, the Guide out of the first 2 s.
  Same video on YouTube Shorts: 41 % stayed (59 % swiped), average 0:31 of 0:53; the curve leaks steadily from the
  start to ~14 s (hook + "il faut voir le Paris d'avant" + the old-Paris block), then stays flat to the end. So the
  body holds on both platforms; the weak part is 0–14 s, and TikTok punishes it far harder.

## Rejected along the way (don't propose again)

- **"Find / search" hooks** ("Essayez de trouver Icare", "Trouvez-le"): the user, 2026-11-03: people leave at once,
  they have no time to search or decode. Open on the climax instead (rule 12).

- "Ce tableau cache un secret" hooks; a hook split across two bubbles.
- A reveal about the models ("the soldier's real father is the man on the roof"): trivia that changes nothing.
- Raphael's self-portrait as the ending; Euclid and Pythagoras (no pose → life line); any CTA.
