import * as React from "react";
import { BoxAtom } from "../atoms.ts";
import { useAtom } from "jotai/index";
import { useGesture } from "@use-gesture/react";
import { getXYPlaneIntersectPointFromEvent } from "../utils/rayUtils.ts";
import { motion } from "framer-motion-3d";
import { Text } from "@react-three/drei";

export function Box({ atom }: { atom: BoxAtom }) {
  const [a, setA] = useAtom(atom);
  const [isActive, setIsActive] = React.useState(false);
  const boxPointerState = React.useRef({
    down: { at: null as null | number, x: 0, y: 0 },
    startPosition: [0, 0] as [number, number],
  });
  const resizeHandleState = React.useRef({
    down: { at: null as null | number, x: 0, y: 0 },
    startPosition: [0, 0] as [number, number],
    startSize: [0, 0] as [number, number],
  });

  const bind = useGesture(
    {
      onPointerDown({ event }) {
        const [x, y] = getXYPlaneIntersectPointFromEvent(event);
        boxPointerState.current.down = { at: Date.now(), x, y };
        boxPointerState.current.startPosition = [a.topLeft[0], a.topLeft[1]];
      },

      onDrag({ event }) {
        if (!boxPointerState.current.down.at) return;
        if (
          Date.now() - boxPointerState.current.down.at <
          CLICK_DURATION_THRESHOLD
        )
          return;

        const [x, y] = getXYPlaneIntersectPointFromEvent(event);
        const dx = x - boxPointerState.current.down.x;
        const dy = y - boxPointerState.current.down.y;

        const newX = Math.round(boxPointerState.current.startPosition[0] + dx);
        const newY = Math.round(boxPointerState.current.startPosition[1] + dy);

        if (newX !== a.topLeft[0] || newY !== a.topLeft[1]) {
          console.log(newX, newY);
          setA((a) => ({
            topLeft: [newX, newY],
            size: a.size,
          }));
        }
      },
      onPointerUp() {
        // If under click threshold, consider this a click
        if (
          boxPointerState.current.down.at &&
          Date.now() - boxPointerState.current.down.at <
            CLICK_DURATION_THRESHOLD
        ) {
          setIsActive((v) => !v);
        }

        boxPointerState.current.down = { at: null, x: 0, y: 0 };
      },
    },
    undefined
  );

  const resizeBind = useGesture(
    {
      onPointerDown({ event }) {
        event.stopPropagation();

        const [x, y] = getXYPlaneIntersectPointFromEvent(event);
        resizeHandleState.current.down = { at: Date.now(), x, y };
        resizeHandleState.current.startPosition = [
          a.topLeft[0] + a.size[0] / 2,
          a.topLeft[1] - a.size[1] / 2,
        ];
        resizeHandleState.current.startSize = [a.size[0], a.size[1]];
      },
      onDrag({ active, event }) {
        event.stopPropagation();
        if (!resizeHandleState.current.down.at) return;

        const [x, y] = getXYPlaneIntersectPointFromEvent(event);
        const dx = x - resizeHandleState.current.down.x;
        const dy = -(y - resizeHandleState.current.down.y);

        const newWidth = Math.round(
          resizeHandleState.current.startSize[0] + dx
        );
        const newHeight = Math.round(
          resizeHandleState.current.startSize[1] + dy
        );

        if (
          (newWidth >= 1 && newWidth !== a.size[0]) ||
          (newHeight >= 1 && newHeight !== a.size[1])
        ) {
          console.log(newWidth, newHeight);
          setA((a) => ({
            topLeft: a.topLeft,
            size: [newWidth, newHeight],
          }));
        }
      },
    },
    undefined
  );

  return (
    <>
      <motion.group
        position={[
          a.topLeft[0] + a.size[0] / 2,
          a.topLeft[1] - a.size[1] / 2,
          0,
        ]}
        // animate={{
        //   x: a.topLeft[0] + a.size[0] / 2,
        //   y: a.topLeft[1] - a.size[1] / 2,
        // }}
        initial={false}
      >
        <mesh {...bind()}>
          <motion.boxGeometry args={[a.size[0], a.size[1], BOX_THICKNESS]} />
          {/*<sphereGeometry args={[0.2, 32, 32]} />*/}
          <meshStandardMaterial
            color="orange"
            metalness={0.8}
            roughness={0.5}
          />
        </mesh>

        {/* Resize handle */}
        {isActive && (
          <mesh
            position={[a.size[0] / 2, -a.size[1] / 2, BOX_THICKNESS / 2]}
            {...resizeBind()}
          >
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="red" />
          </mesh>
        )}

        {/* Just testing shit... */}
        <Text
          maxWidth={a.size[0] - 2 * TEXT_PADDING}
          fontSize={0.5}
          position={[TEXT_PADDING, -TEXT_PADDING, BOX_THICKNESS + 0.01]}
          textAlign="center"
        >
          Hello world
        </Text>
      </motion.group>
    </>
  );
}

const CLICK_DURATION_THRESHOLD = 200;

const TEXT_PADDING = 0.1;
const BOX_THICKNESS = 1;
