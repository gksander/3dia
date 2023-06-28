import { Double } from "../types.ts";
import { nanoid } from "nanoid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SceneBlock = {
  _id: string;
  type: "block";
  topLeft: Double;
  size: Double;
};

export type SceneConnection = {
  _id: string;
  type: "connection";
  from: string;
  to: string;
};

export type SceneElement = SceneBlock | SceneConnection;

type SceneState = {
  elements: { [key: string]: SceneElement };
  activeObject: string | null;
};

const makeSceneObject = (topLeft: Double, size: Double): SceneBlock => ({
  _id: nanoid(),
  type: "block",
  topLeft,
  size,
});

const obj1 = makeSceneObject([-3, 0], [2, 2]);
const obj2 = makeSceneObject([5, 0], [4, 3]);
const connectionId = nanoid();
const initialState: SceneState = {
  elements: {
    [obj1._id]: obj1,
    [obj2._id]: obj2,
    [connectionId]: {
      type: "connection",
      _id: connectionId,
      from: obj1._id,
      to: obj2._id,
    },
  },
  activeObject: null,
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    setTopLeft: (
      state,
      action: PayloadAction<{ _id: string; topLeft: Double }>
    ) => {
      state.elements[action.payload._id].topLeft = action.payload.topLeft;
    },
    setSize: (state, action: PayloadAction<{ _id: string; size: Double }>) => {
      state.elements[action.payload._id].size = action.payload.size;
    },
    setActiveObject: (state, action: PayloadAction<string | null>) => {
      state.activeObject = action.payload;
    },
  },
});

export const { setTopLeft, setSize, setActiveObject } = sceneSlice.actions;
