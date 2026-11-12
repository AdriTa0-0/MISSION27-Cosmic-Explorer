import {useEffect,useRef,useState} from 'react';
import {photoRig} from '../camera';
import {EARTH_ALTITUDE,EARTH_BEARING,EPIC_FRAMES} from '../nasa/earth';
import {audio} from '../audio';
export function EarthCamera({done,close}:{done:(r:Record<string,unknown>)=>void;close:()=>void}){
 const [,render]=useState(0);const [focus,setFocus]=useState(false);const [image,setImage]=useState('');const [message,setMessage]=useState('Aim at Earth, focus, then press the shutter.');
 const drag=useRef<{id:number;x:number;y:number}|null>(null);
 const focused=useRef(false);focused.current=focus;
 const delta=Math.atan2(Math.sin(EARTH_BEARING-photoRig.yaw),Math.cos(EARTH_BEARING-photoRig.yaw));
 const aligned=Math.abs(delta)<0.055&&Math.abs(photoRig.pitch-EARTH_ALTITUDE)<0.055;
 const exposureOK=Math.abs(photoRig.exposure)<=0.5;
 const capture=()=>{
  if(!aligned||!focus||!exposureOK){setMessage('Center Earth in the reticle, focus and balance exposure before capturing.');return;}
  try{const shot=photoRig.capture?.();if(shot){audio.sfx('photo');setImage(shot);setMessage('Photograph captured. Save it to complete the task.');}else setMessage('Camera is preparing. Try again.');}catch{setMessage('Could not capture the scene. Please retry.');}
 };
 const actions=useRef({capture});actions.current.capture=capture;
 useEffect(()=>{Object.assign(photoRig,{active:true,yaw:EARTH_BEARING+.32,pitch:.08,zoom:1,exposure:0});render(n=>n+1);
 const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement)?.tagName==='INPUT')return;
  if(e.code==='Space'){e.preventDefault();actions.current.capture();}
  if(e.code==='KeyZ'){setFocus(true);}
  const step=e.shiftKey?.008:.025;
  if(e.code==='ArrowLeft')photoRig.yaw-=step;
  if(e.code==='ArrowRight')photoRig.yaw+=step;
  if(e.code==='ArrowUp')photoRig.pitch=Math.min(1.4,photoRig.pitch+step);
  if(e.code==='ArrowDown')photoRig.pitch=Math.max(-.5,photoRig.pitch-step);
  if(e.code.startsWith('Arrow')){e.preventDefault();setFocus(false);render(n=>n+1);}
 };
 window.addEventListener('keydown',key);return()=>{photoRig.active=false;window.removeEventListener('keydown',key);};},[]);
 return <div className="earth-camera" role="dialog" aria-modal="true" aria-label="Earth camera viewfinder">
 <div className="camera-aim" onPointerDown={e=>{drag.current={id:e.pointerId,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;photoRig.yaw-=(e.clientX-d.x)*.004/photoRig.zoom;photoRig.pitch=Math.max(-.5,Math.min(1.4,photoRig.pitch+(e.clientY-d.y)*.004/photoRig.zoom));drag.current={id:d.id,x:e.clientX,y:e.clientY};setFocus(false);render(n=>n+1);}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} onLostPointerCapture={()=>drag.current=null}/>
 <header><span>FIELD CAMERA · {Math.round((photoRig.yaw*180/Math.PI+360)%360)}°</span><button onClick={close}>Exit ✕</button></header>
 {image?<img className="photo-preview" src={image} alt="Your captured Earth photograph from the simulated lunar surface"/>:<div className={`photo-reticle ${aligned?'aligned':''}`}><span>+</span><small>{aligned?'EARTH CENTERED':`EARTH ${Math.round(Math.abs(delta)*180/Math.PI)}° ${delta>0?'RIGHT':'LEFT'}`}</small></div>}
 <footer><p role="status">{message}</p><div className="photo-settings">
 <label>Zoom {photoRig.zoom.toFixed(1)}×<input aria-label="Photo zoom" type="range" min="1" max="4" step=".1" value={photoRig.zoom} onChange={e=>{photoRig.zoom=+e.target.value;setFocus(false);render(n=>n+1);}}/></label>
 <label>Exposure {photoRig.exposure.toFixed(1)} EV<input aria-label="Photo exposure" type="range" min="-2" max="2" step=".1" value={photoRig.exposure} onChange={e=>{photoRig.exposure=+e.target.value;render(n=>n+1);}}/></label>
 <button onClick={()=>setFocus(true)}>{focus?'✓ Focus locked':'Focus [Z]'}</button>
 {image?<><button onClick={()=>{setImage('');setMessage('Ready to retake.');}}>Retake</button><button onClick={()=>done({frameIndex:1,photoImage:image})}>Save photograph</button></>:<button onClick={capture}>● Shutter [Space]</button>}
 </div><small>Drag / arrows to aim · Green reticle = centered · {exposureOK?'Exposure balanced':'Adjust exposure'}<br/>Simulated lunar viewpoint using NASA EPIC-derived Earth imagery. EPIC observes from DSCOVR, not the Moon. <a href="https://epic.gsfc.nasa.gov/" target="_blank" rel="noreferrer">Source ↗</a></small></footer>
 </div>;
}
