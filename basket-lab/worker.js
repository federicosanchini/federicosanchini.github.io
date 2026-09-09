import {calculate} from './engine.js';
onmessage=({data})=>{try{postMessage({result:calculate(data)});}catch(e){postMessage({error:e.message});}};
