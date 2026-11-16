# Images

One folder per episode (the painting, its close-ups, its collage pieces) and `paper/` for what every episode
shares. Add a line for each file you add: file · artwork · source · what it is used for. Collage pieces are made
with `scripts/image-collage.py` (rembg BiRefNet cut-outs, halftone, white rim, torn paper).

## `paper/`

| file | what | source | use |
|---|---|---|---|
| `kraft.jpg` | kraft paper background | procedural | every collage shot's `bg` |
| `crumpled.jpg` | white crumpled paper, scan | Commons "Free crumpled paper texture for layers (2978651767).jpg", cropped 1200 × 1520 | `field` `paper`: multiplied over a colour field |
| `cardboard.jpg` | wrinkled torn cardboard | Commons "Damaged Ripped Wrinkled Cardboard Paper Texture … (8077166499).jpg", cropped | a ground, a backing board |
| `dark.jpg` | dark vintage page, vignetted | Commons "Free dark vintage paper page texture for layers (2982207584).jpg", cropped | the black grain field (Earworm) |
| `parchment.jpg` | old paper with burnt edges | Commons "Old Paper texture.jpg", cropped | `doc` `paper` (a typed transcript) |
| `graph.jpg` | graph paper scan | Commons "Graph paper scan 1600x1000 (6509259561).jpg" | a ground, a name scrap |

## `athens/` — GuideAthens

| file | artwork | source | use |
|---|---|---|---|
| `athens.jpg` | Raphael, *The School of Athens* (c. 1509–1511), Vatican, Stanza della Segnatura | Commons "Raphael School of Athens" (*Chroma denoise* version), lunette crop | the painting |
| `athens-plato.jpg`, `athens-heraclitus.jpg`, `athens-euclid.jpg` | same | native-resolution crops of the same file | `insets`: sharp close-ups (Plato and Aristotle's books, Heraclitus' face) |
| `disputa.jpg` | Raphael, *Disputation of the Holy Sacrament* (1509–1510), same room, facing wall | Commons, *Disputation of the Holy Sacrament* (exact file name not recorded) | the facing wall (faith), room tour + answer |
| `parnassus.jpg` | Raphael, *The Parnassus* (1509–1511), same room | Commons "Raphael - The Parnassus.jpg" | room tour (poetry) |
| `justice.jpg` | Raphael, *Cardinal and Theological Virtues and the Law* (1511), same room | Commons "Rafael - Virtudes Teologales y la Ley…" | room tour (justice) |
| `diogenes-gerome.jpg` | Jean-Léon Gérôme, *Diogenes* (1860), Walters Art Museum | Commons, Walters Art Museum photograph (exact file name not recorded) | `picture` on "jarre" |

## `homecoming/` — GuideHomecoming

| file | artwork | source | use |
|---|---|---|---|
| `homecoming.jpg` | Norman Rockwell, *Homecoming G.I.* (1945) | cropped from the Library of Congress scan of the US Treasury poster "Hasten the Homecoming" (LOC 2002719871, cph 3b51985, colour transparency TIFF; LOC rights advisory: "Publication is restricted", Rockwell's Post illustrations — the NARA copy of the same poster is tagged public domain on Commons, NARA 514441), light per-channel stretch | the painting |
| `homecoming-soldier.png` | same, the soldier | cut out of `homecoming.jpg` with rembg (BiRefNet), box x 0.5399 y 0.6449 w 0.2101 h 0.3551 | `figure` |
| `homecoming-poster.jpg` | same poster, whole | same LOC scan | `cover` on the table |
| `ve-day-london.jpg` | Imperial War Museum HU 41808, V-E Day in London, 8 May 1945 | Commons "Ve Day Celebrations in London, 8 May 1945 HU41808.jpg", public domain | context photo |
| `gis-shelter.png` | US Army, infantrymen sheltering behind a tank | Commons "With German shells screaming overhead… - NARA - 531225", public domain | `flashes` |
| `stlo.png` | US Army Signal Corps SC 191953, Saint-Lô, July 1944 | Commons "SC 191953 - A Yank patrol picks its way…", public domain | `flashes` |
| `portrait-1…8.jpg` | official portraits of US soldiers (Medal of Honor recipients: J. H. Diamond, J. Hayashi, R. T. Henry, D. R. Lobaugh, M. Nakae, L. Parrish, F. J. Petrarca, R. D. Booker, S. H. Hallman, T. T. Tanouye, F. B. Wai, S. Munemori) | Commons, category "World War II recipients of the Medal of Honor", PD US Army | `portraits` |
| `b17.png`, `omaha.png`, `map-normandy.png`, `news-hitler.png`, `news-cologne.png` | collage pieces for the war beat | B-17s: Commons "493d Bombardment Group B-17 Flying Fortress Formation.jpg"; Omaha Beach: "Into the Jaws of Death 23-0455M edit.jpg"; D-Day map: "Newsmap Monday June 12, 1944 - map showing the Normandy landings.jpg"; papers: "Stars & Stripes & Hitler Dead2.jpg", "Yank, The Army Weekly, April 20, 1945 (Cologne).jpg" | `collage` |
| (raw, not kept) Hilfarth | US Army Signal Corps SC 201679, Hilfarth, Germany, 26 Feb 1945 | Commons "SC 201679 - Over roads that are still mined…", public domain | match cut |

## `alexander/` — GuideAlexander

| file | artwork | source | use |
|---|---|---|---|
| `alexander.jpg` | Giuseppe Cades, *Alexander the Great Refuses to Take Water* (1792) | Commons "Alexander the Great Refuses to Take Water.jpg" (1484 px, the largest found), upscaled ×4 with Real-ESRGAN (realesrgan-x4plus) and saved at 2968 px | the painting |
| `alex-mosaic.png`, `alex-bucephalus.png`, `battle.png`, `coin.png`, `map.png`, `desert.png`, `vultures.png` | collage pieces | Commons: "Detail of Alexander from the Alexander Mosaic - 42316191564.jpg", "Alexander Mosaic (6000 x 3730).jpg" (`alex-bucephalus.png`: Alexander on his horse, cut from the mosaic), "Greece, 4th century BC - Tetradrachm- Alexander the Great (obverse) - 1917.984.a - Cleveland Museum of Art.tif", "Butler Oriens.jpg", "The army crosses the Gedrosian Desert by Andre Castaigne (1898-1899).jpg" | `collage` |
| `p-alexander.png`, `p-men.png` | the painting's figures | cut in colour from `alexander.jpg` | `collage` |
| `sand.jpg` | sand paper background | procedural | `collage` |

## `scream/` — GuideScream

| file | artwork | source | use |
|---|---|---|---|
| `scream.jpg`, `scream-face.jpg`, `scream-note.jpg` | Edvard Munch, *The Scream* (1893), Nasjonalmuseet NG.M.00939 | Commons "Edvard Munch - The Scream - NG.M.00939 - National Museum of Art, Architecture and Design.jpg" (museum scan, 6703 × 8322, public domain), saved at 3222 px; face and pencil inscription cropped at native resolution | the painting + `insets` |
| `scream-3d.jpg` (preview `out/scream-depth.png`) | depth map of `scream.jpg` (Depth Anything V2 Small, Apache-2.0, `scripts/image-depth.py`) and the painting stacked over it for the shader | above | `depth` |
| `figure.png`, `figure-cut.png`, `sky-strip.png` | the figure's head and hands (torn print), the figure cut out in place (`image-collage.py --cut --keep-box`), the sky (top third) | `scream.jpg` above | `shots` |
| `journal.png` | William Clark's red leather notebook (a small diary standing in for Munch's; "Journal" is written over it in the edit) | Commons "Red Leather Notebook of William Clark.jpg", cut out in colour | `shots` (the diary) |
| `munch.png` | portrait of Edvard Munch (c. 1889) | Commons "Portrait of Edvard Munch (cropped).png", CC BY 2.0 | `shots` |
| `kristiania.png` | Kristiania seen from Ekeberg | Commons "660 Kristiania. Utsigt fra Ekeberg - no-nb digifoto 20151218 00007 bldsa PK05702.jpg" (National Library of Norway postcard, public domain) | `shots` |
| `sky-chelsea-1.png`, `sky-chelsea-2.png`, `krakatoa.png` | William Ascroft's crayon sketches of the afterglow at Chelsea, 26 Nov. 1883, and the eruption lithograph (Parker & Coward) | *The Eruption of Krakatoa and Subsequent Phenomena*, Royal Society, 1888 (Internet Archive `eruptionkrakato00whipgoog`, coloured frontispiece pages n10–n11; Commons "Krakatoa eruption lithograph.jpg"), public domain | `shots` |
| `harper.png` | *Harper's Weekly*, 29 Sept. 1883, p. 613: "The island and volcano of Krakatoa…" (top of the page) | Library of Congress via Commons "The island and volcano of Krakatoa, Strait of Sunda, submerged during the late eruption LCCN2002714721.jpg", public domain | `shots` |
| `red-sunsets.png`, `page-science.jpg`, `page-science-2.jpg` | *Science* vol. III: letter "The red sunsets" (4 Jan. 1884, p. 3; New Haven's fire alarm on 27 Nov.) and the full pages as backgrounds | Internet Archive `science31884amer`, pages n12 and n47, public domain | `shots` |
| `map.png`, `map-europe.png` | Malte-Brun, *Mappe-monde suivant la projection de Mercator*, 1832 (Europe → Indonesia, contrast raised; Northern Europe torn print) | Commons "1832 Malte-Brun Map of the World on Mercator Projection - Geographicus - Mappemonde-mb-1832.jpg", public domain | `shots` |

## `paris-rain/` — GuideParisRain

| file | artwork | source | use |
|---|---|---|---|
| `paris-rain.jpg` | Gustave Caillebotte, *Paris Street; Rainy Day* (1877), Art Institute of Chicago 1964.336 | Commons "Gustave Caillebotte - Paris Street; Rainy Day - Google Art Project.jpg" (5982 × 4531, public domain), saved at 4000 px | the painting |
| `rue-aumaire.png` | Charles Marville, Rue Aumaire, c. 1853–70 | Commons "Charles Marville, Rue Aumaire.jpg", public domain | `shots` (old Paris) |
| `cholera.png` | « Le choléra à Paris », engraving | Commons "Le choléra à Paris (5036894480).jpg" (National Library of Medicine via Flickr, no known restrictions) | `shots` |
| `napoleon.png`, `haussmann.png` | portraits of Napoléon III (Levitsky) and Baron Haussmann (Reutlinger) | Commons "Portrait de Charles Louis Napoléon Bonaparte … PH54464.jpg", "Portrait du baron Haussmann … PH51656(2).jpg" (Paris Musées, CC0), cut out, halftone | `shots` |
| `demolition.png` | Charles Marville, the avenue de l'Opéra cut through the butte des Moulins (Dec. 1876–Feb. 1877) | Commons "Percement de l'avenue de l'Opéra Butte des Moulins (de la rue d'Argenteuil), PH937.jpg" (Paris Musées, CC0) | `shots` |
| `map-1868.png` | Andriveau-Goujon, *Plan d'ensemble des travaux de Paris* (1868), new streets in red | Commons "Andriveau-Goujon, Plan d'ensemble des travaux de Paris, 1868 - David Rumsey.jpg", public domain; colour and contrast raised | `shots` |
| `haussmann-demolisseur.png` | caricature of Haussmann as "artiste démolisseur" | Commons 'Haussmann as "Artiste Démolisseur".jpg', public domain, cut out | `shots` |
| `daumier-demenagement.png` | Honoré Daumier, *Locataires et propriétaires*: families moving out | Commons "Locataires et Propriétaires - caricature.jpg", public domain | `shots` |
| `stamp-napoleon.png` | Empire franc 40 c orange, Napoléon III (1853) | Commons "Napoléon 3 40c jaune orange.jpg", border trimmed | lab (`postage`) |

## `kit/` — shared ephemera (any episode)

| file | what | source | use |
|---|---|---|---|
| `manicule.png` | engraved pointing hand (manicule), ink on transparent | Commons "Manicule left pointing.jpg", paper keyed out | a pointer in any collage |
| `chiffonnier.png` | Eugène Atget (attr.), *Chiffonnier*, c. 1899–1901, a rag-picker with his sack | Commons "Chiffonnier, PH1072.jpg" (Paris Musées, CC0), cut out, halftone | `GuideVox` (walks) |
| `charrette.png` | Eugène Atget, *Chiffonnier, avenue des Gobelins*, June 1901, a rag-picker and his cart | Commons "Chiffonnier, avenue des Gobelins, 13ème arrondissement, Paris, PH1161.jpg" (Paris Musées, CC0), cut out, halftone | `GuideVox` (turns) |
| `opera-ink.png` | engraving of the Opéra Garnier, 1875 | Commons "Opéra de Paris (Garnier) 1875.jpg", building cut out, paper keyed out (ink lines only) | `GuideVox` (monument behind) |
| `people-herbes.png` | Eugène Atget, *Marchand d'herbes*, c. 1898–1900, a boy selling herbs, full figure | Commons "Atget - (Marchand d'herbes), btv1b105067893.jpeg" (BnF Gallica), cut out, halftone | a passer-by of 19th-c. Paris (walks) |
| `people-parapluies.png` | Eugène Atget, *Marchand de parapluies*, c. 1898–1900, full figure | Commons "Atget - (Marchand de parapluies), btv1b10506824r.jpeg" (BnF Gallica), cut out, halftone | idem |
| `people-paniers.png` | Eugène Atget, *Marchand de paniers*, c. 1898–1900, full figure | Commons "Atget - Marchand de paniers, btv1b10506793t.jpeg" (BnF Gallica), cut out, halftone | idem |
| `monument-arc-ink.png` | engraving, *Arc de Triomphe de l'Étoile*, 19th c. | Commons "Arc de triomphe de l'Etoile. QB.291.jpg" (BnF), cut out, paper keyed out | monument behind a Paris cluster |
| `monument-notredame-ink.png` | engraving, *Notre-Dame, église cathédrale de Paris*, 19th c. | Commons "Notre-Dame - Eglise Cathédrale de Paris 2.jpg", cut out, paper keyed out (dark etching: lower key) | idem |
| `rigs/napoleon/*.png` | Napoléon III standing in civil dress, carte de visite, c. 1860 (De Vinck 16442), cut into a paper puppet (legs, torso, head, two-piece arms, the back arm mirrored) | Commons "Napoléon III, en pied, debout, en costume civil, s'appuyant de la main g. au dossier d'une chaise - btv1b53020248t.jpg" (BnF Gallica), `scripts/rigs/napoleon.json`, halftone | `rig: "napoleon"` (swings a pickaxe) |
| `rigs/haussmann/*.png` | the same frock-coat body with Baron Haussmann's head (Reutlinger) | as above + Commons "Portrait du baron Haussmann … PH51656(2).jpg" (Paris Musées, CC0), `scripts/rigs/haussmann.json` | `rig: "haussmann"` |
| `rigs/rat/*.png` | John Woodhouse Audubon, *Brown or Norway Rat*, plate LIV, *Viviparous Quadrupeds of North America*, 1845 (the male, top left), cut into body, head, front and hind leg; the tail is drawn | Commons "Brown rat, or Norway rat (Mus decumanus) … Audubon (1812-1862).jpg", `scripts/rigs/rat.json`, colour | `rig: "rat"` (scurries) |
| `rigs/pioche.png` | a pickaxe in cut paper | our own (drawn with PIL) | the diggers' tool |
| `ruelle-print.png`, `rivoli-print.png` | narrower prints of the rue du Haut-Moulin (Marville) and the new rue de Rivoli (1854) | crops of `ruelle-haut-moulin.jpg` and of a print of the new rue de Rivoli (1854), torn print | d3 split screen |
| `bonne.png` | Giovanni Boldini, *The Maid* (charcoal), 19th c. | Commons "Giovanni Boldini The maid.jpg", public domain, cut out, bw | d4 (under the roof) |
| `couple.png` | the couple of *Rue de Paris, temps de pluie* (Caillebotte, 1877) | cut from `paris-rain-6k.jpg`, colour | d4 (the 2nd floor) |
| `maison/maison-1…5.png` | Charles Marville, *Rue Saint-Hilaire, vue prise de la rue de l'École-Polytechnique* (the corner house « Vins Virat », rue des Sept-Voies), c. 1865, cut roof to shop in five pieces | Commons "Rue Saint-Hilaire, vue prise de la rue de l'Ecole-Polytechnique, 5ème arrondissement, Paris, PH593.jpg" (Paris Musées, CC0), `scripts/rigs/maison.json`, bw | GuideParisRain d2 (knocked down by the giants) |
| `ville-1870.jpg` | Charles Marville, *Percement de l'avenue de l'Opéra, Butte des Moulins*, c. 1876 | Commons "Percement de l'avenue de l'Opéra Butte des Moulins, vue prise de la rue Saint-Honoré, 1er arrondissement, Paris, PH43103.jpg" (Paris Musées, CC0), full-bleed bw | d2 background |
| `plan-1868-centre.jpg` | the centre of the 1868 Andriveau-Goujon plan at full resolution, its printed red works faded | crop of the David Rumsey scan (see `map-1868.png`); the drawn streets: OpenStreetMap centrelines (© OpenStreetMap contributors) registered on the plan, `src/episodes/GuideParisRain.boulevards.ts` | d3 |
| `delacroix-liberte.png` | Eugène Delacroix, *La Liberté guidant le peuple*, 1830 (Louvre), crop | Commons "Eugène Delacroix - La liberté guidant le peuple.jpg", public domain, torn print | d3 (1830) |
| `daumier-transnonain.png` | Honoré Daumier, *Rue Transnonain, le 15 avril 1834*, lithograph | Commons "Honoré Daumier, Rue Transnonain, le 15 avril 1834, 1834, NGA 6133.jpg", public domain | d3 (1834) |
| `vernet-soufflot.png` | Horace Vernet, *Barricade rue Soufflot*, 1848 | Commons "Horace Vernet-Barricade rue Soufflot.jpg", public domain | d3 (1848) |
| `rigs/casseur/*.png` | Gustave Courbet, *Les Casseurs de pierres*, 1849 (destroyed 1945): the old stone-breaker cut into his body and his arms with the hammer, pinned at the shoulder | Commons "Gustave Courbet - The Stonebreakers - WGA05457.jpg", public domain, `scripts/rigs/casseur.json`, colour | `rig: "casseur"` (GuideParisRain d5) |
| `casseur-jeune.png` | the boy carrying the basket of stones, same painting | same file, cut out, colour | d5 (walks across the building site) |

## `ambassadors/` — GuideAmbassadors

| file | artwork | source | use |
|---|---|---|---|
| `ambassadors.jpg` | Hans Holbein the Younger, *The Ambassadors* (1533), National Gallery, London | Commons "Hans Holbein the Younger - The Ambassadors - Google Art Project.jpg" (30000 × 29560), resized to 7000 px | the painting |
| `skull-smear.png` | same | crop 0.26–0.78 × 0.72–1.0 of the same file, `image-collage.py --cut --tone colour --keep-box --width 2400 --rim 14` | the anamorphic skull as a paper piece, squashed along its axis to reveal the skull |
| `rome-caesar.png`, `rome-slave.png` | Andrea Mantegna, *The Triumphs of Caesar IX* (1484–1492), Royal Collection | Commons RCIN 403966 (1741 px); Caesar cut with `image-collage.py --cut`, the crown-bearer behind him with a seeded GrabCut, flipped | d2 paper puppets |
| `rome-forum.png` | Piranesi, *Veduta di Campo Vaccino* (Vedute di Roma) | Commons, Rijksdienst voor het Cultureel Erfgoed NK1313 | d2 background |
| `rome-crowd.png` | Mantegna, *Triumphs of Caesar: Trumpeters and Standard-Bearer* | Commons WGA13990, cut | d2 foreground crowd |
| `crown-laurel.png`, `crown-tiara.png`, `crown-king.png` | gold laurel wreath (3rd–2nd c. BC, National Archaeological Museum, Athens); tiara of Pius IX (1854); Imperial Crown of the Holy Roman Empire | Commons, cut | unused since v7 (was d1) |
| `mm-pompeii.png` | skull mosaic from Pompeii, 1st c., MAN Naples inv. 109982 | Commons "Skull mosaic MAN Naples Inv 109982.jpg" | d1 |
| `mm-caravage.png` | Caravaggio, *Saint Jerome Writing* (1605–06), Galleria Borghese | Commons "Saint Jerome Writing-Caravaggio (1605-6).jpg" | d1 |
| `mm-champaigne.png` | Philippe de Champaigne, *Vanité* (c. 1671), Musée de Tessé, Le Mans | Commons, crop inside the frame | d1 |
| `mm-vangogh.png` | Van Gogh, *Head of a Skeleton with a Burning Cigarette* (1886), Van Gogh Museum | Commons VGM F212 | d1 |
| `mm-hirst.png` | Damien Hirst, *For the Love of God* (2007) | en.wikipedia "Hirst-Love-Of-God.jpg", cut | d1 |
| `dance-mural.png` | Bernt Notke, *Danse Macabre* (c. 1490), St Nicholas Church, Tallinn | Commons "Bernt Notke Danse Macabre.jpg", crop of the dancers | d4 |
| `marc-aurele.png` | bust of Marcus Aurelius, Glyptothek Munich | Commons "Marcus Aurelius Glyptothek München.jpg", cut | d3 |
| `reaper.png` | Dürer, *Knight, Death and the Devil* (1513), NGA | Commons NGA 6637, crop of Death with the hourglass | d3 |
| `dance-pope.png`, `dance-king.png`, `dance-ploughman.png` | Holbein, *The Dance of Death* (Lyon 1538) | Commons MET DP-23026-001, DP-19849-001, DP-23139-001 | d4 |
| `dinteville.png`, `selve.png`, `q-face-*.png`, `q-medal.png`, `obj-*.png`, `hat.png`, `ambassadors-clean.jpg`, `skull.png`, `skull-floor.jpg` | Holbein, *The Ambassadors* | crops/cut-outs of `ambassadors.jpg` (the smear painted out by inpainting in the clean/floor copies; the skull = the smear squashed along its axis) | d5–d8, reveal |
| `clement.png`, `henry.png`, `holbein.png`, `meditations.png`, `boscoreale.png`, `caesar.png`, `crucifix.png`, `vanite-*.png`, `v-*.png`, `luther.png` | earlier drafts (Sebastiano del Piombo, Holbein, 1697 Gataker title page, Boscoreale cup drawing, Champaigne, Steenwijck, Claesz, Willebeeck, Cranach) | Commons | not used in the current cut |

## mona-lisa/ (GuideMonaLisa)

| File | Artwork | Source | Use |
|---|---|---|---|
| `mona-lisa.jpg`, `joconde-card.png` | Leonardo, *Mona Lisa*, Louvre | Commons "Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg" | the painting; d3, d7 card |
| `ex-decroche.png`, `ex-cadre.png`, `ex-escalier.png`, `ex-quai.png` | *Excelsior*, reconstruction of the theft (Dec. 1913) | Commons "Vincenzio Peruggia stealing Mona Lisa.jpg", panels cropped | context, d1 |
| `wall.png` | the empty wall in the Salon Carré, press photograph, 1911 | Commons "Mona Lisa stolen-1911.jpg" | d2, d5 |
| `louvre.png` | Palais du Louvre, c. 1880–1910 (photochrom) | Commons "Palais du Louvre, ca. 1880–1910.jpg", bw | context, d3 |
| `press-iskry.png`, `press-domenica.png` | *Iskry* n° 31 (Moscow, Aug. 1911); *La Domenica del Corriere* (Sept. 1911) | Commons "1911. Искры №31 001.jpg", "Stealing Mona Lisa.jpg" | d3 |
| `apollinaire.png`, `picasso.png` | Apollinaire (photo, 1914); Picasso (photo, 1908) | Commons "Guillaume Apollinaire 1914.jpg", "Portrait de Picasso, 1908 (background retouched).jpg" | d4 |
| `crowd-l.png`, `crowd-r.png`, `return.png` | the return of the Joconde to the Louvre, 1914 | Commons "After photo for the return of Gioconda at the Louvre Museum 1914.jpg", cut | d5 crowd, d9 |
| `bertillon.png` | Peruggia's Bertillon card (1909) | Commons "Vincenzo Perugia.jpg" | d6 |
| `trunk-body.png`, `trunk-lid.png` | a steamer trunk, split into its body (the opening painted dark) and its lid | Commons "Trunk 1.jpg", cut | d7 |
| `florence.png` | the painting found in Florence, Dec. 1913 | Commons "Mona Lisa is recovered 3.jpg" | d8 |
| `press-parisien.png` | *Le Petit Parisien* n° 13559, 13 Dec. 1913 | Commons, top half | d8 |
| `today.png` | visitors photographing the Mona Lisa | Commons "Visitors of the Louvre taking photographs of Mona Lisa (1325512 1920).jpg" | d9 |
| `thief.png` | the thief in his smock, *Excelsior* reconstruction (Dec. 1913) | Commons "Vincenzio Peruggia stealing Mona Lisa.jpg", panel "Sous la blouse", cut | hook puppet |
| `policeman.png` | a sergent de ville, place de la Bastille (photo, 1906) | Commons "Sergents de la ville, place de la Bastille, 11ème arrondissement, Paris. PH1096.jpg", cut | d7 puppet |
| `plan.png` | *Plan historique du Louvre, 1850-1900* | Commons "Plan historique du Louvre, 1850-1900 - Gallica.jpg", bw | d1 |
| `folder-front.png`, `folder-page.png` | the case file in manila card, full screen (cover, first page) | drawn with PIL (typewriter label, stamp, coffee ring) | context |
| `press-canada.png` | *Victoria Daily Times*, 30 Aug. 1911, "Masterpiece still missing" (masthead + article) | Internet Archive victoriadailytimes19110830, p. 2 | d3 |
| `press-spain.png` | Madrid art review, 15 Sept. 1911, on the Gioconda | Commons "1911-09-15-Gioconda-di-Madrid-revista-de-ensenanza-y-bellas-artes-pag-13.jpg" | d3 |
| `map.png` | *Carte des chemins de fer de l'Europe*, May 1910 (Livrets à coupons combinables) | Commons "Carte des chemins de fer de l'Europe. - btv1b531214914 (1 of 2).jpg", France–Italy crop | d8 |
| `train.png` | a PLM Pacific locomotive | Commons "PLM Pacific (cropped).jpg", cut | d8 |
| `handcuffs.png` | handcuffs, 19th–20th c., Museum of Moscow | Commons "Handcuffs - 19-20c - Museum of Moscow.jpg", cut | d8 |
| `picasso-cut.png` | Picasso (photo, 1908), cut | Commons "Portrait de Picasso, 1908 (background retouched).jpg" | hook |
| `lineup.jpg` | a police height chart | drawn with PIL | hook |
| `beroud.png` | Louis Béroud, the painter who noticed the theft (photo) | Commons "Louis Beroud photo.jpg", cut | d2 |
| `key.png` | an old skeleton key (Yale & Towne) | Commons "Skeleton key (Yale & Towne).png", cut | d1 |

## meegeren/ (GuideMeegeren)

| File | Artwork | Source | Use |
|---|---|---|---|
| `emmaus.jpg`, `emmaus-card.png` | Han van Meegeren, *The Supper at Emmaus* (1937), Boijmans, Rotterdam | Commons "EmmausgangersVanMeegeren1937.jpg" | the painting; d3, d4, d5 |
| `hvm.png` | Van Meegeren in his studio, 1945 (Anefo) | Commons "Han van Meegeren in zijn atelier … Bestanddeelnr 133-1154.jpg", cut | hook, d1, d2 |
| `hvm-1928.png` | Van Meegeren in his Hague studio, 1928 | Commons "Han van Meegeren in z'n Haagsche atelier, 1928.jpg" | d5 |
| `painting-1945.png` | Van Meegeren painting *Jesus among the Doctors*, Oct. 1945 | Commons "HanVanMeegerenOct1945.jpg" | hook, d8 |
| `witnesses.png` | the same, Rijksmuseum print RP-F-2005-10 | Commons | d6 |
| `doctors.png` | Van Meegeren, *Jesus among the Doctors* (1945) | Commons "Jesus unter den Schriftgelehrten von Han van Meegeren.jpg" | d6 |
| `court.png` | the trial, Amsterdam, 1947 (Anefo) | Commons "Proces Van Meegeren, Bestanddeelnr 902-4286.jpg" | d7 |
| `hands.png` | Van Meegeren at work (Anefo) | Commons "Han van Meegeren aan het werk, Bestanddeelnr 900-9593.jpg" | d4 |
| `pigments.png` | the pigments seized as evidence | Commons "Evidence against Han van Meegeren - pigments.jpg", crop | d4 |
| `goring.png`, `goring-cell.png` | Hermann Göring (portrait by Röhr); in his cell, Nuremberg, 1945 | Commons "Hermann Göring - Röhr.jpg", "Nazi official Hermann Göring in jail cell Nuremberg Trials 1945.jpeg" | context, d1, d7 |
| `milkmaid.png` | Vermeer, *The Milkmaid*, Rijksmuseum | Commons Google Art Project | d5 |
| `bredius.png` | Abraham Bredius (engraving) | Commons "Abraham Bredius.jpg" | d3 |
| `gavel.png` | a wooden gavel | Commons "Wooden gavel 20170417.jpg", cut | hook, d7 |
| `folder-front.png`, `folder-page.png`, `unknown.png`, `frames.png`, `lineup.jpg` | the case file, an unknown canvas, 137 little frames, the height chart | drawn with PIL | context, d2, hook |

## GuideExposNov (`art/expos/`)

| File | Work | Source | Used in |
|---|---|---|---|
| `caresses.png` | Fernand Khnopff, *Des caresses* (1896), Musées royaux des Beaux-Arts de Belgique | Commons "Fernand Khnopff - Caresses - Google Art Project.jpg" | hook, d1, d7 |
| `lions.png` | Court of the Lions, Alhambra, Granada (photograph) | Commons "Fountain patio de los Leones Alhambra Granada Spain.jpg" | hook, d2 |
| `casilda.png` | Francisco de Zurbarán, *Sainte Casilda* (c. 1635), Museo Thyssen-Bornemisza | Commons "Francisco de Zurbarán - Santa Casilda.jpg" | hook, d3, d7 |
| `victoire.png` | Paul Cézanne, *La Montagne Sainte-Victoire au grand pin* (c. 1887), Courtauld | Commons "Mont Sainte-Victoire with Large Pine, by Paul Cézanne.jpg" | hook, d4, d7 |
| `cassatt.png` | Mary Cassatt, *Jeune fille au jardin* (c. 1880–82), musée d'Orsay | Commons "Mary Cassatt - Girl in the Garden - Google Art Project.jpg" | hook, d5 |
| `rain-window.png` | Gustave Caillebotte, *Rue de Paris, temps de pluie* (1877) | `art/paris-rain/paris-rain.jpg` | hook |

The Guide's rainy-day poses (`public/guide/cozy … shiver.png`) come from `docs/brand/sheets/sheet_bank_3.png`
(scripts/guide-prompts/bank-3.xml). The map is `src/guide/maps/paris-centre.ts` (OpenStreetMap).

## GuideBanksy (`art/banksy/`, `clips/banksy/`)

| File | What | Source | Used in |
|---|---|---|---|
| `girl.jpg` | Banksy, *Girl with Balloon* | WikiArt "girl-with-balloon-0" | anchor, d1–d3 (the paper shredder) |
| `morons.png` | Banksy, *I can't believe you morons actually buy this shit* (2007) | WikiArt | d1, d4 |
| `hoodie.png` | a hooded figure, the face a void | drawn with PIL | d5 |
| `stencil.png` | Banksy full length as a stencil, the face a void, arms out to hold the canvas | drawn with PIL | context (walks in with the canvas) |
| `banker.png` | Honoré Daumier, *Le Banquier* (Types français, c. 1835), cut out, halftone | Commons "Le banquier - DPLA - 4fe585fba75fe4f0844ae5df68beca2d.jpg" (public domain) | context (the collector) |
| `wad.png` | a wad of £50 notes | drawn with PIL | context (the payment) |
| `room-intact.jpg`, `cutout.png` | the painting on the wall at Sotheby's before the hammer, and the same pixels cut out with a paper rim | frame 40.8 s of the banksyfilm Sotheby's video | d2 (cut out with scissors, peeled off) |
| `balloon.png` | the red heart balloon, cut from `girl.jpg` | — | d4 (let go) |
| `clips/banksy/shred-room.mp4`, `gavel.mp4`, `hammer.mp4`, `facade.mp4` | the room at Sotheby's, 5 Oct. 2018 | banksyfilm, "Sotheby's, October 5th 2018" (YouTube iiO_1XRnMt4), cut and cropped (`hammer.mp4`: 37.13 s → 40.13 s, the strike at 1.3 s) | hook, d3 |
| `clips/banksy/build-*.mp4`, `full-shred.mp4` | building the shredder; the rehearsal | banksyfilm, "Shredding the Girl and Balloon – The Director's half cut" (YouTube vxkwRNIZgdY) | context |

## GuideCaravaggio (`art/caravaggio/`)

| file | what | source | used in |
|---|---|---|---|
| `david.jpg` | Caravaggio, *David with the Head of Goliath*, c. 1609–10, Galleria Borghese (resized to 3555 px) | Commons "David with the Head of Goliath-Caravaggio (1610).jpg" (5922 × 7329, public domain) | the painting |
| `goliath.png`, `head-hand.png`, `david-card.png` | crops of the painting (Goliath's head; the head in David's fist; the whole) | `david.jpg` via `image-collage.py` | hook, d3, d4 |
| `leoni.png` | Ottavio Leoni, portrait of Caravaggio, chalk on blue paper, c. 1621, Biblioteca Marucelliana | Commons "Ritratto di Caravaggio (Ottavio Leoni).jpg" (public domain) | hook, context, d1, d4 |
| `paulv.png` | Caravaggio, *Portrait of Pope Paul V*, Palazzo Borghese | Commons "Pope Paul V.jpg" (public domain) | d1, d3 |
| `scipione.png` | Bernini, bust of Cardinal Scipione Borghese (1632), Galleria Borghese, cut out | Commons "Bernini ScipioneBorghese.jpg" (CC BY-SA 4.0) | d3 |
| `rome.png` | Antonio Tempesta's view of Rome (1593, De Rossi edition 1645), lower part | Commons "Tempesta 1593, De Rossi 1645.jpg" (public domain) | context |
| `duel-l.png`, `duel-r.png` | Jacques Callot, *Duel with Swords* (c. 1622), the two fighters cut out as puppets (Caravaggio, Tomassoni) | Commons "Jacques Callot, Duel with Swords, c. 1622, NGA 51628.jpg" (NGA, public domain) | context |
| `fugitive.png` | Jacques Callot, *La Noblesse* (10), the gentleman wrapped in his fur-lined cloak: Caravaggio on the run | Commons "La noblesse. (10) (Le gentilhomme enroulé dans son manteau bordé de fourrures) - estampe - Callot - btv1b8496127d.jpg" (BnF, public domain) | d1, d2, d3, d6 |
| `hunter-r.png`, `hunter-l.png` (mirrored) | Jacques Callot, *Le Gentilhomme à la grande canne*, the right-hand figure: the bounty hunters | Commons "Le Gentilhomme a la Grande Canne Met DP888263.jpg" (Met, public domain) | d1 |
| `wanted.png` | the Western wanted poster, drawn for the video: Rye woodtype (Google Fonts, OFL), the studio's parchment scan aged and burnt, Leoni's portrait in sepia; the "1000 écus" reward is invented (the user's call: no sum is known) | our own (PIL) | d1 |
| `thumb.png` | a hand giving the thumbs-down, cut out in halftone | Commons "Jempol Ngadep Bawah (cropped).jpg" (Pinerineks, 2021, CC BY-SA 4.0) | d1 |
| `ship.png` | a ship from Ortelius's map of Italy (Castaldo, *Italiae novissima descriptio*, 1570), cut out | Commons "Italiae Novissima Descriptio Auctore Iacobo Castaldo Pedemontano. Cum privilegio. (IA dr …-10000073).jpg" (David Rumsey, public domain) | d6 |
| `sea.png`, `sand.png` | torn paper bands for the shore, drawn over the studio's crumpled paper scan | our own (PIL) | d6 |
| `src/guide/maps/italie-malte.ts` | the flat map from Tuscany to Malta: coastline from Natural Earth 1:10m (public domain), places at their coordinates | `scripts/map-osm.py italie-malte --coast` | d2 |


## GuideMondrian (`art/mondrian/`)

| file | what | source | used in |
|---|---|---|---|
| `nyc1.jpg` | Piet Mondrian, *New York City I* (1941), K20 Düsseldorf, as it hangs; 952 px scan doubled (Lanczos) | Commons, `New York City I.jpg` (public domain) | the painting, d1, d4 |
| `nyc1-up-bare.jpg`, `tape-*.png` | the same turned over, the four top tapes cut out as pieces and the canvas under them filled from a clean band of the painting | our own (PIL) from `nyc1.jpg` | d4 (the tapes fall) |
| `pompidou.png` | Piet Mondrian, *New York City* (1942), Centre Pompidou | Commons, `Piet Mondriaan, 1942 - New York City I.jpg` (public domain) | d3 |
| `portrait.png` | Piet Mondrian, photograph published Dec. 1922 | Commons, `Piet Mondrian 1.jpg` (public domain) | d0 |
| `signature.png` | his signature | Commons, `Mondrian Signatur.png` (public domain) | d0 |
| `k20.png` | the K20, Kunstsammlung Nordrhein-Westfalen, Düsseldorf | Commons, `K20 Düsseldorf.jpg` (Will Palmer, CC BY 2.0) | context |
| `studio.png` | model of Mondrian's New York studio (1943), made 1987 | Commons, `Modellino dello studio di mondrian a new york del 1943, 1987, 01.jpg` (Sailko, CC BY 3.0) | d2 |
| `composition.png` | Piet Mondrian, *Composition II in Red, Blue and Yellow* (1930) | Commons, `Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg` (public domain) | d0 |

## GuideBanana (`art/banana/`, `clips/banana/`)

| file | what | source | used in |
|---|---|---|---|
| `clips/banana/datuna-enter.mp4`, `datuna-grab.mp4` (`grab0.jpg`: its first frame), `datuna-bite.mp4`, `datuna-chew.mp4`, `still1.jpg` | David Datuna stepping up, pulling it off the wall and eating it, Art Basel Miami Beach, 7 Dec. 2019 | The Guardian (YouTube 9ZqdfUHtkk8), 0.9 s, 2.6 s, 14.9 s, 16 s, 15.3 s, cropped off the logos | hook, context, d4, the loop |
| `clips/banana/seoul-eat.mp4`, `seoul-peel.mp4`, `still2.jpg` | Noh Huyn-soo eating it and taping the peel back, Leeum Museum of Art, Seoul, 2023 | The Guardian / KBS (YouTube qvwfWyU9Gfc), 2 s, 10.3 s, 4 s, cropped above the captions | d1, d4 |
| `clips/banana/hammer.mp4` | the hammer, with its sound; Sotheby's New York, 20 Nov. 2024 | Sotheby's, "The World's Most Expensive Banana" (YouTube E7pPomFdpLY), 431.1 s (the close shot of the auctioneer, the hammer at 2.6 s) | d2 |
| `clips/banana/bite.mp4`, `still3.jpg` | Justin Sun eating it, Hong Kong, 29 Nov. 2024 | HK01 news (YouTube 7QaKIfPhY_M), 22.62 s, cropped above the subtitles | d2, d4 |
| `banana.png`, `tape.png` | a banana and its tape, cut out in place (1250 × 1450 crop from x 440, y 170) | our own (PIL) from Commons, `Banana duct taped to fridge as a reminder to eat less meat.jpg` (Jane023, CC0) | d0 |
| `whole.png` | a whole banana | Commons, `Banana-Single.jpg` (Evan-Amos, CC BY-SA 3.0) | d3 |

## ronin (GuideRonin, Nov. 2026)

| file | what | source |
|---|---|---|
| yada.jpg, r486–r496.png | Utagawa Kuniyoshi, *Seichū gishi shōzō* (portraits of the loyal retainers), 1852 | The Met, Commons "MET DP124486…DP124496.jpg" (yada = DP124490) |
| castle.png | Utagawa Hiroshige, *Chūshingura*, act III | Commons "Utagawa Hiroshige-Chushingura Act III-IMG 9279.JPG" |
| palace.png | *Kanadehon Chūshingura*, act III (Sandanme) | Rijksmuseum RP-P-1902-A-22864 (Commons) |
| sentence.png | Hiroshige, *Chūshingura*, act IV: the shogun's envoys bring the sentence | LACMA M.66.35.49 (Commons) |
| night.jpg | Kuniyoshi, *Chūshingura jūichidanme youchi no zu* (the night attack) | Rijksmuseum RP-P-1960-5 (Commons) |
| drum.png | Tsukioka Yoshitoshi, Ōishi Kuranosuke Yoshio | LACMA M.84.31.335 (Commons) |
| battle.png | Kuniyoshi, *Chūshingura youchi no zu* | British Museum 2008,3037.18805 (Commons) |
| march.png | Hiroshige, *Chūshingura*, act XI: the rōnin going to Sengaku-ji | LACMA M.66.35.59 (Commons) |
| incense.png | *Chūshingura shijūshichi-nin gishi shōkō no zu* (the 47 burn incense at the tomb) | British Museum 2008,3037.18810 (Commons) |
| graves.png | The graves of the 47 rōnin at Sengaku-ji, Tokyo | Commons "Graves of the 47 Rōnin at Sengaku-ji Sōtō Zen Buddhist temple, Tokyo, Japan.jpg" |

## mummy-brown (GuideMummyBrown)

| File | What | Source |
|---|---|---|
| ramses.jpg | Unwrapped mummy (labelled Ramesses II), photograph | Wellcome Collection M0009392, CC BY 4.0 (Commons "Unwrapped Mummy of Ramses II Wellcome M0009392.jpg") |
| head.png, head-photo.jpg | Ramesses II's mummy, head in profile, photograph c. 1881 | Commons "Ramses II mummy head view.jpg" |
| tube.png, swatch.png | C. Roberson & Co "Mummy" tube and test swatch (size above, linseed oil below) | Commons "Mummy tube.jpg" |
| jar.png | Apothecary jar "PULV. MUMIAE VER." | Deutsches Apotheken-Museum, Heidelberg (Commons "Deutsches Apothekenmuseum - Mumia.jpg") |
| gerome.jpg | Jean-Léon Gérôme, *Bonaparte devant le Sphinx*, 1868 | Commons "Jean-Léon Gérôme - Bonaparte Before the Sphinx.jpg" |
| examen.jpg | Paul Philippoteaux, *Examen d'une momie*, 1891 | Commons "Examen d'une momie by Paul Philippoteaux.jpg" |
| widow.jpg | Lawrence Alma-Tadema, *La Veuve égyptienne*, 1872 | Rijksmuseum SK-A-2427 (Commons) |
| mummy.png | Cut-out of the unwrapped mummy above | Wellcome M0009392 |
| longhi.jpg | Pietro Longhi, *L'Apothicaire*, c. 1752 | Gallerie dell'Accademia, Venice (Commons "Pietro Longhi - The Apothecary - WGA13411.jpg") |
| palette.png | A 19th-century palette (Musée Delacroix), cut out | Commons "Delacroix' s palette, brushes and plaster bust, sof2011.JPG" |
| coffin-lid.png | Inner coffin of Henettawy, lid, cut out | The Met (Commons "Inner Coffin of Henettawy (F) MET DP310777.jpg") |

## louis-heart (GuideLouisHeart)

| File | What | Source |
|---|---|---|
| caen.jpg, cover.jpg | Alexandre Pau de Saint-Martin, *Vue de Caen*, 1810 (musée Tavet-Delacour, Pontoise); cover.jpg = the painting framed on its own blurred browns, made locally | Commons "Vue de Caen.jpg" |
| sansculotte.png | Louis-Léopold Boilly, *Simon Chenard en costume de sans-culotte*, 1792 (Carnavalet P8), cut out | Commons "Louis Léopold Boilly - Portrait du chanteur Simon Chenard … P8 - Musée Carnavalet.jpg" (public domain) |
| knife.png | Kitchen knife, Delaire, c. 1920, cut out | Commons "Couteau de cuisine JD coutellerie Delaire vers 1920.jpg" |
| hand.png | French school, *Quatre études de mains* (1990.3), one hand cut out | Commons "Quatre études de mains, 1990.3.jpg" (CC0) |
| mortar2.png, mortar-front.png, pestle.png | Bronze mortar and pestle, Europe, 1501-1850 (Wellcome L0058934), separated locally so the pestle moves inside the bowl | Commons, CC BY 4.0 |
| crowd-mid.png, powder.png, heart-wrapped.png, fire-ground.png, blood-ground.jpg | made locally: the sans-culotte as a flat silhouette; a puff of brown flecks; heart-red.png in cream bands; the ground under the fire; crumpled paper in dark red; the eyepiece with the heart's engraved lines | — |
| gold-l.png, gold-r.png, caen-grey.jpg, rigaud-wink.png | made locally: heart-gold.png split in two halves; the *Vue de Caen* as a pale brown wash; rigaud-head.png with the left eye closed | — |
| rigaud.jpg, rigaud-small.jpg, rigaud-head.png | Hyacinthe Rigaud, *Louis XIV en grand manteau royal*, 1701 | Louvre (Commons "Hyacinthe Rigaud, Portrait de Louis XIV en grand manteau royal, 1701-1702, Paris, musée du Louvre.jpg") |
| heart.png, heart-red.png, heart-gold.png, hp-l/m/r.png | Heart, after Senac (fig. 1), cut out, tinted red and gold locally, split in three | Wellcome V0007847 (Commons) |
| porte.jpg | Alexandre Pau de Saint-Martin, *La Porte Saint-Denis* | Musée Carnavalet P784 (Commons) |
| signature.png | Pau de Saint-Martin's signature, 1799 | Commons "Signature de Alexandre Pau de Saint-Martin 1799.jpg" |
| `painter.png` | the painter in the studio, a stand-in (no portrait of Pau de Saint-Martin found): the man in the pale coat of Boilly, *Réunion d'artistes dans l'atelier d'Isabey*, 1798 (Louvre RF 1290 bis) | Commons, polygon cut, brightened | d1, d2 |
| `cagnards.jpg`, `capucines.jpg` | Pau de Saint-Martin, *Les cagnards de l'Hôtel-Dieu* (P231), *Le Boulevard des Capucines* (P752), Carnavalet | Commons, public domain | d1, d2 |
| `rigaud-bust.jpg`, `rigaud-horror.jpg` | Rigaud, *Louis XIV*, 1701 (Louvre), the head cropped; the same with paper eyes and an open mouth drawn on (our own) | see rigaud.jpg | d1, d2, d3 |
| `caen-xray.jpg`, `caen-heart.png` | the *Vue de Caen* inverted as an X-ray; the heart after Senac (Wellcome) in red line on its canvas | our own treatment | d5 |
| `paint-over.png` | brown paint filling the mortar and running down it, drawn for the video on the mortar's outline | our own (PIL) | d3 |

## agneau (GuideLamb)
- `face.jpg`, `face-old.jpg`, `cover.jpg`: https://commons.wikimedia.org/wiki/File:Ghent_Altarpiece_-_21c_restoration_-_Lamb_of_God_detail.jpg (Van Eyck, 1432; KIK-IRPA's before/during photographs), split, aligned, enlarged.
- `retable.png`: https://commons.wikimedia.org/wiki/File:Lamgods_open.jpg, white ground removed.
- `visitor-1640.png`: Commons "Ornatus Muliebris Anglicanes Femme debout, avec fraise et chapeau à grands bords N°20, G.21391 (1 of 2).jpg" (Wenceslaus Hollar, 1640), cut out.
- `visitor-1831.png`: Commons "Dandies of 1831.jpg" (Costumes Parisiens, 1831), the man in the redingote, cut out.
- `visitor-1900.png`: copy of `kit/people-parapluies.png` (Atget, c. 1898–1900).

## wounded (GuideWoundedMan)

| File | What | Source |
|---|---|---|
| painting.jpg, cover.jpg, painting-clean.jpg, sword.png, stain.png | Gustave Courbet, *L'Homme blessé*, 1844-1854, musée d'Orsay (RF 338); painting-clean: sword and stain removed for the shots where they arrive | https://commons.wikimedia.org/wiki/File:Portrait_of_the_Artist_called_The_Wounded_Man_(L'homme_blessé)_by_Gustave_Courbet.jpg |
| xray.jpg | Radiograph of *L'Homme blessé*, C2RMF, Jean-Louis Bellec; resized onto the painting, lifted a little (gamma 1.35) | https://c2rmf.fr/actualite/gustave-courbet-etudie-et-restaure-au-c2rmf-un-travail-au-long-cours |
| sieste.jpg, virginie.png, hole.png | Gustave Courbet, *La Sieste champêtre*, c. 1844, Besançon (D.3176) | https://commons.wikimedia.org/wiki/File:Sieste_champêtre,_D.3176.jpg |
| clock.jpg | The clock of the musée d'Orsay from inside, Roman Eisele, 2004 | https://commons.wikimedia.org/wiki/File:Paris_-_Musée_d'Orsay_-_big_clock_seen_from_the_interior.jpg |
| brush.png, phone.png | Drawn for this episode (the phone's screen shows the painting) | ours |

## `rhino/`

| file | what | source | use |
|---|---|---|---|
| cover.jpg, print.jpg, durer.png, bare.png, plate-*.png | Albrecht Dürer, *Rhinocerus*, woodcut, 1515 | NGA 47903, Commons "Albrecht Dürer, The Rhinoceros, 1515, NGA 47903.jpg"; cut by hand (flood fill on the ink, plates as polygons) | GuideRhino: frame 0, the armour assembled plate by plate, the copies |
| real.png, burgkmair.jpg | Hans Burgkmair, *Rhinoceros*, woodcut, 1515 | Commons "Burgkmair.png" | the real rhino, the rival print |
| elephant.png | School of Raphael, *The Elephant Hanno* (flipped) | Commons "Raffaello Sanzio (school of) - The Elephant Hanno - Google Art Project.jpg" | the elephant that flees |
| self.png | Dürer, *Self-Portrait*, 1500 (Alte Pinakothek) | Commons "Albrecht Dürer - 1500 self-portrait (High resolution and detail).jpg" | "jamais vu" |
| drawing.jpg, letter.jpg | Dürer, *Rhinoceros*, pen and ink, 1515 (British Museum SL,5218.161) | Commons "Albrecht Dürer - Rhinoceros (preparatory study) 1515 - BM SL,5218.161 -01.jpg" | the sketch; its handwriting as the letter |
| ship.png | after Bruegel, *Armed Three-Master* (MET DP818238) | Commons | the ship |
| lisbon.jpg | Braun & Hogenberg, Lisbon, 1572 | Commons "Lisbon in 1572.jpg" | the arrival |
| pope.png | Raphael, *Leo X* (Uffizi), cropped | Commons "Raphael - Pope Leo X with two cardinals (cropped).jpg" | the Pope |
| pisa.jpg | Door of Pisa Cathedral, school of Giambologna, c. 1602 (brightened) | Commons "Pisa, Cattedrale Santa Maria Assunta, central door, School of Giambologna, c1602, detail.jpg" | the copies |
| oudry.jpg | Jean-Baptiste Oudry, *Clara*, 1749 (Schwerin) | Commons "Jean-Baptiste Oudry - Rhinozeros Clara (1749).jpg" | the real one, at last |
| wounded/screen-explore.png, screen-scan.png, screen-story.png | The app's screens rebuilt in HTML from its tokens (animart-native-visit/src/ui/tokens.ts), not screenshots | ours |

## `glasses/`

| file | what | source | use |
|---|---|---|---|
| cover.jpg, crowd-photo.jpg, crowd.png, man.png, empty.jpg | Visitors around the glasses, SFMOMA, 2016 | teejay / Facebook, via Today (27 May 2016); room rebuilt without the people for empty.jpg | GuideGlasses: frame 0, the crowd arriving, the swap |
| glasses-photo.jpg, glasses.png, floor.jpg | The glasses on the floor, 2016 | teejay / Facebook, via Today | the hook, the test (glasses taken off the floor and laid back on) |
| museum.jpg, teens.png | TJ Khayatan and Kevin Nguyen at SFMOMA, 2016 | Kevin Nguyen, via Today | the two teens |
| sfmoma.jpg | SFMOMA from Yerba Buena Gardens, 2017 | Commons "2017 SFMOMA from Yerba Buena Gardens.jpg" | the place |
| fountain.jpg, urinal.png | Alfred Stieglitz, photograph of *Fontaine*, 1917 | Commons "Marcel Duchamp, 1917, Fountain, photograph by Alfred Stieglitz.jpg" | the urinal |
| duchamp.jpg | Duchamp at the Broadway Photo Shop, New York, 1917, cropped | Commons | Duchamp |

## `contrapposto/` (30 jours, Jour 1)

| file | what | source | use |
|---|---|---|---|
| `kouros.jpg` | Marble statue of a kouros, c. 590–580 BC, Met 32.11.1 | Commons "Marble statue of a kouros (youth) MET DT263.jpg", CC0 | the rigid archaic pose |
| `kritios.jpg` | Kritios Boy, c. 480 BC, Acropolis Museum | Commons "ACMA 698 Kritios boy 1.JPG" by Marsyas, CC BY-SA 2.5 | the first known contrapposto |
| `dory.jpg` | Doryphoros from Pompeii, Roman copy after Polykleitos, Naples | Commons "Doryphoros from Pompeii (Naples).jpg" by Yair Haklai, CC BY-SA 4.0 | the pose explained |
| `david.jpg` | Michelangelo, David, 1501–1504, Accademia, Florence | Commons "'David' by Michelangelo JBU0001.JPG" by Jörg Bittner Unna, CC BY 3.0 | hook, point 3 |

## `perspective/` (30 jours, la perspective)

| file | what | source | use |
|---|---|---|---|
| `last-supper.jpg` | Leonardo, The Last Supper, 1495–1498 | Commons "Leonardo da Vinci (1452-1519) - The Last Supper (1495-1498).jpg", public domain | hook, point 2 |
| `san-romano-london.jpg` | Uccello, The Battle of San Romano (London panel) | Commons "San Romano Battle (Paolo Uccello, London) 01.jpg", public domain | earlier cut |
| contrapposto/kendall-jenner-2026.jpg | Kendall Jenner, 83rd Venice Film Festival (2026), cropped | Colleen Sturtevant | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Kendall_Jenner_83rd_Venice_Film_Festival.jpg |
| contrapposto/jennifer-lopez-2025.jpg | Jennifer Lopez at the 2025 Sundance Film Festival, cropped | Everwest | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Jennifer_Lopez_at_the_2025_Sundance_Film_Festival_1.jpg |
| contrapposto/selena-gomez-2024.jpg | Selena Gomez at the 2024 Toronto International Film Festival, cropped | Frank Sun | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Selena_Gomez_at_the_2024_Toronto_International_Film_Festival_10.jpg |

## salvator (GuideSalvator)

| file | artwork | source | use |
|---|---|---|---|
| `painting.jpg`, `hand-restored.jpg`, `orb-restored.jpg` | Leonardo (attributed), Salvator Mundi, c. 1500, restored | Commons "Leonardo da Vinci, Salvator Mundi, c.1500, oil on walnut, 45.4 × 65.6 cm.jpg", public domain; 2400 px, crops of the 3300 px original | the painting, the blessing hand, the orb |
| `before-1958.jpg` | the same, Cook Collection photo before restoration | Commons "Leonardo da Vinci, Salvator Mundi before restoration (black and white), Cook Collection.jpg", public domain; registered onto `painting.jpg` (SIFT homography) | "Regardez-le en 1958", the swab's starting state, the vote |
| `cleaned.jpg` | the same, 2006-07 photo after cleaning | Commons "Salvator Mundi, 2006-07 photograph, after cleaning.jpg", public domain; registered onto `painting.jpg` | revealed by the swab |
| `catalogue-2005.jpg`, `catalogue.png` | Louisiana auction catalogue, 2005, lot 664 | Commons "Leonardo da Vinci, Salvator Mundi, 2005 auction catalogue.jpg", public domain | "After Leonardo", estimate [1200/1800] |
| `leonardo.jpg`, `leonardo.png` | Leonardo, presumed self-portrait, red chalk (Turin) | Commons "Leonardo da Vinci - presumed self-portrait - WGA12798.jpg", public domain | "le roi de l'optique" |
| `codex-optics.jpg`, `codex.png` | Leonardo, Codex Atlanticus, eye diagram | Commons "1490-95 da vinci - codex atlanticus.jpg", public domain | Leonardo's optics |
| `drapery.jpg`, `drapery.png` | Leonardo, study of drapery for the Salvator Mundi (Royal Collection) | Commons "Leonardo da Vinci, Study of drapery for Salvator Mundi, Royal Collection.jpg", public domain | spare |
| `copyists.jpg`, `copyist.png` | Winslow Homer, Art-Students and Copyists in the Louvre Gallery, Harper's Weekly, 1868 (MET DP875298) | Commons, public domain; the bearded copyist on his stand | "Un copiste, lui, n'hésite pas" |
| `glass-ball.jpg`, `glass-ball.png` | a crystal ball in front of Hanstholm lighthouse | Commons "Hanstholm Fyr - The crystal ball (3).jpg" | "Une vraie boule de cristal déforme tout" |
| `swab.png` | cotton swabs | Commons "Swab Ватные палочки.png", CC BY-SA 1.0 | the cleaning |
| `receipt.png` | drawn for the episode (Special Elite) | ours | the price tag printing its receipt |

## `jour02/` to `jour05/` (30 jours, engine v2, 14 Nov. 2026)

| file | what | source | use |
|---|---|---|---|
| `jour02/opener.jpg` | tourists holding phones up over the crowd at the Mona Lisa, Louvre | Commons "Tourists Photographing the Mona Lisa above Heads of Crowd, The Louvre Museum, Paris.jpg" by Julian Lupyan, CC0 | Jour 2 opener |
| `jour02/cana.jpg` | Veronese, The Wedding at Cana, 1563, Louvre | Commons "Paolo Veronese 008.jpg", public domain | Jour 2, hook and point 2 |
| `jour02/mona-lisa.jpg` | Leonardo, Mona Lisa, Louvre | Commons "Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg", public domain | Jour 2, point 1 |
| `jour02/ornans.jpg` | Courbet, A Burial at Ornans, 1849–1850, Orsay | Commons "Gustave Courbet - A Burial at Ornans - Google Art Project.jpg", public domain | Jour 2, point 3 |
| `jour03/opener.mp4` | walking into the refectory of Santa Maria delle Grazie towards the Last Supper, 5.5 s | YouTube video by Rocky Ruggiero, id Cy3H2xaFyxE, cut | Jour 3 opener |
| `jour03/rails.jpg` | railway tracks to a vanishing point | Commons "Railroad tracks (with vanishing point).jpg" by Roystonlodge, CC BY-SA 4.0 | Jour 3, point 1 |
| `jour04/opener.jpg` | the Contarelli chapel, San Luigi dei Francesi, Rome, in the dark | Commons "San Luigi dei Francesi - Cappella Contarelli.jpg" by Udine2812, CC BY-SA 4.0 | Jour 4 opener |
| `jour04/matthew.jpg` | Caravaggio, The Calling of Saint Matthew, 1599–1600 | Commons "Caravaggio, Michelangelo Merisi da - The Calling of Saint Matthew - 1599-1600 (hi res).jpg", public domain | Jour 4 |
| `jour05/opener.jpg` | a yawning newborn | Commons "Yawning Infant, August 2018.jpg" by Martin Falbisoner, CC BY-SA 4.0 | Jour 5 opener |
| `jour05/berlinghiero.jpg` | Berlinghiero, Madonna and Child, c. 1230, the Met | Commons "Madonna and Child MET DT5279.jpg", CC0 (the Met) | Jour 5, points 1–2, outro |
| `jour05/sistine.jpg` | Raphael, Sistine Madonna, 1513–1514, Dresden | Commons "RAFAEL - Madonna Sixtina (Gemäldegalerie Alter Meister, Dresden, 1513-14. Óleo sobre lienzo, 265 x 196 cm).jpg", public domain | Jour 5, point 3, outro |
| `jour05/putti.jpg` | Raphael, the two putti of the Sistine Madonna | Commons "Raffaels Angels.jpg", public domain | Jour 5, point 3 |
