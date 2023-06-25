import * as React from "react";
import { Triple } from "../atoms.ts";
import * as THREE from "three";

type TubeProps = { from: Triple; to: Triple };

export const Tube = React.memo(
  ({ from: [x1, y1, z1], to: [x2, y2, z2] }: TubeProps) => {
    console.log("RENDERING TUBE");
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2)
    );

    return (
      <mesh>
        <tubeGeometry args={[curve, undefined, 0.25]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.9} roughness={0.6} />
      </mesh>
    );
  },
  // Comparison fn
  (prev, next) => {
    for (let i = 0; i < 3; i++) {
      if (prev.from[i] !== next.from[i]) return false;
    }
    for (let i = 0; i < 3; i++) {
      if (prev.to[i] !== next.to[i]) return false;
    }
    return true;
  }
);
