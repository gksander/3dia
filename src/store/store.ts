import { configureStore } from "@reduxjs/toolkit";
import { cameraPositionSlice } from "./cameraPosition.slice.ts";
import { useSelector } from "react-redux";
import { sceneSlice } from "./scene.slice.ts";

export const store = configureStore({
  reducer: {
    [cameraPositionSlice.name]: cameraPositionSlice.reducer,
    [sceneSlice.name]: sceneSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useRootSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
