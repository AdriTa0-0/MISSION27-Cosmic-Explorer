import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';
import {world} from '../world';
import {useGame} from '../store';
import {Astronaut} from './Astronaut';

// Six-wheel lunar exploration rover: no face, cartoon eyes, smile or toy bonnet.
// Forward is +Z, matching the existing lunar driving and camera systems.
export function FriendlyRover({occupied}:{occupied:boolean}) {
 const wheelRefs=useRef<THREE.Group[]>([]);
 const accent=useGame(s=>s.custom.accent);
 useFrame((_,dt)=>{for(const wheel of wheelRefs.current)if(wheel)wheel.rotation.x+=world.rover.speed*Math.min(dt,.05)/.46;});
 return <group>
  {/* Lightweight rugged platform with a ground clearance and dark undercarriage */}
  <RoundedBox args={[2.25,.24,3.1]} radius={.1} smoothness={3} position={[0,1.05,0]} castShadow receiveShadow><meshStandardMaterial color="#c6d5df" metalness={.45} roughness={.52}/></RoundedBox>
  <RoundedBox args={[1.9,.24,2.6]} radius={.07} position={[0,1.23,0]} castShadow><meshStandardMaterial color="#edf1ed" metalness={.25} roughness={.66}/></RoundedBox>
  <RoundedBox args={[1.55,.12,.7]} radius={.04} position={[0,1.39,1.03]} castShadow><meshStandardMaterial color="#b27e38" metalness={.7} roughness={.4}/></RoundedBox>
  <mesh position={[0,1.2,1.66]}><boxGeometry args={[1.65,.22,.12]}/><meshStandardMaterial color="#3f5265" metalness={.6}/></mesh>
  {/* Equipment, batteries and raised antenna instead of a smiling toy grille */}
  {[-.68,.68].map(x=><group key={x} position={[x,1.58,-.58]}><RoundedBox args={[.56,.56,1.15]} radius={.08} castShadow><meshStandardMaterial color="#e1e6df" metalness={.32} roughness={.56}/></RoundedBox><mesh position={[0,.3,0]}><boxGeometry args={[.42,.06,.82]}/><meshStandardMaterial color="#314d60"/></mesh></group>)}
  <group position={[0,1.55,.17]}><mesh><cylinderGeometry args={[.075,.09,.56,10]}/><meshStandardMaterial color="#707f8b" metalness={.6}/></mesh><mesh position={[0,.34,0]}><sphereGeometry args={[.18,16,12]}/><meshStandardMaterial color="#263c50" metalness={.5}/></mesh><mesh position={[0,.34,.15]}><circleGeometry args={[.08,16]}/><meshStandardMaterial color="#55b9d0" emissive="#12414d" emissiveIntensity={.3}/></mesh></group>
  <mesh position={[.91,2.05,-1.18]}><cylinderGeometry args={[.026,.035,1.6,8]}/><meshStandardMaterial color="#b9c9d2" metalness={.7}/></mesh>
  <mesh position={[.91,2.84,-1.18]}><sphereGeometry args={[.11,12,10]}/><meshStandardMaterial color="#e9be68" emissive="#bd7a1d" emissiveIntensity={.4}/></mesh>
  {/* Antenna base collar and camera mast plate bolt the masts onto the deck */}
  <mesh position={[.91,1.4,-1.18]}><cylinderGeometry args={[.09,.11,.1,12]}/><meshStandardMaterial color="#707f8b" metalness={.6}/></mesh>
  <mesh position={[0,1.37,.17]}><cylinderGeometry args={[.16,.18,.05,14]}/><meshStandardMaterial color="#707f8b" metalness={.6}/></mesh>
  {/* Solar panel on a support post and hinge above the rear-left equipment box */}
  <group position={[-.68,1.91,-.58]}>
   <mesh position={[0,.08,0]}><cylinderGeometry args={[.05,.07,.16,10]}/><meshStandardMaterial color="#9aa8b2" metalness={.7}/></mesh>
   <mesh position={[0,.18,0]}><boxGeometry args={[.22,.07,.14]}/><meshStandardMaterial color="#6b7a86" metalness={.65}/></mesh>
   <group position={[0,.24,0]} rotation={[0,0,-.21]}>
    <mesh castShadow><boxGeometry args={[1.0,.05,.7]}/><meshStandardMaterial color="#c8d2d8" metalness={.75} roughness={.35}/></mesh>
    <mesh position={[0,.03,0]}><boxGeometry args={[.95,.02,.65]}/><meshStandardMaterial color="#203f6b" metalness={.3} roughness={.35}/></mesh>
   </group>
  </group>
  {[-1.06,0,1.06].flatMap((z,i)=>[-1,1].map((side)=>{
   const x=side*1.32;
   return <group key={`${side}-${i}`}>
    <mesh position={[side*1.2,.77,z]} rotation={[0,0,side*.38]}><cylinderGeometry args={[.075,.075,.6,8]}/><meshStandardMaterial color="#84949f" metalness={.6}/></mesh>
    <mesh position={[x,.68,z]}><boxGeometry args={[.22,.12,.22]}/><meshStandardMaterial color="#647481"/></mesh>
    <group position={[x,.47,z]} ref={el=>{if(el)wheelRefs.current[i*2+(side+1)/2]=el;}}>
     <mesh rotation-z={Math.PI/2} castShadow><cylinderGeometry args={[.46,.46,.29,24]}/><meshStandardMaterial color="#202a33" roughness={.93}/></mesh>
     <mesh rotation-z={Math.PI/2}><cylinderGeometry args={[.22,.22,.3,16]}/><meshStandardMaterial color="#a4b2b9" metalness={.7} roughness={.42}/></mesh>
     {Array.from({length:12},(_,k)=><mesh key={k} rotation={[k*Math.PI/6,0,0]} position={[0,.445*Math.sin(k*Math.PI/6),.445*Math.cos(k*Math.PI/6)]}><boxGeometry args={[.31,.075,.14]}/><meshStandardMaterial color="#36424b" roughness={.85}/></mesh>)}
    </group>
   </group>;
  }))}
  {/* Practical navigation LEDs */}
  {[-.72,.72].map(x=><mesh key={x} position={[x,1.13,1.64]}><boxGeometry args={[.2,.09,.05]}/><meshStandardMaterial color="#ebf2d5" emissive="#a5b77b" emissiveIntensity={.45}/></mesh>)}
  {occupied&&<group position={[0,1.52,-.16]} scale={.47}><Astronaut accent={accent} motion={{current:{speed:0,wave:0,work:0,alert:0}}}/></group>}
 </group>;
}
