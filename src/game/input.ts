export const keys = { up: false, down: false, left: false, right: false, run: false };

export const touchKeys = { up: false, down: false, left: false, right: false, run: false };
export function pressed(k: keyof typeof keys) { return keys[k] || touchKeys[k]; }
export function clearTouch() { for(const k of Object.keys(touchKeys) as (keyof typeof touchKeys)[]) touchKeys[k]=false; }
const map: Record<string, keyof typeof keys> = {
  KeyW: "up", ArrowUp: "up", KeyS: "down", ArrowDown: "down",
  KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right",
  ShiftLeft: "run", ShiftRight: "run",
};

let installed = false;
export function installInput() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("keydown", (e) => {
    const k = map[e.code];
    if (k) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      keys[k] = true;
      if (e.code.startsWith("Arrow")) e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    const k = map[e.code];
    if (k) keys[k] = false;
  });
  document.addEventListener("visibilitychange", () => {
    if(document.hidden){clearTouch();for(const k of Object.keys(keys) as (keyof typeof keys)[])keys[k]=false;}
  });
  window.addEventListener("blur", () => {
    clearTouch();
    (Object.keys(keys) as (keyof typeof keys)[]).forEach((k) => (keys[k] = false));
  });
}
