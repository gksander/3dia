// @ts-expect-error no types here, it's fine
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { extend } from "@react-three/fiber";
// @ts-expect-error no types here, it's fine
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Roboto from "../assets/Roboto_Regular.json";
import { Triple } from "../types.ts";
import { Text3D as Text } from "@react-three/drei";

type Text3DProps = {
  text: string;
  size?: number;
  height?: number;
  position?: Triple;
};

export function Text3D({
  text,
  size = 0.2,
  height = 0.4,
  position,
}: Text3DProps) {
  return (
    <Text
      font={Roboto}
      position={position}
      size={size}
      height={height}
      bevelEnabled={true}
      castShadow
    >
      {text}
      <meshStandardMaterial color="black" />
    </Text>
  );
}
