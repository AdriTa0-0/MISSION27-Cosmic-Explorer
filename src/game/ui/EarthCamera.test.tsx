import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,fireEvent,screen,cleanup} from '@testing-library/react';
import {EarthCamera} from './EarthCamera';
import {photoRig} from '../camera';
vi.mock('../audio',()=>({audio:{sfx:vi.fn()}}));
afterEach(()=>{cleanup();photoRig.capture=null;});
describe('Earth viewfinder',()=>{
 it('rejects an off-center shutter and restores normal camera on close',()=>{const done=vi.fn();photoRig.capture=vi.fn(()=> 'data:image/jpeg;base64,test');const r=render(<EarthCamera done={done} close={()=>{}}/>);fireEvent.click(screen.getByText('● Shutter [Space]'));expect(photoRig.capture).not.toHaveBeenCalled();expect(done).not.toHaveBeenCalled();r.unmount();expect(photoRig.active).toBe(false);});
 it('requires aiming and focus, then saves the captured scene only after confirmation',()=>{const done=vi.fn();photoRig.capture=vi.fn(()=> 'data:image/jpeg;base64,test');render(<EarthCamera done={done} close={()=>{}}/>);for(let i=0;i<13;i++)fireEvent.keyDown(window,{code:'ArrowLeft'});for(let i=0;i<4;i++)fireEvent.keyDown(window,{code:'ArrowUp'});fireEvent.click(screen.getByText('Focus [Z]'));fireEvent.click(screen.getByText('● Shutter [Space]'));expect(photoRig.capture).toHaveBeenCalledTimes(1);expect(done).not.toHaveBeenCalled();fireEvent.click(screen.getByText('Save photograph'));expect(done).toHaveBeenCalledWith({frameIndex:1,photoImage:'data:image/jpeg;base64,test'});});
});
