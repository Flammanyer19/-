'use strict';
// Historial interno: integra la navegación de la SPA con el gesto Atrás de Safari.
// No guarda progreso de aprendizaje en el historial; los aciertos siguen en localStorage.
let ritoHistoryReady=false, ritoHistoryRestoring=false, ritoHistorySerial=0;
const RITO_HISTORY_ACTIONS=new Set(['passport','avatars','profileSettings','particleLibrary','particleFaq','particleExamples','kanjiList','kanjiHome','lessonList','lessonNext','lessonDetail','lessonQuiz','backup','settings','settingsHome','culture','study','adjStudy','verbStudy','quiz','verbQuiz','back','grammar','stats','historyBack','kanaMenuReturn']);
function ritoSnapshot(){return {tab,section,topic,kind,kanaGroup,kanaRow,studyPage,filter,activeLesson,lessonMode,html:$('screen').innerHTML};}
function ritoRestore(snapshot){
 if(!snapshot||typeof snapshot.html!=='string'){render();return;}
 stopAuto();quiz=null;particleQuiz=null;historyReturnHTML=null;
 tab=snapshot.tab;section=snapshot.section;topic=snapshot.topic;kind=snapshot.kind;
 kanaGroup=snapshot.kanaGroup;kanaRow=snapshot.kanaRow;studyPage=snapshot.studyPage;
 filter=snapshot.filter;activeLesson=snapshot.activeLesson;lessonMode=false;
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));
 $('profileBadge').textContent=state.name||'Estudiante';el(snapshot.html);
}
function ritoInitHistory(){
 if(ritoHistoryReady)return;
 ritoHistoryReady=true;
 history.replaceState({rito:true,id:++ritoHistorySerial,snapshot:ritoSnapshot()},'',location.href);
}
document.addEventListener('click',event=>{
 if(!ritoHistoryReady||ritoHistoryRestoring)return;
 const b=event.target.closest('button');if(!b)return;
 const action=b.dataset.action;
 const isNav=Boolean(b.dataset.tab||b.dataset.kind||b.dataset.kanji||b.dataset.avatar||b.dataset.culture||b.dataset.lesson||b.dataset.particleId||b.dataset.particleExamples||b.dataset.grammar||RITO_HISTORY_ACTIONS.has(action));
 if(!isNav||practiceActive()&&!['quiz','verbQuiz','lessonQuiz'].includes(action))return;
 const before=ritoSnapshot();
 history.replaceState({rito:true,id:history.state?.id||++ritoHistorySerial,snapshot:before},'',location.href);
 queueMicrotask(()=>{
  if(ritoHistoryRestoring)return;
  const after=ritoSnapshot();
  if(after.html===before.html&&after.tab===before.tab&&after.section===before.section)return;
  history.pushState({rito:true,id:++ritoHistorySerial,snapshot:after},'',location.href);
 });
},true);
window.addEventListener('popstate',event=>{
 if(!ritoHistoryReady)return;
 if(practiceActive()){
  stopAuto();
  if(!confirm('¿Finalizar y salir de esta lección? El resultado de esta práctica incompleta no se registrará.')){
   history.forward();return;
  }
  quiz=null;particleQuiz=null;lessonMode=false;
 }
 ritoHistoryRestoring=true;
 try{
  if(event.state?.rito&&event.state.snapshot)ritoRestore(event.state.snapshot);
  else {render();history.replaceState({rito:true,id:++ritoHistorySerial,snapshot:ritoSnapshot()},'',location.href);}
 }finally{ritoHistoryRestoring=false;}
});
