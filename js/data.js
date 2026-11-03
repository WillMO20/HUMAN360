// Banco ORIGINAL y compacto (no son instrumentos validados). 3 cuestionarios; tipos de entrada: escala 1–10, opción, días (0–7) y actividades primarias.
export const MODULES=[{id:'A',name:'Capital humano'},{id:'B',name:'Capital estructural'},{id:'C',name:'Capital relacional'},{id:'D',name:'Bienestar y autogestión'},{id:'E',name:'Funciones cognitivas'},{id:'F',name:'Hábitos y desarrollo'},{id:'G',name:'Valores y motivación'},{id:'H',name:'Inteligencias múltiples'}];
export const BLOCKS=[{name:'Capacidades y entorno',mods:['A','B','C']},{name:'Bienestar, hábitos y valores',mods:['D','E','F','G']},{name:'Inteligencias múltiples',mods:['H']}];
const F4=['Nunca','A veces','Frecuente','Casi siempre'],V4=['Poco','Algo','Bastante','Totalmente'];
// [módulo, dimensión, texto, tipo, inversa, opciones]
const ROWS=[
['A','Aprendizaje','¿Qué tan bien aprendes cosas nuevas por tu cuenta?'],
['A','Comunicación','¿Qué tan claro te expresas al hablar y escribir?'],
['A','Resolución de problemas','¿Qué tan bien resuelves problemas inesperados?'],
['B','Gestión del tiempo','¿Qué tan bien aprovechas tu tiempo?'],
['B','Planificación','¿Qué tan bien planificas tus semanas?'],
['B','Organización personal','¿Qué tan ordenadas tienes tus tareas y materiales?'],
['C','Empatía','¿Qué tan bien comprendes lo que sienten los demás?'],
['C','Trabajo en equipo','¿Qué tan eficaz eres trabajando en equipo?'],
['C','Resolución de conflictos','¿Qué tan bien manejas los desacuerdos?'],
['D','Regulación emocional','¿Qué tan bien manejas tus emociones intensas?'],
['D','Estrés cotidiano','¿Con qué frecuencia el estrés te desborda?','choice',1,F4],
['D','Autocuidado','¿Cuántos días de la última semana dedicaste tiempo a descansar o moverte?','days'],
['E','Atención','¿Qué tan bien mantienes la atención en lo que haces?'],
['E','Memoria cotidiana autopercibida','¿Con qué frecuencia olvidas citas o tareas?','choice',1,F4],
['E','Concentración','¿Cuántos días de la última semana lograste 30 minutos seguidos de trabajo concentrado?','days'],
['F','Constancia','¿Cuántos días de la última semana avanzaste en una meta personal?','days'],
['F','Procrastinación','¿Con qué frecuencia pospones tareas importantes?','choice',1,F4],
['F','Gestión de distracciones','¿Qué tan bien controlas las distracciones (móvil, redes)?'],
['G','Propósito','¿Qué tan claro tienes lo que da sentido a tu vida?'],
['G','Valores personales','¿Tus decisiones reflejan tus valores?','choice',0,V4],
['G','Orientación académica y profesional','¿Qué tan claro tienes tu próximo paso académico o profesional?']];
export const QUESTIONS=[];const cnt={};
for(const[mod,dim,text,type='scale10',rev=0,opts]of ROWS){const n=cnt[mod]=(cnt[mod]||0)+1;
 QUESTIONS.push({id:mod+n,mod,dim,text,type,rev:!!rev,opts,kind:'p',min:type==='scale10'?1:0,max:type==='scale10'?10:type==='days'?7:opts.length-1})}
// Actividades primarias: interés (elegir hasta 3) + habilidad percibida (1–10) por inteligencia
export const ACTIVITIES=[['Lingüística','Leer, escribir o debatir ideas'],['Lógico-matemática','Resolver acertijos o analizar datos'],['Visual-espacial','Dibujar, diseñar u orientarme con mapas'],['Corporal-cinestésica','Deporte, baile o trabajo manual'],['Musical','Escuchar o hacer música'],['Interpersonal','Trabajar y convivir con otras personas'],['Intrapersonal','Reflexionar sobre mis emociones y metas'],['Naturalista','Estar en contacto con la naturaleza'],['Existencial','Pensar en el sentido de la vida']];
ACTIVITIES.forEach(([dim,t],i)=>{QUESTIONS.push({id:`H${i+1}i`,mod:'H',dim,text:t,type:'chip',rev:false,kind:'i',min:0,max:1});
 QUESTIONS.push({id:`H${i+1}p`,mod:'H',dim,text:`Habilidad percibida en: ${t.toLowerCase()}`,type:'scale10',rev:false,kind:'p',min:1,max:10})});
export const REFS=['Gardner, H. (1983). Frames of Mind: The Theory of Multiple Intelligences. Basic Books.','Stewart, T. A. (1997). Intellectual Capital. Doubleday (marco capital humano, estructural y relacional).','Nota: los ítems de HUMAN360 son originales y NO constituyen instrumentos validados ni adaptaciones con licencia.'];
