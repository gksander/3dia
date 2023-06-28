import { Double, Triple } from "../types.ts";

export const getDistance2D = (v1: Double, v2: Double): number =>
  Math.sqrt(Math.pow(v2[0] - v1[0], 2) + Math.pow(v2[1] - v1[1], 2));

export const getDistance3D = (v1: Triple, v2: Triple): number =>
  Math.sqrt(
    Math.pow(v2[0] - v1[0], 2) +
      Math.pow(v2[1] - v1[1], 2) +
      Math.pow(v2[2] - v1[2], 2)
  );
