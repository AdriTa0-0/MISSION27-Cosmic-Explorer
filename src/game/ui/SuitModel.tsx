import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import emu from "../nasa/assets/emu.glb?url";

function Model() {
  const { scene } = useGLTF(emu, `${import.meta.env.BASE_URL}draco/`);
  return <primitive object={scene} />;
}

export function SuitModel() {
  return (
    <figure className="overflow-hidden rounded-xl bg-muted/60">
      <div
        className="h-48 touch-none sm:h-64"
        aria-label="Rotatable NASA Extravehicular Mobility Unit model"
      >
        <Canvas camera={{ position: [2, 1, 3], fov: 42 }} dpr={1}>
          <ambientLight intensity={1.7} />
          <directionalLight position={[3, 4, 5]} intensity={2.4} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.15}>
              <Model />
            </Bounds>
          </Suspense>
          <OrbitControls makeDefault enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
      <figcaption className="px-2 pb-2 text-center font-mono text-[10px] text-secondary">
        NASA EMU MODEL · DRAG TO ROTATE
      </figcaption>
    </figure>
  );
}
