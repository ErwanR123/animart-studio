import { Composition } from "remotion";
import { episodes } from "./episodes";
import { FPS, HEIGHT, WIDTH } from "./theme";

// One composition per episode (src/episodes/index.ts). GuideAthens is the pilot that set the format.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {Object.entries(episodes).map(([id, ep]) => (
        <Composition key={id} id={id} component={ep.Component} durationInFrames={ep.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </>
  );
};
