import {MODULES,QUESTIONS,BLOCKS,REFS} from './data.js';
import {score,interpret} from './engine.js';
const root=document.getElementById('app');
const init=()=>({screen:'welcome',name:'',mi:0,ans:{},res:null,it:null});
let S=init();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P=v=>v==null?'—':Math.round(v)+'%';
const bar=(l,v,flag)=>`<div class="bar" title="${esc(l)}: ${P(v)}"><span>${esc(l)}</span><i><b style="width:${v||0}%"></b></i><em>${P(v)}${flag?'*':''}</em></div>`;
function radar(items){const n=items.length,cx=240,cy=190,R=120;const pt=(i,v)=>{const a=-Math.PI/2+2*Math.PI*i/n;return[cx+Math.cos(a)*R*v/100,cy+Math.sin(a)*R*v/100]};
 const poly=v=>items.map((_,i)=>pt(i,v).map(x=>x.toFixed(1)).join(',')).join(' ');
 let s=`<svg class="radar" viewBox="0 0 480 380" role="img" aria-label="Gráfico radar">`;
 [25,50,75,100].forEach(v=>s+=`<polygon points="${poly(v)}" fill="none" stroke="#e2e7ef"/>`);
 items.forEach((it,i)=>{const[x,y]=pt(i,100),[lx,ly]=pt(i,118);s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e2e7ef"/><text x="${lx}" y="${ly}" text-anchor="${lx<cx-5?'end':lx>cx+5?'start':'middle'}" dominant-baseline="middle">${esc(it.label)}</text>`});
 s+=`<polygon points="${items.map((it,i)=>pt(i,it.v||0).map(x=>x.toFixed(1)).join(',')).join(' ')}" fill="rgba(20,168,155,.25)" stroke="#0b2f6b" stroke-width="2"/>`;
 items.forEach((it,i)=>{const[x,y]=pt(i,it.v||0);s+=`<circle class="pt" cx="${x}" cy="${y}" r="5"><title>${esc(it.label)}: ${P(it.v)}</title></circle>`});
 return s+'</svg>'}
function body(r,it){
 const A=r.M.filter(m=>m.id!=='H'),H=r.M.find(m=>m.id==='H');
 let h=`<div class="grid"><div class="card kpi"><strong>${P(r.overall)}</strong>Índice general (módulos A–G suficientes)</div><div class="card kpi"><strong>${Math.round(r.completeness)}%</strong>Completitud</div><div class="card kpi"><strong>${r.validModules}/7</strong>Módulos con datos suficientes</div></div>`;
 h+=`<div class="card"><h2>Resultados por módulo</h2>${radar(A.map(m=>({label:m.name,v:m.insufficient?null:m.pct})))}${A.map(m=>bar(`${m.id}. ${m.name}${m.insufficient?' (insuficiente)':''}`,m.pct,m.insufficient)).join('')}<p class="mut">* Módulo con menos del 50 % de respuestas: no entra en el índice general ni en el ranking.</p></div>`;
 h+=`<div class="card"><h2>Detalle por dimensión</h2>${A.map(m=>`<details><summary>${m.id}. ${esc(m.name)} — ${P(m.pct)}</summary>${r.D.filter(d=>d.mod===m.id).map(d=>bar(d.name,d.pct)).join('')}</details>`).join('')}</div>`;
 h+=`<div class="card pb"><h2>Nueve inteligencias (perfil exploratorio)</h2>${H.insufficient?'<p class="mut">Datos insuficientes en este módulo.</p>':''}${radar(r.I.map(x=>({label:x.name,v:x.pct})))}<table><tr><th>Inteligencia</th><th>Interés</th><th>Habilidad percibida y desempeño</th><th>Global</th></tr>${r.I.map(x=>`<tr><td>${x.name}</td><td>${P(x.interest)}</td><td>${P(x.ability)}</td><td>${P(x.pct)}</td></tr>`).join('')}</table>${it.gaps.length?`<h3>Diferencias entre interés y habilidad percibida</h3><ul>${it.gaps.map(g=>`<li>${esc(g.text)}</li>`).join('')}</ul>`:''}</div>`;
 const li=a=>a.length?`<ul>${a.map(d=>`<li><b>${esc(d.name)}</b> (${P(d.pct)})</li>`).join('')}</ul>`:'<p class="mut">Sin elementos destacados con los datos disponibles.</p>';
 h+=`<div class="grid"><div class="card"><h2>Fortalezas percibidas</h2>${li(it.strengths)}</div><div class="card"><h2>Áreas de oportunidad</h2>${li(it.opps)}</div></div>`;
 h+=`<div class="card"><h2>Recomendaciones</h2>${it.recs.length?it.recs.map(x=>`<h3>${esc(x.dim)}</h3><p>${esc(x.text)}<br>${esc(x.act)}</p>`).join(''):'<p class="mut">Con los datos actuales no hay áreas por debajo del 65 %. Mantén tus prácticas.</p>'}</div>`;
 h+=`<div class="card"><h2>Plan de desarrollo de 30 días</h2>${it.plan.length?`<ol>${it.plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:'<p class="mut">Completa más respuestas para generar un plan.</p>'}</div>`;
 return h}
const T={
welcome:()=>`<section class="card hero"><h1>Una mirada integral a tus capacidades</h1><p class="mut">Autoevaluación de capital humano, estructural y relacional, bienestar, cognición, hábitos, valores e inteligencias múltiples.</p><button class="btn" data-act="go" data-to="privacy">Iniciar evaluación</button></section>`,
privacy:()=>`<section class="card"><h2>Información y privacidad</h2><p>HUMAN360 es una herramienta de autoexploración. <b>No es un diagnóstico</b> médico, psicológico ni neurológico y sus preguntas no son instrumentos validados.</p><p>Tus respuestas viven solo en la memoria de esta pestaña. No se envían a ningún servidor ni se guardan en cookies, localStorage, sessionStorage ni IndexedDB. Al recargar o cerrar sesión se borra todo.</p><div class="row"><button class="btn alt" data-act="go" data-to="welcome">Volver</button><button class="btn" data-act="go" data-to="ident">Acepto y continúo</button></div></section>`,
ident:()=>`<section class="card"><h2>Identificación (opcional)</h2><label for="nm">Nombre para el informe</label><input type="text" id="nm" maxlength="80" value="${esc(S.name)}" autocomplete="off"><div class="row"><button class="btn alt" data-act="go" data-to="privacy">Volver</button><button class="btn" data-act="ident">Continuar</button></div></section>`,
instr:()=>`<section class="card"><h2>Instrucciones</h2><ul><li>Son solo 3 cuestionarios cortos: elige un valor en una escala de 1 a 10, selecciona una opción o escribe un número de días (0–7). No hay que redactar nada.</li><li>Responde pensando en tu vida reciente. No hay respuestas correctas.</li><li>Puedes omitir preguntas: no cuentan como cero, pero un módulo con menos del 50 % de respuestas se marca como insuficiente.</li></ul><div class="row"><button class="btn" data-act="start">Comenzar</button></div></section>`,
quiz:()=>{const b=BLOCKS[S.mi],done=Object.keys(S.ans).length;
 const inp=q=>{const v=S.ans[q.id];
  if(q.type==='days')return`<input type="number" name="${q.id}" min="0" max="7" step="1" inputmode="numeric" placeholder="0–7" value="${v??''}" style="max-width:110px"> <span class="mut">días</span>`;
  if(q.type==='scale10')return`<div class="opts o10">${[...Array(10)].map((_,i)=>`<label><input type="radio" name="${q.id}" value="${i+1}" ${v===i+1?'checked':''}>${i+1}</label>`).join('')}</div><div class="mut ends"><span>Muy bajo</span><span>Muy alto</span></div>`;
  return`<div class="opts" style="grid-template-columns:repeat(${q.opts.length},1fr)">${q.opts.map((o,i)=>`<label><input type="radio" name="${q.id}" value="${i}" ${v===i?'checked':''}>${o}</label>`).join('')}</div>`};
 const fs=q=>`<fieldset class="q"><legend>${esc(q.text)}</legend>${inp(q)}</fieldset>`;
 const sec=id=>{const m=MODULES.find(x=>x.id===id),qs=QUESTIONS.filter(q=>q.mod===id);
  if(id!=='H')return`<h3>${m.name}</h3>${qs.map(fs).join('')}`;
  return`<h3>Actividades que más te atraen</h3><p class="mut">Elige hasta 3.</p><div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">${qs.filter(q=>q.type==='chip').map(q=>`<label><input type="checkbox" name="${q.id}" ${S.ans[q.id]===1?'checked':''}>${q.text}</label>`).join('')}</div><h3>¿Qué tan hábil te percibes?</h3>${qs.filter(q=>q.type!=='chip').map(fs).join('')}`};
 return`<section class="card"><div class="prog" aria-label="Progreso"><b id="pb" style="width:${done/QUESTIONS.length*100}%"></b></div><p class="mut" id="pt">Cuestionario ${S.mi+1} de ${BLOCKS.length} · ${done}/${QUESTIONS.length} respondidas</p><h2>${esc(b.name)}</h2>${b.mods.map(sec).join('')}<div class="row"><button class="btn alt" data-act="prev">Anterior</button><button class="btn" data-act="next">${S.mi<BLOCKS.length-1?'Siguiente cuestionario':'Revisar respuestas'}</button></div></section>`},
review:()=>`<section class="card"><h2>Revisión de respuestas</h2><table><tr><th>Cuestionario</th><th>Respondidas</th><th></th></tr>${BLOCKS.map((b,i)=>{const t=QUESTIONS.filter(q=>b.mods.includes(q.mod)),a=t.filter(q=>S.ans[q.id]!=null).length;return`<tr><td>${i+1}. ${b.name}</td><td>${a}/${t.length}</td><td><button class="btn alt" data-act="jump" data-i="${i}">Editar</button></td></tr>`}).join('')}</table><p class="mut">Los módulos con menos del 50 % de respuestas se marcarán como insuficientes.</p><div class="row"><button class="btn" data-act="calc">Calcular resultados</button></div></section>`,
proc:()=>`<section class="card hero"><h2>Procesando resultados…</h2><div class="prog"><b style="width:100%;animation:in 1s"></b></div></section>`,
dash:()=>`<div class="row noprint" style="margin:0 0 16px"><button class="btn" data-act="go" data-to="report">Informe PDF</button><button class="btn alt" data-act="go" data-to="close">Cerrar sesión</button></div><h1>Tu panel de resultados</h1>${body(S.res,S.it)}`,
report:()=>`<div class="row noprint"><button class="btn" data-act="print">Descargar PDF (Guardar como PDF)</button><button class="btn alt" data-act="go" data-to="dash">Volver al panel</button></div><p class="mut noprint">Se abrirá el diálogo de impresión: elige «Guardar como PDF», tamaño A4.</p><section class="card cover"><h1>HUMAN360</h1><h2>Informe de autoevaluación integral</h2><p>${S.name?esc(S.name)+'<br>':''}Fecha: ${new Date().toLocaleDateString('es')}</p></section><section class="card pb"><h2>Resumen ejecutivo y metodología</h2><p>Índice general: <b>${P(S.res.overall)}</b>; completitud: <b>${Math.round(S.res.completeness)}%</b>. Cada respuesta se normaliza a 0–100 con (v−mín)/(máx−mín)×100 (invertida en ítems inversos); las actividades primarias elegidas puntúan 100 de interés y las no elegidas 0. La dimensión es el promedio de sus ítems respondidos; el módulo, el promedio de sus dimensiones; omitidas no cuentan como 0. Fortaleza: ≥65 %; oportunidad: <65 % (los más bajos).</p></section>${body(S.res,S.it)}<section class="card pb"><h2>Limitaciones</h2><p>Resultados basados en autopercepción, con ítems originales sin validación psicométrica. No constituyen diagnóstico ni medición definitiva de inteligencia.</p><h2>Referencias</h2><ul>${REFS.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`,
close:()=>`<section class="card"><h2>¿Cerrar sesión?</h2><p>Se eliminarán respuestas, resultados y datos personales. Esta acción no se puede deshacer.</p><div class="row"><button class="btn alt" data-act="go" data-to="dash">Cancelar</button><button class="btn danger" data-act="end">Eliminar todo y salir</button></div></section>`};
function render(){root.innerHTML=T[S.screen]();scrollTo(0,0)}
const go=s=>{S.screen=s;render()};
root.addEventListener('change',e=>{const t=e.target,id=t.name;if(!id)return;
 if(t.type==='checkbox'){const ch=QUESTIONS.filter(q=>q.type==='chip');ch.forEach(q=>{if(S.ans[q.id]==null)S.ans[q.id]=0});
  if(t.checked&&ch.filter(q=>S.ans[q.id]===1).length>=3){t.checked=false;return}S.ans[id]=t.checked?1:0}
 else if(t.type==='number'){if(t.value==='')delete S.ans[id];else{const v=Math.min(7,Math.max(0,Math.round(+t.value)));t.value=v;S.ans[id]=v}}
 else S.ans[id]=+t.value;
 const n=Object.keys(S.ans).length;document.getElementById('pb').style.width=n/QUESTIONS.length*100+'%';document.getElementById('pt').textContent=`Cuestionario ${S.mi+1} de ${BLOCKS.length} · ${n}/${QUESTIONS.length} respondidas`});
root.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='go')go(b.dataset.to);
 else if(a==='ident'){S.name=document.getElementById('nm').value.trim();go('instr')}
 else if(a==='start'){S.mi=0;go('quiz')}
 else if(a==='next'){if(S.mi<BLOCKS.length-1){S.mi++;render()}else go('review')}
 else if(a==='prev'){if(S.mi>0){S.mi--;render()}else go('instr')}
 else if(a==='jump'){S.mi=+b.dataset.i;go('quiz')}
 else if(a==='calc'){go('proc');setTimeout(()=>{S.res=score(S.ans);S.it=interpret(S.res);go('dash')},900)}
 else if(a==='print')window.print();
 else if(a==='end'){S=init();root.innerHTML='';render()}});
render();
