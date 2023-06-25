import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useAtom } from "jotai";
import {
  box1,
  box2,
  cameraZAtom,
  centerXAtom,
  centerYAtom,
  onWheelEndEmitter,
} from "./atoms.ts";
import { DotGrid } from "./components/DotGrid.tsx";
import { usePositionHandler } from "./utils/usePositionHandler.ts";
import { Box } from "./components/Box.tsx";
import { Tube } from "./components/Tube.tsx";

export default function App() {
  const [, setX] = useAtom(centerXAtom);
  const [, setY] = useAtom(centerYAtom);
  const [cameraZ, setCameraZ] = useAtom(cameraZAtom);

  const bind = useGesture(
    {
      onWheel: ({ delta: [deltaX, deltaY], metaKey }) => {
        if (metaKey) {
          setCameraZ((old) => old + deltaY / 20);
        } else {
          setX((old) => old + deltaX / 40);
          setY((old) => old - deltaY / 40);
        }
      },
      onWheelEnd() {
        onWheelEndEmitter.emit(null);
      },
    },
    undefined
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, cameraZ] }}
        {...bind()}
        onPointerUp={(e) => {
          console.log(e);
        }}
      >
        <Body />
        <DotGrid />
      </Canvas>
    </div>
  );
}

function Body() {
  usePositionHandler();
  const [b1] = useAtom(box1);
  const [b2] = useAtom(box2);

  const x1 = b1.topLeft[0] + b1.size[0];
  const y1 = b1.topLeft[1] - b1.size[1] / 2;
  const x2 = b2.topLeft[0];
  const y2 = b2.topLeft[1] - b2.size[1] / 2;

  return (
    <React.Fragment>
      <axesHelper args={[5]} />
      <ambientLight />
      <pointLight position={[0, 0, 5]} />
      <Box atom={box1} />
      <Box atom={box2} />

      <Tube from={[x1, y1, 0]} to={[x2, y2, 0]} />

      {/*<CameraControls />*/}
    </React.Fragment>
  );
}
