import { atom } from "jotai";

export const isDraggingAtom = atom(false);

export const controlValuesAtom = atom({ distance: 0, theta: 0, phi: 0 });
