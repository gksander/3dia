import * as React from "react";
import { useGesture } from "@use-gesture/react";
import { getXYPlaneIntersectPointFromEvent } from "../utils/rayUtils.ts";
import { motion } from "framer-motion-3d";
import { Environment, Text } from "@react-three/drei";
import {
  SceneBlock,
  setActiveObject,
  setSize,
  setTopLeft,
} from "../store/scene.slice.ts";
import { useDispatch } from "react-redux";
import { useRootSelector } from "../store/store.ts";
import { CLICK_DURATION_THRESHOLD } from "../consts.ts";
import { Text3D } from "./Text3D.tsx";

export function Box({ obj }: { obj: SceneBlock }) {
  const dispatch = useDispatch();
  const isActive = useRootSelector(
    (state) => state.scene.activeObject === obj._id
  );
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
        boxPointerState.current.startPosition = [
          obj.topLeft[0],
          obj.topLeft[1],
        ];
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

        if (newX !== obj.topLeft[0] || newY !== obj.topLeft[1]) {
          dispatch(setTopLeft({ _id: obj._id, topLeft: [newX, newY] }));
        }
      },
      onPointerUp() {
        // If under click threshold, consider this a click
        if (
          boxPointerState.current.down.at &&
          Date.now() - boxPointerState.current.down.at <
            CLICK_DURATION_THRESHOLD
        ) {
          dispatch(setActiveObject(obj._id));
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
          obj.topLeft[0] + obj.size[0] / 2,
          obj.topLeft[1] - obj.size[1] / 2,
        ];
        resizeHandleState.current.startSize = [obj.size[0], obj.size[1]];
      },
      onDrag({ event }) {
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
          (newWidth >= 1 && newWidth !== obj.size[0]) ||
          (newHeight >= 1 && newHeight !== obj.size[1])
        ) {
          dispatch(setSize({ _id: obj._id, size: [newWidth, newHeight] }));
        }
      },
    },
    undefined
  );

  return (
    <>
      <motion.group
        position={[
          obj.topLeft[0] + obj.size[0] / 2,
          obj.topLeft[1] - obj.size[1] / 2,
          0,
        ]}
        initial={false}
      >
        {/* @ts-expect-error i dont know */}
        <mesh {...bind()} castShadow receiveShadow>
          <motion.boxGeometry
            args={[obj.size[0], obj.size[1], BOX_THICKNESS]}
          />
          {/*<sphereGeometry args={[0.2, 32, 32]} />*/}
          <meshStandardMaterial
            color="orange"
            metalness={0.8}
            roughness={0.5}
          />
        </mesh>

        {/* Resize handle */}
        {isActive && (
          // @ts-expect-error i dont know
          <mesh
            position={[obj.size[0] / 2, -obj.size[1] / 2, BOX_THICKNESS / 2]}
            {...resizeBind()}
          >
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="red" />
          </mesh>
        )}

        <Text3D
          text="Hello world"
          position={[
            -obj.size[0] / 2 + TEXT_PADDING,
            0,
            BOX_THICKNESS / 2 + 0.01,
          ]}
          size={0.5}
          height={0.1}
        />
      </motion.group>
    </>
  );
}

const TEXT_PADDING = 0.1;
const BOX_THICKNESS = 1;
