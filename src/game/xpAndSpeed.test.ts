import {describe,it,expect,beforeEach} from 'vitest';
import {OBJECTIVES,EMERGENCY_XP,MAX_MISSION_XP,repairMissionXp,useGame,newMission} from './store';
import {speedRisk,updateRoverDrive,ROVER_SAFE_SPEED} from './roverControls';
describe('XP',()=>{
 beforeEach(()=>useGame.setState({mission:newMission()}));
 it('perfect run totals exactly 800',()=>{const t=OBJECTIVES.reduce((a,o)=>a+o.xp,0)+Object.values(EMERGENCY_XP).reduce((a,e)=>a+e.best,0);expect(t).toBe(800);expect(MAX_MISSION_XP).toBe(800);});
 it('each task pays once',()=>{const g=useGame.getState();g.completeObjective('talk-ari');g.completeObjective('talk-ari');expect(useGame.getState().mission.xp).toBe(20);});
 it('addXp cannot inflate the score',()=>{useGame.getState().addXp(500);expect(useGame.getState().mission.xp).toBe(0);});
 it('old 980 XP saves are recalculated',()=>{const done=OBJECTIVES.map(o=>o.id);expect(repairMissionXp({xp:980,done,log:[]}).xp).toBe(530);
  expect(repairMissionXp({xp:980,awarded:{'obj:talk-ari':999,'em:leak':80,'bogus':300}}).xp).toBe(70);});
});
describe('speed risk',()=>{
 it('tiers',()=>{expect(speedRisk(.2)).toBe('safe');expect(speedRisk(.65)).toBe('safe');expect(speedRisk(.66)).toBe('caution');expect(speedRisk(.85)).toBe('caution');expect(speedRisk(.86)).toBe('high');expect(speedRisk(1)).toBe('high');});
 const run=(setting:number,steer:number)=>{let v=0;for(let i=0;i<300;i++)v=updateRoverDrive(v,0,1,steer,false,1/60,0,setting).speed;return v;};
 it('full speed straight, assist slows when turning at high risk',()=>{expect(run(1,0)).toBeCloseTo(8);expect(run(1,1)).toBeCloseTo(ROVER_SAFE_SPEED);expect(run(.65,1)).toBeCloseTo(5.2);});
});
