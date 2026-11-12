import {CameraControls} from "./CameraControls";
import {RoverMap} from "./RoverMap";
import {RoverSpeedDial} from "./RoverSpeedDial";
import {SampleCollection} from "./SampleCollection";
import {useCompact} from "../useCompact";
import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { TouchControls } from "./TouchControls";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MISSION_END_MIN, fmtClock, levelFor } from "../config";
import { audio } from "../audio";
import { MAX_MISSION_XP, OBJECTIVES, useGame, type ResKey } from "../store";
import { BASE_RADIUS, world } from "../world";
import { LunarWorld } from "../three/LunarWorld";
import { ActivityModal } from "./Activities";
import { GameButton, KeyCap, MusicToggle, useAudioSettings } from "./Button";
import { Handbook } from "./Handbook";
import { AdvancedOpsPanel } from "./AdvancedOpsPanel";

const RES: { k: ResKey; icon: string; label: string }[] = [
  { k: "life", icon: "🫁", label: "Life" },
  { k: "power", icon: "⚡", label: "Power" },
  { k: "safety", icon: "☢", label: "Safety" },
  { k: "food", icon: "🥬", label: "Food" },
  { k: "water", icon: "💧", label: "Water" },
];

export function LunarMission() {
  const s = useGame();
  const compact = useCompact();
  const { mission: m, activity, dialogue, prompt, paused, handbook, toast } = s;
  const [opsOpen, setOpsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    const tick = setInterval(() => { if (ready) useGame.getState().tick(0.1); }, 100);
    const save = setInterval(() => { const st = useGame.getState(); if (st.screen === "lunar") st.saveGame(); }, 8000);
    const alarm = setInterval(() => { const st = useGame.getState(); if (st.mission.emergency && !st.paused) audio.sfx("alarm"); }, 3000);
    const onKey = (e: KeyboardEvent) => {
      const st = useGame.getState();
      if (e.key === "Enter") {
        e.preventDefault();
        if (st.paused || st.activity || st.handbook || st.sampleView) return;
        if (st.dialogue) { st.nextDialogue(); return; }
        if (st.prompt) st.interact(st.prompt.id);
      } else if (e.key === "Escape") {
        if(st.sampleView) useGame.setState({sampleView:null});
        else if (st.handbook) st.setHandbook(false);
        else if (st.activity) st.openActivity(null);
        else if (st.dialogue) useGame.setState({ dialogue: null });
        else st.setPaused(!st.paused);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(tick); clearInterval(save); clearInterval(alarm); window.removeEventListener("keydown", onKey); };
  }, [ready]);

  useEffect(() => {
    if(!opsOpen && !tasksOpen) return;
    const wasPaused=useGame.getState().paused;
    useGame.getState().setPaused(true);
    return ()=>useGame.getState().setPaused(wasPaused);
  },[opsOpen,tasksOpen]);

  const lvl = levelFor(m.xp);
  const active = OBJECTIVES.filter((o) => !m.done.includes(o.id)).slice(0, 3);

  return (
    <div className={`fixed inset-0 game-world ${compact ? "compact-world" : ""}`}>
      <Canvas shadows={!compact} camera={{ position: [2, 7, 18], fov: 60, far: 1800 }} dpr={compact ? 1 : [1, 1.5]} style={{ touchAction: "none" }}>
        <Suspense fallback={null}><LunarWorld compact={compact} /><FirstFrame onReady={() => setReady(true)} /></Suspense>
      </Canvas>

      <div className={`pointer-events-none absolute inset-0 p-3 sm:p-4 ${activity?.kind==="earthPhoto"?"hidden":""}`}>
        {compact && <div className="mobile-hud">
          <div className="mobile-bar"><span className="font-mono">{fmtClock(m.time)}</span><button onClick={()=>setTasksOpen(true)}>Tasks {m.done.length}/16</button><button onClick={()=>setOpsOpen(true)}>Status</button><button aria-label="Open menu" onClick={()=>s.setPaused(true)}>☰</button></div>
          <button className={`mobile-target ${m.emergency ? "text-destructive" : "text-secondary"}`} onClick={()=>setTasksOpen(true)}>{m.emergency ? `⚠ ${m.emergency.title} · Details` : `◇ ${OBJECTIVES.find(o=>o.target===s.trackedTarget&&!m.done.includes(o.id))?.label ?? active[0]?.label ?? "Mission tasks complete"}`}</button>
        </div>}
        {/* top row */}
        <div className="desktop-hud mission-top flex items-start justify-between gap-3">
          <div className="panel px-4 py-2.5">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">MISSION</p>
            <p className="font-mono text-2xl font-bold leading-tight">{fmtClock(m.time)}</p>
            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${(m.time / MISSION_END_MIN) * 100}%` }} /></div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">finish tasks early · limit H27:00</p>
            <p className="mt-1 font-mono text-[9px] text-secondary">SHACKLETON RIM · LRO LOLA</p>
          </div>
          <div className="panel hidden gap-3 px-4 py-2.5 md:flex">
            {RES.map((r) => {
              const v = m.res[r.k];
              return (
                <div key={r.k} className="w-16">
                  <div className="flex items-center justify-between text-xs"><span>{r.icon}</span><span className={cn("font-mono font-bold", v < 30 ? "text-destructive" : v < 55 ? "text-warning" : "")}>{Math.round(v)}</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full transition-all", v < 30 ? "bg-destructive" : v < 55 ? "bg-warning" : "bg-secondary")} style={{ width: `${v}%` }} /></div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{r.label}</p>
                </div>
              );
            })}
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <MusicToggle />
              <button onClick={() => setOpsOpen(true)} className="rounded-full border border-secondary/40 bg-card/80 px-3 py-1.5 font-mono text-xs font-bold text-secondary transition hover:bg-secondary/10">OPS CONSOLE</button>
              <button onClick={() => s.setPaused(true)} className="rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-xs font-bold hover:bg-accent">ESC · MENU</button>
            </div>
            <div className="panel px-3 py-2 text-right">
              <p className="font-display text-sm">{s.custom.name} · <span className="text-primary">{lvl.name}</span></p>
              <p className="font-mono text-xs text-muted-foreground">{m.xp} / {MAX_MISSION_XP} XP</p>
              {m.badges.length > 0 && <p className="mt-1 text-xs">{m.badges.map((b) => "🏅").join("")}</p>}
            </div>
          </div>
        </div>

        {/* mobile resources */}
        <div className="desktop-hud panel mt-2 flex justify-between px-3 py-1.5 font-mono text-xs md:hidden">
          {RES.map((r) => <span key={r.k}>{r.icon}{Math.round(m.res[r.k])}</span>)}
        </div>

        {/* emergency banner */}
        {m.emergency && (
          <div className="desktop-hud mission-alert absolute left-1/2 top-28 w-[min(92vw,520px)] -translate-x-1/2">
            <div className="anim-alert rounded-2xl border-2 border-destructive bg-destructive/20 px-5 py-3 text-center backdrop-blur">
              <p className="font-mono text-xs font-bold tracking-[0.3em] text-destructive">⚠ ALERT</p>
              <p className="font-display text-xl font-bold">{m.emergency.title}</p>
              <p className="text-sm">{m.emergency.hint}</p>
              <p className="mt-1 text-xs text-muted-foreground">Follow the red marker ▾ · {Math.max(0,Math.ceil((180-(m.time-m.emergency.startedAt))/2))}s remaining</p>
            </div>
          </div>
        )}

        {/* objectives */}
        <div className="desktop-hud mission-objectives absolute left-3 top-32 w-64 sm:left-4">
          <div className="panel p-3">
            <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">OBJECTIVES</p><button className="pointer-events-auto mb-2 rounded border border-secondary px-3 py-2 text-xs text-secondary" onClick={()=>setTasksOpen(true)}>All 16 tasks · Earth photo 🌍</button>
            {active.map((o, i) => (
              <div key={o.id} className={cn("flex items-start gap-2 py-1 text-sm", i === 0 && !m.emergency && "text-secondary")}>
                <span>{i === 0 && !m.emergency ? "◆" : "◇"}</span><span>{o.label}</span>
              </div>
            ))}
            {active.length === 0 && <p className="text-sm text-muted-foreground">All tasks done! Finish any active alert to complete your mission.</p>}
            <p className="mt-2 border-t border-border pt-2 font-mono text-[11px] text-muted-foreground">🪨 samples {m.samples} · 🔬 science {Math.round(m.science)} · 🤝 crew {Math.round(m.crewStability)}</p>
            {m.inRover ? <p className="mt-1 text-xs text-warning">🚙 ↑ Go · ↓ Back · ← → Turn · Shift Brake</p> : m.evaReady ? <EvaStatus /> : null}
          </div>
        </div>

        {/* bottom: prompt + toast + controls */}
        <div className="game-prompts absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 px-4">
          {toast && <Toast key={toast.id} text={toast.text} tone={toast.tone} />}
          {prompt && !s.sampleView && !activity && !dialogue && !paused && (
            <button className="panel pointer-events-auto flex items-center gap-3 px-5 py-3 font-display text-base sm:text-lg anim-float" onClick={() => s.interact(prompt.id)}>
              <KeyCap>ENTER</KeyCap> {prompt.label}
            </button>
          )}
        </div>
        <div className="absolute bottom-4 left-4 hidden text-xs text-muted-foreground lg:block">
          <span className="panel flex items-center gap-2 px-3 py-2"><KeyCap>WASD</KeyCap> move <KeyCap>DRAG</KeyCap> look <KeyCap>SHIFT</KeyCap> {m.inRover?"brake":"run"} <KeyCap>ENTER</KeyCap> interact <KeyCap>ESC</KeyCap> menu</span>
        </div>

        {dialogue && (
          <div className="mission-dialogue pointer-events-auto absolute inset-x-0 bottom-6 mx-auto w-[min(94vw,640px)]">
            <button className="panel w-full p-5 text-left" onClick={() => s.nextDialogue()}>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: dialogue.accent }} />
                <span className="font-display text-lg font-bold">{dialogue.name}</span>
                <span className="text-xs text-muted-foreground">{dialogue.role}</span>
              </div>
              <p className="text-lg">{dialogue.lines[dialogue.idx]}</p>
              <p className="mt-2 text-right text-xs text-muted-foreground"><KeyCap>ENTER</KeyCap> {dialogue.idx + 1 < dialogue.lines.length ? "next" : "close"}</p>
            </button>
          </div>
        )}
      </div>

      {!activity&&!dialogue&&!paused&&!handbook&&!s.sampleView&&ready&&<><CameraControls/>{m.inRover&&<div className="rover-stack"><RoverMap defaultOpen={!compact}/><RoverSpeedDial/></div>}</>}
      {s.sampleView&&<SampleCollection key={s.sampleView}/>}
      <TouchControls driving={m.inRover} disabled={!!s.sampleView || !!activity || !!dialogue || paused || handbook || opsOpen || tasksOpen || !ready} />
      {!ready && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#070e20] p-6 text-center" role="status">
        <div className="max-w-md"><p className="text-secondary font-mono">MISSION27 · LUNAR ARRIVAL</p><h1 className="my-5 text-3xl font-bold">Preparing your Moon mission</h1><p>Loading Shackleton terrain, Earth imagery and base systems.</p><div className="my-5 h-2 rounded bg-white/10"><div className="h-full bg-secondary" style={{width:`${progress.progress}%`}} /></div><p>{progress.errors.length ? "Some assets could not load. Check your connection and reload." : "Your mission clock starts when the surface is ready."}</p><button className="mt-5 underline" onClick={()=>s.go("home")}>Return home</button></div>
      </div>}
      {tasksOpen && <div className="fixed inset-0 z-50 bg-background/95 p-5 overflow-y-auto"><div className="mx-auto max-w-xl"><button className="float-right p-3" onClick={()=>setTasksOpen(false)}>Close ✕</button><h2 className="text-2xl font-bold">Mission tasks</h2><button className="my-3 underline text-secondary" onClick={()=>{setTasksOpen(false);useGame.setState({sampleView:"all"});}}>Review collected samples</button>{m.emergency && <div className="my-3 rounded border border-destructive p-3"><strong>{m.emergency.title}</strong><p>{m.emergency.hint}</p><p>Follow the red marker. Response window: {Math.max(0,Math.ceil((180-(m.time-m.emergency.startedAt))/2))} seconds of active play remaining.</p></div>}<p className="my-3">Select a destination to guide the green marker. Emergency markers take priority. Complete suit checks before surface tasks.</p>{OBJECTIVES.map(o=><button key={o.id} disabled={m.done.includes(o.id)} className={`block w-full rounded border border-border p-3 my-2 text-left disabled:opacity-50 ${m.done.includes(o.id)?"line-through":""}`} onClick={()=>{useGame.setState({trackedTarget:o.target});setTasksOpen(false);s.showToast(`Destination: ${o.label}`);}}>{m.done.includes(o.id)?'✓':'◇'} {o.label} · {o.xp} XP</button>)}</div></div>}
      {activity && <ActivityModal activity={activity} onFinish={s.finishActivity} onClose={() => s.openActivity(null)} />}
      {paused && !handbook && !opsOpen && !tasksOpen && <PauseMenu />}
      {handbook && <Handbook onClose={() => s.setHandbook(false)} />}
      {opsOpen && <AdvancedOpsPanel mission={m} onClose={() => setOpsOpen(false)} />}
    </div>
  );
}

function EvaStatus() {
  const [out, setOut] = useState(false);
  useEffect(() => { const id = setInterval(() => setOut(Math.hypot(world.player.x, world.player.z) > BASE_RADIUS), 500); return () => clearInterval(id); }, []);
  return <p className={cn("mt-1 text-xs", out ? "text-warning" : "text-success")}>{out ? "🧑‍🚀 On EVA — suit nominal" : "✓ Suit ready for EVA"}</p>;
}

function Toast({ text, tone }: { text: string; tone: "info" | "good" | "bad" }) {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 4200); return () => clearTimeout(t); }, []);
  if (!show) return null;
  return (
    <div className={cn("panel max-w-xl px-4 py-2 text-center text-sm", tone === "good" && "border-success/60", tone === "bad" && "border-destructive/60")}>{text}</div>
  );
}

function PauseMenu() {
  const s = useGame();
  const a = useAudioSettings();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-sm p-6">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">PAUSED · {fmtClock(s.mission.time)}</p>
        <h2 className="mb-5 text-3xl font-bold">Mission Control</h2>
        <div className="flex flex-col gap-2">
          <GameButton variant="primary" onClick={() => s.setPaused(false)}>▶ Resume</GameButton>
          <GameButton variant="ghost" onClick={() => s.setHandbook(true)}>📘 Handbook</GameButton>
          {confirm ? (
            <div className="flex gap-2">
              <GameButton variant="ghost" className="flex-1" onClick={() => setConfirm(false)}>Cancel</GameButton>
              <GameButton variant="danger" className="flex-1" onClick={() => s.startMission()}>Restart</GameButton>
            </div>
          ) : <GameButton variant="ghost" onClick={() => setConfirm(true)}>↺ Restart mission</GameButton>}
          <GameButton variant="ghost" onClick={() => s.leaveToHome()}>⌂ Leave to Home (saves)</GameButton>
        </div>
        <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
          <label className="flex items-center justify-between gap-3">Music<input type="range" min={0} max={1} step={0.05} value={a.musicVol} onChange={(e) => audio.update({ musicVol: +e.target.value, music: true })} className="w-40 accent-[var(--primary)]" /></label>
          <label className="flex items-center justify-between gap-3">Sound effects<input type="range" min={0} max={1} step={0.05} value={a.sfxVol} onChange={(e) => audio.update({ sfxVol: +e.target.value, sfx: true })} className="w-40 accent-[var(--primary)]" /></label>
          <label className="flex items-center justify-between">Mute sound effects<input type="checkbox" checked={!a.sfx} onChange={(e) => audio.update({ sfx: !e.target.checked })} /></label>
        </div>
      </div>
    </div>
  );
}

function FirstFrame({onReady}:{onReady:()=>void}) {
  const [sent,setSent]=useState(false);
  useFrame(()=>{if(!sent){setSent(true);requestAnimationFrame(onReady);}});
  return null;
}
