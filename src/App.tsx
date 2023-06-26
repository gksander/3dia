import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { onWheelEndEmitter } from "./atoms.ts";
import { DotGrid } from "./components/DotGrid.tsx";
import { usePositionHandler } from "./utils/usePositionHandler.ts";
import { Box } from "./components/Box.tsx";
import { useDispatch } from "react-redux";
import { useRootSelector } from "./store/store.ts";
import {
  incrementCameraZ,
  incrementCenter,
} from "./store/cameraPosition.slice.ts";

export default function App() {
  const dispatch = useDispatch();
  const cameraZ = useRootSelector((state) => state.cameraPosition.cameraZ);
  const centerX = useRootSelector((state) => state.cameraPosition.centerX);
  const centerY = useRootSelector((state) => state.cameraPosition.centerY);

  const bind = useGesture(
    {
      onWheel: ({ delta: [deltaX, deltaY], metaKey }) => {
        if (metaKey) {
          dispatch(incrementCameraZ(deltaY / 20));
        } else {
          dispatch(incrementCenter([deltaX / 40, -deltaY / 40]));
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
        camera={{ position: [centerX, centerY, cameraZ] }}
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
  const objects = useRootSelector((state) => state.scene.objects);
  // const [b1] = useAtom(box1);
  // const [b2] = useAtom(box2);
  //
  // const x1 = b1.topLeft[0] + b1.size[0];
  // const y1 = b1.topLeft[1] - b1.size[1] / 2;
  // const x2 = b2.topLeft[0];
  // const y2 = b2.topLeft[1] - b2.size[1] / 2;

  return (
    <React.Fragment>
      <axesHelper args={[5]} />
      <ambientLight />
      <pointLight position={[0, 0, 5]} />
      {/* Objects */}
      {Object.values(objects).map((obj) => (
        <Box obj={obj} key={obj._id} />
      ))}

      {/*<Tube from={[x1, y1, 0]} to={[x2, y2, 0]} />*/}

      {/*<CameraControls />*/}
    </React.Fragment>
  );
}
