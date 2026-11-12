import {useEffect,useState} from "react";
export function useCompact(){
 const [compact,setCompact]=useState(false);
 useEffect(()=>{const q=window.matchMedia('(max-width: 1023px), (max-height: 550px), (any-pointer: coarse)');const update=()=>setCompact(q.matches);update();q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 return compact;
}
