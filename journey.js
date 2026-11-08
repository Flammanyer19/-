'use strict';
function flightVisual(){
 const stats=kanaFlightStats(),progress=Math.max(0,Math.min(100,stats.progress)),t=progress/100;
 const shown=progress.toLocaleString('es-MX',{maximumFractionDigits:1});
 // El avión sigue exactamente la curva cuadrática dibujada en el SVG.
 const x=(1-t)*(1-t)*25+2*(1-t)*t*165+t*t*306;
 const y=(1-t)*(1-t)*99+2*(1-t)*t*(-10)+t*t*78;
 const thresholds=[25,50,75,100];
 if(!state.flightMilestones||typeof state.flightMilestones!=='object')state.flightMilestones={};
 const newly=thresholds.filter(n=>progress>=n&&!state.flightMilestones[n]);
 if(newly.length){newly.forEach(n=>state.flightMilestones[n]=true);save()}
 const latest=newly.length?newly[newly.length-1]:0;
 const announcement=latest===100?'¡Llegaste a Japón! Has dominado todos los kana del viaje.':latest?`¡Alcanzaste el ${latest}% del viaje! Sigue adelante.`:'';
 const stops=thresholds.map(n=>`<span class="flight-milestone ${progress>=n?'reached':''}" aria-label="Hito ${n}% ${progress>=n?'alcanzado':'pendiente'}">${n}%</span>`).join('');
 return `<div class="flight-panel"><div class="eyebrow">CAMINO A JAPÓN · VUELO DE APRENDIZAJE</div>
 <svg viewBox="0 0 330 130" role="img" aria-label="Avión rumbo a Japón, avance real ${shown}%">
 <path d="M 25 99 Q 165 -10 306 78" fill="none" stroke="#7a99b5" stroke-width="2" stroke-dasharray="6 7"/>
 <circle cx="25" cy="99" r="5" fill="#edca88"/><circle cx="306" cy="78" r="6" fill="#edca88"/>
 <g class="flight-plane" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})" aria-hidden="true">
 <path d="M 23 0 L 8 -4 L -3 -20 Q -5 -23 -9 -22 L -10 -20 L -5 -3 L -21 -3 L -27 -10 L -30 -10 L -27 0 L -30 10 L -27 10 L -21 3 L -5 3 L -10 20 L -9 22 Q -5 23 -3 20 L 8 4 Z" fill="#f3d48c" stroke="#a97d3f" stroke-width="1.4" stroke-linejoin="round"/>
 <path d="M 12 0 L 21 0" stroke="#fff4ce" stroke-width="1.8" stroke-linecap="round"/>
 </g><text x="16" y="119" fill="#dce7f2" font-size="11">Inicio</text><text x="275" y="103" fill="#dce7f2" font-size="12">日本</text></svg>
 <div class="flight-progress-track" role="progressbar" aria-label="Avance del viaje" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div class="flight-progress-fill" style="width:${progress}%"></div></div>
 <div class="flight-milestones">${stops}</div>
 <div class="row space"><small>Tu avance de escritura</small><strong>${shown}%</strong></div>
 <p class="muted">${stats.done} de ${stats.total} caracteres dominados · 50 aciertos por carácter y 30 por combinación.</p>
 ${announcement?`<div class="flight-celebration" role="status">${latest===100?'🎌':'✦'} ${announcement}</div>`:''}
 ${progress===100?'<div class="flight-arrival">✈️ ¡Viaje completado! Bienvenido a Japón 🇯🇵</div>':''}</div>`
}
function home(){const count=state.sessions.length,avg=count?Math.round(state.sessions.reduce((a,b)=>a+b.pct,0)/count):0;return `<div class="eyebrow">TU AVENTURA · 日本語のリト</div><h1>Bienvenido, ${esc(state.name||'viajero')}</h1><p class="muted">Tres etapas para aprender a tu ritmo. Puedes recorrerlas en cualquier orden.</p><div class="hero"><div class="eyebrow">PASAPORTE DE APRENDIZAJE</div><h2>${esc(state.name||'Tu pasaporte')}</h2><p>${count} prácticas · ${avg}% de aciertos promedio</p><div class="row">${btn('Abrir pasaporte','passport','primary')}${btn('Respaldar datos','backup')}</div></div><h2>Etapas del viaje</h2>${flightVisual()}<div class="stack"><button class="journey journey-air" data-tab="alph"><span class="eyebrow">ETAPA 01 · ✈</span><strong>Camino a Japón</strong><span>Hiragana, katakana y los sonidos del idioma</span><small>Recomendado para empezar</small></button><button class="journey journey-city" data-tab="vocab"><span class="eyebrow">ETAPA 02 · ◇</span><strong>Conociendo el japonés</strong><span>Palabras, adjetivos y vocabulario cotidiano</span></button><button class="journey journey-talk" data-tab="grammar"><span class="eyebrow">ETAPA 03 · 文</span><strong>Hablando con Japón</strong><span>Partículas, conjugaciones y 25 lecciones</span></button></div><h2>Explora también</h2><button class="tile" data-tab="culture"><strong>🗾 Descubriendo Japón</strong>Geografía, trenes, cultura y tradiciones · sin requisitos previos</button>`}
