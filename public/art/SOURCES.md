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
| `rue-tirechape.png`, `rue-aumaire.png` | Charles Marville, Rue Tirechape and Rue Aumaire, c. 1853–70 | Commons "Charles Marville, Rue Tirechape, de la rue de Rivoli, ca. 1853–70, edited.jpg", "Charles Marville, Rue Aumaire.jpg", public domain | `shots` (old Paris) |
| `cholera.png` | « Le choléra à Paris », engraving | Commons "Le choléra à Paris (5036894480).jpg" (National Library of Medicine via Flickr, no known restrictions) | `shots` |
| `napoleon.png`, `haussmann.png` | portraits of Napoléon III (Levitsky) and Baron Haussmann (Reutlinger) | Commons "Portrait de Charles Louis Napoléon Bonaparte … PH54464.jpg", "Portrait du baron Haussmann … PH51656(2).jpg" (Paris Musées, CC0), cut out, halftone | `shots` |
| `demolition.png`, `percement.png` | Charles Marville, the avenue de l'Opéra cut through the butte des Moulins (Dec. 1876–Feb. 1877) | Commons "Percement de l'avenue de l'Opéra Butte des Moulins (de la rue d'Argenteuil), PH937.jpg" (Paris Musées, CC0), "Charles Marville, Percement de l'avenue de l'Opéra, ca. 1853–70.jpg" | `shots` |
| `map-1868.png` | Andriveau-Goujon, *Plan d'ensemble des travaux de Paris* (1868), new streets in red | Commons "Andriveau-Goujon, Plan d'ensemble des travaux de Paris, 1868 - David Rumsey.jpg", public domain; colour and contrast raised | `shots` |
| `paris-demolishers.png` | Edmond Morin, caricature: Paris overrun by the demolishers | Commons "Caricature of Paris Invaded by Demolishers.jpg", public domain | `shots` |
| `haussmann-demolisseur.png` | caricature of Haussmann as "artiste démolisseur" | Commons 'Haussmann as "Artiste Démolisseur".jpg', public domain, cut out | `shots` |
| `opera-today.png` | the avenue de l'Opéra, July 2014 | Commons "Avenue de l'Opéra, Paris July 2014.jpg", Guilhem Vellut, CC BY 2.0 (credited in the shot's source line) | `shots` (then and now) |
| `map-1855.png` | plan of central Paris before the works (catalogued c. 1855), north up | Commons "Map of Paris, ca. 1855 - Stanford Libraries.jpg" (6915 × 8135, public domain), centre cropped | `shots` (three avenues ruled in red pencil) |
| `paris-comique.png` | « M. Haussmann et Mlle Lutèce », *Paris-Comique*, January 1870 | Commons 'M. Haussmann et Mlle Lutèce - "Paris-Comique".jpg', public domain | `shots` |
| `demolition-scene.png` | caricature, a demolition scene | Commons "Demolition Scene - caricature.jpg", public domain | `shots` |
| `daumier-demenagement.png` | Honoré Daumier, *Locataires et propriétaires*: families moving out | Commons "Locataires et Propriétaires - caricature.jpg", public domain | `shots` |
| `stamp-napoleon.png` | Empire franc 40 c orange, Napoléon III (1853) | Commons "Napoléon 3 40c jaune orange.jpg", border trimmed | lab (`postage`) |
| `figaro-1868.png` | *Le Petit Figaro*, 5 July 1868, front page | Commons "Le Petit Figaro, 2e année, N°163, 5 juillet 1868, 2017.0.4005.jpg" | lab |

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
