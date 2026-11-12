import { describe,it,expect } from 'vitest';
import { moveWithCollisions,resolve,overlaps } from './collision';
describe('solid movement',()=>{
 it('stops a sprint crossing a thin wall',()=>{const p={x:-5,z:0};const c={x:0,z:0,hx:0.05,hz:3};moveWithCollisions(p,10,0,[c]);expect(p.x).toBeLessThan(-0.49);expect(overlaps(p,c)).toBe(false);});
 it('slides along a wall',()=>{const p={x:-1,z:-2};moveWithCollisions(p,2,2,[{x:0,z:0,hx:0.2,hz:5}]);expect(p.x).toBeLessThan(-0.64);expect(p.z).toBeGreaterThan(-0.1);});
 it('resolves the exact centre without NaN',()=>{for(const c of [{x:0,z:0,r:2},{x:0,z:0,hx:2,hz:1,yaw:0.7}]){const p={x:0,z:0};resolve(p,[c]);expect(Number.isFinite(p.x)).toBe(true);expect(overlaps(p,c)).toBe(false);}});
 it('blocks rotated rover bodies',()=>{const c={x:0,z:0,hx:1.5,hz:1.8,yaw:Math.PI/4};const p={x:-4,z:0};moveWithCollisions(p,4,0,[c]);expect(overlaps(p,c)).toBe(false);expect(p.x).toBeLessThan(-1);});
 it('uses the larger vehicle clearance',()=>{const p={x:-6,z:0};moveWithCollisions(p,10,0,[{x:0,z:0,r:1}],2.25);expect(p.x).toBeLessThan(-3.24);});
});
