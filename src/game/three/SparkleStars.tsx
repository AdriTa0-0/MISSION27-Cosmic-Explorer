import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
export function SparkleStars(){
 const reduced=useRef(false);
 useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>{reduced.current=q.matches;};sync();q.addEventListener('change',sync);return()=>q.removeEventListener('change',sync);},[]);
 const geometry=useMemo(()=>{const g=new THREE.BufferGeometry(),pos=[],phase=[];let seed=72;const rand=()=>((seed=seed*16807%2147483647)/2147483647);for(let i=0;i<72;i++){const yaw=rand()*Math.PI*2,elevation=.15+rand()*1.3;pos.push(Math.sin(yaw)*Math.cos(elevation)*820,Math.sin(elevation)*820,-Math.cos(yaw)*Math.cos(elevation)*820);phase.push(rand()*Math.PI*2);}g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('phase',new THREE.Float32BufferAttribute(phase,1));return g;},[]);
 const material=useMemo(()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{time:{value:0}},vertexShader:`attribute float phase; uniform float time; varying float glow; void main(){glow=.78+.17*sin(time*.65+phase);gl_PointSize=7.+3.*glow;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying float glow; void main(){vec2 p=abs(gl_PointCoord-.5);float core=1.-smoothstep(0.,.32,length(p));float cross=(1.-smoothstep(0.,.045,min(p.x,p.y)))*(1.-smoothstep(.12,.5,max(p.x,p.y)));float alpha=max(core,cross*.55)*glow;gl_FragColor=vec4(.88,.95,1.,alpha);}`}),[]);
 useFrame(({clock})=>{material.uniforms['time'].value=reduced.current?0:clock.elapsedTime;});
 useEffect(()=>()=>{geometry.dispose();material.dispose();},[geometry,material]);
 return <points geometry={geometry} material={material} frustumCulled={false}/>;
}
