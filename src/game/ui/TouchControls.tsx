import { useEffect } from "react";
import { clearTouch, touchKeys } from "../input";
export function TouchControls({ disabled=false, driving=false }: {disabled?:boolean;driving?:boolean}) {
  useEffect(()=>{clearTouch();return clearTouch;},[disabled,driving]);
  if(disabled)return null;
  return <div className="touch-controls" aria-label="Touch movement controls">
    <div className="touch-pad">{([
      ['up','▲',2],['left','◀',4],['down','▼',5],['right','▶',6],
    ] as const).map(([key,label,cell])=><button key={key} aria-label={driving?({up:"Drive forward",down:"Reverse slowly",left:"Turn left",right:"Turn right"}[key]):`Move ${key}`} style={{gridArea:`${Math.ceil(cell/3)} / ${(cell-1)%3+1}`}}
      onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.dataset["pressed"]="true";touchKeys[key]=true;}}
      onPointerUp={e=>{e.currentTarget.dataset["pressed"]="false";touchKeys[key]=false;}} onPointerCancel={e=>{e.currentTarget.dataset["pressed"]="false";touchKeys[key]=false;}} onLostPointerCapture={e=>{e.currentTarget.dataset["pressed"]="false";touchKeys[key]=false;}}><span>{label}</span>{driving&&<small>{({up:"GO",down:"BACK",left:"LEFT",right:"RIGHT"}[key])}</small>}</button>)}</div>
    <div className="touch-run"><span>Drag scene to look</span><button aria-label={driving?"Hold to brake":"Hold to run"}
      onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.dataset["pressed"]="true";touchKeys.run=true;}}
      onPointerUp={e=>{e.currentTarget.dataset["pressed"]="false";touchKeys.run=false;}} onPointerCancel={e=>{e.currentTarget.dataset["pressed"]="false";touchKeys.run=false;}} onLostPointerCapture={e=>{e.currentTarget.dataset["pressed"]="false";touchKeys.run=false;}}>{driving?"STOP":"RUN"}</button></div>
  </div>;
}
