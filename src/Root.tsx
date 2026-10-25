import { Composition } from "remotion";
import { episodes } from "./episodes";
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
      {/* The Vox paper register as real scenes (src/lab/GuideVox.tsx). */}
      <Composition id="GuidePuppets" component={GuidePuppets} durationInFrames={PUPPET_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="GuideVox" component={GuideVox} durationInFrames={VOX_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
