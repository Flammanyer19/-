'use strict';
function alph(){
 const counts=k=>data.kana.filter(x=>x.Tipo===k).length;
 const choices=[['Hiragana','ひらがな','あ','あいうえお','kana-hiragana',counts('Hiragana')+' signos y combinaciones','Escritura cotidiana y terminaciones gramaticales'],['Katakana','カタカナ','ア','アイウエオ','kana-katakana',counts('Katakana')+' signos y combinaciones','Préstamos lingüísticos y nombres extranjeros'],['Kanji','漢字','山','山 水 日 木','kana-kanji',data.kanji.length+' kanji con lecturas y ejemplos','Caracteres con significado']];
 return header('Abecedarios · 文字','Tres sistemas de escritura que se complementan.')+`<section class="writing-intro"><details><summary>¿Cuál es la diferencia entre hiragana, katakana y kanji?</summary><div class="writing-intro-content"><p>En japonés se combinan <b>tres sistemas de escritura</b>. Hiragana y katakana son <b>silabarios</b> (más precisamente, escrituras de moras); los kanji son caracteres que suelen aportar significado.</p><div class="writing-note"><strong>ひらがな · Hiragana</strong><p>Se usa para palabras japonesas, partículas y terminaciones gramaticales. Surgió de formas cursivas de caracteres chinos y se consolidó durante el período Heian (794–1185).</p></div><div class="writing-note"><strong>カタカナ · Katakana</strong><p>Se usa especialmente para palabras de origen extranjero, nombres extranjeros, onomatopeyas y énfasis. Se desarrolló a partir de fragmentos de caracteres chinos utilizados como anotaciones fonéticas.</p></div><div class="writing-note"><strong>漢字 · Kanji</strong><p>Son caracteres de origen chino incorporados al japonés; aparecen con frecuencia en sustantivos, raíces de verbos y adjetivos. Un mismo kanji puede tener varias lecturas según la palabra.</p></div><p><b>Ejemplo:</b> 私はコーヒーを飲みます。 Aquí 私 y 飲 son kanji; は, を y みます son hiragana; コーヒー está escrito en katakana.</p><p class="muted">«Tres abecedarios» es una manera práctica de nombrarlos, aunque técnicamente no son tres alfabetos.</p></div></details></section><div class="kana-choice-grid">${choices.map(([k,j,glyph,examples,klass,count,desc])=>`<button class="kana-choice ${klass}" data-kind="${k}"><span class="kana-choice-heading">${esc(j)} <span>· ${esc(k)}</span></span><span class="kana-choice-visual" aria-hidden="true"><span class="kana-choice-glyph">${esc(glyph)}</span><span class="kana-choice-examples">${esc(examples)}</span></span><strong>${esc(desc)}</strong><small>${esc(count)}</small><span class="kana-choice-link">Explorar →</span></button>`).join('')}</div>`
}
// Clasificación pedagógica sin modificar los datos originales ni su orden.
const KANA_TYPES=['Todos','Vocales','Sílabas básicas','Sonidos modificados','Combinaciones','Nasal independiente','Tsu pequeña','Sonidos extranjeros','Vocal larga'];
const KANA_ROWS=['Todas','Vocales','K','S','T','N','H','M','Y','R','W','Especiales'];
const KANA_BASE_ROWS={
 'あ':'Vocales','い':'Vocales','う':'Vocales','え':'Vocales','お':'Vocales',
 'か':'K','き':'K','く':'K','け':'K','こ':'K',
 'さ':'S','し':'S','す':'S','せ':'S','そ':'S',
 'た':'T','ち':'T','つ':'T','て':'T','と':'T',
 'な':'N','に':'N','ぬ':'N','ね':'N','の':'N',
 'は':'H','ひ':'H','ふ':'H','へ':'H','ほ':'H',
 'ま':'M','み':'M','む':'M','め':'M','も':'M',
 'や':'Y','ゆ':'Y','よ':'Y',
 'ら':'R','り':'R','る':'R','れ':'R','ろ':'R',
 'わ':'W','を':'W',
 'が':'K','ぎ':'K','ぐ':'K','げ':'K','ご':'K',
 'ざ':'S','じ':'S','ず':'S','ぜ':'S','ぞ':'S',
 'だ':'T','ぢ':'T','づ':'T','で':'T','ど':'T',
 'ば':'H','び':'H','ぶ':'H','べ':'H','ぼ':'H',
 'ぱ':'H','ぴ':'H','ぷ':'H','ぺ':'H','ぽ':'H',
 'ゔ':'Especiales'
};
function kanaToHiragana(ch){return Array.from(ch).map(c=>{const n=c.charCodeAt(0);return n>=0x30A1&&n<=0x30F6?String.fromCharCode(n-0x60):c}).join('')}
function kanaTypeOf(item){
 const ch=kanaToHiragana(item.Caracter),group=item.Grupo||'';
 if(ch==='ん')return 'Nasal independiente';
 if(ch==='っ')return 'Tsu pequeña';
 if(ch==='ー')return 'Vocal larga';
 if(group==='Sonidos extranjeros')return 'Sonidos extranjeros';
 if(group.startsWith('Combinaciones'))return 'Combinaciones';
 if(group==='Sonoros y semisonoros')return 'Sonidos modificados';
 if('あいうえお'.includes(ch)&&ch.length===1)return 'Vocales';
 return 'Sílabas básicas';
}
function kanaRowOf(item){
 const ch=kanaToHiragana(item.Caracter);
 if(['ん','っ','ー'].includes(ch))return 'Especiales';
 // Las combinaciones pertenecen a la fila de su primer signo (ぎゃ -> K, しゃ -> S).
 // Los préstamos con フ, テ, ヴ, etc. conservan la fila de su base gráfica.
 return KANA_BASE_ROWS[ch[0]]||'Especiales';
}
function filteredKana(){return data.kana.filter(x=>x.Tipo===section&&(kanaGroup==='Todos'||kanaTypeOf(x)===kanaGroup)&&(kanaRow==='Todas'||kanaRowOf(x)===kanaRow))}
function kanaMenu(){
 const all=data.kana.filter(x=>x.Tipo===section),visible=filteredKana();
 const types=KANA_TYPES.filter(t=>t==='Todos'||all.some(x=>kanaTypeOf(x)===t));
 const rows=KANA_ROWS.filter(r=>r==='Todas'||all.some(x=>kanaRowOf(x)===r));
 const options=(values,chosen)=>values.map(v=>`<option value="${esc(v)}" ${v===chosen?'selected':''}>${esc(v)}</option>`).join('');
 const cards=visible.map(x=>`<div class="kana-filter-tile"><strong>${esc(x.Caracter)}</strong><span>${esc(x.Romaji)}</span></div>`).join('');
 return header(`${esc(section)} · sonidos y combinaciones`,'Filtra por tipo y fila, o estudia todos en el orden original.')+
 `<div class="kana-menu-banner ${section==='Hiragana'?'kana-hiragana':'kana-katakana'}"><span class="kana-menu-glyph">${section==='Hiragana'?'あ':'ア'}</span><div><strong>${section==='Hiragana'?'ひらがな':'カタカナ'}</strong><p>${section==='Hiragana'?'Sonidos de la escritura japonesa cotidiana':'Sonidos usados en préstamos y nombres extranjeros'}</p></div></div>`+
 `<div class="panel"><div class="kana-filter-controls"><label>Tipo de sonido<select id="kanaGroup">${options(types,kanaGroup)}</select></label><label>Fila<select id="kanaRow">${options(rows,kanaRow)}</select></label></div><div class="kana-filter-status"><span>${visible.length} de ${all.length} entradas</span><button type="button" data-action="kanaReset" class="secondary">Limpiar filtros</button></div><p class="muted">Los filtros se combinan. La fila se refiere al signo base: が pertenece a K y しゃ a S.</p><div class="row">${visible.length?btn('📖 Estudiar','study','primary')+btn('✍️ Practicar 20','quiz'):'<p class="muted">No hay caracteres con esta combinación de filtros.</p>'}${btn('Volver','back')}</div></div>`+
 `<section class="kana-filter-results" aria-label="Caracteres filtrados">${cards||'<p class="muted">Prueba otra combinación o limpia los filtros.</p>'}</section>`+
 `<article class="panel"><h3>La っ / ッ pequeña: oclusión (促音 · sokuon)</h3><p>No se pronuncia «tsu». Indica una breve pausa antes de la consonante siguiente, que suele representarse duplicada en rōmaji.</p><div class="jp">がっこう · カップ</div><div class="reading">gakkō (escuela) · kappu (taza)</div><p>Compárala con la つ / ツ grande, que sí se pronuncia «tsu»: つき (tsuki, luna).</p><p>Las combinaciones como きょ (kyo) usan ょ pequeña; no equivalen a きよ (kiyo).</p></article>`;
}
