'use strict';
// Categorías de estudio: metadatos de presentación, sin modificar los registros originales.
const VERB_FIELDS=[
 ['food','🍙','Alimentación y cocina'],
 ['move','🚃','Movimiento y transporte'],
 ['talk','💬','Comunicación'],
 ['study','📚','Estudio y trabajo'],
 ['routine','🌅','Rutina y cuidado personal'],
 ['shopping','🛍️','Compras y objetos'],
 ['social','🤝','Relaciones y emociones'],
 ['home','🏠','Casa y acciones cotidianas']
];
const VERB_FIELD_BASE={
 'Comida':'food','Movimiento':'move','Transporte':'move','Viajes':'move','Ubicación':'move',
 'Comunicación':'talk','Estudio':'study','Trabajo':'study',
 'Vida diaria':'routine','Salud':'routine','Ropa':'routine',
 'Compras':'shopping','Relaciones':'social','Ocio':'social','Emergencias':'social',
 'Hogar':'home'
};
const VERB_FIELD_EXTRA={
 'V0013':['home'],'V0016':['study'],'V0019':['talk'],
 'V0021':['shopping'],'V0022':['shopping','home'],'V0023':['home'],
 'V0024':['routine'],'V0025':['routine'],'V0026':['home'],
 'V0031':['home'],'V0032':['home'],'V0037':['home'],'V0038':['routine'],
 'V0047':['talk'],'V0049':['study'],'V0050':['social'],
 'V0053':['shopping'],'V0054':['shopping'],'V0056':['shopping'],
 'V0063':['social'],'V0064':['social'],'V0065':['social'],
 'V0068':['study'],'V0070':['study'],'V0081':['routine'],
 'V0083':['routine'],'V0084':['routine'],'V0085':['routine'],'V0086':['routine'],
 'V0087':['food'],'V0088':['routine'],'V0089':['routine'],
 'V0091':['shopping'],'V0092':['home'],'V0093':['routine'],
 'V0097':['study'],'V0100':['study']
};
const VERB_ILLUSTRATIONS={"V0004":"./assets/verbs/food/v0004.webp","V0005":"./assets/verbs/food/v0005.webp","V0026":"./assets/verbs/food/v0026.webp","V0027":"./assets/verbs/move/v0027.webp","V0001":"./assets/verbs/move/v0001.webp","V0003":"./assets/verbs/move/v0003.webp","V0008":"./assets/verbs/talk/v0008.webp","V0007":"./assets/verbs/talk/v0007.webp","V0009":"./assets/verbs/study/v0009.webp","V0010":"./assets/verbs/study/v0010.webp","V0014":"./assets/verbs/study/v0014.webp","V0017":"./assets/verbs/routine/v0017.webp","V0018":"./assets/verbs/routine/v0018.webp","V0011":"./assets/verbs/shopping/v0011.webp","V0019":"./assets/verbs/social/v0019.webp","V0033":"./assets/verbs/home/v0033.webp"};
let verbGroupFilter='all',verbFieldFilter='all',verbSearch='',verbSelectedId=null;
function verbGroup(v){const g=String(v.Grupo||'');return g.includes('Ichidan')?'2':g.includes('Irregular')?'3':'1'}
function verbFields(v){return [...new Set([VERB_FIELD_BASE[v['Campo semántico']]||'routine',...(VERB_FIELD_EXTRA[v.ID]||[])])]}
function verbMatches(v){return (verbGroupFilter==='all'||verbGroup(v)===verbGroupFilter)&&(verbFieldFilter==='all'||verbFields(v).includes(verbFieldFilter))&&(!verbSearch||[v.Verbo,v.Lectura,v.Significado].some(s=>String(s||'').toLocaleLowerCase().includes(verbSearch.toLocaleLowerCase())))}
function verbGroupName(v){return verbGroup(v)==='1'?'Grupo 1 · Godan':verbGroup(v)==='2'?'Grupo 2 · Ichidan':'Grupo 3 · Irregular'}
function verbLibrary(){section='Verbos';const list=data.verbs.filter(verbMatches),selected=data.verbs.find(v=>v.ID===verbSelectedId&&verbMatches(v));const fieldOptions=[['all','Todos los campos'],...VERB_FIELDS.map(([id,emoji,name])=>[id,emoji+' '+name])];return header('Verbos · 動詞','Encuentra un verbo por grupo o situación. Toca una tarjeta para estudiar sus formas.')+`<div class="panel verb-filter-panel"><label for="verbField">Campo semántico</label><select id="verbField">${fieldOptions.map(([id,label])=>`<option value="${id}" ${verbFieldFilter===id?'selected':''}>${esc(label)}</option>`).join('')}</select><label for="verbGroup">Grupo gramatical</label><select id="verbGroup"><option value="all" ${verbGroupFilter==='all'?'selected':''}>Todos los grupos</option><option value="1" ${verbGroupFilter==='1'?'selected':''}>Grupo 1 · Godan</option><option value="2" ${verbGroupFilter==='2'?'selected':''}>Grupo 2 · Ichidan</option><option value="3" ${verbGroupFilter==='3'?'selected':''}>Grupo 3 · Irregulares</option></select><label for="verbSearch">Buscar verbo</label><input id="verbSearch" type="search" placeholder="Japonés, lectura o español" value="${esc(verbSearch)}"><div class="row">${btn('Limpiar filtros','verbClear')}${btn('Practicar conjugaciones','verbQuiz','primary')}</div><p class="muted">${list.length} de ${data.verbs.length} verbos · Las categorías pueden superponerse.</p></div>${selected?verbDetailCard(selected):''}<div class="verb-grid">${list.map(v=>`<button class="verb-tile ${selected&&selected.ID===v.ID?'verb-tile-selected':''}" data-verb-id="${esc(v.ID)}">${VERB_ILLUSTRATIONS[v.ID]?`<img class="verb-tile-image" src="${VERB_ILLUSTRATIONS[v.ID]}" alt="" loading="lazy" decoding="async">`:``}<span class="verb-tile-jp">${esc(v.Verbo)}</span><span class="verb-tile-reading">${esc(v.Lectura)}</span><span class="verb-tile-meaning">${esc(v.Significado)}</span><span class="verb-tile-group">G${verbGroup(v)}</span></button>`).join('')||'<div class="panel">No hay verbos con estos filtros. Prueba otra combinación.</div>'}</div><div class="row">${btn('← Gramática','grammar')}</div>`}
const VERB_FORM_LABELS={'ます':'Forma ます · cortés','て':'Forma て · conexión','ない':'Forma ない · negativa','た':'Forma た · pasado','可能形':'Forma potencial · capacidad'};
let verbStudyForm='ます',verbFormRevealed=false,verbGroupRevealed=false;
function verbDetailCard(v){const fields=verbFields(v).map(id=>{const f=VERB_FIELDS.find(x=>x[0]===id);return f?f[1]+' '+f[2]:''}).filter(Boolean);const answer=v[verbStudyForm]||'—';return `<article class="panel verb-detail" id="verb-detail"><div class="verb-detail-top"><span class="verb-pill">${esc(verbGroupName(v))}</span><button data-action="verbClose" aria-label="Cerrar ficha">✕</button></div>${VERB_ILLUSTRATIONS[v.ID]?`<img class="verb-detail-image" src="${VERB_ILLUSTRATIONS[v.ID]}" alt="Ilustración de referencia para ${esc(v.Significado)}" decoding="async">`:`<div class="verb-illustration-placeholder" aria-label="Sin ilustración todavía">🌸<span>Imagen en preparación</span></div>`}<div class="jp">${esc(v.Verbo)}</div><div class="reading">${esc(v.Lectura)}</div><div class="meaning">${esc(v.Significado)}</div><p class="muted">${esc(fields.join(' · '))}</p><div class="verb-training"><h3>Entrenador de conjugaciones</h3><p class="muted">Elige una forma, intenta decirla y después revela la respuesta.</p><label for="verbStudyForm">¿Qué forma quieres practicar?</label><select id="verbStudyForm">${Object.entries(VERB_FORM_LABELS).map(([key,label])=>`<option value="${esc(key)}" ${verbStudyForm===key?'selected':''}>${esc(label)}</option>`).join('')}</select><div class="verb-training-answer" aria-live="polite">${verbFormRevealed?`<span class="verb-training-result">${esc(answer)}</span>`:`<span class="muted">¿Cómo se conjuga ${esc(v.Verbo)}?</span>`}</div><div class="row">${btn(verbFormRevealed?'Ocultar respuesta':'Revelar conjugación','verbReveal','primary')}${btn('Siguiente forma','verbNextForm')}</div><div class="verb-group-check"><p><b>Comprueba el grupo:</b> ¿recuerdas a qué grupo pertenece?</p>${verbGroupRevealed?`<p class="verb-training-result">${esc(verbGroupName(v))}</p>`:''}${btn(verbGroupRevealed?'Ocultar grupo':'Revelar grupo','verbRevealGroup')}</div></div><details class="verb-forms-reference"><summary>Consultar todas las conjugaciones</summary><div class="verb-forms">${['ます','て','ない','た','可能形'].map(k=>`<div class="verb-form"><b>${esc(k==='た'?'Pasado た':k==='可能形'?'Potencial':`Forma ${k}`)}</b><span>${esc(v[k]||'—')}</span></div>`).join('')}</div></details><p class="muted">Las ilustraciones y los datos originales permanecen sin cambios. Este entrenador no altera tu progreso.</p></article>`}
function updateVerbTraining(){const node=document.getElementById('verb-detail');if(!node)return;const v=data.verbs.find(x=>x.ID===verbSelectedId);if(!v)return;const holder=document.createElement('div');holder.innerHTML=verbDetailCard(v);const newNode=holder.firstElementChild;node.replaceWith(newNode)}
function verbTrainingAction(action){if(!verbSelectedId)return;if(action==='verbReveal')verbFormRevealed=!verbFormRevealed;else if(action==='verbRevealGroup')verbGroupRevealed=!verbGroupRevealed;else if(action==='verbNextForm'){const forms=Object.keys(VERB_FORM_LABELS);verbStudyForm=forms[(forms.indexOf(verbStudyForm)+1)%forms.length];verbFormRevealed=false;}updateVerbTraining()}
function openVerb(id){if(!data.verbs.some(v=>v.ID===id))return;verbSelectedId=verbSelectedId===id?null:id;verbFormRevealed=false;verbGroupRevealed=false;verbStudyForm='ます';el(verbLibrary());if(verbSelectedId){const node=$('verb-detail');if(node)node.scrollIntoView({block:'start',behavior:'smooth'})}}
