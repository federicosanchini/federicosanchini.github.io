// Browser research engine adapted from HL/backtesting/backtest.py.
// Prices and rates are historical inputs; no exchange API or order submission.
export function runBacktest(meta,data,ranks,c){
 const S=meta.symbols.length, epoch=Date.parse(meta.start)/3600000;
 const first=Math.max(0,Math.round(Date.parse(c.start)/3600000-epoch));
 const last=Math.min(meta.hours-1,Math.round(Date.parse(c.end)/3600000-epoch)+23);
 if(first>last)throw Error('Choose a date range inside the available history.');
 const at=(h,s,k)=>data[(h*S+s)*7+k];
 const pos=new Map(), marks=new Map(), schedule=new Map();
 const trades=[],closed=[],rows=[],skips=[], lots=[];
 let cash=c.capital,realized=0,funding=0,fees=0,longPnl=0,shortPnl=0,liqCount=0,missingFunding=0,oracleFallback=0,fallbackBars=0,staleMarks=0,halted=false;
 const maxLev=s=>meta.maxLeverage[meta.symbols[s]]??c.defaultMax;
 const mmr=s=>1/(2*maxLev(s));
 const up=(p,px)=>p.q*(px-p.entry);
 const mark=(s,p)=>marks.get(s)??p.entry;
 const equity=()=>cash+[...pos].reduce((a,[s,p])=>a+up(p,mark(s,p))+(c.mode==='isolated'?p.margin:0),0);
 const maintenance=()=>[...pos].reduce((a,[s,p])=>a+Math.abs(p.q)*mark(s,p)*mmr(s),0);
 const skip=(h,s,side,reason)=>skips.push({hour:h,symbol:meta.symbols[s],side:side===1?'Long':'Short',reason});
 const consume=(p,q)=>{for(const l of p.lots){const v=Math.min(q,l.left);l.left-=v;q-=v;if(q<1e-12)break;}};
 const addLot=(h,s,p,q)=>{const l={s,side:Math.sign(p.q),left:q,due:h+Math.ceil(c.holding*24),owner:p};p.lots.push(l);if(c.holding>0)lots.push(l);};
 function order(h,s,side,notional,price,reason='Signal',force=false,rate=c.fee){
  if(!Number.isFinite(price)||price<=0)return;
  let p=pos.get(s),q=notional/price,fee=notional*rate,action='Open',pnl=0;
  const oldSide=p?Math.sign(p.q):0;
  if(!force&&reason==='Signal'&&c.leverage>maxLev(s)){skip(h,s,side,'Leverage exceeds asset limit');return;}
  if(!p||oldSide===side){
   let margin=notional/c.leverage;
   let sufficient=c.mode==='isolated'?cash+1e-10>=margin+fee:cash>=fee&&equity()+1e-10>=[...pos.values()].reduce((a,p)=>a+p.margin,0)+margin+fee;
   if(!sufficient){skip(h,s,side,'Insufficient collateral');return;}
   cash-=fee+(c.mode==='isolated'?margin:0);fees+=fee;
   if(!p){p={q:side*q,entry:price,margin,lots:[],opened:h};pos.set(s,p);}
   else{p.entry=(Math.abs(p.q)*p.entry+q*price)/(Math.abs(p.q)+q);p.q+=side*q;p.margin+=margin;action='Add';}
   if(reason==='Signal')addLot(h,s,p,q);
  }else{
   const oldAbs=Math.abs(p.q),closeQ=Math.min(oldAbs,q),fraction=closeQ/oldAbs;
   pnl=closeQ*oldSide*(price-p.entry);const released=p.margin*fraction;
   const residual=p.q+side*q,flip=Math.abs(residual)>1e-10&&Math.sign(residual)!==oldSide;
   const residualMargin=flip?Math.abs(residual)*price/c.leverage:0;
   // A reduce-only exit is always allowed. A flip must fund its new exposure.
   if(flip&&!force){const available=cash+pnl+(c.mode==='isolated'?released:0)-fee;
    const newUsed=[...pos.values()].reduce((a,v)=>a+v.margin,0)-p.margin+residualMargin;
    if(available<(c.mode==='isolated'?residualMargin:0)||(c.mode==='cross'&&equity()-fee<newUsed)){skip(h,s,side,'Insufficient collateral to flip');return;}}
   cash+=pnl+(c.mode==='isolated'?released:0)-fee-(c.mode==='isolated'?residualMargin:0);
   realized+=pnl;fees+=fee;if(oldSide===1)longPnl+=pnl;else shortPnl+=pnl;
   closed.push({hour:h,symbol:meta.symbols[s],side:oldSide===1?'Long':'Short',qty:closeQ,entry:p.entry,exit:price,pnl,exitFee:fee*closeQ/q,reason});
   consume(p,closeQ);p.margin-=released;
   if(Math.abs(residual)<1e-10){pos.delete(s);action='Close';}
   else if(!flip){p.q=residual;action='Reduce';}
   else{p={q:residual,entry:price,margin:residualMargin,lots:[],opened:h};pos.set(s,p);action='Flip';if(reason==='Signal')addLot(h,s,p,Math.abs(residual));}
  }
  trades.push({hour:h,symbol:meta.symbols[s],side:side===1?'Buy':'Sell',action,price,notional,fee,pnl,reason});
 }
 function close(h,s,px,reason,rate=c.fee){const p=pos.get(s);if(p)order(h,s,-Math.sign(p.q),Math.abs(p.q)*px,px,reason,true,rate);}
 for(const [day,rank] of Object.entries(ranks)){
  const base=Math.round(Date.parse(day)/3600000-epoch)+c.entryHour+c.signalLag*24;
  if(base<first||base>last||rank.length<2)continue;
  const sorted=[...rank].sort((a,b)=>b[1]-a[1]||meta.symbols[a[0]].localeCompare(meta.symbols[b[0]]));
  const chosen=sorted.slice(0,c.longs).map(r=>[r[0],1]);
  const seen=new Set(chosen.map(r=>r[0]));
  for(const r of [...sorted].reverse().slice(0,c.shorts))if(!seen.has(r[0]))chosen.push([r[0],-1]);
  for(const [s,side] of chosen){let h=base;while(h<=Math.min(last,base+c.delay)&&!(at(h,s,0)>0&&(!at(h,s,6)||c.fallback)))h++;
   if(h>Math.min(last,base+c.delay)){skip(base,s,side,'No price in entry window');continue;}
   if(!schedule.has(h))schedule.set(h,[]);schedule.get(h).push([s,side]);}
 }
 function record(h){let unreal=0,longU=0,shortU=0,exposure=0,locked=0;
  for(const [s,p]of pos){const u=up(p,mark(s,p));unreal+=u;if(p.q>0)longU+=u;else shortU+=u;exposure+=Math.abs(p.q)*mark(s,p);locked+=p.margin;}
  const row={hour:h,equity:equity(),pricePnl:realized+unreal,funding,fees,longPnl:longPnl+longU,shortPnl:shortPnl+shortU,exposure,positions:pos.size,cash,margin:locked};
  if(rows.at(-1)?.hour===h)rows[rows.length-1]=row;else rows.push(row);
 }
 for(let h=first;h<=last;h++){
  // Use the known candle open for collateral checks before that candle closes.
  for(let s=0;s<S;s++){if(at(h,s,0)>0&&(!at(h,s,6)||c.fallback))marks.set(s,at(h,s,0));}
  for(const l of lots){if(l.left<1e-12||l.due>h)continue;const p=pos.get(l.s);if(p!==l.owner||Math.sign(p.q)!==l.side){l.left=0;continue;}
   const px=at(h,l.s,0);if(!(px>0)||(!c.fallback&&at(h,l.s,6)))continue;
   const q=Math.min(l.left,Math.abs(p.q));order(h,l.s,-l.side,q*px,px,'Timed exit');l.left=0;}
  for(const [s,side]of(schedule.get(h)||[]).sort((a,b)=>meta.symbols[a[0]].localeCompare(meta.symbols[b[0]])))order(h,s,side,c.notional,at(h,s,0));
  for(const [s,p]of [...pos]){
   const f=at(h,s,4),o=at(h,s,5);if(!Number.isFinite(f)){missingFunding++;continue;}
   const px=o>0?o:mark(s,p);if(!(o>0))oracleFallback++;
   const value=-p.q*px*f;funding+=value;if(c.mode==='isolated')p.margin+=value;else cash+=value;
   if(c.mode==='isolated'&&p.margin<=0){close(h,s,px,'Funding liquidation',c.liqFee);liqCount++;}
  }
  for(let s=0;s<S;s++){if(at(h,s,3)>0&&(!at(h,s,6)||c.fallback))marks.set(s,at(h,s,3));}
  for(const [s]of pos){if(at(h,s,6))fallbackBars++;if(!(at(h,s,3)>0)||(!c.fallback&&at(h,s,6)))staleMarks++;}
  // Same OHLC liquidation approximation as the repository; not exchange mark ticks.
  let passes=0,hit=true;
  while(hit&&passes++<S){hit=false;for(const [s,p]of pos){if(!(at(h,s,0)>0)||(!c.fallback&&at(h,s,6)))continue;
    const side=Math.sign(p.q),q=Math.abs(p.q),m=mmr(s);
    const liq=c.mode==='isolated'?(p.entry-side*p.margin/q)/(1-side*m):mark(s,p)-side*(equity()-maintenance())/q/(1-side*m);
    if(liq>0&&(side>0?at(h,s,2)<=liq:at(h,s,1)>=liq)){close(h,s,liq,'Liquidation',c.liqFee);liqCount++;hit=true;break;}}
  }
  record(h);if(equity()<=0){halted=true;break;}
 }
 if(c.closeEnd&&rows.length){let h=rows.at(-1).hour;for(const [s,p]of [...pos])close(h,s,mark(s,p),'End of backtest');record(h);}
 const daily=[];for(const r of rows){const day=new Date((epoch+r.hour)*3600000).toISOString().slice(0,10);if(daily.at(-1)?.day===day)daily[daily.length-1]={...r,day};else daily.push({...r,day});}
 let prev=c.capital,peak=c.capital,maxDD=0;for(const r of rows){peak=Math.max(peak,r.equity);r.drawdown=r.equity/peak-1;maxDD=Math.min(maxDD,r.drawdown);}
 for(const r of daily){r.return=prev>0?r.equity/prev-1:null;prev=r.equity;}
 const returns=daily.map(r=>r.return).filter(Number.isFinite),mean=returns.reduce((a,b)=>a+b,0)/(returns.length||1);
 const std=returns.length>1?Math.sqrt(returns.reduce((a,b)=>a+(b-mean)**2,0)/(returns.length-1)):0;
 const rf=(1+c.rf)**(1/365)-1,excess=returns.map(r=>r-rf),avgEx=mean-rf;
 const down=Math.sqrt(excess.reduce((a,b)=>a+Math.min(0,b)**2,0)/(excess.length||1));
 const final=rows.at(-1)?.equity??c.capital,days=(rows.at(-1)?.hour-first+1)/24;
 const cagr=final>0&&days>0?Math.pow(final/c.capital,365/days)-1:null;
 const wins=closed.filter(r=>r.pnl-r.exitFee>0).length;
 const gains=closed.reduce((a,r)=>a+Math.max(0,r.pnl-r.exitFee),0),loss=-closed.reduce((a,r)=>a+Math.min(0,r.pnl-r.exitFee),0);
 const metrics={final,net:final-c.capital,totalReturn:final/c.capital-1,cagr,sharpe:std>1e-14?avgEx/std*Math.sqrt(365):null,sortino:down>1e-14?avgEx/down*Math.sqrt(365):null,volatility:std*Math.sqrt(365),maxDD,calmar:maxDD<0&&cagr!==null?cagr/Math.abs(maxDD):null,winRate:closed.length?wins/closed.length:null,profitFactor:loss>0?gains/loss:null,turnover:trades.reduce((a,t)=>a+t.notional,0),trades:trades.length,closed:closed.length,liqCount,days,funding,fees,realized,open:pos.size};
 return {config:c,metrics,rows,daily,trades,closed,skips,quality:{missingFunding,oracleFallback,fallbackBars,staleMarks,halted},epoch};
}
