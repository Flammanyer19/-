'use strict';
let ritoAudioContext=null;
function playFeedbackSound(correct){
 if(state.soundEnabled===false||Number(state.soundVolume)===0)return;
 try{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
  if(!ritoAudioContext)ritoAudioContext=new AudioCtx();
  if(ritoAudioContext.state==='suspended')ritoAudioContext.resume().catch(()=>{});
  const now=ritoAudioContext.currentTime+.012,vol=Math.max(0,Math.min(1,Number(state.soundVolume??35)/100));
  const note=(freq,start,duration,shape='sine')=>{const o=ritoAudioContext.createOscillator(),g=ritoAudioContext.createGain();o.type=shape;o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol*.14),start+.012);g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(ritoAudioContext.destination);o.start(start);o.stop(start+duration+.02)};
  if(correct){note(1046.5,now,.16);note(1568,now+.055,.20)}else{note(330,now,.12,'triangle');note(247,now+.16,.17,'triangle')}
 }catch(e){console.warn('Audio no disponible',e)}
}
