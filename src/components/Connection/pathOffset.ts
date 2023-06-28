import { Double, Triple } from "../../types.ts";
import { getDistance2D, getDistance3D } from "../../utils/getDistance.ts";

export const pathOffset = ({
  start: [x1, y1, z1],
  end: [x2, y2, z2],
  startOffset,
  endOffset,
}: {
  start: Triple;
  end: Triple;
  startOffset: number;
  endOffset: number;
}): { start: Triple; end: Triple } => {
  const ogSegLength = getDistance3D([x1, y1, z1], [x2, y2, z2]);

  // Start offset
  let t = startOffset / ogSegLength;
  const newStart: Triple = [
    t * x2 + (1 - t) * x1,
    t * y2 + (1 - t) * y1,
    t * z2 + (1 - t) * z1,
  ];

  // End offset
  t = endOffset / ogSegLength;
  const newEnd: Triple = [
    t * x1 + (1 - t) * x2,
    t * y1 + (1 - t) * y2,
    t * z1 + (1 - t) * z2,
  ];

  return { start: newStart, end: newEnd };
};
