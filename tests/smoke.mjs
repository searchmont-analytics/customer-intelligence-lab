import { readFileSync } from 'node:fs';

function smoke(html){
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const elements=new Map(),defaults={wave:"all",channel:"all",mSample:"80",mTarget:"40",mN:"600",mWave:"4",mOutcome:"productSatisfied",mChannel:"all",segK:"4",vocWave:"all",vocChannel:"all",vocThreshold:"50"};
 function el(id){if(!ids.has(id)&&id!=="backHub"&&!/^vocReview-(unclearInfo|navigation|support|accessibility|controls)$/.test(id))throw Error("Missing DOM element: "+id);if(!elements.has(id))elements.set(id,{value:defaults[id]||"",innerHTML:"",textContent:"",checked:false,handlers:{},hidden:false,addEventListener(k,fn){this.handlers[k]=fn},classList:{toggle(){}},setAttribute(){},removeAttribute(){},focus(){}});return elements.get(id)}
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

 navigate(3);
 assert(vocState.journeys.length===survey.length,"Journey accounting");
 const allIds=new Set(survey.map(r=>r.id));
 assert(new Set(vocState.journeys.map(j=>j.id)).size===survey.length&&vocState.journeys.every(j=>allIds.has(j.id)),"Journey linkage");
 assert(vocState.feedback.length>300&&vocState.feedback.length<survey.length,"Feedback response subset");
 assert(new Set(vocState.feedback.map(f=>f.id)).size===vocState.feedback.length&&vocState.feedback.every(f=>allIds.has(f.respondentId)),"Feedback linkage");
 assert(vocState.feedback.every(f=>VOC_THEMES.every(t=>Number.isFinite(f.prediction.scores[t.key])&&f.prediction.scores[t.key]>=0&&f.prediction.scores[t.key]<=1)),"ML scores");
 const validation=vocValidate(vocState.feedback,.5);
 assert($('vocGate').textContent.includes('NOT READY')&&$('vocBrief').textContent.includes('Model quality warning'),"Default quality gate and executive warning");
 assert(validation.byTheme.every(m=>m.tp+m.fp+m.fn+m.tn===vocState.feedback.length),"Confusion accounting");
 assert([validation.micro,validation.exact,validation.accuracy].every(v=>Number.isFinite(v)&&v>=0&&v<=1),"Validation metrics");
 const low=vocState.feedback.reduce((s,f)=>s+vocLabels(f,.25).length,0),high=vocState.feedback.reduce((s,f)=>s+vocLabels(f,.85).length,0);
 assert(low>=high,"Threshold monotonicity");
 for(const wave of ["all","1","2","3","4"])for(const channel of ["all","Digital","Retail"]){$('vocWave').value=wave;$('vocChannel').value=channel;vocRender();assert(!$('vocTriangulation').innerHTML.includes('NaN')&&$('vocThemes').innerHTML.includes('Navigation'),"Voice filters")}
 $('vocReset').handlers.click();
 $('vocReviewSelect').value=vocState.queue[0];vocRenderReview(true);
 assert($('vocReviewCompare').textContent.includes('hidden'),"Blind review");
 $('vocReview-navigation').checked=true;$('vocReviewSave').handlers.click();
 assert(vocState.reviews.get(vocState.queue[0]).includes('navigation')&&$('vocReviewCompare').textContent.includes('Your codes'),"Review save");
 $('vocReviewNext').handlers.click();assert($('vocReviewSelect').value===vocState.queue[1],"Review next");
 const vocSummary={feedback:vocState.feedback.length,journeys:vocState.journeys.length,training:vocState.model.size,microF1:validation.micro,exact:validation.exact,toneAccuracy:validation.accuracy,byTheme:validation.byTheme,themeCounts:VOC_THEMES.map(t=>({name:t.name,count:vocState.feedback.filter(f=>f.prediction.scores[t.key]>=.5).length})),noncompletion:vocState.journeys.filter(j=>!j.completed).length};
 assert(JSON.stringify(survey)===original,"Voice module mutated survey");
 for(let i=0;i<6;i++)navigate(i);
 return {suggestedK:segmentResult.recommend,variance:segmentResult.variance,summaries,vocSummary};
 `)(document,{hash:"#module-1"},{replaceState(){}});
}

const result = smoke(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
console.log('Smoke test passed; suggested k =', result.suggestedK);
console.table(result.summaries.map(({profiles,...summary})=>summary));
console.log('Voice of Customer:',result.vocSummary);
