import { Double } from "../types.ts";
import { nanoid } from "nanoid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SceneObject = {
  _id: string;
  topLeft: Double;
  size: Double;
};

type SceneState = {
  objects: { [key: string]: SceneObject };
  activeObject: string | null;
};

const makeSceneObject = (topLeft: Double, size: Double): SceneObject => ({
  _id: nanoid(),
  topLeft,
  size,
});

const obj1 = makeSceneObject([-3, 0], [2, 2]);
const obj2 = makeSceneObject([5, 0], [4, 3]);
const initialState: SceneState = {
  objects: {
    [obj1._id]: obj1,
    [obj2._id]: obj2,
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
      state.objects[action.payload._id].topLeft = action.payload.topLeft;
    },
    setSize: (state, action: PayloadAction<{ _id: string; size: Double }>) => {
      state.objects[action.payload._id].size = action.payload.size;
    },
    setActiveObject: (state, action: PayloadAction<string | null>) => {
      state.activeObject = action.payload;
    },
  },
});

export const { setTopLeft, setSize, setActiveObject } = sceneSlice.actions;
