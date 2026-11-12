import { render,fireEvent,cleanup } from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {TouchControls} from './TouchControls';
import {touchKeys,clearTouch} from '../input';
afterEach(()=>{cleanup();clearTouch();});
it('releases a held movement button when interrupted or disabled',()=>{
 const {getByLabelText,rerender}=render(<TouchControls/>);
 const up=getByLabelText('Move up'); up.setPointerCapture=()=>{};
 fireEvent.pointerDown(up,{pointerId:1});expect(touchKeys.up).toBe(true);
 fireEvent.pointerCancel(up,{pointerId:1});expect(touchKeys.up).toBe(false);
 fireEvent.pointerDown(up,{pointerId:1});rerender(<TouchControls disabled/>);expect(touchKeys.up).toBe(false);
});
it('supports movement plus run with two fingers',()=>{
 const {getByLabelText}=render(<TouchControls/>);
 const up=getByLabelText('Move up'),run=getByLabelText('Hold to run');
 up.setPointerCapture=run.setPointerCapture=()=>{};
 fireEvent.pointerDown(up,{pointerId:1});fireEvent.pointerDown(run,{pointerId:2});
 expect(touchKeys.up&&touchKeys.run).toBe(true);
 fireEvent.pointerUp(run,{pointerId:2});expect(touchKeys.up).toBe(true);expect(touchKeys.run).toBe(false);
});

it('labels rover controls and releases forward before accepting reverse',()=>{
 const {getByLabelText}=render(<TouchControls driving/>);
 const up=getByLabelText('Drive forward'),down=getByLabelText('Reverse slowly'),brake=getByLabelText('Hold to brake');
 up.setPointerCapture=down.setPointerCapture=brake.setPointerCapture=()=>{};
 fireEvent.pointerDown(up,{pointerId:1});expect(touchKeys.up).toBe(true);
 fireEvent.pointerUp(up,{pointerId:1});fireEvent.pointerDown(down,{pointerId:2});
 expect(touchKeys.up).toBe(false);expect(touchKeys.down).toBe(true);
 fireEvent.pointerCancel(down,{pointerId:2});expect(touchKeys.down).toBe(false);
 fireEvent.pointerDown(brake,{pointerId:3});expect(touchKeys.run).toBe(true);
 fireEvent.lostPointerCapture(brake,{pointerId:3});expect(touchKeys.run).toBe(false);
});
