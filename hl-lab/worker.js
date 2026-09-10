import {runBacktest} from './engine.js';
let meta,data;const ranks={};
self.onmessage=async({data:msg})=>{try{
 if(!meta){let r=await fetch('./data/manifest.json');if(!r.ok)throw Error('Could not load the data manifest.');meta=await r.json();data=new Float64Array(meta.hours*meta.symbols.length*7);
  let completed=0;await Promise.all(meta.chunks.map(async chunk=>{const res=await fetch('./data/'+chunk.file);if(!res.ok)throw Error('Could not load market history.');const raw=await new Response(res.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();data.set(new Float64Array(raw),chunk.offset*meta.symbols.length*7);self.postMessage({type:'progress',value:++completed/meta.chunks.length});}));}
 if(!ranks[msg.config.source]){const r=await fetch('./data/'+msg.config.source+'.json');if(!r.ok)throw Error('Could not load predictions.');ranks[msg.config.source]=await r.json();}
 self.postMessage({type:'result',result:runBacktest(meta,data,ranks[msg.config.source],msg.config)});
 }catch(e){self.postMessage({type:'error',message:e.message});}};
