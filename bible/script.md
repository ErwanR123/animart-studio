# Writing the script

The script (`src/episodes/<Episode>.script.json`) is the episode. Everything on screen fires on its words. These
rules come from the pilot (GuideAthens, October 2026): each one is a note the user gave on a draft that failed.

## The viewer

A French-speaking TikTok/Reels viewer who has **never seen the painting**, half of them with the sound off, who
swipes away at the first sentence that doesn't make sense to them. Write for them, not for an art historian.

## Rules

1. **Every sentence must make sense on its own to a cold viewer.** No allusion they can't decode ("au même
   moment, à côté…", "alors pourquoi chez les papes ?"). If a sentence needs the previous episode, a footnote or
   the painting's literature, rewrite it.
2. **Tie where a figure is in the painting to who they were.** The best line explains the pose: Plato points up
   because for him truth is found by thought; Aristotle holds his hand flat over the earth because he observes the
   world; Diogenes sprawls alone on the steps because he despised comfort and convention; Heraclitus sits apart,
   head in hand, because he was "the weeping philosopher". A name plus a fact unrelated to the picture is weak.
3. **One idea per beat, said concretely.** "Pour lui, la vérité se trouve par la pensée, pas par les yeux" beats
   "pour lui, la vérité est dans le monde des idées" (true, but meaningless to a cold viewer).
4. **Facts are consensual and checked** (museum page + Wikipedia FR/EN, sources in the episode file's header
   comment). Disputed identifications stay out of the narration (they may appear as name tags only if Wikipedia
   gives them). No false superlatives: Raphael is **not** "the only one who looks at us" — several figures do. **Readings are ours to tell**: what a figure feels or what a pose means can be told with conviction, without "peut-être", when it's the episode's interpretation and serves the emotion (the user's call on *Homecoming G.I.*). Only facts (dates, names, objects, who posed) must be true.
5. **Cut what doesn't serve the question.** An anecdote that is fun but leads nowhere (Diogenes and Alexander,
   Heraclitus painted with Michelangelo's face) costs 5 seconds and the viewer's attention. Keep it only if the
   hook needs it.
6. **The hook is a precise question with a named subject**: "Pourquoi le pape Jules II a-t-il fait peindre des
   philosophes grecs dans sa bibliothèque ?" — who (a named person), what (something surprising), where. Never
   vague ("ce tableau cache un secret"), never split across two bubbles with "…".
7. **The answer closes the episode and loops into the hook.** The last line answers the question, then ends on a
   bridge back to it ("Voilà ce qui répond à la question :") — the video restarts on the hook (`loop` in the
   config). No call to action, no "abonne-toi", no "quel tableau la prochaine fois ?".
   The bridge only works if the hook's **first words** are the question. *Homecoming*'s hook opens on a statement
   ("Dans ce tableau… tout un quartier court vers ce soldat."), so "Voilà ce qui répond à la question :" led nowhere
   ("pas logique"): there the last line ends on its own and the pull-back to the opening image makes the loop.
8. **Lists are spoken while shown.** Naming the four walls one after another while the camera turns to each
   worked; a list said over a static image doesn't.
9. **Written for the ear**: short sentences, one subordinate clause at most, concrete nouns, one number per
   sentence. Dates and numbers TTS mangles go in `say` ("En 1508" → `"say": "En mille cinq cent huit"`); the
   caption keeps `text`.
10. **Length: 60–75 s, about 150–190 words.** Shorter is better only if nothing becomes false, uncertain or
    incomprehensible — the user rejected a "tightened" version for exactly that. Cut pauses and anecdotes, not
    explanations.

## The pilot's script (the reference)

| segment | line | what it does |
|---|---|---|
| `hook` | Pourquoi le pape Jules II a-t-il fait peindre des philosophes grecs dans sa bibliothèque ? | question with a named subject |
| `context` | En 1508, il confie ses murs à Raphaël. Un mur par grand savoir : la poésie, la foi, la justice… et la philosophie. | the room tour, one wall per word |
| `d0` | Sur celui-ci, Raphaël réunit les plus grands penseurs de l'Antiquité. | class photo: every figure named |
| `d1` | Au centre, Platon tient son Timée et pointe le ciel : pour lui, la vérité se trouve par la pensée, pas par les yeux. | position → idea |
| `d2` | Son élève Aristote tient son Éthique et montre la terre : lui cherche la vérité en observant le monde qui l'entoure. | the contrast |
| `d3` | À gauche, Socrate, le maître de Platon. Il compte ses arguments sur ses doigts : il n'a jamais rien écrit, il passait ses journées à questionner les passants dans les rues d'Athènes. | gesture → life |
| `d4` | Et lui, seul, à moitié nu, vautré en plein milieu des marches ? C'est Diogène. Il vivait dans une jarre et méprisait le luxe comme les convenances. | pose → philosophy (the jar first, so the Gérôme print has time) |
| `d5` | Devant, isolé, la tête dans la main : Héraclite, qu'on surnommait le philosophe qui pleure, parce que la folie des hommes le désespérait. | the nickname *and* why |
| `d6` | Et la réponse à la question du début est juste en face. Sur l'autre mur, Raphaël a peint la foi : le Christ, les saints, l'Église. Pour le pape, la religion et la philosophie ne s'opposent pas : ce sont deux chemins vers la même vérité. Voilà ce qui répond à la question : | the answer + the loop bridge |

## Rejected along the way (don't propose again)

- A hook about "païens en face de Jésus" (unclear who/why); "ce tableau cache un secret" style hooks.
- Raphael's self-portrait as the ending with a wink and a "cling" (cut: the answer to the hook is the ending).
- Euclid (nothing to say that ties his pose to his life in one line), Pythagoras (same).
- Any CTA line.
- A reveal about the models ("the soldier's real father is the man on the roof", Rockwell's *Homecoming G.I.*):
  trivia that changes nothing in how the scene reads. The reveal must change the painting's meaning.
