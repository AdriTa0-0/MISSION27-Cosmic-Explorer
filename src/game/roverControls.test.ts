import {describe,it,expect} from 'vitest';
import {updateRoverDrive} from './roverControls';
function drive(speed:number,throttle:number,seconds:number,brake=false){for(let i=0;i<seconds*60;i++)speed=updateRoverDrive(speed,0,throttle,0,brake,1/60).speed;return speed;}
describe('gentle rover controls',()=>{
 it('uses safe default speed, reverse and brakes',()=>{expect(drive(0,1,5)).toBeCloseTo(5.2);expect(drive(0,-1,5)).toBeCloseTo(-2.08);expect(drive(4,1,1,true)).toBe(0);});
 it('brakes before changing direction instead of drifting forward for seconds',()=>{const first=updateRoverDrive(4,0,-1,0,false,.05);expect(first.speed).toBeLessThan(4);expect(first.speed).toBeGreaterThanOrEqual(0);expect(drive(4,-1,1)).toBeLessThan(0);});
 it('stops promptly when controls are released',()=>{expect(drive(4,0,.5)).toBe(0);expect(drive(-2,0,.5)).toBe(0);});
 it('turns consistently in forward, reverse and at rest',()=>{for(const speed of [4,0,-2]){expect(updateRoverDrive(speed,0,0,1,false,.05).yaw).toBeGreaterThan(0);expect(updateRoverDrive(speed,0,0,-1,false,.05).yaw).toBeLessThan(0);}});
 it('gently accelerates and does not move during a zero time step',()=>{expect(updateRoverDrive(0,0,1,0,false,.05).speed).toBeCloseTo(.3);expect(updateRoverDrive(0,0,1,1,false,0)).toEqual({speed:0,yaw:0});});
});
