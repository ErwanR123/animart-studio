import { Composition } from "remotion";
import { episodes } from "./episodes";
import { key01 } from "./episodes/Key01";
import { key02 } from "./episodes/Key02";
import { key02v2 } from "./episodes/Key02v2";
import { jour01 } from "./episodes/Jour01";
import { jour02 } from "./episodes/Jour02";
import { jour03 } from "./episodes/Jour03";
import { jour04 } from "./episodes/Jour04";
import { jour05 } from "./episodes/Jour05";
import { lesson01 } from "./episodes/Lesson01";
import { AgendaCompositions } from "./formats/agenda/compositions";
import { DetailsCompositions } from "./formats/details/compositions";
import { GuidePuppets, PUPPET_FRAMES } from "./lab/GuidePuppets";
import { GuideVox, VOX_FRAMES } from "./lab/GuideVox";
import { FPS, HEIGHT, WIDTH } from "./theme";

// One composition per episode (src/episodes/index.ts). GuideAthens is the pilot that set the format.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {Object.entries(episodes).map(([id, ep]) => (
        <Composition key={id} id={id} component={ep.Component} durationInFrames={ep.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
      {/* L'art en 30 jours: the notebook lessons (src/lesson/engine.tsx). */}
      <Composition id="Lesson01" component={lesson01.Component} durationInFrames={lesson01.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* 30 jours pour kiffer l'art: one notion "en 3 points", sticker look (src/keys/engine.tsx). */}
      <Composition id="Key01" component={key01.Component} durationInFrames={key01.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Key02" component={key02.Component} durationInFrames={key02.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Jour01" component={jour01.Component} durationInFrames={jour01.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Jour02" component={jour02.Component} durationInFrames={jour02.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Jour03" component={jour03.Component} durationInFrames={jour03.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Jour04" component={jour04.Component} durationInFrames={jour04.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Jour05" component={jour05.Component} durationInFrames={jour05.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Key02v2" component={key02v2.Component} durationInFrames={key02v2.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* « Détails »: a painting's hidden details and the app ad (src/formats/details/). */}
      <DetailsCompositions />
      {/* « L'Agenda »: the weekend's exhibitions, real photos + voice (src/formats/agenda/). */}
      <AgendaCompositions />
      {/* The Vox paper register as real scenes (src/lab/GuideVox.tsx). */}
      <Composition id="GuidePuppets" component={GuidePuppets} durationInFrames={PUPPET_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="GuideVox" component={GuideVox} durationInFrames={VOX_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
