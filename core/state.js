'use strict';
const $=x=>document.getElementById(x),KEY='rito_v5',OLD='nq_hybrid_progress_v4';let data,tab='home',section='vocab',topic='Todos',kind='Hiragana',kanaGroup='Todos',kanaRow='Todas',studyPage=0,quiz=null,filter='';let state={name:'',sessions:[],legacy:{},particleMastery:{}};let historyReturnHTML=null;let activeLesson=1,lessonMode=false,autoTimer=null,particleBank=[],particleQuiz=null,profileEdit=false;
try{state={...state,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{};
try{if(!Object.keys(state.legacy||{}).length)state.legacy=JSON.parse(localStorage.getItem(OLD)||'{}')}catch{};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const save=()=>localStorage.setItem(KEY,JSON.stringify(state));const shuffle=a=>[...a].sort(()=>Math.random()-.5);const el=html=>{$('screen').innerHTML=html;syncPracticeNavigation()};const btn=(label,fn,cls='secondary')=>`<button class="${cls}" data-action="${fn}">${label}</button>`;
const jp=x=>x['Japonés'],read=x=>x['Lectura (hiragana)'],mean=x=>x['Español'];
const AVATARS=[['fox','🦊','Zorro'],['tanuki','🦝','Tanuki'],['cat','🐈','Gato'],['rabbit','🐇','Conejo'],['crane','🦢','Grulla'],['bear','🐻','Oso']];
let cultureData=[],cultureFilter='Todos';
