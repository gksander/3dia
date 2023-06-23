import * as React from "react";
import { useThree } from "@react-three/fiber";
// @ts-expect-error OrbitControls is not typed
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const CameraController = () => {
  const { camera, gl } = useThree();
  React.useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 20;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};
