import { readFileSync } from 'node:fs';

function smoke(html){
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const elements=new Map(),defaults={wave:"all",channel:"all",mSample:"80",mTarget:"40",mN:"600",mWave:"4",mOutcome:"productSatisfied",mChannel:"all",segK:"4",vocWave:"all",vocChannel:"all",vocThreshold:"50",pfW1:"3",pfW2:"3",pfW3:"2",pfW4:"2",pfBudget:"500",pfReserve:"10",pfCapacity:"10",pfCutoff:"2",pfActual:"200",pfRemainingVariance:"0",pfPriceWeight:"25",ldCase:"track",ldRole:"quant",ldSkillTarget:"4",ldPeriod:"2"};
 function el(id){if(!ids.has(id)&&id!=="backHub"&&!/^vocReview-(unclearInfo|navigation|support|accessibility|controls)$/.test(id))throw Error("Missing DOM element: "+id);if(!elements.has(id))elements.set(id,{value:defaults[id]||"",innerHTML:"",textContent:"",checked:false,disabled:false,handlers:{},hidden:false,addEventListener(k,fn){this.handlers[k]=fn},classList:{toggle(){}},setAttribute(){},removeAttribute(){},focus(){}});return elements.get(id)}
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

 navigate(4);
 const cfg=portfolioSettings(),plan=portfolioOptimize(cfg);
 assert(plan&&plan.feasible,"Default portfolio feasibility");
 assert(plan.total<=cfg.budget*(1-cfg.reserve)&&plan.load.every(n=>n<=cfg.capacity),"Budget and quarter capacity");
 assert(plan.chosen.some(x=>x.id==="TRACK")&&plan.chosen.some(x=>x.id==="VOCQA"),"Required work");
 assert(!plan.chosen.some(x=>x.id==="CLARITY")||!plan.chosen.some(x=>x.id==="DUP"),"Duplicate prevention");
 assert(plan.chosen.every(x=>x.deps.every(d=>plan.chosen.some(y=>y.id===d))),"Dependency constraints");
 assert(plan.spend.reduce((a,b)=>a+b,0)===plan.total,"Quarter reconciliation");
 assert(portfolioOptimize({...cfg,budget:100})===null&&portfolioOptimize({...cfg,capacity:3})===null,"Infeasibility");
 assert(portfolioOptimize({...cfg,weights:[0,0,0,0]})===null,"Invalid weights");
 assert(portfolioEvaluate(["TRACK","VOCQA","CLARITY","DUP"],cfg).issues.some(x=>x.includes("Overlapping")),"Duplicate warning");
 assert(portfolioEvaluate(["TRACK","VOCQA","INNOV"],cfg).issues.some(x=>x.includes("requires CLARITY")),"Dependency warning");
 const limited=portfolioOptimize({...cfg,budget:400}),expanded=portfolioOptimize({...cfg,budget:600});
 assert(limited&&expanded&&limited.value<=plan.value+1e-8&&expanded.value>=plan.value-1e-8,"Budget sensitivity");
 const protectedPlan=portfolioOptimize({...cfg,protect:true});
 assert(protectedPlan&&protectedPlan.chosen.some(x=>x.id==="ACCESS")&&protectedPlan.chosen.some(x=>x.id==="HEALTH"),"Strategic guardrail");
 assert(portfolioOptimize({...cfg,budget:300,protect:true})===null,"Guardrail infeasibility");
 $('pfProtect').checked=true;portfolioRender();assert($('pfPlanStatus').textContent.includes("Strategic guardrail"),"Guardrail warns on current manual selection");
 $('pfApply').handlers.click();assert(portfolioEvaluate([...pfSelected],portfolioSettings()).feasible,"Apply guarded recommendation");
 $('pfReset').handlers.click();assert(!$('pfProtect').checked,"Reset guardrail");
 $('pfActual').value="-5";assert(portfolioForecast(plan,cfg)===null,"Reject invalid actuals");$('pfActual').value="200";
 const forecast=portfolioForecast(plan,cfg);
 assert(forecast.forecast===forecast.actual+forecast.remaining,"Spend forecast");
 const rankings=portfolioVendor(25);
 assert(rankings[0].passed&&rankings[2].id==="V-C"&&!rankings[2].passed&&Number.isNaN(rankings[2].total),"Mandatory vendor screen");
 assert(portfolioVendor(10)[0].id==="V-B"&&portfolioVendor(60)[0].id==="V-A","Price-weight sensitivity");
 $('pfBudget').value="200";portfolioRender();assert($('pfPlanStatus').textContent.includes("requires review"),"Manual plan constraint change");
 $('pfReset').handlers.click();assert(portfolioEvaluate([...pfSelected],portfolioSettings()).feasible,"Reset feasible");
 const pfSummary={chosen:plan.chosen.map(x=>({id:x.id,name:x.name,cost:x.cost.reduce((a,b)=>a+b,0)})),total:plan.total,spend:plan.spend,load:plan.load,score:plan.value,limit:plan.limit,forecast,vendors:rankings.map(v=>({id:v.id,passed:v.passed,total:v.total})),protected:{total:protectedPlan.total,ids:protectedPlan.chosen.map(x=>x.id),load:protectedPlan.load,score:protectedPlan.value},constrained:{total:limited.total,ids:limited.chosen.map(x=>x.id)},expanded:{total:expanded.total,ids:expanded.chosen.map(x=>x.id)}};
 assert(JSON.stringify(survey)===original,"Portfolio module mutated survey");

 navigate(5);
 assert(MODULES.every(m=>m.status==="Available"),"All six modules available");
 assert(ldEvidence&&ldEvidence.validation.micro===validation.micro,"Leadership uses shared classifier evidence");
 assert(ldEvidence.portfolio.plan.total===plan.total,"Leadership uses live selected plan");
 const full=new Set([0,1,2,3]);
 assert(leadershipGate("track",new Set(),ldEvidence).ready===false&&leadershipGate("track",full,ldEvidence).ready,"Tracking checks");
 assert(!leadershipGate("voc",full,ldEvidence).ready&&!leadershipGate("seg",full,ldEvidence).ready,"No synthetic operational approval");
 assert(!leadershipGate("portfolio",full,ldEvidence).ready,"Strategic funding gap hold");
 $('pfProtect').checked=true;$('pfApply').handlers.click();navigate(5);
 assert(ldEvidence.health&&ldEvidence.access&&leadershipGate("portfolio",full,ldEvidence).ready,"Guarded portfolio ready for formal review");
 $('pfReset').handlers.click();navigate(5);
 ldChecks.set("track",full);leadershipRenderGate();assert($('ldGateStatus').textContent==="Ready for formal review","Gate UI");
 $('ldGateReset').handlers.click();assert($('ldGateStatus').textContent==="Hold / escalate","Gate reset");
 assert(!leadershipSetTask("V4",true),"Block missing prerequisites");
 for(const m of LD_MILESTONES)assert(leadershipSetTask(m.id,true),"Milestone prerequisites valid");
 assert(ldDone.size===LD_MILESTONES.length,"All milestones reachable");
 leadershipSetTask("D1",false);assert(!ldDone.has("D4")&&!ldDone.has("V4")&&!ldDone.has("A4")&&ldDone.has("D2"),"Cascade reopening");
 $('ldRoadReset').handlers.click();assert(ldDone.size===0,"Roadmap reset");
 const coaching=leadershipCoach();
 assert(coaching.priorities.length===2&&coaching.priorities.includes("Qualitative research"),"Coaching gap priorities");
 ldRatings.set("quant",[5,5,5,5,5,5]);assert(leadershipCoach().priorities.length===0,"Coaching no gaps");
 $('ldCoachReset').handlers.click();assert(leadershipCoach().priorities.length===2,"Coaching reset");
 $('ldPeriod').value="0";const first=leadershipScorecard();assert(first.measured===4&&first.data.filter(x=>x.status==="Not measured").length===2,"Missing denominator not zero");
 $('ldPeriod').value="2";const last=leadershipScorecard();assert(last.measured===6&&last.on===5&&last.review===1,"Day 90 scorecard");
 const leadershipSummary={milestones:LD_MILESTONES.length,reviewCases:LD_STAGES.length,coach:coaching,scorecard:last,baselinePortfolio:ldEvidence.portfolio.plan.total,readiness:LD_STAGES.map(x=>({id:x.id,result:leadershipGate(x.id,full,ldEvidence).status}))};
 assert(JSON.stringify(survey)===original,"Leadership module mutated survey");
 for(let i=0;i<6;i++)navigate(i);
 return {suggestedK:segmentResult.recommend,variance:segmentResult.variance,summaries,vocSummary,pfSummary,leadershipSummary};
 `)(document,{hash:"#module-1"},{replaceState(){}});
}

const result = smoke(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
console.log('Smoke test passed; suggested k =', result.suggestedK);
console.table(result.summaries.map(({profiles,...summary})=>summary));
console.log('Voice of Customer:',result.vocSummary);
console.log('Research portfolio:',result.pfSummary);
console.log('Leadership & governance:',result.leadershipSummary);
