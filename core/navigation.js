'use strict';
function stopAuto(){if(autoTimer!==null){clearTimeout(autoTimer);autoTimer=null}}
function scheduleAuto(action){stopAuto();if(state.autoAdvance===false)return;autoTimer=setTimeout(()=>{autoTimer=null;if(action==='advance'&&quiz&&quiz.selected!==null)advance();else if(action==='lessonAdvance'&&quiz&&quiz.selected!==null)lessonAdvance();else if(action==='particleAdvance'&&particleQuiz&&particleQuiz.checked)particleAdvance()},3000)}
function go(t){stopAuto();lessonMode=false;tab=t;if(t==='vocab')section='vocab';quiz=null;studyPage=0;filter='';render()}
function back(){stopAuto();if(section==='vocab')go('vocab');else if(['Hiragana','Katakana','Kanji'].includes(section))go('alph');else go('grammar')}
function render(){stopAuto();document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));$('profileBadge').textContent=state.name||'Estudiante';el(tab==='home'?home():tab==='vocab'?vocab():tab==='alph'?alph():tab==='grammar'?grammar():tab==='culture'?culture():stats())}
