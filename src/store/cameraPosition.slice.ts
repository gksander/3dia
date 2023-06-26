import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Double } from "../types.ts";

export type CameraPositionState = {
  centerX: number;
  centerY: number;
  cameraZ: number;
};

const initialState = {
  centerX: 0,
  centerY: 0,
  cameraZ: 30,
} satisfies CameraPositionState;

export const cameraPositionSlice = createSlice({
  name: "cameraPosition",
  initialState,
  reducers: {
    incrementCenter: (state, action: PayloadAction<Double>) => {
      state.centerX += action.payload[0];
      state.centerY += action.payload[1];
    },
    incrementCameraZ: (state, action: PayloadAction<number>) => {
      state.cameraZ += action.payload / 20;
    },
  },
});

export const { incrementCenter, incrementCameraZ } =
  cameraPositionSlice.actions;
