import { SceneBlock, SceneElement } from "../store/scene.slice.ts";

export const isSceneBlock = (element: SceneElement): element is SceneBlock =>
  element.type === "block";
