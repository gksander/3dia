import { useAtom } from "jotai";
import { cameraZAtom, centerXAtom, centerYAtom } from "../atoms.ts";
import { useFrame } from "@react-three/fiber";

export function usePositionHandler() {
  const [centerX] = useAtom(centerXAtom);
  const [centerY] = useAtom(centerYAtom);
  const [cameraZ] = useAtom(cameraZAtom);

  useFrame((state) => {
    state.camera.position.set(centerX, centerY, cameraZ);
  });
}
