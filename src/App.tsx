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
import { Connection } from "./components/Connection/Connection.tsx";
import {
  Backdrop,
  CameraControls,
  OrthographicCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";

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
        orthographic
        camera={{ zoom: 50, position: [1, 1, 10], left: -20, right: 20 }}
        // camera={Camera}
        // style={{ width: "100%", height: "100%" }}
        // // camera={{ position: [centerX, centerY, cameraZ] }}
        {...bind()}
        shadows
      >
        <Body />
        <DotGrid />
      </Canvas>
    </div>
  );
}

// const Camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 100);

function Body() {
  // usePositionHandler();
  const objects = useRootSelector((state) => state.scene.elements);
  const { backdropDistance } = useControls({
    backdropDistance: { value: -2, min: -10, max: -1 },
  });

  return (
    <React.Fragment>
      {/*<axesHelper args={[10]} />*/}
      <ambientLight />
      {/*<pointLight position={[-2, 3, 30]} castShadow={true} />*/}
      <directionalLight
        args={["white", 0.7]}
        position={[-2, 5, 10]}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-17.78}
        shadow-camera-right={17.78}
        shadow-camera-bottom={-20.39}
        shadow-camera-top={20.39}
        shadow-camera-near={0.25}
        shadow-camera-far={100}
      />
      {/*<pointLight position={[3, 5, 5]} castShadow />*/}
      {/* Objects */}
      {Object.values(objects).map((obj) =>
        obj.type === "block" ? (
          <Box obj={obj} key={obj._id} />
        ) : (
          <Connection connection={obj} key={obj._id} />
        )
      )}

      {/*<CameraControls />*/}

      {/* Background plane */}
      <mesh receiveShadow={true} position={[0, 0, backdropDistance]}>
        <planeGeometry args={[200, 200, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </React.Fragment>
  );
}
