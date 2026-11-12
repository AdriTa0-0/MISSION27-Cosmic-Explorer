import {beforeEach,describe,it,expect,vi} from 'vitest';
vi.mock('./nasa/terrain',()=>({terrainHeight:()=>0,lolaReading:()=>({elevation:0,slope:0})}));
vi.mock('./audio',()=>({audio:{sfx:vi.fn(),setScene:vi.fn()}}));
import {useGame,OBJECTIVES} from './store';
beforeEach(()=>{localStorage.clear();useGame.getState().startMission();});
function finishTasks(){for(const o of OBJECTIVES)useGame.getState().completeObjective(o.id);}
describe('mission pacing',()=>{
 it('finishes early without advancing the clock or firing a new alert',()=>{finishTasks();useGame.setState({mission:{...useGame.getState().mission,time:930}});useGame.getState().tick(.1);const s=useGame.getState();expect(s.screen).toBe('report');expect(s.mission.outcome?.success).toBe(true);expect(s.mission.time).toBe(930);expect(s.mission.emergency).toBeNull();expect(s.mission.log.at(-1)?.happened).toContain('All 16 tasks');});
 it('does not end while a task remains incomplete',()=>{for(const o of OBJECTIVES.slice(0,-1))useGame.getState().completeObjective(o.id);useGame.getState().tick(.1);expect(useGame.getState().screen).toBe('lunar');});
 it('requires the active alert to be resolved, then completes',()=>{finishTasks();useGame.setState({mission:{...useGame.getState().mission,emergency:{id:'conflict',title:'Crew conflict',hint:'Help',station:'maya',startedAt:0}}});useGame.getState().tick(.1);expect(useGame.getState().screen).toBe('lunar');useGame.getState().interact('maya');useGame.getState().finishActivity({choice:'listen'});useGame.getState().tick(.1);expect(useGame.getState().screen).toBe('report');expect(useGame.getState().mission.outcome?.success).toBe(true);});
 it('introduces crew cooperation after 30 active seconds',()=>{useGame.getState().tick(29);expect(useGame.getState().mission.emergency).toBeNull();useGame.getState().tick(1);expect(useGame.getState().mission.emergency?.id).toBe('conflict');});
 it('lets the player close sample details before displaying the final score',()=>{finishTasks();useGame.setState({sampleView:'rock3'});useGame.getState().tick(.1);expect(useGame.getState().screen).toBe('lunar');useGame.setState({sampleView:null});useGame.getState().tick(.1);expect(useGame.getState().screen).toBe('report');});
});
