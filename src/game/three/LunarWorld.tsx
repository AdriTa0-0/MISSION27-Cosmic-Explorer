import {updateRoverDrive, roverRisk, ROVER_FORWARD_SPEED} from "../roverControls";
import {FriendlyRover} from "./FriendlyRover";
import {SparkleStars} from "./SparkleStars";
import { cameraRig, photoRig } from "../camera";
import { moveWithCollisions, overlaps } from "../collision";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Stars, Html, useTexture, useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGame, OBJECTIVES } from "../store";
import { pressed } from "../input";
import { audio } from "../audio";
import { BASE_RADIUS, COLLIDERS, ROCKS, playerObstacles, CREW, LUNAR_CAMERA_YAW, STATIONS, collide, terrainHeight, world, targetPos, stationById, type CrewId } from "../world";
import { Astronaut, type AstroMotion } from "./Astronaut";
import { panelTexture } from "./textures";
import { EARTH_ALTITUDE, EARTH_BEARING, EPIC_FRAMES } from "../nasa/earth";
import { SOLAR_BEARING, solarTelemetry } from "../nasa/operations";
import earthDisc from "../nasa/assets/earth-disc.png?url";
import regolithColor from "../nasa/assets/moon-regolith-color.jpg?url";
import regolithNormal from "../nasa/assets/moon-regolith-normal.webp?url";
import regolithRough from "../nasa/assets/moon-regolith-rough.jpg?url";

const tmp = new THREE.Vector3();

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/* ---------------- Terrain ---------------- */
function Terrain() {
  const [color, normal, roughness] = useTexture([regolithColor, regolithNormal, regolithRough]);
  for (const texture of [color, normal, roughness]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 8;
  }
  color.colorSpace = THREE.SRGBColorSpace;

  const geo = useMemo(() => {
    const segments = 280;
    const g = new THREE.PlaneGeometry(2, 2, segments, segments);
    const position = g.attributes.position;
    const uv = g.attributes.uv;
    const axis = (v: number) => {
      const d = Math.abs(v);
      return Math.sign(v) * (d <= 0.8 ? d * 250 : 200 + 520 * ((d - 0.8) / 0.2) ** 1.7);
    };
    for (let i = 0; i < position.count; i++) {
      const x = axis(position.getX(i));
      const z = axis(-position.getY(i));
      position.setXYZ(i, x, -z, terrainHeight(x, z));
      uv.setXY(i, x / 13, -z / 13);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} receiveShadow>
      <meshStandardMaterial map={color} normalMap={normal} roughnessMap={roughness} color="#b9b6af" roughness={1} />
    </mesh>
  );
}

function Rocks() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 260;
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    ROCKS.forEach((r,i)=>{
      m.position.set(r.x,terrainHeight(r.x,r.z)+r.s*0.25,r.z);
      m.rotation.set(r.rx,r.ry,r.rz);m.scale.set(r.s,r.sy,r.s);
      m.updateMatrix();ref.current!.setMatrixAt(i,m.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8d8a84" roughness={0.95} flatShading />
    </instancedMesh>
  );
}

/* ---------------- Sky ---------------- */
function Sky({compact=false}:{compact?:boolean}) {
  const earth = useRef<THREE.Sprite>(null);
  const texture = useTexture(earthDisc);
  const epicTexture = useTexture(EPIC_FRAMES[1].url);
  epicTexture.colorSpace = THREE.SRGBColorSpace;
  texture.colorSpace = THREE.SRGBColorSpace;
  const earthDirection = useMemo(() => new THREE.Vector3(
    Math.sin(EARTH_BEARING) * Math.cos(EARTH_ALTITUDE),
    Math.sin(EARTH_ALTITUDE),
    -Math.cos(EARTH_BEARING) * Math.cos(EARTH_ALTITUDE),
  ), []);
  const sat = useRef<THREE.Group>(null);
  const ship = useRef<THREE.Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    if (earth.current) {
      earth.current.position.copy(camera.position).addScaledVector(earthDirection, 890);
      const next=photoRig.active?epicTexture:texture;
      if(earth.current.material.map!==next){earth.current.material.map=next;earth.current.material.needsUpdate=true;}
    }
    if (sat.current) { sat.current.position.set(Math.cos(t * 0.05) * 140, 70 + Math.sin(t * 0.05) * 10, Math.sin(t * 0.05) * 140); sat.current.rotation.y = t * 0.3; }
    if (ship.current) { ship.current.position.set(-200 + ((t * 4) % 400), 110, -160); }
  });
  return (
    <>
      <Stars radius={900} depth={60} count={compact ? 900 : 2400} factor={6} fade={false} speed={0} /><SparkleStars/>
      <sprite ref={earth} scale={[103, 103, 1]}>
        <spriteMaterial map={texture} transparent alphaTest={0.02} depthWrite={false} fog={false} toneMapped={false} />
      </sprite>
      <group ref={sat}>
        <mesh><boxGeometry args={[2, 1.2, 1.2]} /><meshStandardMaterial color="#d8c27a" metalness={0.6} roughness={0.4} /></mesh>
        <mesh position={[3, 0, 0]}><boxGeometry args={[3.5, 0.08, 1.4]} /><meshStandardMaterial map={panelTexture()} /></mesh>
        <mesh position={[-3, 0, 0]}><boxGeometry args={[3.5, 0.08, 1.4]} /><meshStandardMaterial map={panelTexture()} /></mesh>
      </group>
      <group ref={ship}>
        <mesh rotation-z={-Math.PI / 2}><coneGeometry args={[1, 4, 8]} /><meshStandardMaterial color="#eeeeee" /></mesh>
        <mesh position={[-2.4, 0, 0]}><sphereGeometry args={[0.5, 8, 8]} /><meshBasicMaterial color="#ffb070" /></mesh>
      </group>
    </>
  );
}

/* ---------------- Base pieces ---------------- */
const WHITE = "#eceae5";
const TRIM = "#ff8a3d";

function Blinker({ position, color = "#6cf2c8", rate = 1.3, alertColor }: { position: [number, number, number]; color?: string; rate?: number; alertColor?: boolean }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const em = useGame.getState().mission.emergency;
    const c = alertColor && em ? "#ff4040" : color;
    ref.current.color.set(c);
    ref.current.emissive.set(c);
    ref.current.emissiveIntensity = (Math.sin(clock.elapsedTime * rate * (em && alertColor ? 4 : 1) * Math.PI) > 0 ? 2.5 : 0.3);
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial ref={ref} />
    </mesh>
  );
}

function Habitat() {
  return (
    <group position={[0, 0, -3.2]}>
      <mesh position={[0, 2.2, 0]} rotation-z={Math.PI / 2} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 7.5, 32]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.1} />
      </mesh>
      {[-3.75, 3.75].map((x) => (
        <mesh key={x} position={[x, 2.2, 0]} castShadow>
          <sphereGeometry args={[2.2, 32, 16]} />
          <meshStandardMaterial color={WHITE} roughness={0.5} />
        </mesh>
      ))}
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x, 2.2, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[2.25, 2.25, 0.25, 32]} />
          <meshStandardMaterial color={TRIM} roughness={0.6} />
        </mesh>
      ))}
      {[-1.3, 1.3].map((x) => (
        <mesh key={x} position={[x, 2.6, 2.1]}>
          <circleGeometry args={[0.45, 20]} />
          <meshStandardMaterial color="#ffe2a8" emissive="#ffcc77" emissiveIntensity={0.9} />
        </mesh>
      ))}
      {/* legs */}
      {[-3, 3].map((x) => [-1.4, 1.4].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.4, z]}><cylinderGeometry args={[0.18, 0.25, 0.8]} /><meshStandardMaterial color="#7d8792" /></mesh>
      )))}
      {/* pressure panel */}
      <mesh position={[0, 1.2, 2.25]}>
        <boxGeometry args={[1.2, 1.4, 0.15]} />
        <meshStandardMaterial color="#2c3a52" />
      </mesh>
      <Blinker position={[0, 1.7, 2.35]} alertColor />
      {/* tunnel to command */}
      <mesh position={[0, 1.4, -4.5]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[1.0, 1.0, 5, 16]} />
        <meshStandardMaterial color="#d6d3cc" roughness={0.7} />
      </mesh>
      {/* tunnels to greenhouse / lab */}
      <mesh position={[-7, 1.4, 0]} rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.9, 0.9, 3.2, 16]} /><meshStandardMaterial color="#d6d3cc" roughness={0.7} /></mesh>
      <mesh position={[7, 1.4, 0]} rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.9, 0.9, 3.2, 16]} /><meshStandardMaterial color="#d6d3cc" roughness={0.7} /></mesh>
    </group>
  );
}

function CommandModule() {
  return (
    <group position={[0, 0, -13]}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow><cylinderGeometry args={[3.4, 3.6, 1.2, 32]} /><meshStandardMaterial color="#cfccc5" /></mesh>
      <mesh position={[0, 1.2, 0]} castShadow><sphereGeometry args={[3.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={WHITE} roughness={0.45} /></mesh>
      <mesh position={[0, 1.2, 0]} rotation-x={Math.PI / 2}><torusGeometry args={[3.32, 0.12, 8, 40]} /><meshStandardMaterial color={TRIM} /></mesh>
      <mesh position={[0, 2.6, 2.6]} rotation-x={-0.6}><boxGeometry args={[2.4, 0.8, 0.1]} /><meshStandardMaterial color="#9fd9ff" emissive="#4aa3e0" emissiveIntensity={0.7} /></mesh>
      <mesh position={[0, 4.6, 0]}><cylinderGeometry args={[0.05, 0.05, 1.4]} /><meshStandardMaterial color="#888" /></mesh>
      <Blinker position={[0, 5.35, 0]} color="#ff6b5b" rate={0.8} />
      <mesh position={[0, 1, 3.45]}><boxGeometry args={[1.4, 1.8, 0.2]} /><meshStandardMaterial color="#5b6675" /></mesh>
    </group>
  );
}

function Greenhouse() {
  const plants = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const lamp = useRef<THREE.PointLight>(null);
  const items = useMemo(() => {
    const r = seeded(9);
    return Array.from({ length: 14 }, (_, i) => ({ x: (i % 5) * 1.3 - 2.6, z: Math.floor(i / 5) * 1.3 - 1.3, s: 0.6 + r() * 0.5, ph: r() * 6 }));
  }, []);
  useFrame(({ clock }) => {
    const st = useGame.getState().mission;
    const sick = st.emergency?.id === "greenhouse";
    const powerLow = st.emergency?.id === "power";
    const t = clock.elapsedTime;
    plants.current?.children.forEach((c, i) => { c.rotation.z = Math.sin(t * 1.2 + items[i].ph) * 0.08; c.scale.y = items[i].s * (sick ? 0.7 : 1); });
    mats.current.forEach((m) => m && m.color.set(sick ? "#a39a4b" : "#4fbf5e"));
    if (lamp.current) lamp.current.intensity = powerLow ? 2 : 9;
  });
  return (
    <group position={[-13, 0, -4]}>
      <mesh position={[0, 0.3, 0]} receiveShadow><cylinderGeometry args={[4.2, 4.3, 0.6, 32]} /><meshStandardMaterial color="#cfccc5" /></mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#cfeee6" transparent opacity={0.22} roughness={0.05} metalness={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.6, 0]} rotation-y={(i * Math.PI) / 4}><torusGeometry args={[4, 0.06, 6, 32, Math.PI]} /><meshStandardMaterial color="#dcdad3" /></mesh>
      ))}
      <pointLight ref={lamp} position={[0, 3, 0]} color="#ff9adf" intensity={9} distance={8} />
      <group ref={plants} position={[0, 0.7, 0]}>
        {items.map((p, i) => (
          <group key={i} position={[p.x, 0, p.z]}>
            <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.8, 0.3, 0.8]} /><meshStandardMaterial color="#6b5137" /></mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.38, 10, 8]} />
              <meshStandardMaterial ref={(m) => { if (m) mats.current[i] = m; }} color="#4fbf5e" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Lab() {
  const scanner = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (scanner.current) scanner.current.rotation.y = clock.elapsedTime * 1.5; });
  return (
    <group position={[13, 0, -4]}>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow><boxGeometry args={[6, 3.4, 5]} /><meshStandardMaterial color={WHITE} roughness={0.5} /></mesh>
      <mesh position={[0, 3.55, 0]}><boxGeometry args={[6.2, 0.15, 5.2]} /><meshStandardMaterial color="#5ad6c4" /></mesh>
      <mesh position={[-1.5, 2.2, 2.52]}><planeGeometry args={[1.8, 1]} /><meshStandardMaterial color="#bfe9ff" emissive="#7cc8ff" emissiveIntensity={0.6} /></mesh>
      <mesh position={[1.5, 1.3, 2.52]}><planeGeometry args={[1.2, 2.2]} /><meshStandardMaterial color="#606b78" /></mesh>
      <mesh ref={scanner} position={[2, 4.2, 0]}><octahedronGeometry args={[0.5]} /><meshStandardMaterial color="#5ad6c4" emissive="#5ad6c4" emissiveIntensity={0.6} /></mesh>
      <Blinker position={[-2.8, 3.2, 2.55]} color="#ffd166" />
    </group>
  );
}

function Airlock() {
  return (
    <group position={[6.5, 0, 3.6]}>
      <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[1.5, 1.5, 2.8, 24]} /><meshStandardMaterial color={WHITE} /></mesh>
      <mesh position={[0, 2.85, 0]}><cylinderGeometry args={[1.55, 1.55, 0.15, 24]} /><meshStandardMaterial color={TRIM} /></mesh>
      <mesh position={[0, 1.2, 1.48]}><boxGeometry args={[1.1, 2, 0.1]} /><meshStandardMaterial color="#59636f" /></mesh>
      <mesh position={[-2.5, 1.4, -3.6]} rotation-y={-0.9} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.8, 0.8, 5.5, 14]} /><meshStandardMaterial color="#d6d3cc" /></mesh>
      <Blinker position={[0, 2.5, 1.55]} color="#6cf2c8" alertColor />
    </group>
  );
}

function PowerStation() {
  const panels = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const pf = useGame.getState().mission.emergency?.id === "power";
    panels.current?.children.forEach((c, i) => { c.rotation.x = -0.5 + Math.sin(clock.elapsedTime * 0.1 + i * 0.05) * 0.12 + (pf && i % 3 === 0 ? 0.7 : 0); });
  });
  const tex = panelTexture();
  return (
    <>
      <group position={[16, 0, 8]}>
        <mesh position={[0, 1, 0]} castShadow><boxGeometry args={[3, 2, 2.2]} /><meshStandardMaterial color="#d7d4cd" /></mesh>
        <mesh position={[0, 1.1, 1.12]}><planeGeometry args={[2, 1]} /><meshStandardMaterial color="#1c2a40" /></mesh>
        {[-0.6, 0, 0.6].map((x) => <Blinker key={x} position={[x, 1.3, 1.15]} color="#ffd166" rate={1 + x} alertColor />)}
        <mesh position={[2.2, 0.7, 0]} castShadow><boxGeometry args={[1, 1.4, 1.6]} /><meshStandardMaterial color={TRIM} /></mesh>
      </group>
      <group ref={panels} position={[22, 0, -10]}>
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i} position={[(i % 4) * 2.8 - 4.2, 2, Math.floor(i / 4) * 4 - 2]}>
            <mesh castShadow><boxGeometry args={[2.5, 0.08, 3.2]} /><meshStandardMaterial map={tex} metalness={0.5} roughness={0.3} /></mesh>
          </group>
        ))}
      </group>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[22 + (i % 4) * 2.8 - 4.2, 1, -10 + Math.floor(i / 4) * 4 - 2]}><cylinderGeometry args={[0.08, 0.08, 2]} /><meshStandardMaterial color="#888" /></mesh>
      ))}
    </>
  );
}

function Comms() {
  const dish = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const fixed = useGame.getState().mission.commsFixed;
    if (dish.current) dish.current.rotation.y = fixed ? clock.elapsedTime * 0.4 : 0.6;
  });
  return (
    <group position={[-16, 0, 10]}>
      <mesh position={[0, 2.5, 0]} castShadow><cylinderGeometry args={[0.15, 0.3, 5]} /><meshStandardMaterial color="#9aa3ad" /></mesh>
      <group ref={dish} position={[0, 5, 0]}>
        <mesh rotation-x={-0.9} castShadow><sphereGeometry args={[1.4, 24, 12, 0, Math.PI * 2, 0, 1.0]} /><meshStandardMaterial color={WHITE} side={THREE.DoubleSide} /></mesh>
        <Blinker position={[0, 0.3, 0.6]} color="#6cf2c8" rate={2} />
      </group>
      <mesh position={[0.6, 0.4, 0.6]}><boxGeometry args={[0.8, 0.8, 0.8]} /><meshStandardMaterial color="#5b6675" /></mesh>
    </group>
  );
}

function Storage() {
  const crates = [[0, 0, 0], [1.1, 0, 0.2], [0.5, 1, 0.1], [-1.1, 0, -0.3]];
  return (
    <group position={[-7, 0, 9]}>
      {crates.map((c, i) => (
        <mesh key={i} position={[c[0], c[1] + 0.5, c[2]]} rotation-y={i * 0.3} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={i % 2 ? "#e9c46a" : "#d2d0ca"} />
        </mesh>
      ))}
    </group>
  );
}

function Lander() {
  return (
    <group position={[-30, terrainHeight(-30, 12), 12]}>
      <mesh position={[0, 2.4, 0]} castShadow><cylinderGeometry args={[1.8, 2.2, 2, 8]} /><meshStandardMaterial color="#d9b44a" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[0, 4, 0]} castShadow><coneGeometry args={[1.5, 1.6, 8]} /><meshStandardMaterial color={WHITE} /></mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.57) * 2.3, 0.9, Math.sin(i * 1.57) * 2.3]} rotation={[Math.sin(i * 1.57) * 0.5, 0, -Math.cos(i * 1.57) * 0.5]}>
          <cylinderGeometry args={[0.08, 0.08, 2.4]} />
          <meshStandardMaterial color="#999" />
        </mesh>
      ))}
    </group>
  );
}

function SampleSites() {
  const ids = ["rock1", "rock2", "rock3", "crater", "earthview"];
  return (
    <>
      {ids.map((id) => {
        const s = stationById[id];
        const y = terrainHeight(s.x, s.z);
        return (
          <group key={id} position={[s.x, y, s.z]}>
            {id.startsWith("rock") && (
              <mesh position={[0, 0.6, 0]} castShadow>
                <dodecahedronGeometry args={[1.1, 0]} />
                <meshStandardMaterial color={id === "rock1" ? "#4c4a4a" : id === "rock2" ? "#e0ddd5" : "#8a7d70"} flatShading roughness={0.9} />
              </mesh>
            )}
            <mesh position={[1.4, 1, 0]}><cylinderGeometry args={[0.03, 0.03, 2]} /><meshStandardMaterial color="#ddd" /></mesh>
            <mesh position={[1.7, 1.8, 0]}><boxGeometry args={[0.6, 0.35, 0.02]} /><meshStandardMaterial color="#ff8a3d" emissive="#ff8a3d" emissiveIntensity={0.4} /></mesh>
          </group>
        );
      })}
    </>
  );
}

function Perimeter() {
  const posts = useMemo(() => Array.from({ length: 32 }, (_, i) => { const a = (i / 32) * Math.PI * 2; return [Math.cos(a) * BASE_RADIUS, Math.sin(a) * BASE_RADIUS] as const; }), []);
  return (
    <>
      {posts.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.07, 0.07, 0.8]} /><meshStandardMaterial color="#cccccc" /></mesh>
          <Blinker position={[0, 0.85, 0]} color="#ffb347" rate={0.5} />
        </group>
      ))}
      {/* landing pad / rover bay */}
      <mesh position={[9, 0.03, 17]} rotation-x={-Math.PI / 2} receiveShadow><circleGeometry args={[3.6, 32]} /><meshStandardMaterial color="#6f737a" roughness={0.9} /></mesh>
      <mesh position={[9, 0.04, 17]} rotation-x={-Math.PI / 2}><ringGeometry args={[3.2, 3.45, 32]} /><meshStandardMaterial color="#ffb347" /></mesh>
    </>
  );
}

/* ---------------- Markers ---------------- */
function Marker({ kind }: { kind: "emergency" | "objective" }) {
  const g = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const m = useGame.getState().mission;
    let id: string | null = null;
    if (kind === "emergency") id = m.emergency?.station ?? null;
    else if (!m.emergency) id = OBJECTIVES.find(o => o.target === useGame.getState().trackedTarget && !m.done.includes(o.id))?.target ?? OBJECTIVES.find((o) => !m.done.includes(o.id))?.target ?? null;
    const p = id ? targetPos(id) : null;
    if (!g.current) return;
    g.current.visible = !!p && !(m.inRover && id === "rover");
    if (p) {
      g.current.position.set(p.x, p.y + 4 + Math.sin(clock.elapsedTime * 2.5) * 0.3, p.z);
      g.current.rotation.y = clock.elapsedTime * 1.5;
    }
    if (light.current) light.current.intensity = kind === "emergency" ? 25 + Math.sin(clock.elapsedTime * 6) * 20 : 0;
  });
  const color = kind === "emergency" ? "#ff4d4d" : "#5ad6c4";
  return (
    <group ref={g}>
      <mesh rotation-x={Math.PI}><coneGeometry args={[0.45, 0.9, 4]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} /></mesh>
      {kind === "emergency" && <pointLight ref={light} color="#ff3030" distance={14} position={[0, -2, 0]} />}
    </group>
  );
}

/* ---------------- Crew ---------------- */
const WAYPOINTS: Record<CrewId, [number, number][]> = {
  maya: [[-9, 2], [14, 8], [-14, 7], [2, 5], [16, 11]],
  leo: [[10, 2], [13, 1.5], [6, 9], [-4, 6], [12, 1]],
  nova: [[-11, 3], [-1, 1], [-12, 1.5], [-5, 6], [-13, 1]],
  ari: [[-1, 7], [-3, 6], [-3, 3], [0, 4]],
};

function CrewMember({ id, accent }: { id: CrewId; accent: string }) {
  const g = useRef<THREE.Group>(null);
  const motion = useRef<AstroMotion>({ speed: 0, wave: 0, work: 0, alert: 0 });
  const st = useRef({ wp: 0, wait: Math.random() * 3, greeted: false });
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const s = useGame.getState();
    const m = s.mission;
    const pos = world.crew[id];
    const frozen = s.paused || !!s.activity || !!s.dialogue || s.handbook || !!s.sampleView || pos.distanceTo(world.player) < 3;
    let target: [number, number] | null = null;
    const sheltered = m.time < m.shelterUntil || m.emergency?.id === "radiation";
    const idx = ["maya", "leo", "nova", "ari"].indexOf(id);
    if (sheltered) target = [-1.8 + idx * 1.2, -8];
    else if (m.emergency?.id === "conflict" && (id === "maya" || id === "leo")) target = id === "maya" ? [3.5, 1.5] : [5.5, 1.5];
    else {
      const w = WAYPOINTS[id][st.current.wp];
      target = w;
    }
    const dx = target[0] - pos.x, dz = target[1] - pos.z;
    const d = Math.hypot(dx, dz);
    const distP = pos.distanceTo(world.player);
    motion.current.alert = m.emergency ? 1 : 0;
    if (frozen) { motion.current.speed = 0; }
    else if (d > 0.3) {
      const sp = m.emergency ? 2.6 : 1.5;
      pos.x += (dx / d) * sp * dt; pos.z += (dz / d) * sp * dt;
      collide(pos, 0.4);
      motion.current.speed = sp; motion.current.work = 0;
      if (g.current) g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, Math.atan2(dx, dz), 0.15);
    } else {
      motion.current.speed = 0;
      motion.current.work = sheltered ? 0 : 1;
      st.current.wait -= dt;
      if (st.current.wait <= 0 && !sheltered) { st.current.wp = (st.current.wp + 1) % WAYPOINTS[id].length; st.current.wait = 4 + Math.random() * 5; }
      if (m.emergency?.id === "conflict" && (id === "maya" || id === "leo") && g.current) {
        g.current.rotation.y = id === "maya" ? Math.PI / 2 : -Math.PI / 2;
        motion.current.work = 0;
      }
    }
    if (distP < 4 && !frozen && d <= 0.3) {
      motion.current.work = 0;
      if (g.current) g.current.rotation.y = Math.atan2(world.player.x - pos.x, world.player.z - pos.z);
      if (!st.current.greeted) { st.current.greeted = true; motion.current.wave = 1.6; }
    } else if (distP > 8) st.current.greeted = false;
    if (g.current) g.current.position.set(pos.x, terrainHeight(pos.x, pos.z), pos.z);
  });
  const crew = CREW.find((c) => c.id === id)!;
  return (
    <group ref={g}>
      <Astronaut accent={accent} motion={motion} />
      <Html position={[0, 3, 0]} center distanceFactor={14} zIndexRange={[5, 0]}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-card/80 px-2 py-0.5 font-display text-xs text-foreground">
          {crew.name}
        </div>
      </Html>
    </group>
  );
}

/* ---------------- Rover ---------------- */
let roverWarningActive=false;
function Rover() {
  const g = useRef<THREE.Group>(null);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const s = useGame.getState();
    const r = world.rover;
    if (s.mission.inRover && !s.paused && !s.activity && !s.dialogue && !s.handbook && !s.sampleView) {
      const throttle = (pressed("up") ? 1 : 0) - (pressed("down") ? 1 : 0);
      const steer = (pressed("left") ? 1 : 0) - (pressed("right") ? 1 : 0);
      const dx = Math.sin(r.yaw) * throttle;
      const dz = Math.cos(r.yaw) * throttle;
      const grade = terrainHeight(r.pos.x + dx, r.pos.z + dz) - terrainHeight(r.pos.x, r.pos.z);
      const dial=s.roverSpeedSetting;
      const drive=updateRoverDrive(r.speed,r.yaw,throttle,steer,pressed("run"),dt,grade,dial);
      if (roverRisk(throttle*ROVER_FORWARD_SPEED*dial,grade) && throttle>0 && (steer!==0||Math.abs(grade)>.25) && !roverWarningActive) {
        roverWarningActive=true;
        s.showToast("Safety assist: too fast to turn safely — speed reduced. High speed can tip the rover or lose grip on loose dust.","info");
      }
      if (throttle===0 || !roverRisk(throttle*ROVER_FORWARD_SPEED*dial,grade)) roverWarningActive=false;
      r.speed=drive.speed; r.yaw=drive.yaw;
      moveWithCollisions(r.pos, Math.sin(r.yaw)*r.speed*dt, Math.cos(r.yaw)*r.speed*dt, COLLIDERS, 2.25);
      if (!s.mission.evaReady) {
        const d = Math.hypot(r.pos.x, r.pos.z);
        if (d > BASE_RADIUS - 1) { r.pos.multiplyScalar((BASE_RADIUS - 1) / d); r.speed *= 0.3; }
      }
      collide(r.pos, 2.25);
      r.pos.x = THREE.MathUtils.clamp(r.pos.x, -190, 190);
      r.pos.z = THREE.MathUtils.clamp(r.pos.z, -190, 190);
      world.player.copy(r.pos);
    } else {
      r.speed = 0;
    }
    if (g.current) {
      const y = terrainHeight(r.pos.x, r.pos.z);
      g.current.position.set(r.pos.x, y, r.pos.z);
      g.current.rotation.y = r.yaw;
      const ahead = terrainHeight(r.pos.x + Math.sin(r.yaw) * 1.5, r.pos.z + Math.cos(r.yaw) * 1.5);
      g.current.rotation.x = -Math.atan2(ahead - y, 1.5) * 0.8;
    }

  });
  const inRover = useGame((s) => s.mission.inRover);
  return <group ref={g}><FriendlyRover occupied={inRover}/></group>;
}

/* ---------------- Player ---------------- */
function Player() {
  const g = useRef<THREE.Group>(null);
  const motion = useRef<AstroMotion>({ speed: 0, wave: 0, work: 0, alert: 0 });
  const camera = useThree((s) => s.camera);
  const canvas = useThree((s) => s.gl.domElement);
  const orbit = useRef(cameraRig);
  const renderer = useThree(s => s.gl);
  const scene = useThree(s => s.scene);
  useEffect(() => { photoRig.capture = () => { renderer.render(scene, camera); return renderer.domElement.toDataURL("image/jpeg", 0.85); }; return () => { photoRig.capture=null; }; }, [renderer,scene,camera]);
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    let drag: number | null = null;
    let lastX = 0, lastY = 0;
    const start = (e: PointerEvent) => {
      const state = useGame.getState();
      if (e.button !== 0 || state.paused || state.activity || state.dialogue || state.handbook || state.sampleView) return;
      drag = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== drag) return;
      cameraRig.followRover=false;
      orbit.current.yaw -= (e.clientX - lastX) * 0.005;
      orbit.current.elevation = THREE.MathUtils.clamp(orbit.current.elevation + (e.clientY - lastY) * 0.004, 0.2, 1.45);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const end = () => { drag = null; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); const s=useGame.getState(); if(s.paused || s.activity || s.dialogue || s.handbook || s.sampleView)return; cameraRig.distance=THREE.MathUtils.clamp(cameraRig.distance+e.deltaY*0.012,6,28); };
    canvas.addEventListener("wheel",wheel,{passive:false});
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("lostpointercapture", end);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    return () => {
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("lostpointercapture", end);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointercancel", end);
    };
  }, [canvas]);
  const accent = useGame((s) => s.custom.accent);
  const prints = useRef<THREE.InstancedMesh>(null);
  const printState = useRef({ i: 0, last: new THREE.Vector3(999, 0, 999), side: 1, stepAcc: 0, warnT: 0 });
  const camInit = useRef(false);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const s = useGame.getState();
    const m = s.mission;
    const blocked = s.paused || !!s.activity || !!s.dialogue || s.handbook || !!s.sampleView;
    const p = world.player;
    if (!m.inRover) {
      let ix = (pressed("right") ? 1 : 0) - (pressed("left") ? 1 : 0);
      let iz = (pressed("down") ? 1 : 0) - (pressed("up") ? 1 : 0);
      if (blocked) { ix = 0; iz = 0; }
      const { yaw } = orbit.current;
      [ix, iz] = [ix * Math.cos(yaw) + iz * Math.sin(yaw), iz * Math.cos(yaw) - ix * Math.sin(yaw)];
      const len = Math.hypot(ix, iz);
      const speed = pressed("run") ? 7 : 4;
      if (len > 0) {
        ix /= len; iz /= len;
        const grade = (terrainHeight(p.x + ix, p.z + iz) - terrainHeight(p.x, p.z));
        const pace = speed / (1 + Math.max(0, grade) * 1.5);
        moveWithCollisions(p, ix * pace * dt, iz * pace * dt, playerObstacles());
        const target = Math.atan2(ix, iz);
        let diff = target - world.playerYaw;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        world.playerYaw += diff * (1 - Math.exp(-12 * dt));
        motion.current.speed = speed;
        printState.current.stepAcc += speed * dt;
        if (printState.current.stepAcc > 1.4) { printState.current.stepAcc = 0; audio.sfx("step"); }
      } else motion.current.speed = 0;
      collide(p);
      const d = Math.hypot(p.x, p.z);
      if (!m.evaReady && d > BASE_RADIUS - 0.5) {
        p.multiplyScalar((BASE_RADIUS - 0.5) / d);
        printState.current.warnT -= dt;
        if (printState.current.warnT <= 0) { s.showToast("Suit not ready for EVA. Run suit checks at the Airlock first."); printState.current.warnT = 4; }
      }
      p.x = THREE.MathUtils.clamp(p.x, -190, 190);
      p.z = THREE.MathUtils.clamp(p.z, -190, 190);
      p.y = terrainHeight(p.x, p.z);
      if (g.current) { g.current.position.copy(p); g.current.rotation.y = world.playerYaw; }
      motion.current.alert = m.emergency ? 1 : 0;

      // footprints outside the base
      const ps = printState.current;
      if (prints.current && d > 18 && p.distanceTo(ps.last) > 0.8) {
        ps.last.copy(p);
        ps.side *= -1;
        const o = new THREE.Object3D();
        o.position.set(p.x + Math.cos(world.playerYaw) * 0.18 * ps.side, p.y + 0.03, p.z - Math.sin(world.playerYaw) * 0.18 * ps.side);
        o.rotation.set(-Math.PI / 2, 0, world.playerYaw);
        o.updateMatrix();
        prints.current.setMatrixAt(ps.i, o.matrix);
        ps.i = (ps.i + 1) % 400;
        prints.current.instanceMatrix.needsUpdate = true;
      }
    }

    // Preserve complete geometry and user zoom. Never hide scene objects to clear a sightline.

    const focus = m.inRover ? world.rover.pos : p;
    const ground = terrainHeight(focus.x, focus.z);
    const cam = camera as THREE.PerspectiveCamera;
    if (photoRig.active) {
      camera.position.set(focus.x,ground+1.7,focus.z);
      const cp=Math.cos(photoRig.pitch);
      camera.lookAt(focus.x+Math.sin(photoRig.yaw)*cp*100,ground+1.7+Math.sin(photoRig.pitch)*100,focus.z-Math.cos(photoRig.yaw)*cp*100);
      cam.fov=55/photoRig.zoom;
      renderer.toneMappingExposure=Math.pow(2,photoRig.exposure);
    } else {
      renderer.toneMappingExposure=1;
      cam.fov=60;
      if(m.inRover&&cameraRig.followRover&&!cameraRig.bird){const diff=Math.atan2(Math.sin(world.rover.yaw+Math.PI-cameraRig.yaw),Math.cos(world.rover.yaw+Math.PI-cameraRig.yaw));cameraRig.yaw+=diff*(1-Math.exp(-5*dt));}
      const elevation=cameraRig.bird?1.45:cameraRig.elevation;
      const distance=cameraRig.bird?Math.max(22,cameraRig.distance):cameraRig.distance;
      const horizontal=Math.cos(elevation)*distance;
      const x=focus.x+Math.sin(cameraRig.yaw)*horizontal,z=focus.z+Math.cos(cameraRig.yaw)*horizontal;
      tmp.set(x,Math.max(ground+1.4+Math.sin(elevation)*distance,terrainHeight(x,z)+1.5),z);
      if(!camInit.current){camera.position.copy(tmp);camInit.current=true;}
      else camera.position.lerp(tmp,1-Math.exp(-5*dt));
      look.current.set(focus.x,ground+1.2,focus.z);
      camera.lookAt(look.current);

    }
    cam.updateProjectionMatrix();
    if(g.current)g.current.visible=!m.inRover&&!photoRig.active;

    // interaction prompt
    let best: { id: string; label: string; d: number } | null = null;
    const consider = (id: string, label: string, x: number, z: number, r: number) => {
      const d = Math.hypot(p.x - x, p.z - z);
      if (d < r && (!best || d < best.d)) best = { id, label, d };
    };
    const em = m.emergency;
    if (m.inRover) {
      STATIONS.filter((st) => ["rock1", "rock2", "rock3", "crater", "earthview"].includes(st.id)).forEach((st) => consider(st.id, `${st.verb}`, st.x, st.z, st.r + 3));
      if (!best) best = { id: "rover", label: "EXIT ROVER", d: 0 };
    } else {
      STATIONS.forEach((st) => consider(st.id, em && em.station === st.id ? `RESPOND · ${st.name.toUpperCase()}` : `${st.verb} · ${st.name.toUpperCase()}`, st.x, st.z, st.r));
      CREW.forEach((c) => { const cp = world.crew[c.id]; consider(c.id, em && em.station === c.id ? `TALK TO ${c.name.toUpperCase()} (URGENT)` : `TALK TO ${c.name.toUpperCase()}`, cp.x, cp.z, 2.6); });
      consider("rover", "ENTER ROVER", world.rover.pos.x, world.rover.pos.z, 3.2);
    }
    const b = best as { id: string; label: string } | null;
    const cur = s.prompt;
    if ((b?.id ?? null) !== (cur?.id ?? null) || (b && cur && b.label !== cur.label)) s.setPrompt(b ? { id: b.id, label: b.label } : null);
  });

  return (
    <>
      <group ref={g}>
        <Astronaut accent={accent} motion={motion} />
      </group>
      <instancedMesh ref={prints} args={[undefined, undefined, 400]} frustumCulled={false}>
        <planeGeometry args={[0.22, 0.42]} />
        <meshStandardMaterial color="#6d6a64" transparent opacity={0.7} roughness={1} />
      </instancedMesh>
    </>
  );
}

function EmergencyLighting() {
  const amb = useRef<THREE.AmbientLight>(null);
  useFrame(({ clock }) => {
    const em = useGame.getState().mission.emergency;
    if (!amb.current) return;
    if (em) { amb.current.color.set("#ff6060"); amb.current.intensity = 0.25 + (Math.sin(clock.elapsedTime * 4) * 0.5 + 0.5) * 0.25; }
    else { amb.current.color.set("#b8c4ff"); amb.current.intensity = 0.35; }
  });
  return <ambientLight ref={amb} intensity={0.35} />;
}

export function LunarWorld({compact=false}:{compact?:boolean}) {
  const sunlight = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (!sunlight.current) return;
    const solar = solarTelemetry(useGame.getState().mission.time);
    const altitude = THREE.MathUtils.degToRad(solar.elevation);
    sunlight.current.position.set(
      100 * Math.sin(SOLAR_BEARING) * Math.cos(altitude),
      100 * Math.sin(altitude),
      -100 * Math.cos(SOLAR_BEARING) * Math.cos(altitude),
    );
    sunlight.current.intensity = solar.directSun ? 2.8 : 0.7;
  });
  return (
    <>
      <color attach="background" args={["#010206"]} />
      <EmergencyLighting />
      <hemisphereLight args={["#8fa8ff", "#5a554c", 0.45]} />
      <directionalLight
        ref={sunlight}
        position={[82, 10, 55]}
        intensity={2.6}
        color="#fff4e2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-far={240}
        shadow-bias={-0.0005}
      />
      <Environment resolution={64}>
        <Lightformer intensity={1.5} position={[0, 8, 0]} scale={[12, 12, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={0.8} color="#88aaff" position={[-8, 2, -4]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
        <Lightformer intensity={0.6} color="#ffcf9a" position={[8, 2, 4]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
      </Environment>
      <Sky compact={compact} />
      <Terrain />
      <Rocks />
      <Perimeter />
      <Habitat />
      <CommandModule />
      <Greenhouse />
      <Lab />
      <Airlock />
      <PowerStation />
      <Comms />
      <Storage />
      <Lander />
      <SampleSites />
      {CREW.map((c) => <CrewMember key={c.id} id={c.id} accent={c.accent} />)}
      <Rover />
      <Player />
      <Marker kind="emergency" />
      <Marker kind="objective" />
    </>
  );
}
