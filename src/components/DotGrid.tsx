import * as React from "react";
import { useThree } from "@react-three/fiber";
import { onWheelEndEmitter } from "../atoms.ts";
import * as THREE from "three";

export function DotGrid() {
  const [vp, setVp] = React.useState({ width: 0, height: 0, x: 0, y: 0 });
  const get = useThree((state) => state.get);
  // const camera = useThree((state) => state.camera) as THREE.OrthographicCamera;
  // const viewport = useThree((state) => state.viewport);

  React.useEffect(() => {
    const f = () => {
      const { width, height } = get().viewport;
      const { left, right, top, bottom } = get()
        .camera as THREE.OrthographicCamera;

      const viewportLeft = left * (width / (right - left));
      const viewportTop = top * (height / -(top - bottom));

      console.log(viewportTop);

      setVp({ x: viewportLeft, y: viewportTop, width, height });
    };

    const handle = onWheelEndEmitter.subscribe(f);

    f();

    return () => {
      handle.unsubscribe();
    };
  }, [get]);

  console.log(vp);

  const xs = React.useMemo(
    () =>
      Array.from({ length: Math.ceil(vp.width) + 1 }).map((_, i) =>
        Math.ceil(vp.x + i)
      ),
    [vp.width, vp.x]
  );
  const ys = React.useMemo(
    () =>
      Array.from({ length: Math.ceil(vp.height) + 1 }).map((_, i) =>
        Math.ceil(vp.y + i)
      ),
    [vp.height, vp.y]
  );

  return (
    <React.Fragment>
      {xs.map((x) => (
        <React.Fragment key={x}>
          {ys.map((y) => (
            <Dot key={y} x={x} y={y} />
          ))}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

function Dot({ x, y }: { x: number; y: number }) {
  return (
    <mesh position={[x, y, 0]}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color="gray" opacity={0.3} transparent={true} />
    </mesh>
  );
}
