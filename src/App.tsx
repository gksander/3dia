import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/three";
import { CameraControls, CameraControlsProps } from "@react-three/drei";
import { useAtom } from "jotai";
import { controlValuesAtom, isDraggingAtom } from "./atoms.ts";
import * as THREE from "three";

function Box({ x: initX }: { x: number }) {
  const [_, setIsDragging] = useAtom(isDraggingAtom);
  const { viewport, size } = useThree();
  const aspect = size.width / viewport.width;
  const [pos, setPos] = React.useState(() => [initX, 0, 0]);
  const [spring, api] = useSpring(() => ({
    position: [initX, 0, 0],
  }));
  const planeIntersectPoint = React.useRef(new THREE.Vector3());

  const bind = useGesture(
    {
      onPointerDown: () => {
        setIsDragging(true);
      },
      onPointerUp: () => {
        setIsDragging(false);
      },
      onDrag: ({ active, offset: [mx, my], event }) => {
        event.stopPropagation();

        if (active) {
          // @ts-expect-error not in there
          const ray: unknown = event?.ray;

          if (isRay(ray)) {
            ray.intersectPlane(XYPlane, planeIntersectPoint.current);
            setPos([
              planeIntersectPoint.current.x,
              planeIntersectPoint.current.y,
              0,
            ]);
          }
        }

        api.start({
          position: pos,
        });
      },
    },
    undefined
  );

  return (
    <>
      <animated.mesh {...spring} {...bind()}>
        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
        {/*<sphereGeometry args={[0.2, 32, 32]} />*/}
        <meshStandardMaterial color="orange" />
      </animated.mesh>
    </>
  );
}

const BOX_SIZE = 0.2;

export default function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Body />
    </Canvas>
  );
}

function Body() {
  const [isDragging] = useAtom(isDraggingAtom);
  const { viewport } = useThree();

  return (
    <React.Fragment>
      <axesHelper args={[5]} />
      <ambientLight />
      <pointLight position={[0, 0, 5]} />
      <Box x={-1.2} />
      <Box x={1.2} />
      <CameraControls enabled={!isDragging} makeDefault />

      {/* Draw a plane on x/y */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[viewport.width, viewport.height, 0.01]} />
        <meshStandardMaterial color="gray" opacity={0.3} transparent={true} />
      </mesh>

      {/*<mesh position={[viewport.width / 2, 0, 0]}>*/}
      {/*  <sphereGeometry args={[0.05, 32, 32]} />*/}
      {/*  <meshStandardMaterial color="gray" />*/}
      {/*</mesh>*/}
    </React.Fragment>
  );
}

const XYPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

const isRay = (el: unknown): el is THREE.Ray => el instanceof THREE.Ray;
