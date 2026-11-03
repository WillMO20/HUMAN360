import {MODULES,QUESTIONS} from './data.js';
export const norm=(v,rev,min=1,max=5)=>{const p=(v-min)/(max-min);return(rev?1-p:p)*100}; // (v-mín)/(máx-mín)*100, invertida si rev
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
// Las respuestas omitidas se excluyen (nunca cuentan como 0). Un módulo con <50% de respuestas es "insuficiente".
export function score(ans){
 const g={};
 for(const q of QUESTIONS){const k=q.mod+'|'+q.dim;const d=g[k]??={mod:q.mod,name:q.dim,n:0,v:[],sub:{i:[],p:[],d:[]}};d.n++;const v=ans[q.id];if(v>=q.min&&v<=q.max){const s=norm(v,q.rev,q.min,q.max);d.v.push(s);d.sub[q.kind].push(s)}}
 const D=Object.values(g).map(d=>({...d,pct:avg(d.v),answered:d.v.length}));
 const M=MODULES.map(m=>{const ds=D.filter(d=>d.mod===m.id);const answered=ds.reduce((a,d)=>a+d.answered,0),total=ds.reduce((a,d)=>a+d.n,0);
  return{id:m.id,name:m.name,pct:avg(ds.filter(d=>d.pct!=null).map(d=>d.pct)),answered,total,insufficient:answered/total<.5}});
 const I=D.filter(d=>d.mod==='H').map(d=>({name:d.name,pct:d.pct,interest:avg(d.sub.i),ability:avg([...d.sub.p,...d.sub.d])}));
 const ok=M.filter(m=>m.id!=='H'&&!m.insufficient&&m.pct!=null);
 const done=M.reduce((a,m)=>a+m.answered,0);
 return{D,M,I,overall:avg(ok.map(m=>m.pct)),validModules:ok.length,completeness:done/QUESTIONS.length*100};
}
export function interpret(r){
 const okIds=new Set(r.M.filter(m=>!m.insufficient).map(m=>m.id));
 const pool=r.D.filter(d=>d.mod!=='H'&&d.pct!=null&&okIds.has(d.mod));
 const sorted=[...pool].sort((a,b)=>b.pct-a.pct);
 const strengths=sorted.filter(d=>d.pct>=65).slice(0,3);
 const opps=[...sorted].reverse().filter(d=>d.pct<65).slice(0,3);
 const topI=[...r.I].filter(x=>x.pct!=null).sort((a,b)=>b.pct-a.pct).slice(0,3);
 const gaps=r.I.filter(x=>x.interest!=null&&x.ability!=null&&Math.abs(x.interest-x.ability)>=20).map(x=>({name:x.name,diff:x.interest-x.ability,
  text:x.interest>x.ability?`Interés alto frente a habilidad percibida menor en ${x.name}: puede ser un área para practicar y desarrollar.`:`Habilidad percibida mayor que el interés en ${x.name}: valora si deseas seguir cultivándola.`}));
 const recs=opps.map(d=>({dim:d.name,text:`Define una micro-práctica de 15 minutos diarios enfocada en «${d.name}» y registra cómo te sientes al aplicarla.`,act:`Pide retroalimentación a una persona de confianza sobre «${d.name}» y elige una conducta concreta a probar.`}));
 const plan=opps.length?[
  `Semana 1 · Observar: anota cada día una situación donde «${opps[0].name}» influyó en tu jornada.`,
  `Semana 2 · Practicar: aplica la micro-práctica en «${opps[0].name}»${opps[1]?` y empieza a explorar «${opps[1].name}»`:''}.`,
  `Semana 3 · Ajustar: revisa qué funcionó${opps[2]?` e incorpora «${opps[2].name}»`:''}; elimina obstáculos del entorno.`,
  `Semana 4 · Consolidar: define una meta para los próximos 90 días y repite HUMAN360 para comparar tu autopercepción.`]:[];
 return{strengths,opps,topI,gaps,recs,plan};
}
