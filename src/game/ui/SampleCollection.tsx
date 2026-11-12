import {useState} from 'react';
import {useGame} from '../store';
import records from '../../../public/reference-assets/data/samples.json';
const field:Record<string,{title:string;detail:string}>={
 rock1:{title:'Basalt field sample',detail:'Basalt forms when lava cools. Compare your simulated volcanic sample with the archived Apollo breccias below: breccias are assembled fragments rather than one cooled lava body.'},
 rock2:{title:'Highland field sample',detail:'Anorthosite is rich in plagioclase feldspar. Compare your simulated highland sample with the regolith photographs below: regolith is loose surface material, not one solid highland rock.'},
 rock3:{title:'Breccia field sample',detail:'Breccias contain fragments joined together by impact processes. Apollo 10026 provides a historical regolith-breccia comparison.'}
};
const groups:Record<string,number[]>={rock1:[0,1],rock2:[2,3],rock3:[4]};
const sources=[
 'https://www.lpi.usra.edu/lunar/samples/atlas/compendium/10009.pdf',
 'https://data.nasa.gov/dataset/lunar-sample-atlas',
 'https://science.nasa.gov/moon/image-galleries/views-from-the-lunar-surface/',
 'https://science.nasa.gov/biological-physical/what-is-lunar-regolith/',
 'https://www.lpi.usra.edu/lunar/samples/atlas/compendium/10026.pdf',
];
export function SampleCollection(){
 const s=useGame();const [page,setPage]=useState(0);
 const available=s.sampleView==='all'?Object.entries(groups).filter(([k])=>s.mission.done.includes('sample'+k.slice(-1))).flatMap(([,v])=>v):groups[s.sampleView??'']??[];
 const i=available[Math.min(page,Math.max(0,available.length-1))],r=records[i];
 return <div className="science-modal" role="dialog" aria-modal="true" aria-label="Sample collection"><section>
 <header><h2>Sample analysis</h2><button onClick={()=>useGame.setState({sampleView:null})}>Close ✕</button></header>
 {!r?<p>Collect a sample on the surface to unlock the reference collection.</p>:<>
 <img src={r.image.replace('/assets/','/reference-assets/')} alt={r.alt}/>
 {s.sampleView!=="all"&&field[s.sampleView??""]&&<div><h3>{field[s.sampleView!].title}</h3><p>{field[s.sampleView!].detail}</p></div>}
 <h3>Archive reference: {r.title}</h3><p className="text-secondary">Collected sites: {s.mission.done.filter(x=>/^sample[123]$/.test(x)).length}/3 · Reference {Math.min(page+1,available.length)}/{available.length}</p>
 <p>{r.text}</p><p>Archive label: {r.sampleId} · {r.mission}</p>
 <p className="text-sm text-muted-foreground">Historical Apollo reference supplied with the project, compared with your simulated field sample. This is not a photograph from Shackleton. {i===0||i===4?'The numbered archive rock is a breccia.':'Exact photo identifier has not been independently confirmed.'}</p>
 <a href={sources[i]} target="_blank" rel="noreferrer" className="text-secondary underline">NASA / Lunar Sample Atlas reference ↗</a>
 <footer><button disabled={page===0} onClick={()=>setPage(p=>p-1)}>Previous</button><button disabled={page>=available.length-1} onClick={()=>setPage(p=>p+1)}>Next reference</button></footer>
 </>}</section></div>;
}
