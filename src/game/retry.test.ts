import {beforeEach,describe,it,expect,vi} from 'vitest';
vi.mock('./nasa/terrain',()=>({terrainHeight:()=>0,lolaReading:()=>({elevation:0,slope:0})}));
vi.mock('./audio',()=>({audio:{sfx:vi.fn(),setScene:vi.fn()}}));
import {useGame} from './store';
import {world} from './world';
import {MIN_PER_SEC,MISSION_END_MIN} from './config';
beforeEach(()=>{localStorage.clear();useGame.getState().startMission();});
function expire(){const m=useGame.getState().mission;useGame.setState({mission:{...m,time:200,emergency:{id:'power',title:'Power failure',hint:'Repair',station:'power',startedAt:0}}});useGame.getState().tick(1);}
describe('field update',()=>{
 it('provides 13.5 minutes of active mission time',()=>{expect(MISSION_END_MIN/MIN_PER_SEC).toBe(810);});
 it('aborts an overdue alert and restores position, completed tasks and score',()=>{world.player.set(32,0,28);useGame.getState().completeObjective('storage');const xp=useGame.getState().mission.xp;expire();expect(useGame.getState().screen).toBe('report');expect(useGame.getState().mission.outcome?.success).toBe(false);useGame.getState().retryMission();const s=useGame.getState();expect(s.screen).toBe('lunar');expect(s.mission.done).toContain('storage');expect(s.mission.xp).toBe(xp);expect(s.mission.emergency?.startedAt).toBe(s.mission.time);expect(world.player.x).toBe(32);expect(world.player.z).toBe(28);});
 it('enforces two retries, including after saving and continuing',()=>{expire();useGame.getState().retryMission();expire();useGame.getState().retryMission();expire();useGame.getState().go('home');useGame.getState().continueMission();expect(useGame.getState().screen).toBe('report');useGame.getState().retryMission();expect(useGame.getState().screen).toBe('report');expect(useGame.getState().mission.retriesUsed).toBe(2);});
 it('does not succeed with an unresolved emergency at the end',()=>{const m=useGame.getState().mission;useGame.setState({mission:{...m,time:MISSION_END_MIN-1,emergency:{id:'conflict',title:'Conflict',hint:'Talk',station:'maya',startedAt:MISSION_END_MIN-20}}});useGame.getState().tick(1);expect(useGame.getState().mission.outcome?.success).toBe(false);});
 it('pauses on sample details and does not award duplicate samples',()=>{useGame.getState().interact('rock1');expect(useGame.getState().sampleView).toBe('rock1');const m=useGame.getState().mission;useGame.getState().tick(10);expect(useGame.getState().mission.time).toBe(m.time);useGame.getState().interact('rock1');expect(useGame.getState().mission.samples).toBe(1);expect(useGame.getState().mission.xp).toBe(m.xp);});
});
