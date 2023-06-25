import { atom } from "jotai";
import { SimpleEventEmitter } from "./utils/SimpleEventEmitter.ts";

export const isDraggingAtom = atom(false);

export const controlValuesAtom = atom({ distance: 0, theta: 0, phi: 0 });

export type Triple = [number, number, number];
export type Double = [number, number];
export const box1 = atom({
  topLeft: [-3, 0] as Double,
  size: [2, 2] as Double,
});
export const box2 = atom({
  topLeft: [5, 0] as Double,
  size: [4, 3] as Double,
});

export type BoxAtom = typeof box1;

export const positionAtom = atom({ x: 0, y: 0 });

export const centerXAtom = atom(0);
export const centerYAtom = atom(0);
export const cameraZAtom = atom(30);

export const onWheelEndEmitter = new SimpleEventEmitter();

export const onCanvasPointerMoveEmitter = new SimpleEventEmitter();
