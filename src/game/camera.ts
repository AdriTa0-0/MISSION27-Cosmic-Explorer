// Shared camera intent, read every frame without React renders.
export const cameraRig = { yaw: -0.43, elevation: 0.48, distance: 11, bird: false, followRover: true };
export const photoRig = { active: false, yaw: 0, pitch: 0.08, zoom: 1, exposure: 0,
  capture: null as null | (() => string) };
export function resetCamera() { Object.assign(cameraRig, {yaw:-0.43,elevation:0.48,distance:11,bird:false,followRover:true}); }
