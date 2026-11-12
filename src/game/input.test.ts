import {it,expect} from 'vitest';
import {keys,touchKeys,pressed,clearTouch,installInput} from './input';
it('combines keyboard and touch without releasing the other source',()=>{keys.up=true;touchKeys.up=true;clearTouch();expect(pressed('up')).toBe(true);keys.up=false;expect(pressed('up')).toBe(false);});
it('clears held input on focus loss',()=>{installInput();keys.run=true;touchKeys.left=true;window.dispatchEvent(new Event('blur'));expect(pressed('run')).toBe(false);expect(pressed('left')).toBe(false);});
