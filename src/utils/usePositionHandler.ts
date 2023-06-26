import * as React from "react";
import { useThree } from "@react-three/fiber";
import { useRootSelector } from "../store/store.ts";

export function usePositionHandler() {
  const cameraZ = useRootSelector((state) => state.cameraPosition.cameraZ);
  const centerX = useRootSelector((state) => state.cameraPosition.centerX);
  const centerY = useRootSelector((state) => state.cameraPosition.centerY);
  const camera = useThree((state) => state.camera);

  React.useEffect(() => {
    camera.position.set(centerX, centerY, cameraZ);
  }, [centerX, centerY, cameraZ]);
}
