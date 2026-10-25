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
7. **The hook is a precise question or a surprising statement with a named subject**, in the first words: "Pourquoi
   Alexandre le Grand refuse-t-il de boire, alors que son armée meurt de soif ?", "Dans Le Cri d'Edvard Munch, tout
   le monde croit que cet homme hurle. En réalité, il essaie de ne plus rien entendre." Never "ce tableau cache un
   secret".
8. **The end answers the hook and loops into it.** If the hook is a question, the last line can end on "Voilà la
   réponse à la question :" and the video restarts on it. If it is a statement, the last line answers it on its own
   and the return to the opening image makes the loop. No call to action, ever.
9. **Every sentence must be showable**: when you write it, know what will be on screen (a detail of the painting, an
   archive of the time). A sentence with nothing true to show is a sentence to rewrite.
10. **Length: 55–70 s, about 140–180 words.** Cut anecdotes and pauses, never the explanation that makes a sentence
    true.

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

## Rejected along the way (don't propose again)

- "Ce tableau cache un secret" hooks; a hook split across two bubbles.
- A reveal about the models ("the soldier's real father is the man on the roof"): trivia that changes nothing.
- Raphael's self-portrait as the ending; Euclid and Pythagoras (no pose → life line); any CTA.
