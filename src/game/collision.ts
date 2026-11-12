export type Obstacle = { x: number; z: number; r: number } | { x: number; z: number; hx: number; hz: number; yaw?: number };
export type Position = { x: number; z: number };
export function overlaps(p: Position, c: Obstacle, radius = 0.45) {
  if ('r' in c) return Math.hypot(p.x-c.x, p.z-c.z) < c.r+radius;
  const a=c.yaw ?? 0, dx=p.x-c.x, dz=p.z-c.z;
  const x=dx*Math.cos(a)-dz*Math.sin(a), z=dx*Math.sin(a)+dz*Math.cos(a);
  return Math.hypot(Math.max(0,Math.abs(x)-c.hx),Math.max(0,Math.abs(z)-c.hz)) < radius;
}
export function resolve(p: Position, obstacles: readonly Obstacle[], radius = 0.45) {
  for (let pass=0;pass<8;pass++) {
    let changed=false;
    for (const c of obstacles) {
      if (!overlaps(p,c,radius)) continue;
      changed=true;
      if ('r' in c) {
        const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),r=c.r+radius+0.0001;
        p.x=c.x+(d>1e-8?dx/d:1)*r; p.z=c.z+(d>1e-8?dz/d:0)*r;
      } else {
        const a=c.yaw??0,co=Math.cos(a),si=Math.sin(a),dx=p.x-c.x,dz=p.z-c.z;
        let x=dx*co-dz*si,z=dx*si+dz*co;
        const qx=Math.max(-c.hx,Math.min(c.hx,x)),qz=Math.max(-c.hz,Math.min(c.hz,z));
        const vx=x-qx,vz=z-qz,d=Math.hypot(vx,vz);
        if(d>1e-8){x=qx+vx/d*(radius+0.0001);z=qz+vz/d*(radius+0.0001);}
        else if(c.hx-Math.abs(x)<c.hz-Math.abs(z)) x=(x<0?-1:1)*(c.hx+radius+0.0001);
        else z=(z<0?-1:1)*(c.hz+radius+0.0001);
        p.x=c.x+x*co+z*si;p.z=c.z-x*si+z*co;
      }
    }
    if(!changed) break;
  }
}
// Small substeps prevent crossing thin objects during a long frame or rover sprint.
export function moveWithCollisions(p: Position, dx: number, dz: number, obstacles: readonly Obstacle[], radius=0.45) {
  const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/0.15));
  for(let i=0;i<steps;i++){p.x+=dx/steps;p.z+=dz/steps;resolve(p,obstacles,radius);}
}
