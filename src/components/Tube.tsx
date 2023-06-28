import * as React from "react";
import { Triple } from "../types.ts";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { TUBE_THICKNESS } from "../consts.ts";

type TubeProps = { from: Triple; to: Triple };

export const Tube = React.memo(
  ({ from: [x1, y1, z1], to: [x2, y2, z2] }: TubeProps) => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2) // TODO: Backoff the angle a bit.
    );

    // const geo1 = new THREE.TubeGeometry(curve, 64, TUBE_THICKNESS, 8, false);
    // const geo2 = new THREE.SphereGeometry(TUBE_THICKNESS, 32, 32);

    // const geo = BufferGeometryUtils.mergeBufferGeometries([geo1, geo2]);

    return (
      <group>
        <mesh>
          <tubeGeometry args={[curve, undefined, TUBE_THICKNESS]} />
          <meshStandardMaterial
            color="#f0f0f0"
            metalness={0.9}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[x1, y1, z1]} rotation={[3, 0, 0]}>
          <sphereGeometry
            args={[TUBE_THICKNESS, 32, 32, 0, 2 * Math.PI, 0, Math.PI]}
          />
          <meshStandardMaterial
            color="#f0f0f0"
            metalness={0.9}
            roughness={0.6}
          />
        </mesh>

        {/*<mesh position={[x2, y2, z2]}>*/}
        {/*  <coneGeometry args={[0.3, 0.6, 32, 32]} />*/}
        {/*  <meshStandardMaterial*/}
        {/*    color="#f0f0f0"*/}
        {/*    metalness={0.9}*/}
        {/*    roughness={0.6}*/}
        {/*  />*/}
        {/*</mesh>*/}
      </group>
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
