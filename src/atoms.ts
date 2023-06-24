import { atom } from "jotai";
import { SimpleEventEmitter } from "./utils/SimpleEventEmitter.ts";

export const isDraggingAtom = atom(false);

export const controlValuesAtom = atom({ distance: 0, theta: 0, phi: 0 });

export type Triple = [number, number, number];
export const box1 = atom({ position: [6, 0, 0] as Triple, width: 1 });
export const box2 = atom({ position: [-1.2, 0, 0] as Triple, width: 1 });

export type BoxAtom = typeof box1;

export const positionAtom = atom({ x: 0, y: 0 });

export const centerXAtom = atom(0);
export const centerYAtom = atom(0);
export const cameraZAtom = atom(30);

export const onWheelEndEmitter = new SimpleEventEmitter();
