import { SceneConnection } from "../../store/scene.slice.ts";
import { useRootSelector } from "../../store/store.ts";
import { isSceneBlock } from "../../utils/elementHelpers.ts";
import { Tube } from "../Tube.tsx";
import { pathOffset } from "./pathOffset.ts";

type ConnectionProps = { connection: SceneConnection };

export function Connection({ connection }: ConnectionProps) {
  const from = useRootSelector(
    (state) => state.scene.elements[connection.from]
  );
  const to = useRootSelector((state) => state.scene.elements[connection.to]);

  if (!(isSceneBlock(from) && isSceneBlock(to))) return null;

  const x1 = from.topLeft[0] + from.size[0];
  const y1 = from.topLeft[1] - from.size[1] / 2;
  const x2 = to.topLeft[0];
  const y2 = to.topLeft[1] - to.size[1] / 2;

  const { start, end } = pathOffset({
    start: [x1, y1, 0],
    end: [x2, y2, 0],
    startOffset: 0.4,
    endOffset: 0.4,
  });

  console.log(start);

  return <Tube from={start} to={end} />;
}
