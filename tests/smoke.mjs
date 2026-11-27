import { readFileSync } from 'node:fs';

function smoke(html){
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const elements=new Map(),defaults={wave:"all",channel:"all",mSample:"80",mTarget:"40",mN:"600",mWave:"4",mOutcome:"productSatisfied",mChannel:"all",segK:"4"};
 function el(id){if(!ids.has(id)&&id!=="backHub")throw Error("Missing DOM element: "+id);if(!elements.has(id))elements.set(id,{value:defaults[id]||"",innerHTML:"",textContent:"",handlers:{},hidden:false,addEventListener(k,fn){this.handlers[k]=fn},classList:{toggle(){}},setAttribute(){},removeAttribute(){},focus(){}});return elements.get(id)}
 const document={getElementById:el,querySelectorAll:()=>[]};
 return new Function("document","location","history",script+`
 const assert=(cond,msg)=>{if(!cond)throw Error(msg)};
 assert(survey.length===2400,"Survey size");
 assert(survey.every(r=>r.needs.length===6&&r.needs.every(v=>Number.isInteger(v)&&v>=1&&v<=7)),"Needs scale");
 const original=JSON.stringify(survey);
 navigate(1);
 assert($('mWeights').innerHTML.includes('76.0%')&&$('mWeights').innerHTML.includes('68.0%')&&$('mWeights').innerHTML.includes('300'),"Calibration example");
 navigate(2);
 assert(segmentResult.models.length===5,"Candidate count");
 assert(segmentResult.variance.every(v=>v>0&&v<1)&&segmentResult.variance.reduce((a,b)=>a+b,0)<=1,"PCA variance");
 const summaries=[];
 for(const m of segmentResult.models){
  assert(m.labels.length===survey.length&&m.counts.reduce((a,b)=>a+b,0)===survey.length&&m.counts.every(n=>n>0),"Membership accounting");
  assert(m.labels.every(x=>Number.isInteger(x)&&x>=0&&x<m.k),"Membership range");
  assert(Number.isFinite(m.wcss)&&m.wcss>0&&m.silhouette>=-1&&m.silhouette<=1&&m.stability>=-1&&m.stability<=1,"Metrics");
  $('segK').value=String(m.k);renderSegments();
  assert(!$('segPlot').innerHTML.includes('NaN')&&$('segProfiles').innerHTML.includes('C'+m.k+'</th>'),"Profile and plot");
  summaries.push({k:m.k,counts:m.counts,silhouette:m.silhouette,stability:m.stability,profiles:$('segCards').innerHTML});
 }
 assert(JSON.stringify(survey)===original,"Analysis mutated synthetic data");
 $('segReset').handlers.click();
 assert(Number($('segK').value)===segmentResult.defaultK,"Reset model");
 for(let i=0;i<6;i++)navigate(i);
 return {suggestedK:segmentResult.recommend,variance:segmentResult.variance,summaries};
 `)(document,{hash:"#module-1"},{replaceState(){}});
}

const result = smoke(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
console.log('Smoke test passed; suggested k =', result.suggestedK);
console.table(result.summaries.map(({profiles,...summary})=>summary));
