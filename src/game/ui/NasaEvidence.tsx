import sources from "../nasa/sources.json";
import {lolaReading} from "../nasa/terrain";
import {solarTelemetry,WATER_RECOVERY} from "../nasa/operations";
import {world} from "../world";
export function NasaEvidence({time=0}:{time?:number}){
 const terrain=lolaReading(world.player.x,world.player.z),sun=solarTelemetry(time);
 return <section className="space-y-4" aria-label="NASA data evidence">
 <h2 className="text-xl font-bold">NASA Data &amp; Sources</h2>
 <p className="text-sm">You are exploring with real NASA science! See which spacecraft, experiments and records helped us build each activity. Some numbers come from archived observations; other parts are simplified learning models. This independent educational game is not endorsed by NASA.</p>
 <div className="rounded border border-secondary/40 p-3 text-sm"><strong>At your current location</strong><p>LOLA source elevation: {terrain.elevation.toFixed(1)} m · source slope: {terrain.slope.toFixed(1)}°</p><p>Simulated Sun elevation: {sun.elevation.toFixed(1)}° · local terrain horizon: {sun.horizon.toFixed(1)}° · {sun.directSun?'arrays illuminated':'arrays shadowed'}</p><p>ECLSS recovery model: {WATER_RECOVERY*100}% when powered, based on the ISS demonstration.</p></div>
 {sources.map(source=><article key={source.name} className="rounded-xl border border-border p-4"><p className="text-xs text-secondary">{source.kind}</p><h3 className="font-bold mt-1">{source.name}</h3><p className="my-2 text-sm"><strong>Try it:</strong> {source.where}</p><p className="text-sm text-muted-foreground">{source.effect}</p><div className="flex flex-wrap gap-3 mt-3">{source.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="underline text-secondary text-sm">Open {link.label} source ↗</a>)}</div></article>)}
 <p className="text-xs text-muted-foreground">Credits: LOLA terrain adapted from the supplied Shackleton DEM tiles (Barker et al.); EPIC images from DSCOVR; EMU model credited to NASA/Michael D. Carbajal; regolith textures from Poly Haven Moon 02 (CC0). Earth sky placement and scale are illustrative. Full asset provenance is included in docs/NASA_DATA.md.</p>
 </section>;
}
