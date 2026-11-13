import {beforeEach,describe,it,expect,vi} from 'vitest';
vi.mock('./nasa/terrain',()=>({terrainHeight:()=>0,lolaReading:()=>({elevation:0,slope:0})}));
vi.mock('./audio',()=>({audio:{sfx:vi.fn(),setScene:vi.fn()}}));
import {useGame,OBJECTIVES} from './store';
import {EPIC_FRAMES} from './nasa/earth';
import sources from './nasa/sources.json';
import {WATER_RECOVERY,APOLLO_EVA_MINUTES,VEGGIE_LIGHT} from './nasa/operations';
beforeEach(()=>{localStorage.clear();useGame.getState().startMission();});
describe('mission audit',()=>{
 it('includes unique objectives and all fourteen source categories',()=>{expect(OBJECTIVES).toHaveLength(16);expect(new Set(OBJECTIVES.map(o=>o.id)).size).toBe(16);expect(sources).toHaveLength(14);});
 it('opens Earth photography and records the selected archive frame',()=>{expect(EPIC_FRAMES).toHaveLength(5);useGame.getState().interact('earthview');expect(useGame.getState().activity?.kind).toBe('earthPhoto');useGame.getState().finishActivity({frameIndex:0});expect(useGame.getState().mission.done).toContain('photo');expect(useGame.getState().mission.log.some(e=>e.did.includes(EPIC_FRAMES[0].identifier))).toBe(true);});
 it('does not grant supply food twice',()=>{useGame.getState().interact('storage');const food=useGame.getState().mission.res.food;useGame.getState().interact('storage');expect(useGame.getState().mission.res.food).toBe(food);});
 it('pauses simulation while viewing details',()=>{useGame.getState().setPaused(true);const time=useGame.getState().mission.time;useGame.getState().tick(1);expect(useGame.getState().mission.time).toBe(time);});
 it('retains the reference-derived numerical parameters',()=>{expect(WATER_RECOVERY).toBe(0.98);expect(APOLLO_EVA_MINUTES).toBe(432);expect(VEGGIE_LIGHT).toBe(200);});
});
