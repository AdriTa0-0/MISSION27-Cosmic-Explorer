import { resolve, type Obstacle } from "./collision";
import * as THREE from "three";
import { terrainHeight } from "./nasa/terrain";

export { terrainHeight };

export const BASE_RADIUS = 24;
export const LUNAR_CAMERA_YAW = -0.43;
export const LUNAR_START = [2, 9] as const;

export type Zone = "base" | "surface";
export interface Station {
  id: string;
  name: string;
  verb: string;
  x: number;
  z: number;
  r: number;
}

export const STATIONS: Station[] = [
  { id: "cmd", name: "Command Module", verb: "USE CONSOLE", x: 0, z: -9.2, r: 2.2 },
  { id: "habitat", name: "Habitat Pressure Panel", verb: "INSPECT", x: 0, z: -0.2, r: 2.2 },
  { id: "greenhouse", name: "Greenhouse", verb: "INSPECT", x: -13, z: 0.8, r: 2.4 },
  { id: "lab", name: "Science Lab", verb: "USE", x: 13, z: 0.2, r: 2.4 },
  { id: "airlock", name: "Airlock", verb: "USE", x: 6.5, z: 6.4, r: 2 },
  { id: "power", name: "Power Station", verb: "INSPECT", x: 16, z: 10.8, r: 2.2 },
  { id: "comms", name: "Comms Antenna", verb: "REPAIR", x: -16, z: 12.4, r: 2 },
  { id: "storage", name: "Supply Storage", verb: "ORGANIZE", x: -7, z: 11.6, r: 2 },
  { id: "rock1", name: "Basalt Outcrop", verb: "COLLECT SAMPLE", x: 38, z: 22, r: 3 },
  { id: "rock2", name: "Highland Anorthosite", verb: "COLLECT SAMPLE", x: -42, z: 28, r: 3 },
  { id: "rock3", name: "Regolith Breccia", verb: "COLLECT SAMPLE", x: 8, z: 54, r: 3 },
  { id: "crater", name: "Shackleton Survey Point", verb: "SCAN LOLA TERRAIN", x: -36, z: -38, r: 3.5 },
  { id: "earthview", name: "Earthrise Ridge", verb: "PHOTOGRAPH EARTH", x: 34, z: -36, r: 3.5 },
];
export const stationById = Object.fromEntries(STATIONS.map((s) => [s.id, s]));

export const CREW = [
  { id: "maya", name: "Maya", role: "Systems Engineer", accent: "#5ad6c4" },
  { id: "leo", name: "Leo", role: "Science Specialist", accent: "#ffd166" },
  { id: "nova", name: "Nova", role: "Life Support Specialist", accent: "#ff6b8b" },
  { id: "ari", name: "Ari", role: "Mission Commander", accent: "#9b8cff" },
] as const;
export type CrewId = (typeof CREW)[number]["id"];

// The same seeded rock transforms drive rendering and collision footprints.
export const ROCKS = (() => {
  let seed=42; const random=()=>((seed=(seed*16807)%2147483647)/2147483647);
  const rocks: {x:number;z:number;s:number;rx:number;ry:number;rz:number;sy:number}[]=[];
  while(rocks.length<260){
    const x=(random()-0.5)*300,z=(random()-0.5)*300;
    if(Math.hypot(x,z)<21)continue;
    const s=0.2+Math.pow(random(),3)*2.2;
    rocks.push({x,z,s,rx:random()*3,ry:random()*3,rz:random()*3,sy:s*(0.6+random()*0.5)});
  }
  return rocks;
})();
export const COLLIDERS: Obstacle[] = [
  {x:0,z:-3.2,hx:3.75,hz:2.25},
  {x:-3.75,z:-3.2,r:2.2},{x:3.75,z:-3.2,r:2.2},
  {x:0,z:-7.7,hx:1,hz:2.5},
  {x:-7,z:-3.2,hx:1.6,hz:0.9},{x:7,z:-3.2,hx:1.6,hz:0.9},
  {x:4,z:0,hx:2.75,hz:0.8,yaw:-0.9},
  {x:0,z:-13,r:3.6},{x:-13,z:-4,r:4.3},
  {x:13,z:-4,hx:3.1,hz:2.6}, {x:6.5,z:3.6,r:1.55},
  {x:16,z:8,hx:1.5,hz:1.1},{x:18.2,z:8,hx:0.5,hz:0.8},
  ...Array.from({length:8},(_,i)=>({x:22+(i%4)*2.8-4.2,z:-10+Math.floor(i/4)*4-2,hx:1.25,hz:1.6})),
  {x:-16,z:10,r:0.3},{x:-15.4,z:10.6,hx:0.4,hz:0.4},
  ...[[0,0,0],[1.1,0,0.2],[0.5,1,0.1],[-1.1,0,-0.3]].map((c,i)=>({x:-7+c[0],z:9+c[2],hx:0.5,hz:0.5,yaw:i*0.3})),
  {x:-30,z:12,r:2.8},
  ...STATIONS.filter(s=>s.id.startsWith('rock')).map(s=>({x:s.x,z:s.z,r:1.1})),
  ...STATIONS.filter(s=>['rock1','rock2','rock3','crater','earthview'].includes(s.id)).map(s=>({x:s.x+1.4,z:s.z,r:0.05})),
  ...Array.from({length:32},(_,i)=>({x:Math.cos(i/32*Math.PI*2)*BASE_RADIUS,z:Math.sin(i/32*Math.PI*2)*BASE_RADIUS,r:0.12})),
  ...ROCKS.map(r=>({x:r.x,z:r.z,r:Math.max(r.s,r.sy)})),
];
export function collide(p: THREE.Vector3, extra=0.45){ resolve(p,COLLIDERS,extra); }
export function playerObstacles(): Obstacle[] {
  return [...COLLIDERS,{x:world.rover.pos.x,z:world.rover.pos.z,hx:1.5,hz:1.8,yaw:world.rover.yaw},
    ...Object.values(world.crew).map(p=>({x:p.x,z:p.z,r:0.4}))];
}

// Mutable per-frame world state (not React state)
export const world = {
  player: new THREE.Vector3(LUNAR_START[0], 0, LUNAR_START[1]),
  playerYaw: Math.PI + LUNAR_CAMERA_YAW,
  rover: { pos: new THREE.Vector3(9, 0, 17), yaw: 0, speed: 0 },
  crew: {
    maya: new THREE.Vector3(-9, 0, 2),
    leo: new THREE.Vector3(10, 0, 2),
    nova: new THREE.Vector3(-11, 0, 3),
    ari: new THREE.Vector3(-1, 0, 7),
  } as Record<CrewId, THREE.Vector3>,
};

export function resetWorld(px: number = LUNAR_START[0], pz: number = LUNAR_START[1]) {
  world.player.set(px, 0, pz);
  world.playerYaw = Math.PI + LUNAR_CAMERA_YAW;
  world.rover.pos.set(9, 0, 17);
  world.rover.yaw = 0;
  world.rover.speed = 0;
  world.crew.maya.set(-9, 0, 2);
  world.crew.leo.set(10, 0, 2);
  world.crew.nova.set(-11, 0, 3);
  world.crew.ari.set(-1, 0, 7);
}

export function targetPos(id: string): THREE.Vector3 | null {
  if (id in world.crew) return world.crew[id as CrewId];
  if (id === "rover") return world.rover.pos;
  const s = stationById[id];
  return s ? new THREE.Vector3(s.x, terrainHeight(s.x, s.z), s.z) : null;
}
