import {useEffect,useState,useMemo} from 'react';
import {world,STATIONS} from '../world';
import {useGame,OBJECTIVES} from '../store';
import {terrainHeight} from '../nasa/terrain';
export const mapPoint=(x:number,z:number)=>({x:100+x,y:100+z});
export function RoverMap({defaultOpen=true}:{defaultOpen?:boolean}={}){
 const m=useGame(s=>s.mission);const [expanded,setExpanded]=useState(defaultOpen);const [,render]=useState(0);
 useEffect(()=>{const id=setInterval(()=>render(n=>n+1),150);return()=>clearInterval(id);},[]);
 const terrain=useMemo(()=>Array.from({length:400},(_,i)=>{const x=i%20*10-100,z=Math.floor(i/20)*10-100;return {x,z,h:terrainHeight(x,z)};}),[]);
 const p=mapPoint(world.rover.pos.x,world.rover.pos.z);
 return <div className={`rover-map ${expanded?'expanded':''}`}><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>Rover map {expanded?'−':'+'}</button>{expanded&&<>
 <svg viewBox="0 0 200 200" aria-label="Live map of game coordinates, north up" role="img">
 <rect width="200" height="200" fill="#091525"/>
 {terrain.map(({x,z,h},i)=>{return <rect key={i} x={x+100} y={z+100} width="10" height="10" fill={`hsl(195 12% ${Math.max(10,Math.min(50,24+h*2))}%)`}/>;})}
 <circle cx="100" cy="100" r="24" fill="none" stroke="#77889a"/>
 <text x="100" y="12" fill="white" textAnchor="middle" fontSize="9">N ↑</text>
 {STATIONS.filter(s=>s.id.startsWith('rock')||s.id==='earthview'||s.id==='airlock').map(s=>{const o=OBJECTIVES.find(o=>o.target===s.id),done=o&&m.done.includes(o.id);return <g key={s.id} onClick={()=>useGame.setState({trackedTarget:s.id})} role="button" tabIndex={0} aria-label={`Navigate to ${s.name}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')useGame.setState({trackedTarget:s.id});}}><circle cx={100+s.x} cy={100+s.z} r="9" fill={done?'#428476':'#ffd166'}/><text x={100+s.x} y={103+s.z} fill="#061321" textAnchor="middle" fontSize="8">{done?'✓':s.id==='earthview'?'E':s.id==='airlock'?'A':s.id.slice(-1)}</text></g>;})}
 <path d="M0,-6 L-4,5 L0,2 L4,5 Z" fill="#26efff" transform={`translate(${Math.max(5,Math.min(195,p.x))},${Math.max(5,Math.min(195,p.y))}) rotate(${180-world.rover.yaw*180/Math.PI})`}/>
 </svg><p>1–3 Samples · E Earth photo · A Airlock</p><p>Tap a site to track. Terrain: LOLA-derived; positions: game metres.</p>
 {Math.abs(world.rover.pos.x)>95||Math.abs(world.rover.pos.z)>95?<p>Outside map area — arrow clamped to edge.</p>:null}
 </>}</div>;
}
