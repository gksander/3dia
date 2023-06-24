import * as React from "react";
import { BoxAtom, isDraggingAtom } from "../atoms.ts";
import { useAtom } from "jotai/index";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useGesture } from "@use-gesture/react";

export function Box({ atom }: { atom: BoxAtom }) {
  const [_, setIsDragging] = useAtom(isDraggingAtom);
  const [a, setA] = useAtom(atom);
  const [spring, api] = useSpring(() => ({
    position: [a.position[0], 0, 0] as [number, number, number],
  }));
  const planeIntersectPoint = React.useRef(new THREE.Vector3());
  const [isActive, setIsActive] = React.useState(false);

  const bind = useGesture(
    {
      onPointerDown: () => {
        setIsDragging(true);
      },
      onPointerUp: () => {
        setIsDragging(false);
      },
      onDrag: ({ active, event }) => {
        event.stopPropagation();

        if (active) {
          // @ts-expect-error not in there
          const ray: unknown = event?.ray;

          if (isRay(ray)) {
            ray.intersectPlane(XYPlane, planeIntersectPoint.current);
            setA((a) => ({
              position: [
                Math.round(planeIntersectPoint.current.x) - BOX_SIZE / 2,
                Math.round(planeIntersectPoint.current.y) - BOX_SIZE / 2,
                0,
              ],
              width: a.width,
            }));
          }
        }

        api.start({
          position: a.position,
        });
      },

      // On click
      onClick({ event }) {
        event.stopPropagation();
        setIsActive((v) => !v);
      },
    },
    undefined
  );

  const resizeBind = useGesture(
    {
      onDrag({ active, event }) {
        event.stopPropagation();
        // @ts-expect-error not in there
        const ray: unknown = event?.ray;

        if (isRay(ray)) {
          ray.intersectPlane(XYPlane, planeIntersectPoint.current);
          console.log(Math.round(planeIntersectPoint.current.x), a.position[0]);
          setA((a) => ({
            position: a.position,
            width:
              Math.round(planeIntersectPoint.current.x) - a.position[0] + 1,
          }));
          // console.log(planeIntersectPoint.current.x);
          // setA((a) => ({
          //   position: [
          //     Math.round(planeIntersectPoint.current.x) - BOX_SIZE / 2,
          //     Math.round(planeIntersectPoint.current.y) - BOX_SIZE / 2,
          //     0,
          //   ],
          //   width: a.width,
          // }));
        }
      },
    },
    undefined
  );

  return (
    <>
      <animated.group {...spring}>
        <mesh {...bind()}>
          <boxGeometry args={[a.width, BOX_SIZE, 0.3]} />
          {/*<sphereGeometry args={[0.2, 32, 32]} />*/}
          <meshStandardMaterial color="orange" />
        </mesh>

        {isActive && (
          <mesh position={[a.width / 2, -BOX_SIZE / 2, 0]} {...resizeBind()}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="red" />
          </mesh>
        )}
      </animated.group>
    </>
  );
}

const BOX_SIZE = 1;

const XYPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

const isRay = (el: unknown): el is THREE.Ray => el instanceof THREE.Ray;
