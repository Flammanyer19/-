'use strict';
// 8.3.4.1: short, original PCM effects. HTMLAudioElement is preferred on iOS
// (where Web Audio may be muted by the hardware silent switch).
let ritoAudioContext=null;
const ritoAudioFiles={};
function ritoWavDataUri(correct){
 const key=correct?'ok':'no';if(ritoAudioFiles[key])return ritoAudioFiles[key];
 const rate=22050,duration=correct?.29:.39,n=Math.ceil(rate*duration),pcm=new Int16Array(n);
 for(let i=0;i<n;i++){
  const t=i/rate;let v=0;
  if(correct){
   const env=Math.min(1,t/.009)*Math.exp(-t*13);
   v=(Math.sin(2*Math.PI*1046.5*t)*.65+Math.sin(2*Math.PI*1568*t)*.3)*env;
  }else{
   const pulse=t<.155?t:(t-.18),active=t<.155||(t>=.18&&t<.355);
   if(active){const f=t<.155?330:247;const env=Math.min(1,pulse/.008)*Math.exp(-pulse*17);v=(2/Math.PI)*Math.asin(Math.sin(2*Math.PI*f*pulse))*env*.9;}
  }
  pcm[i]=Math.round(Math.max(-1,Math.min(1,v)) * 24500);
 }
 const bytes=new Uint8Array(44+n*2),dv=new DataView(bytes.buffer);
 const word=(offset,value)=>dv.setUint32(offset,value,true),half=(offset,value)=>dv.setUint16(offset,value,true);
 for(const [offset,str] of [[0,'RIFF'],[8,'WAVE'],[12,'fmt '],[36,'data']])for(let i=0;i<4;i++)bytes[offset+i]=str.charCodeAt(i);
 word(4,36+n*2);word(16,16);half(20,1);half(22,1);word(24,rate);word(28,rate*2);half(32,2);half(34,16);word(40,n*2);
 for(let i=0;i<n;i++)dv.setInt16(44+i*2,pcm[i],true);
 let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return ritoAudioFiles[key]='data:audio/wav;base64,'+btoa(binary);
}
function ritoAudioMessage(message){
 const target=document.getElementById('audioStatus');if(target)target.textContent=message;
}
async function playFeedbackSound(correct){
 if(state.soundEnabled===false||Number(state.soundVolume)===0){ritoAudioMessage('Los sonidos están desactivados o el volumen está en cero.');return;}
 const volume=Math.max(0,Math.min(1,Number(state.soundVolume??35)/100));
 // Call play() immediately inside the user's click/touch gesture.
 try{
  const audio=new Audio(ritoWavDataUri(correct));audio.volume=volume;
  const playing=audio.play();
  if(playing&&typeof playing.then==='function')await playing;
  ritoAudioMessage('Sonido enviado. Si no se escucha, comprueba el volumen multimedia del iPhone.');
  return;
 }catch(error){console.warn('Reproducción de audio HTML no disponible; probando Web Audio',error);}
 try{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)throw Error('Este navegador no admite audio');
  if(!ritoAudioContext||ritoAudioContext.state==='closed')ritoAudioContext=new AudioCtx();
  if(ritoAudioContext.state==='suspended')await ritoAudioContext.resume();
  if(ritoAudioContext.state!=='running')throw Error('Safari no ha habilitado el audio');
  const now=ritoAudioContext.currentTime+.02;
  const note=(freq,start,duration,shape='sine')=>{
   const o=ritoAudioContext.createOscillator(),g=ritoAudioContext.createGain();o.type=shape;
   o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);
   g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume*.35),start+.012);
   g.gain.exponentialRampToValueAtTime(.0001,start+duration);
   o.connect(g);g.connect(ritoAudioContext.destination);o.start(start);o.stop(start+duration+.02);
  };
  if(correct){note(1046.5,now,.16);note(1568,now+.055,.20)}
  else{note(330,now,.12,'triangle');note(247,now+.18,.17,'triangle')}
  ritoAudioMessage('Efecto reproducido mediante Web Audio.');
 }catch(error){console.warn('No se pudo reproducir audio',error);ritoAudioMessage('No se pudo iniciar el audio. Prueba tocando de nuevo o abre la aplicación desde Safari.');}
}
