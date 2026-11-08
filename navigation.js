'use strict';
function stopAuto(){if(autoTimer!==null){clearTimeout(autoTimer);autoTimer=null}}
function scheduleAuto(action){stopAuto();if(state.autoAdvance===false)return;autoTimer=setTimeout(()=>{autoTimer=null;if(action==='advance'&&quiz&&quiz.selected!==null)advance();else if(action==='lessonAdvance'&&quiz&&quiz.selected!==null)lessonAdvance();else if(action==='particleAdvance'&&particleQuiz&&particleQuiz.checked)particleAdvance()},3000)}
function go(t){if(practiceActive())return;historyReturnHTML=null;stopAuto();lessonMode=false;tab=t;if(t==='vocab')section='vocab';quiz=null;studyPage=0;filter='';render()}
function openHistory(){if(practiceActive())return;const previous=$('screen').innerHTML;go('stats');historyReturnHTML=previous}
function returnFromHistory(){stopAuto();if(historyReturnHTML){const previous=historyReturnHTML;historyReturnHTML=null;el(previous)}else go('grammar')}
function back(){stopAuto();if(section==='vocab')go('vocab');else if(['Hiragana','Katakana','Kanji'].includes(section))go('alph');else go('grammar')}
function render(){stopAuto();document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));$('profileBadge').textContent=state.name||'Estudiante';el(tab==='home'?home():tab==='vocab'?vocab():tab==='alph'?alph():tab==='grammar'?grammar():tab==='culture'?culture():stats())}

// 8.2.1: navegación protegida durante las prácticas.
const PRACTICE_LENGTHS=Object.freeze({'Partículas':5,'Hiragana':20,'Katakana':20,'Kanji':20});
function practiceLength(kind){return PRACTICE_LENGTHS[kind]||20}
function practiceActive(){return Boolean(quiz||particleQuiz)}
function syncPracticeNavigation(){const n=$('nav');if(n)n.hidden=practiceActive();document.body.classList.toggle('practice-active',practiceActive())}
function practiceExitControl(){return '<div class="practice-exit">'+btn('Finalizar lección','exitPractice')+'<p class="muted">Para salir se requiere confirmación.</p></div>'}
function exitPractice(){if(!practiceActive())return;stopAuto();if(!confirm('¿Finalizar y salir de esta lección? El progreso de esta práctica incompleta no se registrará como resultado final.'))return;quiz=null;particleQuiz=null;lessonMode=false;syncPracticeNavigation();if(tab==='grammar')el(grammar());else if(tab==='alph')el(alph());else render()}
