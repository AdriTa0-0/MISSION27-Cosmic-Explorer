export const ROVER_FORWARD_SPEED = 8;
export const ROVER_REVERSE_SPEED = 3.2;
/** Speed the safety assist slows the rover to when high-risk driving becomes unsafe. */
export const ROVER_SAFE_SPEED = 6;
export const ROVER_DEFAULT_THROTTLE = 0.65;
export type SpeedRisk = "safe" | "caution" | "high";
/** Dial setting (0.2–1) → learning tier: Safe 20–65%, Caution 66–85%, High Risk 86–100%. */
export function speedRisk(setting:number):SpeedRisk{const p=Math.round(setting*100);return p<=65?"safe":p<=85?"caution":"high";}
/** True when the requested speed is in the High Risk band, or fast on a steep slope. */
export function roverRisk(speed:number,grade:number){return Math.abs(speed)>ROVER_FORWARD_SPEED*.855 || (Math.abs(speed)>4 && Math.abs(grade)>.38);}
// The dial sets the maximum possible rover speed, not an instant speed jump.
// High-risk speed while turning or on a slope is automatically reduced; it never fails the mission.
export function updateRoverDrive(speed:number,yaw:number,throttle:number,steer:number,brake:boolean,dt:number,grade=0,setting=ROVER_DEFAULT_THROTTLE){
 const step=Math.max(0,Math.min(dt,.05));
 const dial=Math.max(.2,Math.min(1,Number.isFinite(setting)?setting:ROVER_DEFAULT_THROTTLE));
 const pace=1/(1+Math.min(1,Math.max(0,Math.abs(grade))));
 const changingDirection=speed*throttle<0;
 const requested=throttle*(throttle>=0?ROVER_FORWARD_SPEED:ROVER_REVERSE_SPEED)*dial*pace;
 const unsafe=roverRisk(requested,grade)&&(steer!==0||Math.abs(grade)>.25);
 const target=brake||changingDirection?0:unsafe?Math.sign(requested)*Math.min(ROVER_SAFE_SPEED,Math.abs(requested)):requested;
 const rate=brake||changingDirection||throttle===0?11:6;
 const next=speed+Math.sign(target-speed)*Math.min(Math.abs(target-speed),rate*step);
 return {speed:Math.abs(next)<.01?0:next,yaw:yaw+(brake?0:steer*(.8+Math.min(Math.abs(next),6)*.07)*step)};
}
