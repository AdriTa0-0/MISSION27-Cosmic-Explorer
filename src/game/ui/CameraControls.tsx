import {useState} from 'react';
import {useGame} from '../store';
import {cameraRig} from '../camera';
export function CameraControls(){
 const driving=useGame(s=>s.mission.inRover);
 const [open,setOpen]=useState(false);const [,refresh]=useState(0);
 const update=(fn:()=>void)=>{fn();refresh(n=>n+1);};
 return <div className="camera-controls"><button onClick={()=>setOpen(!open)} aria-expanded={open}>View ▾</button>{open&&<div className="camera-options">
 <label>Distance <input aria-label="Camera distance" type="range" min="6" max="28" step="0.5" value={cameraRig.distance} onChange={e=>update(()=>cameraRig.distance=+e.target.value)}/></label>
 <label>Angle <input aria-label="Camera elevation" type="range" min="0.2" max="1.45" step="0.01" value={cameraRig.elevation} onChange={e=>{cameraRig.bird=false;cameraRig.elevation=+e.target.value;refresh(n=>n+1);}}/></label>
 <button onClick={()=>update(()=>cameraRig.bird=!cameraRig.bird)}>{cameraRig.bird?'Return to chase view':'Bird’s-eye view'}</button>
 <button onClick={()=>update(()=>{cameraRig.distance=11;cameraRig.elevation=.48;cameraRig.bird=false;})}>Reset view</button>
 {driving&&<button onClick={()=>update(()=>{cameraRig.followRover=true;cameraRig.bird=false;})}>Follow behind rover</button>}
 <p>Drag the scene to rotate 360°. Scroll to zoom.</p></div>}</div>;
}
